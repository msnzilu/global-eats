import { useAuth } from '@/hooks/useAuth';
import { isValidEmail, passwordsMatch, registerWithEmail, useGoogleAuth, validatePassword } from '@/services/firebase/auth';
import { Colors } from '@/utils/constants';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Signup() {
    const router = useRouter();
    const { user } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Rename the destructured values to avoid conflicts
    const {
        signInWithGoogle,
        isLoading: isGoogleLoading,
        error: googleError,
        isReady
    } = useGoogleAuth();

    useEffect(() => {
        if (user) router.replace('/onboarding');
    }, [user]);

    const handleSignup = async () => {
        setError('');

        if (!name || !email || !password || !confirmPassword) {
            setError('Please fill in all fields');
            return;
        }

        if (!isValidEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }

        if (!passwordsMatch(password, confirmPassword)) {
            setError('Passwords do not match');
            return;
        }

        const passwordError = validatePassword(password);
        if (passwordError) {
            setError(passwordError);
            return;
        }

        setIsLoading(true);

        try {
            const response = await registerWithEmail(email, password, name);
            console.log("response:", response);

            if (response.success && response.user) {
                Alert.alert(
                    '🎉 Welcome to GlobalEats!',
                    `Your account has been created successfully, ${name}!`,
                    [{ text: 'Get Started', onPress: () => router.replace('/onboarding') }]
                );
            } else {
                setError(response.error || 'Signup failed. Please try again.');
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
            console.error('Signup error:', err);
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

                        {/* Email signup error */}
                        {error && (
                            <Text style={{
                                color: 'red',
                                fontSize: 14,
                                marginBottom: 16,
                                textAlign: 'center',
                            }}>
                                {error}
                            </Text>
                        )}

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
                                opacity: isLoading ? 0.5 : 1,
                            }}
                            onPress={handleSignup}
                            disabled={isLoading}
                            activeOpacity={0.8}
                        >
                            <Text style={{ color: 'white', fontSize: 18, fontWeight: '600', textAlign: 'center' }}>
                                {isLoading ? 'Creating Account...' : 'Sign Up'}
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
                                {isGoogleLoading ? "Signing Up..." : "Sign Up with Google"}
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
                                onPress={() => router.push('/auth/login')}
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