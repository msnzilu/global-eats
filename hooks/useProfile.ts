import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/services/firebase/config';
import { UserProfile } from './useAuth';

export function useProfile(userId: string | undefined) {
    const [isUpdating, setIsUpdating] = useState(false);

    const updateProfile = async (data: Partial<UserProfile>) => {
        if (!userId) return;

        setIsUpdating(true);
        try {
            await updateDoc(doc(db, 'users', userId), {
                ...data,
                updatedAt: new Date().toISOString(),
            });
        } catch (error) {
            console.error('Error updating profile:', error);
            throw error;
        } finally {
            setIsUpdating(false);
        }
    };

    return { updateProfile, isUpdating };
}