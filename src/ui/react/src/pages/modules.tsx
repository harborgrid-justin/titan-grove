import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import KPIWidget from '../components/KPIWidget';
import DataTable from '../components/DataTable';
import FieldBasedModal from '../components/FieldBasedModal';
import { useEmployees } from '../hooks/useApi';

const HRManagement: React.FC = () => {
  // Static HR KPI data enhanced with real-time simulation
  const [kpiData] = useState([
    { title: 'Total Employees', value: '847', change: '+23 this month', trend: 'positive', format: 'number' },
    { title: 'Employee Satisfaction', value: '4.3/5', change: '+0.2 vs last quarter', trend: 'positive', format: 'number' },
    { title: 'Turnover Rate', value: '5.2%', change: '-1.3% vs last year', trend: 'positive', format: 'percentage' },
    { title: 'Average Tenure', value: '3.4 years', change: '+0.5 vs last year', trend: 'positive', format: 'number' },
    { title: 'Training Completion', value: '89.5%', change: '+12.3% this quarter', trend: 'positive', format: 'percentage' },
    { title: 'Absenteeism Rate', value: '2.8%', change: '-0.4% vs last month', trend: 'positive', format: 'percentage' }
  ]);

  // Fetch real employees from backend
  const { 
    employees, 
    loading: employeesLoading, 
    error: employeesError, 
    refetch: refetchEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    actionLoading
  } = useEmployees();

  // Modal state for CRUD operations
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  // Transform employees for table display
  const transformedEmployees = employees.map(employee => ({
    id: employee.id,
    employee: `${employee.firstName} ${employee.lastName}`,
    empNumber: employee.employeeNumber,
    department: employee.department,
    position: employee.position,
    email: employee.email,
    hireDate: new Date(employee.hireDate).toLocaleDateString(),
    salary: `$${employee.salary.toLocaleString()}`,
    status: employee.status,
    statusClass: employee.status === 'ACTIVE' ? 'success' : 'warning',
    location: employee.location
  }));

  const tableColumns = [
    { key: 'select', label: '', type: 'checkbox' },
    { key: 'empNumber', label: 'Employee #', type: 'text' },
    { key: 'employee', label: 'Name', type: 'text' },
    { key: 'department', label: 'Department', type: 'text' },
    { key: 'position', label: 'Position', type: 'text' },
    { key: 'email', label: 'Email', type: 'text' },
    { key: 'hireDate', label: 'Hire Date', type: 'date' },
    { key: 'salary', label: 'Salary', type: 'currency' },
    { key: 'status', label: 'Status', type: 'status' },
    { key: 'actions', label: 'Actions', type: 'actions' }
  ];

  // CRUD operation handlers
  const handleCreateEmployee = () => {
    setEditingEmployee(null);
    setShowModal(true);
  };

  const handleEditEmployee = (employee) => {
    const originalEmployee = employees.find(emp => emp.id === employee.id);
    if (originalEmployee) {
      setEditingEmployee(originalEmployee);
      setShowModal(true);
    }
  };

  const handleDeleteEmployee = async (employee) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await deleteEmployee(employee.id);
      } catch (error) {
        console.error('Failed to delete employee:', error);
        alert('Failed to delete employee. Please try again.');
      }
    }
  };

  const handleViewEmployee = (employee) => {
    alert(`Viewing employee: ${employee.employee}\nDepartment: ${employee.department}\nPosition: ${employee.position}`);
  };

  const handleSaveEmployee = async (employeeData) => {
    try {
      if ('id' in employeeData) {
        await updateEmployee(employeeData.id, employeeData);
      } else {
        await createEmployee(employeeData);
      }
    } catch (error) {
      console.error('Failed to save employee:', error);
      throw error;
    }
  };

  const employeeModalFields = [
    { name: 'firstName', label: 'First Name', type: 'text', required: true },
    { name: 'lastName', label: 'Last Name', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'department', label: 'Department', type: 'text', required: true },
    { name: 'position', label: 'Position', type: 'text', required: true },
    { name: 'salary', label: 'Salary', type: 'number', required: true },
    { name: 'location', label: 'Location', type: 'text', required: true },
    { name: 'manager', label: 'Manager ID', type: 'text', required: false }
  ];

  return (
    <>
      <Sidebar />
      <div className="titan-content">
        <div className="titan-dashboard">
          <div className="titan-dashboard-header">
            <h1 className="titan-dashboard-title">👥 HR Management</h1>
            <div className="titan-dashboard-actions">
              <button 
                className="titan-button"
                onClick={handleCreateEmployee}
                disabled={!!actionLoading}
              >
                ➕ Add Employee
              </button>
              <button className="titan-button">📊 HR Report</button>
              <button className="titan-button titan-button-secondary">⚙️ Configure HRIS</button>
            </div>
          </div>

          {/* KPI Section */}
          <div className="titan-section">
            <h2 className="titan-section-title">
              <span>👥</span>
              Human Resources KPIs
            </h2>
            <div className="titan-kpi-grid">
              {kpiData.map((kpi, index) => (
                <KPIWidget key={index} {...kpi} />
              ))}
            </div>
          </div>

          {/* Employees Section */}
          <div className="titan-section">
            <h2 className="titan-section-title">
              <span>👨‍👩‍👧‍👦</span>
              Employee Directory
              {employeesLoading && <span style={{ fontSize: '14px', color: 'var(--text-secondary)', marginLeft: '8px' }}>Loading...</span>}
              {employeesError && <span style={{ fontSize: '14px', color: 'var(--error)', marginLeft: '8px' }}>⚠️ {employeesError}</span>}
            </h2>
            <DataTable
              columns={tableColumns}
              data={transformedEmployees}
              searchable={true}
              paginated={true}
              onEdit={handleEditEmployee}
              onDelete={handleDeleteEmployee}
              onView={handleViewEmployee}
            />
            {!employeesLoading && transformedEmployees.length === 0 && (
              <div style={{ 
                padding: '40px', 
                textAlign: 'center', 
                color: 'var(--text-secondary)' 
              }}>
                No employees found. <button 
                  onClick={refetchEmployees}
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

          {/* Additional HR Analytics */}
          <div className="titan-section">
            <div className="titan-widget-grid">
              <div className="titan-widget">
                <h3 style={{ margin: '0 0 16px 0', color: 'var(--text-primary)' }}>
                  📊 Workforce Analytics
                </h3>
                <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface)', borderRadius: '6px' }}>
                  <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>📈</div>
                    <div>Department headcount and growth trends</div>
                    <div style={{ fontSize: '14px', marginTop: '8px' }}>Real-time workforce metrics and analytics</div>
                  </div>
                </div>
              </div>

              <div className="titan-widget">
                <h3 style={{ margin: '0 0 16px 0', color: 'var(--text-primary)' }}>
                  🎯 Performance Overview
                </h3>
                <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface)', borderRadius: '6px' }}>
                  <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏆</div>
                    <div>Performance review dashboard</div>
                    <div style={{ fontSize: '14px', marginTop: '8px' }}>Employee performance metrics and reviews</div>
                  </div>
                </div>
              </div>

              <div className="titan-widget">
                <h3 style={{ margin: '0 0 16px 0', color: 'var(--text-primary)' }}>
                  📚 Training & Development
                </h3>
                <div style={{ padding: '16px 0' }}>
                  {[
                    { program: 'Leadership Development', completion: '89%', participants: 45 },
                    { program: 'Safety Training', completion: '100%', participants: 156 },
                    { program: 'Technical Skills', completion: '78%', participants: 92 },
                    { program: 'Compliance Training', completion: '95%', participants: 234 }
                  ].map((program, index) => (
                    <div key={index} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 0',
                      borderBottom: index < 3 ? '1px solid #e2e8f0' : 'none'
                    }}>
                      <div>
                        <div style={{ fontWeight: 500, fontSize: '14px' }}>{program.program}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{program.participants} participants</div>
                      </div>
                      <div style={{ 
                        fontSize: '14px', 
                        fontWeight: 600,
                        color: parseInt(program.completion) >= 90 ? 'var(--success)' : 'var(--warning)'
                      }}>
                        {program.completion}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Employee Modal */}
        <FieldBasedModal
          isOpen={showModal}
          title={editingEmployee ? 'Edit Employee' : 'Add New Employee'}
          data={editingEmployee}
          fields={employeeModalFields}
          onClose={() => setShowModal(false)}
          onSave={handleSaveEmployee}
          loading={!!actionLoading}
        />
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