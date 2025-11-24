import {
    createUserWithEmailAndPassword,
    EmailAuthProvider, // ADD 
    reauthenticateWithCredential,
    sendPasswordResetEmail, // ADD THIS
    signInWithEmailAndPassword,
    signOut,
    updatePassword,
    User
} from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';
import { auth } from './config';
import { createUserProfile } from './firestore';

// ============================================================================
// TYPES
// ============================================================================

export interface AuthResponse {
    success: boolean;
    user?: User;
    error?: string;
}

export interface AuthError {
    code: string;
    message: string;
}

// ============================================================================
// ERROR HANDLING
// ============================================================================

/**
 * Convert Firebase error codes to user-friendly messages
 */
export function getFirebaseErrorMessage(errorCode: string): string {
    const errorMessages: Record<string, string> = {
        // Authentication errors
        'auth/email-already-in-use': 'This email is already registered. Please login instead.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/operation-not-allowed': 'Email/password accounts are not enabled. Please contact support.',
        'auth/weak-password': 'Password is too weak. Please use at least 6 characters.',
        'auth/user-disabled': 'This account has been disabled. Please contact support.',
        'auth/user-not-found': 'No account found with this email. Please sign up.',
        'auth/wrong-password': 'Incorrect password. Please try again.',
        'auth/invalid-credential': 'Invalid email or password. Please try again.',
        'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
        'auth/network-request-failed': 'Network error. Please check your connection.',
        'auth/requires-recent-login': 'Please log out and log in again to perform this action.',

        // Password reset errors
        'auth/expired-action-code': 'This password reset link has expired. Please request a new one.',
        'auth/invalid-action-code': 'This password reset link is invalid. Please request a new one.',

        // Google OAuth errors
        'auth/popup-closed-by-user': 'Sign-in cancelled',
        'auth/cancelled-popup-request': 'Sign-in cancelled',
    };

    return errorMessages[errorCode] || 'An unexpected error occurred. Please try again.';
}

// ============================================================================
// AUTHENTICATION FUNCTIONS
// ============================================================================

/**
 * Register a new user with email and password
 * Creates both Firebase Auth user and Firestore profile
 */
export async function registerWithEmail(
    email: string,
    password: string,
    displayName: string
): Promise<AuthResponse> {
    try {
        // Create Firebase Auth user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Create Firestore user profile
        await createUserProfile(user.uid, {
            email: user.email || email,
            displayName,
            createdAt: Timestamp.fromDate(new Date()),
            lastLoginAt: Timestamp.fromDate(new Date()),
            // Default values - will be updated during onboarding
            dietType: 'None',
            allergies: [],
            goal: 'Maintain Weight',
            targetCalories: 2000,
            mealsPerDay: 3,
            preferredCuisines: [],
            maxCookingTime: '30-45 min',
            currentStreak: 0,
            totalMealsCompleted: 0,
        });

        return {
            success: true,
            user,
        };
    } catch (error: any) {
        console.error('Registration error:', error);
        return {
            success: false,
            error: getFirebaseErrorMessage(error.code),
        };
    }
}

/**
 * USE THIS IN YOUR COMPONENT (not as a standalone function)
 * Hook-based Google OAuth for expo-auth-session v5+
 */

import * as AuthSession from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import React from 'react';
import { getUserProfile, updateLastLogin } from './firestore';

// IMPORTANT: Add this at the top of your component file
WebBrowser.maybeCompleteAuthSession();

/**
 * Custom hook for Google authentication
 * Use this in your login component
 */
export function useGoogleAuth() {
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const redirectUri = AuthSession.makeRedirectUri();
    console.log('🔧 Proxy Redirect URI:', redirectUri);

    // Configure Google auth request
    const [request, response, promptAsync] = Google.useAuthRequest({
        webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
        androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
        iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
        redirectUri,
        scopes: ['openid', 'profile', 'email'],
    });

    // Handle the OAuth response
    React.useEffect(() => {
        if (response?.type === 'success') {
            handleGoogleSignIn(response.params.id_token);
        } else if (response?.type === 'error') {
            setError('Google sign-in failed. Please try again.');
            setIsLoading(false);
        } else if (response?.type === 'cancel') {
            setError('Sign-in cancelled');
            setIsLoading(false);
        }
    }, [response]);

    const handleGoogleSignIn = async (idToken: string) => {
        try {
            console.log('✅ Got ID token, exchanging for Firebase credential...');

            // Create Firebase credential from Google ID token
            const credential = GoogleAuthProvider.credential(idToken);

            // Sign in to Firebase
            const userCredential = await signInWithCredential(auth, credential);
            const user = userCredential.user;

            console.log('✅ Firebase sign-in successful, user ID:', user.uid);

            // Check if user profile exists, create if not
            const existingProfile = await getUserProfile(user.uid);

            if (!existingProfile) {
                console.log('📝 Creating new user profile...');
                await createUserProfile(user.uid, {
                    email: user.email || '',
                    displayName: user.displayName || 'User',
                    createdAt: Timestamp.fromDate(new Date()),
                    lastLoginAt: Timestamp.fromDate(new Date()),
                    dietType: 'None',
                    allergies: [],
                    goal: 'Maintain Weight',
                    targetCalories: 2000,
                    mealsPerDay: 3,
                    preferredCuisines: [],
                    maxCookingTime: '30-45 min',
                    currentStreak: 0,
                    totalMealsCompleted: 0,
                });
            } else {
                console.log('📝 Updating last login...');
                await updateLastLogin(user.uid);
            }

            console.log('🎉 Google sign-in complete!');
            setIsLoading(false);
            setError(null);
        } catch (err: any) {
            console.error('❌ Firebase sign-in error:', err);
            setError(err.message || 'Sign-in failed. Please try again.');
            setIsLoading(false);
        }
    };

    const signInWithGoogle = async () => {
        if (!request) {
            setError('Google sign-in is not ready. Please try again.');
            return;
        }

        setIsLoading(true);
        setError(null);
        console.log('🔐 Starting Google OAuth flow...');

        try {
            await promptAsync();
        } catch (err: any) {
            console.error('❌ Google sign-in error:', err);
            setError(err.message || 'Failed to open sign-in page.');
            setIsLoading(false);
        }
    };

    return {
        signInWithGoogle,
        isLoading,
        error,
        isReady: !!request,
    };
}


/**
 * Login with email and password
 */
export async function loginWithEmail(
    email: string,
    password: string
): Promise<AuthResponse> {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return {
            success: true,
            user: userCredential.user,
        };
    } catch (error: any) {
        console.error('Login error:', error);
        return {
            success: false,
            error: getFirebaseErrorMessage(error.code),
        };
    }
}

/**
 * Logout current user
 */
export async function logout(): Promise<AuthResponse> {
    try {
        await signOut(auth);
        return {
            success: true,
        };
    } catch (error: any) {
        console.error('Logout error:', error);
        return {
            success: false,
            error: 'Failed to logout. Please try again.',
        };
    }
}

/**
 * Send password reset email
 */
export async function resetPassword(email: string): Promise<AuthResponse> {
    try {
        await sendPasswordResetEmail(auth, email);
        return {
            success: true,
        };
    } catch (error: any) {
        console.error('Password reset error:', error);
        return {
            success: false,
            error: getFirebaseErrorMessage(error.code),
        };
    }
}

/**
 * Change password for currently logged-in user
 * Requires re-authentication with current password
 */
export async function changePassword(
    currentPassword: string,
    newPassword: string
): Promise<AuthResponse> {
    try {
        const user = auth.currentUser;

        if (!user || !user.email) {
            return {
                success: false,
                error: 'No user is currently logged in.',
            };
        }

        // Re-authenticate user with current password
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);

        // Update to new password
        await updatePassword(user, newPassword);

        return {
            success: true,
        };
    } catch (error: any) {
        console.error('Change password error:', error);
        return {
            success: false,
            error: getFirebaseErrorMessage(error.code),
        };
    }
}

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate password strength
 * Returns error message if invalid, null if valid
 */
export function validatePassword(password: string): string | null {
    if (password.length < 8) {
        return 'Password must be at least 8 characters long';
    }
    if (!/[A-Z]/.test(password)) {
        return 'Password must contain at least one uppercase letter';
    }
    if (!/[0-9]/.test(password)) {
        return 'Password must contain at least one number';
    }
    return null;
}

/**
 * Check if passwords match
 */
export function passwordsMatch(password: string, confirmPassword: string): boolean {
    return password === confirmPassword;
}
