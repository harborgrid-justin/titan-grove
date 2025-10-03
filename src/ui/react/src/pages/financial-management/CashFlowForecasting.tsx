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
  ChartLineSmooth,
  ChartLine,
  ArrowUp,
  Add
} from '@carbon/icons-react';
import Sidebar from '../../components/Sidebar';
import KPIWidget from '../../components/KPIWidget';

interface CashFlowForecast {
  id: string;
  period: string;
  inflow: number;
  outflow: number;
  netFlow: number;
  balance: number;
  category: string;
  confidence: number;
}

const CashFlowForecasting: React.FC = () => {
  const [forecasts, setForecasts] = useState<CashFlowForecast[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadForecastData();
  }, []);

  const loadForecastData = () => {
    setTimeout(() => {
      setForecasts([
        {
          id: 'cf-1',
          period: 'Q1 2024',
          inflow: 5200000,
          outflow: 4100000,
          netFlow: 1100000,
          balance: 8500000,
          category: 'Operations',
          confidence: 92
        },
        {
          id: 'cf-2',
          period: 'Q2 2024',
          inflow: 5800000,
          outflow: 4500000,
          netFlow: 1300000,
          balance: 9800000,
          category: 'Operations',
          confidence: 88
        },
        {
          id: 'cf-3',
          period: 'Q3 2024',
          inflow: 6200000,
          outflow: 4800000,
          netFlow: 1400000,
          balance: 11200000,
          category: 'Operations',
          confidence: 85
        },
        {
          id: 'cf-4',
          period: 'Q4 2024',
          inflow: 7000000,
          outflow: 5200000,
          netFlow: 1800000,
          balance: 13000000,
          category: 'Operations',
          confidence: 80
        }
      ]);
      setLoading(false);
    }, 1000);
  };

  const kpiData = {
    totalInflow: forecasts.reduce((sum, f) => sum + f.inflow, 0),
    totalOutflow: forecasts.reduce((sum, f) => sum + f.outflow, 0),
    netCashFlow: forecasts.reduce((sum, f) => sum + f.netFlow, 0),
    avgConfidence: forecasts.reduce((sum, f) => sum + f.confidence, 0) / forecasts.length
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Loading description="Loading cash flow forecast..." withOverlay={false} />
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
              <ChartLineSmooth size={32} />
              Cash Flow Forecasting
            </h1>
            <p style={{ marginBottom: '2rem', color: '#525252' }}>
              Predictive cash flow analysis and liquidity planning
            </p>
          </Column>

          <Column lg={4} md={4} sm={4}>
            <KPIWidget
              title="Total Inflow"
              value={`$${(kpiData.totalInflow / 1000000).toFixed(1)}M`}
              trend="up"
              trendValue="12%"
              icon={<ArrowUp size={24} />}
            />
          </Column>
          <Column lg={4} md={4} sm={4}>
            <KPIWidget
              title="Total Outflow"
              value={`$${(kpiData.totalOutflow / 1000000).toFixed(1)}M`}
              trend="up"
              trendValue="8%"
              icon={<Money size={24} />}
            />
          </Column>
          <Column lg={4} md={4} sm={4}>
            <KPIWidget
              title="Net Cash Flow"
              value={`$${(kpiData.netCashFlow / 1000000).toFixed(1)}M`}
              trend="up"
              trendValue="15%"
              icon={<ChartLine size={24} />}
            />
          </Column>
          <Column lg={4} md={4} sm={4}>
            <KPIWidget
              title="Avg Confidence"
              value={`${kpiData.avgConfidence.toFixed(1)}%`}
              trend="neutral"
              trendValue="0%"
              icon={<ChartLineSmooth size={24} />}
            />
          </Column>

          <Column lg={16} style={{ marginTop: '2rem' }}>
            <Tile style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3>Quarterly Cash Flow ChartLineSmooth</h3>
                <Button kind="primary" renderIcon={Add}>
                  New ChartLineSmooth
                </Button>
              </div>

              <DataTable rows={[]} headers={[]}>
                {() => (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableHeader>Period</TableHeader>
                          <TableHeader>Inflow</TableHeader>
                          <TableHeader>Outflow</TableHeader>
                          <TableHeader>Net Flow</TableHeader>
                          <TableHeader>Balance</TableHeader>
                          <TableHeader>Category</TableHeader>
                          <TableHeader>Confidence</TableHeader>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {forecasts.map((forecast) => (
                          <TableRow key={forecast.id}>
                            <TableCell>{forecast.period}</TableCell>
                            <TableCell>${(forecast.inflow / 1000000).toFixed(2)}M</TableCell>
                            <TableCell>${(forecast.outflow / 1000000).toFixed(2)}M</TableCell>
                            <TableCell style={{ color: forecast.netFlow > 0 ? 'green' : 'red' }}>
                              ${(forecast.netFlow / 1000000).toFixed(2)}M
                            </TableCell>
                            <TableCell>${(forecast.balance / 1000000).toFixed(2)}M</TableCell>
                            <TableCell>{forecast.category}</TableCell>
                            <TableCell>{forecast.confidence}%</TableCell>
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

export default CashFlowForecasting;
