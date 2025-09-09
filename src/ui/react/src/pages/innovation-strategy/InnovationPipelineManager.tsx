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
  IbmWatsonDiscovery,
  Analytics,
  Add,
  View,
  Lightbulb
} from '@carbon/icons-react';
import Sidebar from '../../components/Sidebar';
import KPIWidget from '../../components/KPIWidget';

interface InnovationProject {
  id: string;
  name: string;
  category: string;
  stage: 'Ideation' | 'Development' | 'Testing' | 'Launch' | 'Scaling';
  potential: number;
  investment: number;
  timeline: string;
  team: string;
  roi: number;
}

const InnovationPipelineManager: React.FC = () => {
  const [projects, setProjects] = useState<InnovationProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInnovationData();
  }, []);

  const loadInnovationData = () => {
    setTimeout(() => {
      setProjects([
        {
          id: 'inn-1',
          name: 'AI-Powered Customer Service',
          category: 'AI/ML',
          stage: 'Development',
          potential: 85,
          investment: 250000,
          timeline: '6 months',
          team: 'AI Team',
          roi: 320
        },
        {
          id: 'inn-2',
          name: 'Blockchain Supply Chain',
          category: 'Blockchain',
          stage: 'Testing',
          potential: 72,
          investment: 180000,
          timeline: '8 months',
          team: 'Blockchain Team',
          roi: 240
        }
      ]);
      setLoading(false);
    }, 1500);
  };

  const kpiData = [
    {
      title: 'Active Projects',
      value: projects.length.toString(),
      change: 25.0,
      format: 'number' as const
    },
    {
      title: 'Total Investment',
      value: `$${(projects.reduce((sum, p) => sum + p.investment, 0) / 1000).toFixed(0)}K`,
      change: 18.7,
      format: 'currency' as const
    },
    {
      title: 'Avg ROI Potential',
      value: `${(projects.reduce((sum, p) => sum + p.roi, 0) / projects.length).toFixed(0)}%`,
      change: 45.2,
      format: 'percentage' as const
    },
    {
      title: 'Success Rate',
      value: '78%',
      change: 12.1,
      format: 'percentage' as const
    }
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{ flex: 1, padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Loading description="Loading innovation pipeline..." />
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '2rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: '600',
            marginBottom: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Lightbulb size={32} />
            Innovation Pipeline Manager
          </h1>
          <p style={{ color: 'var(--cds-text-02)', marginBottom: '1rem' }}>
            Manage innovation projects from ideation to market launch
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Button kind="primary" renderIcon={Add}>
              Add Project
            </Button>
            <Button kind="secondary" renderIcon={Analytics}>
              Innovation Report
            </Button>
            <Button kind="tertiary" renderIcon={IbmWatsonDiscovery}>
              Trend Analysis
            </Button>
          </div>
        </div>

        <Grid>
          {kpiData.map((kpi, index) => (
            <Column key={index} lg={4} md={4} sm={2}>
              <div style={{ marginBottom: '1rem' }}>
                <KPIWidget
                  title={kpi.title}
                  value={kpi.value}
                  change={kpi.change.toString()}
                  trend={kpi.change >= 0 ? 'positive' : 'negative'}
                  format={kpi.format}
                />
              </div>
            </Column>
          ))}
        </Grid>

        <Grid style={{ marginTop: '2rem' }}>
          <Column lg={12} md={8} sm={4}>
            <Tile style={{ padding: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>Innovation Projects</h3>
              <DataTable 
                rows={projects.map(project => ({
                  id: project.id,
                  name: project.name,
                  category: project.category,
                  stage: (
                    <Tag type={
                      project.stage === 'Launch' ? 'green' :
                      project.stage === 'Testing' ? 'blue' :
                      project.stage === 'Development' ? 'purple' : 'gray'
                    }>
                      {project.stage}
                    </Tag>
                  ),
                  potential: (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <ProgressBar value={project.potential} size="sm" />
                      <span style={{ fontSize: '0.75rem' }}>{project.potential}%</span>
                    </div>
                  ),
                  investment: `$${(project.investment / 1000).toFixed(0)}K`,
                  roi: `${project.roi}%`,
                  timeline: project.timeline,
                  actions: (
                    <Button size="sm" kind="ghost" renderIcon={View}>
                      View Details
                    </Button>
                  )
                }))} 
                headers={[
                  { key: 'name', header: 'Project Name' },
                  { key: 'category', header: 'Category' },
                  { key: 'stage', header: 'Stage' },
                  { key: 'potential', header: 'Potential' },
                  { key: 'investment', header: 'Investment' },
                  { key: 'roi', header: 'ROI' },
                  { key: 'timeline', header: 'Timeline' },
                  { key: 'actions', header: 'Actions' }
                ]}
                render={({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
                  <TableContainer>
                    <Table {...getTableProps()}>
                      <TableHead>
                        <TableRow>
                          {headers.map(header => (
                            <TableHeader key={header.key} {...getHeaderProps({ header })}>
                              {header.header}
                            </TableHeader>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {rows.map(row => (
                          <TableRow key={row.id} {...getRowProps({ row })}>
                            {row.cells.map(cell => (
                              <TableCell key={cell.id}>{cell.value}</TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              />
            </Tile>
          </Column>
        </Grid>
      </div>
    </div>
  );
};

export default InnovationPipelineManager;