# Quick Fix Guide

## Issues Found & Solutions

### 1. ✅ Jest Configuration Fixed
- **Problem**: Configuration was in `jest.config.json` (wrong format)
- **Solution**: Created `jest.config.js` with proper module.exports
- **Fixed**: LocalStorage errors and validation warnings

### 2. ⚠️ Firebase CLI Not Installed
- **Problem**: `firebase` command not recognized
- **Solution**: Install using npm (pnpm global install has issues on Windows)

```powershell
# Use npm for global Firebase CLI (recommended)
npm install -g firebase-tools

# Or add to PATH manually after pnpm setup
pnpm setup
pnpm add -g firebase-tools
```

### 3. ✅ Deprecated Package Removed
- **Problem**: `@testing-library/jest-native` is deprecated
- **Solution**: Using built-in matchers from `@testing-library/react-native`

### 4. ⚠️ Peer Dependency Warnings
These are warnings, not errors. The app will still work:
- Jest version mismatch (using 30.2.0 vs expected 27-29)
- AsyncStorage version (using 2.2.0 vs expected 1.18.1)

## How to Run Tests Now

### Option 1: Unit Tests Only (No Firebase needed)
```powershell
pnpm test:unit
```

### Option 2: With Firebase Emulator
```powershell
# First, install Firebase CLI with npm
npm install -g firebase-tools

# Initialize Firebase (one-time)
firebase login
firebase init emulators
# Select: Authentication & Firestore

# Start emulators
firebase emulators:start

# In another terminal, run tests
pnpm test:integration
```

### Option 3: Skip Integration Tests for Now
Just use unit tests to verify the authentication logic works:
```powershell
pnpm test:unit
```

## Next Steps

1. **Install Firebase CLI**:
   ```powershell
   npm install -g firebase-tools
   ```

2. **Run unit tests** (should work now):
   ```powershell
   pnpm test:unit
   ```

3. **Optional**: Set up Firebase Emulator for integration tests later

## Why Use npm for Firebase CLI?

pnpm's global install on Windows requires additional setup (`pnpm setup`). Using npm for global tools like Firebase CLI is simpler and more reliable on Windows.
