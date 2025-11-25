import { useAuth } from '@/hooks/useAuth';
import { createManualRecipe } from '@/services/firebase/recipes';
import { Ingredient, Nutrition, RecipeDifficulty } from '@/types';
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
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CreateManualRecipe() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [cuisine, setCuisine] = useState('');
    const [difficulty, setDifficulty] = useState<RecipeDifficulty>('Medium');
    const [prepTime, setPrepTime] = useState('');
    const [cookTime, setCookTime] = useState('');
    const [servings, setServings] = useState('');
    const [instructions, setInstructions] = useState('');

    // Ingredients State
    const [ingredients, setIngredients] = useState<Ingredient[]>([
        { name: '', amount: 0, unit: '' }
    ]);

    // Nutrition State
    const [nutrition, setNutrition] = useState<Nutrition>({
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0
    });

    // Validation Errors State
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleAddIngredient = () => {
        setIngredients([...ingredients, { name: '', amount: 0, unit: '' }]);
    };

    const handleRemoveIngredient = (index: number) => {
        const newIngredients = [...ingredients];
        newIngredients.splice(index, 1);
        setIngredients(newIngredients);
    };

    const updateIngredient = (index: number, field: keyof Ingredient, value: string | number) => {
        const newIngredients = [...ingredients];
        newIngredients[index] = { ...newIngredients[index], [field]: value };
        setIngredients(newIngredients);
    };

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!name.trim()) newErrors.name = 'Recipe name is required';
        if (!cuisine.trim()) newErrors.cuisine = 'Cuisine is required';
        if (!instructions.trim()) newErrors.instructions = 'Instructions are required';
        if (ingredients.some(i => !i.name.trim())) newErrors.ingredients = 'All ingredients must have a name';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!user) return;

        if (!validate()) {
            Alert.alert('Missing Information', 'Please fill in all required fields');
            return;
        }

        setIsLoading(true);

        try {
            await createManualRecipe(user.uid, {
                name: name.trim(),
                description: description.trim(),
                cuisine: cuisine.trim(),
                difficulty,
                servings: parseInt(servings) || 1,
                prepTimeMin: parseInt(prepTime) || 0,
                cookTimeMin: parseInt(cookTime) || 0,
                ingredients: ingredients.filter(i => i.name.trim()),
                instructions: instructions.trim(),
                nutrition,
                isPublic: false,
            });

            Alert.alert(
                'Success',
                'Recipe created successfully!',
                [{ text: 'OK', onPress: () => router.replace('/(drawer)/(tabs)/recipes') }]
            );
        } catch (error) {
            console.error('Error creating recipe:', error);
            Alert.alert('Error', 'Failed to create recipe. Please try again.');
        } finally {
            setIsLoading(false);
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
                        Create Recipe
                    </Text>
                </View>
                <TouchableOpacity onPress={handleSave} disabled={isLoading}>
                    {isLoading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Save</Text>
                    )}
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
                    {/* Basic Info */}
                    <Text style={styles.sectionTitle}>Basic Information</Text>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Recipe Name *</Text>
                        <TextInput
                            style={[styles.input, errors.name ? { borderColor: 'red' } : undefined]}
                            value={name}
                            onChangeText={setName}
                            placeholder="e.g., Spicy Chicken Pasta"
                        />
                        {errors.name && <Text style={{ color: 'red', fontSize: 12, marginTop: 4 }}>{errors.name}</Text>}
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Description</Text>
                        <TextInput
                            style={[styles.input, { height: 80 }]}
                            value={description}
                            onChangeText={setDescription}
                            placeholder="Brief description of the dish..."
                            multiline
                        />
                    </View>

                    <View style={{ flexDirection: 'row', gap: 16 }}>
                        <View style={[styles.inputContainer, { flex: 1 }]}>
                            <Text style={styles.label}>Cuisine *</Text>
                            <TextInput
                                style={[styles.input, errors.cuisine ? { borderColor: 'red' } : undefined]}
                                value={cuisine}
                                onChangeText={setCuisine}
                                placeholder="e.g., Italian"
                            />
                        </View>
                        <View style={[styles.inputContainer, { flex: 1 }]}>
                            <Text style={styles.label}>Difficulty</Text>
                            <View style={{ flexDirection: 'row', borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: Colors.light.border }}>
                                {['Easy', 'Medium', 'Hard'].map((d) => (
                                    <TouchableOpacity
                                        key={d}
                                        style={{
                                            flex: 1,
                                            paddingVertical: 12,
                                            backgroundColor: difficulty === d ? Colors.primary.main : 'white',
                                            alignItems: 'center'
                                        }}
                                        onPress={() => setDifficulty(d as RecipeDifficulty)}
                                    >
                                        <Text style={{
                                            color: difficulty === d ? 'white' : Colors.light.text.secondary,
                                            fontSize: 12,
                                            fontWeight: '600'
                                        }}>{d}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </View>

                    {/* Time & Servings */}
                    <Text style={styles.sectionTitle}>Time & Servings</Text>
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                        <View style={[styles.inputContainer, { flex: 1 }]}>
                            <Text style={styles.label}>Prep (min)</Text>
                            <TextInput
                                style={styles.input}
                                value={prepTime}
                                onChangeText={setPrepTime}
                                keyboardType="numeric"
                                placeholder="0"
                            />
                        </View>
                        <View style={[styles.inputContainer, { flex: 1 }]}>
                            <Text style={styles.label}>Cook (min)</Text>
                            <TextInput
                                style={styles.input}
                                value={cookTime}
                                onChangeText={setCookTime}
                                keyboardType="numeric"
                                placeholder="0"
                            />
                        </View>
                        <View style={[styles.inputContainer, { flex: 1 }]}>
                            <Text style={styles.label}>Servings</Text>
                            <TextInput
                                style={styles.input}
                                value={servings}
                                onChangeText={setServings}
                                keyboardType="numeric"
                                placeholder="1"
                            />
                        </View>
                    </View>

                    {/* Ingredients */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, marginBottom: 16 }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: Colors.light.text.primary }}>Ingredients *</Text>
                        <TouchableOpacity onPress={handleAddIngredient}>
                            <Text style={{ color: Colors.primary.main, fontWeight: '600' }}>+ Add Item</Text>
                        </TouchableOpacity>
                    </View>
                    {errors.ingredients && <Text style={{ color: 'red', marginBottom: 8 }}>{errors.ingredients}</Text>}

                    {ingredients.map((ingredient, index) => (
                        <View key={index} style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
                            <TextInput
                                style={[styles.input, { flex: 2 }]}
                                value={ingredient.name}
                                onChangeText={(text) => updateIngredient(index, 'name', text)}
                                placeholder="Item name"
                            />
                            <TextInput
                                style={[styles.input, { flex: 1 }]}
                                value={ingredient.amount ? ingredient.amount.toString() : ''}
                                onChangeText={(text) => updateIngredient(index, 'amount', parseFloat(text) || 0)}
                                keyboardType="numeric"
                                placeholder="Qty"
                            />
                            <TextInput
                                style={[styles.input, { flex: 1 }]}
                                value={ingredient.unit}
                                onChangeText={(text) => updateIngredient(index, 'unit', text)}
                                placeholder="Unit"
                            />
                            {ingredients.length > 1 && (
                                <TouchableOpacity
                                    onPress={() => handleRemoveIngredient(index)}
                                    style={{ justifyContent: 'center', paddingHorizontal: 4 }}
                                >
                                    <Ionicons name="trash-outline" size={20} color="red" />
                                </TouchableOpacity>
                            )}
                        </View>
                    ))}

                    {/* Instructions */}
                    <Text style={styles.sectionTitle}>Instructions *</Text>
                    <TextInput
                        style={[styles.input, { height: 150, textAlignVertical: 'top' }, errors.instructions ? { borderColor: 'red' } : undefined]}
                        value={instructions}
                        onChangeText={setInstructions}
                        placeholder="Step 1: Chop the vegetables..."
                        multiline
                    />
                    {errors.instructions && <Text style={{ color: 'red', fontSize: 12, marginTop: 4 }}>{errors.instructions}</Text>}

                    {/* Nutrition (Optional) */}
                    <Text style={styles.sectionTitle}>Nutrition (per serving)</Text>
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                        <View style={[styles.inputContainer, { flex: 1 }]}>
                            <Text style={styles.label}>Calories</Text>
                            <TextInput
                                style={styles.input}
                                value={nutrition.calories ? nutrition.calories.toString() : ''}
                                onChangeText={(text) => setNutrition({ ...nutrition, calories: parseInt(text) || 0 })}
                                keyboardType="numeric"
                                placeholder="0"
                            />
                        </View>
                        <View style={[styles.inputContainer, { flex: 1 }]}>
                            <Text style={styles.label}>Protein (g)</Text>
                            <TextInput
                                style={styles.input}
                                value={nutrition.protein ? nutrition.protein.toString() : ''}
                                onChangeText={(text) => setNutrition({ ...nutrition, protein: parseInt(text) || 0 })}
                                keyboardType="numeric"
                                placeholder="0"
                            />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                        <View style={[styles.inputContainer, { flex: 1 }]}>
                            <Text style={styles.label}>Carbs (g)</Text>
                            <TextInput
                                style={styles.input}
                                value={nutrition.carbs ? nutrition.carbs.toString() : ''}
                                onChangeText={(text) => setNutrition({ ...nutrition, carbs: parseInt(text) || 0 })}
                                keyboardType="numeric"
                                placeholder="0"
                            />
                        </View>
                        <View style={[styles.inputContainer, { flex: 1 }]}>
                            <Text style={styles.label}>Fat (g)</Text>
                            <TextInput
                                style={styles.input}
                                value={nutrition.fat ? nutrition.fat.toString() : ''}
                                onChangeText={(text) => setNutrition({ ...nutrition, fat: parseInt(text) || 0 })}
                                keyboardType="numeric"
                                placeholder="0"
                            />
                        </View>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.light.text.primary,
        marginTop: 24,
        marginBottom: 16
    },
    inputContainer: {
        marginBottom: 16
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.light.text.secondary,
        marginBottom: 8
    },
    input: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 12,
        borderWidth: 1,
        borderColor: Colors.light.border,
        fontSize: 16,
        color: Colors.light.text.primary
    }
});
