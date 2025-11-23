import * as firestore from 'firebase/firestore';
import { createUserProfile, getUserProfile, updateLastLogin, updateOnboardingData, updateUserProfile } from '../firestore';

// Mock Firestore
jest.mock('firebase/firestore');
jest.mock('../config', () => ({
    db: {},
}));

describe('Firestore User Management', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createUserProfile', () => {
        it('should successfully create a user profile', async () => {
            const mockDocRef = {};
            (firestore.doc as jest.Mock).mockReturnValue(mockDocRef);
            (firestore.setDoc as jest.Mock).mockResolvedValue(undefined);

            const userData = {
                email: 'test@example.com',
                displayName: 'Test User',
                createdAt: firestore.Timestamp.fromDate(new Date()),
                lastLoginAt: firestore.Timestamp.fromDate(new Date()),
                dietType: 'None',
                allergies: [],
                goal: 'Maintain Weight',
                targetCalories: 2000,
                mealsPerDay: 3,
                preferredCuisines: [],
                maxCookingTime: '30-45 min',
                currentStreak: 0,
                totalMealsCompleted: 0,
            };

            await createUserProfile('test-uid', userData);

            expect(firestore.doc).toHaveBeenCalled();
            expect(firestore.setDoc).toHaveBeenCalledWith(mockDocRef, userData);
        });

        it('should handle errors when creating profile', async () => {
            (firestore.doc as jest.Mock).mockReturnValue({});
            (firestore.setDoc as jest.Mock).mockRejectedValue(new Error('Firestore error'));

            await expect(
                createUserProfile('test-uid', {
                    email: 'test@example.com',
                    displayName: 'Test User',
                } as any)
            ).rejects.toThrow('Firestore error');
        });
    });

    describe('getUserProfile', () => {
        it('should successfully get a user profile', async () => {
            const mockUserData = {
                email: 'test@example.com',
                displayName: 'Test User',
                dietType: 'Vegetarian',
            };

            const mockDocSnap = {
                exists: () => true,
                data: () => mockUserData,
            };

            (firestore.doc as jest.Mock).mockReturnValue({});
            (firestore.getDoc as jest.Mock).mockResolvedValue(mockDocSnap);

            const result = await getUserProfile('test-uid');

            expect(result).toEqual(mockUserData);
            expect(firestore.getDoc).toHaveBeenCalled();
        });

        it('should return null for non-existent user', async () => {
            const mockDocSnap = {
                exists: () => false,
            };

            (firestore.doc as jest.Mock).mockReturnValue({});
            (firestore.getDoc as jest.Mock).mockResolvedValue(mockDocSnap);

            const result = await getUserProfile('non-existent-uid');

            expect(result).toBeNull();
        });

        it('should handle errors when getting profile', async () => {
            (firestore.doc as jest.Mock).mockReturnValue({});
            (firestore.getDoc as jest.Mock).mockRejectedValue(new Error('Firestore error'));

            await expect(getUserProfile('test-uid')).rejects.toThrow('Firestore error');
        });
    });

    describe('updateUserProfile', () => {
        it('should successfully update user profile', async () => {
            const mockDocRef = {};
            (firestore.doc as jest.Mock).mockReturnValue(mockDocRef);
            (firestore.updateDoc as jest.Mock).mockResolvedValue(undefined);

            const updates = {
                displayName: 'Updated Name',
                dietType: 'Vegan',
            };

            await updateUserProfile('test-uid', updates);

            expect(firestore.updateDoc).toHaveBeenCalledWith(mockDocRef, updates);
        });

        it('should handle errors when updating profile', async () => {
            (firestore.doc as jest.Mock).mockReturnValue({});
            (firestore.updateDoc as jest.Mock).mockRejectedValue(new Error('Update failed'));

            await expect(
                updateUserProfile('test-uid', { displayName: 'New Name' })
            ).rejects.toThrow('Update failed');
        });
    });

    describe('updateOnboardingData', () => {
        it('should successfully update onboarding data', async () => {
            const mockDocRef = {};
            (firestore.doc as jest.Mock).mockReturnValue(mockDocRef);
            (firestore.updateDoc as jest.Mock).mockResolvedValue(undefined);

            const onboardingData = {
                dietType: 'Vegetarian',
                allergies: ['Peanuts'],
                goal: 'Lose Weight',
                targetCalories: 1800,
                mealsPerDay: 3,
                preferredCuisines: ['Italian', 'Asian'],
                maxCookingTime: '30-45 min',
            };

            await updateOnboardingData('test-uid', onboardingData);

            expect(firestore.updateDoc).toHaveBeenCalledWith(mockDocRef, onboardingData);
        });

        it('should handle partial onboarding data', async () => {
            const mockDocRef = {};
            (firestore.doc as jest.Mock).mockReturnValue(mockDocRef);
            (firestore.updateDoc as jest.Mock).mockResolvedValue(undefined);

            const partialData = {
                dietType: 'Vegan',
                goal: 'Gain Muscle',
            };

            await updateOnboardingData('test-uid', partialData as any);

            expect(firestore.updateDoc).toHaveBeenCalledWith(mockDocRef, partialData);
        });
    });

    describe('updateLastLogin', () => {
        it('should successfully update last login timestamp', async () => {
            const mockDocRef = {};
            (firestore.doc as jest.Mock).mockReturnValue(mockDocRef);
            (firestore.updateDoc as jest.Mock).mockResolvedValue(undefined);
            (firestore.Timestamp.fromDate as jest.Mock).mockReturnValue({});

            await updateLastLogin('test-uid');

            expect(firestore.updateDoc).toHaveBeenCalledWith(
                mockDocRef,
                expect.objectContaining({
                    lastLoginAt: expect.anything(),
                })
            );
        });

        it('should handle errors when updating last login', async () => {
            (firestore.doc as jest.Mock).mockReturnValue({});
            (firestore.updateDoc as jest.Mock).mockRejectedValue(new Error('Update failed'));

            await expect(updateLastLogin('test-uid')).rejects.toThrow('Update failed');
        });
    });
});
