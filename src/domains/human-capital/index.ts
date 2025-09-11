/**
 * Human Capital Domain
 * Centralized business logic for HR, payroll, and workforce management
 */

import { hrManager, HRManager } from '../../modules/hr';
import { BusinessConfig } from '../../types/business-config';

export interface HumanCapitalDomainConfig {
  hr: {
    salaryBands: {
      junior: { min: number; max: number };
      mid: { min: number; max: number };
      senior: { min: number; max: number };
    };
    benefitRates: {
      healthInsurance: number;
      retirement: number;
      vacation: number;
    };
    workforceRatios: {
      managementSpan: number;
      contractorRatio: number;
      turnoverTarget: number;
    };
  };
}

/**
 * Core Business Logic Functions - Human Capital Domain
 * Consolidated business calculations for workforce management
 */
export class HumanCapitalBusinessLogic {
  /**
   * Calculate total compensation including benefits
   */
  static calculateTotalCompensation(baseSalary: number, benefitPercentage: number = 0.3): number {
    return baseSalary * (1 + benefitPercentage);
  }

  /**
   * Calculate workforce capacity metrics
   */
  static calculateWorkforceCapacity(headcount: number, utilizationRate: number = 0.8): number {
    return Math.floor(headcount * utilizationRate);
  }

  /**
   * Calculate payroll burden costs
   */
  static calculatePayrollBurden(
    salaryTotal: number,
    taxes: number = 0.15,
    benefits: number = 0.25
  ): {
    grossPayroll: number;
    taxes: number;
    benefits: number;
    totalBurden: number;
  } {
    const taxAmount = salaryTotal * taxes;
    const benefitAmount = salaryTotal * benefits;
    return {
      grossPayroll: salaryTotal,
      taxes: taxAmount,
      benefits: benefitAmount,
      totalBurden: salaryTotal + taxAmount + benefitAmount,
    };
  }
}

/**
 * Human Capital Domain Manager
 * Orchestrates all HR-related modules with centralized business logic
 */
export class HumanCapitalDomainManager {
  private hrManager: HRManager;
  private config: HumanCapitalDomainConfig;

  constructor(config?: Partial<HumanCapitalDomainConfig>) {
    this.hrManager = hrManager;
    this.config = this.getDefaultConfig();
    if (config) {
      this.config = { ...this.config, ...config };
    }
  }

  private getDefaultConfig(): HumanCapitalDomainConfig {
    return {
      hr: {
        salaryBands: {
          junior: { min: 40000, max: 60000 },
          mid: { min: 60000, max: 90000 },
          senior: { min: 90000, max: 150000 },
        },
        benefitRates: {
          healthInsurance: 0.12,
          retirement: 0.06,
          vacation: 0.08,
        },
        workforceRatios: {
          managementSpan: 7,
          contractorRatio: 0.2,
          turnoverTarget: 0.1,
        },
      },
    };
  }

  /**
   * Perform comprehensive workforce analysis
   */
  async performWorkforceAnalysis(organizationId: string): Promise<any> {
    // Placeholder for workforce analysis business logic
    return {
      headcount: 100,
      utilizationRate: 0.82,
      capacity: HumanCapitalBusinessLogic.calculateWorkforceCapacity(100, 0.82),
      payrollBurden: HumanCapitalBusinessLogic.calculatePayrollBurden(5000000),
      metrics: {
        turnoverRate: 0.08,
        satisfactionScore: 4.2,
        productivityIndex: 1.15,
      },
    };
  }

  // Delegate to HR module for specific operations
  getHRManager(): HRManager {
    return this.hrManager;
  }

  getDomainConfig(): HumanCapitalDomainConfig {
    return this.config;
  }
}

// Export singleton instance
export const humanCapitalDomainManager = new HumanCapitalDomainManager();
