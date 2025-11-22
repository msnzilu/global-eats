import { Colors } from '@/utils/constants';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function DeleteAccount() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [confirmText, setConfirmText] = useState('');
    const [reason, setReason] = useState('');

    const canDelete = confirmText.toLowerCase() === 'delete my account';

    return (
        <View style={{ flex: 1, backgroundColor: Colors.light.background }}>
            {/* Header */}
            <View style={{
                backgroundColor: '#EF4444',
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
                    Delete Account
                </Text>
            </View>

            <ScrollView
                contentContainerStyle={{
                    padding: 24,
                    paddingBottom: insets.bottom + 100
                }}
            >
                {/* Warning */}
                <View style={{
                    backgroundColor: '#FEE2E2',
                    borderRadius: 12,
                    padding: 20,
                    marginBottom: 24,
                    borderLeftWidth: 4,
                    borderLeftColor: '#EF4444'
                }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                        <Ionicons name="warning" size={24} color="#EF4444" />
                        <Text style={{
                            fontSize: 18,
                            fontWeight: '700',
                            color: '#991B1B',
                            marginLeft: 12
                        }}>
                            Warning: This is Permanent
                        </Text>
                    </View>
                    <Text style={{
                        fontSize: 14,
                        color: '#991B1B',
                        lineHeight: 20
                    }}>
                        Deleting your account will permanently remove all your data, including recipes, meal plans, and preferences. This action cannot be undone.
                    </Text>
                </View>

                {/* What will be deleted */}
                <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    marginBottom: 12
                }}>
                    What Will Be Deleted
                </Text>

                {[
                    'All your custom recipes',
                    'Meal planning history',
                    'Saved preferences and settings',
                    'Inventory data',
                    'Account information'
                ].map((item, index) => (
                    <View
                        key={index}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: 'white',
                            borderRadius: 8,
                            padding: 12,
                            marginBottom: 8
                        }}
                    >
                        <Ionicons name="close-circle" size={20} color="#EF4444" />
                        <Text style={{
                            fontSize: 14,
                            color: Colors.light.text.primary,
                            marginLeft: 12
                        }}>
                            {item}
                        </Text>
                    </View>
                ))}

                {/* Reason */}
                <View style={{ marginTop: 24, marginBottom: 20 }}>
                    <Text style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: Colors.light.text.secondary,
                        marginBottom: 8
                    }}>
                        Why are you leaving? (Optional)
                    </Text>
                    <TextInput
                        style={{
                            backgroundColor: 'white',
                            borderRadius: 12,
                            padding: 16,
                            fontSize: 16,
                            borderWidth: 1,
                            borderColor: Colors.light.border,
                            minHeight: 100,
                            textAlignVertical: 'top'
                        }}
                        placeholder="Help us improve by sharing your feedback..."
                        value={reason}
                        onChangeText={setReason}
                        multiline
                        numberOfLines={4}
                    />
                </View>

                {/* Confirmation */}
                <View style={{ marginBottom: 20 }}>
                    <Text style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: Colors.light.text.secondary,
                        marginBottom: 8
                    }}>
                        Type "DELETE MY ACCOUNT" to confirm
                    </Text>
                    <TextInput
                        style={{
                            backgroundColor: 'white',
                            borderRadius: 12,
                            padding: 16,
                            fontSize: 16,
                            borderWidth: 2,
                            borderColor: confirmText ? (canDelete ? '#10B981' : '#EF4444') : Colors.light.border
                        }}
                        placeholder="DELETE MY ACCOUNT"
                        value={confirmText}
                        onChangeText={setConfirmText}
                        autoCapitalize="characters"
                    />
                </View>

                {/* Alternative */}
                <View style={{
                    backgroundColor: `${Colors.primary.main}10`,
                    borderRadius: 12,
                    padding: 16,
                    borderLeftWidth: 4,
                    borderLeftColor: Colors.primary.main
                }}>
                    <Text style={{
                        fontSize: 14,
                        fontWeight: '600',
                        marginBottom: 8
                    }}>
                        Not Sure About Deleting?
                    </Text>
                    <Text style={{
                        fontSize: 13,
                        color: Colors.light.text.secondary,
                        lineHeight: 18,
                        marginBottom: 12
                    }}>
                        You can temporarily deactivate your account instead. This will hide your profile and data without permanently deleting it.
                    </Text>
                    <TouchableOpacity
                        style={{
                            backgroundColor: Colors.primary.main,
                            padding: 12,
                            borderRadius: 8,
                            alignItems: 'center'
                        }}
                    >
                        <Text style={{ color: 'white', fontSize: 14, fontWeight: '600' }}>
                            Deactivate Instead
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Delete Button */}
            <View style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: 'white',
                padding: 24,
                paddingBottom: 24 + insets.bottom,
                borderTopWidth: 1,
                borderTopColor: Colors.light.border
            }}>
                <TouchableOpacity
                    style={{
                        backgroundColor: canDelete ? '#EF4444' : '#D1D5DB',
                        padding: 16,
                        borderRadius: 12,
                        alignItems: 'center'
                    }}
                    disabled={!canDelete}
                    onPress={() => {/* TODO: Delete account */ }}
                >
                    <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                        Permanently Delete Account
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
