import { auth, db } from '@/services/firebase/config';
import { Colors } from '@/utils/constants';
import { Ionicons } from '@expo/vector-icons';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { usePathname, useRouter } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

function CustomDrawerContent(props: any) {
    const router = useRouter();
    const pathname = usePathname();
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userInitials, setUserInitials] = useState('');

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const user = auth.currentUser;
            if (!user) return;

            setUserEmail(user.email || '');

            try {
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    const name = userData.name || user.displayName || 'User';
                    setUserName(name);
                    setUserInitials(getInitials(name));
                } else {
                    const name = user.displayName || 'User';
                    setUserName(name);
                    setUserInitials(getInitials(name));
                }
            } catch (error) {
                const name = user.displayName || 'User';
                setUserName(name);
                setUserInitials(getInitials(name));
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    };

    const getInitials = (name: string): string => {
        if (!name) return 'U';
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    const handleLogout = async () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            props.navigation.closeDrawer();
                            await signOut(auth);
                            router.replace('/auth/login');
                        } catch (error) {
                            console.error('Logout error:', error);
                        }
                    }
                }
            ]
        );
    };

    const navigateTo = (route: string) => {
        props.navigation.closeDrawer();
        setTimeout(() => router.push(route as any), 100);
    };

    return (
        <DrawerContentScrollView {...props} style={{ backgroundColor: 'white' }}>
            {/* Profile Header */}
            <View style={{
                backgroundColor: Colors.primary.main,
                padding: 20,
                paddingTop: 60,
                marginBottom: 20
            }}>
                {/* Close Button */}
                <TouchableOpacity
                    onPress={() => props.navigation.closeDrawer()}
                    style={{
                        position: 'absolute',
                        top: 60,
                        right: 20,
                        width: 36,
                        height: 36,
                        borderRadius: 18,
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10,
                    }}
                    activeOpacity={0.7}
                >
                    <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>

                <View style={{
                    width: 70,
                    height: 70,
                    borderRadius: 35,
                    backgroundColor: 'rgba(255,255,255,0.3)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 12,
                    borderWidth: 2,
                    borderColor: 'rgba(255,255,255,0.5)'
                }}>
                    <Text style={{ fontSize: 28, fontWeight: 'bold', color: 'white' }}>
                        {userInitials || '👤'}
                    </Text>
                </View>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white', marginBottom: 4 }}>
                    {userName || 'User'}
                </Text>
                <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)' }}>
                    {userEmail || 'No email'}
                </Text>
            </View>

            {/* Overview Section */}
            <Text style={{
                fontSize: 12,
                fontWeight: 'bold',
                color: Colors.light.text.secondary,
                marginLeft: 20,
                marginBottom: 8,
                textTransform: 'uppercase',
                letterSpacing: 0.5
            }}>
                Overview
            </Text>
            <DrawerItem
                label="Dashboard"
                icon={({ color, size }) => <Ionicons name="stats-chart-outline" size={size} color={color} />}
                onPress={() => navigateTo('/(tabs)/dashboard')}
                activeTintColor={Colors.primary.main}
                inactiveTintColor={Colors.light.text.primary}
                focused={pathname === '/(tabs)/dashboard'}
            />
            <DrawerItem
                label="My Profile"
                icon={({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />}
                onPress={() => navigateTo('/profile/personal')}
                activeTintColor={Colors.primary.main}
                inactiveTintColor={Colors.light.text.primary}
                focused={pathname === '/profile/personal'}
            />

            {/* Account Section */}
            <Text style={{
                fontSize: 12,
                fontWeight: 'bold',
                color: Colors.light.text.secondary,
                marginLeft: 20,
                marginTop: 16,
                marginBottom: 8,
                textTransform: 'uppercase',
                letterSpacing: 0.5
            }}>
                Account
            </Text>
            <DrawerItem
                label="Notification Settings"
                icon={({ color, size }) => <Ionicons name="settings-outline" size={size} color={color} />}
                onPress={() => navigateTo('/profile/notifications')}
                activeTintColor={Colors.primary.main}
                inactiveTintColor={Colors.light.text.primary}
                focused={pathname === '/profile/notifications'}
            />
            <DrawerItem
                label="Privacy & Security"
                icon={({ color, size }) => <Ionicons name="lock-closed-outline" size={size} color={color} />}
                onPress={() => navigateTo('/profile/privacy')}
                activeTintColor={Colors.primary.main}
                inactiveTintColor={Colors.light.text.primary}
                focused={pathname === '/profile/privacy'}
            />

            {/* Preferences Section */}
            <Text style={{
                fontSize: 12,
                fontWeight: 'bold',
                color: Colors.light.text.secondary,
                marginLeft: 20,
                marginTop: 16,
                marginBottom: 8,
                textTransform: 'uppercase',
                letterSpacing: 0.5
            }}>
                Preferences
            </Text>
            <DrawerItem
                label="Dietary Preferences"
                icon={({ color, size }) => <Ionicons name="restaurant-outline" size={size} color={color} />}
                onPress={() => navigateTo('/profile/dietary')}
                activeTintColor={Colors.primary.main}
                inactiveTintColor={Colors.light.text.primary}
                focused={pathname === '/profile/dietary'}
            />
            <DrawerItem
                label="Health Goals"
                icon={({ color, size }) => <Ionicons name="fitness-outline" size={size} color={color} />}
                onPress={() => navigateTo('/profile/goals')}
                activeTintColor={Colors.primary.main}
                inactiveTintColor={Colors.light.text.primary}
                focused={pathname === '/profile/goals'}
            />
            <DrawerItem
                label="Meal Preferences"
                icon={({ color, size }) => <Ionicons name="nutrition-outline" size={size} color={color} />}
                onPress={() => navigateTo('/profile/meal-prefs')}
                activeTintColor={Colors.primary.main}
                inactiveTintColor={Colors.light.text.primary}
                focused={pathname === '/profile/meal-prefs'}
            />

            {/* Support Section */}
            <Text style={{
                fontSize: 12,
                fontWeight: 'bold',
                color: Colors.light.text.secondary,
                marginLeft: 20,
                marginTop: 16,
                marginBottom: 8,
                textTransform: 'uppercase',
                letterSpacing: 0.5
            }}>
                Support
            </Text>
            <DrawerItem
                label="Help Center"
                icon={({ color, size }) => <Ionicons name="help-circle-outline" size={size} color={color} />}
                onPress={() => navigateTo('/profile/help')}
                activeTintColor={Colors.primary.main}
                inactiveTintColor={Colors.light.text.primary}
                focused={pathname === '/profile/help'}
            />
            <DrawerItem
                label="Contact Us"
                icon={({ color, size }) => <Ionicons name="mail-outline" size={size} color={color} />}
                onPress={() => navigateTo('/profile/contact')}
                activeTintColor={Colors.primary.main}
                inactiveTintColor={Colors.light.text.primary}
                focused={pathname === '/profile/contact'}
            />
            <DrawerItem
                label="Rate App"
                icon={({ color, size }) => <Ionicons name="star-outline" size={size} color={color} />}
                onPress={() => navigateTo('/profile/rate')}
                activeTintColor={Colors.primary.main}
                inactiveTintColor={Colors.light.text.primary}
                focused={pathname === '/profile/rate'}
            />

            {/* Logout Button */}
            <View style={{ padding: 20, paddingTop: 30 }}>
                <TouchableOpacity
                    style={{
                        backgroundColor: '#FEE2E2',
                        paddingVertical: 14,
                        borderRadius: 12,
                        alignItems: 'center',
                        borderWidth: 1,
                        borderColor: '#FECACA',
                        flexDirection: 'row',
                        justifyContent: 'center'
                    }}
                    onPress={handleLogout}
                    activeOpacity={0.7}
                >
                    <Ionicons name="log-out-outline" size={20} color="#EF4444" />
                    <Text style={{
                        fontSize: 15,
                        fontWeight: '600',
                        color: '#EF4444',
                        marginLeft: 8
                    }}>
                        Logout
                    </Text>
                </TouchableOpacity>
            </View>
        </DrawerContentScrollView>
    );
}

export default function DrawerLayout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Drawer
                drawerContent={(props) => <CustomDrawerContent {...props} />}
                screenOptions={{
                    headerShown: false,
                    drawerStyle: {
                        width: 280,
                    },
                    swipeEnabled: true,
                    swipeEdgeWidth: 50,
                }}
            >
                <Drawer.Screen
                    name="(tabs)"
                    options={{
                        drawerLabel: 'Home',
                        title: 'Home',
                        drawerItemStyle: { display: 'none' }, // Hide from drawer menu
                    }}
                />
            </Drawer>
        </GestureHandlerRootView>
    );
}
