# Spoonacular API Setup

The GlobalEats app uses the Spoonacular API to fetch recipe data for the "Discover" tab.

## Getting Your API Key

1. Go to [https://spoonacular.com/food-api](https://spoonacular.com/food-api)
2. Click "Get Access" or "Sign Up"
3. Create a free account
4. Navigate to your dashboard to find your API key
5. The free tier includes 150 requests per day

## Configuration

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Add your Spoonacular API key to the `.env` file:
   ```
   EXPO_PUBLIC_SPOONACULAR_API_KEY=your_actual_api_key_here
   ```

3. Restart your Expo development server:
   ```bash
   npm start
   ```

## Features

The Spoonacular integration provides:
- **Recipe Caching**: Fetches recipes once and stores them in Firestore for efficient reuse
- **Automatic Initialization**: On first use, automatically fetches 100 recipes from Spoonacular
- **Random Recipes**: Displays cached recipes in the Discover tab
- **Recipe Search**: Search recipes by name, cuisine, diet type, and cooking time
- **Detailed Recipe Information**: Includes ingredients, instructions, nutrition facts, and images
- **Automatic Conversion**: Converts Spoonacular recipe format to our app's Recipe type

## How the Caching Works

To avoid exhausting the Spoonacular API rate limits (150 requests/day on free tier), the app uses a smart caching system:

1. **First Time**: When you first open the Discover tab, the app checks if recipes are cached in Firestore
2. **Auto-Fetch**: If no cache exists, it automatically fetches 100 recipes from Spoonacular and saves them to Firestore
3. **Reuse**: All subsequent requests use the cached recipes from Firestore (no API calls)
4. **Manual Refresh**: You can manually refresh the cache when you want new recipes

This means you only use 1-2 API requests to populate your entire recipe database!

## API Endpoints Used

- `/recipes/random` - Get random recipes
- `/recipes/complexSearch` - Search recipes with filters
- `/recipes/{id}/information` - Get detailed recipe information

## Rate Limits

- **Free Tier**: 150 requests/day
- **Paid Tiers**: Up to 5000+ requests/day

Monitor your usage at [https://spoonacular.com/food-api/console](https://spoonacular.com/food-api/console)

## Troubleshooting

If recipes aren't loading:
1. Check that your API key is correctly set in `.env`
2. Verify you haven't exceeded your daily rate limit
3. Check the console for error messages
4. Ensure you have an active internet connection
