/**
 * HR Payroll Management Business Logic
 * Handles payroll processing, tax calculations, deductions, and compliance
 * Enhanced with message queue and cache integration
 */

import { StandardServiceBase } from '../../../shared/utils/standard-service-base';
import { ServiceIntegrationContext } from '../../../shared/interfaces/service-integration';
import { MessagePayload, QueueType } from '../../../core/message-queue/types';

export interface PayrollConfiguration {
  id: string;
  companyId: string;
  payFrequency: 'WEEKLY' | 'BIWEEKLY' | 'SEMIMONTHLY' | 'MONTHLY';
  taxJurisdiction: string;
  overtimeThreshold: number; // hours per week
  overtimeMultiplier: number; // 1.5 for time and a half
  roundingRules: PayrollRoundingRules;
  isActive: boolean;
}

export interface PayrollRoundingRules {
  timeRounding: 'NONE' | 'QUARTER_HOUR' | 'HALF_HOUR' | 'HOUR';
  payRounding: 'NONE' | 'PENNY' | 'NICKEL' | 'DIME';
}

export interface PayrollTaxTable {
  id: string;
  jurisdiction: string;
  taxType: 'FEDERAL' | 'STATE' | 'LOCAL' | 'FICA' | 'MEDICARE';
  year: number;
  brackets: TaxBracket[];
  isActive: boolean;
}

export interface TaxBracket {
  minIncome: number;
  maxIncome?: number;
  rate: number;
  baseAmount: number;
}

export class HRPayrollService extends StandardServiceBase {
  
  constructor(context?: ServiceIntegrationContext) {
    if (context) {
      super(context);
    } else {
      // Fallback for backward compatibility
      super({
        messageQueue: null as any,
        cache: null as any,
        logger: console as any,
        config: {
          serviceName: 'hr-payroll-service',
          cacheConfig: { defaultTTL: 1800, keyPrefix: 'payroll' },
          messageQueueConfig: { 
            defaultPriority: 2, 
            retryAttempts: 3,
            compliance: { dataClassification: 'CONFIDENTIAL', auditRequired: true }
          }
        }
      });
    }
  }

  /**
   * Handle message processing for payroll operations
   */
  async processMessage(message: MessagePayload): Promise<any> {
    this.markMessageProcessed();
    
    switch (message.type) {
      case 'PROCESS_PAYROLL_BATCH':
        return await this.processPayrollBatch(
          new Date(message.data.payPeriodStart),
          new Date(message.data.payPeriodEnd),
          message.data.employeeIds
        );
      case 'CALCULATE_TAX':
        return await this.calculateTax(message.data.grossPay, message.data.jurisdiction);
      case 'UPDATE_TAX_TABLES':
        return await this.updateTaxTables(message.data.year, message.data.tables);
      default:
        throw new Error(`Unknown payroll message type: ${message.type}`);
    }
  }

  /**
   * Get queue types this service handles
   */
  getHandledQueueTypes(): QueueType[] {
    return [QueueType.HR, QueueType.AUDIT];
  }
  
  /**
   * Payroll Processing Engine with caching and queue integration
   */
  async processPayrollBatch(payPeriodStart: Date, payPeriodEnd: Date, employeeIds?: string[]): Promise<{
    batchId: string;
    processedCount: number;
    totalGrossPay: number;
    totalDeductions: number;
    totalNetPay: number;
    errors: Array<{ employeeId: string; error: string }>;
  }> {
    return this.executeWithMetrics(async () => {
      const batchId = this.generateId('batch');
      const batchKey = `batch:${batchId}`;
      
      // Start payroll batch processing
      await this.setCached(batchKey, { status: 'PROCESSING', startTime: new Date() }, 3600); // 1 hour
      
      // Send notification about batch start
      if (this.messageQueue) {
        await this.sendMessage(
          QueueType.AUDIT,
          'PAYROLL_BATCH_STARTED',
          { batchId, payPeriodStart, payPeriodEnd, employeeCount: employeeIds?.length },
          { compliance: { auditRequired: true, dataClassification: 'CONFIDENTIAL' } }
        );
      }
      
      // Get employees to process (with caching)
      const employees = await this.executeWithCache(
        `employees:${employeeIds?.join(',') || 'all'}`,
        () => this.getEmployeesForPayroll(employeeIds),
        900 // 15 minutes
      );
      
      const results = {
        batchId,
        processedCount: 0,
        totalGrossPay: 0,
        totalDeductions: 0,
        totalNetPay: 0,
        errors: [] as Array<{ employeeId: string; error: string }>
      };
    
    for (const employee of employees) {
      try {
        const payrollRecord = await this.processEmployeePayroll(employee.id, payPeriodStart, payPeriodEnd);
        results.processedCount++;
        results.totalGrossPay += payrollRecord.grossPay;
        results.totalDeductions += payrollRecord.totalDeductions;
        results.totalNetPay += payrollRecord.netPay;
      } catch (error) {
        results.errors.push({
          employeeId: employee.id,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    // Update cache with batch completion
    await this.setCached(batchKey, { 
      status: 'COMPLETED', 
      startTime: new Date(),
      endTime: new Date(),
      results 
    }, 3600);

    // Send completion notification
    if (this.messageQueue) {
      await this.sendMessage(
        QueueType.AUDIT,
        'PAYROLL_BATCH_COMPLETED',
        { batchId, processedCount: results.processedCount, totalGrossPay: results.totalGrossPay },
        { compliance: { auditRequired: true, dataClassification: 'CONFIDENTIAL' } }
      );
    }
    
    return results;
    });
  }

  private async getEmployeesForPayroll(employeeIds?: string[]): Promise<Array<{ id: string; name: string }>> {
    // Implementation would fetch active employees
    console.log('Fetching employees for payroll processing', employeeIds);
    return [
      { id: 'emp_001', name: 'John Doe' },
      { id: 'emp_002', name: 'Jane Smith' }
    ];
  }

  private async processEmployeePayroll(employeeId: string, periodStart: Date, periodEnd: Date): Promise<{
    employeeId: string;
    grossPay: number;
    totalDeductions: number;
    netPay: number;
  }> {
    console.log(`Processing payroll for employee ${employeeId}`);
    
    // Calculate gross pay
    const grossPay = await this.calculateGrossPay(employeeId, periodStart, periodEnd);
    
    // Calculate deductions
    const deductions = await this.calculateAllDeductions(employeeId, grossPay);
    const totalDeductions = deductions.reduce((sum, d) => sum + d.amount, 0);
    
    // Calculate net pay
    const netPay = grossPay - totalDeductions;
    
    // Create payroll record
    await this.createPayrollRecord(employeeId, periodStart, periodEnd, grossPay, deductions, netPay);
    
    return {
      employeeId,
      grossPay,
      totalDeductions,
      netPay
    };
  }

  /**
   * Gross Pay Calculation
   */
  async calculateGrossPay(employeeId: string, periodStart: Date, periodEnd: Date): Promise<number> {
    const employee = await this.getEmployeePayInfo(employeeId);
    const timeEntries = await this.getTimeEntries(employeeId, periodStart, periodEnd);
    
    let grossPay = 0;
    
    if (employee.payType === 'HOURLY') {
      const { regularHours, overtimeHours } = this.calculateHours(timeEntries);
      grossPay = (regularHours * employee.hourlyRate) + (overtimeHours * employee.hourlyRate * 1.5);
    } else if (employee.payType === 'SALARY') {
      grossPay = employee.salaryAmount / employee.payPeriodsPerYear;
    }
    
    // Add any bonuses or commissions
    const bonuses = await this.calculateBonuses(employeeId, periodStart, periodEnd);
    grossPay += bonuses.reduce((sum, bonus) => sum + bonus.amount, 0);
    
    return this.roundAmount(grossPay);
  }

  private async getEmployeePayInfo(employeeId: string): Promise<{
    payType: 'HOURLY' | 'SALARY';
    hourlyRate: number;
    salaryAmount: number;
    payPeriodsPerYear: number;
  }> {
    console.log(`Getting pay info for employee ${employeeId}`);
    return {
      payType: 'HOURLY',
      hourlyRate: 25.00,
      salaryAmount: 52000,
      payPeriodsPerYear: 26
    };
  }

  private async getTimeEntries(employeeId: string, periodStart: Date, periodEnd: Date): Promise<Array<{
    date: Date;
    hoursWorked: number;
    overtimeHours: number;
  }>> {
    console.log(`Getting time entries for employee ${employeeId} from ${periodStart} to ${periodEnd}`);
    return [
      { date: new Date(), hoursWorked: 8, overtimeHours: 0 },
      { date: new Date(), hoursWorked: 9, overtimeHours: 1 }
    ];
  }

  private calculateHours(timeEntries: Array<{ hoursWorked: number; overtimeHours: number }>): {
    regularHours: number;
    overtimeHours: number;
  } {
    const regularHours = timeEntries.reduce((sum, entry) => sum + (entry.hoursWorked - entry.overtimeHours), 0);
    const overtimeHours = timeEntries.reduce((sum, entry) => sum + entry.overtimeHours, 0);
    
    return { regularHours, overtimeHours };
  }

  private async calculateBonuses(_employeeId: string, _periodStart: Date, _periodEnd: Date): Promise<Array<{
    type: string;
    amount: number;
  }>> {
    // Implementation would calculate performance bonuses, commissions, etc.
    return [];
  }

  /**
   * Tax and Deduction Calculations
   */
  async calculateAllDeductions(employeeId: string, grossPay: number): Promise<Array<{
    type: string;
    description: string;
    amount: number;
    isPreTax: boolean;
  }>> {
    const deductions = [];
    
    // Tax deductions
    const taxes = await this.calculateTaxes(employeeId, grossPay);
    deductions.push(...taxes);
    
    // Benefit deductions
    const benefits = await this.calculateBenefitDeductions(employeeId, grossPay);
    deductions.push(...benefits);
    
    // Other deductions
    const other = await this.calculateOtherDeductions(employeeId, grossPay);
    deductions.push(...other);
    
    return deductions;
  }

  private async calculateTaxes(employeeId: string, grossPay: number): Promise<Array<{
    type: string;
    description: string;
    amount: number;
    isPreTax: boolean;
  }>> {
    const employeeTaxInfo = await this.getEmployeeTaxInfo(employeeId);
    const taxTables = await this.getTaxTables(employeeTaxInfo.jurisdiction, new Date().getFullYear());
    
    const taxes = [];
    
    for (const table of taxTables) {
      const taxAmount = this.calculateTaxFromTable(grossPay, table);
      taxes.push({
        type: 'TAX',
        description: `${table.taxType} Tax`,
        amount: this.roundAmount(taxAmount),
        isPreTax: false
      });
    }
    
    return taxes;
  }

  private async getEmployeeTaxInfo(_employeeId: string): Promise<{
    jurisdiction: string;
    filingStatus: string;
    allowances: number;
  }> {
    return {
      jurisdiction: 'US-CA',
      filingStatus: 'SINGLE',
      allowances: 1
    };
  }

  private async getTaxTables(_jurisdiction: string, year: number): Promise<PayrollTaxTable[]> {
    console.log(`Getting tax tables for ${_jurisdiction} year ${year}`);
    return [
      {
        id: 'fed_2024',
        jurisdiction: 'US',
        taxType: 'FEDERAL',
        year: 2024,
        brackets: [
          { minIncome: 0, maxIncome: 11000, rate: 0.10, baseAmount: 0 },
          { minIncome: 11000, maxIncome: 44725, rate: 0.12, baseAmount: 1100 },
          { minIncome: 44725, rate: 0.22, baseAmount: 5147 }
        ],
        isActive: true
      }
    ];
  }

  private calculateTaxFromTable(grossPay: number, table: PayrollTaxTable): number {
    const annualizedPay = grossPay * 26; // Assume biweekly
    
    for (const bracket of table.brackets) {
      if (annualizedPay >= bracket.minIncome && (bracket.maxIncome === undefined || annualizedPay <= bracket.maxIncome)) {
        const taxableAmount = annualizedPay - bracket.minIncome;
        const tax = bracket.baseAmount + (taxableAmount * bracket.rate);
        return tax / 26; // Convert back to pay period
      }
    }
    
    return 0;
  }

  private async calculateBenefitDeductions(employeeId: string, grossPay: number): Promise<Array<{
    type: string;
    description: string;
    amount: number;
    isPreTax: boolean;
  }>> {
    console.log(`Calculating benefit deductions for employee ${employeeId}`);
    
    // Mock benefit deductions
    return [
      {
        type: 'HEALTH_INSURANCE',
        description: 'Health Insurance Premium',
        amount: 125.00,
        isPreTax: true
      },
      {
        type: 'DENTAL_INSURANCE', 
        description: 'Dental Insurance Premium',
        amount: 25.00,
        isPreTax: true
      },
      {
        type: 'RETIREMENT',
        description: '401k Contribution',
        amount: grossPay * 0.06, // 6% contribution
        isPreTax: true
      }
    ];
  }

  private async calculateOtherDeductions(employeeId: string, _grossPay: number): Promise<Array<{
    type: string;
    description: string;
    amount: number;
    isPreTax: boolean;
  }>> {
    console.log(`Calculating other deductions for employee ${employeeId}`);
    
    // Could include garnishments, union dues, parking, etc.
    return [];
  }

  /**
   * Payroll Record Management
   */
  private async createPayrollRecord(
    employeeId: string,
    periodStart: Date,
    periodEnd: Date,
    grossPay: number,
    deductions: Array<{ type: string; description: string; amount: number }>,
    netPay: number
  ): Promise<void> {
    const payrollRecord = {
      id: `payroll_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      employeeId,
      payPeriodStart: periodStart,
      payPeriodEnd: periodEnd,
      grossPay,
      deductions,
      netPay,
      payDate: this.calculatePayDate(periodEnd),
      status: 'PROCESSED' as const
    };
    
    console.log('Created payroll record:', payrollRecord);
  }

  private calculatePayDate(periodEnd: Date): Date {
    // Typically pay date is a few days after period end
    const payDate = new Date(periodEnd);
    payDate.setDate(payDate.getDate() + 3);
    return payDate;
  }

  /**
   * Utility Methods
   */
  private roundAmount(amount: number): number {
    return Math.round(amount * 100) / 100; // Round to nearest cent
  }

  async generatePayrollReport(reportType: 'SUMMARY' | 'DETAIL' | 'TAX_LIABILITY', parameters: {
    startDate: Date;
    endDate: Date;
    departmentId?: string;
  }): Promise<any> {
    console.log(`Generating ${reportType} payroll report`, parameters);
    
    return {
      reportType,
      period: parameters,
      generatedAt: new Date(),
      data: {}
    };
  }

  /**
   * Tax calculation method referenced by message processing
   */
  async calculateTax(grossPay: number, jurisdiction: string): Promise<number> {
    const taxTables = await this.getTaxTables(jurisdiction, new Date().getFullYear());
    let totalTax = 0;
    
    for (const table of taxTables) {
      totalTax += this.calculateTaxFromTable(grossPay, table);
    }
    
    return this.roundAmount(totalTax);
  }

  /**
   * Update tax tables method referenced by message processing
   */
  async updateTaxTables(year: number, tables: PayrollTaxTable[]): Promise<void> {
    console.log(`Updating tax tables for year ${year}`, { tableCount: tables.length });
    
    // Send audit notification
    if (this.messageQueue) {
      await this.sendMessage(
        QueueType.AUDIT,
        'TAX_TABLES_UPDATED',
        { year, tableCount: tables.length },
        { compliance: { auditRequired: true, dataClassification: 'INTERNAL' } }
      );
    }
  }

  /**
   * Service-specific health check
   */
  protected async performServiceSpecificHealthCheck(): Promise<Record<string, any> | null> {
    return {
      payroll: 'operational',
      taxTables: 'loaded',
      calculationEngine: 'available'
    };
  }
}

// Export singleton instance - will be properly initialized with context
export let hrPayrollService: HRPayrollService;

// Factory function to create properly initialized service
export function createHRPayrollService(context?: ServiceIntegrationContext): HRPayrollService {
  hrPayrollService = new HRPayrollService(context);
  return hrPayrollService;
}

// For backward compatibility, create a basic instance
if (!hrPayrollService) {
  hrPayrollService = new HRPayrollService();
}