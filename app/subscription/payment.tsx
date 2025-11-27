import { MOCK_PAYMENT_METHODS, SUBSCRIPTION_PLANS, YEARLY_SUBSCRIPTION_PLANS } from '@/constants/subscriptions';
import { useAuth } from '@/hooks/useAuth';
import { simulateSuccessfulPayment } from '@/services/firebase/subscriptions';
import { Colors, Typography } from '@/utils/constants';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PaymentScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { user } = useAuth();
    const params = useLocalSearchParams<{ tier: string; period: string }>();
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(MOCK_PAYMENT_METHODS[0].id);
    const [isProcessing, setIsProcessing] = useState(false);

    const billingPeriod = (params.period || 'monthly') as 'monthly' | 'yearly';
    const plans = billingPeriod === 'monthly' ? SUBSCRIPTION_PLANS : YEARLY_SUBSCRIPTION_PLANS;
    const selectedPlan = plans.find((p) => p.tier === params.tier);

    if (!selectedPlan || !user) {
        return null;
    }

    const handlePayment = async () => {
        setIsProcessing(true);

        try {
            // Simulate payment processing
            // In production, this would integrate with Stripe
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Update user subscription
            await simulateSuccessfulPayment(user.uid, 'premium', billingPeriod);
            
            setIsProcessing(false);
            router.replace('/subscription/success');
        } catch (error: any) {
            setIsProcessing(false);
            Alert.alert('Payment Failed', error.message || 'An error occurred during payment processing');
        }
    };

    const getPaymentMethodIcon = (type: string) => {
        switch (type) {
            case 'card':
                return 'card-outline';
            case 'paypal':
                return 'logo-paypal';
            case 'apple_pay':
                return 'logo-apple';
            case 'google_pay':
                return 'logo-google';
            default:
                return 'card-outline';
        }
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
                        Payment
                    </Text>
                </View>
            </View>

            <ScrollView
                contentContainerStyle={{
                    padding: 24,
                    paddingBottom: insets.bottom + 100,
                }}
            >
                {/* Order Summary */}
                <View
                    style={{
                        backgroundColor: 'white',
                        borderRadius: 16,
                        padding: 20,
                        marginBottom: 24,
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
                        Order Summary
                    </Text>

                    <View style={{ gap: 12 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ fontSize: Typography.fontSize.base, color: Colors.light.text.secondary }}>
                                {selectedPlan.name} Plan
                            </Text>
                            <Text
                                style={{
                                    fontSize: Typography.fontSize.base,
                                    fontWeight: Typography.fontWeight.semibold,
                                    color: Colors.light.text.primary,
                                }}
                            >
                                ${selectedPlan.price}
                            </Text>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ fontSize: Typography.fontSize.base, color: Colors.light.text.secondary }}>
                                Billing Period
                            </Text>
                            <Text
                                style={{
                                    fontSize: Typography.fontSize.base,
                                    fontWeight: Typography.fontWeight.semibold,
                                    color: Colors.light.text.primary,
                                }}
                            >
                                {billingPeriod === 'monthly' ? 'Monthly' : 'Yearly'}
                            </Text>
                        </View>

                        <View
                            style={{
                                height: 1,
                                backgroundColor: Colors.light.border,
                                marginVertical: 8,
                            }}
                        />

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text
                                style={{
                                    fontSize: Typography.fontSize.lg,
                                    fontWeight: Typography.fontWeight.bold,
                                    color: Colors.light.text.primary,
                                }}
                            >
                                Total
                            </Text>
                            <Text
                                style={{
                                    fontSize: Typography.fontSize.lg,
                                    fontWeight: Typography.fontWeight.bold,
                                    color: Colors.primary.main,
                                }}
                            >
                                ${selectedPlan.price}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Payment Methods */}
                <View>
                    <Text
                        style={{
                            fontSize: Typography.fontSize.lg,
                            fontWeight: Typography.fontWeight.bold,
                            color: Colors.light.text.primary,
                            marginBottom: 16,
                        }}
                    >
                        Payment Method
                    </Text>

                    <View style={{ gap: 12 }}>
                        {MOCK_PAYMENT_METHODS.map((method) => (
                            <TouchableOpacity
                                key={method.id}
                                onPress={() => setSelectedPaymentMethod(method.id)}
                                style={{
                                    backgroundColor: 'white',
                                    borderRadius: 12,
                                    padding: 16,
                                    borderWidth: 2,
                                    borderColor:
                                        selectedPaymentMethod === method.id ? Colors.primary.main : Colors.light.border,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                            >
                                <View
                                    style={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 24,
                                        backgroundColor: Colors.light.surface,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginRight: 12,
                                    }}
                                >
                                    <Ionicons
                                        name={getPaymentMethodIcon(method.type) as any}
                                        size={24}
                                        color={Colors.primary.main}
                                    />
                                </View>

                                <View style={{ flex: 1 }}>
                                    {method.type === 'card' && (
                                        <>
                                            <Text
                                                style={{
                                                    fontSize: Typography.fontSize.base,
                                                    fontWeight: Typography.fontWeight.semibold,
                                                    color: Colors.light.text.primary,
                                                }}
                                            >
                                                {method.brand} •••• {method.last4}
                                            </Text>
                                            <Text
                                                style={{
                                                    fontSize: Typography.fontSize.sm,
                                                    color: Colors.light.text.secondary,
                                                }}
                                            >
                                                Expires {method.expiryMonth}/{method.expiryYear}
                                            </Text>
                                        </>
                                    )}
                                    {method.type === 'paypal' && (
                                        <>
                                            <Text
                                                style={{
                                                    fontSize: Typography.fontSize.base,
                                                    fontWeight: Typography.fontWeight.semibold,
                                                    color: Colors.light.text.primary,
                                                }}
                                            >
                                                PayPal
                                            </Text>
                                            <Text
                                                style={{
                                                    fontSize: Typography.fontSize.sm,
                                                    color: Colors.light.text.secondary,
                                                }}
                                            >
                                                {method.email}
                                            </Text>
                                        </>
                                    )}
                                </View>

                                {selectedPaymentMethod === method.id && (
                                    <Ionicons name="checkmark-circle" size={24} color={Colors.primary.main} />
                                )}
                            </TouchableOpacity>
                        ))}

                        {/* Add Payment Method */}
                        <TouchableOpacity
                            style={{
                                backgroundColor: 'white',
                                borderRadius: 12,
                                padding: 16,
                                borderWidth: 2,
                                borderColor: Colors.light.border,
                                borderStyle: 'dashed',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Ionicons
                                name="add-circle-outline"
                                size={24}
                                color={Colors.primary.main}
                                style={{ marginRight: 8 }}
                            />
                            <Text
                                style={{
                                    fontSize: Typography.fontSize.base,
                                    fontWeight: Typography.fontWeight.semibold,
                                    color: Colors.primary.main,
                                }}
                            >
                                Add Payment Method
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Security Notice */}
                <View
                    style={{
                        marginTop: 24,
                        backgroundColor: Colors.accent.blue + '15',
                        borderRadius: 12,
                        padding: 16,
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                    }}
                >
                    <Ionicons
                        name="shield-checkmark"
                        size={24}
                        color={Colors.accent.blue}
                        style={{ marginRight: 12 }}
                    />
                    <View style={{ flex: 1 }}>
                        <Text
                            style={{
                                fontSize: Typography.fontSize.sm,
                                color: Colors.light.text.secondary,
                                lineHeight: 20,
                            }}
                        >
                            Your payment information is encrypted and secure. We never store your full card details.
                        </Text>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom CTA */}
            <View
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: 'white',
                    padding: 24,
                    paddingBottom: 24 + insets.bottom,
                    borderTopWidth: 1,
                    borderTopColor: Colors.light.border,
                }}
            >
                <TouchableOpacity
                    onPress={handlePayment}
                    disabled={isProcessing}
                    style={{
                        backgroundColor: isProcessing ? Colors.light.border : Colors.primary.main,
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
                        {isProcessing ? 'Processing...' : `Pay $${selectedPlan.price}`}
                    </Text>
                </TouchableOpacity>

                <Text
                    style={{
                        fontSize: Typography.fontSize.xs,
                        color: Colors.light.text.tertiary,
                        textAlign: 'center',
                        marginTop: 12,
                    }}
                >
                    By confirming, you agree to our Terms of Service and Privacy Policy
                </Text>
            </View>
        </View>
    );
}
