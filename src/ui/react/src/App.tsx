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
import EnterpriseSuite from './pages/EnterpriseSuite';

// Advanced Analytics & Reporting (8 features)
import {
  RealTimeBusinessIntelligence,
  PredictiveAnalyticsEngine,
  ExecutiveScorecardManagement,
  CustomReportBuilder,
  DataVisualizationStudio,
  PerformanceMetricsCenter,
  TrendAnalysisDashboard,
  BenchmarkComparisonTool
} from './pages/advanced-analytics';

// Customer Experience & Sales (8 features)
import {
  CustomerJourneyMapping,
  SalesPipelineAutomation,
  CustomerSentimentAnalysis,
  DynamicPricingEngine,
  QuoteConfigurationSystem,
  CustomerLoyaltyManagement,
  CompetitiveIntelligenceHub,
  RevenueRecognitionDashboard
} from './pages/customer-experience';

// Supply Chain Excellence (8 features)
import {
  SupplierPerformanceScorecard,
  DemandForecastingEngine,
  InventoryOptimizationHub,
  LogisticsCommandCenter,
  RiskManagementConsole,
  SustainabilityTracking,
  VendorCollaborationPortal,
  ContractManagementSystem
} from './pages/supply-chain';

// Financial Management Advanced (8 features)
import {
  FinancialPlanningAnalysis,
  TreasuryManagementConsole,
  RiskAssessmentDashboard,
  InvestmentPortfolioManager,
  CashFlowForecasting,
  ExpenseManagementPortal,
  AuditTrailExplorer,
  RegulatoryComplianceCenter
} from './pages/financial-management';

// Workforce & Talent (8 features)
import {
  TalentAcquisitionPortal,
  EmployeeEngagementHub,
  SkillsManagementSystem,
  WorkforceAnalytics,
  LearningDevelopmentCenter,
  PerformanceManagementSuite,
  SuccessionPlanningTool,
  CompensationAnalysis
} from './pages/workforce-talent';

// Operations Excellence (8 features)
import {
  ProcessMiningDashboard,
  AutomationOpportunityFinder,
  ContinuousImprovementTracker,
  DigitalTransformationHub,
  OperationalExcellenceCenter,
  ServiceLevelManagement,
  ChangeManagementPortal,
  BusinessProcessDesigner
} from './pages/operations-excellence';

// Innovation & Strategy (3 features)
import {
  InnovationPipelineManager,
  StrategicPlanningConsole,
  MarketIntelligenceCenter
} from './pages/innovation-strategy';

function App() {
  return (
    <Theme theme="white">
      <ErrorBoundary>
        <div className="titan-app">
          <Header />
          <main className="titan-main" id="dashboard-view">
            <ErrorBoundary>
              <Routes>
                {/* Core Dashboard Routes */}
                <Route path="/" element={<ProductionDashboard />} />
                <Route path="/dashboard" element={<ProductionDashboard />} />
                <Route path="/legacy-dashboard" element={<Dashboard />} />
                <Route path="/enterprise-suite" element={<EnterpriseSuite />} />
                
                {/* Legacy Module Routes */}
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
                
                {/* Advanced Analytics & Reporting (8 features) */}
                <Route path="/advanced-analytics/real-time-bi" element={<RealTimeBusinessIntelligence />} />
                <Route path="/advanced-analytics/predictive-engine" element={<PredictiveAnalyticsEngine />} />
                <Route path="/advanced-analytics/executive-scorecard" element={<ExecutiveScorecardManagement />} />
                <Route path="/advanced-analytics/report-builder" element={<CustomReportBuilder />} />
                <Route path="/advanced-analytics/visualization-studio" element={<DataVisualizationStudio />} />
                <Route path="/advanced-analytics/performance-metrics" element={<PerformanceMetricsCenter />} />
                <Route path="/advanced-analytics/trend-analysis" element={<TrendAnalysisDashboard />} />
                <Route path="/advanced-analytics/benchmark-comparison" element={<BenchmarkComparisonTool />} />
                
                {/* Customer Experience & Sales (8 features) */}
                <Route path="/customer-experience/journey-mapping" element={<CustomerJourneyMapping />} />
                <Route path="/customer-experience/sales-pipeline" element={<SalesPipelineAutomation />} />
                <Route path="/customer-experience/sentiment-analysis" element={<CustomerSentimentAnalysis />} />
                <Route path="/customer-experience/dynamic-pricing" element={<DynamicPricingEngine />} />
                <Route path="/customer-experience/quote-configuration" element={<QuoteConfigurationSystem />} />
                <Route path="/customer-experience/loyalty-management" element={<CustomerLoyaltyManagement />} />
                <Route path="/customer-experience/competitive-intelligence" element={<CompetitiveIntelligenceHub />} />
                <Route path="/customer-experience/revenue-recognition" element={<RevenueRecognitionDashboard />} />
                
                {/* Supply Chain Excellence (8 features) */}
                <Route path="/supply-chain-excellence/supplier-scorecard" element={<SupplierPerformanceScorecard />} />
                <Route path="/supply-chain-excellence/demand-forecasting" element={<DemandForecastingEngine />} />
                <Route path="/supply-chain-excellence/inventory-optimization" element={<InventoryOptimizationHub />} />
                <Route path="/supply-chain-excellence/logistics-command" element={<LogisticsCommandCenter />} />
                <Route path="/supply-chain-excellence/risk-management" element={<RiskManagementConsole />} />
                <Route path="/supply-chain-excellence/sustainability" element={<SustainabilityTracking />} />
                <Route path="/supply-chain-excellence/vendor-collaboration" element={<VendorCollaborationPortal />} />
                <Route path="/supply-chain-excellence/contract-management" element={<ContractManagementSystem />} />
                
                {/* Financial Management Advanced (8 features) */}
                <Route path="/financial-management/planning-analysis" element={<FinancialPlanningAnalysis />} />
                <Route path="/financial-management/treasury" element={<TreasuryManagementConsole />} />
                <Route path="/financial-management/risk-assessment" element={<RiskAssessmentDashboard />} />
                <Route path="/financial-management/investment-portfolio" element={<InvestmentPortfolioManager />} />
                <Route path="/financial-management/cash-flow" element={<CashFlowForecasting />} />
                <Route path="/financial-management/expense-management" element={<ExpenseManagementPortal />} />
                <Route path="/financial-management/audit-trail" element={<AuditTrailExplorer />} />
                <Route path="/financial-management/regulatory-compliance" element={<RegulatoryComplianceCenter />} />
                
                {/* Workforce & Talent (8 features) */}
                <Route path="/workforce-talent/talent-acquisition" element={<TalentAcquisitionPortal />} />
                <Route path="/workforce-talent/employee-engagement" element={<EmployeeEngagementHub />} />
                <Route path="/workforce-talent/skills-management" element={<SkillsManagementSystem />} />
                <Route path="/workforce-talent/workforce-analytics" element={<WorkforceAnalytics />} />
                <Route path="/workforce-talent/learning-development" element={<LearningDevelopmentCenter />} />
                <Route path="/workforce-talent/performance-management" element={<PerformanceManagementSuite />} />
                <Route path="/workforce-talent/succession-planning" element={<SuccessionPlanningTool />} />
                <Route path="/workforce-talent/compensation-analysis" element={<CompensationAnalysis />} />
                
                {/* Operations Excellence (8 features) */}
                <Route path="/operations-excellence/process-mining" element={<ProcessMiningDashboard />} />
                <Route path="/operations-excellence/automation-finder" element={<AutomationOpportunityFinder />} />
                <Route path="/operations-excellence/continuous-improvement" element={<ContinuousImprovementTracker />} />
                <Route path="/operations-excellence/digital-transformation" element={<DigitalTransformationHub />} />
                <Route path="/operations-excellence/excellence-center" element={<OperationalExcellenceCenter />} />
                <Route path="/operations-excellence/service-level" element={<ServiceLevelManagement />} />
                <Route path="/operations-excellence/change-management" element={<ChangeManagementPortal />} />
                <Route path="/operations-excellence/process-designer" element={<BusinessProcessDesigner />} />
                
                {/* Innovation & Strategy (3 features) */}
                <Route path="/innovation-strategy/pipeline-manager" element={<InnovationPipelineManager />} />
                <Route path="/innovation-strategy/strategic-planning" element={<StrategicPlanningConsole />} />
                <Route path="/innovation-strategy/market-intelligence" element={<MarketIntelligenceCenter />} />
              </Routes>
            </ErrorBoundary>
          </main>
        </div>
      </ErrorBoundary>
    </Theme>
  );
}

export default App;