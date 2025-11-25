import { Recipe } from '@/types';
import { Timestamp } from 'firebase/firestore';

const SPOONACULAR_API_KEY = process.env.EXPO_PUBLIC_SPOONACULAR_API_KEY || '';
const SPOONACULAR_BASE_URL = 'https://api.spoonacular.com/recipes';

export interface SpoonacularRecipe {
    id: number;
    title: string;
    image: string;
    imageType: string;
    servings: number;
    readyInMinutes: number;
    cuisines: string[];
    dishTypes: string[];
    diets: string[];
    summary: string;
    instructions: string;
    extendedIngredients: Array<{
        id: number;
        name: string;
        amount: number;
        unit: string;
        original: string;
    }>;
    nutrition?: {
        nutrients: Array<{
            name: string;
            amount: number;
            unit: string;
        }>;
    };
}

/**
 * Search for recipes using Spoonacular API
 */
export async function searchSpoonacularRecipes(
    query: string = '',
    options: {
        cuisine?: string;
        diet?: string;
        maxReadyTime?: number;
        number?: number;
        offset?: number;
    } = {}
): Promise<Recipe[]> {
    try {
        if (!SPOONACULAR_API_KEY) {
            console.warn('Spoonacular API key not configured. Please add EXPO_PUBLIC_SPOONACULAR_API_KEY to your .env file');
            return [];
        }

        const params = new URLSearchParams({
            apiKey: SPOONACULAR_API_KEY,
            query: query || 'popular',
            number: (options.number || 20).toString(),
            offset: (options.offset || 0).toString(),
            addRecipeInformation: 'true',
            fillIngredients: 'true',
            addRecipeNutrition: 'true',
        });

        if (options.cuisine) params.append('cuisine', options.cuisine);
        if (options.diet) params.append('diet', options.diet);
        if (options.maxReadyTime) params.append('maxReadyTime', options.maxReadyTime.toString());

        const response = await fetch(`${SPOONACULAR_BASE_URL}/complexSearch?${params.toString()}`);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Spoonacular API error:', response.status, errorText);
            return [];
        }

        const data = await response.json();

        return data.results.map((recipe: any) => convertSpoonacularToRecipe(recipe));
    } catch (error) {
        console.error('Error searching Spoonacular recipes:', error);
        return [];
    }
}

/**
 * Get random recipes from Spoonacular
 */
export async function getRandomRecipes(
    options: {
        tags?: string;
        number?: number;
    } = {}
): Promise<Recipe[]> {
    try {
        if (!SPOONACULAR_API_KEY) {
            console.warn('Spoonacular API key not configured. Please add EXPO_PUBLIC_SPOONACULAR_API_KEY to your .env file');
            return [];
        }

        const params = new URLSearchParams({
            apiKey: SPOONACULAR_API_KEY,
            number: (options.number || 10).toString(),
        });

        if (options.tags) params.append('tags', options.tags);

        const response = await fetch(`${SPOONACULAR_BASE_URL}/random?${params.toString()}`);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Spoonacular API error:', response.status, errorText);
            return [];
        }

        const data = await response.json();

        return data.recipes.map((recipe: SpoonacularRecipe) => convertSpoonacularToRecipe(recipe));
    } catch (error) {
        console.error('Error getting random recipes:', error);
        return [];
    }
}

/**
 * Get recipe details by ID from Spoonacular
 */
export async function getSpoonacularRecipeById(recipeId: number): Promise<Recipe | null> {
    try {
        if (!SPOONACULAR_API_KEY) {
            console.warn('Spoonacular API key not configured');
            return null;
        }

        const params = new URLSearchParams({
            apiKey: SPOONACULAR_API_KEY,
            includeNutrition: 'true',
        });

        const response = await fetch(`${SPOONACULAR_BASE_URL}/${recipeId}/information?${params.toString()}`);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Spoonacular API error:', response.status, errorText);
            return null;
        }

        const recipe: SpoonacularRecipe = await response.json();

        return convertSpoonacularToRecipe(recipe);
    } catch (error) {
        console.error('Error getting recipe details:', error);
        return null;
    }
}

/**
 * Convert Spoonacular recipe format to our Recipe type
 */
function convertSpoonacularToRecipe(spoonacularRecipe: any): Recipe {
    // Extract nutrition data
    const nutrients = spoonacularRecipe.nutrition?.nutrients || [];
    const getNutrient = (name: string) => {
        const nutrient = nutrients.find((n: any) => n.name === name);
        return nutrient ? Math.round(nutrient.amount) : 0;
    };

    // Convert ingredients
    const ingredients = (spoonacularRecipe.extendedIngredients || []).map((ing: any) => ({
        name: ing.name,
        amount: ing.amount,
        unit: ing.unit,
    }));

    // Parse instructions
    let instructions: string[] = [];
    if (typeof spoonacularRecipe.instructions === 'string') {
        // Remove HTML tags and split by periods or numbered steps
        const cleanInstructions = spoonacularRecipe.instructions
            .replace(/<[^>]*>/g, '')
            .replace(/\d+\.\s*/g, '\n')
            .split('\n')
            .filter((step: string) => step.trim().length > 0);
        instructions = cleanInstructions;
    } else if (Array.isArray(spoonacularRecipe.analyzedInstructions) &&
        spoonacularRecipe.analyzedInstructions.length > 0) {
        instructions = spoonacularRecipe.analyzedInstructions[0].steps.map(
            (step: any) => step.step
        );
    }

    return {
        id: `spoon_${spoonacularRecipe.id}`,
        name: spoonacularRecipe.title,
        description: spoonacularRecipe.summary?.replace(/<[^>]*>/g, '').substring(0, 200) || '',
        cuisine: spoonacularRecipe.cuisines?.[0] || 'International',
        prepTimeMin: Math.round((spoonacularRecipe.readyInMinutes || 30) * 0.3),
        cookTimeMin: Math.round((spoonacularRecipe.readyInMinutes || 30) * 0.7),
        servings: spoonacularRecipe.servings || 4,
        difficulty: spoonacularRecipe.readyInMinutes > 60 ? 'Hard' :
            spoonacularRecipe.readyInMinutes > 30 ? 'Medium' : 'Easy',
        ingredients,
        instructions: instructions.join('\n'),
        nutrition: {
            calories: getNutrient('Calories'),
            protein: getNutrient('Protein'),
            carbs: getNutrient('Carbohydrates'),
            fat: getNutrient('Fat'),
        },
        imageUrl: spoonacularRecipe.image || '',
        source: 'spoonacular',
        userId: '', // External recipes don't have a userId
        isPublic: true,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
    };
}
