import { Tabs, useNavigation } from 'expo-router';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HapticTab } from '@/components/haptic-tab';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/utils/constants';
import { Ionicons } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';

function HeaderMenuButton() {
    const navigation = useNavigation();

    return (
        <TouchableOpacity
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            style={{
                marginRight: 16,
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: 'rgba(255,255,255,0.2)',
                alignItems: 'center',
                justifyContent: 'center',
            }}
            activeOpacity={0.7}
        >
            <Ionicons name="person-circle-outline" size={28} color="white" />
        </TouchableOpacity>
    );
}

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const insets = useSafeAreaInsets();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors.primary.main,
                tabBarInactiveTintColor: Colors.light.text.tertiary,
                headerShown: false,
                tabBarButton: HapticTab,
                tabBarStyle: {
                    backgroundColor: 'white',
                    borderTopWidth: 1,
                    borderTopColor: Colors.light.border,
                    height: 60 + insets.bottom,
                    paddingBottom: insets.bottom + 8,
                    paddingTop: 8,
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '600',
                    marginTop: 4,
                },
                tabBarIconStyle: {
                    marginTop: 4,
                },
            }}>
            <Tabs.Screen
                name="planner"
                options={{
                    title: 'Planner',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? "calendar" : "calendar-outline"}
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="inventory"
                options={{
                    title: 'Inventory',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? "basket" : "basket-outline"}
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="recipes"
                options={{
                    title: 'Recipes',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? "restaurant" : "restaurant-outline"}
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="notifications"
                options={{
                    title: 'Notifications',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? "notifications" : "notifications-outline"}
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />
            {/* Hidden tabs - accessible via sidebar */}
            <Tabs.Screen
                name="profile"
                options={{
                    href: null, // Hide from tab bar, accessible via sidebar
                }}
            />
            <Tabs.Screen
                name="dashboard"
                options={{
                    href: null, // Hide from tab bar, accessible via sidebar
                }}
            />
        </Tabs>
    );
}
