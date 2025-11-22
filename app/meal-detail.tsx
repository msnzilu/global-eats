import { Colors } from '@/utils/constants';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MealDetail() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const params = useLocalSearchParams();

    // Mock data - will be replaced with actual meal data
    const meal = {
        name: 'Chicken Tikka Masala',
        cuisine: 'Indian',
        image: 'https://via.placeholder.com/400x300',
        servings: 4,
        prepTime: 20,
        cookTime: 30,
        calories: 450,
        protein: 35,
        carbs: 25,
        fat: 20,
        ingredients: [
            { name: 'Chicken Breast', amount: 500, unit: 'g', inInventory: true },
            { name: 'Yogurt', amount: 200, unit: 'ml', inInventory: true },
            { name: 'Tomato Sauce', amount: 400, unit: 'ml', inInventory: false },
            { name: 'Garam Masala', amount: 2, unit: 'tbsp', inInventory: true },
            { name: 'Garlic', amount: 4, unit: 'cloves', inInventory: true },
        ],
        instructions: `1. Marinate chicken in yogurt and spices for 30 minutes
2. Heat oil in a pan and cook chicken until golden
3. Add tomato sauce and simmer for 15 minutes
4. Garnish with cream and cilantro
5. Serve hot with rice or naan`,
        prepNotes: 'Marinate chicken overnight for best flavor'
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
                    {meal.name}
                </Text>
            </View>

            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{
                    paddingBottom: 120 + insets.bottom
                }}
            >
                {/* Meal Image */}
                <View style={{
                    height: 250,
                    backgroundColor: Colors.light.surface
                }}>
                    {/* Placeholder for image */}
                    <View style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Ionicons name="restaurant" size={64} color={Colors.light.text.tertiary} />
                    </View>

                    {/* Cuisine Badge */}
                    <View style={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        backgroundColor: Colors.primary.main,
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: 20
                    }}>
                        <Text style={{ fontSize: 12, fontWeight: '600', color: 'white' }}>
                            {meal.cuisine}
                        </Text>
                    </View>
                </View>

                {/* Nutrition Summary */}
                <View style={{
                    flexDirection: 'row',
                    backgroundColor: 'white',
                    paddingVertical: 16,
                    paddingHorizontal: 24,
                    borderBottomWidth: 1,
                    borderBottomColor: Colors.light.border
                }}>
                    <NutritionItem label="Calories" value={meal.calories.toString()} color={Colors.primary.main} />
                    <NutritionItem label="Protein" value={`${meal.protein}g`} color={Colors.secondary.main} />
                    <NutritionItem label="Carbs" value={`${meal.carbs}g`} color={Colors.primary.dark} />
                    <NutritionItem label="Fat" value={`${meal.fat}g`} color="#F59E0B" />
                </View>

                {/* Prep Notes */}
                {meal.prepNotes && (
                    <View style={{
                        backgroundColor: `${Colors.secondary.main}15`,
                        padding: 16,
                        marginHorizontal: 24,
                        marginTop: 16,
                        borderRadius: 12,
                        flexDirection: 'row'
                    }}>
                        <Ionicons name="bulb" size={20} color={Colors.secondary.main} style={{ marginRight: 12 }} />
                        <Text style={{
                            flex: 1,
                            fontSize: 14,
                            color: Colors.light.text.secondary,
                            lineHeight: 20
                        }}>
                            <Text style={{ fontWeight: '600' }}>Tip: </Text>
                            {meal.prepNotes}
                        </Text>
                    </View>
                )}

                {/* Ingredients */}
                <View style={{ paddingHorizontal: 24, marginTop: 24 }}>
                    <Text style={{
                        fontSize: 18,
                        fontWeight: 'bold',
                        color: Colors.light.text.primary,
                        marginBottom: 16
                    }}>
                        Ingredients ({meal.servings} servings)
                    </Text>
                    {meal.ingredients.map((ingredient, index) => (
                        <View
                            key={index}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingVertical: 12,
                                borderBottomWidth: index < meal.ingredients.length - 1 ? 1 : 0,
                                borderBottomColor: Colors.light.border
                            }}
                        >
                            <View style={{
                                width: 24,
                                height: 24,
                                borderRadius: 12,
                                backgroundColor: ingredient.inInventory ? `${Colors.secondary.main}20` : Colors.light.surface,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: 12
                            }}>
                                {ingredient.inInventory && (
                                    <Ionicons name="checkmark" size={16} color={Colors.secondary.main} />
                                )}
                            </View>
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
                <View style={{ paddingHorizontal: 24, marginTop: 24 }}>
                    <Text style={{
                        fontSize: 18,
                        fontWeight: 'bold',
                        color: Colors.light.text.primary,
                        marginBottom: 16
                    }}>
                        Instructions
                    </Text>
                    <Text style={{
                        fontSize: 15,
                        color: Colors.light.text.secondary,
                        lineHeight: 24,
                        whiteSpace: 'pre-line'
                    }}>
                        {meal.instructions}
                    </Text>
                </View>
            </ScrollView>

            {/* Action Buttons */}
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
                    onPress={() => {/* TODO: Implement swap */ }}
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
                    onPress={() => {/* TODO: Implement timer */ }}
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
        <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{
                fontSize: 20,
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
