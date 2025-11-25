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

/**
 * Create a new manually entered recipe
 */
export async function createManualRecipe(
    userId: string,
    recipeData: Omit<Recipe, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'source' | 'creationMethod'>
): Promise<string> {
    try {
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
        throw new Error('Failed to create recipe');
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
        throw new Error('Failed to create AI recipe');
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
