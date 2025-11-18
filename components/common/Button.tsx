import { TouchableOpacity, Text, GestureResponderEvent } from 'react-native';

interface Props {
    title: string;
    onPress: (event: GestureResponderEvent) => void;
    variant?: 'primary' | 'secondary';
}

export function Button({ title, onPress, variant = 'primary' }: Props) {
    return (
        <TouchableOpacity onPress={onPress} className={`px-4 py-2 rounded ${variant === 'primary' ? 'bg-blue-500' : 'bg-gray-300'}`}>
            <Text className="text-white font-medium">{title}</Text>
        </TouchableOpacity>
    );
}