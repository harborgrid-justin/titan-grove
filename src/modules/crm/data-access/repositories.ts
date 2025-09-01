import { BaseRepositoryImpl } from '../../../shared/data-access/base-repository';

export class CustomerRepository extends BaseRepositoryImpl<any> {
  protected generateId(): string {
    return `customer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export class ContactRepository extends BaseRepositoryImpl<any> {
  protected generateId(): string {
    return `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export class LeadRepository extends BaseRepositoryImpl<any> {
  protected generateId(): string {
    return `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const customerRepository = new CustomerRepository();
export const contactRepository = new ContactRepository();
export const leadRepository = new LeadRepository();
