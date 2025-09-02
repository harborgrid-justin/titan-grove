import React from 'react';
import Sidebar from '../components/Sidebar';

const Financials: React.FC = () => {
  return (
    <>
      <Sidebar />
      <div className="titan-content">
        <div className="titan-dashboard">
          <div className="titan-dashboard-header">
            <h1 className="titan-dashboard-title">💰 Financial Management</h1>
            <div className="titan-dashboard-actions">
              <button className="titan-button">📊 Financial Report</button>
              <button className="titan-button titan-button-secondary">⚙️ Configure GL</button>
            </div>
          </div>

          <div className="titan-section">
            <h2 className="titan-section-title">
              <span>💰</span>
              Financial KPIs
            </h2>
            <div className="titan-kpi-grid">
              <div className="titan-kpi">
                <div className="titan-kpi-title">Revenue (YTD)</div>
                <div className="titan-kpi-value">$124.5M</div>
                <div className="titan-kpi-change positive">
                  <span>↗️</span>
                  <span>+8.7% vs last year</span>
                </div>
              </div>
              <div className="titan-kpi">
                <div className="titan-kpi-title">EBITDA Margin</div>
                <div className="titan-kpi-value">23.8%</div>
                <div className="titan-kpi-change positive">
                  <span>↗️</span>
                  <span>+1.2% vs target</span>
                </div>
              </div>
              <div className="titan-kpi">
                <div className="titan-kpi-title">Cash Flow</div>
                <div className="titan-kpi-value">$18.2M</div>
                <div className="titan-kpi-change positive">
                  <span>↗️</span>
                  <span>+15.3% vs last quarter</span>
                </div>
              </div>
              <div className="titan-kpi">
                <div className="titan-kpi-title">Operating Ratio</div>
                <div className="titan-kpi-value">76.2%</div>
                <div className="titan-kpi-change negative">
                  <span>↘️</span>
                  <span>-2.1% vs target</span>
                </div>
              </div>
            </div>
          </div>

          <div className="titan-widget-grid">
            <div className="titan-widget">
              <h3 style={{ margin: '0 0 16px 0' }}>📈 P&L Summary</h3>
              <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface)', borderRadius: '6px' }}>
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                  <div>Interactive P&L chart will be rendered here</div>
                </div>
              </div>
            </div>
            <div className="titan-widget">
              <h3 style={{ margin: '0 0 16px 0' }}>💳 Accounts Receivable</h3>
              <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface)', borderRadius: '6px' }}>
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                  <div>AR aging analysis will be rendered here</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Financials;