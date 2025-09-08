import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import DataTable from '../../components/DataTable';
import CrudModal from '../../components/CrudModal';
import KPIWidget from '../../components/KPIWidget';

interface RecipeManagementData {
  id: string;
  name: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  createdDate: string;
  lastModified: string;
}

const RecipeManagement: React.FC = () => {
  const [data, setData] = useState<RecipeManagementData[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<RecipeManagementData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to manufacturing service
    setTimeout(() => {
      setData([
        {
          id: 'RECIPEMANAGEMENT_001',
          name: 'Sample Recipe Management',
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
      const newItem: RecipeManagementData = {
        id: `${page.name.toUpperCase()}_${String(data.length + 1).padStart(3, '0')}`,
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
          <h1>Recipe Management</h1>
          <p>Manage production recipes and formulas</p>
        </div>

        <div className="kpi-grid">
          {kpiData.map((kpi, index) => (
            <KPIWidget key={index} {...kpi} />
          ))}
        </div>

        <div className="content-section">
          <div className="section-header">
            <h2>Recipe Management Management</h2>
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
            title={editingItem ? 'Edit Recipe Management' : 'Create Recipe Management'}
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

export default RecipeManagement;