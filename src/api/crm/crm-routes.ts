/**
 * Crm API Routes
 * Backend API endpoints for all crm management operations
 */

import { Router } from 'express';
import { applyStandardMiddleware, handleRouteErrors } from '../base/base-routes';
import { validateBusiness, validateIdParam } from '../../middleware/validation';
import { crmController } from './crm-controller';
import type { Router as RouterType } from 'express';

const router: RouterType = Router();

// Apply standard middleware
applyStandardMiddleware(router);


// Customer Management Routes
router.get('/customers', crmController.getCustomers);
router.post('/customers', validateBusiness('createCustomer'), crmController.createCustomer);
router.get('/customers/:id', validateIdParam, crmController.getCustomerById);
router.put('/customers/:id', validateIdParam, crmController.updateCustomer);

// Opportunity Management Routes
router.get('/opportunities', crmController.getOpportunities);
router.post('/opportunities', validateBusiness('createOpportunity'), crmController.createOpportunity);

// Contact Management Routes
router.get('/contacts', crmController.getContacts);
router.post('/contacts', validateBusiness('createContact'), crmController.createContact);

// Lead Management Routes
router.get('/leads', crmController.getLeads);
router.post('/leads/convert', validateBusiness('convertLead'), crmController.convertLead);

// Apply error handling
handleRouteErrors(router);

export default router;