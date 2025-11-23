# Testing Guide for GlobalEats Authentication

This guide explains how to run tests for the authentication system using **pnpm**.

## Quick Start

```bash
# Install dependencies
pnpm install

# Install testing dependencies
pnpm add -D @testing-library/react-native @testing-library/jest-native @types/jest jest jest-expo

# Run unit tests (fast, no setup needed)
pnpm test:unit

# Run integration tests (requires Firebase Emulator)
pnpm emulator          # Terminal 1: Start emulators
pnpm test:integration  # Terminal 2: Run integration tests
```

## Test Types

### 1. Unit Tests (Mocked - Fast)
- **No Firebase connection needed**
- Test validation logic and error handling
- Run in milliseconds

```bash
pnpm test:unit
```

### 2. Integration Tests (Real Firebase)
- **Requires Firebase Emulator**
- Tests actual Firebase Auth and Firestore
- Verifies data persistence

```bash
# Start emulators first
pnpm emulator

# Then run integration tests
pnpm test:integration
```

## Available Scripts

```bash
pnpm test              # Run all tests
pnpm test:unit         # Run only unit tests (fast)
pnpm test:integration  # Run only integration tests
pnpm test:watch        # Run tests in watch mode
pnpm test:coverage     # Run tests with coverage report
pnpm test:all          # Run all tests with emulator auto-start
pnpm emulator          # Start Firebase emulators
```

## Firebase Emulator Setup

### One-Time Setup

```bash
# 1. Install Firebase CLI globally
pnpm add -g firebase-tools

# 2. Login to Firebase
firebase login

# 3. Initialize emulators (if not already done)
firebase init emulators
# Select: Authentication Emulator, Firestore Emulator
```

### Running Emulators

```bash
# Start emulators
pnpm emulator

# Emulator UI will be available at:
# http://localhost:4000
```

### Emulator Ports
- **Auth Emulator**: http://localhost:9099
- **Firestore Emulator**: http://localhost:8080
- **Emulator UI**: http://localhost:4000

## Test Files Location

```
services/firebase/__tests__/
├── auth.validation.test.ts    # Validation helpers (unit)
├── auth.service.test.ts       # Auth service (unit)
├── firestore.test.ts          # Firestore operations (unit)
├── auth.integration.test.ts   # Integration tests (real Firebase)
└── README.md                  # Detailed test documentation
```

## Troubleshooting

### Tests failing with "Cannot find name 'describe'"
```bash
# Install Jest types
pnpm add -D @types/jest
```

### Emulator connection errors
```bash
# Make sure emulators are running
pnpm emulator

# Check if ports are available
# Kill any processes using ports 9099, 8080, or 4000
```

### Clear emulator data
```bash
# Stop emulators
# Restart them for fresh state
pnpm emulator
```

## CI/CD Integration

For continuous integration, use:

```bash
# Run all tests with auto-managed emulator
pnpm test:all
```

This will:
1. Start Firebase emulators
2. Run all tests
3. Automatically stop emulators when done

## Best Practices

1. **Development**: Use `pnpm test:unit` for fast feedback
2. **Before Commit**: Run `pnpm test:integration` to verify Firebase behavior
3. **CI/CD**: Use `pnpm test:all` for complete test suite
4. **Debugging**: Use `pnpm test:watch` for interactive development

## Coverage Reports

```bash
# Generate coverage report
pnpm test:coverage

# Coverage thresholds (configured in jest.config.json):
# - Branches: 70%
# - Functions: 70%
# - Lines: 70%
# - Statements: 70%
```

## Need Help?

- Check `services/firebase/__tests__/README.md` for detailed test documentation
- View test files for examples
- Check Emulator UI at http://localhost:4000 to inspect test data
