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
  Tag,
  ProgressBar
} from '@carbon/react';
import {
  Partnership,
  Analytics,
  TrendUp,
  TrendDown,
  Trophy,
  Warning,
  View,
  Add
} from '@carbon/icons-react';
import Sidebar from '../../components/Sidebar';
import KPIWidget from '../../components/KPIWidget';

interface Supplier {
  id: string;
  name: string;
  category: string;
  performanceScore: number;
  deliveryPerformance: number;
  qualityScore: number;
  costScore: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  contractValue: number;
  lastEvaluation: string;
  status: 'Active' | 'Under Review' | 'Suspended';
}

const SupplierPerformanceScorecard: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedRisk, setSelectedRisk] = useState('All');

  useEffect(() => {
    loadSupplierData();
  }, []);

  const loadSupplierData = () => {
    setTimeout(() => {
      setSuppliers([
        {
          id: 'sup-1',
          name: 'Global Components Inc',
          category: 'Electronics',
          performanceScore: 87.5,
          deliveryPerformance: 92.1,
          qualityScore: 89.3,
          costScore: 81.2,
          riskLevel: 'Low',
          contractValue: 2500000,
          lastEvaluation: '2024-01-15',
          status: 'Active'
        },
        {
          id: 'sup-2',
          name: 'Materials Plus LLC',
          category: 'Raw Materials',
          performanceScore: 73.8,
          deliveryPerformance: 78.5,
          qualityScore: 85.2,
          costScore: 58.1,
          riskLevel: 'Medium',
          contractValue: 1800000,
          lastEvaluation: '2024-01-10',
          status: 'Under Review'
        },
        {
          id: 'sup-3',
          name: 'Precision Parts Co',
          category: 'Manufacturing',
          performanceScore: 94.2,
          deliveryPerformance: 96.8,
          qualityScore: 93.5,
          costScore: 92.3,
          riskLevel: 'Low',
          contractValue: 3200000,
          lastEvaluation: '2024-01-12',
          status: 'Active'
        },
        {
          id: 'sup-4',
          name: 'Logistics Express',
          category: 'Transportation',
          performanceScore: 65.4,
          deliveryPerformance: 62.3,
          qualityScore: 71.2,
          costScore: 63.7,
          riskLevel: 'High',
          contractValue: 950000,
          lastEvaluation: '2024-01-08',
          status: 'Suspended'
        }
      ]);
      setLoading(false);
    }, 1500);
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'var(--cds-support-02)';
    if (score >= 75) return 'var(--cds-support-03)';
    if (score >= 60) return 'var(--cds-support-04)';
    return 'var(--cds-support-01)';
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'High': return <Warning size={16} style={{ color: 'var(--cds-support-01)' }} />;
      case 'Medium': return <Warning size={16} style={{ color: 'var(--cds-support-03)' }} />;
      default: return <Trophy size={16} style={{ color: 'var(--cds-support-02)' }} />;
    }
  };

  const filteredSuppliers = suppliers.filter(supplier => {
    if (selectedCategory !== 'All' && supplier.category !== selectedCategory) return false;
    if (selectedRisk !== 'All' && supplier.riskLevel !== selectedRisk) return false;
    return true;
  });

  const kpiData = [
    {
      title: 'Active Suppliers',
      value: suppliers.filter(s => s.status === 'Active').length.toString(),
      change: 8.3,
      format: 'number' as const
    },
    {
      title: 'Avg Performance',
      value: `${(suppliers.reduce((sum, s) => sum + s.performanceScore, 0) / suppliers.length).toFixed(1)}%`,
      change: 12.5,
      format: 'percentage' as const
    },
    {
      title: 'High Risk Suppliers',
      value: suppliers.filter(s => s.riskLevel === 'High').length.toString(),
      change: -15.2,
      format: 'number' as const
    },
    {
      title: 'Contract Value',
      value: `$${(suppliers.reduce((sum, s) => sum + s.contractValue, 0) / 1000000).toFixed(1)}M`,
      change: 18.7,
      format: 'currency' as const
    }
  ];

  const headers = [
    { key: 'name', header: 'Supplier' },
    { key: 'category', header: 'Category' },
    { key: 'performance', header: 'Performance Score' },
    { key: 'delivery', header: 'Delivery' },
    { key: 'quality', header: 'Quality' },
    { key: 'cost', header: 'Cost' },
    { key: 'risk', header: 'Risk Level' },
    { key: 'status', header: 'Status' },
    { key: 'actions', header: 'Actions' }
  ];

  const rows = filteredSuppliers.map(supplier => ({
    id: supplier.id,
    name: supplier.name,
    category: supplier.category,
    performance: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <ProgressBar value={supplier.performanceScore} size="sm" />
        <span style={{ 
          fontSize: '0.75rem',
          color: getPerformanceColor(supplier.performanceScore)
        }}>
          {supplier.performanceScore.toFixed(1)}%
        </span>
      </div>
    ),
    delivery: `${supplier.deliveryPerformance.toFixed(1)}%`,
    quality: `${supplier.qualityScore.toFixed(1)}%`,
    cost: `${supplier.costScore.toFixed(1)}%`,
    risk: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {getRiskIcon(supplier.riskLevel)}
        <Tag type={
          supplier.riskLevel === 'Low' ? 'green' :
          supplier.riskLevel === 'Medium' ? 'yellow' : 'red'
        }>
          {supplier.riskLevel}
        </Tag>
      </div>
    ),
    status: (
      <Tag type={
        supplier.status === 'Active' ? 'green' :
        supplier.status === 'Under Review' ? 'blue' : 'red'
      }>
        {supplier.status}
      </Tag>
    ),
    actions: (
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <Button size="sm" kind="primary" renderIcon={View}>
          View
        </Button>
        <Button size="sm" kind="secondary" renderIcon={Analytics}>
          Analyze
        </Button>
      </div>
    )
  }));

  if (loading) {
    return (
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{ flex: 1, padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Loading description="Loading supplier data..." />
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
            <Partnership size={32} />
            Supplier Performance Scorecard
          </h1>
          <p style={{ color: 'var(--cds-text-02)', marginBottom: '1rem' }}>
            Monitor and evaluate supplier performance across key metrics and risk factors
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Select
              id="category-filter"
              labelText=""
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              size="sm"
            >
              <SelectItem value="All" text="All Categories" />
              <SelectItem value="Electronics" text="Electronics" />
              <SelectItem value="Raw Materials" text="Raw Materials" />
              <SelectItem value="Manufacturing" text="Manufacturing" />
              <SelectItem value="Transportation" text="Transportation" />
            </Select>
            
            <Select
              id="risk-filter"
              labelText=""
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              size="sm"
            >
              <SelectItem value="All" text="All Risk Levels" />
              <SelectItem value="Low" text="Low Risk" />
              <SelectItem value="Medium" text="Medium Risk" />
              <SelectItem value="High" text="High Risk" />
            </Select>
            
            <Button kind="primary" renderIcon={Add}>
              Add Supplier
            </Button>
            
            <Button kind="secondary" renderIcon={Analytics}>
              Performance Report
            </Button>
            
            <Button kind="tertiary" renderIcon={TrendUp}>
              Benchmarking
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
              <h3 style={{ 
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Partnership size={20} />
                Supplier Performance Dashboard
              </h3>
              
              <DataTable 
                rows={rows} 
                headers={headers}
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

export default SupplierPerformanceScorecard;