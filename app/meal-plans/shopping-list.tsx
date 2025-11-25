import { useShoppingList } from '@/hooks/useShoppingList';
import { auth } from '@/services/firebase/config';
import { Colors } from '@/utils/constants';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ActivityIndicator, Alert, ScrollView, Share, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ShoppingList() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const {
        shoppingList,
        loading,
        error,
        toggleItem,
        addCheckedToInventory,
        clearCheckedItems
    } = useShoppingList();

    const currentUser = auth.currentUser;

    const handleToggleItem = async (itemId: string) => {
        try {
            await toggleItem(itemId);
        } catch (err: any) {
            Alert.alert('Error', err.message || 'Failed to update item');
        }
    };

    const handleAddToInventory = async () => {
        try {
            await addCheckedToInventory();
            Alert.alert('Success', 'Items added to inventory successfully');
        } catch (err: any) {
            Alert.alert('Error', err.message || 'Failed to add items to inventory');
        }
    };

    const handleClearChecked = async () => {
        Alert.alert(
            'Clear Checked Items',
            'Are you sure you want to remove all checked items from the list?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await clearCheckedItems();
                        } catch (err: any) {
                            Alert.alert('Error', err.message || 'Failed to clear items');
                        }
                    }
                }
            ]
        );
    };

    const handleGeneratePlan = () => {
        router.push('/meal-plans/generate-plan');
    };

    const handleShare = async () => {
        if (!shoppingList || items.length === 0) {
            Alert.alert('Empty List', 'There are no items to share');
            return;
        }

        try {
            // Group items by category for better formatting
            const groupedText = categories.map(category => {
                const categoryItems = groupedItems[category]
                    .map(item => `  ${item.isChecked ? '✓' : '○'} ${item.name} - ${item.quantity} ${item.unit}`)
                    .join('\n');
                return `${category.toUpperCase()}\n${categoryItems}`;
            }).join('\n\n');

            const message = `🛒 Shopping List\n\n${groupedText}\n\n📊 Total: ${items.length} items (${checkedCount} checked)`;

            await Share.share({
                message,
                title: 'Shopping List'
            });
        } catch (err: any) {
            console.error('Error sharing:', err);
            Alert.alert('Error', 'Failed to share shopping list');
        }
    };

    const items = shoppingList?.items || [];
    const groupedItems = items.reduce((acc, item) => {
        if (!acc[item.category]) {
            acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
    }, {} as Record<string, typeof items>);

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
            {loading ? (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 60 }}>
                    <ActivityIndicator size="large" color={Colors.primary.main} />
                    <Text style={{ marginTop: 16, fontSize: 16, color: Colors.light.text.secondary }}>
                        Loading shopping list...
                    </Text>
                </View>
            ) : (
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
                                        onPress={() => handleToggleItem(item.id)}
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

                    {items.length === 0 && !loading && (
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
                                paddingHorizontal: 40,
                                marginBottom: 24
                            }}>
                                {shoppingList ? 'Your shopping list is empty' : 'Create a shopping list to get started'}
                            </Text>
                            {!shoppingList && (
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: Colors.primary.main,
                                        paddingHorizontal: 24,
                                        paddingVertical: 12,
                                        borderRadius: 12
                                    }}
                                    onPress={handleGeneratePlan}
                                >
                                    <Text style={{
                                        color: 'white',
                                        fontSize: 16,
                                        fontWeight: '600'
                                    }}>
                                        Generate Meal Plan
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
                </ScrollView>
            )}

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
                        onPress={handleAddToInventory}
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
                        onPress={handleClearChecked}
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
            {items.length > 0 && (
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
                    onPress={handleShare}
                    activeOpacity={0.8}
                >
                    <Ionicons name="share-outline" size={24} color="white" />
                </TouchableOpacity>
            )}
        </View>
    );
}
