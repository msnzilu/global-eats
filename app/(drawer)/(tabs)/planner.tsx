import Sidebar from '@/components/Sidebar';
import SidebarToggle from '@/components/SidebarToggle';
import { useMealPlan } from '@/hooks/useMealPlan';
import { Colors } from '@/utils/constants';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Planner() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [currentDayIndex, setCurrentDayIndex] = useState(0);

    // Use real meal plan data from Firestore
    const { activePlan, loading } = useMealPlan();

    // Automatically set current day based on today's date
    useEffect(() => {
        if (activePlan && activePlan.days.length > 0) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const startDate = activePlan.startDate.toDate ? activePlan.startDate.toDate() : new Date(activePlan.startDate as any);
            startDate.setHours(0, 0, 0, 0);

            const daysDiff = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

            if (daysDiff >= 0 && daysDiff < activePlan.days.length) {
                setCurrentDayIndex(daysDiff);
            } else if (daysDiff >= activePlan.days.length) {
                setCurrentDayIndex(activePlan.days.length - 1);
            } else {
                setCurrentDayIndex(0);
            }
        }
    }, [activePlan?.id]);

    // Get current day data
    const currentDay = activePlan?.days[currentDayIndex];
    const dailyCalories = currentDay?.meals.reduce((sum, m) => sum + m.calories, 0) || 0;
    const dailyProtein = currentDay?.meals.reduce((sum, m) => sum + m.protein, 0) || 0;

    const goToPreviousDay = () => {
        if (currentDayIndex > 0) {
            setCurrentDayIndex(currentDayIndex - 1);
        }
    };

    const goToNextDay = () => {
        if (activePlan && currentDayIndex < activePlan.days.length - 1) {
            setCurrentDayIndex(currentDayIndex + 1);
        }
    };

    // Loading state
    if (loading) {
        return (
            <View style={{ flex: 1, backgroundColor: Colors.light.background }}>
                <View style={{
                    backgroundColor: Colors.primary.main,
                    paddingTop: insets.top + 16,
                    paddingBottom: 20,
                    paddingHorizontal: 24
                }}>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 28, fontWeight: 'bold', color: 'white' }}>
                            Meal Planner
                        </Text>
                        <SidebarToggle onPress={() => setSidebarVisible(true)} />
                    </View>
                </View>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color={Colors.primary.main} />
                    <Text style={{ marginTop: 16, fontSize: 16, color: Colors.light.text.secondary }}>
                        Loading meal plan...
                    </Text>
                </View>
                <Sidebar visible={sidebarVisible} onClose={() => setSidebarVisible(false)} />
            </View>
        );
    }

    // No meal plan state
    if (!activePlan || !currentDay) {
        return (
            <View style={{ flex: 1, backgroundColor: Colors.light.background }}>
                <View style={{
                    backgroundColor: Colors.primary.main,
                    paddingTop: insets.top + 16,
                    paddingBottom: 20,
                    paddingHorizontal: 24,
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between'
                }}>
                    <Text style={{ fontSize: 28, fontWeight: 'bold', color: 'white' }}>
                        Meal Planner
                    </Text>
                    <SidebarToggle onPress={() => setSidebarVisible(true)} />
                </View>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
                    <Ionicons name="calendar-outline" size={80} color={Colors.light.text.tertiary} />
                    <Text style={{
                        fontSize: 22,
                        fontWeight: 'bold',
                        color: Colors.light.text.primary,
                        marginTop: 24,
                        marginBottom: 12
                    }}>
                        No Meal Plan Yet
                    </Text>
                    <Text style={{
                        fontSize: 16,
                        color: Colors.light.text.secondary,
                        textAlign: 'center',
                        marginBottom: 32
                    }}>
                        Generate a personalized meal plan to get started with your nutrition goals
                    </Text>
                    <TouchableOpacity
                        style={{
                            backgroundColor: Colors.primary.main,
                            paddingHorizontal: 32,
                            paddingVertical: 16,
                            borderRadius: 12
                        }}
                        onPress={() => router.push('/planner/create-choice')}
                    >
                        <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                            Create Meal Plan
                        </Text>
                    </TouchableOpacity>
                </View>
                <Sidebar visible={sidebarVisible} onClose={() => setSidebarVisible(false)} />
            </View>
        );
    }

    // Main planner view with real data
    return (
        <View style={{ flex: 1, backgroundColor: Colors.light.background }}>
            {/* Header */}
            <View style={{
                backgroundColor: Colors.primary.main,
                paddingTop: insets.top + 16,
                paddingBottom: 20,
                paddingHorizontal: 24
            }}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <View style={{ flex: 1 }}>
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
                    <SidebarToggle onPress={() => setSidebarVisible(true)} />
                </View>
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
                        {(() => {
                            const startDate = activePlan.startDate.toDate ? activePlan.startDate.toDate() : new Date(activePlan.startDate as any);
                            const date = new Date(startDate);
                            date.setDate(startDate.getDate() + currentDayIndex);
                            return new Intl.DateTimeFormat(undefined, { weekday: 'long' }).format(date);
                        })()}
                    </Text>
                    <Text style={{
                        fontSize: 12,
                        color: Colors.light.text.secondary
                    }}>
                        Day {currentDayIndex + 1} of {activePlan.days.length}
                    </Text>
                </View>

                <TouchableOpacity
                    onPress={goToNextDay}
                    disabled={currentDayIndex === activePlan.days.length - 1}
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: currentDayIndex === activePlan.days.length - 1 ? Colors.light.surface : `${Colors.primary.main}15`,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Ionicons
                        name="chevron-forward"
                        size={24}
                        color={currentDayIndex === activePlan.days.length - 1 ? Colors.light.text.tertiary : Colors.primary.main}
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
                {activePlan.days.map((_, index) => (
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
                        key={meal.recipeId}
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
                        onPress={() => router.push({
                            pathname: '/recipes/recipe-detail',
                            params: {
                                id: meal.recipeId,
                                fromPlanner: 'true',
                                dayIndex: currentDayIndex.toString(),
                                mealType: meal.mealType
                            }
                        })}
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
                            {meal.recipeName}
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
                    onPress={() => router.push('/planner/create-choice')}
                >
                    <Text style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: 'white'
                    }}>
                        Create New Plan
                    </Text>
                </TouchableOpacity>
            </View>

            <Sidebar
                visible={sidebarVisible}
                onClose={() => setSidebarVisible(false)}
            />
        </View>
    );
}