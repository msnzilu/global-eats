# Firebase Authentication Setup Required

## Problem
✅ Your environment variables are loading correctly  
❌ But Firebase Authentication is not configured in your Firebase Console

## Solution: Enable Authentication in Firebase Console

### Step 1: Go to Firebase Console
1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **globaleats-d696d**

### Step 2: Enable Authentication
1. In the left sidebar, click **"Build"** → **"Authentication"**
2. Click **"Get Started"** button
3. This will initialize Authentication for your project

### Step 3: Enable Sign-in Methods
You need to enable the authentication methods you're using:

#### Enable Email/Password:
1. Go to **"Sign-in method"** tab
2. Click on **"Email/Password"**
3. Toggle **"Enable"** switch
4. Click **"Save"**

#### Enable Google Sign-in:
1. In the same **"Sign-in method"** tab
2. Click on **"Google"**
3. Toggle **"Enable"** switch
4. Enter a **Project support email** (your email)
5. Click **"Save"**

### Step 4: Verify Setup
After enabling authentication:
1. Restart your app (reload in Expo)
2. Try signing up with email/password
3. The error should be gone! ✅

## Quick Checklist
- [ ] Open Firebase Console
- [ ] Navigate to Authentication
- [ ] Click "Get Started" if you haven't already
- [ ] Enable "Email/Password" sign-in method
- [ ] Enable "Google" sign-in method
- [ ] Reload your app

## Still Having Issues?

### Check API Key Restrictions
1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll to **"Web API Key"**
3. Click on the API key link (opens Google Cloud Console)
4. Make sure there are **no restrictions** on the API key, or
5. If restricted, ensure **"Identity Toolkit API"** is allowed

---

**Note**: This is a one-time setup. Once Authentication is enabled in Firebase Console, you won't see this error again.
