import React, { useState, useEffect } from 'react';
import {
  Grid, Column, Tile, Button, Loading, DataTable, TableContainer, Table,
  TableHead, TableRow, TableHeader, TableBody, TableCell, Tag, ProgressBar
} from '@carbon/react';
import { Migrate, ChartLine, Add } from '@carbon/icons-react';
import Sidebar from '../../components/Sidebar';
import KPIWidget from '../../components/KPIWidget';

interface DigitalProject {
  id: string;
  name: string;
  category: string;
  progress: number;
  status: 'Active' | 'Completed' | 'Planning';
}

const DigitalTransformationHub: React.FC = () => {
  const [projects, setProjects] = useState<DigitalProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setProjects([
        { id: 'dt-1', name: 'Cloud Migration', category: 'Infrastructure', progress: 65, status: 'Active' },
        { id: 'dt-2', name: 'AI Implementation', category: 'Analytics', progress: 40, status: 'Active' },
        { id: 'dt-3', name: 'Mobile App', category: 'Customer Experience', progress: 100, status: 'Completed' }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><Loading description="Loading..." withOverlay={false} /></div>;

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '2rem', backgroundColor: '#f4f4f4', overflowY: 'auto' }}>
        <Grid>
          <Column lg={16}>
            <h1 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Migrate size={32} />Chip Migrate Hub
            </h1>
          </Column>
          <Column lg={4} md={4} sm={4}><KPIWidget title="Total Projects" value="3" trend="up" trendValue="10%" icon={<Migrate size={24} />} /></Column>
          <Column lg={4} md={4} sm={4}><KPIWidget title="Active" value="2" trend="up" trendValue="5%" icon={<ChartLine size={24} />} /></Column>
          <Column lg={4} md={4} sm={4}><KPIWidget title="Completed" value="1" trend="up" trendValue="15%" icon={<ChartLine size={24} />} /></Column>
          <Column lg={4} md={4} sm={4}><KPIWidget title="Avg Progress" value="68%" trend="up" trendValue="8%" icon={<ChartLine size={24} />} /></Column>
          <Column lg={16} style={{ marginTop: '2rem' }}>
            <Tile style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h3>Chip Projects</h3>
                <Button kind="primary" renderIcon={Add}>New Project</Button>
              </div>
              <DataTable rows={[]} headers={[]}>
                {() => (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableHeader>Name</TableHeader>
                          <TableHeader>Category</TableHeader>
                          <TableHeader>Progress</TableHeader>
                          <TableHeader>Status</TableHeader>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {projects.map(p => (
                          <TableRow key={p.id}>
                            <TableCell>{p.name}</TableCell>
                            <TableCell>{p.category}</TableCell>
                            <TableCell><div style={{ width: '100px' }}><ProgressBar value={p.progress} label={`${p.progress}%`} /></div></TableCell>
                            <TableCell><Tag type={p.status === 'Completed' ? 'green' : 'blue'}>{p.status}</Tag></TableCell>
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

export default DigitalTransformationHub;
