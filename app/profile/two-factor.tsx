import { Colors } from '@/utils/constants';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TwoFactorAuth() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [isEnabled, setIsEnabled] = useState(false);

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
                    Two-Factor Authentication
                </Text>
            </View>

            <ScrollView
                contentContainerStyle={{
                    padding: 24,
                    paddingBottom: insets.bottom + 24
                }}
            >
                {/* Status Card */}
                <View style={{
                    backgroundColor: 'white',
                    borderRadius: 12,
                    padding: 20,
                    marginBottom: 24
                }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 8 }}>
                                2FA Status
                            </Text>
                            <Text style={{ fontSize: 14, color: Colors.light.text.secondary }}>
                                {isEnabled ? 'Two-factor authentication is enabled' : 'Two-factor authentication is disabled'}
                            </Text>
                        </View>
                        <Switch
                            value={isEnabled}
                            onValueChange={setIsEnabled}
                            trackColor={{ false: '#D1D5DB', true: Colors.primary.main }}
                        />
                    </View>
                </View>

                {/* Info Section */}
                <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    marginBottom: 12
                }}>
                    What is 2FA?
                </Text>
                <Text style={{
                    fontSize: 14,
                    color: Colors.light.text.secondary,
                    lineHeight: 20,
                    marginBottom: 24
                }}>
                    Two-factor authentication adds an extra layer of security to your account. When enabled, you'll need to enter a verification code from your phone in addition to your password when signing in.
                </Text>

                {/* Methods */}
                <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    marginBottom: 12
                }}>
                    Authentication Methods
                </Text>

                <TouchableOpacity
                    style={{
                        backgroundColor: 'white',
                        borderRadius: 12,
                        padding: 16,
                        marginBottom: 12,
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}
                    disabled={!isEnabled}
                >
                    <View style={{
                        width: 48,
                        height: 48,
                        borderRadius: 24,
                        backgroundColor: `${Colors.primary.main}15`,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 16
                    }}>
                        <Ionicons name="phone-portrait" size={24} color={Colors.primary.main} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={{
                            fontSize: 16,
                            fontWeight: '600',
                            color: isEnabled ? Colors.light.text.primary : Colors.light.text.tertiary,
                            marginBottom: 4
                        }}>
                            SMS Authentication
                        </Text>
                        <Text style={{
                            fontSize: 13,
                            color: Colors.light.text.secondary
                        }}>
                            Receive codes via text message
                        </Text>
                    </View>
                    <Ionicons
                        name="chevron-forward"
                        size={20}
                        color={isEnabled ? Colors.light.text.tertiary : Colors.light.border}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    style={{
                        backgroundColor: 'white',
                        borderRadius: 12,
                        padding: 16,
                        marginBottom: 12,
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}
                    disabled={!isEnabled}
                >
                    <View style={{
                        width: 48,
                        height: 48,
                        borderRadius: 24,
                        backgroundColor: `${Colors.secondary.main}15`,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 16
                    }}>
                        <Ionicons name="apps" size={24} color={Colors.secondary.main} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={{
                            fontSize: 16,
                            fontWeight: '600',
                            color: isEnabled ? Colors.light.text.primary : Colors.light.text.tertiary,
                            marginBottom: 4
                        }}>
                            Authenticator App
                        </Text>
                        <Text style={{
                            fontSize: 13,
                            color: Colors.light.text.secondary
                        }}>
                            Use Google Authenticator or similar
                        </Text>
                    </View>
                    <Ionicons
                        name="chevron-forward"
                        size={20}
                        color={isEnabled ? Colors.light.text.tertiary : Colors.light.border}
                    />
                </TouchableOpacity>

                {/* Warning */}
                {isEnabled && (
                    <View style={{
                        backgroundColor: '#FEF3C7',
                        borderRadius: 12,
                        padding: 16,
                        marginTop: 12,
                        borderLeftWidth: 4,
                        borderLeftColor: '#F59E0B'
                    }}>
                        <Text style={{
                            fontSize: 13,
                            color: '#92400E',
                            lineHeight: 18
                        }}>
                            ⚠️ Make sure to set up at least one authentication method before logging out. Otherwise, you may lose access to your account.
                        </Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}
