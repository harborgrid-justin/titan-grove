import React, { useState, useEffect } from 'react';
import {
  Grid,
  Column,
  Tile,
  Button,
  Loading,
  DataTable,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  Select,
  SelectItem,
  Tag,
  ProgressBar
} from '@carbon/react';
import {
  Money,
  ArrowUp,
  Analytics,
  Calculator,
  Add,
  View,
  Settings
} from '@carbon/icons-react';
import Sidebar from '../../components/Sidebar';
import KPIWidget from '../../components/KPIWidget';

interface FinancialPlan {
  id: string;
  name: string;
  type: 'Budget' | 'ChartLineSmooth' | 'Scenario';
  period: string;
  department: string;
  totalAmount: number;
  actualAmount: number;
  variance: number;
  status: 'Active' | 'Draft' | 'Approved' | 'Locked';
  lastUpdated: string;
}

const FinancialPlanningAnalysis: React.FC = () => {
  const [plans, setPlans] = useState<FinancialPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('All');
  const [selectedPeriod, setSelectedPeriod] = useState('Current Year');

  useEffect(() => {
    loadFinancialData();
  }, []);

  const loadFinancialData = () => {
    setTimeout(() => {
      setPlans([
        {
          id: 'plan-1',
          name: 'Annual Operating Budget',
          type: 'Budget',
          period: '2024',
          department: 'Operations',
          totalAmount: 12500000,
          actualAmount: 3125000,
          variance: -125000,
          status: 'Active',
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'plan-2',
          name: 'Q1 Currency ChartLineSmooth',
          type: 'ChartLineSmooth',
          period: 'Q1 2024',
          department: 'Sales',
          totalAmount: 8500000,
          actualAmount: 2125000,
          variance: 75000,
          status: 'Approved',
          lastUpdated: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: 'plan-3',
          name: 'IT Infrastructure Investment',
          type: 'Budget',
          period: '2024',
          department: 'IT',
          totalAmount: 2400000,
          actualAmount: 850000,
          variance: -50000,
          status: 'Active',
          lastUpdated: new Date(Date.now() - 172800000).toISOString()
        }
      ]);
      setLoading(false);
    }, 1500);
  };

  const getVarianceColor = (variance: number) => {
    if (variance > 0) return 'var(--cds-support-02)';
    if (variance < 0) return 'var(--cds-support-01)';
    return 'var(--cds-text-02)';
  };

  const filteredPlans = plans.filter(plan => {
    if (selectedType !== 'All' && plan.type !== selectedType) return false;
    return true;
  });

  const kpiData = [
    {
      title: 'Total Budget',
      value: `$${(plans.reduce((sum, p) => sum + p.totalAmount, 0) / 1000000).toFixed(1)}M`,
      change: 12.5,
      format: 'currency' as const
    },
    {
      title: 'YTD Actual',
      value: `$${(plans.reduce((sum, p) => sum + p.actualAmount, 0) / 1000000).toFixed(1)}M`,
      change: 8.7,
      format: 'currency' as const
    },
    {
      title: 'Budget Variance',
      value: `${((plans.reduce((sum, p) => sum + p.variance, 0) / plans.reduce((sum, p) => sum + p.totalAmount, 0)) * 100).toFixed(1)}%`,
      change: -2.3,
      format: 'percentage' as const
    },
    {
      title: 'Active Plans',
      value: plans.filter(p => p.status === 'Active').length.toString(),
      change: 15.2,
      format: 'number' as const
    }
  ];

  const headers = [
    { key: 'name', header: 'Plan Name' },
    { key: 'type', header: 'Type' },
    { key: 'department', header: 'Department' },
    { key: 'budget', header: 'Budget' },
    { key: 'actual', header: 'Actual' },
    { key: 'variance', header: 'Variance' },
    { key: 'status', header: 'Status' },
    { key: 'actions', header: 'Actions' }
  ];

  const rows = filteredPlans.map(plan => ({
    id: plan.id,
    name: plan.name,
    type: plan.type,
    department: plan.department,
    budget: `$${(plan.totalAmount / 1000000).toFixed(1)}M`,
    actual: `$${(plan.actualAmount / 1000000).toFixed(1)}M`,
    variance: (
      <span style={{ 
        color: getVarianceColor(plan.variance),
        fontWeight: 'bold'
      }}>
        {plan.variance > 0 ? '+' : ''}${(plan.variance / 1000).toFixed(0)}K
      </span>
    ),
    status: (
      <Tag type={
        plan.status === 'Active' ? 'green' :
        plan.status === 'Approved' ? 'blue' :
        plan.status === 'Draft' ? 'gray' : 'yellow'
      }>
        {plan.status}
      </Tag>
    ),
    actions: (
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <Button size="sm" kind="primary" renderIcon={View}>
          View
        </Button>
        <Button size="sm" kind="secondary" renderIcon={Analytics}>
          Analyze
        </Button>
      </div>
    )
  }));

  if (loading) {
    return (
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{ flex: 1, padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Loading description="Loading financial planning data..." />
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '2rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: '600',
            marginBottom: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Calculator size={32} />
            Financial Planning & Analysis
          </h1>
          <p style={{ color: 'var(--cds-text-02)', marginBottom: '1rem' }}>
            Comprehensive financial planning, budgeting, and variance analysis platform
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Select
              id="type-filter"
              labelText=""
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              size="sm"
            >
              <SelectItem value="All" text="All Types" />
              <SelectItem value="Budget" text="Budget" />
              <SelectItem value="ChartLineSmooth" text="ChartLineSmooth" />
              <SelectItem value="Scenario" text="Scenario" />
            </Select>
            
            <Button kind="primary" renderIcon={Add}>
              Create Plan
            </Button>
            
            <Button kind="secondary" renderIcon={Analytics}>
              Financial Reports
            </Button>
            
            <Button kind="tertiary" renderIcon={ArrowUp}>
              Variance Analysis
            </Button>
          </div>
        </div>

        <Grid>
          {kpiData.map((kpi, index) => (
            <Column key={index} lg={4} md={4} sm={2}>
              <div style={{ marginBottom: '1rem' }}>
                <KPIWidget
                  title={kpi.title}
                  value={kpi.value}
                  change={kpi.change.toString()}
                  trend={kpi.change >= 0 ? 'positive' : 'negative'}
                  format={kpi.format}
                />
              </div>
            </Column>
          ))}
        </Grid>

        <Grid style={{ marginTop: '2rem' }}>
          <Column lg={12} md={8} sm={4}>
            <Tile style={{ padding: '1.5rem' }}>
              <h3 style={{ 
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Money size={20} />
                Financial Plans & Budgets
              </h3>
              
              <DataTable 
                rows={rows} 
                headers={headers}
                render={({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
                  <TableContainer>
                    <Table {...getTableProps()}>
                      <TableHead>
                        <TableRow>
                          {headers.map(header => (
                            <TableHeader key={header.key} {...getHeaderProps({ header })}>
                              {header.header}
                            </TableHeader>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {rows.map(row => (
                          <TableRow key={row.id} {...getRowProps({ row })}>
                            {row.cells.map(cell => (
                              <TableCell key={cell.id}>{cell.value}</TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              />
            </Tile>
          </Column>
        </Grid>
      </div>
    </div>
  );
};

export default FinancialPlanningAnalysis;