import { useAuth } from '@/hooks/useAuth';
import { generateRecipeFromPrompt } from '@/services/api/ai';
import { createAIRecipe } from '@/services/firebase/recipes';
import { Colors } from '@/utils/constants';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
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

export default function CreateAIRecipe() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { user } = useAuth();

    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedRecipe, setGeneratedRecipe] = useState<any>(null);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            Alert.alert('Missing Input', 'Please describe the recipe you want to create');
            return;
        }

        setIsGenerating(true);

        try {
            const result = await generateRecipeFromPrompt(prompt);
            setGeneratedRecipe(result.recipe);
        } catch (error) {
            console.error('Error generating recipe:', error);
            Alert.alert('Error', 'Failed to generate recipe. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSave = async () => {
        if (!user || !generatedRecipe) return;

        try {
            await createAIRecipe(user.uid, prompt, generatedRecipe);

            Alert.alert(
                'Success',
                'Recipe saved successfully!',
                [{ text: 'OK', onPress: () => router.replace('/(drawer)/(tabs)/recipes') }]
            );
        } catch (error) {
            console.error('Error saving AI recipe:', error);
            Alert.alert('Error', 'Failed to save recipe. Please try again.');
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: Colors.light.background }}>
            {/* Header */}
            <View style={{
                backgroundColor: Colors.secondary.main, // Different color for AI
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
                        Auto Recipe Generator
                    </Text>
                </View>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={{ padding: 24 }}>

                    {!generatedRecipe ? (
                        <>
                            <View style={{ alignItems: 'center', marginBottom: 32, marginTop: 16 }}>
                                <View style={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: 40,
                                    backgroundColor: Colors.secondary.main + '20',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: 16
                                }}>
                                    <Text style={{ fontSize: 40 }}>✨</Text>
                                </View>
                                <Text style={{ fontSize: 24, fontWeight: 'bold', color: Colors.light.text.primary, textAlign: 'center' }}>
                                    Describe your dream dish
                                </Text>
                                <Text style={{ fontSize: 16, color: Colors.light.text.secondary, textAlign: 'center', marginTop: 8 }}>
                                    Tell us what you're craving, ingredients you have, or dietary needs.
                                </Text>
                            </View>

                            <View style={{ marginBottom: 24 }}>
                                <Text style={{ fontSize: 14, fontWeight: '600', color: Colors.light.text.secondary, marginBottom: 8 }}>
                                    Describe your dream dish
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
                                        height: 120,
                                        textAlignVertical: 'top'
                                    }}
                                    value={prompt}
                                    onChangeText={setPrompt}
                                    placeholder="e.g., A spicy vegetarian pasta dish with spinach and tomatoes, under 500 calories..."
                                    multiline
                                />
                            </View>

                            <TouchableOpacity
                                style={{
                                    backgroundColor: Colors.secondary.main,
                                    paddingVertical: 16,
                                    borderRadius: 12,
                                    alignItems: 'center',
                                    opacity: isGenerating || !prompt.trim() ? 0.7 : 1
                                }}
                                onPress={handleGenerate}
                                disabled={isGenerating || !prompt.trim()}
                            >
                                {isGenerating ? (
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <ActivityIndicator color="white" style={{ marginRight: 8 }} />
                                        <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Generating...</Text>
                                    </View>
                                ) : (
                                    <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Generate Recipe</Text>
                                )}
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <View style={{ marginBottom: 24 }}>
                                <Text style={{ fontSize: 24, fontWeight: 'bold', color: Colors.light.text.primary, marginBottom: 8 }}>
                                    {generatedRecipe.name}
                                </Text>
                                <Text style={{ fontSize: 16, color: Colors.light.text.secondary, lineHeight: 24 }}>
                                    {generatedRecipe.description}
                                </Text>
                            </View>

                            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
                                <View style={{ backgroundColor: '#F5F5F5', padding: 12, borderRadius: 8, flex: 1, alignItems: 'center' }}>
                                    <Text style={{ fontSize: 12, color: Colors.light.text.secondary }}>Prep</Text>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{generatedRecipe.prepTimeMin}m</Text>
                                </View>
                                <View style={{ backgroundColor: '#F5F5F5', padding: 12, borderRadius: 8, flex: 1, alignItems: 'center' }}>
                                    <Text style={{ fontSize: 12, color: Colors.light.text.secondary }}>Cook</Text>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{generatedRecipe.cookTimeMin}m</Text>
                                </View>
                                <View style={{ backgroundColor: '#F5F5F5', padding: 12, borderRadius: 8, flex: 1, alignItems: 'center' }}>
                                    <Text style={{ fontSize: 12, color: Colors.light.text.secondary }}>Cals</Text>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{generatedRecipe.nutrition.calories}</Text>
                                </View>
                            </View>

                            <View style={{ marginBottom: 24 }}>
                                <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>Ingredients</Text>
                                {generatedRecipe.ingredients.map((ing: any, i: number) => (
                                    <Text key={i} style={{ fontSize: 16, marginBottom: 4, color: Colors.light.text.primary }}>
                                        • {ing.amount} {ing.unit} {ing.name}
                                    </Text>
                                ))}
                            </View>

                            <View style={{ flexDirection: 'row', gap: 16 }}>
                                <TouchableOpacity
                                    style={{
                                        flex: 1,
                                        paddingVertical: 16,
                                        borderRadius: 12,
                                        borderWidth: 1,
                                        borderColor: Colors.light.border,
                                        alignItems: 'center'
                                    }}
                                    onPress={() => setGeneratedRecipe(null)}
                                >
                                    <Text style={{ color: Colors.light.text.primary, fontSize: 16, fontWeight: '600' }}>Try Again</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{
                                        flex: 2,
                                        backgroundColor: Colors.secondary.main,
                                        paddingVertical: 16,
                                        borderRadius: 12,
                                        alignItems: 'center'
                                    }}
                                    onPress={handleSave}
                                >
                                    <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Save Recipe</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    )}

                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}
