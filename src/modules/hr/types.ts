/**
 * Human Resources Management Module Types
 * Core interfaces and types for HR management system
 */

// Core Employee Types
export interface Employee {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  hireDate: Date;
  terminationDate?: Date;
  department: string;
  position: string;
  manager?: string;
  salary: number;
  status: 'ACTIVE' | 'INACTIVE' | 'TERMINATED';
  address: HRAddress;
  emergencyContact: EmergencyContact;
}

export interface HRAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

// Payroll Types
export interface PayrollRecord {
  id: string;
  employeeId: string;
  payPeriodStart: Date;
  payPeriodEnd: Date;
  grossPay: number;
  deductions: PayrollDeduction[];
  netPay: number;
  payDate: Date;
  status: 'DRAFT' | 'PROCESSED' | 'PAID';
}

export interface PayrollDeduction {
  type: 'TAX' | 'BENEFITS' | 'RETIREMENT' | 'OTHER';
  description: string;
  amount: number;
}

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

// Benefits Types
export interface Benefit {
  id: string;
  name: string;
  type: 'HEALTH' | 'DENTAL' | 'VISION' | 'RETIREMENT' | 'OTHER';
  description: string;
  employerContribution: number;
  employeeContribution: number;
  isActive: boolean;
}

export interface BenefitEnrollment {
  id: string;
  employeeId: string;
  benefitId: string;
  enrollmentDate: Date;
  effectiveDate: Date;
  terminationDate?: Date;
  employeeContribution: number;
  dependents: BenefitDependent[];
  status: 'ACTIVE' | 'PENDING' | 'TERMINATED';
}

export interface BenefitDependent {
  id: string;
  name: string;
  relationship: 'SPOUSE' | 'CHILD' | 'DOMESTIC_PARTNER';
  dateOfBirth: Date;
  isActive: boolean;
}

export interface BenefitPlan {
  id: string;
  name: string;
  type: 'HEALTH' | 'DENTAL' | 'VISION' | 'LIFE' | 'DISABILITY' | 'RETIREMENT';
  carrier: string;
  description: string;
  eligibilityRules: BenefitEligibilityRule[];
  costs: BenefitCost[];
  coverage: BenefitCoverage;
  isActive: boolean;
}

export interface BenefitEligibilityRule {
  rule: string;
  condition: string;
  waitingPeriodDays: number;
}

export interface BenefitCost {
  tier: 'EMPLOYEE_ONLY' | 'EMPLOYEE_SPOUSE' | 'EMPLOYEE_CHILDREN' | 'FAMILY';
  employeeContribution: number;
  employerContribution: number;
}

export interface BenefitCoverage {
  deductible: number;
  coinsurance: number;
  outOfPocketMax: number;
  coverageDetails: Record<string, any>;
}

// Time and Attendance Types
export interface TimeEntry {
  id: string;
  employeeId: string;
  date: Date;
  clockIn: Date;
  clockOut?: Date;
  hoursWorked: number;
  overtimeHours: number;
  timeOffType?: 'VACATION' | 'SICK' | 'PERSONAL' | 'HOLIDAY';
}

export interface TimeOffRequest {
  id: string;
  employeeId: string;
  type: 'VACATION' | 'SICK' | 'PERSONAL' | 'BEREAVEMENT' | 'JURY_DUTY';
  startDate: Date;
  endDate: Date;
  totalHours: number;
  reason?: string;
  status: 'PENDING' | 'APPROVED' | 'DENIED' | 'CANCELLED';
  requestedDate: Date;
  approvedBy?: string;
  approvedDate?: Date;
}

export interface TimeOffBalance {
  employeeId: string;
  type: 'VACATION' | 'SICK' | 'PERSONAL';
  accrualRate: number; // hours per pay period
  maxBalance: number;
  currentBalance: number;
  usedThisYear: number;
  carryoverFromLastYear: number;
}

// Performance Management Types
export interface PerformanceReview {
  id: string;
  employeeId: string;
  reviewerId: string;
  reviewPeriodStart: Date;
  reviewPeriodEnd: Date;
  reviewType: 'ANNUAL' | 'MID_YEAR' | 'PROBATIONARY' | '360_DEGREE';
  status: 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  overallRating: number; // 1-5 scale
  goals: PerformanceGoal[];
  competencies: CompetencyRating[];
  strengths: string[];
  areasForImprovement: string[];
  developmentPlan: string[];
  reviewerComments: string;
  employeeSelfAssessment?: string;
  hrComments?: string;
  nextReviewDate?: Date;
}

export interface PerformanceGoal {
  id: string;
  description: string;
  targetDate: Date;
  weight: number; // percentage of total review
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'DEFERRED';
  rating: number; // 1-5 scale
  comments: string;
}

export interface CompetencyRating {
  competency: string;
  expectedLevel: number;
  actualRating: number;
  comments: string;
}

export interface CareerDevelopment {
  id: string;
  employeeId: string;
  careerGoals: string[];
  skillGaps: SkillGap[];
  developmentActivities: DevelopmentActivity[];
  mentorId?: string;
  lastUpdated: Date;
}

export interface SkillGap {
  skill: string;
  currentLevel: number; // 1-5 scale
  targetLevel: number;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface DevelopmentActivity {
  id: string;
  type: 'TRAINING' | 'CERTIFICATION' | 'MENTORING' | 'PROJECT' | 'CONFERENCE';
  description: string;
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED';
  startDate?: Date;
  completionDate?: Date;
  cost: number;
  provider: string;
}

// Recruitment and Onboarding Types
export interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERN';
  salaryRange: { min: number; max: number };
  description: string;
  requirements: string[];
  preferredQualifications: string[];
  postedDate: Date;
  closingDate?: Date;
  hiringManager: string;
  status: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'CLOSED';
}

export interface JobApplication {
  id: string;
  jobPostingId: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  resumeUrl: string;
  coverLetterUrl?: string;
  status: 'SUBMITTED' | 'REVIEWING' | 'INTERVIEWING' | 'OFFER_EXTENDED' | 'HIRED' | 'REJECTED';
  applicationDate: Date;
  notes: string[];
}

export interface OnboardingProcess {
  id: string;
  employeeId: string;
  startDate: Date;
  tasks: OnboardingTask[];
  assignedBuddy?: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  completionRate: number; // percentage
}

export interface OnboardingTask {
  id: string;
  title: string;
  description: string;
  category: 'PAPERWORK' | 'TRAINING' | 'SETUP' | 'MEETING' | 'OTHER';
  assignedTo: 'EMPLOYEE' | 'HR' | 'MANAGER' | 'IT';
  dueDate: Date;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  completedDate?: Date;
  notes?: string;
}

// Training and Development Types
export interface TrainingProgram {
  id: string;
  title: string;
  description: string;
  type: 'MANDATORY' | 'OPTIONAL' | 'ROLE_SPECIFIC' | 'LEADERSHIP';
  category: 'COMPLIANCE' | 'TECHNICAL' | 'SOFT_SKILLS' | 'SAFETY' | 'OTHER';
  deliveryMethod: 'ONLINE' | 'CLASSROOM' | 'BLENDED' | 'ON_THE_JOB';
  duration: number; // hours
  maxParticipants: number;
  prerequisites: string[];
  learningObjectives: string[];
  isActive: boolean;
}

export interface TrainingSession {
  id: string;
  programId: string;
  title: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  instructor: string;
  maxParticipants: number;
  enrolledParticipants: string[];
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}

export interface TrainingEnrollment {
  id: string;
  employeeId: string;
  sessionId: string;
  enrollmentDate: Date;
  status: 'ENROLLED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  completionDate?: Date;
  score?: number;
  certificateUrl?: string;
}

// Compliance and Policy Types
export interface ComplianceTraining {
  id: string;
  title: string;
  description: string;
  frequency: 'ANNUAL' | 'BIANNUAL' | 'QUARTERLY' | 'AS_NEEDED';
  applicableRoles: string[];
  dueDate: Date;
  completionRequirements: string[];
  isActive: boolean;
}

export interface PolicyDocument {
  id: string;
  title: string;
  category: 'HR_POLICY' | 'CODE_OF_CONDUCT' | 'SAFETY' | 'SECURITY' | 'BENEFITS';
  content: string;
  version: string;
  effectiveDate: Date;
  approvedBy: string;
  acknowledgementRequired: boolean;
  isActive: boolean;
}

export interface PolicyAcknowledgement {
  id: string;
  employeeId: string;
  policyId: string;
  acknowledgedDate: Date;
  version: string;
  digitalSignature?: string;
}

// Analytics and Reporting Types
export interface HRMetrics {
  headcount: {
    total: number;
    byDepartment: Record<string, number>;
    byLocation: Record<string, number>;
    byEmploymentType: Record<string, number>;
  };
  turnover: {
    voluntaryRate: number;
    involuntaryRate: number;
    overallRate: number;
    byDepartment: Record<string, number>;
  };
  recruitment: {
    timeToFill: number; // days
    costPerHire: number;
    sourceEffectiveness: Record<string, number>;
    offerAcceptanceRate: number;
  };
  engagement: {
    satisfactionScore: number;
    engagementScore: number;
    retentionRate: number;
    promotionRate: number;
  };
}

export interface HRDashboard {
  metrics: HRMetrics;
  alerts: HRAlert[];
  recentActivity: HRActivity[];
  upcomingTasks: HRTask[];
}

export interface HRAlert {
  id: string;
  type: 'COMPLIANCE' | 'BENEFIT_ENROLLMENT' | 'PERFORMANCE_REVIEW' | 'CERTIFICATION_EXPIRY';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  message: string;
  employeeId?: string;
  dueDate?: Date;
  isResolved: boolean;
}

export interface HRActivity {
  id: string;
  type: 'HIRE' | 'TERMINATION' | 'PROMOTION' | 'TRANSFER' | 'SALARY_CHANGE';
  employeeId: string;
  description: string;
  timestamp: Date;
  performedBy: string;
}

export interface HRTask {
  id: string;
  title: string;
  description: string;
  type: 'REVIEW' | 'ENROLLMENT' | 'COMPLIANCE' | 'DOCUMENTATION';
  assignedTo: string;
  dueDate: Date;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
}
