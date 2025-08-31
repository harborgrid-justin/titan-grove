/**
 * Project Manufacturing Service
 * Oracle EBS competitive implementation to control broad range of product designs 
 * and quickly respond to changes that impact contract planning, costing, and execution
 */

export interface ManufacturingProject {
  projectId: string;
  projectNumber: string;
  projectName: string;
  projectType: 'ENGINEER_TO_ORDER' | 'CUSTOM_MANUFACTURING' | 'CONTRACT_MANUFACTURING' | 'PROTOTYPE_DEVELOPMENT';
  customerId: string;
  contractId?: string;
  status: 'PLANNING' | 'ENGINEERING' | 'MANUFACTURING' | 'TESTING' | 'DELIVERY' | 'COMPLETED' | 'CANCELLED';
  productDesigns: ProductDesign[];
  projectPlan: ProjectPlan;
  costManagement: ProjectCostManagement;
  changeManagement: ChangeManagement;
  qualityPlan: ProjectQualityPlan;
  deliverables: ProjectDeliverable[];
  timeline: ProjectTimeline;
  resources: ProjectResource[];
  risks: ProjectRisk[];
}

export interface ProductDesign {
  designId: string;
  designVersion: string;
  productName: string;
  specifications: DesignSpecification[];
  engineeringDrawings: EngineeringDrawing[];
  bomStructure: ProjectBOM;
  routingInstructions: ProjectRouting;
  testRequirements: TestRequirement[];
  approvalStatus: 'DRAFT' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
  approvedBy?: string;
  approvalDate?: Date;
}

export interface DesignSpecification {
  specId: string;
  specType: 'FUNCTIONAL' | 'PERFORMANCE' | 'REGULATORY' | 'AESTHETIC' | 'SAFETY';
  parameter: string;
  value: any;
  unit?: string;
  tolerance?: { min: any; max: any };
  testMethod?: string;
  criticalSpec: boolean;
}

export interface EngineeringDrawing {
  drawingId: string;
  drawingNumber: string;
  title: string;
  revision: string;
  fileFormat: 'DWG' | 'PDF' | 'STEP' | 'IGES';
  filePath: string;
  createdBy: string;
  createdDate: Date;
  approvedBy?: string;
  approvalDate?: Date;
}

export interface ProjectBOM {
  bomId: string;
  bomVersion: string;
  components: ProjectBOMComponent[];
  totalMaterialCost: number;
  complexity: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';
  customComponents: number;
  standardComponents: number;
  makeVsBuyAnalysis: MakeVsBuyAnalysis[];
}

export interface ProjectBOMComponent {
  componentId: string;
  componentCode: string;
  description: string;
  quantity: number;
  unit: string;
  unitCost: number;
  totalCost: number;
  leadTime: number;
  availability: 'STANDARD' | 'CUSTOM' | 'LONG_LEAD' | 'OBSOLETE';
  suppliers: string[];
  makeOrBuy: 'MAKE' | 'BUY' | 'EITHER';
  criticalComponent: boolean;
}

export interface ProjectRouting {
  routingId: string;
  routingVersion: string;
  operations: ProjectOperation[];
  totalLaborHours: number;
  totalLaborCost: number;
  criticalPath: string[];
  bottleneckOperations: string[];
}

export interface ProjectOperation {
  operationId: string;
  operationNumber: number;
  operationCode: string;
  description: string;
  workCenter: string;
  setupTime: number;
  runTime: number;
  laborRate: number;
  skillRequired: string;
  tooling: string[];
  customTooling: boolean;
  qualityChecks: string[];
}

export interface ProjectPlan {
  planId: string;
  phases: ProjectPhase[];
  milestones: ProjectMilestone[];
  dependencies: ProjectDependency[];
  criticalPath: string[];
  totalDuration: number;
  bufferTime: number;
}

export interface ProjectPhase {
  phaseId: string;
  phaseName: string;
  description: string;
  plannedStartDate: Date;
  plannedEndDate: Date;
  actualStartDate?: Date;
  actualEndDate?: Date;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED' | 'ON_HOLD';
  percentComplete: number;
  deliverables: string[];
  resources: string[];
}

export interface ProjectMilestone {
  milestoneId: string;
  milestoneName: string;
  description: string;
  plannedDate: Date;
  actualDate?: Date;
  status: 'PENDING' | 'ACHIEVED' | 'MISSED' | 'AT_RISK';
  criticalMilestone: boolean;
  dependencies: string[];
}

export interface ProjectCostManagement {
  budgetedCost: number;
  actualCost: number;
  commitments: number;
  forecastCost: number;
  variance: number;
  variancePercent: number;
  costBreakdown: {
    engineering: number;
    materials: number;
    labor: number;
    tooling: number;
    testing: number;
    overhead: number;
  };
  costTrends: Array<{
    period: Date;
    budgeted: number;
    actual: number;
    variance: number;
  }>;
}

export interface ChangeManagement {
  changeOrders: ChangeOrder[];
  totalChangeValue: number;
  changeImpact: {
    costImpact: number;
    scheduleImpact: number;
    scopeImpact: string[];
  };
  approvalProcess: ChangeApprovalProcess;
}

export interface ChangeOrder {
  changeOrderId: string;
  changeOrderNumber: string;
  description: string;
  reason: string;
  requestedBy: string;
  requestDate: Date;
  impact: {
    cost: number;
    schedule: number; // days
    scope: string[];
    risk: 'LOW' | 'MEDIUM' | 'HIGH';
  };
  status: 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'IMPLEMENTED';
  approvals: ChangeApproval[];
}

// Additional supporting interfaces
export interface TestRequirement { testId: string; testType: string; }
export interface MakeVsBuyAnalysis { componentId: string; recommendation: string; }
export interface ProjectDependency { dependencyId: string; predecessor: string; }
export interface ProjectTimeline { startDate: Date; endDate: Date; }
export interface ProjectResource { resourceId: string; resourceType: string; }
export interface ProjectRisk { riskId: string; riskType: string; }
export interface ProjectQualityPlan { planId: string; qualityGates: string[]; }
export interface ProjectDeliverable { deliverableId: string; name: string; }
export interface ChangeApprovalProcess { steps: string[]; approvers: string[]; }
export interface ChangeApproval { approver: string; decision: string; }

/**
 * Project Manufacturing Service
 * Control broad range of product designs and respond to changes
 */
export class ProjectManufacturingService {

  // ================================
  // PROJECT MANAGEMENT
  // ================================

  /**
   * Create manufacturing project
   */
  async createManufacturingProject(
    projectData: {
      projectName: string;
      projectType: string;
      customerId: string;
      productDesigns: any[];
      targetDeliveryDate: Date;
    }
  ): Promise<ManufacturingProject> {
    const projectId = `mp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const projectNumber = `MP${Date.now().toString().slice(-6)}`;
    
    console.log(`Creating manufacturing project: ${projectNumber}`);
    
    const project: ManufacturingProject = {
      projectId,
      projectNumber,
      projectName: projectData.projectName,
      projectType: projectData.projectType as any,
      customerId: projectData.customerId,
      status: 'PLANNING',
      productDesigns: projectData.productDesigns.map((design, index) => ({
        designId: `design_${index + 1}`,
        designVersion: '1.0',
        productName: design.name || `Product Design ${index + 1}`,
        specifications: [],
        engineeringDrawings: [],
        bomStructure: {
          bomId: `bom_${projectId}_${index + 1}`,
          bomVersion: '1.0',
          components: [],
          totalMaterialCost: 0,
          complexity: 'MEDIUM',
          customComponents: 0,
          standardComponents: 0,
          makeVsBuyAnalysis: []
        },
        routingInstructions: {
          routingId: `routing_${projectId}_${index + 1}`,
          routingVersion: '1.0',
          operations: [],
          totalLaborHours: 0,
          totalLaborCost: 0,
          criticalPath: [],
          bottleneckOperations: []
        },
        testRequirements: [],
        approvalStatus: 'DRAFT'
      })),
      projectPlan: {
        planId: `plan_${projectId}`,
        phases: [
          {
            phaseId: 'phase_001',
            phaseName: 'Engineering Design',
            description: 'Complete product design and engineering',
            plannedStartDate: new Date(),
            plannedEndDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
            status: 'NOT_STARTED',
            percentComplete: 0,
            deliverables: ['Engineering drawings', 'BOM', 'Routing'],
            resources: ['ENGINEER_001', 'DESIGNER_001']
          },
          {
            phaseId: 'phase_002',
            phaseName: 'Manufacturing',
            description: 'Production and assembly',
            plannedStartDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
            plannedEndDate: projectData.targetDeliveryDate,
            status: 'NOT_STARTED',
            percentComplete: 0,
            deliverables: ['Finished products', 'Quality certificates'],
            resources: ['PRODUCTION_TEAM']
          }
        ],
        milestones: [
          {
            milestoneId: 'milestone_001',
            milestoneName: 'Design Approval',
            description: 'Customer approval of final design',
            plannedDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
            status: 'PENDING',
            criticalMilestone: true,
            dependencies: ['phase_001']
          }
        ],
        dependencies: [],
        criticalPath: ['phase_001', 'phase_002'],
        totalDuration: Math.ceil((projectData.targetDeliveryDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000)),
        bufferTime: 5
      },
      costManagement: {
        budgetedCost: 125000,
        actualCost: 0,
        commitments: 0,
        forecastCost: 125000,
        variance: 0,
        variancePercent: 0,
        costBreakdown: {
          engineering: 35000,
          materials: 45000,
          labor: 25000,
          tooling: 10000,
          testing: 5000,
          overhead: 5000
        },
        costTrends: []
      },
      changeManagement: {
        changeOrders: [],
        totalChangeValue: 0,
        changeImpact: {
          costImpact: 0,
          scheduleImpact: 0,
          scopeImpact: []
        },
        approvalProcess: {
          steps: ['Technical Review', 'Cost Analysis', 'Customer Approval'],
          approvers: ['TECHNICAL_MANAGER', 'PROJECT_MANAGER', 'CUSTOMER']
        }
      },
      qualityPlan: { planId: 'qp_001', qualityGates: [] },
      deliverables: [],
      timeline: { startDate: new Date(), endDate: projectData.targetDeliveryDate },
      resources: [],
      risks: []
    };

    return project;
  }

  /**
   * Manage project change orders
   */
  async createChangeOrder(
    projectId: string,
    changeData: {
      description: string;
      reason: string;
      requestedBy: string;
      impact: {
        cost: number;
        schedule: number;
        scope: string[];
      };
    }
  ): Promise<ChangeOrder> {
    const changeOrderId = `co_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const changeOrderNumber = `CO${Date.now().toString().slice(-6)}`;
    
    console.log(`Creating change order: ${changeOrderNumber} for project ${projectId}`);
    
    const changeOrder: ChangeOrder = {
      changeOrderId,
      changeOrderNumber,
      description: changeData.description,
      reason: changeData.reason,
      requestedBy: changeData.requestedBy,
      requestDate: new Date(),
      impact: {
        cost: changeData.impact.cost,
        schedule: changeData.impact.schedule,
        scope: changeData.impact.scope,
        risk: changeData.impact.cost > 10000 || changeData.impact.schedule > 7 ? 'HIGH' : 'MEDIUM'
      },
      status: 'DRAFT',
      approvals: []
    };

    return changeOrder;
  }

  /**
   * Track project performance
   */
  async trackProjectPerformance(projectId: string): Promise<{
    schedulePerformance: {
      plannedProgress: number;
      actualProgress: number;
      scheduleVariance: number;
      criticalPathStatus: 'ON_TRACK' | 'AT_RISK' | 'DELAYED';
    };
    costPerformance: {
      budgetedCost: number;
      actualCost: number;
      costVariance: number;
      costPerformanceIndex: number;
      earnedValue: number;
    };
    qualityPerformance: {
      qualityGatesPassed: number;
      totalQualityGates: number;
      defectRate: number;
      reworkRate: number;
    };
    riskStatus: {
      totalRisks: number;
      highRisks: number;
      mitigatedRisks: number;
      newRisks: number;
    };
    recommendations: string[];
  }> {
    console.log(`Tracking performance for project ${projectId}`);
    
    return {
      schedulePerformance: {
        plannedProgress: 65.0,
        actualProgress: 58.5,
        scheduleVariance: -6.5,
        criticalPathStatus: 'AT_RISK'
      },
      costPerformance: {
        budgetedCost: 125000,
        actualCost: 98500,
        costVariance: -26500,
        costPerformanceIndex: 1.27,
        earnedValue: 73125
      },
      qualityPerformance: {
        qualityGatesPassed: 3,
        totalQualityGates: 5,
        defectRate: 1.2,
        reworkRate: 0.8
      },
      riskStatus: {
        totalRisks: 8,
        highRisks: 2,
        mitigatedRisks: 4,
        newRisks: 1
      },
      recommendations: [
        'Focus resources on critical path activities',
        'Implement risk mitigation for high-priority risks',
        'Consider schedule compression techniques'
      ]
    };
  }

  /**
   * Respond quickly to design changes
   */
  async processDesignChange(
    projectId: string,
    designId: string,
    changeData: {
      changedElements: string[];
      impactAnalysis: any;
      newRequirements: any[];
    }
  ): Promise<{
    changeImpactAnalysis: {
      bomChanges: Array<{
        component: string;
        changeType: 'ADD' | 'REMOVE' | 'MODIFY';
        costImpact: number;
        leadTimeImpact: number;
      }>;
      routingChanges: Array<{
        operation: string;
        changeType: 'ADD' | 'REMOVE' | 'MODIFY';
        timeImpact: number;
        costImpact: number;
      }>;
      testingChanges: Array<{
        test: string;
        changeType: 'ADD' | 'REMOVE' | 'MODIFY';
        effort: number;
      }>;
    };
    totalImpact: {
      costChange: number;
      scheduleChange: number;
      riskChange: 'INCREASE' | 'DECREASE' | 'NO_CHANGE';
    };
    recommendedActions: string[];
    approvalRequired: boolean;
  }> {
    console.log(`Processing design change for project ${projectId}, design ${designId}`);
    
    return {
      changeImpactAnalysis: {
        bomChanges: [
          {
            component: 'Component A',
            changeType: 'MODIFY',
            costImpact: 1500,
            leadTimeImpact: 3
          }
        ],
        routingChanges: [
          {
            operation: 'Assembly',
            changeType: 'MODIFY',
            timeImpact: 2.5,
            costImpact: 875
          }
        ],
        testingChanges: [
          {
            test: 'Performance Test',
            changeType: 'ADD',
            effort: 16
          }
        ]
      },
      totalImpact: {
        costChange: 2375,
        scheduleChange: 5,
        riskChange: 'INCREASE'
      },
      recommendedActions: [
        'Update project budget to reflect changes',
        'Communicate schedule impact to customer',
        'Implement additional risk mitigation measures'
      ],
      approvalRequired: true
    };
  }
}

// Export service instance
export const projectManufacturingService = new ProjectManufacturingService();