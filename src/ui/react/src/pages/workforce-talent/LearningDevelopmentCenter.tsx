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
  Education,
  Book,
  Trophy,
  Launch,
  Add
} from '@carbon/icons-react';
import Sidebar from '../../components/Sidebar';
import KPIWidget from '../../components/KPIWidget';

interface LearningProgram {
  id: string;
  title: string;
  category: string;
  participants: number;
  duration: number;
  completion: number;
  status: 'Active' | 'Completed' | 'Scheduled';
  instructor: string;
}

const LearningDevelopmentCenter: React.FC = () => {
  const [programs, setPrograms] = useState<LearningProgram[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgramsData();
  }, []);

  const loadProgramsData = () => {
    setTimeout(() => {
      setPrograms([
        {
          id: 'prog-1',
          title: 'Leadership Development Program',
          category: 'Leadership',
          participants: 25,
          duration: 12,
          completion: 75,
          status: 'Active',
          instructor: 'Dr. Sarah Johnson'
        },
        {
          id: 'prog-2',
          title: 'Technical SkillLevel Bootcamp',
          category: 'Technical',
          participants: 45,
          duration: 8,
          completion: 100,
          status: 'Completed',
          instructor: 'Mike Chen'
        },
        {
          id: 'prog-3',
          title: 'Project Management Certification',
          category: 'Management',
          participants: 30,
          duration: 16,
          completion: 50,
          status: 'Active',
          instructor: 'Jane Williams'
        },
        {
          id: 'prog-4',
          title: 'Communication SkillLevel Workshop',
          category: 'Soft SkillLevel',
          participants: 20,
          duration: 4,
          completion: 0,
          status: 'Scheduled',
          instructor: 'John Smith'
        }
      ]);
      setLoading(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'blue';
      case 'Completed': return 'green';
      case 'Scheduled': return 'yellow';
      default: return 'gray';
    }
  };

  const kpiData = {
    activePrograms: programs.filter(p => p.status === 'Active').length,
    totalParticipants: programs.reduce((sum, p) => sum + p.participants, 0),
    completedPrograms: programs.filter(p => p.status === 'Completed').length,
    avgCompletion: programs.reduce((sum, p) => sum + p.completion, 0) / programs.length
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Loading description="Loading learning programs..." withOverlay={false} />
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
              <Education size={32} />
              Education & Development Center
            </h1>
            <p style={{ marginBottom: '2rem', color: '#525252' }}>
              UserMultiple training and development programs
            </p>
          </Column>

          <Column lg={4} md={4} sm={4}>
            <KPIWidget
              title="Active Programs"
              value={kpiData.activePrograms.toString()}
              trend="up"
              trendValue="15%"
              icon={<Book size={24} />}
            />
          </Column>
          <Column lg={4} md={4} sm={4}>
            <KPIWidget
              title="Total Participants"
              value={kpiData.totalParticipants.toString()}
              trend="up"
              trendValue="20%"
              icon={<Launch size={24} />}
            />
          </Column>
          <Column lg={4} md={4} sm={4}>
            <KPIWidget
              title="Completed Programs"
              value={kpiData.completedPrograms.toString()}
              trend="up"
              trendValue="10%"
              icon={<Trophy size={24} />}
            />
          </Column>
          <Column lg={4} md={4} sm={4}>
            <KPIWidget
              title="Avg Completion"
              value={`${kpiData.avgCompletion.toFixed(1)}%`}
              trend="up"
              trendValue="8%"
              icon={<Education size={24} />}
            />
          </Column>

          <Column lg={16} style={{ marginTop: '2rem' }}>
            <Tile style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3>Education Programs</h3>
                <Button kind="primary" renderIcon={Add}>
                  New Program
                </Button>
              </div>

              <DataTable rows={[]} headers={[]}>
                {() => (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableHeader>Title</TableHeader>
                          <TableHeader>Category</TableHeader>
                          <TableHeader>Participants</TableHeader>
                          <TableHeader>Duration (weeks)</TableHeader>
                          <TableHeader>Completion</TableHeader>
                          <TableHeader>Status</TableHeader>
                          <TableHeader>Instructor</TableHeader>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {programs.map((program) => (
                          <TableRow key={program.id}>
                            <TableCell>{program.title}</TableCell>
                            <TableCell>{program.category}</TableCell>
                            <TableCell>{program.participants}</TableCell>
                            <TableCell>{program.duration}</TableCell>
                            <TableCell>
                              <div style={{ width: '100px' }}>
                                <ProgressBar value={program.completion} label={`${program.completion}%`} />
                              </div>
                            </TableCell>
                            <TableCell>
                              <Tag type={getStatusColor(program.status)}>
                                {program.status}
                              </Tag>
                            </TableCell>
                            <TableCell>{program.instructor}</TableCell>
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

export default LearningDevelopmentCenter;
