import { Router } from 'express';
import { getEmissionsByCountry } from './../../controllers/countries.controller';

// Create a new router instance
const router = Router();

/**
 * Route to get emissions data by country.
 * 
 * GET /emissions-per-country
 * 
 * This route handles requests to retrieve emissions data by country.
 */
router.get('/emissions-per-country', getEmissionsByCountry);

// Export the router instance for use in other parts of the application
export default router;
