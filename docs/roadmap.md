# GlobalEats Future Roadmap

This document outlines the features and infrastructure required to fully implement the subscription benefits and family capabilities in GlobalEats.

## 🚨 Critical Infrastructure

Before implementing specific features, the following core infrastructure is needed:

*   **Subscription State Management**:
    *   Update `User` model in Firestore to include `subscriptionTier`, `subscriptionStatus`, and `expiryDate`.
    *   Implement backend logic to validate subscription status on critical actions.
*   **Payment Integration**:
    *   Integrate **RevenueCat** (recommended for React Native) to handle cross-platform subscriptions (iOS & Android).
    *   Replace mock payment screen with real purchase flows.
    *   Implement webhook handling for subscription events (renewals, cancellations, expirations).
*   **Feature Gating**:
    *   Create a `useSubscription` hook to easily check permissions (e.g., `canCreateMealPlan`, `canAccessAnalytics`).
    *   Add checks in UI and Backend to block restricted features for free users.

## 👨‍👩‍👧‍👦 Family Plan Features

The following features are required to make the "Family" plan functional:

*   **Family Management**:
    *   **Invite System**: Ability to generate invite links or send emails to add members.
    *   **Member Management**: UI for the primary account holder to view, remove, or manage family members.
*   **Shared Data**:
    *   **Shared Meal Plans**: Logic to allow family members to view and edit the same meal plan document.
    *   **Shared Shopping List**: Real-time syncing of shopping list items across all family devices.
*   **Family Dashboard**:
    *   Aggregated view of nutrition stats for all family members.
    *   Individual profile switching or "view as" capability.
*   **Multiple Preferences**:
    *   Refactor `User` preferences to support per-member dietary restrictions within a single family context.

## 💎 Premium Features

The following "Premium" features are currently placeholders and need implementation:

*   **Advanced Analytics**:
    *   **Calorie Trend Chart**: Implement a line chart showing daily calorie intake over time (vs. target).
    *   **Meal Completion Rate**: Implement a bar or pie chart showing adherence to the meal plan.
    *   **Macro Trends**: Visual breakdown of protein/carb/fat consistency.
*   **Priority Support**:
    *   Implement a ticketing system or integrate with a support platform (e.g., Intercom, Zendesk).
    *   Add "Priority" flag to support requests from Premium users.

## 🛠️ Other Improvements

*   **Recipe Import**: Feature to scrape and import recipes from external URLs.
*   **Inventory Barcode Scanner**: Implement camera scanning for easier inventory management.
