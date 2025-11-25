import { useRecipes } from '@/hooks/useRecipes';
import { Recipe } from '@/types';
import { Colors } from '@/utils/constants';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Modal,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface RecipeSelectorProps {
    visible: boolean;
    onClose: () => void;
    onSelect: (recipe: Recipe) => void;
}

export default function RecipeSelector({ visible, onClose, onSelect }: RecipeSelectorProps) {
    const insets = useSafeAreaInsets();
    const { myRecipes, loading } = useRecipes(); // correct property
    const [searchQuery, setSearchQuery] = useState('');

    const filteredRecipes = myRecipes.filter((recipe) =>
        recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <View style={{ flex: 1, backgroundColor: Colors.light.background }}>
                {/* Header */}
                <View
                    style={{
                        paddingTop: 20,
                        paddingHorizontal: 20,
                        paddingBottom: 16,
                        borderBottomWidth: 1,
                        borderBottomColor: Colors.light.border,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: Colors.light.text.primary }}>
                        Select Recipe
                    </Text>
                    <TouchableOpacity onPress={onClose}>
                        <Ionicons name="close" size={24} color={Colors.light.text.primary} />
                    </TouchableOpacity>
                </View>

                {/* Search */}
                <View style={{ padding: 16 }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: Colors.light.surface,
                            borderRadius: 12,
                            paddingHorizontal: 12,
                            paddingVertical: 10,
                            borderWidth: 1,
                            borderColor: Colors.light.border,
                        }}
                    >
                        <Ionicons name="search" size={20} color={Colors.light.text.tertiary} style={{ marginRight: 8 }} />
                        <TextInput
                            style={{ flex: 1, fontSize: 16, color: Colors.light.text.primary }}
                            placeholder="Search recipes..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholderTextColor={Colors.light.text.tertiary}
                        />
                    </View>
                </View>

                {/* List */}
                {loading ? (
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <ActivityIndicator size="large" color={Colors.primary.main} />
                    </View>
                ) : (
                    <FlatList
                        data={filteredRecipes}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={{ padding: 16 }}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    padding: 12,
                                    backgroundColor: 'white',
                                    borderRadius: 12,
                                    marginBottom: 12,
                                    borderWidth: 1,
                                    borderColor: Colors.light.border,
                                }}
                                onPress={() => {
                                    onSelect(item);
                                    onClose();
                                }}
                            >
                                <View
                                    style={{
                                        width: 50,
                                        height: 50,
                                        borderRadius: 8,
                                        backgroundColor: Colors.light.surface,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginRight: 12,
                                    }}
                                >
                                    <Ionicons name="restaurant" size={24} color={Colors.light.text.tertiary} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 16, fontWeight: '600', color: Colors.light.text.primary }}>
                                        {item.name}
                                    </Text>
                                    <Text style={{ fontSize: 14, color: Colors.light.text.secondary }}>
                                        {item.nutrition.calories} cal • {item.nutrition.protein}g protein
                                    </Text>
                                </View>
                                <Ionicons name="add-circle-outline" size={24} color={Colors.primary.main} />
                            </TouchableOpacity>
                        )}
                        ListEmptyComponent={
                            <View style={{ alignItems: 'center', paddingTop: 40 }}>
                                <Text style={{ color: Colors.light.text.secondary }}>No recipes found</Text>
                            </View>
                        }
                    />
                )}
            </View>
        </Modal>
    );
}
