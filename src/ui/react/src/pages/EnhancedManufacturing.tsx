import React, { useState, useEffect } from 'react';
import {
  Grid,
  Column,
  Tile,
  Button,
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
  DatePicker,
  DatePickerInput,
  Tag,
  ProgressBar,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  InlineNotification,
} from '@carbon/react';
import {
  Store as Factory,
  Add,
  Edit,
  View,
  WarningAlt,
  CheckmarkOutline,
  Time,
  Settings,
} from '@carbon/icons-react';

interface ProductionLine {
  id: string;
  name: string;
  product: string;
  capacity: number;
  currentOutput: number;
  efficiency: number;
  status: 'running' | 'maintenance' | 'offline';
  nextMaintenance: Date;
  qualityScore: number;
}

interface WorkOrder {
  id: string;
  productName: string;
  quantity: number;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  assignedLine: string;
  dueDate: Date;
  completedQuantity: number;
  customer: string;
}

interface QualityMetric {
  id: string;
  productLine: string;
  defectRate: number;
  yieldPercentage: number;
  cpkValue: number;
  lastInspection: Date;
  status: 'excellent' | 'good' | 'attention' | 'critical';
}

const EnhancedManufacturing: React.FC = () => {
  const [productionLines, setProductionLines] = useState<ProductionLine[]>([
    {
      id: 'line-001',
      name: 'Assembly Line Alpha',
      product: 'Premium Widget Series',
      capacity: 1000,
      currentOutput: 847,
      efficiency: 94.2,
      status: 'running',
      nextMaintenance: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      qualityScore: 96.8
    },
    {
      id: 'line-002',
      name: 'Assembly Line Beta',
      product: 'Standard Component Kit',
      capacity: 1500,
      currentOutput: 1203,
      efficiency: 87.4,
      status: 'running',
      nextMaintenance: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
      qualityScore: 94.2
    },
    {
      id: 'line-003',
      name: 'Precision Manufacturing',
      product: 'High-Tech Modules',
      capacity: 500,
      currentOutput: 0,
      efficiency: 0,
      status: 'maintenance',
      nextMaintenance: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      qualityScore: 98.5
    }
  ]);

  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([
    {
      id: 'wo-001',
      productName: 'Premium Widget Series',
      quantity: 2500,
      priority: 'high',
      status: 'in-progress',
      assignedLine: 'Assembly Line Alpha',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      completedQuantity: 1847,
      customer: 'TechCorp Industries'
    },
    {
      id: 'wo-002',
      productName: 'Standard Component Kit',
      quantity: 5000,
      priority: 'medium',
      status: 'in-progress',
      assignedLine: 'Assembly Line Beta',
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      completedQuantity: 3203,
      customer: 'Global Manufacturing Co.'
    },
    {
      id: 'wo-003',
      productName: 'High-Tech Modules',
      quantity: 750,
      priority: 'high',
      status: 'pending',
      assignedLine: 'Precision Manufacturing',
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      completedQuantity: 0,
      customer: 'Idea Labs Ltd.'
    }
  ]);

  const [qualityMetrics, setQualityMetrics] = useState<QualityMetric[]>([
    {
      id: 'qm-001',
      productLine: 'Assembly Line Alpha',
      defectRate: 0.8,
      yieldPercentage: 96.8,
      cpkValue: 1.67,
      lastInspection: new Date(),
      status: 'excellent'
    },
    {
      id: 'qm-002',
      productLine: 'Assembly Line Beta',
      defectRate: 1.2,
      yieldPercentage: 94.2,
      cpkValue: 1.33,
      lastInspection: new Date(),
      status: 'good'
    },
    {
      id: 'qm-003',
      productLine: 'Precision Manufacturing',
      defectRate: 0.3,
      yieldPercentage: 98.5,
      cpkValue: 2.1,
      lastInspection: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      status: 'excellent'
    }
  ]);

  const [showWorkOrderModal, setShowWorkOrderModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);

  const getStatusTag = (status: string, type: 'production' | 'work-order' | 'quality' = 'production') => {
    if (type === 'production') {
      const config = {
        running: { type: 'green' as const, text: 'Running' },
        maintenance: { type: 'yellow' as const, text: 'Maintenance' },
        offline: { type: 'red' as const, text: 'Offline' }
      };
      const statusConfig = config[status as keyof typeof config];
      return <Tag type={statusConfig.type} size="sm">{statusConfig.text}</Tag>;
    }
    
    if (type === 'work-order') {
      const config = {
        'pending': { type: 'blue' as const, text: 'Pending' },
        'in-progress': { type: 'cyan' as const, text: 'In Progress' },
        'completed': { type: 'green' as const, text: 'Completed' },
        'cancelled': { type: 'red' as const, text: 'Cancelled' }
      };
      const statusConfig = config[status as keyof typeof config];
      return <Tag type={statusConfig.type} size="sm">{statusConfig.text}</Tag>;
    }

    if (type === 'quality') {
      const config = {
        excellent: { type: 'green' as const, text: 'Excellent' },
        good: { type: 'cyan' as const, text: 'Good' },
        attention: { type: 'yellow' as const, text: 'Needs Attention' },
        critical: { type: 'red' as const, text: 'Critical' }
      };
      const statusConfig = config[status as keyof typeof config];
      return <Tag type={statusConfig.type} size="sm">{statusConfig.text}</Tag>;
    }
  };

  const getPriorityTag = (priority: string) => {
    const config = {
      high: { type: 'red' as const, text: 'High Priority' },
      medium: { type: 'yellow' as const, text: 'Medium Priority' },
      low: { type: 'green' as const, text: 'Low Priority' }
    };
    const priorityConfig = config[priority as keyof typeof config];
    return <Tag type={priorityConfig.type} size="sm">{priorityConfig.text}</Tag>;
  };

  const productionLineHeaders = [
    { key: 'name', header: 'Production Line' },
    { key: 'product', header: 'Current Product' },
    { key: 'output', header: 'Output (Today)' },
    { key: 'efficiency', header: 'Efficiency' },
    { key: 'status', header: 'Status' },
    { key: 'quality', header: 'Quality Score' },
    { key: 'maintenance', header: 'Next Maintenance' },
  ];

  const productionLineRows = productionLines.map(line => ({
    id: line.id,
    name: line.name,
    product: line.product,
    output: `${line.currentOutput} / ${line.capacity}`,
    efficiency: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <ProgressBar 
          value={line.efficiency} 
          max={100}
          size="sm"
          status={line.efficiency > 90 ? 'active' : line.efficiency > 80 ? 'finished' : 'error'}
        />
        <span>{line.efficiency}%</span>
      </div>
    ),
    status: getStatusTag(line.status),
    quality: `${line.qualityScore}%`,
    maintenance: line.nextMaintenance.toLocaleDateString(),
  }));

  const workOrderHeaders = [
    { key: 'id', header: 'Order ID' },
    { key: 'product', header: 'Product' },
    { key: 'customer', header: 'Customer' },
    { key: 'progress', header: 'Progress' },
    { key: 'priority', header: 'Priority' },
    { key: 'status', header: 'Status' },
    { key: 'dueDate', header: 'Due Date' },
  ];

  const workOrderRows = workOrders.map(order => ({
    id: order.id,
    product: order.productName,
    customer: order.customer,
    progress: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <ProgressBar 
          value={(order.completedQuantity / order.quantity) * 100} 
          max={100}
          size="sm"
          status={order.status === 'completed' ? 'finished' : 'active'}
        />
        <span>{Math.round((order.completedQuantity / order.quantity) * 100)}%</span>
      </div>
    ),
    priority: getPriorityTag(order.priority),
    status: getStatusTag(order.status, 'work-order'),
    dueDate: order.dueDate.toLocaleDateString(),
  }));

  const qualityHeaders = [
    { key: 'productLine', header: 'Production Line' },
    { key: 'defectRate', header: 'Defect Rate' },
    { key: 'yieldPercentage', header: 'Yield %' },
    { key: 'cpkValue', header: 'Cpk Value' },
    { key: 'status', header: 'Quality Status' },
    { key: 'lastInspection', header: 'Last Inspection' },
  ];

  const qualityRows = qualityMetrics.map(metric => ({
    id: metric.id,
    productLine: metric.productLine,
    defectRate: `${metric.defectRate}%`,
    yieldPercentage: `${metric.yieldPercentage}%`,
    cpkValue: metric.cpkValue.toString(),
    status: getStatusTag(metric.status, 'quality'),
    lastInspection: metric.lastInspection.toLocaleDateString(),
  }));

  return (
    <div className="enhanced-manufacturing">
      <Grid>
        <Column span={16}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Factory size={32} />
              Manufacturing Operations Center
            </h1>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Button kind="secondary" renderIcon={Settings}>
                Configure Lines
              </Button>
              <Button kind="primary" renderIcon={Add} onClick={() => setShowWorkOrderModal(true)}>
                New Work Order
              </Button>
            </div>
          </div>

          <InlineNotification
            kind="info"
            title="Production Update"
            subtitle="Assembly Line Alpha is running at 94.2% efficiency. Precision Manufacturing is scheduled for maintenance."
            lowContrast
            hideCloseButton
            style={{ marginBottom: '2rem' }}
          />
        </Column>
      </Grid>

      {/* Summary Cards */}
      <Grid>
        <Column sm={4} md={4} lg={4}>
          <Tile style={{ padding: '1.5rem' }}>
            <h4 style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)', margin: '0 0 0.5rem 0' }}>
              Total Daily Output
            </h4>
            <h2 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0' }}>
              2,050
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckmarkOutline size={16} style={{ color: 'var(--cds-support-success)' }} />
              <span style={{ color: 'var(--cds-support-success)', fontSize: '0.875rem' }}>
                +8.4% from yesterday
              </span>
            </div>
          </Tile>
        </Column>
        <Column sm={4} md={4} lg={4}>
          <Tile style={{ padding: '1.5rem' }}>
            <h4 style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)', margin: '0 0 0.5rem 0' }}>
              Overall Equipment Effectiveness
            </h4>
            <h2 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0' }}>
              89.2%
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckmarkOutline size={16} style={{ color: 'var(--cds-support-success)' }} />
              <span style={{ color: 'var(--cds-support-success)', fontSize: '0.875rem' }}>
                Above target (85%)
              </span>
            </div>
          </Tile>
        </Column>
        <Column sm={4} md={4} lg={4}>
          <Tile style={{ padding: '1.5rem' }}>
            <h4 style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)', margin: '0 0 0.5rem 0' }}>
              Active Work Orders
            </h4>
            <h2 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0' }}>
              12
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Time size={16} style={{ color: 'var(--cds-text-secondary)' }} />
              <span style={{ color: 'var(--cds-text-secondary)', fontSize: '0.875rem' }}>
                2 due this week
              </span>
            </div>
          </Tile>
        </Column>
        <Column sm={4} md={4} lg={4}>
          <Tile style={{ padding: '1.5rem' }}>
            <h4 style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)', margin: '0 0 0.5rem 0' }}>
              Quality Score
            </h4>
            <h2 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0' }}>
              96.5%
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckmarkOutline size={16} style={{ color: 'var(--cds-support-success)' }} />
              <span style={{ color: 'var(--cds-support-success)', fontSize: '0.875rem' }}>
                Exceeds standard
              </span>
            </div>
          </Tile>
        </Column>
      </Grid>

      {/* Tabbed Content */}
      <Grid style={{ marginTop: '2rem' }}>
        <Column span={16}>
          <Tabs selectedIndex={selectedTab} onChange={({ selectedIndex }) => setSelectedTab(selectedIndex)}>
            <TabList>
              <Tab>Production Lines</Tab>
              <Tab>Work Orders</Tab>
              <Tab>Quality Control</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <DataTable rows={productionLineRows} headers={productionLineHeaders}>
                  {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
                    <TableContainer title="Production Line Status">
                      <Table {...getTableProps()}>
                        <TableHead>
                          <TableRow>
                            {headers.map((header) => (
                              <TableHeader key={header.key} {...getHeaderProps({ header })}>
                                {header.header}
                              </TableHeader>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {rows.map((row) => (
                            <TableRow key={row.id} {...getRowProps({ row })}>
                              {row.cells.map((cell) => (
                                <TableCell key={cell.id}>{cell.value}</TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </DataTable>
              </TabPanel>
              
              <TabPanel>
                <DataTable rows={workOrderRows} headers={workOrderHeaders}>
                  {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
                    <TableContainer title="Work Order Management">
                      <Table {...getTableProps()}>
                        <TableHead>
                          <TableRow>
                            {headers.map((header) => (
                              <TableHeader key={header.key} {...getHeaderProps({ header })}>
                                {header.header}
                              </TableHeader>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {rows.map((row) => (
                            <TableRow key={row.id} {...getRowProps({ row })}>
                              {row.cells.map((cell) => (
                                <TableCell key={cell.id}>{cell.value}</TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </DataTable>
              </TabPanel>
              
              <TabPanel>
                <DataTable rows={qualityRows} headers={qualityHeaders}>
                  {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
                    <TableContainer title="Quality Control Metrics">
                      <Table {...getTableProps()}>
                        <TableHead>
                          <TableRow>
                            {headers.map((header) => (
                              <TableHeader key={header.key} {...getHeaderProps({ header })}>
                                {header.header}
                              </TableHeader>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {rows.map((row) => (
                            <TableRow key={row.id} {...getRowProps({ row })}>
                              {row.cells.map((cell) => (
                                <TableCell key={cell.id}>{cell.value}</TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </DataTable>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Column>
      </Grid>

      {/* Work Order Modal */}
      <Modal
        open={showWorkOrderModal}
        onRequestClose={() => setShowWorkOrderModal(false)}
        modalHeading="Create New Work Order"
        primaryButtonText="Create Work Order"
        secondaryButtonText="Cancel"
        hasScrollingContent
      >
        <div style={{ marginBottom: '1rem' }}>
          <TextInput
            id="product-name"
            labelText="Product Name"
            placeholder="Enter product name"
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <NumberInput
            id="quantity"
            label="Quantity"
            min={1}
            step={1}
            placeholder="Enter quantity"
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <Select id="priority" labelText="Priority">
            <SelectItem value="" text="Choose priority" />
            <SelectItem value="high" text="High Priority" />
            <SelectItem value="medium" text="Medium Priority" />
            <SelectItem value="low" text="Low Priority" />
          </Select>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <Select id="production-line" labelText="Assign to Production Line">
            <SelectItem value="" text="Choose production line" />
            <SelectItem value="line-001" text="Assembly Line Alpha" />
            <SelectItem value="line-002" text="Assembly Line Beta" />
            <SelectItem value="line-003" text="Precision Manufacturing" />
          </Select>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <DatePicker dateFormat="m/d/Y">
            <DatePickerInput
              id="due-date"
              placeholder="mm/dd/yyyy"
              labelText="Due Date"
            />
          </DatePicker>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <TextInput
            id="customer"
            labelText="Customer"
            placeholder="Enter customer name"
          />
        </div>
      </Modal>
    </div>
  );
};

export default EnhancedManufacturing;