import React, { useState, useEffect } from 'react';
import {
  Grid, Column, Tile, Button, Loading, DataTable, TableContainer, Table,
  TableHead, TableRow, TableHeader, TableBody, TableCell, Tag
} from '@carbon/react';
import { Flow, Add } from '@carbon/icons-react';
import Sidebar from '../../components/Sidebar';
import KPIWidget from '../../components/KPIWidget';

const BusinessProcessDesigner: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [processes, setProcesses] = useState([
    { id: 'proc-1', name: 'Order Fulfillment', complexity: 'High', efficiency: 85, status: 'Active' },
    { id: 'proc-2', name: 'Invoice Processing', complexity: 'Medium', efficiency: 90, status: 'Active' },
    { id: 'proc-3', name: 'Customer Onboarding', complexity: 'Low', efficiency: 95, status: 'Active' }
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
          <Column lg={16}><h1 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Flow size={32} />Business Process Designer</h1></Column>
          <Column lg={4} md={4} sm={4}><KPIWidget title="Total Processes" value="3" trend="up" trendValue="5%" icon={<Flow size={24} />} /></Column>
          <Column lg={4} md={4} sm={4}><KPIWidget title="Active" value="3" trend="neutral" trendValue="0%" icon={<Flow size={24} />} /></Column>
          <Column lg={4} md={4} sm={4}><KPIWidget title="High Complexity" value="1" trend="down" trendValue="10%" icon={<Flow size={24} />} /></Column>
          <Column lg={4} md={4} sm={4}><KPIWidget title="Avg Efficiency" value="90%" trend="up" trendValue="5%" icon={<Flow size={24} />} /></Column>
          <Column lg={16} style={{ marginTop: '2rem' }}>
            <Tile style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}><h3>Business Processes</h3><Button kind="primary" renderIcon={Add}>Design Process</Button></div>
              <DataTable rows={[]} headers={[]}>
                {() => (
                  <TableContainer>
                    <Table>
                      <TableHead><TableRow><TableHeader>Name</TableHeader><TableHeader>Complexity</TableHeader><TableHeader>Efficiency</TableHeader><TableHeader>Status</TableHeader></TableRow></TableHead>
                      <TableBody>
                        {processes.map(p => (
                          <TableRow key={p.id}>
                            <TableCell>{p.name}</TableCell>
                            <TableCell><Tag type={p.complexity === 'High' ? 'red' : p.complexity === 'Medium' ? 'yellow' : 'green'}>{p.complexity}</Tag></TableCell>
                            <TableCell>{p.efficiency}%</TableCell>
                            <TableCell><Tag type="green">{p.status}</Tag></TableCell>
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

export default BusinessProcessDesigner;
