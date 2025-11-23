import { Colors } from '@/utils/constants';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Meal {
    id: string;
    name: string;
    type: 'Breakfast' | 'Lunch' | 'Dinner';
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    prepTime: number;
    cuisine: string;
    difficulty: string;
}

export default function SwapMeal() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const params = useLocalSearchParams();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState<'All' | 'Breakfast' | 'Lunch' | 'Dinner'>('All');

    // Mock current meal data
    const currentMeal: Meal = {
        id: '1',
        name: 'Mediterranean Quinoa Bowl',
        type: 'Lunch',
        calories: 380,
        protein: 18,
        carbs: 45,
        fat: 15,
        prepTime: 35,
        cuisine: 'Mediterranean',
        difficulty: 'Easy'
    };

    // Mock alternative meals
    const alternativeMeals: Meal[] = [
        {
            id: '2',
            name: 'Grilled Chicken Salad',
            type: 'Lunch',
            calories: 350,
            protein: 32,
            carbs: 25,
            fat: 12,
            prepTime: 25,
            cuisine: 'American',
            difficulty: 'Easy'
        },
        {
            id: '3',
            name: 'Asian Stir-Fry Bowl',
            type: 'Lunch',
            calories: 420,
            protein: 24,
            carbs: 52,
            fat: 14,
            prepTime: 30,
            cuisine: 'Asian',
            difficulty: 'Medium'
        },
        {
            id: '4',
            name: 'Caprese Pasta',
            type: 'Lunch',
            calories: 450,
            protein: 16,
            carbs: 58,
            fat: 18,
            prepTime: 20,
            cuisine: 'Italian',
            difficulty: 'Easy'
        },
        {
            id: '5',
            name: 'Turkey Wrap',
            type: 'Lunch',
            calories: 320,
            protein: 28,
            carbs: 35,
            fat: 10,
            prepTime: 15,
            cuisine: 'American',
            difficulty: 'Easy'
        },
        {
            id: '6',
            name: 'Buddha Bowl',
            type: 'Lunch',
            calories: 390,
            protein: 15,
            carbs: 48,
            fat: 16,
            prepTime: 40,
            cuisine: 'Fusion',
            difficulty: 'Medium'
        }
    ];

    const filteredMeals = alternativeMeals.filter(meal => {
        const matchesSearch = meal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            meal.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = selectedFilter === 'All' || meal.type === selectedFilter;
        return matchesSearch && matchesFilter;
    });

    const handleSwap = (meal: Meal) => {
        // TODO: Implement actual swap logic with Redux/state management
        console.log('Swapping to:', meal.name);
        router.back();
    };

    const filters: Array<'All' | 'Breakfast' | 'Lunch' | 'Dinner'> = ['All', 'Breakfast', 'Lunch', 'Dinner'];

    return (
        <View style={{ flex: 1, backgroundColor: Colors.light.background }}>
            {/* Header */}
            <View style={{
                backgroundColor: Colors.primary.main,
                paddingTop: insets.top + 16,
                paddingBottom: 20,
                paddingHorizontal: 24
            }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
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
                    }}>
                        Swap Meal
                    </Text>
                </View>

                {/* Search Bar */}
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 12
                }}>
                    <Ionicons name="search" size={20} color="white" />
                    <TextInput
                        style={{
                            flex: 1,
                            marginLeft: 12,
                            fontSize: 16,
                            color: 'white'
                        }}
                        placeholder="Search meals..."
                        placeholderTextColor="rgba(255,255,255,0.6)"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Ionicons name="close-circle" size={20} color="white" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Current Meal Card */}
            <View style={{ padding: 24 }}>
                <Text style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: Colors.light.text.secondary,
                    marginBottom: 12
                }}>
                    CURRENT MEAL
                </Text>
                <View style={{
                    backgroundColor: Colors.light.surface,
                    borderRadius: 16,
                    padding: 16,
                    borderWidth: 2,
                    borderColor: Colors.primary.main
                }}>
                    <Text style={{
                        fontSize: 18,
                        fontWeight: 'bold',
                        color: Colors.light.text.primary,
                        marginBottom: 8
                    }}>
                        {currentMeal.name}
                    </Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                        <View style={{
                            backgroundColor: Colors.primary.light,
                            paddingHorizontal: 12,
                            paddingVertical: 6,
                            borderRadius: 8
                        }}>
                            <Text style={{ fontSize: 12, color: Colors.primary.dark }}>
                                {currentMeal.calories} cal
                            </Text>
                        </View>
                        <View style={{
                            backgroundColor: Colors.secondary.light,
                            paddingHorizontal: 12,
                            paddingVertical: 6,
                            borderRadius: 8
                        }}>
                            <Text style={{ fontSize: 12, color: Colors.secondary.dark }}>
                                {currentMeal.protein}g protein
                            </Text>
                        </View>
                        <View style={{
                            backgroundColor: Colors.light.border,
                            paddingHorizontal: 12,
                            paddingVertical: 6,
                            borderRadius: 8
                        }}>
                            <Text style={{ fontSize: 12, color: Colors.light.text.secondary }}>
                                {currentMeal.prepTime} min
                            </Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Filters */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 24, gap: 12, marginBottom: 16 }}
            >
                {filters.map(filter => (
                    <TouchableOpacity
                        key={filter}
                        onPress={() => setSelectedFilter(filter)}
                        style={{
                            paddingHorizontal: 20,
                            paddingVertical: 10,
                            borderRadius: 20,
                            backgroundColor: selectedFilter === filter
                                ? Colors.primary.main
                                : Colors.light.surface,
                            borderWidth: 1,
                            borderColor: selectedFilter === filter
                                ? Colors.primary.main
                                : Colors.light.border
                        }}
                    >
                        <Text style={{
                            fontSize: 14,
                            fontWeight: '600',
                            color: selectedFilter === filter
                                ? 'white'
                                : Colors.light.text.secondary
                        }}>
                            {filter}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Alternative Meals List */}
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: insets.bottom + 24 }}
            >
                <Text style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: Colors.light.text.secondary,
                    marginBottom: 12
                }}>
                    ALTERNATIVE MEALS ({filteredMeals.length})
                </Text>

                {filteredMeals.map(meal => (
                    <TouchableOpacity
                        key={meal.id}
                        onPress={() => handleSwap(meal)}
                        style={{
                            backgroundColor: Colors.light.surface,
                            borderRadius: 16,
                            padding: 16,
                            marginBottom: 12,
                            borderWidth: 1,
                            borderColor: Colors.light.border
                        }}
                    >
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                            <Text style={{
                                fontSize: 16,
                                fontWeight: 'bold',
                                color: Colors.light.text.primary,
                                flex: 1
                            }}>
                                {meal.name}
                            </Text>
                            <Ionicons name="swap-horizontal" size={24} color={Colors.primary.main} />
                        </View>

                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                            <View style={{
                                backgroundColor: Colors.primary.light,
                                paddingHorizontal: 10,
                                paddingVertical: 4,
                                borderRadius: 6
                            }}>
                                <Text style={{ fontSize: 11, color: Colors.primary.dark }}>
                                    {meal.calories} cal
                                </Text>
                            </View>
                            <View style={{
                                backgroundColor: Colors.secondary.light,
                                paddingHorizontal: 10,
                                paddingVertical: 4,
                                borderRadius: 6
                            }}>
                                <Text style={{ fontSize: 11, color: Colors.secondary.dark }}>
                                    P: {meal.protein}g
                                </Text>
                            </View>
                            <View style={{
                                backgroundColor: Colors.light.border,
                                paddingHorizontal: 10,
                                paddingVertical: 4,
                                borderRadius: 6
                            }}>
                                <Text style={{ fontSize: 11, color: Colors.light.text.secondary }}>
                                    C: {meal.carbs}g
                                </Text>
                            </View>
                            <View style={{
                                backgroundColor: Colors.light.border,
                                paddingHorizontal: 10,
                                paddingVertical: 4,
                                borderRadius: 6
                            }}>
                                <Text style={{ fontSize: 11, color: Colors.light.text.secondary }}>
                                    F: {meal.fat}g
                                </Text>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Ionicons name="time-outline" size={14} color={Colors.light.text.tertiary} />
                                <Text style={{
                                    fontSize: 12,
                                    color: Colors.light.text.tertiary,
                                    marginLeft: 4
                                }}>
                                    {meal.prepTime} min
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Ionicons name="restaurant-outline" size={14} color={Colors.light.text.tertiary} />
                                <Text style={{
                                    fontSize: 12,
                                    color: Colors.light.text.tertiary,
                                    marginLeft: 4
                                }}>
                                    {meal.cuisine}
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Ionicons name="bar-chart-outline" size={14} color={Colors.light.text.tertiary} />
                                <Text style={{
                                    fontSize: 12,
                                    color: Colors.light.text.tertiary,
                                    marginLeft: 4
                                }}>
                                    {meal.difficulty}
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}

                {filteredMeals.length === 0 && (
                    <View style={{
                        padding: 40,
                        alignItems: 'center'
                    }}>
                        <Ionicons name="search-outline" size={48} color={Colors.light.text.tertiary} />
                        <Text style={{
                            fontSize: 16,
                            color: Colors.light.text.secondary,
                            marginTop: 16,
                            textAlign: 'center'
                        }}>
                            No meals found matching your search
                        </Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}
