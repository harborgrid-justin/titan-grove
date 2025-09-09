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
  Bullhorn,
  Analytics,
  Add,
  View,
  FaceWink
} from '@carbon/icons-react';
import Sidebar from '../../components/Sidebar';
import KPIWidget from '../../components/KPIWidget';

interface EngagementMetric {
  id: string;
  employee: string;
  department: string;
  engagementScore: number;
  satisfactionScore: number;
  productivityScore: number;
  retentionRisk: 'Low' | 'Medium' | 'High';
  lastSurvey: string;
  trend: 'improving' | 'stable' | 'declining';
}

const EmployeeEngagementHub: React.FC = () => {
  const [metrics, setMetrics] = useState<EngagementMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEngagementData();
  }, []);

  const loadEngagementData = () => {
    setTimeout(() => {
      setMetrics([
        {
          id: 'emp-1',
          employee: 'Sarah Johnson',
          department: 'Engineering',
          engagementScore: 87,
          satisfactionScore: 92,
          productivityScore: 85,
          retentionRisk: 'Low',
          lastSurvey: '2024-01-10',
          trend: 'improving'
        },
        {
          id: 'emp-2',
          employee: 'Michael Chen',
          department: 'Sales',
          engagementScore: 73,
          satisfactionScore: 78,
          productivityScore: 81,
          retentionRisk: 'Medium',
          lastSurvey: '2024-01-08',
          trend: 'stable'
        }
      ]);
      setLoading(false);
    }, 1500);
  };

  const kpiData = [
    {
      title: 'Avg Engagement',
      value: `${(metrics.reduce((sum, m) => sum + m.engagementScore, 0) / metrics.length).toFixed(1)}%`,
      change: 8.3,
      format: 'percentage' as const
    },
    {
      title: 'High Risk Employees',
      value: metrics.filter(m => m.retentionRisk === 'High').length.toString(),
      change: -12.5,
      format: 'number' as const
    },
    {
      title: 'Satisfaction Score',
      value: `${(metrics.reduce((sum, m) => sum + m.satisfactionScore, 0) / metrics.length).toFixed(1)}%`,
      change: 15.2,
      format: 'percentage' as const
    },
    {
      title: 'Productivity Index',
      value: `${(metrics.reduce((sum, m) => sum + m.productivityScore, 0) / metrics.length).toFixed(1)}%`,
      change: 5.7,
      format: 'percentage' as const
    }
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{ flex: 1, padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Loading description="Loading engagement data..." />
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
            <FaceWink size={32} />
            Employee Engagement Hub
          </h1>
          <p style={{ color: 'var(--cds-text-02)', marginBottom: '1rem' }}>
            Monitor and improve employee engagement, satisfaction, and retention
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Button kind="primary" renderIcon={Add}>
              Launch Survey
            </Button>
            <Button kind="secondary" renderIcon={Analytics}>
              Engagement Report
            </Button>
            <Button kind="tertiary" renderIcon={Bullhorn}>
              Action Plans
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
              <h3 style={{ marginBottom: '1rem' }}>Employee Engagement Metrics</h3>
              <DataTable 
                rows={metrics.map(metric => ({
                  id: metric.id,
                  employee: metric.employee,
                  department: metric.department,
                  engagement: (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <ProgressBar value={metric.engagementScore} size="sm" />
                      <span style={{ fontSize: '0.75rem' }}>{metric.engagementScore}%</span>
                    </div>
                  ),
                  satisfaction: `${metric.satisfactionScore}%`,
                  productivity: `${metric.productivityScore}%`,
                  risk: (
                    <Tag type={
                      metric.retentionRisk === 'Low' ? 'green' :
                      metric.retentionRisk === 'Medium' ? 'yellow' : 'red'
                    }>
                      {metric.retentionRisk}
                    </Tag>
                  ),
                  trend: metric.trend,
                  actions: (
                    <Button size="sm" kind="ghost" renderIcon={View}>
                      View Profile
                    </Button>
                  )
                }))} 
                headers={[
                  { key: 'employee', header: 'Employee' },
                  { key: 'department', header: 'Department' },
                  { key: 'engagement', header: 'Engagement' },
                  { key: 'satisfaction', header: 'Satisfaction' },
                  { key: 'productivity', header: 'Productivity' },
                  { key: 'risk', header: 'Retention Risk' },
                  { key: 'trend', header: 'Trend' },
                  { key: 'actions', header: 'Actions' }
                ]}
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

export default EmployeeEngagementHub;