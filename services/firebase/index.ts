// Central export file for Firebase services
// This breaks the circular dependency between firestore.ts and meal-plan-generator.ts

// Export all firestore functions
export {

    // Inventory management
    addInventoryItem, addItemsToShoppingList,
    // Recipe management
    addRecipe,
    // Shopping list management
    createShoppingList,
    // User profile management
    createUserProfile, deleteInventoryItem, deleteRecipe, deleteShoppingList, getRecipeById, getUserProfile, removeItemFromShoppingList,
    removeItemsFromShoppingList, searchRecipes, subscribeToActiveShoppingList, subscribeToDiscoveredRecipes, subscribeToInventoryItems, subscribeToInventoryItemsByCategory, subscribeToUserRecipes, updateInventoryItem, updateLastLogin, updateOnboardingData, updateRecipe, updateShoppingListItem, updateUserProfile
} from './firestore';

// Export all meal plan functions
export {
    deactivateOldPlans, deleteMealPlan, generateMealPlan, getMealPlanById, subscribeToActiveMealPlan, updateMealStatus
} from './meal-plan-generator';

// Export all notification functions
export {
    clearAllNotifications, createMealPlanNotification,
    createMealReminderNotification, createNotification, createRecipeUpdateNotification, createShoppingReminderNotification, deleteNotification, getUnreadNotificationCount,
    getUserNotificationPreferences, markAllNotificationsAsRead, markNotificationAsRead, subscribeToUserNotifications, updateNotificationPreferences
} from './notifications';

// Export all dashboard functions
export {
    getDashboardStats
} from './dashboard';
export type { DashboardStats } from './dashboard';

// Export Firebase config
export { auth, db } from './config';

