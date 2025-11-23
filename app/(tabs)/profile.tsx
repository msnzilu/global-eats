import { auth, db } from '@/services/firebase/config';
import { Colors } from '@/utils/constants';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function Profile() {
    const router = useRouter();
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [userInitials, setUserInitials] = useState('');

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const user = auth.currentUser;

            if (!user) {
                console.log('❌ No user logged in, redirecting to login');
                router.replace('/auth/login');
                return;
            }

            console.log('📥 Loading profile data for:', user.uid);

            // Set email from Auth immediately
            setUserEmail(user.email || '');

            // Get name from Firestore first, fallback to Auth
            try {
                const userDoc = await getDoc(doc(db, 'users', user.uid));

                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    const name = userData.name || user.displayName || 'User';
                    setUserName(name);
                    setUserInitials(getInitials(name));
                    console.log('✅ Profile data loaded from Firestore');
                } else {
                    // Fallback to Auth data
                    const name = user.displayName || 'User';
                    setUserName(name);
                    setUserInitials(getInitials(name));
                    console.log('⚠️ Using Auth data only');
                }
            } catch (firestoreError) {
                console.warn('⚠️ Firestore read failed, using Auth data:', firestoreError);
                const name = user.displayName || 'User';
                setUserName(name);
                setUserInitials(getInitials(name));
            }
        } catch (error) {
            console.error('❌ Error loading profile:', error);
            Alert.alert('Error', 'Failed to load profile data');
        } finally {
            setIsLoading(false);
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
                            console.log('🚪 Logging out...');
                            await signOut(auth);
                            console.log('✅ Logged out successfully');
                            router.replace('/auth/login');
                        } catch (error) {
                            console.error('❌ Logout error:', error);
                            Alert.alert('Error', 'Failed to logout. Please try again.');
                        }
                    }
                }
            ]
        );
    };

    const profileSections = [
        {
            title: 'Account',
            items: [
                { icon: '👤', label: 'Personal Information', route: '/profile/personal' },
                { icon: '🔔', label: 'Notifications', route: '/profile/notifications' },
                { icon: '🔒', label: 'Privacy & Security', route: '/profile/privacy' },
            ]
        },
        {
            title: 'Preferences',
            items: [
                { icon: '🌍', label: 'Dietary Preferences', route: '/profile/dietary' },
                { icon: '⚖️', label: 'Health Goals', route: '/profile/goals' },
                { icon: '🎯', label: 'Meal Preferences', route: '/profile/meal-prefs' },
            ]
        },
        {
            title: 'Support',
            items: [
                { icon: '❓', label: 'Help Center', route: '/profile/help' },
                { icon: '📧', label: 'Contact Us', route: '/profile/contact' },
                { icon: '⭐', label: 'Rate App', route: '/profile/rate' },
            ]
        }
    ];

    if (isLoading) {
        return (
            <View style={{ flex: 1, backgroundColor: Colors.light.background, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator size="large" color={Colors.primary.main} />
                <Text style={{ marginTop: 16, color: Colors.light.text.secondary }}>
                    Loading profile...
                </Text>
            </View>
        );
    }

    return (
        <ScrollView style={{ flex: 1, backgroundColor: Colors.light.background }}>
            {/* Header */}
            <View style={{
                backgroundColor: Colors.primary.main,
                paddingTop: 60,
                paddingBottom: 32,
                paddingHorizontal: 24,
                borderBottomLeftRadius: 24,
                borderBottomRightRadius: 24,
                alignItems: 'center'
            }}>
                <View style={{
                    width: 100,
                    height: 100,
                    borderRadius: 50,
                    backgroundColor: 'rgba(255,255,255,0.3)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 16,
                    borderWidth: 3,
                    borderColor: 'rgba(255,255,255,0.5)'
                }}>
                    <Text style={{ fontSize: 36, fontWeight: 'bold', color: 'white' }}>
                        {userInitials || '👤'}
                    </Text>
                </View>
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white', marginBottom: 4 }}>
                    {userName || 'User'}
                </Text>
                <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.9)' }}>
                    {userEmail || 'No email'}
                </Text>
            </View>

            {/* Profile Stats */}
            <View style={{ paddingHorizontal: 24, marginTop: -20, marginBottom: 24 }}>
                <View style={{
                    backgroundColor: 'white',
                    borderRadius: 16,
                    padding: 20,
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 3
                }}>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: 24, fontWeight: 'bold', color: Colors.primary.main }}>
                            45
                        </Text>
                        <Text style={{ fontSize: 12, color: Colors.light.text.secondary, marginTop: 4 }}>
                            Recipes
                        </Text>
                    </View>
                    <View style={{ width: 1, backgroundColor: Colors.light.border }} />
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: 24, fontWeight: 'bold', color: Colors.secondary.main }}>
                            128
                        </Text>
                        <Text style={{ fontSize: 12, color: Colors.light.text.secondary, marginTop: 4 }}>
                            Meals Cooked
                        </Text>
                    </View>
                    <View style={{ width: 1, backgroundColor: Colors.light.border }} />
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: 24, fontWeight: 'bold', color: Colors.primary.dark }}>
                            12
                        </Text>
                        <Text style={{ fontSize: 12, color: Colors.light.text.secondary, marginTop: 4 }}>
                            Weeks Active
                        </Text>
                    </View>
                </View>
            </View>

            {/* Profile Sections */}
            <View style={{ paddingHorizontal: 24 }}>
                {profileSections.map((section, sectionIndex) => (
                    <View key={sectionIndex} style={{ marginBottom: 24 }}>
                        <Text style={{
                            fontSize: 16,
                            fontWeight: 'bold',
                            color: Colors.light.text.secondary,
                            marginBottom: 12,
                            textTransform: 'uppercase',
                            letterSpacing: 0.5
                        }}>
                            {section.title}
                        </Text>

                        <View style={{
                            backgroundColor: 'white',
                            borderRadius: 12,
                            overflow: 'hidden',
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 0.08,
                            shadowRadius: 4,
                            elevation: 2
                        }}>
                            {section.items.map((item, itemIndex) => (
                                <View key={itemIndex}>
                                    <TouchableOpacity
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            padding: 16,
                                            backgroundColor: 'white'
                                        }}
                                        onPress={() => router.push(item.route)}
                                        activeOpacity={0.7}
                                    >
                                        <View style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: 8,
                                            backgroundColor: Colors.light.surface,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginRight: 12
                                        }}>
                                            <Text style={{ fontSize: 20 }}>{item.icon}</Text>
                                        </View>
                                        <Text style={{
                                            flex: 1,
                                            fontSize: 16,
                                            color: Colors.light.text.primary,
                                            fontWeight: '500'
                                        }}>
                                            {item.label}
                                        </Text>
                                        <Text style={{ fontSize: 16, color: Colors.light.text.tertiary }}>
                                            ›
                                        </Text>
                                    </TouchableOpacity>
                                    {itemIndex < section.items.length - 1 && (
                                        <View style={{
                                            height: 1,
                                            backgroundColor: Colors.light.border,
                                            marginLeft: 68
                                        }} />
                                    )}
                                </View>
                            ))}
                        </View>
                    </View>
                ))}
            </View>

            {/* Logout Button */}
            <View style={{ paddingHorizontal: 24, paddingBottom: 32 }}>
                <TouchableOpacity
                    style={{
                        backgroundColor: '#FEE2E2',
                        paddingVertical: 16,
                        borderRadius: 12,
                        alignItems: 'center',
                        borderWidth: 1,
                        borderColor: '#FECACA'
                    }}
                    onPress={handleLogout}
                    activeOpacity={0.7}
                >
                    <Text style={{
                        fontSize: 16,
                        fontWeight: '600',
                        color: '#EF4444'
                    }}>
                        Logout
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}