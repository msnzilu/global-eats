import { View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Colors } from '@/utils/constants';

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        // TODO: Implement Firebase authentication
        router.push('/home');
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

                    {/* Login Form */}
                    <View style={{ width: '100%', maxWidth: 384 }}>
                        <Text
                            style={{
                                fontSize: 24,
                                fontWeight: 'bold',
                                marginBottom: 24,
                                color: Colors.light.text.primary
                            }}
                        >
                            Welcome Back
                        </Text>

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
                        <View style={{ marginBottom: 24 }}>
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
                                placeholder="Enter your password"
                                placeholderTextColor={Colors.light.text.tertiary}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                autoComplete="password"
                            />
                        </View>

                        {/* Login Button - Primary Emerald Green */}
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
                            onPress={handleLogin}
                            activeOpacity={0.8}
                        >
                            <Text style={{ color: 'white', fontSize: 18, fontWeight: '600', textAlign: 'center' }}>
                                Log In
                            </Text>
                        </TouchableOpacity>

                        {/* Forgot Password */}
                        <TouchableOpacity
                            style={{ marginBottom: 24, minHeight: 44 }}
                            onPress={() => router.push('/forgot-password')}
                        >
                            <Text
                                style={{
                                    textAlign: 'center',
                                    fontSize: 16,
                                    fontWeight: '500',
                                    color: Colors.primary.dark
                                }}
                            >
                                Forgot Password?
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

                        {/* Google Sign In - Secondary Amber */}
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
                                console.log('Google Sign In');
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

                        {/* Sign Up Link */}
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Text
                                style={{
                                    fontSize: 16,
                                    color: Colors.light.text.secondary
                                }}
                            >
                                Don't have an account?{' '}
                            </Text>
                            <TouchableOpacity
                                style={{ minHeight: 44, justifyContent: 'center' }}
                                onPress={() => router.push('/signup')}
                            >
                                <Text
                                    style={{
                                        fontSize: 16,
                                        fontWeight: 'bold',
                                        color: Colors.secondary.main
                                    }}
                                >
                                    Sign Up
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}