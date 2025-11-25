# Recipe Cache Management

This document explains how to manage the Spoonacular recipe cache.

## Automatic Caching

The app automatically caches Spoonacular recipes on first use:
- When a user first opens the Discover tab, the app checks for cached recipes
- If none exist, it fetches 100 recipes from Spoonacular and saves them to Firestore
- All subsequent requests use the cached recipes (no API calls)

## Manual Cache Refresh

If you want to refresh the recipe cache with new recipes from Spoonacular, you can use the recipe sync service:

### Option 1: From the App (Developer Console)

Open the browser console and run:

```javascript
import { refreshSpoonacularCache } from '@/services/api/recipe-sync';

// Refresh with 50 new recipes
await refreshSpoonacularCache(50);

// Or refresh with 100 new recipes
await refreshSpoonacularCache(100);
```

### Option 2: Create an Admin Screen

You can create an admin screen in your app with a button to refresh the cache:

```typescript
import { refreshSpoonacularCache } from '@/services/api/recipe-sync';

const handleRefreshCache = async () => {
  try {
    const count = await refreshSpoonacularCache(50);
    Alert.alert('Success', `Refreshed ${count} recipes from Spoonacular`);
  } catch (error) {
    Alert.alert('Error', 'Failed to refresh recipe cache');
  }
};
```

## Cache Statistics

To check how many recipes are cached:

```typescript
import { getCachedSpoonacularRecipes } from '@/services/api/recipe-sync';

const recipes = await getCachedSpoonacularRecipes();
console.log(`Cached recipes: ${recipes.length}`);
```

## API Usage

With the caching system:
- **Initial setup**: 1-2 API requests (fetches 100 recipes)
- **Daily usage**: 0 API requests (uses cache)
- **Manual refresh**: 1 API request per refresh

This keeps you well within the free tier limit of 150 requests/day!

## Best Practices

1. **Don't refresh too often**: The cache is designed to be long-lived
2. **Refresh during off-peak hours**: If you do refresh, do it when users aren't actively using the app
3. **Monitor your API usage**: Check your Spoonacular dashboard to track usage
4. **Consider upgrading**: If you need more recipes or frequent updates, consider a paid tier
