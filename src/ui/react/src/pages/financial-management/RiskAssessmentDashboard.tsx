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
  Security,
  ChartRadar,
  Warning,
  ShieldCheck,
  Add
} from '@carbon/icons-react';
import Sidebar from '../../components/Sidebar';
import KPIWidget from '../../components/KPIWidget';

interface FinancialRisk {
  id: string;
  riskType: string;
  category: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  likelihood: number;
  impact: number;
  exposure: number;
  mitigation: string;
}

const RiskAssessmentDashboard: React.FC = () => {
  const [risks, setRisks] = useState<FinancialRisk[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRiskData();
  }, []);

  const loadRiskData = () => {
    setTimeout(() => {
      setRisks([
        {
          id: 'risk-1',
          riskType: 'Credit Risk',
          category: 'Counterparty',
          severity: 'High',
          likelihood: 65,
          impact: 85,
          exposure: 2500000,
          mitigation: 'Credit insurance, collateral requirements'
        },
        {
          id: 'risk-2',
          riskType: 'Market Risk',
          category: 'Trading',
          severity: 'Medium',
          likelihood: 45,
          impact: 60,
          exposure: 1800000,
          mitigation: 'Hedging strategies, diversification'
        },
        {
          id: 'risk-3',
          riskType: 'Liquidity Risk',
          category: 'Cash Flow',
          severity: 'Critical',
          likelihood: 35,
          impact: 95,
          exposure: 3200000,
          mitigation: 'Credit facilities, cash reserves'
        },
        {
          id: 'risk-4',
          riskType: 'Operational Risk',
          category: 'Internal',
          severity: 'Low',
          likelihood: 25,
          impact: 40,
          exposure: 850000,
          mitigation: 'Process controls, automation'
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

  const kpiData = {
    totalRisks: risks.length,
    criticalRisks: risks.filter(r => r.severity === 'Critical').length,
    totalExposure: risks.reduce((sum, r) => sum + r.exposure, 0),
    avgLikelihood: risks.reduce((sum, r) => sum + r.likelihood, 0) / risks.length
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Loading description="Loading risk assessment data..." withOverlay={false} />
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
              Risk Assessment Dashboard
            </h1>
            <p style={{ marginBottom: '2rem', color: '#525252' }}>
              Financial risk identification, assessment, and monitoring
            </p>
          </Column>

          <Column lg={4} md={4} sm={4}>
            <KPIWidget
              title="Total Risks"
              value={kpiData.totalRisks.toString()}
              trend="neutral"
              trendValue="0%"
              icon={<Security size={24} />}
            />
          </Column>
          <Column lg={4} md={4} sm={4}>
            <KPIWidget
              title="Critical Risks"
              value={kpiData.criticalRisks.toString()}
              trend="down"
              trendValue="5%"
              icon={<Warning size={24} />}
            />
          </Column>
          <Column lg={4} md={4} sm={4}>
            <KPIWidget
              title="Total Exposure"
              value={`$${(kpiData.totalExposure / 1000000).toFixed(1)}M`}
              trend="down"
              trendValue="8%"
              icon={<ChartRadar size={24} />}
            />
          </Column>
          <Column lg={4} md={4} sm={4}>
            <KPIWidget
              title="Avg Likelihood"
              value={`${kpiData.avgLikelihood.toFixed(1)}%`}
              trend="down"
              trendValue="3%"
              icon={<ShieldCheck size={24} />}
            />
          </Column>

          <Column lg={16} style={{ marginTop: '2rem' }}>
            <Tile style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3>Risk Register</h3>
                <Button kind="primary" renderIcon={Add}>
                  Add Risk
                </Button>
              </div>

              <DataTable rows={[]} headers={[]}>
                {() => (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableHeader>Risk Type</TableHeader>
                          <TableHeader>Category</TableHeader>
                          <TableHeader>Severity</TableHeader>
                          <TableHeader>Likelihood</TableHeader>
                          <TableHeader>Impact</TableHeader>
                          <TableHeader>Exposure</TableHeader>
                          <TableHeader>Mitigation</TableHeader>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {risks.map((risk) => (
                          <TableRow key={risk.id}>
                            <TableCell>{risk.riskType}</TableCell>
                            <TableCell>{risk.category}</TableCell>
                            <TableCell>
                              <Tag type={getSeverityColor(risk.severity)}>
                                {risk.severity}
                              </Tag>
                            </TableCell>
                            <TableCell>
                              <div style={{ width: '80px' }}>
                                <ProgressBar value={risk.likelihood} label={`${risk.likelihood}%`} />
                              </div>
                            </TableCell>
                            <TableCell>
                              <div style={{ width: '80px' }}>
                                <ProgressBar value={risk.impact} label={`${risk.impact}%`} />
                              </div>
                            </TableCell>
                            <TableCell>${(risk.exposure / 1000000).toFixed(2)}M</TableCell>
                            <TableCell>{risk.mitigation}</TableCell>
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

export default RiskAssessmentDashboard;
