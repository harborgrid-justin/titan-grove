// ============================================================================
// 🚀 Production-Grade NAPI-RS API Integration - Complete Module Export
// ============================================================================

export { accountingApi } from './accounting-api';
export { advancedManufacturingApi } from './advanced_manufacturing-api';
export { advisoryConsultingApi } from './advisory_consulting-api';
export { algorithmicTradingApi } from './algorithmic_trading-api';
export { analyticsApi } from './analytics-api';
export { assetsApi } from './assets-api';
export { auditApi } from './audit-api';
export { augmentedRealityApi } from './augmented_reality-api';
export { autonomousSystemsApi } from './autonomous_systems-api';
export { bankingApi } from './banking-api';
export { biApi } from './bi-api';
export { budgetingApi } from './budgeting-api';
export { businessContinuityApi } from './business_continuity-api';
export { calculationsApi } from './calculations-api';
export { capitalAssetApi } from './capital_asset-api';
export { complianceApi } from './compliance-api';
export { computerVisionApi } from './computer_vision-api';
export { corporateGovernanceApi } from './corporate_governance-api';
export { creditRiskApi } from './credit_risk-api';
export { crmApi } from './crm-api';
export { customerApi } from './customer-api';
export { digitalForensicsApi } from './digital_forensics-api';
export { digitalTwinApi } from './digital_twin-api';
export { documentApi } from './document-api';
export { edgeComputingApi } from './edge_computing-api';
export { enterpriseAssetApi } from './enterprise_asset-api';
export { equipmentCostApi } from './equipment_cost-api';
export { factoryAutomationApi } from './factory_automation-api';
export { fieldServiceApi } from './field_service-api';
export { financialApi } from './financial-api';
export { hrApi } from './hr-api';
export { integrationApi } from './integration-api';
export { internationalTradeApi } from './international_trade-api';
export { inventoryApi } from './inventory-api';
export { investmentApi } from './investment-api';
export { investmentPortfolioApi } from './investment_portfolio-api';
export { leanManufacturingApi } from './lean_manufacturing-api';
export { logisticsApi } from './logistics-api';
export { maintenanceApi } from './maintenance-api';
export { manufacturingApi } from './manufacturing-api';
export { marketingApi } from './marketing-api';
export { multiCurrencyApi } from './multi_currency-api';
export { neuralNetworksApi } from './neural_networks-api';
export { ordersApi } from './orders-api';
export { paymentProcessingApi } from './payment_processing-api';
export { performanceApi } from './performance-api';
export { planningApi } from './planning-api';
export { predictiveAnalyticsApi } from './predictive_analytics-api';
export { pricingApi } from './pricing-api';
export { procurementApi } from './procurement-api';
export { productLifecycleApi } from './product_lifecycle-api';
export { productionPlanningApi } from './production_planning-api';
export { professionalServicesApi } from './professional_services-api';
export { projectApi } from './project-api';
export { qualityApi } from './quality-api';
export { quantumComputingApi } from './quantum_computing-api';
export { realEstateApi } from './real_estate-api';
export { regulatoryComplianceApi } from './regulatory_compliance-api';
export { regulatoryReportingApi } from './regulatory_reporting-api';
export { rentalApi } from './rental-api';
export { reportingApi } from './reporting-api';
export { researchDevelopmentApi } from './research_development-api';
export { resourceOptimizationApi } from './resource_optimization-api';
export { riskApi } from './risk-api';
export { salesApi } from './sales-api';
export { scmApi } from './scm-api';
export { serviceApi } from './service-api';
export { smartCityApi } from './smart_city-api';
export { smartGridApi } from './smart_grid-api';
export { sustainabilityApi } from './sustainability-api';
export { taxApi } from './tax-api';
export { testingValidationApi } from './testing_validation-api';
export { trainingApi } from './training-api';
export { treasuryApi } from './treasury-api';
export { vendorApi } from './vendor-api';
export { workflowApi } from './workflow-api';
export { yardManagementApi } from './yard_management-api';

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

export default TitanGroveApi;
