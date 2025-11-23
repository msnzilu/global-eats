import { deleteDoc, doc } from 'firebase/firestore';
import { loginWithEmail, logout, registerWithEmail, resetPassword } from '../auth';
import { auth, db } from '../config';
import { getUserProfile, updateLastLogin, updateUserProfile } from '../firestore';

/**
 * INTEGRATION TESTS - These tests connect to actual Firebase services
 * 
 * SETUP REQUIRED:
 * 1. Install Firebase Emulator: npm install -g firebase-tools
 * 2. Initialize emulators: firebase init emulators
 * 3. Start emulators: firebase emulators:start
 * 4. Set environment variables to use emulator
 * 
 * These tests will:
 * - Create real user accounts in Firebase Auth
 * - Store real data in Firestore
 * - Test actual Firebase SDK behavior
 * - Clean up after each test
 */

describe('Authentication Integration Tests', () => {
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'TestPassword123';
    const testName = 'Integration Test User';
    let testUserId: string;

    // Clean up function to delete test users
    const cleanupTestUser = async (uid: string) => {
        try {
            // Delete user from Firestore
            const userDocRef = doc(db, 'users', uid);
            await deleteDoc(userDocRef);

            // Note: Firebase Auth user deletion requires admin SDK
            // In production, you'd use Cloud Functions for this
        } catch (error) {
            console.error('Cleanup error:', error);
        }
    };

    afterEach(async () => {
        if (testUserId) {
            await cleanupTestUser(testUserId);
        }
        // Logout after each test
        await logout();
    });

    describe('User Registration Flow', () => {
        it('should register a new user and create Firestore profile', async () => {
            const result = await registerWithEmail(testEmail, testPassword, testName);

            expect(result.success).toBe(true);
            expect(result.user).toBeDefined();
            expect(result.user?.email).toBe(testEmail);

            testUserId = result.user!.uid;

            // Verify Firestore profile was created
            const profile = await getUserProfile(testUserId);
            expect(profile).toBeDefined();
            expect(profile?.email).toBe(testEmail);
            expect(profile?.displayName).toBe(testName);
            expect(profile?.dietType).toBe('None');
            expect(profile?.currentStreak).toBe(0);
        });

        it('should fail to register with existing email', async () => {
            // First registration
            const firstResult = await registerWithEmail(testEmail, testPassword, testName);
            expect(firstResult.success).toBe(true);
            testUserId = firstResult.user!.uid;

            // Try to register again with same email
            const secondResult = await registerWithEmail(testEmail, testPassword, 'Another User');
            expect(secondResult.success).toBe(false);
            expect(secondResult.error).toContain('already registered');
        });

        it('should fail with weak password', async () => {
            const result = await registerWithEmail(testEmail, 'weak', testName);
            expect(result.success).toBe(false);
            expect(result.error).toBeDefined();
        });
    });

    describe('User Login Flow', () => {
        beforeEach(async () => {
            // Create a test user before login tests
            const result = await registerWithEmail(testEmail, testPassword, testName);
            testUserId = result.user!.uid;
            await logout(); // Logout after registration
        });

        it('should login with correct credentials', async () => {
            const result = await loginWithEmail(testEmail, testPassword);

            expect(result.success).toBe(true);
            expect(result.user).toBeDefined();
            expect(result.user?.email).toBe(testEmail);
        });

        it('should fail login with wrong password', async () => {
            const result = await loginWithEmail(testEmail, 'WrongPassword123');

            expect(result.success).toBe(false);
            expect(result.error).toContain('password');
        });

        it('should fail login with non-existent email', async () => {
            const result = await loginWithEmail('nonexistent@example.com', testPassword);

            expect(result.success).toBe(false);
            expect(result.error).toBeDefined();
        });

        it('should update last login timestamp after login', async () => {
            const loginResult = await loginWithEmail(testEmail, testPassword);
            expect(loginResult.success).toBe(true);

            // Update last login
            await updateLastLogin(testUserId);

            // Verify timestamp was updated
            const profile = await getUserProfile(testUserId);
            expect(profile?.lastLoginAt).toBeDefined();
        });
    });

    describe('Firestore Profile Management', () => {
        beforeEach(async () => {
            const result = await registerWithEmail(testEmail, testPassword, testName);
            testUserId = result.user!.uid;
        });

        it('should retrieve user profile', async () => {
            const profile = await getUserProfile(testUserId);

            expect(profile).toBeDefined();
            expect(profile?.email).toBe(testEmail);
            expect(profile?.displayName).toBe(testName);
        });

        it('should update user profile', async () => {
            const updates = {
                dietType: 'Vegetarian',
                allergies: ['Peanuts', 'Shellfish'],
                goal: 'Lose Weight',
                targetCalories: 1800,
            };

            await updateUserProfile(testUserId, updates);

            // Verify updates
            const profile = await getUserProfile(testUserId);
            expect(profile?.dietType).toBe('Vegetarian');
            expect(profile?.allergies).toEqual(['Peanuts', 'Shellfish']);
            expect(profile?.goal).toBe('Lose Weight');
            expect(profile?.targetCalories).toBe(1800);
        });

        it('should return null for non-existent user', async () => {
            const profile = await getUserProfile('non-existent-uid');
            expect(profile).toBeNull();
        });
    });

    describe('Password Reset Flow', () => {
        beforeEach(async () => {
            const result = await registerWithEmail(testEmail, testPassword, testName);
            testUserId = result.user!.uid;
        });

        it('should send password reset email', async () => {
            const result = await resetPassword(testEmail);
            expect(result.success).toBe(true);
        });

        it('should handle reset for non-existent email', async () => {
            const result = await resetPassword('nonexistent@example.com');
            // Firebase may still return success for security reasons
            expect(result).toBeDefined();
        });
    });

    describe('Complete Authentication Flow', () => {
        it('should complete full registration -> login -> logout flow', async () => {
            // 1. Register
            const registerResult = await registerWithEmail(testEmail, testPassword, testName);
            expect(registerResult.success).toBe(true);
            testUserId = registerResult.user!.uid;

            // Verify user is logged in
            expect(auth.currentUser).toBeDefined();
            expect(auth.currentUser?.email).toBe(testEmail);

            // 2. Logout
            const logoutResult = await logout();
            expect(logoutResult.success).toBe(true);
            expect(auth.currentUser).toBeNull();

            // 3. Login again
            const loginResult = await loginWithEmail(testEmail, testPassword);
            expect(loginResult.success).toBe(true);
            expect(auth.currentUser).toBeDefined();

            // 4. Update profile
            await updateUserProfile(testUserId, {
                dietType: 'Vegan',
                preferredCuisines: ['Italian', 'Asian'],
            });

            // 5. Verify profile updates
            const profile = await getUserProfile(testUserId);
            expect(profile?.dietType).toBe('Vegan');
            expect(profile?.preferredCuisines).toEqual(['Italian', 'Asian']);

            // 6. Final logout
            await logout();
            expect(auth.currentUser).toBeNull();
        });
    });
});
