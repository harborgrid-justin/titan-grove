/**
 * Customer Relationship Management Module
 * Main orchestrator that delegates to specialized business logic services
 */

// Export all types
export * from './types';

// Export data access layer
export * from './data-access';

// Import shared utilities
import { BaseManager } from '../../shared/utils/base-manager';

// Import business logic services
import { crmLeadService } from './business-logic/lead-management/lead-management-service';
import { crmCustomerService } from './business-logic/customer-management/customer-management-service';

import type { 
  Customer, 
  Lead, 
  Opportunity, 
  SupportCase, 
  Activity 
} from './types';

export class CRMManager extends BaseManager {
  
  // Lead Management Methods - delegate to lead service
  async createLead(lead: Omit<Lead, 'id' | 'createdDate' | 'score'>): Promise<Lead> {
    const id = this.generateId('lead');
    const score = await this.calculateLeadScore(lead);
    
    const newLead: Lead = {
      ...lead,
      id,
      createdDate: new Date(),
      score,
      status: 'NEW'
    };
    
    this.logAction('createLead', { id, score });
    return newLead;
  }

  async qualifyLead(leadId: string, qualificationCriteria: any): Promise<{ qualified: boolean, score: number, reasons: string[] }> {
    return crmLeadService.qualifyLead(leadId, qualificationCriteria);
  }

  async calculateLeadScore(leadId: string): Promise<number>;
  async calculateLeadScore(lead: Partial<Lead>): Promise<number>;
  async calculateLeadScore(leadOrId: string | Partial<Lead>): Promise<number> {
    if (typeof leadOrId === 'string') {
      return crmLeadService.calculateLeadScore(leadOrId);
    }
    
    const lead = leadOrId;
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

  async assignLeadToSalesRep(leadId: string, salesRepId: string, assignmentReason: string): Promise<void> {
    return crmLeadService.assignLeadToSalesRep(leadId, salesRepId, assignmentReason);
  }

  async convertLeadToCustomer(leadId: string): Promise<Customer> {
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

  async convertLeadToOpportunity(leadId: string, opportunityData: any): Promise<string> {
    return crmLeadService.convertLeadToOpportunity(leadId, opportunityData);
  }

  // Customer Management Methods - delegate to customer service
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

  async calculateCustomerHealthScore(customerId: string): Promise<any> {
    return crmCustomerService.calculateCustomerHealthScore(customerId);
  }

  async calculateCustomerLifetimeValue(customerId: string): Promise<any> {
    return crmCustomerService.calculateCustomerLifetimeValue(customerId);
  }

  async predictChurnRisk(customerId: string): Promise<any> {
    return crmCustomerService.predictChurnRisk(customerId);
  }

  async identifyUpsellOpportunities(customerId: string): Promise<any> {
    return crmCustomerService.identifyUpsellOpportunities(customerId);
  }

  async updateCustomerRevenue(customerId: string, additionalRevenue: number): Promise<void> {
    console.log(`Adding ${additionalRevenue} to customer ${customerId} total revenue`);
  }

  // Opportunity Management Methods
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

  // Support Case Management Methods
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

  // Activity Management Methods
  async createActivity(activity: Omit<Activity, 'id'>): Promise<Activity> {
    const id = `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return { ...activity, id, status: 'PLANNED' };
  }

  async completeActivity(activityId: string): Promise<void> {
    console.log(`Completing activity ${activityId}`);
  }

  // CRM Analytics & Reporting Methods
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

  // Lead Analytics Methods
  async getLeadSourcePerformance(): Promise<any> {
    return crmLeadService.getLeadSourcePerformance();
  }

  async getLeadVelocityMetrics(): Promise<any> {
    return crmLeadService.getLeadVelocityMetrics();
  }

  async generateLeadForecast(timeframeDays: number): Promise<any> {
    return crmLeadService.generateLeadForecast(timeframeDays);
  }
}

export const crmManager = new CRMManager();

// Export business logic services for direct access if needed
export {
  crmLeadService,
  crmCustomerService
};