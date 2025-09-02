import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Manufacturing from './pages/Manufacturing';
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
    <div className="titan-app">
      <Header />
      <main className="titan-main" id="dashboard-view">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/manufacturing" element={<Manufacturing />} />
          <Route path="/financials" element={<Financials />} />
          <Route path="/hr-management" element={<HRManagement />} />
          <Route path="/supply-chain" element={<SupplyChain />} />
          <Route path="/crm" element={<CRMManagement />} />
          <Route path="/business-intelligence" element={<BusinessIntelligence />} />
          <Route path="/project-management" element={<ProjectManagement />} />
          <Route path="/asset-management" element={<AssetManagement />} />
          <Route path="/compliance" element={<Compliance />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;