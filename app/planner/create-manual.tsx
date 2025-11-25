import RecipeSelector from '@/components/RecipeSelector';
import { useAuth } from '@/hooks/useAuth';
import { createManualMealPlan } from '@/services/firebase/mealPlans';
import { Recipe } from '@/types';
import { Colors } from '@/utils/constants';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface DayPlan {
    date: Date;
    dayName: string;
    meals: {
        recipeId: string;
        recipeName: string;
        mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
        cuisine: string;
    }[];
}

export default function CreateManualMealPlan() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { user } = useAuth();

    const [planName, setPlanName] = useState('');
    const [duration, setDuration] = useState<7 | 30>(7);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Meal selection state
    const [days, setDays] = useState<DayPlan[]>([]);
    const [selectorVisible, setSelectorVisible] = useState(false);
    const [activeDayIndex, setActiveDayIndex] = useState<number | null>(null);
    const [activeMealType, setActiveMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack' | null>(null);

    // Initialize days when duration changes
    useState(() => {
        const initialDays = Array.from({ length: duration }, (_, i) => ({
            date: new Date(Date.now() + i * 24 * 60 * 60 * 1000),
            dayName: `Day ${i + 1}`,
            meals: []
        }));
        setDays(initialDays);
    });

    const openRecipeSelector = (dayIndex: number, mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack') => {
        setActiveDayIndex(dayIndex);
        setActiveMealType(mealType);
        setSelectorVisible(true);
    };

    const handleSelectRecipe = (recipe: Recipe) => {
        if (activeDayIndex === null || !activeMealType) return;

        const newDays = [...days];
        const day = newDays[activeDayIndex];

        // Remove existing meal of same type if exists (optional, or allow multiple)
        // For now, let's append
        day.meals.push({
            recipeId: recipe.id,
            recipeName: recipe.name,
            mealType: activeMealType,
            calories: recipe.calories || 0,
            protein: recipe.protein || 0,
            carbs: recipe.carbs || 0,
            fat: recipe.fat || 0,
            cuisine: recipe.cuisine || 'International'
        });

        setDays(newDays);
    };

    const removeMeal = (dayIndex: number, mealIndex: number) => {
        const newDays = [...days];
        newDays[dayIndex].meals.splice(mealIndex, 1);
        setDays(newDays);
    };

    const handleSave = async () => {
        if (!planName.trim()) {
            Alert.alert('Missing Info', 'Please enter a name for your meal plan');
            return;
        }

        if (!user) return;

        // Check if at least one meal is added
        const hasMeals = days.some(day => day.meals.length > 0);
        if (!hasMeals) {
            Alert.alert(
                'Empty Plan',
                'You haven\'t added any meals yet. Do you want to save an empty plan?',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Save Empty', onPress: submitPlan }
                ]
            );
            return;
        }

        submitPlan();
    };

    const submitPlan = async () => {
        if (!user) return;
        setIsSubmitting(true);

        try {
            // Calculate totals
            const processedDays = days.map(day => ({
                ...day,
                totalCalories: day.meals.reduce((sum, m) => sum + m.calories, 0),
                totalProtein: day.meals.reduce((sum, m) => sum + m.protein, 0)
            }));

            await createManualMealPlan(user.uid, {
                name: planName,
                duration,
                startDate: new Date(),
                endDate: new Date(Date.now() + duration * 24 * 60 * 60 * 1000),
                selectedCuisines: [], // Could be derived from meals
                includeCustomRecipes: true,
                days: processedDays as any,
                creationMethod: 'manual'
            });

            Alert.alert(
                'Success',
                'Meal plan created successfully!',
                [{ text: 'OK', onPress: () => router.replace('/(drawer)/(tabs)/planner') }]
            );
        } catch (error) {
            console.error('Error creating meal plan:', error);
            Alert.alert('Error', 'Failed to create meal plan. Please try again.');
        } finally {
            setIsSubmitting(false);
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
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>
                        New Meal Plan
                    </Text>
                </View>
                <TouchableOpacity onPress={handleSave} disabled={isSubmitting}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'white', opacity: isSubmitting ? 0.7 : 1 }}>
                        {isSubmitting ? 'Saving...' : 'Save'}
                    </Text>
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
                    {/* Plan Name */}
                    <View style={{ marginBottom: 24 }}>
                        <Text style={{ fontSize: 14, fontWeight: '600', color: Colors.light.text.secondary, marginBottom: 8 }}>
                            Plan Name
                        </Text>
                        <TextInput
                            style={{
                                backgroundColor: 'white',
                                borderRadius: 12,
                                padding: 16,
                                borderWidth: 1,
                                borderColor: Colors.light.border,
                                fontSize: 16,
                                color: Colors.light.text.primary
                            }}
                            value={planName}
                            onChangeText={setPlanName}
                            placeholder="e.g., Weekly Weight Loss Plan"
                        />
                    </View>

                    {/* Duration Selection */}
                    <View style={{ marginBottom: 24 }}>
                        <Text style={{ fontSize: 14, fontWeight: '600', color: Colors.light.text.secondary, marginBottom: 12 }}>
                            Duration
                        </Text>
                        <View style={{ flexDirection: 'row', gap: 12 }}>
                            {[7, 30].map((d) => (
                                <TouchableOpacity
                                    key={d}
                                    style={{
                                        flex: 1,
                                        paddingVertical: 12,
                                        borderRadius: 10,
                                        borderWidth: 1,
                                        borderColor: duration === d ? Colors.primary.main : Colors.light.border,
                                        backgroundColor: duration === d ? Colors.primary.main + '10' : 'white',
                                        alignItems: 'center'
                                    }}
                                    onPress={() => {
                                        setDuration(d as 7 | 30);
                                        // Reset days array with new length
                                        setDays(Array.from({ length: d }, (_, i) => ({
                                            date: new Date(Date.now() + i * 24 * 60 * 60 * 1000),
                                            dayName: `Day ${i + 1}`,
                                            meals: []
                                        })));
                                    }}
                                >
                                    <Text style={{
                                        fontSize: 16,
                                        fontWeight: '600',
                                        color: duration === d ? Colors.primary.main : Colors.light.text.secondary
                                    }}>
                                        {d} Days
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Daily Meal Builder */}
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: Colors.light.text.primary, marginBottom: 16 }}>
                        Build Your Plan
                    </Text>

                    {days.map((day, dayIndex) => (
                        <View key={dayIndex} style={{ marginBottom: 24, backgroundColor: 'white', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: Colors.light.border }}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: Colors.light.text.primary, marginBottom: 12 }}>
                                {day.dayName}
                            </Text>

                            {/* Meals List */}
                            {day.meals.map((meal, mealIndex) => (
                                <View key={mealIndex} style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    backgroundColor: Colors.light.surface,
                                    padding: 12,
                                    borderRadius: 10,
                                    marginBottom: 8
                                }}>
                                    <View>
                                        <Text style={{ fontSize: 12, fontWeight: '700', color: Colors.secondary.main, textTransform: 'uppercase' }}>
                                            {meal.mealType}
                                        </Text>
                                        <Text style={{ fontSize: 14, fontWeight: '600', color: Colors.light.text.primary }}>
                                            {meal.recipeName}
                                        </Text>
                                        <Text style={{ fontSize: 12, color: Colors.light.text.secondary }}>
                                            {meal.calories} cal
                                        </Text>
                                    </View>
                                    <TouchableOpacity onPress={() => removeMeal(dayIndex, mealIndex)}>
                                        <Ionicons name="trash-outline" size={20} color={Colors.error} />
                                    </TouchableOpacity>
                                </View>
                            ))}

                            {/* Add Meal Buttons */}
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                                {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((type) => (
                                    <TouchableOpacity
                                        key={type}
                                        style={{
                                            paddingHorizontal: 12,
                                            paddingVertical: 8,
                                            borderRadius: 20,
                                            borderWidth: 1,
                                            borderColor: Colors.primary.main,
                                            backgroundColor: 'white',
                                            flexDirection: 'row',
                                            alignItems: 'center'
                                        }}
                                        onPress={() => openRecipeSelector(dayIndex, type)}
                                    >
                                        <Ionicons name="add" size={16} color={Colors.primary.main} style={{ marginRight: 4 }} />
                                        <Text style={{ fontSize: 12, fontWeight: '600', color: Colors.primary.main, textTransform: 'capitalize' }}>
                                            {type}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    ))}

                </ScrollView>
            </KeyboardAvoidingView>

            <RecipeSelector
                visible={selectorVisible}
                onClose={() => setSelectorVisible(false)}
                onSelect={handleSelectRecipe}
            />
        </View>
    );
}
