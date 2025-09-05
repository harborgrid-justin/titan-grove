import React, { useState, useEffect } from 'react';
import KPIWidget from '../components/KPIWidget';
import Sidebar from '../components/Sidebar';
import DataTable from '../components/DataTable';
import WorkOrderModal from '../components/WorkOrderModal';
import LoadingSpinner from '../components/LoadingSpinner';
import ConnectionStatus from '../components/ConnectionStatus';
import { useWorkOrders, useRealtimeKPIs } from '../hooks/useApi';
import { WorkOrder } from '../services/apiService';

const Dashboard: React.FC = () => {
  // Static KPI data enhanced with real-time data
  const [kpiData, setKpiData] = useState([
    { title: 'Total Revenue', value: '$24.5M', change: '+12.5%', trend: 'positive', format: 'currency' },
    { title: 'Active Orders', value: '1,247', change: '+8.2%', trend: 'positive', format: 'number' },
    { title: 'Production Efficiency', value: '94.2%', change: '+2.1%', trend: 'positive', format: 'percentage' },
    { title: 'Customer Satisfaction', value: '98.7%', change: '+0.8%', trend: 'positive', format: 'percentage' },
    { title: 'Inventory Turnover', value: '12.4x', change: '+5.3%', trend: 'positive', format: 'ratio' },
    { title: 'On-Time Delivery', value: '96.8%', change: '-1.2%', trend: 'negative', format: 'percentage' }
  ]);

  // Fetch real work orders from backend
  const { 
    workOrders, 
    loading: ordersLoading, 
    error: ordersError, 
    refetch: refetchOrders,
    createWorkOrder,
    updateWorkOrder,
    deleteWorkOrder,
    actionLoading
  } = useWorkOrders();
  
  // Connect to real-time KPI updates
  const { kpiData: realtimeKpis, connected: kpiConnected, error: kpiError } = useRealtimeKPIs();

  // Modal state for CRUD operations
  const [showModal, setShowModal] = useState(false);
  const [editingWorkOrder, setEditingWorkOrder] = useState<WorkOrder | null>(null);

  // Transform work orders for table display
  const transformedOrders = workOrders.map(order => ({
    id: order.id,
    product: order.title,
    facility: order.customer, // Using customer as facility for now
    value: `$${(Math.random() * 2000000 + 500000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`, // Mock values
    date: new Date(order.scheduledDate).toLocaleDateString(),
    status: order.status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()),
    statusClass: order.status === 'IN_PROGRESS' ? 'success' : 
                 order.status === 'COMPLETED' ? 'success' :
                 order.status === 'SCHEDULED' ? 'warning' : 'warning'
  }));

  const tableColumns = [
    { key: 'select', label: '', type: 'checkbox' },
    { key: 'id', label: 'Work Order', type: 'text' },
    { key: 'product', label: 'Product/Service', type: 'text' },
    { key: 'facility', label: 'Facility', type: 'text' },
    { key: 'value', label: 'Value', type: 'currency' },
    { key: 'date', label: 'Due Date', type: 'date' },
    { key: 'status', label: 'Status', type: 'status' },
    { key: 'actions', label: 'Actions', type: 'actions' }
  ];

  // Update KPIs with real-time data when available
  useEffect(() => {
    if (realtimeKpis) {
      setKpiData(prevData => prevData.map(kpi => {
        switch (kpi.title) {
          case 'Active Orders':
            return { ...kpi, value: realtimeKpis.activeWorkOrders.toString() };
          case 'Customer Satisfaction':
            return { ...kpi, value: `${realtimeKpis.customerSatisfaction}%` };
          default:
            return kpi;
        }
      }));
    }
  }, [realtimeKpis]);

  // CRUD operation handlers
  const handleCreateWorkOrder = () => {
    setEditingWorkOrder(null);
    setShowModal(true);
  };

  const handleEditWorkOrder = (order: any) => {
    // Find the original work order from the API data
    const originalOrder = workOrders.find(wo => wo.id === order.id);
    if (originalOrder) {
      setEditingWorkOrder(originalOrder);
      setShowModal(true);
    }
  };

  const handleDeleteWorkOrder = async (order: any) => {
    if (window.confirm('Are you sure you want to delete this work order?')) {
      try {
        await deleteWorkOrder(order.id);
      } catch (error) {
        console.error('Failed to delete work order:', error);
        alert('Failed to delete work order. Please try again.');
      }
    }
  };

  const handleViewWorkOrder = (order: any) => {
    // For now, just show an alert. In a real app, this might navigate to a detail view
    alert(`Viewing work order: ${order.id}\nTitle: ${order.product}\nStatus: ${order.status}`);
  };

  const handleSaveWorkOrder = async (orderData: Omit<WorkOrder, 'id'> | WorkOrder) => {
    try {
      if ('id' in orderData) {
        // Update existing work order
        await updateWorkOrder(orderData.id, orderData);
      } else {
        // Create new work order
        await createWorkOrder(orderData);
      }
    } catch (error) {
      console.error('Failed to save work order:', error);
      throw error; // Re-throw so the modal can handle it
    }
  };

  // Simulate real-time updates (keep existing functionality)
  useEffect(() => {
    const interval = setInterval(() => {
      setKpiData(prevData => prevData.map(kpi => ({
        ...kpi,
        // Add small random variations to simulate live data
        value: kpi.format === 'currency' 
          ? `$${(parseFloat(kpi.value.replace(/[$M,]/g, '')) + (Math.random() - 0.5) * 0.1).toFixed(1)}M`
          : kpi.format === 'percentage'
          ? `${(parseFloat(kpi.value.replace('%', '')) + (Math.random() - 0.5) * 0.1).toFixed(1)}%`
          : kpi.value
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Sidebar />
      <div className="titan-content">
        <div className="titan-dashboard">
          <div className="titan-dashboard-header">
            <h1 className="titan-dashboard-title">Fortune 100 Executive Dashboard</h1>
            <div className="titan-dashboard-actions">
              <button 
                className="titan-button"
                onClick={handleCreateWorkOrder}
                disabled={!!actionLoading}
              >
                ➕ Create Work Order
              </button>
              <button className="titan-button">📊 Generate Report</button>
              <button className="titan-button titan-button-secondary">⚙️ Configure</button>
              <ConnectionStatus 
                connected={kpiConnected}
                reconnecting={false}
                lastUpdateTime={realtimeKpis ? new Date().toISOString() : undefined}
              />
            </div>
          </div>

          {/* KPI Section */}
          <div className="titan-section">
            <h2 className="titan-section-title">
              <span>📈</span>
              Key Performance Indicators
            </h2>
            <div className="titan-kpi-grid">
              {kpiData.map((kpi, index) => (
                <KPIWidget key={index} {...kpi} />
              ))}
            </div>
          </div>

          {/* Recent Orders Section */}
          <div className="titan-section">
            <h2 className="titan-section-title">
              <span>📋</span>
              Active Work Orders & Production Pipeline
              {ordersLoading && <LoadingSpinner size="small" message="" />}
              {ordersError && <span style={{ fontSize: '14px', color: 'var(--error)', marginLeft: '8px' }}>⚠️ Failed to fetch</span>}
            </h2>
            {ordersLoading ? (
              <div style={{ padding: '40px', textAlign: 'center' }}>
                <LoadingSpinner message="Loading work orders..." />
              </div>
            ) : (
              <DataTable
                columns={tableColumns}
                data={transformedOrders}
                searchable={true}
                paginated={true}
                onEdit={handleEditWorkOrder}
                onDelete={handleDeleteWorkOrder}
                onView={handleViewWorkOrder}
              />
            )}
            {!ordersLoading && transformedOrders.length === 0 && (
              <div style={{ 
                padding: '40px', 
                textAlign: 'center', 
                color: 'var(--text-secondary)' 
              }}>
                No work orders found. <button 
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

          {/* Additional Analytics */}
          <div className="titan-section">
            <div className="titan-widget-grid">
              <div className="titan-widget">
                <h3 style={{ margin: '0 0 16px 0', color: 'var(--text-primary)' }}>
                  📊 Production Analytics
                </h3>
                <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface)', borderRadius: '6px' }}>
                  <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>📈</div>
                    <div>Interactive charts will be rendered here</div>
                    <div style={{ fontSize: '14px', marginTop: '8px' }}>Real-time production metrics and trends</div>
                  </div>
                </div>
              </div>

              <div className="titan-widget">
                <h3 style={{ margin: '0 0 16px 0', color: 'var(--text-primary)' }}>
                  🌍 Global Operations
                </h3>
                <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface)', borderRadius: '6px' }}>
                  <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>🗺️</div>
                    <div>Interactive world map</div>
                    <div style={{ fontSize: '14px', marginTop: '8px' }}>Global facility status and operations</div>
                  </div>
                </div>
              </div>

              <div className="titan-widget">
                <h3 style={{ margin: '0 0 16px 0', color: 'var(--text-primary)' }}>
                  ⚡ System Health
                </h3>
                <div style={{ padding: '16px 0' }}>
                  {[
                    { name: 'Manufacturing Systems', status: '✅ Operational', uptime: '99.9%' },
                    { name: 'Financial Systems', status: '✅ Operational', uptime: '99.7%' },
                    { name: 'Supply Chain', status: '⚠️ Degraded', uptime: '97.2%' },
                    { name: 'Customer Portal', status: '✅ Operational', uptime: '99.8%' }
                  ].map((system, index) => (
                    <div key={index} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 0',
                      borderBottom: index < 3 ? '1px solid #e2e8f0' : 'none'
                    }}>
                      <div>
                        <div style={{ fontWeight: 500, fontSize: '14px' }}>{system.name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{system.status}</div>
                      </div>
                      <div style={{ 
                        fontSize: '14px', 
                        fontWeight: 600,
                        color: system.uptime.includes('97') ? 'var(--warning)' : 'var(--success)'
                      }}>
                        {system.uptime}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Work Order Modal */}
        <WorkOrderModal
          isOpen={showModal}
          workOrder={editingWorkOrder}
          onClose={() => setShowModal(false)}
          onSave={handleSaveWorkOrder}
          loading={!!actionLoading}
        />
      </div>
    </>
  );
};

export default Dashboard;