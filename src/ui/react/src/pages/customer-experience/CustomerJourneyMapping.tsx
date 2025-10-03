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
  Select,
  SelectItem,
  Modal,
  TextInput,
  TextArea,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Tag,
  ProgressBar
} from '@carbon/react';
import {
  CustomerService,
  Map,
  Time,
  Analytics,
  Add,
  Edit,
  View,
  Email,
  Phone
} from '@carbon/icons-react';
import Sidebar from '../../components/Sidebar';
import KPIWidget from '../../components/KPIWidget';

interface JourneyStage {
  id: string;
  name: string;
  description: string;
  order: number;
  touchpoints: string[];
  metrics: {
    conversionRate: number;
    averageTime: number;
    satisfactionScore: number;
    dropoffRate: number;
  };
  painPoints: string[];
  opportunities: string[];
}

interface CustomerJourney {
  id: string;
  name: string;
  description: string;
  customerSegment: string;
  stages: string[];
  status: 'active' | 'draft' | 'archived';
  lastUpdated: string;
  completionRate: number;
}

const CustomerJourneyMapping: React.FC = () => {
  const [journeys, setJourneys] = useState<CustomerJourney[]>([]);
  const [stages, setStages] = useState<JourneyStage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showJourneyModal, setShowJourneyModal] = useState(false);
  const [selectedJourney, setSelectedJourney] = useState<string>('');
  const [activeTab, setActiveTab] = useState(0);

  const [journeyForm, setJourneyForm] = useState({
    name: '',
    description: '',
    customerSegment: 'Enterprise',
    stages: [] as string[]
  });

  useEffect(() => {
    loadJourneyData();
  }, []);

  const loadJourneyData = () => {
    setTimeout(() => {
      setStages([
        {
          id: 'awareness',
          name: 'Awareness',
          description: 'Customer becomes aware of the problem and our solution',
          order: 1,
          touchpoints: ['Website', 'Social Media', 'Search', 'Referral'],
          metrics: {
            conversionRate: 12.5,
            averageTime: 3.2,
            satisfactionScore: 4.2,
            dropoffRate: 68.5
          },
          painPoints: ['Information overload', 'Unclear value proposition'],
          opportunities: ['Improved content strategy', 'Better targeting']
        },
        {
          id: 'consideration',
          name: 'Consideration',
          description: 'Customer evaluates options and compares solutions',
          order: 2,
          touchpoints: ['Demo', 'Sales Call', 'Documentation', 'Case Studies'],
          metrics: {
            conversionRate: 35.8,
            averageTime: 12.5,
            satisfactionScore: 4.6,
            dropoffRate: 42.3
          },
          painPoints: ['Complex pricing', 'Long evaluation process'],
          opportunities: ['Simplified demos', 'Clear ROI calculator']
        },
        {
          id: 'purchase',
          name: 'Purchase',
          description: 'Customer makes the buying decision and completes purchase',
          order: 3,
          touchpoints: ['Document', 'Payment', 'Onboarding', 'Support'],
          metrics: {
            conversionRate: 78.9,
            averageTime: 8.3,
            satisfactionScore: 4.8,
            dropoffRate: 15.2
          },
          painPoints: ['Document complexity', 'Slow approval process'],
          opportunities: ['Streamlined contracts', 'Fast-track approvals']
        }
      ]);

      setJourneys([
        {
          id: 'enterprise-journey',
          name: 'Enterprise Customer Journey',
          description: 'Complete journey for enterprise customers from awareness to advocacy',
          customerSegment: 'Enterprise',
          stages: ['awareness', 'consideration', 'purchase'],
          status: 'active',
          lastUpdated: new Date().toISOString(),
          completionRate: 24.7
        },
        {
          id: 'smb-journey',
          name: 'SMB Customer Journey',
          description: 'Streamlined journey for small-medium business customers',
          customerSegment: 'SMB',
          stages: ['awareness', 'consideration', 'purchase'],
          status: 'active',
          lastUpdated: new Date().toISOString(),
          completionRate: 41.2
        }
      ]);

      setLoading(false);
    }, 1500);
  };

  const createJourney = () => {
    const newJourney: CustomerJourney = {
      id: `journey-${Date.now()}`,
      ...journeyForm,
      status: 'draft',
      lastUpdated: new Date().toISOString(),
      completionRate: 0
    };

    setJourneys(prev => [...prev, newJourney]);
    setShowJourneyModal(false);
    setJourneyForm({
      name: '',
      description: '',
      customerSegment: 'Enterprise',
      stages: []
    });
  };

  const kpiData = [
    {
      title: 'Active Journeys',
      value: journeys.filter(j => j.status === 'active').length.toString(),
      change: 12.5,
      format: 'number' as const
    },
    {
      title: 'Avg Completion Rate',
      value: `${(journeys.reduce((sum, j) => sum + j.completionRate, 0) / journeys.length).toFixed(1)}%`,
      change: 8.3,
      format: 'percentage' as const
    },
    {
      title: 'Total Touchpoints',
      value: stages.reduce((sum, s) => sum + s.touchpoints.length, 0).toString(),
      change: 15.2,
      format: 'number' as const
    },
    {
      title: 'Optimization Score',
      value: '78.5',
      change: 5.7,
      format: 'number' as const
    }
  ];

  const journeyHeaders = [
    { key: 'name', header: 'Journey Name' },
    { key: 'segment', header: 'Customer Segment' },
    { key: 'stages', header: 'Stages' },
    { key: 'completion', header: 'Completion Rate' },
    { key: 'status', header: 'Status' },
    { key: 'actions', header: 'Actions' }
  ];

  const journeyRows = journeys.map(journey => ({
    id: journey.id,
    name: journey.name,
    segment: journey.customerSegment,
    stages: journey.stages.length.toString(),
    completion: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <ProgressBar value={journey.completionRate} size="sm" />
        <span style={{ fontSize: '0.75rem' }}>{journey.completionRate}%</span>
      </div>
    ),
    status: (
      <Tag type={
        journey.status === 'active' ? 'green' :
        journey.status === 'draft' ? 'blue' : 'red'
      }>
        {journey.status.toUpperCase()}
      </Tag>
    ),
    actions: (
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <Button size="sm" kind="primary" renderIcon={View}>
          View
        </Button>
        <Button size="sm" kind="secondary" renderIcon={Edit}>
          Edit
        </Button>
      </div>
    )
  }));

  const stageHeaders = [
    { key: 'name', header: 'Stage' },
    { key: 'touchpoints', header: 'Touchpoints' },
    { key: 'conversion', header: 'Conversion Rate' },
    { key: 'satisfaction', header: 'Satisfaction' },
    { key: 'dropoff', header: 'Drop-off Rate' },
    { key: 'actions', header: 'Actions' }
  ];

  const stageRows = stages.map(stage => ({
    id: stage.id,
    name: stage.name,
    touchpoints: stage.touchpoints.join(', '),
    conversion: `${stage.metrics.conversionRate}%`,
    satisfaction: `${stage.metrics.satisfactionScore}/5`,
    dropoff: `${stage.metrics.dropoffRate}%`,
    actions: (
      <Button size="sm" kind="ghost" renderIcon={Analytics}>
        Analyze
      </Button>
    )
  }));

  if (loading) {
    return (
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{ flex: 1, padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Loading description="Loading customer journey data..." />
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
            <Map size={32} />
            Customer Journey Mapping
          </h1>
          <p style={{ color: 'var(--cds-text-02)', marginBottom: '1rem' }}>
            Visualize and optimize customer journeys across all touchpoints and stages
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Button 
              kind="primary" 
              renderIcon={Add}
              onClick={() => setShowJourneyModal(true)}
            >
              Create Journey
            </Button>
            
            <Button kind="secondary" renderIcon={Analytics}>
              Journey Analytics
            </Button>
            
            <Button kind="tertiary" renderIcon={CustomerService}>
              Touchpoint Analysis
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
                <TabList ariaLabel="Customer Journey Tabs">
                  <Tab>Customer Journeys</Tab>
                  <Tab>Journey Stages</Tab>
                  <Tab>Touchpoint Analysis</Tab>
                  <Tab>Optimization</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <div style={{ padding: '1rem 0' }}>
                      <h3 style={{ marginBottom: '1rem' }}>Customer Journeys</h3>
                      <DataTable 
                        rows={journeyRows} 
                        headers={journeyHeaders}
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
                      <h3 style={{ marginBottom: '1rem' }}>Journey Stages</h3>
                      <DataTable 
                        rows={stageRows} 
                        headers={stageHeaders}
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
                      <h3 style={{ marginBottom: '1rem' }}>Touchpoint Analysis</h3>
                      <p style={{ color: 'var(--cds-text-02)' }}>
                        Detailed analysis of customer touchpoints and their effectiveness
                      </p>
                    </div>
                  </TabPanel>
                  
                  <TabPanel>
                    <div style={{ padding: '1rem 0' }}>
                      <h3 style={{ marginBottom: '1rem' }}>Journey Optimization</h3>
                      <p style={{ color: 'var(--cds-text-02)' }}>
                        AI-powered recommendations for improving customer journey performance
                      </p>
                    </div>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Tile>
          </Column>
        </Grid>

        <Modal
          open={showJourneyModal}
          onRequestClose={() => setShowJourneyModal(false)}
          modalHeading="Create New Customer Journey"
          primaryButtonText="Create Journey"
          secondaryButtonText="Cancel"
          onRequestSubmit={createJourney}
        >
          <div style={{ display: 'grid', gap: '1rem' }}>
            <TextInput
              id="journey-name"
              labelText="Journey Name"
              value={journeyForm.name}
              onChange={(e) => setJourneyForm(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter journey name"
            />
            
            <TextArea
              id="journey-description"
              labelText="Description"
              value={journeyForm.description}
              onChange={(e) => setJourneyForm(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the customer journey"
              rows={3}
            />
            
            <Select
              id="customer-segment"
              labelText="Customer Segment"
              value={journeyForm.customerSegment}
              onChange={(e) => setJourneyForm(prev => ({ ...prev, customerSegment: e.target.value }))}
            >
              <SelectItem value="Enterprise" text="Enterprise" />
              <SelectItem value="SMB" text="Small-Medium Business" />
              <SelectItem value="Consumer" text="Consumer" />
            </Select>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default CustomerJourneyMapping;