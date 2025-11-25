import { auth, db } from '@/services/firebase/config';
import { Colors } from '@/utils/constants';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Animated, Dimensions, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const SIDEBAR_WIDTH = width * 0.8;

interface SidebarProps {
    visible: boolean;
    onClose: () => void;
}

export default function Sidebar({ visible, onClose }: SidebarProps) {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [slideAnim] = useState(new Animated.Value(-SIDEBAR_WIDTH));
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userInitials, setUserInitials] = useState('');

    useEffect(() => {
        loadUserData();
    }, []);

    useEffect(() => {
        if (visible) {
            Animated.spring(slideAnim, {
                toValue: 0,
                useNativeDriver: true,
                tension: 65,
                friction: 11
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: -SIDEBAR_WIDTH,
                duration: 250,
                useNativeDriver: true
            }).start();
        }
    }, [visible]);

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

    const handleNavigation = (route: string) => {
        onClose();
        setTimeout(() => {
            router.push(route as any);
        }, 300);
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            onClose();
            router.replace('/auth/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const menuSections = [
        {
            title: 'Overview',
            items: [
                { icon: 'stats-chart-outline', label: 'Dashboard', route: '/(tabs)/dashboard' },
                { icon: 'person-outline', label: 'My Profile', route: '/profile/personal' },
            ]
        },
        {
            title: 'Account',
            items: [
                { icon: 'settings-outline', label: 'Notification Settings', route: '/profile/notifications' },
                { icon: 'lock-closed-outline', label: 'Privacy & Security', route: '/profile/privacy' },
            ]
        },
        {
            title: 'Preferences',
            items: [
                { icon: 'restaurant-outline', label: 'Dietary Preferences', route: '/profile/dietary' },
                { icon: 'fitness-outline', label: 'Health Goals', route: '/profile/goals' },
                { icon: 'nutrition-outline', label: 'Meal Preferences', route: '/profile/meal-prefs' },
            ]
        },
        {
            title: 'Support',
            items: [
                { icon: 'help-circle-outline', label: 'Help Center', route: '/profile/help' },
                { icon: 'mail-outline', label: 'Contact Us', route: '/profile/contact' },
                { icon: 'star-outline', label: 'Rate App', route: '/profile/rate' },
            ]
        }
    ];

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            onRequestClose={onClose}
        >
            <View style={{ flex: 1, flexDirection: 'row' }}>
                {/* Sidebar */}
                <Animated.View
                    style={{
                        width: SIDEBAR_WIDTH,
                        height: '100%',
                        backgroundColor: 'white',
                        transform: [{ translateX: slideAnim }],
                        shadowColor: '#000',
                        shadowOffset: { width: 2, height: 0 },
                        shadowOpacity: 0.25,
                        shadowRadius: 10,
                        elevation: 5
                    }}
                >
                    <ScrollView style={{ flex: 1 }}>
                        {/* Header */}
                        <View style={{
                            backgroundColor: Colors.primary.main,
                            paddingTop: insets.top + 20,
                            paddingBottom: 24,
                            paddingHorizontal: 20
                        }}>
                            {/* Close Button */}
                            <TouchableOpacity
                                onPress={onClose}
                                style={{
                                    position: 'absolute',
                                    top: insets.top + 20,
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

                        {/* Menu Sections */}
                        <View style={{ paddingVertical: 16 }}>
                            {menuSections.map((section, sectionIndex) => (
                                <View key={sectionIndex} style={{ marginBottom: 20 }}>
                                    <Text style={{
                                        fontSize: 12,
                                        fontWeight: 'bold',
                                        color: Colors.light.text.secondary,
                                        marginBottom: 8,
                                        marginLeft: 20,
                                        textTransform: 'uppercase',
                                        letterSpacing: 0.5
                                    }}>
                                        {section.title}
                                    </Text>
                                    {section.items.map((item, itemIndex) => (
                                        <TouchableOpacity
                                            key={itemIndex}
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                paddingVertical: 14,
                                                paddingHorizontal: 20,
                                                backgroundColor: 'white'
                                            }}
                                            onPress={() => handleNavigation(item.route)}
                                            activeOpacity={0.7}
                                        >
                                            <Ionicons name={item.icon as any} size={22} color={Colors.primary.main} />
                                            <Text style={{
                                                flex: 1,
                                                fontSize: 15,
                                                color: Colors.light.text.primary,
                                                fontWeight: '500',
                                                marginLeft: 16
                                            }}>
                                                {item.label}
                                            </Text>
                                            <Ionicons name="chevron-forward" size={18} color={Colors.light.text.tertiary} />
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            ))}
                        </View>

                        {/* Logout Button */}
                        <View style={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 20 }}>
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
                    </ScrollView>
                </Animated.View>

                {/* Overlay */}
                <TouchableOpacity
                    style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}
                    activeOpacity={1}
                    onPress={onClose}
                />
            </View>
        </Modal>
    );
}
