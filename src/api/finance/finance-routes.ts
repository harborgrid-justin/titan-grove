/**
 * Finance API Routes
 * Backend API endpoints for all finance management operations
 */

import { Router } from 'express';
import { applyStandardMiddleware, handleRouteErrors } from '../base/base-routes';
import { validateRequest } from '../../middleware/validation';
import { financeController } from './finance-controller';
import type { Router as RouterType } from 'express';

const router: RouterType = Router();

// Apply standard middleware
applyStandardMiddleware(router);


// General Ledger Routes
router.get('/ledger', financeController.getGeneralLedger);
router.post('/ledger/entry', validateRequest, financeController.createJournalEntry);

// Accounts Payable Routes
router.get('/payable', financeController.getAccountsPayable);
router.post('/invoices', validateRequest, financeController.createInvoice);

// Accounts Receivable Routes
router.get('/receivable', financeController.getAccountsReceivable);
router.post('/payments', validateRequest, financeController.recordPayment);

// Financial Reporting Routes
router.get('/reports', financeController.getFinancialReports);
router.post('/reports/generate', validateRequest, financeController.generateReport);

// Budget Management Routes
router.get('/budget/analysis', financeController.getBudgetAnalysis);
router.put('/budget', validateRequest, financeController.updateBudget);

// Apply error handling
handleRouteErrors(router);

export default router;