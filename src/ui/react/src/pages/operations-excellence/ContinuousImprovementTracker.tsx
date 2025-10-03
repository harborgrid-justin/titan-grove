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
  Renew,
  ChartLine,
  CheckmarkFilled,
  TrendUp,
  Add
} from '@carbon/icons-react';
import Sidebar from '../../components/Sidebar';
import KPIWidget from '../../components/KPIWidget';

interface ImprovementInitiative {
  id: string;
  title: string;
  type: string;
  progress: number;
  impact: 'High' | 'Medium' | 'Low';
  status: 'Active' | 'Completed' | 'On Hold';
  savings: number;
}

const ContinuousImprovementTracker: React.FC = () => {
  const [initiatives, setInitiatives] = useState<ImprovementInitiative[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInitiativesData();
  }, []);

  const loadInitiativesData = () => {
    setTimeout(() => {
      setInitiatives([
        {
          id: 'init-1',
          title: 'Lean Manufacturing',
          type: 'Process',
          progress: 75,
          impact: 'High',
          status: 'Active',
          savings: 150000
        },
        {
          id: 'init-2',
          title: 'Six Sigma Quality',
          type: 'Quality',
          progress: 100,
          impact: 'High',
          status: 'Completed',
          savings: 200000
        },
        {
          id: 'init-3',
          title: 'Workflow Optimization',
          type: 'Process',
          progress: 50,
          impact: 'Medium',
          status: 'Active',
          savings: 85000
        }
      ]);
      setLoading(false);
    }, 1000);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High': return 'red';
      case 'Medium': return 'yellow';
      case 'Low': return 'green';
      default: return 'gray';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'blue';
      case 'Completed': return 'green';
      case 'On Hold': return 'yellow';
      default: return 'gray';
    }
  };

  const kpiData = {
    totalInitiatives: initiatives.length,
    avgProgress: initiatives.reduce((sum, i) => sum + i.progress, 0) / initiatives.length,
    completed: initiatives.filter(i => i.status === 'Completed').length,
    totalSavings: initiatives.reduce((sum, i) => sum + i.savings, 0)
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Loading description="Loading improvement initiatives..." withOverlay={false} />
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
              <Renew size={32} />
              Continuous Improvement Tracker
            </h1>
            <p style={{ marginBottom: '2rem', color: '#525252' }}>
              Track and manage continuous improvement initiatives
            </p>
          </Column>

          <Column lg={4} md={4} sm={4}>
            <KPIWidget
              title="Total Initiatives"
              value={kpiData.totalInitiatives.toString()}
              trend="up"
              trendValue="10%"
              icon={<Renew size={24} />}
            />
          </Column>
          <Column lg={4} md={4} sm={4}>
            <KPIWidget
              title="Avg Progress"
              value={`${kpiData.avgProgress.toFixed(1)}%`}
              trend="up"
              trendValue="12%"
              icon={<ChartLine size={24} />}
            />
          </Column>
          <Column lg={4} md={4} sm={4}>
            <KPIWidget
              title="Completed"
              value={kpiData.completed.toString()}
              trend="up"
              trendValue="8%"
              icon={<CheckmarkFilled size={24} />}
            />
          </Column>
          <Column lg={4} md={4} sm={4}>
            <KPIWidget
              title="Total Savings"
              value={`$${(kpiData.totalSavings / 1000).toFixed(0)}K`}
              trend="up"
              trendValue="25%"
              icon={<TrendUp size={24} />}
            />
          </Column>

          <Column lg={16} style={{ marginTop: '2rem' }}>
            <Tile style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3>Improvement Initiatives</h3>
                <Button kind="primary" renderIcon={Add}>
                  New Initiative
                </Button>
              </div>

              <DataTable rows={[]} headers={[]}>
                {() => (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableHeader>Title</TableHeader>
                          <TableHeader>Type</TableHeader>
                          <TableHeader>Progress</TableHeader>
                          <TableHeader>Impact</TableHeader>
                          <TableHeader>Status</TableHeader>
                          <TableHeader>Savings</TableHeader>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {initiatives.map((init) => (
                          <TableRow key={init.id}>
                            <TableCell>{init.title}</TableCell>
                            <TableCell>{init.type}</TableCell>
                            <TableCell>
                              <div style={{ width: '120px' }}>
                                <ProgressBar value={init.progress} label={`${init.progress}%`} />
                              </div>
                            </TableCell>
                            <TableCell>
                              <Tag type={getImpactColor(init.impact)}>
                                {init.impact}
                              </Tag>
                            </TableCell>
                            <TableCell>
                              <Tag type={getStatusColor(init.status)}>
                                {init.status}
                              </Tag>
                            </TableCell>
                            <TableCell>${(init.savings / 1000).toFixed(0)}K</TableCell>
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

export default ContinuousImprovementTracker;
