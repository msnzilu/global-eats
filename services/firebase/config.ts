import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { initializeApp } from 'firebase/app';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { CACHE_SIZE_UNLIMITED, initializeFirestore } from 'firebase/firestore';

// Try to get config from Constants.expoConfig.extra first, then fall back to process.env
const firebaseConfig = {
    apiKey: Constants.expoConfig?.extra?.EXPO_PUBLIC_FIREBASE_API_KEY || process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: Constants.expoConfig?.extra?.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: Constants.expoConfig?.extra?.EXPO_PUBLIC_FIREBASE_PROJECT_ID || process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: Constants.expoConfig?.extra?.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: Constants.expoConfig?.extra?.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: Constants.expoConfig?.extra?.EXPO_PUBLIC_FIREBASE_APP_ID || process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Debug: Log config to verify it's loaded (remove in production)
console.log('🔥 Firebase Config Check:', {
    apiKey: firebaseConfig.apiKey ? '✅ Loaded' : '❌ Missing',
    authDomain: firebaseConfig.authDomain ? '✅ Loaded' : '❌ Missing',
    projectId: firebaseConfig.projectId ? '✅ Loaded' : '❌ Missing',
    storageBucket: firebaseConfig.storageBucket ? '✅ Loaded' : '❌ Missing',
    messagingSenderId: firebaseConfig.messagingSenderId ? '✅ Loaded' : '❌ Missing',
    appId: firebaseConfig.appId ? '✅ Loaded' : '❌ Missing',
});

// Validate that all required fields are present
if (!firebaseConfig.apiKey || !firebaseConfig.projectId || !firebaseConfig.appId) {
    console.error('❌ Firebase configuration is incomplete!');
    console.error('Please check your .env file and restart the dev server with: pnpm start --clear');
}

const app = initializeApp(firebaseConfig);

// RN-specific auth init with persistence
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// CRITICAL FIX: Initialize Firestore with React Native specific settings
// This fixes the "client is offline" error
export const db = initializeFirestore(app, {
    experimentalForceLongPolling: true, // Required for React Native
    cacheSizeBytes: CACHE_SIZE_UNLIMITED,
});

console.log('✅ Firebase and Firestore initialized successfully');

export default app;