import React, { useState, useEffect } from 'react';
import KPIWidget from '../components/KPIWidget';
import Sidebar from '../components/Sidebar';
import DataTable from '../components/DataTable';

const Dashboard: React.FC = () => {
  const [kpiData, setKpiData] = useState([
    { title: 'Total Revenue', value: '$24.5M', change: '+12.5%', trend: 'positive', format: 'currency' },
    { title: 'Active Orders', value: '1,247', change: '+8.2%', trend: 'positive', format: 'number' },
    { title: 'Production Efficiency', value: '94.2%', change: '+2.1%', trend: 'positive', format: 'percentage' },
    { title: 'Customer Satisfaction', value: '98.7%', change: '+0.8%', trend: 'positive', format: 'percentage' },
    { title: 'Inventory Turnover', value: '12.4x', change: '+5.3%', trend: 'positive', format: 'ratio' },
    { title: 'On-Time Delivery', value: '96.8%', change: '-1.2%', trend: 'negative', format: 'percentage' }
  ]);

  const [recentOrders] = useState([
    {
      id: 'WO-2024-001',
      product: 'Custom Engine Config-A47',
      facility: 'Detroit Plant #1',
      value: '$1,245,000',
      date: '2024-02-15',
      status: 'In Production',
      statusClass: 'success'
    },
    {
      id: 'WO-2024-002',
      product: 'Process Batch-B832',
      facility: 'Texas Facility #3',
      value: '$892,400',
      date: '2024-02-18',
      status: 'Setup',
      statusClass: 'warning'
    },
    {
      id: 'WO-2024-003',
      product: 'Assembly Line-C194',
      facility: 'California Plant #2',
      value: '$2,156,800',
      date: '2024-02-20',
      status: 'Quality Check',
      statusClass: 'success'
    },
    {
      id: 'WO-2024-004',
      product: 'Precision Component-D47',
      facility: 'Ohio Manufacturing',
      value: '$674,200',
      date: '2024-02-22',
      status: 'Pending',
      statusClass: 'warning'
    }
  ]);

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

  // Simulate real-time updates
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
              <button className="titan-button">📊 Generate Report</button>
              <button className="titan-button titan-button-secondary">⚙️ Configure</button>
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
            </h2>
            <DataTable
              columns={tableColumns}
              data={recentOrders}
              searchable={true}
              paginated={true}
            />
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
      </div>
    </>
  );
};

export default Dashboard;