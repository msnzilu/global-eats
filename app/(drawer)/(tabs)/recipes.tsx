import Sidebar from '@/components/Sidebar';
import SidebarToggle from '@/components/SidebarToggle';
import { isCuisineLocal } from '@/constants/cuisine-regions';
import { useRecipes } from '@/hooks/useRecipes';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Recipe } from '@/types';
import { Colors } from '@/utils/constants';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type RecipeType = 'my-recipes' | 'discover';
type DiscoveryFilter = 'local' | 'international';

export default function Recipes() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { myRecipes, discoveredRecipes, loading, error, deleteRecipe } = useRecipes();
    const { profile } = useUserProfile();
    const [activeTab, setActiveTab] = useState<RecipeType>('my-recipes');
    const [discoveryFilter, setDiscoveryFilter] = useState<DiscoveryFilter>('local');
    const [searchQuery, setSearchQuery] = useState('');
    const [locationSearch, setLocationSearch] = useState('');
    const [sidebarVisible, setSidebarVisible] = useState(false);

    // Get base recipes based on active tab
    let displayedRecipes = activeTab === 'my-recipes' ? myRecipes : discoveredRecipes;

    // Apply discovery filter (local/international) only for discover tab
    if (activeTab === 'discover') {
        // Only apply local/international filter if user has region data
        if (profile?.country || profile?.region) {
            displayedRecipes = displayedRecipes.filter(recipe => {
                const isLocal = isCuisineLocal(recipe.cuisine, profile?.country, profile?.region);

                if (discoveryFilter === 'local') {
                    return isLocal;
                } else {
                    return !isLocal; // international
                }
            });
        }
        // If no user region data, show all recipes regardless of filter

        // Apply location search filter (only for local recipes)
        if (discoveryFilter === 'local' && locationSearch.trim()) {
            const lowerLocationQuery = locationSearch.toLowerCase();
            displayedRecipes = displayedRecipes.filter(recipe => {
                return (
                    recipe.location?.toLowerCase().includes(lowerLocationQuery) ||
                    recipe.cuisine.toLowerCase().includes(lowerLocationQuery) ||
                    recipe.name.toLowerCase().includes(lowerLocationQuery) // Also search recipe name
                );
            });
        }
    }

    // Apply general search query filter
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
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                    <Text style={{
                        fontSize: 28,
                        fontWeight: 'bold',
                        color: 'white'
                    }}>
                        Recipes
                    </Text>
                    <SidebarToggle onPress={() => setSidebarVisible(true)} />
                </View>

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
                        backgroundColor: activeTab === 'discover' ? Colors.primary.main : 'transparent',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6
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
                    {profile?.subscriptionTier === 'free' && (
                        <Ionicons
                            name="lock-closed"
                            size={14}
                            color={activeTab === 'discover' ? 'white' : Colors.light.text.secondary}
                        />
                    )}
                </TouchableOpacity>
            </View>

            {/* Discovery Filter (Local/International) - Only show on Discover tab */}
            {activeTab === 'discover' && (
                <>
                    {profile?.subscriptionTier === 'free' ? (
                        <View style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingHorizontal: 32,
                            marginTop: 60
                        }}>
                            <View style={{
                                width: 80,
                                height: 80,
                                borderRadius: 40,
                                backgroundColor: `${Colors.primary.main}15`,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: 24
                            }}>
                                <Ionicons name="lock-closed" size={40} color={Colors.primary.main} />
                            </View>
                            <Text style={{
                                fontSize: 24,
                                fontWeight: 'bold',
                                color: Colors.light.text.primary,
                                textAlign: 'center',
                                marginBottom: 12
                            }}>
                                Discover Premium Recipes
                            </Text>
                            <Text style={{
                                fontSize: 16,
                                color: Colors.light.text.secondary,
                                textAlign: 'center',
                                marginBottom: 32,
                                lineHeight: 24
                            }}>
                                Upgrade to Premium to access thousands of curated recipes from around the world and use AI generation.
                            </Text>
                            <TouchableOpacity
                                style={{
                                    backgroundColor: Colors.primary.main,
                                    paddingHorizontal: 32,
                                    paddingVertical: 16,
                                    borderRadius: 12,
                                    width: '100%',
                                    alignItems: 'center'
                                }}
                                onPress={() => router.push('/subscription')}
                            >
                                <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
                                    Upgrade to Premium
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={{ marginHorizontal: 24, marginTop: 16 }}>
                            {/* Local/International Toggle */}
                            <View style={{
                                flexDirection: 'row',
                                backgroundColor: Colors.light.surface,
                                borderRadius: 10,
                                padding: 4,
                                marginBottom: 12
                            }}>
                                <TouchableOpacity
                                    style={{
                                        flex: 1,
                                        paddingVertical: 10,
                                        borderRadius: 8,
                                        backgroundColor: discoveryFilter === 'local' ? Colors.secondary.main : 'transparent'
                                    }}
                                    onPress={() => {
                                        setDiscoveryFilter('local');
                                        setLocationSearch(''); // Clear location search when switching
                                    }}
                                    activeOpacity={0.7}
                                >
                                    <Text style={{
                                        textAlign: 'center',
                                        fontSize: 14,
                                        fontWeight: '600',
                                        color: discoveryFilter === 'local' ? 'white' : Colors.light.text.secondary
                                    }}>
                                        🏠 Local
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{
                                        flex: 1,
                                        paddingVertical: 10,
                                        borderRadius: 8,
                                        backgroundColor: discoveryFilter === 'international' ? Colors.secondary.main : 'transparent'
                                    }}
                                    onPress={() => {
                                        setDiscoveryFilter('international');
                                        setLocationSearch(''); // Clear location search when switching
                                    }}
                                    activeOpacity={0.7}
                                >
                                    <Text style={{
                                        textAlign: 'center',
                                        fontSize: 14,
                                        fontWeight: '600',
                                        color: discoveryFilter === 'international' ? 'white' : Colors.light.text.secondary
                                    }}>
                                        🌍 International
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {/* Location Search (only for local filter) */}
                            {discoveryFilter === 'local' && (
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    backgroundColor: 'white',
                                    borderRadius: 10,
                                    paddingHorizontal: 14,
                                    paddingVertical: 10,
                                    borderWidth: 1,
                                    borderColor: Colors.light.border
                                }}>
                                    <Text style={{ fontSize: 16, marginRight: 8 }}>📍</Text>
                                    <TextInput
                                        placeholder="Search location (e.g., Kenya, Rome)..."
                                        placeholderTextColor={Colors.light.text.tertiary}
                                        value={locationSearch}
                                        onChangeText={setLocationSearch}
                                        style={{
                                            flex: 1,
                                            fontSize: 14,
                                            color: Colors.light.text.primary
                                        }}
                                    />
                                    {locationSearch.length > 0 && (
                                        <TouchableOpacity onPress={() => setLocationSearch('')}>
                                            <Text style={{ fontSize: 18, color: Colors.light.text.secondary }}>✕</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            )}

                            {/* User Region Indicator */}
                            {profile?.country || profile?.region ? (
                                <View style={{ marginTop: 8, flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 12, color: Colors.light.text.tertiary }}>
                                        Your region: {profile.country || profile.region}
                                    </Text>
                                </View>
                            ) : (
                                <View style={{
                                    marginTop: 8,
                                    padding: 12,
                                    backgroundColor: Colors.secondary.main + '20',
                                    borderRadius: 8,
                                    borderLeftWidth: 3,
                                    borderLeftColor: Colors.secondary.main
                                }}>
                                    <Text style={{ fontSize: 12, color: Colors.light.text.primary, fontWeight: '600' }}>
                                        💡 Set your country/region in Profile Settings
                                    </Text>
                                    <Text style={{ fontSize: 11, color: Colors.light.text.secondary, marginTop: 4 }}>
                                        Local/International filtering works best when you set your location
                                    </Text>
                                </View>
                            )}
                        </View>
                    )}
                </>
            )}

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

            <Sidebar
                visible={sidebarVisible}
                onClose={() => setSidebarVisible(false)}
            />
            {/* Create Recipe FAB */}
            <TouchableOpacity
                style={{
                    position: 'absolute',
                    bottom: 24,
                    right: 24,
                    backgroundColor: Colors.primary.main,
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                    alignItems: 'center',
                    justifyContent: 'center',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                    elevation: 8
                }}
                onPress={() => router.push('/recipes/create-choice')}
            >
                <Ionicons name="add" size={32} color="white" />
            </TouchableOpacity>
        </View>
    );
}
