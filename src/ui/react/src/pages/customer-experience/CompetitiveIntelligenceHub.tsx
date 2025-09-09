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
  Search,
  Analytics,
  TrendUp,
  View,
  Add
} from '@carbon/icons-react';
import Sidebar from '../../components/Sidebar';
import KPIWidget from '../../components/KPIWidget';

interface CompetitiveIntel {
  id: string;
  competitor: string;
  industry: string;
  marketShare: number;
  pricing: string;
  strengths: string[];
  weaknesses: string[];
  lastUpdated: string;
  threatLevel: 'High' | 'Medium' | 'Low';
}

const CompetitiveIntelligenceHub: React.FC = () => {
  const [intelligence, setIntelligence] = useState<CompetitiveIntel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadIntelligenceData();
  }, []);

  const loadIntelligenceData = () => {
    setTimeout(() => {
      setIntelligence([
        {
          id: 'comp-1',
          competitor: 'Competitor A',
          industry: 'Software',
          marketShare: 25.3,
          pricing: 'Premium',
          strengths: ['Brand recognition', 'Large customer base'],
          weaknesses: ['Outdated technology', 'Poor customer service'],
          lastUpdated: new Date().toISOString(),
          threatLevel: 'High'
        },
        {
          id: 'comp-2',
          competitor: 'Competitor B',
          industry: 'Software',
          marketShare: 18.7,
          pricing: 'Competitive',
          strengths: ['Innovation', 'Strong R&D'],
          weaknesses: ['Limited market presence', 'High prices'],
          lastUpdated: new Date().toISOString(),
          threatLevel: 'Medium'
        }
      ]);
      setLoading(false);
    }, 1500);
  };

  const kpiData = [
    {
      title: 'Competitors Tracked',
      value: intelligence.length.toString(),
      change: 8.3,
      format: 'number' as const
    },
    {
      title: 'Market Coverage',
      value: '87.5%',
      change: 12.1,
      format: 'percentage' as const
    },
    {
      title: 'High Threats',
      value: intelligence.filter(i => i.threatLevel === 'High').length.toString(),
      change: -5.2,
      format: 'number' as const
    },
    {
      title: 'Intelligence Score',
      value: '92.1',
      change: 15.7,
      format: 'number' as const
    }
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{ flex: 1, padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Loading description="Loading intelligence data..." />
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
            <Search size={32} />
            Competitive Intelligence Hub
          </h1>
          <p style={{ color: 'var(--cds-text-02)', marginBottom: '1rem' }}>
            Monitor competitors, analyze market positioning, and track industry trends
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Button kind="primary" renderIcon={Add}>
              Add Competitor
            </Button>
            <Button kind="secondary" renderIcon={Analytics}>
              Market Analysis
            </Button>
            <Button kind="tertiary" renderIcon={TrendUp}>
              Trend Report
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
              <h3 style={{ marginBottom: '1rem' }}>Competitive Intelligence</h3>
              <DataTable 
                rows={intelligence.map(intel => ({
                  id: intel.id,
                  competitor: intel.competitor,
                  marketShare: `${intel.marketShare}%`,
                  pricing: intel.pricing,
                  threatLevel: (
                    <Tag type={
                      intel.threatLevel === 'High' ? 'red' :
                      intel.threatLevel === 'Medium' ? 'yellow' : 'green'
                    }>
                      {intel.threatLevel}
                    </Tag>
                  ),
                  lastUpdated: new Date(intel.lastUpdated).toLocaleDateString(),
                  actions: (
                    <Button size="sm" kind="ghost" renderIcon={View}>
                      View Details
                    </Button>
                  )
                }))} 
                headers={[
                  { key: 'competitor', header: 'Competitor' },
                  { key: 'marketShare', header: 'Market Share' },
                  { key: 'pricing', header: 'Pricing Strategy' },
                  { key: 'threatLevel', header: 'Threat Level' },
                  { key: 'lastUpdated', header: 'Last Updated' },
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

export default CompetitiveIntelligenceHub;