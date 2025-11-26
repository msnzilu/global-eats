import { useAuth } from '@/hooks/useAuth';
import { useRecipes } from '@/hooks/useRecipes';
import { generateMealPlanFromPrompt } from '@/services/api/ai';
import { createAIMealPlan } from '@/services/firebase/mealPlans';
import { Colors } from '@/utils/constants';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Timestamp } from 'firebase/firestore';
import { useState } from 'react';
import {
    ActivityIndicator,
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

export default function CreateAIMealPlan() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { user } = useAuth();
    const { myRecipes: customRecipes } = useRecipes();

    const [prompt, setPrompt] = useState('');
    const [duration, setDuration] = useState<7 | 30>(7);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            Alert.alert('Missing Prompt', 'Please describe the meal plan you want to create.');
            return;
        }

        if (!user) return;

        setIsGenerating(true);

        try {
            // Generate plan using AI with correct argument order
            const generatedPlan = await generateMealPlanFromPrompt(prompt, customRecipes, duration);

            // Save to Firebase with Timestamp fields
            await createAIMealPlan(user.uid, prompt, {
                ...generatedPlan,
                startDate: Timestamp.fromDate(new Date()),
                endDate: Timestamp.fromDate(new Date(Date.now() + duration * 24 * 60 * 60 * 1000))
            });

            Alert.alert(
                'Success',
                'Your AI meal plan has been created!',
                [{ text: 'View Plan', onPress: () => router.replace('/(drawer)/(tabs)/planner') }]
            );
        } catch (error) {
            console.error('Error generating AI meal plan:', error);
            Alert.alert('Error', 'Failed to generate meal plan. Please try again.');
        } finally {
            setIsGenerating(false);
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
                alignItems: 'center'
            }}>
                <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>
                    Auto Meal Planner
                </Text>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={{ padding: 24 }}>
                    {/* Prompt Input */}
                    <View style={{ marginBottom: 24 }}>
                        <Text style={{ fontSize: 16, fontWeight: '600', color: Colors.light.text.primary, marginBottom: 8 }}>
                            Describe your ideal meal plan
                        </Text>
                        <Text style={{ fontSize: 14, color: Colors.light.text.secondary, marginBottom: 12 }}>
                            Include dietary preferences, goals, and any specific cuisines.
                        </Text>
                        <TextInput
                            style={{
                                backgroundColor: 'white',
                                borderRadius: 12,
                                padding: 16,
                                borderWidth: 1,
                                borderColor: Colors.light.border,
                                fontSize: 16,
                                color: Colors.light.text.primary,
                                minHeight: 120,
                                textAlignVertical: 'top'
                            }}
                            value={prompt}
                            onChangeText={setPrompt}
                            placeholder="e.g., I want a high-protein meal plan for weight loss, focusing on Mediterranean cuisine. I don't like mushrooms."
                            multiline
                        />
                    </View>

                    {/* Duration Selection */}
                    <View style={{ marginBottom: 32 }}>
                        <Text style={{ fontSize: 16, fontWeight: '600', color: Colors.light.text.primary, marginBottom: 12 }}>
                            Duration
                        </Text>
                        <View style={{ flexDirection: 'row', gap: 12 }}>
                            <TouchableOpacity
                                style={{
                                    flex: 1,
                                    paddingVertical: 12,
                                    borderRadius: 10,
                                    borderWidth: 1,
                                    borderColor: duration === 7 ? Colors.secondary.main : Colors.light.border,
                                    backgroundColor: duration === 7 ? Colors.secondary.main + '10' : 'white',
                                    alignItems: 'center'
                                }}
                                onPress={() => setDuration(7)}
                            >
                                <Text style={{
                                    fontSize: 16,
                                    fontWeight: '600',
                                    color: duration === 7 ? Colors.secondary.main : Colors.light.text.secondary
                                }}>
                                    7 Days
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    flex: 1,
                                    paddingVertical: 12,
                                    borderRadius: 10,
                                    borderWidth: 1,
                                    borderColor: duration === 30 ? Colors.secondary.main : Colors.light.border,
                                    backgroundColor: duration === 30 ? Colors.secondary.main + '10' : 'white',
                                    alignItems: 'center'
                                }}
                                onPress={() => setDuration(30)}
                            >
                                <Text style={{
                                    fontSize: 16,
                                    fontWeight: '600',
                                    color: duration === 30 ? Colors.secondary.main : Colors.light.text.secondary
                                }}>
                                    30 Days
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Generate Button */}
                    <TouchableOpacity
                        style={{
                            backgroundColor: Colors.secondary.main,
                            borderRadius: 16,
                            paddingVertical: 16,
                            alignItems: 'center',
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.2,
                            shadowRadius: 8,
                            elevation: 4,
                            opacity: isGenerating ? 0.7 : 1
                        }}
                        onPress={handleGenerate}
                        disabled={isGenerating}
                    >
                        {isGenerating ? (
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <ActivityIndicator color="white" style={{ marginRight: 8 }} />
                                <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'white' }}>
                                    Generating...
                                </Text>
                            </View>
                        ) : (
                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'white' }}>
                                Generate Plan ✨
                            </Text>
                        )}
                    </TouchableOpacity>

                    {/* Disclaimer */}
                    <Text style={{
                        marginTop: 24,
                        textAlign: 'center',
                        fontSize: 12,
                        color: Colors.light.text.tertiary
                    }}>
                        AI-generated plans are suggestions. Please review ingredients for allergens.
                    </Text>

                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}
