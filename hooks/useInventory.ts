import { auth } from '@/services/firebase/config';
import {
    addInventoryItem,
    deleteInventoryItem,
    subscribeToInventoryItems,
    updateInventoryItem
} from '@/services/firebase/firestore';
import { InventoryItem } from '@/types';
import { useEffect, useState } from 'react';

interface UseInventoryReturn {
    items: InventoryItem[];
    loading: boolean;
    error: string | null;
    addItem: (itemData: Omit<InventoryItem, 'id' | 'addedAt' | 'lastUpdated'>) => Promise<void>;
    updateItem: (itemId: string, updates: Partial<Omit<InventoryItem, 'id' | 'addedAt'>>) => Promise<void>;
    deleteItem: (itemId: string) => Promise<void>;
    refreshItems: () => void;
}

/**
 * Custom hook for managing inventory items with real-time Firestore sync
 */
export function useInventory(): UseInventoryReturn {
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Get current user ID
    const userId = auth.currentUser?.uid;

    useEffect(() => {
        if (!userId) {
            setLoading(false);
            setError('User not authenticated');
            return;
        }

        setLoading(true);
        setError(null);

        // Subscribe to real-time inventory updates
        const unsubscribe = subscribeToInventoryItems(
            userId,
            (updatedItems) => {
                setItems(updatedItems);
                setLoading(false);
                setError(null);
            },
            (err) => {
                setError(err.message);
                setLoading(false);
            }
        );

        // Cleanup subscription on unmount
        return () => {
            unsubscribe();
        };
    }, [userId]);

    /**
     * Add a new inventory item
     */
    const addItem = async (
        itemData: Omit<InventoryItem, 'id' | 'addedAt' | 'lastUpdated'>
    ): Promise<void> => {
        if (!userId) {
            throw new Error('User not authenticated');
        }

        try {
            await addInventoryItem(userId, itemData);
            // Real-time listener will update the items automatically
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    /**
     * Update an existing inventory item
     */
    const updateItem = async (
        itemId: string,
        updates: Partial<Omit<InventoryItem, 'id' | 'addedAt'>>
    ): Promise<void> => {
        if (!userId) {
            throw new Error('User not authenticated');
        }

        try {
            await updateInventoryItem(userId, itemId, updates);
            // Real-time listener will update the items automatically
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    /**
     * Delete an inventory item
     */
    const deleteItem = async (itemId: string): Promise<void> => {
        if (!userId) {
            throw new Error('User not authenticated');
        }

        try {
            await deleteInventoryItem(userId, itemId);
            // Real-time listener will update the items automatically
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    /**
     * Manually refresh items (though real-time sync should handle this)
     */
    const refreshItems = () => {
        // The real-time listener will automatically refresh
        // This is here for manual refresh if needed
        setLoading(true);
    };

    return {
        items,
        loading,
        error,
        addItem,
        updateItem,
        deleteItem,
        refreshItems,
    };
}
