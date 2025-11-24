import { auth } from '@/services/firebase/config';
import {
    getUserNotificationPreferences,
    updateNotificationPreferences
} from '@/services/firebase/notifications';
import { NotificationPreferences } from '@/types';
import { useEffect, useState } from 'react';

export function useNotificationPreferences() {
    const [preferences, setPreferences] = useState<NotificationPreferences>({
        pushEnabled: true,
        emailEnabled: true,
        mealReminders: true,
        planUpdates: true,
        recipeUpdates: false,
        shoppingReminders: true,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadPreferences();
    }, []);

    const loadPreferences = async () => {
        const user = auth.currentUser;
        if (!user) {
            setIsLoading(false);
            return;
        }

        try {
            console.log('📥 Loading notification preferences...');
            const prefs = await getUserNotificationPreferences(user.uid);
            if (prefs) {
                setPreferences(prefs);
                console.log('✅ Notification preferences loaded');
            }
        } catch (err) {
            console.error('❌ Error loading preferences:', err);
            setError('Failed to load notification preferences');
        } finally {
            setIsLoading(false);
        }
    };

    const updatePreferences = async (updates: Partial<NotificationPreferences>) => {
        const user = auth.currentUser;
        if (!user) return;

        try {
            // Optimistic update
            setPreferences(prev => ({ ...prev, ...updates }));

            await updateNotificationPreferences(user.uid, { ...preferences, ...updates });
            console.log('✅ Notification preferences updated');
        } catch (err) {
            console.error('❌ Error updating preferences:', err);
            // Revert optimistic update
            await loadPreferences();
            throw err;
        }
    };

    return {
        preferences,
        isLoading,
        error,
        updatePreferences,
    };
}
