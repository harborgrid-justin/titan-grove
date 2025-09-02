import React from 'react';
import Sidebar from '../components/Sidebar';

const Manufacturing: React.FC = () => {
  return (
    <>
      <Sidebar />
      <div className="titan-content">
        <div className="titan-dashboard">
          <div className="titan-dashboard-header">
            <h1 className="titan-dashboard-title">🏭 Manufacturing Operations</h1>
            <div className="titan-dashboard-actions">
              <button className="titan-button">📊 Production Report</button>
              <button className="titan-button titan-button-secondary">⚙️ Configure MES</button>
            </div>
          </div>

          <div className="titan-section">
            <h2 className="titan-section-title">
              <span>📈</span>
              Production KPIs
            </h2>
            <div className="titan-kpi-grid">
              <div className="titan-kpi">
                <div className="titan-kpi-title">Overall Equipment Effectiveness</div>
                <div className="titan-kpi-value">87.4%</div>
                <div className="titan-kpi-change positive">
                  <span>↗️</span>
                  <span>+3.2% vs last week</span>
                </div>
              </div>
              <div className="titan-kpi">
                <div className="titan-kpi-title">Production Volume</div>
                <div className="titan-kpi-value">12,847 units</div>
                <div className="titan-kpi-change positive">
                  <span>↗️</span>
                  <span>+5.8% vs target</span>
                </div>
              </div>
              <div className="titan-kpi">
                <div className="titan-kpi-title">Quality Score</div>
                <div className="titan-kpi-value">99.2%</div>
                <div className="titan-kpi-change positive">
                  <span>↗️</span>
                  <span>+0.3% vs last month</span>
                </div>
              </div>
              <div className="titan-kpi">
                <div className="titan-kpi-title">Downtime Hours</div>
                <div className="titan-kpi-value">2.3 hrs</div>
                <div className="titan-kpi-change negative">
                  <span>↘️</span>
                  <span>+0.8 hrs vs last week</span>
                </div>
              </div>
            </div>
          </div>

          <div className="titan-section">
            <div className="titan-widget-grid">
              <div className="titan-widget">
                <h3 style={{ margin: '0 0 16px 0', color: 'var(--text-primary)' }}>
                  🏭 Production Lines Status
                </h3>
                <div style={{ padding: '16px 0' }}>
                  {[
                    { line: 'Assembly Line A', status: '✅ Running', efficiency: '94%', output: '245 units/hr' },
                    { line: 'Assembly Line B', status: '✅ Running', efficiency: '91%', output: '238 units/hr' },
                    { line: 'Quality Control', status: '⚠️ Maintenance', efficiency: '0%', output: '0 units/hr' },
                    { line: 'Packaging Line', status: '✅ Running', efficiency: '98%', output: '180 units/hr' }
                  ].map((line, index) => (
                    <div key={index} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 0',
                      borderBottom: index < 3 ? '1px solid #e2e8f0' : 'none'
                    }}>
                      <div>
                        <div style={{ fontWeight: 500, fontSize: '14px' }}>{line.line}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{line.status}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '14px', fontWeight: 600 }}>{line.efficiency}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{line.output}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="titan-widget">
                <h3 style={{ margin: '0 0 16px 0', color: 'var(--text-primary)' }}>
                  📊 Real-time Metrics
                </h3>
                <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface)', borderRadius: '6px' }}>
                  <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>📈</div>
                    <div>Live production dashboard</div>
                    <div style={{ fontSize: '14px', marginTop: '8px' }}>Real-time production monitoring and analytics</div>
                  </div>
                </div>
              </div>

              <div className="titan-widget">
                <h3 style={{ margin: '0 0 16px 0', color: 'var(--text-primary)' }}>
                  ⚡ Industry 4.0 Integration
                </h3>
                <div style={{ padding: '16px 0' }}>
                  {[
                    { system: 'IoT Sensors', count: '1,247', status: '✅ Connected' },
                    { system: 'Smart Machines', count: '89', status: '✅ Online' },
                    { system: 'AI Quality Control', count: '12', status: '✅ Active' },
                    { system: 'Digital Twins', count: '34', status: '✅ Synchronized' }
                  ].map((item, index) => (
                    <div key={index} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 0',
                      borderBottom: index < 3 ? '1px solid #e2e8f0' : 'none'
                    }}>
                      <div>
                        <div style={{ fontWeight: 500, fontSize: '14px' }}>{item.system}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{item.status}</div>
                      </div>
                      <div style={{ 
                        fontSize: '18px', 
                        fontWeight: 600,
                        color: 'var(--primary)'
                      }}>
                        {item.count}
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

export default Manufacturing;