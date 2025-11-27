import { useAuth } from '@/hooks/useAuth';
import { cancelSubscription, getSubscriptionStatus, SubscriptionData } from '@/services/firebase/subscriptions';
import { Colors, Typography } from '@/utils/constants';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ManageSubscriptionScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { user, profile } = useAuth();
    const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
    const [loading, setLoading] = useState(true);

    const loadSubscription = async () => {
        if (!user) {
            setLoading(false);
            return;
        }

        try {
            const status = await getSubscriptionStatus(user.uid);
            console.log('DEBUG: Subscription Status:', JSON.stringify(status, null, 2));
            setSubscription(status);
        } catch (error) {
            console.error('Error loading subscription:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSubscription();
    }, [user]);

    const handleCancelSubscription = () => {
        if (!user) return;

        Alert.alert(
            'Cancel Subscription',
            'Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.',
            [
                { text: 'Keep Subscription', style: 'cancel' },
                {
                    text: 'Cancel',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await cancelSubscription(user.uid);
                            Alert.alert(
                                'Subscription Cancelled',
                                `Your subscription will remain active until ${subscription?.currentPeriodEnd?.toLocaleDateString() || 'the end of your billing period'}`
                            );
                            await loadSubscription(); // Refresh data
                        } catch (error: any) {
                            Alert.alert('Error', error.message || 'Failed to cancel subscription');
                        }
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

            {loading ? (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color={Colors.primary.main} />
                    <Text style={{ marginTop: 16, color: Colors.light.text.secondary }}>
                        Loading subscription...
                    </Text>
                </View>
            ) : (
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
                                    backgroundColor: (subscription?.tier === 'premium' ? Colors.primary.main : Colors.light.text.secondary) + '20',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: 12,
                                }}
                            >
                                <Ionicons 
                                    name={subscription?.tier === 'premium' ? "star" : "person"} 
                                    size={24} 
                                    color={subscription?.tier === 'premium' ? Colors.primary.main : Colors.light.text.secondary} 
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text
                                    style={{
                                        fontSize: Typography.fontSize.lg,
                                        fontWeight: Typography.fontWeight.bold,
                                        color: Colors.light.text.primary,
                                    }}
                                >
                                    {subscription?.tier === 'premium' ? 'Premium Plan' : 'Free Plan'}
                                </Text>
                                <View
                                    style={{
                                        backgroundColor: (subscription?.status === 'active' || subscription?.tier === 'free') ? Colors.success + '20' : Colors.error + '20',
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
                                            color: (subscription?.status === 'active' || subscription?.tier === 'free') ? Colors.success : Colors.error,
                                        }}
                                    >
                                        {(subscription?.status || 'active').toUpperCase()}
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
                            {subscription?.tier === 'free' ? (
                                <View>
                                    <Text style={{ fontSize: Typography.fontSize.base, color: Colors.light.text.secondary, marginBottom: 8 }}>
                                        Upgrade to Premium to unlock:
                                    </Text>
                                    <View style={{ gap: 4 }}>
                                        <Text style={{ fontSize: Typography.fontSize.sm, color: Colors.light.text.primary }}>• Unlimited Recipes</Text>
                                        <Text style={{ fontSize: Typography.fontSize.sm, color: Colors.light.text.primary }}>• AI Meal Planning</Text>
                                        <Text style={{ fontSize: Typography.fontSize.sm, color: Colors.light.text.primary }}>• Advanced Analytics</Text>
                                    </View>
                                </View>
                            ) : (
                                <>
                                    {subscription?.currentPeriodEnd && (
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text style={{ fontSize: Typography.fontSize.base, color: Colors.light.text.secondary }}>
                                                {subscription.cancelAtPeriodEnd ? 'Expires On' : 'Next Billing Date'}
                                            </Text>
                                            <Text
                                                style={{
                                                    fontSize: Typography.fontSize.base,
                                                    fontWeight: Typography.fontWeight.semibold,
                                                    color: Colors.light.text.primary,
                                                }}
                                            >
                                                {subscription.currentPeriodEnd.toLocaleDateString()}
                                            </Text>
                                        </View>
                                    )}

                                    {subscription?.stripeCustomerId && (
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text style={{ fontSize: Typography.fontSize.base, color: Colors.light.text.secondary }}>
                                                Customer ID
                                            </Text>
                                            <Text
                                                style={{
                                                    fontSize: Typography.fontSize.base,
                                                    fontWeight: Typography.fontWeight.semibold,
                                                    color: Colors.light.text.primary,
                                                }}
                                            >
                                                {subscription.stripeCustomerId.substring(0, 20)}...
                                            </Text>
                                        </View>
                                    )}
                                </>
                            )}
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
                                Change / Upgrade Plan
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
            )}
        </View>
    );
}
