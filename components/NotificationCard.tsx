import { Notification, NotificationType } from '@/types';
import { Colors } from '@/utils/constants';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Timestamp } from 'firebase/firestore';
import { Alert, Text, TouchableOpacity, View } from 'react-native';

interface NotificationCardProps {
    notification: Notification;
    onMarkAsRead: (id: string) => void;
    onDelete: (id: string) => void;
}

export function NotificationCard({ notification, onMarkAsRead, onDelete }: NotificationCardProps) {
    const router = useRouter();

    const getNotificationIcon = (type: NotificationType): keyof typeof Ionicons.glyphMap => {
        switch (type) {
            case 'meal_reminder':
                return 'restaurant';
            case 'plan_update':
                return 'calendar';
            case 'recipe_update':
                return 'book';
            case 'shopping_reminder':
                return 'cart';
            case 'system':
                return 'information-circle';
            default:
                return 'notifications';
        }
    };

    const getNotificationColor = (type: NotificationType): string => {
        switch (type) {
            case 'meal_reminder':
                return Colors.secondary.main;
            case 'plan_update':
                return Colors.primary.main;
            case 'recipe_update':
                return '#8B5CF6';
            case 'shopping_reminder':
                return '#F59E0B';
            case 'system':
                return '#6B7280';
            default:
                return Colors.primary.main;
        }
    };

    const getRelativeTime = (timestamp: Timestamp): string => {
        if (!timestamp || !timestamp.toDate) return 'Just now';

        const now = new Date();
        const notifDate = timestamp.toDate();
        const diffMs = now.getTime() - notifDate.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return notifDate.toLocaleDateString();
    };

    const handlePress = () => {
        if (!notification.isRead) {
            onMarkAsRead(notification.id);
        }

        if (notification.actionUrl) {
            router.push(notification.actionUrl as any);
        }
    };

    const handleDelete = () => {
        Alert.alert(
            'Delete Notification',
            'Are you sure you want to delete this notification?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => onDelete(notification.id)
                }
            ]
        );
    };

    const iconName = getNotificationIcon(notification.type);
    const iconColor = getNotificationColor(notification.type);

    return (
        <TouchableOpacity
            style={{
                backgroundColor: notification.isRead ? 'white' : '#F0F9FF',
                borderRadius: 12,
                padding: 16,
                marginBottom: 12,
                flexDirection: 'row',
                alignItems: 'flex-start',
                borderLeftWidth: 3,
                borderLeftColor: notification.isRead ? Colors.light.border : iconColor,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
                elevation: 1,
            }}
            onPress={handlePress}
            activeOpacity={0.7}
        >
            {/* Icon */}
            <View
                style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: `${iconColor}20`,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                }}
            >
                <Ionicons name={iconName} size={20} color={iconColor} />
            </View>

            {/* Content */}
            <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                    <Text
                        style={{
                            flex: 1,
                            fontSize: 15,
                            fontWeight: notification.isRead ? '500' : '700',
                            color: Colors.light.text.primary,
                        }}
                    >
                        {notification.title}
                    </Text>
                    {!notification.isRead && (
                        <View
                            style={{
                                width: 8,
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: Colors.primary.main,
                                marginLeft: 8,
                            }}
                        />
                    )}
                </View>

                <Text
                    style={{
                        fontSize: 14,
                        color: Colors.light.text.secondary,
                        marginBottom: 8,
                        lineHeight: 20,
                    }}
                >
                    {notification.message}
                </Text>

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text
                        style={{
                            fontSize: 12,
                            color: Colors.light.text.tertiary,
                        }}
                    >
                        {getRelativeTime(notification.createdAt)}
                    </Text>

                    <TouchableOpacity
                        onPress={handleDelete}
                        style={{
                            padding: 4,
                        }}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Ionicons name="trash-outline" size={16} color={Colors.light.text.tertiary} />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );
}
