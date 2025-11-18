import { View, Text, StyleSheet } from 'react-native';
import type { InventoryItem } from '@types/inventory'; // Stub type; add later

interface Props {
    item: InventoryItem; // Stub interface
}

const styles = StyleSheet.create({
    item: {
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    details: {
        fontSize: 14,
        color: '#666',
    },
});

export function InventoryItem({ item }: Props) {
    return (
        <View style={styles.item}>
            <View>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.details}>{item.quantity} {item.unit}</Text>
            </View>
            <Text style={styles.details}>Calories: {item.nutrition.calories}/100g</Text>
        </View>
    );
}