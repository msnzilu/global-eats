/**
 * Subscription Management Service
 * Handles subscription creation, updates, and cancellations
 */

import { doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from './config';
import { getUserProfile } from './firestore';

// Stripe Price IDs - These should match your Stripe Dashboard
// You'll need to create products and prices in Stripe and replace these
export const STRIPE_PRICE_IDS = {
    premium_monthly: 'price_premium_monthly', // Replace with actual Stripe Price ID
    premium_yearly: 'price_premium_yearly',   // Replace with actual Stripe Price ID
};

export interface SubscriptionData {
    tier: 'free' | 'premium';
    status: 'active' | 'canceled' | 'past_due' | 'trialing';
    currentPeriodEnd?: Date;
    cancelAtPeriodEnd?: boolean;
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
}

/**
 * Create a Stripe Checkout Session
 * This should be called from a Cloud Function for security
 * For now, this is a placeholder that returns a mock session
 */
export async function createCheckoutSession(
    userId: string,
    priceId: string
): Promise<{ sessionId: string; url: string }> {
    try {
        // In production, this should call a Cloud Function that creates the Stripe session
        // Example:
        // const functions = getFunctions();
        // const createSession = httpsCallable(functions, 'createCheckoutSession');
        // const result = await createSession({ userId, priceId });
        // return result.data;

        // For now, return a mock response
        console.warn('Using mock checkout session. Implement Cloud Function for production.');
        
        return {
            sessionId: 'mock_session_id',
            url: 'https://checkout.stripe.com/mock',
        };
    } catch (error) {
        console.error('Error creating checkout session:', error);
        throw new Error('Failed to create checkout session');
    }
}

/**
 * Update user's subscription tier in Firestore
 */
export async function updateUserSubscription(
    userId: string,
    subscriptionData: Partial<SubscriptionData>
): Promise<void> {
    try {
        const userRef = doc(db, 'users', userId);
        
        const updates: any = {
            subscriptionTier: subscriptionData.tier || 'free',
            subscriptionStatus: subscriptionData.status,
            cancelAtPeriodEnd: subscriptionData.cancelAtPeriodEnd || false,
            updatedAt: serverTimestamp(),
        };

        if (subscriptionData.currentPeriodEnd !== undefined) {
            updates.subscriptionEndDate = subscriptionData.currentPeriodEnd;
        }

        if (subscriptionData.stripeCustomerId !== undefined) {
            updates.stripeCustomerId = subscriptionData.stripeCustomerId;
        }

        if (subscriptionData.stripeSubscriptionId !== undefined) {
            updates.stripeSubscriptionId = subscriptionData.stripeSubscriptionId;
        }
        
        await updateDoc(userRef, updates);

        console.log(`Updated subscription for user ${userId} to ${subscriptionData.tier}`);
    } catch (error) {
        console.error('Error updating user subscription:', error);
        throw new Error('Failed to update subscription');
    }
}

/**
 * Cancel a user's subscription
 * This should call a Cloud Function to cancel in Stripe
 */
export async function cancelSubscription(userId: string): Promise<void> {
    try {
        const userProfile = await getUserProfile(userId);
        
        if (!userProfile?.stripeSubscriptionId) {
            throw new Error('No active subscription found');
        }

        // In production, call Cloud Function to cancel in Stripe
        // Example:
        // const functions = getFunctions();
        // const cancelSub = httpsCallable(functions, 'cancelSubscription');
        // await cancelSub({ userId, subscriptionId: userProfile.stripeSubscriptionId });

        // For now, just update Firestore
        console.warn('Using mock cancellation. Implement Cloud Function for production.');
        
        await updateUserSubscription(userId, {
            tier: 'free',
            status: 'canceled',
            cancelAtPeriodEnd: true,
        });

        console.log(`Cancelled subscription for user ${userId}`);
    } catch (error) {
        console.error('Error cancelling subscription:', error);
        throw new Error('Failed to cancel subscription');
    }
}

/**
 * Get subscription status for a user
 */
export async function getSubscriptionStatus(userId: string): Promise<SubscriptionData | null> {
    try {
        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);
        
        if (!userDoc.exists()) {
            return null;
        }

        const data = userDoc.data();
        
        return {
            tier: data.subscriptionTier || 'free',
            status: data.subscriptionStatus || 'active',
            currentPeriodEnd: data.subscriptionEndDate?.toDate(),
            cancelAtPeriodEnd: data.cancelAtPeriodEnd || false,
            stripeCustomerId: data.stripeCustomerId,
            stripeSubscriptionId: data.stripeSubscriptionId,
        };
    } catch (error) {
        console.error('Error getting subscription status:', error);
        return null;
    }
}

/**
 * Simulate a successful payment (for testing)
 * In production, this would be handled by Stripe webhooks
 */
export async function simulateSuccessfulPayment(
    userId: string,
    tier: 'premium',
    billingPeriod: 'monthly' | 'yearly'
): Promise<void> {
    try {
        const currentDate = new Date();
        const endDate = new Date(currentDate);
        
        // Add period to end date
        if (billingPeriod === 'monthly') {
            endDate.setMonth(endDate.getMonth() + 1);
        } else {
            endDate.setFullYear(endDate.getFullYear() + 1);
        }

        await updateUserSubscription(userId, {
            tier,
            status: 'active',
            currentPeriodEnd: endDate,
            cancelAtPeriodEnd: false,
            stripeCustomerId: `cus_mock_${userId}`,
            stripeSubscriptionId: `sub_mock_${userId}_${Date.now()}`,
        });

        console.log(`Simulated successful payment for user ${userId}`);
    } catch (error) {
        console.error('Error simulating payment:', error);
        throw new Error('Failed to simulate payment');
    }
}
