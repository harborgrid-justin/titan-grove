import React from 'react';

const Sidebar: React.FC = () => {
  return (
    <aside className="titan-sidebar slide-in-left">
      <h3>Enterprise Quick Actions</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-6)' }}>
        <button className="titan-button">Create Work Order</button>
        <button className="titan-button titan-button-secondary">Configure Product</button>
        <button className="titan-button titan-button-secondary">MES Dashboard</button>
        <button className="titan-button titan-button-secondary">Supply Chain View</button>
      </div>

      <h3>Fortune 100 Modules</h3>
      <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
        <div style={{ padding: 'var(--spacing-2) 0', borderBottom: '1px solid #e2e8f0' }}>
          <strong>🏭 Manufacturing</strong><br />
          Configure-to-Order Active
        </div>
        <div style={{ padding: 'var(--spacing-2) 0', borderBottom: '1px solid #e2e8f0' }}>
          <strong>💰 Financial Suite</strong><br />
          Real-time P&L Analytics
        </div>
        <div style={{ padding: 'var(--spacing-2) 0', borderBottom: '1px solid #e2e8f0' }}>
          <strong>🚚 Supply Chain</strong><br />
          Global Logistics Network
        </div>
        <div style={{ padding: 'var(--spacing-2) 0', borderBottom: '1px solid #e2e8f0' }}>
          <strong>👥 Human Capital</strong><br />
          Workforce Management
        </div>
        <div style={{ padding: 'var(--spacing-2) 0', borderBottom: '1px solid #e2e8f0' }}>
          <strong>🤝 Customer Success</strong><br />
          360° Relationship View
        </div>
        <div style={{ padding: 'var(--spacing-2) 0', borderBottom: '1px solid #e2e8f0' }}>
          <strong>📊 Business Intelligence</strong><br />
          Predictive Analytics Engine
        </div>
        <div style={{ padding: 'var(--spacing-2) 0', borderBottom: '1px solid #e2e8f0' }}>
          <strong>📋 Project Excellence</strong><br />
          Enterprise Project Office
        </div>
        <div style={{ padding: 'var(--spacing-2) 0', borderBottom: '1px solid #e2e8f0' }}>
          <strong>🏢 Asset Lifecycle</strong><br />
          Smart Asset Management
        </div>
        <div style={{ padding: 'var(--spacing-2) 0' }}>
          <strong>⚖️ Compliance & Risk</strong><br />
          Regulatory Excellence
        </div>
      </div>

      <div style={{ marginTop: 'var(--spacing-6)' }}>
        <h3>System Status</h3>
        <div style={{ fontSize: 'var(--text-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-2)' }}>
            <span style={{ color: 'var(--success)' }}>●</span>
            <span>All Systems Operational</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-2)' }}>
            <span style={{ color: 'var(--success)' }}>●</span>
            <span>Data Sync: Real-time</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
            <span style={{ color: 'var(--warning)' }}>●</span>
            <span>Maintenance: Scheduled</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;