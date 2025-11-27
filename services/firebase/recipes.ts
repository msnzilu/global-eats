import { Recipe } from '@/types';
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    serverTimestamp,
    updateDoc
} from 'firebase/firestore';
import { db } from './config';

// ============================================================================
// RECIPE MANAGEMENT
// ============================================================================

import { getDocs, query, where } from 'firebase/firestore';
import { getUserProfile } from './firestore';

/**
 * Check if user has reached their recipe limit
 */
export async function checkRecipeLimit(userId: string): Promise<boolean> {
    const userProfile = await getUserProfile(userId);

    // Premium users have no limit
    if (userProfile?.subscriptionTier === 'premium') {
        return true;
    }

    // Free users limited to 5 recipes
    const recipesRef = collection(db, 'recipes');
    const q = query(recipesRef, where('userId', '==', userId));
    const snapshot = await getDocs(q);

    return snapshot.size < 5;
}

/**
 * Create a new manually entered recipe
 */
export async function createManualRecipe(
    userId: string,
    recipeData: Omit<Recipe, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'source' | 'creationMethod'>
): Promise<string> {
    try {
        // Check limit
        const canCreate = await checkRecipeLimit(userId);
        if (!canCreate) {
            throw new Error('Recipe limit reached. Upgrade to Premium to create more recipes.');
        }

        const recipeRef = await addDoc(collection(db, 'recipes'), {
            ...recipeData,
            userId,
            source: 'custom',
            creationMethod: 'manual',
            isPublic: false, // Default to private
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
        return recipeRef.id;
    } catch (error) {
        console.error('Error creating manual recipe:', error);
        throw error;
    }
}

/**
 * Create a new AI-generated recipe
 */
export async function createAIRecipe(
    userId: string,
    prompt: string,
    recipeData: Omit<Recipe, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'source' | 'creationMethod' | 'aiPrompt'>
): Promise<string> {
    try {
        const userProfile = await getUserProfile(userId);

        // Free users cannot use AI generation
        if (userProfile?.subscriptionTier === 'free') {
            throw new Error('AI Recipe Generation is a Premium feature. Upgrade to unlock.');
        }

        // Check limit (though Premium users shouldn't hit it, good practice)
        const canCreate = await checkRecipeLimit(userId);
        if (!canCreate) {
            throw new Error('Recipe limit reached.');
        }

        const recipeRef = await addDoc(collection(db, 'recipes'), {
            ...recipeData,
            userId,
            source: 'custom',
            creationMethod: 'ai-generated',
            aiPrompt: prompt,
            isPublic: false,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
        return recipeRef.id;
    } catch (error) {
        console.error('Error creating AI recipe:', error);
        throw error;
    }
}

/**
 * Update an existing recipe
 */
export async function updateRecipe(
    recipeId: string,
    updates: Partial<Recipe>
): Promise<void> {
    try {
        const recipeRef = doc(db, 'recipes', recipeId);
        await updateDoc(recipeRef, {
            ...updates,
            updatedAt: serverTimestamp(),
        });
    } catch (error) {
        console.error('Error updating recipe:', error);
        throw new Error('Failed to update recipe');
    }
}

/**
 * Delete a recipe
 */
export async function deleteRecipe(recipeId: string): Promise<void> {
    try {
        await deleteDoc(doc(db, 'recipes', recipeId));
    } catch (error) {
        console.error('Error deleting recipe:', error);
        throw new Error('Failed to delete recipe');
    }
}
