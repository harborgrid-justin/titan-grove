import React, { useState, useEffect } from 'react';
import {
  Grid, Column, Tile, Button, Loading, DataTable, TableContainer, Table,
  TableHead, TableRow, TableHeader, TableBody, TableCell, Tag
} from '@carbon/react';
import { DataBackup, Add } from '@carbon/icons-react';
import Sidebar from '../../components/Sidebar';
import KPIWidget from '../../components/KPIWidget';

const ChangeManagementPortal: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [changes, setChanges] = useState([
    { id: 'chg-1', title: 'System Upgrade', priority: 'High', status: 'Approved', date: '2024-03-25' },
    { id: 'chg-2', title: 'Process Update', priority: 'Medium', status: 'In Review', date: '2024-03-26' },
    { id: 'chg-3', title: 'Policy Change', priority: 'Low', status: 'Scheduled', date: '2024-03-27' }
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
          <Column lg={16}><h1 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><DataBackup size={32} />Change Management Portal</h1></Column>
          <Column lg={4} md={4} sm={4}><KPIWidget title="Total Changes" value="3" trend="neutral" trendValue="0%" icon={<DataBackup size={24} />} /></Column>
          <Column lg={4} md={4} sm={4}><KPIWidget title="Approved" value="1" trend="up" trendValue="5%" icon={<DataBackup size={24} />} /></Column>
          <Column lg={4} md={4} sm={4}><KPIWidget title="In Review" value="1" trend="neutral" trendValue="0%" icon={<DataBackup size={24} />} /></Column>
          <Column lg={4} md={4} sm={4}><KPIWidget title="Scheduled" value="1" trend="up" trendValue="10%" icon={<DataBackup size={24} />} /></Column>
          <Column lg={16} style={{ marginTop: '2rem' }}>
            <Tile style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}><h3>Change Requests</h3><Button kind="primary" renderIcon={Add}>New Change</Button></div>
              <DataTable rows={[]} headers={[]}>
                {() => (
                  <TableContainer>
                    <Table>
                      <TableHead><TableRow><TableHeader>Title</TableHeader><TableHeader>Priority</TableHeader><TableHeader>Status</TableHeader><TableHeader>Date</TableHeader></TableRow></TableHead>
                      <TableBody>
                        {changes.map(c => (
                          <TableRow key={c.id}>
                            <TableCell>{c.title}</TableCell>
                            <TableCell><Tag type={c.priority === 'High' ? 'red' : c.priority === 'Medium' ? 'yellow' : 'green'}>{c.priority}</Tag></TableCell>
                            <TableCell><Tag type={c.status === 'Approved' ? 'green' : 'blue'}>{c.status}</Tag></TableCell>
                            <TableCell>{c.date}</TableCell>
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

export default ChangeManagementPortal;
