# GlobalEats Database Schema

## Overview
GlobalEats is a meal planning and nutrition tracking app built with React Native and Firebase. This document outlines the recommended Firestore database structure.

## Database Technology
**Firebase Firestore** - NoSQL document database with real-time sync capabilities

---

## Collections Structure

### 1. **users** Collection
Stores user profile and preferences data.

```typescript
users/{userId}
{
  // Authentication Info
  email: string;
  displayName: string;
  createdAt: timestamp;
  lastLoginAt: timestamp;
  
  // Onboarding Data
  dietType: 'None' | 'Vegetarian' | 'Vegan' | 'Pescatarian' | 'Keto' | 'Paleo';
  allergies: string[];  // e.g., ['Peanuts', 'Dairy']
  
  // Health Goals
  goal: 'Lose Weight' | 'Maintain Weight' | 'Gain Muscle' | 'Improve Health';
  targetCalories: number;  // Daily calorie target
  
  // Meal Preferences
  mealsPerDay: 1 | 2 | 3;
  preferredCuisines: string[];  // e.g., ['Italian', 'Mexican', 'Japanese']
  maxCookingTime: '15-30 min' | '30-45 min' | '45-60 min' | '60+ min';
  
  // Stats (for dashboard)
  currentStreak: number;
  totalMealsCompleted: number;
}
```

---

### 2. **recipes** Collection
Stores both custom user recipes and discovered recipes from Spoonacular.

```typescript
recipes/{recipeId}
{
  // Basic Info
  name: string;
  description?: string;
  cuisine: string;  // e.g., 'Indian', 'Mediterranean'
  difficulty: 'Easy' | 'Medium' | 'Hard';
  
  // Source
  source: 'custom' | 'spoonacular';
  userId?: string;  // Only for custom recipes (creator)
  spoonacularId?: number;  // Only for discovered recipes
  
  // Time & Servings
  servings: number;
  prepTimeMin: number;
  cookTimeMin: number;
  
  // Nutrition (per serving)
  nutrition: {
    calories: number;
    protein: number;  // grams
    carbs: number;    // grams
    fat: number;      // grams
  };
  
  // Ingredients
  ingredients: Array<{
    name: string;
    amount: number;
    unit: string;  // 'g', 'ml', 'tbsp', 'pieces', etc.
  }>;
  
  // Instructions
  instructions: string;  // Multi-line text with steps
  prepNotes?: string;    // Optional cooking tips
  
  // Media
  imageUrl?: string;
  
  // Metadata
  createdAt: timestamp;
  updatedAt: timestamp;
  isPublic: boolean;  // For custom recipes
}
```

---

### 3. **inventory** Collection
Stores user's food inventory items.

```typescript
inventory/{userId}/items/{itemId}
{
  // Basic Info
  name: string;
  category: 'Protein' | 'Grains' | 'Produce' | 'Dairy' | 'Oils' | 'Other';
  
  // Quantity
  quantity: number;
  unit: string;  // 'g', 'kg', 'ml', 'pieces', etc.
  
  // Nutrition (per 100g or per unit)
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  
  // Tracking
  addedAt: timestamp;
  expiryDate?: timestamp;
  lastUpdated: timestamp;
}
```

> **Note**: Using subcollection pattern for better data organization and query performance.

---

### 4. **mealPlans** Collection
Stores generated meal plans for users.

```typescript
mealPlans/{userId}/plans/{planId}
{
  // Plan Info
  duration: 7 | 30;  // days
  startDate: timestamp;
  endDate: timestamp;
  
  // Generation Settings
  selectedCuisines: string[];
  includeCustomRecipes: boolean;
  
  // Daily Meals
  days: Array<{
    date: timestamp;
    dayName: string;  // 'Monday', 'Tuesday', etc.
    meals: Array<{
      mealType: 'breakfast' | 'lunch' | 'dinner';
      recipeId: string;  // Reference to recipes collection
      recipeName: string;  // Denormalized for quick access
      cuisine: string;
      
      // Nutrition (denormalized)
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
      
      // Status
      isCompleted: boolean;
      completedAt?: timestamp;
      isSwapped: boolean;
      originalRecipeId?: string;  // If meal was swapped
    }>;
    
    // Daily totals
    totalCalories: number;
    totalProtein: number;
  }>;
  
  // Metadata
  createdAt: timestamp;
  isActive: boolean;  // Only one active plan at a time
}
```

---

### 5. **shoppingLists** Collection
Stores shopping lists generated from meal plans.

```typescript
shoppingLists/{userId}/lists/{listId}
{
  // List Info
  mealPlanId: string;  // Reference to the meal plan
  createdAt: timestamp;
  
  // Items grouped by category
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    unit: string;
    category: 'Protein' | 'Grains' | 'Produce' | 'Dairy' | 'Oils' | 'Other';
    isChecked: boolean;
    checkedAt?: timestamp;
    
    // Source tracking
    fromRecipes: string[];  // Recipe IDs that need this ingredient
  }>;
  
  // Status
  isActive: boolean;
  completedAt?: timestamp;
}
```

---

### 6. **mealHistory** Collection
Tracks completed meals for analytics and dashboard.

```typescript
mealHistory/{userId}/entries/{entryId}
{
  // Meal Info
  recipeId: string;
  recipeName: string;
  mealType: 'breakfast' | 'lunch' | 'dinner';
  
  // Nutrition
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  
  // Timing
  completedAt: timestamp;
  date: string;  // 'YYYY-MM-DD' for easy querying
  
  // Source
  fromMealPlanId?: string;  // If from a meal plan
  isManualEntry: boolean;
}
```

---

## Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Recipes - custom recipes are private, discovered are public
    match /recipes/{recipeId} {
      allow read: if request.auth != null && 
        (resource.data.source == 'spoonacular' || 
         resource.data.userId == request.auth.uid ||
         resource.data.isPublic == true);
      allow create: if request.auth != null && 
        request.resource.data.userId == request.auth.uid;
      allow update, delete: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Inventory - user-specific subcollection
    match /inventory/{userId}/items/{itemId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Meal Plans - user-specific subcollection
    match /mealPlans/{userId}/plans/{planId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Shopping Lists - user-specific subcollection
    match /shoppingLists/{userId}/lists/{listId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Meal History - user-specific subcollection
    match /mealHistory/{userId}/entries/{entryId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## Indexes

Create these composite indexes in Firebase Console for optimal query performance:

### mealHistory
- Collection: `mealHistory/{userId}/entries`
- Fields: `date` (Descending), `completedAt` (Descending)
- Query scope: Collection

### recipes
- Collection: `recipes`
- Fields: `source` (Ascending), `cuisine` (Ascending), `createdAt` (Descending)
- Query scope: Collection

### inventory
- Collection: `inventory/{userId}/items`
- Fields: `category` (Ascending), `addedAt` (Descending)
- Query scope: Collection group

---

## Data Denormalization Strategy

To optimize read performance and reduce costs:

1. **Meal Plans**: Store recipe names and nutrition info directly (denormalized) to avoid extra reads when displaying the plan
2. **Shopping Lists**: Include category with each item for easy grouping
3. **Meal History**: Store all nutrition data to enable dashboard analytics without recipe lookups

---

## Migration Notes

When implementing this schema:

1. **Start with `users` collection** - Set up during onboarding flow
2. **Implement `inventory` next** - Users can start tracking food
3. **Add `recipes` collection** - Both custom and Spoonacular integration
4. **Build `mealPlans`** - Core feature for meal planning
5. **Generate `shoppingLists`** - Auto-generate from meal plans
6. **Track with `mealHistory`** - Enable dashboard analytics

---

## Alternative: Using Firestore Bundles

For frequently accessed data (like popular recipes), consider using Firestore Bundles to reduce read costs and improve offline support.

---

## Backup Strategy

- Enable Firestore automated backups
- Export user data on request (GDPR compliance)
- Implement soft deletes for critical data (add `deletedAt` field)
