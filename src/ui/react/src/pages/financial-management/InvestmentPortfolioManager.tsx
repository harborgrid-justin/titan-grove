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
  ChartLine,
  ArrowUp,
  ArrowDown,
  Add
} from '@carbon/icons-react';
import Sidebar from '../../components/Sidebar';
import KPIWidget from '../../components/KPIWidget';

interface Investment {
  id: string;
  assetName: string;
  type: string;
  value: number;
  allocation: number;
  return: number;
  risk: 'Low' | 'Medium' | 'High';
  status: 'Active' | 'Sold' | 'Pending';
}

const InvestmentPortfolioManager: React.FC = () => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInvestmentData();
  }, []);

  const loadInvestmentData = () => {
    setTimeout(() => {
      setInvestments([
        {
          id: 'inv-1',
          assetName: 'Corporate Bonds',
          type: 'Fixed Income',
          value: 5000000,
          allocation: 35,
          return: 4.8,
          risk: 'Low',
          status: 'Active'
        },
        {
          id: 'inv-2',
          assetName: 'Equity Stocks',
          type: 'Equities',
          value: 4500000,
          allocation: 32,
          return: 12.5,
          risk: 'High',
          status: 'Active'
        },
        {
          id: 'inv-3',
          assetName: 'Real Estate Fund',
          type: 'Real Estate',
          value: 3000000,
          allocation: 21,
          return: 8.2,
          risk: 'Medium',
          status: 'Active'
        },
        {
          id: 'inv-4',
          assetName: 'Money ChartLineData',
          type: 'Cash',
          value: 1700000,
          allocation: 12,
          return: 2.5,
          risk: 'Low',
          status: 'Active'
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
      default: return 'gray';
    }
  };

  const kpiData = {
    totalValue: investments.reduce((sum, i) => sum + i.value, 0),
    avgReturn: investments.reduce((sum, i) => sum + i.return, 0) / investments.length,
    activeInvestments: investments.filter(i => i.status === 'Active').length,
    highRisk: investments.filter(i => i.risk === 'High').length
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Loading description="Loading portfolio data..." withOverlay={false} />
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
              <Money size={32} />
              Investment Portfolio Manager
            </h1>
            <p style={{ marginBottom: '2rem', color: '#525252' }}>
              Investment tracking and portfolio performance analysis
            </p>
          </Column>

          <Column lg={4} md={4} sm={4}>
            <KPIWidget
              title="Total Value"
              value={`$${(kpiData.totalValue / 1000000).toFixed(1)}M`}
              trend="up"
              trendValue="8.5%"
              icon={<Money size={24} />}
            />
          </Column>
          <Column lg={4} md={4} sm={4}>
            <KPIWidget
              title="Avg Return"
              value={`${kpiData.avgReturn.toFixed(1)}%`}
              trend="up"
              trendValue="2.3%"
              icon={<ArrowUp size={24} />}
            />
          </Column>
          <Column lg={4} md={4} sm={4}>
            <KPIWidget
              title="Active Investments"
              value={kpiData.activeInvestments.toString()}
              trend="neutral"
              trendValue="0%"
              icon={<ChartLine size={24} />}
            />
          </Column>
          <Column lg={4} md={4} sm={4}>
            <KPIWidget
              title="High Warning Assets"
              value={kpiData.highRisk.toString()}
              trend="down"
              trendValue="5%"
              icon={<ArrowDown size={24} />}
            />
          </Column>

          <Column lg={16} style={{ marginTop: '2rem' }}>
            <Tile style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3>Portfolio Holdings</h3>
                <Button kind="primary" renderIcon={Add}>
                  Add Investment
                </Button>
              </div>

              <DataTable rows={[]} headers={[]}>
                {() => (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableHeader>Asset Name</TableHeader>
                          <TableHeader>Type</TableHeader>
                          <TableHeader>Value</TableHeader>
                          <TableHeader>Allocation</TableHeader>
                          <TableHeader>Return</TableHeader>
                          <TableHeader>Warning</TableHeader>
                          <TableHeader>Status</TableHeader>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {investments.map((inv) => (
                          <TableRow key={inv.id}>
                            <TableCell>{inv.assetName}</TableCell>
                            <TableCell>{inv.type}</TableCell>
                            <TableCell>${(inv.value / 1000000).toFixed(2)}M</TableCell>
                            <TableCell>{inv.allocation}%</TableCell>
                            <TableCell style={{ color: inv.return > 0 ? 'green' : 'red' }}>
                              {inv.return > 0 ? '+' : ''}{inv.return}%
                            </TableCell>
                            <TableCell>
                              <Tag type={getRiskColor(inv.risk)}>
                                {inv.risk}
                              </Tag>
                            </TableCell>
                            <TableCell>{inv.status}</TableCell>
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

export default InvestmentPortfolioManager;
