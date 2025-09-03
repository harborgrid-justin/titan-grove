import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import DataTable from '../components/DataTable';
import CrudModal from '../components/CrudModal';
import KPIWidget from '../components/KPIWidget';
import { useProductionOrders, useRealtimeKPIs } from '../hooks/useApi';
import { ProductionOrder } from '../services/apiService';

const Manufacturing: React.FC = () => {
  // Fetch production orders from backend
  const { 
    productionOrders, 
    loading: ordersLoading, 
    error: ordersError, 
    refetch: refetchOrders,
    createProductionOrder,
    updateProductionOrder,
    deleteProductionOrder,
    actionLoading
  } = useProductionOrders();
  
  // Connect to real-time KPI updates
  const { kpiData: realtimeKpis, connected: kpiConnected, error: kpiError } = useRealtimeKPIs();

  // Modal state for CRUD operations
  const [showModal, setShowModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState<ProductionOrder | null>(null);

  // Transform production orders for table display
  const transformedOrders = productionOrders.map(order => ({
    id: order.id,
    product: order.productName,
    quantity: order.quantity.toString(),
    status: order.status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()),
    priority: order.priority,
    startDate: new Date(order.startDate).toLocaleDateString(),
    dueDate: new Date(order.dueDate).toLocaleDateString(),
    workCenter: order.workCenter,
    statusClass: order.status === 'IN_PROGRESS' ? 'success' : 
                 order.status === 'COMPLETED' ? 'success' :
                 order.status === 'RELEASED' ? 'warning' : 'neutral'
  }));

  const tableColumns = [
    { key: 'select', label: '', type: 'checkbox' },
    { key: 'id', label: 'Order ID', type: 'text' },
    { key: 'product', label: 'Product', type: 'text' },
    { key: 'quantity', label: 'Quantity', type: 'number' },
    { key: 'status', label: 'Status', type: 'status' },
    { key: 'priority', label: 'Priority', type: 'priority' },
    { key: 'startDate', label: 'Start Date', type: 'date' },
    { key: 'dueDate', label: 'Due Date', type: 'date' },
    { key: 'workCenter', label: 'Work Center', type: 'text' },
    { key: 'actions', label: 'Actions', type: 'actions' }
  ];

  // Static KPI data enhanced with real-time data
  const [kpiData] = useState([
    { title: 'Overall Equipment Effectiveness', value: '87.4%', change: '+3.2%', trend: 'positive', format: 'percentage' },
    { title: 'Production Volume', value: '12,847 units', change: '+5.8%', trend: 'positive', format: 'number' },
    { title: 'Quality Score', value: '99.2%', change: '+0.3%', trend: 'positive', format: 'percentage' },
    { title: 'Downtime Hours', value: '2.3 hrs', change: '-15.2%', trend: 'positive', format: 'time' },
    { title: 'Energy Efficiency', value: '94.1%', change: '+2.1%', trend: 'positive', format: 'percentage' },
    { title: 'Cost per Unit', value: '$45.23', change: '-3.8%', trend: 'positive', format: 'currency' }
  ]);

  // CRUD operation handlers
  const handleCreateOrder = () => {
    setEditingOrder(null);
    setShowModal(true);
  };

  const handleEditOrder = (order: any) => {
    const originalOrder = productionOrders.find(po => po.id === order.id);
    if (originalOrder) {
      setEditingOrder(originalOrder);
      setShowModal(true);
    }
  };

  const handleDeleteOrder = async (order: any) => {
    if (window.confirm('Are you sure you want to delete this production order?')) {
      try {
        await deleteProductionOrder(order.id);
      } catch (error) {
        console.error('Failed to delete production order:', error);
        alert('Failed to delete production order. Please try again.');
      }
    }
  };

  const handleViewOrder = (order: any) => {
    alert(`Viewing production order: ${order.id}\\nProduct: ${order.product}\\nStatus: ${order.status}`);
  };

  const handleSaveOrder = async (orderData: Omit<ProductionOrder, 'id'> | ProductionOrder) => {
    try {
      if ('id' in orderData) {
        await updateProductionOrder(orderData.id, orderData);
      } else {
        await createProductionOrder(orderData);
      }
    } catch (error) {
      console.error('Failed to save production order:', error);
      throw error;
    }
  };

  const validateOrder = (formData: any) => {
    const errors: { [key: string]: string } = {};
    
    if (!formData.productName?.trim()) errors.productName = 'Product name is required';
    if (!formData.quantity || formData.quantity < 1) errors.quantity = 'Quantity must be at least 1';
    if (!formData.workCenter?.trim()) errors.workCenter = 'Work center is required';
    if (!formData.startDate) errors.startDate = 'Start date is required';
    if (!formData.dueDate) errors.dueDate = 'Due date is required';

    return errors;
  };

  const initialOrderData = {
    productName: '',
    productId: '',
    quantity: 1,
    status: 'PLANNED',
    priority: 'MEDIUM',
    startDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    workCenter: ''
  };

  return (
    <>
      <Sidebar />
      <div className="titan-content">
        <div className="titan-dashboard">
          <div className="titan-dashboard-header">
            <h1 className="titan-dashboard-title">🏭 Manufacturing Operations</h1>
            <div className="titan-dashboard-actions">
              <button 
                className="titan-button"
                onClick={handleCreateOrder}
                disabled={!!actionLoading}
              >
                ➕ Create Production Order
              </button>
              <button className="titan-button">📊 Production Report</button>
              <button className="titan-button titan-button-secondary">⚙️ Configure MES</button>
              {kpiConnected && (
                <span style={{ 
                  fontSize: '12px', 
                  color: 'var(--success)', 
                  marginLeft: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  ● Live Data Connected
                </span>
              )}
              {kpiError && (
                <span style={{ 
                  fontSize: '12px', 
                  color: 'var(--error)', 
                  marginLeft: '12px' 
                }}>
                  ⚠️ {kpiError}
                </span>
              )}
            </div>
          </div>

          <div className="titan-section">
            <h2 className="titan-section-title">
              <span>📈</span>
              Production KPIs
            </h2>
            <div className="titan-kpi-grid">
              {kpiData.map((kpi, index) => (
                <KPIWidget 
                  key={index} 
                  title={kpi.title}
                  value={kpi.value}
                  change={kpi.change}
                  trend={kpi.trend as 'positive' | 'negative'}
                  format={kpi.format as 'currency' | 'percentage' | 'number' | 'time'}
                />
              ))}
            </div>
          </div>

          <div className="titan-section">
            <h2 className="titan-section-title">
              <span>🏭</span>
              Active Production Orders
              {ordersLoading && <span style={{ fontSize: '14px', color: 'var(--text-secondary)', marginLeft: '8px' }}>Loading...</span>}
              {ordersError && <span style={{ fontSize: '14px', color: 'var(--error)', marginLeft: '8px' }}>⚠️ {ordersError}</span>}
            </h2>
            <DataTable
              columns={tableColumns}
              data={transformedOrders}
              searchable={true}
              paginated={true}
              onEdit={handleEditOrder}
              onDelete={handleDeleteOrder}
              onView={handleViewOrder}
            />
            {!ordersLoading && transformedOrders.length === 0 && (
              <div style={{ 
                padding: '40px', 
                textAlign: 'center', 
                color: 'var(--text-secondary)' 
              }}>
                No production orders found. <button 
                  onClick={refetchOrders}
                  style={{ 
                    color: 'var(--primary)', 
                    textDecoration: 'underline',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Try refreshing
                </button>
              </div>
            )}
          </div>

          <div className="titan-widget-grid">
            <div className="titan-widget">
              <h3 style={{ margin: '0 0 16px 0' }}>🏭 Production Line Status</h3>
              <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface)', borderRadius: '6px' }}>
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                  <div>Production line monitoring dashboard will be rendered here</div>
                </div>
              </div>
            </div>
            <div className="titan-widget">
              <h3 style={{ margin: '0 0 16px 0' }}>📊 Quality Metrics</h3>
              <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface)', borderRadius: '6px' }}>
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                  <div>Quality control metrics will be rendered here</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Production Order Modal */}
        <CrudModal<ProductionOrder>
          isOpen={showModal}
          title="Production Order"
          item={editingOrder}
          onClose={() => setShowModal(false)}
          onSave={handleSaveOrder}
          loading={!!actionLoading}
          validation={validateOrder}
          initialData={initialOrderData}
        >
          {({ formData, handleInputChange, formErrors }) => (
            <>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '4px', 
                  fontWeight: 500,
                  color: 'var(--text-primary)'
                }}>
                  Product Name *
                </label>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName || ''}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: `1px solid ${formErrors.productName ? 'var(--error)' : '#e2e8f0'}`,
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontFamily: 'var(--font-primary)'
                  }}
                  placeholder="Enter product name"
                />
                {formErrors.productName && (
                  <span style={{ color: 'var(--error)', fontSize: '12px' }}>{formErrors.productName}</span>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '4px', 
                    fontWeight: 500,
                    color: 'var(--text-primary)'
                  }}>
                    Quantity *
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity || 1}
                    onChange={handleInputChange}
                    min="1"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: `1px solid ${formErrors.quantity ? 'var(--error)' : '#e2e8f0'}`,
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontFamily: 'var(--font-primary)'
                    }}
                  />
                  {formErrors.quantity && (
                    <span style={{ color: 'var(--error)', fontSize: '12px' }}>{formErrors.quantity}</span>
                  )}
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '4px', 
                    fontWeight: 500,
                    color: 'var(--text-primary)'
                  }}>
                    Work Center *
                  </label>
                  <input
                    type="text"
                    name="workCenter"
                    value={formData.workCenter || ''}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: `1px solid ${formErrors.workCenter ? 'var(--error)' : '#e2e8f0'}`,
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontFamily: 'var(--font-primary)'
                    }}
                    placeholder="Work center name"
                  />
                  {formErrors.workCenter && (
                    <span style={{ color: 'var(--error)', fontSize: '12px' }}>{formErrors.workCenter}</span>
                  )}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '4px', 
                    fontWeight: 500,
                    color: 'var(--text-primary)'
                  }}>
                    Start Date *
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate || ''}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: `1px solid ${formErrors.startDate ? 'var(--error)' : '#e2e8f0'}`,
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontFamily: 'var(--font-primary)'
                    }}
                  />
                  {formErrors.startDate && (
                    <span style={{ color: 'var(--error)', fontSize: '12px' }}>{formErrors.startDate}</span>
                  )}
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '4px', 
                    fontWeight: 500,
                    color: 'var(--text-primary)'
                  }}>
                    Due Date *
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate || ''}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: `1px solid ${formErrors.dueDate ? 'var(--error)' : '#e2e8f0'}`,
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontFamily: 'var(--font-primary)'
                    }}
                  />
                  {formErrors.dueDate && (
                    <span style={{ color: 'var(--error)', fontSize: '12px' }}>{formErrors.dueDate}</span>
                  )}
                </div>
              </div>
            </>
          )}
        </CrudModal>
      </div>
    </>
  );
};

export default Manufacturing;