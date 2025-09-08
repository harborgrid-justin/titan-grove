// Manufacturing Pages - Business Ready Components with Integrated Business Logic
// Generated for Titan Grove Enterprise Manufacturing Suite

// Production Management Pages (10 pages)
export { default as ProductionPlanning } from './ProductionPlanning';
export { default as ProductionScheduling } from './ProductionScheduling';
export { default as CapacityManagement } from './CapacityManagement';
export { default as WorkOrderManagement } from './WorkOrderManagement';
export { default as BillOfMaterials } from './BillOfMaterials';
export { default as RoutingManagement } from './RoutingManagement';
export { default as MasterProductionSchedule } from './MasterProductionSchedule';
export { default as MaterialRequirements } from './MaterialRequirements';
export { default as ProductionControl } from './ProductionControl';
export { default as FlowManufacturing } from './FlowManufacturing';
export { default as ConfigureToOrder } from './ConfigureToOrder';

// Quality Control Pages (8 pages)
export { default as QualityInspection } from './QualityInspection';
export { default as QualityAssurance } from './QualityAssurance';
export { default as DefectTracking } from './DefectTracking';
export { default as QualityMetrics } from './QualityMetrics';
export { default as SixSigmaProjects } from './SixSigmaProjects';
export { default as ISO9001Compliance } from './ISO9001Compliance';
export { default as RegulatoryCompliance } from './RegulatoryCompliance';
export { default as ContinuousImprovement } from './ContinuousImprovement';

// Shop Floor Control Pages (7 pages)
export { default as ShopFloorControl } from './ShopFloorControl';
export { default as WorkCenterManagement } from './WorkCenterManagement';
export { default as OperatorInterface } from './OperatorInterface';
export { default as MachineMonitoring } from './MachineMonitoring';
export { default as ProductionTracking } from './ProductionTracking';
export { default as LaborTracking } from './LaborTracking';
export { default as InventoryTracking } from './InventoryTracking';

// Manufacturing Analytics Pages (6 pages)
export { default as OEEAnalytics } from './OEEAnalytics';
export { default as ProductionAnalytics } from './ProductionAnalytics';
export { default as CostAnalytics } from './CostAnalytics';
export { default as EfficiencyAnalytics } from './EfficiencyAnalytics';
export { default as ThroughputAnalysis } from './ThroughputAnalysis';
export { default as PerformanceDashboard } from './PerformanceDashboard';

// Process Management Pages (6 pages)
export { default as ProcessManufacturing } from './ProcessManufacturing';
export { default as BatchManagement } from './BatchManagement';
export { default as RecipeManagement } from './RecipeManagement';
export { default as ProcessControl } from './ProcessControl';
export { default as ProcessOptimization } from './ProcessOptimization';
export { default as ProcessValidation } from './ProcessValidation';

// Equipment Management Pages (5 pages)
export { default as EquipmentManagement } from './EquipmentManagement';
export { default as MaintenanceScheduling } from './MaintenanceScheduling';
export { default as PredictiveMaintenance } from './PredictiveMaintenance';
export { default as EquipmentEfficiency } from './EquipmentEfficiency';
export { default as ToolManagement } from './ToolManagement';

// Cost Management Pages (4 pages)
export { default as ManufacturingCosts } from './ManufacturingCosts';
export { default as CostRollup } from './CostRollup';
export { default as VarianceAnalysis } from './VarianceAnalysis';
export { default as ActivityBasedCosting } from './ActivityBasedCosting';

// Compliance & Safety Pages (3 pages)
export { default as SafetyManagement } from './SafetyManagement';
export { default as EnvironmentalCompliance } from './EnvironmentalCompliance';
export { default as AuditManagement } from './AuditManagement';

/**
 * Manufacturing Page Registry
 * Complete business-ready manufacturing pages with integrated backend services
 */
export const manufacturingPageRegistry = {
  // Production Management
  'production-planning': { component: 'ProductionPlanning', title: 'Production Planning', category: 'Production' },
  'production-scheduling': { component: 'ProductionScheduling', title: 'Production Scheduling', category: 'Production' },
  'capacity-management': { component: 'CapacityManagement', title: 'Capacity Management', category: 'Production' },
  'work-order-management': { component: 'WorkOrderManagement', title: 'Work Order Management', category: 'Production' },
  'bill-of-materials': { component: 'BillOfMaterials', title: 'Bill of Materials', category: 'Production' },
  'routing-management': { component: 'RoutingManagement', title: 'Routing Management', category: 'Production' },
  'master-production-schedule': { component: 'MasterProductionSchedule', title: 'Master Production Schedule', category: 'Production' },
  'material-requirements': { component: 'MaterialRequirements', title: 'Material Requirements Planning', category: 'Production' },
  'production-control': { component: 'ProductionControl', title: 'Production Control', category: 'Production' },
  'flow-manufacturing': { component: 'FlowManufacturing', title: 'Flow Manufacturing', category: 'Production' },
  'configure-to-order': { component: 'ConfigureToOrder', title: 'Configure-to-Order', category: 'Production' },

  // Quality Control
  'quality-inspection': { component: 'QualityInspection', title: 'Quality Inspection', category: 'Quality' },
  'quality-assurance': { component: 'QualityAssurance', title: 'Quality Assurance', category: 'Quality' },
  'defect-tracking': { component: 'DefectTracking', title: 'Defect Tracking', category: 'Quality' },
  'quality-metrics': { component: 'QualityMetrics', title: 'Quality Metrics', category: 'Quality' },
  'six-sigma-projects': { component: 'SixSigmaProjects', title: 'Six Sigma Projects', category: 'Quality' },
  'iso9001-compliance': { component: 'ISO9001Compliance', title: 'ISO 9001 Compliance', category: 'Quality' },
  'regulatory-compliance': { component: 'RegulatoryCompliance', title: 'Regulatory Compliance', category: 'Quality' },
  'continuous-improvement': { component: 'ContinuousImprovement', title: 'Continuous Improvement', category: 'Quality' },

  // Shop Floor Control
  'shop-floor-control': { component: 'ShopFloorControl', title: 'Shop Floor Control', category: 'Shop Floor' },
  'work-center-management': { component: 'WorkCenterManagement', title: 'Work Center Management', category: 'Shop Floor' },
  'operator-interface': { component: 'OperatorInterface', title: 'Operator Interface', category: 'Shop Floor' },
  'machine-monitoring': { component: 'MachineMonitoring', title: 'Machine Monitoring', category: 'Shop Floor' },
  'production-tracking': { component: 'ProductionTracking', title: 'Production Tracking', category: 'Shop Floor' },
  'labor-tracking': { component: 'LaborTracking', title: 'Labor Tracking', category: 'Shop Floor' },
  'inventory-tracking': { component: 'InventoryTracking', title: 'Inventory Tracking', category: 'Shop Floor' },

  // Manufacturing Analytics
  'oee-analytics': { component: 'OEEAnalytics', title: 'OEE Analytics', category: 'Analytics' },
  'production-analytics': { component: 'ProductionAnalytics', title: 'Production Analytics', category: 'Analytics' },
  'cost-analytics': { component: 'CostAnalytics', title: 'Cost Analytics', category: 'Analytics' },
  'efficiency-analytics': { component: 'EfficiencyAnalytics', title: 'Efficiency Analytics', category: 'Analytics' },
  'throughput-analysis': { component: 'ThroughputAnalysis', title: 'Throughput Analysis', category: 'Analytics' },
  'performance-dashboard': { component: 'PerformanceDashboard', title: 'Performance Dashboard', category: 'Analytics' },

  // Process Management
  'process-manufacturing': { component: 'ProcessManufacturing', title: 'Process Manufacturing', category: 'Process' },
  'batch-management': { component: 'BatchManagement', title: 'Batch Management', category: 'Process' },
  'recipe-management': { component: 'RecipeManagement', title: 'Recipe Management', category: 'Process' },
  'process-control': { component: 'ProcessControl', title: 'Process Control', category: 'Process' },
  'process-optimization': { component: 'ProcessOptimization', title: 'Process Optimization', category: 'Process' },
  'process-validation': { component: 'ProcessValidation', title: 'Process Validation', category: 'Process' },

  // Equipment Management
  'equipment-management': { component: 'EquipmentManagement', title: 'Equipment Management', category: 'Equipment' },
  'maintenance-scheduling': { component: 'MaintenanceScheduling', title: 'Maintenance Scheduling', category: 'Equipment' },
  'predictive-maintenance': { component: 'PredictiveMaintenance', title: 'Predictive Maintenance', category: 'Equipment' },
  'equipment-efficiency': { component: 'EquipmentEfficiency', title: 'Equipment Efficiency', category: 'Equipment' },
  'tool-management': { component: 'ToolManagement', title: 'Tool Management', category: 'Equipment' },

  // Cost Management
  'manufacturing-costs': { component: 'ManufacturingCosts', title: 'Manufacturing Costs', category: 'Cost' },
  'cost-rollup': { component: 'CostRollup', title: 'Cost Rollup', category: 'Cost' },
  'variance-analysis': { component: 'VarianceAnalysis', title: 'Variance Analysis', category: 'Cost' },
  'activity-based-costing': { component: 'ActivityBasedCosting', title: 'Activity-Based Costing', category: 'Cost' },

  // Compliance & Safety
  'safety-management': { component: 'SafetyManagement', title: 'Safety Management', category: 'Compliance' },
  'environmental-compliance': { component: 'EnvironmentalCompliance', title: 'Environmental Compliance', category: 'Compliance' },
  'audit-management': { component: 'AuditManagement', title: 'Audit Management', category: 'Compliance' }
};

/**
 * Get manufacturing page categories for navigation
 */
export const getManufacturingCategories = () => {
  const categories = new Set(Object.values(manufacturingPageRegistry).map(page => page.category));
  return Array.from(categories).sort();
};

/**
 * Get pages by category
 */
export const getPagesByCategory = (category: string) => {
  return Object.entries(manufacturingPageRegistry)
    .filter(([_, page]) => page.category === category)
    .map(([route, page]) => ({ route, ...page }));
};

/**
 * Total page count verification
 */
export const TOTAL_MANUFACTURING_PAGES = Object.keys(manufacturingPageRegistry).length; // Should be 49