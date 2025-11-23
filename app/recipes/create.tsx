import { useRecipes } from '@/hooks/useRecipes';
import { RecipeDifficulty } from '@/types';
import { Colors } from '@/utils/constants';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CreateRecipe() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { addRecipe } = useRecipes();

    const [recipeName, setRecipeName] = useState('');
    const [description, setDescription] = useState('');
    const [cuisine, setCuisine] = useState('');
    const [difficulty, setDifficulty] = useState<RecipeDifficulty>('Medium');
    const [servings, setServings] = useState('4');
    const [prepTime, setPrepTime] = useState('');
    const [cookTime, setCookTime] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [instructions, setInstructions] = useState('');
    const [calories, setCalories] = useState('');
    const [protein, setProtein] = useState('');
    const [carbs, setCarbs] = useState('');
    const [fat, setFat] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        // Validation
        if (!recipeName.trim()) {
            Alert.alert('Error', 'Please enter a recipe name');
            return;
        }
        if (!cuisine.trim()) {
            Alert.alert('Error', 'Please enter a cuisine type');
            return;
        }
        if (!ingredients.trim()) {
            Alert.alert('Error', 'Please enter ingredients');
            return;
        }
        if (!instructions.trim()) {
            Alert.alert('Error', 'Please enter cooking instructions');
            return;
        }
        if (!prepTime || !cookTime) {
            Alert.alert('Error', 'Please enter prep and cook times');
            return;
        }

        setLoading(true);
        try {
            // Parse ingredients from text (simple line-by-line parsing)
            const ingredientsList = ingredients
                .split('\n')
                .filter(line => line.trim())
                .map(line => {
                    // Simple parsing: "500g chicken breast" -> {name: "chicken breast", amount: 500, unit: "g"}
                    const match = line.match(/^(\d+(?:\.\d+)?)\s*([a-zA-Z]+)\s+(.+)$/);
                    if (match) {
                        return {
                            name: match[3].trim(),
                            amount: parseFloat(match[1]),
                            unit: match[2]
                        };
                    }
                    // Fallback: treat whole line as ingredient name
                    return {
                        name: line.trim(),
                        amount: 1,
                        unit: 'piece'
                    };
                });

            await addRecipe({
                name: recipeName.trim(),
                ...(description.trim() && { description: description.trim() }),
                cuisine: cuisine.trim(),
                difficulty,
                servings: parseInt(servings) || 4,
                prepTimeMin: parseInt(prepTime),
                cookTimeMin: parseInt(cookTime),
                nutrition: {
                    calories: calories ? parseFloat(calories) : 0,
                    protein: protein ? parseFloat(protein) : 0,
                    carbs: carbs ? parseFloat(carbs) : 0,
                    fat: fat ? parseFloat(fat) : 0,
                },
                ingredients: ingredientsList,
                instructions: instructions.trim(),
                isPublic: true, // Custom recipes are public by default
            });

            Alert.alert('Success', 'Recipe created successfully!', [
                { text: 'OK', onPress: () => router.back() }
            ]);
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to create recipe');
        } finally {
            setLoading(false);
        }
    };

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
                <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>
                    Create Recipe
                </Text>
            </View>

            <ScrollView
                contentContainerStyle={{
                    padding: 24,
                    paddingBottom: insets.bottom + 100
                }}
            >
                {/* Recipe Name */}
                <View style={{ marginBottom: 20 }}>
                    <Text style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: Colors.light.text.secondary,
                        marginBottom: 8
                    }}>
                        Recipe Name *
                    </Text>
                    <TextInput
                        style={{
                            backgroundColor: 'white',
                            borderRadius: 12,
                            padding: 16,
                            fontSize: 16,
                            borderWidth: 1,
                            borderColor: Colors.light.border
                        }}
                        placeholder="e.g., Chicken Tikka Masala"
                        value={recipeName}
                        onChangeText={setRecipeName}
                    />
                </View>

                {/* Description */}
                <View style={{ marginBottom: 20 }}>
                    <Text style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: Colors.light.text.secondary,
                        marginBottom: 8
                    }}>
                        Description (optional)
                    </Text>
                    <TextInput
                        style={{
                            backgroundColor: 'white',
                            borderRadius: 12,
                            padding: 16,
                            fontSize: 16,
                            borderWidth: 1,
                            borderColor: Colors.light.border,
                            minHeight: 80,
                            textAlignVertical: 'top'
                        }}
                        placeholder="Brief description of your recipe..."
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        numberOfLines={3}
                    />
                </View>

                {/* Cuisine & Servings Row */}
                <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{
                            fontSize: 14,
                            fontWeight: '600',
                            color: Colors.light.text.secondary,
                            marginBottom: 8
                        }}>
                            Cuisine
                        </Text>
                        <TextInput
                            style={{
                                backgroundColor: 'white',
                                borderRadius: 12,
                                padding: 16,
                                fontSize: 16,
                                borderWidth: 1,
                                borderColor: Colors.light.border
                            }}
                            placeholder="e.g., Indian"
                            value={cuisine}
                            onChangeText={setCuisine}
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={{
                            fontSize: 14,
                            fontWeight: '600',
                            color: Colors.light.text.secondary,
                            marginBottom: 8
                        }}>
                            Servings
                        </Text>
                        <TextInput
                            style={{
                                backgroundColor: 'white',
                                borderRadius: 12,
                                padding: 16,
                                fontSize: 16,
                                borderWidth: 1,
                                borderColor: Colors.light.border
                            }}
                            placeholder="4"
                            value={servings}
                            onChangeText={setServings}
                            keyboardType="number-pad"
                        />
                    </View>
                </View>

                {/* Prep & Cook Time Row */}
                <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{
                            fontSize: 14,
                            fontWeight: '600',
                            color: Colors.light.text.secondary,
                            marginBottom: 8
                        }}>
                            Prep Time (min)
                        </Text>
                        <TextInput
                            style={{
                                backgroundColor: 'white',
                                borderRadius: 12,
                                padding: 16,
                                fontSize: 16,
                                borderWidth: 1,
                                borderColor: Colors.light.border
                            }}
                            placeholder="20"
                            value={prepTime}
                            onChangeText={setPrepTime}
                            keyboardType="number-pad"
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={{
                            fontSize: 14,
                            fontWeight: '600',
                            color: Colors.light.text.secondary,
                            marginBottom: 8
                        }}>
                            Cook Time (min)
                        </Text>
                        <TextInput
                            style={{
                                backgroundColor: 'white',
                                borderRadius: 12,
                                padding: 16,
                                fontSize: 16,
                                borderWidth: 1,
                                borderColor: Colors.light.border
                            }}
                            placeholder="30"
                            value={cookTime}
                            onChangeText={setCookTime}
                            keyboardType="number-pad"
                        />
                    </View>
                </View>

                {/* Nutrition Section */}
                <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    marginBottom: 12,
                    marginTop: 8
                }}>
                    Nutrition (per serving)
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
                    <View style={{ flex: 1, minWidth: '45%' }}>
                        <Text style={{
                            fontSize: 14,
                            fontWeight: '600',
                            color: Colors.light.text.secondary,
                            marginBottom: 8
                        }}>
                            Calories
                        </Text>
                        <TextInput
                            style={{
                                backgroundColor: 'white',
                                borderRadius: 12,
                                padding: 16,
                                fontSize: 16,
                                borderWidth: 1,
                                borderColor: Colors.light.border
                            }}
                            placeholder="450"
                            value={calories}
                            onChangeText={setCalories}
                            keyboardType="number-pad"
                        />
                    </View>
                    <View style={{ flex: 1, minWidth: '45%' }}>
                        <Text style={{
                            fontSize: 14,
                            fontWeight: '600',
                            color: Colors.light.text.secondary,
                            marginBottom: 8
                        }}>
                            Protein (g)
                        </Text>
                        <TextInput
                            style={{
                                backgroundColor: 'white',
                                borderRadius: 12,
                                padding: 16,
                                fontSize: 16,
                                borderWidth: 1,
                                borderColor: Colors.light.border
                            }}
                            placeholder="35"
                            value={protein}
                            onChangeText={setProtein}
                            keyboardType="number-pad"
                        />
                    </View>
                    <View style={{ flex: 1, minWidth: '45%' }}>
                        <Text style={{
                            fontSize: 14,
                            fontWeight: '600',
                            color: Colors.light.text.secondary,
                            marginBottom: 8
                        }}>
                            Carbs (g)
                        </Text>
                        <TextInput
                            style={{
                                backgroundColor: 'white',
                                borderRadius: 12,
                                padding: 16,
                                fontSize: 16,
                                borderWidth: 1,
                                borderColor: Colors.light.border
                            }}
                            placeholder="25"
                            value={carbs}
                            onChangeText={setCarbs}
                            keyboardType="number-pad"
                        />
                    </View>
                    <View style={{ flex: 1, minWidth: '45%' }}>
                        <Text style={{
                            fontSize: 14,
                            fontWeight: '600',
                            color: Colors.light.text.secondary,
                            marginBottom: 8
                        }}>
                            Fat (g)
                        </Text>
                        <TextInput
                            style={{
                                backgroundColor: 'white',
                                borderRadius: 12,
                                padding: 16,
                                fontSize: 16,
                                borderWidth: 1,
                                borderColor: Colors.light.border
                            }}
                            placeholder="20"
                            value={fat}
                            onChangeText={setFat}
                            keyboardType="number-pad"
                        />
                    </View>
                </View>

                {/* Ingredients */}
                <View style={{ marginBottom: 20 }}>
                    <Text style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: Colors.light.text.secondary,
                        marginBottom: 8
                    }}>
                        Ingredients *
                    </Text>
                    <TextInput
                        style={{
                            backgroundColor: 'white',
                            borderRadius: 12,
                            padding: 16,
                            fontSize: 16,
                            borderWidth: 1,
                            borderColor: Colors.light.border,
                            minHeight: 120,
                            textAlignVertical: 'top'
                        }}
                        placeholder="Enter each ingredient on a new line&#10;e.g.,&#10;500g chicken breast&#10;2 cups rice&#10;1 onion, diced"
                        value={ingredients}
                        onChangeText={setIngredients}
                        multiline
                        numberOfLines={6}
                    />
                </View>

                {/* Instructions */}
                <View style={{ marginBottom: 20 }}>
                    <Text style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: Colors.light.text.secondary,
                        marginBottom: 8
                    }}>
                        Instructions *
                    </Text>
                    <TextInput
                        style={{
                            backgroundColor: 'white',
                            borderRadius: 12,
                            padding: 16,
                            fontSize: 16,
                            borderWidth: 1,
                            borderColor: Colors.light.border,
                            minHeight: 150,
                            textAlignVertical: 'top'
                        }}
                        placeholder="Enter step-by-step instructions&#10;e.g.,&#10;1. Heat oil in a pan&#10;2. Add onions and cook until soft&#10;3. Add chicken and cook until browned"
                        value={instructions}
                        onChangeText={setInstructions}
                        multiline
                        numberOfLines={8}
                    />
                </View>

                {/* Info Note */}
                <View style={{
                    backgroundColor: `${Colors.primary.main}10`,
                    borderRadius: 12,
                    padding: 16,
                    borderLeftWidth: 4,
                    borderLeftColor: Colors.primary.main
                }}>
                    <Text style={{
                        fontSize: 13,
                        color: Colors.light.text.secondary,
                        lineHeight: 18
                    }}>
                        💡 Tip: Add detailed instructions to make your recipe easy to follow. You can edit this recipe anytime from your recipes list.
                    </Text>
                </View>
            </ScrollView>

            {/* Bottom Action Bar */}
            <View style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: 'white',
                padding: 24,
                paddingBottom: 24 + insets.bottom,
                borderTopWidth: 1,
                borderTopColor: Colors.light.border,
                flexDirection: 'row',
                gap: 12
            }}>
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
                    onPress={() => router.back()}
                >
                    <Text style={{
                        fontSize: 16,
                        fontWeight: '600',
                        color: Colors.light.text.secondary
                    }}>
                        Cancel
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{
                        flex: 2,
                        backgroundColor: Colors.primary.main,
                        paddingVertical: 14,
                        borderRadius: 12,
                        alignItems: 'center',
                        opacity: loading ? 0.7 : 1
                    }}
                    onPress={handleSave}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={{
                            fontSize: 16,
                            fontWeight: '600',
                            color: 'white'
                        }}>
                            Save Recipe
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}
