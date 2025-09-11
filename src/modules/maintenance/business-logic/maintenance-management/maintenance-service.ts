/**
 * Maintenance Management Service
 * Business logic for maintenance management operations
 * Enhanced with message queue and cache integration
 */

import type { MaintenanceEntity } from '../../types';
import { maintenanceRepository } from '../../data-access/repositories';
import { StandardServiceBase } from '../../../../shared/utils/standard-service-base';
import { ServiceIntegrationContext } from '../../../../shared/interfaces/service-integration';
import { MessagePayload, QueueType } from '../../../../core/message-queue/types';

export class MaintenanceService extends StandardServiceBase {
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
          serviceName: 'maintenance-service',
          cacheConfig: { defaultTTL: 600, keyPrefix: 'mnt' },
          messageQueueConfig: {
            defaultPriority: 2,
            retryAttempts: 3,
            compliance: { dataClassification: 'INTERNAL', auditRequired: true },
          },
        },
      });
    }
  }

  // ==================== Message Queue Integration ====================

  /**
   * Handle message processing for maintenance operations
   */
  async processMessage(message: MessagePayload): Promise<any> {
    this.markMessageProcessed();

    switch (message.type) {
      case 'CREATE_MAINTENANCE':
        return await this.createMaintenance(message.data);
      case 'UPDATE_MAINTENANCE':
        return await this.updateMaintenance(message.data.id, message.data.updates);
      case 'EMERGENCY_MAINTENANCE_REQUIRED':
        return await this.handleEmergencyMaintenance(message.data);
      case 'SCHEDULE_PREVENTIVE_MAINTENANCE':
        return await this.schedulePreventiveMaintenance(message.data);
      default:
        throw new Error(`Unknown maintenance message type: ${message.type}`);
    }
  }

  /**
   * Get queue types this service handles
   */
  getHandledQueueTypes(): QueueType[] {
    return [QueueType.MAINTENANCE, QueueType.SERVICE, QueueType.ANALYTICS];
  }

  async createMaintenance(
    data: Omit<MaintenanceEntity, 'id' | 'createdDate' | 'modifiedDate'>
  ): Promise<MaintenanceEntity> {
    return this.executeWithMetrics(async () => {
      this.validateMaintenanceData(data);

      const maintenance = await maintenanceRepository.create(data);

      // Cache the maintenance record
      await this.setCached(
        `maintenance:${maintenance.id}`,
        maintenance,
        this.getCacheTTL('maintenance')
      );

      // Send notification about new maintenance
      await this.sendMessage(QueueType.SERVICE_COMMAND_CENTER, 'MAINTENANCE_CREATED', {
        maintenanceId: maintenance.id,
        name: maintenance.name,
        type: 'PREVENTIVE', // default type
        timestamp: new Date(),
      });

      this.logger.info('Maintenance created', {
        maintenanceId: maintenance.id,
        name: maintenance.name,
      });

      return maintenance;
    });
  }

  async getMaintenanceById(id: string): Promise<MaintenanceEntity | null> {
    return await maintenanceRepository.getById(id);
  }

  async updateMaintenance(
    id: string,
    updates: Partial<MaintenanceEntity>
  ): Promise<MaintenanceEntity> {
    const existing = await maintenanceRepository.getById(id);
    if (!existing) {
      throw new Error(`Maintenance with ID ${id} not found`);
    }

    return await maintenanceRepository.update(id, updates);
  }

  async deleteMaintenance(id: string): Promise<void> {
    const existing = await maintenanceRepository.getById(id);
    if (!existing) {
      throw new Error(`Maintenance with ID ${id} not found`);
    }

    await maintenanceRepository.delete(id);
  }

  async getAllMaintenances(): Promise<MaintenanceEntity[]> {
    return await maintenanceRepository.getAll();
  }

  /**
   * Handle emergency maintenance requests from service command center
   */
  async handleEmergencyMaintenance(emergencyData: {
    location: { lat: number; lng: number; address: string };
    description: string;
    severity: string;
    assignedTeam: string[];
  }): Promise<MaintenanceEntity> {
    return this.executeWithMetrics(async () => {
      const maintenanceData = {
        name: `Emergency Maintenance - ${emergencyData.severity}`,
        description: emergencyData.description,
        location: emergencyData.location.address,
        priority: emergencyData.severity === 'CRITICAL' ? 'HIGH' : 'MEDIUM',
        assignedTeam: emergencyData.assignedTeam,
      };

      const maintenance = await this.createMaintenance(maintenanceData as any);

      // Send immediate notification to service command center
      await this.sendMessage(
        QueueType.SERVICE_COMMAND_CENTER,
        'EMERGENCY_MAINTENANCE_SCHEDULED',
        {
          maintenanceId: maintenance.id,
          location: emergencyData.location,
          severity: emergencyData.severity,
          assignedTeam: emergencyData.assignedTeam,
          estimatedCompletion: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours
          timestamp: new Date(),
        },
        { priority: 1 } // Critical priority
      );

      return maintenance;
    });
  }

  /**
   * Schedule preventive maintenance
   */
  async schedulePreventiveMaintenance(scheduleData: {
    assetId: string;
    maintenanceType: string;
    frequency: string;
  }): Promise<MaintenanceEntity> {
    return this.executeWithMetrics(async () => {
      const maintenanceData = {
        name: `Preventive Maintenance - ${scheduleData.maintenanceType}`,
        description: `Scheduled ${scheduleData.frequency} maintenance for asset ${scheduleData.assetId}`,
        assetId: scheduleData.assetId,
        type: 'PREVENTIVE',
        priority: 'MEDIUM',
      };

      return await this.createMaintenance(maintenanceData as any);
    });
  }

  private validateMaintenanceData(
    data: Omit<MaintenanceEntity, 'id' | 'createdDate' | 'modifiedDate'>
  ): void {
    if (!data.name || data.name.trim() === '') {
      throw new Error('Name is required');
    }
  }
}

// Export singleton instance - will be properly initialized with context
export let maintenanceService: MaintenanceService;

// Factory function to create properly initialized service
export function createMaintenanceService(context?: ServiceIntegrationContext): MaintenanceService {
  maintenanceService = new MaintenanceService(context);
  return maintenanceService;
}

// Initialize basic instance for backward compatibility
maintenanceService = new MaintenanceService();
