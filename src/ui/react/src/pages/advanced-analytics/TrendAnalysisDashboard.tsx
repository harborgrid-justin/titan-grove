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
  TrendUp,
  TrendDown,
  Analytics,
  ChartLine,
  Time,
  Calendar
} from '@carbon/icons-react';
import Sidebar from '../../components/Sidebar';
import KPIWidget from '../../components/KPIWidget';

interface TrendData {
  id: string;
  metric: string;
  category: string;
  currentValue: number;
  previousValue: number;
  trendDirection: 'up' | 'down' | 'stable';
  trendPercentage: number;
  forecast: number;
  confidence: number;
  timeframe: string;
}

const TrendAnalysisDashboard: React.FC = () => {
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('monthly');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    loadTrendData();
  }, [timeRange]);

  const loadTrendData = () => {
    setTimeout(() => {
      setTrends([
        {
          id: 'revenue-trend',
          metric: 'Monthly Revenue',
          category: 'Financial',
          currentValue: 2850000,
          previousValue: 2650000,
          trendDirection: 'up',
          trendPercentage: 7.5,
          forecast: 3100000,
          confidence: 87.2,
          timeframe: 'Monthly'
        },
        {
          id: 'customer-acquisition',
          metric: 'New Customers',
          category: 'Sales',
          currentValue: 156,
          previousValue: 142,
          trendDirection: 'up',
          trendPercentage: 9.9,
          forecast: 172,
          confidence: 82.1,
          timeframe: 'Monthly'
        },
        {
          id: 'support-tickets',
          metric: 'Support Tickets',
          category: 'Service',
          currentValue: 89,
          previousValue: 104,
          trendDirection: 'down',
          trendPercentage: -14.4,
          forecast: 75,
          confidence: 91.3,
          timeframe: 'Monthly'
        }
      ]);
      setLoading(false);
    }, 1500);
  };

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'up': return <TrendUp size={16} style={{ color: 'var(--cds-support-02)' }} />;
      case 'down': return <TrendDown size={16} style={{ color: 'var(--cds-support-01)' }} />;
      default: return <span style={{ color: 'var(--cds-text-02)' }}>→</span>;
    }
  };

  const filteredTrends = selectedCategory === 'All' 
    ? trends 
    : trends.filter(trend => trend.category === selectedCategory);

  const kpiData = [
    {
      title: 'Positive Trends',
      value: trends.filter(t => t.trendDirection === 'up').length.toString(),
      change: 15.2,
      format: 'number' as const
    },
    {
      title: 'Avg Trend %',
      value: `${(trends.reduce((sum, t) => sum + Math.abs(t.trendPercentage), 0) / trends.length).toFixed(1)}%`,
      change: 8.7,
      format: 'percentage' as const
    },
    {
      title: 'High Confidence',
      value: trends.filter(t => t.confidence > 85).length.toString(),
      change: 12.1,
      format: 'number' as const
    },
    {
      title: 'Forecast Accuracy',
      value: '91.2%',
      change: 3.4,
      format: 'percentage' as const
    }
  ];

  const headers = [
    { key: 'metric', header: 'Metric' },
    { key: 'category', header: 'Category' },
    { key: 'current', header: 'Current' },
    { key: 'trend', header: 'Trend' },
    { key: 'forecast', header: 'Forecast' },
    { key: 'confidence', header: 'Confidence' }
  ];

  const rows = filteredTrends.map(trend => ({
    id: trend.id,
    metric: trend.metric,
    category: trend.category,
    current: trend.currentValue.toLocaleString(),
    trend: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {getTrendIcon(trend.trendDirection)}
        <span style={{ 
          color: trend.trendDirection === 'up' ? 'var(--cds-support-02)' : 
                 trend.trendDirection === 'down' ? 'var(--cds-support-01)' : 'var(--cds-text-02)',
          fontWeight: 'bold'
        }}>
          {trend.trendPercentage > 0 ? '+' : ''}{trend.trendPercentage}%
        </span>
      </div>
    ),
    forecast: trend.forecast.toLocaleString(),
    confidence: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <ProgressBar value={trend.confidence} size="sm" />
        <span style={{ fontSize: '0.75rem' }}>{trend.confidence}%</span>
      </div>
    )
  }));

  if (loading) {
    return (
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{ flex: 1, padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Loading description="Loading trend analysis..." />
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
            <ChartLine size={32} />
            Trend Analysis Dashboard
          </h1>
          <p style={{ color: 'var(--cds-text-02)', marginBottom: '1rem' }}>
            Analyze trends, patterns, and forecasts across key business metrics
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Select
              id="time-range"
              labelText=""
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              size="sm"
            >
              <SelectItem value="weekly" text="Weekly" />
              <SelectItem value="monthly" text="Monthly" />
              <SelectItem value="quarterly" text="Quarterly" />
              <SelectItem value="yearly" text="Yearly" />
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
              <SelectItem value="Sales" text="Sales" />
              <SelectItem value="Service" text="Service" />
            </Select>
            
            <Button kind="primary" renderIcon={Analytics}>
              Generate Trend Report
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
                <TrendUp size={20} />
                Trend Analysis
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

export default TrendAnalysisDashboard;