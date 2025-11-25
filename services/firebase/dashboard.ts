import { MealPlan } from '@/types';
import {
    collection,
    getDocs,
    orderBy,
    query,
    Timestamp,
    where
} from 'firebase/firestore';
import { db } from './config';

// ============================================================================
// DASHBOARD ANALYTICS
// ============================================================================

export interface DashboardStats {
    mealsCompleted: number;
    avgDailyCalories: number;
    currentStreak: number;
    topCuisine: string;
    macroDistribution: {
        protein: number;
        carbs: number;
        fat: number;
    };
    calorieTrend: Array<{
        date: string;
        calories: number;
    }>;
    mealCompletionRate: Array<{
        date: string;
        completed: number;
        total: number;
    }>;
}

/**
 * Convert Firestore Timestamp to ISO date string (YYYY-MM-DD)
 */
function timestampToDateString(timestamp: Timestamp): string {
    return timestamp.toDate().toISOString().split('T')[0];
}

/**
 * Get comprehensive dashboard statistics for a user
 */
export async function getDashboardStats(
    userId: string,
    dateRange: 7 | 14 | 30 = 7
): Promise<DashboardStats> {
    try {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - dateRange);

        // Fetch all meal plans within date range
        const plansRef = collection(db, `mealPlans/${userId}/plans`);
        const q = query(
            plansRef,
            where('createdAt', '>=', Timestamp.fromDate(startDate)),
            orderBy('createdAt', 'desc')
        );

        const snapshot = await getDocs(q);
        const plans: MealPlan[] = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as MealPlan));

        // Calculate all stats
        const mealsCompleted = getMealsCompleted(plans);
        const avgDailyCalories = getAverageDailyCalories(plans, dateRange);
        const currentStreak = await getCurrentStreak(userId);
        const topCuisine = getTopCuisine(plans);
        const macroDistribution = getMacroDistribution(plans);
        const calorieTrend = getCalorieTrend(plans, dateRange);
        const mealCompletionRate = getMealCompletionRate(plans, dateRange);

        return {
            mealsCompleted,
            avgDailyCalories,
            currentStreak,
            topCuisine,
            macroDistribution,
            calorieTrend,
            mealCompletionRate
        };
    } catch (error) {
        console.error('Error getting dashboard stats:', error);
        throw new Error('Failed to load dashboard statistics');
    }
}

/**
 * Count completed meals from meal plans
 */
function getMealsCompleted(plans: MealPlan[]): number {
    let count = 0;
    for (const plan of plans) {
        for (const day of plan.days) {
            for (const meal of day.meals) {
                if (meal.isCompleted) {
                    count++;
                }
            }
        }
    }
    return count;
}

/**
 * Calculate average daily calories
 */
function getAverageDailyCalories(plans: MealPlan[], dateRange: number): number {
    if (plans.length === 0) return 0;

    let totalCalories = 0;
    let daysWithMeals = 0;

    // Group by date and sum calories
    const caloriesByDate = new Map<string, number>();

    for (const plan of plans) {
        for (const day of plan.days) {
            const dateKey = timestampToDateString(day.date);
            let dayCalories = 0;

            for (const meal of day.meals) {
                if (meal.isCompleted) {
                    dayCalories += meal.calories;
                }
            }

            if (dayCalories > 0) {
                caloriesByDate.set(dateKey, (caloriesByDate.get(dateKey) || 0) + dayCalories);
            }
        }
    }

    totalCalories = Array.from(caloriesByDate.values()).reduce((sum, cal) => sum + cal, 0);
    daysWithMeals = caloriesByDate.size;

    return daysWithMeals > 0 ? Math.round(totalCalories / daysWithMeals) : 0;
}

/**
 * Calculate current streak of consecutive days with completed meals
 */
async function getCurrentStreak(userId: string): Promise<number> {
    try {
        const plansRef = collection(db, `mealPlans/${userId}/plans`);
        const q = query(plansRef, orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);

        if (snapshot.empty) return 0;

        const plans: MealPlan[] = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as MealPlan));

        // Get all dates with at least one completed meal
        const datesWithCompletedMeals = new Set<string>();

        for (const plan of plans) {
            for (const day of plan.days) {
                const hasCompletedMeal = day.meals.some(meal => meal.isCompleted);
                if (hasCompletedMeal) {
                    datesWithCompletedMeals.add(timestampToDateString(day.date));
                }
            }
        }

        // Sort dates in descending order
        const sortedDates = Array.from(datesWithCompletedMeals).sort((a, b) =>
            new Date(b).getTime() - new Date(a).getTime()
        );

        if (sortedDates.length === 0) return 0;

        // Calculate streak from today backwards
        let streak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 0; i < 365; i++) { // Max 365 day streak
            const checkDate = new Date(today);
            checkDate.setDate(checkDate.getDate() - i);
            const dateStr = checkDate.toISOString().split('T')[0];

            if (datesWithCompletedMeals.has(dateStr)) {
                streak++;
            } else if (i > 0) {
                // Break streak if we miss a day (but allow today to not have completed meals yet)
                break;
            }
        }

        return streak;
    } catch (error) {
        console.error('Error calculating streak:', error);
        return 0;
    }
}

/**
 * Find the most frequently used cuisine
 */
function getTopCuisine(plans: MealPlan[]): string {
    if (plans.length === 0) return 'None';

    const cuisineCounts = new Map<string, number>();

    for (const plan of plans) {
        // Count from selected cuisines in plan
        if (plan.selectedCuisines && plan.selectedCuisines.length > 0) {
            for (const cuisine of plan.selectedCuisines) {
                cuisineCounts.set(cuisine, (cuisineCounts.get(cuisine) || 0) + 1);
            }
        }

        // Also count from actual meals used
        for (const day of plan.days) {
            for (const meal of day.meals) {
                if (meal.cuisine) {
                    cuisineCounts.set(meal.cuisine, (cuisineCounts.get(meal.cuisine) || 0) + 1);
                }
            }
        }
    }

    if (cuisineCounts.size === 0) return 'None';

    // Find cuisine with highest count
    let topCuisine = 'None';
    let maxCount = 0;

    for (const [cuisine, count] of cuisineCounts.entries()) {
        if (count > maxCount) {
            maxCount = count;
            topCuisine = cuisine;
        }
    }

    return topCuisine;
}

/**
 * Get macro distribution (protein, carbs, fat percentages)
 */
function getMacroDistribution(plans: MealPlan[]): {
    protein: number;
    carbs: number;
    fat: number;
} {
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    for (const plan of plans) {
        for (const day of plan.days) {
            for (const meal of day.meals) {
                if (meal.isCompleted) {
                    totalProtein += meal.protein;
                    totalCarbs += meal.carbs;
                    totalFat += meal.fat;
                }
            }
        }
    }

    const total = totalProtein + totalCarbs + totalFat;

    if (total === 0) {
        return { protein: 0, carbs: 0, fat: 0 };
    }

    return {
        protein: Math.round((totalProtein / total) * 100),
        carbs: Math.round((totalCarbs / total) * 100),
        fat: Math.round((totalFat / total) * 100)
    };
}

/**
 * Get daily calorie trend data for charts
 */
function getCalorieTrend(plans: MealPlan[], dateRange: number): Array<{
    date: string;
    calories: number;
}> {
    const caloriesByDate = new Map<string, number>();

    for (const plan of plans) {
        for (const day of plan.days) {
            let dayCalories = 0;
            const dateKey = timestampToDateString(day.date);

            for (const meal of day.meals) {
                if (meal.isCompleted) {
                    dayCalories += meal.calories;
                }
            }

            if (dayCalories > 0) {
                caloriesByDate.set(dateKey, (caloriesByDate.get(dateKey) || 0) + dayCalories);
            }
        }
    }

    // Create array with all dates in range, filling in zeros for missing dates
    const endDate = new Date();
    const result: Array<{ date: string; calories: number }> = [];

    for (let i = dateRange - 1; i >= 0; i--) {
        const date = new Date(endDate);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        result.push({
            date: dateStr,
            calories: caloriesByDate.get(dateStr) || 0
        });
    }

    return result;
}

/**
 * Get meal completion rate by day
 */
function getMealCompletionRate(plans: MealPlan[], dateRange: number): Array<{
    date: string;
    completed: number;
    total: number;
}> {
    const mealsByDate = new Map<string, { completed: number; total: number }>();

    for (const plan of plans) {
        for (const day of plan.days) {
            const dateKey = timestampToDateString(day.date);
            const stats = mealsByDate.get(dateKey) || { completed: 0, total: 0 };

            for (const meal of day.meals) {
                stats.total++;
                if (meal.isCompleted) {
                    stats.completed++;
                }
            }

            mealsByDate.set(dateKey, stats);
        }
    }

    // Create array with all dates in range
    const endDate = new Date();
    const result: Array<{ date: string; completed: number; total: number }> = [];

    for (let i = dateRange - 1; i >= 0; i--) {
        const date = new Date(endDate);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        const stats = mealsByDate.get(dateStr) || { completed: 0, total: 0 };
        result.push({
            date: dateStr,
            ...stats
        });
    }

    return result;
}
