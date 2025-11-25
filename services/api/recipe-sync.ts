import { Recipe } from '@/types';
import { collection, doc, getDocs, query, where, writeBatch } from 'firebase/firestore';
import { db } from '../firebase/config';
import { getRandomRecipes } from './spoonacular';

/**
 * Sync Spoonacular recipes to Firestore
 * This should be called once to populate the database with recipes
 */
export async function syncSpoonacularRecipes(batchSize: number = 100): Promise<number> {
    try {
        console.log('🔄 Starting Spoonacular recipe sync...');

        // Fetch recipes from Spoonacular
        const recipes = await getRandomRecipes({ number: batchSize });

        if (recipes.length === 0) {
            console.warn('⚠️ No recipes fetched from Spoonacular');
            return 0;
        }

        // Save to Firestore in batches (Firestore batch limit is 500)
        const recipesRef = collection(db, 'recipes');
        const batchLimit = 500;
        let savedCount = 0;

        for (let i = 0; i < recipes.length; i += batchLimit) {
            const batch = writeBatch(db);
            const recipeBatch = recipes.slice(i, i + batchLimit);

            for (const recipe of recipeBatch) {
                const recipeDoc = doc(recipesRef, recipe.id);
                batch.set(recipeDoc, recipe);
            }

            await batch.commit();
            savedCount += recipeBatch.length;
            console.log(`✅ Saved ${savedCount}/${recipes.length} recipes to Firestore`);
        }

        console.log(`🎉 Successfully synced ${savedCount} Spoonacular recipes to Firestore`);
        return savedCount;
    } catch (error) {
        console.error('❌ Error syncing Spoonacular recipes:', error);
        throw error;
    }
}

/**
 * Get all Spoonacular recipes from Firestore cache
 */
export async function getCachedSpoonacularRecipes(): Promise<Recipe[]> {
    try {
        const recipesRef = collection(db, 'recipes');
        const spoonQuery = query(
            recipesRef,
            where('source', '==', 'spoonacular')
        );

        const snapshot = await getDocs(spoonQuery);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Recipe));
    } catch (error) {
        console.error('Error fetching cached Spoonacular recipes:', error);
        return [];
    }
}

/**
 * Check if Spoonacular recipes are already cached
 */
export async function hasSpoonacularRecipesCache(): Promise<boolean> {
    try {
        const recipes = await getCachedSpoonacularRecipes();
        return recipes.length > 0;
    } catch (error) {
        console.error('Error checking Spoonacular cache:', error);
        return false;
    }
}

/**
 * Initialize Spoonacular recipes cache if not already done
 * This should be called on app startup or when needed
 */
export async function initializeSpoonacularCache(): Promise<void> {
    try {
        const hasCache = await hasSpoonacularRecipesCache();

        if (!hasCache) {
            console.log('📦 No Spoonacular recipes in cache, fetching from API...');
            await syncSpoonacularRecipes(100);
        } else {
            console.log('✅ Spoonacular recipes already cached');
        }
    } catch (error) {
        console.error('Error initializing Spoonacular cache:', error);
        throw error;
    }
}

/**
 * Refresh Spoonacular recipes cache
 * Call this manually when you want to update the recipe database
 */
export async function refreshSpoonacularCache(batchSize: number = 50): Promise<number> {
    try {
        console.log('🔄 Refreshing Spoonacular recipes cache...');
        return await syncSpoonacularRecipes(batchSize);
    } catch (error) {
        console.error('Error refreshing Spoonacular cache:', error);
        throw error;
    }
}
