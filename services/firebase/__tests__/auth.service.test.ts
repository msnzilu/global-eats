import * as firebaseAuth from 'firebase/auth';
import { changePassword, loginWithEmail, logout, registerWithEmail, resetPassword, signInWithGoogle } from '../auth';
import { createUserProfile, getUserProfile, updateLastLogin } from '../firestore';

// Mock Firebase modules
jest.mock('firebase/auth');
jest.mock('firebase/firestore');
jest.mock('../config', () => ({
    auth: {},
}));
jest.mock('../firestore');

describe('Authentication Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('registerWithEmail', () => {
        it('should successfully register a new user', async () => {
            const mockUser = {
                uid: 'test-uid',
                email: 'test@example.com',
            };

            (firebaseAuth.createUserWithEmailAndPassword as jest.Mock).mockResolvedValue({
                user: mockUser,
            });

            (createUserProfile as jest.Mock).mockResolvedValue(undefined);

            const result = await registerWithEmail('test@example.com', 'Password123', 'Test User');

            expect(result.success).toBe(true);
            expect(result.user).toEqual(mockUser);
            expect(firebaseAuth.createUserWithEmailAndPassword).toHaveBeenCalled();
            expect(createUserProfile).toHaveBeenCalledWith(
                'test-uid',
                expect.objectContaining({
                    email: 'test@example.com',
                    displayName: 'Test User',
                })
            );
        });

        it('should handle email-already-in-use error', async () => {
            (firebaseAuth.createUserWithEmailAndPassword as jest.Mock).mockRejectedValue({
                code: 'auth/email-already-in-use',
            });

            const result = await registerWithEmail('test@example.com', 'Password123', 'Test User');

            expect(result.success).toBe(false);
            expect(result.error).toBe('This email is already registered. Please login instead.');
        });

        it('should handle weak-password error', async () => {
            (firebaseAuth.createUserWithEmailAndPassword as jest.Mock).mockRejectedValue({
                code: 'auth/weak-password',
            });

            const result = await registerWithEmail('test@example.com', 'weak', 'Test User');

            expect(result.success).toBe(false);
            expect(result.error).toBe('Password is too weak. Please use at least 6 characters.');
        });

        it('should handle network errors', async () => {
            (firebaseAuth.createUserWithEmailAndPassword as jest.Mock).mockRejectedValue({
                code: 'auth/network-request-failed',
            });

            const result = await registerWithEmail('test@example.com', 'Password123', 'Test User');

            expect(result.success).toBe(false);
            expect(result.error).toBe('Network error. Please check your connection.');
        });
    });

    describe('loginWithEmail', () => {
        it('should successfully login a user', async () => {
            const mockUser = {
                uid: 'test-uid',
                email: 'test@example.com',
            };

            (firebaseAuth.signInWithEmailAndPassword as jest.Mock).mockResolvedValue({
                user: mockUser,
            });

            const result = await loginWithEmail('test@example.com', 'Password123');

            expect(result.success).toBe(true);
            expect(result.user).toEqual(mockUser);
            expect(firebaseAuth.signInWithEmailAndPassword).toHaveBeenCalled();
        });

        it('should handle user-not-found error', async () => {
            (firebaseAuth.signInWithEmailAndPassword as jest.Mock).mockRejectedValue({
                code: 'auth/user-not-found',
            });

            const result = await loginWithEmail('test@example.com', 'Password123');

            expect(result.success).toBe(false);
            expect(result.error).toBe('No account found with this email. Please sign up.');
        });

        it('should handle wrong-password error', async () => {
            (firebaseAuth.signInWithEmailAndPassword as jest.Mock).mockRejectedValue({
                code: 'auth/wrong-password',
            });

            const result = await loginWithEmail('test@example.com', 'WrongPassword');

            expect(result.success).toBe(false);
            expect(result.error).toBe('Incorrect password. Please try again.');
        });

        it('should handle invalid-credential error', async () => {
            (firebaseAuth.signInWithEmailAndPassword as jest.Mock).mockRejectedValue({
                code: 'auth/invalid-credential',
            });

            const result = await loginWithEmail('test@example.com', 'Password123');

            expect(result.success).toBe(false);
            expect(result.error).toBe('Invalid email or password. Please try again.');
        });

        it('should handle too-many-requests error', async () => {
            (firebaseAuth.signInWithEmailAndPassword as jest.Mock).mockRejectedValue({
                code: 'auth/too-many-requests',
            });

            const result = await loginWithEmail('test@example.com', 'Password123');

            expect(result.success).toBe(false);
            expect(result.error).toBe('Too many failed attempts. Please try again later.');
        });
    });

    describe('logout', () => {
        it('should successfully logout a user', async () => {
            (firebaseAuth.signOut as jest.Mock).mockResolvedValue(undefined);

            const result = await logout();

            expect(result.success).toBe(true);
            expect(firebaseAuth.signOut).toHaveBeenCalled();
        });

        it('should handle logout errors', async () => {
            (firebaseAuth.signOut as jest.Mock).mockRejectedValue(new Error('Logout failed'));

            const result = await logout();

            expect(result.success).toBe(false);
            expect(result.error).toBe('Failed to logout. Please try again.');
        });
    });

    describe('resetPassword', () => {
        it('should successfully send password reset email', async () => {
            (firebaseAuth.sendPasswordResetEmail as jest.Mock).mockResolvedValue(undefined);

            const result = await resetPassword('test@example.com');

            expect(result.success).toBe(true);
            expect(firebaseAuth.sendPasswordResetEmail).toHaveBeenCalled();
        });

        it('should handle user-not-found error', async () => {
            (firebaseAuth.sendPasswordResetEmail as jest.Mock).mockRejectedValue({
                code: 'auth/user-not-found',
            });

            const result = await resetPassword('test@example.com');

            expect(result.success).toBe(false);
            expect(result.error).toBe('No account found with this email. Please sign up.');
        });

        it('should handle invalid-email error', async () => {
            (firebaseAuth.sendPasswordResetEmail as jest.Mock).mockRejectedValue({
                code: 'auth/invalid-email',
            });

            const result = await resetPassword('invalid-email');

            expect(result.success).toBe(false);
            expect(result.error).toBe('Please enter a valid email address.');
        });
    });

    describe('changePassword', () => {
        it('should successfully change password', async () => {
            const mockUser = {
                uid: 'test-uid',
                email: 'test@example.com',
            };

            const mockAuth = {
                currentUser: mockUser,
            };

            jest.spyOn(require('../config'), 'auth', 'get').mockReturnValue(mockAuth);

            (firebaseAuth.EmailAuthProvider.credential as jest.Mock).mockReturnValue({});
            (firebaseAuth.reauthenticateWithCredential as jest.Mock).mockResolvedValue(undefined);
            (firebaseAuth.updatePassword as jest.Mock).mockResolvedValue(undefined);

            const result = await changePassword('OldPassword123', 'NewPassword123');

            expect(result.success).toBe(true);
            expect(firebaseAuth.reauthenticateWithCredential).toHaveBeenCalled();
            expect(firebaseAuth.updatePassword).toHaveBeenCalled();
        });

        it('should handle no logged-in user', async () => {
            const mockAuth = {
                currentUser: null,
            };

            jest.spyOn(require('../config'), 'auth', 'get').mockReturnValue(mockAuth);

            const result = await changePassword('OldPassword123', 'NewPassword123');

            expect(result.success).toBe(false);
            expect(result.error).toBe('No user is currently logged in.');
        });

        it('should handle wrong current password', async () => {
            const mockUser = {
                uid: 'test-uid',
                email: 'test@example.com',
            };

            const mockAuth = {
                currentUser: mockUser,
            };

            jest.spyOn(require('../config'), 'auth', 'get').mockReturnValue(mockAuth);

            (firebaseAuth.EmailAuthProvider.credential as jest.Mock).mockReturnValue({});
            (firebaseAuth.reauthenticateWithCredential as jest.Mock).mockRejectedValue({
                code: 'auth/wrong-password',
            });

            const result = await changePassword('WrongPassword', 'NewPassword123');

            expect(result.success).toBe(false);
            expect(result.error).toBe('Incorrect password. Please try again.');
        });
    });

    describe('signInWithGoogle', () => {
        it('should successfully sign in with Google for new user', async () => {
            const mockUser = {
                uid: 'google-uid',
                email: 'test@gmail.com',
                displayName: 'Test User',
            };

            (firebaseAuth.GoogleAuthProvider as jest.Mock).mockImplementation(() => ({}));
            (firebaseAuth.signInWithPopup as jest.Mock).mockResolvedValue({
                user: mockUser,
            });
            (getUserProfile as jest.Mock).mockResolvedValue(null);
            (createUserProfile as jest.Mock).mockResolvedValue(undefined);

            const result = await signInWithGoogle();

            expect(result.success).toBe(true);
            expect(result.user).toEqual(mockUser);
            expect(createUserProfile).toHaveBeenCalledWith(
                'google-uid',
                expect.objectContaining({
                    email: 'test@gmail.com',
                    displayName: 'Test User',
                })
            );
        });

        it('should successfully sign in with Google for existing user', async () => {
            const mockUser = {
                uid: 'google-uid',
                email: 'test@gmail.com',
                displayName: 'Test User',
            };

            const existingProfile = {
                email: 'test@gmail.com',
                displayName: 'Test User',
            };

            (firebaseAuth.GoogleAuthProvider as jest.Mock).mockImplementation(() => ({}));
            (firebaseAuth.signInWithPopup as jest.Mock).mockResolvedValue({
                user: mockUser,
            });
            (getUserProfile as jest.Mock).mockResolvedValue(existingProfile);
            (updateLastLogin as jest.Mock).mockResolvedValue(undefined);

            const result = await signInWithGoogle();

            expect(result.success).toBe(true);
            expect(result.user).toEqual(mockUser);
            expect(updateLastLogin).toHaveBeenCalledWith('google-uid');
            expect(createUserProfile).not.toHaveBeenCalled();
        });

        it('should handle popup closed by user', async () => {
            (firebaseAuth.GoogleAuthProvider as jest.Mock).mockImplementation(() => ({}));
            (firebaseAuth.signInWithPopup as jest.Mock).mockRejectedValue({
                code: 'auth/popup-closed-by-user',
            });

            const result = await signInWithGoogle();

            expect(result.success).toBe(false);
            expect(result.error).toBe('Sign-in cancelled');
        });

        it('should handle cancelled popup request', async () => {
            (firebaseAuth.GoogleAuthProvider as jest.Mock).mockImplementation(() => ({}));
            (firebaseAuth.signInWithPopup as jest.Mock).mockRejectedValue({
                code: 'auth/cancelled-popup-request',
            });

            const result = await signInWithGoogle();

            expect(result.success).toBe(false);
            expect(result.error).toBe('Sign-in cancelled');
        });
    });
});
