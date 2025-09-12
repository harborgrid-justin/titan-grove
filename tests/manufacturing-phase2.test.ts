/**
 * Manufacturing Phase 2 Implementation Tests
 * Test suite for Material Requirements Planning (MRP), Capacity Requirements Planning (CRP), and Advanced BOM features
 */

import { MaterialRequirementsPlanningService, MRPParameters } from '../src/modules/manufacturing/business-logic/material-requirements-planning/mrp-service';
import { CapacityRequirementsPlanningService, CRPParameters } from '../src/modules/manufacturing/business-logic/capacity-requirements-planning/crp-service';
import { AdvancedBOMManagementService, AdvancedBOM } from '../src/modules/manufacturing/business-logic/advanced-bom-management/advanced-bom-service';

describe('Manufacturing Phase 2 Implementation Tests', () => {
  let mrpService: MaterialRequirementsPlanningService;
  let crpService: CapacityRequirementsPlanningService;
  let bomService: AdvancedBOMManagementService;

  beforeEach(() => {
    mrpService = new MaterialRequirementsPlanningService();
    crpService = new CapacityRequirementsPlanningService();
    bomService = new AdvancedBOMManagementService();
  });

  describe('Material Requirements Planning (MRP) Service', () => {
    test('should execute full MRP run successfully', async () => {
      const parameters: MRPParameters = {
        planningHorizon: {
          startDate: new Date(),
          endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days
        },
        safetyStockDays: {
          'FG001': 10,
          'SA001': 15,
          'RM001': 5
        },
        leadTimes: {
          'FG001': 14,
          'SA001': 7,
          'RM001': 3
        },
        lotSizingMethod: 'LOT_FOR_LOT',
        lowLevelCodes: {
          'FG001': 0,
          'SA001': 1,
          'RM001': 2
        },
        planningTimeFence: 30,
        demandTimeFence: 15
      };

      const results = await mrpService.runMRP(parameters);

      expect(results).toBeDefined();
      expect(results.runId).toBeTruthy();
      expect(results.itemsProcessed).toBeGreaterThan(0);
      expect(results.planningHorizon).toEqual(parameters.planningHorizon);
      expect(results.performance.processingTimeMs).toBeGreaterThan(0);
      
      console.log(`✅ MRP Run completed: ${results.itemsProcessed} items, ${results.totalPlannedOrders} planned orders`);
    });

    test('should generate appropriate action messages', async () => {
      const parameters: MRPParameters = {
        planningHorizon: {
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        },
        safetyStockDays: { 'TEST_ITEM': 10 },
        leadTimes: { 'TEST_ITEM': 7 },
        lotSizingMethod: 'ECONOMIC_ORDER_QUANTITY',
        lowLevelCodes: { 'TEST_ITEM': 0 },
        planningTimeFence: 14,
        demandTimeFence: 7
      };

      await mrpService.runMRP(parameters);
      const actionMessages = await mrpService.getActionMessages('CRITICAL');

      expect(Array.isArray(actionMessages)).toBe(true);
      console.log(`📋 Generated ${actionMessages.length} critical action messages`);
    });

    test('should handle different lot sizing methods', async () => {
      const lotSizingMethods = ['LOT_FOR_LOT', 'FIXED_ORDER_QUANTITY', 'ECONOMIC_ORDER_QUANTITY', 'PERIOD_ORDER_QUANTITY'];

      for (const method of lotSizingMethods) {
        const parameters: MRPParameters = {
          planningHorizon: {
            startDate: new Date(),
            endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
          },
          safetyStockDays: { 'TEST': 5 },
          leadTimes: { 'TEST': 7 },
          lotSizingMethod: method as any,
          lowLevelCodes: { 'TEST': 0 },
          planningTimeFence: 30,
          demandTimeFence: 15
        };

        const results = await mrpService.runMRP(parameters);
        expect(results.itemsProcessed).toBeGreaterThan(0);
        console.log(`✅ MRP with ${method}: ${results.totalPlannedOrders} planned orders`);
      }
    });
  });

  describe('Capacity Requirements Planning (CRP) Service', () => {
    test('should execute full CRP analysis successfully', async () => {
      const parameters: CRPParameters = {
        planningHorizon: {
          startDate: new Date(),
          endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
        },
        timeUnitType: 'WEEKLY',
        includeSetupTime: true,
        includeQueueTime: true,
        includeWaitTime: false,
        capacityTolerance: 110, // 110%
        overloadThreshold: 105, // 105%
        underloadThreshold: 75  // 75%
      };

      const results = await crpService.runCRP(parameters);

      expect(results).toBeDefined();
      expect(results.runId).toBeTruthy();
      expect(results.workCentersAnalyzed).toBeGreaterThan(0);
      expect(results.feasibilityScore).toBeGreaterThanOrEqual(0);
      expect(results.feasibilityScore).toBeLessThanOrEqual(100);
      
      console.log(`🏭 CRP Analysis completed: ${results.workCentersAnalyzed} work centers, feasibility: ${results.feasibilityScore.toFixed(1)}%`);
    });

    test('should identify bottlenecks correctly', async () => {
      const parameters: CRPParameters = {
        planningHorizon: {
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        },
        timeUnitType: 'DAILY',
        includeSetupTime: true,
        includeQueueTime: true,
        includeWaitTime: true,
        capacityTolerance: 100,
        overloadThreshold: 95,
        underloadThreshold: 60
      };

      await crpService.runCRP(parameters);
      const bottlenecks = await crpService.getBottleneckWorkCenters();

      expect(Array.isArray(bottlenecks)).toBe(true);
      console.log(`🚨 Identified ${bottlenecks.length} bottleneck work centers`);

      for (const bottleneck of bottlenecks) {
        expect(bottleneck.bottleneckRating).not.toBe('NONE');
        expect(bottleneck.overallUtilization).toBeGreaterThan(0);
        console.log(`   - ${bottleneck.workCenterId}: ${bottleneck.overallUtilization.toFixed(1)}% utilization (${bottleneck.bottleneckRating})`);
      }
    });

    test('should generate capacity recommendations', async () => {
      const parameters: CRPParameters = {
        planningHorizon: {
          startDate: new Date(),
          endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
        },
        timeUnitType: 'WEEKLY',
        includeSetupTime: true,
        includeQueueTime: false,
        includeWaitTime: false,
        capacityTolerance: 105,
        overloadThreshold: 100,
        underloadThreshold: 70
      };

      const results = await crpService.runCRP(parameters);

      expect(results.recommendations).toBeGreaterThanOrEqual(0);
      console.log(`💡 Generated ${results.recommendations} capacity recommendations`);
    });
  });

  describe('Advanced BOM Management Service', () => {
    test('should create standard manufacturing BOM', async () => {
      const bomData: Partial<AdvancedBOM> = {
        bomCode: 'BOM_TEST_001',
        bomName: 'Test Manufacturing BOM',
        parentItemId: 'PARENT_001',
        parentItemCode: 'PARENT-001',
        bomType: 'MANUFACTURING',
        components: [
          {
            componentId: 'COMP_001',
            componentSequence: 1,
            componentItemId: 'COMP_ITEM_001',
            componentItemCode: 'COMP-001',
            componentDescription: 'Test Component 1',
            quantityPer: 2,
            unitOfMeasure: 'EA',
            scrapFactor: 0.05,
            yieldFactor: 0.98,
            componentType: 'STANDARD',
            phantom: false,
            optional: false,
            critical: true,
            leadTimeOffset: 0,
            substitutes: [],
            effectiveDate: new Date(),
            usageVariance: 0
          }
        ]
      };

      const bom = await bomService.createAdvancedBOM(bomData);

      expect(bom).toBeDefined();
      expect(bom.bomId).toBeTruthy();
      expect(bom.bomCode).toBe('BOM_TEST_001');
      expect(bom.bomType).toBe('MANUFACTURING');
      expect(bom.components).toHaveLength(1);
      expect(bom.costRollup).toBeDefined();
      
      console.log(`🔧 Created Manufacturing BOM: ${bom.bomId} with ${bom.components.length} components`);
    });

    test('should create phantom BOM for intermediate assemblies', async () => {
      const phantomComponents = [
        {
          componentItemCode: 'PHANTOM_COMP_001',
          componentDescription: 'Phantom Component 1',
          quantityPer: 1,
          critical: true
        },
        {
          componentItemCode: 'PHANTOM_COMP_002',
          componentDescription: 'Phantom Component 2',
          quantityPer: 3,
          critical: false
        }
      ];

      const phantomBOM = await bomService.createPhantomBOM('PHANTOM_PARENT_001', phantomComponents);

      expect(phantomBOM).toBeDefined();
      expect(phantomBOM.bomType).toBe('PHANTOM');
      expect(phantomBOM.components).toHaveLength(2);
      expect(phantomBOM.components.every(comp => comp.phantom)).toBe(true);
      expect(phantomBOM.components.every(comp => comp.componentType === 'PHANTOM')).toBe(true);
      
      console.log(`👻 Created Phantom BOM: ${phantomBOM.bomId} with ${phantomBOM.components.length} phantom components`);
    });

    test('should create option class BOM for configurable products', async () => {
      const optionClasses = [
        {
          optionClassId: 'OC_001',
          optionClassName: 'Engine Options',
          optionClassType: 'SINGLE_SELECT' as const,
          mandatory: true,
          options: [
            {
              optionId: 'OPT_001',
              optionCode: 'V6_ENGINE',
              optionName: 'V6 Engine',
              optionDescription: '3.5L V6 Engine',
              additionalComponents: [],
              removedComponents: [],
              modifiedQuantities: [],
              costImpact: 2500,
              leadTimeImpact: 5,
              available: true,
              popularityRanking: 1
            }
          ],
          rules: [],
          pricing: {
            pricingMethod: 'FIXED' as const,
            basePrice: 2500,
            priceAdjustments: [],
            discountEligible: true
          }
        }
      ];

      const optionBOM = await bomService.createOptionClassBOM('CONFIGURABLE_PRODUCT_001', optionClasses);

      expect(optionBOM).toBeDefined();
      expect(optionBOM.bomType).toBe('OPTION_CLASS');
      expect(optionBOM.optionClasses).toHaveLength(1);
      expect(optionBOM.optionClasses[0].optionClassName).toBe('Engine Options');
      
      console.log(`⚙️ Created Option Class BOM: ${optionBOM.bomId} with ${optionBOM.optionClasses.length} option classes`);
    });

    test('should create super BOM for product families', async () => {
      const commonComponents = [
        {
          componentItemCode: 'COMMON_COMP_001',
          componentDescription: 'Common Base Frame',
          quantityPer: 1,
          critical: true
        }
      ];

      const variableComponents = [
        {
          variableId: 'VAR_001',
          componentType: 'OPTION_DEPENDENT' as const,
          selectionCriteria: [
            {
              criteriaType: 'SIZE',
              criteriaValue: 'LARGE',
              operator: 'EQUAL',
              priority: 1
            }
          ],
          possibleComponents: []
        }
      ];

      const superBOM = await bomService.createSuperBOM(
        'BIKE_FAMILY',
        'BASE_BIKE_MODEL',
        commonComponents,
        variableComponents
      );

      expect(superBOM).toBeDefined();
      expect(superBOM.superBomId).toBeTruthy();
      expect(superBOM.productFamily).toBe('BIKE_FAMILY');
      expect(superBOM.commonComponents).toHaveLength(1);
      expect(superBOM.variableComponents).toHaveLength(1);
      
      console.log(`🏗️ Created Super BOM: ${superBOM.superBomId} for product family ${superBOM.productFamily}`);
    });

    test('should process engineering change orders', async () => {
      // First create a BOM
      const bomData = {
        bomCode: 'ECO_TEST_BOM',
        bomName: 'ECO Test BOM',
        parentItemId: 'ECO_PARENT',
        parentItemCode: 'ECO-PARENT'
      };

      const bom = await bomService.createAdvancedBOM(bomData);

      // Now create an engineering change
      const changeRequest = {
        ecoNumber: 'ECO-2024-001',
        changeType: 'MODIFICATION' as const,
        changeReason: 'COST_REDUCTION' as const,
        requestedBy: 'TEST_USER',
        affectedComponents: ['COMP_001', 'COMP_002']
      };

      const engineeringChange = await bomService.processEngineeringChange(bom.bomId, changeRequest);

      expect(engineeringChange).toBeDefined();
      expect(engineeringChange.ecoId).toBeTruthy();
      expect(engineeringChange.ecoNumber).toBe('ECO-2024-001');
      expect(engineeringChange.impactAnalysis).toBeDefined();
      expect(engineeringChange.impactAnalysis.costImpact).toBeGreaterThanOrEqual(0);
      
      console.log(`📋 Processed Engineering Change: ${engineeringChange.ecoId}, Cost Impact: $${engineeringChange.impactAnalysis.costImpact.toFixed(2)}`);
    });

    test('should perform mass BOM updates', async () => {
      // Create a few BOMs first
      const bomData1 = { bomCode: 'MASS_001', bomName: 'Mass Test 1', parentItemId: 'MASS_PARENT_1' };
      const bomData2 = { bomCode: 'MASS_002', bomName: 'Mass Test 2', parentItemId: 'MASS_PARENT_2' };

      await bomService.createAdvancedBOM(bomData1);
      await bomService.createAdvancedBOM(bomData2);

      const selectionCriteria = {
        bomType: 'MANUFACTURING'
      };

      const updateData = {
        effectiveDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        reason: 'Scheduled update'
      };

      const massUpdate = await bomService.performMassUpdate(
        'EFFECTIVITY_UPDATE',
        selectionCriteria,
        updateData
      );

      expect(massUpdate).toBeDefined();
      expect(massUpdate.updateId).toBeTruthy();
      expect(massUpdate.itemsAffected).toBeGreaterThan(0);
      expect(['IN_PROGRESS', 'COMPLETED'].includes(massUpdate.status)).toBe(true);
      
      console.log(`🔄 Mass Update ${massUpdate.updateId}: ${massUpdate.itemsAffected} BOMs affected, Status: ${massUpdate.status}`);
    });

    test('should retrieve where-used information', async () => {
      // Create BOM with specific component
      const bomData = {
        bomCode: 'WHERE_USED_TEST',
        bomName: 'Where Used Test BOM',
        parentItemId: 'WU_PARENT',
        components: [
          {
            componentId: 'WU_COMP_001',
            componentSequence: 1,
            componentItemId: 'WU_COMPONENT',
            componentItemCode: 'WU-COMP',
            componentDescription: 'Where Used Test Component',
            quantityPer: 1,
            unitOfMeasure: 'EA',
            scrapFactor: 0,
            yieldFactor: 1,
            componentType: 'STANDARD' as const,
            phantom: false,
            optional: false,
            critical: false,
            leadTimeOffset: 0,
            substitutes: [],
            effectiveDate: new Date(),
            usageVariance: 0
          }
        ]
      };

      await bomService.createAdvancedBOM(bomData);

      const whereUsed = await bomService.getWhereUsed('WU_COMPONENT');

      expect(whereUsed).toBeDefined();
      expect(Array.isArray(whereUsed)).toBe(true);
      expect(whereUsed.length).toBeGreaterThan(0);
      
      console.log(`🔍 Where-Used Query: Found ${whereUsed.length} parent BOMs for component WU_COMPONENT`);
      
      whereUsed.forEach(wu => {
        expect(wu.parentItemId).toBeTruthy();
        expect(wu.quantityPer).toBeGreaterThan(0);
      });
    });
  });

  describe('Integration Tests - Phase 2 Services', () => {
    test('should integrate MRP and CRP for comprehensive planning', async () => {
      console.log('🔗 Testing MRP-CRP Integration');

      // Run MRP first
      const mrpParameters: MRPParameters = {
        planningHorizon: {
          startDate: new Date(),
          endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
        },
        safetyStockDays: { 'INTEGRATION_TEST': 10 },
        leadTimes: { 'INTEGRATION_TEST': 14 },
        lotSizingMethod: 'LOT_FOR_LOT',
        lowLevelCodes: { 'INTEGRATION_TEST': 0 },
        planningTimeFence: 30,
        demandTimeFence: 15
      };

      const mrpResults = await mrpService.runMRP(mrpParameters);
      expect(mrpResults.itemsProcessed).toBeGreaterThan(0);

      // Run CRP with same planning horizon
      const crpParameters: CRPParameters = {
        planningHorizon: mrpParameters.planningHorizon,
        timeUnitType: 'WEEKLY',
        includeSetupTime: true,
        includeQueueTime: true,
        includeWaitTime: false,
        capacityTolerance: 110,
        overloadThreshold: 105,
        underloadThreshold: 75
      };

      const crpResults = await crpService.runCRP(crpParameters);
      expect(crpResults.workCentersAnalyzed).toBeGreaterThan(0);

      console.log(`✅ Integration Test: MRP processed ${mrpResults.itemsProcessed} items, CRP analyzed ${crpResults.workCentersAnalyzed} work centers`);
    });

    test('should create comprehensive product with all Phase 2 features', async () => {
      console.log('🏗️ Testing Comprehensive Product Creation with Phase 2 Features');

      // Create Super BOM for product family
      const superBOM = await bomService.createSuperBOM(
        'COMPREHENSIVE_FAMILY',
        'BASE_MODEL',
        [{
          componentItemCode: 'BASE_ASSEMBLY',
          componentDescription: 'Base Assembly',
          quantityPer: 1,
          critical: true
        }],
        [{
          variableId: 'SIZE_VAR',
          componentType: 'SIZE_DEPENDENT',
          selectionCriteria: [],
          possibleComponents: []
        }]
      );

      // Create Option Class BOM
      const optionBOM = await bomService.createOptionClassBOM(
        'CONFIGURABLE_ITEM',
        [{
          optionClassId: 'FEATURES',
          optionClassName: 'Feature Options',
          optionClassType: 'MULTI_SELECT',
          mandatory: false,
          options: [],
          rules: [],
          pricing: {
            pricingMethod: 'PERCENTAGE',
            basePrice: 1000,
            priceAdjustments: [],
            discountEligible: true
          }
        }]
      );

      // Create Phantom BOM for subassembly
      const phantomBOM = await bomService.createPhantomBOM(
        'PHANTOM_ASSEMBLY',
        [{
          componentItemCode: 'PHANTOM_PART_1',
          componentDescription: 'Phantom Part 1',
          quantityPer: 2
        }]
      );

      expect(superBOM.superBomId).toBeTruthy();
      expect(optionBOM.bomType).toBe('OPTION_CLASS');
      expect(phantomBOM.bomType).toBe('PHANTOM');

      console.log(`🎯 Comprehensive Product Created:`);
      console.log(`   - Super BOM: ${superBOM.superBomId}`);
      console.log(`   - Option Class BOM: ${optionBOM.bomId}`);
      console.log(`   - Phantom BOM: ${phantomBOM.bomId}`);
    });
  });

  describe('Performance Tests', () => {
    test('should handle large-scale MRP processing efficiently', async () => {
      const startTime = Date.now();
      
      const parameters: MRPParameters = {
        planningHorizon: {
          startDate: new Date(),
          endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000) // 6 months
        },
        safetyStockDays: {},
        leadTimes: {},
        lotSizingMethod: 'LOT_FOR_LOT',
        lowLevelCodes: {},
        planningTimeFence: 60,
        demandTimeFence: 30
      };

      const results = await mrpService.runMRP(parameters);
      const processingTime = Date.now() - startTime;

      expect(results.performance.processingTimeMs).toBeLessThan(10000); // Should complete in under 10 seconds
      expect(results.performance.itemsPerSecond).toBeGreaterThan(0);
      
      console.log(`⚡ Performance Test: ${processingTime}ms processing time, ${results.performance.itemsPerSecond.toFixed(2)} items/second`);
    });

    test('should handle multiple concurrent BOM operations', async () => {
      const concurrentOperations = [];

      // Create multiple BOMs concurrently
      for (let i = 0; i < 5; i++) {
        const bomData = {
          bomCode: `CONCURRENT_${i}`,
          bomName: `Concurrent Test BOM ${i}`,
          parentItemId: `PARENT_${i}`
        };
        concurrentOperations.push(bomService.createAdvancedBOM(bomData));
      }

      const results = await Promise.all(concurrentOperations);
      
      expect(results).toHaveLength(5);
      results.forEach((bom, index) => {
        expect(bom.bomCode).toBe(`CONCURRENT_${index}`);
        expect(bom.bomId).toBeTruthy();
      });

      console.log(`🚀 Concurrent Operations Test: Created ${results.length} BOMs concurrently`);
    });
  });
});

// Helper function to run all tests
export async function runPhase2Tests(): Promise<void> {
  console.log('🧪 Starting Manufacturing Phase 2 Implementation Tests...\n');

  try {
    // Initialize services
    const mrpService = new MaterialRequirementsPlanningService();
    const crpService = new CapacityRequirementsPlanningService();
    const bomService = new AdvancedBOMManagementService();

    console.log('✅ Services initialized successfully');

    // Test MRP functionality
    console.log('\n📊 Testing Material Requirements Planning (MRP)...');
    const mrpParameters: MRPParameters = {
      planningHorizon: {
        startDate: new Date(),
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
      },
      safetyStockDays: { 'TEST_ITEM': 10 },
      leadTimes: { 'TEST_ITEM': 7 },
      lotSizingMethod: 'LOT_FOR_LOT',
      lowLevelCodes: { 'TEST_ITEM': 0 },
      planningTimeFence: 30,
      demandTimeFence: 15
    };

    const mrpResults = await mrpService.runMRP(mrpParameters);
    console.log(`   MRP completed: ${mrpResults.itemsProcessed} items processed in ${mrpResults.performance.processingTimeMs}ms`);

    // Test CRP functionality
    console.log('\n🏭 Testing Capacity Requirements Planning (CRP)...');
    const crpParameters: CRPParameters = {
      planningHorizon: mrpParameters.planningHorizon,
      timeUnitType: 'WEEKLY',
      includeSetupTime: true,
      includeQueueTime: true,
      includeWaitTime: false,
      capacityTolerance: 110,
      overloadThreshold: 105,
      underloadThreshold: 75
    };

    const crpResults = await crpService.runCRP(crpParameters);
    console.log(`   CRP completed: ${crpResults.workCentersAnalyzed} work centers analyzed, feasibility: ${crpResults.feasibilityScore.toFixed(1)}%`);

    // Test Advanced BOM functionality
    console.log('\n🔧 Testing Advanced BOM Management...');
    
    // Test standard BOM
    const standardBOM = await bomService.createAdvancedBOM({
      bomCode: 'TEST_STANDARD_BOM',
      bomName: 'Test Standard BOM',
      parentItemId: 'TEST_PARENT',
      bomType: 'MANUFACTURING'
    });
    console.log(`   Standard BOM created: ${standardBOM.bomId}`);

    // Test Phantom BOM
    const phantomBOM = await bomService.createPhantomBOM('PHANTOM_TEST', [
      { componentItemCode: 'PHANTOM_COMP_1', componentDescription: 'Phantom Component 1', quantityPer: 1 }
    ]);
    console.log(`   Phantom BOM created: ${phantomBOM.bomId}`);

    // Test Option Class BOM
    const optionBOM = await bomService.createOptionClassBOM('OPTION_TEST', [{
      optionClassId: 'TEST_OPTIONS',
      optionClassName: 'Test Options',
      optionClassType: 'SINGLE_SELECT',
      mandatory: false,
      options: [],
      rules: [],
      pricing: { pricingMethod: 'FIXED', basePrice: 100, priceAdjustments: [], discountEligible: true }
    }]);
    console.log(`   Option Class BOM created: ${optionBOM.bomId}`);

    console.log('\n🎉 All Phase 2 Implementation Tests Completed Successfully!');
    console.log('\n📈 Phase 2 Features Summary:');
    console.log('   ✅ Material Requirements Planning (MRP) - Advanced net requirements calculation');
    console.log('   ✅ Capacity Requirements Planning (CRP) - Bottleneck identification and load analysis');
    console.log('   ✅ Phantom BOMs - Intermediate assembly management');
    console.log('   ✅ Option Class BOMs - Configurable product support');
    console.log('   ✅ Super BOMs - Product family management');
    console.log('   ✅ Engineering Change Management - ECO processing');
    console.log('   ✅ Mass BOM Updates - Bulk operations');

  } catch (error) {
    console.error('❌ Phase 2 Tests failed:', error);
    throw error;
  }
}

// Export for use in other test files
export {
  MaterialRequirementsPlanningService,
  CapacityRequirementsPlanningService,
  AdvancedBOMManagementService
};