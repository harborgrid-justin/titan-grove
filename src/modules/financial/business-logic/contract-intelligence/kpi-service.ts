/**
 * KPI Service
 * Handles KPI generation and financial summaries for contract intelligence
 */

import { KPIWidget, FinancialSummary, RiskAlert } from './types';

export class KPIService {
  /**
   * Generate key performance indicators
   */
  async generateKPIs(): Promise<KPIWidget[]> {
    return [
      {
        kpiId: 'kpi_contract_value',
        kpiName: 'Total Contract Value',
        currentValue: 150000000,
        targetValue: 140000000,
        unit: 'USD',
        trend: 'UP',
        performanceIndicator: 'EXCEEDS',
      },
      {
        kpiId: 'kpi_cost_savings',
        kpiName: 'Cost Savings',
        currentValue: 2500000,
        targetValue: 2000000,
        unit: 'USD',
        trend: 'UP',
        performanceIndicator: 'EXCEEDS',
      },
      {
        kpiId: 'kpi_competition_rate',
        kpiName: 'Competition Rate',
        currentValue: 88,
        targetValue: 85,
        unit: 'Percentage',
        trend: 'UP',
        performanceIndicator: 'MEETS',
      },
      {
        kpiId: 'kpi_compliance_score',
        kpiName: 'Compliance Score',
        currentValue: 95,
        targetValue: 95,
        unit: 'Score',
        trend: 'STABLE',
        performanceIndicator: 'MEETS',
      },
    ];
  }

  /**
   * Generate financial summary
   */
  async generateFinancialSummary(): Promise<FinancialSummary> {
    return {
      totalContractValue: 150000000,
      obligatedAmount: 120000000,
      expendedAmount: 85000000,
      remainingValue: 65000000,
      plannedSavings: 3000000,
      actualSavings: 2500000,
      costAvoidance: 1200000,
      budgetVariance: -500000,
      forecastAccuracy: 92,
    };
  }

  /**
   * Generate risk alerts
   */
  async generateRiskAlerts(): Promise<RiskAlert[]> {
    return [
      {
        alertId: 'alert_001',
        alertType: 'COMPLIANCE',
        severity: 'MEDIUM',
        title: 'FAR Compliance Review Required',
        description: 'Contract modification requires additional FAR compliance review',
        affectedContracts: ['CONTRACT_001', 'CONTRACT_002'],
        recommendedActions: [
          'Schedule compliance review meeting',
          'Review FAR requirements for modifications',
          'Update contract documentation',
        ],
        escalationRequired: true,
      },
      {
        alertId: 'alert_002',
        alertType: 'FINANCIAL',
        severity: 'HIGH',
        title: 'Budget Variance Detected',
        description: 'Several contracts showing significant cost overruns',
        affectedContracts: ['CONTRACT_003', 'CONTRACT_004', 'CONTRACT_005'],
        recommendedActions: [
          'Review contract performance metrics',
          'Initiate cost control measures',
          'Meet with contracting officers',
        ],
        escalationRequired: true,
      },
    ];
  }

  /**
   * Calculate KPI variance
   */
  async calculateKPIVariance(
    kpiId: string,
    currentValue: number,
    targetValue: number
  ): Promise<{
    variance: number;
    variancePercent: number;
    performanceStatus: 'EXCEEDS' | 'MEETS' | 'BELOW' | 'CRITICAL';
  }> {
    const variance = currentValue - targetValue;
    const variancePercent = targetValue !== 0 ? (variance / targetValue) * 100 : 0;

    let performanceStatus: 'EXCEEDS' | 'MEETS' | 'BELOW' | 'CRITICAL' = 'MEETS';

    if (variancePercent > 10) {
      performanceStatus = 'EXCEEDS';
    } else if (variancePercent >= -5) {
      performanceStatus = 'MEETS';
    } else if (variancePercent >= -15) {
      performanceStatus = 'BELOW';
    } else {
      performanceStatus = 'CRITICAL';
    }

    return {
      variance,
      variancePercent,
      performanceStatus,
    };
  }

  /**
   * Generate cost savings analysis
   */
  async generateCostSavingsAnalysis(reportingPeriod: { startDate: Date; endDate: Date }): Promise<{
    totalSavings: number;
    savingsByCategory: { [category: string]: number };
    savingsMethodology: string[];
    verificationStatus: 'VERIFIED' | 'PENDING_VERIFICATION' | 'DISPUTED';
    savingsTrends: { period: string; amount: number }[];
    projectedSavings: number;
    riskAdjustedSavings: number;
  }> {
    return {
      totalSavings: 2500000,
      savingsByCategory: {
        Competition: 1200000,
        Negotiations: 800000,
        'Economies of Scale': 300000,
        'Process Improvements': 200000,
      },
      savingsMethodology: [
        'Price comparison analysis',
        'Historical benchmarking',
        'Market rate validation',
        'Supplier cost analysis',
      ],
      verificationStatus: 'VERIFIED',
      savingsTrends: [
        { period: 'Q1 FY24', amount: 500000 },
        { period: 'Q2 FY24', amount: 750000 },
        { period: 'Q3 FY24', amount: 600000 },
        { period: 'Q4 FY24', amount: 650000 },
      ],
      projectedSavings: 3200000,
      riskAdjustedSavings: 2750000,
    };
  }

  /**
   * Update KPI targets
   */
  async updateKPITargets(kpiTargets: { [kpiId: string]: number }): Promise<void> {
    // Implementation would update KPI targets in database
    console.log('Updating KPI targets:', kpiTargets);
  }

  /**
   * Generate KPI trend analysis
   */
  async generateKPITrendAnalysis(
    kpiId: string,
    timeframe: 'MONTHLY' | 'QUARTERLY' | 'YEARLY'
  ): Promise<{
    trendDirection: 'UP' | 'DOWN' | 'STABLE';
    changeRate: number;
    dataPoints: { date: Date; value: number }[];
    forecast: { date: Date; projectedValue: number }[];
  }> {
    const dataPoints = this.generateMockTrendData(timeframe);
    const changeRate = this.calculateChangeRate(dataPoints);

    return {
      trendDirection: changeRate > 2 ? 'UP' : changeRate < -2 ? 'DOWN' : 'STABLE',
      changeRate,
      dataPoints,
      forecast: this.generateForecast(dataPoints, 3), // 3 period forecast
    };
  }

  private generateMockTrendData(
    timeframe: 'MONTHLY' | 'QUARTERLY' | 'YEARLY'
  ): { date: Date; value: number }[] {
    const data = [];
    const periods = timeframe === 'YEARLY' ? 3 : timeframe === 'QUARTERLY' ? 8 : 12;
    const baseValue = 95;

    for (let i = 0; i < periods; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - (periods - 1 - i));
      const value = baseValue + Math.random() * 10 - 5; // +/- 5 variation
      data.push({ date, value });
    }

    return data;
  }

  private calculateChangeRate(dataPoints: { date: Date; value: number }[]): number {
    if (dataPoints.length < 2) return 0;

    const firstValue = dataPoints[0].value;
    const lastValue = dataPoints[dataPoints.length - 1].value;

    return ((lastValue - firstValue) / firstValue) * 100;
  }

  private generateForecast(
    dataPoints: { date: Date; value: number }[],
    periods: number
  ): { date: Date; projectedValue: number }[] {
    const forecast = [];
    const lastValue = dataPoints[dataPoints.length - 1].value;
    const trend = this.calculateChangeRate(dataPoints) / dataPoints.length; // per period trend

    for (let i = 1; i <= periods; i++) {
      const date = new Date(dataPoints[dataPoints.length - 1].date);
      date.setMonth(date.getMonth() + i);
      const projectedValue = lastValue * (1 + (trend * i) / 100);
      forecast.push({ date, projectedValue });
    }

    return forecast;
  }
}

// Export singleton instance
export const kpiService = new KPIService();
