import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/utils/constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    // Get current date info
    const today = new Date();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const dayOfWeek = dayNames[today.getDay()];
    const dayOfMonth = today.getDate();
    const month = monthNames[today.getMonth()];
    const year = today.getFullYear();

    // Sample daily meals - replace with real data from Firestore
    const todaysMeals = [
        {
            id: '1',
            mealType: 'Breakfast',
            time: '8:00 AM',
            name: 'Avocado Toast with Eggs',
            calories: 420,
            protein: 18,
            carbs: 32,
            fat: 24,
            icon: '🍳',
            status: 'completed' // 'upcoming', 'completed', 'in-progress'
        },
        {
            id: '2',
            mealType: 'Lunch',
            time: '1:00 PM',
            name: 'Grilled Chicken Salad',
            calories: 450,
            protein: 35,
            carbs: 28,
            fat: 18,
            icon: '🥗',
            status: 'upcoming'
        },
        {
            id: '3',
            mealType: 'Dinner',
            time: '7:00 PM',
            name: 'Salmon with Quinoa & Veggies',
            calories: 520,
            protein: 40,
            carbs: 45,
            fat: 20,
            icon: '🍽️',
            status: 'upcoming'
        }
    ];

    const totalCalories = todaysMeals.reduce((sum, meal) => sum + meal.calories, 0);
    const completedMeals = todaysMeals.filter(m => m.status === 'completed').length;
    const dailyGoal = 2000; // Get from user profile

    const MealCard = ({ meal }: { meal: typeof todaysMeals[0] }) => (
        <TouchableOpacity
            style={{
                backgroundColor: 'white',
                borderRadius: 16,
                padding: 16,
                marginBottom: 16,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 8,
                elevation: 3,
                borderLeftWidth: 4,
                borderLeftColor: meal.status === 'completed' ? '#10B981' : meal.status === 'in-progress' ? Colors.secondary.main : Colors.primary.main
            }}
            activeOpacity={0.7}
            onPress={() => router.push(`/meals/${meal.id}`)}
        >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                        <Text style={{ fontSize: 14, color: Colors.light.text.secondary, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            {meal.mealType}
                        </Text>
                        {meal.status === 'completed' && (
                            <View style={{ marginLeft: 8, backgroundColor: '#D1FAE5', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 }}>
                                <Text style={{ fontSize: 11, color: '#059669', fontWeight: '600' }}>✓ Done</Text>
                            </View>
                        )}
                    </View>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: Colors.light.text.primary, marginBottom: 4 }}>
                        {meal.name}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontSize: 14, color: Colors.light.text.secondary }}>⏰ {meal.time}</Text>
                    </View>
                </View>
                <Text style={{ fontSize: 40, marginLeft: 12 }}>{meal.icon}</Text>
            </View>

            {/* Nutrition Info */}
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingTop: 12,
                borderTopWidth: 1,
                borderTopColor: Colors.light.border
            }}>
                <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: Colors.primary.main }}>
                        {meal.calories}
                    </Text>
                    <Text style={{ fontSize: 11, color: Colors.light.text.secondary, marginTop: 2 }}>
                        cal
                    </Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: Colors.secondary.main }}>
                        {meal.protein}g
                    </Text>
                    <Text style={{ fontSize: 11, color: Colors.light.text.secondary, marginTop: 2 }}>
                        protein
                    </Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: Colors.primary.dark }}>
                        {meal.carbs}g
                    </Text>
                    <Text style={{ fontSize: 11, color: Colors.light.text.secondary, marginTop: 2 }}>
                        carbs
                    </Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#F59E0B' }}>
                        {meal.fat}g
                    </Text>
                    <Text style={{ fontSize: 11, color: Colors.light.text.secondary, marginTop: 2 }}>
                        fat
                    </Text>
                </View>
            </View>

            {/* Action Button */}
            {meal.status === 'upcoming' && (
                <TouchableOpacity
                    style={{
                        backgroundColor: Colors.primary.main,
                        paddingVertical: 10,
                        borderRadius: 10,
                        marginTop: 12,
                        alignItems: 'center'
                    }}
                    onPress={() => console.log('Start meal')}
                >
                    <Text style={{ color: 'white', fontWeight: '600', fontSize: 14 }}>
                        Start Eating ▶️
                    </Text>
                </TouchableOpacity>
            )}
        </TouchableOpacity>
    );

    return (
        <View style={{ flex: 1, backgroundColor: Colors.light.background }}>
            {/* Header with Date */}
            <View style={{
                backgroundColor: Colors.primary.main,
                paddingTop: insets.top + 16,
                paddingBottom: 24,
                paddingHorizontal: 24
            }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 4 }}>
                            {month} {year}
                        </Text>
                        <Text style={{ fontSize: 32, fontWeight: 'bold', color: 'white', marginBottom: 2 }}>
                            {dayOfWeek}
                        </Text>
                        <Text style={{ fontSize: 18, color: 'rgba(255,255,255,0.9)' }}>
                            Day {dayOfMonth}
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => router.push('/profile')}
                        style={{
                            width: 48,
                            height: 48,
                            borderRadius: 24,
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Text style={{ fontSize: 22 }}>👤</Text>
                    </TouchableOpacity>
                </View>

                {/* Daily Progress Card */}
                <View style={{
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    borderRadius: 16,
                    padding: 16,
                    backdropFilter: 'blur(10px)'
                }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                        <Text style={{ color: 'white', fontSize: 14, fontWeight: '600' }}>
                            Today's Progress
                        </Text>
                        <Text style={{ color: 'white', fontSize: 14, fontWeight: '600' }}>
                            {completedMeals}/{todaysMeals.length} meals
                        </Text>
                    </View>

                    {/* Progress Bar */}
                    <View style={{
                        height: 8,
                        backgroundColor: 'rgba(255,255,255,0.3)',
                        borderRadius: 4,
                        overflow: 'hidden',
                        marginBottom: 12
                    }}>
                        <View style={{
                            height: '100%',
                            width: `${(completedMeals / todaysMeals.length) * 100}%`,
                            backgroundColor: '#10B981'
                        }} />
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View>
                            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
                                Calories
                            </Text>
                            <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', marginTop: 2 }}>
                                {totalCalories} / {dailyGoal}
                            </Text>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
                                Remaining
                            </Text>
                            <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', marginTop: 2 }}>
                                {dailyGoal - totalCalories} cal
                            </Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Meals List */}
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{
                    paddingHorizontal: 24,
                    paddingTop: 24,
                    paddingBottom: 100 + insets.bottom
                }}
                showsVerticalScrollIndicator={false}
            >
                <Text style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: Colors.light.text.primary,
                    marginBottom: 16
                }}>
                    Today's Meals
                </Text>

                {todaysMeals.map((meal) => (
                    <MealCard key={meal.id} meal={meal} />
                ))}

                {/* Quick Actions */}
                <View style={{ marginTop: 24 }}>
                    <Text style={{
                        fontSize: 18,
                        fontWeight: 'bold',
                        color: Colors.light.text.primary,
                        marginBottom: 16
                    }}>
                        Quick Actions
                    </Text>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                backgroundColor: 'white',
                                padding: 16,
                                borderRadius: 12,
                                marginRight: 8,
                                alignItems: 'center',
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.08,
                                shadowRadius: 4,
                                elevation: 2
                            }}
                            onPress={() => router.push('/planner')}
                        >
                            <Text style={{ fontSize: 28, marginBottom: 8 }}>📅</Text>
                            <Text style={{ fontSize: 13, fontWeight: '600', color: Colors.light.text.primary, textAlign: 'center' }}>
                                View Plan
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{
                                flex: 1,
                                backgroundColor: 'white',
                                padding: 16,
                                borderRadius: 12,
                                marginHorizontal: 8,
                                alignItems: 'center',
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.08,
                                shadowRadius: 4,
                                elevation: 2
                            }}
                            onPress={() => router.push('/recipes')}
                        >
                            <Text style={{ fontSize: 28, marginBottom: 8 }}>🔍</Text>
                            <Text style={{ fontSize: 13, fontWeight: '600', color: Colors.light.text.primary, textAlign: 'center' }}>
                                Recipes
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{
                                flex: 1,
                                backgroundColor: 'white',
                                padding: 16,
                                borderRadius: 12,
                                marginLeft: 8,
                                alignItems: 'center',
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.08,
                                shadowRadius: 4,
                                elevation: 2
                            }}
                            onPress={() => router.push('/shopping')}
                        >
                            <Text style={{ fontSize: 28, marginBottom: 8 }}>🛒</Text>
                            <Text style={{ fontSize: 13, fontWeight: '600', color: Colors.light.text.primary, textAlign: 'center' }}>
                                Shopping
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}