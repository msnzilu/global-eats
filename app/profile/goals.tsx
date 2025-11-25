import { useUserProfile } from '@/hooks/useUserProfile';
import { HealthGoal } from '@/types';
import { Colors } from '@/utils/constants';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HealthGoals() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { profile, loading: profileLoading, updateHealthGoals } = useUserProfile();

    const [selectedGoal, setSelectedGoal] = useState<HealthGoal>('Maintain Weight');
    const [targetWeight, setTargetWeight] = useState('');
    const [currentWeight, setCurrentWeight] = useState('');
    const [targetCalories, setTargetCalories] = useState('2000');
    const [isSaving, setIsSaving] = useState(false);

    // Load initial data from profile
    useEffect(() => {
        if (profile) {
            setSelectedGoal(profile.goal || 'Maintain Weight');
            setTargetWeight(profile.targetWeight?.toString() || '');
            setCurrentWeight(profile.currentWeight?.toString() || '');
            setTargetCalories(profile.targetCalories?.toString() || '2000');
        }
    }, [profile]);

    const goals: HealthGoal[] = ['Lose Weight', 'Maintain Weight', 'Gain Muscle', 'Improve Health'];

    const handleSave = async () => {
        if (!targetCalories) {
            Alert.alert('Validation Error', 'Please enter a daily calorie target');
            return;
        }

        setIsSaving(true);
        try {
            await updateHealthGoals({
                goal: selectedGoal,
                targetCalories: parseInt(targetCalories),
                ...(currentWeight && { currentWeight: parseFloat(currentWeight) }),
                ...(targetWeight && { targetWeight: parseFloat(targetWeight) })
            });
            Alert.alert('Success', 'Health goals updated successfully');
        } catch (error) {
            Alert.alert('Error', 'Failed to update health goals');
        } finally {
            setIsSaving(false);
        }
    };

    if (profileLoading) {
        return (
            <View style={{ flex: 1, backgroundColor: Colors.light.background, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator size="large" color={Colors.primary.main} />
                <Text style={{ marginTop: 16, color: Colors.light.text.secondary }}>
                    Loading goals...
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
                    Health Goals
                </Text>
            </View>

            <ScrollView
                contentContainerStyle={{
                    padding: 24,
                    paddingBottom: insets.bottom + 100
                }}
            >
                {/* Primary Goal */}
                <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    marginBottom: 12
                }}>
                    Primary Goal
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
                    {goals.map((goal) => (
                        <TouchableOpacity
                            key={goal}
                            onPress={() => setSelectedGoal(goal)}
                            style={{
                                flex: 1,
                                minWidth: '45%',
                                padding: 16,
                                borderRadius: 12,
                                borderWidth: 2,
                                borderColor: selectedGoal === goal ? Colors.primary.main : Colors.light.border,
                                backgroundColor: selectedGoal === goal ? `${Colors.primary.main}15` : 'white',
                                alignItems: 'center'
                            }}
                        >
                            <Text style={{
                                fontWeight: '600',
                                color: selectedGoal === goal ? Colors.primary.main : Colors.light.text.secondary,
                                textAlign: 'center'
                            }}>
                                {goal}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Current Weight */}
                <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    marginBottom: 8
                }}>
                    Current Weight (kg)
                </Text>
                <TextInput
                    style={{
                        backgroundColor: 'white',
                        borderRadius: 12,
                        padding: 16,
                        fontSize: 16,
                        borderWidth: 1,
                        borderColor: Colors.light.border,
                        marginBottom: 20
                    }}
                    value={currentWeight}
                    onChangeText={setCurrentWeight}
                    keyboardType="decimal-pad"
                    placeholder="e.g. 75"
                />

                {/* Target Weight */}
                <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    marginBottom: 8
                }}>
                    Target Weight (kg)
                </Text>
                <TextInput
                    style={{
                        backgroundColor: 'white',
                        borderRadius: 12,
                        padding: 16,
                        fontSize: 16,
                        borderWidth: 1,
                        borderColor: Colors.light.border,
                        marginBottom: 20
                    }}
                    value={targetWeight}
                    onChangeText={setTargetWeight}
                    keyboardType="decimal-pad"
                    placeholder="e.g. 70"
                />

                {/* Daily Calorie Target */}
                <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    marginBottom: 8
                }}>
                    Daily Calorie Target
                </Text>
                <TextInput
                    style={{
                        backgroundColor: 'white',
                        borderRadius: 12,
                        padding: 16,
                        fontSize: 16,
                        borderWidth: 1,
                        borderColor: Colors.light.border,
                        marginBottom: 20
                    }}
                    value={targetCalories}
                    onChangeText={setTargetCalories}
                    keyboardType="number-pad"
                    placeholder="e.g. 2000"
                />

                {/* Info Card */}
                <View style={{
                    backgroundColor: `${Colors.primary.main}10`,
                    borderRadius: 12,
                    padding: 16,
                    borderLeftWidth: 4,
                    borderLeftColor: Colors.primary.main
                }}>
                    <Text style={{
                        fontSize: 14,
                        color: Colors.light.text.secondary,
                        lineHeight: 20
                    }}>
                        💡 Your meal plans will be optimized based on these goals. We'll calculate your daily calorie and macro targets automatically.
                    </Text>
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
                        {isSaving ? 'Saving...' : 'Save Goals'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
