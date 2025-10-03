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
  Tag
} from '@carbon/react';
import {
  Money,
  ArrowUp,
  Analytics,
  Add,
  View
} from '@carbon/icons-react';
import Sidebar from '../../components/Sidebar';
import KPIWidget from '../../components/KPIWidget';

interface TreasuryPosition {
  id: string;
  account: string;
  type: 'Cash' | 'Investment' | 'Credit Line';
  balance: number;
  currency: string;
  yield: number;
  maturity: string;
  risk: 'Low' | 'Medium' | 'High';
}

const TreasuryManagementConsole: React.FC = () => {
  const [positions, setPositions] = useState<TreasuryPosition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTreasuryData();
  }, []);

  const loadTreasuryData = () => {
    setTimeout(() => {
      setPositions([
        {
          id: 'pos-1',
          account: 'Primary Operating Account',
          type: 'Cash',
          balance: 5250000,
          currency: 'USD',
          yield: 0.5,
          maturity: 'Demand',
          risk: 'Low'
        },
        {
          id: 'pos-2',
          account: 'Finance Bills',
          type: 'Investment',
          balance: 2800000,
          currency: 'USD',
          yield: 4.2,
          maturity: '90 days',
          risk: 'Low'
        }
      ]);
      setLoading(false);
    }, 1500);
  };

  const kpiData = [
    {
      title: 'Total Liquidity',
      value: `$${(positions.reduce((sum, p) => sum + p.balance, 0) / 1000000).toFixed(1)}M`,
      change: 8.3,
      format: 'currency' as const
    },
    {
      title: 'Avg Yield',
      value: `${(positions.reduce((sum, p) => sum + p.yield, 0) / positions.length).toFixed(1)}%`,
      change: 12.5,
      format: 'percentage' as const
    },
    {
      title: 'Cash Position',
      value: `$${(positions.filter(p => p.type === 'Cash').reduce((sum, p) => sum + p.balance, 0) / 1000000).toFixed(1)}M`,
      change: 15.2,
      format: 'currency' as const
    },
    {
      title: 'Investment Return',
      value: '4.8%',
      change: 18.7,
      format: 'percentage' as const
    }
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{ flex: 1, padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Loading description="Loading treasury data..." />
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
            Finance Management Console
          </h1>
          <p style={{ color: 'var(--cds-text-02)', marginBottom: '1rem' }}>
            Manage cash, investments, and liquidity with real-time market data
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Button kind="primary" renderIcon={Add}>
              New Position
            </Button>
            <Button kind="secondary" renderIcon={Analytics}>
              Cash ChartLineSmooth
            </Button>
            <Button kind="tertiary" renderIcon={ArrowUp}>
              ChartLineData Analysis
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
              <h3 style={{ marginBottom: '1rem' }}>Finance Positions</h3>
              <DataTable 
                rows={positions.map(position => ({
                  id: position.id,
                  account: position.account,
                  type: position.type,
                  balance: `$${(position.balance / 1000000).toFixed(1)}M`,
                  yield: `${position.yield}%`,
                  maturity: position.maturity,
                  risk: (
                    <Tag type={
                      position.risk === 'Low' ? 'green' :
                      position.risk === 'Medium' ? 'yellow' : 'red'
                    }>
                      {position.risk}
                    </Tag>
                  ),
                  actions: (
                    <Button size="sm" kind="ghost" renderIcon={View}>
                      View Details
                    </Button>
                  )
                }))} 
                headers={[
                  { key: 'account', header: 'Account' },
                  { key: 'type', header: 'Type' },
                  { key: 'balance', header: 'Balance' },
                  { key: 'yield', header: 'Yield' },
                  { key: 'maturity', header: 'Maturity' },
                  { key: 'risk', header: 'Warning' },
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

export default TreasuryManagementConsole;