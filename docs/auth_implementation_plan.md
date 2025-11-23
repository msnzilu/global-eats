# Implementation Plan: Firebase Authentication Backend

## Goal
Implement complete Firebase authentication system with login, register, logout, password reset, and password change functionality, integrated with Firestore user profile management.

## User Review Required

> [!IMPORTANT]
> **Authentication Flow**: After successful registration, users will be redirected to the onboarding screen to complete their profile setup. The user profile in Firestore will be created with minimal data initially, then completed during onboarding.

> [!WARNING]
> **Password Requirements**: Firebase requires passwords to be at least 6 characters. We'll add client-side validation for stronger passwords (min 8 characters recommended).

---

## Proposed Changes

### Firebase Services

#### [NEW] [services/firebase/auth.ts](file:///G:/Desktop/Apps/GlobalEats/services/firebase/auth.ts)

Create comprehensive authentication service with:
- `registerWithEmail(email, password, displayName)` - Register new user and create Firestore profile
- `loginWithEmail(email, password)` - Sign in existing user
- `logout()` - Sign out current user
- `resetPassword(email)` - Send password reset email
- `changePassword(currentPassword, newPassword)` - Change password for logged-in user
- `getFirebaseErrorMessage(errorCode)` - Convert Firebase error codes to user-friendly messages
- Error handling with typed responses

#### [NEW] [services/firebase/firestore.ts](file:///G:/Desktop/Apps/GlobalEats/services/firebase/firestore.ts)

Create Firestore user management service with:
- `createUserProfile(userId, data)` - Create initial user profile
- `getUserProfile(userId)` - Fetch user profile
- `updateUserProfile(userId, data)` - Update user profile
- `updateOnboardingData(userId, onboardingData)` - Save onboarding preferences
- TypeScript interfaces matching database schema

---

### Type Definitions

#### [MODIFY] [types/index.ts](file:///G:/Desktop/Apps/GlobalEats/types/index.ts)

Add authentication-specific types:
- `AuthResponse` - Success/error response type
- `AuthError` - Error details type
- Update `User` interface to match Firestore schema from database_schema.md

---

### UI Integration

#### [MODIFY] [app/login.tsx](file:///G:/Desktop/Apps/GlobalEats/app/login.tsx)

- Import and use `loginWithEmail` from auth service
- Add loading state during authentication
- Display error messages to user
- Handle successful login (redirect to planner or onboarding based on profile status)
- Add email/password validation

#### [MODIFY] [app/signup.tsx](file:///G:/Desktop/Apps/GlobalEats/app/signup.tsx)

- Import and use `registerWithEmail` from auth service
- Add password matching validation
- Add password strength validation (min 8 chars, uppercase, number)
- Add loading state during registration
- Display error messages to user
- Redirect to onboarding after successful registration

#### [MODIFY] [app/forgot-password.tsx](file:///G:/Desktop/Apps/GlobalEats/app/forgot-password.tsx)

- Import and use `resetPassword` from auth service
- Add success message after email sent
- Add error handling
- Add email validation

---

### Profile Management

#### [NEW] [app/profile/change-password.tsx](file:///G:/Desktop/Apps/GlobalEats/app/profile/change-password.tsx)

Create password change screen with:
- Current password field
- New password field
- Confirm new password field
- Password strength indicator
- Use `changePassword` from auth service
- Success/error feedback

---

### Redux Integration

#### [MODIFY] [store/slices/userSlice.ts](file:///G:/Desktop/Apps/GlobalEats/store/slices/userSlice.ts)

- Update to use proper `User` type from types/index.ts
- Add `setUserProfile` action for Firestore profile data
- Keep in sync with `useAuth` hook

---

## Verification Plan

### Manual Testing

1. **Registration Flow**
   - Open app and navigate to signup screen
   - Enter valid email, name, and matching passwords
   - Verify successful registration and redirect to onboarding
   - Check Firebase Console → Authentication to confirm user created
   - Check Firestore → users collection to confirm profile created

2. **Login Flow**
   - Logout if logged in
   - Navigate to login screen
   - Enter registered email and password
   - Verify successful login and redirect to planner
   - Verify error message for wrong password
   - Verify error message for non-existent email

3. **Password Reset Flow**
   - Navigate to forgot password screen
   - Enter registered email
   - Verify success message displayed
   - Check email inbox for password reset link
   - Click link and reset password
   - Login with new password

4. **Password Change Flow**
   - Login to app
   - Navigate to Profile → Change Password
   - Enter current password and new password
   - Verify success message
   - Logout and login with new password

5. **Error Handling**
   - Test with invalid email format
   - Test with password < 6 characters
   - Test with non-matching passwords in signup
   - Test with wrong current password in change password
   - Verify all error messages are user-friendly

### Firebase Console Verification

- Verify users appear in Authentication tab
- Verify user profiles created in Firestore users collection
- Verify profile data structure matches database schema

---

## Security Considerations

- Passwords are never stored in plain text (handled by Firebase Auth)
- Email verification can be added later if needed
- Firestore security rules already defined in database_schema.md
- All auth operations use Firebase SDK (secure by default)

---

## Notes

- Google OAuth integration marked as TODO for future implementation
- Email verification not implemented initially (can add later)
- Profile completion happens in onboarding flow (separate from auth)
- useAuth hook already exists and handles auth state + Firestore profile sync
