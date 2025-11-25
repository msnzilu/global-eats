import { useUserProfile } from '@/hooks/useUserProfile';
import { CookingTime } from '@/types';
import { Colors } from '@/utils/constants';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MealPreferences() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { profile, loading: profileLoading, updateMealPreferences } = useUserProfile();

    const [mealsPerDay, setMealsPerDay] = useState<1 | 2 | 3>(2);
    const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
    const [cookingTime, setCookingTime] = useState<CookingTime>('30-45 min');
    const [isSaving, setIsSaving] = useState(false);

    // Load initial data from profile
    useEffect(() => {
        if (profile) {
            setMealsPerDay(profile.mealsPerDay || 2);
            setSelectedCuisines(profile.preferredCuisines || []);
            setCookingTime(profile.maxCookingTime || '30-45 min');
        }
    }, [profile]);

    const cuisines = ['Italian', 'Mexican', 'Japanese', 'Chinese', 'Indian', 'Thai', 'Mediterranean', 'American', 'French', 'Korean'];
    const cookingTimes: CookingTime[] = ['15-30 min', '30-45 min', '45-60 min', '60+ min'];

    const toggleCuisine = (cuisine: string) => {
        if (selectedCuisines.includes(cuisine)) {
            setSelectedCuisines(selectedCuisines.filter(c => c !== cuisine));
        } else {
            setSelectedCuisines([...selectedCuisines, cuisine]);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateMealPreferences({
                mealsPerDay,
                preferredCuisines: selectedCuisines,
                maxCookingTime: cookingTime
            });
            Alert.alert('Success', 'Meal preferences updated successfully');
        } catch (error) {
            Alert.alert('Error', 'Failed to update meal preferences');
        } finally {
            setIsSaving(false);
        }
    };

    if (profileLoading) {
        return (
            <View style={{ flex: 1, backgroundColor: Colors.light.background, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator size="large" color={Colors.primary.main} />
                <Text style={{ marginTop: 16, color: Colors.light.text.secondary }}>
                    Loading preferences...
                </Text>
            </View>
        );
    }

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
                    Meal Preferences
                </Text>
            </View>

            <ScrollView
                contentContainerStyle={{
                    padding: 24,
                    paddingBottom: insets.bottom + 100
                }}
            >
                {/* Meals Per Day */}
                <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    marginBottom: 12
                }}>
                    Meals Per Day
                </Text>
                <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
                    {[1, 2, 3].map((num) => (
                        <TouchableOpacity
                            key={num}
                            onPress={() => setMealsPerDay(num as 1 | 2 | 3)}
                            style={{
                                flex: 1,
                                padding: 20,
                                borderRadius: 12,
                                borderWidth: 2,
                                borderColor: mealsPerDay === num ? Colors.primary.main : Colors.light.border,
                                backgroundColor: mealsPerDay === num ? `${Colors.primary.main}15` : 'white',
                                alignItems: 'center'
                            }}
                        >
                            <Text style={{
                                fontSize: 24,
                                fontWeight: '700',
                                color: mealsPerDay === num ? Colors.primary.main : Colors.light.text.secondary,
                                marginBottom: 4
                            }}>
                                {num}
                            </Text>
                            <Text style={{
                                fontSize: 12,
                                color: mealsPerDay === num ? Colors.primary.main : Colors.light.text.tertiary
                            }}>
                                {num === 1 ? 'meal' : 'meals'}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Preferred Cuisines */}
                <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    marginBottom: 12
                }}>
                    Preferred Cuisines
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
                    {cuisines.map((cuisine) => (
                        <TouchableOpacity
                            key={cuisine}
                            onPress={() => toggleCuisine(cuisine)}
                            style={{
                                paddingHorizontal: 16,
                                paddingVertical: 10,
                                borderRadius: 20,
                                borderWidth: 2,
                                borderColor: selectedCuisines.includes(cuisine) ? Colors.primary.main : Colors.light.border,
                                backgroundColor: selectedCuisines.includes(cuisine) ? `${Colors.primary.main}15` : 'white'
                            }}
                        >
                            <Text style={{
                                fontWeight: '600',
                                color: selectedCuisines.includes(cuisine) ? Colors.primary.main : Colors.light.text.secondary
                            }}>
                                {cuisine}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Max Cooking Time */}
                <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    marginBottom: 12
                }}>
                    Maximum Cooking Time
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
                    {cookingTimes.map((time) => (
                        <TouchableOpacity
                            key={time}
                            onPress={() => setCookingTime(time)}
                            style={{
                                flex: 1,
                                minWidth: '45%',
                                padding: 16,
                                borderRadius: 12,
                                borderWidth: 2,
                                borderColor: cookingTime === time ? Colors.secondary.main : Colors.light.border,
                                backgroundColor: cookingTime === time ? `${Colors.secondary.main}20` : 'white',
                                alignItems: 'center'
                            }}
                        >
                            <Text style={{
                                fontWeight: '600',
                                color: cookingTime === time ? Colors.secondary.main : Colors.light.text.secondary
                            }}>
                                {time}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>

            {/* Save Button */}
            <View style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: 'white',
                padding: 24,
                paddingBottom: 24 + insets.bottom,
                borderTopWidth: 1,
                borderTopColor: Colors.light.border
            }}>
                <TouchableOpacity
                    style={{
                        backgroundColor: isSaving ? Colors.light.border : Colors.primary.main,
                        padding: 16,
                        borderRadius: 12,
                        alignItems: 'center',
                        flexDirection: 'row',
                        justifyContent: 'center'
                    }}
                    onPress={handleSave}
                    disabled={isSaving}
                >
                    {isSaving ? (
                        <ActivityIndicator color="white" style={{ marginRight: 8 }} />
                    ) : null}
                    <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                        {isSaving ? 'Saving...' : 'Save Preferences'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
