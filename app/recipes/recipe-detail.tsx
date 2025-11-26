import { useRecipes } from '@/hooks/useRecipes';
import { getRecipeById } from '@/services/firebase';
import { auth } from '@/services/firebase/config';
import { Recipe } from '@/types';
import { Colors } from '@/utils/constants';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function RecipeDetail() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const params = useLocalSearchParams();
    const { deleteRecipe, addRecipe, myRecipes } = useRecipes();

    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const recipeId = params.id as string;
    const currentUser = auth.currentUser;

    // Detect if accessed from planner
    const fromPlanner = params.fromPlanner === 'true';
    const dayIndex = params.dayIndex ? parseInt(params.dayIndex as string) : undefined;
    const mealType = params.mealType as string | undefined;

    useEffect(() => {
        if (!recipeId) {
            setError('No recipe ID provided');
            setLoading(false);
            return;
        }

        const fetchRecipe = async () => {
            try {
                setLoading(true);

                // Check if this is a Spoonacular recipe (ID starts with "spoon_")
                if (recipeId.startsWith('spoon_')) {
                    // Extract the numeric ID and fetch from Spoonacular
                    const numericId = parseInt(recipeId.replace('spoon_', ''));
                    const { getSpoonacularRecipeById } = await import('@/services/api/spoonacular');
                    const data = await getSpoonacularRecipeById(numericId);

                    if (data) {
                        setRecipe(data);
                    } else {
                        setError('Recipe not found');
                    }
                } else {
                    // Check if this is a mock recipe ID (simple numeric string)
                    const isMockId = /^\d+$/.test(recipeId);

                    if (isMockId) {
                        setError('This is a preview meal. Please generate a real meal plan to view recipe details.');
                        setLoading(false);
                        return;
                    }

                    // Fetch from Firestore for custom recipes
                    const data = await getRecipeById(recipeId);
                    if (data) {
                        setRecipe(data);
                    } else {
                        setError('Recipe not found');
                    }
                }
            } catch (err: any) {
                console.error('Error loading recipe:', err);
                setError(err.message || 'Failed to load recipe');
            } finally {
                setLoading(false);
            }
        };

        fetchRecipe();
    }, [recipeId]);

    const handleDelete = () => {
        if (!recipe) return;

        Alert.alert(
            'Delete Recipe',
            `Are you sure you want to delete "${recipe.name}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteRecipe(recipe.id);
                            Alert.alert('Success', 'Recipe deleted successfully', [
                                { text: 'OK', onPress: () => router.back() }
                            ]);
                        } catch (err: any) {
                            Alert.alert('Error', err.message || 'Failed to delete recipe');
                        }
                    }
                }
            ]
        );
    };

    const handleSaveAsCustom = async () => {
        if (!recipe || !currentUser) return;

        // Check for duplicates
        const isDuplicate = myRecipes.some(r => r.name.toLowerCase() === recipe.name.toLowerCase());
        if (isDuplicate) {
            Alert.alert('Already Saved', 'You already have a custom recipe with this name.');
            return;
        }

        try {
            // Create a new custom recipe based on the current recipe
            const customRecipe = {
                name: recipe.name,
                description: recipe.description || '',
                cuisine: recipe.cuisine || 'International',
                difficulty: recipe.difficulty || 'Medium',
                prepTimeMin: recipe.prepTimeMin || 30,
                cookTimeMin: recipe.cookTimeMin || 30,
                servings: recipe.servings || 4,
                ingredients: recipe.ingredients || [],
                instructions: recipe.instructions || '',
                nutrition: recipe.nutrition || {
                    calories: 0,
                    protein: 0,
                    carbs: 0,
                    fat: 0
                },
                imageUrl: recipe.imageUrl || '',
                isPublic: false
            };

            await addRecipe(customRecipe);
            Alert.alert(
                'Success',
                'Recipe saved to your custom recipes!',
                [{ text: 'OK' }]
            );
        } catch (err: any) {
            Alert.alert('Error', err.message || 'Failed to save recipe');
        }
    };

    const handleSwap = () => {
        router.push(`/recipes/swap-meal?recipeId=${recipeId}&dayIndex=${dayIndex}&mealType=${mealType}`);
    };

    const handleTimer = () => {
        router.push(`/recipes/cooking-timer?recipeId=${recipeId}`);
    };

    if (loading) {
        return (
            <View style={{ flex: 1, backgroundColor: Colors.light.background }}>
                <View style={{
                    backgroundColor: Colors.primary.main,
                    paddingTop: insets.top + 16,
                    paddingBottom: 20,
                    paddingHorizontal: 24,
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                    <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>
                        Recipe Details
                    </Text>
                </View>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color={Colors.primary.main} />
                    <Text style={{ marginTop: 16, fontSize: 16, color: Colors.light.text.secondary }}>
                        Loading recipe...
                    </Text>
                </View>
            </View>
        );
    }

    if (error || !recipe) {
        return (
            <View style={{ flex: 1, backgroundColor: Colors.light.background }}>
                <View style={{
                    backgroundColor: Colors.primary.main,
                    paddingTop: insets.top + 16,
                    paddingBottom: 20,
                    paddingHorizontal: 24,
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                    <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>
                        Recipe Details
                    </Text>
                </View>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
                    <Ionicons name="alert-circle-outline" size={64} color={Colors.light.text.tertiary} />
                    <Text style={{ marginTop: 16, fontSize: 18, fontWeight: '600', color: Colors.light.text.primary }}>
                        {error || 'Recipe not found'}
                    </Text>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={{
                            marginTop: 24,
                            backgroundColor: Colors.primary.main,
                            paddingHorizontal: 24,
                            paddingVertical: 12,
                            borderRadius: 12
                        }}
                    >
                        <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                            Go Back
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    const isCustom = recipe.source === 'custom';
    const isOwner = currentUser && recipe.userId === currentUser.uid;

    return (
        <View style={{ flex: 1, backgroundColor: Colors.light.background }}>
            {/* Header */}
            <View style={{
                backgroundColor: Colors.primary.main,
                paddingTop: insets.top + 16,
                paddingBottom: 20,
                paddingHorizontal: 24,
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={{ marginRight: 16 }}
                >
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: 'white',
                    flex: 1
                }} numberOfLines={1}>
                    {recipe.name}
                </Text>
                {isCustom && (
                    <TouchableOpacity
                        onPress={() => {/* TODO: Navigate to edit */ }}
                        style={{ marginLeft: 8 }}
                    >
                        <Ionicons name="create-outline" size={24} color="white" />
                    </TouchableOpacity>
                )}
            </View>

            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{
                    paddingBottom: 100 + insets.bottom
                }}
            >
                {/* Recipe Image Placeholder */}
                <View style={{
                    height: 250,
                    backgroundColor: Colors.light.surface,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Ionicons name="restaurant" size={64} color={Colors.light.text.tertiary} />

                    {/* Source Badge */}
                    <View style={{
                        position: 'absolute',
                        top: 16,
                        left: 16,
                        backgroundColor: isCustom ? Colors.primary.main : Colors.secondary.main,
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: 20
                    }}>
                        <Text style={{ fontSize: 12, fontWeight: '600', color: 'white' }}>
                            {isCustom ? 'My Recipe' : 'Discover'}
                        </Text>
                    </View>
                </View>

                {/* Recipe Info Cards */}
                <View style={{
                    flexDirection: 'row',
                    paddingHorizontal: 24,
                    paddingVertical: 16,
                    gap: 12
                }}>
                    <InfoCard icon="time-outline" label="Prep" value={`${recipe.prepTimeMin} min`} />
                    <InfoCard icon="flame-outline" label="Cook" value={`${recipe.cookTimeMin} min`} />
                    <InfoCard icon="people-outline" label="Servings" value={recipe.servings.toString()} />
                    <InfoCard icon="barbell-outline" label="Level" value={recipe.difficulty} />
                </View>

                {/* Nutrition */}
                <View style={{
                    backgroundColor: 'white',
                    marginHorizontal: 24,
                    borderRadius: 16,
                    padding: 16,
                    marginBottom: 16
                }}>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: Colors.light.text.primary,
                        marginBottom: 12
                    }}>
                        Nutrition (per serving)
                    </Text>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                    }}>
                        <NutritionItem label="Calories" value={recipe.nutrition.calories.toString()} />
                        <NutritionItem label="Protein" value={`${recipe.nutrition.protein}g`} />
                        <NutritionItem label="Carbs" value={`${recipe.nutrition.carbs}g`} />
                        <NutritionItem label="Fat" value={`${recipe.nutrition.fat}g`} />
                    </View>
                </View>

                {/* Ingredients */}
                <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
                    <Text style={{
                        fontSize: 18,
                        fontWeight: 'bold',
                        color: Colors.light.text.primary,
                        marginBottom: 12
                    }}>
                        Ingredients
                    </Text>
                    {recipe.ingredients.map((ingredient, index) => (
                        <View key={index} style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginBottom: 8,
                            paddingVertical: 8,
                            borderBottomWidth: 1,
                            borderBottomColor: Colors.light.border
                        }}>
                            <View style={{
                                width: 6,
                                height: 6,
                                borderRadius: 3,
                                backgroundColor: Colors.primary.main,
                                marginRight: 12
                            }} />
                            <Text style={{
                                fontSize: 16,
                                color: Colors.light.text.primary,
                                flex: 1
                            }}>
                                {ingredient.amount} {ingredient.unit} {ingredient.name}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Instructions */}
                <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
                    <Text style={{
                        fontSize: 18,
                        fontWeight: 'bold',
                        color: Colors.light.text.primary,
                        marginBottom: 12
                    }}>
                        Instructions
                    </Text>
                    <Text style={{
                        fontSize: 16,
                        color: Colors.light.text.primary,
                        lineHeight: 24
                    }}>
                        {recipe.instructions}
                    </Text>
                </View>
            </ScrollView>

            {/* Bottom Action Buttons */}
            <View style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: 'white',
                paddingHorizontal: 24,
                paddingTop: 16,
                paddingBottom: 16 + insets.bottom,
                borderTopWidth: 1,
                borderTopColor: Colors.light.border
            }}>
                {fromPlanner ? (
                    // Show Swap and Timer buttons when accessed from planner
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                backgroundColor: Colors.light.surface,
                                paddingVertical: 14,
                                borderRadius: 12,
                                alignItems: 'center',
                                borderWidth: 1,
                                borderColor: Colors.light.border
                            }}
                            onPress={handleSwap}
                        >
                            <Text style={{
                                fontSize: 16,
                                fontWeight: '600',
                                color: Colors.light.text.primary
                            }}>
                                Swap Meal
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                backgroundColor: Colors.primary.main,
                                paddingVertical: 14,
                                borderRadius: 12,
                                alignItems: 'center'
                            }}
                            onPress={handleTimer}
                        >
                            <Text style={{
                                fontSize: 16,
                                fontWeight: '600',
                                color: 'white'
                            }}>
                                Start Timer
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    // Show Delete or Save button when not from planner
                    isCustom && isOwner ? (
                        <TouchableOpacity
                            style={{
                                backgroundColor: '#EF4444',
                                paddingVertical: 14,
                                borderRadius: 12,
                                alignItems: 'center'
                            }}
                            onPress={handleDelete}
                        >
                            <Text style={{
                                fontSize: 16,
                                fontWeight: '600',
                                color: 'white'
                            }}>
                                Delete Recipe
                            </Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            style={{
                                backgroundColor: Colors.primary.main,
                                paddingVertical: 14,
                                borderRadius: 12,
                                alignItems: 'center'
                            }}
                            onPress={handleSaveAsCustom}
                        >
                            <Text style={{
                                fontSize: 16,
                                fontWeight: '600',
                                color: 'white'
                            }}>
                                Save as Custom Recipe
                            </Text>
                        </TouchableOpacity>
                    )
                )}
            </View>
        </View>
    );
}

interface InfoCardProps {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    value: string;
}

function InfoCard({ icon, label, value }: InfoCardProps) {
    return (
        <View style={{
            flex: 1,
            backgroundColor: 'white',
            padding: 12,
            borderRadius: 12,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 2
        }}>
            <Ionicons name={icon} size={24} color={Colors.primary.main} style={{ marginBottom: 4 }} />
            <Text style={{
                fontSize: 12,
                color: Colors.light.text.tertiary,
                marginBottom: 2
            }}>
                {label}
            </Text>
            <Text style={{
                fontSize: 14,
                fontWeight: '600',
                color: Colors.light.text.primary
            }}>
                {value}
            </Text>
        </View>
    );
}

interface NutritionItemProps {
    label: string;
    value: string;
}

function NutritionItem({ label, value }: NutritionItemProps) {
    return (
        <View style={{ alignItems: 'center' }}>
            <Text style={{
                fontSize: 12,
                color: Colors.light.text.tertiary,
                marginBottom: 4
            }}>
                {label}
            </Text>
            <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: Colors.primary.main
            }}>
                {value}
            </Text>
        </View>
    );
}
