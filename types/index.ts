// GlobalEats TypeScript Type Definitions
// Corresponds to Firestore database schema

import { Timestamp } from 'firebase/firestore';

// ============================================================================
// USER TYPES
// ============================================================================

export type DietType = 'None' | 'Vegetarian' | 'Vegan' | 'Pescatarian' | 'Keto' | 'Paleo';
export type HealthGoal = 'Lose Weight' | 'Maintain Weight' | 'Gain Muscle' | 'Improve Health';
export type CookingTime = '15-30 min' | '30-45 min' | '45-60 min' | '60+ min';

export interface User {
  // Authentication
  email: string;
  displayName: string;
  createdAt: Timestamp;
  lastLoginAt: Timestamp;

  // Onboarding
  dietType: DietType;
  allergies: string[];

  // Health Goals
  goal: HealthGoal;
  targetCalories: number;

  // Meal Preferences
  mealsPerDay: 1 | 2 | 3;
  preferredCuisines: string[];
  maxCookingTime: CookingTime;

  // Stats
  currentStreak: number;
  totalMealsCompleted: number;
}

// ============================================================================
// RECIPE TYPES
// ============================================================================

export type RecipeSource = 'custom' | 'spoonacular';
export type RecipeDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface Nutrition {
  calories: number;
  protein: number;  // grams
  carbs: number;    // grams
  fat: number;      // grams
}

export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}

export interface Recipe {
  id: string;

  // Basic Info
  name: string;
  description?: string;
  cuisine: string;
  difficulty: RecipeDifficulty;

  // Source
  source: RecipeSource;
  userId?: string;  // For custom recipes
  spoonacularId?: number;  // For discovered recipes

  // Time & Servings
  servings: number;
  prepTimeMin: number;
  cookTimeMin: number;

  // Nutrition (per serving)
  nutrition: Nutrition;

  // Ingredients & Instructions
  ingredients: Ingredient[];
  instructions: string;
  prepNotes?: string;

  // Media
  imageUrl?: string;

  // Metadata
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isPublic: boolean;
}

// ============================================================================
// INVENTORY TYPES
// ============================================================================

export type InventoryCategory = 'Protein' | 'Grains' | 'Produce' | 'Dairy' | 'Oils' | 'Other';

export interface InventoryItem {
  id: string;
  name: string;
  category: InventoryCategory;
  quantity: number;
  unit: string;
  nutrition: Nutrition;
  addedAt: Timestamp;
  expiryDate?: Timestamp;
  lastUpdated: Timestamp;
}

// ============================================================================
// MEAL PLAN TYPES
// ============================================================================

export type MealType = 'breakfast' | 'lunch' | 'dinner';

export interface Meal {
  mealType: MealType;
  recipeId: string;
  recipeName: string;  // Denormalized
  cuisine: string;

  // Nutrition (denormalized)
  calories: number;
  protein: number;
  carbs: number;
  fat: number;

  // Status
  isCompleted: boolean;
  completedAt?: Timestamp;
  isSwapped: boolean;
  originalRecipeId?: string;
}

export interface DayPlan {
  date: Timestamp;
  dayName: string;
  meals: Meal[];
  totalCalories: number;
  totalProtein: number;
}

export interface MealPlan {
  id: string;
  duration: 7 | 30;
  startDate: Timestamp;
  endDate: Timestamp;

  // Generation Settings
  selectedCuisines: string[];
  includeCustomRecipes: boolean;

  // Daily Meals
  days: DayPlan[];

  // Metadata
  createdAt: Timestamp;
  isActive: boolean;
}

// ============================================================================
// SHOPPING LIST TYPES
// ============================================================================

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: InventoryCategory;
  isChecked: boolean;
  checkedAt?: Timestamp;
  fromRecipes: string[];  // Recipe IDs
}

export interface ShoppingList {
  id: string;
  mealPlanId: string;
  createdAt: Timestamp;
  items: ShoppingItem[];
  isActive: boolean;
  completedAt?: Timestamp;
}

// ============================================================================
// MEAL HISTORY TYPES
// ============================================================================

export interface MealHistoryEntry {
  id: string;
  recipeId: string;
  recipeName: string;
  mealType: MealType;

  // Nutrition
  calories: number;
  protein: number;
  carbs: number;
  fat: number;

  // Timing
  completedAt: Timestamp;
  date: string;  // 'YYYY-MM-DD'

  // Source
  fromMealPlanId?: string;
  isManualEntry: boolean;
}

// ============================================================================
// FORM & UI TYPES
// ============================================================================

export interface OnboardingData {
  dietType: DietType;
  allergies: string[];
  goal: HealthGoal;
  targetCalories: number;
  mealsPerDay: 1 | 2 | 3;
  cuisines: string[];
  cookingTime: CookingTime;
}

export interface MealPlanGenerationOptions {
  duration: 7 | 30;
  selectedCuisines: string[];
  includeCustomRecipes: boolean;
}

// ============================================================================
// DASHBOARD STATS TYPES
// ============================================================================

export interface DashboardStats {
  mealsCompleted: number;
  avgDailyCalories: number;
  currentStreak: number;
  topCuisine: string;
  weeklyMacros?: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

// ============================================================================
// NOTIFICATION TYPES
// ============================================================================

export type NotificationType =
  | 'meal_reminder'
  | 'plan_update'
  | 'recipe_update'
  | 'shopping_reminder'
  | 'system';

export type NotificationPriority = 'low' | 'medium' | 'high';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  isRead: boolean;
  createdAt: Timestamp;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

export interface NotificationPreferences {
  pushEnabled: boolean;
  emailEnabled: boolean;
  mealReminders: boolean;
  planUpdates: boolean;
  recipeUpdates: boolean;
  shoppingReminders: boolean;
}
