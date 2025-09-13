const fs = require('fs');
const path = require('path');

const manufacturingPages = [
  // Production Management Pages (10 pages)
  { name: 'ProductionScheduling', title: 'Production Scheduling', description: 'Schedule and optimize production activities' },
  { name: 'CapacityManagement', title: 'Capacity Management', description: 'Manage production capacity and utilization' },
  { name: 'WorkOrderManagement', title: 'Work Order Management', description: 'Create and manage work orders' },
  { name: 'BillOfMaterials', title: 'Bill of Materials', description: 'Manage product BOMs and components' },
  { name: 'RoutingManagement', title: 'Routing Management', description: 'Define production routing and operations' },
  { name: 'MasterProductionSchedule', title: 'Master Production Schedule', description: 'Manage master production schedules' },
  { name: 'MaterialRequirements', title: 'Material Requirements Planning', description: 'Plan material requirements' },
  { name: 'ProductionControl', title: 'Production Control', description: 'Monitor and control production processes' },
  { name: 'FlowManufacturing', title: 'Flow Manufacturing', description: 'Manage flow manufacturing processes' },
  { name: 'ConfigureToOrder', title: 'Configure-to-Order', description: 'Manage configure-to-order production' },

  // Quality Control Pages (8 pages)
  { name: 'QualityInspection', title: 'Quality Inspection', description: 'Manage quality inspections and tests' },
  { name: 'QualityAssurance', title: 'Quality Assurance', description: 'Quality assurance processes and procedures' },
  { name: 'DefectTracking', title: 'Defect Tracking', description: 'Track and manage product defects' },
  { name: 'QualityMetrics', title: 'Quality Metrics', description: 'Monitor quality performance metrics' },
  { name: 'SixSigmaProjects', title: 'Six Sigma Projects', description: 'Manage Six Sigma improvement projects' },
  { name: 'ISO9001Compliance', title: 'ISO 9001 Compliance', description: 'Manage ISO 9001 compliance requirements' },
  { name: 'RegulatoryCompliance', title: 'Regulatory Compliance', description: 'Ensure regulatory compliance' },
  { name: 'ContinuousImprovement', title: 'Continuous Improvement', description: 'Drive continuous improvement initiatives' },

  // Shop Floor Control Pages (7 pages)
  { name: 'ShopFloorControl', title: 'Shop Floor Control', description: 'Control and monitor shop floor operations' },
  { name: 'WorkCenterManagement', title: 'Work Center Management', description: 'Manage work centers and resources' },
  { name: 'OperatorInterface', title: 'Operator Interface', description: 'Operator workstation interface' },
  { name: 'MachineMonitoring', title: 'Machine Monitoring', description: 'Monitor machine status and performance' },
  { name: 'ProductionTracking', title: 'Production Tracking', description: 'Track production progress in real-time' },
  { name: 'LaborTracking', title: 'Labor Tracking', description: 'Track labor time and efficiency' },
  { name: 'InventoryTracking', title: 'Inventory Tracking', description: 'Track inventory movements on shop floor' },

  // Manufacturing Analytics Pages (6 pages)
  { name: 'OEEAnalytics', title: 'OEE Analytics', description: 'Overall Equipment Effectiveness analytics' },
  { name: 'ProductionAnalytics', title: 'Production Analytics', description: 'Production performance analytics' },
  { name: 'CostAnalytics', title: 'Cost Analytics', description: 'Manufacturing cost analysis' },
  { name: 'EfficiencyAnalytics', title: 'Efficiency Analytics', description: 'Manufacturing efficiency metrics' },
  { name: 'ThroughputAnalysis', title: 'Throughput Analysis', description: 'Production throughput analysis' },
  { name: 'PerformanceDashboard', title: 'Performance Dashboard', description: 'Manufacturing performance dashboard' },

  // Process Management Pages (6 pages)  
  { name: 'ProcessManufacturing', title: 'Process Manufacturing', description: 'Manage process manufacturing operations' },
  { name: 'BatchManagement', title: 'Batch Management', description: 'Manage batch production processes' },
  { name: 'RecipeManagement', title: 'Recipe Management', description: 'Manage production recipes and formulas' },
  { name: 'ProcessControl', title: 'Process Control', description: 'Control manufacturing processes' },
  { name: 'ProcessOptimization', title: 'Process Optimization', description: 'Optimize manufacturing processes' },
  { name: 'ProcessValidation', title: 'Process Validation', description: 'Validate manufacturing processes' },

  // Equipment Management Pages (5 pages)
  { name: 'EquipmentManagement', title: 'Equipment Management', description: 'Manage manufacturing equipment' },
  { name: 'MaintenanceScheduling', title: 'Maintenance Scheduling', description: 'Schedule equipment maintenance' },
  { name: 'PredictiveMaintenance', title: 'Predictive Maintenance', description: 'Predictive maintenance analytics' },
  { name: 'EquipmentEfficiency', title: 'Equipment Efficiency', description: 'Monitor equipment efficiency' },
  { name: 'ToolManagement', title: 'Tool Management', description: 'Manage manufacturing tools and fixtures' },

  // Cost Management Pages (4 pages)
  { name: 'ManufacturingCosts', title: 'Manufacturing Costs', description: 'Track and analyze manufacturing costs' },
  { name: 'CostRollup', title: 'Cost Rollup', description: 'Product cost rollup and analysis' },
  { name: 'VarianceAnalysis', title: 'Variance Analysis', description: 'Analyze cost variances' },
  { name: 'ActivityBasedCosting', title: 'Activity-Based Costing', description: 'Activity-based cost management' },

  // Compliance & Safety Pages (3 pages)
  { name: 'SafetyManagement', title: 'Safety Management', description: 'Workplace safety management' },
  { name: 'EnvironmentalCompliance', title: 'Environmental Compliance', description: 'Environmental compliance tracking' },
  { name: 'AuditManagement', title: 'Audit Management', description: 'Manage manufacturing audits' }
];

const componentTemplate = (page) => `import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import DataTable from '../../components/DataTable';
import CrudModal from '../../components/CrudModal';
import KPIWidget from '../../components/KPIWidget';

interface ${page.name}Data {
  id: string;
  name: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  createdDate: string;
  lastModified: string;
}

const ${page.name}: React.FC = () => {
  const [data, setData] = useState<${page.name}Data[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<${page.name}Data | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to manufacturing service
    setTimeout(() => {
      setData([
        {
          id: '${page.name.toUpperCase()}_001',
          name: 'Sample ${page.title}',
          status: 'ACTIVE',
          createdDate: new Date().toISOString().split('T')[0],
          lastModified: new Date().toISOString().split('T')[0]
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const kpiData = [
    { title: 'Total Items', value: data.length.toString(), change: 0, format: 'number' },
    { title: 'Active', value: data.filter(d => d.status === 'ACTIVE').length.toString(), change: 2.1, format: 'number' },
    { title: 'Efficiency', value: '94.2%', change: 1.8, format: 'percentage' },
    { title: 'Performance', value: '87.5%', change: -0.5, format: 'percentage' }
  ];

  const transformedData = data.map(item => ({
    id: item.id,
    name: item.name,
    status: item.status,
    createdDate: new Date(item.createdDate).toLocaleDateString(),
    lastModified: new Date(item.lastModified).toLocaleDateString(),
    statusClass: item.status === 'ACTIVE' ? 'success' : 
                 item.status === 'PENDING' ? 'warning' : 'neutral'
  }));

  const tableColumns = [
    { key: 'select', label: '', type: 'checkbox' },
    { key: 'id', label: 'ID', type: 'text' },
    { key: 'name', label: 'Name', type: 'text' },
    { key: 'status', label: 'Status', type: 'status' },
    { key: 'createdDate', label: 'Created', type: 'date' },
    { key: 'lastModified', label: 'Modified', type: 'date' },
    { key: 'actions', label: 'Actions', type: 'actions' }
  ];

  const modalFields = [
    { key: 'name', label: 'Name', type: 'text', required: true },
    { key: 'status', label: 'Status', type: 'select', options: ['ACTIVE', 'INACTIVE', 'PENDING'] }
  ];

  const handleCreate = () => {
    setEditingItem(null);
    setShowModal(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleSave = (formData: any) => {
    if (editingItem) {
      setData(data.map(d => d.id === editingItem.id ? { ...d, ...formData, lastModified: new Date().toISOString().split('T')[0] } : d));
    } else {
      const newItem: ${page.name}Data = {
        id: \`\${page.name.toUpperCase()}_\${String(data.length + 1).padStart(3, '0')}\`,
        ...formData,
        createdDate: new Date().toISOString().split('T')[0],
        lastModified: new Date().toISOString().split('T')[0]
      };
      setData([...data, newItem]);
    }
    setShowModal(false);
    setEditingItem(null);
  };

  const handleDelete = (selectedIds: string[]) => {
    setData(data.filter(d => !selectedIds.includes(d.id)));
  };

  return (
    <div className="page-container">
      <Sidebar />
      <div className="main-content">
        <div className="page-header">
          <h1>${page.title}</h1>
          <p>${page.description}</p>
        </div>

        <div className="kpi-grid">
          {kpiData.map((kpi, index) => (
            <KPIWidget key={index} {...kpi} />
          ))}
        </div>

        <div className="content-section">
          <div className="section-header">
            <h2>${page.title} Management</h2>
            <button className="btn-primary" onClick={handleCreate}>
              <i className="fas fa-plus"></i> Create New
            </button>
          </div>

          <DataTable
            data={transformedData}
            columns={tableColumns}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            searchable
            filterable
            exportable
          />
        </div>

        {showModal && (
          <CrudModal
            title={editingItem ? 'Edit ${page.title}' : 'Create ${page.title}'}
            fields={modalFields}
            initialData={editingItem}
            onSave={handleSave}
            onCancel={() => setShowModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default ${page.name};`;

// Create directory if it doesn't exist
const manufacturingDir = path.join(__dirname, 'src/ui/react/src/pages/manufacturing');
if (!fs.existsSync(manufacturingDir)) {
  fs.mkdirSync(manufacturingDir, { recursive: true });
}

// Generate all pages
manufacturingPages.forEach(page => {
  const filePath = path.join(manufacturingDir, `${page.name}.tsx`);
  fs.writeFileSync(filePath, componentTemplate(page));
  console.log(`Created: ${page.name}.tsx`);
});

console.log(`Successfully created ${manufacturingPages.length} manufacturing pages!`);
