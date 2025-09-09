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
  Compare,
  Trophy,
  TrendUp,
  TrendDown,
  Target,
  Analytics
} from '@carbon/icons-react';
import Sidebar from '../../components/Sidebar';
import KPIWidget from '../../components/KPIWidget';

interface BenchmarkData {
  id: string;
  metric: string;
  category: string;
  companyValue: number;
  industryAverage: number;
  topQuartile: number;
  bestInClass: number;
  unit: string;
  performance: 'leader' | 'above-average' | 'average' | 'below-average';
  gap: number;
}

const BenchmarkComparisonTool: React.FC = () => {
  const [benchmarks, setBenchmarks] = useState<BenchmarkData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndustry, setSelectedIndustry] = useState('Technology');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    loadBenchmarkData();
  }, [selectedIndustry]);

  const loadBenchmarkData = () => {
    setTimeout(() => {
      setBenchmarks([
        {
          id: 'revenue-per-employee',
          metric: 'Revenue per Employee',
          category: 'Financial',
          companyValue: 245000,
          industryAverage: 210000,
          topQuartile: 280000,
          bestInClass: 350000,
          unit: 'currency',
          performance: 'above-average',
          gap: 16.7
        },
        {
          id: 'customer-satisfaction',
          metric: 'Customer Satisfaction',
          category: 'Customer',
          companyValue: 87.5,
          industryAverage: 82.1,
          topQuartile: 91.2,
          bestInClass: 95.8,
          unit: 'percentage',
          performance: 'above-average',
          gap: 6.6
        },
        {
          id: 'operating-margin',
          metric: 'Operating Margin',
          category: 'Financial',
          companyValue: 22.1,
          industryAverage: 18.5,
          topQuartile: 25.3,
          bestInClass: 32.1,
          unit: 'percentage',
          performance: 'above-average',
          gap: 19.4
        },
        {
          id: 'employee-turnover',
          metric: 'Employee Turnover Rate',
          category: 'HR',
          companyValue: 12.3,
          industryAverage: 15.2,
          topQuartile: 8.5,
          bestInClass: 5.1,
          unit: 'percentage',
          performance: 'above-average',
          gap: -19.1
        }
      ]);
      setLoading(false);
    }, 1500);
  };

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'leader': return 'var(--cds-support-02)';
      case 'above-average': return 'var(--cds-support-04)';
      case 'average': return 'var(--cds-support-03)';
      case 'below-average': return 'var(--cds-support-01)';
      default: return 'var(--cds-text-02)';
    }
  };

  const getGapIndicator = (gap: number) => {
    if (gap > 0) {
      return <TrendUp size={16} style={{ color: 'var(--cds-support-02)' }} />;
    } else if (gap < 0) {
      return <TrendDown size={16} style={{ color: 'var(--cds-support-01)' }} />;
    }
    return <span style={{ color: 'var(--cds-text-02)' }}>→</span>;
  };

  const filteredBenchmarks = selectedCategory === 'All' 
    ? benchmarks 
    : benchmarks.filter(benchmark => benchmark.category === selectedCategory);

  const kpiData = [
    {
      title: 'Above Average',
      value: benchmarks.filter(b => b.companyValue > b.industryAverage).length.toString(),
      change: 15.2,
      format: 'number' as const
    },
    {
      title: 'Top Quartile',
      value: benchmarks.filter(b => b.companyValue >= b.topQuartile).length.toString(),
      change: 8.3,
      format: 'number' as const
    },
    {
      title: 'Avg Gap to Best',
      value: `${Math.abs(benchmarks.reduce((sum, b) => sum + b.gap, 0) / benchmarks.length).toFixed(1)}%`,
      change: -5.2,
      format: 'percentage' as const
    },
    {
      title: 'Performance Score',
      value: '78.5',
      change: 12.1,
      format: 'number' as const
    }
  ];

  const headers = [
    { key: 'metric', header: 'Metric' },
    { key: 'company', header: 'Company' },
    { key: 'industry', header: 'Industry Avg' },
    { key: 'topQuartile', header: 'Top Quartile' },
    { key: 'bestInClass', header: 'Best in Class' },
    { key: 'performance', header: 'Performance' },
    { key: 'gap', header: 'Gap' }
  ];

  const rows = filteredBenchmarks.map(benchmark => ({
    id: benchmark.id,
    metric: benchmark.metric,
    company: benchmark.unit === 'currency' 
      ? `$${benchmark.companyValue.toLocaleString()}`
      : benchmark.unit === 'percentage'
        ? `${benchmark.companyValue}%`
        : benchmark.companyValue.toString(),
    industry: benchmark.unit === 'currency' 
      ? `$${benchmark.industryAverage.toLocaleString()}`
      : benchmark.unit === 'percentage'
        ? `${benchmark.industryAverage}%`
        : benchmark.industryAverage.toString(),
    topQuartile: benchmark.unit === 'currency' 
      ? `$${benchmark.topQuartile.toLocaleString()}`
      : benchmark.unit === 'percentage'
        ? `${benchmark.topQuartile}%`
        : benchmark.topQuartile.toString(),
    bestInClass: benchmark.unit === 'currency' 
      ? `$${benchmark.bestInClass.toLocaleString()}`
      : benchmark.unit === 'percentage'
        ? `${benchmark.bestInClass}%`
        : benchmark.bestInClass.toString(),
    performance: (
      <Tag type={
        benchmark.performance === 'leader' ? 'green' :
        benchmark.performance === 'above-average' ? 'blue' :
        benchmark.performance === 'average' ? 'yellow' : 'red'
      }>
        {benchmark.performance.replace('-', ' ').toUpperCase()}
      </Tag>
    ),
    gap: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {getGapIndicator(benchmark.gap)}
        <span style={{ 
          color: benchmark.gap > 0 ? 'var(--cds-support-02)' : 'var(--cds-support-01)',
          fontWeight: 'bold'
        }}>
          {Math.abs(benchmark.gap)}%
        </span>
      </div>
    )
  }));

  if (loading) {
    return (
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{ flex: 1, padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Loading description="Loading benchmark data..." />
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
            <Compare size={32} />
            Benchmark Comparison Tool
          </h1>
          <p style={{ color: 'var(--cds-text-02)', marginBottom: '1rem' }}>
            Compare your performance against industry benchmarks and best-in-class metrics
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Select
              id="industry-select"
              labelText=""
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              size="sm"
            >
              <SelectItem value="Technology" text="Technology" />
              <SelectItem value="Manufacturing" text="Manufacturing" />
              <SelectItem value="Healthcare" text="Healthcare" />
              <SelectItem value="Financial" text="Financial Services" />
            </Select>
            
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
              <SelectItem value="HR" text="HR" />
            </Select>
            
            <Button kind="primary" renderIcon={Analytics}>
              Benchmark Report
            </Button>
            
            <Button kind="secondary" renderIcon={Target}>
              Set Targets
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
                <Trophy size={20} />
                Industry Benchmarks - {selectedIndustry}
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

export default BenchmarkComparisonTool;