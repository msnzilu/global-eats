import { persistor, store } from '@/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Slot } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

const queryClient = new QueryClient();

export default function RootLayout() {
    // Auth routing is now handled in app/index.tsx
    // This layout just provides the providers

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