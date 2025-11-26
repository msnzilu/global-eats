import {
    addInventoryItem,
    auth,
    removeItemsFromShoppingList,
    subscribeToActiveShoppingList,
    updateShoppingListItem
} from '@/services/firebase';
import { ShoppingList } from '@/types';
import { useEffect, useState } from 'react';

interface UseShoppingListReturn {
    shoppingList: ShoppingList | null;
    loading: boolean;
    error: string | null;
    toggleItem: (itemId: string) => Promise<void>;
    addCheckedToInventory: () => Promise<void>;
    clearCheckedItems: () => Promise<void>;
    refreshList: () => void;
}

export function useShoppingList(activePlanId?: string): UseShoppingListReturn {
    const [shoppingList, setShoppingList] = useState<ShoppingList | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const currentUser = auth.currentUser;

    useEffect(() => {
        if (!currentUser) {
            setLoading(false);
            setError('User not authenticated');
            return;
        }

        setLoading(true);
        setError(null);

        // Subscribe to shopping list for active meal plan
        const unsubscribe = subscribeToActiveShoppingList(
            currentUser.uid,
            (list) => {
                setShoppingList(list);
                setLoading(false);
            },
            (err) => {
                setError(err.message);
                setLoading(false);
            },
            activePlanId  // Pass the active plan ID
        );

        // Cleanup subscription on unmount
        return unsubscribe;
    }, [currentUser?.uid, activePlanId]);  // Re-subscribe when plan changes

    const toggleItem = async (itemId: string): Promise<void> => {
        if (!currentUser || !shoppingList) {
            throw new Error('No active shopping list');
        }

        const item = shoppingList.items.find(i => i.id === itemId);
        if (!item) {
            throw new Error('Item not found');
        }

        try {
            await updateShoppingListItem(
                currentUser.uid,
                shoppingList.id,
                itemId,
                { isChecked: !item.isChecked }
            );
        } catch (err: any) {
            throw new Error(err.message || 'Failed to update item');
        }
    };

    const addCheckedToInventory = async (): Promise<void> => {
        if (!currentUser || !shoppingList) {
            throw new Error('No active shopping list');
        }

        const checkedItems = shoppingList.items.filter(item => item.isChecked);
        if (checkedItems.length === 0) {
            throw new Error('No checked items to add');
        }

        try {
            // Add each checked item to inventory
            for (const item of checkedItems) {
                await addInventoryItem(currentUser.uid, {
                    name: item.name,
                    quantity: item.quantity,
                    unit: item.unit,
                    category: item.category,
                    nutrition: {
                        calories: 0,
                        protein: 0,
                        carbs: 0,
                        fat: 0
                    }
                });
            }
        } catch (err: any) {
            throw new Error(err.message || 'Failed to add items to inventory');
        }
    };

    const clearCheckedItems = async (): Promise<void> => {
        if (!currentUser || !shoppingList) {
            throw new Error('No active shopping list');
        }

        const checkedItemIds = shoppingList.items
            .filter(item => item.isChecked)
            .map(item => item.id);

        if (checkedItemIds.length === 0) {
            return; // Nothing to clear
        }

        try {
            await removeItemsFromShoppingList(
                currentUser.uid,
                shoppingList.id,
                checkedItemIds
            );
        } catch (err: any) {
            throw new Error(err.message || 'Failed to clear checked items');
        }
    };

    const refreshList = () => {
        // Firestore real-time listeners handle this automatically
        // This function is here for manual refresh if needed
        setLoading(true);
    };

    return {
        shoppingList,
        loading,
        error,
        toggleItem,
        addCheckedToInventory,
        clearCheckedItems,
        refreshList,
    };
}
