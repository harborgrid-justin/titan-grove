/**
 * Procurement Analytics Service
 * Business logic for procurement analytics and reporting
 */

import type { 
  ProcurementAnalytics,
  CategorySpend,
  SupplierSpend,
  SpendTrend,
  CycleTimeMetrics,
  QualityMetrics,
  ComplianceMetrics,
  RiskAnalytics
} from '../../types';
import { procurementAnalyticsRepository } from '../../data-access/repositories';

export class ProcurementAnalyticsService {
  
  /**
   * Get comprehensive procurement dashboard data
   */
  async getProcurementDashboard(
    startDate: Date,
    endDate: Date
  ): Promise<ProcurementAnalytics> {
    this.validateDateRange(startDate, endDate);
    
    return await procurementAnalyticsRepository.getDashboardData(startDate, endDate);
  }

  /**
   * Get spend analytics by category
   */
  async getSpendByCategory(
    startDate: Date,
    endDate: Date
  ): Promise<CategorySpend[]> {
    this.validateDateRange(startDate, endDate);
    
    return await procurementAnalyticsRepository.getSpendByCategory(startDate, endDate);
  }

  /**
   * Get spend analytics by supplier
   */
  async getSpendBySupplier(
    startDate: Date,
    endDate: Date
  ): Promise<SupplierSpend[]> {
    this.validateDateRange(startDate, endDate);
    
    return await procurementAnalyticsRepository.getSpendBySupplier(startDate, endDate);
  }

  /**
   * Get spend trend analysis
   */
  async getSpendTrend(
    startDate: Date,
    endDate: Date,
    granularity: 'DAILY' | 'WEEKLY' | 'MONTHLY' = 'MONTHLY'
  ): Promise<SpendTrend[]> {
    this.validateDateRange(startDate, endDate);
    
    return await procurementAnalyticsRepository.getSpendTrend(startDate, endDate, granularity);
  }

  /**
   * Get procurement cycle time metrics
   */
  async getCycleTimeMetrics(
    startDate: Date,
    endDate: Date
  ): Promise<CycleTimeMetrics> {
    this.validateDateRange(startDate, endDate);
    
    return await procurementAnalyticsRepository.getCycleTimeMetrics(startDate, endDate);
  }

  /**
   * Get quality metrics
   */
  async getQualityMetrics(
    startDate: Date,
    endDate: Date
  ): Promise<QualityMetrics> {
    this.validateDateRange(startDate, endDate);
    
    return await procurementAnalyticsRepository.getQualityMetrics(startDate, endDate);
  }

  /**
   * Get compliance metrics
   */
  async getComplianceMetrics(
    startDate: Date,
    endDate: Date
  ): Promise<ComplianceMetrics> {
    this.validateDateRange(startDate, endDate);
    
    return await procurementAnalyticsRepository.getComplianceMetrics(startDate, endDate);
  }

  /**
   * Get risk analytics
   */
  async getRiskAnalytics(
    startDate: Date,
    endDate: Date
  ): Promise<RiskAnalytics> {
    this.validateDateRange(startDate, endDate);
    
    return await procurementAnalyticsRepository.getRiskAnalytics(startDate, endDate);
  }

  /**
   * Get savings analytics
   */
  async getSavingsAnalytics(
    startDate: Date,
    endDate: Date
  ): Promise<{
    totalSavings: { amount: number; currency: string };
    savingsByCategory: Array<{ category: string; savings: { amount: number; currency: string } }>;
    savingsFromNegotiation: { amount: number; currency: string };
    savingsFromCompetition: { amount: number; currency: string };
  }> {
    this.validateDateRange(startDate, endDate);
    
    return await procurementAnalyticsRepository.getSavingsAnalytics(startDate, endDate);
  }

  /**
   * Generate executive summary report
   */
  async generateExecutiveSummary(
    startDate: Date,
    endDate: Date
  ): Promise<{
    totalSpend: { amount: number; currency: string };
    totalSavings: { amount: number; currency: string };
    supplierCount: number;
    contractCount: number;
    cycleTimeImprovement: number; // percentage
    qualityScore: number;
    riskScore: number;
    complianceScore: number;
    keyInsights: string[];
    recommendations: string[];
  }> {
    const dashboard = await this.getProcurementDashboard(startDate, endDate);
    const cycleMetrics = await this.getCycleTimeMetrics(startDate, endDate);
    const qualityMetrics = await this.getQualityMetrics(startDate, endDate);
    const complianceMetrics = await this.getComplianceMetrics(startDate, endDate);
    
    // Mock executive summary - in real implementation would analyze trends
    return {
      totalSpend: dashboard.totalSpend,
      totalSavings: dashboard.totalSavings,
      supplierCount: dashboard.spendBySupplier.length,
      contractCount: 125, // Mock value
      cycleTimeImprovement: 15.5, // percentage improvement
      qualityScore: qualityMetrics.supplierRatingAverage,
      riskScore: 7.2, // out of 10
      complianceScore: complianceMetrics.policyComplianceRate,
      keyInsights: [
        'Procurement spend increased 8% compared to previous period',
        'Supplier diversity improved with 15% more diverse suppliers',
        'Contract compliance rate improved to 94.5%',
        'Average cycle time reduced by 2.3 days'
      ],
      recommendations: [
        'Focus on strategic sourcing for top spend categories',
        'Implement supplier development programs for key suppliers',
        'Standardize procurement processes across departments',
        'Increase use of framework agreements to reduce cycle times'
      ]
    };
  }

  private validateDateRange(startDate: Date, endDate: Date): void {
    if (startDate >= endDate) {
      throw new Error('Start date must be before end date');
    }
    
    const maxRange = 365 * 24 * 60 * 60 * 1000; // 1 year in milliseconds
    if (endDate.getTime() - startDate.getTime() > maxRange) {
      throw new Error('Date range cannot exceed 1 year');
    }
  }
}

export const procurementAnalyticsService = new ProcurementAnalyticsService();