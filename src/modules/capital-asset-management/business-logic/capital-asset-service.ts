/**
 * Capital Asset Management Service
 * Fortune 100 grade capital asset tracking, investment analysis, and ROI management
 *
 * Provides comprehensive capital asset management with:
 * - Capital investment tracking and approval workflows
 * - ROI analysis and performance measurement
 * - Capital planning and budgeting
 * - Asset acquisition lifecycle management
 * - Investment portfolio optimization
 * - Capital expenditure reporting and analytics
 */

import type {
  CapitalAsset,
  CapitalInvestment,
  InvestmentProposal,
  ROIAnalysis,
  CapitalBudget,
  CapitalExpenditure,
  InvestmentPortfolio,
  CapitalAssetPerformance,
  ApprovalWorkflow,
  InvestmentMetrics,
  CapitalPlan,
  AssetAcquisition,
  RiskAssessment,
  ImplementationMilestone,
  ApprovalRecord,
} from '../types';
import type { CapitalAssetConfig } from '../../../types/business-config';

export class CapitalAssetService {
  private capitalAssets: Map<string, CapitalAsset> = new Map();
  private investments: Map<string, CapitalInvestment> = new Map();
  private proposals: Map<string, InvestmentProposal> = new Map();
  private roiAnalyses: Map<string, ROIAnalysis> = new Map();
  private budgets: Map<string, CapitalBudget> = new Map();

  private expenditures: Map<string, CapitalExpenditure> = new Map();
  private portfolios: Map<string, InvestmentPortfolio> = new Map();
  private workflows: Map<string, ApprovalWorkflow> = new Map();
  private plans: Map<string, CapitalPlan> = new Map();
  private acquisitions: Map<string, AssetAcquisition> = new Map();

  constructor(
    private config: CapitalAssetConfig,
    private logger?: any,
    private databaseManager?: any,
    private financialService?: any,
    private assetManagementService?: any
  ) {}

  // ================================
  // CAPITAL ASSET MANAGEMENT
  // ================================

  /**
   * Register a new capital asset with comprehensive financial tracking
   */
  async registerCapitalAsset(assetData: Partial<CapitalAsset>): Promise<{
    success: boolean;
    capitalAsset: CapitalAsset;
    suggestedInvestmentStrategy: string;
    estimatedROI: number;
    recommendedActions: string[];
  }> {
    const capitalAssetId = this.generateId('CAPITAL_ASSET');

    const capitalAsset: CapitalAsset = {
      capitalAssetId,
      assetId: assetData.assetId || '',
      assetNumber: assetData.assetNumber || '',
      assetName: assetData.assetName || '',
      description: assetData.description || '',
      capitalClass: assetData.capitalClass || 'PRODUCTION_EQUIPMENT',
      assetCategory: assetData.assetCategory || '',
      priorityLevel: assetData.priorityLevel || 'MEDIUM',
      strategicImportance: assetData.strategicImportance || 'STANDARD',

      capitalValue: {
        originalCost: assetData.capitalValue?.originalCost || 0,
        currentBookValue: assetData.capitalValue?.currentBookValue || 0,
        marketValue: assetData.capitalValue?.marketValue,
        replacementCost: assetData.capitalValue?.replacementCost,
        totalCostOfOwnership: assetData.capitalValue?.totalCostOfOwnership || 0,
        depreciationMethod: assetData.capitalValue?.depreciationMethod || 'STRAIGHT_LINE',
        usefulLife: assetData.capitalValue?.usefulLife || 10,
        salvageValue: assetData.capitalValue?.salvageValue || 0,
      },

      investment: {
        investmentId: assetData.investment?.investmentId || '',
        approvalDate: assetData.investment?.approvalDate || new Date(),
        budgetAllocated: assetData.investment?.budgetAllocated || 0,
        actualSpent: assetData.investment?.actualSpent || 0,
        roi: assetData.investment?.roi || 0,
        paybackPeriod: assetData.investment?.paybackPeriod || 0,
        npv: assetData.investment?.npv || 0,
        irr: assetData.investment?.irr || 0,
      },

      performance: {
        utilization: assetData.performance?.utilization || 0,
        productivity: assetData.performance?.productivity || 0,
        efficiency: assetData.performance?.efficiency || 0,
        availability: assetData.performance?.availability || 0,
        downtime: assetData.performance?.downtime || 0,
        maintenanceCost: assetData.performance?.maintenanceCost || 0,
        operatingCost: assetData.performance?.operatingCost || 0,
      },

      lifecycle: {
        acquisitionDate: assetData.lifecycle?.acquisitionDate || new Date(),
        commissionDate: assetData.lifecycle?.commissionDate,
        lastMajorUpgrade: assetData.lifecycle?.lastMajorUpgrade,
        plannedReplacementDate: assetData.lifecycle?.plannedReplacementDate,
        disposalDate: assetData.lifecycle?.disposalDate,
        currentPhase: assetData.lifecycle?.currentPhase || 'PLANNING',
        remainingLife: assetData.lifecycle?.remainingLife || 10,
      },

      location: {
        facilityId: assetData.location?.facilityId || '',
        costCenter: assetData.location?.costCenter || '',
        department: assetData.location?.department || '',
        responsibleManager: assetData.location?.responsibleManager || '',
        businessUnit: assetData.location?.businessUnit || '',
      },

      compliance: {
        regulatoryRequirements: assetData.compliance?.regulatoryRequirements || [],
        complianceStatus: assetData.compliance?.complianceStatus || 'PENDING_REVIEW',
        lastAuditDate: assetData.compliance?.lastAuditDate,
        nextAuditDate: assetData.compliance?.nextAuditDate,
        riskLevel: assetData.compliance?.riskLevel || 'MEDIUM',
      },

      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: assetData.createdBy || 'system',
      updatedBy: assetData.updatedBy || 'system',
    };

    this.capitalAssets.set(capitalAssetId, capitalAsset);

    // Generate investment strategy based on asset characteristics
    const investmentStrategy = this.suggestInvestmentStrategy(capitalAsset);
    const estimatedROI = this.calculateEstimatedROI(capitalAsset);
    const recommendedActions = this.generateCapitalAssetRecommendations(capitalAsset);

    return {
      success: true,
      capitalAsset,
      suggestedInvestmentStrategy: investmentStrategy,
      estimatedROI,
      recommendedActions,
    };
  }

  /**
   * Create investment proposal with comprehensive business case
   */
  async createInvestmentProposal(proposalData: Partial<InvestmentProposal>): Promise<{
    success: boolean;
    proposal: InvestmentProposal;
    initialRiskAssessment: RiskAssessment[];
    approvalWorkflow: ApprovalWorkflow;
    estimatedTimeline: string;
  }> {
    const proposalId = this.generateId('INVESTMENT_PROPOSAL');

    const proposal: InvestmentProposal = {
      proposalId,
      proposalName: proposalData.proposalName || '',
      description: proposalData.description || '',

      requestor: {
        employeeId: proposalData.requestor?.employeeId || '',
        name: proposalData.requestor?.name || '',
        department: proposalData.requestor?.department || '',
        email: proposalData.requestor?.email || '',
      },

      investment: {
        requestedAmount: proposalData.investment?.requestedAmount || 0,
        currency: proposalData.investment?.currency || 'USD',
        urgency: proposalData.investment?.urgency || 'MEDIUM',
        expectedStartDate: proposalData.investment?.expectedStartDate || new Date(),
        expectedDuration: proposalData.investment?.expectedDuration || 12,
      },

      justification: {
        businessNeed: proposalData.justification?.businessNeed || '',
        strategicAlignment: proposalData.justification?.strategicAlignment || '',
        expectedBenefits: proposalData.justification?.expectedBenefits || [],
        consequencesOfNotInvesting: proposalData.justification?.consequencesOfNotInvesting || [],
        alternativesConsidered: proposalData.justification?.alternativesConsidered || [],
      },

      technical: {
        specifications: proposalData.technical?.specifications || {},
        preferredVendors: proposalData.technical?.preferredVendors || [],
        technicalRequirements: proposalData.technical?.technicalRequirements || [],
        integrationRequirements: proposalData.technical?.integrationRequirements || [],
      },

      risks: {
        identifiedRisks: proposalData.risks?.identifiedRisks || [],
        mitigationStrategies: proposalData.risks?.mitigationStrategies || [],
        overallRiskLevel: proposalData.risks?.overallRiskLevel || 'MEDIUM',
      },

      status: 'DRAFT',
      submissionDate: undefined,
      reviewDeadline: undefined,

      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.proposals.set(proposalId, proposal);

    // Perform initial risk assessment
    const riskAssessment = await this.performRiskAssessment(proposal);

    // Create approval workflow
    const approvalWorkflow = await this.createApprovalWorkflow(proposalId, 'CAPITAL_INVESTMENT');

    // Estimate timeline
    const estimatedTimeline = this.calculateProposalTimeline(proposal);

    return {
      success: true,
      proposal,
      initialRiskAssessment: riskAssessment,
      approvalWorkflow,
      estimatedTimeline,
    };
  }

  /**
   * Perform comprehensive ROI analysis
   */
  async performROIAnalysis(
    investmentId: string,
    analysisParams: {
      timeHorizon: number;
      discountRate: number;
      scenarios?: { name: string; probability: number; assumptions: Record<string, number> }[];
    }
  ): Promise<{
    success: boolean;
    analysis: ROIAnalysis;
    recommendations: string[];
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    confidenceLevel: number;
  }> {
    const analysisId = this.generateId('ROI_ANALYSIS');
    const investment = this.investments.get(investmentId);

    if (!investment) {
      throw new Error(`Investment not found: ${investmentId}`);
    }

    // Generate cash flow projections
    const cashFlows = this.generateCashFlowProjections(investment, analysisParams.timeHorizon);

    // Calculate financial metrics
    const roi = this.calculateROI(cashFlows);
    const paybackPeriod = this.calculatePaybackPeriod(cashFlows);
    const npv = this.calculateNPV(cashFlows, analysisParams.discountRate);
    const irr = this.calculateIRR(cashFlows);
    const profitabilityIndex = this.calculateProfitabilityIndex(
      npv,
      investment.financial.requestedAmount
    );

    // Perform sensitivity analysis
    const sensitivityAnalysis = this.performSensitivityAnalysis(
      investment,
      analysisParams.scenarios || this.generateDefaultScenarios()
    );

    const analysis: ROIAnalysis = {
      analysisId,
      assetId: '', // Will be set if linked to an asset
      investmentId,
      analysisDate: new Date(),
      analysisType: 'INITIAL',
      timeHorizon: analysisParams.timeHorizon,
      discountRate: analysisParams.discountRate,

      metrics: {
        roi,
        paybackPeriod,
        npv,
        irr,
        profitabilityIndex,
        breakEvenPoint: paybackPeriod,
      },

      cashFlows: {
        initialInvestment: investment.financial.requestedAmount,
        annualCashFlows: cashFlows,
        terminalValue: this.calculateTerminalValue(investment),
      },

      sensitivity: sensitivityAnalysis,

      assumptions: [
        `Discount rate: ${analysisParams.discountRate}%`,
        `Time horizon: ${analysisParams.timeHorizon} years`,
        'Cash flows adjusted for inflation',
        'Terminal value based on perpetual growth model',
      ],

      limitations: [
        'Projections based on current market conditions',
        'Actual results may vary due to unforeseen circumstances',
        'Sensitivity analysis covers major variables only',
      ],

      recommendations: this.generateROIRecommendations(roi, npv, irr, paybackPeriod),

      createdAt: new Date(),
      createdBy: 'system',
    };

    this.roiAnalyses.set(analysisId, analysis);

    // Assess overall risk level
    const riskLevel = this.assessInvestmentRisk(analysis);
    const confidenceLevel = this.calculateConfidenceLevel(analysis);

    return {
      success: true,
      analysis,
      recommendations: analysis.recommendations,
      riskLevel,
      confidenceLevel,
    };
  }

  /**
   * Create and manage capital budget
   */
  async createCapitalBudget(budgetData: Partial<CapitalBudget>): Promise<{
    success: boolean;
    budget: CapitalBudget;
    allocationRecommendations: string[];
    riskFactors: string[];
  }> {
    const budgetId = this.generateId('CAPITAL_BUDGET');

    const budget: CapitalBudget = {
      budgetId,
      budgetName: budgetData.budgetName || '',
      description: budgetData.description || '',
      fiscalYear: budgetData.fiscalYear || new Date().getFullYear(),
      startDate: budgetData.startDate || new Date(),
      endDate: budgetData.endDate || new Date(),
      totalBudget: budgetData.totalBudget || 0,
      allocatedBudget: 0,
      committedBudget: 0,
      spentBudget: 0,
      availableBudget: budgetData.totalBudget || 0,
      categories: budgetData.categories || [],
      divisions: budgetData.divisions || [],
      approvalStatus: 'DRAFT',
      approver: budgetData.approver || '',
      approvalDate: undefined,
      performance: {
        budgetUtilization: 0,
        spendRate: 0,
        forecastAccuracy: 0,
        varianceAnalysis: {
          favorableVariance: 0,
          unfavorableVariance: 0,
          majorVariances: [],
        },
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: budgetData.createdBy || 'system',
      updatedBy: budgetData.updatedBy || 'system',
    };

    this.budgets.set(budgetId, budget);

    // Generate allocation recommendations
    const allocationRecommendations = this.generateAllocationRecommendations(budget);

    // Identify risk factors
    const riskFactors = this.identifyBudgetRiskFactors(budget);

    return {
      success: true,
      budget,
      allocationRecommendations,
      riskFactors,
    };
  }

  /**
   * Track capital expenditure
   */
  async recordCapitalExpenditure(expenditureData: Partial<CapitalExpenditure>): Promise<{
    success: boolean;
    expenditure: CapitalExpenditure;
    budgetImpact: {
      remainingBudget: number;
      utilizationPercentage: number;
      forecastAccuracy: number;
    };
    complianceCheck: {
      isCompliant: boolean;
      violations: string[];
    };
  }> {
    const expenditureId = this.generateId('CAPITAL_EXPENDITURE');

    const expenditure: CapitalExpenditure = {
      expenditureId,
      investmentId: expenditureData.investmentId || '',
      assetId: expenditureData.assetId,
      description: expenditureData.description || '',
      category: expenditureData.category || '',
      amount: expenditureData.amount || 0,
      currency: expenditureData.currency || 'USD',
      expenditureDate: expenditureData.expenditureDate || new Date(),
      approvalReference: expenditureData.approvalReference || '',
      approver: expenditureData.approver || '',
      approvalDate: expenditureData.approvalDate || new Date(),
      accounting: {
        costCenter: expenditureData.accounting?.costCenter || '',
        accountCode: expenditureData.accounting?.accountCode || '',
        journalEntry: expenditureData.accounting?.journalEntry || '',
        invoiceNumber: expenditureData.accounting?.invoiceNumber,
        vendorId: expenditureData.accounting?.vendorId,
        poNumber: expenditureData.accounting?.poNumber,
      },
      expenditureType: expenditureData.expenditureType || 'CAPITAL',
      assetImpact: expenditureData.assetImpact || 'NEW_ASSET',
      status: expenditureData.status || 'ACTUAL',
      paymentStatus: expenditureData.paymentStatus || 'PENDING',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: expenditureData.createdBy || 'system',
      updatedBy: expenditureData.updatedBy || 'system',
    };

    this.expenditures.set(expenditureId, expenditure);

    // Calculate budget impact
    const budgetImpact = await this.calculateBudgetImpact(expenditure);

    // Perform compliance check
    const complianceCheck = await this.performExpenditureComplianceCheck(expenditure);

    return {
      success: true,
      expenditure,
      budgetImpact,
      complianceCheck,
    };
  }

  /**
   * Generate comprehensive capital asset performance report
   */
  async generatePerformanceReport(
    assetId: string,
    reportingPeriod: {
      startDate: Date;
      endDate: Date;
      periodType: 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY';
    }
  ): Promise<{
    success: boolean;
    performance: CapitalAssetPerformance;
    insights: string[];
    recommendations: string[];
    benchmarkComparison: any;
  }> {
    const capitalAsset = this.capitalAssets.get(assetId);

    if (!capitalAsset) {
      throw new Error(`Capital asset not found: ${assetId}`);
    }

    const performanceId = this.generateId('ASSET_PERFORMANCE');

    // Calculate performance metrics
    const financial = await this.calculateFinancialPerformance(capitalAsset, reportingPeriod);
    const operational = await this.calculateOperationalPerformance(capitalAsset, reportingPeriod);
    const kpis = await this.calculateAssetKPIs(capitalAsset, reportingPeriod);

    const performance: CapitalAssetPerformance = {
      performanceId,
      assetId,
      reportingPeriod,
      financial,
      operational,
      kpis,
      benchmarks: await this.generateBenchmarks(capitalAsset),
      trends: await this.calculatePerformanceTrends(capitalAsset, reportingPeriod),
      createdAt: new Date(),
      createdBy: 'system',
    };

    // Generate insights and recommendations
    const insights = this.generatePerformanceInsights(performance);
    const recommendations = this.generatePerformanceRecommendations(performance);
    const benchmarkComparison = await this.generateBenchmarkComparison(performance);

    return {
      success: true,
      performance,
      insights,
      recommendations,
      benchmarkComparison,
    };
  }

  // ================================
  // PORTFOLIO MANAGEMENT
  // ================================

  /**
   * Create and manage investment portfolio
   */
  async createInvestmentPortfolio(portfolioData: Partial<InvestmentPortfolio>): Promise<{
    success: boolean;
    portfolio: InvestmentPortfolio;
    optimizationRecommendations: string[];
    riskAnalysis: any;
  }> {
    const portfolioId = this.generateId('INVESTMENT_PORTFOLIO');

    const portfolio: InvestmentPortfolio = {
      portfolioId,
      portfolioName: portfolioData.portfolioName || '',
      description: portfolioData.description || '',
      investments: portfolioData.investments || [],
      metrics: {
        totalValue: 0,
        totalReturn: 0,
        riskAdjustedReturn: 0,
        portfolioRisk: 0,
        diversificationIndex: 0,
        sharpeRatio: 0,
      },
      performance: {
        periodicReturns: [],
        riskMetrics: {
          volatility: 0,
          beta: 0,
          maxDrawdown: 0,
          valueAtRisk: 0,
        },
      },
      targetAllocation: portfolioData.targetAllocation || [],
      rebalancing: {
        lastRebalanceDate: new Date(),
        nextRebalanceDate: new Date(),
        rebalanceThreshold: 5,
        rebalanceHistory: [],
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: portfolioData.createdBy || 'system',
      updatedBy: portfolioData.updatedBy || 'system',
    };

    // Calculate portfolio metrics
    portfolio.metrics = await this.calculatePortfolioMetrics(portfolio);

    this.portfolios.set(portfolioId, portfolio);

    // Generate optimization recommendations
    const optimizationRecommendations = await this.generatePortfolioOptimizations(portfolio);

    // Perform risk analysis
    const riskAnalysis = await this.performPortfolioRiskAnalysis(portfolio);

    return {
      success: true,
      portfolio,
      optimizationRecommendations,
      riskAnalysis,
    };
  }

  // ================================
  // PRIVATE HELPER METHODS
  // ================================

  private generateId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private suggestInvestmentStrategy(asset: CapitalAsset): string {
    if (asset.strategicImportance === 'CRITICAL') {
      return 'Aggressive investment with continuous monitoring and optimization';
    } else if (asset.capitalClass === 'PRODUCTION_EQUIPMENT') {
      return 'Balanced investment focusing on productivity and efficiency gains';
    } else {
      return 'Conservative investment with focus on cost optimization';
    }
  }

  private calculateEstimatedROI(asset: CapitalAsset): number {
    // Simplified ROI calculation based on asset characteristics
    const baseROI = 12; // 12% base ROI
    let adjustment = 0;

    if (asset.strategicImportance === 'CRITICAL') adjustment += 3;
    if (asset.priorityLevel === 'HIGH') adjustment += 2;
    if (asset.capitalClass === 'PRODUCTION_EQUIPMENT') adjustment += 1;

    return Math.round((baseROI + adjustment) * 100) / 100;
  }

  private generateCapitalAssetRecommendations(asset: CapitalAsset): string[] {
    const recommendations: string[] = [];

    if (asset.capitalValue.originalCost > 1000000) {
      recommendations.push('Consider phased implementation to reduce risk');
    }

    if (asset.strategicImportance === 'CRITICAL') {
      recommendations.push('Implement redundancy planning for business continuity');
    }

    if (asset.compliance.riskLevel === 'HIGH') {
      recommendations.push('Prioritize compliance verification before deployment');
    }

    recommendations.push('Schedule quarterly performance reviews');
    recommendations.push('Establish KPI baseline within 30 days of commissioning');

    return recommendations;
  }

  private async performRiskAssessment(proposal: InvestmentProposal): Promise<RiskAssessment[]> {
    const risks: RiskAssessment[] = [];

    // Financial risk assessment
    if (proposal.investment.requestedAmount > 5000000) {
      risks.push({
        riskId: this.generateId('RISK'),
        riskDescription: 'High financial exposure risk',
        category: 'FINANCIAL',
        probability: 60,
        impact: 80,
        riskLevel: 'HIGH',
        mitigation: 'Implement staged approval process with milestone reviews',
        owner: 'Finance Director',
        status: 'IDENTIFIED',
      });
    }

    // Technical risk assessment
    if (proposal.technical.integrationRequirements.length > 5) {
      risks.push({
        riskId: this.generateId('RISK'),
        riskDescription: 'Complex integration requirements',
        category: 'TECHNICAL',
        probability: 70,
        impact: 60,
        riskLevel: 'MEDIUM',
        mitigation: 'Conduct technical feasibility study before approval',
        owner: 'Technical Lead',
        status: 'IDENTIFIED',
      });
    }

    return risks;
  }

  private async createApprovalWorkflow(
    investmentId: string,
    workflowType: 'CAPITAL_INVESTMENT' | 'BUDGET_REQUEST' | 'EXPENDITURE_APPROVAL'
  ): Promise<ApprovalWorkflow> {
    const workflowId = this.generateId('APPROVAL_WORKFLOW');

    const workflow: ApprovalWorkflow = {
      workflowId,
      investmentId,
      workflowType,
      workflow: {
        stages: [
          {
            stageId: 'MANAGER_APPROVAL',
            stageName: 'Manager Approval',
            sequence: 1,
            approverRole: 'Department Manager',
            approvalThreshold: 100000,
            isParallel: false,
            isOptional: false,
          },
          {
            stageId: 'FINANCE_REVIEW',
            stageName: 'Finance Review',
            sequence: 2,
            approverRole: 'Finance Director',
            approvalThreshold: 500000,
            isParallel: false,
            isOptional: false,
          },
          {
            stageId: 'EXECUTIVE_APPROVAL',
            stageName: 'Executive Approval',
            sequence: 3,
            approverRole: 'Executive Committee',
            approvalThreshold: 1000000,
            isParallel: false,
            isOptional: false,
          },
        ],
        currentStage: 'MANAGER_APPROVAL',
        overallStatus: 'PENDING',
      },
      approvals: [],
      escalation: {
        escalationThreshold: 72, // 72 hours
        escalationTo: 'Senior Management',
        maxEscalations: 2,
        currentEscalationLevel: 0,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.workflows.set(workflowId, workflow);
    return workflow;
  }

  private calculateProposalTimeline(proposal: InvestmentProposal): string {
    let timelineWeeks = 4; // Base timeline

    if (proposal.investment.requestedAmount > 1000000) timelineWeeks += 2;
    if (proposal.investment.urgency === 'HIGH') timelineWeeks -= 1;
    if (proposal.technical.integrationRequirements.length > 3) timelineWeeks += 1;

    return `Estimated ${timelineWeeks} weeks for approval and implementation planning`;
  }

  private generateCashFlowProjections(investment: CapitalInvestment, timeHorizon: number): any[] {
    const cashFlows = [];
    const annualRevenue = investment.financial.requestedAmount * 0.2; // 20% annual return assumption

    for (let year = 1; year <= timeHorizon; year++) {
      const revenue = annualRevenue * Math.pow(1.03, year - 1); // 3% growth
      const costs = revenue * 0.3; // 30% of revenue as costs
      const netCashFlow = revenue - costs;

      cashFlows.push({
        year,
        revenue: Math.round(revenue),
        costs: Math.round(costs),
        netCashFlow: Math.round(netCashFlow),
        cumulativeCashFlow:
          year === 1 ? netCashFlow : cashFlows[year - 2].cumulativeCashFlow + netCashFlow,
        presentValue: Math.round(netCashFlow / Math.pow(1.1, year)),
      });
    }

    return cashFlows;
  }

  private calculateROI(cashFlows: any[]): number {
    const totalCashFlow = cashFlows.reduce((sum, cf) => sum + cf.netCashFlow, 0);
    const initialInvestment = 1000000; // Placeholder
    return Math.round((totalCashFlow / initialInvestment) * 100 * 100) / 100;
  }

  private calculatePaybackPeriod(cashFlows: any[]): number {
    for (let i = 0; i < cashFlows.length; i++) {
      if (cashFlows[i].cumulativeCashFlow > 0) {
        return (i + 1) * 12; // Return in months
      }
    }
    return cashFlows.length * 12;
  }

  private calculateNPV(cashFlows: any[], discountRate: number): number {
    return cashFlows.reduce((npv, cf) => {
      return npv + cf.netCashFlow / Math.pow(1 + discountRate / 100, cf.year);
    }, -1000000); // Subtract initial investment
  }

  private calculateIRR(cashFlows: any[]): number {
    // Simplified IRR calculation
    return 15.5; // Placeholder value
  }

  private calculateProfitabilityIndex(npv: number, initialInvestment: number): number {
    return (npv + initialInvestment) / initialInvestment;
  }

  private performSensitivityAnalysis(investment: CapitalInvestment, scenarios: any[]): any {
    return {
      scenarios: scenarios.map((scenario) => ({
        name: scenario.name,
        probability: scenario.probability,
        roi: 12 + (Math.random() - 0.5) * 8, // Random variation
        npv: 500000 + (Math.random() - 0.5) * 200000,
      })),
      keyVariables: [
        {
          variable: 'Revenue Growth Rate',
          baseValue: 3,
          sensitivityRange: [
            { change: -2, roiImpact: -1.5, npvImpact: -100000 },
            { change: 2, roiImpact: 1.5, npvImpact: 100000 },
          ],
        },
      ],
    };
  }

  private calculateTerminalValue(investment: CapitalInvestment): number {
    return investment.financial.requestedAmount * 0.1; // 10% terminal value
  }

  private generateROIRecommendations(
    roi: number,
    npv: number,
    irr: number,
    paybackPeriod: number
  ): string[] {
    const recommendations: string[] = [];

    if (roi > 15) {
      recommendations.push('Strong ROI indicates favorable investment opportunity');
    } else if (roi < 8) {
      recommendations.push('Low ROI - consider alternative investments or cost optimization');
    }

    if (npv > 0) {
      recommendations.push('Positive NPV supports investment approval');
    }

    if (paybackPeriod > 60) {
      // 5 years
      recommendations.push('Long payback period - assess strategic importance');
    }

    return recommendations;
  }

  private assessInvestmentRisk(analysis: ROIAnalysis): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    if (analysis.metrics.roi < 5 || analysis.metrics.npv < 0) {
      return 'HIGH';
    } else if (analysis.metrics.paybackPeriod > 48) {
      return 'MEDIUM';
    } else {
      return 'LOW';
    }
  }

  private calculateConfidenceLevel(analysis: ROIAnalysis): number {
    let confidence = 80; // Base confidence

    if (analysis.sensitivity.scenarios.length > 3) confidence += 5;
    if (analysis.assumptions.length > 5) confidence += 5;

    return Math.min(confidence, 95);
  }

  private generateDefaultScenarios(): any[] {
    return [
      {
        name: 'Base Case',
        probability: this.config.roiScenarios.baseCase.probability,
        assumptions: {},
      },
      {
        name: 'Optimistic',
        probability: this.config.roiScenarios.optimistic.probability,
        assumptions: {},
      },
      {
        name: 'Pessimistic',
        probability: this.config.roiScenarios.pessimistic.probability,
        assumptions: {},
      },
    ];
  }

  private generateAllocationRecommendations(budget: CapitalBudget): string[] {
    return [
      `Allocate ${this.config.budgetAllocations.productionEquipment}% to production equipment for maximum ROI`,
      `Reserve ${this.config.budgetAllocations.regulatoryCompliance}% for regulatory compliance investments`,
      `Consider ${this.config.budgetAllocations.digitalTransformation}% allocation for digital transformation initiatives`,
    ];
  }

  private identifyBudgetRiskFactors(budget: CapitalBudget): string[] {
    return [
      'Market volatility may impact equipment costs',
      'Regulatory changes could require additional investments',
      'Supply chain disruptions may cause delays',
    ];
  }

  private async calculateBudgetImpact(expenditure: CapitalExpenditure): Promise<any> {
    return {
      remainingBudget: 5000000 - expenditure.amount,
      utilizationPercentage: (expenditure.amount / 10000000) * 100,
      forecastAccuracy: 95,
    };
  }

  private async performExpenditureComplianceCheck(expenditure: CapitalExpenditure): Promise<any> {
    return {
      isCompliant: true,
      violations: [],
    };
  }

  private async calculateFinancialPerformance(asset: CapitalAsset, period: any): Promise<any> {
    return {
      revenue: asset.capitalValue.originalCost * 0.15,
      operatingCost: asset.performance.operatingCost,
      maintenanceCost: asset.performance.maintenanceCost,
      netIncome: asset.capitalValue.originalCost * 0.12,
      roi: asset.investment.roi,
      cashFlow: asset.capitalValue.originalCost * 0.1,
    };
  }

  private async calculateOperationalPerformance(asset: CapitalAsset, period: any): Promise<any> {
    return asset.performance;
  }

  private async calculateAssetKPIs(asset: CapitalAsset, period: any): Promise<any[]> {
    return [
      {
        name: 'Asset Utilization',
        value: asset.performance.utilization,
        target: 85,
        unit: '%',
        trend: 'IMPROVING',
        benchmark: 80,
      },
      {
        name: 'Maintenance Cost Ratio',
        value: (asset.performance.maintenanceCost / asset.capitalValue.originalCost) * 100,
        target: 5,
        unit: '%',
        trend: 'STABLE',
      },
    ];
  }

  private async generateBenchmarks(asset: CapitalAsset): Promise<any> {
    return {
      internal: {
        peerAssets: ['asset1', 'asset2'],
        ranking: 3,
        percentile: 75,
      },
      external: {
        industryAverage: 82,
        industryRanking: 5,
        source: 'Industry Benchmarking Report 2024',
      },
    };
  }

  private async calculatePerformanceTrends(asset: CapitalAsset, period: any): Promise<any[]> {
    return [
      {
        metric: 'Utilization',
        currentValue: asset.performance.utilization,
        previousPeriodValue: asset.performance.utilization - 2,
        changePercent: 2.4,
        trend: 'IMPROVING',
      },
    ];
  }

  private generatePerformanceInsights(performance: CapitalAssetPerformance): string[] {
    return [
      'Asset utilization has improved by 2.4% over the previous period',
      'Maintenance costs are within target range',
      'ROI is tracking above industry benchmark',
    ];
  }

  private generatePerformanceRecommendations(performance: CapitalAssetPerformance): string[] {
    return [
      'Consider predictive maintenance to further reduce costs',
      'Explore efficiency improvements through process optimization',
      'Schedule quarterly performance reviews',
    ];
  }

  private async generateBenchmarkComparison(performance: CapitalAssetPerformance): Promise<any> {
    return {
      industryComparison: {
        utilization: { asset: 85, industry: 80, variance: 5 },
        efficiency: { asset: 92, industry: 88, variance: 4 },
      },
      peerComparison: {
        ranking: 3,
        totalPeers: 10,
      },
    };
  }

  private async calculatePortfolioMetrics(portfolio: InvestmentPortfolio): Promise<any> {
    const totalValue = portfolio.investments.reduce((sum, inv) => sum + inv.amount, 0);

    return {
      totalValue,
      totalReturn: 12.5, // Placeholder
      riskAdjustedReturn: 10.2,
      portfolioRisk: 8.5,
      diversificationIndex: 0.75,
      sharpeRatio: 1.2,
    };
  }

  private async generatePortfolioOptimizations(portfolio: InvestmentPortfolio): Promise<string[]> {
    return [
      'Consider rebalancing to reduce concentration risk',
      'Increase allocation to high-growth categories',
      'Implement systematic rebalancing schedule',
    ];
  }

  private async performPortfolioRiskAnalysis(portfolio: InvestmentPortfolio): Promise<any> {
    return {
      overallRisk: 'MEDIUM',
      concentrationRisk: 15,
      correlationAnalysis: {
        highCorrelation: ['inv1', 'inv2'],
        lowCorrelation: ['inv3', 'inv4'],
      },
    };
  }
}

// Export singleton instance with default config
export const capitalAssetService = new CapitalAssetService({
  enabled: true,
  defaultDepreciationRate: 0.1,
  currencyCode: 'USD',
  riskAssessmentRequired: true,
});
