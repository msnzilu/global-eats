/**
 * GlobalEats - Subscription Plans & Mock Payment Data
 */

import { SubscriptionPlan } from '@/types';

// ==================== SUBSCRIPTION PLANS ====================

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
    {
        tier: 'free',
        name: 'Free',
        price: 0,
        billingPeriod: 'monthly',
        features: [
            'Basic meal planning',
            'Up to 7-day meal plans',
            'Limited recipe library',
            'Basic inventory tracking',
            'Standard support',
        ],
    },
    {
        tier: 'premium',
        name: 'Premium',
        price: 9.99,
        billingPeriod: 'monthly',
        popular: true,
        features: [
            'Unlimited meal plans',
            'Full recipe library access',
            'Advanced nutrition tracking',
            'Custom recipe creation',
            'Shopping list generation',
            'Priority support',
            'Export meal plans',
        ],
    },
    {
        tier: 'family',
        name: 'Family',
        price: 14.99,
        billingPeriod: 'monthly',
        features: [
            'Everything in Premium',
            'Up to 6 family members',
            'Shared meal plans',
            'Family nutrition dashboard',
            'Multiple dietary preferences',
            'Dedicated support',
        ],
    },
];

export const YEARLY_SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
    {
        tier: 'free',
        name: 'Free',
        price: 0,
        billingPeriod: 'yearly',
        features: SUBSCRIPTION_PLANS[0].features,
    },
    {
        tier: 'premium',
        name: 'Premium',
        price: 99.99,
        billingPeriod: 'yearly',
        popular: true,
        savings: 'Save 17%',
        features: SUBSCRIPTION_PLANS[1].features,
    },
    {
        tier: 'family',
        name: 'Family',
        price: 149.99,
        billingPeriod: 'yearly',
        savings: 'Save 17%',
        features: SUBSCRIPTION_PLANS[2].features,
    },
];

// ==================== MOCK PAYMENT METHODS ====================

export const MOCK_PAYMENT_METHODS = [
    {
        id: 'card_1',
        type: 'card' as const,
        last4: '4242',
        brand: 'Visa',
        expiryMonth: 12,
        expiryYear: 2026,
        isDefault: true,
    },
    {
        id: 'card_2',
        type: 'card' as const,
        last4: '5555',
        brand: 'Mastercard',
        expiryMonth: 8,
        expiryYear: 2025,
        isDefault: false,
    },
    {
        id: 'paypal_1',
        type: 'paypal' as const,
        email: 'user@example.com',
        isDefault: false,
    },
];

// ==================== FEATURE COMPARISON ====================

export const FEATURE_COMPARISON = [
    {
        category: 'Meal Planning',
        features: [
            { name: '7-day meal plans', free: true, premium: true, family: true },
            { name: '30-day meal plans', free: false, premium: true, family: true },
            { name: 'Custom meal plans', free: false, premium: true, family: true },
            { name: 'Shared family plans', free: false, premium: false, family: true },
        ],
    },
    {
        category: 'Recipes',
        features: [
            { name: 'Basic recipes (100+)', free: true, premium: true, family: true },
            { name: 'Full recipe library (1000+)', free: false, premium: true, family: true },
            { name: 'Custom recipe creation', free: false, premium: true, family: true },
            { name: 'Recipe import', free: false, premium: true, family: true },
        ],
    },
    {
        category: 'Tracking',
        features: [
            { name: 'Basic nutrition tracking', free: true, premium: true, family: true },
            { name: 'Advanced analytics', free: false, premium: true, family: true },
            { name: 'Inventory management', free: true, premium: true, family: true },
            { name: 'Family nutrition dashboard', free: false, premium: false, family: true },
        ],
    },
    {
        category: 'Support',
        features: [
            { name: 'Standard support', free: true, premium: true, family: true },
            { name: 'Priority support', free: false, premium: true, family: true },
            { name: 'Dedicated support', free: false, premium: false, family: true },
        ],
    },
];

// ==================== SUBSCRIPTION BENEFITS ====================

export const SUBSCRIPTION_BENEFITS = {
    premium: [
        {
            icon: '📅',
            title: 'Unlimited Meal Plans',
            description: 'Create as many meal plans as you need',
        },
        {
            icon: '🍳',
            title: 'Full Recipe Library',
            description: 'Access to 1000+ curated recipes',
        },
        {
            icon: '📊',
            title: 'Advanced Analytics',
            description: 'Detailed nutrition insights and trends',
        },
        {
            icon: '✏️',
            title: 'Custom Recipes',
            description: 'Create and save your own recipes',
        },
        {
            icon: '🛒',
            title: 'Smart Shopping Lists',
            description: 'Auto-generated from your meal plans',
        },
        {
            icon: '⚡',
            title: 'Priority Support',
            description: 'Get help when you need it',
        },
    ],
    family: [
        {
            icon: '👨‍👩‍👧‍👦',
            title: 'Family Sharing',
            description: 'Up to 6 family members included',
        },
        {
            icon: '🔄',
            title: 'Shared Meal Plans',
            description: 'Coordinate meals with your family',
        },
        {
            icon: '📈',
            title: 'Family Dashboard',
            description: 'Track nutrition for the whole family',
        },
        {
            icon: '🎯',
            title: 'Multiple Preferences',
            description: 'Different diets for each member',
        },
        {
            icon: '💬',
            title: 'Dedicated Support',
            description: 'Premium support for your family',
        },
    ],
};
