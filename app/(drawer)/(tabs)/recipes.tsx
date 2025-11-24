import { useRecipes } from '@/hooks/useRecipes';
import { Recipe } from '@/types';
import { Colors } from '@/utils/constants';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type RecipeType = 'my-recipes' | 'discover';

export default function Recipes() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { myRecipes, discoveredRecipes, loading, error, deleteRecipe } = useRecipes();
    const [activeTab, setActiveTab] = useState<RecipeType>('my-recipes');
    const [searchQuery, setSearchQuery] = useState('');

    const displayedRecipes = activeTab === 'my-recipes' ? myRecipes : discoveredRecipes;

    // Filter recipes based on search query
    const filteredRecipes = displayedRecipes.filter(recipe => {
        if (!searchQuery.trim()) return true;
        const lowerQuery = searchQuery.toLowerCase();
        return (
            recipe.name.toLowerCase().includes(lowerQuery) ||
            recipe.cuisine.toLowerCase().includes(lowerQuery) ||
            recipe.description?.toLowerCase().includes(lowerQuery)
        );
    });

    const handleDeleteRecipe = (recipeId: string, recipeName: string) => {
        Alert.alert(
            'Delete Recipe',
            `Are you sure you want to delete "${recipeName}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteRecipe(recipeId);
                            Alert.alert('Success', 'Recipe deleted successfully');
                        } catch (err: any) {
                            Alert.alert('Error', err.message || 'Failed to delete recipe');
                        }
                    }
                }
            ]
        );
    };

    const RecipeCard = ({ recipe }: { recipe: Recipe }) => (
        <TouchableOpacity
            style={{
                backgroundColor: 'white',
                borderRadius: 16,
                marginBottom: 16,
                overflow: 'hidden',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 3
            }}
            onPress={() => router.push(`/recipes/recipe-detail?id=${recipe.id}`)}
            activeOpacity={0.7}
        >
            {/* Recipe Image */}
            <View style={{ position: 'relative' }}>
                <Image
                    source={{ uri: recipe.imageUrl || 'https://via.placeholder.com/400x180?text=No+Image' }}
                    style={{ width: '100%', height: 180 }}
                    resizeMode="cover"
                />
                {/* Source Badge */}
                <View style={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    backgroundColor: recipe.source === 'custom' ? Colors.primary.main : Colors.secondary.main,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 20
                }}>
                    <Text style={{ fontSize: 12, fontWeight: '600', color: 'white' }}>
                        {recipe.source === 'custom' ? 'My Recipe' : 'Discover'}
                    </Text>
                </View>
            </View>

            {/* Recipe Info */}
            <View style={{ padding: 16 }}>
                <Text style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: Colors.light.text.primary,
                    marginBottom: 8
                }}>
                    {recipe.name}
                </Text>

                {/* Cuisine Tag */}
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 }}>
                    <View style={{
                        backgroundColor: Colors.light.surface,
                        paddingHorizontal: 10,
                        paddingVertical: 4,
                        borderRadius: 12,
                        marginRight: 6,
                        marginBottom: 6
                    }}>
                        <Text style={{ fontSize: 12, color: Colors.primary.main, fontWeight: '500' }}>
                            {recipe.cuisine}
                        </Text>
                    </View>
                </View>

                {/* Time and Servings */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 20 }}>
                        <Text style={{ fontSize: 20, marginRight: 6 }}>⏱️</Text>
                        <Text style={{ fontSize: 14, color: Colors.light.text.secondary }}>
                            {recipe.prepTimeMin + recipe.cookTimeMin} min
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontSize: 20, marginRight: 6 }}>🍽️</Text>
                        <Text style={{ fontSize: 14, color: Colors.light.text.secondary }}>
                            {recipe.servings} servings
                        </Text>
                    </View>
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
                            {recipe.nutrition.calories}
                        </Text>
                        <Text style={{ fontSize: 12, color: Colors.light.text.secondary, marginTop: 2 }}>
                            cal
                        </Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: Colors.secondary.main }}>
                            {recipe.nutrition.protein}g
                        </Text>
                        <Text style={{ fontSize: 12, color: Colors.light.text.secondary, marginTop: 2 }}>
                            protein
                        </Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: Colors.primary.dark }}>
                            {recipe.nutrition.carbs}g
                        </Text>
                        <Text style={{ fontSize: 12, color: Colors.light.text.secondary, marginTop: 2 }}>
                            carbs
                        </Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#F59E0B' }}>
                            {recipe.nutrition.fat}g
                        </Text>
                        <Text style={{ fontSize: 12, color: Colors.light.text.secondary, marginTop: 2 }}>
                            fat
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={{ flex: 1, backgroundColor: Colors.light.background }}>
            {/* Header */}
            <View style={{
                backgroundColor: Colors.primary.main,
                paddingTop: insets.top + 16,
                paddingBottom: 20,
                paddingHorizontal: 24
            }}>
                <Text style={{
                    fontSize: 28,
                    fontWeight: 'bold',
                    color: 'white',
                    marginBottom: 16
                }}>
                    Recipes
                </Text>

                {/* Search Bar */}
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 12
                }}>
                    <Text style={{ fontSize: 18, marginRight: 8 }}>🔍</Text>
                    <TextInput
                        placeholder="Search recipes..."
                        placeholderTextColor="rgba(255, 255, 255, 0.7)"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        style={{
                            flex: 1,
                            fontSize: 16,
                            color: 'white'
                        }}
                    />
                </View>
            </View>

            {/* Tabs */}
            <View style={{
                flexDirection: 'row',
                backgroundColor: 'white',
                marginHorizontal: 24,
                marginTop: -12,
                borderRadius: 12,
                padding: 4,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 3
            }}>
                <TouchableOpacity
                    style={{
                        flex: 1,
                        paddingVertical: 12,
                        borderRadius: 10,
                        backgroundColor: activeTab === 'my-recipes' ? Colors.primary.main : 'transparent'
                    }}
                    onPress={() => setActiveTab('my-recipes')}
                    activeOpacity={0.7}
                >
                    <Text style={{
                        textAlign: 'center',
                        fontSize: 15,
                        fontWeight: '600',
                        color: activeTab === 'my-recipes' ? 'white' : Colors.light.text.secondary
                    }}>
                        My Recipes
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        flex: 1,
                        paddingVertical: 12,
                        borderRadius: 10,
                        backgroundColor: activeTab === 'discover' ? Colors.primary.main : 'transparent'
                    }}
                    onPress={() => setActiveTab('discover')}
                    activeOpacity={0.7}
                >
                    <Text style={{
                        textAlign: 'center',
                        fontSize: 15,
                        fontWeight: '600',
                        color: activeTab === 'discover' ? 'white' : Colors.light.text.secondary
                    }}>
                        Discover
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Error Message */}
            {error && (
                <View style={{
                    backgroundColor: '#FEE2E2',
                    padding: 12,
                    marginHorizontal: 24,
                    marginTop: 16,
                    borderRadius: 8,
                    borderLeftWidth: 4,
                    borderLeftColor: '#EF4444'
                }}>
                    <Text style={{ color: '#991B1B', fontSize: 14 }}>
                        {error}
                    </Text>
                </View>
            )}

            {/* Loading Indicator */}
            {loading && myRecipes.length === 0 && discoveredRecipes.length === 0 ? (
                <View style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingTop: 60
                }}>
                    <ActivityIndicator size="large" color={Colors.primary.main} />
                    <Text style={{
                        marginTop: 16,
                        fontSize: 16,
                        color: Colors.light.text.secondary
                    }}>
                        Loading recipes...
                    </Text>
                </View>
            ) : (
                <>
                    {/* Recipe List */}
                    <ScrollView
                        style={{ flex: 1 }}
                        contentContainerStyle={{
                            paddingHorizontal: 24,
                            paddingTop: 24,
                            paddingBottom: 100 + insets.bottom
                        }}
                        showsVerticalScrollIndicator={false}
                    >
                        {filteredRecipes.length > 0 ? (
                            filteredRecipes.map((recipe) => (
                                <RecipeCard key={recipe.id} recipe={recipe} />
                            ))
                        ) : (
                            <View style={{ alignItems: 'center', paddingVertical: 60 }}>
                                <Text style={{ fontSize: 60, marginBottom: 16 }}>📖</Text>
                                <Text style={{
                                    fontSize: 18,
                                    fontWeight: '600',
                                    color: Colors.light.text.primary,
                                    marginBottom: 8
                                }}>
                                    {activeTab === 'my-recipes' ? 'No Recipes Yet' : 'Discover Recipes'}
                                </Text>
                                <Text style={{
                                    fontSize: 14,
                                    color: Colors.light.text.secondary,
                                    textAlign: 'center',
                                    paddingHorizontal: 40
                                }}>
                                    {activeTab === 'my-recipes'
                                        ? 'Create your first recipe or fork one from Discover'
                                        : 'Search for recipes based on your preferences'}
                                </Text>
                            </View>
                        )}
                    </ScrollView>
                </>
            )}

            {/* Floating Action Button (Create Recipe) */}
            {activeTab === 'my-recipes' && (
                <TouchableOpacity
                    style={{
                        position: 'absolute',
                        bottom: 24 + insets.bottom,
                        right: 24,
                        width: 60,
                        height: 60,
                        borderRadius: 30,
                        backgroundColor: Colors.secondary.main,
                        alignItems: 'center',
                        justifyContent: 'center',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 8,
                        elevation: 8
                    }}
                    onPress={() => router.push('/recipes/create')}
                    activeOpacity={0.8}
                >
                    <Text style={{ fontSize: 28, color: 'white', fontWeight: 'bold' }}>+</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}
