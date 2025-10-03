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
  UserFollow,
  ChartTreemap,
  Trophy,
  StarFilled,
  Add
} from '@carbon/icons-react';
import Sidebar from '../../components/Sidebar';
import KPIWidget from '../../components/KPIWidget';

interface SuccessionPlan {
  id: string;
  position: string;
  currentHolder: string;
  successor: string;
  readiness: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  timeframe: string;
  status: 'Ready' | 'In Development' | 'Needs Assessment';
}

const SuccessionPlanningTool: React.FC = () => {
  const [plans, setPlans] = useState<SuccessionPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlansData();
  }, []);

  const loadPlansData = () => {
    setTimeout(() => {
      setPlans([
        {
          id: 'plan-1',
          position: 'VP of Engineering',
          currentHolder: 'John Smith',
          successor: 'Jane Doe',
          readiness: 85,
          riskLevel: 'Low',
          timeframe: '6 months',
          status: 'Ready'
        },
        {
          id: 'plan-2',
          position: 'Director of Sales',
          currentHolder: 'Mike Johnson',
          successor: 'Sarah Williams',
          readiness: 65,
          riskLevel: 'Medium',
          timeframe: '12 months',
          status: 'In Development'
        },
        {
          id: 'plan-3',
          position: 'CFO',
          currentHolder: 'David Brown',
          successor: 'TBD',
          readiness: 0,
          riskLevel: 'Critical',
          timeframe: '18 months',
          status: 'Needs Assessment'
        },
        {
          id: 'plan-4',
          position: 'Head of HR',
          currentHolder: 'Lisa Anderson',
          successor: 'Tom Wilson',
          readiness: 78,
          riskLevel: 'Low',
          timeframe: '9 months',
          status: 'In Development'
        }
      ]);
      setLoading(false);
    }, 1000);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'green';
      case 'Medium': return 'yellow';
      case 'High': return 'red';
      case 'Critical': return 'red';
      default: return 'gray';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ready': return 'green';
      case 'In Development': return 'blue';
      case 'Needs Assessment': return 'yellow';
      default: return 'gray';
    }
  };

  const kpiData = {
    totalPlans: plans.length,
    readySuccessors: plans.filter(p => p.status === 'Ready').length,
    criticalRoles: plans.filter(p => p.riskLevel === 'Critical').length,
    avgReadiness: plans.reduce((sum, p) => sum + p.readiness, 0) / plans.length
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Loading description="Loading succession plans..." withOverlay={false} />
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
              <ChartTreemap size={32} />
              Flow Planning Tool
            </h1>
            <p style={{ marginBottom: '2rem', color: '#525252' }}>
              Strategic succession planning and talent pipeline management
            </p>
          </Column>

          <Column lg={4} md={4} sm={4}>
            <KPIWidget
              title="Total Plans"
              value={kpiData.totalPlans.toString()}
              trend="neutral"
              trendValue="0%"
              icon={<ChartTreemap size={24} />}
            />
          </Column>
          <Column lg={4} md={4} sm={4}>
            <KPIWidget
              title="Ready Successors"
              value={kpiData.readySuccessors.toString()}
              trend="up"
              trendValue="15%"
              icon={<StarFilled size={24} />}
            />
          </Column>
          <Column lg={4} md={4} sm={4}>
            <KPIWidget
              title="Critical Roles"
              value={kpiData.criticalRoles.toString()}
              trend="down"
              trendValue="10%"
              icon={<Trophy size={24} />}
            />
          </Column>
          <Column lg={4} md={4} sm={4}>
            <KPIWidget
              title="Avg Readiness"
              value={`${kpiData.avgReadiness.toFixed(1)}%`}
              trend="up"
              trendValue="8%"
              icon={<UserFollow size={24} />}
            />
          </Column>

          <Column lg={16} style={{ marginTop: '2rem' }}>
            <Tile style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3>Flow Plans</h3>
                <Button kind="primary" renderIcon={Add}>
                  New Plan
                </Button>
              </div>

              <DataTable rows={[]} headers={[]}>
                {() => (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableHeader>Position</TableHeader>
                          <TableHeader>Current Holder</TableHeader>
                          <TableHeader>Successor</TableHeader>
                          <TableHeader>Readiness</TableHeader>
                          <TableHeader>Warning ChartLine</TableHeader>
                          <TableHeader>Timeframe</TableHeader>
                          <TableHeader>Status</TableHeader>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {plans.map((plan) => (
                          <TableRow key={plan.id}>
                            <TableCell>{plan.position}</TableCell>
                            <TableCell>{plan.currentHolder}</TableCell>
                            <TableCell>{plan.successor}</TableCell>
                            <TableCell>
                              <div style={{ width: '100px' }}>
                                <ProgressBar value={plan.readiness} label={`${plan.readiness}%`} />
                              </div>
                            </TableCell>
                            <TableCell>
                              <Tag type={getRiskColor(plan.riskLevel)}>
                                {plan.riskLevel}
                              </Tag>
                            </TableCell>
                            <TableCell>{plan.timeframe}</TableCell>
                            <TableCell>
                              <Tag type={getStatusColor(plan.status)}>
                                {plan.status}
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

export default SuccessionPlanningTool;
