/**
 * Capital Asset Management Data Access Layer
 * Production-grade repositories for capital asset management entities
 */

import { BaseRepositoryImpl } from '../../../shared/data-access/base-repository';
import { generateId } from '../../../shared/utils/id-generator';
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
  AssetAcquisition
} from '../types';

/**
 * Capital Asset Repository
 * Manages capital asset lifecycle and financial data
 */
export class CapitalAssetRepository extends BaseRepositoryImpl<CapitalAsset> {
  protected generateId(): string {
    return generateId('capital_asset');
  }

  /**
   * Find assets by capital class
   */
  async findByCapitalClass(capitalClass: CapitalAsset['capitalClass']): Promise<CapitalAsset[]> {
    return this.items.filter(asset => asset.capitalClass === capitalClass);
  }

  /**
   * Find assets by strategic importance
   */
  async findByStrategicImportance(importance: CapitalAsset['strategicImportance']): Promise<CapitalAsset[]> {
    return this.items.filter(asset => asset.strategicImportance === importance);
  }

  /**
   * Find assets by lifecycle phase
   */
  async findByLifecyclePhase(phase: CapitalAsset['lifecycle']['currentPhase']): Promise<CapitalAsset[]> {
    return this.items.filter(asset => asset.lifecycle.currentPhase === phase);
  }

  /**
   * Find assets requiring replacement soon
   */
  async findAssetsNearingReplacement(monthsAhead: number = 12): Promise<CapitalAsset[]> {
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() + monthsAhead);
    
    return this.items.filter(asset => 
      asset.lifecycle.plannedReplacementDate && 
      asset.lifecycle.plannedReplacementDate <= cutoffDate
    );
  }

  /**
   * Get assets by cost center
   */
  async findByCostCenter(costCenter: string): Promise<CapitalAsset[]> {
    return this.items.filter(asset => asset.location.costCenter === costCenter);
  }
}

/**
 * Capital Investment Repository
 * Manages investment proposals, approvals, and tracking
 */
export class CapitalInvestmentRepository extends BaseRepositoryImpl<CapitalInvestment> {
  protected generateId(): string {
    return generateId('capital_investment');
  }

  /**
   * Find investments by type
   */
  async findByInvestmentType(type: CapitalInvestment['investmentType']): Promise<CapitalInvestment[]> {
    return this.items.filter(investment => investment.investmentType === type);
  }

  /**
   * Find investments by budget year
   */
  async findByBudgetYear(year: number): Promise<CapitalInvestment[]> {
    return this.items.filter(investment => investment.financial.budgetYear === year);
  }

  /**
   * Find investments by status
   */
  async findByImplementationStatus(status: CapitalInvestment['implementation']['status']): Promise<CapitalInvestment[]> {
    return this.items.filter(investment => investment.implementation.status === status);
  }

  /**
   * Find investments by ROI threshold
   */
  async findByROIThreshold(minROI: number): Promise<CapitalInvestment[]> {
    return this.items.filter(investment => investment.analysis.roi >= minROI);
  }
}

/**
 * Investment Proposal Repository
 * Manages investment proposal workflow and approvals
 */
export class InvestmentProposalRepository extends BaseRepositoryImpl<InvestmentProposal> {
  protected generateId(): string {
    return generateId('investment_proposal');
  }

  /**
   * Find proposals by status
   */
  async findByStatus(status: InvestmentProposal['status']): Promise<InvestmentProposal[]> {
    return this.items.filter(proposal => proposal.status === status);
  }

  /**
   * Find proposals by requestor
   */
  async findByRequestor(employeeId: string): Promise<InvestmentProposal[]> {
    return this.items.filter(proposal => proposal.requestor.employeeId === employeeId);
  }

  /**
   * Find proposals requiring review by deadline
   */
  async findProposalsRequiringReview(deadline?: Date): Promise<InvestmentProposal[]> {
    const cutoffDate = deadline || new Date();
    return this.items.filter(proposal => 
      proposal.status === 'UNDER_REVIEW' && 
      proposal.reviewDeadline && 
      proposal.reviewDeadline <= cutoffDate
    );
  }
}

/**
 * ROI Analysis Repository
 * Manages return on investment calculations and analysis
 */
export class ROIAnalysisRepository extends BaseRepositoryImpl<ROIAnalysis> {
  protected generateId(): string {
    return generateId('roi_analysis');
  }

  /**
   * Find analyses by asset
   */
  async findByAssetId(assetId: string): Promise<ROIAnalysis[]> {
    return this.items.filter(analysis => analysis.assetId === assetId);
  }

  /**
   * Find analyses by investment
   */
  async findByInvestmentId(investmentId: string): Promise<ROIAnalysis[]> {
    return this.items.filter(analysis => analysis.investmentId === investmentId);
  }

  /**
   * Find analyses by type and date range
   */
  async findByTypeAndDateRange(
    analysisType: ROIAnalysis['analysisType'],
    startDate: Date,
    endDate: Date
  ): Promise<ROIAnalysis[]> {
    return this.items.filter(analysis => 
      analysis.analysisType === analysisType &&
      analysis.analysisDate >= startDate &&
      analysis.analysisDate <= endDate
    );
  }
}

/**
 * Capital Budget Repository
 * Manages budget planning and allocation
 */
export class CapitalBudgetRepository extends BaseRepositoryImpl<CapitalBudget> {
  protected generateId(): string {
    return generateId('capital_budget');
  }

  /**
   * Find budgets by fiscal year
   */
  async findByFiscalYear(year: number): Promise<CapitalBudget[]> {
    return this.items.filter(budget => budget.fiscalYear === year);
  }

  /**
   * Find active budgets
   */
  async findActiveBudgets(): Promise<CapitalBudget[]> {
    return this.items.filter(budget => budget.approvalStatus === 'ACTIVE');
  }

  /**
   * Find budgets with available capacity
   */
  async findBudgetsWithAvailableCapacity(minAmount: number = 0): Promise<CapitalBudget[]> {
    return this.items.filter(budget => budget.availableBudget >= minAmount);
  }
}

/**
 * Capital Expenditure Repository
 * Tracks actual capital expenditures and approvals
 */
export class CapitalExpenditureRepository extends BaseRepositoryImpl<CapitalExpenditure> {
  protected generateId(): string {
    return generateId('capital_expenditure');
  }

  /**
   * Find expenditures by investment
   */
  async findByInvestmentId(investmentId: string): Promise<CapitalExpenditure[]> {
    return this.items.filter(expenditure => expenditure.investmentId === investmentId);
  }

  /**
   * Find expenditures by date range
   */
  async findByDateRange(startDate: Date, endDate: Date): Promise<CapitalExpenditure[]> {
    return this.items.filter(expenditure => 
      expenditure.expenditureDate >= startDate &&
      expenditure.expenditureDate <= endDate
    );
  }

  /**
   * Find expenditures by status
   */
  async findByStatus(status: CapitalExpenditure['status']): Promise<CapitalExpenditure[]> {
    return this.items.filter(expenditure => expenditure.status === status);
  }

  /**
   * Get total expenditures by cost center
   */
  async getTotalByCostCenter(costCenter: string, startDate?: Date, endDate?: Date): Promise<number> {
    let expenditures = this.items.filter(exp => exp.accounting.costCenter === costCenter);
    
    if (startDate && endDate) {
      expenditures = expenditures.filter(exp => 
        exp.expenditureDate >= startDate && exp.expenditureDate <= endDate
      );
    }

    return expenditures.reduce((total, exp) => total + exp.amount, 0);
  }
}

/**
 * Investment Portfolio Repository
 * Manages investment portfolios and performance analysis
 */
export class InvestmentPortfolioRepository extends BaseRepositoryImpl<InvestmentPortfolio> {
  protected generateId(): string {
    return generateId('investment_portfolio');
  }

  /**
   * Calculate portfolio performance metrics
   */
  async calculatePortfolioMetrics(portfolioId: string): Promise<InvestmentPortfolio['metrics'] | null> {
    const portfolio = await this.findById(portfolioId);
    if (!portfolio) return null;

    // Return the current metrics (in production, this would perform real calculations)
    return portfolio.metrics;
  }

  /**
   * Find portfolios requiring rebalancing
   */
  async findPortfoliosRequiringRebalancing(): Promise<InvestmentPortfolio[]> {
    const today = new Date();
    return this.items.filter(portfolio => 
      portfolio.rebalancing.nextRebalanceDate <= today
    );
  }
}

/**
 * Capital Asset Performance Repository
 * Tracks and manages asset performance metrics
 */
export class CapitalAssetPerformanceRepository extends BaseRepositoryImpl<CapitalAssetPerformance> {
  protected generateId(): string {
    return generateId('asset_performance');
  }

  /**
   * Find performance records by asset
   */
  async findByAssetId(assetId: string): Promise<CapitalAssetPerformance[]> {
    return this.items.filter(perf => perf.assetId === assetId);
  }

  /**
   * Find performance by reporting period
   */
  async findByReportingPeriod(
    periodType: CapitalAssetPerformance['reportingPeriod']['periodType'],
    startDate: Date,
    endDate: Date
  ): Promise<CapitalAssetPerformance[]> {
    return this.items.filter(perf => 
      perf.reportingPeriod.periodType === periodType &&
      perf.reportingPeriod.startDate >= startDate &&
      perf.reportingPeriod.endDate <= endDate
    );
  }

  /**
   * Get latest performance for asset
   */
  async getLatestPerformance(assetId: string): Promise<CapitalAssetPerformance | null> {
    const performances = await this.findByAssetId(assetId);
    if (performances.length === 0) return null;

    return performances.reduce((latest, current) => 
      current.reportingPeriod.endDate > latest.reportingPeriod.endDate ? current : latest
    );
  }
}

/**
 * Approval Workflow Repository
 * Manages approval processes for capital investments
 */
export class ApprovalWorkflowRepository extends BaseRepositoryImpl<ApprovalWorkflow> {
  protected generateId(): string {
    return generateId('approval_workflow');
  }

  /**
   * Find workflows by investment
   */
  async findByInvestmentId(investmentId: string): Promise<ApprovalWorkflow[]> {
    return this.items.filter(workflow => workflow.investmentId === investmentId);
  }

  /**
   * Find pending workflows
   */
  async findPendingWorkflows(): Promise<ApprovalWorkflow[]> {
    return this.items.filter(workflow => 
      workflow.workflow.overallStatus === 'PENDING' || 
      workflow.workflow.overallStatus === 'IN_PROGRESS'
    );
  }

  /**
   * Find workflows requiring escalation
   */
  async findWorkflowsRequiringEscalation(): Promise<ApprovalWorkflow[]> {
    const now = new Date();
    return this.items.filter(workflow => {
      const hoursSinceCreation = (now.getTime() - workflow.createdAt.getTime()) / (1000 * 60 * 60);
      return hoursSinceCreation >= workflow.escalation.escalationThreshold &&
             workflow.escalation.currentEscalationLevel < workflow.escalation.maxEscalations;
    });
  }
}

/**
 * Investment Metrics Repository
 * Manages investment performance metrics and reporting
 */
export class InvestmentMetricsRepository extends BaseRepositoryImpl<InvestmentMetrics> {
  protected generateId(): string {
    return generateId('investment_metrics');
  }

  /**
   * Find metrics by period type
   */
  async findByPeriodType(periodType: InvestmentMetrics['periodType']): Promise<InvestmentMetrics[]> {
    return this.items.filter(metrics => metrics.periodType === periodType);
  }

  /**
   * Get latest metrics
   */
  async getLatestMetrics(periodType?: InvestmentMetrics['periodType']): Promise<InvestmentMetrics | null> {
    let metrics = [...this.items];
    
    if (periodType) {
      metrics = metrics.filter(m => m.periodType === periodType);
    }

    if (metrics.length === 0) return null;

    return metrics.reduce((latest, current) => 
      current.reportingPeriod.endDate > latest.reportingPeriod.endDate ? current : latest
    );
  }
}

/**
 * Capital Plan Repository
 * Manages strategic capital planning and pipeline
 */
export class CapitalPlanRepository extends BaseRepositoryImpl<CapitalPlan> {
  protected generateId(): string {
    return generateId('capital_plan');
  }

  /**
   * Find active capital plans
   */
  async findActivePlans(): Promise<CapitalPlan[]> {
    return this.items.filter(plan => plan.governance.approvalStatus === 'ACTIVE');
  }

  /**
   * Find plans by planning horizon
   */
  async findByPlanningHorizon(years: number): Promise<CapitalPlan[]> {
    return this.items.filter(plan => plan.planningHorizon.years === years);
  }

  /**
   * Find plans requiring review
   */
  async findPlansRequiringReview(): Promise<CapitalPlan[]> {
    const today = new Date();
    return this.items.filter(plan => plan.governance.nextReviewDate <= today);
  }
}

/**
 * Asset Acquisition Repository
 * Manages asset acquisition processes and vendor relationships
 */
export class AssetAcquisitionRepository extends BaseRepositoryImpl<AssetAcquisition> {
  protected generateId(): string {
    return generateId('asset_acquisition');
  }

  /**
   * Find acquisitions by investment
   */
  async findByInvestmentId(investmentId: string): Promise<AssetAcquisition[]> {
    return this.items.filter(acquisition => acquisition.investmentId === investmentId);
  }

  /**
   * Find acquisitions by status
   */
  async findByStatus(status: AssetAcquisition['status']): Promise<AssetAcquisition[]> {
    return this.items.filter(acquisition => acquisition.status === status);
  }

  /**
   * Find acquisitions by vendor
   */
  async findByVendorId(vendorId: string): Promise<AssetAcquisition[]> {
    return this.items.filter(acquisition => acquisition.vendor.vendorId === vendorId);
  }

  /**
   * Find overdue acquisitions
   */
  async findOverdueAcquisitions(): Promise<AssetAcquisition[]> {
    const today = new Date();
    return this.items.filter(acquisition => 
      acquisition.timeline.expectedDeliveryDate < today &&
      acquisition.status !== 'DELIVERED' &&
      acquisition.status !== 'ACCEPTED'
    );
  }
}

// Export singleton instances for use throughout the application
export const capitalAssetRepository = new CapitalAssetRepository();
export const capitalInvestmentRepository = new CapitalInvestmentRepository();
export const investmentProposalRepository = new InvestmentProposalRepository();
export const roiAnalysisRepository = new ROIAnalysisRepository();
export const capitalBudgetRepository = new CapitalBudgetRepository();
export const capitalExpenditureRepository = new CapitalExpenditureRepository();
export const investmentPortfolioRepository = new InvestmentPortfolioRepository();
export const capitalAssetPerformanceRepository = new CapitalAssetPerformanceRepository();
export const approvalWorkflowRepository = new ApprovalWorkflowRepository();
export const investmentMetricsRepository = new InvestmentMetricsRepository();
export const capitalPlanRepository = new CapitalPlanRepository();
export const assetAcquisitionRepository = new AssetAcquisitionRepository();