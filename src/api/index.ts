// ============================================================================
// 🚀 Production-Grade NAPI-RS API Integration - Complete Module Export
// ============================================================================

// Import all APIs for aggregation
import { accountingApi } from './accounting-api';
import { advancedManufacturingApi } from './advanced_manufacturing-api';
import { advisoryConsultingApi } from './advisory_consulting-api';
import { algorithmicTradingApi } from './algorithmic_trading-api';
import { analyticsApi } from './analytics-api';
import { assetsApi } from './assets-api';
import { auditApi } from './audit-api';
import { augmentedRealityApi } from './augmented_reality-api';
import { autonomousSystemsApi } from './autonomous_systems-api';
import { bankingApi } from './banking-api';
import { biApi } from './bi-api';
import { budgetingApi } from './budgeting-api';
import { businessContinuityApi } from './business_continuity-api';
import { calculationsApi } from './calculations-api';
import { capitalAssetApi } from './capital_asset-api';
import { complianceApi } from './compliance-api';
import { computerVisionApi } from './computer_vision-api';
import { corporateGovernanceApi } from './corporate_governance-api';
import { creditRiskApi } from './credit_risk-api';
import { crmApi } from './crm-api';
import { customerApi } from './customer-api';
import { digitalForensicsApi } from './digital_forensics-api';
import { digitalTwinApi } from './digital_twin-api';
import { documentApi } from './document-api';
import { edgeComputingApi } from './edge_computing-api';
import { enterpriseAssetApi } from './enterprise_asset-api';
import { equipmentCostApi } from './equipment_cost-api';
import { factoryAutomationApi } from './factory_automation-api';
import { fieldServiceApi } from './field_service-api';
import { financialApi } from './financial-api';
import { hrApi } from './hr-api';
import { integrationApi } from './integration-api';
import { internationalTradeApi } from './international_trade-api';
import { inventoryApi } from './inventory-api';
import { investmentApi } from './investment-api';
import { investmentPortfolioApi } from './investment_portfolio-api';
import { leanManufacturingApi } from './lean_manufacturing-api';
import { logisticsApi } from './logistics-api';
import { maintenanceApi } from './maintenance-api';
import { manufacturingApi } from './manufacturing-api';
import { marketingApi } from './marketing-api';
import { multiCurrencyApi } from './multi_currency-api';
import { neuralNetworksApi } from './neural_networks-api';
import { ordersApi } from './orders-api';
import { paymentProcessingApi } from './payment_processing-api';
import { performanceApi } from './performance-api';
import { planningApi } from './planning-api';
import { predictiveAnalyticsApi } from './predictive_analytics-api';
import { pricingApi } from './pricing-api';
import { procurementApi } from './procurement-api';
import { productLifecycleApi } from './product_lifecycle-api';
import { productionPlanningApi } from './production_planning-api';
import { professionalServicesApi } from './professional_services-api';
import { projectApi } from './project-api';
import { qualityApi } from './quality-api';
import { quantumComputingApi } from './quantum_computing-api';
import { realEstateApi } from './real_estate-api';
import { regulatoryComplianceApi } from './regulatory_compliance-api';
import { regulatoryReportingApi } from './regulatory_reporting-api';
import { rentalApi } from './rental-api';
import { reportingApi } from './reporting-api';
import { researchDevelopmentApi } from './research_development-api';
import { resourceOptimizationApi } from './resource_optimization-api';
import { riskApi } from './risk-api';
import { salesApi } from './sales-api';
import { scmApi } from './scm-api';
import { serviceApi } from './service-api';
import { smartCityApi } from './smart_city-api';
import { smartGridApi } from './smart_grid-api';
import { sustainabilityApi } from './sustainability-api';
import { taxApi } from './tax-api';
import { testingValidationApi } from './testing_validation-api';
import { trainingApi } from './training-api';
import { treasuryApi } from './treasury-api';
import { vendorApi } from './vendor-api';
import { workflowApi } from './workflow-api';
import { yardManagementApi } from './yard_management-api';

// Export production framework
export { default as ProductionManager } from '../production/framework';

// Aggregate API object for convenience
export const TitanGroveApi = {
  accounting: accountingApi,
  advancedManufacturing: advancedManufacturingApi,
  advisoryConsulting: advisoryConsultingApi,
  algorithmicTrading: algorithmicTradingApi,
  analytics: analyticsApi,
  assets: assetsApi,
  audit: auditApi,
  augmentedReality: augmentedRealityApi,
  autonomousSystems: autonomousSystemsApi,
  banking: bankingApi,
  bi: biApi,
  budgeting: budgetingApi,
  businessContinuity: businessContinuityApi,
  calculations: calculationsApi,
  capitalAsset: capitalAssetApi,
  compliance: complianceApi,
  computerVision: computerVisionApi,
  corporateGovernance: corporateGovernanceApi,
  creditRisk: creditRiskApi,
  crm: crmApi,
  customer: customerApi,
  digitalForensics: digitalForensicsApi,
  digitalTwin: digitalTwinApi,
  document: documentApi,
  edgeComputing: edgeComputingApi,
  enterpriseAsset: enterpriseAssetApi,
  equipmentCost: equipmentCostApi,
  factoryAutomation: factoryAutomationApi,
  fieldService: fieldServiceApi,
  financial: financialApi,
  hr: hrApi,
  integration: integrationApi,
  internationalTrade: internationalTradeApi,
  inventory: inventoryApi,
  investment: investmentApi,
  investmentPortfolio: investmentPortfolioApi,
  leanManufacturing: leanManufacturingApi,
  logistics: logisticsApi,
  maintenance: maintenanceApi,
  manufacturing: manufacturingApi,
  marketing: marketingApi,
  multiCurrency: multiCurrencyApi,
  neuralNetworks: neuralNetworksApi,
  orders: ordersApi,
  paymentProcessing: paymentProcessingApi,
  performance: performanceApi,
  planning: planningApi,
  predictiveAnalytics: predictiveAnalyticsApi,
  pricing: pricingApi,
  procurement: procurementApi,
  productLifecycle: productLifecycleApi,
  productionPlanning: productionPlanningApi,
  professionalServices: professionalServicesApi,
  project: projectApi,
  quality: qualityApi,
  quantumComputing: quantumComputingApi,
  realEstate: realEstateApi,
  regulatoryCompliance: regulatoryComplianceApi,
  regulatoryReporting: regulatoryReportingApi,
  rental: rentalApi,
  reporting: reportingApi,
  researchDevelopment: researchDevelopmentApi,
  resourceOptimization: resourceOptimizationApi,
  risk: riskApi,
  sales: salesApi,
  scm: scmApi,
  service: serviceApi,
  smartCity: smartCityApi,
  smartGrid: smartGridApi,
  sustainability: sustainabilityApi,
  tax: taxApi,
  testingValidation: testingValidationApi,
  training: trainingApi,
  treasury: treasuryApi,
  vendor: vendorApi,
  workflow: workflowApi,
  yardManagement: yardManagementApi,
};

// Re-export all APIs individually for tree-shaking
export {
  accountingApi,
  advancedManufacturingApi,
  advisoryConsultingApi,
  algorithmicTradingApi,
  analyticsApi,
  assetsApi,
  auditApi,
  augmentedRealityApi,
  autonomousSystemsApi,
  bankingApi,
  biApi,
  budgetingApi,
  businessContinuityApi,
  calculationsApi,
  capitalAssetApi,
  complianceApi,
  computerVisionApi,
  corporateGovernanceApi,
  creditRiskApi,
  crmApi,
  customerApi,
  digitalForensicsApi,
  digitalTwinApi,
  documentApi,
  edgeComputingApi,
  enterpriseAssetApi,
  equipmentCostApi,
  factoryAutomationApi,
  fieldServiceApi,
  financialApi,
  hrApi,
  integrationApi,
  internationalTradeApi,
  inventoryApi,
  investmentApi,
  investmentPortfolioApi,
  leanManufacturingApi,
  logisticsApi,
  maintenanceApi,
  manufacturingApi,
  marketingApi,
  multiCurrencyApi,
  neuralNetworksApi,
  ordersApi,
  paymentProcessingApi,
  performanceApi,
  planningApi,
  predictiveAnalyticsApi,
  pricingApi,
  procurementApi,
  productLifecycleApi,
  productionPlanningApi,
  professionalServicesApi,
  projectApi,
  qualityApi,
  quantumComputingApi,
  realEstateApi,
  regulatoryComplianceApi,
  regulatoryReportingApi,
  rentalApi,
  reportingApi,
  researchDevelopmentApi,
  resourceOptimizationApi,
  riskApi,
  salesApi,
  scmApi,
  serviceApi,
  smartCityApi,
  smartGridApi,
  sustainabilityApi,
  taxApi,
  testingValidationApi,
  trainingApi,
  treasuryApi,
  vendorApi,
  workflowApi,
  yardManagementApi,
};

export default TitanGroveApi;
