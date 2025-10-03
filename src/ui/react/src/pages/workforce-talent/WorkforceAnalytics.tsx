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
  TableCell
} from '@carbon/react';
import {
  Analytics,
  ChartLine,
  UserMultiple,
  TrendUp,
  Add
} from '@carbon/icons-react';
import Sidebar from '../../components/Sidebar';
import KPIWidget from '../../components/KPIWidget';

interface WorkforceMetric {
  id: string;
  metric: string;
  value: number;
  unit: string;
  change: number;
  period: string;
}

const WorkforceAnalytics: React.FC = () => {
  const [metrics, setMetrics] = useState<WorkforceMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetricsData();
  }, []);

  const loadMetricsData = () => {
    setTimeout(() => {
      setMetrics([
        {
          id: 'metric-1',
          metric: 'Total Headcount',
          value: 1250,
          unit: 'employees',
          change: 5.2,
          period: 'Q1 2024'
        },
        {
          id: 'metric-2',
          metric: 'Turnover Rate',
          value: 8.5,
          unit: '%',
          change: -2.1,
          period: 'Q1 2024'
        },
        {
          id: 'metric-3',
          metric: 'Average Tenure',
          value: 4.2,
          unit: 'years',
          change: 0.8,
          period: 'Q1 2024'
        },
        {
          id: 'metric-4',
          metric: 'Engagement Score',
          value: 82,
          unit: '%',
          change: 3.5,
          period: 'Q1 2024'
        }
      ]);
      setLoading(false);
    }, 1000);
  };

  const kpiData = {
    totalHeadcount: 1250,
    turnoverRate: 8.5,
    avgTenure: 4.2,
    engagementScore: 82
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Loading description="Loading workforce analytics..." withOverlay={false} />
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
              <Analytics size={32} />
              Workforce Analytics
            </h1>
            <p style={{ marginBottom: '2rem', color: '#525252' }}>
              Comprehensive workforce metrics and analytics
            </p>
          </Column>

          <Column lg={4} md={4} sm={4}>
            <KPIWidget
              title="Total Headcount"
              value={kpiData.totalHeadcount.toString()}
              trend="up"
              trendValue="5.2%"
              icon={<UserMultiple size={24} />}
            />
          </Column>
          <Column lg={4} md={4} sm={4}>
            <KPIWidget
              title="Turnover Rate"
              value={`${kpiData.turnoverRate}%`}
              trend="down"
              trendValue="2.1%"
              icon={<ChartLine size={24} />}
            />
          </Column>
          <Column lg={4} md={4} sm={4}>
            <KPIWidget
              title="Avg Tenure"
              value={`${kpiData.avgTenure} years`}
              trend="up"
              trendValue="0.8 years"
              icon={<TrendUp size={24} />}
            />
          </Column>
          <Column lg={4} md={4} sm={4}>
            <KPIWidget
              title="Engagement Score"
              value={`${kpiData.engagementScore}%`}
              trend="up"
              trendValue="3.5%"
              icon={<Analytics size={24} />}
            />
          </Column>

          <Column lg={16} style={{ marginTop: '2rem' }}>
            <Tile style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3>Key Workforce Metrics</h3>
                <Button kind="primary" renderIcon={Add}>
                  Generate Report
                </Button>
              </div>

              <DataTable rows={[]} headers={[]}>
                {() => (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableHeader>Metric</TableHeader>
                          <TableHeader>Value</TableHeader>
                          <TableHeader>Unit</TableHeader>
                          <TableHeader>Change</TableHeader>
                          <TableHeader>Period</TableHeader>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {metrics.map((metric) => (
                          <TableRow key={metric.id}>
                            <TableCell>{metric.metric}</TableCell>
                            <TableCell>{metric.value}</TableCell>
                            <TableCell>{metric.unit}</TableCell>
                            <TableCell style={{ color: metric.change > 0 ? 'green' : 'red' }}>
                              {metric.change > 0 ? '+' : ''}{metric.change}%
                            </TableCell>
                            <TableCell>{metric.period}</TableCell>
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

export default WorkforceAnalytics;
