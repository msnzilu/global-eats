import { OnboardingData, User } from '@/types';
import {
    doc,
    getDoc,
    serverTimestamp,
    setDoc,
    updateDoc
} from 'firebase/firestore';
import { db } from './config';

// ============================================================================
// USER PROFILE MANAGEMENT
// ============================================================================

/**
 * Create a new user profile in Firestore
 */
export async function createUserProfile(
    userId: string,
    data: Partial<User>
): Promise<void> {
    try {
        const userRef = doc(db, 'users', userId);
        await setDoc(userRef, {
            ...data,
            createdAt: serverTimestamp(),
            lastLoginAt: serverTimestamp(),
        });
    } catch (error) {
        console.error('Error creating user profile:', error);
        throw new Error('Failed to create user profile');
    }
}

/**
 * Get user profile from Firestore
 */
export async function getUserProfile(userId: string): Promise<User | null> {
    try {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            return userSnap.data() as User;
        }
        return null;
    } catch (error) {
        console.error('Error getting user profile:', error);
        throw new Error('Failed to get user profile');
    }
}

/**
 * Update user profile in Firestore
 */
export async function updateUserProfile(
    userId: string,
    data: Partial<User>
): Promise<void> {
    try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            ...data,
            updatedAt: serverTimestamp(),
        });
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw new Error('Failed to update user profile');
    }
}

/**
 * Update user profile with onboarding data
 */
export async function updateOnboardingData(
    userId: string,
    onboardingData: OnboardingData
): Promise<void> {
    try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            dietType: onboardingData.dietType,
            allergies: onboardingData.allergies,
            goal: onboardingData.goal,
            targetCalories: onboardingData.targetCalories,
            mealsPerDay: onboardingData.mealsPerDay,
            preferredCuisines: onboardingData.cuisines,
            maxCookingTime: onboardingData.cookingTime,
            hasCompletedOnboarding: true,
            updatedAt: serverTimestamp(),
        });
    } catch (error) {
        console.error('Error updating onboarding data:', error);
        throw new Error('Failed to update onboarding data');
    }
}

/**
 * Update last login timestamp
 */
export async function updateLastLogin(userId: string): Promise<void> {
    try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            lastLoginAt: serverTimestamp(),
        });
    } catch (error) {
        console.error('Error updating last login:', error);
        // Don't throw error for this non-critical operation
    }
}
