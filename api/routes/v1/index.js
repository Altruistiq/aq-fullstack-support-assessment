import { Router } from 'express';
import countriesRoutes from './countries.routes';

// Create a new router instance
const router = Router();

/**
 * Middleware to use countries routes.
 * 
 * All routes starting with '/countries' will be handled by the countriesRoutes.
 */
router.use('/countries', countriesRoutes);

// Export the router instance for use in other parts of the application
export default router;