import { getFirebaseErrorMessage, isValidEmail, passwordsMatch, validatePassword } from '../auth';

describe('Authentication Validation Helpers', () => {
    describe('isValidEmail', () => {
        it('should return true for valid email addresses', () => {
            expect(isValidEmail('test@example.com')).toBe(true);
            expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
            expect(isValidEmail('user+tag@example.com')).toBe(true);
        });

        it('should return false for invalid email addresses', () => {
            expect(isValidEmail('')).toBe(false);
            expect(isValidEmail('invalid')).toBe(false);
            expect(isValidEmail('invalid@')).toBe(false);
            expect(isValidEmail('@example.com')).toBe(false);
            expect(isValidEmail('invalid@.com')).toBe(false);
            expect(isValidEmail('invalid@domain')).toBe(false);
        });
    });

    describe('validatePassword', () => {
        it('should return null for valid passwords', () => {
            expect(validatePassword('Password123')).toBeNull();
            expect(validatePassword('MySecure1Pass')).toBeNull();
            expect(validatePassword('Test1234')).toBeNull();
        });

        it('should return error for passwords less than 8 characters', () => {
            expect(validatePassword('Pass1')).toBe('Password must be at least 8 characters long');
            expect(validatePassword('Test12')).toBe('Password must be at least 8 characters long');
        });

        it('should return error for passwords without uppercase letters', () => {
            expect(validatePassword('password123')).toBe('Password must contain at least one uppercase letter');
            expect(validatePassword('test1234')).toBe('Password must contain at least one uppercase letter');
        });

        it('should return error for passwords without numbers', () => {
            expect(validatePassword('Password')).toBe('Password must contain at least one number');
            expect(validatePassword('TestPassword')).toBe('Password must contain at least one number');
        });

        it('should validate multiple requirements', () => {
            expect(validatePassword('pass')).toBe('Password must be at least 8 characters long');
            expect(validatePassword('password')).toBe('Password must be at least 8 characters long');
            expect(validatePassword('PASSWORD')).toBe('Password must be at least 8 characters long');
        });
    });

    describe('passwordsMatch', () => {
        it('should return true when passwords match', () => {
            expect(passwordsMatch('password', 'password')).toBe(true);
            expect(passwordsMatch('Test123', 'Test123')).toBe(true);
            expect(passwordsMatch('', '')).toBe(true);
        });

        it('should return false when passwords do not match', () => {
            expect(passwordsMatch('password', 'Password')).toBe(false);
            expect(passwordsMatch('Test123', 'Test124')).toBe(false);
            expect(passwordsMatch('password', '')).toBe(false);
        });
    });

    describe('getFirebaseErrorMessage', () => {
        it('should return correct message for known error codes', () => {
            expect(getFirebaseErrorMessage('auth/email-already-in-use'))
                .toBe('This email is already registered. Please login instead.');

            expect(getFirebaseErrorMessage('auth/invalid-email'))
                .toBe('Please enter a valid email address.');

            expect(getFirebaseErrorMessage('auth/weak-password'))
                .toBe('Password is too weak. Please use at least 6 characters.');

            expect(getFirebaseErrorMessage('auth/user-not-found'))
                .toBe('No account found with this email. Please sign up.');

            expect(getFirebaseErrorMessage('auth/wrong-password'))
                .toBe('Incorrect password. Please try again.');

            expect(getFirebaseErrorMessage('auth/invalid-credential'))
                .toBe('Invalid email or password. Please try again.');

            expect(getFirebaseErrorMessage('auth/too-many-requests'))
                .toBe('Too many failed attempts. Please try again later.');

            expect(getFirebaseErrorMessage('auth/network-request-failed'))
                .toBe('Network error. Please check your connection.');
        });

        it('should return default message for unknown error codes', () => {
            expect(getFirebaseErrorMessage('auth/unknown-error'))
                .toBe('An unexpected error occurred. Please try again.');

            expect(getFirebaseErrorMessage('some-random-error'))
                .toBe('An unexpected error occurred. Please try again.');
        });

        it('should handle password reset error codes', () => {
            expect(getFirebaseErrorMessage('auth/expired-action-code'))
                .toBe('This password reset link has expired. Please request a new one.');

            expect(getFirebaseErrorMessage('auth/invalid-action-code'))
                .toBe('This password reset link is invalid. Please request a new one.');
        });

        it('should handle Google OAuth error codes', () => {
            expect(getFirebaseErrorMessage('auth/popup-closed-by-user'))
                .toBe('Sign-in cancelled');

            expect(getFirebaseErrorMessage('auth/cancelled-popup-request'))
                .toBe('Sign-in cancelled');
        });
    });
});
