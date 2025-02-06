export const FOOT_PRINT_API_KEY = process.env.FOOT_PRINT_API_KEY // API key for footprint
export const FOOT_PRINT_BASE_URL = process.env.FOOT_PRINT_BASE_URL // Base URL for footprint API
export const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds
export const REFRESH_DURATION = 30 * 24 * 60 * 60 * 1000; // Approx. 1 month in milliseconds
export const DELAY_IN_REQUESTS = 100; // 1 second in milliseconds
export const SKIPPED_COUNTRIES = ['all']; //Countries to skip to data for, currently skipping All because it is not a country
export const EMISSIONS_REDIS_KEY = 'data:emission:by:country'; // Key for redis to store emissions data
export const LAST_REFRESH_DATA_KEY = 'data:emission:last:refresh'; // Key for redis to store emissions data
export const LAST_REFRESH_DATA_API_KEY = 'data:emission:api:last:refresh'; // Key for redis to store emissions data
export const ALLOWED_ORIGINS = [ //allowed origins to be added in the CORS
    'http://localhost:5173'
];
export const RATE_LIMITER_OPTIONS = { //limiting requests to add security
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
};
export const SUCCESS_STATUS_CODE = 200
export const PORT = process.env.PORT