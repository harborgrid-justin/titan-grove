/**
 * Base Routes Configuration
 * Provides common middleware and route patterns
 */

import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { validateRequest } from '../../middleware/validation';
import rateLimit from 'express-rate-limit';

/**
 * Standard middleware application for all routes
 */
export const applyStandardMiddleware = (router: Router) => {
  // Apply authentication to all routes
  router.use(authenticate);
  
  // Apply rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP'
  });
  router.use(limiter);
  
  return router;
};

/**
 * Standard CRUD route patterns
 */
export const createCRUDRoutes = (router: Router, basePath: string, controller: any) => {
  // List/Get all
  router.get(basePath, controller.getAll);
  
  // Get by ID
  router.get(`${basePath}/:id`, controller.getById);
  
  // Create new
  router.post(basePath, validateRequest, controller.create);
  
  // Update existing
  router.put(`${basePath}/:id`, validateRequest, controller.update);
  
  // Delete
  router.delete(`${basePath}/:id`, controller.delete);
  
  return router;
};

/**
 * Standard route error handling
 */
export const handleRouteErrors = (router: Router) => {
  router.use((error: any, req: any, res: any, next: any) => {
    console.error('Route Error:', error);
    
    res.status(error.status || 500).json({
      success: false,
      error: error.message || 'Internal Server Error',
      timestamp: new Date().toISOString()
    });
  });
  
  return router;
};