/**
 * Billing Service
 * Manages invoice generation, billing cycles, and payment processing for leases
 */

export interface LeaseBilling {
  id: string;
  leaseId: string;
  customerId: string;
  billingCycle: 'MONTHLY' | 'QUARTERLY' | 'SEMI_ANNUAL' | 'ANNUAL';
  nextBillingDate: Date;
  lastBillingDate?: Date;
  automaticBilling: boolean;
  billingAddress: BillingAddress;
  paymentMethod: PaymentMethod;
  status: 'ACTIVE' | 'SUSPENDED' | 'TERMINATED';
}

export interface BillingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface PaymentMethod {
  type: 'ACH' | 'CREDIT_CARD' | 'WIRE_TRANSFER' | 'CHECK';
  accountNumber?: string;
  routingNumber?: string;
  cardNumber?: string;
  expirationDate?: Date;
}

export interface LeaseInvoice {
  id: string;
  invoiceNumber: string;
  leaseId: string;
  customerId: string;
  billingPeriodStart: Date;
  billingPeriodEnd: Date;
  dueDate: Date;
  lineItems: InvoiceLineItem[];
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  sentDate?: Date;
  paidDate?: Date;
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  amount: number;
  taxable: boolean;
  category: 'RENT' | 'INTEREST' | 'FEE' | 'TAX' | 'OTHER';
}

export class BillingService {
  async createLeaseBilling(billing: Omit<LeaseBilling, 'id'>): Promise<LeaseBilling> {
    const id = `lb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return { ...billing, id };
  }

  async generateInvoice(
    leaseId: string,
    billingPeriodStart: Date,
    billingPeriodEnd: Date
  ): Promise<LeaseInvoice> {
    const invoiceId = `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const invoiceNumber = `INV-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;

    const lineItems: InvoiceLineItem[] = [
      {
        id: `li_${Date.now()}_1`,
        description: 'Monthly Lease Payment',
        amount: 1000,
        taxable: false,
        category: 'RENT',
      },
    ];

    const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0);
    const taxAmount = 0; // Would calculate based on taxable items

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30); // 30 days from today

    return {
      id: invoiceId,
      invoiceNumber,
      leaseId,
      customerId: 'customer_id',
      billingPeriodStart,
      billingPeriodEnd,
      dueDate,
      lineItems,
      subtotal,
      taxAmount,
      totalAmount: subtotal + taxAmount,
      status: 'DRAFT',
    };
  }

  async processAutomaticBilling(date: Date): Promise<LeaseInvoice[]> {
    // Implementation would find all leases due for billing and generate invoices
    return [];
  }

  async sendInvoice(invoiceId: string, method: 'EMAIL' | 'MAIL' | 'PORTAL'): Promise<boolean> {
    // Implementation would send invoice via specified method
    return true;
  }
}

export const billingService = new BillingService();
