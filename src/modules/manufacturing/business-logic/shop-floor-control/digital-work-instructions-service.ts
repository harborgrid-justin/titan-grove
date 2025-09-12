/**
 * Digital Work Instructions Service for Shop Floor Excellence
 * Phase 3 Implementation - Digital Manufacturing and Operator Guidance
 */

export interface WorkInstruction {
  instructionId: string;
  operationId: string;
  workCenterId: string;
  itemId: string;
  stepNumber: number;
  title: string;
  description: string;
  instructionType: 'SETUP' | 'OPERATION' | 'QUALITY_CHECK' | 'SAFETY' | 'MAINTENANCE';
  estimatedDuration: number; // minutes
  skillLevelRequired: 'ENTRY' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  safetyRequirements: string[];
  toolsRequired: string[];
  materialsRequired: MaterialRequirement[];
  qualityChecks: QualityCheck[];
  digitalAssets: DigitalAsset[];
  predecessorSteps: string[];
  isActive: boolean;
  lastUpdated: Date;
  version: string;
}

export interface MaterialRequirement {
  materialId: string;
  materialName: string;
  quantity: number;
  unit: string;
  location?: string;
  batchNumberRequired: boolean;
  expirationCheck: boolean;
}

export interface QualityCheck {
  checkId: string;
  checkName: string;
  checkType: 'VISUAL' | 'MEASUREMENT' | 'TEST' | 'SCAN';
  specification: string;
  tolerance?: string;
  frequency: 'EVERY_UNIT' | 'EVERY_LOT' | 'HOURLY' | 'SHIFT_START' | 'SHIFT_END';
  criticalPoint: boolean;
  recordingRequired: boolean;
}

export interface DigitalAsset {
  assetId: string;
  assetType: 'IMAGE' | 'VIDEO' | 'PDF' | 'AR_MODEL' | '3D_MODEL' | 'AUDIO';
  fileName: string;
  filePath: string;
  description: string;
  thumbnailPath?: string;
  duration?: number; // for video/audio
}

export interface WorkInstructionExecution {
  executionId: string;
  workOrderId: string;
  operatorId: string;
  instructionId: string;
  startTime: Date;
  endTime?: Date;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'PAUSED' | 'SKIPPED' | 'FAILED';
  actualDuration?: number;
  qualityResults: QualityResult[];
  notes?: string;
  signature?: string;
  deviceInfo?: DeviceInfo;
}

export interface QualityResult {
  checkId: string;
  result: 'PASS' | 'FAIL' | 'NA';
  measuredValue?: number;
  notes?: string;
  timestamp: Date;
  operatorId: string;
  imageEvidence?: string[];
}

export interface DeviceInfo {
  deviceId: string;
  deviceType: 'TABLET' | 'SMARTPHONE' | 'HMD' | 'WORKSTATION';
  operatingSystem: string;
  appVersion: string;
  location?: {
    workCenterId: string;
    coordinates?: { x: number; y: number; z: number };
  };
}

export interface OperatorGuidance {
  operatorId: string;
  currentInstructions: WorkInstruction[];
  upcomingInstructions: WorkInstruction[];
  skillProfile: OperatorSkillProfile;
  performanceMetrics: OperatorPerformanceMetrics;
  certifications: Certification[];
}

export interface OperatorSkillProfile {
  operatorId: string;
  skillLevel: 'ENTRY' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  certifiedOperations: string[];
  experienceYears: number;
  trainingHours: number;
  lastSkillAssessment: Date;
  strengths: string[];
  improvementAreas: string[];
}

export interface OperatorPerformanceMetrics {
  operatorId: string;
  timeframe: 'SHIFT' | 'DAY' | 'WEEK' | 'MONTH';
  efficiencyPercent: number;
  qualityScore: number;
  safetyIncidents: number;
  instructionsCompleted: number;
  averageTaskTime: number;
  improvementTrend: 'IMPROVING' | 'STABLE' | 'DECLINING';
}

export interface Certification {
  certificationId: string;
  name: string;
  issuedBy: string;
  issuedDate: Date;
  expirationDate: Date;
  status: 'ACTIVE' | 'EXPIRED' | 'SUSPENDED';
  renewalRequired: boolean;
}

/**
 * Digital Work Instructions Service
 * Provides smart, context-aware work instructions with real-time guidance
 */
export class DigitalWorkInstructionsService {
  private workInstructions: Map<string, WorkInstruction> = new Map();
  private executions: Map<string, WorkInstructionExecution> = new Map();
  private operatorProfiles: Map<string, OperatorSkillProfile> = new Map();
  private performanceMetrics: Map<string, OperatorPerformanceMetrics> = new Map();

  constructor() {
    this.initializeDefaultInstructions();
    this.initializeOperatorProfiles();
  }

  /**
   * Initialize default work instructions for common manufacturing operations
   */
  private initializeDefaultInstructions(): void {
    const defaultInstructions: WorkInstruction[] = [
      {
        instructionId: 'WI_CNC_SETUP_001',
        operationId: 'OP_MILLING_001',
        workCenterId: 'CNC_MACHINING_CENTER_01',
        itemId: 'PART_ABC123',
        stepNumber: 1,
        title: 'CNC Machine Setup and Tool Loading',
        description: 'Complete setup procedure for milling operation including tool loading, work holding, and program verification',
        instructionType: 'SETUP',
        estimatedDuration: 45,
        skillLevelRequired: 'INTERMEDIATE',
        safetyRequirements: [
          'Wear safety glasses at all times',
          'Ensure machine is in STOP mode before tool changes',
          'Verify emergency stop functionality',
          'Check coolant levels and flow'
        ],
        toolsRequired: [
          '20mm End Mill - HSS',
          '6mm Drill Bit - Carbide',
          'Digital Calipers',
          'Height Gauge',
          'Tool Presetter'
        ],
        materialsRequired: [
          {
            materialId: 'ALU_6061_T6',
            materialName: 'Aluminum 6061-T6 Block',
            quantity: 1,
            unit: 'EA',
            location: 'RAW_MATERIAL_A1',
            batchNumberRequired: true,
            expirationCheck: false
          }
        ],
        qualityChecks: [
          {
            checkId: 'QC_DIMENSION_001',
            checkName: 'First Article Inspection',
            checkType: 'MEASUREMENT',
            specification: 'All dimensions per drawing DWG-ABC123',
            tolerance: '±0.1mm',
            frequency: 'EVERY_LOT',
            criticalPoint: true,
            recordingRequired: true
          }
        ],
        digitalAssets: [
          {
            assetId: 'IMG_CNC_SETUP_001',
            assetType: 'IMAGE',
            fileName: 'cnc_tool_setup.jpg',
            filePath: '/assets/images/work-instructions/cnc_tool_setup.jpg',
            description: 'Proper tool loading sequence'
          },
          {
            assetId: 'VID_CNC_SAFETY_001',
            assetType: 'VIDEO',
            fileName: 'cnc_safety_procedures.mp4',
            filePath: '/assets/videos/work-instructions/cnc_safety_procedures.mp4',
            description: 'CNC safety procedures and emergency stops',
            duration: 180
          }
        ],
        predecessorSteps: [],
        isActive: true,
        lastUpdated: new Date(),
        version: '1.2'
      },
      {
        instructionId: 'WI_ASM_MAIN_001',
        operationId: 'OP_ASSEMBLY_001',
        workCenterId: 'ASSEMBLY_LINE_01',
        itemId: 'PRODUCT_XYZ789',
        stepNumber: 1,
        title: 'Main Assembly Procedure',
        description: 'Primary assembly sequence for product XYZ789 including component verification and torque specifications',
        instructionType: 'OPERATION',
        estimatedDuration: 25,
        skillLevelRequired: 'ENTRY',
        safetyRequirements: [
          'Ensure ESD protection when handling electronic components',
          'Use proper lifting techniques for heavy components',
          'Verify power disconnect before electrical connections'
        ],
        toolsRequired: [
          'Torque Wrench - 10-50 Nm',
          'Phillips Screwdriver #2',
          'Component Scanner',
          'Digital Multimeter'
        ],
        materialsRequired: [
          {
            materialId: 'COMP_MAIN_PCB',
            materialName: 'Main PCB Assembly',
            quantity: 1,
            unit: 'EA',
            location: 'WIP_ELECTRONICS',
            batchNumberRequired: true,
            expirationCheck: true
          },
          {
            materialId: 'HOUSING_UPPER',
            materialName: 'Upper Housing - Injection Molded',
            quantity: 1,
            unit: 'EA',
            location: 'WIP_PLASTICS',
            batchNumberRequired: true,
            expirationCheck: false
          }
        ],
        qualityChecks: [
          {
            checkId: 'QC_ELECTRICAL_001',
            checkName: 'Electrical Continuity Test',
            checkType: 'TEST',
            specification: 'All circuits within 5% of nominal',
            frequency: 'EVERY_UNIT',
            criticalPoint: true,
            recordingRequired: true
          },
          {
            checkId: 'QC_VISUAL_ASM_001',
            checkName: 'Visual Assembly Check',
            checkType: 'VISUAL',
            specification: 'No gaps, proper alignment, all fasteners tight',
            frequency: 'EVERY_UNIT',
            criticalPoint: false,
            recordingRequired: false
          }
        ],
        digitalAssets: [
          {
            assetId: 'AR_ASSEMBLY_001',
            assetType: 'AR_MODEL',
            fileName: 'assembly_ar_guide.fbx',
            filePath: '/assets/ar/work-instructions/assembly_ar_guide.fbx',
            description: 'AR-guided assembly with component placement'
          }
        ],
        predecessorSteps: [],
        isActive: true,
        lastUpdated: new Date(),
        version: '2.1'
      },
      {
        instructionId: 'WI_QC_FINAL_001',
        operationId: 'OP_FINAL_INSPECTION',
        workCenterId: 'QUALITY_STATION_01',
        itemId: 'PRODUCT_XYZ789',
        stepNumber: 1,
        title: 'Final Quality Inspection',
        description: 'Complete final inspection including functional testing and packaging preparation',
        instructionType: 'QUALITY_CHECK',
        estimatedDuration: 15,
        skillLevelRequired: 'INTERMEDIATE',
        safetyRequirements: [
          'Handle products with care to avoid damage',
          'Use proper ESD protection for electronic testing'
        ],
        toolsRequired: [
          'Automated Test Equipment',
          'Digital Camera for Documentation',
          'Barcode Scanner',
          'Packaging Materials'
        ],
        materialsRequired: [],
        qualityChecks: [
          {
            checkId: 'QC_FUNCTIONAL_001',
            checkName: 'Full Functional Test',
            checkType: 'TEST',
            specification: 'All functions operate within specification',
            frequency: 'EVERY_UNIT',
            criticalPoint: true,
            recordingRequired: true
          },
          {
            checkId: 'QC_COSMETIC_001',
            checkName: 'Cosmetic Inspection',
            checkType: 'VISUAL',
            specification: 'No scratches, dents, or discoloration',
            frequency: 'EVERY_UNIT',
            criticalPoint: false,
            recordingRequired: true
          }
        ],
        digitalAssets: [
          {
            assetId: 'PDF_INSPECTION_001',
            assetType: 'PDF',
            fileName: 'inspection_checklist.pdf',
            filePath: '/assets/documents/work-instructions/inspection_checklist.pdf',
            description: 'Detailed inspection checklist and criteria'
          }
        ],
        predecessorSteps: ['WI_ASM_MAIN_001'],
        isActive: true,
        lastUpdated: new Date(),
        version: '1.0'
      }
    ];

    defaultInstructions.forEach(instruction => {
      this.workInstructions.set(instruction.instructionId, instruction);
    });
  }

  /**
   * Initialize operator skill profiles
   */
  private initializeOperatorProfiles(): void {
    const defaultProfiles: OperatorSkillProfile[] = [
      {
        operatorId: 'OP_001_JOHN_SMITH',
        skillLevel: 'ADVANCED',
        certifiedOperations: ['CNC_MILLING', 'CNC_TURNING', 'QUALITY_INSPECTION'],
        experienceYears: 8,
        trainingHours: 240,
        lastSkillAssessment: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
        strengths: ['Technical troubleshooting', 'Quality consciousness', 'Safety compliance'],
        improvementAreas: ['Digital tool adoption', 'Training others']
      },
      {
        operatorId: 'OP_002_MARY_JONES',
        skillLevel: 'EXPERT',
        certifiedOperations: ['ASSEMBLY', 'QUALITY_INSPECTION', 'TRAINING_DELIVERY'],
        experienceYears: 12,
        trainingHours: 360,
        lastSkillAssessment: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
        strengths: ['Leadership', 'Process optimization', 'Mentoring'],
        improvementAreas: ['Advanced automation systems']
      }
    ];

    defaultProfiles.forEach(profile => {
      this.operatorProfiles.set(profile.operatorId, profile);
    });
  }

  /**
   * Get personalized work instructions for operator based on skill level and workload
   */
  public getPersonalizedInstructions(
    operatorId: string, 
    workCenterId: string,
    maxInstructions: number = 5
  ): OperatorGuidance {
    const operatorProfile = this.operatorProfiles.get(operatorId);
    const performanceMetrics = this.performanceMetrics.get(operatorId);

    // Filter instructions by work center and operator skill level
    const availableInstructions = Array.from(this.workInstructions.values())
      .filter(instruction => 
        instruction.workCenterId === workCenterId &&
        instruction.isActive &&
        this.isOperatorQualified(operatorProfile, instruction)
      );

    // Sort by priority and operator performance
    const prioritizedInstructions = this.prioritizeInstructions(
      availableInstructions, 
      operatorProfile, 
      performanceMetrics
    );

    const currentInstructions = prioritizedInstructions.slice(0, maxInstructions);
    const upcomingInstructions = prioritizedInstructions.slice(maxInstructions, maxInstructions + 3);

    return {
      operatorId,
      currentInstructions,
      upcomingInstructions,
      skillProfile: operatorProfile || this.getDefaultSkillProfile(operatorId),
      performanceMetrics: performanceMetrics || this.getDefaultPerformanceMetrics(operatorId),
      certifications: this.getOperatorCertifications(operatorId)
    };
  }

  /**
   * Check if operator is qualified for specific instruction
   */
  private isOperatorQualified(
    operatorProfile: OperatorSkillProfile | undefined, 
    instruction: WorkInstruction
  ): boolean {
    if (!operatorProfile) return instruction.skillLevelRequired === 'ENTRY';

    const skillLevels = ['ENTRY', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'];
    const operatorSkillIndex = skillLevels.indexOf(operatorProfile.skillLevel);
    const requiredSkillIndex = skillLevels.indexOf(instruction.skillLevelRequired);

    return operatorSkillIndex >= requiredSkillIndex;
  }

  /**
   * Prioritize instructions based on operator capabilities and business priorities
   */
  private prioritizeInstructions(
    instructions: WorkInstruction[],
    operatorProfile: OperatorSkillProfile | undefined,
    performanceMetrics: OperatorPerformanceMetrics | undefined
  ): WorkInstruction[] {
    return instructions.sort((a, b) => {
      let scoreA = 0;
      let scoreB = 0;

      // Priority 1: Critical quality points
      if (a.qualityChecks.some(qc => qc.criticalPoint)) scoreA += 100;
      if (b.qualityChecks.some(qc => qc.criticalPoint)) scoreB += 100;

      // Priority 2: Safety instructions
      if (a.instructionType === 'SAFETY') scoreA += 80;
      if (b.instructionType === 'SAFETY') scoreB += 80;

      // Priority 3: Setup operations (typically done first)
      if (a.instructionType === 'SETUP') scoreA += 60;
      if (b.instructionType === 'SETUP') scoreB += 60;

      // Priority 4: Operator skill match (prefer instructions matching skill level)
      if (operatorProfile) {
        if (a.skillLevelRequired === operatorProfile.skillLevel) scoreA += 40;
        if (b.skillLevelRequired === operatorProfile.skillLevel) scoreB += 40;
      }

      // Priority 5: Estimated duration (shorter tasks first for better workflow)
      scoreA += (60 - Math.min(a.estimatedDuration, 60)); // Max bonus of 60
      scoreB += (60 - Math.min(b.estimatedDuration, 60));

      return scoreB - scoreA; // Higher score first
    });
  }

  /**
   * Start work instruction execution
   */
  public startInstructionExecution(
    workOrderId: string,
    operatorId: string,
    instructionId: string,
    deviceInfo?: DeviceInfo
  ): WorkInstructionExecution {
    const execution: WorkInstructionExecution = {
      executionId: `EXEC_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      workOrderId,
      operatorId,
      instructionId,
      startTime: new Date(),
      status: 'IN_PROGRESS',
      qualityResults: [],
      deviceInfo
    };

    this.executions.set(execution.executionId, execution);
    return execution;
  }

  /**
   * Complete work instruction execution with results
   */
  public completeInstructionExecution(
    executionId: string,
    qualityResults: QualityResult[],
    notes?: string,
    signature?: string
  ): WorkInstructionExecution | null {
    const execution = this.executions.get(executionId);
    if (!execution) return null;

    execution.endTime = new Date();
    execution.status = 'COMPLETED';
    execution.actualDuration = Math.round(
      (execution.endTime.getTime() - execution.startTime.getTime()) / (1000 * 60)
    );
    execution.qualityResults = qualityResults;
    execution.notes = notes;
    execution.signature = signature;

    // Update operator performance metrics
    this.updateOperatorPerformance(execution);

    return execution;
  }

  /**
   * Record quality check result during instruction execution
   */
  public recordQualityCheck(
    executionId: string,
    qualityResult: QualityResult
  ): boolean {
    const execution = this.executions.get(executionId);
    if (!execution) return false;

    execution.qualityResults.push(qualityResult);
    
    // If this is a critical quality check failure, flag the execution
    const instruction = this.workInstructions.get(execution.instructionId);
    if (instruction) {
      const qualityCheck = instruction.qualityChecks.find(qc => qc.checkId === qualityResult.checkId);
      if (qualityCheck?.criticalPoint && qualityResult.result === 'FAIL') {
        execution.status = 'FAILED';
        
        // Trigger quality alert
        this.triggerQualityAlert(execution, qualityResult);
      }
    }

    return true;
  }

  /**
   * Update operator performance metrics based on completed execution
   */
  private updateOperatorPerformance(execution: WorkInstructionExecution): void {
    const instruction = this.workInstructions.get(execution.instructionId);
    if (!instruction || !execution.actualDuration) return;

    let metrics = this.performanceMetrics.get(execution.operatorId);
    if (!metrics) {
      metrics = this.getDefaultPerformanceMetrics(execution.operatorId);
      this.performanceMetrics.set(execution.operatorId, metrics);
    }

    // Calculate efficiency (actual vs. estimated time)
    const efficiencyRatio = instruction.estimatedDuration / execution.actualDuration;
    metrics.efficiencyPercent = Math.round(
      (metrics.efficiencyPercent * 0.9) + (Math.min(efficiencyRatio * 100, 150) * 0.1)
    );

    // Calculate quality score (percentage of quality checks passed)
    const totalQualityChecks = execution.qualityResults.length;
    const passedQualityChecks = execution.qualityResults.filter(qr => qr.result === 'PASS').length;
    const qualityScore = totalQualityChecks > 0 ? (passedQualityChecks / totalQualityChecks) * 100 : 100;
    
    metrics.qualityScore = Math.round((metrics.qualityScore * 0.9) + (qualityScore * 0.1));
    metrics.instructionsCompleted += 1;
    
    // Update average task time
    metrics.averageTaskTime = Math.round(
      (metrics.averageTaskTime * 0.9) + (execution.actualDuration * 0.1)
    );

    // Determine improvement trend
    const previousEfficiency = metrics.efficiencyPercent;
    if (efficiencyRatio > 1.1) {
      metrics.improvementTrend = 'IMPROVING';
    } else if (efficiencyRatio < 0.9) {
      metrics.improvementTrend = 'DECLINING';
    } else {
      metrics.improvementTrend = 'STABLE';
    }
  }

  /**
   * Trigger quality alert for failed critical quality checks
   */
  private triggerQualityAlert(execution: WorkInstructionExecution, qualityResult: QualityResult): void {
    const instruction = this.workInstructions.get(execution.instructionId);
    const qualityCheck = instruction?.qualityChecks.find(qc => qc.checkId === qualityResult.checkId);

    console.log(`🚨 QUALITY ALERT: Critical quality check failed`);
    console.log(`   Work Order: ${execution.workOrderId}`);
    console.log(`   Operator: ${execution.operatorId}`);
    console.log(`   Instruction: ${instruction?.title}`);
    console.log(`   Failed Check: ${qualityCheck?.checkName}`);
    console.log(`   Notes: ${qualityResult.notes || 'No additional notes'}`);
  }

  /**
   * Get default skill profile for new operators
   */
  private getDefaultSkillProfile(operatorId: string): OperatorSkillProfile {
    return {
      operatorId,
      skillLevel: 'ENTRY',
      certifiedOperations: [],
      experienceYears: 0,
      trainingHours: 0,
      lastSkillAssessment: new Date(),
      strengths: [],
      improvementAreas: ['All areas - new operator']
    };
  }

  /**
   * Get default performance metrics for new operators
   */
  private getDefaultPerformanceMetrics(operatorId: string): OperatorPerformanceMetrics {
    return {
      operatorId,
      timeframe: 'SHIFT',
      efficiencyPercent: 85,
      qualityScore: 95,
      safetyIncidents: 0,
      instructionsCompleted: 0,
      averageTaskTime: 30,
      improvementTrend: 'STABLE'
    };
  }

  /**
   * Get operator certifications (simulated data)
   */
  private getOperatorCertifications(operatorId: string): Certification[] {
    // In real implementation, this would query certification database
    return [
      {
        certificationId: 'CERT_SAFETY_001',
        name: 'Manufacturing Safety Certification',
        issuedBy: 'Safety Institute',
        issuedDate: new Date(2024, 0, 15),
        expirationDate: new Date(2025, 0, 15),
        status: 'ACTIVE',
        renewalRequired: true
      }
    ];
  }

  /**
   * Get work instruction by ID
   */
  public getWorkInstruction(instructionId: string): WorkInstruction | null {
    return this.workInstructions.get(instructionId) || null;
  }

  /**
   * Get execution history for operator
   */
  public getOperatorExecutionHistory(
    operatorId: string, 
    limit: number = 20
  ): WorkInstructionExecution[] {
    return Array.from(this.executions.values())
      .filter(execution => execution.operatorId === operatorId)
      .sort((a, b) => b.startTime.getTime() - a.startTime.getTime())
      .slice(0, limit);
  }

  /**
   * Get work center performance summary
   */
  public getWorkCenterPerformanceSummary(workCenterId: string): {
    totalInstructions: number;
    completedInstructions: number;
    avgCompletionTime: number;
    qualityScore: number;
    efficiencyScore: number;
    activeExecutions: number;
  } {
    const workCenterInstructions = Array.from(this.workInstructions.values())
      .filter(instruction => instruction.workCenterId === workCenterId);

    const workCenterExecutions = Array.from(this.executions.values())
      .filter(execution => {
        const instruction = this.workInstructions.get(execution.instructionId);
        return instruction?.workCenterId === workCenterId;
      });

    const completedExecutions = workCenterExecutions.filter(e => e.status === 'COMPLETED');
    const activeExecutions = workCenterExecutions.filter(e => e.status === 'IN_PROGRESS');

    const avgCompletionTime = completedExecutions.length > 0
      ? Math.round(completedExecutions.reduce((sum, e) => sum + (e.actualDuration || 0), 0) / completedExecutions.length)
      : 0;

    // Calculate quality score across all completed executions
    const allQualityResults = completedExecutions.flatMap(e => e.qualityResults);
    const qualityScore = allQualityResults.length > 0
      ? Math.round((allQualityResults.filter(qr => qr.result === 'PASS').length / allQualityResults.length) * 100)
      : 100;

    // Calculate efficiency score (estimated vs actual time)
    const efficiencyScore = completedExecutions.length > 0
      ? Math.round(completedExecutions.reduce((sum, execution) => {
          const instruction = this.workInstructions.get(execution.instructionId);
          if (instruction && execution.actualDuration) {
            return sum + Math.min((instruction.estimatedDuration / execution.actualDuration) * 100, 150);
          }
          return sum + 100;
        }, 0) / completedExecutions.length)
      : 100;

    return {
      totalInstructions: workCenterInstructions.length,
      completedInstructions: completedExecutions.length,
      avgCompletionTime,
      qualityScore,
      efficiencyScore,
      activeExecutions: activeExecutions.length
    };
  }
}