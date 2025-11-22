import { Colors } from '@/utils/constants';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface InventoryItem {
    id: string;
    name: string;
    quantity: number;
    unit: string;
    category: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
}

export default function Inventory() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');

    // Mock inventory data
    const mockItems: InventoryItem[] = [
        { id: '1', name: 'Chicken Breast', quantity: 1000, unit: 'g', category: 'Protein', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
        { id: '2', name: 'Brown Rice', quantity: 2, unit: 'kg', category: 'Grains', calories: 370, protein: 7.9, carbs: 77, fat: 2.9 },
        { id: '3', name: 'Tomatoes', quantity: 500, unit: 'g', category: 'Produce', calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2 },
        { id: '4', name: 'Greek Yogurt', quantity: 500, unit: 'ml', category: 'Dairy', calories: 59, protein: 10, carbs: 3.6, fat: 0.4 },
        { id: '5', name: 'Olive Oil', quantity: 500, unit: 'ml', category: 'Oils', calories: 884, protein: 0, carbs: 0, fat: 100 },
        { id: '6', name: 'Quinoa', quantity: 1, unit: 'kg', category: 'Grains', calories: 368, protein: 14, carbs: 64, fat: 6 },
        { id: '7', name: 'Salmon Fillet', quantity: 500, unit: 'g', category: 'Protein', calories: 208, protein: 20, carbs: 0, fat: 13 },
        { id: '8', name: 'Spinach', quantity: 300, unit: 'g', category: 'Produce', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4 },
        { id: '9', name: 'Eggs', quantity: 12, unit: 'pieces', category: 'Protein', calories: 155, protein: 13, carbs: 1.1, fat: 11 },
        { id: '10', name: 'Avocado', quantity: 3, unit: 'pieces', category: 'Produce', calories: 160, protein: 2, carbs: 8.5, fat: 15 },
    ];

    const categories = ['All', 'Protein', 'Grains', 'Produce', 'Dairy', 'Oils'];

    const filteredItems = mockItems.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

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
                    onPress={() => {/* TODO: Delete item */ }}
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
                    🔥 {item.calories} cal
                </Text>
                <Text style={{ fontSize: 12, color: Colors.light.text.secondary }}>
                    💪 {item.protein}g
                </Text>
                <Text style={{ fontSize: 12, color: Colors.light.text.secondary }}>
                    🍞 {item.carbs}g
                </Text>
                <Text style={{ fontSize: 12, color: Colors.light.text.secondary }}>
                    🥑 {item.fat}g
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
                    {mockItems.length} items in stock
                </Text>
            </View>

            {/* Search Bar */}
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
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginTop: 16 }}
                contentContainerStyle={{
                    paddingHorizontal: 24,
                    gap: 8
                }}
            >
                {categories.map((category) => (
                    <TouchableOpacity
                        key={category}
                        style={{
                            paddingHorizontal: 16,
                            paddingVertical: 8,
                            borderRadius: 20,
                            backgroundColor: selectedCategory === category ? Colors.primary.main : 'white',
                            borderWidth: 1,
                            borderColor: selectedCategory === category ? Colors.primary.main : Colors.light.border
                        }}
                        onPress={() => setSelectedCategory(category)}
                    >
                        <Text style={{
                            fontSize: 14,
                            fontWeight: '600',
                            color: selectedCategory === category ? 'white' : Colors.light.text.secondary
                        }}>
                            {category}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

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
        </View>
    );
}

// Need to add ScrollView import
import { ScrollView } from 'react-native';

