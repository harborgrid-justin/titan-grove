/**
 * Model Tests
 * Tests for data models and type definitions
 */

import { 
  Employee, 
  PayrollRecord, 
  PerformanceReview,
  HRMetrics,
  BenefitPlan
} from '../../src/modules/hr/types';

import { 
  Customer, 
  Lead, 
  Opportunity, 
  SupportCase,
  CRMAnalytics,
  CustomerHealthScore
} from '../../src/modules/crm/types';

describe('HR Model Tests', () => {
  describe('Employee Model', () => {
    it('should create valid employee with all required fields', () => {
      const employee: Employee = {
        id: 'emp_001',
        employeeNumber: 'EMP001',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@company.com',
        phone: '+1-555-0100',
        dateOfBirth: new Date('1990-05-15'),
        hireDate: new Date('2024-01-15'),
        department: 'Engineering',
        position: 'Software Engineer',
        salary: 75000,
        status: 'ACTIVE',
        address: {
          street: '123 Main St',
          city: 'Anytown',
          state: 'CA',
          zipCode: '12345',
          country: 'US',
        },
        emergencyContact: {
          name: 'Jane Doe',
          relationship: 'Spouse',
          phone: '+1-555-0101',
        },
      };

      expect(employee.id).toBe('emp_001');
      expect(employee.status).toBe('ACTIVE');
      expect(employee.salary).toBeGreaterThan(0);
      expect(employee.address.country).toBe('US');
      expect(employee.emergencyContact.relationship).toBe('Spouse');
    });

    it('should validate employee status enum values', () => {
      const validStatuses: Employee['status'][] = ['ACTIVE', 'INACTIVE', 'TERMINATED'];
      
      validStatuses.forEach(status => {
        const employee: Partial<Employee> = {
          id: 'test',
          status: status,
        };
        expect(['ACTIVE', 'INACTIVE', 'TERMINATED']).toContain(employee.status);
      });
    });

    it('should handle optional fields correctly', () => {
      const minimalEmployee: Employee = {
        id: 'emp_002',
        employeeNumber: 'EMP002',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@company.com',
        phone: '+1-555-0200',
        dateOfBirth: new Date('1985-08-20'),
        hireDate: new Date('2024-01-01'),
        department: 'Sales',
        position: 'Sales Rep',
        salary: 60000,
        status: 'ACTIVE',
        address: {
          street: '456 Oak St',
          city: 'Somewhere',
          state: 'NY',
          zipCode: '54321',
          country: 'US',
        },
        emergencyContact: {
          name: 'John Smith',
          relationship: 'Brother',
          phone: '+1-555-0201',
        },
      };

      expect(minimalEmployee.terminationDate).toBeUndefined();
      expect(minimalEmployee.manager).toBeUndefined();
    });
  });

  describe('Payroll Model', () => {
    it('should create valid payroll record with deductions', () => {
      const payrollRecord: PayrollRecord = {
        id: 'pay_001',
        employeeId: 'emp_001',
        payPeriodStart: new Date('2024-01-01'),
        payPeriodEnd: new Date('2024-01-15'),
        grossPay: 2000.00,
        deductions: [
          {
            type: 'TAX',
            description: 'Federal Tax',
            amount: 400.00,
          },
          {
            type: 'BENEFITS',
            description: 'Health Insurance',
            amount: 150.00,
          },
        ],
        netPay: 1450.00,
        payDate: new Date('2024-01-20'),
        status: 'PROCESSED',
      };

      expect(payrollRecord.grossPay).toBe(2000.00);
      expect(payrollRecord.deductions).toHaveLength(2);
      expect(payrollRecord.netPay).toBeLessThan(payrollRecord.grossPay);
      expect(payrollRecord.status).toBe('PROCESSED');

      const totalDeductions = payrollRecord.deductions.reduce((sum, d) => sum + d.amount, 0);
      expect(payrollRecord.netPay).toBe(payrollRecord.grossPay - totalDeductions);
    });

    it('should validate deduction types', () => {
      const validDeductionTypes: PayrollRecord['deductions'][0]['type'][] = [
        'TAX', 'BENEFITS', 'RETIREMENT', 'OTHER'
      ];

      validDeductionTypes.forEach(type => {
        const deduction = {
          type: type,
          description: 'Test deduction',
          amount: 100.00,
        };
        expect(['TAX', 'BENEFITS', 'RETIREMENT', 'OTHER']).toContain(deduction.type);
      });
    });
  });

  describe('Performance Review Model', () => {
    it('should create comprehensive performance review', () => {
      const performanceReview: PerformanceReview = {
        id: 'review_001',
        employeeId: 'emp_001',
        reviewerId: 'mgr_001',
        reviewPeriodStart: new Date('2023-01-01'),
        reviewPeriodEnd: new Date('2023-12-31'),
        reviewType: 'ANNUAL',
        status: 'COMPLETED',
        overallRating: 4.2,
        goals: [
          {
            id: 'goal_1',
            description: 'Complete certification',
            targetDate: new Date('2023-06-30'),
            weight: 30,
            status: 'COMPLETED',
            rating: 5,
            comments: 'Exceeded expectations',
          },
        ],
        competencies: [
          {
            competency: 'Technical Skills',
            expectedLevel: 4,
            actualRating: 4,
            comments: 'Strong performance',
          },
        ],
        strengths: ['Problem solving', 'Team collaboration'],
        areasForImprovement: ['Time management'],
        developmentPlan: ['Attend time management workshop'],
        reviewerComments: 'Strong performer with growth potential',
      };

      expect(performanceReview.reviewType).toBe('ANNUAL');
      expect(performanceReview.overallRating).toBeGreaterThan(0);
      expect(performanceReview.goals).toHaveLength(1);
      expect(performanceReview.competencies).toHaveLength(1);
      expect(performanceReview.goals[0].weight).toBe(30);
    });
  });

  describe('HR Metrics Model', () => {
    it('should structure HR metrics correctly', () => {
      const hrMetrics: HRMetrics = {
        headcount: {
          total: 150,
          byDepartment: {
            'Engineering': 60,
            'Sales': 40,
            'Marketing': 25,
            'HR': 15,
            'Finance': 10,
          },
          byLocation: {
            'New York': 80,
            'San Francisco': 50,
            'Remote': 20,
          },
          byEmploymentType: {
            'FULL_TIME': 140,
            'PART_TIME': 8,
            'CONTRACT': 2,
          },
        },
        turnover: {
          voluntaryRate: 8.5,
          involuntaryRate: 2.1,
          overallRate: 10.6,
          byDepartment: {
            'Engineering': 5.2,
            'Sales': 15.8,
            'Marketing': 12.1,
          },
        },
        recruitment: {
          timeToFill: 35, // days
          costPerHire: 5000,
          sourceEffectiveness: {
            'REFERRAL': 0.45,
            'JOB_BOARD': 0.25,
            'RECRUITING_AGENCY': 0.20,
            'CAREER_FAIR': 0.10,
          },
          offerAcceptanceRate: 0.85,
        },
        engagement: {
          satisfactionScore: 4.2,
          engagementScore: 4.0,
          retentionRate: 0.89,
          promotionRate: 0.15,
        },
      };

      expect(hrMetrics.headcount.total).toBe(150);
      expect(hrMetrics.turnover.overallRate).toBeCloseTo(10.6);
      expect(hrMetrics.recruitment.offerAcceptanceRate).toBeLessThanOrEqual(1);
      expect(hrMetrics.engagement.retentionRate).toBeGreaterThan(0.8);
    });
  });
});

describe('CRM Model Tests', () => {
  describe('Customer Model', () => {
    it('should create valid customer with all business fields', () => {
      const customer: Customer = {
        id: 'cust_001',
        customerNumber: 'CUST001',
        name: 'Acme Corporation',
        type: 'COMPANY',
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
        status: 'ACTIVE',
        assignedSalesRep: 'rep_001',
        createdDate: new Date('2024-01-01'),
        lastContactDate: new Date('2024-01-15'),
        totalRevenue: 50000,
      };

      expect(customer.type).toBe('COMPANY');
      expect(customer.status).toBe('ACTIVE');
      expect(customer.totalRevenue).toBeGreaterThan(0);
      expect(customer.address.country).toBe('US');
    });

    it('should validate customer types and statuses', () => {
      const validTypes: Customer['type'][] = ['INDIVIDUAL', 'COMPANY'];
      const validStatuses: Customer['status'][] = ['PROSPECT', 'ACTIVE', 'INACTIVE', 'CHURNED'];

      validTypes.forEach(type => {
        expect(['INDIVIDUAL', 'COMPANY']).toContain(type);
      });

      validStatuses.forEach(status => {
        expect(['PROSPECT', 'ACTIVE', 'INACTIVE', 'CHURNED']).toContain(status);
      });
    });
  });

  describe('Lead Model', () => {
    it('should create valid lead with scoring', () => {
      const lead: Lead = {
        id: 'lead_001',
        firstName: 'John',
        lastName: 'Smith',
        company: 'Potential Corp',
        email: 'john@potential.com',
        phone: '+1-555-0200',
        source: 'WEBSITE',
        status: 'QUALIFIED',
        score: 75,
        assignedTo: 'rep_001',
        notes: 'Interested in enterprise features',
        createdDate: new Date('2024-01-01'),
        lastActivityDate: new Date('2024-01-10'),
      };

      expect(lead.score).toBeGreaterThan(0);
      expect(lead.score).toBeLessThanOrEqual(100);
      expect(lead.source).toBe('WEBSITE');
      expect(lead.status).toBe('QUALIFIED');
    });

    it('should validate lead sources and statuses', () => {
      const validSources: Lead['source'][] = [
        'WEBSITE', 'REFERRAL', 'COLD_CALL', 'MARKETING', 'TRADE_SHOW', 'OTHER'
      ];
      const validStatuses: Lead['status'][] = [
        'NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'LOST'
      ];

      validSources.forEach(source => {
        expect(['WEBSITE', 'REFERRAL', 'COLD_CALL', 'MARKETING', 'TRADE_SHOW', 'OTHER']).toContain(source);
      });

      validStatuses.forEach(status => {
        expect(['NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'LOST']).toContain(status);
      });
    });
  });

  describe('Opportunity Model', () => {
    it('should create valid opportunity with products', () => {
      const opportunity: Opportunity = {
        id: 'opp_001',
        name: 'Acme Corp - CRM Implementation',
        customerId: 'cust_001',
        amount: 50000,
        probability: 75,
        stage: 'PROPOSAL',
        expectedCloseDate: new Date('2024-03-31'),
        ownerId: 'rep_001',
        description: 'Complete CRM system implementation',
        competitors: ['Salesforce', 'HubSpot'],
        products: [
          {
            productId: 'prod_001',
            productName: 'CRM Enterprise',
            quantity: 1,
            unitPrice: 50000,
            totalAmount: 50000,
          },
        ],
      };

      expect(opportunity.probability).toBeGreaterThan(0);
      expect(opportunity.probability).toBeLessThanOrEqual(100);
      expect(opportunity.stage).toBe('PROPOSAL');
      expect(opportunity.products).toHaveLength(1);
      expect(opportunity.competitors).toHaveLength(2);
    });

    it('should validate opportunity stages', () => {
      const validStages: Opportunity['stage'][] = [
        'PROSPECTING', 'QUALIFICATION', 'PROPOSAL', 'NEGOTIATION', 'CLOSED_WON', 'CLOSED_LOST'
      ];

      validStages.forEach(stage => {
        expect(['PROSPECTING', 'QUALIFICATION', 'PROPOSAL', 'NEGOTIATION', 'CLOSED_WON', 'CLOSED_LOST']).toContain(stage);
      });
    });
  });

  describe('Support Case Model', () => {
    it('should create valid support case with proper classification', () => {
      const supportCase: SupportCase = {
        id: 'case_001',
        caseNumber: 'CASE-001',
        customerId: 'cust_001',
        subject: 'Login Issues',
        description: 'Customer unable to login after password reset',
        priority: 'HIGH',
        status: 'OPEN',
        assignedTo: 'agent_001',
        createdDate: new Date('2024-01-01'),
        category: 'TECHNICAL',
      };

      expect(supportCase.priority).toBe('HIGH');
      expect(supportCase.status).toBe('OPEN');
      expect(supportCase.category).toBe('TECHNICAL');
      expect(supportCase.caseNumber).toMatch(/^CASE-/);
    });

    it('should validate case priorities, statuses, and categories', () => {
      const validPriorities: SupportCase['priority'][] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
      const validStatuses: SupportCase['status'][] = ['OPEN', 'IN_PROGRESS', 'WAITING_CUSTOMER', 'RESOLVED', 'CLOSED'];
      const validCategories: SupportCase['category'][] = ['TECHNICAL', 'BILLING', 'GENERAL', 'FEATURE_REQUEST'];

      validPriorities.forEach(priority => {
        expect(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).toContain(priority);
      });

      validStatuses.forEach(status => {
        expect(['OPEN', 'IN_PROGRESS', 'WAITING_CUSTOMER', 'RESOLVED', 'CLOSED']).toContain(status);
      });

      validCategories.forEach(category => {
        expect(['TECHNICAL', 'BILLING', 'GENERAL', 'FEATURE_REQUEST']).toContain(category);
      });
    });
  });

  describe('CRM Analytics Model', () => {
    it('should structure CRM analytics correctly', () => {
      const crmAnalytics: CRMAnalytics = {
        salesMetrics: {
          totalRevenue: 1500000,
          newCustomers: 25,
          pipelineValue: 750000,
          winRate: 0.35,
          averageDealSize: 30000,
          salesCycle: 45, // days
        },
        customerMetrics: {
          totalCustomers: 150,
          activeCustomers: 120,
          churnRate: 0.08,
          customerLifetimeValue: 75000,
          customerSatisfaction: 4.2,
          netPromoterScore: 8.5,
        },
        serviceMetrics: {
          totalCases: 85,
          resolvedCases: 78,
          averageResolutionTime: 24, // hours
          firstCallResolution: 0.65,
          customerSatisfaction: 4.0,
          escalationRate: 0.12,
        },
      };

      expect(crmAnalytics.salesMetrics.winRate).toBeLessThanOrEqual(1);
      expect(crmAnalytics.customerMetrics.churnRate).toBeLessThanOrEqual(1);
      expect(crmAnalytics.serviceMetrics.firstCallResolution).toBeLessThanOrEqual(1);
      expect(crmAnalytics.customerMetrics.customerSatisfaction).toBeGreaterThan(0);
    });
  });

  describe('Customer Health Score Model', () => {
    it('should create comprehensive customer health score', () => {
      const healthScore: CustomerHealthScore = {
        customerId: 'cust_001',
        score: 85,
        factors: [
          {
            factor: 'Revenue Trend',
            weight: 0.3,
            score: 90,
            trend: 'IMPROVING',
          },
          {
            factor: 'Engagement Level',
            weight: 0.25,
            score: 80,
            trend: 'STABLE',
          },
          {
            factor: 'Support Satisfaction',
            weight: 0.2,
            score: 85,
            trend: 'STABLE',
          },
        ],
        riskLevel: 'LOW',
        recommendations: [],
        lastCalculated: new Date('2024-01-15'),
      };

      expect(healthScore.score).toBeGreaterThan(0);
      expect(healthScore.score).toBeLessThanOrEqual(100);
      expect(healthScore.factors).toHaveLength(3);
      expect(['LOW', 'MEDIUM', 'HIGH']).toContain(healthScore.riskLevel);
      
      // Verify factor weights sum to reasonable total
      const totalWeight = healthScore.factors.reduce((sum, f) => sum + f.weight, 0);
      expect(totalWeight).toBeLessThanOrEqual(1.0);
    });
  });
});

describe('Model Integration and Relationships', () => {
  it('should maintain referential integrity between related models', () => {
    const customerId = 'cust_001';
    
    const customer: Customer = {
      id: customerId,
      customerNumber: 'CUST001',
      name: 'Test Corp',
      type: 'COMPANY',
      email: 'test@corp.com',
      phone: '+1-555-0100',
      address: {
        street: '123 Test St',
        city: 'Test City',
        state: 'TS',
        zipCode: '12345',
        country: 'US',
      },
      status: 'ACTIVE',
      createdDate: new Date(),
      totalRevenue: 0,
    };

    const opportunity: Opportunity = {
      id: 'opp_001',
      name: 'Test Corp Deal',
      customerId: customerId, // References customer
      amount: 25000,
      probability: 50,
      stage: 'PROPOSAL',
      expectedCloseDate: new Date('2024-03-31'),
      ownerId: 'rep_001',
      description: 'Test opportunity',
      competitors: [],
      products: [],
    };

    const supportCase: SupportCase = {
      id: 'case_001',
      caseNumber: 'CASE-001',
      customerId: customerId, // References same customer
      subject: 'Test Case',
      description: 'Test support case',
      priority: 'MEDIUM',
      status: 'OPEN',
      createdDate: new Date(),
      category: 'GENERAL',
    };

    expect(customer.id).toBe(customerId);
    expect(opportunity.customerId).toBe(customerId);
    expect(supportCase.customerId).toBe(customerId);
  });

  it('should validate cross-model data consistency', () => {
    const employeeId = 'emp_001';
    
    const employee: Employee = {
      id: employeeId,
      employeeNumber: 'EMP001',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@company.com',
      phone: '+1-555-0100',
      dateOfBirth: new Date('1990-01-01'),
      hireDate: new Date('2024-01-01'),
      department: 'Sales',
      position: 'Sales Rep',
      salary: 60000,
      status: 'ACTIVE',
      address: {
        street: '123 Main St',
        city: 'Anytown',
        state: 'ST',
        zipCode: '12345',
        country: 'US',
      },
      emergencyContact: {
        name: 'Jane Doe',
        relationship: 'Spouse',
        phone: '+1-555-0101',
      },
    };

    const payrollRecord: PayrollRecord = {
      id: 'pay_001',
      employeeId: employeeId, // References employee
      payPeriodStart: new Date('2024-01-01'),
      payPeriodEnd: new Date('2024-01-15'),
      grossPay: 2000,
      deductions: [],
      netPay: 2000,
      payDate: new Date('2024-01-20'),
      status: 'PROCESSED',
    };

    const performanceReview: PerformanceReview = {
      id: 'review_001',
      employeeId: employeeId, // References same employee
      reviewerId: 'mgr_001',
      reviewPeriodStart: new Date('2023-01-01'),
      reviewPeriodEnd: new Date('2023-12-31'),
      reviewType: 'ANNUAL',
      status: 'DRAFT',
      overallRating: 0,
      goals: [],
      competencies: [],
      strengths: [],
      areasForImprovement: [],
      developmentPlan: [],
      reviewerComments: '',
    };

    expect(employee.id).toBe(employeeId);
    expect(payrollRecord.employeeId).toBe(employeeId);
    expect(performanceReview.employeeId).toBe(employeeId);
  });
});