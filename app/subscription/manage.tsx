import { Colors, Typography } from '@/utils/constants';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ManageSubscriptionScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    // Mock current subscription data
    const currentSubscription = {
        tier: 'premium',
        status: 'active',
        nextBillingDate: 'December 25, 2025',
        amount: '$9.99',
        paymentMethod: 'Visa •••• 4242',
    };

    const handleCancelSubscription = () => {
        Alert.alert(
            'Cancel Subscription',
            'Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.',
            [
                { text: 'Keep Subscription', style: 'cancel' },
                {
                    text: 'Cancel',
                    style: 'destructive',
                    onPress: () => {
                        Alert.alert('Subscription Cancelled', 'Your subscription will remain active until December 25, 2025');
                    },
                },
            ]
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: Colors.light.background }}>
            {/* Header */}
            <View
                style={{
                    paddingTop: insets.top + 16,
                    paddingHorizontal: 24,
                    paddingBottom: 16,
                    backgroundColor: 'white',
                    borderBottomWidth: 1,
                    borderBottomColor: Colors.light.border,
                }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            backgroundColor: Colors.light.surface,
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: 12,
                        }}
                    >
                        <Ionicons name="arrow-back" size={24} color={Colors.light.text.primary} />
                    </TouchableOpacity>
                    <Text
                        style={{
                            fontSize: Typography.fontSize['2xl'],
                            fontWeight: Typography.fontWeight.bold,
                            color: Colors.light.text.primary,
                        }}
                    >
                        Manage Subscription
                    </Text>
                </View>
            </View>

            <ScrollView
                contentContainerStyle={{
                    padding: 24,
                    paddingBottom: insets.bottom + 24,
                }}
            >
                {/* Current Plan */}
                <View
                    style={{
                        backgroundColor: 'white',
                        borderRadius: 16,
                        padding: 20,
                        marginBottom: 24,
                    }}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                        <View
                            style={{
                                width: 48,
                                height: 48,
                                borderRadius: 24,
                                backgroundColor: Colors.primary.main + '20',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: 12,
                            }}
                        >
                            <Ionicons name="star" size={24} color={Colors.primary.main} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text
                                style={{
                                    fontSize: Typography.fontSize.lg,
                                    fontWeight: Typography.fontWeight.bold,
                                    color: Colors.light.text.primary,
                                }}
                            >
                                Premium Plan
                            </Text>
                            <View
                                style={{
                                    backgroundColor: Colors.success + '20',
                                    paddingHorizontal: 8,
                                    paddingVertical: 2,
                                    borderRadius: 4,
                                    alignSelf: 'flex-start',
                                    marginTop: 4,
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: Typography.fontSize.xs,
                                        fontWeight: Typography.fontWeight.semibold,
                                        color: Colors.success,
                                    }}
                                >
                                    ACTIVE
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View
                        style={{
                            height: 1,
                            backgroundColor: Colors.light.border,
                            marginVertical: 16,
                        }}
                    />

                    <View style={{ gap: 12 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ fontSize: Typography.fontSize.base, color: Colors.light.text.secondary }}>
                                Next Billing Date
                            </Text>
                            <Text
                                style={{
                                    fontSize: Typography.fontSize.base,
                                    fontWeight: Typography.fontWeight.semibold,
                                    color: Colors.light.text.primary,
                                }}
                            >
                                {currentSubscription.nextBillingDate}
                            </Text>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ fontSize: Typography.fontSize.base, color: Colors.light.text.secondary }}>
                                Amount
                            </Text>
                            <Text
                                style={{
                                    fontSize: Typography.fontSize.base,
                                    fontWeight: Typography.fontWeight.semibold,
                                    color: Colors.light.text.primary,
                                }}
                            >
                                {currentSubscription.amount}
                            </Text>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ fontSize: Typography.fontSize.base, color: Colors.light.text.secondary }}>
                                Payment Method
                            </Text>
                            <Text
                                style={{
                                    fontSize: Typography.fontSize.base,
                                    fontWeight: Typography.fontWeight.semibold,
                                    color: Colors.light.text.primary,
                                }}
                            >
                                {currentSubscription.paymentMethod}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Actions */}
                <View style={{ gap: 12 }}>
                    <TouchableOpacity
                        onPress={() => router.push('/subscription')}
                        style={{
                            backgroundColor: 'white',
                            borderRadius: 12,
                            padding: 16,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                            <Ionicons
                                name="swap-horizontal"
                                size={24}
                                color={Colors.primary.main}
                                style={{ marginRight: 12 }}
                            />
                            <Text
                                style={{
                                    fontSize: Typography.fontSize.base,
                                    fontWeight: Typography.fontWeight.semibold,
                                    color: Colors.light.text.primary,
                                }}
                            >
                                Change Plan
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={Colors.light.text.tertiary} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            backgroundColor: 'white',
                            borderRadius: 12,
                            padding: 16,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                            <Ionicons
                                name="card"
                                size={24}
                                color={Colors.primary.main}
                                style={{ marginRight: 12 }}
                            />
                            <Text
                                style={{
                                    fontSize: Typography.fontSize.base,
                                    fontWeight: Typography.fontWeight.semibold,
                                    color: Colors.light.text.primary,
                                }}
                            >
                                Update Payment Method
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={Colors.light.text.tertiary} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            backgroundColor: 'white',
                            borderRadius: 12,
                            padding: 16,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                            <Ionicons
                                name="receipt"
                                size={24}
                                color={Colors.primary.main}
                                style={{ marginRight: 12 }}
                            />
                            <Text
                                style={{
                                    fontSize: Typography.fontSize.base,
                                    fontWeight: Typography.fontWeight.semibold,
                                    color: Colors.light.text.primary,
                                }}
                            >
                                Billing History
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={Colors.light.text.tertiary} />
                    </TouchableOpacity>
                </View>

                {/* Cancel Subscription */}
                <TouchableOpacity
                    onPress={handleCancelSubscription}
                    style={{
                        marginTop: 32,
                        backgroundColor: Colors.error + '10',
                        borderRadius: 12,
                        padding: 16,
                        alignItems: 'center',
                    }}
                >
                    <Text
                        style={{
                            fontSize: Typography.fontSize.base,
                            fontWeight: Typography.fontWeight.semibold,
                            color: Colors.error,
                        }}
                    >
                        Cancel Subscription
                    </Text>
                </TouchableOpacity>

                {/* Help Text */}
                <Text
                    style={{
                        fontSize: Typography.fontSize.sm,
                        color: Colors.light.text.tertiary,
                        textAlign: 'center',
                        marginTop: 16,
                        lineHeight: 20,
                    }}
                >
                    Need help? Contact our support team at support@globaleats.com
                </Text>
            </ScrollView>
        </View>
    );
}
