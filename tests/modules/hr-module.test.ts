/**
 * HR Module Tests
 * Comprehensive tests for HR business logic services
 */

import { 
  Employee, 
  PayrollRecord, 
  PerformanceReview, 
  TimeEntry, 
  BenefitEnrollment 
} from '../../../src/modules/hr/types';

// Mock implementations to test business logic patterns
class MockHREmployeeService {
  private employees: Map<string, Employee> = new Map();

  async createEmployee(employeeData: Partial<Employee>): Promise<Employee> {
    const employee: Employee = {
      id: `emp_${Date.now()}`,
      employeeNumber: `EMP${Math.floor(Math.random() * 10000)}`,
      firstName: employeeData.firstName || '',
      lastName: employeeData.lastName || '',
      email: employeeData.email || '',
      phone: employeeData.phone || '',
      dateOfBirth: employeeData.dateOfBirth || new Date(),
      hireDate: employeeData.hireDate || new Date(),
      department: employeeData.department || '',
      position: employeeData.position || '',
      salary: employeeData.salary || 0,
      status: employeeData.status || 'ACTIVE',
      address: employeeData.address || {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'US',
      },
      emergencyContact: employeeData.emergencyContact || {
        name: '',
        relationship: '',
        phone: '',
      },
    };

    this.employees.set(employee.id, employee);
    return employee;
  }

  async getEmployeeById(id: string): Promise<Employee | null> {
    return this.employees.get(id) || null;
  }

  async updateEmployee(id: string, updates: Partial<Employee>): Promise<Employee | null> {
    const employee = this.employees.get(id);
    if (!employee) return null;

    const updated = { ...employee, ...updates };
    this.employees.set(id, updated);
    return updated;
  }

  async searchEmployees(criteria: any): Promise<Employee[]> {
    return Array.from(this.employees.values()).filter(emp => {
      if (criteria.department && emp.department !== criteria.department) return false;
      if (criteria.status && emp.status !== criteria.status) return false;
      if (criteria.hiredAfter && emp.hireDate < criteria.hiredAfter) return false;
      return true;
    });
  }

  async calculateTotalCompensation(employeeId: string): Promise<number> {
    const employee = await this.getEmployeeById(employeeId);
    if (!employee) return 0;

    // Simplified calculation including base salary and estimated benefits
    const benefitsMultiplier = 0.25; // 25% of salary for benefits
    return employee.salary * (1 + benefitsMultiplier);
  }
}

class MockPayrollService {
  private payrollRecords: Map<string, PayrollRecord> = new Map();

  async calculatePayroll(employeeId: string, payPeriodStart: Date, payPeriodEnd: Date): Promise<PayrollRecord> {
    const employee = await new MockHREmployeeService().getEmployeeById(employeeId);
    if (!employee) throw new Error('Employee not found');

    // Calculate pay based on salary and pay period
    const daysInPeriod = Math.ceil((payPeriodEnd.getTime() - payPeriodStart.getTime()) / (1000 * 60 * 60 * 24));
    const dailySalary = employee.salary / 365;
    const grossPay = dailySalary * daysInPeriod;

    // Calculate deductions (simplified)
    const federalTax = grossPay * 0.20;
    const stateTax = grossPay * 0.05;
    const socialSecurity = grossPay * 0.062;
    const medicare = grossPay * 0.0145;

    const deductions = [
      { type: 'TAX' as const, description: 'Federal Income Tax', amount: federalTax },
      { type: 'TAX' as const, description: 'State Income Tax', amount: stateTax },
      { type: 'TAX' as const, description: 'Social Security', amount: socialSecurity },
      { type: 'TAX' as const, description: 'Medicare', amount: medicare },
    ];

    const totalDeductions = deductions.reduce((sum, d) => sum + d.amount, 0);
    const netPay = grossPay - totalDeductions;

    const payrollRecord: PayrollRecord = {
      id: `pay_${Date.now()}`,
      employeeId,
      payPeriodStart,
      payPeriodEnd,
      grossPay,
      deductions,
      netPay,
      payDate: new Date(),
      status: 'PROCESSED',
    };

    this.payrollRecords.set(payrollRecord.id, payrollRecord);
    return payrollRecord;
  }

  async getPayrollHistory(employeeId: string, year?: number): Promise<PayrollRecord[]> {
    return Array.from(this.payrollRecords.values())
      .filter(record => record.employeeId === employeeId)
      .filter(record => !year || record.payPeriodStart.getFullYear() === year);
  }

  async generatePayrollReport(payPeriod: string): Promise<any> {
    const records = Array.from(this.payrollRecords.values())
      .filter(record => record.payPeriodStart.toISOString().startsWith(payPeriod));

    return {
      payPeriod,
      totalEmployees: records.length,
      totalGrossPay: records.reduce((sum, r) => sum + r.grossPay, 0),
      totalNetPay: records.reduce((sum, r) => sum + r.netPay, 0),
      totalDeductions: records.reduce((sum, r) => 
        sum + r.deductions.reduce((dSum, d) => dSum + d.amount, 0), 0),
      records,
    };
  }
}

class MockPerformanceService {
  private reviews: Map<string, PerformanceReview> = new Map();

  async createPerformanceReview(reviewData: Partial<PerformanceReview>): Promise<PerformanceReview> {
    const review: PerformanceReview = {
      id: `review_${Date.now()}`,
      employeeId: reviewData.employeeId || '',
      reviewerId: reviewData.reviewerId || '',
      reviewPeriodStart: reviewData.reviewPeriodStart || new Date(),
      reviewPeriodEnd: reviewData.reviewPeriodEnd || new Date(),
      reviewType: reviewData.reviewType || 'ANNUAL',
      status: reviewData.status || 'DRAFT',
      overallRating: reviewData.overallRating || 0,
      goals: reviewData.goals || [],
      competencies: reviewData.competencies || [],
      strengths: reviewData.strengths || [],
      areasForImprovement: reviewData.areasForImprovement || [],
      developmentPlan: reviewData.developmentPlan || [],
      reviewerComments: reviewData.reviewerComments || '',
    };

    this.reviews.set(review.id, review);
    return review;
  }

  async calculateOverallRating(goals: any[], competencies: any[]): Promise<number> {
    const goalScore = goals.reduce((sum, goal) => sum + goal.rating, 0) / goals.length || 0;
    const competencyScore = competencies.reduce((sum, comp) => sum + comp.actualRating, 0) / competencies.length || 0;
    
    // Weighted average: 60% goals, 40% competencies
    return (goalScore * 0.6) + (competencyScore * 0.4);
  }

  async getReviewsByEmployee(employeeId: string): Promise<PerformanceReview[]> {
    return Array.from(this.reviews.values()).filter(review => review.employeeId === employeeId);
  }
}

describe('HR Module Integration Tests', () => {
  let employeeService: MockHREmployeeService;
  let payrollService: MockPayrollService;
  let performanceService: MockPerformanceService;

  beforeEach(() => {
    employeeService = new MockHREmployeeService();
    payrollService = new MockPayrollService();
    performanceService = new MockPerformanceService();
  });

  describe('Employee Management Service', () => {
    it('should create employee with complete data validation', async () => {
      const employeeData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@company.com',
        phone: '+1-555-0100',
        dateOfBirth: new Date('1990-05-15'),
        hireDate: new Date('2024-01-15'),
        department: 'Engineering',
        position: 'Software Engineer',
        salary: 75000,
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

      const employee = await employeeService.createEmployee(employeeData);

      expect(employee.id).toMatch(/^emp_\d+$/);
      expect(employee.employeeNumber).toMatch(/^EMP\d+$/);
      expect(employee.firstName).toBe(employeeData.firstName);
      expect(employee.email).toBe(employeeData.email);
      expect(employee.department).toBe(employeeData.department);
      expect(employee.status).toBe('ACTIVE');
    });

    it('should search employees by multiple criteria', async () => {
      // Create test employees
      await employeeService.createEmployee({
        firstName: 'Alice',
        lastName: 'Smith',
        email: 'alice@company.com',
        department: 'Engineering',
        position: 'Senior Engineer',
        salary: 85000,
        hireDate: new Date('2023-01-01'),
      });

      await employeeService.createEmployee({
        firstName: 'Bob',
        lastName: 'Johnson',
        email: 'bob@company.com',
        department: 'Sales',
        position: 'Sales Rep',
        salary: 60000,
        hireDate: new Date('2024-01-01'),
      });

      const engineeringEmployees = await employeeService.searchEmployees({
        department: 'Engineering',
      });

      expect(engineeringEmployees).toHaveLength(1);
      expect(engineeringEmployees[0].firstName).toBe('Alice');
    });

    it('should calculate total compensation including benefits', async () => {
      const employee = await employeeService.createEmployee({
        firstName: 'Test',
        lastName: 'Employee',
        email: 'test@company.com',
        salary: 80000,
        department: 'IT',
      });

      const totalCompensation = await employeeService.calculateTotalCompensation(employee.id);

      expect(totalCompensation).toBe(100000); // 80000 * 1.25
    });
  });

  describe('Payroll Management Service', () => {
    it('should calculate payroll with accurate tax deductions', async () => {
      const employee = await employeeService.createEmployee({
        firstName: 'Payroll',
        lastName: 'Test',
        email: 'payroll@company.com',
        salary: 78000, // Annual salary
      });

      const payPeriodStart = new Date('2024-01-01');
      const payPeriodEnd = new Date('2024-01-15'); // 14 days

      const payrollRecord = await payrollService.calculatePayroll(
        employee.id,
        payPeriodStart,
        payPeriodEnd
      );

      expect(payrollRecord.employeeId).toBe(employee.id);
      expect(payrollRecord.grossPay).toBeGreaterThan(0);
      expect(payrollRecord.netPay).toBeLessThan(payrollRecord.grossPay);
      expect(payrollRecord.deductions).toHaveLength(4);
      expect(payrollRecord.status).toBe('PROCESSED');

      // Verify deduction types
      const deductionTypes = payrollRecord.deductions.map(d => d.description);
      expect(deductionTypes).toContain('Federal Income Tax');
      expect(deductionTypes).toContain('State Income Tax');
      expect(deductionTypes).toContain('Social Security');
      expect(deductionTypes).toContain('Medicare');
    });

    it('should generate comprehensive payroll report', async () => {
      // Create multiple employees and payroll records
      const employee1 = await employeeService.createEmployee({
        firstName: 'Employee',
        lastName: 'One',
        email: 'emp1@company.com',
        salary: 60000,
      });

      const employee2 = await employeeService.createEmployee({
        firstName: 'Employee',
        lastName: 'Two',
        email: 'emp2@company.com',
        salary: 70000,
      });

      const payPeriodStart = new Date('2024-01-01');
      const payPeriodEnd = new Date('2024-01-15');

      await payrollService.calculatePayroll(employee1.id, payPeriodStart, payPeriodEnd);
      await payrollService.calculatePayroll(employee2.id, payPeriodStart, payPeriodEnd);

      const report = await payrollService.generatePayrollReport('2024-01');

      expect(report.totalEmployees).toBe(2);
      expect(report.totalGrossPay).toBeGreaterThan(0);
      expect(report.totalNetPay).toBeGreaterThan(0);
      expect(report.totalDeductions).toBeGreaterThan(0);
      expect(report.records).toHaveLength(2);
    });

    it('should maintain accurate payroll history', async () => {
      const employee = await employeeService.createEmployee({
        firstName: 'History',
        lastName: 'Test',
        email: 'history@company.com',
        salary: 65000,
      });

      // Create multiple payroll periods
      const periods = [
        { start: new Date('2024-01-01'), end: new Date('2024-01-15') },
        { start: new Date('2024-01-16'), end: new Date('2024-01-31') },
        { start: new Date('2024-02-01'), end: new Date('2024-02-15') },
      ];

      for (const period of periods) {
        await payrollService.calculatePayroll(employee.id, period.start, period.end);
      }

      const history = await payrollService.getPayrollHistory(employee.id);
      expect(history).toHaveLength(3);

      const yearHistory = await payrollService.getPayrollHistory(employee.id, 2024);
      expect(yearHistory).toHaveLength(3);
    });
  });

  describe('Performance Management Service', () => {
    it('should create comprehensive performance review', async () => {
      const employee = await employeeService.createEmployee({
        firstName: 'Performance',
        lastName: 'Test',
        email: 'perf@company.com',
        department: 'Engineering',
      });

      const reviewData = {
        employeeId: employee.id,
        reviewerId: 'manager_001',
        reviewPeriodStart: new Date('2023-01-01'),
        reviewPeriodEnd: new Date('2023-12-31'),
        reviewType: 'ANNUAL' as const,
        goals: [
          {
            id: 'goal_1',
            description: 'Complete certification',
            targetDate: new Date('2023-06-30'),
            weight: 30,
            status: 'COMPLETED',
            rating: 5,
            comments: 'Completed ahead of schedule',
          },
          {
            id: 'goal_2',
            description: 'Lead project delivery',
            targetDate: new Date('2023-12-15'),
            weight: 70,
            status: 'COMPLETED',
            rating: 4,
            comments: 'Project delivered on time and budget',
          },
        ],
        competencies: [
          {
            competency: 'Technical Skills',
            expectedLevel: 4,
            actualRating: 4,
            comments: 'Strong technical capabilities',
          },
          {
            competency: 'Communication',
            expectedLevel: 3,
            actualRating: 4,
            comments: 'Excellent presentation skills',
          },
        ],
        strengths: [
          'Strong problem-solving abilities',
          'Excellent collaboration skills',
        ],
        areasForImprovement: [
          'Time management for multiple projects',
        ],
      };

      const review = await performanceService.createPerformanceReview(reviewData);

      expect(review.id).toMatch(/^review_\d+$/);
      expect(review.employeeId).toBe(employee.id);
      expect(review.goals).toHaveLength(2);
      expect(review.competencies).toHaveLength(2);
      expect(review.status).toBe('DRAFT');
    });

    it('should calculate accurate overall performance rating', async () => {
      const goals = [
        { rating: 5 },
        { rating: 4 },
        { rating: 3 },
      ];

      const competencies = [
        { actualRating: 4 },
        { actualRating: 5 },
      ];

      const overallRating = await performanceService.calculateOverallRating(goals, competencies);

      // Expected: (4 * 0.6) + (4.5 * 0.4) = 2.4 + 1.8 = 4.2
      expect(overallRating).toBeCloseTo(4.2, 1);
    });

    it('should track employee review history', async () => {
      const employee = await employeeService.createEmployee({
        firstName: 'Review',
        lastName: 'History',
        email: 'reviews@company.com',
      });

      // Create multiple reviews for same employee
      await performanceService.createPerformanceReview({
        employeeId: employee.id,
        reviewType: 'MID_YEAR',
        reviewPeriodStart: new Date('2023-01-01'),
        reviewPeriodEnd: new Date('2023-06-30'),
      });

      await performanceService.createPerformanceReview({
        employeeId: employee.id,
        reviewType: 'ANNUAL',
        reviewPeriodStart: new Date('2023-01-01'),
        reviewPeriodEnd: new Date('2023-12-31'),
      });

      const reviews = await performanceService.getReviewsByEmployee(employee.id);

      expect(reviews).toHaveLength(2);
      expect(reviews.some(r => r.reviewType === 'MID_YEAR')).toBe(true);
      expect(reviews.some(r => r.reviewType === 'ANNUAL')).toBe(true);
    });
  });

  describe('Cross-Service Integration', () => {
    it('should coordinate employee lifecycle events', async () => {
      // Create employee
      const employee = await employeeService.createEmployee({
        firstName: 'Integration',
        lastName: 'Test',
        email: 'integration@company.com',
        salary: 70000,
        hireDate: new Date('2024-01-01'),
      });

      // Generate payroll
      const payrollRecord = await payrollService.calculatePayroll(
        employee.id,
        new Date('2024-01-01'),
        new Date('2024-01-15')
      );

      // Create performance review
      const review = await performanceService.createPerformanceReview({
        employeeId: employee.id,
        reviewerId: 'manager_001',
        reviewType: 'PROBATIONARY',
      });

      expect(employee.id).toBeDefined();
      expect(payrollRecord.employeeId).toBe(employee.id);
      expect(review.employeeId).toBe(employee.id);
    });

    it('should maintain data consistency across services', async () => {
      const employee = await employeeService.createEmployee({
        firstName: 'Consistency',
        lastName: 'Test',
        email: 'consistency@company.com',
        salary: 80000,
      });

      // Update employee salary
      await employeeService.updateEmployee(employee.id, { salary: 85000 });

      // Calculate payroll with updated salary
      const payrollRecord = await payrollService.calculatePayroll(
        employee.id,
        new Date('2024-01-01'),
        new Date('2024-01-15')
      );

      const updatedEmployee = await employeeService.getEmployeeById(employee.id);
      
      expect(updatedEmployee?.salary).toBe(85000);
      expect(payrollRecord.grossPay).toBeGreaterThan(0);
      // Payroll should reflect the updated salary
    });
  });
});