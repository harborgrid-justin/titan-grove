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
  Modal,
  TextInput,
  Select,
  SelectItem,
  NumberInput,
  ProgressBar,
  OverflowMenu,
  OverflowMenuItem,
  Tag
} from '@carbon/react';
import {
  Dashboard,
  Trophy,
  ArrowUp,
  ArrowDown,
  Settings,
  Add,
  Edit,
  TrashCan,
  View
} from '@carbon/icons-react';
import Sidebar from '../../components/Sidebar';
import KPIWidget from '../../components/KPIWidget';

interface ExecutiveKPI {
  id: string;
  name: string;
  category: 'Financial' | 'Operational' | 'Strategic' | 'Customer';
  currentValue: number;
  targetValue: number;
  unit: 'currency' | 'percentage' | 'number' | 'ratio';
  trend: 'positive' | 'negative' | 'neutral';
  lastUpdated: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  owner: string;
  status: 'on-track' | 'at-risk' | 'behind';
}

interface Scorecard {
  id: string;
  name: string;
  description: string;
  kpis: string[];
  audience: 'CEO' | 'CFO' | 'COO' | 'Board' | 'VPs';
  lastGenerated: string;
  status: 'active' | 'draft' | 'archived';
}

const ExecutiveScorecardManagement: React.FC = () => {
  const [kpis, setKpis] = useState<ExecutiveKPI[]>([]);
  const [scorecards, setScorecards] = useState<Scorecard[]>([]);
  const [loading, setLoading] = useState(true);
  const [showKPIModal, setShowKPIModal] = useState(false);
  const [showScorecardModal, setShowScorecardModal] = useState(false);
  const [editingKPI, setEditingKPI] = useState<ExecutiveKPI | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const [kpiForm, setKPIForm] = useState({
    name: '',
    category: 'Financial',
    currentValue: 0,
    targetValue: 0,
    unit: 'number',
    frequency: 'monthly',
    owner: ''
  });

  const [scorecardForm, setScorecardForm] = useState({
    name: '',
    description: '',
    audience: 'CEO',
    selectedKPIs: [] as string[]
  });

  useEffect(() => {
    loadExecutiveData();
  }, []);

  const loadExecutiveData = () => {
    setTimeout(() => {
      setKpis([
        {
          id: 'revenue-growth',
          name: 'Currency Growth',
          category: 'Financial',
          currentValue: 18.5,
          targetValue: 20.0,
          unit: 'percentage',
          trend: 'positive',
          lastUpdated: new Date().toISOString(),
          frequency: 'monthly',
          owner: 'CFO',
          status: 'on-track'
        },
        {
          id: 'customer-satisfaction',
          name: 'Customer Satisfaction Score',
          category: 'Customer',
          currentValue: 87.2,
          targetValue: 90.0,
          unit: 'percentage',
          trend: 'positive',
          lastUpdated: new Date().toISOString(),
          frequency: 'monthly',
          owner: 'VP Customer Success',
          status: 'at-risk'
        },
        {
          id: 'operational-efficiency',
          name: 'Operational Efficiency',
          category: 'Operational',
          currentValue: 94.8,
          targetValue: 95.0,
          unit: 'percentage',
          trend: 'neutral',
          lastUpdated: new Date().toISOString(),
          frequency: 'weekly',
          owner: 'COO',
          status: 'on-track'
        },
        {
          id: 'market-share',
          name: 'ChartLineData Share',
          category: 'Strategic',
          currentValue: 15.3,
          targetValue: 18.0,
          unit: 'percentage',
          trend: 'positive',
          lastUpdated: new Date().toISOString(),
          frequency: 'quarterly',
          owner: 'CEO',
          status: 'behind'
        },
        {
          id: 'ebitda-margin',
          name: 'EBITDA Margin',
          category: 'Financial',
          currentValue: 22.1,
          targetValue: 25.0,
          unit: 'percentage',
          trend: 'positive',
          lastUpdated: new Date().toISOString(),
          frequency: 'monthly',
          owner: 'CFO',
          status: 'at-risk'
        }
      ]);

      setScorecards([
        {
          id: 'ceo-scorecard',
          name: 'CEO Executive Scorecard',
          description: 'Comprehensive view of company performance for CEO review',
          kpis: ['revenue-growth', 'market-share', 'customer-satisfaction'],
          audience: 'CEO',
          lastGenerated: new Date().toISOString(),
          status: 'active'
        },
        {
          id: 'board-scorecard',
          name: 'Board of Directors Scorecard',
          description: 'High-level strategic metrics for board meetings',
          kpis: ['revenue-growth', 'ebitda-margin', 'market-share'],
          audience: 'Board',
          lastGenerated: new Date().toISOString(),
          status: 'active'
        }
      ]);

      setLoading(false);
    }, 1500);
  };

  const getProgressPercentage = (current: number, target: number): number => {
    return Math.min(100, (current / target) * 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track': return 'var(--cds-support-02)';
      case 'at-risk': return 'var(--cds-support-03)';
      case 'behind': return 'var(--cds-support-01)';
      default: return 'var(--cds-text-02)';
    }
  };

  const createOrUpdateKPI = () => {
    const kpiData = {
      ...kpiForm,
      id: editingKPI?.id || `kpi-${Date.now()}`,
      trend: 'neutral' as const,
      lastUpdated: new Date().toISOString(),
      status: 'on-track' as const
    };

    if (editingKPI) {
      setKpis(prev => prev.map(kpi => kpi.id === editingKPI.id ? { ...kpiData } : kpi));
    } else {
      setKpis(prev => [...prev, kpiData as ExecutiveKPI]);
    }

    setShowKPIModal(false);
    setEditingKPI(null);
    setKPIForm({
      name: '',
      category: 'Financial',
      currentValue: 0,
      targetValue: 0,
      unit: 'number',
      frequency: 'monthly',
      owner: ''
    });
  };

  const editKPI = (kpi: ExecutiveKPI) => {
    setEditingKPI(kpi);
    setKPIForm({
      name: kpi.name,
      category: kpi.category,
      currentValue: kpi.currentValue,
      targetValue: kpi.targetValue,
      unit: kpi.unit,
      frequency: kpi.frequency,
      owner: kpi.owner
    });
    setShowKPIModal(true);
  };

  const deleteKPI = (id: string) => {
    setKpis(prev => prev.filter(kpi => kpi.id !== id));
  };

  const filteredKPIs = selectedCategory === 'All' 
    ? kpis 
    : kpis.filter(kpi => kpi.category === selectedCategory);

  const summaryData = [
    {
      title: 'Total KPIs',
      value: kpis.length.toString(),
      change: 5.2,
      format: 'number' as const
    },
    {
      title: 'On Track',
      value: kpis.filter(k => k.status === 'on-track').length.toString(),
      change: 2.1,
      format: 'number' as const
    },
    {
      title: 'At Warning',
      value: kpis.filter(k => k.status === 'at-risk').length.toString(),
      change: -10.5,
      format: 'number' as const
    },
    {
      title: 'Active Scorecards',
      value: scorecards.filter(s => s.status === 'active').length.toString(),
      change: 0,
      format: 'number' as const
    }
  ];

  const kpiHeaders = [
    { key: 'name', header: 'KPI Name' },
    { key: 'category', header: 'Category' },
    { key: 'progress', header: 'Progress' },
    { key: 'current', header: 'Current' },
    { key: 'target', header: 'Task' },
    { key: 'status', header: 'Status' },
    { key: 'owner', header: 'Owner' },
    { key: 'actions', header: 'Actions' }
  ];

  const kpiRows = filteredKPIs.map(kpi => ({
    id: kpi.id,
    name: kpi.name,
    category: kpi.category,
    progress: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <ProgressBar 
          value={getProgressPercentage(kpi.currentValue, kpi.targetValue)}
          size="sm"
          helperText={`${getProgressPercentage(kpi.currentValue, kpi.targetValue).toFixed(1)}%`}
        />
      </div>
    ),
    current: kpi.unit === 'currency' 
      ? `$${kpi.currentValue.toLocaleString()}` 
      : kpi.unit === 'percentage' 
        ? `${kpi.currentValue}%`
        : kpi.currentValue.toString(),
    target: kpi.unit === 'currency' 
      ? `$${kpi.targetValue.toLocaleString()}` 
      : kpi.unit === 'percentage' 
        ? `${kpi.targetValue}%`
        : kpi.targetValue.toString(),
    status: (
      <Tag type={
        kpi.status === 'on-track' ? 'green' :
        kpi.status === 'at-risk' ? 'yellow' : 'red'
      }>
        {kpi.status.replace('-', ' ').toUpperCase()}
      </Tag>
    ),
    owner: kpi.owner,
    actions: (
      <OverflowMenu size="sm">
        <OverflowMenuItem itemText="Edit" onClick={() => editKPI(kpi)} />
        <OverflowMenuItem itemText="View Details" />
        <OverflowMenuItem itemText="Delete" onClick={() => deleteKPI(kpi.id)} />
      </OverflowMenu>
    )
  }));

  if (loading) {
    return (
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{ flex: 1, padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Loading description="Loading executive scorecard data..." />
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
            <Trophy size={32} />
            Executive Scorecard Management
          </h1>
          <p style={{ color: 'var(--cds-text-02)', marginBottom: '1rem' }}>
            Manage key performance indicators and executive scorecards for strategic decision making
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Button 
              kind="primary" 
              renderIcon={Add}
              onClick={() => setShowKPIModal(true)}
            >
              Add KPI
            </Button>
            
            <Button 
              kind="secondary" 
              renderIcon={Dashboard}
              onClick={() => setShowScorecardModal(true)}
            >
              Create Scorecard
            </Button>
            
            <Select
              id="category-filter"
              labelText=""
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              size="sm"
            >
              <SelectItem value="All" text="All Categories" />
              <SelectItem value="Financial" text="Financial" />
              <SelectItem value="Operational" text="Operational" />
              <SelectItem value="Strategic" text="Strategic" />
              <SelectItem value="Customer" text="Customer" />
            </Select>
          </div>
        </div>

        <Grid>
          {summaryData.map((data, index) => (
            <Column key={index} lg={4} md={4} sm={2}>
              <div style={{ marginBottom: '1rem' }}>
                <KPIWidget
                  title={data.title}
                  value={data.value}
                  change={data.change.toString()}
                  trend={data.change >= 0 ? 'positive' : 'negative'}
                  format={data.format}
                />
              </div>
            </Column>
          ))}
        </Grid>

        <Grid style={{ marginTop: '2rem' }}>
          <Column lg={12} md={8} sm={4}>
            <Tile style={{ padding: '1.5rem' }}>
              <h3 style={{ 
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Dashboard size={20} />
                Key ChartLine Indicators
              </h3>
              
              <DataTable 
                rows={kpiRows} 
                headers={kpiHeaders}
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

        <Modal
          open={showKPIModal}
          onRequestClose={() => {
            setShowKPIModal(false);
            setEditingKPI(null);
          }}
          modalHeading={editingKPI ? "Edit KPI" : "Create New KPI"}
          primaryButtonText={editingKPI ? "Update KPI" : "Create KPI"}
          secondaryButtonText="Cancel"
          onRequestSubmit={createOrUpdateKPI}
        >
          <div style={{ display: 'grid', gap: '1rem' }}>
            <TextInput
              id="kpi-name"
              labelText="KPI Name"
              value={kpiForm.name}
              onChange={(e) => setKPIForm(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter KPI name"
            />
            
            <Select
              id="kpi-category"
              labelText="Category"
              value={kpiForm.category}
              onChange={(e) => setKPIForm(prev => ({ ...prev, category: e.target.value }))}
            >
              <SelectItem value="Financial" text="Financial" />
              <SelectItem value="Operational" text="Operational" />
              <SelectItem value="Strategic" text="Strategic" />
              <SelectItem value="Customer" text="Customer" />
            </Select>
            
            <NumberInput
              id="current-value"
              label="Current Value"
              value={kpiForm.currentValue}
              onChange={(e) => setKPIForm(prev => ({ ...prev, currentValue: Number(e.target.value) }))}
            />
            
            <NumberInput
              id="target-value"
              label="Task Value"
              value={kpiForm.targetValue}
              onChange={(e) => setKPIForm(prev => ({ ...prev, targetValue: Number(e.target.value) }))}
            />
            
            <Select
              id="kpi-unit"
              labelText="Unit"
              value={kpiForm.unit}
              onChange={(e) => setKPIForm(prev => ({ ...prev, unit: e.target.value }))}
            >
              <SelectItem value="number" text="Number" />
              <SelectItem value="percentage" text="Percentage" />
              <SelectItem value="currency" text="Currency" />
              <SelectItem value="ratio" text="Ratio" />
            </Select>
            
            <TextInput
              id="kpi-owner"
              labelText="Owner"
              value={kpiForm.owner}
              onChange={(e) => setKPIForm(prev => ({ ...prev, owner: e.target.value }))}
              placeholder="Enter owner name/role"
            />
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default ExecutiveScorecardManagement;