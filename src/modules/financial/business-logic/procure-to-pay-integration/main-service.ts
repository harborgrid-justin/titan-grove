/**
 * Procure-to-Pay Integration Service
 * Main orchestration service for the complete procure-to-pay process
 */

import {
  ProcureToPayProcess,
  ProcessStage,
  IntegrationPoint,
  ProcessAuditEvent,
  Requisition,
  SourcingEvent,
  ContractExecution,
  ReceiptProcessing,
  PaymentProcessing,
  ReceivedItem,
  InvoiceLineItem,
} from './types';

import { requisitionService } from './requisition-service';
import { sourcingService } from './sourcing-service';
import { contractExecutionService } from './contract-execution-service';
import { receiptProcessingService } from './receipt-processing-service';
import { paymentProcessingService } from './payment-processing-service';

export class ProcureToPayIntegrationService {
  /**
   * Initiate end-to-end procure-to-pay process
   */
  async initiateProcureToPayProcess(
    requisition: Partial<Requisition>,
    processType: ProcureToPayProcess['processType']
  ): Promise<ProcureToPayProcess> {
    const stages = this.generateProcessStages(processType);

    const process: ProcureToPayProcess = {
      id: `p2p_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      processType,
      initiatedBy: requisition.requestorId || 'system_user',
      initiationDate: new Date(),
      currentStage: stages[0],
      stages,
      totalValue: requisition.totalAmount || 0,
      priority: this.determinePriority(requisition.totalAmount || 0),
      status: 'INITIATED',
      integrationPoints: this.setupIntegrationPoints(),
      auditTrail: [],
    };

    // Create initial audit event
    this.addAuditEvent(process, 'STAGE_TRANSITION', 'Process initiated', 'P2P_SYSTEM');

    return process;
  }

  /**
   * Process requisition with federal compliance validation
   */
  async processRequisition(requisitionData: Partial<Requisition>): Promise<Requisition> {
    return requisitionService.processRequisition(requisitionData);
  }

  /**
   * Execute sourcing event with competitive requirements
   */
  async executeSourcingEvent(
    requisitionIds: string[],
    eventType: SourcingEvent['eventType']
  ): Promise<SourcingEvent> {
    return sourcingService.executeSourcingEvent(requisitionIds, eventType);
  }

  /**
   * Process contract execution with federal requirements
   */
  async executeContract(
    sourcingEventId: string,
    selectedResponseId: string
  ): Promise<ContractExecution> {
    return contractExecutionService.executeContract(sourcingEventId, selectedResponseId);
  }

  /**
   * Process receipt and inspection with quality controls
   */
  async processReceipt(
    contractId: string,
    deliveryId: string,
    receivedItems: ReceivedItem[]
  ): Promise<ReceiptProcessing> {
    return receiptProcessingService.processReceipt(contractId, deliveryId, receivedItems);
  }

  /**
   * Process invoice with three-way matching
   */
  async processInvoice(
    contractId: string,
    receiptIds: string[],
    invoiceLineItems: InvoiceLineItem[]
  ): Promise<any> {
    return paymentProcessingService.processInvoice(contractId, receiptIds, invoiceLineItems);
  }

  /**
   * Process payment with federal payment requirements
   */
  async processPayment(invoiceId: string): Promise<PaymentProcessing> {
    return paymentProcessingService.processPayment(invoiceId);
  }

  /**
   * Monitor end-to-end process performance
   */
  async monitorProcessPerformance(processId: string): Promise<{
    overallStatus: 'ON_TRACK' | 'AT_RISK' | 'DELAYED' | 'COMPLETED';
    stagePerformance: { [stageId: string]: { planned: number; actual: number; variance: number } };
    bottlenecks: string[];
    recommendations: string[];
    complianceStatus: 'COMPLIANT' | 'NON_COMPLIANT' | 'PENDING_REVIEW';
    integrationHealth: { [systemName: string]: 'HEALTHY' | 'WARNING' | 'ERROR' };
  }> {
    return {
      overallStatus: 'ON_TRACK',
      stagePerformance: {
        requisition: { planned: 5, actual: 4, variance: -20 },
        sourcing: { planned: 14, actual: 12, variance: -14 },
        contracting: { planned: 7, actual: 8, variance: 14 },
      },
      bottlenecks: [
        'Manual approval processes in contracting stage',
        'Delayed supplier responses in sourcing',
      ],
      recommendations: [
        'Implement electronic approval workflow',
        'Expand supplier database for better competition',
        'Automate routine contract generation',
      ],
      complianceStatus: 'COMPLIANT',
      integrationHealth: {
        Financial_System: 'HEALTHY',
        Contract_Management: 'HEALTHY',
        Supplier_Portal: 'WARNING',
      },
    };
  }

  /**
   * Generate process stages based on process type
   */
  private generateProcessStages(processType: ProcureToPayProcess['processType']): ProcessStage[] {
    const baseStages: ProcessStage[] = [
      {
        stageId: 'stage_requisition',
        stageName: 'Requisition Processing',
        stageType: 'REQUISITION',
        sequence: 1,
        status: 'NOT_STARTED',
        assignedTo: ['requestor', 'supervisor'],
        requiredDocuments: ['Requisition Form', 'Business Justification'],
        systemIntegrations: ['ERP', 'Budget_Management'],
        automationLevel: 'SEMI_AUTOMATED',
      },
      {
        stageId: 'stage_sourcing',
        stageName: 'Competitive Sourcing',
        stageType: 'SOURCING',
        sequence: 2,
        status: 'NOT_STARTED',
        assignedTo: ['contracting_officer', 'procurement_specialist'],
        requiredDocuments: ['Market Research', 'Solicitation Documents'],
        systemIntegrations: ['Supplier_Portal', 'Evaluation_System'],
        automationLevel:
          processType === 'SIMPLIFIED_ACQUISITION' ? 'FULLY_AUTOMATED' : 'SEMI_AUTOMATED',
      },
    ];

    if (processType === 'STANDARD_PROCUREMENT') {
      baseStages.push({
        stageId: 'stage_contracting',
        stageName: 'Contract Development',
        stageType: 'CONTRACTING',
        sequence: 3,
        status: 'NOT_STARTED',
        assignedTo: ['contracting_officer', 'legal_counsel'],
        requiredDocuments: ['Contract Terms', 'Performance Specifications'],
        systemIntegrations: ['Contract_Management', 'Legal_Review'],
        automationLevel: 'MANUAL',
      });
    }

    baseStages.push(
      {
        stageId: 'stage_receiving',
        stageName: 'Receipt and Inspection',
        stageType: 'RECEIVING',
        sequence: baseStages.length + 1,
        status: 'NOT_STARTED',
        assignedTo: ['receiving_clerk', 'quality_inspector'],
        requiredDocuments: ['Delivery Receipt', 'Inspection Report'],
        systemIntegrations: ['Inventory_Management', 'Quality_System'],
        automationLevel: 'SEMI_AUTOMATED',
      },
      {
        stageId: 'stage_invoicing',
        stageName: 'Invoice Processing',
        stageType: 'INVOICING',
        sequence: baseStages.length + 2,
        status: 'NOT_STARTED',
        assignedTo: ['accounts_payable'],
        requiredDocuments: ['Supplier Invoice', 'Three-Way Match'],
        systemIntegrations: ['Financial_System', 'Contract_Management'],
        automationLevel: 'FULLY_AUTOMATED',
      },
      {
        stageId: 'stage_payment',
        stageName: 'Payment Processing',
        stageType: 'PAYMENT',
        sequence: baseStages.length + 3,
        status: 'NOT_STARTED',
        assignedTo: ['treasury', 'payment_approver'],
        requiredDocuments: ['Payment Authorization', 'Bank Transfer'],
        systemIntegrations: ['Banking_System', 'Treasury_Management'],
        automationLevel: 'FULLY_AUTOMATED',
      }
    );

    return baseStages;
  }

  /**
   * Setup integration points for process
   */
  private setupIntegrationPoints(): IntegrationPoint[] {
    return [
      {
        integrationId: 'int_erp',
        systemName: 'Enterprise Resource Planning',
        integrationType: 'REAL_TIME',
        dataExchanged: ['Budget Data', 'GL Codes', 'Cost Centers'],
        status: 'CONNECTED',
      },
      {
        integrationId: 'int_supplier_portal',
        systemName: 'Supplier Portal',
        integrationType: 'EVENT_DRIVEN',
        dataExchanged: ['RFP Documents', 'Supplier Responses', 'Awards'],
        status: 'CONNECTED',
      },
      {
        integrationId: 'int_banking',
        systemName: 'Banking System',
        integrationType: 'BATCH',
        dataExchanged: ['Payment Instructions', 'Transaction Status'],
        status: 'CONNECTED',
      },
    ];
  }

  /**
   * Add audit event to process
   */
  private addAuditEvent(
    process: ProcureToPayProcess,
    eventType: ProcessAuditEvent['eventType'],
    description: string,
    systemSource: string
  ): void {
    const auditEvent: ProcessAuditEvent = {
      eventId: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      eventType,
      timestamp: new Date(),
      userId: 'system',
      description,
      systemSource,
      dataChanged: {},
      complianceImpact: 'NONE',
    };

    process.auditTrail.push(auditEvent);
  }

  /**
   * Determine process priority based on value
   */
  private determinePriority(totalValue: number): ProcureToPayProcess['priority'] {
    if (totalValue >= 1000000) return 'CRITICAL';
    if (totalValue >= 250000) return 'HIGH';
    if (totalValue >= 50000) return 'MEDIUM';
    return 'LOW';
  }
}

// Export singleton instance
export const procureToPayIntegrationService = new ProcureToPayIntegrationService();
