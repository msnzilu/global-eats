import { auth } from '@/services/firebase/config';
import { updateOnboardingData } from '@/services/firebase/firestore';
import { CookingTime, DietType, HealthGoal, OnboardingData } from '@/types';
import { Colors } from '@/utils/constants';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Onboarding() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [currentStep, setCurrentStep] = useState(0);
    const [isSaving, setIsSaving] = useState(false);

    // Step 1: Dietary Preferences
    const [dietType, setDietType] = useState<DietType>('None');
    const [allergies, setAllergies] = useState<string[]>([]);

    // Step 2: Health Goals
    const [goal, setGoal] = useState<HealthGoal>('Maintain Weight');
    const [targetCalories, setTargetCalories] = useState('2000');

    // Step 3: Meal Preferences
    const [mealsPerDay, setMealsPerDay] = useState<1 | 2 | 3>(2);
    const [cuisines, setCuisines] = useState<string[]>(['Italian', 'Mexican']);
    const [cookingTime, setCookingTime] = useState<CookingTime>('30-45 min');

    const dietTypes: DietType[] = ['None', 'Vegetarian', 'Vegan', 'Pescatarian', 'Keto', 'Paleo'];
    const commonAllergies = ['Peanuts', 'Tree Nuts', 'Dairy', 'Eggs', 'Soy', 'Wheat', 'Shellfish', 'Fish'];
    const goals: HealthGoal[] = ['Lose Weight', 'Maintain Weight', 'Gain Muscle', 'Improve Health'];
    const cuisineOptions = ['Italian', 'Mexican', 'Japanese', 'Chinese', 'Indian', 'Thai', 'Mediterranean', 'American'];
    const cookingTimes: CookingTime[] = ['15-30 min', '30-45 min', '45-60 min', '60+ min'];

    const toggleItem = (item: string, list: string[], setList: (list: string[]) => void) => {
        if (list.includes(item)) {
            setList(list.filter(i => i !== item));
        } else {
            setList([...list, item]);
        }
    };

    const handleNext = async () => {
        if (currentStep < 2) {
            setCurrentStep(currentStep + 1);
        } else {
            // Save to Firestore
            setIsSaving(true);
            try {
                const user = auth.currentUser;
                if (!user) {
                    Alert.alert('Error', 'You must be logged in to complete onboarding');
                    setIsSaving(false);
                    return;
                }

                const onboardingData: OnboardingData = {
                    dietType,
                    allergies,
                    goal,
                    targetCalories: parseInt(targetCalories),
                    mealsPerDay,
                    cuisines,
                    cookingTime
                };

                await updateOnboardingData(user.uid, onboardingData);
                router.replace('/(drawer)/(tabs)/planner');
            } catch (error) {
                console.error('Error saving onboarding data:', error);
                Alert.alert('Error', 'Failed to save your preferences. Please try again.');
                setIsSaving(false);
            }
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return (
                    <View>
                        <Text style={{
                            fontSize: 28,
                            fontWeight: 'bold',
                            color: Colors.light.text.primary,
                            marginBottom: 8,
                            textAlign: 'center'
                        }}>
                            Let's Set Up Your Profile 🌍
                        </Text>
                        <Text style={{
                            fontSize: 16,
                            color: Colors.light.text.secondary,
                            marginBottom: 32,
                            textAlign: 'center'
                        }}>
                            Tell us about your dietary preferences
                        </Text>

                        {/* Diet Type */}
                        <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 12 }}>
                            Diet Type
                        </Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
                            {dietTypes.map((diet) => (
                                <TouchableOpacity
                                    key={diet}
                                    onPress={() => setDietType(diet)}
                                    style={{
                                        paddingHorizontal: 16,
                                        paddingVertical: 10,
                                        borderRadius: 20,
                                        borderWidth: 2,
                                        borderColor: dietType === diet ? Colors.primary.main : Colors.light.border,
                                        backgroundColor: dietType === diet ? `${Colors.primary.main}15` : 'white'
                                    }}
                                >
                                    <Text style={{
                                        fontWeight: '600',
                                        color: dietType === diet ? Colors.primary.main : Colors.light.text.secondary
                                    }}>
                                        {diet}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Allergies */}
                        <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 12 }}>
                            Any Allergies? (Optional)
                        </Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
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
                    </View>
                );

            case 1:
                return (
                    <View>
                        <Text style={{
                            fontSize: 28,
                            fontWeight: 'bold',
                            color: Colors.light.text.primary,
                            marginBottom: 8,
                            textAlign: 'center'
                        }}>
                            What's Your Goal? 🎯
                        </Text>
                        <Text style={{
                            fontSize: 16,
                            color: Colors.light.text.secondary,
                            marginBottom: 32,
                            textAlign: 'center'
                        }}>
                            We'll customize your meal plans accordingly
                        </Text>

                        {/* Goal Selection */}
                        <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 12 }}>
                            Primary Goal
                        </Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
                            {goals.map((g) => (
                                <TouchableOpacity
                                    key={g}
                                    onPress={() => setGoal(g)}
                                    style={{
                                        flex: 1,
                                        minWidth: '45%',
                                        padding: 16,
                                        borderRadius: 12,
                                        borderWidth: 2,
                                        borderColor: goal === g ? Colors.primary.main : Colors.light.border,
                                        backgroundColor: goal === g ? `${Colors.primary.main}15` : 'white',
                                        alignItems: 'center'
                                    }}
                                >
                                    <Text style={{
                                        fontWeight: '600',
                                        color: goal === g ? Colors.primary.main : Colors.light.text.secondary,
                                        textAlign: 'center'
                                    }}>
                                        {g}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Daily Calorie Target */}
                        <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>
                            Daily Calorie Target
                        </Text>
                        <TextInput
                            style={{
                                backgroundColor: 'white',
                                borderRadius: 12,
                                padding: 16,
                                fontSize: 16,
                                borderWidth: 1,
                                borderColor: Colors.light.border
                            }}
                            placeholder="2000"
                            value={targetCalories}
                            onChangeText={setTargetCalories}
                            keyboardType="number-pad"
                        />
                    </View>
                );

            case 2:
                return (
                    <View>
                        <Text style={{
                            fontSize: 28,
                            fontWeight: 'bold',
                            color: Colors.light.text.primary,
                            marginBottom: 8,
                            textAlign: 'center'
                        }}>
                            Meal Preferences 🍽️
                        </Text>
                        <Text style={{
                            fontSize: 16,
                            color: Colors.light.text.secondary,
                            marginBottom: 32,
                            textAlign: 'center'
                        }}>
                            How do you like to eat?
                        </Text>

                        {/* Meals Per Day */}
                        <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 12 }}>
                            Meals Per Day
                        </Text>
                        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
                            {([1, 2, 3] as const).map((num) => (
                                <TouchableOpacity
                                    key={num}
                                    onPress={() => setMealsPerDay(num)}
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
                        <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 12 }}>
                            Preferred Cuisines
                        </Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
                            {cuisineOptions.map((cuisine) => (
                                <TouchableOpacity
                                    key={cuisine}
                                    onPress={() => toggleItem(cuisine, cuisines, setCuisines)}
                                    style={{
                                        paddingHorizontal: 16,
                                        paddingVertical: 10,
                                        borderRadius: 20,
                                        borderWidth: 2,
                                        borderColor: cuisines.includes(cuisine) ? Colors.primary.main : Colors.light.border,
                                        backgroundColor: cuisines.includes(cuisine) ? `${Colors.primary.main}15` : 'white'
                                    }}
                                >
                                    <Text style={{
                                        fontWeight: '600',
                                        color: cuisines.includes(cuisine) ? Colors.primary.main : Colors.light.text.secondary
                                    }}>
                                        {cuisine}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Max Cooking Time */}
                        <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 12 }}>
                            Maximum Cooking Time
                        </Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
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
                    </View>
                );

            default:
                return null;
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: Colors.light.background }}>
            {/* Progress Bar */}
            <View style={{
                backgroundColor: Colors.primary.main,
                paddingTop: insets.top + 20,
                paddingBottom: 16,
                paddingHorizontal: 24
            }}>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                    {[0, 1, 2].map((step) => (
                        <View
                            key={step}
                            style={{
                                flex: 1,
                                height: 4,
                                borderRadius: 2,
                                backgroundColor: currentStep >= step ? 'white' : 'rgba(255,255,255,0.3)'
                            }}
                        />
                    ))}
                </View>
                <Text style={{
                    color: 'white',
                    fontSize: 14,
                    marginTop: 12,
                    textAlign: 'center'
                }}>
                    Step {currentStep + 1} of 3
                </Text>
            </View>

            <ScrollView
                contentContainerStyle={{
                    padding: 24,
                    paddingBottom: insets.bottom + 100
                }}
            >
                {renderStep()}
            </ScrollView>

            {/* Bottom Navigation */}
            <View style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: 'white',
                padding: 24,
                paddingBottom: 24 + insets.bottom,
                borderTopWidth: 1,
                borderTopColor: Colors.light.border,
                flexDirection: 'row',
                gap: 12
            }}>
                {currentStep > 0 && (
                    <TouchableOpacity
                        style={{
                            flex: 1,
                            backgroundColor: Colors.light.surface,
                            padding: 16,
                            borderRadius: 12,
                            alignItems: 'center',
                            borderWidth: 1,
                            borderColor: Colors.light.border
                        }}
                        onPress={handleBack}
                        disabled={isSaving}
                    >
                        <Text style={{ color: Colors.light.text.primary, fontSize: 16, fontWeight: '600' }}>
                            Back
                        </Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity
                    style={{
                        flex: currentStep > 0 ? 2 : 1,
                        backgroundColor: isSaving ? Colors.light.border : Colors.primary.main,
                        padding: 16,
                        borderRadius: 12,
                        alignItems: 'center'
                    }}
                    onPress={handleNext}
                    disabled={isSaving}
                >
                    <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                        {isSaving ? 'Saving...' : currentStep === 2 ? 'Complete' : 'Next'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}