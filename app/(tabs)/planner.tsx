import { Colors } from '@/utils/constants';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Meal {
    id: string;
    name: string;
    cuisine: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    mealType: 'breakfast' | 'lunch' | 'dinner';
}

interface DayPlan {
    date: string;
    dayName: string;
    meals: Meal[];
}

export default function Planner() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [currentDayIndex, setCurrentDayIndex] = useState(0);

    // Mock 7-day meal plan - showing 1-3 meals per day based on user preference
    const mockPlan: DayPlan[] = [
        {
            date: '2024-01-15',
            dayName: 'Monday',
            meals: [
                { id: '1', name: 'Avocado Toast with Eggs', cuisine: 'American', calories: 320, protein: 18, carbs: 28, fat: 16, mealType: 'breakfast' },
                { id: '2', name: 'Chicken Tikka Masala', cuisine: 'Indian', calories: 450, protein: 35, carbs: 25, fat: 20, mealType: 'lunch' },
                { id: '3', name: 'Mediterranean Quinoa Bowl', cuisine: 'Mediterranean', calories: 380, protein: 18, carbs: 45, fat: 15, mealType: 'dinner' }
            ]
        },
        {
            date: '2024-01-16',
            dayName: 'Tuesday',
            meals: [
                { id: '4', name: 'Thai Green Curry', cuisine: 'Thai', calories: 420, protein: 28, carbs: 32, fat: 22, mealType: 'lunch' },
                { id: '5', name: 'Mexican Street Tacos', cuisine: 'Mexican', calories: 320, protein: 25, carbs: 28, fat: 12, mealType: 'dinner' }
            ]
        },
        {
            date: '2024-01-17',
            dayName: 'Wednesday',
            meals: [
                { id: '6', name: 'Korean Bibimbap', cuisine: 'Korean', calories: 620, protein: 35, carbs: 75, fat: 18, mealType: 'lunch' }
            ]
        },
        {
            date: '2024-01-18',
            dayName: 'Thursday',
            meals: [
                { id: '7', name: 'Greek Yogurt Parfait', cuisine: 'Greek', calories: 280, protein: 20, carbs: 35, fat: 8, mealType: 'breakfast' },
                { id: '8', name: 'Japanese Teriyaki Salmon', cuisine: 'Japanese', calories: 400, protein: 35, carbs: 20, fat: 22, mealType: 'lunch' },
                { id: '9', name: 'Greek Moussaka', cuisine: 'Greek', calories: 450, protein: 28, carbs: 30, fat: 24, mealType: 'dinner' }
            ]
        },
        {
            date: '2024-01-19',
            dayName: 'Friday',
            meals: [
                { id: '10', name: 'Chinese Kung Pao Chicken', cuisine: 'Chinese', calories: 440, protein: 32, carbs: 35, fat: 20, mealType: 'lunch' },
                { id: '11', name: 'French Ratatouille', cuisine: 'French', calories: 280, protein: 12, carbs: 38, fat: 10, mealType: 'dinner' }
            ]
        },
        {
            date: '2024-01-20',
            dayName: 'Saturday',
            meals: [
                { id: '12', name: 'Protein Smoothie Bowl', cuisine: 'American', calories: 350, protein: 25, carbs: 42, fat: 12, mealType: 'breakfast' },
                { id: '13', name: 'American BBQ Chicken', cuisine: 'American', calories: 500, protein: 40, carbs: 30, fat: 25, mealType: 'lunch' },
                { id: '14', name: 'Vietnamese Pho', cuisine: 'Vietnamese', calories: 350, protein: 25, carbs: 40, fat: 8, mealType: 'dinner' }
            ]
        },
        {
            date: '2024-01-21',
            dayName: 'Sunday',
            meals: [
                { id: '15', name: 'Spanish Paella', cuisine: 'Spanish', calories: 580, protein: 35, carbs: 60, fat: 20, mealType: 'lunch' }
            ]
        }
    ];

    const currentDay = mockPlan[currentDayIndex];
    const dailyCalories = currentDay.meals.reduce((sum, m) => sum + m.calories, 0);
    const dailyProtein = currentDay.meals.reduce((sum, m) => sum + m.protein, 0);

    const goToPreviousDay = () => {
        if (currentDayIndex > 0) {
            setCurrentDayIndex(currentDayIndex - 1);
        }
    };

    const goToNextDay = () => {
        if (currentDayIndex < mockPlan.length - 1) {
            setCurrentDayIndex(currentDayIndex + 1);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: Colors.light.background }}>
            {/* Header */}
            <View style={{
                backgroundColor: Colors.primary.main,
                paddingTop: insets.top + 16,
                paddingBottom: 20,
                paddingHorizontal: 24
            }}>
                <Text style={{
                    fontSize: 28,
                    fontWeight: 'bold',
                    color: 'white',
                    marginBottom: 8
                }}>
                    Today's Plan
                </Text>
                <Text style={{
                    fontSize: 14,
                    color: 'rgba(255, 255, 255, 0.9)'
                }}>
                    {currentDay.meals.length} {currentDay.meals.length === 1 ? 'meal' : 'meals'} • {dailyCalories} cal • {dailyProtein}g protein
                </Text>
            </View>

            {/* Day Navigation */}
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'white',
                marginHorizontal: 24,
                marginTop: 16,
                borderRadius: 12,
                padding: 16,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2
            }}>
                <TouchableOpacity
                    onPress={goToPreviousDay}
                    disabled={currentDayIndex === 0}
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: currentDayIndex === 0 ? Colors.light.surface : `${Colors.primary.main}15`,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Ionicons
                        name="chevron-back"
                        size={24}
                        color={currentDayIndex === 0 ? Colors.light.text.tertiary : Colors.primary.main}
                    />
                </TouchableOpacity>

                <View style={{ alignItems: 'center' }}>
                    <Text style={{
                        fontSize: 20,
                        fontWeight: 'bold',
                        color: Colors.light.text.primary,
                        marginBottom: 4
                    }}>
                        {currentDay.dayName}
                    </Text>
                    <Text style={{
                        fontSize: 12,
                        color: Colors.light.text.secondary
                    }}>
                        Day {currentDayIndex + 1} of {mockPlan.length}
                    </Text>
                </View>

                <TouchableOpacity
                    onPress={goToNextDay}
                    disabled={currentDayIndex === mockPlan.length - 1}
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: currentDayIndex === mockPlan.length - 1 ? Colors.light.surface : `${Colors.primary.main}15`,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Ionicons
                        name="chevron-forward"
                        size={24}
                        color={currentDayIndex === mockPlan.length - 1 ? Colors.light.text.tertiary : Colors.primary.main}
                    />
                </TouchableOpacity>
            </View>

            {/* Day Progress Dots */}
            <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                gap: 8,
                marginTop: 16,
                marginBottom: 8
            }}>
                {mockPlan.map((_, index) => (
                    <View
                        key={index}
                        style={{
                            width: index === currentDayIndex ? 24 : 8,
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: index === currentDayIndex
                                ? Colors.primary.main
                                : Colors.light.border
                        }}
                    />
                ))}
            </View>

            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{
                    paddingHorizontal: 24,
                    paddingTop: 16,
                    paddingBottom: 80
                }}
                showsVerticalScrollIndicator={false}
            >
                {/* Meals for Current Day */}
                {currentDay.meals.map((meal) => (
                    <TouchableOpacity
                        key={meal.id}
                        style={{
                            backgroundColor: 'white',
                            borderRadius: 16,
                            padding: 20,
                            marginBottom: 16,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 8,
                            elevation: 3
                        }}
                        onPress={() => router.push('/recipes/recipe-detail')}
                        activeOpacity={0.7}
                    >
                        {/* Meal Type Badge */}
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginBottom: 12
                        }}>
                            <View style={{
                                backgroundColor: `${Colors.secondary.main}20`,
                                paddingHorizontal: 10,
                                paddingVertical: 6,
                                borderRadius: 8,
                                marginRight: 8
                            }}>
                                <Text style={{
                                    fontSize: 12,
                                    fontWeight: '700',
                                    color: Colors.secondary.main,
                                    textTransform: 'uppercase',
                                    letterSpacing: 0.5
                                }}>
                                    {meal.mealType}
                                </Text>
                            </View>
                            <View style={{
                                backgroundColor: `${Colors.primary.main}15`,
                                paddingHorizontal: 10,
                                paddingVertical: 6,
                                borderRadius: 8
                            }}>
                                <Text style={{
                                    fontSize: 11,
                                    fontWeight: '600',
                                    color: Colors.primary.main
                                }}>
                                    {meal.cuisine}
                                </Text>
                            </View>
                        </View>

                        {/* Meal Name */}
                        <Text style={{
                            fontSize: 18,
                            fontWeight: '700',
                            color: Colors.light.text.primary,
                            marginBottom: 12
                        }}>
                            {meal.name}
                        </Text>

                        {/* Nutrition Info */}
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            paddingTop: 12,
                            borderTopWidth: 1,
                            borderTopColor: Colors.light.border
                        }}>
                            <View style={{ flexDirection: 'row', gap: 20 }}>
                                <View>
                                    <Text style={{
                                        fontSize: 11,
                                        color: Colors.light.text.tertiary,
                                        marginBottom: 4
                                    }}>
                                        Calories
                                    </Text>
                                    <Text style={{
                                        fontSize: 16,
                                        fontWeight: '700',
                                        color: Colors.primary.main
                                    }}>
                                        {meal.calories}
                                    </Text>
                                </View>
                                <View>
                                    <Text style={{
                                        fontSize: 11,
                                        color: Colors.light.text.tertiary,
                                        marginBottom: 4
                                    }}>
                                        Protein
                                    </Text>
                                    <Text style={{
                                        fontSize: 16,
                                        fontWeight: '700',
                                        color: Colors.secondary.main
                                    }}>
                                        {meal.protein}g
                                    </Text>
                                </View>
                                <View>
                                    <Text style={{
                                        fontSize: 11,
                                        color: Colors.light.text.tertiary,
                                        marginBottom: 4
                                    }}>
                                        Carbs
                                    </Text>
                                    <Text style={{
                                        fontSize: 16,
                                        fontWeight: '700',
                                        color: Colors.light.text.secondary
                                    }}>
                                        {meal.carbs}g
                                    </Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                onPress={() => {/* TODO: Swap meal */ }}
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 20,
                                    backgroundColor: `${Colors.primary.main}15`,
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Ionicons name="swap-horizontal" size={22} color={Colors.primary.main} />
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                ))}

                {/* Empty State */}
                {currentDay.meals.length === 0 && (
                    <View style={{
                        alignItems: 'center',
                        paddingVertical: 60
                    }}>
                        <Ionicons name="restaurant-outline" size={64} color={Colors.light.text.tertiary} />
                        <Text style={{
                            fontSize: 18,
                            fontWeight: '600',
                            color: Colors.light.text.primary,
                            marginTop: 16,
                            marginBottom: 8
                        }}>
                            No Meals Planned
                        </Text>
                        <Text style={{
                            fontSize: 14,
                            color: Colors.light.text.secondary,
                            textAlign: 'center'
                        }}>
                            Generate a plan to get started
                        </Text>
                    </View>
                )}
            </ScrollView>

            {/* Bottom Action Bar */}
            <View style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: 'white',
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderTopWidth: 1,
                borderTopColor: Colors.light.border,
                flexDirection: 'row',
                gap: 12
            }}>
                <TouchableOpacity
                    style={{
                        flex: 1,
                        backgroundColor: Colors.light.surface,
                        paddingVertical: 12,
                        borderRadius: 10,
                        alignItems: 'center',
                        borderWidth: 1,
                        borderColor: Colors.light.border
                    }}
                    onPress={() => router.push('/meal-plans/shopping-list')}
                >
                    <Ionicons name="cart-outline" size={20} color={Colors.primary.main} />
                    <Text style={{
                        fontSize: 11,
                        fontWeight: '600',
                        color: Colors.primary.main,
                        marginTop: 4
                    }}>
                        Shopping
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{
                        flex: 2,
                        backgroundColor: Colors.primary.main,
                        paddingVertical: 12,
                        borderRadius: 10,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    onPress={() => router.push('/meal-plans/generate-plan')}
                >
                    <Text style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: 'white'
                    }}>
                        Generate New Plan
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}