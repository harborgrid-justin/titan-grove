/**
 * HR Fortune 100 Features Test
 * Tests for the comprehensive Oracle EBS competitive HR features
 */

import { hrManager } from '../src/modules/hr/index';

describe('HR Fortune 100 Competitive Features', () => {

  describe('Advanced Benefits Management', () => {
    test('should process life events', async () => {
      const lifeEvent = {
        employeeId: 'emp_test_001',
        eventType: 'MARRIAGE' as const,
        eventDate: new Date(),
        reportedDate: new Date(),
        effectiveDate: new Date(),
        requiredDocumentation: ['marriage_certificate'],
        submittedDocuments: [],
        eligibleBenefitChanges: []
      };

      const result = await hrManager.processLifeEvent(lifeEvent);
      expect(result).toBeDefined();
      expect(result.id).toMatch(/^le_/);
      expect(result.employeeId).toBe('emp_test_001');
    });

    test('should calculate flexible benefit premiums', async () => {
      const premium = await hrManager.calculateFlexibleBenefitPremium(
        'health_001',
        'emp_test_001',
        'FAMILY',
        new Date()
      );

      expect(premium).toBeDefined();
      expect(premium.monthlyPremium).toBeGreaterThan(0);
      expect(premium.employeeContribution).toBeGreaterThanOrEqual(0);
      expect(premium.employerContribution).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Approvals Management', () => {
    test('should create approval rules', async () => {
      const rule = {
        name: 'Time Off Approval',
        description: 'Approval rule for time off requests > 8 hours',
        applicationContext: 'HR' as const,
        transactionType: 'TIME_OFF_REQUEST',
        conditions: [{
          id: 'cond_001',
          field: 'hours',
          operator: 'GREATER_THAN' as const,
          value: 8
        }],
        approvers: [{
          level: 1,
          approverType: 'POSITION' as const,
          approverId: 'direct_manager',
          isRequired: true,
          parallelApproval: false,
          timeoutDays: 3,
          escalationRules: []
        }],
        priority: 1,
        effectiveDate: new Date()
      };

      const result = await hrManager.createApprovalRule(rule);
      expect(result).toBeDefined();
      expect(result.id).toMatch(/^rule_/);
      expect(result.name).toBe('Time Off Approval');
    });
  });

  describe('Compensation Workbench', () => {
    test('should generate compensation recommendations', async () => {
      const recommendations = await hrManager.generateCompensationRecommendations('emp_test_001');
      
      expect(recommendations).toBeDefined();
      expect(recommendations.employeeId).toBe('emp_test_001');
      expect(recommendations.recommendations).toBeInstanceOf(Array);
    });

    test('should analyze compensation gaps', async () => {
      const analysis = await hrManager.analyzeCompensationGaps();
      
      expect(analysis).toBeDefined();
      expect(analysis.payEquityGaps).toBeInstanceOf(Array);
      expect(analysis.marketGaps).toBeInstanceOf(Array);
    });
  });

  describe('Performance Management', () => {
    test('should create performance objectives', async () => {
      const objective = {
        employeeId: 'emp_test_001',
        managerId: 'mgr_001',
        title: 'Increase Sales Revenue',
        description: 'Achieve 20% increase in quarterly sales revenue',
        category: 'BUSINESS_RESULTS' as const,
        weight: 30,
        targetValue: '20% increase',
        measurementCriteria: 'Quarterly revenue reports',
        startDate: new Date(),
        targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
      };

      const result = await hrManager.createPerformanceObjective(objective);
      expect(result).toBeDefined();
      expect(result.id).toMatch(/^obj_/);
      expect(result.weight).toBe(30);
    });
  });

  describe('Talent Management', () => {
    test('should create talent profiles', async () => {
      const profile = await hrManager.createTalentProfile('emp_test_001');
      
      expect(profile).toBeDefined();
      expect(profile.id).toMatch(/^talent_/);
      expect(profile.employeeId).toBe('emp_test_001');
      expect(profile.criticalSkills).toBeInstanceOf(Array);
    });

    test('should identify succession candidates', async () => {
      const candidates = await hrManager.identifySuccessionCandidates('position_001');
      
      expect(candidates).toBeDefined();
      expect(candidates.readyNow).toBeInstanceOf(Array);
      expect(candidates.readyIn1Year).toBeInstanceOf(Array);
      expect(candidates.readyIn2Years).toBeInstanceOf(Array);
    });
  });

  describe('iRecruitment System', () => {
    test('should create recruitment requisitions', async () => {
      const requisition = {
        jobTitle: 'Senior Software Engineer',
        department: 'Engineering',
        hiringManager: 'mgr_001',
        positionType: 'FULL_TIME' as const,
        urgency: 'MEDIUM' as const,
        numberOfPositions: 1,
        salaryRange: { min: 90000, max: 120000, currency: 'USD' },
        jobDescription: 'Lead software development projects',
        requirements: [{
          id: 'req_001',
          type: 'EXPERIENCE' as const,
          description: 'Software Development',
          required: true,
          minimumLevel: '5',
          yearsExperience: 5,
          weight: 30
        }],
        preferredQualifications: [],
        location: 'San Francisco, CA',
        remoteOption: true,
        targetStartDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
      };

      const result = await hrManager.createRequisition(requisition);
      expect(result).toBeDefined();
      expect(result.id).toMatch(/^req_/);
      expect(result.jobTitle).toBe('Senior Software Engineer');
    });

    test('should add and score candidates', async () => {
      const candidate = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '555-1234',
        availabilityDate: new Date(),
        source: {
          type: 'JOB_BOARD' as const,
          details: 'LinkedIn'
        },
        skills: [{
          skillName: 'JavaScript',
          proficiencyLevel: 4,
          yearsExperience: 5,
          verified: false
        }]
      };

      const result = await hrManager.addCandidate(candidate);
      expect(result).toBeDefined();
      expect(result.id).toMatch(/^candidate_/);
      expect(result.firstName).toBe('John');
    });
  });

  describe('Learning Management', () => {
    test('should create learning programs', async () => {
      const program = {
        title: 'Advanced Leadership Skills',
        description: 'Comprehensive leadership development program',
        category: 'LEADERSHIP' as const,
        type: 'BLENDED' as const,
        provider: 'INTERNAL' as const,
        duration: 40,
        cost: 2500,
        capacity: 20,
        prerequisites: [],
        competenciesAddressed: ['leadership', 'communication'],
        learningObjectives: [{
          id: 'obj_001',
          objective: 'Develop strategic thinking skills',
          bloomsLevel: 'ANALYZE' as const,
          measurementCriteria: 'Case study analysis',
          weight: 100
        }],
        assessments: [],
        effectiveDate: new Date()
      };

      const result = await hrManager.createLearningProgram(program);
      expect(result).toBeDefined();
      expect(result.id).toMatch(/^program_/);
      expect(result.title).toBe('Advanced Leadership Skills');
    });

    test('should conduct skill gap analysis', async () => {
      const analysis = await hrManager.conductSkillGapAnalysis('emp_test_001', 'Senior Manager');
      
      expect(analysis).toBeDefined();
      expect(analysis.employeeId).toBe('emp_test_001');
      expect(analysis.skillGaps).toBeInstanceOf(Array);
      expect(analysis.recommendedLearning).toBeInstanceOf(Array);
    });
  });

  describe('Time and Labor Management', () => {
    test('should create enterprise timecards', async () => {
      const startDate = new Date();
      const endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);
      
      const timecard = await hrManager.createEnterpriseTimecard('emp_test_001', startDate, endDate);
      
      expect(timecard).toBeDefined();
      expect(timecard.id).toMatch(/^timecard_/);
      expect(timecard.employeeId).toBe('emp_test_001');
      expect(timecard.status).toBe('DRAFT');
    });

    test('should process mobile time entries', async () => {
      const mobileEntry = {
        employeeId: 'emp_test_001',
        action: 'CLOCK_IN' as const,
        timestamp: new Date(),
        location: {
          latitude: 37.7749,
          longitude: -122.4194,
          accuracy: 10
        },
        deviceInfo: {
          deviceId: 'device_001',
          platform: 'iOS' as const,
          appVersion: '1.0.0'
        },
        verificationMethod: 'PIN' as const,
        isOfflineEntry: false
      };

      const result = await hrManager.processMobileTimeEntry(mobileEntry);
      expect(result).toBeDefined();
      expect(result.id).toMatch(/^mobile_/);
      expect(result.syncedAt).toBeDefined();
    });
  });

  describe('Labor Distribution', () => {
    test('should calculate labor costs', async () => {
      const period = {
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      };
      
      const timeEntries = [{
        date: new Date(),
        hours: 8,
        overtimeHours: 0,
        projectCode: 'PROJ_001'
      }];

      const result = await hrManager.calculateLaborCosts('emp_test_001', period, timeEntries);
      
      expect(result).toBeDefined();
      expect(result.id).toMatch(/^allocation_/);
      expect(result.totalHours).toBeGreaterThan(0);
    });
  });

  describe('Self-Service HR', () => {
    test('should get personalized interface', async () => {
      const userInterface = await hrManager.getPersonalizedInterface('user_001');
      
      expect(userInterface).toBeDefined();
      expect(userInterface.userId).toBe('user_001');
      expect(userInterface.role).toBeDefined();
      expect(userInterface.dashboardWidgets).toBeInstanceOf(Array);
    });

    test('should get employee self-service profile', async () => {
      const profile = await hrManager.getEmployeeSelfServiceProfile('emp_test_001');
      
      expect(profile).toBeDefined();
      expect(profile.employeeId).toBe('emp_test_001');
      expect(profile.personalInformation).toBeDefined();
    });
  });

  describe('Integration Capabilities', () => {
    test('should provide Oracle EBS integration points', async () => {
      // Test Oracle EBS Core HR sync
      const benefitsService = await import('../src/modules/hr/business-logic/advanced-benefits/advanced-benefits-service');
      const syncResult = await benefitsService.advancedBenefitsService.syncWithOracleEBSCoreHR('emp_test_001');
      
      expect(syncResult).toBeDefined();
      expect(syncResult.syncStatus).toBe('SUCCESS');
      expect(syncResult.syncedFields).toContain('benefits');
    });
  });

  describe('Enterprise Features', () => {
    test('should support Fortune 100 scale operations', async () => {
      // Test manager dashboard functionality
      const dashboard = await hrManager.getManagerDashboard('mgr_001');
      
      expect(dashboard).toBeDefined();
      expect(dashboard.teamOverview).toBeDefined();
      expect(dashboard.pendingApprovals).toBeInstanceOf(Array);
      expect(dashboard.teamPerformance).toBeDefined();
    });

    test('should provide comprehensive analytics', async () => {
      // Test talent analytics
      const talentService = await import('../src/modules/hr/business-logic/talent-management/talent-management-service');
      const analytics = await talentService.talentManagementService.generateTalentAnalytics();
      
      expect(analytics).toBeDefined();
      expect(analytics.talentDistribution).toBeDefined();
      expect(analytics.retentionRisk).toBeDefined();
      expect(analytics.talentMetrics).toBeDefined();
    });
  });
});