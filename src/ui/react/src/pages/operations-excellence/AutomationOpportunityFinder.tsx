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
  Automation,
  ChartLine,
  Time,
  Money,
  Add
} from '@carbon/icons-react';
import Sidebar from '../../components/Sidebar';
import KPIWidget from '../../components/KPIWidget';

interface AutomationOpportunity {
  id: string;
  process: string;
  department: string;
  effort: number;
  roi: number;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Identified' | 'In Progress' | 'Implemented';
  estimatedSavings: number;
}

const AutomationOpportunityFinder: React.FC = () => {
  const [opportunities, setOpportunities] = useState<AutomationOpportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOpportunitiesData();
  }, []);

  const loadOpportunitiesData = () => {
    setTimeout(() => {
      setOpportunities([
        {
          id: 'opp-1',
          process: 'Invoice Processing',
          department: 'Finance',
          effort: 120,
          roi: 250,
          priority: 'High',
          status: 'Identified',
          estimatedSavings: 125000
        },
        {
          id: 'opp-2',
          process: 'Data Entry',
          department: 'Operations',
          effort: 80,
          roi: 300,
          priority: 'High',
          status: 'In Progress',
          estimatedSavings: 95000
        },
        {
          id: 'opp-3',
          process: 'Report Generation',
          department: 'Analytics',
          effort: 60,
          roi: 180,
          priority: 'Medium',
          status: 'Identified',
          estimatedSavings: 65000
        },
        {
          id: 'opp-4',
          process: 'Customer Support',
          department: 'Service',
          effort: 150,
          roi: 200,
          priority: 'Medium',
          status: 'Implemented',
          estimatedSavings: 110000
        }
      ]);
      setLoading(false);
    }, 1000);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'red';
      case 'Medium': return 'yellow';
      case 'Low': return 'green';
      default: return 'gray';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Identified': return 'blue';
      case 'In Progress': return 'yellow';
      case 'Implemented': return 'green';
      default: return 'gray';
    }
  };

  const kpiData = {
    totalOpportunities: opportunities.length,
    avgROI: opportunities.reduce((sum, o) => sum + o.roi, 0) / opportunities.length,
    totalSavings: opportunities.reduce((sum, o) => sum + o.estimatedSavings, 0),
    implemented: opportunities.filter(o => o.status === 'Implemented').length
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Loading description="Loading automation opportunities..." withOverlay={false} />
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
              <Automation size={32} />
              Automation Opportunity Finder
            </h1>
            <p style={{ marginBottom: '2rem', color: '#525252' }}>
              Identify and prioritize automation opportunities across operations
            </p>
          </Column>

          <Column lg={4} md={4} sm={4}>
            <KPIWidget
              title="Total Opportunities"
              value={kpiData.totalOpportunities.toString()}
              trend="up"
              trendValue="15%"
              icon={<Automation size={24} />}
            />
          </Column>
          <Column lg={4} md={4} sm={4}>
            <KPIWidget
              title="Avg ROI"
              value={`${kpiData.avgROI.toFixed(0)}%`}
              trend="up"
              trendValue="10%"
              icon={<ChartLine size={24} />}
            />
          </Column>
          <Column lg={4} md={4} sm={4}>
            <KPIWidget
              title="Est. Savings"
              value={`$${(kpiData.totalSavings / 1000).toFixed(0)}K`}
              trend="up"
              trendValue="20%"
              icon={<Money size={24} />}
            />
          </Column>
          <Column lg={4} md={4} sm={4}>
            <KPIWidget
              title="Implemented"
              value={kpiData.implemented.toString()}
              trend="up"
              trendValue="5%"
              icon={<Time size={24} />}
            />
          </Column>

          <Column lg={16} style={{ marginTop: '2rem' }}>
            <Tile style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3>Automation Opportunities</h3>
                <Button kind="primary" renderIcon={Add}>
                  Add Opportunity
                </Button>
              </div>

              <DataTable rows={[]} headers={[]}>
                {() => (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableHeader>Process</TableHeader>
                          <TableHeader>Department</TableHeader>
                          <TableHeader>Effort (hrs)</TableHeader>
                          <TableHeader>ROI</TableHeader>
                          <TableHeader>Priority</TableHeader>
                          <TableHeader>Status</TableHeader>
                          <TableHeader>Est. Savings</TableHeader>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {opportunities.map((opp) => (
                          <TableRow key={opp.id}>
                            <TableCell>{opp.process}</TableCell>
                            <TableCell>{opp.department}</TableCell>
                            <TableCell>{opp.effort}</TableCell>
                            <TableCell>
                              <div style={{ width: '80px' }}>
                                <ProgressBar value={Math.min(opp.roi, 100)} label={`${opp.roi}%`} />
                              </div>
                            </TableCell>
                            <TableCell>
                              <Tag type={getPriorityColor(opp.priority)}>
                                {opp.priority}
                              </Tag>
                            </TableCell>
                            <TableCell>
                              <Tag type={getStatusColor(opp.status)}>
                                {opp.status}
                              </Tag>
                            </TableCell>
                            <TableCell>${(opp.estimatedSavings / 1000).toFixed(0)}K</TableCell>
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

export default AutomationOpportunityFinder;
