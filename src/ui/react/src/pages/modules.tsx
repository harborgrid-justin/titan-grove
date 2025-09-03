import React from 'react';
import Sidebar from '../components/Sidebar';

const HRManagement: React.FC = () => {
  return (
    <>
      <Sidebar />
      <div className="titan-content">
        <div className="titan-dashboard">
          <div className="titan-dashboard-header">
            <h1 className="titan-dashboard-title">👥 HR Management</h1>
            <div className="titan-dashboard-actions">
              <button className="titan-button">➕ Add Employee</button>
              <button className="titan-button">📊 HR Report</button>
              <button className="titan-button titan-button-secondary">⚙️ Configure HRIS</button>
            </div>
          </div>
          <div className="titan-section">
            <h2 className="titan-section-title">
              <span>👥</span>
              Human Resources Module
            </h2>
            <div className="titan-widget">
              <h3>Enterprise Human Resources Management</h3>
              <p>Employee management, payroll, benefits, and workforce analytics with full CRUD operations.</p>
              <div style={{ marginTop: '16px', padding: '12px', background: 'var(--surface)', borderRadius: '6px' }}>
                <strong>Enhanced Features:</strong>
                <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                  <li>Complete employee lifecycle management</li>
                  <li>Real-time workforce analytics and reporting</li>
                  <li>Payroll and benefits administration</li>
                  <li>Performance management and reviews</li>
                  <li>Recruitment and onboarding workflows</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const SupplyChain: React.FC = () => {
  return (
    <>
      <Sidebar />
      <div className="titan-content">
        <div className="titan-dashboard">
          <div className="titan-dashboard-header">
            <h1 className="titan-dashboard-title">🚚 Supply Chain Management</h1>
            <div className="titan-dashboard-actions">
              <button className="titan-button">➕ Create PO</button>
              <button className="titan-button">📊 Supply Chain Report</button>
              <button className="titan-button titan-button-secondary">⚙️ Configure SCM</button>
            </div>
          </div>
          <div className="titan-section">
            <h2 className="titan-section-title">
              <span>🚚</span>
              Supply Chain Module
            </h2>
            <div className="titan-widget">
              <h3>Enterprise Supply Chain Management</h3>
              <p>Procurement, logistics, inventory management, and supplier relations with full CRUD operations.</p>
              <div style={{ marginTop: '16px', padding: '12px', background: 'var(--surface)', borderRadius: '6px' }}>
                <strong>Enhanced Features:</strong>
                <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                  <li>Purchase order creation and management</li>
                  <li>Real-time supplier performance tracking</li>
                  <li>Inventory optimization and forecasting</li>
                  <li>Logistics and distribution management</li>
                  <li>Supply chain analytics and reporting</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const CRMManagement: React.FC = () => {
  return (
    <>
      <Sidebar />
      <div className="titan-content">
        <div className="titan-dashboard">
          <div className="titan-dashboard-header">
            <h1 className="titan-dashboard-title">🤝 Customer Relationship Management</h1>
            <div className="titan-dashboard-actions">
              <button className="titan-button">➕ Add Customer</button>
              <button className="titan-button">📊 CRM Report</button>
              <button className="titan-button titan-button-secondary">⚙️ Configure CRM</button>
            </div>
          </div>
          <div className="titan-section">
            <h2 className="titan-section-title">
              <span>🤝</span>
              CRM Module
            </h2>
            <div className="titan-widget">
              <h3>Customer Relationship Management</h3>
              <p>Customer management, sales pipeline, and relationship analytics with full CRUD operations.</p>
              <div style={{ marginTop: '16px', padding: '12px', background: 'var(--surface)', borderRadius: '6px' }}>
                <strong>Enhanced Features:</strong>
                <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                  <li>Complete customer lifecycle management</li>
                  <li>Sales pipeline and opportunity tracking</li>
                  <li>Marketing campaign management</li>
                  <li>Customer service and support tickets</li>
                  <li>Revenue and sales analytics</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const BusinessIntelligence: React.FC = () => {
  return (
    <>
      <Sidebar />
      <div className="titan-content">
        <div className="titan-dashboard">
          <div className="titan-dashboard-header">
            <h1 className="titan-dashboard-title">📊 Business Intelligence & Analytics</h1>
            <div className="titan-dashboard-actions">
              <button className="titan-button">➕ Create Report</button>
              <button className="titan-button">📊 Generate Dashboard</button>
              <button className="titan-button titan-button-secondary">⚙️ Configure BI</button>
            </div>
          </div>
          <div className="titan-section">
            <h2 className="titan-section-title">
              <span>📊</span>
              BI & Analytics Module
            </h2>
            <div className="titan-widget">
              <h3>Real-time Analytics & Reporting</h3>
              <p>Data analytics, reporting, dashboards, and predictive insights with full CRUD operations.</p>
              <div style={{ marginTop: '16px', padding: '12px', background: 'var(--surface)', borderRadius: '6px' }}>
                <strong>Enhanced Features:</strong>
                <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                  <li>Create, edit, and delete analytical reports</li>
                  <li>Real-time dashboard management</li>
                  <li>Interactive data visualization</li>
                  <li>Automated report scheduling</li>
                  <li>Advanced filtering and search capabilities</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const ProjectManagement: React.FC = () => {
  return (
    <>
      <Sidebar />
      <div className="titan-content">
        <div className="titan-dashboard">
          <div className="titan-dashboard-header">
            <h1 className="titan-dashboard-title">📋 Project Management</h1>
            <div className="titan-dashboard-actions">
              <button className="titan-button">➕ Create Project</button>
              <button className="titan-button">📊 Project Report</button>
              <button className="titan-button titan-button-secondary">⚙️ Configure PM</button>
            </div>
          </div>
          <div className="titan-section">
            <h2 className="titan-section-title">
              <span>📋</span>
              Project Management Module
            </h2>
            <div className="titan-widget">
              <h3>Enterprise Project Portfolio Management</h3>
              <p>Project planning, resource allocation, and portfolio management with full CRUD operations.</p>
              <div style={{ marginTop: '16px', padding: '12px', background: 'var(--surface)', borderRadius: '6px' }}>
                <strong>Enhanced Features:</strong>
                <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                  <li>Create, edit, and manage project portfolios</li>
                  <li>Real-time resource allocation tracking</li>
                  <li>Interactive Gantt charts and timelines</li>
                  <li>Budget and cost management</li>
                  <li>Team collaboration tools</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const AssetManagement: React.FC = () => {
  return (
    <>
      <Sidebar />
      <div className="titan-content">
        <div className="titan-dashboard">
          <div className="titan-dashboard-header">
            <h1 className="titan-dashboard-title">🏢 Asset Management</h1>
            <div className="titan-dashboard-actions">
              <button className="titan-button">➕ Add Asset</button>
              <button className="titan-button">📊 Asset Report</button>
              <button className="titan-button titan-button-secondary">⚙️ Configure AM</button>
            </div>
          </div>
          <div className="titan-section">
            <h2 className="titan-section-title">
              <span>🏢</span>
              Asset Management Module
            </h2>
            <div className="titan-widget">
              <h3>Enterprise Asset Management</h3>
              <p>Fixed asset tracking, maintenance schedules, and lifecycle management with full CRUD operations.</p>
              <div style={{ marginTop: '16px', padding: '12px', background: 'var(--surface)', borderRadius: '6px' }}>
                <strong>Enhanced Features:</strong>
                <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                  <li>Complete asset lifecycle management</li>
                  <li>Real-time asset tracking and monitoring</li>
                  <li>Maintenance scheduling and work orders</li>
                  <li>Depreciation calculations and reporting</li>
                  <li>Asset performance analytics</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const Compliance: React.FC = () => {
  return (
    <>
      <Sidebar />
      <div className="titan-content">
        <div className="titan-dashboard">
          <div className="titan-dashboard-header">
            <h1 className="titan-dashboard-title">⚖️ Compliance & Risk</h1>
            <div className="titan-dashboard-actions">
              <button className="titan-button">➕ Add Compliance Item</button>
              <button className="titan-button">📊 Compliance Report</button>
              <button className="titan-button titan-button-secondary">⚙️ Configure Risk</button>
            </div>
          </div>
          <div className="titan-section">
            <h2 className="titan-section-title">
              <span>⚖️</span>
              Compliance & Risk Module
            </h2>
            <div className="titan-widget">
              <h3>Regulatory Compliance & Risk Management</h3>
              <p>Regulatory compliance, risk assessment, and audit management with full CRUD operations.</p>
              <div style={{ marginTop: '16px', padding: '12px', background: 'var(--surface)', borderRadius: '6px' }}>
                <strong>Enhanced Features:</strong>
                <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                  <li>Compliance tracking and management</li>
                  <li>Risk assessment and mitigation</li>
                  <li>Audit trail and documentation</li>
                  <li>Regulatory reporting automation</li>
                  <li>Policy and procedure management</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export { HRManagement, SupplyChain, CRMManagement, BusinessIntelligence, ProjectManagement, AssetManagement, Compliance };