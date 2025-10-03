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
  TrendUp,
  Analytics,
  Add
} from '@carbon/icons-react';
import Sidebar from '../../components/Sidebar';
import KPIWidget from '../../components/KPIWidget';

interface CompensationData {
  id: string;
  department: string;
  avgSalary: number;
  medianSalary: number;
  totalHeadcount: number;
  marketRatio: number;
  payEquity: 'Fair' | 'Below Market' | 'Above Market';
  budgetUtilization: number;
}

const CompensationAnalysis: React.FC = () => {
  const [compensation, setCompensation] = useState<CompensationData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCompensationData();
  }, []);

  const loadCompensationData = () => {
    setTimeout(() => {
      setCompensation([
        {
          id: 'comp-1',
          department: 'Engineering',
          avgSalary: 125000,
          medianSalary: 120000,
          totalHeadcount: 150,
          marketRatio: 1.05,
          payEquity: 'Above Market',
          budgetUtilization: 92
        },
        {
          id: 'comp-2',
          department: 'Sales',
          avgSalary: 95000,
          medianSalary: 90000,
          totalHeadcount: 80,
          marketRatio: 0.98,
          payEquity: 'Fair',
          budgetUtilization: 88
        },
        {
          id: 'comp-3',
          department: 'Operations',
          avgSalary: 75000,
          medianSalary: 72000,
          totalHeadcount: 120,
          marketRatio: 0.92,
          payEquity: 'Below Market',
          budgetUtilization: 85
        },
        {
          id: 'comp-4',
          department: 'Marketing',
          avgSalary: 85000,
          medianSalary: 82000,
          totalHeadcount: 60,
          marketRatio: 1.02,
          payEquity: 'Fair',
          budgetUtilization: 90
        }
      ]);
      setLoading(false);
    }, 1000);
  };

  const getEquityColor = (equity: string) => {
    switch (equity) {
      case 'Fair': return 'green';
      case 'Below Market': return 'red';
      case 'Above Market': return 'blue';
      default: return 'gray';
    }
  };

  const kpiData = {
    totalPayroll: compensation.reduce((sum, c) => sum + (c.avgSalary * c.totalHeadcount), 0),
    avgMarketRatio: compensation.reduce((sum, c) => sum + c.marketRatio, 0) / compensation.length,
    belowMarket: compensation.filter(c => c.payEquity === 'Below Market').length,
    avgBudgetUtil: compensation.reduce((sum, c) => sum + c.budgetUtilization, 0) / compensation.length
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Loading description="Loading compensation data..." withOverlay={false} />
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
              Compensation Analysis
            </h1>
            <p style={{ marginBottom: '2rem', color: '#525252' }}>
              Comprehensive compensation and market analysis
            </p>
          </Column>

          <Column lg={4} md={4} sm={4}>
            <KPIWidget
              title="Total Payroll"
              value={`$${(kpiData.totalPayroll / 1000000).toFixed(1)}M`}
              trend="up"
              trendValue="5%"
              icon={<Money size={24} />}
            />
          </Column>
          <Column lg={4} md={4} sm={4}>
            <KPIWidget
              title="Market Ratio"
              value={kpiData.avgMarketRatio.toFixed(2)}
              trend="up"
              trendValue="2%"
              icon={<ChartLine size={24} />}
            />
          </Column>
          <Column lg={4} md={4} sm={4}>
            <KPIWidget
              title="Below Market"
              value={kpiData.belowMarket.toString()}
              trend="down"
              trendValue="10%"
              icon={<Analytics size={24} />}
            />
          </Column>
          <Column lg={4} md={4} sm={4}>
            <KPIWidget
              title="Budget Utilization"
              value={`${kpiData.avgBudgetUtil.toFixed(1)}%`}
              trend="up"
              trendValue="3%"
              icon={<TrendUp size={24} />}
            />
          </Column>

          <Column lg={16} style={{ marginTop: '2rem' }}>
            <Tile style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3>Compensation by Department</h3>
                <Button kind="primary" renderIcon={Add}>
                  Generate Report
                </Button>
              </div>

              <DataTable rows={[]} headers={[]}>
                {() => (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableHeader>Department</TableHeader>
                          <TableHeader>Avg Salary</TableHeader>
                          <TableHeader>Median Salary</TableHeader>
                          <TableHeader>Headcount</TableHeader>
                          <TableHeader>Market Ratio</TableHeader>
                          <TableHeader>Pay Equity</TableHeader>
                          <TableHeader>Budget Util.</TableHeader>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {compensation.map((comp) => (
                          <TableRow key={comp.id}>
                            <TableCell>{comp.department}</TableCell>
                            <TableCell>${comp.avgSalary.toLocaleString()}</TableCell>
                            <TableCell>${comp.medianSalary.toLocaleString()}</TableCell>
                            <TableCell>{comp.totalHeadcount}</TableCell>
                            <TableCell>{comp.marketRatio.toFixed(2)}</TableCell>
                            <TableCell>
                              <Tag type={getEquityColor(comp.payEquity)}>
                                {comp.payEquity}
                              </Tag>
                            </TableCell>
                            <TableCell>{comp.budgetUtilization}%</TableCell>
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

export default CompensationAnalysis;
