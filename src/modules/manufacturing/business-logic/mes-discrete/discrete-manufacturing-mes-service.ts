/**
 * Manufacturing Execution System for Discrete Manufacturing
 * Oracle EBS competitive implementation focusing on shop floor operator and supervisor productivity
 */

export interface WorkStation {
  id: string;
  stationCode: string;
  stationName: string;
  workCenterId: string;
  operatorId?: string;
  status: 'IDLE' | 'ACTIVE' | 'SETUP' | 'MAINTENANCE' | 'DOWN';
  currentWorkOrderId?: string;
  currentOperationId?: string;
  efficiency: number;
  utilizationRate: number;
  lastStatusUpdate: Date;
}

export interface ShopFloorOperation {
  id: string;
  operationNumber: number;
  workOrderId: string;
  workStationId: string;
  operatorId: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD' | 'REJECTED';
  scheduledStartTime: Date;
  scheduledEndTime: Date;
  actualStartTime?: Date;
  actualEndTime?: Date;
  standardLaborHours: number;
  actualLaborHours?: number;
  efficiency: number;
  qualityResults?: QualityResult[];
  materialConsumption: MaterialConsumption[];
}

export interface QualityResult {
  checkPointId: string;
  checkPointName: string;
  result: 'PASS' | 'FAIL' | 'WARNING';
  value?: number;
  specification?: string;
  inspectorId: string;
  timestamp: Date;
  notes?: string;
}

export interface MaterialConsumption {
  materialId: string;
  materialCode: string;
  plannedQuantity: number;
  actualQuantity: number;
  variance: number;
  warehouseId: string;
  lotNumber?: string;
  serialNumbers?: string[];
  timestamp: Date;
}

export interface OperatorTask {
  taskId: string;
  operatorId: string;
  operationId: string;
  taskType: 'PRODUCTION' | 'SETUP' | 'QUALITY_CHECK' | 'MATERIAL_MOVE' | 'MAINTENANCE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  instructions: string;
  estimatedDuration: number;
  status: 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  assignedDate: Date;
  startedDate?: Date;
  completedDate?: Date;
  notes?: string;
}

export interface ProductionMetrics {
  workStationId: string;
  date: Date;
  plannedProduction: number;
  actualProduction: number;
  efficiency: number;
  quality: number;
  availability: number;
  oee: number; // Overall Equipment Effectiveness
  downtimeMinutes: number;
  scrapQuantity: number;
  reworkQuantity: number;
}

/**
 * Manufacturing Execution System for Discrete Manufacturing
 * Enhances shop floor productivity with rich operator and supervisor capabilities
 */
export class DiscreteManufacturingMESService {

  // ================================
  // OPERATOR PRODUCTIVITY FEATURES
  // ================================

  /**
   * Start production operation
   */
  async startOperation(
    operationId: string,
    operatorId: string,
    workStationId: string
  ): Promise<{
    status: 'STARTED' | 'ERROR';
    operationDetails: ShopFloorOperation;
    taskList: OperatorTask[];
    qualityCheckPoints: QualityResult[];
    estimatedCompletion: Date;
  }> {
    console.log(`Starting operation ${operationId} by operator ${operatorId} at station ${workStationId}`);
    
    const operation: ShopFloorOperation = {
      id: operationId,
      operationNumber: 10,
      workOrderId: `wo_${operationId}`,
      workStationId,
      operatorId,
      status: 'IN_PROGRESS',
      scheduledStartTime: new Date(),
      scheduledEndTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours
      actualStartTime: new Date(),
      standardLaborHours: 2.0,
      efficiency: 1.0,
      materialConsumption: []
    };

    const taskList: OperatorTask[] = [
      {
        taskId: `task_${Date.now()}_1`,
        operatorId,
        operationId,
        taskType: 'SETUP',
        priority: 'HIGH',
        instructions: 'Verify tooling and setup workstation',
        estimatedDuration: 15,
        status: 'ASSIGNED',
        assignedDate: new Date()
      },
      {
        taskId: `task_${Date.now()}_2`,
        operatorId,
        operationId,
        taskType: 'PRODUCTION',
        priority: 'HIGH',
        instructions: 'Execute production operation per work instructions',
        estimatedDuration: 90,
        status: 'ASSIGNED',
        assignedDate: new Date()
      }
    ];

    return {
      status: 'STARTED',
      operationDetails: operation,
      taskList,
      qualityCheckPoints: [],
      estimatedCompletion: operation.scheduledEndTime
    };
  }

  /**
   * Record production data
   */
  async recordProductionData(
    operationId: string,
    productionData: {
      quantityProduced: number;
      quantityRejected: number;
      scrapQuantity: number;
      materialUsed: MaterialConsumption[];
      qualityResults: QualityResult[];
      downtimeMinutes?: number;
      downtimeReason?: string;
    }
  ): Promise<{
    recorded: boolean;
    metrics: ProductionMetrics;
    alerts: Array<{
      alertType: 'QUALITY' | 'EFFICIENCY' | 'MATERIAL' | 'SCHEDULE';
      message: string;
      severity: 'INFO' | 'WARNING' | 'CRITICAL';
    }>;
  }> {
    console.log(`Recording production data for operation ${operationId}`);
    
    const metrics: ProductionMetrics = {
      workStationId: 'WS001',
      date: new Date(),
      plannedProduction: 100,
      actualProduction: productionData.quantityProduced,
      efficiency: (productionData.quantityProduced / 100) * 100,
      quality: ((productionData.quantityProduced - productionData.quantityRejected) / productionData.quantityProduced) * 100,
      availability: productionData.downtimeMinutes ? ((480 - productionData.downtimeMinutes) / 480) * 100 : 100,
      oee: 0, // Will be calculated
      downtimeMinutes: productionData.downtimeMinutes || 0,
      scrapQuantity: productionData.scrapQuantity,
      reworkQuantity: productionData.quantityRejected
    };

    // Calculate OEE (Overall Equipment Effectiveness)
    metrics.oee = (metrics.availability / 100) * (metrics.efficiency / 100) * (metrics.quality / 100) * 100;

    const alerts = [];
    
    // Generate alerts for performance issues
    if (metrics.efficiency < 80) {
      alerts.push({
        alertType: 'EFFICIENCY' as const,
        message: `Efficiency below target: ${metrics.efficiency.toFixed(1)}%`,
        severity: 'WARNING' as const
      });
    }
    
    if (metrics.quality < 95) {
      alerts.push({
        alertType: 'QUALITY' as const,
        message: `Quality below target: ${metrics.quality.toFixed(1)}%`,
        severity: 'CRITICAL' as const
      });
    }

    return {
      recorded: true,
      metrics,
      alerts
    };
  }

  /**
   * Get real-time shop floor dashboard
   */
  async getShopFloorDashboard(workCenterId?: string): Promise<{
    workStations: WorkStation[];
    activeOperations: ShopFloorOperation[];
    productionMetrics: {
      totalOEE: number;
      totalEfficiency: number;
      totalQuality: number;
      totalAvailability: number;
    };
    alerts: Array<{
      alertType: string;
      message: string;
      severity: string;
      workStationId: string;
      timestamp: Date;
    }>;
    kpis: {
      onTimeProduction: number;
      firstPassYield: number;
      cycleTimeVariance: number;
      setupTimeReduction: number;
    };
  }> {
    console.log(`Getting shop floor dashboard for work center: ${workCenterId}`);
    
    const workStations: WorkStation[] = [
      {
        id: 'ws001',
        stationCode: 'ASSEMBLY_001',
        stationName: 'Main Assembly Station',
        workCenterId: workCenterId || 'WC001',
        operatorId: 'OP001',
        status: 'ACTIVE',
        currentWorkOrderId: 'WO12345',
        currentOperationId: 'OP10',
        efficiency: 87.5,
        utilizationRate: 92.3,
        lastStatusUpdate: new Date()
      },
      {
        id: 'ws002',
        stationCode: 'TEST_001',
        stationName: 'Quality Testing Station',
        workCenterId: workCenterId || 'WC001',
        operatorId: 'OP002',
        status: 'IDLE',
        efficiency: 94.2,
        utilizationRate: 78.6,
        lastStatusUpdate: new Date()
      }
    ];

    return {
      workStations,
      activeOperations: [],
      productionMetrics: {
        totalOEE: 82.4,
        totalEfficiency: 89.1,
        totalQuality: 96.8,
        totalAvailability: 95.7
      },
      alerts: [
        {
          alertType: 'EFFICIENCY',
          message: 'Station ASSEMBLY_001 efficiency below target',
          severity: 'WARNING',
          workStationId: 'ws001',
          timestamp: new Date()
        }
      ],
      kpis: {
        onTimeProduction: 94.2,
        firstPassYield: 96.8,
        cycleTimeVariance: 8.3,
        setupTimeReduction: 23.5
      }
    };
  }

  /**
   * Supervisor productivity tools
   */
  async getSupervisorDashboard(supervisorId: string): Promise<{
    managedWorkCenters: string[];
    operatorPerformance: Array<{
      operatorId: string;
      operatorName: string;
      efficiency: number;
      quality: number;
      attendance: number;
      skillLevel: number;
      tasksCompleted: number;
      recommendations: string[];
    }>;
    productionSummary: {
      totalUnitsProduced: number;
      planAttainment: number;
      qualityRate: number;
      issuesRequiringAttention: number;
    };
    actionItems: Array<{
      priority: 'HIGH' | 'MEDIUM' | 'LOW';
      description: string;
      assignedTo: string;
      dueDate: Date;
    }>;
  }> {
    console.log(`Getting supervisor dashboard for ${supervisorId}`);
    
    return {
      managedWorkCenters: ['WC001', 'WC002', 'WC003'],
      operatorPerformance: [
        {
          operatorId: 'OP001',
          operatorName: 'John Smith',
          efficiency: 87.5,
          quality: 96.2,
          attendance: 98.5,
          skillLevel: 4.2,
          tasksCompleted: 23,
          recommendations: ['Consider advanced training for CNC operations']
        },
        {
          operatorId: 'OP002',
          operatorName: 'Jane Doe',
          efficiency: 94.2,
          quality: 98.8,
          attendance: 100.0,
          skillLevel: 4.8,
          tasksCompleted: 27,
          recommendations: ['Ready for team lead promotion']
        }
      ],
      productionSummary: {
        totalUnitsProduced: 1247,
        planAttainment: 102.3,
        qualityRate: 97.1,
        issuesRequiringAttention: 3
      },
      actionItems: [
        {
          priority: 'HIGH',
          description: 'Address quality issue at Station ASSEMBLY_001',
          assignedTo: 'OP001',
          dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000)
        }
      ]
    };
  }

  // ================================
  // WORKFLOW MANAGEMENT
  // ================================

  /**
   * Manage daily task assignments
   */
  async assignDailyTasks(
    workCenterId: string,
    date: Date
  ): Promise<Array<{
    operatorId: string;
    tasks: OperatorTask[];
    workload: number; // percentage
    skillMatch: number; // percentage
    estimatedCompletionTime: Date;
  }>> {
    console.log(`Assigning daily tasks for work center ${workCenterId} on ${date.toDateString()}`);
    
    return [
      {
        operatorId: 'OP001',
        tasks: [
          {
            taskId: 'task_001',
            operatorId: 'OP001',
            operationId: 'op_001',
            taskType: 'PRODUCTION',
            priority: 'HIGH',
            instructions: 'Complete assembly operation for Work Order WO12345',
            estimatedDuration: 120,
            status: 'ASSIGNED',
            assignedDate: new Date()
          }
        ],
        workload: 95.0,
        skillMatch: 92.5,
        estimatedCompletionTime: new Date(Date.now() + 8 * 60 * 60 * 1000)
      }
    ];
  }
}

// Export service instance
export const discreteManufacturingMESService = new DiscreteManufacturingMESService();