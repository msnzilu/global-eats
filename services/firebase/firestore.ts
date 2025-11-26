import { InventoryItem, OnboardingData, Recipe, ShoppingList, User } from '@/types';
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
    Timestamp,
    Unsubscribe,
    updateDoc,
    where
} from 'firebase/firestore';
import { db } from './config';

// ============================================================================
// USER PROFILE MANAGEMENT
// ============================================================================

/**
 * Create a new user profile in Firestore
 */
export async function createUserProfile(
    userId: string,
    data: Partial<User>
): Promise<void> {
    try {
        const userRef = doc(db, 'users', userId);
        await setDoc(userRef, {
            ...data,
            createdAt: serverTimestamp(),
            lastLoginAt: serverTimestamp(),
        });
    } catch (error) {
        console.error('Error creating user profile:', error);
        throw new Error('Failed to create user profile');
    }
}

/**
 * Get user profile from Firestore
 */
export async function getUserProfile(userId: string): Promise<User | null> {
    try {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            return userSnap.data() as User;
        }
        return null;
    } catch (error) {
        console.error('Error getting user profile:', error);
        throw new Error('Failed to get user profile');
    }
}

/**
 * Update user profile in Firestore
 */
export async function updateUserProfile(
    userId: string,
    data: Partial<User>
): Promise<void> {
    try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            ...data,
            updatedAt: serverTimestamp(),
        });
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw new Error('Failed to update user profile');
    }
}

/**
 * Update user profile with onboarding data
 */
export async function updateOnboardingData(
    userId: string,
    onboardingData: OnboardingData
): Promise<void> {
    try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            dietType: onboardingData.dietType,
            allergies: onboardingData.allergies,
            goal: onboardingData.goal,
            targetCalories: onboardingData.targetCalories,
            mealsPerDay: onboardingData.mealsPerDay,
            preferredCuisines: onboardingData.cuisines,
            maxCookingTime: onboardingData.cookingTime,
            hasCompletedOnboarding: true,
            updatedAt: serverTimestamp(),
        });
    } catch (error) {
        console.error('Error updating onboarding data:', error);
        throw new Error('Failed to update onboarding data');
    }
}

/**
 * Update last login timestamp
 */
export async function updateLastLogin(userId: string): Promise<void> {
    try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            lastLoginAt: serverTimestamp(),
        });
    } catch (error) {
        console.error('Error updating last login:', error);
        // Don't throw error for this non-critical operation
    }
}

// ============================================================================
// INVENTORY MANAGEMENT
// ============================================================================

/**
 * Add a new inventory item to user's inventory
 */
export async function addInventoryItem(
    userId: string,
    itemData: Omit<InventoryItem, 'id' | 'addedAt' | 'lastUpdated'>
): Promise<string> {
    try {
        const inventoryRef = collection(db, 'inventory', userId, 'items');
        const docRef = await addDoc(inventoryRef, {
            ...itemData,
            addedAt: serverTimestamp(),
            lastUpdated: serverTimestamp(),
        });
        return docRef.id;
    } catch (error) {
        console.error('Error adding inventory item:', error);
        throw new Error('Failed to add inventory item');
    }
}

/**
 * Get all inventory items for a user with real-time updates
 * Returns an unsubscribe function to stop listening
 */
export function subscribeToInventoryItems(
    userId: string,
    onUpdate: (items: InventoryItem[]) => void,
    onError?: (error: Error) => void
): Unsubscribe {
    try {
        const inventoryRef = collection(db, 'inventory', userId, 'items');

        return onSnapshot(
            inventoryRef,
            (snapshot) => {
                const items: InventoryItem[] = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as InventoryItem));
                onUpdate(items);
            },
            (error) => {
                console.error('Error subscribing to inventory items:', error);
                if (onError) {
                    onError(new Error('Failed to load inventory items'));
                }
            }
        );
    } catch (error) {
        console.error('Error setting up inventory subscription:', error);
        throw new Error('Failed to subscribe to inventory items');
    }
}

/**
 * Update an existing inventory item
 */
export async function updateInventoryItem(
    userId: string,
    itemId: string,
    updates: Partial<Omit<InventoryItem, 'id' | 'addedAt'>>
): Promise<void> {
    try {
        const itemRef = doc(db, 'inventory', userId, 'items', itemId);
        await updateDoc(itemRef, {
            ...updates,
            lastUpdated: serverTimestamp(),
        });
    } catch (error) {
        console.error('Error updating inventory item:', error);
        throw new Error('Failed to update inventory item');
    }
}

/**
 * Delete an inventory item
 */
export async function deleteInventoryItem(
    userId: string,
    itemId: string
): Promise<void> {
    try {
        const itemRef = doc(db, 'inventory', userId, 'items', itemId);
        await deleteDoc(itemRef);
    } catch (error) {
        console.error('Error deleting inventory item:', error);
        throw new Error('Failed to delete inventory item');
    }
}

/**
 * Get inventory items by category with real-time updates
 */
export function subscribeToInventoryItemsByCategory(
    userId: string,
    category: string,
    onUpdate: (items: InventoryItem[]) => void,
    onError?: (error: Error) => void
): Unsubscribe {
    try {
        const inventoryRef = collection(db, 'inventory', userId, 'items');
        const q = query(inventoryRef, where('category', '==', category));

        return onSnapshot(
            q,
            (snapshot) => {
                const items: InventoryItem[] = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as InventoryItem));
                onUpdate(items);
            },
            (error) => {
                console.error('Error subscribing to inventory items by category:', error);
                if (onError) {
                    onError(new Error('Failed to load inventory items'));
                }
            }
        );
    } catch (error) {
        console.error('Error setting up category inventory subscription:', error);
        throw new Error('Failed to subscribe to inventory items');
    }
}

// ============================================================================
// RECIPE MANAGEMENT
// ============================================================================

/**
 * Add a new custom recipe to Firestore
 */
export async function addRecipe(
    userId: string,
    recipeData: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt' | 'source' | 'userId'>
): Promise<string> {
    try {
        const recipesRef = collection(db, 'recipes');
        const docRef = await addDoc(recipesRef, {
            ...recipeData,
            source: 'custom',
            userId,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
        return docRef.id;
    } catch (error) {
        console.error('Error adding recipe:', error);
        throw new Error('Failed to add recipe');
    }
}

/**
 * Subscribe to user's custom recipes with real-time updates
 */
export function subscribeToUserRecipes(
    userId: string,
    onUpdate: (recipes: Recipe[]) => void,
    onError?: (error: Error) => void
): () => void {
    try {
        const recipesRef = collection(db, 'recipes');
        const q = query(
            recipesRef,
            where('source', '==', 'custom'),
            where('userId', '==', userId),
            orderBy('createdAt', 'desc')
        );

        return onSnapshot(
            q,
            (snapshot) => {
                const recipes: Recipe[] = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                } as Recipe));
                onUpdate(recipes);
            },
            (error) => {
                console.error('Error subscribing to user recipes:', error);
                if (onError) {
                    onError(new Error('Failed to load recipes'));
                }
            }
        );
    } catch (error) {
        console.error('Error setting up user recipes subscription:', error);
        throw new Error('Failed to subscribe to recipes');
    }
}

/**
 * Subscribe to discovered recipes (Spoonacular) with real-time updates
 * For now, this will return mock data. In the future, integrate with Spoonacular API
 */
export function subscribeToDiscoveredRecipes(
    onUpdate: (recipes: Recipe[]) => void,
    onError?: (error: Error) => void
): () => void {
    try {
        const recipesRef = collection(db, 'recipes');
        const q = query(
            recipesRef,
            where('source', '==', 'spoonacular'),
            where('isPublic', '==', true),
            orderBy('createdAt', 'desc')
        );

        return onSnapshot(
            q,
            (snapshot) => {
                const recipes: Recipe[] = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                } as Recipe));
                onUpdate(recipes);
            },
            (error) => {
                console.error('Error subscribing to discovered recipes:', error);
                if (onError) {
                    onError(new Error('Failed to load discovered recipes'));
                }
            }
        );
    } catch (error) {
        console.error('Error setting up discovered recipes subscription:', error);
        throw new Error('Failed to subscribe to discovered recipes');
    }
}

/**
 * Get a single recipe by ID
 */
export async function getRecipeById(recipeId: string): Promise<Recipe | null> {
    try {
        const recipeRef = doc(db, 'recipes', recipeId);
        const recipeSnap = await getDoc(recipeRef);

        if (recipeSnap.exists()) {
            return {
                id: recipeSnap.id,
                ...recipeSnap.data(),
            } as Recipe;
        }
        return null;
    } catch (error) {
        console.error('Error getting recipe:', error);
        throw new Error('Failed to get recipe');
    }
}

/**
 * Update an existing recipe (custom recipes only)
 */
export async function updateRecipe(
    recipeId: string,
    userId: string,
    updates: Partial<Omit<Recipe, 'id' | 'createdAt' | 'updatedAt' | 'source' | 'userId'>>
): Promise<void> {
    try {
        // First verify ownership
        const recipe = await getRecipeById(recipeId);
        if (!recipe || recipe.source !== 'custom' || recipe.userId !== userId) {
            throw new Error('Unauthorized: You can only update your own custom recipes');
        }

        const recipeRef = doc(db, 'recipes', recipeId);
        await updateDoc(recipeRef, {
            ...updates,
            updatedAt: serverTimestamp(),
        });
    } catch (error) {
        console.error('Error updating recipe:', error);
        throw error instanceof Error ? error : new Error('Failed to update recipe');
    }
}

/**
 * Delete a recipe (custom recipes only)
 */
export async function deleteRecipe(
    recipeId: string,
    userId: string
): Promise<void> {
    try {
        // First verify ownership
        const recipe = await getRecipeById(recipeId);
        if (!recipe || recipe.source !== 'custom' || recipe.userId !== userId) {
            throw new Error('Unauthorized: You can only delete your own custom recipes');
        }

        const recipeRef = doc(db, 'recipes', recipeId);
        await deleteDoc(recipeRef);
    } catch (error) {
        console.error('Error deleting recipe:', error);
        throw error instanceof Error ? error : new Error('Failed to delete recipe');
    }
}

/**
 * Search recipes by name or cuisine
 * Note: For better search, consider using Algolia or similar service
 */
export function searchRecipes(
    searchQuery: string,
    userId?: string,
    onUpdate?: (recipes: Recipe[]) => void,
    onError?: (error: Error) => void
): () => void {
    try {
        const recipesRef = collection(db, 'recipes');
        let q;

        if (userId) {
            // Search only user's custom recipes
            q = query(
                recipesRef,
                where('source', '==', 'custom'),
                where('userId', '==', userId),
                orderBy('createdAt', 'desc')
            );
        } else {
            // Search all public recipes
            q = query(
                recipesRef,
                where('isPublic', '==', true),
                orderBy('createdAt', 'desc')
            );
        }

        return onSnapshot(
            q,
            (snapshot) => {
                let recipes: Recipe[] = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                } as Recipe));

                // Client-side filtering for search query
                if (searchQuery.trim()) {
                    const lowerQuery = searchQuery.toLowerCase();
                    recipes = recipes.filter(
                        (recipe) =>
                            recipe.name.toLowerCase().includes(lowerQuery) ||
                            recipe.cuisine.toLowerCase().includes(lowerQuery) ||
                            recipe.description?.toLowerCase().includes(lowerQuery)
                    );
                }

                if (onUpdate) {
                    onUpdate(recipes);
                }
            },
            (error) => {
                console.error('Error searching recipes:', error);
                if (onError) {
                    onError(new Error('Failed to search recipes'));
                }
            }
        );
    } catch (error) {
        console.error('Error setting up recipe search:', error);
        throw new Error('Failed to search recipes');
    }
}

// ============================================================================
// SHOPPING LIST MANAGEMENT
// ============================================================================

/**
 * Create a new shopping list
 */
export async function createShoppingList(
    userId: string,
    listData: Omit<ShoppingList, 'id' | 'createdAt'>
): Promise<string> {
    try {

        const listsRef = collection(db, `shoppingLists/${userId}/lists`);
        const docRef = await addDoc(listsRef, {
            ...listData,
            createdAt: serverTimestamp(),
        });
        return docRef.id;
    } catch (error) {
        console.error('Error creating shopping list:', error);
        throw new Error('Failed to create shopping list');
    }
}

/**
 * Subscribe to shopping list for a specific meal plan with real-time updates
 */
export function subscribeToActiveShoppingList(
    userId: string,
    onUpdate: (list: ShoppingList | null) => void,
    onError?: (error: Error) => void,
    mealPlanId?: string  // Optional meal plan ID filter
): () => void {
    try {
        const listsRef = collection(db, `shoppingLists/${userId}/lists`);

        let q;
        if (mealPlanId) {
            // Filter by specific meal plan
            q = query(
                listsRef,
                where('mealPlanId', '==', mealPlanId),
                where('isActive', '==', true),
                orderBy('createdAt', 'desc')
            );
        } else {
            // Fallback to any active list (backward compatible)
            q = query(
                listsRef,
                where('isActive', '==', true),
                orderBy('createdAt', 'desc')
            );
        }

        return onSnapshot(
            q,
            (snapshot) => {
                if (snapshot.empty) {
                    onUpdate(null);
                } else {
                    // Get the first (most recent) active list
                    const doc = snapshot.docs[0];
                    onUpdate({
                        id: doc.id,
                        ...doc.data(),
                    } as ShoppingList);
                }
            },
            (error) => {
                console.error('Error subscribing to shopping list:', error);
                if (onError) {
                    onError(new Error('Failed to load shopping list'));
                }
            }
        );
    } catch (error) {
        console.error('Error setting up shopping list subscription:', error);
        throw new Error('Failed to subscribe to shopping list');
    }
}

/**
 * Update a shopping list item (e.g., check/uncheck)
 */
export async function updateShoppingListItem(
    userId: string,
    listId: string,
    itemId: string,
    updates: { isChecked?: boolean; checkedAt?: any }
): Promise<void> {
    try {
        const listRef = doc(db, `shoppingLists/${userId}/lists/${listId}`);
        const listSnap = await getDoc(listRef);

        if (!listSnap.exists()) {
            throw new Error('Shopping list not found');
        }

        const listData = listSnap.data() as ShoppingList;
        const updatedItems = listData.items.map(item =>
            item.id === itemId
                ? {
                    ...item,
                    ...updates,
                    checkedAt: updates.isChecked ? Timestamp.now() : null
                }
                : item
        );

        await updateDoc(listRef, {
            items: updatedItems
        });
    } catch (error) {
        console.error('Error updating shopping list item:', error);
        throw error instanceof Error ? error : new Error('Failed to update item');
    }
}

/**
 * Delete a shopping list
 */
export async function deleteShoppingList(
    userId: string,
    listId: string
): Promise<void> {
    try {
        const listRef = doc(db, `shoppingLists/${userId}/lists/${listId}`);
        await deleteDoc(listRef);
    } catch (error) {
        console.error('Error deleting shopping list:', error);
        throw new Error('Failed to delete shopping list');
    }
}

/**
 * Add items to an existing shopping list
 */
export async function addItemsToShoppingList(
    userId: string,
    listId: string,
    newItems: Array<Omit<ShoppingList['items'][0], 'id'>>
): Promise<void> {
    try {
        const listRef = doc(db, `shoppingLists/${userId}/lists/${listId}`);
        const listSnap = await getDoc(listRef);

        if (!listSnap.exists()) {
            throw new Error('Shopping list not found');
        }

        const listData = listSnap.data() as ShoppingList;
        const itemsWithIds = newItems.map(item => ({
            ...item,
            id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        }));

        await updateDoc(listRef, {
            items: [...listData.items, ...itemsWithIds]
        });
    } catch (error) {
        console.error('Error adding items to shopping list:', error);
        throw error instanceof Error ? error : new Error('Failed to add items');
    }
}

/**
 * Remove an item from shopping list
 */
export async function removeItemFromShoppingList(
    userId: string,
    listId: string,
    itemId: string
): Promise<void> {
    try {
        const listRef = doc(db, `shoppingLists/${userId}/lists/${listId}`);
        const listSnap = await getDoc(listRef);

        if (!listSnap.exists()) {
            throw new Error('Shopping list not found');
        }

        const listData = listSnap.data() as ShoppingList;
        const updatedItems = listData.items.filter(item => item.id !== itemId);

        await updateDoc(listRef, {
            items: updatedItems
        });
    } catch (error) {
        console.error('Error removing item from shopping list:', error);
        throw error instanceof Error ? error : new Error('Failed to remove item');
    }
}

/**
 * Remove multiple items from shopping list (e.g., clear checked items)
 */
export async function removeItemsFromShoppingList(
    userId: string,
    listId: string,
    itemIds: string[]
): Promise<void> {
    try {
        const listRef = doc(db, `shoppingLists/${userId}/lists/${listId}`);
        const listSnap = await getDoc(listRef);

        if (!listSnap.exists()) {
            throw new Error('Shopping list not found');
        }

        const listData = listSnap.data() as ShoppingList;
        const updatedItems = listData.items.filter(item => !itemIds.includes(item.id));

        await updateDoc(listRef, {
            items: updatedItems
        });
    } catch (error) {
        console.error('Error removing items from shopping list:', error);
        throw error instanceof Error ? error : new Error('Failed to remove items');
    }
}
