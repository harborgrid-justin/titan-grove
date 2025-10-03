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
  NumberInput,
  Select,
  SelectItem,
  Tag,
  Checkbox
} from '@carbon/react';
import {
  Money,
  ArrowUp,
  Analytics,
  Add,
  Edit,
  Settings,
  Calculator
} from '@carbon/icons-react';
import Sidebar from '../../components/Sidebar';
import KPIWidget from '../../components/KPIWidget';

interface PricingRule {
  id: string;
  name: string;
  type: 'volume' | 'customer_segment' | 'time_based' | 'competitive';
  basePrice: number;
  adjustmentType: 'percentage' | 'fixed_amount';
  adjustmentValue: number;
  isActive: boolean;
  priority: number;
}

interface Product {
  id: string;
  name: string;
  basePrice: number;
  currentPrice: number;
  category: string;
  margin: number;
  elasticity: number;
  competitorPrice: number;
}

const DynamicPricingEngine: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [pricingRules, setPricingRules] = useState<PricingRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRuleModal, setShowRuleModal] = useState(false);

  const [ruleForm, setRuleForm] = useState({
    name: '',
    type: 'volume',
    basePrice: 0,
    adjustmentType: 'percentage',
    adjustmentValue: 0,
    priority: 1
  });

  useEffect(() => {
    loadPricingData();
  }, []);

  const loadPricingData = () => {
    setTimeout(() => {
      setProducts([
        {
          id: 'prod-1',
          name: 'Enterprise License',
          basePrice: 10000,
          currentPrice: 8500,
          category: 'Software',
          margin: 0.65,
          elasticity: -1.2,
          competitorPrice: 9200
        },
        {
          id: 'prod-2',
          name: 'Professional Services',
          basePrice: 1500,
          currentPrice: 1350,
          category: 'Services',
          margin: 0.45,
          elasticity: -0.8,
          competitorPrice: 1600
        }
      ]);

      setPricingRules([
        {
          id: 'rule-1',
          name: 'Volume Discount',
          type: 'volume',
          basePrice: 10000,
          adjustmentType: 'percentage',
          adjustmentValue: -15,
          isActive: true,
          priority: 1
        },
        {
          id: 'rule-2',
          name: 'Enterprise Customer Premium',
          type: 'customer_segment',
          basePrice: 1500,
          adjustmentType: 'percentage',
          adjustmentValue: 10,
          isActive: true,
          priority: 2
        }
      ]);

      setLoading(false);
    }, 1500);
  };

  const kpiData = [
    {
      title: 'Currency Impact',
      value: '$125,000',
      change: 18.5,
      format: 'currency' as const
    },
    {
      title: 'Active Rules',
      value: pricingRules.filter(r => r.isActive).length.toString(),
      change: 12.3,
      format: 'number' as const
    },
    {
      title: 'Avg Margin',
      value: `${(products.reduce((sum, p) => sum + p.margin, 0) / products.length * 100).toFixed(1)}%`,
      change: 8.7,
      format: 'percentage' as const
    },
    {
      title: 'Currency Optimization',
      value: '87.2%',
      change: 15.2,
      format: 'percentage' as const
    }
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{ flex: 1, padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Loading description="Loading pricing engine..." />
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
            <Money size={32} />
            Dynamic Pricing Engine
          </h1>
          <p style={{ color: 'var(--cds-text-02)', marginBottom: '1rem' }}>
            AI-powered pricing optimization with real-time market analysis
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Button kind="primary" renderIcon={Add} onClick={() => setShowRuleModal(true)}>
              Add Pricing Rule
            </Button>
            <Button kind="secondary" renderIcon={Calculator}>
              Currency Calculator
            </Button>
            <Button kind="tertiary" renderIcon={Analytics}>
              ChartLineData Analysis
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
              <h3 style={{ marginBottom: '1rem' }}>Product Pricing Dashboard</h3>
              <DataTable 
                rows={products.map(product => ({
                  id: product.id,
                  name: product.name,
                  basePrice: `$${product.basePrice.toLocaleString()}`,
                  currentPrice: `$${product.currentPrice.toLocaleString()}`,
                  margin: `${(product.margin * 100).toFixed(1)}%`,
                  competitive: product.currentPrice < product.competitorPrice ? 'ChartNetwork' : 'Premium'
                }))} 
                headers={[
                  { key: 'name', header: 'Product' },
                  { key: 'basePrice', header: 'Base Currency' },
                  { key: 'currentPrice', header: 'Current Currency' },
                  { key: 'margin', header: 'Margin' },
                  { key: 'competitive', header: 'Position' }
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

export default DynamicPricingEngine;