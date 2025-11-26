import { useUserProfile } from '@/hooks/useUserProfile';
import { Colors } from '@/utils/constants';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


export default function CreateRecipeChoice() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { profile } = useUserProfile();

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
                    <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>
                    Create New Recipe
                </Text>
            </View>

            {/* Content */}
            <View style={{ flex: 1, padding: 24, justifyContent: 'center' }}>
                <Text style={{
                    fontSize: 28,
                    fontWeight: 'bold',
                    color: Colors.light.text.primary,
                    marginBottom: 12,
                    textAlign: 'center'
                }}>
                    How would you like to create your recipe?
                </Text>
                <Text style={{
                    fontSize: 16,
                    color: Colors.light.text.secondary,
                    marginBottom: 48,
                    textAlign: 'center'
                }}>
                    Choose the method that works best for you
                </Text>

                {/* Manual Creation Option */}
                <TouchableOpacity
                    style={{
                        backgroundColor: 'white',
                        borderRadius: 16,
                        padding: 24,
                        marginBottom: 20,
                        borderWidth: 2,
                        borderColor: Colors.primary.main,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 8,
                        elevation: 3
                    }}
                    onPress={() => router.push('/recipes/create-manual')}
                    activeOpacity={0.7}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                        <View style={{
                            width: 56,
                            height: 56,
                            borderRadius: 28,
                            backgroundColor: Colors.primary.main + '20',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: 16
                        }}>
                            <Text style={{ fontSize: 28 }}>📝</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{
                                fontSize: 20,
                                fontWeight: 'bold',
                                color: Colors.light.text.primary,
                                marginBottom: 4
                            }}>
                                Manual Creation
                            </Text>
                            <Text style={{ fontSize: 14, color: Colors.light.text.secondary }}>
                                Full control over every detail
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={24} color={Colors.primary.main} />
                    </View>
                    <Text style={{ fontSize: 14, color: Colors.light.text.secondary, lineHeight: 20 }}>
                        Create your recipe from scratch with complete control over ingredients, instructions, and nutrition information.
                    </Text>
                </TouchableOpacity>

                {/* AI Generation Option */}
                <TouchableOpacity
                    style={{
                        backgroundColor: 'white',
                        borderRadius: 16,
                        padding: 24,
                        borderWidth: 2,
                        borderColor: Colors.secondary.main,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 8,
                        elevation: 3,
                        opacity: profile?.subscriptionTier === 'free' ? 0.8 : 1
                    }}
                    onPress={() => {
                        if (profile?.subscriptionTier === 'free') {
                            Alert.alert(
                                'Premium Feature',
                                'AI Recipe Generation is available for Premium users only.',
                                [
                                    { text: 'Cancel', style: 'cancel' },
                                    { text: 'Upgrade', onPress: () => router.push('/subscription') }
                                ]
                            );
                        } else {
                            router.push('/recipes/create-ai');
                        }
                    }}
                    activeOpacity={0.7}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                        <View style={{
                            width: 56,
                            height: 56,
                            borderRadius: 28,
                            backgroundColor: Colors.secondary.main + '20',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: 16
                        }}>
                            {profile?.subscriptionTier === 'free' ? (
                                <Ionicons name="lock-closed" size={28} color={Colors.secondary.main} />
                            ) : (
                                <Text style={{ fontSize: 28 }}>✨</Text>
                            )}
                        </View>
                        <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                <Text style={{
                                    fontSize: 20,
                                    fontWeight: 'bold',
                                    color: Colors.light.text.primary,
                                    marginBottom: 4
                                }}>
                                    Auto Generate
                                </Text>
                                {profile?.subscriptionTier === 'free' && (
                                    <View style={{
                                        backgroundColor: Colors.secondary.main,
                                        paddingHorizontal: 8,
                                        paddingVertical: 2,
                                        borderRadius: 4
                                    }}>
                                        <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>PREMIUM</Text>
                                    </View>
                                )}
                            </View>
                            <Text style={{ fontSize: 14, color: Colors.light.text.secondary }}>
                                Let us do the work for you
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={24} color={Colors.secondary.main} />
                    </View>
                    <Text style={{ fontSize: 14, color: Colors.light.text.secondary, lineHeight: 20 }}>
                        Describe what you want and we will generate a complete recipe with ingredients and instructions.
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
