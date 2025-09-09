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
  ProcessAutomate,
  Analytics,
  TrendUp,
  Add,
  View,
  Play
} from '@carbon/icons-react';
import Sidebar from '../../components/Sidebar';
import KPIWidget from '../../components/KPIWidget';

interface ProcessData {
  id: string;
  name: string;
  department: string;
  frequency: number;
  duration: number;
  cost: number;
  efficiency: number;
  automationPotential: number;
  status: 'Active' | 'Under Review' | 'Optimized';
}

const ProcessMiningDashboard: React.FC = () => {
  const [processes, setProcesses] = useState<ProcessData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProcessData();
  }, []);

  const loadProcessData = () => {
    setTimeout(() => {
      setProcesses([
        {
          id: 'proc-1',
          name: 'Invoice Processing',
          department: 'Finance',
          frequency: 150,
          duration: 45,
          cost: 2400,
          efficiency: 78,
          automationPotential: 85,
          status: 'Under Review'
        },
        {
          id: 'proc-2',
          name: 'Customer Onboarding',
          department: 'Sales',
          frequency: 85,
          duration: 120,
          cost: 5800,
          efficiency: 82,
          automationPotential: 72,
          status: 'Active'
        }
      ]);
      setLoading(false);
    }, 1500);
  };

  const kpiData = [
    {
      title: 'Processes Analyzed',
      value: processes.length.toString(),
      change: 15.2,
      format: 'number' as const
    },
    {
      title: 'Avg Efficiency',
      value: `${(processes.reduce((sum, p) => sum + p.efficiency, 0) / processes.length).toFixed(1)}%`,
      change: 8.7,
      format: 'percentage' as const
    },
    {
      title: 'Automation Potential',
      value: `${(processes.reduce((sum, p) => sum + p.automationPotential, 0) / processes.length).toFixed(1)}%`,
      change: 22.1,
      format: 'percentage' as const
    },
    {
      title: 'Cost Savings',
      value: '$125K',
      change: 35.4,
      format: 'currency' as const
    }
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{ flex: 1, padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Loading description="Loading process mining data..." />
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
            <ProcessAutomate size={32} />
            Process Mining Dashboard
          </h1>
          <p style={{ color: 'var(--cds-text-02)', marginBottom: '1rem' }}>
            Discover, analyze, and optimize business processes using data-driven insights
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Button kind="primary" renderIcon={Add}>
              Analyze Process
            </Button>
            <Button kind="secondary" renderIcon={Analytics}>
              Process Report
            </Button>
            <Button kind="tertiary" renderIcon={Play}>
              Start Mining
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
              <h3 style={{ marginBottom: '1rem' }}>Process Analysis</h3>
              <DataTable 
                rows={processes.map(process => ({
                  id: process.id,
                  name: process.name,
                  department: process.department,
                  frequency: `${process.frequency}/month`,
                  efficiency: `${process.efficiency}%`,
                  automation: (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <ProgressBar value={process.automationPotential} size="sm" />
                      <span style={{ fontSize: '0.75rem' }}>{process.automationPotential}%</span>
                    </div>
                  ),
                  status: (
                    <Tag type={
                      process.status === 'Optimized' ? 'green' :
                      process.status === 'Under Review' ? 'blue' : 'gray'
                    }>
                      {process.status}
                    </Tag>
                  ),
                  actions: (
                    <Button size="sm" kind="ghost" renderIcon={View}>
                      View Details
                    </Button>
                  )
                }))} 
                headers={[
                  { key: 'name', header: 'Process Name' },
                  { key: 'department', header: 'Department' },
                  { key: 'frequency', header: 'Frequency' },
                  { key: 'efficiency', header: 'Efficiency' },
                  { key: 'automation', header: 'Automation Potential' },
                  { key: 'status', header: 'Status' },
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

export default ProcessMiningDashboard;