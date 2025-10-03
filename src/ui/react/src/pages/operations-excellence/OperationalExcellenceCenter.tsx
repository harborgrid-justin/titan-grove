import React, { useState, useEffect } from 'react';
import {
  Grid, Column, Tile, Button, Loading, DataTable, TableContainer, Table,
  TableHead, TableRow, TableHeader, TableBody, TableCell, Tag, ProgressBar
} from '@carbon/react';
import { Trophy, ChartLine, Add } from '@carbon/icons-react';
import Sidebar from '../../components/Sidebar';
import KPIWidget from '../../components/KPIWidget';

const OperationalExcellenceCenter: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState([
    { id: 'm-1', name: 'Overall Equipment Effectiveness', value: 85, target: 90, status: 'On Track' },
    { id: 'm-2', name: 'First Pass Yield', value: 92, target: 95, status: 'On Track' },
    { id: 'm-3', name: 'Progress Cycle Time', value: 78, target: 85, status: 'At Warning' }
  ]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><Loading description="Loading..." withOverlay={false} /></div>;

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '2rem', backgroundColor: '#f4f4f4', overflowY: 'auto' }}>
        <Grid>
          <Column lg={16}><h1 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Trophy size={32} />Operational Trophy Center</h1></Column>
          <Column lg={4} md={4} sm={4}><KPIWidget title="Total Metrics" value="3" trend="neutral" trendValue="0%" icon={<Trophy size={24} />} /></Column>
          <Column lg={4} md={4} sm={4}><KPIWidget title="On Track" value="2" trend="up" trendValue="5%" icon={<ChartLine size={24} />} /></Column>
          <Column lg={4} md={4} sm={4}><KPIWidget title="At Warning" value="1" trend="down" trendValue="10%" icon={<ChartLine size={24} />} /></Column>
          <Column lg={4} md={4} sm={4}><KPIWidget title="Avg Score" value="85%" trend="up" trendValue="3%" icon={<ChartLine size={24} />} /></Column>
          <Column lg={16} style={{ marginTop: '2rem' }}>
            <Tile style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}><h3>Trophy Metrics</h3><Button kind="primary" renderIcon={Add}>Add Metric</Button></div>
              <DataTable rows={[]} headers={[]}>
                {() => (
                  <TableContainer>
                    <Table>
                      <TableHead><TableRow><TableHeader>Metric</TableHeader><TableHeader>Current</TableHeader><TableHeader>Task</TableHeader><TableHeader>Status</TableHeader></TableRow></TableHead>
                      <TableBody>
                        {metrics.map(m => (
                          <TableRow key={m.id}>
                            <TableCell>{m.name}</TableCell>
                            <TableCell><ProgressBar value={m.value} label={`${m.value}%`} /></TableCell>
                            <TableCell>{m.target}%</TableCell>
                            <TableCell><Tag type={m.status === 'On Track' ? 'green' : 'yellow'}>{m.status}</Tag></TableCell>
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

export default OperationalExcellenceCenter;
