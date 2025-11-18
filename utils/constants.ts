/**
 * GlobalEats Planner - Constants & Theme Configuration
 * Defines brand colors, sizing, spacing, and app-wide constants
 */

// ==================== BRAND COLORS ====================

export const Colors = {
    // Primary Brand Colors - Fresh, Healthy, Appetizing
    primary: {
        main: '#10B981', // Emerald green - represents fresh ingredients, health
        light: '#34D399',
        lighter: '#6EE7B7',
        dark: '#059669',
        darker: '#047857',
    },

    // Secondary Brand Colors - Warm, Inviting
    secondary: {
        main: '#F59E0B', // Amber - represents warmth of cooking, global cuisines
        light: '#FBBF24',
        lighter: '#FCD34D',
        dark: '#D97706',
        darker: '#B45309',
    },

    // Accent Colors for UI Elements
    accent: {
        blue: '#3B82F6', // Charts, links
        purple: '#8B5CF6', // Premium features
        pink: '#EC4899', // Favorites, highlights
        teal: '#14B8A6', // Success states
    },

    // Nutrition-Specific Colors (for charts)
    nutrition: {
        protein: '#EF4444', // Red
        carbs: '#3B82F6', // Blue
        fat: '#FBBF24', // Yellow/Amber
        calories: '#8B5CF6', // Purple
    },

    // Semantic Colors
    success: '#10B981', // Green - matches primary
    warning: '#F59E0B', // Amber - matches secondary
    error: '#EF4444', // Red
    info: '#3B82F6', // Blue

    // Status Colors
    status: {
        active: '#10B981',
        draft: '#6B7280',
        completed: '#8B5CF6',
        archived: '#9CA3AF',
    },

    // Neutral Grayscale
    gray: {
        50: '#F9FAFB',
        100: '#F3F4F6',
        200: '#E5E7EB',
        300: '#D1D5DB',
        400: '#9CA3AF',
        500: '#6B7280',
        600: '#4B5563',
        700: '#374151',
        800: '#1F2937',
        900: '#111827',
    },

    // Light Theme
    light: {
        background: '#FFFFFF',
        surface: '#F9FAFB',
        surfaceAlt: '#F3F4F6',
        border: '#E5E7EB',
        text: {
            primary: '#111827',
            secondary: '#6B7280',
            tertiary: '#9CA3AF',
            disabled: '#D1D5DB',
        },
        card: '#FFFFFF',
        shadow: 'rgba(0, 0, 0, 0.1)',
    },

    // Dark Theme
    dark: {
        background: '#111827',
        surface: '#1F2937',
        surfaceAlt: '#374151',
        border: '#4B5563',
        text: {
            primary: '#F9FAFB',
            secondary: '#D1D5DB',
            tertiary: '#9CA3AF',
            disabled: '#6B7280',
        },
        card: '#1F2937',
        shadow: 'rgba(0, 0, 0, 0.3)',
    },

    // Overlay Colors
    overlay: {
        light: 'rgba(255, 255, 255, 0.95)',
        medium: 'rgba(255, 255, 255, 0.8)',
        dark: 'rgba(0, 0, 0, 0.5)',
        darker: 'rgba(0, 0, 0, 0.7)',
    },
};

// ==================== SIZING & SPACING ====================

export const Sizing = {
    // Touch Target Sizes (WCAG AA Compliance)
    touchTarget: {
        minimum: 44, // 44x44pt minimum for accessibility
        comfortable: 48,
        large: 56,
    },

    // Icon Sizes
    icon: {
        xs: 16,
        sm: 20,
        md: 24,
        lg: 32,
        xl: 48,
    },

    // Border Radius
    radius: {
        none: 0,
        sm: 4,
        md: 8,
        lg: 12,
        xl: 16,
        '2xl': 24,
        full: 9999,
    },

    // Border Width
    border: {
        thin: 1,
        medium: 2,
        thick: 4,
    },
};

export const Spacing = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    '2xl': 32,
    '3xl': 48,
    '4xl': 64,
};

// ==================== TYPOGRAPHY ====================

export const Typography = {
    fontSize: {
        xs: 12,
        sm: 14,
        base: 16,
        lg: 18,
        xl: 20,
        '2xl': 24,
        '3xl': 30,
        '4xl': 36,
        '5xl': 48,
    },

    fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
    },

    lineHeight: {
        tight: 1.25,
        normal: 1.5,
        relaxed: 1.75,
    },
};

// ==================== APP CONSTANTS ====================

export const AppConstants = {
    // API Configuration
    api: {
        spoonacular: {
            baseUrl: 'https://api.spoonacular.com',
            dailyLimit: 150,
            cacheTTLDays: 7,
        },
    },

    // Performance Budgets
    performance: {
        appLaunchMs: 2000,
        screenTransitionMs: 300,
        planGeneration7DayMs: 5000,
        planGeneration30DayMs: 15000,
        apiTimeoutMs: 2000,
        imageUploadMs: 3000,
    },

    // Pagination
    pagination: {
        itemsPerPage: 20,
    },

    // Validation Limits
    validation: {
        age: { min: 13, max: 120 },
        weight: { min: 30, max: 300 }, // kg
        height: { min: 100, max: 250 }, // cm
        quantity: { min: 0.1, max: 10000 },
        recipeName: { min: 3, max: 60 },
        instructions: { min: 10, max: 2000 },
        servings: { min: 1, max: 20 },
        imageSize: 5 * 1024 * 1024, // 5MB
    },

    // Rate Limiting
    rateLimit: {
        planGenerations: {
            maxPerHour: 10,
            resetIntervalMs: 3600000, // 1 hour
        },
    },

    // Meal Timing Defaults
    mealTiming: {
        one: [
            { slot: 'lunch', startHour: 13, startMin: 0, durationMin: 30 },
        ],
        two: [
            { slot: 'breakfast', startHour: 8, startMin: 0, durationMin: 20 },
            { slot: 'dinner', startHour: 19, startMin: 0, durationMin: 25 },
        ],
        three: [
            { slot: 'breakfast', startHour: 8, startMin: 0, durationMin: 15 },
            { slot: 'lunch', startHour: 13, startMin: 0, durationMin: 20 },
            { slot: 'dinner', startHour: 19, startMin: 0, durationMin: 25 },
        ],
    },

    // Timer Configuration
    timer: {
        defaultDurationMin: 20,
        minDurationMin: 5,
        maxDurationMin: 60,
        feedbackAutoCloseMs: 30000, // 30 seconds
    },

    // Notification Timing Options (minutes before meal)
    notificationTiming: [5, 10, 15, 30],
};

// ==================== ACTIVITY MULTIPLIERS ====================

export const ActivityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryActive: 1.9,
};

// ==================== DIET TYPE MACROS ====================

export const DietMacros = {
    keto: { carbs: 0.05, protein: 0.25, fat: 0.70 },
    vegan: { carbs: 0.55, protein: 0.15, fat: 0.30 },
    vegetarian: { carbs: 0.50, protein: 0.20, fat: 0.30 },
    lowCarb: { carbs: 0.20, protein: 0.35, fat: 0.45 },
    balanced: { carbs: 0.40, protein: 0.30, fat: 0.30 },
};

// ==================== CALORIE DISTRIBUTION ====================

export const CalorieDistribution = {
    one: { lunch: 1.0 },
    two: { breakfast: 0.45, dinner: 0.55 },
    three: { breakfast: 0.30, lunch: 0.35, dinner: 0.35 },
};

// ==================== CUISINE OPTIONS ====================

export const Cuisines = [
    { id: 'american', name: 'American', flag: '🇺🇸' },
    { id: 'italian', name: 'Italian', flag: '🇮🇹' },
    { id: 'mexican', name: 'Mexican', flag: '🇲🇽' },
    { id: 'chinese', name: 'Chinese', flag: '🇨🇳' },
    { id: 'indian', name: 'Indian', flag: '🇮🇳' },
    { id: 'japanese', name: 'Japanese', flag: '🇯🇵' },
    { id: 'thai', name: 'Thai', flag: '🇹🇭' },
    { id: 'french', name: 'French', flag: '🇫🇷' },
    { id: 'greek', name: 'Greek', flag: '🇬🇷' },
    { id: 'spanish', name: 'Spanish', flag: '🇪🇸' },
    { id: 'middleEastern', name: 'Middle Eastern', flag: '🌍' },
    { id: 'korean', name: 'Korean', flag: '🇰🇷' },
    { id: 'vietnamese', name: 'Vietnamese', flag: '🇻🇳' },
    { id: 'brazilian', name: 'Brazilian', flag: '🇧🇷' },
    { id: 'caribbean', name: 'Caribbean', flag: '🌴' },
    { id: 'mediterranean', name: 'Mediterranean', flag: '🫒' },
];

// ==================== DIET TYPES ====================

export const DietTypes = [
    { id: 'balanced', name: 'Balanced', description: 'Balanced macronutrients' },
    { id: 'keto', name: 'Ketogenic', description: 'High fat, very low carb' },
    { id: 'vegan', name: 'Vegan', description: 'Plant-based only' },
    { id: 'vegetarian', name: 'Vegetarian', description: 'No meat or fish' },
    { id: 'lowCarb', name: 'Low Carb', description: 'Reduced carbohydrates' },
];

// ==================== ALLERGEN OPTIONS ====================

export const Allergens = [
    'Dairy', 'Eggs', 'Gluten', 'Peanuts', 'Tree Nuts',
    'Soy', 'Fish', 'Shellfish', 'Wheat', 'Sesame',
];

// ==================== INGREDIENT CATEGORIES ====================

export const IngredientCategories = [
    'protein', 'vegetable', 'grain', 'dairy', 'fruit',
    'legume', 'spice', 'condiment', 'oil', 'other',
];

// ==================== UNIT OPTIONS ====================

export const Units = [
    'g', 'kg', 'ml', 'l', 'oz', 'lb', 'cups', 'tbsp',
    'tsp', 'pieces', 'slices', 'cloves', 'whole',
];

export default {
    Colors,
    Sizing,
    Spacing,
    Typography,
    AppConstants,
    ActivityMultipliers,
    DietMacros,
    CalorieDistribution,
    Cuisines,
    DietTypes,
    Allergens,
    IngredientCategories,
    Units,
};