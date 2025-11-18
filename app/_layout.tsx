import { Slot } from 'expo-router';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store, persistor } from '@/store';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const queryClient = new QueryClient();

export default function RootLayout() {
    // TODO: Re-enable auth after fixing Firebase config
    // const router = useRouter();
    // const { user, profile, isLoading } = useAuth();

    // useEffect(() => {
    //     if (!isLoading) {
    //         if (!user) {
    //             router.replace('/login');
    //         } else if (!profile || !profile.hasCompletedOnboarding) {
    //             router.replace('/onboarding');
    //         } else {
    //             router.replace('/(tabs)/planner');
    //         }
    //     }
    // }, [user, profile, isLoading, router]);

    // if (isLoading) return null;

    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <QueryClientProvider client={queryClient}>
                    <SafeAreaProvider>
                        <Slot />
                    </SafeAreaProvider>
                </QueryClientProvider>
            </PersistGate>
        </Provider>
    );
}