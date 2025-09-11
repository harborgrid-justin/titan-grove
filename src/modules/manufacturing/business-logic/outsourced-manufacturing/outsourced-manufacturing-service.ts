/**
 * Outsourced Manufacturing Service
 * Oracle EBS competitive implementation for modeling industry standard outsourced manufacturing business flows
 */

export interface OutsourcedManufacturingContract {
  contractId: string;
  contractNumber: string;
  supplierId: string;
  supplierName: string;
  contractType: 'FULL_OUTSOURCE' | 'PARTIAL_OUTSOURCE' | 'CO_MANUFACTURING' | 'TOLL_MANUFACTURING';
  products: OutsourcedProduct[];
  terms: ContractTerms;
  qualityAgreements: QualityAgreement[];
  deliveryTerms: DeliveryTerms;
  pricingStructure: OutsourcingPricingStructure;
  status: 'DRAFT' | 'NEGOTIATION' | 'ACTIVE' | 'SUSPENDED' | 'EXPIRED';
  effectiveDate: Date;
  expirationDate: Date;
  lastReview: Date;
  nextReview: Date;
}

export interface OutsourcedProduct {
  productId: string;
  productCode: string;
  outsourceScope:
    | 'COMPLETE_MANUFACTURING'
    | 'ASSEMBLY_ONLY'
    | 'COMPONENT_MANUFACTURING'
    | 'PACKAGING_ONLY';
  supplierCapability: SupplierCapability;
  qualityRequirements: QualityRequirement[];
  deliveryRequirements: DeliveryRequirement[];
  costStructure: ProductCostStructure;
  riskAssessment: RiskAssessment;
}

export interface SupplierCapability {
  certifications: string[];
  capacity: number;
  leadTime: number;
  qualityRating: number;
  technologies: string[];
  specializations: string[];
  geographicCoverage: string[];
  scalability: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface QualityAgreement {
  agreementId: string;
  qualityStandards: string[];
  inspectionRequirements: InspectionRequirement[];
  defectRateLimits: { warning: number; critical: number };
  correctiveActionPlans: CorrectiveActionPlan[];
  auditSchedule: AuditSchedule;
  qualityMetrics: QualityMetric[];
}

export interface InspectionRequirement {
  inspectionType: 'INCOMING' | 'IN_PROCESS' | 'FINAL' | 'STATISTICAL';
  frequency: 'EVERY_LOT' | 'SAMPLE' | 'PERIODIC';
  sampleSize: number;
  inspectionPoints: string[];
  acceptanceCriteria: any[];
  documentation: string[];
}

export interface DeliveryTerms {
  deliveryMode: 'SCHEDULED' | 'JUST_IN_TIME' | 'CONSIGNMENT' | 'DROP_SHIP';
  shippingTerms: 'FOB_ORIGIN' | 'FOB_DESTINATION' | 'CIF' | 'EXW';
  packagingRequirements: string[];
  labelingRequirements: string[];
  deliveryWindows: Array<{
    day: string;
    startTime: string;
    endTime: string;
  }>;
  penaltyStructure: PenaltyStructure;
}

export interface OutsourcingPricingStructure {
  pricingModel: 'COST_PLUS' | 'FIXED_PRICE' | 'UNIT_PRICE' | 'PERFORMANCE_BASED';
  basePricing: number;
  volumeDiscounts: Array<{
    minVolume: number;
    discountPercent: number;
  }>;
  escalationClauses: EscalationClause[];
  paymentTerms: PaymentTerms;
  currencyHedging: boolean;
}

export interface OutsourcedOrder {
  orderId: string;
  orderNumber: string;
  contractId: string;
  supplierId: string;
  orderType: 'PRODUCTION_ORDER' | 'PURCHASE_ORDER' | 'WORK_ORDER' | 'SERVICE_ORDER';
  products: OrderProduct[];
  deliverySchedule: DeliverySchedule[];
  status: 'PLANNED' | 'RELEASED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  totalValue: number;
  paymentSchedule: PaymentSchedule[];
  qualityPlan: QualityPlan;
  riskMitigation: RiskMitigation[];
}

export interface SupplierPerformance {
  supplierId: string;
  evaluationPeriod: { startDate: Date; endDate: Date };
  metrics: {
    qualityRating: number;
    deliveryPerformance: number;
    costPerformance: number;
    responsiveness: number;
    innovation: number;
    overallRating: number;
  };
  issues: PerformanceIssue[];
  improvements: ImprovementPlan[];
  scoreCard: SupplierScoreCard;
}

export interface PerformanceIssue {
  issueId: string;
  issueType: 'QUALITY' | 'DELIVERY' | 'COST' | 'COMMUNICATION' | 'COMPLIANCE';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  impact: string;
  rootCause?: string;
  correctionPlan?: string;
  preventiveMeasures?: string[];
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
}

// Additional interfaces for brevity
export interface ContractTerms {
  duration: number;
  renewalOptions: string[];
}
export interface QualityRequirement {
  requirement: string;
  specification: string;
}
export interface DeliveryRequirement {
  requirement: string;
  sla: string;
}
export interface ProductCostStructure {
  unitCost: number;
  toolingCost: number;
}
export interface RiskAssessment {
  riskLevel: string;
  mitigationPlan: string;
}
export interface CorrectiveActionPlan {
  planId: string;
  actions: string[];
}
export interface AuditSchedule {
  frequency: string;
  nextAudit: Date;
}
export interface QualityMetric {
  metric: string;
  target: number;
  actual: number;
}
export interface PenaltyStructure {
  lateDelivery: number;
  qualityDefects: number;
}
export interface EscalationClause {
  trigger: string;
  adjustment: number;
}
export interface PaymentTerms {
  terms: string;
  discounts: any[];
}
export interface OrderProduct {
  productId: string;
  quantity: number;
}
export interface DeliverySchedule {
  deliveryDate: Date;
  quantity: number;
}
export interface PaymentSchedule {
  dueDate: Date;
  amount: number;
}
export interface QualityPlan {
  inspections: string[];
  tests: string[];
}
export interface RiskMitigation {
  risk: string;
  mitigation: string;
}
export interface ImprovementPlan {
  improvement: string;
  timeline: string;
}
export interface SupplierScoreCard {
  scores: any[];
  recommendations: string[];
}

/**
 * Outsourced Manufacturing Service
 * Industry standard outsourced manufacturing business flows
 */
export class OutsourcedManufacturingService {
  // ================================
  // CONTRACT MANAGEMENT
  // ================================

  /**
   * Create outsourcing contract
   */
  async createOutsourcingContract(contractData: {
    supplierId: string;
    supplierName: string;
    contractType: string;
    products: string[];
    terms: any;
  }): Promise<OutsourcedManufacturingContract> {
    const contractId = `osc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const contractNumber = `OSC${Date.now().toString().slice(-6)}`;

    console.log(
      `Creating outsourcing contract: ${contractNumber} with ${contractData.supplierName}`
    );

    const contract: OutsourcedManufacturingContract = {
      contractId,
      contractNumber,
      supplierId: contractData.supplierId,
      supplierName: contractData.supplierName,
      contractType: contractData.contractType as any,
      products: contractData.products.map((pid) => ({
        productId: pid,
        productCode: `PROD_${pid}`,
        outsourceScope: 'COMPLETE_MANUFACTURING',
        supplierCapability: {
          certifications: ['ISO_9001', 'ISO_14001'],
          capacity: 10000,
          leadTime: 21,
          qualityRating: 4.2,
          technologies: ['CNC_MACHINING', 'ASSEMBLY'],
          specializations: ['PRECISION_PARTS'],
          geographicCoverage: ['North America'],
          scalability: 'HIGH',
        },
        qualityRequirements: [{ requirement: 'First article inspection', specification: 'AS9102' }],
        deliveryRequirements: [{ requirement: 'On-time delivery', sla: '95% minimum' }],
        costStructure: {
          unitCost: 125.5,
          toolingCost: 25000,
        },
        riskAssessment: {
          riskLevel: 'MEDIUM',
          mitigationPlan: 'Dual sourcing strategy',
        },
      })),
      terms: { duration: 36, renewalOptions: ['12 months', '24 months'] },
      qualityAgreements: [],
      deliveryTerms: {
        deliveryMode: 'SCHEDULED',
        shippingTerms: 'FOB_ORIGIN',
        packagingRequirements: ['Anti-static packaging'],
        labelingRequirements: ['Lot traceability'],
        deliveryWindows: [{ day: 'Monday', startTime: '08:00', endTime: '16:00' }],
        penaltyStructure: { lateDelivery: 1.0, qualityDefects: 2.5 },
      },
      pricingStructure: {
        pricingModel: 'UNIT_PRICE',
        basePricing: 125.5,
        volumeDiscounts: [
          { minVolume: 1000, discountPercent: 5.0 },
          { minVolume: 5000, discountPercent: 12.0 },
        ],
        escalationClauses: [],
        paymentTerms: { terms: 'Net 30', discounts: [] },
        currencyHedging: false,
      },
      status: 'DRAFT',
      effectiveDate: new Date(),
      expirationDate: new Date(Date.now() + 3 * 365 * 24 * 60 * 60 * 1000),
      lastReview: new Date(),
      nextReview: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    };

    return contract;
  }

  /**
   * Create outsourced manufacturing order
   */
  async createOutsourcedOrder(
    contractId: string,
    orderData: {
      products: Array<{ productId: string; quantity: number }>;
      requestedDeliveryDate: Date;
      priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    }
  ): Promise<OutsourcedOrder> {
    const orderId = `oso_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const orderNumber = `OSO${Date.now().toString().slice(-6)}`;

    console.log(`Creating outsourced order: ${orderNumber} for contract ${contractId}`);

    const totalValue = orderData.products.reduce((sum, p) => sum + p.quantity * 125.5, 0);

    const order: OutsourcedOrder = {
      orderId,
      orderNumber,
      contractId,
      supplierId: 'supplier_001',
      orderType: 'PRODUCTION_ORDER',
      products: orderData.products.map((p) => ({ productId: p.productId, quantity: p.quantity })),
      deliverySchedule: [
        {
          deliveryDate: orderData.requestedDeliveryDate,
          quantity: orderData.products.reduce((sum, p) => sum + p.quantity, 0),
        },
      ],
      status: 'PLANNED',
      totalValue,
      paymentSchedule: [
        { dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), amount: totalValue },
      ],
      qualityPlan: {
        inspections: ['Incoming inspection', 'Final inspection'],
        tests: ['Functional test', 'Performance test'],
      },
      riskMitigation: [
        { risk: 'Delivery delay', mitigation: 'Expedited shipping option' },
        { risk: 'Quality defects', mitigation: 'Enhanced inspection protocol' },
      ],
    };

    return order;
  }

  /**
   * Evaluate supplier performance
   */
  async evaluateSupplierPerformance(
    supplierId: string,
    evaluationPeriod: { startDate: Date; endDate: Date }
  ): Promise<SupplierPerformance> {
    console.log(`Evaluating supplier performance for ${supplierId}`);

    return {
      supplierId,
      evaluationPeriod,
      metrics: {
        qualityRating: 4.2,
        deliveryPerformance: 96.8,
        costPerformance: 4.1,
        responsiveness: 4.0,
        innovation: 3.8,
        overallRating: 4.18,
      },
      issues: [
        {
          issueId: 'issue_001',
          issueType: 'DELIVERY',
          severity: 'MEDIUM',
          description: 'Occasional delivery delays during peak season',
          impact: 'Production schedule disruption',
          correctionPlan: 'Implement capacity planning buffer',
          status: 'IN_PROGRESS',
        },
      ],
      improvements: [
        {
          improvement: 'Implement real-time visibility into production status',
          timeline: '6 months',
        },
      ],
      scoreCard: {
        scores: [],
        recommendations: [
          'Consider expanding relationship to additional product lines',
          'Implement collaborative forecasting process',
        ],
      },
    };
  }
}

// Export service instance
export const outsourcedManufacturingService = new OutsourcedManufacturingService();
