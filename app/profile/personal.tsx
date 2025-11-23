import { auth, db } from '@/services/firebase/config';
import { Colors } from '@/utils/constants';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface UserProfile {
    name: string;
    email: string;
    phone: string;
    age: string;
    gender: string;
}

export default function PersonalInformation() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('Male');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const user = auth.currentUser;
            if (!user) {
                Alert.alert('Error', 'No user logged in');
                router.back();
                return;
            }

            console.log('📥 Loading user data for:', user.uid);

            // Get user data from Firestore
            const userDoc = await getDoc(doc(db, 'users', user.uid));

            if (userDoc.exists()) {
                const userData = userDoc.data();
                console.log('✅ User data loaded:', userData);

                setName(userData.name || user.displayName || '');
                setEmail(user.email || '');
                setPhone(userData.phone || '');
                setAge(userData.age || '');
                setGender(userData.gender || 'Male');
            } else {
                console.log('⚠️ No user document found, using auth data');
                // If no Firestore document exists, use Firebase Auth data
                setName(user.displayName || '');
                setEmail(user.email || '');
            }
        } catch (error) {
            console.error('❌ Error loading user data:', error);
            Alert.alert('Error', 'Failed to load user data');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        // Validation
        if (!name.trim()) {
            Alert.alert('Validation Error', 'Please enter your name');
            return;
        }

        if (!email.trim()) {
            Alert.alert('Validation Error', 'Please enter your email');
            return;
        }

        setIsSaving(true);

        try {
            const user = auth.currentUser;
            if (!user) {
                Alert.alert('Error', 'No user logged in');
                return;
            }

            console.log('💾 Saving user data...');

            // Update display name in Firebase Auth
            if (name !== user.displayName) {
                await updateProfile(user, {
                    displayName: name
                });
                console.log('✅ Display name updated in Auth');
            }

            // Save complete profile to Firestore
            const userProfile: UserProfile = {
                name: name.trim(),
                email: email.trim(),
                phone: phone.trim(),
                age: age.trim(),
                gender: gender
            };

            await setDoc(doc(db, 'users', user.uid), {
                ...userProfile,
                updatedAt: new Date().toISOString()
            }, { merge: true });

            console.log('✅ User profile saved to Firestore');

            Alert.alert(
                'Success',
                'Your profile has been updated successfully!',
                [
                    {
                        text: 'OK',
                        onPress: () => router.back()
                    }
                ]
            );
        } catch (error) {
            console.error('❌ Error saving user data:', error);
            Alert.alert('Error', 'Failed to save changes. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <View style={{ flex: 1, backgroundColor: Colors.light.background }}>
                {/* Header */}
                <View style={{
                    backgroundColor: Colors.primary.main,
                    paddingTop: insets.top + 16,
                    paddingBottom: 20,
                    paddingHorizontal: 24,
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                    <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>
                        Personal Information
                    </Text>
                </View>

                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color={Colors.primary.main} />
                    <Text style={{ marginTop: 16, color: Colors.light.text.secondary }}>
                        Loading your information...
                    </Text>
                </View>
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
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>
                    Personal Information
                </Text>
            </View>

            <ScrollView
                contentContainerStyle={{
                    padding: 24,
                    paddingBottom: insets.bottom + 24
                }}
            >
                {/* Full Name */}
                <View style={{ marginBottom: 20 }}>
                    <Text style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: Colors.light.text.secondary,
                        marginBottom: 8
                    }}>
                        Full Name
                    </Text>
                    <TextInput
                        style={{
                            backgroundColor: 'white',
                            borderRadius: 12,
                            padding: 16,
                            fontSize: 16,
                            borderWidth: 1,
                            borderColor: Colors.light.border,
                            color: Colors.light.text.primary
                        }}
                        value={name}
                        onChangeText={setName}
                        placeholder="Enter your full name"
                        placeholderTextColor={Colors.light.text.tertiary}
                        editable={!isSaving}
                    />
                </View>

                {/* Email */}
                <View style={{ marginBottom: 20 }}>
                    <Text style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: Colors.light.text.secondary,
                        marginBottom: 8
                    }}>
                        Email
                    </Text>
                    <TextInput
                        style={{
                            backgroundColor: '#F5F5F5',
                            borderRadius: 12,
                            padding: 16,
                            fontSize: 16,
                            borderWidth: 1,
                            borderColor: Colors.light.border,
                            color: Colors.light.text.secondary
                        }}
                        value={email}
                        editable={false}
                        keyboardType="email-address"
                    />
                    <Text style={{
                        fontSize: 12,
                        color: Colors.light.text.tertiary,
                        marginTop: 4
                    }}>
                        Email cannot be changed
                    </Text>
                </View>

                {/* Phone */}
                <View style={{ marginBottom: 20 }}>
                    <Text style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: Colors.light.text.secondary,
                        marginBottom: 8
                    }}>
                        Phone Number
                    </Text>
                    <TextInput
                        style={{
                            backgroundColor: 'white',
                            borderRadius: 12,
                            padding: 16,
                            fontSize: 16,
                            borderWidth: 1,
                            borderColor: Colors.light.border,
                            color: Colors.light.text.primary
                        }}
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                        placeholder="Enter your phone number"
                        placeholderTextColor={Colors.light.text.tertiary}
                        editable={!isSaving}
                    />
                </View>

                {/* Age */}
                <View style={{ marginBottom: 20 }}>
                    <Text style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: Colors.light.text.secondary,
                        marginBottom: 8
                    }}>
                        Age
                    </Text>
                    <TextInput
                        style={{
                            backgroundColor: 'white',
                            borderRadius: 12,
                            padding: 16,
                            fontSize: 16,
                            borderWidth: 1,
                            borderColor: Colors.light.border,
                            color: Colors.light.text.primary
                        }}
                        value={age}
                        onChangeText={setAge}
                        keyboardType="number-pad"
                        placeholder="Enter your age"
                        placeholderTextColor={Colors.light.text.tertiary}
                        maxLength={3}
                        editable={!isSaving}
                    />
                </View>

                {/* Gender */}
                <View style={{ marginBottom: 32 }}>
                    <Text style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: Colors.light.text.secondary,
                        marginBottom: 8
                    }}>
                        Gender
                    </Text>
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                        {['Male', 'Female', 'Other'].map((g) => (
                            <TouchableOpacity
                                key={g}
                                onPress={() => setGender(g)}
                                disabled={isSaving}
                                style={{
                                    flex: 1,
                                    padding: 12,
                                    borderRadius: 12,
                                    borderWidth: 2,
                                    borderColor: gender === g ? Colors.primary.main : Colors.light.border,
                                    backgroundColor: gender === g ? `${Colors.primary.main}10` : 'white',
                                    opacity: isSaving ? 0.6 : 1
                                }}
                            >
                                <Text style={{
                                    textAlign: 'center',
                                    fontWeight: '600',
                                    color: gender === g ? Colors.primary.main : Colors.light.text.secondary
                                }}>
                                    {g}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Save Button */}
                <TouchableOpacity
                    style={{
                        backgroundColor: isSaving ? Colors.light.border : Colors.primary.main,
                        padding: 16,
                        borderRadius: 12,
                        alignItems: 'center',
                        flexDirection: 'row',
                        justifyContent: 'center'
                    }}
                    onPress={handleSave}
                    disabled={isSaving}
                    activeOpacity={0.8}
                >
                    {isSaving ? (
                        <>
                            <ActivityIndicator color="white" style={{ marginRight: 8 }} />
                            <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                                Saving...
                            </Text>
                        </>
                    ) : (
                        <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                            Save Changes
                        </Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}