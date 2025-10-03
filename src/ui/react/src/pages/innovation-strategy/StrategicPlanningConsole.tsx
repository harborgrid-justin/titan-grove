import React, { useState, useEffect } from 'react';
import {
  Grid, Column, Tile, Button, Loading, DataTable, TableContainer, Table,
  TableHead, TableRow, TableHeader, TableBody, TableCell, Tag, ProgressBar
} from '@carbon/react';
import { Strategy, ChartLine, Add } from '@carbon/icons-react';
import Sidebar from '../../components/Sidebar';
import KPIWidget from '../../components/KPIWidget';

interface StrategicInitiative {
  id: string;
  name: string;
  objective: string;
  progress: number;
  priority: 'High' | 'Medium' | 'Low';
  status: 'On Track' | 'At Risk' | 'Completed';
}

const StrategicPlanningConsole: React.FC = () => {
  const [initiatives, setInitiatives] = useState<StrategicInitiative[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setInitiatives([
        { id: 'si-1', name: 'Market Expansion', objective: 'Enter new markets', progress: 65, priority: 'High', status: 'On Track' },
        { id: 'si-2', name: 'Product Innovation', objective: 'Launch new product line', progress: 45, priority: 'High', status: 'At Risk' },
        { id: 'si-3', name: 'Operational Excellence', objective: 'Improve efficiency', progress: 100, priority: 'Medium', status: 'Completed' },
        { id: 'si-4', name: 'Digital Transformation', objective: 'Modernize technology', progress: 80, priority: 'High', status: 'On Track' }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'On Track': return 'green';
      case 'At Risk': return 'yellow';
      case 'Completed': return 'blue';
      default: return 'gray';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'red';
      case 'Medium': return 'yellow';
      case 'Low': return 'green';
      default: return 'gray';
    }
  };

  const kpiData = {
    totalInitiatives: initiatives.length,
    avgProgress: initiatives.reduce((sum, i) => sum + i.progress, 0) / initiatives.length,
    onTrack: initiatives.filter(i => i.status === 'On Track').length,
    completed: initiatives.filter(i => i.status === 'Completed').length
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><Loading description="Loading strategic initiatives..." withOverlay={false} /></div>;

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '2rem', backgroundColor: '#f4f4f4', overflowY: 'auto' }}>
        <Grid>
          <Column lg={16}>
            <h1 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Strategy size={32} />Strategic Planning Console
            </h1>
            <p style={{ marginBottom: '2rem', color: '#525252' }}>
              Strategic initiative planning and execution tracking
            </p>
          </Column>
          <Column lg={4} md={4} sm={4}><KPIWidget title="Total Initiatives" value={kpiData.totalInitiatives.toString()} trend="up" trendValue="10%" icon={<Strategy size={24} />} /></Column>
          <Column lg={4} md={4} sm={4}><KPIWidget title="Avg Progress" value={`${kpiData.avgProgress.toFixed(1)}%`} trend="up" trendValue="8%" icon={<ChartLine size={24} />} /></Column>
          <Column lg={4} md={4} sm={4}><KPIWidget title="On Track" value={kpiData.onTrack.toString()} trend="up" trendValue="5%" icon={<Strategy size={24} />} /></Column>
          <Column lg={4} md={4} sm={4}><KPIWidget title="Completed" value={kpiData.completed.toString()} trend="up" trendValue="15%" icon={<Strategy size={24} />} /></Column>
          <Column lg={16} style={{ marginTop: '2rem' }}>
            <Tile style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h3>Strategic Initiatives</h3>
                <Button kind="primary" renderIcon={Add}>New Initiative</Button>
              </div>
              <DataTable rows={[]} headers={[]}>
                {() => (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableHeader>Name</TableHeader>
                          <TableHeader>Objective</TableHeader>
                          <TableHeader>Progress</TableHeader>
                          <TableHeader>Priority</TableHeader>
                          <TableHeader>Status</TableHeader>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {initiatives.map(init => (
                          <TableRow key={init.id}>
                            <TableCell>{init.name}</TableCell>
                            <TableCell>{init.objective}</TableCell>
                            <TableCell>
                              <div style={{ width: '120px' }}>
                                <ProgressBar value={init.progress} label={`${init.progress}%`} />
                              </div>
                            </TableCell>
                            <TableCell><Tag type={getPriorityColor(init.priority)}>{init.priority}</Tag></TableCell>
                            <TableCell><Tag type={getStatusColor(init.status)}>{init.status}</Tag></TableCell>
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

export default StrategicPlanningConsole;
