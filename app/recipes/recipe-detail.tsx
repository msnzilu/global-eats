import { Colors } from '@/utils/constants';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function RecipeDetail() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const params = useLocalSearchParams();

    // Mock data - will be replaced with actual recipe data
    const recipe = {
        id: '1',
        name: 'Mediterranean Quinoa Bowl',
        source: 'custom', // 'custom' or 'spoonacular'
        cuisine: 'Mediterranean',
        servings: 2,
        prepTime: 15,
        cookTime: 20,
        calories: 380,
        protein: 18,
        carbs: 45,
        fat: 15,
        ingredients: [
            { name: 'Quinoa', amount: 200, unit: 'g' },
            { name: 'Cherry Tomatoes', amount: 150, unit: 'g' },
            { name: 'Cucumber', amount: 1, unit: 'piece' },
            { name: 'Feta Cheese', amount: 100, unit: 'g' },
            { name: 'Olive Oil', amount: 2, unit: 'tbsp' },
            { name: 'Lemon Juice', amount: 1, unit: 'tbsp' },
        ],
        instructions: `1. Cook quinoa according to package instructions
2. Dice tomatoes and cucumber
3. Crumble feta cheese
4. Mix all ingredients in a bowl
5. Drizzle with olive oil and lemon juice
6. Season with salt and pepper to taste`,
        difficulty: 'Easy'
    };

    const isCustom = recipe.source === 'custom';

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
                    <InfoCard icon="time-outline" label="Prep" value={`${recipe.prepTime} min`} />
                    <InfoCard icon="flame-outline" label="Cook" value={`${recipe.cookTime} min`} />
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
                        <NutritionItem label="Calories" value={recipe.calories.toString()} color={Colors.primary.main} />
                        <NutritionItem label="Protein" value={`${recipe.protein}g`} color={Colors.secondary.main} />
                        <NutritionItem label="Carbs" value={`${recipe.carbs}g`} color={Colors.primary.dark} />
                        <NutritionItem label="Fat" value={`${recipe.fat}g`} color="#F59E0B" />
                    </View>
                </View>

                {/* Ingredients */}
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
                        Ingredients
                    </Text>
                    {recipe.ingredients.map((ingredient, index) => (
                        <View
                            key={index}
                            style={{
                                flexDirection: 'row',
                                paddingVertical: 8,
                                borderBottomWidth: index < recipe.ingredients.length - 1 ? 1 : 0,
                                borderBottomColor: Colors.light.border
                            }}
                        >
                            <View style={{
                                width: 6,
                                height: 6,
                                borderRadius: 3,
                                backgroundColor: Colors.primary.main,
                                marginTop: 8,
                                marginRight: 12
                            }} />
                            <Text style={{
                                flex: 1,
                                fontSize: 15,
                                color: Colors.light.text.primary
                            }}>
                                {ingredient.name}
                            </Text>
                            <Text style={{
                                fontSize: 14,
                                color: Colors.light.text.secondary,
                                fontWeight: '500'
                            }}>
                                {ingredient.amount} {ingredient.unit}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Instructions */}
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
                        Instructions
                    </Text>
                    <Text style={{
                        fontSize: 15,
                        color: Colors.light.text.secondary,
                        lineHeight: 24
                    }}>
                        {recipe.instructions}
                    </Text>
                </View>

                {/* Action Buttons */}
                <View style={{ paddingHorizontal: 24, paddingBottom: 24, gap: 12 }}>
                    <TouchableOpacity
                        onPress={() => router.push('/recipes/cooking-timer')}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: Colors.primary.main,
                            paddingVertical: 16,
                            borderRadius: 12,
                            gap: 8
                        }}
                    >
                        <Ionicons name="timer-outline" size={24} color="white" />
                        <Text style={{
                            fontSize: 16,
                            fontWeight: '600',
                            color: 'white'
                        }}>
                            Start Cooking Timer
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => router.push('/recipes/swap-meal')}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: Colors.secondary.main,
                            paddingVertical: 16,
                            borderRadius: 12,
                            gap: 8
                        }}
                    >
                        <Ionicons name="swap-horizontal" size={24} color="white" />
                        <Text style={{
                            fontSize: 16,
                            fontWeight: '600',
                            color: 'white'
                        }}>
                            Swap This Meal
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Bottom Action Button */}
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
                {isCustom ? (
                    <TouchableOpacity
                        style={{
                            backgroundColor: '#EF4444',
                            paddingVertical: 14,
                            borderRadius: 12,
                            alignItems: 'center'
                        }}
                        onPress={() => {/* TODO: Implement delete */ }}
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
                        onPress={() => {/* TODO: Implement fork */ }}
                    >
                        <Text style={{
                            fontSize: 16,
                            fontWeight: '600',
                            color: 'white'
                        }}>
                            Save as Custom Recipe
                        </Text>
                    </TouchableOpacity>
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
            borderRadius: 12,
            padding: 12,
            alignItems: 'center'
        }}>
            <Ionicons name={icon} size={20} color={Colors.primary.main} style={{ marginBottom: 4 }} />
            <Text style={{
                fontSize: 14,
                fontWeight: 'bold',
                color: Colors.light.text.primary,
                marginBottom: 2
            }}>
                {value}
            </Text>
            <Text style={{
                fontSize: 11,
                color: Colors.light.text.secondary
            }}>
                {label}
            </Text>
        </View>
    );
}

interface NutritionItemProps {
    label: string;
    value: string;
    color: string;
}

function NutritionItem({ label, value, color }: NutritionItemProps) {
    return (
        <View style={{ alignItems: 'center' }}>
            <Text style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: color,
                marginBottom: 4
            }}>
                {value}
            </Text>
            <Text style={{
                fontSize: 12,
                color: Colors.light.text.secondary
            }}>
                {label}
            </Text>
        </View>
    );
}
