/**
 * Procure-to-Pay Integration Module - Index
 * Exports all services and types for the procure-to-pay integration
 */

// Export all types
export * from './types';

// Export all services
export { RequisitionService, requisitionService } from './requisition-service';
export { SourcingService, sourcingService } from './sourcing-service';
export { ContractExecutionService, contractExecutionService } from './contract-execution-service';
export { ReceiptProcessingService, receiptProcessingService } from './receipt-processing-service';
export { PaymentProcessingService, paymentProcessingService } from './payment-processing-service';
export { ProcureToPayIntegrationService, procureToPayIntegrationService } from './main-service';

// Legacy compatibility - re-export main service as the original name
export {
  ProcureToPayIntegrationService as ProcureToPayIntegrationServiceLegacy,
  procureToPayIntegrationService as procureToPayIntegrationServiceLegacy,
} from './main-service';
