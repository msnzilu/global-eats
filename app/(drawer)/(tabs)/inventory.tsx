import Sidebar from '@/components/Sidebar';
import SidebarToggle from '@/components/SidebarToggle';
import { useInventory } from '@/hooks/useInventory';
import { InventoryItem } from '@/types';
import { Colors } from '@/utils/constants';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Inventory() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { items, loading, error, deleteItem } = useInventory();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [sidebarVisible, setSidebarVisible] = useState(false);

    const categories = ['All', 'Protein', 'Grains', 'Produce', 'Dairy', 'Oils', 'Other'];

    const filteredItems = items.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleDeleteItem = (itemId: string, itemName: string) => {
        Alert.alert(
            'Delete Item',
            `Are you sure you want to delete "${itemName}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteItem(itemId);
                        } catch (err: any) {
                            Alert.alert('Error', err.message || 'Failed to delete item');
                        }
                    }
                }
            ]
        );
    };

    const renderItem = ({ item }: { item: InventoryItem }) => (
        <View style={{
            backgroundColor: 'white',
            borderRadius: 12,
            padding: 16,
            marginBottom: 12,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.08,
            shadowRadius: 4,
            elevation: 2
        }}>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 8
            }}>
                <View style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: `${Colors.primary.main}15`,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12
                }}>
                    <Text style={{ fontSize: 24 }}>
                        {item.category === 'Protein' ? '🍗' :
                            item.category === 'Grains' ? '🌾' :
                                item.category === 'Produce' ? '🥬' :
                                    item.category === 'Dairy' ? '🥛' :
                                        item.category === 'Oils' ? '🫒' : '📦'}
                    </Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: '600',
                        color: Colors.light.text.primary,
                        marginBottom: 4
                    }}>
                        {item.name}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{
                            backgroundColor: `${Colors.secondary.main}20`,
                            paddingHorizontal: 8,
                            paddingVertical: 2,
                            borderRadius: 6,
                            marginRight: 8
                        }}>
                            <Text style={{
                                fontSize: 11,
                                fontWeight: '600',
                                color: Colors.secondary.main
                            }}>
                                {item.category}
                            </Text>
                        </View>
                        <Text style={{
                            fontSize: 14,
                            fontWeight: '600',
                            color: Colors.primary.main
                        }}>
                            {item.quantity} {item.unit}
                        </Text>
                    </View>
                </View>
                <TouchableOpacity
                    onPress={() => handleDeleteItem(item.id, item.name)}
                    style={{
                        width: 32,
                        height: 32,
                        borderRadius: 16,
                        backgroundColor: '#FEE2E2',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Ionicons name="trash-outline" size={16} color="#EF4444" />
                </TouchableOpacity>
            </View>

            {/* Nutrition Info */}
            <View style={{
                flexDirection: 'row',
                paddingTop: 12,
                borderTopWidth: 1,
                borderTopColor: Colors.light.border,
                gap: 16
            }}>
                <Text style={{ fontSize: 12, color: Colors.light.text.secondary }}>
                    🔥 {item.nutrition.calories} cal
                </Text>
                <Text style={{ fontSize: 12, color: Colors.light.text.secondary }}>
                    💪 {item.nutrition.protein}g
                </Text>
                <Text style={{ fontSize: 12, color: Colors.light.text.secondary }}>
                    🍞 {item.nutrition.carbs}g
                </Text>
                <Text style={{ fontSize: 12, color: Colors.light.text.secondary }}>
                    🥑 {item.nutrition.fat}g
                </Text>
            </View>
        </View>
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
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{
                            fontSize: 28,
                            fontWeight: 'bold',
                            color: 'white',
                            marginBottom: 8
                        }}>
                            Inventory
                        </Text>
                        <Text style={{
                            fontSize: 14,
                            color: 'rgba(255, 255, 255, 0.9)'
                        }}>
                            {loading ? 'Loading...' : `${items.length} items in stock`}
                        </Text>
                    </View>
                    <SidebarToggle onPress={() => setSidebarVisible(true)} />
                </View>
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
            {loading && items.length === 0 && (
                <View style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <ActivityIndicator size="large" color={Colors.primary.main} />
                    <Text style={{
                        marginTop: 16,
                        fontSize: 16,
                        color: Colors.light.text.secondary
                    }}>
                        Loading inventory...
                    </Text>
                </View>
            )}

            {/* Search Bar */}
            {!loading || items.length > 0 ? (
                <>
                    <View style={{
                        paddingHorizontal: 24,
                        paddingTop: 16
                    }}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: 'white',
                            borderRadius: 12,
                            paddingHorizontal: 16,
                            paddingVertical: 12,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                            elevation: 2
                        }}>
                            <Ionicons name="search" size={20} color={Colors.light.text.tertiary} />
                            <TextInput
                                style={{
                                    flex: 1,
                                    marginLeft: 12,
                                    fontSize: 16,
                                    color: Colors.light.text.primary
                                }}
                                placeholder="Search inventory..."
                                placeholderTextColor={Colors.light.text.tertiary}
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                        </View>
                    </View>

                    {/* Category Filter */}
                    <View style={{
                        marginTop: 16,
                        marginBottom: 12,
                        height: 50
                    }}>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{
                                paddingHorizontal: 24,
                                alignItems: 'center',
                                height: 50
                            }}
                        >
                            {categories.map((category, index) => (
                                <TouchableOpacity
                                    key={category}
                                    style={{
                                        paddingHorizontal: 20,
                                        paddingVertical: 10,
                                        borderRadius: 22,
                                        backgroundColor: selectedCategory === category ? Colors.primary.main : 'white',
                                        borderWidth: 1.5,
                                        borderColor: selectedCategory === category ? Colors.primary.main : Colors.light.border,
                                        marginRight: 12,
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.1,
                                        shadowRadius: 3,
                                        elevation: 2,
                                        height: 44,
                                        justifyContent: 'center'
                                    }}
                                    onPress={() => setSelectedCategory(category)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={{
                                        fontSize: 15,
                                        fontWeight: '600',
                                        color: selectedCategory === category ? 'white' : Colors.light.text.primary
                                    }}>
                                        {category}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Items List */}
                    <FlatList
                        data={filteredItems}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={{
                            paddingHorizontal: 24,
                            paddingTop: 16,
                            paddingBottom: 100 + insets.bottom
                        }}
                        ListEmptyComponent={
                            <View style={{
                                alignItems: 'center',
                                paddingVertical: 60
                            }}>
                                <Ionicons name="basket-outline" size={64} color={Colors.light.text.tertiary} />
                                <Text style={{
                                    fontSize: 18,
                                    fontWeight: '600',
                                    color: Colors.light.text.primary,
                                    marginTop: 16,
                                    marginBottom: 8
                                }}>
                                    No Items Found
                                </Text>
                                <Text style={{
                                    fontSize: 14,
                                    color: Colors.light.text.secondary,
                                    textAlign: 'center'
                                }}>
                                    {searchQuery ? 'Try a different search' : 'Add items to get started'}
                                </Text>
                            </View>
                        }
                    />
                </>
            ) : null}

            {/* Add Button (FAB) */}
            <TouchableOpacity
                style={{
                    position: 'absolute',
                    bottom: 24 + insets.bottom,
                    right: 24,
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                    backgroundColor: Colors.primary.main,
                    alignItems: 'center',
                    justifyContent: 'center',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 8
                }}
                onPress={() => router.push('/inventory/add')}
            >
                <Ionicons name="add" size={28} color="white" />
            </TouchableOpacity>

            <Sidebar
                visible={sidebarVisible}
                onClose={() => setSidebarVisible(false)}
            />
        </View>
    );
}