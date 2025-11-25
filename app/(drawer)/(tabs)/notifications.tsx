import { NotificationCard } from '@/components/NotificationCard';
import Sidebar from '@/components/Sidebar';
import SidebarToggle from '@/components/SidebarToggle';
import { useNotifications } from '@/hooks/useNotifications';
import { Colors } from '@/utils/constants';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ActivityIndicator, Alert, FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function NotificationsScreen() {
    const insets = useSafeAreaInsets();
    const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
    const [refreshing, setRefreshing] = useState(false);
    const [sidebarVisible, setSidebarVisible] = useState(false);

    const {
        notifications,
        unreadCount,
        isLoading,
        error,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
    } = useNotifications(activeTab === 'unread');

    const handleRefresh = async () => {
        setRefreshing(true);
        // The hook will automatically refresh via the subscription
        setTimeout(() => setRefreshing(false), 1000);
    };

    const handleMarkAllAsRead = () => {
        if (unreadCount === 0) {
            Alert.alert('No Unread Notifications', 'All notifications are already marked as read.');
            return;
        }

        Alert.alert(
            'Mark All as Read',
            `Mark all ${unreadCount} unread notifications as read?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Mark All',
                    onPress: async () => {
                        try {
                            await markAllAsRead();
                        } catch (err) {
                            Alert.alert('Error', 'Failed to mark all as read');
                        }
                    }
                }
            ]
        );
    };

    const handleClearAll = () => {
        if (notifications.length === 0) {
            Alert.alert('No Notifications', 'There are no notifications to clear.');
            return;
        }

        Alert.alert(
            'Clear All Notifications',
            'Are you sure you want to delete all notifications? This cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear All',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await clearAll();
                        } catch (err) {
                            Alert.alert('Error', 'Failed to clear notifications');
                        }
                    }
                }
            ]
        );
    };

    const renderEmptyState = () => (
        <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 80,
        }}>
            <View style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: Colors.light.surface,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
            }}>
                <Ionicons
                    name={activeTab === 'unread' ? 'checkmark-done' : 'notifications-off'}
                    size={40}
                    color={Colors.light.text.tertiary}
                />
            </View>
            <Text style={{
                fontSize: 18,
                fontWeight: '600',
                color: Colors.light.text.primary,
                marginBottom: 8,
            }}>
                {activeTab === 'unread' ? 'All Caught Up!' : 'No Notifications'}
            </Text>
            <Text style={{
                fontSize: 14,
                color: Colors.light.text.secondary,
                textAlign: 'center',
                paddingHorizontal: 40,
            }}>
                {activeTab === 'unread'
                    ? 'You have no unread notifications'
                    : 'You have no notifications yet'}
            </Text>
        </View>
    );

    if (isLoading) {
        return (
            <View style={{ flex: 1, backgroundColor: Colors.light.background, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator size="large" color={Colors.primary.main} />
                <Text style={{ marginTop: 16, color: Colors.light.text.secondary }}>
                    Loading notifications...
                </Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={{ flex: 1, backgroundColor: Colors.light.background, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
                <Ionicons name="alert-circle" size={48} color="#EF4444" />
                <Text style={{ marginTop: 16, fontSize: 16, fontWeight: '600', color: Colors.light.text.primary }}>
                    Error Loading Notifications
                </Text>
                <Text style={{ marginTop: 8, color: Colors.light.text.secondary, textAlign: 'center' }}>
                    {error}
                </Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: Colors.light.background }}>
            {/* Header */}
            <View style={{
                backgroundColor: Colors.primary.main,
                paddingTop: insets.top + 16,
                paddingBottom: 20,
                paddingHorizontal: 24,
            }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <Text style={{ fontSize: 28, fontWeight: 'bold', color: 'white' }}>
                        Notifications
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                        {unreadCount > 0 && (
                            <View style={{
                                backgroundColor: 'rgba(255,255,255,0.3)',
                                paddingHorizontal: 12,
                                paddingVertical: 4,
                                borderRadius: 12,
                            }}>
                                <Text style={{ fontSize: 14, fontWeight: '600', color: 'white' }}>
                                    {unreadCount} new
                                </Text>
                            </View>
                        )}
                        <SidebarToggle onPress={() => setSidebarVisible(true)} />
                    </View>
                </View>

                {/* Tab Selector */}
                <View style={{
                    flexDirection: 'row',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    borderRadius: 8,
                    padding: 4,
                }}>
                    <TouchableOpacity
                        style={{
                            flex: 1,
                            paddingVertical: 8,
                            borderRadius: 6,
                            backgroundColor: activeTab === 'all' ? 'white' : 'transparent',
                        }}
                        onPress={() => setActiveTab('all')}
                        activeOpacity={0.7}
                    >
                        <Text style={{
                            textAlign: 'center',
                            fontSize: 14,
                            fontWeight: '600',
                            color: activeTab === 'all' ? Colors.primary.main : 'rgba(255,255,255,0.9)',
                        }}>
                            All
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            flex: 1,
                            paddingVertical: 8,
                            borderRadius: 6,
                            backgroundColor: activeTab === 'unread' ? 'white' : 'transparent',
                        }}
                        onPress={() => setActiveTab('unread')}
                        activeOpacity={0.7}
                    >
                        <Text style={{
                            textAlign: 'center',
                            fontSize: 14,
                            fontWeight: '600',
                            color: activeTab === 'unread' ? Colors.primary.main : 'rgba(255,255,255,0.9)',
                        }}>
                            Unread {unreadCount > 0 && `(${unreadCount})`}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Action Buttons */}
            {notifications.length > 0 && (
                <View style={{
                    flexDirection: 'row',
                    paddingHorizontal: 24,
                    paddingVertical: 12,
                    gap: 12,
                }}>
                    {unreadCount > 0 && (
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: 'white',
                                paddingVertical: 10,
                                borderRadius: 8,
                                borderWidth: 1,
                                borderColor: Colors.light.border,
                            }}
                            onPress={handleMarkAllAsRead}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="checkmark-done" size={16} color={Colors.primary.main} />
                            <Text style={{
                                marginLeft: 6,
                                fontSize: 13,
                                fontWeight: '600',
                                color: Colors.primary.main,
                            }}>
                                Mark All Read
                            </Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity
                        style={{
                            flex: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'white',
                            paddingVertical: 10,
                            borderRadius: 8,
                            borderWidth: 1,
                            borderColor: Colors.light.border,
                        }}
                        onPress={handleClearAll}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="trash-outline" size={16} color="#EF4444" />
                        <Text style={{
                            marginLeft: 6,
                            fontSize: 13,
                            fontWeight: '600',
                            color: '#EF4444',
                        }}>
                            Clear All
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Notifications List */}
            <FlatList
                data={notifications}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <NotificationCard
                        notification={item}
                        onMarkAsRead={markAsRead}
                        onDelete={deleteNotification}
                    />
                )}
                contentContainerStyle={{
                    paddingHorizontal: 24,
                    paddingTop: 12,
                    paddingBottom: 100 + insets.bottom,
                }}
                ListEmptyComponent={renderEmptyState}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        tintColor={Colors.primary.main}
                    />
                }
                showsVerticalScrollIndicator={false}
            />

            <Sidebar
                visible={sidebarVisible}
                onClose={() => setSidebarVisible(false)}
            />
        </View>
    );
}
