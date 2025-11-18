import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/services/firebase/config';

export interface UserProfile {
    displayName?: string;
    email?: string;
    dietaryPreferences?: string[];
    allergies?: string[];
    budget?: number;
    hasCompletedOnboarding?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface AuthState {
    user: User | null;
    profile: UserProfile | null;
    isLoading: boolean;
}

export function useAuth(): AuthState {
    const [state, setState] = useState<AuthState>({
        user: null,
        profile: null,
        isLoading: true
    });

    useEffect(() => {
        // Listen to auth state changes
        const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // User is logged in, fetch their profile
                const userDocRef = doc(db, 'users', user.uid);

                // Listen to profile changes in real-time
                const unsubscribeProfile = onSnapshot(
                    userDocRef,
                    (docSnap) => {
                        if (docSnap.exists()) {
                            const profileData = docSnap.data() as UserProfile;
                            setState({
                                user,
                                profile: profileData,
                                isLoading: false
                            });
                        } else {
                            // User exists but no profile yet (first login)
                            setState({
                                user,
                                profile: null,
                                isLoading: false
                            });
                        }
                    },
                    (error) => {
                        console.error('Error fetching profile:', error);
                        setState({
                            user,
                            profile: null,
                            isLoading: false
                        });
                    }
                );

                // Clean up profile listener when auth changes
                return () => unsubscribeProfile();
            } else {
                // User is logged out
                setState({
                    user: null,
                    profile: null,
                    isLoading: false
                });
            }
        });

        return () => unsubscribeAuth();
    }, []);

    return state;
}