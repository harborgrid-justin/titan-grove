import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import DataTable from '../../components/DataTable';
import CrudModal from '../../components/CrudModal';
import KPIWidget from '../../components/KPIWidget';

interface ProductionPlan {
  id: string;
  planName: string;
  planPeriod: string;
  status: 'ACTIVE' | 'DRAFT' | 'COMPLETED';
  demandForecast: number;
  plannedCapacity: number;
  utilizationRate: number;
  createdDate: string;
}

const ProductionPlanning: React.FC = () => {
  const [plans, setPlans] = useState<ProductionPlan[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<ProductionPlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPlans([
        {
          id: 'PP001',
          planName: 'Q1 2024 Production Plan',
          planPeriod: '2024-Q1',
          status: 'ACTIVE',
          demandForecast: 15000,
          plannedCapacity: 18000,
          utilizationRate: 83.3,
          createdDate: '2024-01-01'
        },
        {
          id: 'PP002',
          planName: 'Q2 2024 Production Plan',
          planPeriod: '2024-Q2',
          status: 'DRAFT',
          demandForecast: 16500,
          plannedCapacity: 20000,
          utilizationRate: 82.5,
          createdDate: '2024-01-15'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const kpiData = [
    { title: 'Active Plans', value: '2', change: 0, format: 'number' },
    { title: 'Avg Utilization', value: '82.9%', change: 3.2, format: 'percentage' },
    { title: 'Total Capacity', value: '38,000', change: 5.1, format: 'number' },
    { title: 'Plan Accuracy', value: '94.2%', change: 1.8, format: 'percentage' }
  ];

  const transformedPlans = plans.map(plan => ({
    id: plan.id,
    planName: plan.planName,
    planPeriod: plan.planPeriod,
    status: plan.status,
    demandForecast: plan.demandForecast.toLocaleString(),
    plannedCapacity: plan.plannedCapacity.toLocaleString(),
    utilizationRate: `${plan.utilizationRate}%`,
    createdDate: new Date(plan.createdDate).toLocaleDateString(),
    statusClass: plan.status === 'ACTIVE' ? 'success' : 
                 plan.status === 'DRAFT' ? 'warning' : 'neutral'
  }));

  const tableColumns = [
    { key: 'select', label: '', type: 'checkbox' },
    { key: 'id', label: 'Plan ID', type: 'text' },
    { key: 'planName', label: 'Plan Name', type: 'text' },
    { key: 'planPeriod', label: 'Period', type: 'text' },
    { key: 'status', label: 'Status', type: 'status' },
    { key: 'demandForecast', label: 'Demand Forecast', type: 'number' },
    { key: 'plannedCapacity', label: 'Planned Capacity', type: 'number' },
    { key: 'utilizationRate', label: 'Utilization', type: 'text' },
    { key: 'createdDate', label: 'Created', type: 'date' },
    { key: 'actions', label: 'Actions', type: 'actions' }
  ];

  const modalFields = [
    { key: 'planName', label: 'Plan Name', type: 'text', required: true },
    { key: 'planPeriod', label: 'Plan Period', type: 'text', required: true },
    { key: 'status', label: 'Status', type: 'select', options: ['ACTIVE', 'DRAFT', 'COMPLETED'] },
    { key: 'demandForecast', label: 'Demand Forecast', type: 'number', required: true },
    { key: 'plannedCapacity', label: 'Planned Capacity', type: 'number', required: true }
  ];

  const handleCreate = () => {
    setEditingPlan(null);
    setShowModal(true);
  };

  const handleEdit = (plan: any) => {
    setEditingPlan(plan);
    setShowModal(true);
  };

  const handleSave = (formData: any) => {
    if (editingPlan) {
      setPlans(plans.map(p => p.id === editingPlan.id ? { ...p, ...formData } : p));
    } else {
      const newPlan: ProductionPlan = {
        id: `PP${String(plans.length + 1).padStart(3, '0')}`,
        ...formData,
        utilizationRate: (formData.demandForecast / formData.plannedCapacity) * 100,
        createdDate: new Date().toISOString().split('T')[0]
      };
      setPlans([...plans, newPlan]);
    }
    setShowModal(false);
    setEditingPlan(null);
  };

  const handleDelete = (selectedIds: string[]) => {
    setPlans(plans.filter(p => !selectedIds.includes(p.id)));
  };

  return (
    <div className="page-container">
      <Sidebar />
      <div className="main-content">
        <div className="page-header">
          <h1>Production Planning</h1>
          <p>Manage production plans and capacity planning</p>
        </div>

        <div className="kpi-grid">
          {kpiData.map((kpi, index) => (
            <KPIWidget key={index} {...kpi} />
          ))}
        </div>

        <div className="content-section">
          <div className="section-header">
            <h2>Production Plans</h2>
            <button className="btn-primary" onClick={handleCreate}>
              <i className="fas fa-plus"></i> Create Plan
            </button>
          </div>

          <DataTable
            data={transformedPlans}
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
            title={editingPlan ? 'Edit Production Plan' : 'Create Production Plan'}
            fields={modalFields}
            initialData={editingPlan}
            onSave={handleSave}
            onCancel={() => setShowModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default ProductionPlanning;