# Firebase Emulator Configuration

# Install Firebase CLI globally
pnpm add -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init

# Select:
# - Emulators
# - Authentication Emulator
# - Firestore Emulator

# Configuration will be saved to firebase.json

# Start emulators
pnpm emulator

# Or manually
firebase emulators:start
