module.exports = {
    expo: {
        name: "GlobalEats",
        slug: "GlobalEats",
        version: "1.0.0",
        orientation: "portrait",
        icon: "./assets/images/icon.png",
        scheme: "globaleats",
        userInterfaceStyle: "automatic",
        newArchEnabled: true,
        ios: {
            supportsTablet: true,
            bundleIdentifier: "com.globaleats.app"
        },
        android: {
            adaptiveIcon: {
                backgroundColor: "#E6F4FE",
                foregroundImage: "./assets/images/android-icon-foreground.png",
                backgroundImage: "./assets/images/android-icon-background.png",
                monochromeImage: "./assets/images/android-icon-monochrome.png"
            },
            edgeToEdgeEnabled: true,
            predictiveBackGestureEnabled: false,
            package: "com.globaleats.app"
        },
        web: {
            output: "static",
            favicon: "./assets/images/favicon.png"
        },
        plugins: [
            "expo-router",
            [
                "expo-splash-screen",
                {
                    image: "./assets/images/splash-icon.png",
                    imageWidth: 200,
                    resizeMode: "contain",
                    backgroundColor: "#ffffff",
                    dark: {
                        backgroundColor: "#000000"
                    }
                }
            ]
        ],
        experiments: {
            typedRoutes: true,
            reactCompiler: true
        },
        runtimeVersion: {
            policy: "sdkVersion"
        },
        extra: {
            EXPO_PUBLIC_FIREBASE_API_KEY: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
            EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
            EXPO_PUBLIC_FIREBASE_PROJECT_ID: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
            EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
            EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
            EXPO_PUBLIC_FIREBASE_APP_ID: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
            eas: {
                projectId: "f838be2c-6600-44ea-a98c-0c83cbc544ea"
            }
        }
    }
};