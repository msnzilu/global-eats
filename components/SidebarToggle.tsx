import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

interface SidebarToggleProps {
    onPress: () => void;
}

export default function SidebarToggle({ onPress }: SidebarToggleProps) {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: 'rgba(255,255,255,0.2)',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 16
            }}
            activeOpacity={0.7}
        >
            <Ionicons name="menu" size={24} color="white" />
        </TouchableOpacity>
    );
}
