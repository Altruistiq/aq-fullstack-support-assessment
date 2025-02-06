import { Router } from 'express';
import { getLandingData } from './../../controllers/landing.controller';

// Create a new router instance
const router = Router();

/**
 * Route to get landing page data.
 * 
 * GET /
 * 
 * This route handles requests to retrieve data for the landing page.
 */
router.get('/', getLandingData);

// Export the router instance for use in other parts of the application
export default router;
