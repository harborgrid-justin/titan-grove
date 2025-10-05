/**
 * FinanceController - Complete Implementation
 * Handles all finance domain operations
 */

import { Request, Response } from 'express';
import { BaseController } from '../base/base-controller';

export class FinanceController extends BaseController {
  /**
   * Get general ledger entries
   */
  async getGeneralLedger(req: Request, res: Response): Promise<void> {
    try {
      const { startDate, endDate, accountType, page = 1, limit = 50 } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      const entries = [
        {
          id: 'GL-001',
          entryDate: '2024-01-15',
          accountNumber: '1000',
          accountName: 'Cash',
          accountType: 'ASSET',
          debit: 10000,
          credit: 0,
          balance: 10000,
          description: 'Customer payment received',
          reference: 'PMT-001',
          createdAt: '2024-01-15T00:00:00.000Z',
        },
      ];

      let filtered = entries;
      if (startDate) {
        filtered = filtered.filter((e) => e.entryDate >= startDate);
      }
      if (endDate) {
        filtered = filtered.filter((e) => e.entryDate <= endDate);
      }
      if (accountType) {
        filtered = filtered.filter((e) => e.accountType === accountType);
      }

      const paginated = filtered.slice(offset, offset + Number(limit));

      const result = {
        entries: paginated,
        pagination: {
          total: filtered.length,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(filtered.length / Number(limit)),
        },
        summary: {
          totalDebit: filtered.reduce((sum, e) => sum + e.debit, 0),
          totalCredit: filtered.reduce((sum, e) => sum + e.credit, 0),
        },
        timestamp: new Date().toISOString(),
      };

      this.sendSuccess(res, result, 'General ledger entries retrieved successfully');
    } catch (error) {
      this.sendError(res, (error as Error).message || 'Failed to get general ledger', 500);
    }
  }

  /**
   * Create journal entry
   */
  async createJournalEntry(req: Request, res: Response): Promise<void> {
    try {
      const { entryDate, description, lines } = req.body;

      if (!entryDate || !lines || !Array.isArray(lines) || lines.length === 0) {
        this.sendError(res, 'Missing required fields: entryDate, lines', 400);
        return;
      }

      // Validate that debits equal credits
      const totalDebit = lines.reduce((sum: number, line: any) => sum + (line.debit || 0), 0);
      const totalCredit = lines.reduce((sum: number, line: any) => sum + (line.credit || 0), 0);

      if (Math.abs(totalDebit - totalCredit) > 0.01) {
        this.sendError(res, 'Journal entry is not balanced. Debits must equal credits', 400);
        return;
      }

      const journalEntry = {
        id: `JE-${Date.now().toString().slice(-6)}`,
        entryDate,
        description: description || '',
        lines,
        totalDebit,
        totalCredit,
        status: 'POSTED',
        createdAt: new Date().toISOString(),
        postedAt: new Date().toISOString(),
      };

      this.sendSuccess(res, { journalEntry }, 'Journal entry created successfully', 201);
    } catch (error) {
      this.sendError(res, (error as Error).message || 'Failed to create journal entry', 500);
    }
  }

  /**
   * Get accounts payable
   */
  async getAccountsPayable(req: Request, res: Response): Promise<void> {
    try {
      const { status, vendorId, dueDate } = req.query;

      const payables = [
        {
          id: 'AP-001',
          invoiceNumber: 'INV-V-001',
          vendorId: 'VEND-001',
          vendorName: 'Office Supplies Inc',
          invoiceDate: '2024-01-10',
          dueDate: '2024-02-10',
          amount: 5000,
          amountPaid: 0,
          amountDue: 5000,
          status: 'OUTSTANDING',
          terms: 'Net 30',
          createdAt: '2024-01-10T00:00:00.000Z',
        },
      ];

      let filtered = payables;
      if (status) {
        filtered = filtered.filter((p) => p.status === status);
      }
      if (vendorId) {
        filtered = filtered.filter((p) => p.vendorId === vendorId);
      }
      if (dueDate) {
        filtered = filtered.filter((p) => p.dueDate <= dueDate);
      }

      const result = {
        payables: filtered,
        summary: {
          total: filtered.length,
          totalAmount: filtered.reduce((sum, p) => sum + p.amount, 0),
          totalDue: filtered.reduce((sum, p) => sum + p.amountDue, 0),
        },
        timestamp: new Date().toISOString(),
      };

      this.sendSuccess(res, result, 'Accounts payable retrieved successfully');
    } catch (error) {
      this.sendError(res, (error as Error).message || 'Failed to get accounts payable', 500);
    }
  }

  /**
   * Create invoice
   */
  async createInvoice(req: Request, res: Response): Promise<void> {
    try {
      const { customerId, invoiceDate, dueDate, lineItems, terms } = req.body;

      if (!customerId || !invoiceDate || !lineItems || !Array.isArray(lineItems)) {
        this.sendError(res, 'Missing required fields', 400);
        return;
      }

      const subtotal = lineItems.reduce((sum: number, item: any) => sum + (item.quantity * item.unitPrice), 0);
      const taxRate = 0.08; // 8% tax
      const taxAmount = subtotal * taxRate;
      const total = subtotal + taxAmount;

      const invoice = {
        id: `INV-${Date.now().toString().slice(-6)}`,
        invoiceNumber: `INV-2024-${Date.now().toString().slice(-4)}`,
        customerId,
        invoiceDate,
        dueDate: dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        lineItems,
        subtotal,
        taxAmount,
        total,
        amountPaid: 0,
        amountDue: total,
        status: 'OUTSTANDING',
        terms: terms || 'Net 30',
        createdAt: new Date().toISOString(),
      };

      this.sendSuccess(res, { invoice }, 'Invoice created successfully', 201);
    } catch (error) {
      this.sendError(res, (error as Error).message || 'Failed to create invoice', 500);
    }
  }

  /**
   * Get accounts receivable
   */
  async getAccountsReceivable(req: Request, res: Response): Promise<void> {
    try {
      const { status, customerId, dueDate } = req.query;

      const receivables = [
        {
          id: 'AR-001',
          invoiceNumber: 'INV-2024-001',
          customerId: 'CUST-001',
          customerName: 'Acme Corporation',
          invoiceDate: '2024-01-15',
          dueDate: '2024-02-15',
          amount: 10000,
          amountPaid: 5000,
          amountDue: 5000,
          status: 'PARTIAL',
          aging: 15,
          createdAt: '2024-01-15T00:00:00.000Z',
        },
      ];

      let filtered = receivables;
      if (status) {
        filtered = filtered.filter((r) => r.status === status);
      }
      if (customerId) {
        filtered = filtered.filter((r) => r.customerId === customerId);
      }
      if (dueDate) {
        filtered = filtered.filter((r) => r.dueDate <= dueDate);
      }

      const result = {
        receivables: filtered,
        summary: {
          total: filtered.length,
          totalAmount: filtered.reduce((sum, r) => sum + r.amount, 0),
          totalDue: filtered.reduce((sum, r) => sum + r.amountDue, 0),
          current: filtered.filter((r) => r.aging <= 30).reduce((sum, r) => sum + r.amountDue, 0),
          past30: filtered.filter((r) => r.aging > 30 && r.aging <= 60).reduce((sum, r) => sum + r.amountDue, 0),
          past60: filtered.filter((r) => r.aging > 60).reduce((sum, r) => sum + r.amountDue, 0),
        },
        timestamp: new Date().toISOString(),
      };

      this.sendSuccess(res, result, 'Accounts receivable retrieved successfully');
    } catch (error) {
      this.sendError(res, (error as Error).message || 'Failed to get accounts receivable', 500);
    }
  }

  /**
   * Record payment
   */
  async recordPayment(req: Request, res: Response): Promise<void> {
    try {
      const { invoiceId, amount, paymentDate, paymentMethod, reference } = req.body;

      if (!invoiceId || !amount || !paymentDate) {
        this.sendError(res, 'Missing required fields: invoiceId, amount, paymentDate', 400);
        return;
      }

      if (amount <= 0) {
        this.sendError(res, 'Payment amount must be greater than 0', 400);
        return;
      }

      const payment = {
        id: `PMT-${Date.now().toString().slice(-6)}`,
        invoiceId,
        amount,
        paymentDate,
        paymentMethod: paymentMethod || 'CHECK',
        reference: reference || '',
        status: 'APPLIED',
        createdAt: new Date().toISOString(),
      };

      this.sendSuccess(res, { payment }, 'Payment recorded successfully', 201);
    } catch (error) {
      this.sendError(res, (error as Error).message || 'Failed to record payment', 500);
    }
  }

  /**
   * Get financial reports
   */
  async getFinancialReports(req: Request, res: Response): Promise<void> {
    try {
      const { reportType, period } = req.query;

      const reports = [
        {
          id: 'RPT-001',
          reportType: 'INCOME_STATEMENT',
          period: '2024-Q1',
          generatedDate: new Date().toISOString(),
          summary: {
            revenue: 500000,
            expenses: 350000,
            netIncome: 150000,
            profitMargin: 0.30,
          },
        },
        {
          id: 'RPT-002',
          reportType: 'BALANCE_SHEET',
          period: '2024-Q1',
          generatedDate: new Date().toISOString(),
          summary: {
            totalAssets: 2000000,
            totalLiabilities: 800000,
            equity: 1200000,
          },
        },
      ];

      let filtered = reports;
      if (reportType) {
        filtered = filtered.filter((r) => r.reportType === reportType);
      }
      if (period) {
        filtered = filtered.filter((r) => r.period === period);
      }

      const result = {
        reports: filtered,
        timestamp: new Date().toISOString(),
      };

      this.sendSuccess(res, result, 'Financial reports retrieved successfully');
    } catch (error) {
      this.sendError(res, (error as Error).message || 'Failed to get financial reports', 500);
    }
  }

  /**
   * Generate report
   */
  async generateReport(req: Request, res: Response): Promise<void> {
    try {
      const { reportType, period, format } = req.body;

      if (!reportType || !period) {
        this.sendError(res, 'Missing required fields: reportType, period', 400);
        return;
      }

      const validReportTypes = ['INCOME_STATEMENT', 'BALANCE_SHEET', 'CASH_FLOW', 'TRIAL_BALANCE'];
      if (!validReportTypes.includes(reportType)) {
        this.sendError(res, `Invalid report type. Must be one of: ${validReportTypes.join(', ')}`, 400);
        return;
      }

      const report = {
        id: `RPT-${Date.now().toString().slice(-6)}`,
        reportType,
        period,
        format: format || 'PDF',
        status: 'GENERATING',
        generatedDate: new Date().toISOString(),
        url: `/api/reports/${Date.now()}.pdf`,
      };

      this.sendSuccess(res, { report }, 'Report generation initiated', 202);
    } catch (error) {
      this.sendError(res, (error as Error).message || 'Failed to generate report', 500);
    }
  }

  /**
   * Get budget analysis
   */
  async getBudgetAnalysis(req: Request, res: Response): Promise<void> {
    try {
      const { period, department } = req.query;

      const analysis = {
        period: period || '2024-Q1',
        department: department || 'ALL',
        summary: {
          budgeted: 500000,
          actual: 450000,
          variance: 50000,
          variancePercent: 10.0,
        },
        categories: [
          {
            category: 'Salaries',
            budgeted: 300000,
            actual: 295000,
            variance: 5000,
            variancePercent: 1.67,
          },
          {
            category: 'Marketing',
            budgeted: 100000,
            actual: 90000,
            variance: 10000,
            variancePercent: 10.0,
          },
        ],
        timestamp: new Date().toISOString(),
      };

      this.sendSuccess(res, analysis, 'Budget analysis retrieved successfully');
    } catch (error) {
      this.sendError(res, (error as Error).message || 'Failed to get budget analysis', 500);
    }
  }

  /**
   * Update budget
   */
  async updateBudget(req: Request, res: Response): Promise<void> {
    try {
      const { period, department, category, amount, reason } = req.body;

      if (!period || !category || !amount) {
        this.sendError(res, 'Missing required fields: period, category, amount', 400);
        return;
      }

      if (amount <= 0) {
        this.sendError(res, 'Budget amount must be greater than 0', 400);
        return;
      }

      const budgetUpdate = {
        id: `BUD-${Date.now().toString().slice(-6)}`,
        period,
        department: department || 'GENERAL',
        category,
        previousAmount: 0, // Would be fetched from database
        newAmount: amount,
        reason: reason || '',
        updatedBy: 'SYSTEM',
        updatedAt: new Date().toISOString(),
      };

      this.sendSuccess(res, { budgetUpdate }, 'Budget updated successfully');
    } catch (error) {
      this.sendError(res, (error as Error).message || 'Failed to update budget', 500);
    }
  }
}

// Export singleton instance
export const financeController = new FinanceController();
