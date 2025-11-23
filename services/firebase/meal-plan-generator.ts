import { InventoryItem, MealPlan, Recipe, ShoppingList } from '@/types';
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
    where,
} from 'firebase/firestore';
import { db } from './config';
import { createShoppingList } from './firestore';

// ============================================================================
// MEAL PLAN FUNCTIONS
// ============================================================================

/**
 * Helper: Score a recipe based on ingredient availability
 */
function scoreRecipeByIngredients(
    recipe: Recipe,
    inventory: InventoryItem[],
    shoppingList: ShoppingList | null
): number {
    if (!recipe.ingredients || recipe.ingredients.length === 0) return 0;

    const availableIngredients = new Set<string>();

    // Add inventory items (lowercase for matching)
    inventory.forEach(item => availableIngredients.add(item.name.toLowerCase()));

    // Add shopping list items
    if (shoppingList) {
        shoppingList.items.forEach(item => availableIngredients.add(item.name.toLowerCase()));
    }

    // Count how many ingredients are available
    let matchCount = 0;
    recipe.ingredients.forEach(ingredient => {
        const ingredientName = ingredient.name.toLowerCase();
        if (availableIngredients.has(ingredientName)) {
            matchCount++;
        }
    });

    // Return percentage of ingredients available (0-100)
    return (matchCount / recipe.ingredients.length) * 100;
}

/**
 * Helper: Score recipe based on nutrition balance for meal type
 */
function scoreRecipeByNutrition(
    recipe: Recipe,
    mealType: 'breakfast' | 'lunch' | 'dinner'
): number {
    const calories = recipe.nutrition.calories;

    // Define ideal calorie ranges for each meal type
    const ranges = {
        breakfast: { min: 300, max: 500, ideal: 400 },
        lunch: { min: 400, max: 600, ideal: 500 },
        dinner: { min: 500, max: 800, ideal: 650 }
    };

    const range = ranges[mealType];

    // Score based on how close to ideal
    if (calories >= range.min && calories <= range.max) {
        const distance = Math.abs(calories - range.ideal);
        const maxDistance = range.max - range.min;
        return 100 - (distance / maxDistance) * 50; // 50-100 score for in-range
    } else {
        // Penalize out-of-range recipes
        const distance = calories < range.min
            ? range.min - calories
            : calories - range.max;
        return Math.max(0, 50 - distance / 10); // 0-50 score for out-of-range
    }
}

/**
 * Helper: Select best recipe for a meal type
 */
function selectBestRecipe(
    availableRecipes: Recipe[],
    usedRecipeIds: Set<string>,
    mealType: 'breakfast' | 'lunch' | 'dinner',
    inventory: InventoryItem[],
    shoppingList: ShoppingList | null
): Recipe | null {
    // Filter out already used recipes
    const candidates = availableRecipes.filter(r => !usedRecipeIds.has(r.id));

    if (candidates.length === 0) return null;

    // Score each recipe
    const scoredRecipes = candidates.map(recipe => {
        const ingredientScore = scoreRecipeByIngredients(recipe, inventory, shoppingList);
        const nutritionScore = scoreRecipeByNutrition(recipe, mealType);

        // Weighted combination: 60% ingredient availability, 40% nutrition balance
        const totalScore = (ingredientScore * 0.6) + (nutritionScore * 0.4);

        return { recipe, score: totalScore };
    });

    // Sort by score descending
    scoredRecipes.sort((a, b) => b.score - a.score);

    // Return best recipe
    return scoredRecipes[0].recipe;
}

/**
 * Helper: Generate shopping list from meal plan
 */
async function generateShoppingListFromPlan(
    userId: string,
    plan: Omit<MealPlan, 'id' | 'createdAt'>,
    inventory: InventoryItem[]
): Promise<void> {
    // Collect all ingredients from all meals
    const ingredientMap = new Map<string, { quantity: number; unit: string; category: string }>();

    for (const day of plan.days) {
        for (const meal of day.meals) {
            // Fetch the recipe to get ingredients
            const recipeRef = doc(db, `recipes/${userId}/userRecipes/${meal.recipeId}`);
            const recipeSnap = await getDoc(recipeRef);

            if (recipeSnap.exists()) {
                const recipe = recipeSnap.data() as Recipe;
                if (recipe.ingredients) {
                    recipe.ingredients.forEach(ingredient => {
                        const key = ingredient.name.toLowerCase();
                        if (ingredientMap.has(key)) {
                            // Aggregate quantities (assuming same unit)
                            const existing = ingredientMap.get(key)!;
                            existing.quantity += ingredient.amount;
                        } else {
                            ingredientMap.set(key, {
                                quantity: ingredient.amount,
                                unit: ingredient.unit,
                                category: 'Other' as any // Ingredient doesn't have category, default to Other
                            });
                        }
                    });
                }
            }
        }
    }

    // Remove items already in inventory
    const inventorySet = new Set(inventory.map(item => item.name.toLowerCase()));
    for (const key of inventorySet) {
        ingredientMap.delete(key);
    }

    // Create shopping list items
    const shoppingItems = Array.from(ingredientMap.entries()).map(([name, data], index) => ({
        id: `item_${Date.now()}_${index}`,
        name: name.charAt(0).toUpperCase() + name.slice(1), // Capitalize
        quantity: data.quantity,
        unit: data.unit,
        category: data.category as any, // Type assertion for InventoryCategory
        isChecked: false,
        fromRecipes: [] // Could track which recipes need this
    }));

    if (shoppingItems.length > 0) {
        // Deactivate existing shopping lists
        const existingListsRef = collection(db, `shoppingLists/${userId}/lists`);
        const existingQuery = query(existingListsRef, where('isActive', '==', true));
        const existingSnap = await getDocs(existingQuery);

        for (const doc of existingSnap.docs) {
            await updateDoc(doc.ref, { isActive: false });
        }

        // Create new shopping list
        await createShoppingList(userId, {
            mealPlanId: 'pending', // Will be updated after plan is created
            items: shoppingItems,
            isActive: true
        });
    }
}

/**
 * Generate a new meal plan
 */
export async function generateMealPlan(
    userId: string,
    options: {
        duration: 7 | 30;
        selectedCuisines: string[];
        includeCustomRecipes: boolean;
    }
): Promise<string> {
    try {
        // 1. Fetch user inventory
        const inventoryRef = collection(db, `inventory/${userId}/items`);
        const inventorySnap = await getDocs(inventoryRef);
        const inventory: InventoryItem[] = inventorySnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as InventoryItem));

        // 2. Fetch existing shopping list
        const shoppingListsRef = collection(db, `shoppingLists/${userId}/lists`);
        const shoppingQuery = query(shoppingListsRef, where('isActive', '==', true));
        const shoppingSnap = await getDocs(shoppingQuery);
        const shoppingList = shoppingSnap.empty ? null : {
            id: shoppingSnap.docs[0].id,
            ...shoppingSnap.docs[0].data()
        } as ShoppingList;

        // 3. Fetch available recipes
        const customRecipesRef = collection(db, `recipes/${userId}/userRecipes`);
        const discoveredRecipesRef = collection(db, `recipes/${userId}/discoveredRecipes`);

        const [customSnap, discoveredSnap] = await Promise.all([
            getDocs(customRecipesRef),
            getDocs(discoveredRecipesRef)
        ]);

        let availableRecipes: Recipe[] = [];

        if (options.includeCustomRecipes) {
            availableRecipes.push(...customSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Recipe)));
        }

        availableRecipes.push(...discoveredSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Recipe)));

        // Filter by cuisines if specified
        if (options.selectedCuisines.length > 0) {
            availableRecipes = availableRecipes.filter(recipe =>
                options.selectedCuisines.includes(recipe.cuisine)
            );
        }

        if (availableRecipes.length < 3) {
            throw new Error('Not enough recipes available. Please add more recipes or adjust your cuisine filters.');
        }

        // 4. Generate meal plan
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + options.duration);

        const days = [];
        const usedRecipeIds = new Set<string>();

        for (let i = 0; i < options.duration; i++) {
            const dayDate = new Date(startDate);
            dayDate.setDate(dayDate.getDate() + i);

            const dayUsedRecipes = new Set<string>(); // Track recipes used in this day

            // Select meals for this day
            const breakfast = selectBestRecipe(availableRecipes, new Set([...usedRecipeIds, ...dayUsedRecipes]), 'breakfast', inventory, shoppingList);
            if (breakfast) dayUsedRecipes.add(breakfast.id);

            const lunch = selectBestRecipe(availableRecipes, new Set([...usedRecipeIds, ...dayUsedRecipes]), 'lunch', inventory, shoppingList);
            if (lunch) dayUsedRecipes.add(lunch.id);

            const dinner = selectBestRecipe(availableRecipes, new Set([...usedRecipeIds, ...dayUsedRecipes]), 'dinner', inventory, shoppingList);
            if (dinner) dayUsedRecipes.add(dinner.id);

            if (!breakfast || !lunch || !dinner) {
                throw new Error(`Unable to generate complete meal plan. Not enough variety in recipes for day ${i + 1}.`);
            }

            const meals = [
                {
                    mealType: 'breakfast' as const,
                    recipeId: breakfast.id,
                    recipeName: breakfast.name,
                    cuisine: breakfast.cuisine,
                    calories: breakfast.nutrition.calories,
                    protein: breakfast.nutrition.protein,
                    carbs: breakfast.nutrition.carbs,
                    fat: breakfast.nutrition.fat,
                    isCompleted: false,
                    isSwapped: false
                },
                {
                    mealType: 'lunch' as const,
                    recipeId: lunch.id,
                    recipeName: lunch.name,
                    cuisine: lunch.cuisine,
                    calories: lunch.nutrition.calories,
                    protein: lunch.nutrition.protein,
                    carbs: lunch.nutrition.carbs,
                    fat: lunch.nutrition.fat,
                    isCompleted: false,
                    isSwapped: false
                },
                {
                    mealType: 'dinner' as const,
                    recipeId: dinner.id,
                    recipeName: dinner.name,
                    cuisine: dinner.cuisine,
                    calories: dinner.nutrition.calories,
                    protein: dinner.nutrition.protein,
                    carbs: dinner.nutrition.carbs,
                    fat: dinner.nutrition.fat,
                    isCompleted: false,
                    isSwapped: false
                }
            ];

            const totalCalories = meals.reduce((sum, m) => sum + m.calories, 0);
            const totalProtein = meals.reduce((sum, m) => sum + m.protein, 0);

            days.push({
                date: dayDate,
                dayName: dayDate.toLocaleDateString('en-US', { weekday: 'long' }),
                meals,
                totalCalories,
                totalProtein
            });

            // Add used recipes to global set (allow reuse after a few days)
            if (i % 3 === 0) {
                usedRecipeIds.clear(); // Clear every 3 days to allow recipe reuse
            }
        }

        // 5. Deactivate old plans
        await deactivateOldPlans(userId);

        // 6. Save new plan
        const plansRef = collection(db, `mealPlans/${userId}/plans`);
        const planData = {
            duration: options.duration,
            startDate: serverTimestamp(),
            endDate: endDate,
            selectedCuisines: options.selectedCuisines,
            includeCustomRecipes: options.includeCustomRecipes,
            days,
            createdAt: serverTimestamp(),
            isActive: true
        };

        const planDoc = await addDoc(plansRef, planData);

        // 7. Generate shopping list
        await generateShoppingListFromPlan(userId, planData as any, inventory);

        return planDoc.id;
    } catch (error) {
        console.error('Error generating meal plan:', error);
        throw error instanceof Error ? error : new Error('Failed to generate meal plan');
    }
}

/**
 * Deactivate all old meal plans
 */
export async function deactivateOldPlans(userId: string): Promise<void> {
    try {
        const plansRef = collection(db, `mealPlans/${userId}/plans`);
        const activeQuery = query(plansRef, where('isActive', '==', true));
        const snapshot = await getDocs(activeQuery);

        const updates = snapshot.docs.map(doc =>
            updateDoc(doc.ref, { isActive: false })
        );

        await Promise.all(updates);
    } catch (error) {
        console.error('Error deactivating old plans:', error);
        throw new Error('Failed to deactivate old plans');
    }
}

/**
 * Subscribe to active meal plan
 */
export function subscribeToActiveMealPlan(
    userId: string,
    onUpdate: (plan: MealPlan | null) => void,
    onError?: (error: Error) => void
): () => void {
    try {
        const plansRef = collection(db, `mealPlans/${userId}/plans`);
        const q = query(
            plansRef,
            where('isActive', '==', true),
            orderBy('createdAt', 'desc')
        );

        return onSnapshot(
            q,
            (snapshot) => {
                if (snapshot.empty) {
                    onUpdate(null);
                } else {
                    const doc = snapshot.docs[0];
                    onUpdate({
                        id: doc.id,
                        ...doc.data(),
                    } as MealPlan);
                }
            },
            (error) => {
                console.error('Error subscribing to meal plan:', error);
                if (onError) {
                    onError(new Error('Failed to load meal plan'));
                }
            }
        );
    } catch (error) {
        console.error('Error setting up meal plan subscription:', error);
        throw new Error('Failed to subscribe to meal plan');
    }
}

/**
 * Get meal plan by ID
 */
export async function getMealPlanById(
    userId: string,
    planId: string
): Promise<MealPlan | null> {
    try {
        const planRef = doc(db, `mealPlans/${userId}/plans/${planId}`);
        const planSnap = await getDoc(planRef);

        if (!planSnap.exists()) {
            return null;
        }

        return {
            id: planSnap.id,
            ...planSnap.data(),
        } as MealPlan;
    } catch (error) {
        console.error('Error fetching meal plan:', error);
        throw new Error('Failed to fetch meal plan');
    }
}

/**
 * Update meal status (complete/swap)
 */
export async function updateMealStatus(
    userId: string,
    planId: string,
    dayIndex: number,
    mealIndex: number,
    updates: { isCompleted?: boolean; isSwapped?: boolean; completedAt?: any }
): Promise<void> {
    try {
        const planRef = doc(db, `mealPlans/${userId}/plans/${planId}`);
        const planSnap = await getDoc(planRef);

        if (!planSnap.exists()) {
            throw new Error('Meal plan not found');
        }

        const planData = planSnap.data() as MealPlan;
        const updatedDays = [...planData.days];

        if (!updatedDays[dayIndex] || !updatedDays[dayIndex].meals[mealIndex]) {
            throw new Error('Invalid day or meal index');
        }

        updatedDays[dayIndex].meals[mealIndex] = {
            ...updatedDays[dayIndex].meals[mealIndex],
            ...updates,
            completedAt: updates.isCompleted ? (serverTimestamp() as any) : undefined
        };

        await updateDoc(planRef, {
            days: updatedDays
        });
    } catch (error) {
        console.error('Error updating meal status:', error);
        throw error instanceof Error ? error : new Error('Failed to update meal');
    }
}

/**
 * Delete meal plan
 */
export async function deleteMealPlan(
    userId: string,
    planId: string
): Promise<void> {
    try {
        const planRef = doc(db, `mealPlans/${userId}/plans/${planId}`);
        await deleteDoc(planRef);
    } catch (error) {
        console.error('Error deleting meal plan:', error);
        throw new Error('Failed to delete meal plan');
    }
}
