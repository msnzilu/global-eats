// QUICK TEST VERSION - This skips updateLastLogin to test navigation
import { isValidEmail, loginWithEmail, useGoogleAuth } from '@/services/firebase/auth';
import { Colors } from '@/utils/constants';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const {
        signInWithGoogle,
        isLoading: isGoogleLoading,
        error: googleError,
        isReady
    } = useGoogleAuth();

    const handleLogin = async () => {
        setError('');

        if (!email || !password) {
            setError('Please enter both email and password');
            return;
        }

        if (!isValidEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setIsLoading(true);

        try {
            console.log('🔐 Login attempt with email:', email);
            const response = await loginWithEmail(email, password);

            console.log('📊 Login response success:', response.success);

            if (response.success && response.user) {
                console.log('✅ Login successful, user ID:', response.user.uid);

                // TEMPORARILY SKIP updateLastLogin to test navigation
                console.log('⏭️ Skipping updateLastLogin for testing');

                // Navigate immediately
                console.log('🚀 Attempting navigation to /(tabs)/planner');
                router.replace('/(drawer)/(tabs)/planner');
                console.log('✅ Navigation replace() called');

                // Also try push as backup after a short delay
                setTimeout(() => {
                    console.log('🔄 Backup: trying push navigation');
                    router.push('/(drawer)/(tabs)/planner');
                }, 100);
            } else {
                console.log('❌ Login failed:', response.error);
                setError(response.error || 'Login failed. Please try again.');
            }
        } catch (err) {
            console.error('❌ Login error:', err);
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
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

                        {/* Error Message */}
                        {error ? (
                            <View style={{
                                backgroundColor: '#FEE2E2',
                                padding: 12,
                                borderRadius: 8,
                                marginBottom: 16,
                                borderLeftWidth: 4,
                                borderLeftColor: '#EF4444'
                            }}>
                                <Text style={{ color: '#DC2626', fontSize: 14 }}>
                                    {error}
                                </Text>
                            </View>
                        ) : null}

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
                                editable={!isLoading}
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
                                editable={!isLoading}
                            />
                        </View>

                        {/* Login Button */}
                        <TouchableOpacity
                            style={{
                                width: '100%',
                                paddingHorizontal: 32,
                                paddingVertical: 16,
                                borderRadius: 8,
                                marginBottom: 16,
                                backgroundColor: isLoading ? Colors.light.border : Colors.primary.main,
                                minHeight: 48,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            onPress={handleLogin}
                            activeOpacity={0.8}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <ActivityIndicator color="white" style={{ marginRight: 8 }} />
                                    <Text style={{ color: 'white', fontSize: 18, fontWeight: '600' }}>
                                        Logging in...
                                    </Text>
                                </>
                            ) : (
                                <Text style={{ color: 'white', fontSize: 18, fontWeight: '600' }}>
                                    Log In
                                </Text>
                            )}
                        </TouchableOpacity>

                        {/* Forgot Password */}
                        <TouchableOpacity
                            style={{ marginBottom: 24, minHeight: 44 }}
                            onPress={() => router.push('/auth/forgot-password')}
                            disabled={isLoading}
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
                                opacity: (!isReady || isGoogleLoading) ? 0.5 : 1,
                            }}
                            onPress={signInWithGoogle}
                            disabled={!isReady || isGoogleLoading}
                            activeOpacity={0.8}
                        >
                            <Text style={{ fontSize: 16, fontWeight: '600', color: Colors.light.text.primary }}>
                                {isGoogleLoading ? "Signing In..." : "Sign In with Google"}
                            </Text>
                        </TouchableOpacity>

                        {/* Google error - separate from email error */}
                        {googleError && (
                            <Text style={{
                                color: 'red',
                                fontSize: 14,
                                marginBottom: 16,
                                textAlign: 'center',
                            }}>
                                {googleError}
                            </Text>
                        )}


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
                                onPress={() => router.push('/auth/signup')}
                                disabled={isLoading}
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