import { isValidEmail, resetPassword } from '@/services/firebase/auth';
import { Colors } from '@/utils/constants';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ForgotPassword() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleResetPassword = async () => {
        // Clear previous messages
        setError('');
        setSuccess(false);

        // Validation
        if (!email) {
            setError('Please enter your email address');
            return;
        }

        if (!isValidEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setIsLoading(true);

        try {
            const response = await resetPassword(email);

            if (response.success) {
                setSuccess(true);
            } else {
                setError(response.error || 'Failed to send reset email. Please try again.');
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
            console.error('Password reset error:', err);
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
                <View style={{ flex: 1, padding: 24 }}>
                    {/* Header */}
                    <View style={{ marginTop: 60, marginBottom: 40 }}>
                        <TouchableOpacity
                            onPress={() => router.back()}
                            style={{ marginBottom: 24 }}
                        >
                            <Ionicons name="arrow-back" size={24} color={Colors.light.text.primary} />
                        </TouchableOpacity>

                        <Text
                            style={{
                                fontSize: 32,
                                fontWeight: 'bold',
                                marginBottom: 12,
                                color: Colors.light.text.primary
                            }}
                        >
                            Forgot Password?
                        </Text>
                        <Text
                            style={{
                                fontSize: 16,
                                color: Colors.light.text.secondary,
                                lineHeight: 24
                            }}
                        >
                            No worries! Enter your email address and we'll send you a link to reset your password.
                        </Text>
                    </View>

                    {/* Success Message */}
                    {success ? (
                        <View style={{
                            backgroundColor: '#D1FAE5',
                            padding: 16,
                            borderRadius: 8,
                            marginBottom: 24,
                            borderLeftWidth: 4,
                            borderLeftColor: '#10B981'
                        }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Ionicons name="checkmark-circle" size={24} color="#059669" style={{ marginRight: 12 }} />
                                <View style={{ flex: 1 }}>
                                    <Text style={{ color: '#065F46', fontSize: 16, fontWeight: '600', marginBottom: 4 }}>
                                        Email Sent!
                                    </Text>
                                    <Text style={{ color: '#047857', fontSize: 14 }}>
                                        Check your inbox for password reset instructions.
                                    </Text>
                                </View>
                            </View>
                        </View>
                    ) : null}

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
                    <View style={{ marginBottom: 24 }}>
                        <Text
                            style={{
                                fontSize: 14,
                                fontWeight: '500',
                                marginBottom: 8,
                                color: Colors.light.text.secondary
                            }}
                        >
                            Email Address
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
                                fontSize: 16
                            }}
                            placeholder="your@email.com"
                            placeholderTextColor={Colors.light.text.tertiary}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoComplete="email"
                            editable={!isLoading && !success}
                        />
                    </View>

                    {/* Reset Button */}
                    <TouchableOpacity
                        style={{
                            width: '100%',
                            paddingHorizontal: 32,
                            paddingVertical: 16,
                            borderRadius: 8,
                            marginBottom: 16,
                            backgroundColor: (isLoading || success) ? Colors.light.border : Colors.primary.main,
                            minHeight: 48,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        onPress={handleResetPassword}
                        activeOpacity={0.8}
                        disabled={isLoading || success}
                    >
                        {isLoading ? (
                            <>
                                <ActivityIndicator color="white" style={{ marginRight: 8 }} />
                                <Text style={{ color: 'white', fontSize: 18, fontWeight: '600' }}>
                                    Sending...
                                </Text>
                            </>
                        ) : (
                            <Text style={{ color: 'white', fontSize: 18, fontWeight: '600' }}>
                                {success ? 'Email Sent' : 'Send Reset Link'}
                            </Text>
                        )}
                    </TouchableOpacity>

                    {/* Back to Login */}
                    <TouchableOpacity
                        style={{ marginTop: 16, alignItems: 'center' }}
                        onPress={() => router.back()}
                        disabled={isLoading}
                    >
                        <Text
                            style={{
                                fontSize: 16,
                                color: Colors.primary.dark,
                                fontWeight: '500'
                            }}
                        >
                            Back to Login
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}