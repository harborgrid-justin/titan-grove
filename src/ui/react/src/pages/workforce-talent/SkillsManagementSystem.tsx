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
  SkillLevel,
  Trophy,
  UserMultiple,
  Add
} from '@carbon/icons-react';
import Sidebar from '../../components/Sidebar';
import KPIWidget from '../../components/KPIWidget';

interface EmployeeSkill {
  id: string;
  employee: string;
  skill: string;
  category: string;
  proficiency: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  certification: boolean;
  lastAssessed: string;
}

const SkillsManagementSystem: React.FC = () => {
  const [skills, setSkills] = useState<EmployeeSkill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSkillsData();
  }, []);

  const loadSkillsData = () => {
    setTimeout(() => {
      setSkills([
        {
          id: 'skill-1',
          employee: 'John Smith',
          skill: 'Python Programming',
          category: 'Technical',
          proficiency: 85,
          level: 'Advanced',
          certification: true,
          lastAssessed: '2024-02-15'
        },
        {
          id: 'skill-2',
          employee: 'Jane Doe',
          skill: 'Project Management',
          category: 'Management',
          proficiency: 92,
          level: 'Expert',
          certification: true,
          lastAssessed: '2024-01-20'
        },
        {
          id: 'skill-3',
          employee: 'Mike Johnson',
          skill: 'Data Analysis',
          category: 'Technical',
          proficiency: 78,
          level: 'Advanced',
          certification: false,
          lastAssessed: '2024-03-10'
        },
        {
          id: 'skill-4',
          employee: 'Sarah Williams',
          skill: 'Leadership',
          category: 'Soft SkillLevel',
          proficiency: 88,
          level: 'Advanced',
          certification: false,
          lastAssessed: '2024-02-28'
        }
      ]);
      setLoading(false);
    }, 1000);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Expert': return 'green';
      case 'Advanced': return 'blue';
      case 'Intermediate': return 'yellow';
      case 'Beginner': return 'gray';
      default: return 'gray';
    }
  };

  const kpiData = {
    totalSkills: skills.length,
    avgProficiency: skills.reduce((sum, s) => sum + s.proficiency, 0) / skills.length,
    certified: skills.filter(s => s.certification).length,
    expertLevel: skills.filter(s => s.level === 'Expert').length
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Loading description="Loading skills data..." withOverlay={false} />
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
              <SkillLevel size={32} />
              SkillLevel Management System
            </h1>
            <p style={{ marginBottom: '2rem', color: '#525252' }}>
              Track and develop employee skills and competencies
            </p>
          </Column>

          <Column lg={4} md={4} sm={4}>
            <KPIWidget
              title="Total SkillLevel"
              value={kpiData.totalSkills.toString()}
              trend="up"
              trendValue="12%"
              icon={<SkillLevel size={24} />}
            />
          </Column>
          <Column lg={4} md={4} sm={4}>
            <KPIWidget
              title="Avg Proficiency"
              value={`${kpiData.avgProficiency.toFixed(1)}%`}
              trend="up"
              trendValue="5%"
              icon={<Education size={24} />}
            />
          </Column>
          <Column lg={4} md={4} sm={4}>
            <KPIWidget
              title="Certified SkillLevel"
              value={kpiData.certified.toString()}
              trend="up"
              trendValue="8%"
              icon={<Trophy size={24} />}
            />
          </Column>
          <Column lg={4} md={4} sm={4}>
            <KPIWidget
              title="Expert ChartLine"
              value={kpiData.expertLevel.toString()}
              trend="up"
              trendValue="10%"
              icon={<UserMultiple size={24} />}
            />
          </Column>

          <Column lg={16} style={{ marginTop: '2rem' }}>
            <Tile style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3>UserMultiple SkillLevel Matrix</h3>
                <Button kind="primary" renderIcon={Add}>
                  Add SkillLevel
                </Button>
              </div>

              <DataTable rows={[]} headers={[]}>
                {() => (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableHeader>UserMultiple</TableHeader>
                          <TableHeader>SkillLevel</TableHeader>
                          <TableHeader>Category</TableHeader>
                          <TableHeader>Proficiency</TableHeader>
                          <TableHeader>ChartLine</TableHeader>
                          <TableHeader>Certification</TableHeader>
                          <TableHeader>Last Assessed</TableHeader>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {skills.map((skill) => (
                          <TableRow key={skill.id}>
                            <TableCell>{skill.employee}</TableCell>
                            <TableCell>{skill.skill}</TableCell>
                            <TableCell>{skill.category}</TableCell>
                            <TableCell>
                              <div style={{ width: '100px' }}>
                                <ProgressBar value={skill.proficiency} label={`${skill.proficiency}%`} />
                              </div>
                            </TableCell>
                            <TableCell>
                              <Tag type={getLevelColor(skill.level)}>
                                {skill.level}
                              </Tag>
                            </TableCell>
                            <TableCell>{skill.certification ? '✓ Certified' : '✗ Not Certified'}</TableCell>
                            <TableCell>{skill.lastAssessed}</TableCell>
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

export default SkillsManagementSystem;
