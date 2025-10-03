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
  Rule,
  DocumentCompliance,
  CheckmarkFilled,
  WarningAlt,
  Add
} from '@carbon/icons-react';
import Sidebar from '../../components/Sidebar';
import KPIWidget from '../../components/KPIWidget';

interface ComplianceRequirement {
  id: string;
  regulation: string;
  category: string;
  status: 'Compliant' | 'Non-Compliant' | 'In Progress';
  progress: number;
  dueDate: string;
  responsible: string;
  priority: 'High' | 'Medium' | 'Low';
}

const RegulatoryComplianceCenter: React.FC = () => {
  const [requirements, setRequirements] = useState<ComplianceRequirement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComplianceData();
  }, []);

  const loadComplianceData = () => {
    setTimeout(() => {
      setRequirements([
        {
          id: 'comp-1',
          regulation: 'SOX Compliance',
          category: 'Financial Reporting',
          status: 'Compliant',
          progress: 100,
          dueDate: '2024-12-31',
          responsible: 'John Smith',
          priority: 'High'
        },
        {
          id: 'comp-2',
          regulation: 'GDPR Data Protection',
          category: 'Data Privacy',
          status: 'Compliant',
          progress: 100,
          dueDate: '2024-06-30',
          responsible: 'Jane Doe',
          priority: 'High'
        },
        {
          id: 'comp-3',
          regulation: 'Anti-Money Laundering',
          category: 'Financial Crime',
          status: 'In Progress',
          progress: 75,
          dueDate: '2024-09-30',
          responsible: 'Mike Johnson',
          priority: 'High'
        },
        {
          id: 'comp-4',
          regulation: 'Tax Compliance',
          category: 'Taxation',
          status: 'Non-Compliant',
          progress: 45,
          dueDate: '2024-04-15',
          responsible: 'Sarah Williams',
          priority: 'Medium'
        }
      ]);
      setLoading(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Compliant': return 'green';
      case 'Non-Compliant': return 'red';
      case 'In Progress': return 'yellow';
      default: return 'gray';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'red';
      case 'Medium': return 'yellow';
      case 'Low': return 'green';
      default: return 'gray';
    }
  };

  const kpiData = {
    totalRequirements: requirements.length,
    compliant: requirements.filter(r => r.status === 'Compliant').length,
    nonCompliant: requirements.filter(r => r.status === 'Non-Compliant').length,
    avgProgress: requirements.reduce((sum, r) => sum + r.progress, 0) / requirements.length
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Loading description="Loading compliance data..." withOverlay={false} />
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
              <Rule size={32} />
              Regulatory Compliance Center
            </h1>
            <p style={{ marginBottom: '2rem', color: '#525252' }}>
              Regulatory compliance tracking and management
            </p>
          </Column>

          <Column lg={4} md={4} sm={4}>
            <KPIWidget
              title="Total Requirements"
              value={kpiData.totalRequirements.toString()}
              trend="neutral"
              trendValue="0%"
              icon={<Rule size={24} />}
            />
          </Column>
          <Column lg={4} md={4} sm={4}>
            <KPIWidget
              title="Compliant"
              value={kpiData.compliant.toString()}
              trend="up"
              trendValue="5%"
              icon={<CheckmarkFilled size={24} />}
            />
          </Column>
          <Column lg={4} md={4} sm={4}>
            <KPIWidget
              title="Non-Compliant"
              value={kpiData.nonCompliant.toString()}
              trend="down"
              trendValue="10%"
              icon={<WarningAlt size={24} />}
            />
          </Column>
          <Column lg={4} md={4} sm={4}>
            <KPIWidget
              title="Avg Progress"
              value={`${kpiData.avgProgress.toFixed(1)}%`}
              trend="up"
              trendValue="8%"
              icon={<DocumentCompliance size={24} />}
            />
          </Column>

          <Column lg={16} style={{ marginTop: '2rem' }}>
            <Tile style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3>Compliance Requirements</h3>
                <Button kind="primary" renderIcon={Add}>
                  Add Requirement
                </Button>
              </div>

              <DataTable rows={[]} headers={[]}>
                {() => (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableHeader>Regulation</TableHeader>
                          <TableHeader>Category</TableHeader>
                          <TableHeader>Status</TableHeader>
                          <TableHeader>Progress</TableHeader>
                          <TableHeader>Due Date</TableHeader>
                          <TableHeader>Responsible</TableHeader>
                          <TableHeader>Priority</TableHeader>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {requirements.map((req) => (
                          <TableRow key={req.id}>
                            <TableCell>{req.regulation}</TableCell>
                            <TableCell>{req.category}</TableCell>
                            <TableCell>
                              <Tag type={getStatusColor(req.status)}>
                                {req.status}
                              </Tag>
                            </TableCell>
                            <TableCell>
                              <div style={{ width: '120px' }}>
                                <ProgressBar value={req.progress} label={`${req.progress}%`} />
                              </div>
                            </TableCell>
                            <TableCell>{req.dueDate}</TableCell>
                            <TableCell>{req.responsible}</TableCell>
                            <TableCell>
                              <Tag type={getPriorityColor(req.priority)}>
                                {req.priority}
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

export default RegulatoryComplianceCenter;
