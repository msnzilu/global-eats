import { Colors } from '@/utils/constants';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ShoppingItem {
    id: string;
    name: string;
    quantity: number;
    unit: string;
    category: string;
    isChecked: boolean;
}

export default function ShoppingList() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    // Mock data - will be replaced with actual shopping list from Firestore
    const [items, setItems] = useState<ShoppingItem[]>([
        { id: '1', name: 'Chicken Breast', quantity: 1000, unit: 'g', category: 'Protein', isChecked: false },
        { id: '2', name: 'Tomatoes', quantity: 500, unit: 'g', category: 'Produce', isChecked: false },
        { id: '3', name: 'Yogurt', quantity: 400, unit: 'ml', category: 'Dairy', isChecked: true },
        { id: '4', name: 'Rice', quantity: 2, unit: 'kg', category: 'Grains', isChecked: false },
        { id: '5', name: 'Onions', quantity: 3, unit: 'pieces', category: 'Produce', isChecked: false },
        { id: '6', name: 'Garlic', quantity: 1, unit: 'bulb', category: 'Produce', isChecked: false },
    ]);

    const toggleItem = (id: string) => {
        setItems(prev => prev.map(item =>
            item.id === id ? { ...item, isChecked: !item.isChecked } : item
        ));
    };

    const addCheckedToInventory = () => {
        // TODO: Implement adding checked items to inventory
        const checkedItems = items.filter(item => item.isChecked);
        console.log('Adding to inventory:', checkedItems);
    };

    const clearChecked = () => {
        setItems(prev => prev.filter(item => !item.isChecked));
    };

    const groupedItems = items.reduce((acc, item) => {
        if (!acc[item.category]) {
            acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
    }, {} as Record<string, ShoppingItem[]>);

    const categories = Object.keys(groupedItems).sort();
    const checkedCount = items.filter(item => item.isChecked).length;

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
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={{ marginRight: 16 }}
                >
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                    <Text style={{
                        fontSize: 24,
                        fontWeight: 'bold',
                        color: 'white'
                    }}>
                        Shopping List
                    </Text>
                    <Text style={{
                        fontSize: 14,
                        color: 'rgba(255, 255, 255, 0.9)',
                        marginTop: 4
                    }}>
                        {items.length} items • {checkedCount} checked
                    </Text>
                </View>
            </View>

            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{
                    paddingHorizontal: 24,
                    paddingTop: 16,
                    paddingBottom: checkedCount > 0 ? 180 + insets.bottom : 100 + insets.bottom
                }}
            >
                {categories.map((category) => (
                    <View key={category} style={{ marginBottom: 24 }}>
                        <Text style={{
                            fontSize: 16,
                            fontWeight: 'bold',
                            color: Colors.light.text.primary,
                            marginBottom: 12,
                            textTransform: 'uppercase',
                            letterSpacing: 0.5
                        }}>
                            {category}
                        </Text>
                        {groupedItems[category]
                            .sort((a, b) => Number(a.isChecked) - Number(b.isChecked))
                            .map((item) => (
                                <TouchableOpacity
                                    key={item.id}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        backgroundColor: 'white',
                                        padding: 16,
                                        borderRadius: 12,
                                        marginBottom: 8,
                                        opacity: item.isChecked ? 0.6 : 1
                                    }}
                                    onPress={() => toggleItem(item.id)}
                                    activeOpacity={0.7}
                                >
                                    <View style={{
                                        width: 24,
                                        height: 24,
                                        borderRadius: 12,
                                        borderWidth: 2,
                                        borderColor: item.isChecked ? Colors.secondary.main : Colors.light.border,
                                        backgroundColor: item.isChecked ? Colors.secondary.main : 'transparent',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginRight: 12
                                    }}>
                                        {item.isChecked && (
                                            <Ionicons name="checkmark" size={16} color="white" />
                                        )}
                                    </View>
                                    <Text style={{
                                        flex: 1,
                                        fontSize: 16,
                                        color: Colors.light.text.primary,
                                        textDecorationLine: item.isChecked ? 'line-through' : 'none'
                                    }}>
                                        {item.name}
                                    </Text>
                                    <Text style={{
                                        fontSize: 14,
                                        color: Colors.light.text.secondary,
                                        fontWeight: '500'
                                    }}>
                                        {item.quantity} {item.unit}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                    </View>
                ))}

                {items.length === 0 && (
                    <View style={{
                        alignItems: 'center',
                        paddingVertical: 60
                    }}>
                        <Ionicons name="cart-outline" size={64} color={Colors.light.text.tertiary} />
                        <Text style={{
                            fontSize: 18,
                            fontWeight: '600',
                            color: Colors.light.text.primary,
                            marginTop: 16,
                            marginBottom: 8
                        }}>
                            No Items Yet
                        </Text>
                        <Text style={{
                            fontSize: 14,
                            color: Colors.light.text.secondary,
                            textAlign: 'center',
                            paddingHorizontal: 40
                        }}>
                            Generate a meal plan to create your shopping list
                        </Text>
                    </View>
                )}
            </ScrollView>

            {/* Action Buttons */}
            {checkedCount > 0 && (
                <View style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: 'white',
                    paddingHorizontal: 24,
                    paddingTop: 16,
                    paddingBottom: 16 + insets.bottom,
                    borderTopWidth: 1,
                    borderTopColor: Colors.light.border
                }}>
                    <TouchableOpacity
                        style={{
                            backgroundColor: Colors.primary.main,
                            paddingVertical: 14,
                            borderRadius: 12,
                            alignItems: 'center',
                            marginBottom: 12
                        }}
                        onPress={addCheckedToInventory}
                    >
                        <Text style={{
                            fontSize: 16,
                            fontWeight: '600',
                            color: 'white'
                        }}>
                            Add {checkedCount} to Inventory
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            backgroundColor: Colors.light.surface,
                            paddingVertical: 14,
                            borderRadius: 12,
                            alignItems: 'center',
                            borderWidth: 1,
                            borderColor: Colors.light.border
                        }}
                        onPress={clearChecked}
                    >
                        <Text style={{
                            fontSize: 16,
                            fontWeight: '600',
                            color: Colors.light.text.primary
                        }}>
                            Clear Checked
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Share Button (FAB) */}
            <TouchableOpacity
                style={{
                    position: 'absolute',
                    bottom: checkedCount > 0 ? 160 + insets.bottom : 24 + insets.bottom,
                    right: 24,
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                    backgroundColor: Colors.secondary.main,
                    alignItems: 'center',
                    justifyContent: 'center',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 8
                }}
                onPress={() => {/* TODO: Implement share */ }}
            >
                <Ionicons name="share-outline" size={24} color="white" />
            </TouchableOpacity>
        </View>
    );
}
