/**
 * Finance API Routes
 * Backend API endpoints for all finance management operations
 */

import { Router } from 'express';
import { applyStandardMiddleware, handleRouteErrors } from '../base/base-routes';
import { validateBusiness, validateIdParam } from '../../middleware/validation';
import { financeController } from './finance-controller';
import type { Router as RouterType } from 'express';

const router: RouterType = Router();

// Apply standard middleware
applyStandardMiddleware(router);


// General Ledger Routes
router.get('/ledger', financeController.getGeneralLedger);
router.post('/ledger/entry', validateBusiness('createJournalEntry'), financeController.createJournalEntry);

// Accounts Payable Routes
router.get('/payable', financeController.getAccountsPayable);
router.post('/invoices', validateBusiness('createInvoice'), financeController.createInvoice);

// Accounts Receivable Routes
router.get('/receivable', financeController.getAccountsReceivable);
router.post('/payments', validateBusiness('recordPayment'), financeController.recordPayment);

// Financial Reporting Routes
router.get('/reports', financeController.getFinancialReports);
router.post('/reports/generate', validateBusiness('generateReport'), financeController.generateReport);

// Budget Management Routes
router.get('/budget/analysis', financeController.getBudgetAnalysis);
router.put('/budget', validateBusiness('updateBudget'), financeController.updateBudget);

// Apply error handling
handleRouteErrors(router);

export default router;