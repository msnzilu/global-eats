import { Colors } from '@/utils/constants';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Privacy() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const privacyOptions = [
        {
            icon: 'lock-closed',
            title: 'Change Password',
            description: 'Update your account password',
            action: () => router.push('/profile/change-password')
        },
        {
            icon: 'shield-checkmark',
            title: 'Two-Factor Authentication',
            description: 'Add an extra layer of security',
            action: () => router.push('/profile/two-factor')
        },
        {
            icon: 'eye-off',
            title: 'Data Privacy',
            description: 'Manage your data and privacy settings',
            action: () => router.push('/profile/data-privacy')
        },
        {
            icon: 'download',
            title: 'Download My Data',
            description: 'Get a copy of your data',
            action: () => router.push('/profile/download-data')
        },
        {
            icon: 'trash',
            title: 'Delete Account',
            description: 'Permanently delete your account',
            action: () => router.push('/profile/delete-account'),
            danger: true
        }
    ];

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
                    Privacy & Security
                </Text>
            </View>

            <ScrollView
                contentContainerStyle={{
                    padding: 24,
                    paddingBottom: insets.bottom + 24
                }}
            >
                {privacyOptions.map((option, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={option.action}
                        style={{
                            backgroundColor: 'white',
                            borderRadius: 12,
                            padding: 16,
                            marginBottom: 12,
                            flexDirection: 'row',
                            alignItems: 'center',
                            borderWidth: option.danger ? 1 : 0,
                            borderColor: option.danger ? '#FEE2E2' : 'transparent'
                        }}
                    >
                        <View style={{
                            width: 48,
                            height: 48,
                            borderRadius: 24,
                            backgroundColor: option.danger ? '#FEE2E2' : `${Colors.primary.main}15`,
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: 16
                        }}>
                            <Ionicons
                                name={option.icon as any}
                                size={24}
                                color={option.danger ? '#EF4444' : Colors.primary.main}
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{
                                fontSize: 16,
                                fontWeight: '600',
                                color: option.danger ? '#EF4444' : Colors.light.text.primary,
                                marginBottom: 4
                            }}>
                                {option.title}
                            </Text>
                            <Text style={{
                                fontSize: 13,
                                color: Colors.light.text.secondary
                            }}>
                                {option.description}
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={Colors.light.text.tertiary} />
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}
