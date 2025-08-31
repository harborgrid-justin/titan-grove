/**
 * Financial Module Data Access Layer
 * Repositories for financial entities
 */

import { BaseRepositoryImpl } from '../../../shared/data-access/base-repository';
import { generateId } from '../../../shared/utils/id-generator';
import type { 
  GeneralLedgerEntry,
  Account,
  Invoice,
  InvoiceItem
} from '../types';

/**
 * General Ledger Repository
 */
export class GeneralLedgerRepository extends BaseRepositoryImpl<GeneralLedgerEntry> {
  protected generateId(): string {
    return generateId('gl');
  }
}

/**
 * Account Repository
 */
export class AccountRepository extends BaseRepositoryImpl<Account> {
  protected generateId(): string {
    return generateId('acct');
  }
}

/**
 * Invoice Repository
 */
export class InvoiceRepository extends BaseRepositoryImpl<Invoice> {
  protected generateId(): string {
    return generateId('inv');
  }
}

/**
 * Invoice Item Repository
 */
export class InvoiceItemRepository extends BaseRepositoryImpl<InvoiceItem> {
  protected generateId(): string {
    return generateId('inv_item');
  }
}

// Export singleton instances
export const generalLedgerRepository = new GeneralLedgerRepository();
export const accountRepository = new AccountRepository();
export const invoiceRepository = new InvoiceRepository();
export const invoiceItemRepository = new InvoiceItemRepository();