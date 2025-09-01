/**
 * Test the organized domain architecture - basic structure validation
 */

describe('Domain Architecture Organization', () => {
  test('Domain orchestrator should be importable and have basic structure', () => {
    // Test basic imports
    const domains = require('../src/domains');
    
    expect(domains.domainOrchestrator).toBeDefined();
    expect(domains.DomainOrchestrator).toBeDefined();
    expect(domains.CentralBusinessLogicRegistry).toBeDefined();
  });

  test('All 8 domain business logic classes should be available', () => {
    const { 
      FinancialAdministrativeBusinessLogic,
      SupplyChainOperationsBusinessLogic,
      ManufacturingProductionBusinessLogic,
      HumanCapitalBusinessLogic,
      CustomerSalesBusinessLogic,
      AssetMaintenanceBusinessLogic,
      ProjectServiceBusinessLogic,
      TechnologyIntegrationBusinessLogic
    } = require('../src/domains');
    
    expect(FinancialAdministrativeBusinessLogic).toBeDefined();
    expect(SupplyChainOperationsBusinessLogic).toBeDefined();
    expect(ManufacturingProductionBusinessLogic).toBeDefined();
    expect(HumanCapitalBusinessLogic).toBeDefined();
    expect(CustomerSalesBusinessLogic).toBeDefined();
    expect(AssetMaintenanceBusinessLogic).toBeDefined();
    expect(ProjectServiceBusinessLogic).toBeDefined();
    expect(TechnologyIntegrationBusinessLogic).toBeDefined();
  });

  test('Modules should have data-access repositories', () => {
    // Test that our newly created repositories are accessible
    const financialRepo = require('../src/modules/financial/data-access');
    const hrRepo = require('../src/modules/hr/data-access');
    const crmRepo = require('../src/modules/crm/data-access');
    
    expect(financialRepo.FinancialRepository).toBeDefined();
    expect(hrRepo.HrRepository).toBeDefined();
    expect(crmRepo.CustomerRepository).toBeDefined();
  });

  test('Domain business logic should have calculation methods', () => {
    const { HumanCapitalBusinessLogic } = require('../src/domains');
    
    // Test a simple business logic calculation
    const totalCompensation = HumanCapitalBusinessLogic.calculateTotalCompensation(100000, 0.3);
    expect(totalCompensation).toBe(130000);
    
    const workforceCapacity = HumanCapitalBusinessLogic.calculateWorkforceCapacity(100, 0.8);
    expect(workforceCapacity).toBe(80);
  });
});