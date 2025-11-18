import { View, Text, FlatList } from 'react-native';
import { InventoryItem } from '@/components/inventory/InventoryItem';

const mockItems = [
    { id: '1', name: 'Chicken Breast', quantity: 500, unit: 'g', nutrition: { calories: 165 } },
];

export default function Inventory() {
    return (
        <View style={{ flex: 1, padding: 16 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Inventory</Text>
            <FlatList
                data={mockItems}
                renderItem={({ item }) => <InventoryItem item={item} />}
                keyExtractor={(item) => item.id || Math.random().toString()}
            />
        </View>
    );
}