import { Colors } from '@/utils/constants';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

export default function Index() {
    const router = useRouter();

    useEffect(() => {
        // Simple splash screen with delay, then navigate to login
        const timer = setTimeout(() => {
            router.replace('/auth/login');
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: Colors.primary.main
        }}>
            {/* Logo Icon */}
            <View
                style={{
                    width: 100,
                    height: 100,
                    borderRadius: 50,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 24,
                    backgroundColor: 'rgba(255, 255, 255, 0.2)'
                }}
            >
                <Text style={{ fontSize: 48 }}>🍽️</Text>
            </View>

            <Text style={{
                fontSize: 36,
                fontWeight: 'bold',
                color: 'white',
                marginBottom: 8
            }}>
                GlobalEats
            </Text>

            <Text style={{
                fontSize: 20,
                color: 'white',
                marginBottom: 48
            }}>
                Plan. Cook. Thrive.
            </Text>

            <ActivityIndicator size="large" color="#ffffff" />
        </View>
    );
}