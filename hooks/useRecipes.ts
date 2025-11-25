import {
    addRecipe,
    auth,
    deleteRecipe,
    subscribeToUserRecipes,
    updateRecipe
} from '@/services/firebase';
import { Recipe } from '@/types';
import { useEffect, useState } from 'react';

interface UseRecipesReturn {
    myRecipes: Recipe[];
    discoveredRecipes: Recipe[];
    loading: boolean;
    error: string | null;
    addRecipe: (recipeData: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt' | 'source' | 'userId'>) => Promise<void>;
    updateRecipe: (recipeId: string, updates: Partial<Omit<Recipe, 'id' | 'createdAt' | 'updatedAt' | 'source' | 'userId'>>) => Promise<void>;
    deleteRecipe: (recipeId: string) => Promise<void>;
    refreshRecipes: () => void;
}

export function useRecipes(): UseRecipesReturn {
    const [myRecipes, setMyRecipes] = useState<Recipe[]>([]);
    const [discoveredRecipes, setDiscoveredRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const currentUser = auth.currentUser;

    useEffect(() => {
        if (!currentUser) {
            setLoading(false);
            setError('User not authenticated');
            return;
        }

        setLoading(true);
        setError(null);

        // Subscribe to user's custom recipes
        const unsubscribeCustom = subscribeToUserRecipes(
            currentUser.uid,
            (recipes) => {
                setMyRecipes(recipes);
                setLoading(false);
            },
            (err) => {
                setError(err.message);
                setLoading(false);
            }
        );

        // Load discovered recipes from Firestore cache
        const loadDiscoveredRecipes = async () => {
            try {
                const { getCachedSpoonacularRecipes, initializeSpoonacularCache } = await import('@/services/api/recipe-sync');

                // Initialize cache if it doesn't exist (first time only)
                await initializeSpoonacularCache();

                // Get recipes from cache
                const recipes = await getCachedSpoonacularRecipes();
                setDiscoveredRecipes(recipes);
            } catch (err) {
                console.error('Error loading discovered recipes:', err);
                // Don't set error state for discovered recipes, just log it
            }
        };

        loadDiscoveredRecipes();

        // Cleanup subscriptions on unmount
        return () => {
            unsubscribeCustom();
        };
    }, [currentUser?.uid]);

    const handleAddRecipe = async (
        recipeData: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt' | 'source' | 'userId'>
    ): Promise<void> => {
        if (!currentUser) {
            throw new Error('User not authenticated');
        }

        try {
            await addRecipe(currentUser.uid, recipeData);
        } catch (err: any) {
            throw new Error(err.message || 'Failed to add recipe');
        }
    };

    const handleUpdateRecipe = async (
        recipeId: string,
        updates: Partial<Omit<Recipe, 'id' | 'createdAt' | 'updatedAt' | 'source' | 'userId'>>
    ): Promise<void> => {
        if (!currentUser) {
            throw new Error('User not authenticated');
        }

        try {
            await updateRecipe(recipeId, currentUser.uid, updates);
        } catch (err: any) {
            throw new Error(err.message || 'Failed to update recipe');
        }
    };

    const handleDeleteRecipe = async (recipeId: string): Promise<void> => {
        if (!currentUser) {
            throw new Error('User not authenticated');
        }

        try {
            await deleteRecipe(recipeId, currentUser.uid);
        } catch (err: any) {
            throw new Error(err.message || 'Failed to delete recipe');
        }
    };

    const refreshRecipes = () => {
        // Firestore real-time listeners handle this automatically
        // This function is here for manual refresh if needed
        setLoading(true);
    };

    return {
        myRecipes,
        discoveredRecipes,
        loading,
        error,
        addRecipe: handleAddRecipe,
        updateRecipe: handleUpdateRecipe,
        deleteRecipe: handleDeleteRecipe,
        refreshRecipes,
    };
}
