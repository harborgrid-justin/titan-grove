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
    accounting: require('./accounting-api').accountingApi,
    advancedManufacturing: require('./advanced_manufacturing-api').advancedManufacturingApi,
    advisoryConsulting: require('./advisory_consulting-api').advisoryConsultingApi,
    algorithmicTrading: require('./algorithmic_trading-api').algorithmicTradingApi,
    analytics: require('./analytics-api').analyticsApi,
    assets: require('./assets-api').assetsApi,
    audit: require('./audit-api').auditApi,
    augmentedReality: require('./augmented_reality-api').augmentedRealityApi,
    autonomousSystems: require('./autonomous_systems-api').autonomousSystemsApi,
    banking: require('./banking-api').bankingApi,
    bi: require('./bi-api').biApi,
    budgeting: require('./budgeting-api').budgetingApi,
    businessContinuity: require('./business_continuity-api').businessContinuityApi,
    calculations: require('./calculations-api').calculationsApi,
    capitalAsset: require('./capital_asset-api').capitalAssetApi,
    compliance: require('./compliance-api').complianceApi,
    computerVision: require('./computer_vision-api').computerVisionApi,
    corporateGovernance: require('./corporate_governance-api').corporateGovernanceApi,
    creditRisk: require('./credit_risk-api').creditRiskApi,
    crm: require('./crm-api').crmApi,
    customer: require('./customer-api').customerApi,
    digitalForensics: require('./digital_forensics-api').digitalForensicsApi,
    digitalTwin: require('./digital_twin-api').digitalTwinApi,
    document: require('./document-api').documentApi,
    edgeComputing: require('./edge_computing-api').edgeComputingApi,
    enterpriseAsset: require('./enterprise_asset-api').enterpriseAssetApi,
    equipmentCost: require('./equipment_cost-api').equipmentCostApi,
    factoryAutomation: require('./factory_automation-api').factoryAutomationApi,
    fieldService: require('./field_service-api').fieldServiceApi,
    financial: require('./financial-api').financialApi,
    hr: require('./hr-api').hrApi,
    integration: require('./integration-api').integrationApi,
    internationalTrade: require('./international_trade-api').internationalTradeApi,
    inventory: require('./inventory-api').inventoryApi,
    investment: require('./investment-api').investmentApi,
    investmentPortfolio: require('./investment_portfolio-api').investmentPortfolioApi,
    leanManufacturing: require('./lean_manufacturing-api').leanManufacturingApi,
    logistics: require('./logistics-api').logisticsApi,
    maintenance: require('./maintenance-api').maintenanceApi,
    manufacturing: require('./manufacturing-api').manufacturingApi,
    marketing: require('./marketing-api').marketingApi,
    multiCurrency: require('./multi_currency-api').multiCurrencyApi,
    neuralNetworks: require('./neural_networks-api').neuralNetworksApi,
    orders: require('./orders-api').ordersApi,
    paymentProcessing: require('./payment_processing-api').paymentProcessingApi,
    performance: require('./performance-api').performanceApi,
    planning: require('./planning-api').planningApi,
    predictiveAnalytics: require('./predictive_analytics-api').predictiveAnalyticsApi,
    pricing: require('./pricing-api').pricingApi,
    procurement: require('./procurement-api').procurementApi,
    productLifecycle: require('./product_lifecycle-api').productLifecycleApi,
    productionPlanning: require('./production_planning-api').productionPlanningApi,
    professionalServices: require('./professional_services-api').professionalServicesApi,
    project: require('./project-api').projectApi,
    quality: require('./quality-api').qualityApi,
    quantumComputing: require('./quantum_computing-api').quantumComputingApi,
    realEstate: require('./real_estate-api').realEstateApi,
    regulatoryCompliance: require('./regulatory_compliance-api').regulatoryComplianceApi,
    regulatoryReporting: require('./regulatory_reporting-api').regulatoryReportingApi,
    rental: require('./rental-api').rentalApi,
    reporting: require('./reporting-api').reportingApi,
    researchDevelopment: require('./research_development-api').researchDevelopmentApi,
    resourceOptimization: require('./resource_optimization-api').resourceOptimizationApi,
    risk: require('./risk-api').riskApi,
    sales: require('./sales-api').salesApi,
    scm: require('./scm-api').scmApi,
    service: require('./service-api').serviceApi,
    smartCity: require('./smart_city-api').smartCityApi,
    smartGrid: require('./smart_grid-api').smartGridApi,
    sustainability: require('./sustainability-api').sustainabilityApi,
    tax: require('./tax-api').taxApi,
    testingValidation: require('./testing_validation-api').testingValidationApi,
    training: require('./training-api').trainingApi,
    treasury: require('./treasury-api').treasuryApi,
    vendor: require('./vendor-api').vendorApi,
    workflow: require('./workflow-api').workflowApi,
    yardManagement: require('./yard_management-api').yardManagementApi,
};

export default TitanGroveApi;
