import { View, Text, Link } from 'react-native';
import { Link as ExpoLink } from 'expo-router';

export default function NotFound() {
    return (
        <View className="flex-1 items-center justify-center p-4">
            <Text className="text-lg">This screen doesn't exist.</Text>
            <ExpoLink href="/" className="mt-4 text-primary">
                <Text>Go Home</Text>
            </ExpoLink>
        </View>
    );
}