#!/usr/bin/env node

/**
 * Asset Management Demo Script
 * Demonstrates the full asset management capabilities of Titan Grove
 */

import TitanGrove from '../src/business-suite';

async function demonstrateAssetManagement() {
  console.log('🏢 Starting Titan Grove Asset Management Demo...\n');
  
  // Initialize Titan Grove Business Suite
  const titanGrove = new TitanGrove({
    modules: {
      assets: true,
      scm: true,
      financial: true
    }
  });

  console.log('📦 Asset Management Module Initialized\n');

  // 1. Asset Lifecycle Management Demo
  console.log('🔄 ASSET LIFECYCLE MANAGEMENT DEMO');
  console.log('=====================================');

  // Create a new asset
  console.log('\n1. Creating a new production server asset...');
  const asset = await titanGrove.processBusinessTransaction('CREATE_ASSET', {
    asset: {
      assetNumber: 'SRV-001',
      assetName: 'Production Web Server',
      description: 'Primary web server for e-commerce application',
      category: 'IT_HARDWARE',
      assetType: 'Server',
      manufacturer: 'Dell',
      model: 'PowerEdge R750',
      serialNumber: 'DL123456789',
      status: 'ACTIVE',
      condition: 'EXCELLENT',
      acquisitionDate: new Date('2023-01-15'),
      purchasePrice: 18000,
      currentValue: 15000,
      depreciationMethod: 'STRAIGHT_LINE',
      usefulLife: 5,
      location: {
        locationId: 'DC-MAIN',
        locationName: 'Primary Data Center',
        building: 'Building A',
        floor: '3rd Floor',
        room: 'Server Room 1',
        address: {
          street: '100 Enterprise Blvd',
          city: 'Tech City',
          state: 'CA',
          postalCode: '94105',
          country: 'USA'
        }
      },
      warrantyInfo: {
        warrantyNumber: 'DELL-WTY-789012',
        startDate: new Date('2023-01-15'),
        endDate: new Date('2026-01-15'),
        coverage: '3 Year ProSupport Plus',
        provider: 'Dell Technologies',
        isActive: true
      },
      specifications: {
        CPU: '2x Intel Xeon Gold 5320',
        Memory: '128GB DDR4 ECC',
        Storage: '4x 2TB NVMe SSD RAID 10',
        Network: '4x 25GbE + 2x 100GbE'
      },
      tags: ['production', 'critical', 'web-tier', '24x7'],
      createdBy: 'asset-manager',
      updatedBy: 'asset-manager'
    }
  });

  console.log(`✅ Asset created successfully: ${asset.asset.assetName} (ID: ${asset.asset.id})`);

  // Transfer asset to different location
  console.log('\n2. Transferring asset to disaster recovery site...');
  const transferResult = await titanGrove.processBusinessTransaction('TRANSFER_ASSET', {
    assetId: asset.asset.id,
    fromLocation: {
      locationId: 'DC-MAIN',
      locationName: 'Primary Data Center',
      address: {
        street: '100 Enterprise Blvd',
        city: 'Tech City',
        state: 'CA',
        postalCode: '94105',
        country: 'USA'
      }
    },
    toLocation: {
      locationId: 'DC-DR',
      locationName: 'Disaster Recovery Center',
      address: {
        street: '200 Backup Ave',
        city: 'Backup City',
        state: 'TX',
        postalCode: '75201',
        country: 'USA'
      }
    },
    transferredBy: 'datacenter-ops',
    reason: 'Disaster recovery site failover test'
  });

  console.log(`✅ Asset transferred successfully to: ${transferResult.newLocation.locationName}`);

  // 2. Install Base Management Demo
  console.log('\n\n📍 INSTALL BASE MANAGEMENT DEMO');
  console.log('===============================');

  console.log('\n1. Creating customer install base...');
  const installBase = await titanGrove.assets.createInstallBase({
    instanceNumber: 'IB-ACME-001',
    assetId: asset.asset.id,
    customerId: 'CUST-12345',
    customerName: 'Acme Manufacturing Corp',
    installationDate: new Date('2023-02-01'),
    configurationId: 'CFG-PROD-WEB-01',
    status: 'OPERATIONAL',
    location: {
      locationId: 'ACME-HQ',
      locationName: 'Acme Headquarters',
      building: 'Main Building',
      floor: 'IT Floor',
      room: 'Server Room',
      address: {
        street: '555 Manufacturing Drive',
        city: 'Industrial City',
        state: 'OH',
        postalCode: '44101',
        country: 'USA'
      }
    },
    configuration: [
      {
        itemId: 'OS-RHEL-8',
        itemName: 'Red Hat Enterprise Linux 8',
        quantity: 1,
        serialNumbers: ['RHEL-LIC-789456'],
        version: '8.7',
        installDate: new Date('2023-02-01'),
        isActive: true
      },
      {
        itemId: 'APP-ECOMMERCE',
        itemName: 'E-Commerce Application Suite',
        quantity: 1,
        serialNumbers: ['APP-ECOM-123789'],
        version: '2.1.5',
        installDate: new Date('2023-02-01'),
        isActive: true
      }
    ],
    serviceHistory: [],
    supportLevel: 'ENTERPRISE'
  });

  console.log(`✅ Install base created: ${installBase.instanceNumber} for ${installBase.customerName}`);

  console.log('\n2. Recording service activity...');
  const serviceRecord = await titanGrove.processBusinessTransaction('INSTALL_BASE_SERVICE', {
    installBaseId: installBase.id,
    serviceRecord: {
      serviceDate: new Date(),
      serviceType: 'MAINTENANCE',
      description: 'Monthly preventive maintenance - system health check',
      technicianId: 'TECH-456',
      technicianName: 'Sarah Johnson',
      duration: 3,
      cost: 750,
      partsUsed: [
        {
          partId: 'FAN-COOLING-001',
          partName: 'Server Cooling Fan Assembly',
          quantity: 1,
          cost: 125,
          serialNumber: 'FAN-SN-789123'
        }
      ],
      outcome: 'SUCCESSFUL',
      notes: 'All systems operating normally. Replaced one cooling fan as preventive measure.',
      nextServiceRecommended: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    }
  });

  console.log(`✅ Service recorded successfully: ${serviceRecord.serviceRecord.description}`);

  // 3. Enterprise Asset Management Demo
  console.log('\n\n🔧 ENTERPRISE ASSET MANAGEMENT DEMO');
  console.log('===================================');

  console.log('\n1. Creating maintenance schedule...');
  const maintenanceSchedule = await titanGrove.assets.createMaintenanceSchedule({
    assetId: asset.asset.id,
    maintenanceType: 'PREVENTIVE',
    title: 'Quarterly Server Maintenance',
    description: 'Comprehensive quarterly maintenance including firmware updates, hardware inspection, and performance optimization',
    frequency: 'QUARTERLY',
    nextDue: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
    estimatedDuration: 6,
    estimatedCost: 1200,
    priority: 'MEDIUM',
    assignedTechnicianId: 'TECH-789',
    isActive: true
  });

  console.log(`✅ Maintenance schedule created: ${maintenanceSchedule.title}`);

  console.log('\n2. Creating work order...');
  const workOrderResult = await titanGrove.processBusinessTransaction('CREATE_WORK_ORDER', {
    workOrder: {
      assetId: asset.asset.id,
      title: 'Security Patch Installation',
      description: 'Install critical security patches for operating system and applications',
      type: 'CORRECTIVE',
      priority: 'HIGH',
      status: 'OPEN',
      requestedBy: 'security-team',
      requestDate: new Date(),
      estimatedCost: 800,
      actualCost: 0,
      laborHours: 4,
      materials: [
        {
          materialId: 'LIC-SEC-PATCH',
          materialName: 'Security Patch License',
          quantityRequired: 1,
          quantityUsed: 0,
          unitCost: 200,
          totalCost: 200,
          reservedQuantity: 1
        }
      ]
    },
    locationId: 'DC-DR'
  });

  console.log(`✅ Work order created: ${workOrderResult.workOrder.workOrderNumber}`);

  console.log('\n3. Analyzing spare parts inventory...');
  const inventoryOptimization = await titanGrove.assets.optimizeSparePartsInventory('DC-DR');
  
  console.log(`✅ Inventory analysis completed - Found ${inventoryOptimization.excess.length} excess items and ${inventoryOptimization.shortages.length} shortage items`);

  // 4. Compliance and Audit Demo
  console.log('\n\n✅ COMPLIANCE AND AUDIT DEMO');
  console.log('============================');

  console.log('\n1. Creating compliance requirement...');
  const complianceReq = await titanGrove.assets.createComplianceRequirement({
    requirementName: 'SOC 2 Type II Data Center Compliance',
    regulatoryBody: 'AICPA',
    description: 'Annual SOC 2 Type II audit for data center security, availability, and confidentiality controls',
    applicableAssetTypes: ['IT_HARDWARE', 'INFRASTRUCTURE'],
    inspectionFrequency: 'ANNUALLY',
    renewalFrequency: 'ANNUALLY',
    isActive: true
  });

  console.log(`✅ Compliance requirement created: ${complianceReq.requirementName}`);

  console.log('\n2. Scheduling asset audit...');
  const audit = await titanGrove.assets.scheduleAudit({
    auditNumber: 'AUDIT-2024-Q1-001',
    auditType: 'PHYSICAL',
    auditDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    auditorId: 'AUDITOR-001',
    auditorName: 'Michael Thompson, CPA',
    scope: 'LOCATION',
    targetLocations: ['DC-DR'],
    status: 'PLANNED'
  });

  console.log(`✅ Audit scheduled: ${audit.auditNumber} by ${audit.auditorName}`);

  // 5. Analytics and Reporting Demo
  console.log('\n\n📊 ANALYTICS AND REPORTING DEMO');
  console.log('===============================');

  console.log('\n1. Getting asset metrics...');
  const assetMetrics = await titanGrove.assets.getAssetMetrics();
  console.log('📈 Asset Metrics:');
  console.log(`   - Total Assets: ${assetMetrics.totalAssets}`);
  console.log(`   - Total Value: $${assetMetrics.totalValue.toLocaleString()}`);
  console.log(`   - Average Age: ${assetMetrics.averageAge} years`);
  console.log(`   - Utilization Rate: ${assetMetrics.utilizationRate}%`);

  console.log('\n2. Getting maintenance metrics...');
  const maintenanceMetrics = await titanGrove.assets.getMaintenanceMetrics();
  console.log('🔧 Maintenance Metrics:');
  console.log(`   - Total Work Orders: ${maintenanceMetrics.totalWorkOrders}`);
  console.log(`   - Completed Work Orders: ${maintenanceMetrics.completedWorkOrders}`);
  console.log(`   - Schedule Compliance: ${maintenanceMetrics.scheduleCompliance}%`);
  console.log(`   - MTBF: ${maintenanceMetrics.mtbf} hours`);
  console.log(`   - MTTR: ${maintenanceMetrics.mttr} hours`);

  console.log('\n3. Calculating asset depreciation...');
  const depreciation = await titanGrove.assets.calculateAssetDepreciation(asset.asset.id, new Date());
  console.log('💰 Depreciation Analysis:');
  console.log(`   - Original Value: $${depreciation.originalValue.toLocaleString()}`);
  console.log(`   - Current Book Value: $${depreciation.depreciatedValue.toLocaleString()}`);
  console.log(`   - Accumulated Depreciation: $${depreciation.accumulatedDepreciation.toLocaleString()}`);
  console.log(`   - Remaining Value: $${depreciation.remainingValue.toLocaleString()}`);

  console.log('\n4. Generating asset inventory report...');
  const report = await titanGrove.assets.generateAssetReport('INVENTORY', {
    category: 'IT_HARDWARE',
    status: 'ACTIVE'
  });
  
  console.log(`📋 Report Generated: ${report.reportType} report at ${report.generatedAt}`);

  console.log('\n\n🎉 ASSET MANAGEMENT DEMO COMPLETED SUCCESSFULLY!');
  console.log('===============================================');
  console.log('\n✨ Features Demonstrated:');
  console.log('   ✅ Asset Lifecycle Management - Creation, transfer, disposal tracking');
  console.log('   ✅ Asset Tracking - Location tracking and visibility');
  console.log('   ✅ Install Base Management - Customer site installations');
  console.log('   ✅ Enterprise Asset Management - Maintenance scheduling and work orders');
  console.log('   ✅ Compliance and Audit - Regulatory requirements and auditing');
  console.log('   ✅ Analytics and Reporting - KPIs, metrics, and depreciation');
  console.log('   ✅ Cross-Module Integration - SCM, Financial, and Project coordination');
  console.log('   ✅ Transaction Auditing - Complete audit trail for all activities');
  
  console.log('\n🏆 Titan Grove Asset Management Module is fully operational!');
  console.log('   Ready for capital-intensive enterprises requiring comprehensive');
  console.log('   asset tracking, lifecycle management, and regulatory compliance.\n');
}

// Run the demo
demonstrateAssetManagement().catch(console.error);