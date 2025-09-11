/**
 * Financial Management Module Types
 * Core interfaces and types for financial management system
 */

export interface GeneralLedgerEntry {
  id: string;
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
  description: string;
  transactionDate: Date;
  reference: string;
  userId: string;
}

export interface Account {
  id: string;
  code: string;
  name: string;
  type: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';
  parentCode?: string;
  balance: number;
  isActive: boolean;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  amount: number;
  taxAmount: number;
  totalAmount: number;
  dueDate: Date;
  status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  items: InvoiceItem[];
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  taxRate: number;
}
