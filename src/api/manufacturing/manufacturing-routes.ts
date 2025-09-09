/**
 * Manufacturing API Routes
 * Backend API endpoints for all manufacturing management operations
 */

import { Router } from 'express';
import { applyStandardMiddleware, handleRouteErrors } from '../base/base-routes';
import { validateRequest } from '../../middleware/validation';
import { manufacturingController } from './manufacturing-controller';
import type { Router as RouterType } from 'express';

const router: RouterType = Router();

// Apply standard middleware
applyStandardMiddleware(router);


// Production Planning Routes
router.get('/production/planning', manufacturingController.getProductionPlanning);
router.post('/production/planning', validateRequest, manufacturingController.createProductionPlan);

// Work Order Management Routes
router.get('/work-orders', manufacturingController.getWorkOrders);
router.post('/work-orders', validateRequest, manufacturingController.createWorkOrder);

// Quality Control Routes
router.get('/quality/metrics', manufacturingController.getQualityMetrics);
router.post('/quality/check', validateRequest, manufacturingController.recordQualityCheck);

// Inventory Management Routes
router.get('/inventory/tracking', manufacturingController.getInventoryTracking);
router.put('/inventory/level', validateRequest, manufacturingController.updateInventoryLevel);

// Machine Monitoring Routes
router.get('/machines/monitoring', manufacturingController.getMachineMonitoring);
router.post('/machines/status', validateRequest, manufacturingController.recordMachineStatus);

// Apply error handling
handleRouteErrors(router);

export default router;