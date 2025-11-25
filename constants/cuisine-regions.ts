// Cuisine to Region Mapping for Local/International Recipe Filtering
// This mapping determines which cuisines are considered "local" for users in different regions

export const CUISINE_REGION_MAP: Record<string, string> = {
    // European Cuisines
    'Italian': 'Europe',
    'French': 'Europe',
    'Spanish': 'Europe',
    'Greek': 'Europe',
    'Mediterranean': 'Europe',
    'German': 'Europe',
    'British': 'Europe',
    'Irish': 'Europe',
    'Portuguese': 'Europe',
    'Eastern European': 'Europe',

    // Asian Cuisines
    'Chinese': 'Asia',
    'Japanese': 'Asia',
    'Thai': 'Asia',
    'Indian': 'Asia',
    'Korean': 'Asia',
    'Vietnamese': 'Asia',
    'Filipino': 'Asia',
    'Malaysian': 'Asia',
    'Indonesian': 'Asia',
    'Singaporean': 'Asia',
    'Pakistani': 'Asia',
    'Bangladeshi': 'Asia',

    // African Cuisines
    'African': 'Africa',
    'Ethiopian': 'Africa',
    'Moroccan': 'Africa',
    'Nigerian': 'Africa',
    'South African': 'Africa',
    'Kenyan': 'Africa',
    'Egyptian': 'Africa',

    // American Cuisines
    'American': 'North America',
    'Mexican': 'North America',
    'Canadian': 'North America',
    'Tex-Mex': 'North America',
    'Cajun': 'North America',
    'Southern': 'North America',

    // South American Cuisines
    'Brazilian': 'South America',
    'Peruvian': 'South America',
    'Argentine': 'South America',
    'Colombian': 'South America',
    'Chilean': 'South America',

    // Middle Eastern Cuisines
    'Middle Eastern': 'Middle East',
    'Lebanese': 'Middle East',
    'Turkish': 'Middle East',
    'Israeli': 'Middle East',
    'Persian': 'Middle East',
    'Arabic': 'Middle East',

    // Oceania Cuisines
    'Australian': 'Oceania',
    'New Zealand': 'Oceania',

    // Caribbean Cuisines
    'Caribbean': 'Caribbean',
    'Jamaican': 'Caribbean',
    'Cuban': 'Caribbean',
};

// Country to Region Mapping
export const COUNTRY_REGION_MAP: Record<string, string> = {
    // Europe
    'Italy': 'Europe',
    'France': 'Europe',
    'Spain': 'Europe',
    'Greece': 'Europe',
    'Germany': 'Europe',
    'United Kingdom': 'Europe',
    'Ireland': 'Europe',
    'Portugal': 'Europe',
    'Netherlands': 'Europe',
    'Belgium': 'Europe',
    'Switzerland': 'Europe',
    'Austria': 'Europe',
    'Poland': 'Europe',
    'Czech Republic': 'Europe',
    'Hungary': 'Europe',
    'Romania': 'Europe',
    'Sweden': 'Europe',
    'Norway': 'Europe',
    'Denmark': 'Europe',
    'Finland': 'Europe',

    // Asia
    'China': 'Asia',
    'Japan': 'Asia',
    'Thailand': 'Asia',
    'India': 'Asia',
    'South Korea': 'Asia',
    'Vietnam': 'Asia',
    'Philippines': 'Asia',
    'Malaysia': 'Asia',
    'Indonesia': 'Asia',
    'Singapore': 'Asia',
    'Pakistan': 'Asia',
    'Bangladesh': 'Asia',
    'Sri Lanka': 'Asia',
    'Nepal': 'Asia',
    'Myanmar': 'Asia',
    'Cambodia': 'Asia',
    'Laos': 'Asia',

    // Africa
    'Kenya': 'Africa',
    'Nigeria': 'Africa',
    'South Africa': 'Africa',
    'Ethiopia': 'Africa',
    'Morocco': 'Africa',
    'Egypt': 'Africa',
    'Ghana': 'Africa',
    'Tanzania': 'Africa',
    'Uganda': 'Africa',
    'Rwanda': 'Africa',
    'Senegal': 'Africa',
    'Ivory Coast': 'Africa',
    'Cameroon': 'Africa',
    'Algeria': 'Africa',
    'Tunisia': 'Africa',

    // North America
    'United States': 'North America',
    'USA': 'North America',
    'Canada': 'North America',
    'Mexico': 'North America',

    // South America
    'Brazil': 'South America',
    'Argentina': 'South America',
    'Peru': 'South America',
    'Colombia': 'South America',
    'Chile': 'South America',
    'Venezuela': 'South America',
    'Ecuador': 'South America',
    'Bolivia': 'South America',

    // Middle East
    'Lebanon': 'Middle East',
    'Turkey': 'Middle East',
    'Israel': 'Middle East',
    'Iran': 'Middle East',
    'Saudi Arabia': 'Middle East',
    'UAE': 'Middle East',
    'Jordan': 'Middle East',
    'Iraq': 'Middle East',
    'Syria': 'Middle East',

    // Oceania
    'Australia': 'Oceania',
    'New Zealand': 'Oceania',

    // Caribbean
    'Jamaica': 'Caribbean',
    'Cuba': 'Caribbean',
    'Dominican Republic': 'Caribbean',
    'Haiti': 'Caribbean',
    'Trinidad and Tobago': 'Caribbean',
};

/**
 * Get the region for a given cuisine
 */
export function getCuisineRegion(cuisine: string): string | undefined {
    return CUISINE_REGION_MAP[cuisine];
}

/**
 * Get the region for a given country
 */
export function getCountryRegion(country: string): string | undefined {
    return COUNTRY_REGION_MAP[country];
}

/**
 * Check if a cuisine is local for a user based on their country/region
 */
export function isCuisineLocal(cuisine: string, userCountry?: string, userRegion?: string): boolean {
    const cuisineRegion = getCuisineRegion(cuisine);

    if (!cuisineRegion) {
        return false; // Unknown cuisine, treat as international
    }

    // If user has a region set, use that
    if (userRegion) {
        return cuisineRegion === userRegion;
    }

    // Otherwise, derive region from country
    if (userCountry) {
        const derivedRegion = getCountryRegion(userCountry);
        return cuisineRegion === derivedRegion;
    }

    return false; // No user location data, treat as international
}
