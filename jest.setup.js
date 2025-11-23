// Jest setup file
import '@testing-library/react-native/extend-expect';

// Mock Firebase modules globally
jest.mock('firebase/app', () => ({
    initializeApp: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
    getAuth: jest.fn(),
    getReactNativePersistence: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    signInWithEmailAndPassword: jest.fn(),
    signOut: jest.fn(),
    sendPasswordResetEmail: jest.fn(),
    updatePassword: jest.fn(),
    EmailAuthProvider: {
        credential: jest.fn(),
    },
    reauthenticateWithCredential: jest.fn(),
    GoogleAuthProvider: jest.fn(),
    signInWithPopup: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
    getFirestore: jest.fn(),
    doc: jest.fn(),
    getDoc: jest.fn(),
    setDoc: jest.fn(),
    updateDoc: jest.fn(),
    collection: jest.fn(),
    Timestamp: {
        fromDate: jest.fn((date) => ({ seconds: date.getTime() / 1000, nanoseconds: 0 })),
        now: jest.fn(() => ({ seconds: Date.now() / 1000, nanoseconds: 0 })),
    },
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
    setItem: jest.fn(),
    getItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
}));

// Suppress console errors during tests
global.console = {
    ...console,
    error: jest.fn(),
    warn: jest.fn(),
};
