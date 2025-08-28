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

export class ProjectBillingService {
  
  async createProjectContract(contract: Omit<ProjectContract, 'id' | 'contractNumber'>): Promise<ProjectContract> {
    const id = `contract_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const contractNumber = `CON${Date.now().toString().slice(-6)}`;
    
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
    const id = `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const invoiceNumber = `INV${Date.now().toString().slice(-6)}`;
    const invoiceDate = new Date();
    const dueDate = new Date(invoiceDate.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
    
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
    const taxAmount = subtotal * 0.08; // 8% tax rate
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
      paymentTerms: 'Net 30'
    };
  }

  private async generateTimeAndMaterialsLineItems(
    projectId: string, 
    period?: { startDate: Date; endDate: Date }
  ): Promise<ProjectInvoiceItem[]> {
    // In real implementation, would query timesheet data
    const laborHours = 120;
    const hourlyRate = 150;
    const materialCosts = 5000;
    
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
    // Would calculate expected payments for the month based on invoicing schedule
    return 15000; // Example amount
  }

  private async calculateMonthlyOutflow(projectId: string, month: Date): Promise<number> {
    // Would calculate expected costs for the month
    return 12000; // Example amount
  }

  async measureProjectProfitability(projectId: string): Promise<any> {
    const revenue = 120000;
    const laborCosts = await this.calculateProjectLaborCost(projectId);
    const materialCosts = 15000;
    const overheadCosts = 8000;
    const totalCosts = laborCosts + materialCosts + overheadCosts;
    
    const grossProfit = revenue - totalCosts;
    const grossMargin = grossProfit / revenue;
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
    // Would query actual timesheet data
    // For now, return example calculation
    const totalHours = 400;
    const averageRate = 125;
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

// Export singleton instance
export const projectBillingService = new ProjectBillingService();