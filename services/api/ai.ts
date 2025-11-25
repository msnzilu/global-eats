// services/api/ai.ts
import { MealPlan, Recipe } from '@/types';

// Placeholder for the actual OpenAI API URL. In production, use a backend proxy.
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// WARNING: Storing API keys in the client is insecure. Use a secure backend in production.
const API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY || '';

export interface GeneratedRecipeResponse {
    recipe: Omit<Recipe, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'source'>;
}

/** Generate a single recipe from a prompt (unchanged) */
export async function generateRecipeFromPrompt(prompt: string): Promise<GeneratedRecipeResponse> {
    if (!API_KEY) {
        console.warn('No OpenAI API key found. Using mock response for demo purposes.');
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    recipe: {
                        name: `AI Generated: ${prompt.substring(0, 20)}...`,
                        description: `A delicious recipe generated based on your request: "${prompt}"`,
                        cuisine: 'International',
                        difficulty: 'Medium',
                        prepTimeMin: 20,
                        cookTimeMin: 30,
                        servings: 4,
                        ingredients: [
                            { name: 'Main Ingredient', amount: 1, unit: 'lb' },
                            { name: 'Spice Mix', amount: 2, unit: 'tbsp' },
                            { name: 'Vegetables', amount: 2, unit: 'cups' },
                        ],
                        instructions: '1. Prepare ingredients.\n2. Cook main ingredient.\n3. Add spices and vegetables.\n4. Simmer for 20 minutes.\n5. Serve hot.',
                        nutrition: { calories: 500, protein: 25, carbs: 40, fat: 20 },
                        creationMethod: 'ai-generated',
                        aiPrompt: prompt,
                        isPublic: false,
                    },
                });
            }, 1500);
        });
    }
    try {
        const response = await fetch(OPENAI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${API_KEY}`,
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: `You are a professional chef. Create a recipe based on the user's prompt. Return ONLY a JSON object with the following structure:\n{\n  \"name\": \"Recipe Name\",\n  \"description\": \"Short description\",\n  \"cuisine\": \"Cuisine Type\",\n  \"difficulty\": \"Easy\" | \"Medium\" | \"Hard\",\n  \"prepTimeMin\": number,\n  \"cookTimeMin\": number,\n  \"servings\": number,\n  \"ingredients\": [{ \"name\": \"item\", \"amount\": number, \"unit\": \"unit\" }],\n  \"instructions\": \"Step 1... Step 2...\",\n  \"nutrition\": { \"calories\": number, \"protein\": number, \"carbs\": number, \"fat\": number }\n}`,
                    },
                    { role: 'user', content: prompt },
                ],
                temperature: 0.7,
            }),
        });
        if (!response.ok) {
            throw new Error(`OpenAI API Error: ${response.statusText}`);
        }
        const data = await response.json();
        const content = data.choices[0].message.content;
        const recipeData = JSON.parse(content);
        return { recipe: { ...recipeData, creationMethod: 'ai-generated', aiPrompt: prompt, isPublic: false } };
    } catch (error) {
        console.error('Error generating recipe with AI:', error);
        throw error;
    }
}

/** Generate a meal plan using only the user's custom recipes */
export const generateMealPlanFromPrompt = async (
    prompt: string,
    customRecipes: Recipe[] = [],
    duration: 7 | 30 = 7
): Promise<MealPlan> => {
    if (!API_KEY) {
        console.warn('No OpenAI API key found. Using mock response for meal plan demo purposes.');
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    name: `AI Generated Meal Plan: ${prompt.substring(0, 20)}...`,
                    duration,
                    selectedCuisines: ['International'],
                    includeCustomRecipes: customRecipes.length > 0,
                    days: Array.from({ length: duration }).map((_, i) => ({
                        dayName: `Day ${i + 1}`,
                        meals: [
                            { name: 'Mock Breakfast', type: 'breakfast', calories: 300, protein: 15 },
                            { name: 'Mock Lunch', type: 'lunch', calories: 500, protein: 25 },
                            { name: 'Mock Dinner', type: 'dinner', calories: 600, protein: 30 },
                        ],
                        totalCalories: 1400,
                        totalProtein: 70,
                    })),
                });
            }, 1500);
        });
    }
    const customContext = customRecipes.length > 0
        ? `The user has the following custom recipes available. Use ONLY these recipes when constructing the meal plan.\nCustom Recipes: ${JSON.stringify(
            customRecipes.map((r) => ({
                name: r.name,
                description: r.description,
                cuisine: r.cuisine,
                prepTimeMin: r.prepTimeMin,
                cookTimeMin: r.cookTimeMin,
                servings: r.servings,
                ingredients: r.ingredients,
                nutrition: r.nutrition,
            }))
        )}`
        : '';
    try {
        const response = await fetch(OPENAI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${API_KEY}`,
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: `You are a professional nutritionist and meal planner. Create a ${duration}-day meal plan based on the user's request.\n${customContext}\nReturn ONLY a valid JSON object matching this structure:\n{\n  \"name\": \"Plan Name\",\n  \"duration\": ${duration},\n  \"selectedCuisines\": [\"Cuisine1\", \"Cuisine2\"],\n  \"includeCustomRecipes\": ${customRecipes.length > 0},\n  \"days\": [\n    {\n      \"dayName\": \"Day 1\",\n      \"meals\": [\n        {\n          \"name\": \"Meal Name\",\n          \"type\": \"breakfast\" | \"lunch\" | \"dinner\" | \"snack\",\n          \"calories\": number,\n          \"protein\": number\n        }\n      ],\n      \"totalCalories\": number,\n      \"totalProtein\": number\n    }\n  ]\n}\nDo not include any markdown or explanations.`,
                    },
                    { role: 'user', content: prompt },
                ],
                temperature: 0.7,
            }),
        });
        if (!response.ok) {
            const errData = await response.json();
            throw new Error(`OpenAI API Error: ${response.status} - ${errData.error?.message || response.statusText}`);
        }
        const data = await response.json();
        const content = data.choices[0].message.content;
        const mealPlan = JSON.parse(content);
        return mealPlan as MealPlan;
    } catch (error) {
        console.error('Error generating meal plan:', error);
        throw error;
    }
};
