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
  InventoryManagement,
  Analytics,
  ArrowUp,
  Add,
  View,
  Settings
} from '@carbon/icons-react';
import Sidebar from '../../components/Sidebar';
import KPIWidget from '../../components/KPIWidget';

interface InventoryItem {
  id: string;
  product: string;
  category: string;
  currentStock: number;
  optimalStock: number;
  reorderPoint: number;
  leadTime: number;
  turnoverRate: number;
  cost: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Overstock';
}

const InventoryOptimizationHub: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInventoryData();
  }, []);

  const loadInventoryData = () => {
    setTimeout(() => {
      setInventory([
        {
          id: 'inv-1',
          product: 'Laptop Model X',
          category: 'Electronics',
          currentStock: 245,
          optimalStock: 300,
          reorderPoint: 150,
          leadTime: 14,
          turnoverRate: 8.5,
          cost: 125000,
          status: 'Low Stock'
        },
        {
          id: 'inv-2',
          product: 'Office Chairs',
          category: 'Furniture',
          currentStock: 450,
          optimalStock: 400,
          reorderPoint: 200,
          leadTime: 21,
          turnoverRate: 6.2,
          cost: 85000,
          status: 'Overstock'
        }
      ]);
      setLoading(false);
    }, 1500);
  };

  const getStockLevel = (current: number, optimal: number) => {
    return (current / optimal) * 100;
  };

  const kpiData = [
    {
      title: 'Total SKUs',
      value: inventory.length.toString(),
      change: 12.5,
      format: 'number' as const
    },
    {
      title: 'Inventory Value',
      value: `$${(inventory.reduce((sum, i) => sum + i.cost, 0) / 1000).toFixed(0)}K`,
      change: 8.7,
      format: 'currency' as const
    },
    {
      title: 'Avg Turnover',
      value: `${(inventory.reduce((sum, i) => sum + i.turnoverRate, 0) / inventory.length).toFixed(1)}x`,
      change: 15.2,
      format: 'number' as const
    },
    {
      title: 'Stock Accuracy',
      value: '96.8%',
      change: 5.7,
      format: 'percentage' as const
    }
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{ flex: 1, padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Loading description="Loading inventory data..." />
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
            <InventoryManagement size={32} />
            Inventory Optimization Hub
          </h1>
          <p style={{ color: 'var(--cds-text-02)', marginBottom: '1rem' }}>
            Optimize inventory levels, reduce carrying costs, and improve turnover rates
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Button kind="primary" renderIcon={Add}>
              Add Item
            </Button>
            <Button kind="secondary" renderIcon={Analytics}>
              Optimization Report
            </Button>
            <Button kind="tertiary" renderIcon={Settings}>
              Reorder Rules
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
              <h3 style={{ marginBottom: '1rem' }}>Inventory Optimization</h3>
              <DataTable 
                rows={inventory.map(item => ({
                  id: item.id,
                  product: item.product,
                  category: item.category,
                  stock: `${item.currentStock}`,
                  optimal: `${item.optimalStock}`,
                  level: (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <ProgressBar value={getStockLevel(item.currentStock, item.optimalStock)} size="sm" />
                      <span style={{ fontSize: '0.75rem' }}>{getStockLevel(item.currentStock, item.optimalStock).toFixed(0)}%</span>
                    </div>
                  ),
                  turnover: `${item.turnoverRate}x`,
                  status: (
                    <Tag type={
                      item.status === 'In Stock' ? 'green' :
                      item.status === 'Low Stock' ? 'yellow' :
                      item.status === 'Out of Stock' ? 'red' : 'blue'
                    }>
                      {item.status}
                    </Tag>
                  ),
                  actions: (
                    <Button size="sm" kind="ghost" renderIcon={View}>
                      View Details
                    </Button>
                  )
                }))} 
                headers={[
                  { key: 'product', header: 'Product' },
                  { key: 'category', header: 'Category' },
                  { key: 'stock', header: 'Current Stock' },
                  { key: 'optimal', header: 'Optimal' },
                  { key: 'level', header: 'Stock ChartLine' },
                  { key: 'turnover', header: 'Turnover' },
                  { key: 'status', header: 'Status' },
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

export default InventoryOptimizationHub;