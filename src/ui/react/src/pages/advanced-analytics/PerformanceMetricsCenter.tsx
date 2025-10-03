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
  ProgressBar,
  Tag
} from '@carbon/react';
import {
  Analytics,
  Trophy,
  ArrowUp,
  ArrowDown,
  Task,
  Compare,
  Dashboard
} from '@carbon/icons-react';
import Sidebar from '../../components/Sidebar';
import KPIWidget from '../../components/KPIWidget';

interface PerformanceMetric {
  id: string;
  name: string;
  category: string;
  currentValue: number;
  targetValue: number;
  benchmark: number;
  unit: string;
  trend: 'positive' | 'negative' | 'neutral';
  performance: 'excellent' | 'good' | 'average' | 'poor';
}

const PerformanceMetricsCenter: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    loadPerformanceData();
  }, []);

  const loadPerformanceData = () => {
    setTimeout(() => {
      setMetrics([
        {
          id: 'revenue-per-employee',
          name: 'Currency per UserMultiple',
          category: 'Financial',
          currentValue: 245000,
          targetValue: 250000,
          benchmark: 230000,
          unit: 'currency',
          trend: 'positive',
          performance: 'excellent'
        },
        {
          id: 'customer-lifetime-value',
          name: 'Customer Lifetime Value',
          category: 'Customer',
          currentValue: 125000,
          targetValue: 130000,
          benchmark: 115000,
          unit: 'currency',
          trend: 'positive',
          performance: 'good'
        },
        {
          id: 'operational-efficiency',
          name: 'Operational Efficiency',
          category: 'Operations',
          currentValue: 87.5,
          targetValue: 90.0,
          benchmark: 85.0,
          unit: 'percentage',
          trend: 'neutral',
          performance: 'good'
        }
      ]);
      setLoading(false);
    }, 1500);
  };

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'excellent': return 'var(--cds-support-02)';
      case 'good': return 'var(--cds-support-04)';
      case 'average': return 'var(--cds-support-03)';
      case 'poor': return 'var(--cds-support-01)';
      default: return 'var(--cds-text-02)';
    }
  };

  const filteredMetrics = selectedCategory === 'All' 
    ? metrics 
    : metrics.filter(metric => metric.category === selectedCategory);

  const kpiData = [
    {
      title: 'Total Metrics',
      value: metrics.length.toString(),
      change: 5.2,
      format: 'number' as const
    },
    {
      title: 'Excellent ChartLine',
      value: metrics.filter(m => m.performance === 'excellent').length.toString(),
      change: 12.1,
      format: 'number' as const
    },
    {
      title: 'Above Benchmark',
      value: metrics.filter(m => m.currentValue > m.benchmark).length.toString(),
      change: 8.3,
      format: 'number' as const
    },
    {
      title: 'On Task',
      value: metrics.filter(m => m.currentValue >= m.targetValue * 0.95).length.toString(),
      change: 3.7,
      format: 'number' as const
    }
  ];

  const headers = [
    { key: 'name', header: 'Metric' },
    { key: 'current', header: 'Current' },
    { key: 'target', header: 'Task' },
    { key: 'benchmark', header: 'Benchmark' },
    { key: 'progress', header: 'Progress' },
    { key: 'performance', header: 'ChartLine' }
  ];

  const rows = filteredMetrics.map(metric => ({
    id: metric.id,
    name: metric.name,
    current: metric.unit === 'currency' 
      ? `$${metric.currentValue.toLocaleString()}`
      : metric.unit === 'percentage'
        ? `${metric.currentValue}%`
        : metric.currentValue.toString(),
    target: metric.unit === 'currency' 
      ? `$${metric.targetValue.toLocaleString()}`
      : metric.unit === 'percentage'
        ? `${metric.targetValue}%`
        : metric.targetValue.toString(),
    benchmark: metric.unit === 'currency' 
      ? `$${metric.benchmark.toLocaleString()}`
      : metric.unit === 'percentage'
        ? `${metric.benchmark}%`
        : metric.benchmark.toString(),
    progress: (
      <ProgressBar 
        value={(metric.currentValue / metric.targetValue) * 100}
        size="sm"
        helperText={`${((metric.currentValue / metric.targetValue) * 100).toFixed(1)}%`}
      />
    ),
    performance: (
      <Tag type={
        metric.performance === 'excellent' ? 'green' :
        metric.performance === 'good' ? 'blue' :
        metric.performance === 'average' ? 'yellow' : 'red'
      }>
        {metric.performance.toUpperCase()}
      </Tag>
    )
  }));

  if (loading) {
    return (
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{ flex: 1, padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Loading description="Loading performance metrics..." />
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
            <Task size={32} />
            ChartLine Metrics Center
          </h1>
          <p style={{ color: 'var(--cds-text-02)', marginBottom: '1rem' }}>
            Track and analyze key performance indicators against targets and benchmarks
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Select
              id="category-filter"
              labelText=""
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              size="sm"
            >
              <SelectItem value="All" text="All Categories" />
              <SelectItem value="Financial" text="Financial" />
              <SelectItem value="Customer" text="Customer" />
              <SelectItem value="Operations" text="Operations" />
            </Select>
            
            <Button kind="primary" renderIcon={Analytics}>
              ChartLine Report
            </Button>
            
            <Button kind="secondary" renderIcon={Compare}>
              Benchmark Analysis
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
                <Task size={20} />
                ChartLine Metrics
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

export default PerformanceMetricsCenter;