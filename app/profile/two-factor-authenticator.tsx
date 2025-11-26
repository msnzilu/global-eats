import { Colors } from '@/utils/constants';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TwoFactorAuthenticator() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [isEnabled, setIsEnabled] = useState(false);

    const handleToggle = (value: boolean) => {
        setIsEnabled(value);
        Alert.alert(
            value ? 'Authenticator 2FA Enabled' : 'Authenticator 2FA Disabled',
            value
                ? 'Authenticator app two-factor authentication has been enabled.'
                : 'Authenticator app two-factor authentication has been disabled.'
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: Colors.light.background }}>
            {/* Header */}
            <View
                style={{
                    backgroundColor: Colors.primary.main,
                    paddingTop: insets.top + 16,
                    paddingBottom: 20,
                    paddingHorizontal: 24,
                    flexDirection: 'row',
                    alignItems: 'center',
                }}
            >
                <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>
                    Authenticator App Two-Factor Authentication
                </Text>
            </View>

            <View style={{ padding: 24 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 12 }}>
                    Enable Authenticator App
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 14, color: Colors.light.text.secondary }}>
                        Use Google Authenticator or similar app for codes.
                    </Text>
                    <Switch
                        value={isEnabled}
                        onValueChange={handleToggle}
                        trackColor={{ false: '#D1D5DB', true: Colors.primary.main }}
                    />
                </View>
            </View>
        </View>
    );
}
