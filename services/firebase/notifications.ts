import { Notification, NotificationPreferences } from '@/types';
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    Unsubscribe,
    updateDoc,
    where,
    writeBatch
} from 'firebase/firestore';
import { db } from './config';

// ============================================================================
// NOTIFICATION MANAGEMENT
// ============================================================================

/**
 * Create a new notification for a user
 */
export async function createNotification(
    userId: string,
    notificationData: Omit<Notification, 'id' | 'userId' | 'createdAt' | 'isRead'>
): Promise<string> {
    try {
        const notificationsRef = collection(db, 'notifications', userId, 'items');
        const docRef = await addDoc(notificationsRef, {
            ...notificationData,
            userId,
            isRead: false,
            createdAt: serverTimestamp(),
        });
        console.log('✅ Notification created:', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('❌ Error creating notification:', error);
        throw new Error('Failed to create notification');
    }
}

/**
 * Subscribe to user's notifications with real-time updates
 * Returns an unsubscribe function to stop listening
 */
export function subscribeToUserNotifications(
    userId: string,
    onUpdate: (notifications: Notification[]) => void,
    onError?: (error: Error) => void,
    unreadOnly: boolean = false
): Unsubscribe {
    try {
        const notificationsRef = collection(db, 'notifications', userId, 'items');

        let q = query(
            notificationsRef,
            orderBy('createdAt', 'desc')
        );

        if (unreadOnly) {
            q = query(
                notificationsRef,
                where('isRead', '==', false),
                orderBy('createdAt', 'desc')
            );
        }

        return onSnapshot(
            q,
            (snapshot) => {
                const notifications: Notification[] = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as Notification));
                onUpdate(notifications);
            },
            (error) => {
                console.error('❌ Error subscribing to notifications:', error);
                if (onError) {
                    onError(new Error('Failed to load notifications'));
                }
            }
        );
    } catch (error) {
        console.error('❌ Error setting up notifications subscription:', error);
        throw new Error('Failed to subscribe to notifications');
    }
}

/**
 * Mark a notification as read
 */
export async function markNotificationAsRead(
    userId: string,
    notificationId: string
): Promise<void> {
    try {
        const notificationRef = doc(db, 'notifications', userId, 'items', notificationId);
        await updateDoc(notificationRef, {
            isRead: true,
        });
        console.log('✅ Notification marked as read:', notificationId);
    } catch (error) {
        console.error('❌ Error marking notification as read:', error);
        throw new Error('Failed to mark notification as read');
    }
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllNotificationsAsRead(userId: string): Promise<void> {
    try {
        const notificationsRef = collection(db, 'notifications', userId, 'items');
        const q = query(notificationsRef, where('isRead', '==', false));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            console.log('ℹ️ No unread notifications to mark');
            return;
        }

        const batch = writeBatch(db);
        snapshot.docs.forEach((docSnapshot) => {
            batch.update(docSnapshot.ref, { isRead: true });
        });

        await batch.commit();
        console.log(`✅ Marked ${snapshot.docs.length} notifications as read`);
    } catch (error) {
        console.error('❌ Error marking all notifications as read:', error);
        throw new Error('Failed to mark all notifications as read');
    }
}

/**
 * Delete a specific notification
 */
export async function deleteNotification(
    userId: string,
    notificationId: string
): Promise<void> {
    try {
        const notificationRef = doc(db, 'notifications', userId, 'items', notificationId);
        await deleteDoc(notificationRef);
        console.log('✅ Notification deleted:', notificationId);
    } catch (error) {
        console.error('❌ Error deleting notification:', error);
        throw new Error('Failed to delete notification');
    }
}

/**
 * Clear all notifications for a user
 */
export async function clearAllNotifications(userId: string): Promise<void> {
    try {
        const notificationsRef = collection(db, 'notifications', userId, 'items');
        const snapshot = await getDocs(notificationsRef);

        if (snapshot.empty) {
            console.log('ℹ️ No notifications to clear');
            return;
        }

        const batch = writeBatch(db);
        snapshot.docs.forEach((docSnapshot) => {
            batch.delete(docSnapshot.ref);
        });

        await batch.commit();
        console.log(`✅ Cleared ${snapshot.docs.length} notifications`);
    } catch (error) {
        console.error('❌ Error clearing all notifications:', error);
        throw new Error('Failed to clear all notifications');
    }
}

/**
 * Get unread notification count for a user
 */
export async function getUnreadNotificationCount(userId: string): Promise<number> {
    try {
        const notificationsRef = collection(db, 'notifications', userId, 'items');
        const q = query(notificationsRef, where('isRead', '==', false));
        const snapshot = await getDocs(q);
        return snapshot.size;
    } catch (error) {
        console.error('❌ Error getting unread notification count:', error);
        return 0;
    }
}

// ============================================================================
// NOTIFICATION PREFERENCES MANAGEMENT
// ============================================================================

/**
 * Get user's notification preferences
 */
export async function getUserNotificationPreferences(
    userId: string
): Promise<NotificationPreferences | null> {
    try {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const userData = userSnap.data();
            return userData.notificationPreferences || getDefaultPreferences();
        }
        return null;
    } catch (error) {
        console.error('❌ Error getting notification preferences:', error);
        throw new Error('Failed to get notification preferences');
    }
}

/**
 * Update user's notification preferences
 */
export async function updateNotificationPreferences(
    userId: string,
    preferences: Partial<NotificationPreferences>
): Promise<void> {
    try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            notificationPreferences: preferences,
            updatedAt: serverTimestamp(),
        });
        console.log('✅ Notification preferences updated');
    } catch (error) {
        console.error('❌ Error updating notification preferences:', error);
        throw new Error('Failed to update notification preferences');
    }
}

/**
 * Get default notification preferences
 */
function getDefaultPreferences(): NotificationPreferences {
    return {
        pushEnabled: true,
        emailEnabled: true,
        mealReminders: true,
        planUpdates: true,
        recipeUpdates: false,
        shoppingReminders: true,
    };
}

// ============================================================================
// HELPER FUNCTIONS FOR CREATING SPECIFIC NOTIFICATION TYPES
// ============================================================================

/**
 * Create a meal plan update notification
 */
export async function createMealPlanNotification(
    userId: string,
    mealPlanId: string,
    duration: number
): Promise<void> {
    const preferences = await getUserNotificationPreferences(userId);

    if (!preferences?.planUpdates) {
        console.log('ℹ️ Plan update notifications disabled for user');
        return;
    }

    await createNotification(userId, {
        type: 'plan_update',
        title: 'Meal Plan Ready! 🎉',
        message: `Your ${duration}-day meal plan has been generated and is ready to view.`,
        priority: 'high',
        actionUrl: `/(tabs)/planner`,
        metadata: { mealPlanId, duration },
    });
}

/**
 * Create a meal reminder notification
 */
export async function createMealReminderNotification(
    userId: string,
    mealType: string,
    recipeName: string,
    recipeId: string
): Promise<void> {
    const preferences = await getUserNotificationPreferences(userId);

    if (!preferences?.mealReminders) {
        console.log('ℹ️ Meal reminder notifications disabled for user');
        return;
    }

    const mealEmoji = mealType === 'breakfast' ? '🍳' : mealType === 'lunch' ? '🍱' : '🍽️';

    await createNotification(userId, {
        type: 'meal_reminder',
        title: `${mealType.charAt(0).toUpperCase() + mealType.slice(1)} Time! ${mealEmoji}`,
        message: `Time to prepare ${recipeName}`,
        priority: 'medium',
        actionUrl: `/recipes/${recipeId}`,
        metadata: { mealType, recipeName, recipeId },
    });
}

/**
 * Create a shopping reminder notification
 */
export async function createShoppingReminderNotification(
    userId: string,
    itemCount: number
): Promise<void> {
    const preferences = await getUserNotificationPreferences(userId);

    if (!preferences?.shoppingReminders) {
        console.log('ℹ️ Shopping reminder notifications disabled for user');
        return;
    }

    await createNotification(userId, {
        type: 'shopping_reminder',
        title: 'Shopping List Updated 🛒',
        message: `You have ${itemCount} items on your shopping list`,
        priority: 'low',
        actionUrl: `/(tabs)/inventory`,
        metadata: { itemCount },
    });
}

/**
 * Create a recipe update notification
 */
export async function createRecipeUpdateNotification(
    userId: string,
    recipeName: string,
    recipeId: string
): Promise<void> {
    const preferences = await getUserNotificationPreferences(userId);

    if (!preferences?.recipeUpdates) {
        console.log('ℹ️ Recipe update notifications disabled for user');
        return;
    }

    await createNotification(userId, {
        type: 'recipe_update',
        title: 'New Recipe Suggestion 👨‍🍳',
        message: `Check out ${recipeName} - it matches your preferences!`,
        priority: 'low',
        actionUrl: `/recipes/${recipeId}`,
        metadata: { recipeName, recipeId },
    });
}
