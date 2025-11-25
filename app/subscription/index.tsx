import { SUBSCRIPTION_PLANS, YEARLY_SUBSCRIPTION_PLANS } from '@/constants/subscriptions';
import { Colors, Typography } from '@/utils/constants';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SubscriptionScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

    const plans = billingPeriod === 'monthly' ? SUBSCRIPTION_PLANS : YEARLY_SUBSCRIPTION_PLANS;

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
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
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
                        Choose Your Plan
                    </Text>
                </View>

                {/* Billing Period Toggle */}
                <View
                    style={{
                        flexDirection: 'row',
                        backgroundColor: Colors.light.surface,
                        borderRadius: 12,
                        padding: 4,
                    }}
                >
                    <TouchableOpacity
                        onPress={() => setBillingPeriod('monthly')}
                        style={{
                            flex: 1,
                            paddingVertical: 10,
                            borderRadius: 8,
                            backgroundColor: billingPeriod === 'monthly' ? 'white' : 'transparent',
                            alignItems: 'center',
                        }}
                    >
                        <Text
                            style={{
                                fontSize: Typography.fontSize.base,
                                fontWeight: Typography.fontWeight.semibold,
                                color:
                                    billingPeriod === 'monthly'
                                        ? Colors.primary.main
                                        : Colors.light.text.secondary,
                            }}
                        >
                            Monthly
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setBillingPeriod('yearly')}
                        style={{
                            flex: 1,
                            paddingVertical: 10,
                            borderRadius: 8,
                            backgroundColor: billingPeriod === 'yearly' ? 'white' : 'transparent',
                            alignItems: 'center',
                        }}
                    >
                        <Text
                            style={{
                                fontSize: Typography.fontSize.base,
                                fontWeight: Typography.fontWeight.semibold,
                                color:
                                    billingPeriod === 'yearly' ? Colors.primary.main : Colors.light.text.secondary,
                            }}
                        >
                            Yearly
                        </Text>
                        {billingPeriod === 'yearly' && (
                            <Text
                                style={{
                                    fontSize: Typography.fontSize.xs,
                                    color: Colors.success,
                                    fontWeight: Typography.fontWeight.medium,
                                }}
                            >
                                Save 17%
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>

            {/* Plans */}
            <ScrollView
                contentContainerStyle={{
                    padding: 24,
                    paddingBottom: insets.bottom + 24,
                }}
            >
                {plans.map((plan) => (
                    <TouchableOpacity
                        key={plan.tier}
                        onPress={() => {
                            if (plan.tier !== 'free') {
                                router.push({
                                    pathname: '/subscription/payment',
                                    params: { tier: plan.tier, period: billingPeriod },
                                });
                            }
                        }}
                        style={{
                            backgroundColor: 'white',
                            borderRadius: 16,
                            padding: 20,
                            marginBottom: 16,
                            borderWidth: 2,
                            borderColor: plan.popular ? Colors.primary.main : Colors.light.border,
                            position: 'relative',
                        }}
                    >
                        {plan.popular && (
                            <View
                                style={{
                                    position: 'absolute',
                                    top: -12,
                                    right: 20,
                                    backgroundColor: Colors.primary.main,
                                    paddingHorizontal: 12,
                                    paddingVertical: 4,
                                    borderRadius: 12,
                                }}
                            >
                                <Text
                                    style={{
                                        color: 'white',
                                        fontSize: Typography.fontSize.xs,
                                        fontWeight: Typography.fontWeight.bold,
                                    }}
                                >
                                    MOST POPULAR
                                </Text>
                            </View>
                        )}

                        <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 }}>
                            <View style={{ flex: 1 }}>
                                <Text
                                    style={{
                                        fontSize: Typography.fontSize.xl,
                                        fontWeight: Typography.fontWeight.bold,
                                        color: Colors.light.text.primary,
                                        marginBottom: 4,
                                    }}
                                >
                                    {plan.name}
                                </Text>
                                <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                                    <Text
                                        style={{
                                            fontSize: Typography.fontSize['3xl'],
                                            fontWeight: Typography.fontWeight.bold,
                                            color: plan.tier === 'free' ? Colors.light.text.secondary : Colors.primary.main,
                                        }}
                                    >
                                        ${plan.price}
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: Typography.fontSize.base,
                                            color: Colors.light.text.secondary,
                                            marginLeft: 4,
                                        }}
                                    >
                                        /{billingPeriod === 'monthly' ? 'mo' : 'yr'}
                                    </Text>
                                </View>
                                {plan.savings && (
                                    <Text
                                        style={{
                                            fontSize: Typography.fontSize.sm,
                                            color: Colors.success,
                                            fontWeight: Typography.fontWeight.semibold,
                                            marginTop: 4,
                                        }}
                                    >
                                        {plan.savings}
                                    </Text>
                                )}
                            </View>
                        </View>

                        {/* Features */}
                        <View style={{ gap: 10 }}>
                            {plan.features.map((feature, index) => (
                                <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Ionicons
                                        name="checkmark-circle"
                                        size={20}
                                        color={plan.tier === 'free' ? Colors.light.text.tertiary : Colors.primary.main}
                                        style={{ marginRight: 8 }}
                                    />
                                    <Text
                                        style={{
                                            fontSize: Typography.fontSize.sm,
                                            color: Colors.light.text.secondary,
                                            flex: 1,
                                        }}
                                    >
                                        {feature}
                                    </Text>
                                </View>
                            ))}
                        </View>

                        {/* CTA Button */}
                        {plan.tier !== 'free' && (
                            <TouchableOpacity
                                onPress={() => {
                                    router.push({
                                        pathname: '/subscription/payment',
                                        params: { tier: plan.tier, period: billingPeriod },
                                    });
                                }}
                                style={{
                                    marginTop: 20,
                                    backgroundColor: plan.popular ? Colors.primary.main : Colors.light.surface,
                                    paddingVertical: 14,
                                    borderRadius: 12,
                                    alignItems: 'center',
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: Typography.fontSize.base,
                                        fontWeight: Typography.fontWeight.semibold,
                                        color: plan.popular ? 'white' : Colors.primary.main,
                                    }}
                                >
                                    Get Started
                                </Text>
                            </TouchableOpacity>
                        )}
                    </TouchableOpacity>
                ))}

                {/* FAQ Section */}
                <View style={{ marginTop: 24 }}>
                    <Text
                        style={{
                            fontSize: Typography.fontSize.lg,
                            fontWeight: Typography.fontWeight.bold,
                            color: Colors.light.text.primary,
                            marginBottom: 16,
                        }}
                    >
                        Frequently Asked Questions
                    </Text>

                    <View style={{ gap: 16 }}>
                        <View>
                            <Text
                                style={{
                                    fontSize: Typography.fontSize.base,
                                    fontWeight: Typography.fontWeight.semibold,
                                    color: Colors.light.text.primary,
                                    marginBottom: 4,
                                }}
                            >
                                Can I cancel anytime?
                            </Text>
                            <Text
                                style={{
                                    fontSize: Typography.fontSize.sm,
                                    color: Colors.light.text.secondary,
                                }}
                            >
                                Yes! You can cancel your subscription at any time. You'll continue to have access
                                until the end of your billing period.
                            </Text>
                        </View>

                        <View>
                            <Text
                                style={{
                                    fontSize: Typography.fontSize.base,
                                    fontWeight: Typography.fontWeight.semibold,
                                    color: Colors.light.text.primary,
                                    marginBottom: 4,
                                }}
                            >
                                What payment methods do you accept?
                            </Text>
                            <Text
                                style={{
                                    fontSize: Typography.fontSize.sm,
                                    color: Colors.light.text.secondary,
                                }}
                            >
                                We accept all major credit cards, PayPal, Apple Pay, and Google Pay.
                            </Text>
                        </View>

                        <View>
                            <Text
                                style={{
                                    fontSize: Typography.fontSize.base,
                                    fontWeight: Typography.fontWeight.semibold,
                                    color: Colors.light.text.primary,
                                    marginBottom: 4,
                                }}
                            >
                                Can I upgrade or downgrade my plan?
                            </Text>
                            <Text
                                style={{
                                    fontSize: Typography.fontSize.sm,
                                    color: Colors.light.text.secondary,
                                }}
                            >
                                Absolutely! You can change your plan at any time from your account settings.
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
