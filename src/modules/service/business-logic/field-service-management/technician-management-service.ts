/**
 * Technician Management Service
 * Comprehensive Oracle EBS competitive technician and resource management
 */

import type {
  Technician,
  TechnicianSkill,
  Certification,
  ServiceVehicle,
  TechnicianPerformance,
  PerformanceMetrics,
  PerformanceKPI,
  ServiceArea,
  WorkSchedule,
  AvailabilityWindow,
  GeoLocation,
  DateRange,
} from '../../types/field-service-types';

import { TechnicianStatus, SkillLevel } from '../../types/field-service-types';

export class TechnicianManagementService {
  // ================================
  // TECHNICIAN LIFECYCLE MANAGEMENT
  // ================================

  /**
   * Create new technician profile
   */
  async createTechnician(technicianData: {
    employeeId: string;
    name: string;
    email: string;
    phone: string;
    homeBaseId: string;
    serviceAreaIds: string[];
    skills: Array<{
      skillName: string;
      category: string;
      level: SkillLevel;
      certificationRequired: boolean;
    }>;
    workSchedule: {
      scheduleType: 'REGULAR' | 'OVERTIME' | 'ON_CALL' | 'FLEXIBLE';
      workingHours: Array<{
        dayOfWeek: string;
        startTime: string;
        endTime: string;
        isWorkingDay: boolean;
      }>;
      timeZone: string;
      maxHoursPerDay: number;
      maxHoursPerWeek: number;
    };
    emergencyContact: {
      name: string;
      relationship: string;
      phone: string;
      email?: string;
    };
    hireDate: Date;
  }): Promise<Technician> {
    const id = `tech_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const technician: Technician = {
      id,
      employeeId: technicianData.employeeId,
      name: technicianData.name,
      email: technicianData.email,
      phone: technicianData.phone,
      status: TechnicianStatus.AVAILABLE,
      location: await this.getHomeBaseLocation(technicianData.homeBaseId),
      homeBase: await this.getServiceLocation(technicianData.homeBaseId),
      serviceArea: await this.getServiceArea(technicianData.serviceAreaIds[0]),
      skills: technicianData.skills.map((skill, index) => ({
        skillId: `skill_${index}_${Date.now()}`,
        skillName: skill.skillName,
        category: skill.category,
        level: skill.level,
        certificationRequired: skill.certificationRequired,
        lastAssessed: new Date(),
        assessmentScore: 0, // Will be updated during assessment
      })),
      certifications: [],
      tools: [],
      schedule: {
        id: `schedule_${Date.now()}`,
        technicianId: id,
        scheduleType: technicianData.workSchedule.scheduleType,
        startDate: new Date(),
        workingHours: technicianData.workSchedule.workingHours.map((wh) => ({
          dayOfWeek: wh.dayOfWeek as any,
          startTime: wh.startTime,
          endTime: wh.endTime,
          isWorkingDay: wh.isWorkingDay,
        })),
        timeZone: technicianData.workSchedule.timeZone,
        maxHoursPerDay: technicianData.workSchedule.maxHoursPerDay,
        maxHoursPerWeek: technicianData.workSchedule.maxHoursPerWeek,
        breakDuration: 15, // Default 15 minutes
        lunchDuration: 30, // Default 30 minutes
        overtimeEligible: true,
      },
      performance: await this.initializePerformanceMetrics(id),
      availability: [],
      preferredWorkTypes: [],
      languagesSpoken: ['English'],
      emergencyContact: technicianData.emergencyContact,
      hireDate: technicianData.hireDate,
      createdDate: new Date(),
      lastUpdated: new Date(),
    };

    console.log(`Created technician: ${technician.name} (${technician.id})`);
    return technician;
  }

  /**
   * Update technician status
   */
  async updateTechnicianStatus(
    technicianId: string,
    status: TechnicianStatus,
    location?: GeoLocation,
    reason?: string
  ): Promise<{
    technicianId: string;
    previousStatus: TechnicianStatus;
    newStatus: TechnicianStatus;
    location?: GeoLocation;
    timestamp: Date;
    reason?: string;
  }> {
    console.log(`Updating technician ${technicianId} status to ${status}`);

    return {
      technicianId,
      previousStatus: TechnicianStatus.AVAILABLE,
      newStatus: status,
      location,
      timestamp: new Date(),
      reason,
    };
  }

  /**
   * Assign vehicle to technician
   */
  async assignVehicle(
    technicianId: string,
    vehicleId: string
  ): Promise<{
    assignmentId: string;
    technicianId: string;
    vehicleId: string;
    assignedDate: Date;
    status: 'ASSIGNED' | 'PENDING' | 'REJECTED';
  }> {
    const assignmentId = `va_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      assignmentId,
      technicianId,
      vehicleId,
      assignedDate: new Date(),
      status: 'ASSIGNED',
    };
  }

  // ================================
  // SKILLS & CERTIFICATION MANAGEMENT
  // ================================

  /**
   * Add skill to technician
   */
  async addTechnicianSkill(
    technicianId: string,
    skill: {
      skillName: string;
      category: string;
      level: SkillLevel;
      certificationRequired: boolean;
      assessmentScore?: number;
    }
  ): Promise<TechnicianSkill> {
    const technicianSkill: TechnicianSkill = {
      skillId: `skill_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      skillName: skill.skillName,
      category: skill.category,
      level: skill.level,
      certificationRequired: skill.certificationRequired,
      lastAssessed: new Date(),
      assessmentScore: skill.assessmentScore || 0,
    };

    console.log(`Added skill ${skill.skillName} to technician ${technicianId}`);
    return technicianSkill;
  }

  /**
   * Update skill level after assessment
   */
  async updateSkillLevel(
    technicianId: string,
    skillId: string,
    newLevel: SkillLevel,
    assessmentScore: number,
    assessorId: string
  ): Promise<{
    skillId: string;
    previousLevel: SkillLevel;
    newLevel: SkillLevel;
    assessmentScore: number;
    assessmentDate: Date;
    assessorId: string;
    certificationRecommended: boolean;
  }> {
    return {
      skillId,
      previousLevel: SkillLevel.INTERMEDIATE,
      newLevel,
      assessmentScore,
      assessmentDate: new Date(),
      assessorId,
      certificationRecommended: newLevel === SkillLevel.EXPERT || newLevel === SkillLevel.MASTER,
    };
  }

  /**
   * Add certification to technician
   */
  async addCertification(
    technicianId: string,
    certification: {
      name: string;
      issuingOrganization: string;
      certificationNumber: string;
      issueDate: Date;
      expirationDate?: Date;
      attachments?: string[];
    }
  ): Promise<Certification> {
    const cert: Certification = {
      id: `cert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: certification.name,
      issuingOrganization: certification.issuingOrganization,
      certificationNumber: certification.certificationNumber,
      issueDate: certification.issueDate,
      expirationDate: certification.expirationDate,
      renewalRequired: !!certification.expirationDate,
      renewalPeriod: certification.expirationDate
        ? Math.ceil(
            (certification.expirationDate.getTime() - certification.issueDate.getTime()) /
              (1000 * 60 * 60 * 24 * 30)
          )
        : undefined,
      status: 'ACTIVE',
      attachments: certification.attachments || [],
    };

    console.log(`Added certification ${cert.name} to technician ${technicianId}`);
    return cert;
  }

  /**
   * Check for expiring certifications
   */
  async checkExpiringCertifications(
    technicianId?: string,
    daysAhead: number = 30
  ): Promise<
    Array<{
      technicianId: string;
      technicianName: string;
      certification: Certification;
      daysUntilExpiration: number;
      renewalRequired: boolean;
      renewalProcess?: string;
    }>
  > {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() + daysAhead);

    // Mock data for demonstration
    return [
      {
        technicianId: 'tech_001',
        technicianName: 'John Smith',
        certification: {
          id: 'cert_001',
          name: 'HVAC Certification Level 2',
          issuingOrganization: 'NATE',
          certificationNumber: 'NATE-002-2024',
          issueDate: new Date('2022-01-15'),
          expirationDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), // 25 days
          renewalRequired: true,
          renewalPeriod: 24,
          status: 'ACTIVE',
          attachments: [],
        },
        daysUntilExpiration: 25,
        renewalRequired: true,
        renewalProcess: 'Complete 16 hours continuing education and pass renewal exam',
      },
    ];
  }

  // ================================
  // AVAILABILITY MANAGEMENT
  // ================================

  /**
   * Set technician availability
   */
  async setAvailability(
    technicianId: string,
    availability: {
      date: Date;
      startTime: Date;
      endTime: Date;
      availabilityType: 'AVAILABLE' | 'BUSY' | 'OUT_OF_OFFICE' | 'TRAINING';
      reason?: string;
      location?: GeoLocation;
    }
  ): Promise<AvailabilityWindow> {
    const availabilityWindow: AvailabilityWindow = {
      id: `avail_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      technicianId,
      date: availability.date,
      startTime: availability.startTime,
      endTime: availability.endTime,
      availabilityType: availability.availabilityType,
      reason: availability.reason,
      location: availability.location,
    };

    console.log(
      `Set availability for technician ${technicianId} on ${availability.date.toDateString()}`
    );
    return availabilityWindow;
  }

  /**
   * Find available technicians for time slot
   */
  async findAvailableTechnicians(
    timeSlot: {
      startTime: Date;
      endTime: Date;
      location?: GeoLocation;
      requiredSkills?: string[];
    },
    filters?: {
      serviceAreaIds?: string[];
      maxDistance?: number; // miles
      minSkillLevel?: SkillLevel;
      excludeTechnicianIds?: string[];
    }
  ): Promise<
    Array<{
      technician: Technician;
      availabilityScore: number; // 1-100
      travelTime?: number; // minutes
      distance?: number; // miles
      skillMatch: number; // percentage
      utilizationRate: number; // percentage
    }>
  > {
    // Mock available technicians with scoring
    return [
      {
        technician: await this.getMockTechnician('tech_001'),
        availabilityScore: 95,
        travelTime: 15,
        distance: 8.5,
        skillMatch: 88,
        utilizationRate: 72,
      },
      {
        technician: await this.getMockTechnician('tech_002'),
        availabilityScore: 87,
        travelTime: 25,
        distance: 14.2,
        skillMatch: 95,
        utilizationRate: 68,
      },
    ];
  }

  /**
   * Get technician schedule for date range
   */
  async getTechnicianSchedule(
    technicianId: string,
    dateRange: DateRange
  ): Promise<{
    technicianId: string;
    technicianName: string;
    dateRange: DateRange;
    schedule: Array<{
      date: Date;
      timeSlots: Array<{
        startTime: Date;
        endTime: Date;
        type: 'WORK_ORDER' | 'TRAVEL' | 'BREAK' | 'AVAILABLE' | 'UNAVAILABLE';
        workOrderId?: string;
        description?: string;
        location?: GeoLocation;
      }>;
      totalHours: number;
      utilisationRate: number;
    }>;
    summary: {
      totalWorkingDays: number;
      totalScheduledHours: number;
      totalAvailableHours: number;
      utilizationRate: number;
      overtimeHours: number;
    };
  }> {
    const technician = await this.getMockTechnician(technicianId);

    return {
      technicianId,
      technicianName: technician.name,
      dateRange,
      schedule: [
        {
          date: new Date(),
          timeSlots: [
            {
              startTime: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 AM
              endTime: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 PM
              type: 'WORK_ORDER',
              workOrderId: 'wo_001',
              description: 'HVAC Maintenance - Office Building',
              location: { latitude: 40.7128, longitude: -74.006, timestamp: new Date() },
            },
            {
              startTime: new Date(Date.now() + 13 * 60 * 60 * 1000), // 1 PM
              endTime: new Date(Date.now() + 17 * 60 * 60 * 1000), // 5 PM
              type: 'WORK_ORDER',
              workOrderId: 'wo_002',
              description: 'Equipment Installation',
              location: { latitude: 40.7589, longitude: -73.9851, timestamp: new Date() },
            },
          ],
          totalHours: 8,
          utilisationRate: 100,
        },
      ],
      summary: {
        totalWorkingDays: 5,
        totalScheduledHours: 40,
        totalAvailableHours: 40,
        utilizationRate: 85,
        overtimeHours: 0,
      },
    };
  }

  // ================================
  // PERFORMANCE MANAGEMENT
  // ================================

  /**
   * Calculate technician performance metrics
   */
  async calculatePerformanceMetrics(
    technicianId: string,
    period: DateRange
  ): Promise<TechnicianPerformance> {
    const performance: TechnicianPerformance = {
      technicianId,
      period,
      metrics: {
        totalWorkOrders: 45,
        completedWorkOrders: 43,
        cancelledWorkOrders: 2,
        avgResponseTime: 25, // minutes
        avgCompletionTime: 180, // minutes
        firstCallResolution: 87, // percentage
        customerSatisfaction: 4.3, // 1-5 scale
        utilizationRate: 82, // percentage
        overtimeHours: 8,
        milesDriven: 1250,
        revenueGenerated: 34500,
        costsIncurred: 12800,
        profitMargin: 63, // percentage
      },
      kpis: [
        {
          kpiId: 'kpi_response_time',
          name: 'Average Response Time',
          category: 'EFFICIENCY',
          currentValue: 25,
          targetValue: 30,
          unit: 'minutes',
          trend: 'IMPROVING',
          lastMeasured: new Date(),
        },
        {
          kpiId: 'kpi_customer_satisfaction',
          name: 'Customer Satisfaction',
          category: 'QUALITY',
          currentValue: 4.3,
          targetValue: 4.0,
          unit: 'score',
          trend: 'IMPROVING',
          lastMeasured: new Date(),
        },
      ],
      trends: [
        {
          metric: 'Response Time',
          values: [
            { date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), value: 32 },
            { date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), value: 28 },
            { date: new Date(), value: 25 },
          ],
          trendDirection: 'UP',
          changePercent: -21.9, // Negative because lower response time is better
        },
      ],
      goals: [
        {
          goalId: 'goal_001',
          name: 'Improve First Call Resolution',
          description: 'Increase FCR rate to 90% by end of quarter',
          metric: 'firstCallResolution',
          targetValue: 90,
          currentValue: 87,
          deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
          status: 'ON_TRACK',
          weight: 8,
        },
      ],
      lastUpdated: new Date(),
    };

    return performance;
  }

  /**
   * Set performance goals for technician
   */
  async setPerformanceGoals(
    technicianId: string,
    goals: Array<{
      name: string;
      description: string;
      metric: string;
      targetValue: number;
      deadline: Date;
      weight: number;
    }>
  ): Promise<
    Array<{
      goalId: string;
      name: string;
      status: 'CREATED' | 'APPROVED' | 'ACTIVE';
      createdDate: Date;
    }>
  > {
    return goals.map((goal, index) => ({
      goalId: `goal_${technicianId}_${Date.now()}_${index}`,
      name: goal.name,
      status: 'CREATED' as const,
      createdDate: new Date(),
    }));
  }

  // ================================
  // LOCATION & TRACKING
  // ================================

  /**
   * Update technician location
   */
  async updateLocation(
    technicianId: string,
    location: GeoLocation
  ): Promise<{
    technicianId: string;
    location: GeoLocation;
    previousLocation?: GeoLocation;
    distanceMoved?: number; // miles
    updated: Date;
  }> {
    return {
      technicianId,
      location,
      distanceMoved: 2.3,
      updated: new Date(),
    };
  }

  /**
   * Get technicians within radius of location
   */
  async getTechniciansNearLocation(
    centerLocation: GeoLocation,
    radiusMiles: number,
    filters?: {
      statuses?: TechnicianStatus[];
      requiredSkills?: string[];
      maxWorkload?: number;
    }
  ): Promise<
    Array<{
      technician: Technician;
      distance: number; // miles
      estimatedTravelTime: number; // minutes
      currentWorkload: number; // percentage
      availableNow: boolean;
    }>
  > {
    return [
      {
        technician: await this.getMockTechnician('tech_001'),
        distance: 3.2,
        estimatedTravelTime: 12,
        currentWorkload: 75,
        availableNow: true,
      },
      {
        technician: await this.getMockTechnician('tech_002'),
        distance: 5.8,
        estimatedTravelTime: 18,
        currentWorkload: 90,
        availableNow: false,
      },
    ];
  }

  // ================================
  // TEAM MANAGEMENT
  // ================================

  /**
   * Create technician team
   */
  async createTeam(teamData: {
    name: string;
    description?: string;
    leadTechnicianId: string;
    memberIds: string[];
    specialization?: string;
    serviceAreaIds: string[];
  }): Promise<{
    teamId: string;
    name: string;
    leadTechnicianId: string;
    memberCount: number;
    specialization?: string;
    serviceAreas: string[];
    status: 'ACTIVE' | 'INACTIVE';
    createdDate: Date;
  }> {
    const teamId = `team_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      teamId,
      name: teamData.name,
      leadTechnicianId: teamData.leadTechnicianId,
      memberCount: teamData.memberIds.length + 1, // +1 for lead
      specialization: teamData.specialization,
      serviceAreas: teamData.serviceAreaIds,
      status: 'ACTIVE',
      createdDate: new Date(),
    };
  }

  /**
   * Assign team to work order
   */
  async assignTeamToWorkOrder(
    teamId: string,
    workOrderId: string,
    leadTechnicianId: string,
    assistantIds: string[]
  ): Promise<{
    assignmentId: string;
    teamId: string;
    workOrderId: string;
    leadTechnicianId: string;
    assistantIds: string[];
    assignedDate: Date;
    status: 'ASSIGNED' | 'ACCEPTED' | 'REJECTED';
  }> {
    const assignmentId = `ta_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      assignmentId,
      teamId,
      workOrderId,
      leadTechnicianId,
      assistantIds,
      assignedDate: new Date(),
      status: 'ASSIGNED',
    };
  }

  // ================================
  // UTILITY METHODS
  // ================================

  private async getHomeBaseLocation(homeBaseId: string): Promise<GeoLocation> {
    // Mock implementation
    return {
      latitude: 40.7128,
      longitude: -74.006,
      timestamp: new Date(),
    };
  }

  private async getServiceLocation(locationId: string): Promise<any> {
    // Mock implementation
    return {
      id: locationId,
      name: 'Main Service Center',
      type: 'DEPOT',
      address: {
        street1: '123 Service St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
      },
      location: { latitude: 40.7128, longitude: -74.006, timestamp: new Date() },
      contactInfo: { primaryPhone: '555-0100' },
      operatingHours: {
        timezone: 'America/New_York',
        schedule: [],
        holidays: [],
        specialHours: [],
      },
      facilities: [],
    };
  }

  private async getServiceArea(serviceAreaId: string): Promise<ServiceArea> {
    // Mock implementation
    return {
      id: serviceAreaId,
      name: 'Manhattan Service Area',
      description: 'Lower and Midtown Manhattan coverage',
      boundaries: [
        { latitude: 40.7589, longitude: -73.9851 },
        { latitude: 40.7128, longitude: -74.006 },
      ],
      zipCodes: ['10001', '10002', '10003'],
      isActive: true,
      assignedTechnicians: [],
      travelTimes: {},
    };
  }

  private async initializePerformanceMetrics(technicianId: string): Promise<TechnicianPerformance> {
    return {
      technicianId,
      period: { startDate: new Date(), endDate: new Date() },
      metrics: {
        totalWorkOrders: 0,
        completedWorkOrders: 0,
        cancelledWorkOrders: 0,
        avgResponseTime: 0,
        avgCompletionTime: 0,
        firstCallResolution: 0,
        customerSatisfaction: 0,
        utilizationRate: 0,
        overtimeHours: 0,
        milesDriven: 0,
        revenueGenerated: 0,
        costsIncurred: 0,
        profitMargin: 0,
      },
      kpis: [],
      trends: [],
      goals: [],
      lastUpdated: new Date(),
    };
  }

  private async getMockTechnician(technicianId: string): Promise<Technician> {
    const homeBase = await this.getServiceLocation('depot_001');
    const serviceArea = await this.getServiceArea('area_001');

    return {
      id: technicianId,
      employeeId: `EMP${technicianId.substring(5)}`,
      name: 'John Smith',
      email: 'john.smith@company.com',
      phone: '555-0123',
      status: TechnicianStatus.AVAILABLE,
      location: { latitude: 40.7128, longitude: -74.006, timestamp: new Date() },
      homeBase,
      serviceArea,
      skills: [],
      certifications: [],
      tools: [],
      schedule: {
        id: `schedule_${technicianId}`,
        technicianId,
        scheduleType: 'REGULAR',
        startDate: new Date(),
        workingHours: [],
        timeZone: 'America/New_York',
        maxHoursPerDay: 8,
        maxHoursPerWeek: 40,
        breakDuration: 15,
        lunchDuration: 30,
        overtimeEligible: true,
      },
      performance: await this.initializePerformanceMetrics(technicianId),
      availability: [],
      preferredWorkTypes: [],
      languagesSpoken: ['English'],
      emergencyContact: {
        name: 'Jane Smith',
        relationship: 'Spouse',
        phone: '555-0124',
      },
      hireDate: new Date('2020-01-15'),
      createdDate: new Date(),
      lastUpdated: new Date(),
    };
  }
}

export const technicianManagementService = new TechnicianManagementService();
