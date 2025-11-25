import {
    auth,
    clearAllNotifications,
    deleteNotification,
    getUnreadNotificationCount,
    markAllNotificationsAsRead,
    markNotificationAsRead,
    subscribeToUserNotifications
} from '@/services/firebase';
import { Notification } from '@/types';
import { useEffect, useState } from 'react';

export function useNotifications(unreadOnly: boolean = false) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) {
            setIsLoading(false);
            return;
        }

        console.log('📥 Subscribing to notifications...');

        // Subscribe to notifications
        const unsubscribeNotifications = subscribeToUserNotifications(
            user.uid,
            (updatedNotifications) => {
                setNotifications(updatedNotifications);
                setIsLoading(false);
                console.log(`✅ Loaded ${updatedNotifications.length} notifications`);
            },
            (err) => {
                setError(err.message);
                setIsLoading(false);
                console.error('❌ Error loading notifications:', err);
            },
            unreadOnly
        );

        // Load unread count
        loadUnreadCount(user.uid);

        return () => {
            console.log('🔌 Unsubscribing from notifications');
            unsubscribeNotifications();
        };
    }, [unreadOnly]);

    const loadUnreadCount = async (userId: string) => {
        try {
            const count = await getUnreadNotificationCount(userId);
            setUnreadCount(count);
        } catch (err) {
            console.error('❌ Error loading unread count:', err);
        }
    };

    const markAsRead = async (notificationId: string) => {
        const user = auth.currentUser;
        if (!user) return;

        try {
            await markNotificationAsRead(user.uid, notificationId);
            // Update local state optimistically
            setNotifications(prev =>
                prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error('❌ Error marking notification as read:', err);
            throw err;
        }
    };

    const markAllAsRead = async () => {
        const user = auth.currentUser;
        if (!user) return;

        try {
            await markAllNotificationsAsRead(user.uid);
            // Update local state optimistically
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (err) {
            console.error('❌ Error marking all as read:', err);
            throw err;
        }
    };

    const deleteNotif = async (notificationId: string) => {
        const user = auth.currentUser;
        if (!user) return;

        try {
            await deleteNotification(user.uid, notificationId);
            // Update local state optimistically
            setNotifications(prev => prev.filter(n => n.id !== notificationId));
            // Reload unread count
            await loadUnreadCount(user.uid);
        } catch (err) {
            console.error('❌ Error deleting notification:', err);
            throw err;
        }
    };

    const clearAll = async () => {
        const user = auth.currentUser;
        if (!user) return;

        try {
            await clearAllNotifications(user.uid);
            setNotifications([]);
            setUnreadCount(0);
        } catch (err) {
            console.error('❌ Error clearing all notifications:', err);
            throw err;
        }
    };

    return {
        notifications,
        unreadCount,
        isLoading,
        error,
        markAsRead,
        markAllAsRead,
        deleteNotification: deleteNotif,
        clearAll,
    };
}
