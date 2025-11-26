import { MealPlan } from '@/types';
import { addDoc, collection, deleteDoc, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from './config';

const COLLECTION_NAME = 'mealPlans';

import { getDocs, query, where } from 'firebase/firestore';
import { getUserProfile } from './firestore';

/**
 * Check if user has reached their meal plan limit
 */
export async function checkMealPlanLimit(userId: string): Promise<boolean> {
    const userProfile = await getUserProfile(userId);

    // Premium users have no limit
    if (userProfile?.subscriptionTier === 'premium' || userProfile?.subscriptionTier === 'family') {
        return true;
    }

    // Free users limited to 1 meal plan
    const plansRef = collection(db, COLLECTION_NAME);
    const q = query(plansRef, where('userId', '==', userId));
    const snapshot = await getDocs(q);

    return snapshot.size < 1;
}

export const createManualMealPlan = async (userId: string, planData: Omit<MealPlan, 'id' | 'createdAt' | 'isActive' | 'creationMethod'>) => {
    try {
        // Check limit
        const canCreate = await checkMealPlanLimit(userId);
        if (!canCreate) {
            throw new Error('Meal Plan limit reached. Upgrade to Premium to create more plans.');
        }

        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...planData,
            userId,
            createdAt: serverTimestamp(),
            isActive: true,
            creationMethod: 'manual'
        });
        return docRef.id;
    } catch (error) {
        console.error('Error creating manual meal plan:', error);
        throw error;
    }
};

export const createAIMealPlan = async (userId: string, prompt: string, generatedPlan: Omit<MealPlan, 'id' | 'createdAt' | 'isActive' | 'creationMethod' | 'aiPrompt'>) => {
    try {
        const userProfile = await getUserProfile(userId);

        // Free users cannot use AI generation
        if (userProfile?.subscriptionTier === 'free') {
            throw new Error('AI Meal Plan Generation is a Premium feature. Upgrade to unlock.');
        }

        // Check limit (though Premium users shouldn't hit it, good practice)
        const canCreate = await checkMealPlanLimit(userId);
        if (!canCreate) {
            throw new Error('Meal Plan limit reached.');
        }

        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...generatedPlan,
            userId,
            createdAt: serverTimestamp(),
            isActive: true,
            creationMethod: 'ai-generated',
            aiPrompt: prompt
        });
        return docRef.id;
    } catch (error) {
        console.error('Error creating AI meal plan:', error);
        throw error;
    }
};

export const updateMealPlan = async (planId: string, updates: Partial<MealPlan>) => {
    try {
        const docRef = doc(db, COLLECTION_NAME, planId);
        await updateDoc(docRef, {
            ...updates,
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error('Error updating meal plan:', error);
        throw error;
    }
};

export const deleteMealPlan = async (planId: string) => {
    try {
        await deleteDoc(doc(db, COLLECTION_NAME, planId));
    } catch (error) {
        console.error('Error deleting meal plan:', error);
        throw error;
    }
};
