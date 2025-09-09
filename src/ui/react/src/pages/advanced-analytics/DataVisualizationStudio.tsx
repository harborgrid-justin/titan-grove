import React, { useState, useEffect } from 'react';
import {
  Grid,
  Column,
  Tile,
  Button,
  Loading,
  Select,
  SelectItem,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  DataTable,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell
} from '@carbon/react';
import {
  ChartColumn,
  ChartLine,
  ChartPie,
  ChartScatter,
  ColorPalette,
  Download,
  Save,
  Settings
} from '@carbon/icons-react';
import Sidebar from '../../components/Sidebar';
import KPIWidget from '../../components/KPIWidget';

interface ChartData {
  id: string;
  name: string;
  data: Array<{ label: string; value: number; category?: string }>;
  type: 'bar' | 'line' | 'pie' | 'scatter' | 'area';
}

interface Visualization {
  id: string;
  title: string;
  description: string;
  chartType: string;
  dataSource: string;
  lastUpdated: string;
  isPublic: boolean;
}

const DataVisualizationStudio: React.FC = () => {
  const [charts, setCharts] = useState<ChartData[]>([]);
  const [visualizations, setVisualizations] = useState<Visualization[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChart, setSelectedChart] = useState<string>('');
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    loadVisualizationData();
  }, []);

  const loadVisualizationData = () => {
    setTimeout(() => {
      setCharts([
        {
          id: 'revenue-chart',
          name: 'Monthly Revenue',
          data: [
            { label: 'Jan', value: 2450000 },
            { label: 'Feb', value: 2680000 },
            { label: 'Mar', value: 2890000 },
            { label: 'Apr', value: 3120000 },
            { label: 'May', value: 2950000 },
            { label: 'Jun', value: 3380000 }
          ],
          type: 'bar'
        },
        {
          id: 'customer-satisfaction',
          name: 'Customer Satisfaction Trend',
          data: [
            { label: 'Q1', value: 87.2 },
            { label: 'Q2', value: 89.1 },
            { label: 'Q3', value: 91.5 },
            { label: 'Q4', value: 88.9 }
          ],
          type: 'line'
        },
        {
          id: 'market-share',
          name: 'Market Share Distribution',
          data: [
            { label: 'Enterprise', value: 45 },
            { label: 'Mid-Market', value: 30 },
            { label: 'SMB', value: 25 }
          ],
          type: 'pie'
        }
      ]);

      setVisualizations([
        {
          id: 'exec-dashboard',
          title: 'Executive Dashboard',
          description: 'High-level KPIs and trends for executive team',
          chartType: 'Mixed',
          dataSource: 'Business Intelligence',
          lastUpdated: new Date().toISOString(),
          isPublic: true
        },
        {
          id: 'sales-analytics',
          title: 'Sales Performance Analytics',
          description: 'Detailed sales metrics and forecasting',
          chartType: 'Bar & Line Charts',
          dataSource: 'CRM & Sales',
          lastUpdated: new Date().toISOString(),
          isPublic: false
        }
      ]);

      setLoading(false);
    }, 1500);
  };

  const kpiData = [
    {
      title: 'Active Charts',
      value: charts.length.toString(),
      change: 8.3,
      format: 'number' as const
    },
    {
      title: 'Visualizations',
      value: visualizations.length.toString(),
      change: 12.5,
      format: 'number' as const
    },
    {
      title: 'Public Dashboards',
      value: visualizations.filter(v => v.isPublic).length.toString(),
      change: 5.2,
      format: 'number' as const
    },
    {
      title: 'Data Sources',
      value: '12',
      change: 2.1,
      format: 'number' as const
    }
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{ flex: 1, padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Loading description="Loading visualization studio..." />
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
            <ColorPalette size={32} />
            Data Visualization Studio
          </h1>
          <p style={{ color: 'var(--cds-text-02)', marginBottom: '1rem' }}>
            Create interactive charts, dashboards, and data visualizations
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Button kind="primary" renderIcon={ChartColumn}>
              New Visualization
            </Button>
            <Button kind="secondary" renderIcon={ColorPalette}>
              Chart Templates
            </Button>
            <Button kind="tertiary" renderIcon={Download}>
              Export Gallery
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
              <Tabs>
                <TabList ariaLabel="Visualization Studio Tabs">
                  <Tab>Chart Gallery</Tab>
                  <Tab>Dashboard Builder</Tab>
                  <Tab>Data Sources</Tab>
                  <Tab>Settings</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <div style={{ padding: '1rem 0' }}>
                      <h3 style={{ marginBottom: '1rem' }}>Available Charts</h3>
                      <Grid>
                        {charts.map(chart => (
                          <Column key={chart.id} lg={4} md={4} sm={2}>
                            <Tile style={{ 
                              padding: '1rem',
                              marginBottom: '1rem',
                              border: selectedChart === chart.id ? '2px solid var(--cds-interactive-01)' : '1px solid var(--cds-border-subtle)',
                              cursor: 'pointer'
                            }}
                            onClick={() => setSelectedChart(chart.id)}
                            >
                              <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                height: '100px',
                                marginBottom: '0.5rem',
                                backgroundColor: 'var(--cds-layer-01)',
                                borderRadius: '0.25rem'
                              }}>
                                {chart.type === 'bar' && <ChartColumn size={48} />}
                                {chart.type === 'line' && <ChartLine size={48} />}
                                {chart.type === 'pie' && <ChartPie size={48} />}
                                {chart.type === 'scatter' && <ChartScatter size={48} />}
                              </div>
                              <h4 style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>{chart.name}</h4>
                              <p style={{ fontSize: '0.75rem', color: 'var(--cds-text-02)' }}>
                                {chart.type.charAt(0).toUpperCase() + chart.type.slice(1)} Chart
                              </p>
                              <div style={{ 
                                display: 'flex', 
                                gap: '0.25rem',
                                marginTop: '0.5rem'
                              }}>
                                <Button size="sm" kind="primary">Edit</Button>
                                <Button size="sm" kind="secondary">Copy</Button>
                              </div>
                            </Tile>
                          </Column>
                        ))}
                      </Grid>
                    </div>
                  </TabPanel>
                  
                  <TabPanel>
                    <div style={{ padding: '1rem 0' }}>
                      <h3 style={{ marginBottom: '1rem' }}>Dashboard Builder</h3>
                      <p style={{ color: 'var(--cds-text-02)', marginBottom: '1rem' }}>
                        Drag and drop interface for creating custom dashboards
                      </p>
                      <div style={{
                        border: '2px dashed var(--cds-border-subtle)',
                        borderRadius: '0.5rem',
                        padding: '2rem',
                        textAlign: 'center',
                        minHeight: '200px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column'
                      }}>
                        <ColorPalette size={48} style={{ color: 'var(--cds-text-03)' }} />
                        <p style={{ color: 'var(--cds-text-02)', marginTop: '1rem' }}>
                          Drop charts here to build your dashboard
                        </p>
                        <Button kind="ghost" style={{ marginTop: '1rem' }}>
                          Start Building
                        </Button>
                      </div>
                    </div>
                  </TabPanel>
                  
                  <TabPanel>
                    <div style={{ padding: '1rem 0' }}>
                      <h3 style={{ marginBottom: '1rem' }}>Data Sources</h3>
                      <DataTable 
                        rows={[
                          { id: '1', name: 'Sales Database', type: 'PostgreSQL', status: 'Connected', lastSync: 'Just now' },
                          { id: '2', name: 'CRM System', type: 'Salesforce API', status: 'Connected', lastSync: '5 min ago' },
                          { id: '3', name: 'Financial Data', type: 'Oracle EBS', status: 'Connected', lastSync: '1 hour ago' }
                        ]}
                        headers={[
                          { key: 'name', header: 'Data Source' },
                          { key: 'type', header: 'Type' },
                          { key: 'status', header: 'Status' },
                          { key: 'lastSync', header: 'Last Sync' }
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
                    </div>
                  </TabPanel>
                  
                  <TabPanel>
                    <div style={{ padding: '1rem 0' }}>
                      <h3 style={{ marginBottom: '1rem' }}>Studio Settings</h3>
                      <div style={{ display: 'grid', gap: '1rem', maxWidth: '400px' }}>
                        <Select id="theme" labelText="Color Theme">
                          <SelectItem value="carbon" text="Carbon Default" />
                          <SelectItem value="corporate" text="Corporate Blue" />
                          <SelectItem value="modern" text="Modern Dark" />
                        </Select>
                        
                        <Select id="export-format" labelText="Default Export Format">
                          <SelectItem value="png" text="PNG Image" />
                          <SelectItem value="svg" text="SVG Vector" />
                          <SelectItem value="pdf" text="PDF Document" />
                        </Select>
                        
                        <Button kind="primary" renderIcon={Save}>
                          Save Settings
                        </Button>
                      </div>
                    </div>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Tile>
          </Column>
        </Grid>
      </div>
    </div>
  );
};

export default DataVisualizationStudio;