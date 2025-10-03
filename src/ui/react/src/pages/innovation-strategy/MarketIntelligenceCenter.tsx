import React, { useState, useEffect } from 'react';
import {
  Grid, Column, Tile, Button, Loading, DataTable, TableContainer, Table,
  TableHead, TableRow, TableHeader, TableBody, TableCell, Tag
} from '@carbon/react';
import { Analytics, ChartLine, ArrowUp, Add } from '@carbon/icons-react';
import Sidebar from '../../components/Sidebar';
import KPIWidget from '../../components/KPIWidget';

interface MarketInsight {
  id: string;
  market: string;
  trend: string;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  growth: number;
  opportunity: 'High' | 'Medium' | 'Low';
}

const MarketIntelligenceCenter: React.FC = () => {
  const [insights, setInsights] = useState<MarketInsight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setInsights([
        { id: 'mi-1', market: 'North America', trend: 'Growing', sentiment: 'Positive', growth: 12.5, opportunity: 'High' },
        { id: 'mi-2', market: 'Europe', trend: 'Stable', sentiment: 'Neutral', growth: 5.2, opportunity: 'Medium' },
        { id: 'mi-3', market: 'Asia Pacific', trend: 'Rapidly Growing', sentiment: 'Positive', growth: 18.7, opportunity: 'High' },
        { id: 'mi-4', market: 'Latin America', trend: 'Emerging', sentiment: 'Positive', growth: 9.8, opportunity: 'Medium' }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'Positive': return 'green';
      case 'Neutral': return 'yellow';
      case 'Negative': return 'red';
      default: return 'gray';
    }
  };

  const getOpportunityColor = (opportunity: string) => {
    switch (opportunity) {
      case 'High': return 'green';
      case 'Medium': return 'yellow';
      case 'Low': return 'red';
      default: return 'gray';
    }
  };

  const kpiData = {
    totalMarkets: insights.length,
    avgGrowth: insights.reduce((sum, i) => sum + i.growth, 0) / insights.length,
    positive: insights.filter(i => i.sentiment === 'Positive').length,
    highOpportunity: insights.filter(i => i.opportunity === 'High').length
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><Loading description="Loading market intelligence..." withOverlay={false} /></div>;

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '2rem', backgroundColor: '#f4f4f4', overflowY: 'auto' }}>
        <Grid>
          <Column lg={16}>
            <h1 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Analytics size={32} />ChartLineData Watson Center
            </h1>
            <p style={{ marginBottom: '2rem', color: '#525252' }}>
              ChartLineData trends, competitive intelligence, and opportunity analysis
            </p>
          </Column>
          <Column lg={4} md={4} sm={4}><KPIWidget title="Markets Tracked" value={kpiData.totalMarkets.toString()} trend="up" trendValue="5%" icon={<Analytics size={24} />} /></Column>
          <Column lg={4} md={4} sm={4}><KPIWidget title="Avg Growth" value={`${kpiData.avgGrowth.toFixed(1)}%`} trend="up" trendValue="10%" icon={<ArrowUp size={24} />} /></Column>
          <Column lg={4} md={4} sm={4}><KPIWidget title="Positive Sentiment" value={kpiData.positive.toString()} trend="up" trendValue="8%" icon={<ChartLine size={24} />} /></Column>
          <Column lg={4} md={4} sm={4}><KPIWidget title="High Idea" value={kpiData.highOpportunity.toString()} trend="up" trendValue="12%" icon={<Analytics size={24} />} /></Column>
          <Column lg={16} style={{ marginTop: '2rem' }}>
            <Tile style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h3>ChartLineData Watson</h3>
                <Button kind="primary" renderIcon={Add}>Add ChartLineData</Button>
              </div>
              <DataTable rows={[]} headers={[]}>
                {() => (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableHeader>ChartLineData</TableHeader>
                          <TableHeader>Trend</TableHeader>
                          <TableHeader>Sentiment</TableHeader>
                          <TableHeader>Growth</TableHeader>
                          <TableHeader>Idea</TableHeader>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {insights.map(insight => (
                          <TableRow key={insight.id}>
                            <TableCell>{insight.market}</TableCell>
                            <TableCell>{insight.trend}</TableCell>
                            <TableCell><Tag type={getSentimentColor(insight.sentiment)}>{insight.sentiment}</Tag></TableCell>
                            <TableCell>{insight.growth}%</TableCell>
                            <TableCell><Tag type={getOpportunityColor(insight.opportunity)}>{insight.opportunity}</Tag></TableCell>
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

export default MarketIntelligenceCenter;
