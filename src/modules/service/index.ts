/**
 */

// Export all types
export * from './types';

// Export data access layer
export * from './data-access/repositories';

// Export business logic services
export * from './business-logic/service-management/service-service';

// Re-export existing interfaces for backward compatibility

export interface ServiceRequest {
  id: string;
  ticketNumber: string;
  customerId: string;
  contactId?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'NEW' | 'ASSIGNED' | 'IN_PROGRESS' | 'PENDING_CUSTOMER' | 'RESOLVED' | 'CLOSED';
  category: string;
  subcategory: string;
  subject: string;
  description: string;
  assignedTechnicianId?: string;
  assignedTeamId?: string;
  estimatedResolutionTime?: Date;
  actualResolutionTime?: Date;
  customerSatisfactionRating?: number;
  resolutionNotes?: string;
  escalationLevel: number;
  createdDate: Date;
  lastUpdated: Date;
  slaDeadline?: Date;
}

export interface FieldService {
  id: string;
  workOrderNumber: string;
  serviceType: 'INSTALLATION' | 'MAINTENANCE' | 'REPAIR' | 'INSPECTION' | 'CALIBRATION';
  assetId?: string;
  customerId: string;
  siteId: string;
  technicianId: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'POSTPONED';
  scheduledDate: Date;
  actualStartDate?: Date;
  actualEndDate?: Date;
  estimatedDuration: number;
  actualDuration?: number;
  laborHours: number;
  partsUsed: ServicePart[];
  serviceNotes: string;
  customerSignature?: string;
  photos: string[];
  gpsLocation?: { latitude: number; longitude: number };
  weatherConditions?: string;
  slaCompliance: boolean;
  createdDate: Date;
}

export interface ServicePart {
  partId: string;
  partNumber: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  serialNumbers?: string[];
  warrantyPeriod?: number; // months
}

export interface ServiceContract {
  id: string;
  contractNumber: string;
  customerId: string;
  contractType: 'MAINTENANCE' | 'SUPPORT' | 'COMPREHENSIVE' | 'WARRANTY_EXTENSION';
  status: 'ACTIVE' | 'EXPIRED' | 'SUSPENDED' | 'TERMINATED';
  startDate: Date;
  endDate: Date;
  serviceLevel: 'BASIC' | 'STANDARD' | 'PREMIUM' | 'ENTERPRISE';
  responseTime: number; // hours
  coveredAssets: string[];
  inclusions: string[];
  exclusions: string[];
  annualValue: number;
  billingFrequency: 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY';
  renewalTerms: string;
  escalationMatrix: EscalationLevel[];
  kpis: ServiceKPI[];
}

export interface EscalationLevel {
  level: number;
  triggerCondition: string;
  assignedTo: string;
  timeframe: number; // hours
  actions: string[];
  notificationList: string[];
}

export interface ServiceTechnician {
  technicianId: string;
  employeeId: string;
  name: string;
  specializations: string[];
  certifications: TechnicianCertification[];
  serviceArea: ServiceArea;
  availabilityStatus: 'AVAILABLE' | 'BUSY' | 'ON_CALL' | 'OFF_DUTY';
  currentLocation?: { latitude: number; longitude: number };
  skills: TechnicianSkill[];
  performanceMetrics: TechnicianMetrics;
  tools: string[];
  vehicle?: string;
}

export interface TechnicianCertification {
  certificationId: string;
  name: string;
  issuingBody: string;
  issueDate: Date;
  expirationDate: Date;
  certificationNumber: string;
}

export interface ServiceArea {
  areaId: string;
  name: string;
  boundaries: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  postalCodes: string[];
  travelTime: { [key: string]: number }; // site-to-site travel times
}

export interface TechnicianSkill {
  skillId: string;
  skillName: string;
  category: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  lastAssessed: Date;
  certificationRequired: boolean;
}

export interface TechnicianMetrics {
  avgResponseTime: number;
  firstCallResolutionRate: number;
  customerSatisfactionScore: number;
  utilizationRate: number;
  completedJobs: number;
  onTimeArrivalRate: number;
  safetyIncidents: number;
}

export interface ServiceKPI {
  kpiId: string;
  name: string;
  description: string;
  targetValue: number;
  actualValue: number;
  unit: string;
  period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY';
  trend: 'IMPROVING' | 'STABLE' | 'DECLINING';
  lastUpdated: Date;
}

export interface KnowledgeBase {
  articleId: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  difficulty: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED';
  assetTypes: string[];
  symptoms: string[];
  solutions: Solution[];
  attachments: string[];
  author: string;
  createdDate: Date;
  lastUpdated: Date;
  views: number;
  rating: number;
}

export interface Solution {
  solutionId: string;
  stepNumber: number;
  instruction: string;
  estimatedTime: number;
  requiredTools: string[];
  safetyNotes?: string;
  multimedia?: string[];
}

export interface ServiceAnalytics {
  reportId: string;
  reportType: 'PERFORMANCE' | 'CUSTOMER_SATISFACTION' | 'TECHNICIAN_UTILIZATION' | 'SLA_COMPLIANCE';
  dateRange: { startDate: Date; endDate: Date };
  metrics: Record<string, number>;
  insights: string[];
  recommendations: string[];
  generatedDate: Date;
}

export class ServiceManager {
  async createServiceRequest(request: Omit<ServiceRequest, 'id' | 'ticketNumber' | 'status' | 'escalationLevel' | 'createdDate' | 'lastUpdated'>): Promise<ServiceRequest> {
    const id = `sr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const ticketNumber = `SR${Date.now().toString().slice(-6)}`;
    
    return {
      ...request,
      id,
      ticketNumber,
      status: 'NEW',
      escalationLevel: 0,
      createdDate: new Date(),
      lastUpdated: new Date()
    };
  }

  async updateServiceRequestStatus(requestId: string, status: ServiceRequest['status'], notes?: string): Promise<{
    requestId: string;
    previousStatus: ServiceRequest['status'];
    newStatus: ServiceRequest['status'];
    updatedBy: string;
    updatedDate: Date;
    notes?: string;
  }> {
    console.log(`Updating service request ${requestId} to ${status}`);
    
    return {
      requestId,
      previousStatus: 'IN_PROGRESS',
      newStatus: status,
      updatedBy: 'current_user',
      updatedDate: new Date(),
      notes
    };
  }

  async escalateServiceRequest(requestId: string, escalationReason: string): Promise<{
    escalationId: string;
    newEscalationLevel: number;
    assignedTo: string;
    escalationDate: Date;
    notifiedParties: string[];
    automaticActions: string[];
  }> {
    const escalationId = `esc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      escalationId,
      newEscalationLevel: 2,
      assignedTo: 'supervisor_001',
      escalationDate: new Date(),
      notifiedParties: ['manager@company.com', 'customer@client.com'],
      automaticActions: [
        'Email notification sent to supervisor',
        'SLA timer extended',
        'Customer notification sent'
      ]
    };
  }

  async scheduleFieldService(service: Omit<FieldService, 'id' | 'workOrderNumber' | 'status' | 'createdDate'>): Promise<FieldService> {
    const id = `fs_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const workOrderNumber = `WO${Date.now().toString().slice(-6)}`;
    
    return {
      ...service,
      id,
      workOrderNumber,
      status: 'SCHEDULED',
      createdDate: new Date()
    };
  }

  async optimizeServiceSchedule(dateRange: { startDate: Date; endDate: Date }, constraints: {
    maxDailyHours: number;
    maxTravelDistance: number;
    skillRequirements: Record<string, string[]>;
  }): Promise<{
    optimizedSchedule: Array<{
      technicianId: string;
      assignedServices: string[];
      totalTravelTime: number;
      totalServiceTime: number;
      utilizationRate: number;
    }>;
    unassignedServices: string[];
    optimizationScore: number;
    recommendations: string[];
  }> {
    console.log('Optimizing service schedule with constraints:', constraints);
    
    return {
      optimizedSchedule: [
        {
          technicianId: 'tech_001',
          assignedServices: ['fs_001', 'fs_002', 'fs_003'],
          totalTravelTime: 2.5,
          totalServiceTime: 6,
          utilizationRate: 85
        }
      ],
      unassignedServices: ['fs_004'],
      optimizationScore: 87.3,
      recommendations: [
        'Consider hiring additional technician for peak periods',
        'Consolidate services in same geographic area',
        'Implement predictive scheduling based on historical data'
      ]
    };
  }

  async trackServiceLevelAgreements(contractId?: string): Promise<{
    contracts: Array<{
      contractId: string;
      customerName: string;
      slaCompliance: number;
      breaches: number;
      avgResponseTime: number;
      targetResponseTime: number;
      riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    }>;
    overallCompliance: number;
    criticalBreaches: number;
    improvementAreas: string[];
  }> {
    const contracts = [
      {
        contractId: 'ct_001',
        customerName: 'ABC Corporation',
        slaCompliance: 94.5,
        breaches: 2,
        avgResponseTime: 3.2,
        targetResponseTime: 4.0,
        riskLevel: 'LOW' as const
      }
    ];

    return {
      contracts,
      overallCompliance: 91.8,
      criticalBreaches: 1,
      improvementAreas: [
        'Improve parts availability for critical repairs',
        'Enhance technician training on complex systems',
        'Implement proactive customer communication'
      ]
    };
  }

  async generateServiceAnalytics(reportType: ServiceAnalytics['reportType'], dateRange: { startDate: Date; endDate: Date }): Promise<ServiceAnalytics> {
    const reportId = `rpt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      reportId,
      reportType,
      dateRange,
      metrics: {
        totalServiceRequests: 324,
        avgResolutionTime: 4.8,
        customerSatisfactionScore: 4.2,
        firstCallResolutionRate: 73.5,
        technicianUtilization: 82.3
      },
      insights: [
        'Customer satisfaction improved by 12% this quarter',
        'Response time performance is above target',
        'Peak service requests occur on Mondays'
      ],
      recommendations: [
        'Implement self-service options for common issues',
        'Increase staffing on high-demand days',
        'Enhance mobile app functionality'
      ],
      generatedDate: new Date()
    };
  }

  async manageKnowledgeBase(action: 'CREATE' | 'UPDATE' | 'SEARCH' | 'RATE', data: any): Promise<{
    action: string;
    result: any;
    affectedArticles?: number;
  }> {
    console.log(`Managing knowledge base - Action: ${action}`);
    
    switch (action) {
      case 'SEARCH':
        return {
          action,
          result: [
            {
              articleId: 'kb_001',
              title: 'Troubleshooting Network Connectivity',
              category: 'IT Support',
              rating: 4.5,
              relevanceScore: 89.2
            }
          ]
        };
      case 'CREATE':
        return {
          action,
          result: {
            articleId: `kb_${Date.now()}`,
            title: data.title || 'New Article',
            status: 'DRAFT'
          }
        };
      default:
        return {
          action,
          result: { success: true }
        };
    }
  }

  async predictServiceDemand(forecastPeriod: { months: number }): Promise<{
    forecast: Array<{
      period: string;
      predictedVolume: number;
      serviceTypes: Record<string, number>;
      confidenceLevel: number;
    }>;
    seasonalPatterns: Record<string, number>;
    resourceRequirements: {
      technicianCount: number;
      skillGaps: string[];
      equipmentNeeds: string[];
    };
  }> {
    const forecast = Array.from({ length: forecastPeriod.months }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() + i + 1);
      
      return {
        period: date.toISOString().slice(0, 7), // YYYY-MM format
        predictedVolume: 280 + Math.floor(Math.random() * 80),
        serviceTypes: {
          'MAINTENANCE': 120,
          'REPAIR': 95,
          'INSTALLATION': 45,
          'INSPECTION': 35
        },
        confidenceLevel: 82.5 - (i * 2) // Confidence decreases with time
      };
    });

    return {
      forecast,
      seasonalPatterns: {
        'Q1': 1.15,
        'Q2': 0.95,
        'Q3': 0.85,
        'Q4': 1.05
      },
      resourceRequirements: {
        technicianCount: 8,
        skillGaps: ['IoT Systems', 'Advanced Diagnostics'],
        equipmentNeeds: ['Thermal Imaging Camera', 'Vibration Analyzer']
      }
    };
  }

  async integrateWithCRM(customerId: string): Promise<{
    customerProfile: {
      name: string;
      tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
      contractStatus: 'ACTIVE' | 'EXPIRED' | 'NONE';
      totalServices: number;
      avgSatisfaction: number;
      lastServiceDate: Date;
    };
    serviceHistory: Array<{
      serviceId: string;
      date: Date;
      type: string;
      status: string;
      satisfaction: number;
    }>;
    recommendations: string[];
  }> {
    console.log(`Integrating service data with CRM for customer ${customerId}`);
    
    return {
      customerProfile: {
        name: 'ABC Corporation',
        tier: 'GOLD',
        contractStatus: 'ACTIVE',
        totalServices: 47,
        avgSatisfaction: 4.3,
        lastServiceDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
      },
      serviceHistory: [
        {
          serviceId: 'fs_001',
          date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
          type: 'MAINTENANCE',
          status: 'COMPLETED',
          satisfaction: 5
        }
      ],
      recommendations: [
        'Schedule proactive maintenance visit',
        'Offer contract upgrade based on usage patterns',
        'Provide training on new features'
      ]
    };
  }
}

export const serviceManager = new ServiceManager();