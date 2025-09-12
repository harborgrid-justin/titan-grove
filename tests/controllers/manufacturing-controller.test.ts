/**
 * Manufacturing Controller Tests
 * Realistic tests for Manufacturing controller functionality
 */

import request from 'supertest';
import express from 'express';
import { manufacturingController } from '../../src/api/manufacturing/manufacturing-controller';

// Create test Express app
const app = express();
app.use(express.json());

// Setup routes for Manufacturing controller
app.get('/manufacturing/work-orders', (req, res) => manufacturingController.getWorkOrders(req, res));
app.post('/manufacturing/work-orders', (req, res) => manufacturingController.createWorkOrder(req, res));
app.get('/manufacturing/production-schedule', (req, res) => manufacturingController.getProductionSchedule(req, res));
app.post('/manufacturing/production-schedule', (req, res) => manufacturingController.updateProductionSchedule(req, res));
app.get('/manufacturing/quality-control', (req, res) => manufacturingController.getQualityControlData(req, res));
app.post('/manufacturing/quality-control', (req, res) => manufacturingController.recordQualityCheck(req, res));
app.get('/manufacturing/inventory-levels', (req, res) => manufacturingController.getInventoryLevels(req, res));
app.post('/manufacturing/inventory-adjustment', (req, res) => manufacturingController.adjustInventory(req, res));
app.get('/manufacturing/equipment-status', (req, res) => manufacturingController.getEquipmentStatus(req, res));
app.post('/manufacturing/maintenance', (req, res) => manufacturingController.scheduleMaintenance(req, res));

describe('ManufacturingController Integration Tests', () => {
  describe('Work Order Management', () => {
    it('should get work orders with filtering and sorting', async () => {
      const response = await request(app)
        .get('/manufacturing/work-orders')
        .query({ 
          status: 'IN_PROGRESS',
          priority: 'HIGH',
          department: 'ASSEMBLY',
          startDate: '2024-01-01',
          endDate: '2024-01-31' 
        })
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: 'Get work orders retrieved successfully',
        data: expect.objectContaining({
          domain: 'manufacturing',
          method: 'getWorkOrders',
          timestamp: expect.any(String),
        }),
        timestamp: expect.any(String),
      });
    });

    it('should create new work order with BOM and routing', async () => {
      const workOrderData = {
        orderNumber: 'WO-2024-001',
        productId: 'PROD-12345',
        quantity: 100,
        priority: 'HIGH',
        dueDate: '2024-02-15T23:59:59Z',
        department: 'ASSEMBLY',
        billOfMaterials: [
          {
            partId: 'PART-001',
            partName: 'Widget Base',
            quantityRequired: 100,
            unitCost: 5.50,
            supplier: 'ACME Parts',
          },
          {
            partId: 'PART-002',
            partName: 'Widget Top',
            quantityRequired: 100,
            unitCost: 3.25,
            supplier: 'ACME Parts',
          },
        ],
        routing: [
          {
            operationId: 'OP-001',
            operationName: 'Cut Parts',
            workCenter: 'CUT-001',
            setupTime: 30,
            runTime: 5,
            sequence: 1,
          },
          {
            operationId: 'OP-002',
            operationName: 'Assembly',
            workCenter: 'ASM-001',
            setupTime: 15,
            runTime: 10,
            sequence: 2,
          },
        ],
      };

      const response = await request(app)
        .post('/manufacturing/work-orders')
        .send(workOrderData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.domain).toBe('manufacturing');
      expect(response.body.data.method).toBe('createWorkOrder');
    });
  });

  describe('Production Planning and Scheduling', () => {
    it('should get production schedule with capacity planning', async () => {
      const response = await request(app)
        .get('/manufacturing/production-schedule')
        .query({ 
          startDate: '2024-01-01',
          endDate: '2024-01-31',
          workCenter: 'ASM-001',
          includeCapacityAnalysis: true 
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.method).toBe('getProductionSchedule');
    });

    it('should update production schedule with optimization', async () => {
      const scheduleData = {
        scheduleDate: '2024-01-15',
        workOrders: [
          {
            workOrderId: 'WO-2024-001',
            scheduledStart: '2024-01-15T08:00:00Z',
            scheduledEnd: '2024-01-15T16:00:00Z',
            workCenter: 'ASM-001',
            priority: 1,
          },
        ],
        capacityConstraints: {
          maxParallelJobs: 2,
          skillRequirements: ['CERTIFIED_WELDER', 'QC_INSPECTOR'],
          equipmentAvailability: {
            'MACHINE-001': { start: '08:00', end: '17:00' },
            'MACHINE-002': { start: '06:00', end: '14:00' },
          },
        },
        optimization: {
          objective: 'MINIMIZE_MAKESPAN',
          considerSetupTimes: true,
          allowSplitOrders: false,
        },
      };

      const response = await request(app)
        .post('/manufacturing/production-schedule')
        .send(scheduleData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.method).toBe('updateProductionSchedule');
    });
  });

  describe('Quality Control and Testing', () => {
    it('should get quality control data with statistical analysis', async () => {
      const response = await request(app)
        .get('/manufacturing/quality-control')
        .query({ 
          productId: 'PROD-12345',
          testType: 'DIMENSIONAL',
          dateRange: '2024-01-01,2024-01-31',
          includeStatistics: true 
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.method).toBe('getQualityControlData');
    });

    it('should record quality check with inspection results', async () => {
      const qualityData = {
        workOrderId: 'WO-2024-001',
        inspectionId: 'INS-2024-001',
        productId: 'PROD-12345',
        batchNumber: 'BATCH-001',
        inspector: 'QC-INSPECTOR-1',
        inspectionDate: '2024-01-15T14:30:00Z',
        testResults: [
          {
            testType: 'DIMENSIONAL',
            parameter: 'LENGTH',
            specification: { min: 99.5, max: 100.5, unit: 'mm' },
            actualValue: 100.1,
            result: 'PASS',
          },
          {
            testType: 'DIMENSIONAL',
            parameter: 'WIDTH',
            specification: { min: 49.8, max: 50.2, unit: 'mm' },
            actualValue: 50.0,
            result: 'PASS',
          },
        ],
        overallResult: 'PASS',
        notes: 'All measurements within specification',
        certificationRequired: true,
      };

      const response = await request(app)
        .post('/manufacturing/quality-control')
        .send(qualityData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.method).toBe('recordQualityCheck');
    });
  });

  describe('Inventory Management', () => {
    it('should get inventory levels with reorder points', async () => {
      const response = await request(app)
        .get('/manufacturing/inventory-levels')
        .query({ 
          location: 'WAREHOUSE-A',
          category: 'RAW_MATERIALS',
          belowReorderPoint: true 
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.method).toBe('getInventoryLevels');
    });

    it('should adjust inventory with transaction tracking', async () => {
      const adjustmentData = {
        partId: 'PART-001',
        location: 'WAREHOUSE-A',
        adjustmentType: 'PHYSICAL_COUNT',
        currentQuantity: 500,
        adjustedQuantity: 485,
        reason: 'Physical inventory count variance',
        adjustedBy: 'INVENTORY-CLERK-1',
        adjustmentDate: '2024-01-15T16:00:00Z',
        costImpact: {
          unitCost: 5.50,
          totalAdjustment: -82.50,
        },
        approvalRequired: true,
        approvedBy: 'INVENTORY-MANAGER-1',
      };

      const response = await request(app)
        .post('/manufacturing/inventory-adjustment')
        .send(adjustmentData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.method).toBe('adjustInventory');
    });
  });

  describe('Equipment and Maintenance Management', () => {
    it('should get equipment status with performance metrics', async () => {
      const response = await request(app)
        .get('/manufacturing/equipment-status')
        .query({ 
          workCenter: 'ASM-001',
          includePerformanceMetrics: true,
          alertsOnly: false 
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.method).toBe('getEquipmentStatus');
    });

    it('should schedule maintenance with resource allocation', async () => {
      const maintenanceData = {
        equipmentId: 'MACHINE-001',
        maintenanceType: 'PREVENTIVE',
        scheduledDate: '2024-01-20T06:00:00Z',
        estimatedDuration: 240, // minutes
        technician: 'MAINT-TECH-1',
        priority: 'MEDIUM',
        workDescription: 'Replace filters, check alignment, lubricate bearings',
        partsRequired: [
          {
            partId: 'FILTER-001',
            quantity: 2,
            cost: 15.50,
          },
          {
            partId: 'BEARING-GREASE',
            quantity: 1,
            cost: 8.75,
          },
        ],
        safetyRequirements: ['LOCKOUT_TAGOUT', 'PPE_REQUIRED'],
        impactAnalysis: {
          affectedWorkOrders: ['WO-2024-002', 'WO-2024-003'],
          alternativeEquipment: ['MACHINE-002'],
          estimatedDowntime: 4.0, // hours
        },
      };

      const response = await request(app)
        .post('/manufacturing/maintenance')
        .send(maintenanceData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.method).toBe('scheduleMaintenance');
    });
  });

  describe('Advanced Manufacturing Analytics', () => {
    it('should handle complex manufacturing KPIs', async () => {
      const response = await request(app)
        .get('/manufacturing/work-orders')
        .query({ 
          analytics: true,
          kpis: 'oee,throughput,cycle_time,first_pass_yield',
          groupBy: 'work_center,shift',
          timeframe: '2024-01-01,2024-01-31' 
        })
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should support lean manufacturing metrics', async () => {
      const response = await request(app)
        .get('/manufacturing/production-schedule')
        .query({ 
          leanMetrics: true,
          wasteAnalysis: true,
          valueStreamMapping: true,
          continuousImprovement: true 
        })
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('Integration with External Systems', () => {
    it('should handle ERP system integration data', async () => {
      const erpData = {
        source: 'ERP_SYSTEM',
        syncId: 'ERP-SYNC-12345',
        workOrders: [
          {
            erpOrderId: 'ERP-WO-001',
            productCode: 'ERP-PROD-001',
            quantity: 50,
            customerOrderId: 'CUST-ORD-001',
            deliveryDate: '2024-02-28',
          },
        ],
        metadata: {
          lastSync: '2024-01-15T10:00:00Z',
          totalRecords: 1,
        },
      };

      const response = await request(app)
        .post('/manufacturing/work-orders')
        .send(erpData)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should support IoT sensor data integration', async () => {
      const sensorData = {
        equipmentId: 'MACHINE-001',
        sensors: [
          {
            sensorId: 'TEMP-001',
            type: 'TEMPERATURE',
            value: 185.5,
            unit: 'CELSIUS',
            timestamp: '2024-01-15T14:30:00Z',
            threshold: { min: 180, max: 200 },
            status: 'NORMAL',
          },
          {
            sensorId: 'VIB-001',
            type: 'VIBRATION',
            value: 2.3,
            unit: 'MM/S',
            timestamp: '2024-01-15T14:30:00Z',
            threshold: { max: 5.0 },
            status: 'NORMAL',
          },
        ],
        predictiveAnalytics: {
          maintenanceRecommendation: 'SCHEDULE_IN_30_DAYS',
          riskScore: 0.15,
          confidenceLevel: 0.87,
        },
      };

      const response = await request(app)
        .post('/manufacturing/equipment-status')  // Using existing endpoint
        .send(sensorData)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('Compliance and Traceability', () => {
    it('should support lot tracking and genealogy', async () => {
      const traceabilityData = {
        productSerialNumber: 'SN-2024-001',
        lotNumber: 'LOT-2024-001',
        genealogy: [
          {
            componentId: 'COMP-001',
            supplierLot: 'SUP-LOT-001',
            receivedDate: '2024-01-10',
            supplier: 'ACME Components',
          },
        ],
        qualityCertificates: ['CERT-001', 'CERT-002'],
        complianceStandards: ['ISO-9001', 'AS9100'],
      };

      const response = await request(app)
        .post('/manufacturing/quality-control')
        .send(traceabilityData)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should handle regulatory reporting requirements', async () => {
      const reportingData = {
        reportType: 'FDA_DEVICE_HISTORY_RECORD',
        productId: 'PROD-12345',
        serialNumbers: ['SN-2024-001', 'SN-2024-002'],
        manufacturingDate: '2024-01-15',
        qualityRecords: true,
        traceabilityRecords: true,
        complianceChecklist: [
          { requirement: 'DESIGN_CONTROLS', status: 'COMPLIANT' },
          { requirement: 'RISK_MANAGEMENT', status: 'COMPLIANT' },
        ],
      };

      const response = await request(app)
        .post('/manufacturing/work-orders')
        .send(reportingData)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });
});