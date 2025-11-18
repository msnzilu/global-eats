import { View, Text, Button, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/services/firebase/config';

export default function Onboarding() {
    const router = useRouter();
    const { user } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleComplete = async () => {
        if (!user) return;

        setIsSubmitting(true);

        try {
            // Save user profile to Firestore
            await setDoc(doc(db, 'users', user.uid), {
                displayName: user.displayName || 'User',
                email: user.email,
                dietaryPreferences: [], // TODO: collect from form
                allergies: [],
                budget: 0,
                hasCompletedOnboarding: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            });

            // Navigation will happen automatically via useAuth hook
        } catch (error) {
            console.error('Error saving profile:', error);
            alert('Failed to save profile. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <View className="flex-1 p-4 justify-center">
            <Text className="text-2xl font-bold mb-4 text-center">
                Welcome to GlobalEats! 🌍
            </Text>
            <Text className="text-center mb-4">
                Let's set up your profile
            </Text>

            {/* TODO: Add multi-step form for:
                - Dietary preferences (vegetarian, vegan, etc.)
                - Allergies
                - Budget preferences
                - Meal planning goals
            */}

            <Button
                title={isSubmitting ? "Setting up..." : "Get Started"}
                onPress={handleComplete}
                disabled={isSubmitting}
            />

            {isSubmitting && (
                <ActivityIndicator
                    size="large"
                    color="#0000ff"
                    style={{ marginTop: 20 }}
                />
            )}
        </View>
    );
}