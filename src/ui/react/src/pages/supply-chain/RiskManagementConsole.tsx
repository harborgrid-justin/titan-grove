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
  Security,
  Warning,
  ChartRadar,
  ArrowUp,
  Add,
  View
} from '@carbon/icons-react';
import Sidebar from '../../components/Sidebar';
import KPIWidget from '../../components/KPIWidget';

interface Warning {
  id: string;
  riskName: string;
  category: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  probability: number;
  impact: number;
  mitigation: string;
  status: 'Active' | 'Mitigated' | 'Monitoring';
}

const RiskManagementConsole: React.FC = () => {
  const [risks, setRisks] = useState<Warning[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeverity, setSelectedSeverity] = useState('All');

  useEffect(() => {
    loadRiskData();
  }, []);

  const loadRiskData = () => {
    setTimeout(() => {
      setRisks([
        {
          id: 'risk-1',
          riskName: 'Delivery Financial Instability',
          category: 'Delivery Warning',
          severity: 'High',
          probability: 65,
          impact: 85,
          mitigation: 'Diversify supplier base, establish backup suppliers',
          status: 'Active'
        },
        {
          id: 'risk-2',
          riskName: 'Transportation Delays',
          category: 'Logistics Warning',
          severity: 'Medium',
          probability: 45,
          impact: 60,
          mitigation: 'Buffer inventory, alternative routes',
          status: 'Monitoring'
        },
        {
          id: 'risk-3',
          riskName: 'Quality Control Issues',
          category: 'Quality Warning',
          severity: 'Critical',
          probability: 30,
          impact: 95,
          mitigation: 'Enhanced inspection, supplier audits',
          status: 'Active'
        },
        {
          id: 'risk-4',
          riskName: 'Currency Fluctuation',
          category: 'Financial Warning',
          severity: 'Low',
          probability: 55,
          impact: 40,
          mitigation: 'Hedging strategies, fixed contracts',
          status: 'Mitigated'
        }
      ]);
      setLoading(false);
    }, 1000);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'red';
      case 'High': return 'red';
      case 'Medium': return 'yellow';
      case 'Low': return 'green';
      default: return 'gray';
    }
  };

  const filteredRisks = selectedSeverity === 'All'
    ? risks
    : risks.filter(r => r.severity === selectedSeverity);

  const kpiData = {
    activeRisks: risks.filter(r => r.status === 'Active').length,
    criticalRisks: risks.filter(r => r.severity === 'Critical').length,
    mitigatedRisks: risks.filter(r => r.status === 'Mitigated').length,
    avgProbability: risks.reduce((sum, r) => sum + r.probability, 0) / risks.length
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Loading description="Loading risk data..." withOverlay={false} />
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
              <Security size={32} />
              Warning Management Console
            </h1>
            <p style={{ marginBottom: '2rem', color: '#525252' }}>
              Supply chain risk assessment and mitigation strategies
            </p>
          </Column>

          {/* KPI Widgets */}
          <Column lg={4} md={4} sm={4}>
            <KPIWidget
              title="Active Risks"
              value={kpiData.activeRisks.toString()}
              trend="down"
              trendValue="5%"
              icon={<Warning size={24} />}
            />
          </Column>
          <Column lg={4} md={4} sm={4}>
            <KPIWidget
              title="Critical Risks"
              value={kpiData.criticalRisks.toString()}
              trend="down"
              trendValue="2%"
              icon={<Security size={24} />}
            />
          </Column>
          <Column lg={4} md={4} sm={4}>
            <KPIWidget
              title="Mitigated Risks"
              value={kpiData.mitigatedRisks.toString()}
              trend="up"
              trendValue="15%"
              icon={<ChartRadar size={24} />}
            />
          </Column>
          <Column lg={4} md={4} sm={4}>
            <KPIWidget
              title="Avg Probability"
              value={`${kpiData.avgProbability.toFixed(1)}%`}
              trend="down"
              trendValue="3%"
              icon={<ArrowUp size={24} />}
            />
          </Column>

          {/* Warning Register */}
          <Column lg={16} style={{ marginTop: '2rem' }}>
            <Tile style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3>Warning Register</h3>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <Select
                    id="severity-filter"
                    labelText=""
                    value={selectedSeverity}
                    onChange={(e) => setSelectedSeverity(e.target.value)}
                  >
                    <SelectItem value="All" text="All Severities" />
                    <SelectItem value="Critical" text="Critical" />
                    <SelectItem value="High" text="High" />
                    <SelectItem value="Medium" text="Medium" />
                    <SelectItem value="Low" text="Low" />
                  </Select>
                  <Button kind="primary" renderIcon={Add}>
                    Add Warning
                  </Button>
                </div>
              </div>

              <DataTable rows={[]} headers={[]}>
                {() => (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableHeader>Warning Name</TableHeader>
                          <TableHeader>Category</TableHeader>
                          <TableHeader>Severity</TableHeader>
                          <TableHeader>Probability</TableHeader>
                          <TableHeader>Impact</TableHeader>
                          <TableHeader>Mitigation</TableHeader>
                          <TableHeader>Status</TableHeader>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredRisks.map((risk) => (
                          <TableRow key={risk.id}>
                            <TableCell>{risk.riskName}</TableCell>
                            <TableCell>{risk.category}</TableCell>
                            <TableCell>
                              <Tag type={getSeverityColor(risk.severity)}>
                                {risk.severity}
                              </Tag>
                            </TableCell>
                            <TableCell>
                              <div style={{ width: '100px' }}>
                                <ProgressBar value={risk.probability} label={`${risk.probability}%`} />
                              </div>
                            </TableCell>
                            <TableCell>
                              <div style={{ width: '100px' }}>
                                <ProgressBar value={risk.impact} label={`${risk.impact}%`} />
                              </div>
                            </TableCell>
                            <TableCell>{risk.mitigation}</TableCell>
                            <TableCell>{risk.status}</TableCell>
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

export default RiskManagementConsole;
