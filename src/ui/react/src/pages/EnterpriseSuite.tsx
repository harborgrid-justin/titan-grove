import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Column, Tile, Button } from '@carbon/react';
import { 
  Analytics, 
  UserMultiple, 
  Delivery, 
  Currency, 
  GroupPresentation, 
  ChartNetwork,
  Idea
} from '@carbon/icons-react';

interface FeatureCategory {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  features: {
    path: string;
    name: string;
    description: string;
  }[];
  color: string;
}

const EnterpriseSuite: React.FC = () => {
  const navigate = useNavigate();

  const categories: FeatureCategory[] = [
    {
      id: 'analytics',
      title: 'Advanced Analytics & Reporting',
      icon: <Analytics size={32} />,
      description: 'Real-time insights, predictive models, and executive reporting',
      color: '#667eea',
      features: [
        { path: '/advanced-analytics/real-time-bi', name: 'Real-time BI Dashboard', description: 'Live metrics and KPIs' },
        { path: '/advanced-analytics/predictive-engine', name: 'Predictive Analytics', description: 'ML-powered forecasting' },
        { path: '/advanced-analytics/executive-scorecard', name: 'Executive Scorecard', description: 'Strategic KPI management' },
        { path: '/advanced-analytics/report-builder', name: 'Report Builder', description: 'Custom report creation' },
        { path: '/advanced-analytics/visualization-studio', name: 'Visualization Studio', description: 'Interactive dashboards' },
        { path: '/advanced-analytics/performance-metrics', name: 'Performance Metrics', description: 'Track goals and benchmarks' },
        { path: '/advanced-analytics/trend-analysis', name: 'Trend Analysis', description: 'Pattern recognition' },
        { path: '/advanced-analytics/benchmark-comparison', name: 'Benchmark Comparison', description: 'Industry comparisons' }
      ]
    },
    {
      id: 'customer',
      title: 'Customer Experience & Sales',
      icon: <UserMultiple size={32} />,
      description: 'Journey mapping, sentiment analysis, and revenue optimization',
      color: '#f093fb',
      features: [
        { path: '/customer-experience/journey-mapping', name: 'Customer Journey Mapping', description: 'Visualize touchpoints' },
        { path: '/customer-experience/sales-pipeline', name: 'Sales Pipeline Automation', description: 'Streamline sales process' },
        { path: '/customer-experience/sentiment-analysis', name: 'Sentiment Analysis', description: 'AI-powered insights' },
        { path: '/customer-experience/dynamic-pricing', name: 'Dynamic Pricing', description: 'Optimize pricing strategy' },
        { path: '/customer-experience/quote-configuration', name: 'Quote Configuration', description: 'Automated quoting' },
        { path: '/customer-experience/loyalty-management', name: 'Loyalty Management', description: 'Rewards programs' },
        { path: '/customer-experience/competitive-intelligence', name: 'Competitive Intelligence', description: 'Market positioning' },
        { path: '/customer-experience/revenue-recognition', name: 'Revenue Recognition', description: 'Accounting compliance' }
      ]
    },
    {
      id: 'supply-chain',
      title: 'Supply Chain Excellence',
      icon: <Delivery size={32} />,
      description: 'End-to-end supply chain optimization and visibility',
      color: '#4facfe',
      features: [
        { path: '/supply-chain-excellence/supplier-scorecard', name: 'Supplier Scorecard', description: 'Vendor performance' },
        { path: '/supply-chain-excellence/demand-forecasting', name: 'Demand Forecasting', description: 'Predictive planning' },
        { path: '/supply-chain-excellence/inventory-optimization', name: 'Inventory Optimization', description: 'Stock management' },
        { path: '/supply-chain-excellence/logistics-command', name: 'Logistics Command', description: 'Shipment tracking' },
        { path: '/supply-chain-excellence/risk-management', name: 'Risk Management', description: 'Mitigation strategies' },
        { path: '/supply-chain-excellence/sustainability', name: 'Sustainability Tracking', description: 'Environmental impact' },
        { path: '/supply-chain-excellence/vendor-collaboration', name: 'Vendor Collaboration', description: 'Partner portals' },
        { path: '/supply-chain-excellence/contract-management', name: 'Contract Management', description: 'Agreement lifecycle' }
      ]
    },
    {
      id: 'financial',
      title: 'Financial Management Advanced',
      icon: <Currency size={32} />,
      description: 'Treasury, risk assessment, and compliance management',
      color: '#43e97b',
      features: [
        { path: '/financial-management/planning-analysis', name: 'FP&A', description: 'Financial planning' },
        { path: '/financial-management/treasury', name: 'Treasury Management', description: 'Cash management' },
        { path: '/financial-management/risk-assessment', name: 'Risk Assessment', description: 'Financial risk analysis' },
        { path: '/financial-management/investment-portfolio', name: 'Investment Portfolio', description: 'Asset management' },
        { path: '/financial-management/cash-flow', name: 'Cash Flow Forecasting', description: 'Liquidity planning' },
        { path: '/financial-management/expense-management', name: 'Expense Management', description: 'Spend control' },
        { path: '/financial-management/audit-trail', name: 'Audit Trail', description: 'Compliance tracking' },
        { path: '/financial-management/regulatory-compliance', name: 'Regulatory Compliance', description: 'Regulatory reporting' }
      ]
    },
    {
      id: 'workforce',
      title: 'Workforce & Talent',
      icon: <GroupPresentation size={32} />,
      description: 'Talent acquisition, development, and performance management',
      color: '#fa709a',
      features: [
        { path: '/workforce-talent/talent-acquisition', name: 'Talent Acquisition', description: 'Recruiting platform' },
        { path: '/workforce-talent/employee-engagement', name: 'Employee Engagement', description: 'Engagement metrics' },
        { path: '/workforce-talent/skills-management', name: 'Skills Management', description: 'Competency tracking' },
        { path: '/workforce-talent/workforce-analytics', name: 'Workforce Analytics', description: 'HR insights' },
        { path: '/workforce-talent/learning-development', name: 'Learning & Development', description: 'Training programs' },
        { path: '/workforce-talent/performance-management', name: 'Performance Management', description: 'Reviews and goals' },
        { path: '/workforce-talent/succession-planning', name: 'Succession Planning', description: 'Talent pipelines' },
        { path: '/workforce-talent/compensation-analysis', name: 'Compensation Analysis', description: 'Pay equity' }
      ]
    },
    {
      id: 'operations',
      title: 'Operations Excellence',
      icon: <ChartNetwork size={32} />,
      description: 'Process optimization, automation, and continuous improvement',
      color: '#667eea',
      features: [
        { path: '/operations-excellence/process-mining', name: 'Process Mining', description: 'Process discovery' },
        { path: '/operations-excellence/automation-finder', name: 'Automation Finder', description: 'Automation opportunities' },
        { path: '/operations-excellence/continuous-improvement', name: 'Continuous Improvement', description: 'Kaizen tracking' },
        { path: '/operations-excellence/digital-transformation', name: 'Digital Transformation', description: 'Transformation roadmap' },
        { path: '/operations-excellence/excellence-center', name: 'Excellence Center', description: 'Best practices' },
        { path: '/operations-excellence/service-level', name: 'Service Level Management', description: 'SLA monitoring' },
        { path: '/operations-excellence/change-management', name: 'Change Management', description: 'Change control' },
        { path: '/operations-excellence/process-designer', name: 'Process Designer', description: 'Workflow design' }
      ]
    },
    {
      id: 'innovation',
      title: 'Innovation & Strategy',
      icon: <Idea size={32} />,
      description: 'Strategic planning, innovation pipelines, and market intelligence',
      color: '#f6d365',
      features: [
        { path: '/innovation-strategy/pipeline-manager', name: 'Innovation Pipeline', description: 'Idea management' },
        { path: '/innovation-strategy/strategic-planning', name: 'Strategic Planning', description: 'Strategy execution' },
        { path: '/innovation-strategy/market-intelligence', name: 'Market Intelligence', description: 'Competitive analysis' }
      ]
    }
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f4f4f4', padding: '2rem' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header Section */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '3rem 2rem',
          borderRadius: '12px',
          marginBottom: '2rem',
          color: 'white',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '1rem' }}>
            Enterprise Suite
          </h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.9, marginBottom: '1.5rem' }}>
            51 Advanced Business Features Across 7 Core Categories
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: '700' }}>49</div>
              <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>New Features</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: '700' }}>7</div>
              <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Categories</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: '700' }}>100%</div>
              <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>TypeScript/TSX</div>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        {categories.map((category) => (
          <div key={category.id} style={{ marginBottom: '2rem' }}>
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '2rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '1.5rem',
                paddingBottom: '1rem',
                borderBottom: `3px solid ${category.color}`
              }}>
                <div style={{ color: category.color }}>
                  {category.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.25rem', color: '#161616' }}>
                    {category.title}
                  </h2>
                  <p style={{ color: '#525252', fontSize: '0.95rem' }}>
                    {category.description}
                  </p>
                </div>
                <div style={{
                  background: category.color,
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  fontWeight: '600'
                }}>
                  {category.features.length} Features
                </div>
              </div>

              <Grid condensed>
                {category.features.map((feature) => (
                  <Column key={feature.path} lg={6} md={8} sm={4} style={{ marginBottom: '1rem' }}>
                    <Tile
                      style={{
                        height: '100%',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        border: '1px solid #e0e0e0'
                      }}
                      onClick={() => handleNavigate(feature.path)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                        e.currentTarget.style.borderColor = category.color;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.borderColor = '#e0e0e0';
                      }}
                    >
                      <div style={{ padding: '0.5rem' }}>
                        <h3 style={{ 
                          fontSize: '1rem', 
                          fontWeight: '600', 
                          marginBottom: '0.5rem',
                          color: '#161616'
                        }}>
                          {feature.name}
                        </h3>
                        <p style={{ fontSize: '0.875rem', color: '#525252', lineHeight: '1.4' }}>
                          {feature.description}
                        </p>
                      </div>
                    </Tile>
                  </Column>
                ))}
              </Grid>
            </div>
          </div>
        ))}

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          color: '#525252',
          fontSize: '0.9rem'
        }}>
          <p>
            All features built with TypeScript, React, and Carbon Design System
          </p>
          <p style={{ marginTop: '0.5rem' }}>
            Navigate to any feature by clicking its tile or use the direct URLs
          </p>
        </div>
      </div>
    </div>
  );
};

export default EnterpriseSuite;
