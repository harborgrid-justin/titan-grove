/**
 * Mobile Command Service
 * Mobile interface for Service Command Center operations
 * Provides field-ready command and control capabilities
 */

import type {
  MobileCommandInterface,
  ServiceResource,
  ServiceCommandCenter
} from '../types';

export class MobileCommandService {
  private mobileSessions: Map<string, MobileCommandInterface> = new Map();
  private locationTracking: Map<string, any> = new Map();
  
  constructor(
    private logger?: any,
    private pushNotificationService?: any,
    private geoLocationService?: any
  ) {}

  // ================================
  // MOBILE SESSION MANAGEMENT
  // ================================

  /**
   * Initialize mobile command session
   */
  async initializeMobileSession(config: {
    userId: string;
    deviceInfo: {
      deviceId: string;
      platform: 'iOS' | 'Android' | 'Web';
      version: string;
    };
    location?: { lat: number; lng: number; accuracy: number; };
  }): Promise<MobileCommandInterface> {
    const sessionId = `mobile_session_${Date.now()}`;
    
    const mobileSession: MobileCommandInterface = {
      sessionId,
      userId: config.userId,
      deviceInfo: {
        ...config.deviceInfo,
        capabilities: this.detectDeviceCapabilities(config.deviceInfo.platform)
      },
      
      // Location services
      gpsEnabled: !!config.location,
      currentLocation: config.location,
      locationHistory: config.location ? [{ 
        timestamp: new Date(), 
        lat: config.location.lat, 
        lng: config.location.lng 
      }] : [],
      
      // Offline capabilities
      offlineMode: false,
      syncPending: false,
      lastSyncTime: new Date(),
      
      // Initialize active context
      activeWorkOrders: [],
      nearbyResources: [],
      emergencyMode: false
    };

    this.mobileSessions.set(sessionId, mobileSession);
    
    // Set up location tracking if GPS enabled
    if (mobileSession.gpsEnabled) {
      await this.startLocationTracking(sessionId);
    }
    
    this.logger?.info('Mobile command session initialized', {
      sessionId,
      userId: config.userId,
      platform: config.deviceInfo.platform,
      gpsEnabled: mobileSession.gpsEnabled
    });

    return mobileSession;
  }

  /**
   * Get mobile command dashboard data
   */
  async getMobileCommandDashboard(sessionId: string): Promise<{
    summary: {
      activeWorkOrders: number;
      nearbyResources: number;
      emergencyAlerts: number;
      nextAppointment?: {
        workOrderId: string;
        customerName: string;
        scheduledTime: Date;
        estimatedDuration: number;
      };
    };
    quickActions: {
      actionId: string;
      label: string;
      icon: string;
      enabled: boolean;
    }[];
    recentActivity: {
      activityId: string;
      type: 'WORK_ORDER' | 'RESOURCE_UPDATE' | 'EMERGENCY' | 'NOTIFICATION';
      description: string;
      timestamp: Date;
      priority: 'LOW' | 'MEDIUM' | 'HIGH';
    }[];
    performanceSnapshot: {
      todayCompleted: number;
      avgResponseTime: number;
      customerRating: number;
      efficiency: number;
    };
  }> {
    const session = this.mobileSessions.get(sessionId);
    if (!session) {
      throw new Error(`Mobile session ${sessionId} not found`);
    }

    // Generate mobile-optimized dashboard data
    const summary = {
      activeWorkOrders: session.activeWorkOrders.length,
      nearbyResources: session.nearbyResources.length,
      emergencyAlerts: 2,
      nextAppointment: {
        workOrderId: 'wo_next_001',
        customerName: 'ABC Manufacturing',
        scheduledTime: new Date(Date.now() + 45 * 60 * 1000), // 45 minutes from now
        estimatedDuration: 90 // minutes
      }
    };

    const quickActions = [
      {
        actionId: 'create_work_order',
        label: 'Create Work Order',
        icon: 'plus-circle',
        enabled: true
      },
      {
        actionId: 'emergency_dispatch',
        label: 'Emergency Dispatch',
        icon: 'alert-triangle',
        enabled: !session.emergencyMode
      },
      {
        actionId: 'find_resources',
        label: 'Find Resources',
        icon: 'users',
        enabled: session.gpsEnabled
      },
      {
        actionId: 'service_history',
        label: 'Service History',
        icon: 'clock',
        enabled: true
      }
    ];

    const recentActivity = [
      {
        activityId: 'activity_001',
        type: 'WORK_ORDER' as const,
        description: 'Work order WO-2024-001 completed successfully',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        priority: 'MEDIUM' as const
      },
      {
        activityId: 'activity_002',
        type: 'RESOURCE_UPDATE' as const,
        description: 'Technician John Smith now available',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        priority: 'LOW' as const
      },
      {
        activityId: 'activity_003',
        type: 'EMERGENCY' as const,
        description: 'Emergency response team dispatched to downtown area',
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        priority: 'HIGH' as const
      }
    ];

    const performanceSnapshot = {
      todayCompleted: 8,
      avgResponseTime: 16.5, // minutes
      customerRating: 4.8,
      efficiency: 92.3 // percentage
    };

    return {
      summary,
      quickActions,
      recentActivity,
      performanceSnapshot
    };
  }

  /**
   * Execute emergency dispatch from mobile
   */
  async executeEmergencyDispatch(sessionId: string, emergency: {
    type: 'EQUIPMENT_FAILURE' | 'SAFETY_INCIDENT' | 'CUSTOMER_CRITICAL';
    description: string;
    location?: { lat: number; lng: number; };
    priority: 'HIGH' | 'CRITICAL';
  }): Promise<{
    dispatchId: string;
    estimatedResponseTime: number;
    assignedResources: {
      resourceId: string;
      name: string;
      eta: Date;
      contact: string;
    }[];
    escalationTriggered: boolean;
    trackingInfo: {
      trackingId: string;
      statusUpdates: boolean;
      estimatedCompletion: Date;
    };
  }> {
    const session = this.mobileSessions.get(sessionId);
    if (!session) {
      throw new Error(`Mobile session ${sessionId} not found`);
    }

    const dispatchId = `dispatch_${Date.now()}`;
    
    // Use current location if emergency location not provided
    const emergencyLocation = emergency.location || session.currentLocation;
    if (!emergencyLocation) {
      throw new Error('Emergency location required for dispatch');
    }

    // Find nearby qualified resources (simulated)
    const assignedResources = [
      {
        resourceId: 'tech_emergency_001',
        name: 'Mike Johnson (Emergency Response)',
        eta: new Date(Date.now() + 12 * 60 * 1000), // 12 minutes
        contact: '+1-555-0101'
      },
      {
        resourceId: 'tech_emergency_002',
        name: 'Sarah Davis (Specialist)',
        eta: new Date(Date.now() + 18 * 60 * 1000), // 18 minutes
        contact: '+1-555-0102'
      }
    ];

    // Determine if escalation is needed
    const escalationTriggered = emergency.priority === 'CRITICAL' || emergency.type === 'SAFETY_INCIDENT';

    // Create tracking information
    const trackingInfo = {
      trackingId: `track_${dispatchId}`,
      statusUpdates: true,
      estimatedCompletion: new Date(Date.now() + 90 * 60 * 1000) // 90 minutes
    };

    // Update session state
    session.emergencyMode = true;
    session.lastSyncTime = new Date();

    // Send push notifications to nearby resources
    if (this.pushNotificationService) {
      for (const resource of assignedResources) {
        await this.pushNotificationService.send(resource.resourceId, {
          title: 'Emergency Dispatch',
          body: `Emergency ${emergency.type} at ${emergencyLocation.lat}, ${emergencyLocation.lng}`,
          priority: 'HIGH',
          data: { dispatchId, emergencyType: emergency.type }
        });
      }
    }

    this.logger?.warn('Emergency dispatch executed from mobile', {
      sessionId,
      dispatchId,
      emergencyType: emergency.type,
      priority: emergency.priority,
      resourceCount: assignedResources.length,
      escalationTriggered
    });

    return {
      dispatchId,
      estimatedResponseTime: 12, // minutes to first resource arrival
      assignedResources,
      escalationTriggered,
      trackingInfo
    };
  }

  /**
   * Sync mobile data with command center
   */
  async syncMobileData(sessionId: string): Promise<{
    syncId: string;
    syncStatus: 'SUCCESS' | 'PARTIAL' | 'FAILED';
    dataUpdated: {
      workOrders: number;
      resources: number;
      notifications: number;
    };
    offlineActions: {
      uploaded: number;
      failed: number;
    };
    nextSyncScheduled: Date;
  }> {
    const session = this.mobileSessions.get(sessionId);
    if (!session) {
      throw new Error(`Mobile session ${sessionId} not found`);
    }

    const syncId = `sync_${Date.now()}`;
    
    // Simulate data synchronization
    const dataUpdated = {
      workOrders: Math.floor(Math.random() * 10) + 1,
      resources: Math.floor(Math.random() * 5) + 1,
      notifications: Math.floor(Math.random() * 8) + 1
    };

    const offlineActions = {
      uploaded: Math.floor(Math.random() * 3),
      failed: 0
    };

    // Update session sync status
    session.syncPending = false;
    session.lastSyncTime = new Date();
    
    const nextSyncScheduled = new Date(Date.now() + 5 * 60 * 1000); // Next sync in 5 minutes

    this.logger?.info('Mobile data synchronized', {
      sessionId,
      syncId,
      dataUpdated,
      offlineActions
    });

    return {
      syncId,
      syncStatus: 'SUCCESS',
      dataUpdated,
      offlineActions,
      nextSyncScheduled
    };
  }

  /**
   * Update mobile user location
   */
  async updateMobileLocation(
    sessionId: string,
    location: { lat: number; lng: number; accuracy: number; }
  ): Promise<{
    locationUpdated: boolean;
    nearbyResources: ServiceResource[];
    serviceAreaInfo: {
      areaName: string;
      coverage: 'FULL' | 'PARTIAL' | 'LIMITED';
      responseTime: number;
    };
  }> {
    const session = this.mobileSessions.get(sessionId);
    if (!session) {
      throw new Error(`Mobile session ${sessionId} not found`);
    }

    // Update current location
    session.currentLocation = location;
    session.locationHistory.push({
      timestamp: new Date(),
      lat: location.lat,
      lng: location.lng
    });

    // Keep location history to last 24 hours
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    session.locationHistory = session.locationHistory.filter(loc => loc.timestamp > dayAgo);

    // Find nearby resources (simulated)
    const nearbyResources: ServiceResource[] = [
      {
        resourceId: 'nearby_tech_001',
        resourceType: 'TECHNICIAN',
        name: 'Tom Wilson',
        status: 'AVAILABLE',
        currentLocation: { 
          lat: location.lat + 0.01, 
          lng: location.lng + 0.01, 
          address: '123 Main St' 
        },
        availability: {
          start: new Date(),
          end: new Date(Date.now() + 6 * 60 * 60 * 1000),
          capacity: 80
        },
        skills: ['electrical', 'hvac'],
        certifications: ['EPA', 'OSHA'],
        serviceRadius: 25,
        performanceMetrics: {
          completionRate: 94.5,
          averageRating: 4.6,
          responseTime: 14,
          utilizationRate: 72.0
        },
        currentAssignments: [],
        scheduleConflicts: false,
        lastUpdated: new Date()
      }
    ];

    session.nearbyResources = nearbyResources;

    // Determine service area information
    const serviceAreaInfo = {
      areaName: 'Metropolitan Service Area',
      coverage: 'FULL' as const,
      responseTime: 15 // minutes
    };

    return {
      locationUpdated: true,
      nearbyResources,
      serviceAreaInfo
    };
  }

  /**
   * Enable offline mode for mobile operations
   */
  async enableOfflineMode(sessionId: string): Promise<{
    offlineModeEnabled: boolean;
    cachedData: {
      workOrders: number;
      resources: number;
      customers: number;
      inventory: number;
    };
    offlineCapabilities: string[];
    syncStrategy: {
      autoSyncWhenOnline: boolean;
      conflictResolution: 'SERVER_WINS' | 'CLIENT_WINS' | 'MERGE' | 'MANUAL';
      maxOfflineHours: number;
    };
  }> {
    const session = this.mobileSessions.get(sessionId);
    if (!session) {
      throw new Error(`Mobile session ${sessionId} not found`);
    }

    // Enable offline mode
    session.offlineMode = true;
    session.syncPending = true;

    // Cache essential data for offline operations
    const cachedData = {
      workOrders: 25, // Active work orders cached
      resources: 12, // Nearby resources cached
      customers: 150, // Customer data cached
      inventory: 85 // Inventory items cached
    };

    const offlineCapabilities = [
      'View and update work orders',
      'Record service completion',
      'Capture photos and signatures',
      'Access customer information',
      'Check parts inventory',
      'Create service notes',
      'Emergency contact access'
    ];

    const syncStrategy = {
      autoSyncWhenOnline: true,
      conflictResolution: 'MERGE' as const,
      maxOfflineHours: 8
    };

    this.logger?.info('Offline mode enabled', {
      sessionId,
      cachedData,
      capabilityCount: offlineCapabilities.length
    });

    return {
      offlineModeEnabled: true,
      cachedData,
      offlineCapabilities,
      syncStrategy
    };
  }

  /**
   * Execute mobile emergency response
   */
  async executeMobileEmergencyResponse(sessionId: string, emergency: {
    type: 'PERSONAL_SAFETY' | 'EQUIPMENT_HAZARD' | 'CUSTOMER_EMERGENCY' | 'ENVIRONMENTAL';
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'LIFE_THREATENING';
    description: string;
    requiresImmediateResponse: boolean;
  }): Promise<{
    emergencyId: string;
    responseInitiated: boolean;
    emergencyContacts: {
      contactType: 'EMERGENCY_SERVICES' | 'SUPERVISOR' | 'SAFETY_TEAM' | 'CUSTOMER';
      contactInfo: string;
      notificationSent: boolean;
    }[];
    safetyProtocols: string[];
    trackingActivated: boolean;
    estimatedHelp: {
      responseTime: number; // minutes
      respondingUnits: string[];
    };
  }> {
    const session = this.mobileSessions.get(sessionId);
    if (!session) {
      throw new Error(`Mobile session ${sessionId} not found`);
    }

    const emergencyId = `emergency_${Date.now()}`;
    
    // Activate emergency mode
    session.emergencyMode = true;

    // Determine appropriate emergency contacts
    const emergencyContacts = this.getEmergencyContacts(emergency.type, emergency.severity);

    // Define safety protocols based on emergency type
    const safetyProtocols = this.getSafetyProtocols(emergency.type);

    // Estimate help arrival (simulated)
    const estimatedHelp = {
      responseTime: emergency.severity === 'LIFE_THREATENING' ? 8 :
                   emergency.severity === 'HIGH' ? 15 : 30,
      respondingUnits: emergency.severity === 'LIFE_THREATENING' ? 
        ['EMS Unit 1', 'Safety Supervisor', 'Site Manager'] :
        ['Safety Supervisor', 'Site Manager']
    };

    // Send emergency notifications
    for (const contact of emergencyContacts) {
      if (this.pushNotificationService) {
        await this.pushNotificationService.sendEmergency(contact.contactInfo, {
          emergencyId,
          type: emergency.type,
          severity: emergency.severity,
          location: session.currentLocation,
          description: emergency.description
        });
        contact.notificationSent = true;
      }
    }

    // Activate enhanced location tracking
    const trackingActivated = await this.activateEmergencyTracking(sessionId);

    this.logger?.error('Mobile emergency response executed', {
      sessionId,
      emergencyId,
      type: emergency.type,
      severity: emergency.severity,
      location: session.currentLocation,
      contactsNotified: emergencyContacts.length
    });

    return {
      emergencyId,
      responseInitiated: true,
      emergencyContacts,
      safetyProtocols,
      trackingActivated,
      estimatedHelp
    };
  }

  // ================================
  // PRIVATE HELPER METHODS
  // ================================

  private detectDeviceCapabilities(platform: string): string[] {
    const baseCapabilities = ['GPS', 'Camera', 'Push_Notifications', 'Offline_Storage'];
    
    switch (platform) {
      case 'iOS':
        return [...baseCapabilities, 'Biometric_Auth', 'Siri_Integration', 'Apple_Pay'];
      case 'Android':
        return [...baseCapabilities, 'Biometric_Auth', 'Google_Assistant', 'Google_Pay'];
      case 'Web':
        return [...baseCapabilities, 'Browser_Notifications', 'Web_Share'];
      default:
        return baseCapabilities;
    }
  }

  private async startLocationTracking(sessionId: string): Promise<void> {
    // Set up periodic location updates
    setInterval(() => {
      this.updateLocationTracking(sessionId);
    }, 30000); // Update every 30 seconds
  }

  private async updateLocationTracking(sessionId: string): Promise<void> {
    const session = this.mobileSessions.get(sessionId);
    if (!session || !session.gpsEnabled) return;

    // In real implementation, this would get actual GPS data
    if (session.currentLocation) {
      const locationUpdate = {
        timestamp: new Date(),
        lat: session.currentLocation.lat + (Math.random() - 0.5) * 0.001,
        lng: session.currentLocation.lng + (Math.random() - 0.5) * 0.001
      };

      session.locationHistory.push(locationUpdate);
      session.currentLocation = {
        lat: locationUpdate.lat,
        lng: locationUpdate.lng,
        accuracy: 5 + Math.random() * 10
      };
    }
  }

  private getEmergencyContacts(type: string, severity: string): {
    contactType: 'EMERGENCY_SERVICES' | 'SUPERVISOR' | 'SAFETY_TEAM' | 'CUSTOMER';
    contactInfo: string;
    notificationSent: boolean;
  }[] {
    const contacts: {
      contactType: 'EMERGENCY_SERVICES' | 'SUPERVISOR' | 'SAFETY_TEAM' | 'CUSTOMER';
      contactInfo: string;
      notificationSent: boolean;
    }[] = [
      {
        contactType: 'SUPERVISOR',
        contactInfo: '+1-555-SUPERVISOR',
        notificationSent: false
      }
    ];

    if (severity === 'LIFE_THREATENING') {
      contacts.push({
        contactType: 'EMERGENCY_SERVICES',
        contactInfo: '911',
        notificationSent: false
      });
    }

    if (type === 'EQUIPMENT_HAZARD' || type === 'ENVIRONMENTAL') {
      contacts.push({
        contactType: 'SAFETY_TEAM',
        contactInfo: '+1-555-SAFETY',
        notificationSent: false
      });
    }

    return contacts;
  }

  private getSafetyProtocols(type: string): string[] {
    const baseProtocols = [
      'Ensure personal safety first',
      'Move to safe location if possible',
      'Do not attempt repairs in emergency situation'
    ];

    switch (type) {
      case 'EQUIPMENT_HAZARD':
        return [
          ...baseProtocols,
          'Shut down equipment if safely possible',
          'Post warning signs if available',
          'Clear area of other personnel'
        ];
      case 'ENVIRONMENTAL':
        return [
          ...baseProtocols,
          'Evacuate immediate area',
          'Check for chemical exposure',
          'Contain spill if trained and safe to do so'
        ];
      case 'PERSONAL_SAFETY':
        return [
          'Assess injury severity',
          'Apply first aid if trained',
          'Do not move injured person unless necessary',
          'Keep injured person conscious and comfortable'
        ];
      default:
        return baseProtocols;
    }
  }

  private async activateEmergencyTracking(sessionId: string): Promise<boolean> {
    const session = this.mobileSessions.get(sessionId);
    if (!session) return false;

    // Increase tracking frequency and accuracy
    this.locationTracking.set(sessionId, {
      enhanced: true,
      frequency: 10000, // 10 seconds
      accuracy: 'HIGH',
      batteryOptimization: false // Prioritize accuracy over battery
    });

    return true;
  }
}

// Export service instance
export const mobileCommandService = new MobileCommandService();