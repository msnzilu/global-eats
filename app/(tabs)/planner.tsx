import { View, Text, FlatList } from 'react-native';
import { InventoryItem } from '../../components/inventory/InventoryItem'; // Stub

export default function Inventory() {
    const mockItems = []; // From hook later

    return (
        <View className="flex-1 p-4">
            <Text className="text-2xl font-bold mb-4">Inventory</Text>
            <FlatList data={mockItems} renderItem={({ item }) => <InventoryItem item={item} />} />
        </View>
    );
}