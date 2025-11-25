import { Colors, Typography } from '@/utils/constants';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SubscriptionSuccessScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: Colors.light.background,
                paddingTop: insets.top,
                paddingBottom: insets.bottom,
            }}
        >
            <View
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 24,
                }}
            >
                {/* Success Icon */}
                <Animated.View
                    entering={ZoomIn.duration(600).delay(200)}
                    style={{
                        width: 120,
                        height: 120,
                        borderRadius: 60,
                        backgroundColor: Colors.primary.main + '20',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 32,
                    }}
                >
                    <View
                        style={{
                            width: 80,
                            height: 80,
                            borderRadius: 40,
                            backgroundColor: Colors.primary.main,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Ionicons name="checkmark" size={48} color="white" />
                    </View>
                </Animated.View>

                {/* Success Message */}
                <Animated.View entering={FadeInDown.duration(600).delay(400)} style={{ alignItems: 'center' }}>
                    <Text
                        style={{
                            fontSize: Typography.fontSize['3xl'],
                            fontWeight: Typography.fontWeight.bold,
                            color: Colors.light.text.primary,
                            marginBottom: 12,
                            textAlign: 'center',
                        }}
                    >
                        Welcome to Premium! 🎉
                    </Text>

                    <Text
                        style={{
                            fontSize: Typography.fontSize.base,
                            color: Colors.light.text.secondary,
                            textAlign: 'center',
                            lineHeight: 24,
                            marginBottom: 32,
                        }}
                    >
                        Your subscription has been activated successfully. You now have access to all premium features!
                    </Text>
                </Animated.View>

                {/* Features Unlocked */}
                <Animated.View
                    entering={FadeInDown.duration(600).delay(600)}
                    style={{
                        backgroundColor: 'white',
                        borderRadius: 16,
                        padding: 20,
                        width: '100%',
                        marginBottom: 32,
                    }}
                >
                    <Text
                        style={{
                            fontSize: Typography.fontSize.lg,
                            fontWeight: Typography.fontWeight.bold,
                            color: Colors.light.text.primary,
                            marginBottom: 16,
                        }}
                    >
                        What's Unlocked
                    </Text>

                    <View style={{ gap: 12 }}>
                        {[
                            { icon: '📅', text: 'Unlimited meal plans' },
                            { icon: '🍳', text: 'Full recipe library access' },
                            { icon: '📊', text: 'Advanced nutrition tracking' },
                            { icon: '✏️', text: 'Custom recipe creation' },
                            { icon: '🛒', text: 'Smart shopping lists' },
                        ].map((feature, index) => (
                            <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ fontSize: 24, marginRight: 12 }}>{feature.icon}</Text>
                                <Text
                                    style={{
                                        fontSize: Typography.fontSize.base,
                                        color: Colors.light.text.secondary,
                                        flex: 1,
                                    }}
                                >
                                    {feature.text}
                                </Text>
                                <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
                            </View>
                        ))}
                    </View>
                </Animated.View>

                {/* CTA Buttons */}
                <Animated.View entering={FadeIn.duration(600).delay(800)} style={{ width: '100%', gap: 12 }}>
                    <TouchableOpacity
                        onPress={() => router.replace('/(tabs)/planner')}
                        style={{
                            backgroundColor: Colors.primary.main,
                            paddingVertical: 16,
                            borderRadius: 12,
                            alignItems: 'center',
                        }}
                    >
                        <Text
                            style={{
                                fontSize: Typography.fontSize.base,
                                fontWeight: Typography.fontWeight.bold,
                                color: 'white',
                            }}
                        >
                            Start Planning Meals
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => router.replace('/(tabs)/recipes')}
                        style={{
                            backgroundColor: Colors.light.surface,
                            paddingVertical: 16,
                            borderRadius: 12,
                            alignItems: 'center',
                            borderWidth: 1,
                            borderColor: Colors.light.border,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: Typography.fontSize.base,
                                fontWeight: Typography.fontWeight.semibold,
                                color: Colors.primary.main,
                            }}
                        >
                            Explore Recipes
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </View>
    );
}
