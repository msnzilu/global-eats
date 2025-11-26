import {
    auth,
    deleteMealPlan,
    generateMealPlan,
    getAllMealPlans,
    setActiveMealPlan,
    subscribeToActiveMealPlan,
    updateMealStatus
} from '@/services/firebase';
import { MealPlan } from '@/types';
import { useEffect, useState } from 'react';

interface UseMealPlanReturn {
    activePlan: MealPlan | null;
    loading: boolean;
    error: string | null;
    generating: boolean;
    generatePlan: (duration: 7 | 30, cuisines: string[], includeCustom: boolean) => Promise<void>;
    markMealComplete: (dayIndex: number, mealIndex: number) => Promise<void>;
    deletePlan: (planId: string) => Promise<void>;
    refreshPlan: () => void;
    getAllPlans: () => Promise<MealPlan[]>;
    setActivePlan: (planId: string) => Promise<void>;
}

export function useMealPlan(): UseMealPlanReturn {
    const [activePlan, setActivePlanState] = useState<MealPlan | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [generating, setGenerating] = useState(false);

    const currentUser = auth.currentUser;

    useEffect(() => {
        if (!currentUser) {
            setLoading(false);
            setError('User not authenticated');
            return;
        }

        setLoading(true);
        setError(null);

        // Subscribe to active meal plan
        const unsubscribe = subscribeToActiveMealPlan(
            currentUser.uid,
            (plan) => {
                setActivePlanState(plan);
                setLoading(false);
            },
            (err) => {
                setError(err.message);
                setLoading(false);
            }
        );

        return unsubscribe;
    }, [currentUser?.uid]);

    const generatePlan = async (
        duration: 7 | 30,
        cuisines: string[],
        includeCustom: boolean
    ): Promise<void> => {
        if (!currentUser) {
            throw new Error('User not authenticated');
        }

        setGenerating(true);
        setError(null);

        try {
            await generateMealPlan(currentUser.uid, {
                duration,
                selectedCuisines: cuisines,
                includeCustomRecipes: includeCustom
            });
        } catch (err: any) {
            setError(err.message || 'Failed to generate meal plan');
            throw err;
        } finally {
            setGenerating(false);
        }
    };

    const markMealComplete = async (
        dayIndex: number,
        mealIndex: number
    ): Promise<void> => {
        if (!currentUser || !activePlan) {
            throw new Error('No active meal plan');
        }

        const meal = activePlan.days[dayIndex]?.meals[mealIndex];
        if (!meal) {
            throw new Error('Meal not found');
        }

        try {
            await updateMealStatus(
                currentUser.uid,
                activePlan.id,
                dayIndex,
                mealIndex,
                { isCompleted: !meal.isCompleted }
            );
        } catch (err: any) {
            throw new Error(err.message || 'Failed to update meal');
        }
    };

    const deletePlan = async (planId: string): Promise<void> => {
        if (!currentUser) {
            throw new Error('User not authenticated');
        }

        try {
            await deleteMealPlan(currentUser.uid, planId);
        } catch (err: any) {
            throw new Error(err.message || 'Failed to delete plan');
        }
    };

    const refreshPlan = () => {
        setLoading(true);
    };

    const getAllPlans = async (): Promise<MealPlan[]> => {
        if (!currentUser) {
            throw new Error('User not authenticated');
        }
        return await getAllMealPlans(currentUser.uid);
    };

    const setActivePlan = async (planId: string): Promise<void> => {
        if (!currentUser) {
            throw new Error('User not authenticated');
        }
        await setActiveMealPlan(currentUser.uid, planId);
    };

    return {
        activePlan,
        loading,
        error,
        generating,
        generatePlan,
        markMealComplete,
        deletePlan,
        refreshPlan,
        getAllPlans,
        setActivePlan,
    };
}
