import React, { useState, useEffect } from 'react';
import {
  Grid,
  Column,
  Tile,
  ProgressBar,
  Button,
  DataTable,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  OverflowMenu,
  OverflowMenuItem,
  Tag,
  InlineNotification,
} from '@carbon/react';
import {
  Dashboard,
  ChartLine,
  Store as Factory,
  Delivery,
  CheckmarkOutline,
  WarningAlt,
} from '@carbon/icons-react';

interface KPIMetric {
  title: string;
  value: string | number;
  change: string;
  trend: 'positive' | 'negative' | 'neutral';
  target?: string | number;
}

interface BusinessOperation {
  id: string;
  name: string;
  type: 'manufacturing' | 'finance' | 'supply-chain' | 'hr' | 'sales';
  status: 'active' | 'attention' | 'critical';
  efficiency: number;
  lastUpdated: Date;
}

const ProductionDashboard: React.FC = () => {
  const [kpiMetrics] = useState<KPIMetric[]>([
    {
      title: 'Currency (YTD)',
      value: '$47.2M',
      change: '+18.4%',
      trend: 'positive',
      target: '$52.0M'
    },
    {
      title: 'Operating Margin',
      value: '23.6%',
      change: '+2.1%',
      trend: 'positive',
      target: '25.0%'
    },
    {
      title: 'Customer Satisfaction',
      value: 4.8,
      change: '+0.2',
      trend: 'positive',
      target: 4.9
    },
    {
      title: 'Order Fulfillment',
      value: '96.4%',
      change: '-1.2%',
      trend: 'negative',
      target: '98.0%'
    }
  ]);

  const [businessOperations] = useState<BusinessOperation[]>([
    {
      id: 'mfg-001',
      name: 'Assembly Line Alpha',
      type: 'manufacturing',
      status: 'active',
      efficiency: 94,
      lastUpdated: new Date()
    },
    {
      id: 'fin-001',
      name: 'Accounts Receivable',
      type: 'finance',
      status: 'attention',
      efficiency: 87,
      lastUpdated: new Date()
    },
    {
      id: 'scm-001',
      name: 'Supply Chain Operations',
      type: 'supply-chain',
      status: 'active',
      efficiency: 92,
      lastUpdated: new Date()
    },
    {
      id: 'hr-001',
      name: 'UserMultiple Management',
      type: 'hr',
      status: 'critical',
      efficiency: 78,
      lastUpdated: new Date()
    },
    {
      id: 'sales-001',
      name: 'Sales Flow',
      type: 'sales',
      status: 'active',
      efficiency: 91,
      lastUpdated: new Date()
    }
  ]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'positive':
        return <CheckmarkOutline size={16} style={{ color: 'var(--cds-support-success)' }} />;
      case 'negative':
        return <WarningAlt size={16} style={{ color: 'var(--cds-support-error)' }} />;
      default:
        return <Dashboard size={16} style={{ color: 'var(--cds-text-secondary)' }} />;
    }
  };

  const getStatusTag = (status: string) => {
    const statusConfig = {
      active: { type: 'green' as const, text: 'Active' },
      attention: { type: 'yellow' as const, text: 'Needs Attention' },
      critical: { type: 'red' as const, text: 'Critical' }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Tag type={config.type} size="sm">{config.text}</Tag>;
  };

  const tableHeaders = [
    { key: 'name', header: 'Operation Name' },
    { key: 'type', header: 'Type' },
    { key: 'status', header: 'Status' },
    { key: 'efficiency', header: 'Efficiency' },
    { key: 'lastUpdated', header: 'Last Updated' },
    { key: 'actions', header: 'Actions' },
  ];

  const tableRows = businessOperations.map(op => ({
    id: op.id,
    name: op.name,
    type: op.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    status: getStatusTag(op.status),
    efficiency: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <ProgressBar 
          value={op.efficiency} 
          max={100}
          size="sm"
          status={op.efficiency > 90 ? 'active' : op.efficiency > 80 ? 'finished' : 'error'}
        />
        <span>{op.efficiency}%</span>
      </div>
    ),
    lastUpdated: op.lastUpdated.toLocaleString(),
    actions: (
      <OverflowMenu ariaLabel="Actions">
        <OverflowMenuItem itemText="View Details" />
        <OverflowMenuItem itemText="Edit Configuration" />
        <OverflowMenuItem itemText="Generate Report" />
      </OverflowMenu>
    ),
  }));

  return (
    <div className="production-dashboard">
      <Grid>
        <Column span={16}>
          <h1 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Dashboard size={32} />
            Titan Grove Enterprise Dashboard
          </h1>
          
          <InlineNotification
            kind="success"
            title="System Status: Operational"
            subtitle="All critical systems are running within normal parameters"
            lowContrast
            hideCloseButton
            style={{ marginBottom: '2rem' }}
          />
        </Column>
      </Grid>

      {/* KPI Metrics Row */}
      <Grid>
        {kpiMetrics.map((metric, index) => (
          <Column key={index} sm={4} md={4} lg={4}>
            <Tile style={{ padding: '1.5rem', height: '140px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h4 style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)', margin: '0 0 0.5rem 0' }}>
                    {metric.title}
                  </h4>
                  <h2 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0' }}>
                    {metric.value}
                  </h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {getTrendIcon(metric.trend)}
                    <span style={{ 
                      color: metric.trend === 'positive' ? 'var(--cds-support-success)' : 
                             metric.trend === 'negative' ? 'var(--cds-support-error)' : 
                             'var(--cds-text-secondary)',
                      fontSize: '0.875rem' 
                    }}>
                      {metric.change}
                    </span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--cds-text-secondary)' }}>
                    Task
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: 600 }}>
                    {metric.target}
                  </div>
                </div>
              </div>
            </Tile>
          </Column>
        ))}
      </Grid>

      {/* Business Operations Table */}
      <Grid style={{ marginTop: '2rem' }}>
        <Column span={16}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3>Business Operations Overview</h3>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Button kind="secondary" renderIcon={ChartLine}>
                View Analytics
              </Button>
              <Button kind="primary" renderIcon={Factory}>
                Optimize Operations
              </Button>
            </div>
          </div>
          
          <DataTable rows={tableRows} headers={tableHeaders}>
            {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
              <TableContainer>
                <Table {...getTableProps()}>
                  <TableHead>
                    <TableRow>
                      {headers.map((header) => (
                        <TableHeader {...getHeaderProps({ header })}>
                          {header.header}
                        </TableHeader>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row) => (
                      <TableRow {...getRowProps({ row })}>
                        {row.cells.map((cell) => (
                          <TableCell key={cell.id}>{cell.value}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </DataTable>
        </Column>
      </Grid>

      {/* Quick Actions */}
      <Grid style={{ marginTop: '2rem' }}>
        <Column span={16}>
          <h3 style={{ marginBottom: '1rem' }}>Quick Actions</h3>
        </Column>
        <Column sm={4} md={4} lg={4}>
          <Tile style={{ padding: '1.5rem', textAlign: 'center', cursor: 'pointer' }} 
                onClick={() => window.location.href = '/manufacturing'}>
            <Factory size={32} style={{ marginBottom: '1rem' }} />
            <h4>Manufacturing</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)' }}>
              Production lines, quality control, and equipment management
            </p>
          </Tile>
        </Column>
        <Column sm={4} md={4} lg={4}>
          <Tile style={{ padding: '1.5rem', textAlign: 'center', cursor: 'pointer' }}
                onClick={() => window.location.href = '/supply-chain'}>
            <Delivery size={32} style={{ marginBottom: '1rem' }} />
            <h4>Supply Chain</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)' }}>
              Inventory, procurement, and logistics management
            </p>
          </Tile>
        </Column>
        <Column sm={4} md={4} lg={4}>
          <Tile style={{ padding: '1.5rem', textAlign: 'center', cursor: 'pointer' }}
                onClick={() => window.location.href = '/financials'}>
            <ChartLine size={32} style={{ marginBottom: '1rem' }} />
            <h4>Financial Management</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)' }}>
              Accounting, budgeting, and financial reporting
            </p>
          </Tile>
        </Column>
        <Column sm={4} md={4} lg={4}>
          <Tile style={{ padding: '1.5rem', textAlign: 'center', cursor: 'pointer' }}
                onClick={() => window.location.href = '/business-intelligence'}>
            <Dashboard size={32} style={{ marginBottom: '1rem' }} />
            <h4>Business Watson</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)' }}>
              Analytics, reporting, and business insights
            </p>
          </Tile>
        </Column>
      </Grid>
    </div>
  );
};

export default ProductionDashboard;