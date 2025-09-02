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
          </div>
          <div className="titan-widget">
            <h3>Human Resources Module</h3>
            <p>Employee management, payroll, benefits, and workforce analytics.</p>
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
          </div>
          <div className="titan-widget">
            <h3>Supply Chain Module</h3>
            <p>Procurement, logistics, inventory management, and supplier relations.</p>
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
          </div>
          <div className="titan-widget">
            <h3>CRM Module</h3>
            <p>Customer management, sales pipeline, and relationship analytics.</p>
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
          </div>
          <div className="titan-widget">
            <h3>BI & Analytics Module</h3>
            <p>Data analytics, reporting, dashboards, and predictive insights.</p>
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
          </div>
          <div className="titan-widget">
            <h3>Project Management Module</h3>
            <p>Project planning, resource allocation, and portfolio management.</p>
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
          </div>
          <div className="titan-widget">
            <h3>Asset Management Module</h3>
            <p>Fixed asset tracking, maintenance schedules, and lifecycle management.</p>
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
          </div>
          <div className="titan-widget">
            <h3>Compliance Module</h3>
            <p>Regulatory compliance, risk assessment, and audit management.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export { HRManagement, SupplyChain, CRMManagement, BusinessIntelligence, ProjectManagement, AssetManagement, Compliance };