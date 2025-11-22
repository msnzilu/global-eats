import { Colors } from '@/utils/constants';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ChangePassword() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

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
                    Change Password
                </Text>
            </View>

            <ScrollView
                contentContainerStyle={{
                    padding: 24,
                    paddingBottom: insets.bottom + 100
                }}
            >
                {/* Current Password */}
                <View style={{ marginBottom: 20 }}>
                    <Text style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: Colors.light.text.secondary,
                        marginBottom: 8
                    }}>
                        Current Password
                    </Text>
                    <View style={{ position: 'relative' }}>
                        <TextInput
                            style={{
                                backgroundColor: 'white',
                                borderRadius: 12,
                                padding: 16,
                                paddingRight: 50,
                                fontSize: 16,
                                borderWidth: 1,
                                borderColor: Colors.light.border
                            }}
                            placeholder="Enter current password"
                            value={currentPassword}
                            onChangeText={setCurrentPassword}
                            secureTextEntry={!showCurrent}
                        />
                        <TouchableOpacity
                            onPress={() => setShowCurrent(!showCurrent)}
                            style={{
                                position: 'absolute',
                                right: 16,
                                top: 16
                            }}
                        >
                            <Ionicons
                                name={showCurrent ? "eye-off" : "eye"}
                                size={20}
                                color={Colors.light.text.tertiary}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* New Password */}
                <View style={{ marginBottom: 20 }}>
                    <Text style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: Colors.light.text.secondary,
                        marginBottom: 8
                    }}>
                        New Password
                    </Text>
                    <View style={{ position: 'relative' }}>
                        <TextInput
                            style={{
                                backgroundColor: 'white',
                                borderRadius: 12,
                                padding: 16,
                                paddingRight: 50,
                                fontSize: 16,
                                borderWidth: 1,
                                borderColor: Colors.light.border
                            }}
                            placeholder="Enter new password"
                            value={newPassword}
                            onChangeText={setNewPassword}
                            secureTextEntry={!showNew}
                        />
                        <TouchableOpacity
                            onPress={() => setShowNew(!showNew)}
                            style={{
                                position: 'absolute',
                                right: 16,
                                top: 16
                            }}
                        >
                            <Ionicons
                                name={showNew ? "eye-off" : "eye"}
                                size={20}
                                color={Colors.light.text.tertiary}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Confirm Password */}
                <View style={{ marginBottom: 24 }}>
                    <Text style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: Colors.light.text.secondary,
                        marginBottom: 8
                    }}>
                        Confirm New Password
                    </Text>
                    <View style={{ position: 'relative' }}>
                        <TextInput
                            style={{
                                backgroundColor: 'white',
                                borderRadius: 12,
                                padding: 16,
                                paddingRight: 50,
                                fontSize: 16,
                                borderWidth: 1,
                                borderColor: Colors.light.border
                            }}
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry={!showConfirm}
                        />
                        <TouchableOpacity
                            onPress={() => setShowConfirm(!showConfirm)}
                            style={{
                                position: 'absolute',
                                right: 16,
                                top: 16
                            }}
                        >
                            <Ionicons
                                name={showConfirm ? "eye-off" : "eye"}
                                size={20}
                                color={Colors.light.text.tertiary}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Password Requirements */}
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
                        Password Requirements:
                    </Text>
                    <Text style={{
                        fontSize: 13,
                        color: Colors.light.text.secondary,
                        lineHeight: 20
                    }}>
                        • At least 8 characters long{'\n'}
                        • Contains uppercase and lowercase letters{'\n'}
                        • Contains at least one number{'\n'}
                        • Contains at least one special character
                    </Text>
                </View>
            </ScrollView>

            {/* Save Button */}
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
                        backgroundColor: Colors.primary.main,
                        padding: 16,
                        borderRadius: 12,
                        alignItems: 'center'
                    }}
                    onPress={() => {/* TODO: Change password */ }}
                >
                    <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                        Update Password
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
