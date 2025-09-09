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
  Money,
  TrendUp,
  Analytics,
  Calendar,
  View,
  Add
} from '@carbon/icons-react';
import Sidebar from '../../components/Sidebar';
import KPIWidget from '../../components/KPIWidget';

interface RevenueRecord {
  id: string;
  customer: string;
  contract: string;
  amount: number;
  recognizedAmount: number;
  recognitionType: 'Immediate' | 'Over Time' | 'Milestone';
  startDate: string;
  endDate: string;
  status: 'Pending' | 'Recognized' | 'Deferred';
  progress: number;
}

const RevenueRecognitionDashboard: React.FC = () => {
  const [revenueRecords, setRevenueRecords] = useState<RevenueRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('Current Month');

  useEffect(() => {
    loadRevenueData();
  }, []);

  const loadRevenueData = () => {
    setTimeout(() => {
      setRevenueRecords([
        {
          id: 'rev-1',
          customer: 'Acme Corporation',
          contract: 'Enterprise License',
          amount: 120000,
          recognizedAmount: 30000,
          recognitionType: 'Over Time',
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          status: 'Recognized',
          progress: 25
        },
        {
          id: 'rev-2',
          customer: 'TechStart Inc',
          contract: 'Professional Services',
          amount: 75000,
          recognizedAmount: 75000,
          recognitionType: 'Immediate',
          startDate: '2024-01-15',
          endDate: '2024-01-15',
          status: 'Recognized',
          progress: 100
        },
        {
          id: 'rev-3',
          customer: 'Global Industries',
          contract: 'Implementation Project',
          amount: 250000,
          recognizedAmount: 125000,
          recognitionType: 'Milestone',
          startDate: '2024-01-01',
          endDate: '2024-06-30',
          status: 'Recognized',
          progress: 50
        }
      ]);
      setLoading(false);
    }, 1500);
  };

  const kpiData = [
    {
      title: 'Total Revenue',
      value: `$${revenueRecords.reduce((sum, r) => sum + r.amount, 0).toLocaleString()}`,
      change: 22.1,
      format: 'currency' as const
    },
    {
      title: 'Recognized Revenue',
      value: `$${revenueRecords.reduce((sum, r) => sum + r.recognizedAmount, 0).toLocaleString()}`,
      change: 18.3,
      format: 'currency' as const
    },
    {
      title: 'Deferred Revenue',
      value: `$${revenueRecords.reduce((sum, r) => sum + (r.amount - r.recognizedAmount), 0).toLocaleString()}`,
      change: 25.7,
      format: 'currency' as const
    },
    {
      title: 'Recognition Rate',
      value: `${((revenueRecords.reduce((sum, r) => sum + r.recognizedAmount, 0) / revenueRecords.reduce((sum, r) => sum + r.amount, 0)) * 100).toFixed(1)}%`,
      change: 12.4,
      format: 'percentage' as const
    }
  ];

  const headers = [
    { key: 'customer', header: 'Customer' },
    { key: 'contract', header: 'Contract' },
    { key: 'amount', header: 'Total Amount' },
    { key: 'recognized', header: 'Recognized' },
    { key: 'type', header: 'Recognition Type' },
    { key: 'progress', header: 'Progress' },
    { key: 'status', header: 'Status' },
    { key: 'actions', header: 'Actions' }
  ];

  const rows = revenueRecords.map(record => ({
    id: record.id,
    customer: record.customer,
    contract: record.contract,
    amount: `$${record.amount.toLocaleString()}`,
    recognized: `$${record.recognizedAmount.toLocaleString()}`,
    type: record.recognitionType,
    progress: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <ProgressBar value={record.progress} size="sm" />
        <span style={{ fontSize: '0.75rem' }}>{record.progress}%</span>
      </div>
    ),
    status: (
      <Tag type={
        record.status === 'Recognized' ? 'green' :
        record.status === 'Pending' ? 'blue' : 'yellow'
      }>
        {record.status}
      </Tag>
    ),
    actions: (
      <Button size="sm" kind="ghost" renderIcon={View}>
        View Details
      </Button>
    )
  }));

  if (loading) {
    return (
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{ flex: 1, padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Loading description="Loading revenue data..." />
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
            <Money size={32} />
            Revenue Recognition Dashboard
          </h1>
          <p style={{ color: 'var(--cds-text-02)', marginBottom: '1rem' }}>
            Track and manage revenue recognition across contracts and time periods
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Select
              id="period-filter"
              labelText=""
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              size="sm"
            >
              <SelectItem value="Current Month" text="Current Month" />
              <SelectItem value="Current Quarter" text="Current Quarter" />
              <SelectItem value="Current Year" text="Current Year" />
            </Select>
            
            <Button kind="primary" renderIcon={Add}>
              Add Revenue Record
            </Button>
            
            <Button kind="secondary" renderIcon={Analytics}>
              Revenue Analytics
            </Button>
            
            <Button kind="tertiary" renderIcon={Calendar}>
              Recognition Schedule
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
                Revenue Recognition Records
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

export default RevenueRecognitionDashboard;