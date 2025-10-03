import React, { useState, useEffect } from 'react';
import {
  Grid, Column, Tile, Button, Loading, DataTable, TableContainer, Table,
  TableHead, TableRow, TableHeader, TableBody, TableCell, Tag, ProgressBar
} from '@carbon/react';
import { Time, CheckmarkFilled, Add } from '@carbon/icons-react';
import Sidebar from '../../components/Sidebar';
import KPIWidget from '../../components/KPIWidget';

const ServiceLevelManagement: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [slas, setSlas] = useState([
    { id: 'sla-1', service: 'Email Support', target: 95, actual: 97, status: 'Met' },
    { id: 'sla-2', service: 'System Uptime', target: 99.9, actual: 99.95, status: 'Met' },
    { id: 'sla-3', service: 'Response Time', target: 90, actual: 88, status: 'Missed' }
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
          <Column lg={16}><h1 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Time size={32} />Service Level Management</h1></Column>
          <Column lg={4} md={4} sm={4}><KPIWidget title="Total SLAs" value="3" trend="neutral" trendValue="0%" icon={<Time size={24} />} /></Column>
          <Column lg={4} md={4} sm={4}><KPIWidget title="Met" value="2" trend="up" trendValue="10%" icon={<CheckmarkFilled size={24} />} /></Column>
          <Column lg={4} md={4} sm={4}><KPIWidget title="Missed" value="1" trend="down" trendValue="5%" icon={<Time size={24} />} /></Column>
          <Column lg={4} md={4} sm={4}><KPIWidget title="Compliance" value="67%" trend="up" trendValue="8%" icon={<CheckmarkFilled size={24} />} /></Column>
          <Column lg={16} style={{ marginTop: '2rem' }}>
            <Tile style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}><h3>Service Level Agreements</h3><Button kind="primary" renderIcon={Add}>New SLA</Button></div>
              <DataTable rows={[]} headers={[]}>
                {() => (
                  <TableContainer>
                    <Table>
                      <TableHead><TableRow><TableHeader>Service</TableHeader><TableHeader>Target</TableHeader><TableHeader>Actual</TableHeader><TableHeader>Status</TableHeader></TableRow></TableHead>
                      <TableBody>
                        {slas.map(s => (
                          <TableRow key={s.id}>
                            <TableCell>{s.service}</TableCell>
                            <TableCell>{s.target}%</TableCell>
                            <TableCell>{s.actual}%</TableCell>
                            <TableCell><Tag type={s.status === 'Met' ? 'green' : 'red'}>{s.status}</Tag></TableCell>
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

export default ServiceLevelManagement;
