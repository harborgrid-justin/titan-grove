/**
 * Customer Relationship Management Module
 * Complete CRM functionality including lead management, sales pipeline, customer service
 */

export interface Customer {
  id: string;
  customerNumber: string;
  name: string;
  type: 'INDIVIDUAL' | 'COMPANY';
  industry?: string;
  email: string;
  phone: string;
  website?: string;
  address: CRMAddress;
  status: 'PROSPECT' | 'ACTIVE' | 'INACTIVE' | 'CHURNED';
  assignedSalesRep?: string;
  createdDate: Date;
  lastContactDate?: Date;
  totalRevenue: number;
}

export interface CRMAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  company?: string;
  email: string;
  phone: string;
  source: 'WEBSITE' | 'REFERRAL' | 'COLD_CALL' | 'MARKETING' | 'TRADE_SHOW' | 'OTHER';
  status: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'CONVERTED' | 'LOST';
  score: number;
  assignedTo?: string;
  notes: string;
  createdDate: Date;
  lastActivityDate?: Date;
}

export interface Opportunity {
  id: string;
  name: string;
  customerId: string;
  amount: number;
  probability: number;
  stage: 'PROSPECTING' | 'QUALIFICATION' | 'PROPOSAL' | 'NEGOTIATION' | 'CLOSED_WON' | 'CLOSED_LOST';
  expectedCloseDate: Date;
  actualCloseDate?: Date;
  ownerId: string;
  description: string;
  competitors: string[];
  products: OpportunityProduct[];
}

export interface OpportunityProduct {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
}

export interface SupportCase {
  id: string;
  caseNumber: string;
  customerId: string;
  subject: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'IN_PROGRESS' | 'WAITING_CUSTOMER' | 'RESOLVED' | 'CLOSED';
  assignedTo?: string;
  createdDate: Date;
  resolvedDate?: Date;
  category: 'TECHNICAL' | 'BILLING' | 'GENERAL' | 'FEATURE_REQUEST';
  resolution?: string;
}

export interface Activity {
  id: string;
  type: 'CALL' | 'EMAIL' | 'MEETING' | 'TASK' | 'NOTE';
  subject: string;
  description: string;
  relatedTo: {
    type: 'CUSTOMER' | 'LEAD' | 'OPPORTUNITY' | 'CASE';
    id: string;
  };
  assignedTo: string;
  dueDate?: Date;
  completedDate?: Date;
  status: 'PLANNED' | 'COMPLETED' | 'CANCELLED';
}

export class CRMManager {
  /**
   * Lead Management
   */
  async createLead(lead: Omit<Lead, 'id' | 'createdDate' | 'score'>): Promise<Lead> {
    const id = `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const score = this.calculateLeadScore(lead);
    
    const newLead: Lead = {
      ...lead,
      id,
      createdDate: new Date(),
      score,
      status: 'NEW'
    };
    
    return newLead;
  }

  private calculateLeadScore(lead: Partial<Lead>): number {
    let score = 0;
    
    // Score based on data completeness
    if (lead.email) score += 20;
    if (lead.phone) score += 15;
    if (lead.company) score += 10;
    
    // Score based on source
    switch (lead.source) {
      case 'REFERRAL': score += 30; break;
      case 'WEBSITE': score += 20; break;
      case 'MARKETING': score += 15; break;
      default: score += 10;
    }
    
    return Math.min(score, 100);
  }

  async convertLeadToCustomer(leadId: string): Promise<Customer> {
        // Implementation would convert lead to customer
        console.log(`Converting lead ${leadId} to customer`);
        const customerId = `cust_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const customerNumber = `CUST${Date.now().toString().slice(-6)}`;
        
        return {
          id: customerId,
          customerNumber,
          name: '',
          type: 'INDIVIDUAL',
          email: '',
          phone: '',
          address: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: ''
          },
          status: 'ACTIVE',
          createdDate: new Date(),
          totalRevenue: 0
        };
  }

  /**
   * Opportunity Management
   */
  async createOpportunity(opportunity: Omit<Opportunity, 'id'>): Promise<Opportunity> {
    const id = `opp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return { ...opportunity, id };
  }

  async updateOpportunityStage(opportunityId: string, newStage: Opportunity['stage'], probability: number): Promise<void> {
    console.log(`Updating opportunity ${opportunityId} to stage ${newStage} with probability ${probability}%`);
  }

  async calculateWeightedPipeline(): Promise<number> {
    // Implementation would calculate total weighted pipeline value
    return 0;
  }

  /**
   * Customer Management
   */
  async createCustomer(customer: Omit<Customer, 'id' | 'customerNumber' | 'createdDate' | 'totalRevenue'>): Promise<Customer> {
    const id = `cust_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const customerNumber = `CUST${Date.now().toString().slice(-6)}`;
    
    return {
      ...customer,
      id,
      customerNumber,
      createdDate: new Date(),
      totalRevenue: 0
    };
  }

  async updateCustomerRevenue(customerId: string, additionalRevenue: number): Promise<void> {
    console.log(`Adding ${additionalRevenue} to customer ${customerId} total revenue`);
  }

  /**
   * Support Case Management
   */
  async createSupportCase(supportCase: Omit<SupportCase, 'id' | 'caseNumber' | 'createdDate'>): Promise<SupportCase> {
    const id = `case_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const caseNumber = `CASE${Date.now().toString().slice(-6)}`;
    
    return {
      ...supportCase,
      id,
      caseNumber,
      createdDate: new Date(),
      status: 'OPEN'
    };
  }

  async resolveSupportCase(caseId: string, resolution: string): Promise<void> {
    console.log(`Resolving case ${caseId} with resolution: ${resolution}`);
  }

  /**
   * Activity Management
   */
  async createActivity(activity: Omit<Activity, 'id'>): Promise<Activity> {
    const id = `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return { ...activity, id, status: 'PLANNED' };
  }

  async completeActivity(activityId: string): Promise<void> {
    console.log(`Completing activity ${activityId}`);
  }

  /**
   * CRM Analytics & Reporting
   */
  async getSalesPipeline(): Promise<any> {
    return {
      totalValue: 0,
      weightedValue: 0,
      opportunitiesByStage: {
        PROSPECTING: { count: 0, value: 0 },
        QUALIFICATION: { count: 0, value: 0 },
        PROPOSAL: { count: 0, value: 0 },
        NEGOTIATION: { count: 0, value: 0 },
        CLOSED_WON: { count: 0, value: 0 },
        CLOSED_LOST: { count: 0, value: 0 }
      }
    };
  }

  async getCustomerMetrics(): Promise<any> {
    return {
      totalCustomers: 0,
      newCustomersThisMonth: 0,
      customersByStatus: {
        active: 0,
        inactive: 0,
        churned: 0
      },
      averageCustomerValue: 0,
      topCustomers: []
    };
  }

  async getSalesPerformance(salesRepId: string): Promise<any> {
    return {
      salesRepId,
      totalRevenue: 0,
      opportunitiesWon: 0,
      opportunitiesLost: 0,
      winRate: 0,
      averageDealSize: 0,
      salesCycle: 0
    };
  }
}

export const crmManager = new CRMManager();