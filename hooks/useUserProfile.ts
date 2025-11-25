import { auth, getUserProfile, updateUserProfile } from '@/services/firebase';
import { CookingTime, DietType, HealthGoal, User } from '@/types';
import { useEffect, useState } from 'react';

interface DietaryPreferences {
    dietType: DietType;
    allergies: string[];
    dislikes?: string[];
}

interface HealthGoals {
    goal: HealthGoal;
    currentWeight?: number;
    targetWeight?: number;
    targetCalories: number;
}

interface MealPreferences {
    mealsPerDay: 1 | 2 | 3;
    preferredCuisines: string[];
    maxCookingTime: CookingTime;
}

interface UseUserProfileReturn {
    profile: User | null;
    loading: boolean;
    error: string | null;
    updateDietaryPreferences: (prefs: DietaryPreferences) => Promise<void>;
    updateHealthGoals: (goals: HealthGoals) => Promise<void>;
    updateMealPreferences: (prefs: MealPreferences) => Promise<void>;
    refresh: () => void;
}

export function useUserProfile(): UseUserProfileReturn {
    const [profile, setProfile] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const currentUser = auth.currentUser;

    const loadProfile = async () => {
        if (!currentUser) {
            setLoading(false);
            setError('User not authenticated');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            console.log('📥 Loading user profile...');

            const userProfile = await getUserProfile(currentUser.uid);
            setProfile(userProfile);
            console.log('✅ User profile loaded:', userProfile);
        } catch (err: any) {
            console.error('❌ Error loading user profile:', err);
            setError(err.message || 'Failed to load user profile');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProfile();
    }, [currentUser?.uid]);

    const updateDietaryPreferences = async (prefs: DietaryPreferences) => {
        if (!currentUser) {
            throw new Error('User not authenticated');
        }

        try {
            console.log('💾 Updating dietary preferences...');
            await updateUserProfile(currentUser.uid, {
                dietType: prefs.dietType,
                allergies: prefs.allergies,
                ...(prefs.dislikes && { dislikes: prefs.dislikes })
            });

            // Update local state optimistically
            if (profile) {
                setProfile({
                    ...profile,
                    dietType: prefs.dietType,
                    allergies: prefs.allergies,
                    ...(prefs.dislikes && { dislikes: prefs.dislikes })
                });
            }

            console.log('✅ Dietary preferences updated');
        } catch (err: any) {
            console.error('❌ Error updating dietary preferences:', err);
            throw new Error(err.message || 'Failed to update dietary preferences');
        }
    };

    const updateHealthGoals = async (goals: HealthGoals) => {
        if (!currentUser) {
            throw new Error('User not authenticated');
        }

        try {
            console.log('💾 Updating health goals...');
            await updateUserProfile(currentUser.uid, {
                goal: goals.goal,
                targetCalories: goals.targetCalories,
                ...(goals.currentWeight && { currentWeight: goals.currentWeight }),
                ...(goals.targetWeight && { targetWeight: goals.targetWeight })
            });

            // Update local state optimistically
            if (profile) {
                setProfile({
                    ...profile,
                    goal: goals.goal,
                    targetCalories: goals.targetCalories,
                    ...(goals.currentWeight && { currentWeight: goals.currentWeight }),
                    ...(goals.targetWeight && { targetWeight: goals.targetWeight })
                });
            }

            console.log('✅ Health goals updated');
        } catch (err: any) {
            console.error('❌ Error updating health goals:', err);
            throw new Error(err.message || 'Failed to update health goals');
        }
    };

    const updateMealPreferences = async (prefs: MealPreferences) => {
        if (!currentUser) {
            throw new Error('User not authenticated');
        }

        try {
            console.log('💾 Updating meal preferences...');
            await updateUserProfile(currentUser.uid, {
                mealsPerDay: prefs.mealsPerDay,
                preferredCuisines: prefs.preferredCuisines,
                maxCookingTime: prefs.maxCookingTime
            });

            // Update local state optimistically
            if (profile) {
                setProfile({
                    ...profile,
                    mealsPerDay: prefs.mealsPerDay,
                    preferredCuisines: prefs.preferredCuisines,
                    maxCookingTime: prefs.maxCookingTime
                });
            }

            console.log('✅ Meal preferences updated');
        } catch (err: any) {
            console.error('❌ Error updating meal preferences:', err);
            throw new Error(err.message || 'Failed to update meal preferences');
        }
    };

    const refresh = () => {
        loadProfile();
    };

    return {
        profile,
        loading,
        error,
        updateDietaryPreferences,
        updateHealthGoals,
        updateMealPreferences,
        refresh
    };
}
