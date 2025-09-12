import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Theme } from '@carbon/react';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import ProductionDashboard from './pages/ProductionDashboard';
import Manufacturing from './pages/Manufacturing';
import EnhancedManufacturing from './pages/EnhancedManufacturing';
import HealthMedical from './pages/HealthMedical';
import Financials from './pages/Financials';
import HRManagement from './pages/HRManagement';
import SupplyChain from './pages/SupplyChain';
import CRMManagement from './pages/CRMManagement';
import BusinessIntelligence from './pages/BusinessIntelligence';
import ProjectManagement from './pages/ProjectManagement';
import AssetManagement from './pages/AssetManagement';
import Compliance from './pages/Compliance';

function App() {
  return (
    <Theme theme="white">
      <ErrorBoundary>
        <div className="titan-app">
          <Header />
          <main className="titan-main" id="dashboard-view">
            <ErrorBoundary>
              <Routes>
                <Route path="/" element={<ProductionDashboard />} />
                <Route path="/dashboard" element={<ProductionDashboard />} />
                <Route path="/legacy-dashboard" element={<Dashboard />} />
                <Route path="/manufacturing" element={<EnhancedManufacturing />} />
                <Route path="/legacy-manufacturing" element={<Manufacturing />} />
                <Route path="/health-medical" element={<HealthMedical />} />
                <Route path="/financials" element={<Financials />} />
                <Route path="/hr-management" element={<HRManagement />} />
                <Route path="/supply-chain" element={<SupplyChain />} />
                <Route path="/crm" element={<CRMManagement />} />
                <Route path="/business-intelligence" element={<BusinessIntelligence />} />
                <Route path="/project-management" element={<ProjectManagement />} />
                <Route path="/asset-management" element={<AssetManagement />} />
                <Route path="/compliance" element={<Compliance />} />
              </Routes>
            </ErrorBoundary>
          </main>
        </div>
      </ErrorBoundary>
    </Theme>
  );
}

export default App;