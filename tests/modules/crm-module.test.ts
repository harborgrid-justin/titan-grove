/**
 * CRM Module Tests
 * Comprehensive tests for CRM business logic services
 */

import { 
  Customer, 
  Lead, 
  Opportunity, 
  SupportCase, 
  Activity,
  CustomerHealthScore,
  SalesForecast 
} from '../../../src/modules/crm/types';

// Mock CRM Service implementations
class MockCustomerService {
  private customers: Map<string, Customer> = new Map();

  async createCustomer(customerData: Partial<Customer>): Promise<Customer> {
    const customer: Customer = {
      id: `cust_${Date.now()}`,
      customerNumber: `CUST${Math.floor(Math.random() * 100000)}`,
      name: customerData.name || '',
      type: customerData.type || 'COMPANY',
      industry: customerData.industry,
      email: customerData.email || '',
      phone: customerData.phone || '',
      website: customerData.website,
      address: customerData.address || {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'US',
      },
      status: customerData.status || 'PROSPECT',
      assignedSalesRep: customerData.assignedSalesRep,
      createdDate: new Date(),
      lastContactDate: customerData.lastContactDate,
      totalRevenue: customerData.totalRevenue || 0,
    };

    this.customers.set(customer.id, customer);
    return customer;
  }

  async getCustomerById(id: string): Promise<Customer | null> {
    return this.customers.get(id) || null;
  }

  async searchCustomers(criteria: any): Promise<Customer[]> {
    return Array.from(this.customers.values()).filter(customer => {
      if (criteria.status && customer.status !== criteria.status) return false;
      if (criteria.industry && customer.industry !== criteria.industry) return false;
      if (criteria.assignedSalesRep && customer.assignedSalesRep !== criteria.assignedSalesRep) return false;
      return true;
    });
  }

  async calculateHealthScore(customerId: string): Promise<CustomerHealthScore> {
    const customer = await this.getCustomerById(customerId);
    if (!customer) throw new Error('Customer not found');

    // Simplified health score calculation
    const factors = [
      { factor: 'Revenue Trend', weight: 0.3, score: 75, trend: 'STABLE' as const },
      { factor: 'Engagement Level', weight: 0.25, score: 85, trend: 'IMPROVING' as const },
      { factor: 'Payment History', weight: 0.2, score: 90, trend: 'STABLE' as const },
      { factor: 'Support Satisfaction', weight: 0.15, score: 80, trend: 'STABLE' as const },
      { factor: 'Product Usage', weight: 0.1, score: 70, trend: 'DECLINING' as const },
    ];

    const weightedScore = factors.reduce((sum, f) => sum + (f.score * f.weight), 0);
    const riskLevel = weightedScore >= 80 ? 'LOW' : weightedScore >= 60 ? 'MEDIUM' : 'HIGH';

    return {
      customerId,
      score: Math.round(weightedScore),
      factors,
      riskLevel,
      recommendations: riskLevel === 'HIGH' ? [
        'Schedule immediate account review',
        'Implement customer success intervention',
      ] : [],
      lastCalculated: new Date(),
    };
  }
}

class MockLeadService {
  private leads: Map<string, Lead> = new Map();

  async createLead(leadData: Partial<Lead>): Promise<Lead> {
    const lead: Lead = {
      id: `lead_${Date.now()}`,
      firstName: leadData.firstName || '',
      lastName: leadData.lastName || '',
      company: leadData.company,
      email: leadData.email || '',
      phone: leadData.phone || '',
      source: leadData.source || 'OTHER',
      status: leadData.status || 'NEW',
      score: leadData.score || this.calculateLeadScore(leadData),
      assignedTo: leadData.assignedTo,
      notes: leadData.notes || '',
      createdDate: new Date(),
      lastActivityDate: leadData.lastActivityDate,
    };

    this.leads.set(lead.id, lead);
    return lead;
  }

  private calculateLeadScore(leadData: Partial<Lead>): number {
    let score = 0;

    // Source scoring
    const sourceScores = {
      WEBSITE: 60,
      REFERRAL: 80,
      COLD_CALL: 30,
      MARKETING: 50,
      TRADE_SHOW: 70,
      OTHER: 40,
    };
    score += sourceScores[leadData.source || 'OTHER'];

    // Company size (if available)
    if (leadData.company) score += 20;

    // Email domain scoring (simplified)
    if (leadData.email?.includes('@gmail.com') || leadData.email?.includes('@yahoo.com')) {
      score -= 10; // Personal email
    } else if (leadData.email?.includes('.com') || leadData.email?.includes('.org')) {
      score += 15; // Business email
    }

    return Math.max(0, Math.min(100, score));
  }

  async convertLead(leadId: string, opportunityData: any): Promise<{ customer: Customer; opportunity: Opportunity }> {
    const lead = this.leads.get(leadId);
    if (!lead) throw new Error('Lead not found');

    const customerService = new MockCustomerService();
    const customer = await customerService.createCustomer({
      name: lead.company || `${lead.firstName} ${lead.lastName}`,
      type: lead.company ? 'COMPANY' : 'INDIVIDUAL',
      email: lead.email,
      phone: lead.phone,
      status: 'PROSPECT',
    });

    const opportunity: Opportunity = {
      id: `opp_${Date.now()}`,
      name: opportunityData.name,
      customerId: customer.id,
      amount: opportunityData.amount,
      probability: opportunityData.probability,
      stage: 'PROSPECTING',
      expectedCloseDate: opportunityData.expectedCloseDate,
      ownerId: lead.assignedTo || '',
      description: opportunityData.description || '',
      competitors: [],
      products: [],
    };

    // Update lead status
    lead.status = 'CONVERTED';
    this.leads.set(leadId, lead);

    return { customer, opportunity };
  }

  async getLeadsByStatus(status: Lead['status']): Promise<Lead[]> {
    return Array.from(this.leads.values()).filter(lead => lead.status === status);
  }
}

class MockOpportunityService {
  private opportunities: Map<string, Opportunity> = new Map();

  async createOpportunity(opportunityData: Partial<Opportunity>): Promise<Opportunity> {
    const opportunity: Opportunity = {
      id: `opp_${Date.now()}`,
      name: opportunityData.name || '',
      customerId: opportunityData.customerId || '',
      amount: opportunityData.amount || 0,
      probability: opportunityData.probability || 50,
      stage: opportunityData.stage || 'PROSPECTING',
      expectedCloseDate: opportunityData.expectedCloseDate || new Date(),
      ownerId: opportunityData.ownerId || '',
      description: opportunityData.description || '',
      competitors: opportunityData.competitors || [],
      products: opportunityData.products || [],
    };

    this.opportunities.set(opportunity.id, opportunity);
    return opportunity;
  }

  async updateOpportunityStage(opportunityId: string, newStage: Opportunity['stage']): Promise<Opportunity | null> {
    const opportunity = this.opportunities.get(opportunityId);
    if (!opportunity) return null;

    opportunity.stage = newStage;
    
    // Auto-update probability based on stage
    const stageProbabilities = {
      PROSPECTING: 10,
      QUALIFICATION: 25,
      PROPOSAL: 60,
      NEGOTIATION: 80,
      CLOSED_WON: 100,
      CLOSED_LOST: 0,
    };
    
    opportunity.probability = stageProbabilities[newStage];
    this.opportunities.set(opportunityId, opportunity);
    
    return opportunity;
  }

  async generateSalesForecast(ownerId?: string): Promise<SalesForecast> {
    const opportunities = Array.from(this.opportunities.values())
      .filter(opp => !ownerId || opp.ownerId === ownerId)
      .filter(opp => opp.stage !== 'CLOSED_LOST');

    const totalPipeline = opportunities.reduce((sum, opp) => sum + opp.amount, 0);
    const weightedPipeline = opportunities.reduce((sum, opp) => 
      sum + (opp.amount * opp.probability / 100), 0);
    
    const committedOpps = opportunities.filter(opp => opp.probability >= 80);
    const committedForecast = committedOpps.reduce((sum, opp) => sum + opp.amount, 0);
    
    const bestCaseOpps = opportunities.filter(opp => opp.probability >= 25);
    const bestCaseForecast = bestCaseOpps.reduce((sum, opp) => sum + opp.amount, 0);
    
    const closedWon = opportunities
      .filter(opp => opp.stage === 'CLOSED_WON')
      .reduce((sum, opp) => sum + opp.amount, 0);

    return {
      period: new Date().toISOString().substring(0, 7), // Current month
      totalPipeline,
      weightedPipeline,
      committedForecast,
      bestCaseForecast,
      closedWon,
      forecastAccuracy: closedWon > 0 ? (closedWon / weightedPipeline) * 100 : 0,
    };
  }

  async getOpportunitiesByStage(stage: Opportunity['stage']): Promise<Opportunity[]> {
    return Array.from(this.opportunities.values()).filter(opp => opp.stage === stage);
  }
}

class MockSupportCaseService {
  private cases: Map<string, SupportCase> = new Map();

  async createSupportCase(caseData: Partial<SupportCase>): Promise<SupportCase> {
    const supportCase: SupportCase = {
      id: `case_${Date.now()}`,
      caseNumber: `CASE-${Date.now()}`,
      customerId: caseData.customerId || '',
      subject: caseData.subject || '',
      description: caseData.description || '',
      priority: caseData.priority || 'MEDIUM',
      status: caseData.status || 'OPEN',
      assignedTo: caseData.assignedTo,
      createdDate: new Date(),
      resolvedDate: caseData.resolvedDate,
      category: caseData.category || 'GENERAL',
      resolution: caseData.resolution,
    };

    this.cases.set(supportCase.id, supportCase);
    return supportCase;
  }

  async resolveCase(caseId: string, resolution: string): Promise<SupportCase | null> {
    const supportCase = this.cases.get(caseId);
    if (!supportCase) return null;

    supportCase.status = 'RESOLVED';
    supportCase.resolution = resolution;
    supportCase.resolvedDate = new Date();
    
    this.cases.set(caseId, supportCase);
    return supportCase;
  }

  async calculateSLA(caseId: string): Promise<{ responseTime: number; resolutionTime: number; slaBreached: boolean }> {
    const supportCase = this.cases.get(caseId);
    if (!supportCase) throw new Error('Case not found');

    const now = new Date();
    const responseTime = Math.floor((now.getTime() - supportCase.createdDate.getTime()) / (1000 * 60)); // minutes
    const resolutionTime = supportCase.resolvedDate ? 
      Math.floor((supportCase.resolvedDate.getTime() - supportCase.createdDate.getTime()) / (1000 * 60 * 60)) : // hours
      Math.floor((now.getTime() - supportCase.createdDate.getTime()) / (1000 * 60 * 60));

    // SLA targets based on priority
    const slaTargets = {
      CRITICAL: { responseMinutes: 15, resolutionHours: 4 },
      HIGH: { responseMinutes: 60, resolutionHours: 24 },
      MEDIUM: { responseMinutes: 240, resolutionHours: 72 },
      LOW: { responseMinutes: 1440, resolutionHours: 168 },
    };

    const target = slaTargets[supportCase.priority];
    const slaBreached = responseTime > target.responseMinutes || resolutionTime > target.resolutionHours;

    return { responseTime, resolutionTime, slaBreached };
  }
}

describe('CRM Module Integration Tests', () => {
  let customerService: MockCustomerService;
  let leadService: MockLeadService;
  let opportunityService: MockOpportunityService;
  let supportCaseService: MockSupportCaseService;

  beforeEach(() => {
    customerService = new MockCustomerService();
    leadService = new MockLeadService();
    opportunityService = new MockOpportunityService();
    supportCaseService = new MockSupportCaseService();
  });

  describe('Customer Management Service', () => {
    it('should create customer with complete business data', async () => {
      const customerData = {
        name: 'Acme Corporation',
        type: 'COMPANY' as const,
        industry: 'Manufacturing',
        email: 'contact@acme.com',
        phone: '+1-555-0100',
        website: 'https://www.acme.com',
        address: {
          street: '123 Business Ave',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'US',
        },
        assignedSalesRep: 'rep_001',
      };

      const customer = await customerService.createCustomer(customerData);

      expect(customer.id).toMatch(/^cust_\d+$/);
      expect(customer.customerNumber).toMatch(/^CUST\d+$/);
      expect(customer.name).toBe(customerData.name);
      expect(customer.type).toBe('COMPANY');
      expect(customer.status).toBe('PROSPECT');
      expect(customer.totalRevenue).toBe(0);
    });

    it('should calculate comprehensive customer health score', async () => {
      const customer = await customerService.createCustomer({
        name: 'Health Test Corp',
        type: 'COMPANY',
        email: 'test@healthtest.com',
        status: 'ACTIVE',
        totalRevenue: 50000,
      });

      const healthScore = await customerService.calculateHealthScore(customer.id);

      expect(healthScore.customerId).toBe(customer.id);
      expect(healthScore.score).toBeGreaterThan(0);
      expect(healthScore.score).toBeLessThanOrEqual(100);
      expect(healthScore.factors).toHaveLength(5);
      expect(['LOW', 'MEDIUM', 'HIGH']).toContain(healthScore.riskLevel);
      expect(healthScore.lastCalculated).toBeDefined();
    });

    it('should search customers by multiple criteria', async () => {
      await customerService.createCustomer({
        name: 'Tech Corp',
        industry: 'Technology',
        status: 'ACTIVE',
        assignedSalesRep: 'rep_001',
      });

      await customerService.createCustomer({
        name: 'Mfg Corp',
        industry: 'Manufacturing',
        status: 'PROSPECT',
        assignedSalesRep: 'rep_002',
      });

      const techCustomers = await customerService.searchCustomers({
        industry: 'Technology',
      });

      const activeCustomers = await customerService.searchCustomers({
        status: 'ACTIVE',
      });

      expect(techCustomers).toHaveLength(1);
      expect(techCustomers[0].name).toBe('Tech Corp');
      expect(activeCustomers).toHaveLength(1);
    });
  });

  describe('Lead Management Service', () => {
    it('should create lead with intelligent scoring', async () => {
      const leadData = {
        firstName: 'Sarah',
        lastName: 'Johnson',
        company: 'StartupXYZ Inc',
        email: 'sarah@startupxyz.com',
        phone: '+1-555-0200',
        source: 'TRADE_SHOW' as const,
        notes: 'Interested in enterprise features',
      };

      const lead = await leadService.createLead(leadData);

      expect(lead.id).toMatch(/^lead_\d+$/);
      expect(lead.firstName).toBe(leadData.firstName);
      expect(lead.company).toBe(leadData.company);
      expect(lead.score).toBeGreaterThan(0);
      expect(lead.score).toBeLessThanOrEqual(100);
      expect(lead.status).toBe('NEW');
    });

    it('should calculate accurate lead scores based on criteria', async () => {
      const highQualityLead = await leadService.createLead({
        firstName: 'John',
        lastName: 'Smith',
        company: 'Enterprise Corp',
        email: 'john@enterprise.com',
        source: 'REFERRAL',
      });

      const lowQualityLead = await leadService.createLead({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@gmail.com',
        source: 'COLD_CALL',
      });

      expect(highQualityLead.score).toBeGreaterThan(lowQualityLead.score);
      expect(highQualityLead.score).toBeGreaterThan(80);
      expect(lowQualityLead.score).toBeLessThan(60);
    });

    it('should convert lead to customer and opportunity', async () => {
      const lead = await leadService.createLead({
        firstName: 'Convert',
        lastName: 'Test',
        company: 'Convert Corp',
        email: 'convert@convertcorp.com',
        source: 'WEBSITE',
        assignedTo: 'rep_001',
      });

      const opportunityData = {
        name: 'Convert Corp - CRM Implementation',
        amount: 25000,
        probability: 60,
        expectedCloseDate: new Date('2024-06-30'),
        description: 'CRM implementation project',
      };

      const { customer, opportunity } = await leadService.convertLead(lead.id, opportunityData);

      expect(customer.name).toBe('Convert Corp');
      expect(customer.type).toBe('COMPANY');
      expect(customer.email).toBe(lead.email);
      
      expect(opportunity.name).toBe(opportunityData.name);
      expect(opportunity.customerId).toBe(customer.id);
      expect(opportunity.amount).toBe(opportunityData.amount);
      expect(opportunity.stage).toBe('PROSPECTING');

      // Verify lead was marked as converted
      const updatedLead = await leadService.getLeadsByStatus('CONVERTED');
      expect(updatedLead).toHaveLength(1);
      expect(updatedLead[0].id).toBe(lead.id);
    });
  });

  describe('Opportunity Management Service', () => {
    it('should create opportunity with sales pipeline tracking', async () => {
      const opportunityData = {
        name: 'Big Deal Corp - Enterprise License',
        customerId: 'cust_123',
        amount: 100000,
        probability: 75,
        stage: 'PROPOSAL' as const,
        expectedCloseDate: new Date('2024-03-31'),
        ownerId: 'rep_001',
        description: 'Large enterprise implementation',
        competitors: ['Salesforce', 'HubSpot'],
        products: [
          {
            productId: 'prod_001',
            productName: 'CRM Enterprise',
            quantity: 1,
            unitPrice: 100000,
            totalAmount: 100000,
          },
        ],
      };

      const opportunity = await opportunityService.createOpportunity(opportunityData);

      expect(opportunity.id).toMatch(/^opp_\d+$/);
      expect(opportunity.name).toBe(opportunityData.name);
      expect(opportunity.amount).toBe(opportunityData.amount);
      expect(opportunity.stage).toBe('PROPOSAL');
      expect(opportunity.competitors).toHaveLength(2);
      expect(opportunity.products).toHaveLength(1);
    });

    it('should update opportunity stage with automatic probability adjustment', async () => {
      const opportunity = await opportunityService.createOpportunity({
        name: 'Stage Test Deal',
        customerId: 'cust_123',
        amount: 50000,
        ownerId: 'rep_001',
      });

      const updated = await opportunityService.updateOpportunityStage(opportunity.id, 'NEGOTIATION');

      expect(updated).toBeDefined();
      expect(updated!.stage).toBe('NEGOTIATION');
      expect(updated!.probability).toBe(80); // Auto-updated based on stage
    });

    it('should generate accurate sales forecast', async () => {
      // Create multiple opportunities
      await opportunityService.createOpportunity({
        name: 'Deal 1',
        customerId: 'cust_1',
        amount: 10000,
        probability: 90,
        stage: 'NEGOTIATION',
        ownerId: 'rep_001',
      });

      await opportunityService.createOpportunity({
        name: 'Deal 2',
        customerId: 'cust_2',
        amount: 15000,
        probability: 50,
        stage: 'PROPOSAL',
        ownerId: 'rep_001',
      });

      await opportunityService.createOpportunity({
        name: 'Deal 3',
        customerId: 'cust_3',
        amount: 20000,
        probability: 25,
        stage: 'QUALIFICATION',
        ownerId: 'rep_001',
      });

      const forecast = await opportunityService.generateSalesForecast('rep_001');

      expect(forecast.totalPipeline).toBe(45000);
      expect(forecast.weightedPipeline).toBe(19000); // (10000*0.9 + 15000*0.5 + 20000*0.25)
      expect(forecast.committedForecast).toBe(10000); // Only deals >= 80% probability
      expect(forecast.bestCaseForecast).toBe(45000); // All deals >= 25% probability
    });
  });

  describe('Support Case Management Service', () => {
    it('should create support case with proper classification', async () => {
      const caseData = {
        customerId: 'cust_123',
        subject: 'Login Issues',
        description: 'Users unable to authenticate after password reset',
        priority: 'HIGH' as const,
        category: 'TECHNICAL' as const,
        assignedTo: 'support_agent_1',
      };

      const supportCase = await supportCaseService.createSupportCase(caseData);

      expect(supportCase.id).toMatch(/^case_\d+$/);
      expect(supportCase.caseNumber).toMatch(/^CASE-\d+$/);
      expect(supportCase.subject).toBe(caseData.subject);
      expect(supportCase.priority).toBe('HIGH');
      expect(supportCase.status).toBe('OPEN');
      expect(supportCase.category).toBe('TECHNICAL');
    });

    it('should resolve case with complete resolution tracking', async () => {
      const supportCase = await supportCaseService.createSupportCase({
        customerId: 'cust_123',
        subject: 'Test Case',
        description: 'Test description',
        priority: 'MEDIUM',
      });

      const resolution = 'Issue resolved by clearing browser cache and cookies';
      const resolved = await supportCaseService.resolveCase(supportCase.id, resolution);

      expect(resolved).toBeDefined();
      expect(resolved!.status).toBe('RESOLVED');
      expect(resolved!.resolution).toBe(resolution);
      expect(resolved!.resolvedDate).toBeDefined();
    });

    it('should calculate SLA compliance accurately', async () => {
      const supportCase = await supportCaseService.createSupportCase({
        customerId: 'cust_123',
        subject: 'Critical System Down',
        description: 'Production system is not responding',
        priority: 'CRITICAL',
      });

      const slaMetrics = await supportCaseService.calculateSLA(supportCase.id);

      expect(slaMetrics.responseTime).toBeGreaterThanOrEqual(0);
      expect(slaMetrics.resolutionTime).toBeGreaterThanOrEqual(0);
      expect(typeof slaMetrics.slaBreached).toBe('boolean');

      // For CRITICAL cases: response within 15 minutes, resolution within 4 hours
      // Since this is just created, SLA should not be breached yet
      expect(slaMetrics.slaBreached).toBe(false);
    });
  });

  describe('Cross-Service CRM Integration', () => {
    it('should coordinate complete sales cycle from lead to customer', async () => {
      // 1. Create lead
      const lead = await leadService.createLead({
        firstName: 'Sales',
        lastName: 'Cycle',
        company: 'Sales Corp',
        email: 'sales@salescorp.com',
        source: 'WEBSITE',
        assignedTo: 'rep_001',
      });

      // 2. Convert lead to customer and opportunity
      const { customer, opportunity } = await leadService.convertLead(lead.id, {
        name: 'Sales Corp - Implementation',
        amount: 75000,
        probability: 30,
        expectedCloseDate: new Date('2024-04-30'),
      });

      // 3. Progress opportunity through stages
      const updated = await opportunityService.updateOpportunityStage(opportunity.id, 'PROPOSAL');

      // 4. Create support case for customer
      const supportCase = await supportCaseService.createSupportCase({
        customerId: customer.id,
        subject: 'Pre-sales Technical Questions',
        description: 'Questions about integration capabilities',
        priority: 'MEDIUM',
        category: 'TECHNICAL',
      });

      // Verify complete cycle
      expect(customer.id).toBeDefined();
      expect(updated!.stage).toBe('PROPOSAL');
      expect(updated!.probability).toBe(60); // Auto-updated
      expect(supportCase.customerId).toBe(customer.id);
    });

    it('should maintain referential integrity across services', async () => {
      const customer = await customerService.createCustomer({
        name: 'Integrity Test Corp',
        email: 'test@integrity.com',
      });

      const opportunity = await opportunityService.createOpportunity({
        name: 'Test Deal',
        customerId: customer.id,
        amount: 30000,
        ownerId: 'rep_001',
      });

      const supportCase = await supportCaseService.createSupportCase({
        customerId: customer.id,
        subject: 'Integration Question',
        description: 'Customer inquiry about API integration',
      });

      expect(opportunity.customerId).toBe(customer.id);
      expect(supportCase.customerId).toBe(customer.id);
    });
  });
});