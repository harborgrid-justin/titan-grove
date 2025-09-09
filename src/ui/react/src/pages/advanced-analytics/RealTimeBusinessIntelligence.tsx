import React, { useState, useEffect } from 'react';
import {
  Grid,
  Column,
  Tile,
  DataTable,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  Button,
  Loading,
  DefinitionTooltip,
  Dropdown,
  DatePicker,
  DatePickerInput
} from '@carbon/react';
import {
  Analytics,
  ChartLine,
  Dashboard,
  Report,
  DataBase,
  Time
} from '@carbon/icons-react';
import Sidebar from '../../components/Sidebar';
import KPIWidget from '../../components/KPIWidget';

interface BusinessMetric {
  id: string;
  name: string;
  value: number;
  change: number;
  trend: 'positive' | 'negative';
  category: 'Financial' | 'Operational' | 'Customer' | 'Employee';
  lastUpdated: string;
}

interface RealtimeData {
  revenue: number;
  orders: number;
  customers: number;
  efficiency: number;
  satisfaction: number;
  costs: number;
}

const RealTimeBusinessIntelligence: React.FC = () => {
  const [metrics, setMetrics] = useState<BusinessMetric[]>([]);
  const [realtimeData, setRealtimeData] = useState<RealtimeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [timeRange, setTimeRange] = useState('24h');

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      updateRealtimeData();
    }, 5000);

    // Initial data load
    loadInitialData();

    return () => clearInterval(interval);
  }, []);

  const loadInitialData = () => {
    // Simulate API call to business intelligence service
    setTimeout(() => {
      setMetrics([
        {
          id: 'revenue-growth',
          name: 'Revenue Growth',
          value: 2456789.50,
          change: 12.5,
          trend: 'positive',
          category: 'Financial',
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'customer-acquisition',
          name: 'Customer Acquisition Rate',
          value: 156,
          change: 8.3,
          trend: 'positive',
          category: 'Customer',
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'operational-efficiency',
          name: 'Operational Efficiency',
          value: 94.2,
          change: -1.2,
          trend: 'negative',
          category: 'Operational',
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'employee-satisfaction',
          name: 'Employee Satisfaction',
          value: 87.5,
          change: 3.1,
          trend: 'positive',
          category: 'Employee',
          lastUpdated: new Date().toISOString()
        }
      ]);

      setRealtimeData({
        revenue: 2456789.50,
        orders: 1247,
        customers: 8934,
        efficiency: 94.2,
        satisfaction: 87.5,
        costs: 1897654.30
      });

      setLoading(false);
    }, 1500);
  };

  const updateRealtimeData = () => {
    if (realtimeData) {
      setRealtimeData({
        revenue: realtimeData.revenue + (Math.random() - 0.5) * 10000,
        orders: realtimeData.orders + Math.floor((Math.random() - 0.5) * 20),
        customers: realtimeData.customers + Math.floor(Math.random() * 5),
        efficiency: Math.max(0, Math.min(100, realtimeData.efficiency + (Math.random() - 0.5) * 2)),
        satisfaction: Math.max(0, Math.min(100, realtimeData.satisfaction + (Math.random() - 0.5) * 1)),
        costs: realtimeData.costs + (Math.random() - 0.5) * 5000
      });
    }
  };

  const filteredMetrics = selectedCategory === 'All' 
    ? metrics 
    : metrics.filter(metric => metric.category === selectedCategory);

  const kpiData = realtimeData ? [
    { 
      title: 'Total Revenue', 
      value: `$${realtimeData.revenue.toLocaleString()}`, 
      change: 12.5, 
      format: 'currency' as const
    },
    { 
      title: 'Active Orders', 
      value: realtimeData.orders.toString(), 
      change: 8.3, 
      format: 'number' as const
    },
    { 
      title: 'Customer Count', 
      value: realtimeData.customers.toString(), 
      change: 5.7, 
      format: 'number' as const
    },
    { 
      title: 'Efficiency Rate', 
      value: `${realtimeData.efficiency.toFixed(1)}%`, 
      change: -1.2, 
      format: 'percentage' as const
    }
  ] : [];

  const tableHeaders = [
    { key: 'name', header: 'Metric' },
    { key: 'value', header: 'Value' },
    { key: 'change', header: 'Change (%)' },
    { key: 'category', header: 'Category' },
    { key: 'lastUpdated', header: 'Last Updated' }
  ];

  const tableRows = filteredMetrics.map(metric => ({
    id: metric.id,
    name: metric.name,
    value: metric.category === 'Financial' 
      ? `$${metric.value.toLocaleString()}` 
      : metric.value.toString(),
    change: (
      <span style={{ 
        color: metric.trend === 'positive' ? 'var(--cds-support-02)' : 'var(--cds-support-01)',
        fontWeight: 'bold'
      }}>
        {metric.change > 0 ? '+' : ''}{metric.change}%
      </span>
    ),
    category: metric.category,
    lastUpdated: new Date(metric.lastUpdated).toLocaleTimeString()
  }));

  if (loading) {
    return (
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{ flex: 1, padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Loading description="Loading business intelligence data..." />
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
            <Analytics size={32} />
            Real-Time Business Intelligence
          </h1>
          <p style={{ color: 'var(--cds-text-02)', marginBottom: '1rem' }}>
            Live dashboard with real-time business metrics and performance indicators
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
            <Dropdown
              id="category-filter"
              label="Filter by Category"
              items={['All', 'Financial', 'Operational', 'Customer', 'Employee']}
              selectedItem={selectedCategory}
              onChange={({ selectedItem }) => setSelectedCategory(selectedItem || 'All')}
            />
            
            <Dropdown
              id="time-range"
              label="Time Range"
              items={['1h', '24h', '7d', '30d']}
              selectedItem={timeRange}
              onChange={({ selectedItem }) => setTimeRange(selectedItem || '24h')}
            />
            
            <Button 
              kind="tertiary" 
              renderIcon={Time}
              onClick={() => updateRealtimeData()}
            >
              Refresh Data
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
          <Column lg={8} md={8} sm={4}>
            <Tile style={{ padding: '1.5rem' }}>
              <h3 style={{ 
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <ChartLine size={20} />
                Live Metrics Overview
              </h3>
              
              <DataTable 
                rows={tableRows} 
                headers={tableHeaders}
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

          <Column lg={4} md={4} sm={4}>
            <Tile style={{ padding: '1.5rem', marginBottom: '1rem' }}>
              <h4 style={{ 
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Dashboard size={16} />
                Quick Actions
              </h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Button size="sm" kind="primary" renderIcon={Report}>
                  Generate Report
                </Button>
                <Button size="sm" kind="secondary" renderIcon={DataBase}>
                  Export Data
                </Button>
                <Button size="sm" kind="tertiary">
                  Configure Alerts
                </Button>
              </div>
            </Tile>
            
            <Tile style={{ padding: '1.5rem' }}>
              <h4 style={{ marginBottom: '1rem' }}>System Status</h4>
              <div style={{ fontSize: '0.875rem', color: 'var(--cds-text-02)' }}>
                <div style={{ marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--cds-support-02)' }}>●</span> Data Pipeline: Active
                </div>
                <div style={{ marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--cds-support-02)' }}>●</span> Real-time Updates: Running
                </div>
                <div>
                  <span style={{ color: 'var(--cds-support-03)' }}>●</span> Last Refresh: {new Date().toLocaleTimeString()}
                </div>
              </div>
            </Tile>
          </Column>
        </Grid>
      </div>
    </div>
  );
};

export default RealTimeBusinessIntelligence;