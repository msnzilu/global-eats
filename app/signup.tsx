import { View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Colors } from '@/utils/constants';

export default function Signup() {
    const router = useRouter();
    const { user } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        if (user) router.replace('/onboarding');
    }, [user]);

    const handleSignup = () => {
        // TODO: Implement Firebase authentication
        // Validate passwords match, etc.
        router.push('/onboarding');
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1, backgroundColor: Colors.light.background }}
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
            >
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
                    {/* Logo/Brand Area */}
                    <View style={{ alignItems: 'center', marginBottom: 48 }}>
                        <View
                            style={{
                                width: 80,
                                height: 80,
                                borderRadius: 40,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: 16,
                                backgroundColor: Colors.primary.main
                            }}
                        >
                            <Text style={{ fontSize: 36 }}>🍽️</Text>
                        </View>
                        <Text
                            style={{
                                fontSize: 36,
                                fontWeight: 'bold',
                                marginBottom: 8,
                                color: Colors.light.text.primary
                            }}
                        >
                            GlobalEats
                        </Text>
                        <Text
                            style={{
                                fontSize: 18,
                                color: Colors.light.text.secondary
                            }}
                        >
                            Plan. Cook. Thrive.
                        </Text>
                    </View>

                    {/* Signup Form */}
                    <View style={{ width: '100%', maxWidth: 384 }}>
                        <Text
                            style={{
                                fontSize: 24,
                                fontWeight: 'bold',
                                marginBottom: 24,
                                color: Colors.light.text.primary
                            }}
                        >
                            Create Account
                        </Text>

                        {/* Name Input */}
                        <View style={{ marginBottom: 16 }}>
                            <Text
                                style={{
                                    fontSize: 14,
                                    fontWeight: '500',
                                    marginBottom: 8,
                                    color: Colors.light.text.secondary
                                }}
                            >
                                Full Name
                            </Text>
                            <TextInput
                                style={{
                                    width: '100%',
                                    paddingHorizontal: 16,
                                    paddingVertical: 12,
                                    borderRadius: 8,
                                    backgroundColor: Colors.light.surface,
                                    borderWidth: 1,
                                    borderColor: Colors.light.border,
                                    color: Colors.light.text.primary,
                                }}
                                placeholder="John Doe"
                                placeholderTextColor={Colors.light.text.tertiary}
                                value={name}
                                onChangeText={setName}
                                autoCapitalize="words"
                                autoComplete="name"
                            />
                        </View>

                        {/* Email Input */}
                        <View style={{ marginBottom: 16 }}>
                            <Text
                                style={{
                                    fontSize: 14,
                                    fontWeight: '500',
                                    marginBottom: 8,
                                    color: Colors.light.text.secondary
                                }}
                            >
                                Email
                            </Text>
                            <TextInput
                                style={{
                                    width: '100%',
                                    paddingHorizontal: 16,
                                    paddingVertical: 12,
                                    borderRadius: 8,
                                    backgroundColor: Colors.light.surface,
                                    borderWidth: 1,
                                    borderColor: Colors.light.border,
                                    color: Colors.light.text.primary,
                                }}
                                placeholder="your@email.com"
                                placeholderTextColor={Colors.light.text.tertiary}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoComplete="email"
                            />
                        </View>

                        {/* Password Input */}
                        <View style={{ marginBottom: 16 }}>
                            <Text
                                style={{
                                    fontSize: 14,
                                    fontWeight: '500',
                                    marginBottom: 8,
                                    color: Colors.light.text.secondary
                                }}
                            >
                                Password
                            </Text>
                            <TextInput
                                style={{
                                    width: '100%',
                                    paddingHorizontal: 16,
                                    paddingVertical: 12,
                                    borderRadius: 8,
                                    backgroundColor: Colors.light.surface,
                                    borderWidth: 1,
                                    borderColor: Colors.light.border,
                                    color: Colors.light.text.primary,
                                }}
                                placeholder="Create a password"
                                placeholderTextColor={Colors.light.text.tertiary}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                autoComplete="password-new"
                            />
                        </View>

                        {/* Confirm Password Input */}
                        <View style={{ marginBottom: 24 }}>
                            <Text
                                style={{
                                    fontSize: 14,
                                    fontWeight: '500',
                                    marginBottom: 8,
                                    color: Colors.light.text.secondary
                                }}
                            >
                                Confirm Password
                            </Text>
                            <TextInput
                                style={{
                                    width: '100%',
                                    paddingHorizontal: 16,
                                    paddingVertical: 12,
                                    borderRadius: 8,
                                    backgroundColor: Colors.light.surface,
                                    borderWidth: 1,
                                    borderColor: Colors.light.border,
                                    color: Colors.light.text.primary,
                                }}
                                placeholder="Confirm your password"
                                placeholderTextColor={Colors.light.text.tertiary}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry
                                autoComplete="password-new"
                            />
                        </View>

                        {/* Sign Up Button - Primary Emerald Green */}
                        <TouchableOpacity
                            style={{
                                width: '100%',
                                paddingHorizontal: 32,
                                paddingVertical: 16,
                                borderRadius: 8,
                                marginBottom: 16,
                                backgroundColor: Colors.primary.main,
                                minHeight: 48,
                            }}
                            onPress={handleSignup}
                            activeOpacity={0.8}
                        >
                            <Text style={{ color: 'white', fontSize: 18, fontWeight: '600', textAlign: 'center' }}>
                                Sign Up
                            </Text>
                        </TouchableOpacity>

                        {/* Divider */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
                            <View
                                style={{
                                    flex: 1,
                                    height: 1,
                                    backgroundColor: Colors.light.border
                                }}
                            />
                            <Text
                                style={{
                                    marginHorizontal: 16,
                                    fontSize: 14,
                                    color: Colors.light.text.tertiary
                                }}
                            >
                                OR
                            </Text>
                            <View
                                style={{
                                    flex: 1,
                                    height: 1,
                                    backgroundColor: Colors.light.border
                                }}
                            />
                        </View>

                        {/* Google Sign Up - Secondary Amber */}
                        <TouchableOpacity
                            style={{
                                width: '100%',
                                paddingHorizontal: 32,
                                paddingVertical: 16,
                                borderRadius: 8,
                                marginBottom: 16,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: Colors.light.surface,
                                borderWidth: 1,
                                borderColor: Colors.light.border,
                                minHeight: 48,
                            }}
                            onPress={() => {
                                // TODO: Implement Google OAuth
                                console.log('Google Sign Up');
                            }}
                            activeOpacity={0.8}
                        >
                            <Text style={{ fontSize: 24, marginRight: 12 }}>🔍</Text>
                            <Text
                                style={{
                                    fontSize: 18,
                                    fontWeight: '600',
                                    color: Colors.light.text.primary
                                }}
                            >
                                Continue with Google
                            </Text>
                        </TouchableOpacity>

                        {/* Terms and Privacy */}
                        <Text
                            style={{
                                fontSize: 12,
                                textAlign: 'center',
                                marginBottom: 16,
                                color: Colors.light.text.tertiary,
                                lineHeight: 18
                            }}
                        >
                            By signing up, you agree to our{' '}
                            <Text style={{ color: Colors.primary.dark, fontWeight: '500' }}>
                                Terms of Service
                            </Text>
                            {' '}and{' '}
                            <Text style={{ color: Colors.primary.dark, fontWeight: '500' }}>
                                Privacy Policy
                            </Text>
                        </Text>

                        {/* Login Link */}
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Text
                                style={{
                                    fontSize: 16,
                                    color: Colors.light.text.secondary
                                }}
                            >
                                Already have an account?{' '}
                            </Text>
                            <TouchableOpacity
                                style={{ minHeight: 44, justifyContent: 'center' }}
                                onPress={() => router.push('/login')}
                            >
                                <Text
                                    style={{
                                        fontSize: 16,
                                        fontWeight: 'bold',
                                        color: Colors.secondary.main
                                    }}
                                >
                                    Log In
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}