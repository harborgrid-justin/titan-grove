/**
 * Project Billing Business Logic
 * Handles invoice generation, contracts, profitability analysis
 */

import type { 
  ProjectInvoice, 
  ProjectInvoiceItem, 
  ProjectContract, 
  ProjectBudget 
} from '../../types';
import type { ProjectConfig } from '../../../../types/business-config';
import { IdUtils, DateUtils, FinancialUtils } from '../../../../shared/constants';

export class ProjectBillingService {
  
  async createProjectContract(contract: Omit<ProjectContract, 'id' | 'contractNumber'>): Promise<ProjectContract> {
    const id = IdUtils.generateContractId();
    const contractNumber = IdUtils.generateContractNumber();
    
    return {
      ...contract,
      id,
      contractNumber
    };
  }

  async generateProjectInvoice(
    projectId: string, 
    billingType: ProjectInvoice['billingType'],
    billingPeriod?: { startDate: Date; endDate: Date }
  ): Promise<ProjectInvoice> {
    const id = IdUtils.generateInvoiceId();
    const invoiceNumber = IdUtils.generateInvoiceNumber();
    const invoiceDate = new Date();
    
    // Load config for payment terms
    const { loadBusinessConfig } = require('../../../../utils/business-config');
    const config = loadBusinessConfig().project;
    const dueDate = DateUtils.getPaymentDueDate(invoiceDate, config.billing.paymentTermsDays);
    
    let lineItems: ProjectInvoiceItem[] = [];
    let subtotal = 0;
    
    // Generate line items based on billing type
    switch (billingType) {
      case 'TIME_AND_MATERIALS':
        lineItems = await this.generateTimeAndMaterialsLineItems(projectId, billingPeriod);
        break;
      case 'MILESTONE':
        lineItems = await this.generateMilestoneLineItems(projectId);
        break;
      case 'FIXED_PRICE':
        lineItems = await this.generateFixedPriceLineItems(projectId);
        break;
      case 'RECURRING':
        lineItems = await this.generateRecurringLineItems(projectId);
        break;
    }
    
    subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0);
    const taxAmount = FinancialUtils.calculateTax(subtotal, config.billing.standardTaxRate);
    const totalAmount = subtotal + taxAmount;
    
    return {
      id,
      invoiceNumber,
      projectId,
      customerId: 'cust_001', // Would fetch from project
      billingType,
      invoiceDate,
      dueDate,
      subtotal,
      taxAmount,
      totalAmount,
      status: 'DRAFT',
      lineItems,
      paymentTerms: `Net ${config.billing.paymentTermsDays}`
    };
  }

  private async generateTimeAndMaterialsLineItems(
    projectId: string, 
    period?: { startDate: Date; endDate: Date }
  ): Promise<ProjectInvoiceItem[]> {
    // Load config for labor rates
    const { loadBusinessConfig } = require('../../../../utils/business-config');
    const config = loadBusinessConfig().project;
    
    // In real implementation, would query timesheet data
    const laborHours = 120; // TODO: Replace with actual timesheet data
    const hourlyRate = config.financials.defaultLaborRate;
    const materialCosts = config.financials.defaultMaterialCostPerProject;
    
    return [
      {
        id: `li_${Date.now()}_1`,
        description: `Professional Services - ${period ? 'Period' : 'To Date'}`,
        quantity: laborHours,
        unitPrice: hourlyRate,
        amount: laborHours * hourlyRate,
        billableHours: laborHours
      },
      {
        id: `li_${Date.now()}_2`,
        description: 'Materials and Equipment',
        quantity: 1,
        unitPrice: materialCosts,
        amount: materialCosts
      }
    ];
  }

  private async generateMilestoneLineItems(projectId: string): Promise<ProjectInvoiceItem[]> {
    // Would fetch completed milestones
    return [
      {
        id: `li_${Date.now()}_1`,
        description: 'Milestone 1: Requirements Analysis Complete',
        quantity: 1,
        unitPrice: 25000,
        amount: 25000
      }
    ];
  }

  private async generateFixedPriceLineItems(projectId: string): Promise<ProjectInvoiceItem[]> {
    // Would calculate percentage complete and bill accordingly
    const totalProjectValue = 100000;
    const percentComplete = 0.3; // 30% complete
    const billingAmount = totalProjectValue * percentComplete;
    
    return [
      {
        id: `li_${Date.now()}_1`,
        description: 'Project Development - Progress Billing (30%)',
        quantity: 1,
        unitPrice: billingAmount,
        amount: billingAmount
      }
    ];
  }

  private async generateRecurringLineItems(projectId: string): Promise<ProjectInvoiceItem[]> {
    return [
      {
        id: `li_${Date.now()}_1`,
        description: 'Monthly Support and Maintenance',
        quantity: 1,
        unitPrice: 5000,
        amount: 5000
      }
    ];
  }

  async calculateProjectCashFlow(projectId: string): Promise<any> {
    // Calculate cash flow projection based on invoicing schedule and payments
    const cashFlowProjection = [];
    const currentDate = new Date();
    
    for (let i = 0; i < 12; i++) {
      const month = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
      const inflow = this.calculateMonthlyInflow(projectId, month);
      const outflow = this.calculateMonthlyOutflow(projectId, month);
      
      cashFlowProjection.push({
        month: month.toISOString().substring(0, 7),
        inflow: await inflow,
        outflow: await outflow,
        netFlow: (await inflow) - (await outflow)
      });
    }
    
    return {
      projectId,
      projectionPeriod: '12 months',
      totalInflow: cashFlowProjection.reduce((sum, item) => sum + item.inflow, 0),
      totalOutflow: cashFlowProjection.reduce((sum, item) => sum + item.outflow, 0),
      netCashFlow: cashFlowProjection.reduce((sum, item) => sum + item.netFlow, 0),
      monthlyProjection: cashFlowProjection
    };
  }

  private async calculateMonthlyInflow(projectId: string, month: Date): Promise<number> {
    // Load config for calculations
    const { loadBusinessConfig } = require('../../../../utils/business-config');
    const config = loadBusinessConfig().project;
    
    // Would calculate expected payments for the month based on invoicing schedule
    return config.financials.defaultMaterialCostPerProject * 3; // Example: 3x material cost for monthly inflow
  }

  private async calculateMonthlyOutflow(projectId: string, month: Date): Promise<number> {
    // Load config for calculations
    const { loadBusinessConfig } = require('../../../../utils/business-config');
    const config = loadBusinessConfig().project;
    
    // Would calculate expected costs for the month
    const baseCost = config.financials.defaultMaterialCostPerProject;
    return baseCost * 2.4; // Example: 2.4x material cost for monthly outflow
  }

  async measureProjectProfitability(projectId: string): Promise<any> {
    // Load config for financial calculations
    const { loadBusinessConfig } = require('../../../../utils/business-config');
    const config = loadBusinessConfig().project;
    
    const revenue = config.financials.defaultMaterialCostPerProject * 24; // 24x material cost as revenue baseline
    const laborCosts = await this.calculateProjectLaborCost(projectId);
    const materialCosts = config.financials.defaultMaterialCostPerProject * 3; // 3x for enhanced materials
    const overheadCosts = FinancialUtils.calculateOverhead(laborCosts + materialCosts, config.financials.overheadRatio);
    const totalCosts = laborCosts + materialCosts + overheadCosts;
    
    const grossProfit = revenue - totalCosts;
    const grossMargin = FinancialUtils.calculateProfitMargin(revenue, totalCosts);
    const profitMargin = grossProfit / totalCosts;
    
    return {
      projectId,
      revenue,
      costs: {
        labor: laborCosts,
        materials: materialCosts,
        overhead: overheadCosts,
        total: totalCosts
      },
      grossProfit,
      grossMargin,
      profitMargin,
      profitabilityIndex: revenue / totalCosts,
      earningsBeforeInterest: grossProfit,
      returnOnInvestment: grossProfit / totalCosts
    };
  }

  async calculateProjectLaborCost(projectId: string): Promise<number> {
    // Load config for billing rates
    const { loadBusinessConfig } = require('../../../../utils/business-config');
    const config = loadBusinessConfig().project;
    
    // Would query actual timesheet data
    // For now, return example calculation using configuration
    const totalHours = 400; // TODO: Query from timesheet data
    const averageRate = config.billing.defaultHourlyRate;
    return totalHours * averageRate;
  }

  async createProjectBudget(
    projectId: string, 
    budgetItems: Omit<ProjectBudget, 'projectId' | 'actualAmount' | 'remainingBudget' | 'variance' | 'variancePercentage'>[]
  ): Promise<ProjectBudget[]> {
    return budgetItems.map(item => ({
      ...item,
      projectId,
      actualAmount: 0,
      remainingBudget: item.budgetedAmount,
      variance: 0,
      variancePercentage: 0
    }));
  }

  async updateProjectCosts(projectId: string, category: ProjectBudget['category'], actualAmount: number): Promise<void> {
    // Implementation would update actual costs in database
    console.log(`Updated ${category} costs for project ${projectId}: ${actualAmount}`);
  }

  async calculateBudgetVariance(projectId: string): Promise<ProjectBudget[]> {
    // Would fetch budget items from database and calculate variances
    // Mock implementation for example
    return [];
  }
}

// Export singleton instance with centralized configuration
export const projectBillingService = new ProjectBillingService();