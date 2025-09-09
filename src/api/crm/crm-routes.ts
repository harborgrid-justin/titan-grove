/**
 * Crm API Routes
 * Backend API endpoints for all crm management operations
 */

import { Router } from 'express';
import { applyStandardMiddleware, handleRouteErrors } from '../base/base-routes';
import { validateRequest } from '../../middleware/validation';
import { crmController } from './crm-controller';
import type { Router as RouterType } from 'express';

const router: RouterType = Router();

// Apply standard middleware
applyStandardMiddleware(router);


// Customer Management Routes
router.get('/customers', crmController.getCustomers);
router.post('/customers', validateRequest, crmController.createCustomer);
router.get('/customers/:id', crmController.getCustomerById);
router.put('/customers/:id', validateRequest, crmController.updateCustomer);

// Opportunity Management Routes
router.get('/opportunities', crmController.getOpportunities);
router.post('/opportunities', validateRequest, crmController.createOpportunity);

// Contact Management Routes
router.get('/contacts', crmController.getContacts);
router.post('/contacts', validateRequest, crmController.createContact);

// Lead Management Routes
router.get('/leads', crmController.getLeads);
router.post('/leads/convert', validateRequest, crmController.convertLead);

// Apply error handling
handleRouteErrors(router);

export default router;