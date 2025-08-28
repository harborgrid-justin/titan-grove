import { AssetManager, Asset, InstallBase, AssetLocation, MaintenanceSchedule, AssetWorkOrder } from '../src/modules/assets';

describe('AssetManager', () => {
  let assetManager: AssetManager;

  beforeEach(() => {
    assetManager = new AssetManager();
  });

  describe('Asset Lifecycle Management', () => {
    it('should create a new asset with lifecycle event', async () => {
      const assetData = {
        assetNumber: 'AST-001',
        assetName: 'Production Server',
        description: 'Main production server for web applications',
        category: 'IT_HARDWARE' as const,
        assetType: 'Server',
        manufacturer: 'Dell',
        model: 'PowerEdge R740',
        serialNumber: 'SN123456789',
        status: 'ACTIVE' as const,
        condition: 'EXCELLENT' as const,
        acquisitionDate: new Date('2023-01-15'),
        purchasePrice: 15000,
        currentValue: 12000,
        depreciationMethod: 'STRAIGHT_LINE' as const,
        usefulLife: 5,
        location: {
          locationId: 'DC-001',
          locationName: 'Data Center 1',
          building: 'Main Building',
          floor: '2nd Floor',
          room: 'Server Room A',
          address: {
            street: '123 Tech Drive',
            city: 'Tech City',
            state: 'TC',
            postalCode: '12345',
            country: 'USA'
          }
        } as AssetLocation,
        warrantyInfo: {
          warrantyNumber: 'WAR-123456',
          startDate: new Date('2023-01-15'),
          endDate: new Date('2026-01-15'),
          coverage: '3 Year Standard Warranty',
          provider: 'Dell Inc.',
          isActive: true
        },
        specifications: {
          CPU: 'Intel Xeon Silver 4214',
          RAM: '32GB DDR4',
          Storage: '2TB SSD'
        },
        tags: ['production', 'critical', 'web-server'],
        createdBy: 'admin',
        updatedBy: 'admin'
      };

      const asset = await assetManager.createAsset(assetData);

      expect(asset).toBeDefined();
      expect(asset.id).toBeTruthy();
      expect(asset.assetName).toBe('Production Server');
      expect(asset.assetNumber).toBe('AST-001');
      expect(asset.status).toBe('ACTIVE');
      expect(asset.createdAt).toBeInstanceOf(Date);
      expect(asset.updatedAt).toBeInstanceOf(Date);
    });

    it('should transfer asset between locations', async () => {
      const assetId = 'asset_123';
      const fromLocation: AssetLocation = {
        locationId: 'DC-001',
        locationName: 'Data Center 1',
        address: {
          street: '123 Tech Drive',
          city: 'Tech City',
          state: 'TC',
          postalCode: '12345',
          country: 'USA'
        }
      };
      const toLocation: AssetLocation = {
        locationId: 'DC-002',
        locationName: 'Data Center 2',
        address: {
          street: '456 Tech Avenue',
          city: 'Tech City',
          state: 'TC',
          postalCode: '12346',
          country: 'USA'
        }
      };

      await expect(
        assetManager.transferAsset(assetId, fromLocation, toLocation, 'admin', 'Capacity expansion')
      ).resolves.not.toThrow();
    });

    it('should dispose asset properly', async () => {
      const assetId = 'asset_123';
      const disposalReason = 'End of useful life';
      const disposalValue = 1000;
      const disposedBy = 'admin';

      await expect(
        assetManager.disposeAsset(assetId, disposalReason, disposalValue, disposedBy)
      ).resolves.not.toThrow();
    });
  });

  describe('Asset Tracking', () => {
    it('should track asset location', async () => {
      const assetId = 'asset_123';
      
      const location = await assetManager.trackAssetLocation(assetId);
      
      expect(location).toBeDefined();
      expect(location.locationId).toBeTruthy();
      expect(location.locationName).toBeTruthy();
      expect(location.address).toBeDefined();
    });

    it('should calculate asset utilization', async () => {
      const assetId = 'asset_123';
      const startDate = new Date('2023-01-01');
      const endDate = new Date('2023-12-31');
      
      const utilization = await assetManager.getAssetUtilization(assetId, startDate, endDate);
      
      expect(typeof utilization).toBe('number');
      expect(utilization).toBeGreaterThanOrEqual(0);
      expect(utilization).toBeLessThanOrEqual(100);
    });

    it('should search assets by criteria', async () => {
      const criteria = {
        category: 'IT_HARDWARE',
        status: 'ACTIVE',
        tags: ['production']
      };
      
      const assets = await assetManager.searchAssets(criteria);
      
      expect(Array.isArray(assets)).toBe(true);
    });
  });

  describe('Install Base Management', () => {
    it('should create install base', async () => {
      const installBaseData = {
        instanceNumber: 'IB-001',
        assetId: 'asset_123',
        customerId: 'customer_456',
        customerName: 'Acme Corporation',
        installationDate: new Date('2023-01-20'),
        configurationId: 'config_789',
        status: 'OPERATIONAL' as const,
        location: {
          locationId: 'customer-site-001',
          locationName: 'Acme Main Office',
          address: {
            street: '789 Business Blvd',
            city: 'Business City',
            state: 'BC',
            postalCode: '54321',
            country: 'USA'
          }
        } as AssetLocation,
        configuration: [],
        serviceHistory: [],
        supportLevel: 'PREMIUM' as const
      };

      const installBase = await assetManager.createInstallBase(installBaseData);

      expect(installBase).toBeDefined();
      expect(installBase.id).toBeTruthy();
      expect(installBase.instanceNumber).toBe('IB-001');
      expect(installBase.customerName).toBe('Acme Corporation');
      expect(installBase.status).toBe('OPERATIONAL');
    });

    it('should schedule service for install base', async () => {
      const installBaseId = 'install_123';
      const serviceType = 'MAINTENANCE' as const;
      const scheduledDate = new Date('2024-01-15');
      const technicianId = 'tech_456';

      const serviceId = await assetManager.scheduleService(
        installBaseId, 
        serviceType, 
        scheduledDate, 
        technicianId
      );

      expect(serviceId).toBeTruthy();
      expect(typeof serviceId).toBe('string');
    });
  });

  describe('Enterprise Asset Management', () => {
    it('should create maintenance schedule', async () => {
      const scheduleData = {
        assetId: 'asset_123',
        maintenanceType: 'PREVENTIVE' as const,
        title: 'Monthly Server Maintenance',
        description: 'Regular preventive maintenance for production server',
        frequency: 'MONTHLY' as const,
        nextDue: new Date('2024-02-01'),
        estimatedDuration: 4,
        estimatedCost: 500,
        priority: 'MEDIUM' as const,
        isActive: true
      };

      const schedule = await assetManager.createMaintenanceSchedule(scheduleData);

      expect(schedule).toBeDefined();
      expect(schedule.id).toBeTruthy();
      expect(schedule.title).toBe('Monthly Server Maintenance');
      expect(schedule.maintenanceType).toBe('PREVENTIVE');
      expect(schedule.isActive).toBe(true);
    });

    it('should create work order', async () => {
      const workOrderData = {
        assetId: 'asset_123',
        title: 'Replace Cooling Fan',
        description: 'Replace faulty cooling fan in server',
        type: 'CORRECTIVE' as const,
        priority: 'HIGH' as const,
        status: 'OPEN' as const,
        requestedBy: 'system',
        requestDate: new Date(),
        estimatedCost: 200,
        actualCost: 0,
        laborHours: 2,
        materials: []
      };

      const workOrder = await assetManager.createWorkOrder(workOrderData);

      expect(workOrder).toBeDefined();
      expect(workOrder.id).toBeTruthy();
      expect(workOrder.workOrderNumber).toBeTruthy();
      expect(workOrder.title).toBe('Replace Cooling Fan');
      expect(workOrder.type).toBe('CORRECTIVE');
      expect(workOrder.status).toBe('OPEN');
    });

    it('should identify obsolete assets', async () => {
      const criteria = {
        lastUsedBefore: new Date('2022-01-01'),
        condition: 'POOR' as const,
        utilizationThreshold: 10
      };

      const obsoleteAssets = await assetManager.identifyObsoleteAssets(criteria);

      expect(Array.isArray(obsoleteAssets)).toBe(true);
    });

    it('should optimize spare parts inventory', async () => {
      const locationId = 'warehouse_001';
      
      const optimization = await assetManager.optimizeSparePartsInventory(locationId);
      
      expect(optimization).toBeDefined();
      expect(Array.isArray(optimization.excess)).toBe(true);
      expect(Array.isArray(optimization.shortages)).toBe(true);
    });
  });

  describe('Analytics and Reporting', () => {
    it('should get asset metrics', async () => {
      const metrics = await assetManager.getAssetMetrics();

      expect(metrics).toBeDefined();
      expect(typeof metrics.totalAssets).toBe('number');
      expect(typeof metrics.totalValue).toBe('number');
      expect(typeof metrics.averageAge).toBe('number');
      expect(typeof metrics.utilizationRate).toBe('number');
      expect(typeof metrics.assetsByCategory).toBe('object');
      expect(typeof metrics.assetsByStatus).toBe('object');
    });

    it('should get maintenance metrics', async () => {
      const metrics = await assetManager.getMaintenanceMetrics();

      expect(metrics).toBeDefined();
      expect(typeof metrics.totalWorkOrders).toBe('number');
      expect(typeof metrics.completedWorkOrders).toBe('number');
      expect(typeof metrics.mtbf).toBe('number');
      expect(typeof metrics.mttr).toBe('number');
      expect(typeof metrics.scheduleCompliance).toBe('number');
    });

    it('should calculate asset depreciation', async () => {
      const assetId = 'asset_123';
      const asOfDate = new Date('2023-12-31');

      const depreciation = await assetManager.calculateAssetDepreciation(assetId, asOfDate);

      expect(depreciation).toBeDefined();
      expect(typeof depreciation.originalValue).toBe('number');
      expect(typeof depreciation.depreciatedValue).toBe('number');
      expect(typeof depreciation.accumulatedDepreciation).toBe('number');
      expect(typeof depreciation.remainingValue).toBe('number');
    });

    it('should generate asset reports', async () => {
      const reportType = 'INVENTORY' as const;
      const filters = { category: 'IT_HARDWARE' };

      const report = await assetManager.generateAssetReport(reportType, filters);

      expect(report).toBeDefined();
      expect(report.reportType).toBe('INVENTORY');
      expect(report.generatedAt).toBeInstanceOf(Date);
      expect(Array.isArray(report.data)).toBe(true);
    });
  });

  describe('Compliance and Audit', () => {
    it('should create compliance requirement', async () => {
      const requirementData = {
        requirementName: 'Annual Safety Inspection',
        regulatoryBody: 'OSHA',
        description: 'Annual safety inspection for industrial equipment',
        applicableAssetTypes: ['EQUIPMENT', 'MACHINERY'],
        inspectionFrequency: 'ANNUALLY',
        renewalFrequency: 'ANNUALLY',
        isActive: true
      };

      const requirement = await assetManager.createComplianceRequirement(requirementData);

      expect(requirement).toBeDefined();
      expect(requirement.id).toBeTruthy();
      expect(requirement.requirementName).toBe('Annual Safety Inspection');
      expect(requirement.regulatoryBody).toBe('OSHA');
      expect(requirement.isActive).toBe(true);
    });

    it('should schedule asset audit', async () => {
      const auditData = {
        auditNumber: 'AUDIT-2024-001',
        auditType: 'PHYSICAL' as const,
        auditDate: new Date('2024-03-01'),
        auditorId: 'auditor_123',
        auditorName: 'John Auditor',
        scope: 'LOCATION' as const,
        targetLocations: ['DC-001', 'DC-002'],
        status: 'PLANNED' as const
      };

      const audit = await assetManager.scheduleAudit(auditData);

      expect(audit).toBeDefined();
      expect(audit.id).toBeTruthy();
      expect(audit.auditNumber).toBe('AUDIT-2024-001');
      expect(audit.auditType).toBe('PHYSICAL');
      expect(audit.status).toBe('PLANNED');
      expect(Array.isArray(audit.findings)).toBe(true);
    });
  });
});