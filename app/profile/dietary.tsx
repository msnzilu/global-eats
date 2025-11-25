import { useUserProfile } from '@/hooks/useUserProfile';
import { DietType } from '@/types';
import { Colors } from '@/utils/constants';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Dietary() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { profile, loading: profileLoading, updateDietaryPreferences } = useUserProfile();

    const [selectedDiet, setSelectedDiet] = useState<DietType>('None');
    const [allergies, setAllergies] = useState<string[]>([]);
    const [dislikes, setDislikes] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    // Load initial data from profile
    useEffect(() => {
        if (profile) {
            setSelectedDiet(profile.dietType || 'None');
            setAllergies(profile.allergies || []);
            setDislikes(profile.dislikes || []);
        }
    }, [profile]);

    const dietTypes: DietType[] = ['None', 'Vegetarian', 'Vegan', 'Pescatarian', 'Keto', 'Paleo'];
    const commonAllergies = ['Peanuts', 'Tree Nuts', 'Dairy', 'Eggs', 'Soy', 'Wheat', 'Shellfish', 'Fish'];
    const commonDislikes = ['Mushrooms', 'Onions', 'Cilantro', 'Olives', 'Tomatoes', 'Peppers'];

    const toggleItem = (item: string, list: string[], setList: (list: string[]) => void) => {
        if (list.includes(item)) {
            setList(list.filter(i => i !== item));
        } else {
            setList([...list, item]);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateDietaryPreferences({
                dietType: selectedDiet,
                allergies,
                dislikes
            });
            Alert.alert('Success', 'Dietary preferences updated successfully');
        } catch (error) {
            Alert.alert('Error', 'Failed to update dietary preferences');
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
                    Dietary Preferences
                </Text>
            </View>

            <ScrollView
                contentContainerStyle={{
                    padding: 24,
                    paddingBottom: insets.bottom + 100
                }}
            >
                {/* Diet Type */}
                <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    marginBottom: 12
                }}>
                    Diet Type
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
                    {dietTypes.map((diet) => (
                        <TouchableOpacity
                            key={diet}
                            onPress={() => setSelectedDiet(diet)}
                            style={{
                                paddingHorizontal: 16,
                                paddingVertical: 10,
                                borderRadius: 20,
                                borderWidth: 2,
                                borderColor: selectedDiet === diet ? Colors.primary.main : Colors.light.border,
                                backgroundColor: selectedDiet === diet ? `${Colors.primary.main}15` : 'white'
                            }}
                        >
                            <Text style={{
                                fontWeight: '600',
                                color: selectedDiet === diet ? Colors.primary.main : Colors.light.text.secondary
                            }}>
                                {diet}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Allergies */}
                <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    marginBottom: 12
                }}>
                    Allergies
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
                    {commonAllergies.map((allergy) => (
                        <TouchableOpacity
                            key={allergy}
                            onPress={() => toggleItem(allergy, allergies, setAllergies)}
                            style={{
                                paddingHorizontal: 16,
                                paddingVertical: 10,
                                borderRadius: 20,
                                borderWidth: 2,
                                borderColor: allergies.includes(allergy) ? '#EF4444' : Colors.light.border,
                                backgroundColor: allergies.includes(allergy) ? '#FEE2E2' : 'white'
                            }}
                        >
                            <Text style={{
                                fontWeight: '600',
                                color: allergies.includes(allergy) ? '#EF4444' : Colors.light.text.secondary
                            }}>
                                {allergy}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Dislikes */}
                <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    marginBottom: 12
                }}>
                    Foods I Dislike
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
                    {commonDislikes.map((dislike) => (
                        <TouchableOpacity
                            key={dislike}
                            onPress={() => toggleItem(dislike, dislikes, setDislikes)}
                            style={{
                                paddingHorizontal: 16,
                                paddingVertical: 10,
                                borderRadius: 20,
                                borderWidth: 2,
                                borderColor: dislikes.includes(dislike) ? Colors.secondary.main : Colors.light.border,
                                backgroundColor: dislikes.includes(dislike) ? `${Colors.secondary.main}20` : 'white'
                            }}
                        >
                            <Text style={{
                                fontWeight: '600',
                                color: dislikes.includes(dislike) ? Colors.secondary.main : Colors.light.text.secondary
                            }}>
                                {dislike}
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
