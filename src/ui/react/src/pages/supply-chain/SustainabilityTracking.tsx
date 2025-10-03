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
  Tag,
  ProgressBar
} from '@carbon/react';
import {
  EarthFilled,
  Renew,
  EnergyRenewable,
  Wheat,
  Add
} from '@carbon/icons-react';
import Sidebar from '../../components/Sidebar';
import KPIWidget from '../../components/KPIWidget';

interface SustainabilityMetric {
  id: string;
  metric: string;
  category: string;
  current: number;
  target: number;
  unit: string;
  trend: 'improving' | 'declining' | 'stable';
  status: 'On Track' | 'At Warning' | 'Critical';
}

const SustainabilityTracking: React.FC = () => {
  const [metrics, setMetrics] = useState<SustainabilityMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetricsData();
  }, []);

  const loadMetricsData = () => {
    setTimeout(() => {
      setMetrics([
        {
          id: 'metric-1',
          metric: 'Carbon Emissions',
          category: 'Environmental',
          current: 12500,
          target: 10000,
          unit: 'tons CO2',
          trend: 'improving',
          status: 'On Track'
        },
        {
          id: 'metric-2',
          metric: 'Renewable EnergyRenewable Usage',
          category: 'EnergyRenewable',
          current: 65,
          target: 80,
          unit: '%',
          trend: 'improving',
          status: 'On Track'
        },
        {
          id: 'metric-3',
          metric: 'Water Consumption',
          category: 'Environmental',
          current: 85000,
          target: 70000,
          unit: 'gallons',
          trend: 'declining',
          status: 'At Warning'
        },
        {
          id: 'metric-4',
          metric: 'Waste Recycling Rate',
          category: 'Waste Management',
          current: 72,
          target: 85,
          unit: '%',
          trend: 'stable',
          status: 'On Track'
        }
      ]);
      setLoading(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'On Track': return 'green';
      case 'At Warning': return 'yellow';
      case 'Critical': return 'red';
      default: return 'gray';
    }
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const kpiData = {
    onTrackMetrics: metrics.filter(m => m.status === 'On Track').length,
    atRiskMetrics: metrics.filter(m => m.status === 'At Warning').length,
    improvingTrends: metrics.filter(m => m.trend === 'improving').length,
    totalMetrics: metrics.length
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Loading description="Loading sustainability data..." withOverlay={false} />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '2rem', backgroundColor: '#f4f4f4', overflowY: 'auto' }}>
        <Grid>
          <Column lg={16}>
            <h1 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <EarthFilled size={32} />
              Sustainability Tracking
            </h1>
            <p style={{ marginBottom: '2rem', color: '#525252' }}>
              Environmental impact and sustainability metrics monitoring
            </p>
          </Column>

          {/* KPI Widgets */}
          <Column lg={4} md={4} sm={4}>
            <KPIWidget
              title="On Track Metrics"
              value={kpiData.onTrackMetrics.toString()}
              trend="up"
              trendValue="12%"
              icon={<EarthFilled size={24} />}
            />
          </Column>
          <Column lg={4} md={4} sm={4}>
            <KPIWidget
              title="At Warning Metrics"
              value={kpiData.atRiskMetrics.toString()}
              trend="down"
              trendValue="8%"
              icon={<Renew size={24} />}
            />
          </Column>
          <Column lg={4} md={4} sm={4}>
            <KPIWidget
              title="Improving Trends"
              value={kpiData.improvingTrends.toString()}
              trend="up"
              trendValue="18%"
              icon={<EnergyRenewable size={24} />}
            />
          </Column>
          <Column lg={4} md={4} sm={4}>
            <KPIWidget
              title="Total Metrics"
              value={kpiData.totalMetrics.toString()}
              trend="neutral"
              trendValue="0%"
              icon={<Wheat size={24} />}
            />
          </Column>

          {/* Sustainability Metrics */}
          <Column lg={16} style={{ marginTop: '2rem' }}>
            <Tile style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3>Sustainability Metrics Dashboard</h3>
                <Button kind="primary" renderIcon={Add}>
                  Add Metric
                </Button>
              </div>

              <DataTable rows={[]} headers={[]}>
                {() => (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableHeader>Metric</TableHeader>
                          <TableHeader>Category</TableHeader>
                          <TableHeader>Current</TableHeader>
                          <TableHeader>Task</TableHeader>
                          <TableHeader>Progress</TableHeader>
                          <TableHeader>Trend</TableHeader>
                          <TableHeader>Status</TableHeader>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {metrics.map((metric) => (
                          <TableRow key={metric.id}>
                            <TableCell>{metric.metric}</TableCell>
                            <TableCell>{metric.category}</TableCell>
                            <TableCell>{metric.current.toLocaleString()} {metric.unit}</TableCell>
                            <TableCell>{metric.target.toLocaleString()} {metric.unit}</TableCell>
                            <TableCell>
                              <div style={{ width: '150px' }}>
                                <ProgressBar 
                                  value={calculateProgress(metric.current, metric.target)} 
                                  label={`${calculateProgress(metric.current, metric.target).toFixed(1)}%`} 
                                />
                              </div>
                            </TableCell>
                            <TableCell>{metric.trend}</TableCell>
                            <TableCell>
                              <Tag type={getStatusColor(metric.status)}>
                                {metric.status}
                              </Tag>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </DataTable>
            </Tile>
          </Column>
        </Grid>
      </div>
    </div>
  );
};

export default SustainabilityTracking;
