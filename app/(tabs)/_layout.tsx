import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
        <Tabs.Screen
            name="index"
            options={{
                title: 'Home',
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="home-outline" size={size} color={color} />
                ),
            }}
        />
        <Tabs.Screen
            name="planner"
            options={{
                title: 'Planner',
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="calendar-outline" size={size} color={color} />
                ),
            }}
        />
        <Tabs.Screen
            name="inventory"
            options={{
                title: 'Inventory',
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="basket-outline" size={size} color={color} />
                ),
            }}
        />
        <Tabs.Screen
            name="recipes"
            options={{
                title: 'Recipes',
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="restaurant-outline" size={size} color={color} />
                ),
            }}
        />
        <Tabs.Screen
            name="profile"
            options={{
                title: 'Profile',
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="person-outline" size={size} color={color} />
                ),
            }}
        />
    </Tabs>
  );
}
