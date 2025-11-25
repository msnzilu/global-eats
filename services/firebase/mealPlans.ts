import { MealPlan } from '@/types';
import { addDoc, collection, deleteDoc, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from './config';

const COLLECTION_NAME = 'mealPlans';

export const createManualMealPlan = async (userId: string, planData: Omit<MealPlan, 'id' | 'createdAt' | 'isActive' | 'creationMethod'>) => {
    try {
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
