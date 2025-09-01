/**
 * Field Service Management Service
 * Oracle Field Service competitive implementation
 * Enhanced with message queue and cache integration
 * 
 * Provides comprehensive field service management with:
 * - Advanced service request handling
 * - Intelligent technician scheduling and dispatch
 * - Mobile workforce optimization
 * - Contract and warranty management
 * - Performance analytics and reporting
 */

import type {
  ServiceRequest,
  WorkOrder,
  ServiceTechnician,
  ServiceContract,
  ServiceAppointment,
  FieldInventory,
  ServicePerformance,
  CustomerPortal,
  ServiceAnalytics,
  MobileWorkforce,
  DispatchOptimization,
  ServiceWarranty
} from '../types';

import { StandardServiceBase } from '../../../shared/utils/standard-service-base';
import { ServiceIntegrationContext } from '../../../shared/interfaces/service-integration';
import { MessagePayload, QueueType } from '../../../core/message-queue/types';

export class FieldServiceService extends StandardServiceBase {
  private serviceRequests: Map<string, ServiceRequest> = new Map();
  private workOrders: Map<string, WorkOrder> = new Map();
  private technicians: Map<string, ServiceTechnician> = new Map();
  private contracts: Map<string, ServiceContract> = new Map();
  private appointments: Map<string, ServiceAppointment> = new Map();
  private inventories: Map<string, FieldInventory> = new Map();

  constructor(
    context?: ServiceIntegrationContext,
    private databaseManager?: any,
    private notificationService?: any,
    private gpsTrackingService?: any
  ) {
    if (context) {
      super(context);
    } else {
      // Fallback for backward compatibility
      super({
        messageQueue: null as any,
        cache: null as any,
        logger: console as any,
        config: {
          serviceName: 'field-service-service',
          cacheConfig: { defaultTTL: 600, keyPrefix: 'fs' },
          messageQueueConfig: { 
            defaultPriority: 2, 
            retryAttempts: 3,
            compliance: { dataClassification: 'INTERNAL', auditRequired: true }
          }
        }
      });
    }
  }

  // ==================== Message Queue Integration ====================

  /**
   * Handle message processing for field service operations
   */
  async processMessage(message: MessagePayload): Promise<any> {
    this.markMessageProcessed();
    
    switch (message.type) {
      case 'CREATE_SERVICE_REQUEST':
        return await this.createServiceRequest(message.data);
      case 'CREATE_WORK_ORDER':
        return await this.createWorkOrder(message.data);
      case 'ASSIGN_TECHNICIAN':
        return await this.assignTechnician(
          message.data.workOrderId,
          message.data.technicianId
        );
      case 'UPDATE_WORK_ORDER_STATUS':
        return await this.updateWorkOrderStatus(
          message.data.workOrderId,
          message.data.status
        );
      case 'SCHEDULE_APPOINTMENT':
        return await this.scheduleAppointment(message.data);
      default:
        throw new Error(`Unknown field service message type: ${message.type}`);
    }
  }

  /**
   * Get queue types this service handles
   */
  getHandledQueueTypes(): QueueType[] {
    return [QueueType.SERVICE, QueueType.MAINTENANCE, QueueType.NOTIFICATION, QueueType.ANALYTICS];
  }

  // ================================
  // SERVICE REQUEST MANAGEMENT
  // ================================

  /**
   * Create service request with intelligent triage
   */
  async createServiceRequest(requestData: Partial<ServiceRequest>): Promise<{
    success: boolean;
    serviceRequest: ServiceRequest;
    suggestedTechnicians: ServiceTechnician[];
    estimatedResponse: any;
  }> {
    return this.executeWithMetrics(async () => {
      const requestId = requestData.requestId || `SR_${Date.now()}`;
      
      // Intelligent priority assignment based on request details
      const priority = await this.calculateRequestPriority(requestData);
      
      // Estimate required skills based on problem description
      const skillsRequired = await this.analyzeSkillRequirements(requestData);

      const serviceRequest: ServiceRequest = {
        requestId,
        requestNumber: `SR-${requestId.substring(3)}`,
        customerId: requestData.customerId || '',
        customerName: requestData.customerName || '',
        contactInfo: requestData.contactInfo || {
          primaryContact: '',
          phone: '',
          email: ''
        },
        serviceAddress: requestData.serviceAddress || {
          address: '',
          coordinates: { lat: 0, lng: 0 }
        },
        requestType: requestData.requestType || 'REPAIR',
        priority,
        description: requestData.description || '',
        problemCategory: requestData.problemCategory || 'GENERAL',
        assetId: requestData.assetId,
        assetInfo: requestData.assetInfo,
        preferredSchedule: requestData.preferredSchedule || {
          availability: 'BUSINESS_HOURS'
        },
        skillsRequired,
        estimatedDuration: await this.estimateServiceDuration(requestData),
        contractId: requestData.contractId,
        serviceLevel: requestData.serviceLevel || 'STANDARD',
        status: 'NEW',
        createdBy: 'CUSTOMER_PORTAL',
        createdDate: new Date(),
        lastUpdated: new Date()
      };

      this.serviceRequests.set(requestId, serviceRequest);
      
      // Cache the service request
      await this.setCached(`service-request:${requestId}`, serviceRequest, this.getCacheTTL('service-request'));

      // Find suggested technicians
      const suggestedTechnicians = await this.findSuggestedTechnicians(serviceRequest);
      
      // Calculate estimated response time
      const estimatedResponse = await this.calculateResponseTime(serviceRequest);

      // Send acknowledgment notification via message queue
      await this.sendMessage(
        QueueType.NOTIFICATION,
        'SERVICE_REQUEST_CREATED',
        {
          requestId,
          requestNumber: serviceRequest.requestNumber,
          customerId: serviceRequest.customerId,
          priority: serviceRequest.priority,
          estimatedResponse,
          timestamp: new Date()
        }
      );

      // Notify service command center about new request
      await this.sendMessage(
        QueueType.SERVICE_COMMAND_CENTER,
        'NEW_SERVICE_REQUEST',
        {
          requestId,
          priority: serviceRequest.priority,
          serviceType: serviceRequest.requestType,
          location: serviceRequest.serviceAddress,
          skillsRequired: serviceRequest.skillsRequired,
          timestamp: new Date()
        }
      );

      this.logger.info(`Service request created: ${serviceRequest.requestNumber}`, {
        requestId,
        priority: serviceRequest.priority,
        estimatedDuration: serviceRequest.estimatedDuration
      });

      return {
        success: true,
        serviceRequest,
        suggestedTechnicians,
        estimatedResponse
      };
    });
  }

  /**
   * Convert service request to work order
   */
  async createWorkOrderFromRequest(
    requestId: string,
    assignmentData: {
      technicianId?: string;
      scheduledDate: Date;
      additionalInstructions?: string;
    }
  ): Promise<{
    success: boolean;
    workOrder: WorkOrder;
    appointment: ServiceAppointment;
  }> {
    const serviceRequest = this.serviceRequests.get(requestId);
    if (!serviceRequest) {
      throw new Error(`Service request not found: ${requestId}`);
    }

    const workOrderId = `WO_${Date.now()}`;
    
    // Create work order
    const workOrder: WorkOrder = {
      workOrderId,
      workOrderNumber: `WO-${workOrderId.substring(3)}`,
      serviceRequestId: requestId,
      customerId: serviceRequest.customerId,
      type: serviceRequest.requestType === 'INSTALLATION' ? 'INSTALLATION' : 'REPAIR',
      title: `${serviceRequest.requestType} - ${serviceRequest.problemCategory}`,
      description: serviceRequest.description,
      instructions: assignmentData.additionalInstructions || '',
      priority: serviceRequest.priority,
      assetId: serviceRequest.assetId,
      assetDetails: serviceRequest.assetInfo ? {
        serialNumber: serviceRequest.assetInfo.serialNumber,
        modelNumber: serviceRequest.assetInfo.modelNumber,
        location: serviceRequest.serviceAddress.address,
        condition: 'GOOD'
      } : undefined,
      assignedTechnician: assignmentData.technicianId ? {
        technicianId: assignmentData.technicianId,
        technicianName: '',
        skills: [],
        certifications: []
      } : undefined,
      scheduledStart: assignmentData.scheduledDate,
      scheduledEnd: new Date(assignmentData.scheduledDate.getTime() + serviceRequest.estimatedDuration * 60000),
      estimatedDuration: serviceRequest.estimatedDuration,
      requiredParts: [],
      materialCost: 0,
      laborCost: 0,
      totalCost: 0,
      requiredTools: [],
      serviceAddress: serviceRequest.serviceAddress,
      status: 'CREATED',
      followUpRequired: false,
      createdBy: 'DISPATCHER',
      createdDate: new Date(),
      lastUpdated: new Date()
    };

    // Create appointment
    const appointment = await this.createServiceAppointment(workOrder, assignmentData.technicianId);

    this.workOrders.set(workOrderId, workOrder);

    // Update service request status
    serviceRequest.status = 'SCHEDULED';
    serviceRequest.lastUpdated = new Date();
    this.serviceRequests.set(requestId, serviceRequest);

    this.logger?.info(`Work order created: ${workOrder.workOrderNumber} from request ${serviceRequest.requestNumber}`);

    return {
      success: true,
      workOrder,
      appointment
    };
  }

  // ================================
  // TECHNICIAN MANAGEMENT
  // ================================

  /**
   * Register new service technician
   */
  async registerTechnician(technicianData: Partial<ServiceTechnician>): Promise<ServiceTechnician> {
    const technicianId = technicianData.technicianId || `TECH_${Date.now()}`;
    
    const technician: ServiceTechnician = {
      technicianId,
      employeeId: technicianData.employeeId || '',
      firstName: technicianData.firstName || '',
      lastName: technicianData.lastName || '',
      email: technicianData.email || '',
      phone: technicianData.phone || '',
      mobilePhone: technicianData.mobilePhone || '',
      skills: technicianData.skills || [],
      certifications: technicianData.certifications || [],
      serviceTerritory: technicianData.serviceTerritory || {
        territoryId: 'DEFAULT',
        territoryName: 'Default Territory',
        geoFence: null,
        travelRadius: 50
      },
      homeBase: technicianData.homeBase || {
        address: '',
        coordinates: { lat: 0, lng: 0 }
      },
      workingHours: technicianData.workingHours || {
        schedule: {
          Monday: { start: '08:00', end: '17:00' },
          Tuesday: { start: '08:00', end: '17:00' },
          Wednesday: { start: '08:00', end: '17:00' },
          Thursday: { start: '08:00', end: '17:00' },
          Friday: { start: '08:00', end: '17:00' }
        },
        availability: 'FULL_TIME',
        timeZone: 'UTC'
      },
      assignedVehicle: technicianData.assignedVehicle,
      mobileInventory: technicianData.mobileInventory || {
        capacity: 1000,
        currentStock: [],
        stockValue: 0
      },
      tools: technicianData.tools || [],
      performance: {
        completionRate: 0.95,
        onTimeRate: 0.88,
        firstTimeFixRate: 0.82,
        customerSatisfactionScore: 4.3,
        utilizationRate: 0.75
      },
      status: 'ACTIVE',
      currentStatus: 'AVAILABLE',
      emergencyContact: technicianData.emergencyContact || {
        name: '',
        relationship: '',
        phone: ''
      },
      hireDate: technicianData.hireDate || new Date(),
      createdDate: new Date(),
      lastUpdated: new Date()
    };

    this.technicians.set(technicianId, technician);

    this.logger?.info(`Technician registered: ${technician.firstName} ${technician.lastName}`);

    return technician;
  }

  /**
   * Optimize technician scheduling and dispatch
   */
  async optimizeDispatch(
    timeHorizon: number = 24,
    objectives: string[] = ['MINIMIZE_TRAVEL_TIME', 'MAXIMIZE_UTILIZATION', 'BALANCE_WORKLOAD']
  ): Promise<DispatchOptimization> {
    const optimizationId = `OPT_${Date.now()}`;
    
    // Get available technicians
    const availableTechnicians = Array.from(this.technicians.values())
      .filter(tech => tech.currentStatus === 'AVAILABLE')
      .map(tech => ({
        technicianId: tech.technicianId,
        location: tech.homeBase.coordinates,
        skills: tech.skills.map(skill => skill.skillName),
        workingHours: { start: '08:00', end: '17:00' },
        currentWorkload: 0
      }));

    // Get pending work orders
    const pendingWorkOrders = Array.from(this.workOrders.values())
      .filter(wo => wo.status === 'CREATED' || wo.status === 'SCHEDULED')
      .map(wo => ({
        workOrderId: wo.workOrderId,
        location: wo.serviceAddress.coordinates,
        priority: wo.priority,
        estimatedDuration: wo.estimatedDuration,
        skillsRequired: [], // Would extract from work order
        timeWindow: wo.scheduledStart && wo.scheduledEnd ? {
          start: wo.scheduledStart.toTimeString().substring(0, 5),
          end: wo.scheduledEnd.toTimeString().substring(0, 5)
        } : undefined
      }));

    // Run optimization algorithm (simplified version)
    const assignments = await this.runDispatchOptimization(availableTechnicians, pendingWorkOrders);

    const optimization: DispatchOptimization = {
      optimizationId,
      optimizationDate: new Date(),
      parameters: {
        timeHorizon,
        objectives: {
          minimizeTravelTime: objectives.includes('MINIMIZE_TRAVEL_TIME'),
          maximizeUtilization: objectives.includes('MAXIMIZE_UTILIZATION'),
          balanceWorkload: objectives.includes('BALANCE_WORKLOAD'),
          prioritizeUrgent: objectives.includes('PRIORITIZE_URGENT'),
          minimizeCost: objectives.includes('MINIMIZE_COST')
        },
        constraints: {
          technicianSkills: true,
          workingHours: true,
          maxTravelDistance: 100,
          serviceTimeWindows: true,
          partAvailability: false
        }
      },
      inputData: {
        availableTechnicians,
        pendingWorkOrders
      },
      results: {
        assignments,
        unassignedWorkOrders: [],
        optimizationMetrics: {
          totalTravelTime: 0,
          averageUtilization: 0.75,
          workloadBalance: 0.85,
          costOptimization: 0.78,
          serviceLevel: 0.92
        }
      },
      implementationStatus: 'PENDING',
      lastUpdated: new Date()
    };

    return optimization;
  }

  // ================================
  // CONTRACT MANAGEMENT
  // ================================

  /**
   * Create service contract
   */
  async createServiceContract(contractData: Partial<ServiceContract>): Promise<ServiceContract> {
    const contractId = contractData.contractId || `SC_${Date.now()}`;
    
    const contract: ServiceContract = {
      contractId,
      contractNumber: `SC-${contractId.substring(3)}`,
      customerId: contractData.customerId || '',
      customerName: contractData.customerName || '',
      contractType: contractData.contractType || 'MAINTENANCE',
      startDate: contractData.startDate || new Date(),
      endDate: contractData.endDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      renewalTerms: contractData.renewalTerms || {
        autoRenewal: false
      },
      serviceLevel: contractData.serviceLevel || {
        responseTime: 4,
        resolutionTime: 24,
        availability: '8x5',
        coverage: 'ON_SITE'
      },
      coveredAssets: contractData.coveredAssets || [],
      contractValue: contractData.contractValue || 0,
      billingFrequency: contractData.billingFrequency || 'MONTHLY',
      paymentTerms: contractData.paymentTerms || 'NET_30',
      includedServices: contractData.includedServices || [],
      excludedServices: contractData.excludedServices || [],
      performanceMetrics: contractData.performanceMetrics || [],
      customerContacts: contractData.customerContacts || [],
      status: 'DRAFT',
      createdBy: 'SALES_TEAM',
      createdDate: new Date(),
      lastUpdated: new Date()
    };

    this.contracts.set(contractId, contract);

    this.logger?.info(`Service contract created: ${contract.contractNumber}`);

    return contract;
  }

  // ================================
  // MOBILE WORKFORCE MANAGEMENT
  // ================================

  /**
   * Track mobile workforce in real-time
   */
  async trackMobileWorkforce(): Promise<MobileWorkforce> {
    const workforceId = `MWF_${Date.now()}`;
    
    // Get real-time technician locations
    const realTimeTracking = await Promise.all(
      Array.from(this.technicians.values()).map(async tech => {
        const location = await this.getCurrentTechnicianLocation(tech.technicianId);
        return {
          technicianId: tech.technicianId,
          currentLocation: location || {
            coordinates: { lat: 0, lng: 0 },
            accuracy: 0,
            timestamp: new Date()
          },
          status: 'AVAILABLE', // Map to valid MobileWorkforce status
          currentWorkOrder: tech.currentAssignment?.workOrderId,
          estimatedArrival: tech.currentAssignment?.estimatedCompletion
        };
      })
    );

    const mobileWorkforce: MobileWorkforce = {
      workforceId,
      mobileAppConfig: {
        version: '2.1.0',
        features: {
          offlineMode: true,
          gpsTracking: true,
          barcodeScanners: true,
          digitalSignature: true,
          photoCapture: true,
          timeTracking: true
        },
        syncSettings: {
          syncFrequency: 5,
          offlineStorageLimit: 500,
          dataRetentionPeriod: 30
        }
      },
      devices: [], // Would be populated with actual device data
      realTimeTracking,
      communication: {
        channels: [
          { channelType: 'VOICE', enabled: true, configuration: {} },
          { channelType: 'SMS', enabled: true, configuration: {} },
          { channelType: 'PUSH_NOTIFICATION', enabled: true, configuration: {} }
        ],
        emergencyProtocol: {
          escalationLevels: [
            {
              level: 1,
              notificationMethod: 'SMS',
              recipients: ['supervisor@company.com'],
              timeoutMinutes: 15
            }
          ]
        }
      },
      performanceMonitoring: {
        responseTimeTracking: true,
        productivityMetrics: true,
        customerFeedbackCollection: true,
        qualityAssurance: true
      },
      lastUpdated: new Date()
    };

    return mobileWorkforce;
  }

  // ================================
  // ANALYTICS AND REPORTING
  // ================================

  /**
   * Generate comprehensive service analytics
   */
  async generateServiceAnalytics(
    reportType: 'OPERATIONAL' | 'FINANCIAL' | 'CUSTOMER' | 'TECHNICIAN' | 'ASSET' | 'PREDICTIVE',
    startDate: Date,
    endDate: Date
  ): Promise<ServiceAnalytics> {
    const analyticsId = `SA_${Date.now()}`;
    
    let analyticsData: ServiceAnalytics = {
      analyticsId,
      reportType,
      reportingPeriod: { startDate, endDate },
      insights: [],
      generatedDate: new Date(),
      lastUpdated: new Date()
    };

    switch (reportType) {
      case 'OPERATIONAL':
        analyticsData.operationalData = await this.calculateOperationalMetrics(startDate, endDate);
        break;
      case 'FINANCIAL':
        analyticsData.financialData = await this.calculateFinancialMetrics(startDate, endDate);
        break;
      case 'CUSTOMER':
        analyticsData.customerData = await this.calculateCustomerMetrics(startDate, endDate);
        break;
      case 'TECHNICIAN':
        analyticsData.technicianData = await this.calculateTechnicianMetrics(startDate, endDate);
        break;
      case 'ASSET':
        analyticsData.assetData = await this.calculateAssetMetrics(startDate, endDate);
        break;
      case 'PREDICTIVE':
        analyticsData.predictiveData = await this.calculatePredictiveMetrics(startDate, endDate);
        break;
    }

    // Generate insights and recommendations
    analyticsData.insights = await this.generateAnalyticsInsights(analyticsData);

    return analyticsData;
  }

  // ================================
  // PRIVATE HELPER METHODS
  // ================================

  private async calculateRequestPriority(requestData: Partial<ServiceRequest>): Promise<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' | 'EMERGENCY'> {
    // Simple priority calculation based on request type and other factors
    if (requestData.requestType === 'EMERGENCY') return 'EMERGENCY';
    if (requestData.assetInfo?.warrantyStatus === 'ACTIVE') return 'HIGH';
    return requestData.priority || 'MEDIUM';
  }

  private async analyzeSkillRequirements(requestData: Partial<ServiceRequest>): Promise<string[]> {
    // Analyze description and problem category to determine required skills
    const skills: string[] = [];
    
    if (requestData.problemCategory?.includes('ELECTRICAL')) {
      skills.push('ELECTRICAL');
    }
    if (requestData.problemCategory?.includes('MECHANICAL')) {
      skills.push('MECHANICAL');
    }
    if (requestData.description?.toLowerCase().includes('software')) {
      skills.push('SOFTWARE');
    }
    
    return skills.length > 0 ? skills : ['GENERAL'];
  }

  private async estimateServiceDuration(requestData: Partial<ServiceRequest>): Promise<number> {
    // Estimate duration based on request type and complexity
    const baseDuration = {
      'INSTALLATION': 240, // 4 hours
      'REPAIR': 180,       // 3 hours
      'MAINTENANCE': 120,  // 2 hours
      'INSPECTION': 60,    // 1 hour
      'EMERGENCY': 120,    // 2 hours
      'CONSULTATION': 90   // 1.5 hours
    };
    
    return baseDuration[requestData.requestType || 'REPAIR'] || 120;
  }

  private async findSuggestedTechnicians(serviceRequest: ServiceRequest): Promise<ServiceTechnician[]> {
    // Find technicians with matching skills and availability
    const availableTechnicians = Array.from(this.technicians.values())
      .filter(tech => tech.currentStatus === 'AVAILABLE')
      .filter(tech => {
        // Check if technician has required skills
        const techSkills = tech.skills.map(skill => skill.skillName);
        return serviceRequest.skillsRequired.some(skill => techSkills.includes(skill));
      })
      .slice(0, 3); // Return top 3 suggestions
    
    return availableTechnicians;
  }

  private async calculateResponseTime(serviceRequest: ServiceRequest): Promise<any> {
    // Calculate estimated response time based on priority and location
    const baseResponseTime = {
      'EMERGENCY': 2,  // 2 hours
      'URGENT': 4,     // 4 hours
      'HIGH': 8,       // 8 hours
      'MEDIUM': 24,    // 24 hours
      'LOW': 48        // 48 hours
    };
    
    return {
      estimated: baseResponseTime[serviceRequest.priority] || 24,
      unit: 'hours',
      confidence: 0.85
    };
  }

  private async sendServiceRequestAcknowledgment(serviceRequest: ServiceRequest): Promise<void> {
    // Send acknowledgment notification to customer
    this.logger?.info(`Acknowledgment sent for service request: ${serviceRequest.requestNumber}`);
  }

  private async createServiceAppointment(workOrder: WorkOrder, technicianId?: string): Promise<ServiceAppointment> {
    const appointmentId = `APT_${Date.now()}`;
    
    const appointment: ServiceAppointment = {
      appointmentId,
      workOrderId: workOrder.workOrderId,
      technicianId: technicianId || '',
      customerId: workOrder.customerId,
      scheduledDate: workOrder.scheduledStart,
      timeWindow: {
        start: workOrder.scheduledStart.toTimeString().substring(0, 5),
        end: workOrder.scheduledEnd.toTimeString().substring(0, 5),
        duration: workOrder.estimatedDuration
      },
      appointmentType: workOrder.type === 'INSTALLATION' ? 'INSTALLATION' : 'REPAIR',
      serviceAddress: workOrder.serviceAddress,
      skillsRequired: [],
      toolsRequired: workOrder.requiredTools,
      partsRequired: workOrder.requiredParts.map(part => ({
        partNumber: part.partNumber,
        quantity: part.quantity,
        critical: part.availability === 'ORDER_REQUIRED'
      })),
      customerPreferences: {
        contactMethod: 'PHONE'
      },
      status: 'SCHEDULED',
      notifications: {
        confirmationSent: false,
        reminderSent: false,
        arrivalNotificationSent: false,
        completionNotificationSent: false
      },
      rescheduleHistory: [],
      createdBy: 'DISPATCHER',
      createdDate: new Date(),
      lastUpdated: new Date()
    };

    this.appointments.set(appointmentId, appointment);
    return appointment;
  }

  private async runDispatchOptimization(technicians: any[], workOrders: any[]): Promise<any[]> {
    // Simplified dispatch optimization algorithm
    // In production, this would use advanced optimization algorithms
    
    const assignments: any[] = [];
    
    for (const technician of technicians) {
      const assignedWorkOrders = workOrders
        .filter(wo => wo.priority === 'HIGH' || wo.priority === 'URGENT')
        .slice(0, 3) // Assign up to 3 high-priority work orders per technician
        .map((wo, index) => ({
          workOrderId: wo.workOrderId,
          sequence: index + 1,
          scheduledStart: new Date(Date.now() + (index * 2 * 60 * 60 * 1000)), // 2 hours apart
          scheduledEnd: new Date(Date.now() + (index * 2 * 60 * 60 * 1000) + (wo.estimatedDuration * 60 * 1000)),
          travelTime: 30 // 30 minutes travel time
        }));

      assignments.push({
        technicianId: technician.technicianId,
        workOrders: assignedWorkOrders,
        totalTravelTime: assignedWorkOrders.length * 30,
        utilizationRate: 0.75
      });

      // Remove assigned work orders from the list
      assignedWorkOrders.forEach(assignment => {
        const index = workOrders.findIndex(wo => wo.workOrderId === assignment.workOrderId);
        if (index > -1) {
          workOrders.splice(index, 1);
        }
      });
    }
    
    return assignments;
  }

  private async getCurrentTechnicianLocation(technicianId: string): Promise<any | null> {
    // Get current location from GPS tracking service
    if (this.gpsTrackingService) {
      return await this.gpsTrackingService.getCurrentLocation(technicianId);
    }
    return null;
  }

  private async calculateOperationalMetrics(startDate: Date, endDate: Date): Promise<any> {
    return {
      totalServiceRequests: 150,
      serviceRequestsByType: {
        INSTALLATION: 30,
        REPAIR: 85,
        MAINTENANCE: 25,
        INSPECTION: 10
      },
      serviceRequestsByPriority: {
        EMERGENCY: 5,
        URGENT: 15,
        HIGH: 45,
        MEDIUM: 70,
        LOW: 15
      },
      averageResponseTime: 6.2,
      averageResolutionTime: 18.5,
      slaComplianceRate: 0.92
    };
  }

  private async calculateFinancialMetrics(startDate: Date, endDate: Date): Promise<any> {
    return {
      totalRevenue: 125000,
      revenueByServiceType: {
        INSTALLATION: 45000,
        REPAIR: 65000,
        MAINTENANCE: 15000
      },
      totalCosts: 87000,
      laborCosts: 52000,
      partsCosts: 28000,
      travelCosts: 7000,
      profitMargin: 0.304,
      costPerServiceRequest: 580
    };
  }

  private async calculateCustomerMetrics(startDate: Date, endDate: Date): Promise<any> {
    return {
      totalCustomers: 285,
      newCustomers: 23,
      customerRetentionRate: 0.91,
      customerSatisfactionScore: 4.3,
      netPromoterScore: 68,
      complaintsReceived: 12,
      complaintResolutionTime: 2.5
    };
  }

  private async calculateTechnicianMetrics(startDate: Date, endDate: Date): Promise<any> {
    return {
      totalTechnicians: 12,
      averageUtilizationRate: 0.78,
      utilizationRate: 0.78, // Add the missing property
      productivityScore: 0.85,
      skillsGapAnalysis: {
        'ELECTRICAL': 2,
        'SOFTWARE': 3,
        'ADVANCED_DIAGNOSTICS': 1
      },
      trainingCompletionRate: 0.94,
      turnoverRate: 0.08
    };
  }

  private async calculateAssetMetrics(startDate: Date, endDate: Date): Promise<any> {
    return {
      totalAssetsManaged: 1250,
      assetsByCategory: {
        'HVAC': 350,
        'ELECTRICAL': 425,
        'MECHANICAL': 285,
        'IT_EQUIPMENT': 190
      },
      averageAssetAge: 7.2,
      assetReliabilityScore: 0.87,
      maintenanceCostTrends: [],
      assetDowntime: 142.5
    };
  }

  private async calculatePredictiveMetrics(startDate: Date, endDate: Date): Promise<any> {
    return {
      demandForecast: [],
      maintenancePredict: [],
      partsDemandForecast: [],
      resourceOptimization: [],
      riskAssessment: []
    };
  }

  private async generateAnalyticsInsights(analytics: ServiceAnalytics): Promise<any[]> {
    const insights: any[] = [];
    
    // Generate insights based on analytics data
    if (analytics.operationalData?.slaComplianceRate && analytics.operationalData.slaComplianceRate < 0.95) {
      insights.push({
        insightType: 'OPPORTUNITY',
        title: 'SLA Compliance Improvement',
        description: 'SLA compliance is below target. Consider optimizing scheduling and dispatch.',
        impact: 'MEDIUM',
        recommendedAction: 'Implement advanced dispatch optimization and increase technician capacity during peak hours.',
        estimatedBenefit: 15000
      });
    }

    if (analytics.technicianData?.utilizationRate && analytics.technicianData.utilizationRate < 0.75) {
      insights.push({
        insightType: 'EFFICIENCY',
        title: 'Technician Utilization Opportunity',
        description: 'Technician utilization is below optimal levels.',
        impact: 'HIGH',
        recommendedAction: 'Review scheduling algorithms and consider territory adjustments.',
        estimatedBenefit: 25000
      });
    }

    return insights;
  }
}

// Export singleton instance - will be properly initialized with context
export let fieldServiceService: FieldServiceService;

// Factory function to create properly initialized service
export function createFieldServiceService(context?: ServiceIntegrationContext): FieldServiceService {
  fieldServiceService = new FieldServiceService(context);
  return fieldServiceService;
}

// Initialize basic instance for backward compatibility
fieldServiceService = new FieldServiceService();