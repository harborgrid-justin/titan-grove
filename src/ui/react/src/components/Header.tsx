import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Header as CarbonHeader,
  HeaderContainer,
  HeaderName,
  HeaderNavigation,
  HeaderMenuItem,
  HeaderGlobalBar,
  HeaderGlobalAction,
  Search,
  SkipToContent,
} from '@carbon/react';
import {
  Search as SearchIcon,
  Notification,
  UserAvatar,
} from '@carbon/icons-react';

const Header: React.FC = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Legacy/Core navigation items
  const navItems = [
    { path: '/dashboard', label: 'Executive Dashboard', icon: '🏢' },
    { path: '/manufacturing', label: 'Manufacturing', icon: '🏭' },
    { path: '/health-medical', label: 'Health & Medical', icon: '🏥' },
    { path: '/financials', label: 'Financials', icon: '💰' },
    { path: '/hr-management', label: 'HR Management', icon: '👥' },
    { path: '/supply-chain', label: 'Supply Chain', icon: '🚚' },
    { path: '/crm', label: 'CRM', icon: '🤝' },
    { path: '/business-intelligence', label: 'BI & Analytics', icon: '📊' },
    { path: '/project-management', label: 'Projects', icon: '📋' },
    { path: '/asset-management', label: 'Assets', icon: '🏢' },
    { path: '/compliance', label: 'Compliance', icon: '⚖️' }
  ];

  // Enterprise Suite navigation categories
  const enterpriseNav = [
    {
      label: 'Advanced Analytics',
      icon: '📊',
      items: [
        { path: '/advanced-analytics/real-time-bi', label: 'Real-time BI' },
        { path: '/advanced-analytics/predictive-engine', label: 'Predictive Analytics' },
        { path: '/advanced-analytics/executive-scorecard', label: 'Executive Scorecard' },
        { path: '/advanced-analytics/report-builder', label: 'Report Builder' },
        { path: '/advanced-analytics/visualization-studio', label: 'Visualization Studio' },
        { path: '/advanced-analytics/performance-metrics', label: 'Performance Metrics' },
        { path: '/advanced-analytics/trend-analysis', label: 'Trend Analysis' },
        { path: '/advanced-analytics/benchmark-comparison', label: 'Benchmarking' }
      ]
    },
    {
      label: 'Customer Experience',
      icon: '🤝',
      items: [
        { path: '/customer-experience/journey-mapping', label: 'Journey Mapping' },
        { path: '/customer-experience/sales-pipeline', label: 'Sales Pipeline' },
        { path: '/customer-experience/sentiment-analysis', label: 'Sentiment Analysis' },
        { path: '/customer-experience/dynamic-pricing', label: 'Dynamic Pricing' },
        { path: '/customer-experience/quote-configuration', label: 'Quote Configuration' },
        { path: '/customer-experience/loyalty-management', label: 'Loyalty Management' },
        { path: '/customer-experience/competitive-intelligence', label: 'Competitive Intel' },
        { path: '/customer-experience/revenue-recognition', label: 'Revenue Recognition' }
      ]
    },
    {
      label: 'Supply Chain',
      icon: '🚛',
      items: [
        { path: '/supply-chain-excellence/supplier-scorecard', label: 'Supplier Scorecard' },
        { path: '/supply-chain-excellence/demand-forecasting', label: 'Demand Forecasting' },
        { path: '/supply-chain-excellence/inventory-optimization', label: 'Inventory Optimization' },
        { path: '/supply-chain-excellence/logistics-command', label: 'Logistics Command' },
        { path: '/supply-chain-excellence/risk-management', label: 'Risk Management' },
        { path: '/supply-chain-excellence/sustainability', label: 'Sustainability Tracking' },
        { path: '/supply-chain-excellence/vendor-collaboration', label: 'Vendor Collaboration' },
        { path: '/supply-chain-excellence/contract-management', label: 'Contract Management' }
      ]
    },
    {
      label: 'Financial Management',
      icon: '💰',
      items: [
        { path: '/financial-management/planning-analysis', label: 'Planning & Analysis' },
        { path: '/financial-management/treasury', label: 'Treasury Management' },
        { path: '/financial-management/risk-assessment', label: 'Risk Assessment' },
        { path: '/financial-management/investment-portfolio', label: 'Investment Portfolio' },
        { path: '/financial-management/cash-flow', label: 'Cash Flow Forecasting' },
        { path: '/financial-management/expense-management', label: 'Expense Management' },
        { path: '/financial-management/audit-trail', label: 'Audit Trail' },
        { path: '/financial-management/regulatory-compliance', label: 'Regulatory Compliance' }
      ]
    },
    {
      label: 'Workforce & Talent',
      icon: '👥',
      items: [
        { path: '/workforce-talent/talent-acquisition', label: 'Talent Acquisition' },
        { path: '/workforce-talent/employee-engagement', label: 'Employee Engagement' },
        { path: '/workforce-talent/skills-management', label: 'Skills Management' },
        { path: '/workforce-talent/workforce-analytics', label: 'Workforce Analytics' },
        { path: '/workforce-talent/learning-development', label: 'Learning & Development' },
        { path: '/workforce-talent/performance-management', label: 'Performance Management' },
        { path: '/workforce-talent/succession-planning', label: 'Succession Planning' },
        { path: '/workforce-talent/compensation-analysis', label: 'Compensation Analysis' }
      ]
    },
    {
      label: 'Operations',
      icon: '⚙️',
      items: [
        { path: '/operations-excellence/process-mining', label: 'Process Mining' },
        { path: '/operations-excellence/automation-finder', label: 'Automation Finder' },
        { path: '/operations-excellence/continuous-improvement', label: 'Continuous Improvement' },
        { path: '/operations-excellence/digital-transformation', label: 'Digital Transformation' },
        { path: '/operations-excellence/excellence-center', label: 'Excellence Center' },
        { path: '/operations-excellence/service-level', label: 'Service Level Mgmt' },
        { path: '/operations-excellence/change-management', label: 'Change Management' },
        { path: '/operations-excellence/process-designer', label: 'Process Designer' }
      ]
    },
    {
      label: 'Innovation',
      icon: '💡',
      items: [
        { path: '/innovation-strategy/pipeline-manager', label: 'Pipeline Manager' },
        { path: '/innovation-strategy/strategic-planning', label: 'Strategic Planning' },
        { path: '/innovation-strategy/market-intelligence', label: 'Market Intelligence' }
      ]
    }
  ];

  const isActive = (path: string) => {
    return location.pathname === path || (path === '/dashboard' && location.pathname === '/');
  };

  const isEnterpriseActive = (category: typeof enterpriseNav[0]) => {
    return category.items.some(item => location.pathname.startsWith(item.path));
  };

  return (
    <HeaderContainer
      render={({ isSideNavExpanded, onClickSideNavExpand }) => (
        <CarbonHeader aria-label="Titan Grove Enterprise Suite">
          <SkipToContent />
          <HeaderName element={Link} to="/" prefix="">
            ⚡ Titan Grove
            <span style={{ 
              fontSize: '0.75rem', 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '2px 6px',
              borderRadius: '4px',
              marginLeft: '8px'
            }}>
              Enterprise
            </span>
          </HeaderName>
          <HeaderNavigation aria-label="Titan Grove Enterprise Suite">
            {navItems.map((item) => (
              <HeaderMenuItem
                key={item.path}
                element={Link}
                to={item.path}
                isActive={isActive(item.path)}
              >
                <span style={{ marginRight: '8px' }}>{item.icon}</span>
                {item.label}
              </HeaderMenuItem>
            ))}
            
            {/* Enterprise Suite Link */}
            <HeaderMenuItem
              element={Link}
              to="/enterprise-suite"
              isActive={location.pathname === '/enterprise-suite'}
            >
              <span style={{ 
                fontSize: '0.75rem',
                background: 'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)',
                color: 'white',
                padding: '4px 10px',
                borderRadius: '4px',
                fontWeight: '600',
                marginRight: '4px'
              }}>
                ⭐
              </span>
              Enterprise Suite (49 Features)
            </HeaderMenuItem>
          </HeaderNavigation>
          <HeaderGlobalBar>
            <HeaderGlobalAction
              aria-label="Search"
              tooltipAlignment="center"
              onClick={() => {/* Add search functionality */}}
            >
              <SearchIcon size={20} />
            </HeaderGlobalAction>
            <HeaderGlobalAction
              aria-label="Notifications"
              tooltipAlignment="center"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Notification size={20} />
            </HeaderGlobalAction>
            <HeaderGlobalAction
              aria-label="User Avatar"
              tooltipAlignment="end"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <UserAvatar size={20} />
            </HeaderGlobalAction>
          </HeaderGlobalBar>
        </CarbonHeader>
      )}
    />
  );
};

export default Header;