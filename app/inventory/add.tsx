import { useInventory } from '@/hooks/useInventory';
import { InventoryCategory } from '@/types';
import { Colors } from '@/utils/constants';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AddInventoryItem() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { addItem } = useInventory();

    const [itemName, setItemName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [unit, setUnit] = useState('g');
    const [selectedCategory, setSelectedCategory] = useState<InventoryCategory>('Protein');
    const [calories, setCalories] = useState('');
    const [protein, setProtein] = useState('');
    const [carbs, setCarbs] = useState('');
    const [fat, setFat] = useState('');
    const [loading, setLoading] = useState(false);

    const categories: InventoryCategory[] = ['Protein', 'Grains', 'Produce', 'Dairy', 'Oils', 'Other'];
    const units = ['g', 'kg', 'ml', 'L', 'pieces', 'cups', 'tbsp', 'tsp'];

    const handleSave = async () => {
        // Validation
        if (!itemName.trim()) {
            Alert.alert('Error', 'Please enter an item name');
            return;
        }
        if (!quantity || parseFloat(quantity) <= 0) {
            Alert.alert('Error', 'Please enter a valid quantity');
            return;
        }

        setLoading(true);
        try {
            await addItem({
                name: itemName.trim(),
                quantity: parseFloat(quantity),
                unit,
                category: selectedCategory,
                nutrition: {
                    calories: calories ? parseFloat(calories) : 0,
                    protein: protein ? parseFloat(protein) : 0,
                    carbs: carbs ? parseFloat(carbs) : 0,
                    fat: fat ? parseFloat(fat) : 0,
                },
            });

            Alert.alert('Success', 'Item added to inventory', [
                { text: 'OK', onPress: () => router.back() }
            ]);
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to add item');
        } finally {
            setLoading(false);
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
                    Add Inventory Item
                </Text>
            </View>

            <ScrollView
                contentContainerStyle={{
                    padding: 24,
                    paddingBottom: insets.bottom + 100
                }}
            >
                {/* Item Name */}
                <View style={{ marginBottom: 20 }}>
                    <Text style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: Colors.light.text.secondary,
                        marginBottom: 8
                    }}>
                        Item Name *
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
                        placeholder="e.g., Chicken Breast"
                        value={itemName}
                        onChangeText={setItemName}
                    />
                </View>

                {/* Category */}
                <View style={{ marginBottom: 20 }}>
                    <Text style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: Colors.light.text.secondary,
                        marginBottom: 8
                    }}>
                        Category *
                    </Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                        {categories.map((category) => (
                            <TouchableOpacity
                                key={category}
                                onPress={() => setSelectedCategory(category)}
                                style={{
                                    paddingHorizontal: 16,
                                    paddingVertical: 10,
                                    borderRadius: 20,
                                    borderWidth: 2,
                                    borderColor: selectedCategory === category ? Colors.primary.main : Colors.light.border,
                                    backgroundColor: selectedCategory === category ? `${Colors.primary.main}15` : 'white'
                                }}
                            >
                                <Text style={{
                                    fontWeight: '600',
                                    color: selectedCategory === category ? Colors.primary.main : Colors.light.text.secondary
                                }}>
                                    {category}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Quantity & Unit Row */}
                <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
                    <View style={{ flex: 2 }}>
                        <Text style={{
                            fontSize: 14,
                            fontWeight: '600',
                            color: Colors.light.text.secondary,
                            marginBottom: 8
                        }}>
                            Quantity *
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
                            placeholder="500"
                            value={quantity}
                            onChangeText={setQuantity}
                            keyboardType="decimal-pad"
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={{
                            fontSize: 14,
                            fontWeight: '600',
                            color: Colors.light.text.secondary,
                            marginBottom: 8
                        }}>
                            Unit
                        </Text>
                        <View style={{
                            backgroundColor: 'white',
                            borderRadius: 12,
                            borderWidth: 1,
                            borderColor: Colors.light.border,
                            overflow: 'hidden'
                        }}>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{ padding: 8 }}
                            >
                                {units.map((u) => (
                                    <TouchableOpacity
                                        key={u}
                                        onPress={() => setUnit(u)}
                                        style={{
                                            paddingHorizontal: 12,
                                            paddingVertical: 8,
                                            borderRadius: 8,
                                            backgroundColor: unit === u ? Colors.primary.main : 'transparent',
                                            marginHorizontal: 2
                                        }}
                                    >
                                        <Text style={{
                                            fontSize: 14,
                                            fontWeight: '600',
                                            color: unit === u ? 'white' : Colors.light.text.secondary
                                        }}>
                                            {u}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    </View>
                </View>

                {/* Nutrition Section */}
                <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    marginBottom: 12,
                    marginTop: 8
                }}>
                    Nutrition (per 100g/100ml)
                </Text>
                <Text style={{
                    fontSize: 13,
                    color: Colors.light.text.secondary,
                    marginBottom: 12
                }}>
                    Optional - helps with meal planning
                </Text>

                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
                    <View style={{ flex: 1, minWidth: '45%' }}>
                        <Text style={{
                            fontSize: 14,
                            fontWeight: '600',
                            color: Colors.light.text.secondary,
                            marginBottom: 8
                        }}>
                            Calories
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
                            placeholder="165"
                            value={calories}
                            onChangeText={setCalories}
                            keyboardType="number-pad"
                        />
                    </View>
                    <View style={{ flex: 1, minWidth: '45%' }}>
                        <Text style={{
                            fontSize: 14,
                            fontWeight: '600',
                            color: Colors.light.text.secondary,
                            marginBottom: 8
                        }}>
                            Protein (g)
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
                            placeholder="31"
                            value={protein}
                            onChangeText={setProtein}
                            keyboardType="decimal-pad"
                        />
                    </View>
                    <View style={{ flex: 1, minWidth: '45%' }}>
                        <Text style={{
                            fontSize: 14,
                            fontWeight: '600',
                            color: Colors.light.text.secondary,
                            marginBottom: 8
                        }}>
                            Carbs (g)
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
                            placeholder="0"
                            value={carbs}
                            onChangeText={setCarbs}
                            keyboardType="decimal-pad"
                        />
                    </View>
                    <View style={{ flex: 1, minWidth: '45%' }}>
                        <Text style={{
                            fontSize: 14,
                            fontWeight: '600',
                            color: Colors.light.text.secondary,
                            marginBottom: 8
                        }}>
                            Fat (g)
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
                            placeholder="3.6"
                            value={fat}
                            onChangeText={setFat}
                            keyboardType="decimal-pad"
                        />
                    </View>
                </View>

                {/* Info Card */}
                <View style={{
                    backgroundColor: `${Colors.primary.main}10`,
                    borderRadius: 12,
                    padding: 16,
                    borderLeftWidth: 4,
                    borderLeftColor: Colors.primary.main
                }}>
                    <Text style={{
                        fontSize: 13,
                        color: Colors.light.text.secondary,
                        lineHeight: 18
                    }}>
                        💡 Tip: You can scan barcodes or search our database to auto-fill nutrition information in a future update!
                    </Text>
                </View>
            </ScrollView>

            {/* Bottom Action Bar */}
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
                <TouchableOpacity
                    style={{
                        flex: 1,
                        backgroundColor: Colors.light.surface,
                        paddingVertical: 14,
                        borderRadius: 12,
                        alignItems: 'center',
                        borderWidth: 1,
                        borderColor: Colors.light.border
                    }}
                    onPress={() => router.back()}
                >
                    <Text style={{
                        fontSize: 16,
                        fontWeight: '600',
                        color: Colors.light.text.secondary
                    }}>
                        Cancel
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{
                        flex: 2,
                        backgroundColor: Colors.primary.main,
                        paddingVertical: 14,
                        borderRadius: 12,
                        alignItems: 'center',
                        opacity: loading ? 0.7 : 1
                    }}
                    onPress={handleSave}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={{
                            fontSize: 16,
                            fontWeight: '600',
                            color: 'white'
                        }}>
                            Add to Inventory
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}
