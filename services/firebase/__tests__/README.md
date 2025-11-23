# Authentication Test Suite

This directory contains comprehensive tests for the Firebase authentication system.

## Test Files

### Unit Tests (Mocked - Fast)

#### `auth.validation.test.ts`
Tests for validation helper functions (no Firebase connection needed):
- `isValidEmail()` - Email format validation
- `validatePassword()` - Password strength validation
- `passwordsMatch()` - Password confirmation matching
- `getFirebaseErrorMessage()` - Error code to message mapping

#### `auth.service.test.ts`
Tests for authentication service functions using mocks:
- `registerWithEmail()` - User registration
- `loginWithEmail()` - User login
- `logout()` - User logout
- `resetPassword()` - Password reset email
- `changePassword()` - Password change for logged-in users
- `signInWithGoogle()` - Google OAuth authentication

#### `firestore.test.ts`
Tests for Firestore user management using mocks:
- `createUserProfile()` - Create new user profile
- `getUserProfile()` - Retrieve user profile
- `updateUserProfile()` - Update user data
- `updateOnboardingData()` - Save onboarding preferences
- `updateLastLogin()` - Update login timestamp

### Integration Tests (Real Firebase - Comprehensive)

#### `auth.integration.test.ts`
**Tests against real Firebase services** (requires Firebase Emulator):
- Complete registration flow with Firestore profile creation
- Login with correct/incorrect credentials
- Profile retrieval and updates
- Password reset functionality
- Full end-to-end authentication flows
- Data persistence verification

## Running Tests

### Unit Tests (Fast - No Setup Required)
```bash
# Run all unit tests
pnpm test

# Run specific test file
pnpm test auth.validation.test.ts

# Watch mode
pnpm test -- --watch

# With coverage
pnpm test -- --coverage
```

### Integration Tests (Requires Firebase Emulator)

**1. Setup Firebase Emulator (One-time)**
```bash
# Install Firebase CLI
pnpm add -g firebase-tools

# Start emulators
pnpm emulator
```

**2. Run Integration Tests**
```bash
# In a new terminal (while emulators are running)
pnpm test:integration

# Or run all tests including integration
pnpm test:all
```

The emulator UI will be available at `http://localhost:4000` where you can:
- View created users
- Inspect Firestore data
- Clear data between test runs

## Test Strategy

### Unit Tests (Mocked)
- ✅ **Fast** - Run in milliseconds
- ✅ **Isolated** - No external dependencies
- ✅ **Reliable** - No network issues
- ✅ **CI/CD friendly** - Run anywhere
- ❌ Don't test actual Firebase behavior

### Integration Tests (Real Firebase)
- ✅ **Comprehensive** - Test actual Firebase SDK
- ✅ **Real behavior** - Catch Firebase-specific issues
- ✅ **Data persistence** - Verify Firestore writes
- ✅ **End-to-end** - Test complete flows
- ❌ Slower - Require emulator setup
- ❌ Require cleanup - Must delete test data

## Best Practice

**Development workflow:**
1. Write unit tests first (fast feedback loop)
2. Run integration tests before commits (verify real behavior)
3. Run both in CI/CD pipeline

**When to use each:**
- **Unit tests**: Quick validation during development
- **Integration tests**: Before merging, deploying, or when debugging Firebase-specific issues

## Test Coverage

### Unit Tests Cover:
- ✅ All validation functions
- ✅ All authentication methods
- ✅ All Firestore operations
- ✅ Success scenarios
- ✅ Error scenarios
- ✅ Edge cases

### Integration Tests Cover:
- ✅ Real Firebase Auth user creation
- ✅ Real Firestore data persistence
- ✅ Actual error responses from Firebase
- ✅ Complete authentication flows
- ✅ Profile management workflows

## Firebase Emulator Ports

- **Auth Emulator**: http://localhost:9099
- **Firestore Emulator**: http://localhost:8080
- **Emulator UI**: http://localhost:4000

## Troubleshooting

**Emulator not starting?**
```bash
# Kill existing processes
firebase emulators:kill

# Restart
firebase emulators:start
```

**Tests failing with connection errors?**
- Ensure emulators are running
- Check ports are not in use
- Verify firebase.json configuration

**Test data not cleaning up?**
- Use Emulator UI to manually clear data
- Restart emulators for fresh state
