/**
 * Hr API Routes
 * Backend API endpoints for all hr management operations
 */

import { Router } from 'express';
import { applyStandardMiddleware, handleRouteErrors } from '../base/base-routes';
import { validateIdParam } from '../../middleware/validation';
import { hrController } from './hr-controller';
import type { Router as RouterType } from 'express';

const router: RouterType = Router();

// Apply standard middleware
applyStandardMiddleware(router);

// Employee Management Routes
router.get('/employees', hrController.getEmployees);
router.post('/employees', hrController.createEmployee);
router.get('/employees/:id', hrController.getEmployeeById);
router.put('/employees/:id', validateIdParam, hrController.updateEmployee);

// Payroll Management Routes
router.get('/payroll', hrController.getPayroll);
router.post('/payroll/process', hrController.processPayroll);

// Performance Management Routes
router.get('/performance/reviews', hrController.getPerformanceReviews);
router.post('/performance/reviews', hrController.createPerformanceReview);

// Time Tracking Routes
router.get('/time/tracking', hrController.getTimeTracking);
router.post('/time/entry', hrController.recordTimeEntry);

// Apply error handling
handleRouteErrors(router);

export default router;
