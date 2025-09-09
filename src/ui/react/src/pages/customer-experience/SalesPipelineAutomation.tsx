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
  NumberInput,
  ProgressBar,
  Tag
} from '@carbon/react';
import {
  Pipeline,
  Analytics,
  Add,
  Edit,
  View,
  Money,
  Time,
  User
} from '@carbon/icons-react';
import Sidebar from '../../components/Sidebar';
import KPIWidget from '../../components/KPIWidget';

interface PipelineStage {
  id: string;
  name: string;
  order: number;
  conversionRate: number;
  averageTime: number;
  automationRules: string[];
}

interface SalesOpportunity {
  id: string;
  title: string;
  company: string;
  value: number;
  stage: string;
  probability: number;
  closeDate: string;
  owner: string;
  lastActivity: string;
  temperature: 'hot' | 'warm' | 'cold';
}

interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  action: string;
  stage: string;
  isActive: boolean;
}

const SalesPipelineAutomation: React.FC = () => {
  const [opportunities, setOpportunities] = useState<SalesOpportunity[]>([]);
  const [stages, setStages] = useState<PipelineStage[]>([]);
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOpportunityModal, setShowOpportunityModal] = useState(false);
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [selectedStage, setSelectedStage] = useState('All');

  const [opportunityForm, setOpportunityForm] = useState({
    title: '',
    company: '',
    value: 0,
    stage: 'lead',
    probability: 0,
    closeDate: '',
    owner: 'Current User'
  });

  const [ruleForm, setRuleForm] = useState({
    name: '',
    trigger: 'stage_change',
    action: 'send_email',
    stage: 'lead'
  });

  useEffect(() => {
    loadPipelineData();
  }, []);

  const loadPipelineData = () => {
    setTimeout(() => {
      setStages([
        {
          id: 'lead',
          name: 'Lead',
          order: 1,
          conversionRate: 15.2,
          averageTime: 3.5,
          automationRules: ['lead_scoring', 'welcome_email']
        },
        {
          id: 'qualified',
          name: 'Qualified',
          order: 2,
          conversionRate: 42.8,
          averageTime: 7.2,
          automationRules: ['demo_scheduling', 'follow_up_sequence']
        },
        {
          id: 'proposal',
          name: 'Proposal',
          order: 3,
          conversionRate: 68.5,
          averageTime: 12.3,
          automationRules: ['proposal_generation', 'stakeholder_alerts']
        },
        {
          id: 'negotiation',
          name: 'Negotiation',
          order: 4,
          conversionRate: 78.9,
          averageTime: 8.7,
          automationRules: ['approval_workflow', 'contract_generation']
        },
        {
          id: 'closed',
          name: 'Closed Won',
          order: 5,
          conversionRate: 100,
          averageTime: 0,
          automationRules: ['onboarding_kickoff', 'success_team_handoff']
        }
      ]);

      setOpportunities([
        {
          id: 'opp-1',
          title: 'Enterprise Software License',
          company: 'Acme Corporation',
          value: 250000,
          stage: 'proposal',
          probability: 75,
          closeDate: '2024-03-15',
          owner: 'John Smith',
          lastActivity: new Date().toISOString(),
          temperature: 'hot'
        },
        {
          id: 'opp-2',
          title: 'Cloud Infrastructure Migration',
          company: 'TechStart Inc',
          value: 125000,
          stage: 'qualified',
          probability: 45,
          closeDate: '2024-04-01',
          owner: 'Sarah Johnson',
          lastActivity: new Date().toISOString(),
          temperature: 'warm'
        },
        {
          id: 'opp-3',
          title: 'Digital Transformation Project',
          company: 'Global Industries',
          value: 500000,
          stage: 'negotiation',
          probability: 85,
          closeDate: '2024-02-28',
          owner: 'Mike Davis',
          lastActivity: new Date().toISOString(),
          temperature: 'hot'
        }
      ]);

      setAutomationRules([
        {
          id: 'rule-1',
          name: 'Lead Scoring Automation',
          trigger: 'new_lead_created',
          action: 'calculate_lead_score',
          stage: 'lead',
          isActive: true
        },
        {
          id: 'rule-2',
          name: 'Demo Follow-up',
          trigger: 'demo_completed',
          action: 'schedule_follow_up',
          stage: 'qualified',
          isActive: true
        },
        {
          id: 'rule-3',
          name: 'Proposal Reminder',
          trigger: 'proposal_sent_7_days_ago',
          action: 'send_reminder_email',
          stage: 'proposal',
          isActive: false
        }
      ]);

      setLoading(false);
    }, 1500);
  };

  const createOpportunity = () => {
    const newOpportunity: SalesOpportunity = {
      id: `opp-${Date.now()}`,
      ...opportunityForm,
      lastActivity: new Date().toISOString(),
      temperature: 'warm'
    };

    setOpportunities(prev => [...prev, newOpportunity]);
    setShowOpportunityModal(false);
    setOpportunityForm({
      title: '',
      company: '',
      value: 0,
      stage: 'lead',
      probability: 0,
      closeDate: '',
      owner: 'Current User'
    });
  };

  const createAutomationRule = () => {
    const newRule: AutomationRule = {
      id: `rule-${Date.now()}`,
      ...ruleForm,
      isActive: true
    };

    setAutomationRules(prev => [...prev, newRule]);
    setShowRuleModal(false);
    setRuleForm({
      name: '',
      trigger: 'stage_change',
      action: 'send_email',
      stage: 'lead'
    });
  };

  const getTemperatureColor = (temperature: string) => {
    switch (temperature) {
      case 'hot': return 'var(--cds-support-01)';
      case 'warm': return 'var(--cds-support-03)';
      case 'cold': return 'var(--cds-interactive-04)';
      default: return 'var(--cds-text-02)';
    }
  };

  const filteredOpportunities = selectedStage === 'All' 
    ? opportunities 
    : opportunities.filter(opp => opp.stage === selectedStage);

  const kpiData = [
    {
      title: 'Total Pipeline Value',
      value: `$${opportunities.reduce((sum, opp) => sum + opp.value, 0).toLocaleString()}`,
      change: 18.5,
      format: 'currency' as const
    },
    {
      title: 'Active Opportunities',
      value: opportunities.length.toString(),
      change: 12.3,
      format: 'number' as const
    },
    {
      title: 'Avg Deal Size',
      value: `$${Math.round(opportunities.reduce((sum, opp) => sum + opp.value, 0) / opportunities.length).toLocaleString()}`,
      change: 8.7,
      format: 'currency' as const
    },
    {
      title: 'Automation Rules',
      value: automationRules.filter(rule => rule.isActive).length.toString(),
      change: 25.0,
      format: 'number' as const
    }
  ];

  const opportunityHeaders = [
    { key: 'title', header: 'Opportunity' },
    { key: 'company', header: 'Company' },
    { key: 'value', header: 'Value' },
    { key: 'stage', header: 'Stage' },
    { key: 'probability', header: 'Probability' },
    { key: 'temperature', header: 'Temperature' },
    { key: 'actions', header: 'Actions' }
  ];

  const opportunityRows = filteredOpportunities.map(opp => ({
    id: opp.id,
    title: opp.title,
    company: opp.company,
    value: `$${opp.value.toLocaleString()}`,
    stage: stages.find(s => s.id === opp.stage)?.name || opp.stage,
    probability: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <ProgressBar value={opp.probability} size="sm" />
        <span style={{ fontSize: '0.75rem' }}>{opp.probability}%</span>
      </div>
    ),
    temperature: (
      <Tag style={{ backgroundColor: getTemperatureColor(opp.temperature) }}>
        {opp.temperature.toUpperCase()}
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

  if (loading) {
    return (
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{ flex: 1, padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Loading description="Loading sales pipeline..." />
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
            <Pipeline size={32} />
            Sales Pipeline Automation
          </h1>
          <p style={{ color: 'var(--cds-text-02)', marginBottom: '1rem' }}>
            Automate sales processes and track opportunities through the pipeline
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Button 
              kind="primary" 
              renderIcon={Add}
              onClick={() => setShowOpportunityModal(true)}
            >
              Add Opportunity
            </Button>
            
            <Button 
              kind="secondary" 
              renderIcon={Analytics}
              onClick={() => setShowRuleModal(true)}
            >
              Create Rule
            </Button>
            
            <Select
              id="stage-filter"
              labelText=""
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              size="sm"
            >
              <SelectItem value="All" text="All Stages" />
              {stages.map(stage => (
                <SelectItem key={stage.id} value={stage.id} text={stage.name} />
              ))}
            </Select>
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
          <Column lg={8} md={6} sm={4}>
            <Tile style={{ padding: '1.5rem' }}>
              <h3 style={{ 
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Pipeline size={20} />
                Sales Opportunities
              </h3>
              
              <DataTable 
                rows={opportunityRows} 
                headers={opportunityHeaders}
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

          <Column lg={4} md={2} sm={4}>
            <Tile style={{ padding: '1.5rem', marginBottom: '1rem' }}>
              <h4 style={{ marginBottom: '1rem' }}>Pipeline Stages</h4>
              {stages.map(stage => (
                <div key={stage.id} style={{ 
                  marginBottom: '1rem',
                  padding: '0.75rem',
                  border: '1px solid var(--cds-border-subtle)',
                  borderRadius: '0.25rem'
                }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                    {stage.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--cds-text-02)' }}>
                    Conversion: {stage.conversionRate}%
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--cds-text-02)' }}>
                    Avg Time: {stage.averageTime} days
                  </div>
                </div>
              ))}
            </Tile>
            
            <Tile style={{ padding: '1.5rem' }}>
              <h4 style={{ marginBottom: '1rem' }}>Active Automation</h4>
              <div style={{ fontSize: '0.875rem' }}>
                <div style={{ marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--cds-support-02)' }}>●</span> Lead Scoring: Active
                </div>
                <div style={{ marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--cds-support-02)' }}>●</span> Email Sequences: Running
                </div>
                <div>
                  <span style={{ color: 'var(--cds-support-03)' }}>●</span> Proposal Gen: Enabled
                </div>
              </div>
            </Tile>
          </Column>
        </Grid>

        <Modal
          open={showOpportunityModal}
          onRequestClose={() => setShowOpportunityModal(false)}
          modalHeading="Create New Opportunity"
          primaryButtonText="Create Opportunity"
          secondaryButtonText="Cancel"
          onRequestSubmit={createOpportunity}
        >
          <div style={{ display: 'grid', gap: '1rem' }}>
            <TextInput
              id="opp-title"
              labelText="Opportunity Title"
              value={opportunityForm.title}
              onChange={(e) => setOpportunityForm(prev => ({ ...prev, title: e.target.value }))}
            />
            
            <TextInput
              id="opp-company"
              labelText="Company"
              value={opportunityForm.company}
              onChange={(e) => setOpportunityForm(prev => ({ ...prev, company: e.target.value }))}
            />
            
            <NumberInput
              id="opp-value"
              label="Deal Value ($)"
              value={opportunityForm.value}
              onChange={(e) => setOpportunityForm(prev => ({ ...prev, value: Number(e.target.value) }))}
            />
            
            <Select
              id="opp-stage"
              labelText="Stage"
              value={opportunityForm.stage}
              onChange={(e) => setOpportunityForm(prev => ({ ...prev, stage: e.target.value }))}
            >
              {stages.map(stage => (
                <SelectItem key={stage.id} value={stage.id} text={stage.name} />
              ))}
            </Select>
          </div>
        </Modal>

        <Modal
          open={showRuleModal}
          onRequestClose={() => setShowRuleModal(false)}
          modalHeading="Create Automation Rule"
          primaryButtonText="Create Rule"
          secondaryButtonText="Cancel"
          onRequestSubmit={createAutomationRule}
        >
          <div style={{ display: 'grid', gap: '1rem' }}>
            <TextInput
              id="rule-name"
              labelText="Rule Name"
              value={ruleForm.name}
              onChange={(e) => setRuleForm(prev => ({ ...prev, name: e.target.value }))}
            />
            
            <Select
              id="rule-trigger"
              labelText="Trigger"
              value={ruleForm.trigger}
              onChange={(e) => setRuleForm(prev => ({ ...prev, trigger: e.target.value }))}
            >
              <SelectItem value="stage_change" text="Stage Change" />
              <SelectItem value="time_based" text="Time Based" />
              <SelectItem value="activity_completed" text="Activity Completed" />
            </Select>
            
            <Select
              id="rule-action"
              labelText="Action"
              value={ruleForm.action}
              onChange={(e) => setRuleForm(prev => ({ ...prev, action: e.target.value }))}
            >
              <SelectItem value="send_email" text="Send Email" />
              <SelectItem value="create_task" text="Create Task" />
              <SelectItem value="update_field" text="Update Field" />
            </Select>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default SalesPipelineAutomation;