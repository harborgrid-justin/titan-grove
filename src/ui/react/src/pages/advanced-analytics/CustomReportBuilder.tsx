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
  Checkbox,
  DatePicker,
  DatePickerInput,
  MultiSelect,
  Accordion,
  AccordionItem,
  Tag,
  ProgressBar
} from '@carbon/react';
import {
  Report,
  Add,
  Play,
  Download,
  Calendar,
  Filter,
  ChartColumn,
  Table as TableIcon,
  Email,
  Save
} from '@carbon/icons-react';
import Sidebar from '../../components/Sidebar';
import KPIWidget from '../../components/KPIWidget';

interface ReportField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'currency';
  table: string;
  description: string;
}

interface ReportFilter {
  field: string;
  operator: 'equals' | 'greater_than' | 'less_than' | 'contains' | 'between';
  value: string | number | [string, string];
}

interface CustomReport {
  id: string;
  name: string;
  description: string;
  fields: string[];
  filters: ReportFilter[];
  groupBy: string[];
  orderBy: string;
  format: 'table' | 'chart' | 'pivot';
  schedule: 'none' | 'daily' | 'weekly' | 'monthly';
  recipients: string[];
  lastRun: string;
  status: 'draft' | 'active' | 'paused';
  createdBy: string;
}

const CustomReportBuilder: React.FC = () => {
  const [reports, setReports] = useState<CustomReport[]>([]);
  const [availableFields, setAvailableFields] = useState<ReportField[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReportModal, setShowReportModal] = useState(false);
  const [editingReport, setEditingReport] = useState<CustomReport | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  const [reportForm, setReportForm] = useState({
    name: '',
    description: '',
    selectedFields: [] as string[],
    filters: [] as ReportFilter[],
    groupBy: [] as string[],
    orderBy: '',
    format: 'table',
    schedule: 'none',
    recipients: [] as string[]
  });

  useEffect(() => {
    loadReportData();
  }, []);

  const loadReportData = () => {
    setTimeout(() => {
      setAvailableFields([
        {
          id: 'customer_name',
          name: 'Customer Name',
          type: 'text',
          table: 'customers',
          description: 'Full customer name'
        },
        {
          id: 'order_date',
          name: 'Order Date',
          type: 'date',
          table: 'orders',
          description: 'Date when order was placed'
        },
        {
          id: 'order_amount',
          name: 'Order Amount',
          type: 'currency',
          table: 'orders',
          description: 'Total order value'
        },
        {
          id: 'product_name',
          name: 'Product Name',
          type: 'text',
          table: 'products',
          description: 'Product name'
        },
        {
          id: 'revenue',
          name: 'Revenue',
          type: 'currency',
          table: 'financials',
          description: 'Total revenue'
        },
        {
          id: 'employee_count',
          name: 'Employee Count',
          type: 'number',
          table: 'hr',
          description: 'Number of employees'
        },
        {
          id: 'satisfaction_score',
          name: 'Satisfaction Score',
          type: 'number',
          table: 'surveys',
          description: 'Customer satisfaction rating'
        }
      ]);

      setReports([
        {
          id: 'sales-summary',
          name: 'Monthly Sales Summary',
          description: 'Comprehensive sales performance report by month',
          fields: ['customer_name', 'order_date', 'order_amount', 'product_name'],
          filters: [
            { field: 'order_date', operator: 'greater_than', value: '2024-01-01' }
          ],
          groupBy: ['order_date'],
          orderBy: 'order_amount',
          format: 'table',
          schedule: 'monthly',
          recipients: ['sales@company.com', 'manager@company.com'],
          lastRun: '2024-01-15T10:30:00Z',
          status: 'active',
          createdBy: 'John Smith'
        },
        {
          id: 'customer-analysis',
          name: 'Customer Satisfaction Analysis',
          description: 'Analysis of customer satisfaction trends',
          fields: ['customer_name', 'satisfaction_score', 'order_amount'],
          filters: [
            { field: 'satisfaction_score', operator: 'greater_than', value: 0 }
          ],
          groupBy: ['customer_name'],
          orderBy: 'satisfaction_score',
          format: 'chart',
          schedule: 'weekly',
          recipients: ['customer-success@company.com'],
          lastRun: '2024-01-14T15:45:00Z',
          status: 'active',
          createdBy: 'Sarah Johnson'
        }
      ]);

      setLoading(false);
    }, 1500);
  };

  const createOrUpdateReport = () => {
    const reportData = {
      ...reportForm,
      id: editingReport?.id || `report-${Date.now()}`,
      lastRun: new Date().toISOString(),
      status: 'draft' as const,
      createdBy: 'Current User'
    };

    if (editingReport) {
      setReports(prev => prev.map(report => 
        report.id === editingReport.id ? { ...reportData } : report
      ));
    } else {
      setReports(prev => [...prev, reportData as CustomReport]);
    }

    setShowReportModal(false);
    setEditingReport(null);
    setCurrentStep(1);
    resetForm();
  };

  const resetForm = () => {
    setReportForm({
      name: '',
      description: '',
      selectedFields: [],
      filters: [],
      groupBy: [],
      orderBy: '',
      format: 'table',
      schedule: 'none',
      recipients: []
    });
  };

  const runReport = (reportId: string) => {
    setReports(prev => prev.map(report => 
      report.id === reportId 
        ? { ...report, lastRun: new Date().toISOString() }
        : report
    ));
  };

  const addFilter = () => {
    setReportForm(prev => ({
      ...prev,
      filters: [...prev.filters, { field: '', operator: 'equals', value: '' }]
    }));
  };

  const updateFilter = (index: number, field: keyof ReportFilter, value: any) => {
    setReportForm(prev => ({
      ...prev,
      filters: prev.filters.map((filter, i) => 
        i === index ? { ...filter, [field]: value } : filter
      )
    }));
  };

  const removeFilter = (index: number) => {
    setReportForm(prev => ({
      ...prev,
      filters: prev.filters.filter((_, i) => i !== index)
    }));
  };

  const summaryData = [
    {
      title: 'Total Reports',
      value: reports.length.toString(),
      change: 12.5,
      format: 'number' as const
    },
    {
      title: 'Active Reports',
      value: reports.filter(r => r.status === 'active').length.toString(),
      change: 8.3,
      format: 'number' as const
    },
    {
      title: 'Scheduled Reports',
      value: reports.filter(r => r.schedule !== 'none').length.toString(),
      change: 15.2,
      format: 'number' as const
    },
    {
      title: 'Fields Available',
      value: availableFields.length.toString(),
      change: 5.7,
      format: 'number' as const
    }
  ];

  const reportHeaders = [
    { key: 'name', header: 'Report Name' },
    { key: 'description', header: 'Description' },
    { key: 'format', header: 'Format' },
    { key: 'schedule', header: 'Schedule' },
    { key: 'status', header: 'Status' },
    { key: 'lastRun', header: 'Last Run' },
    { key: 'actions', header: 'Actions' }
  ];

  const reportRows = reports.map(report => ({
    id: report.id,
    name: report.name,
    description: report.description,
    format: report.format.toUpperCase(),
    schedule: report.schedule === 'none' ? 'Manual' : report.schedule,
    status: (
      <Tag type={
        report.status === 'active' ? 'green' :
        report.status === 'draft' ? 'blue' : 'red'
      }>
        {report.status.toUpperCase()}
      </Tag>
    ),
    lastRun: new Date(report.lastRun).toLocaleDateString(),
    actions: (
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <Button size="sm" kind="primary" renderIcon={Play} onClick={() => runReport(report.id)}>
          Run
        </Button>
        <Button size="sm" kind="secondary" renderIcon={Download}>
          Export
        </Button>
      </div>
    )
  }));

  if (loading) {
    return (
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{ flex: 1, padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Loading description="Loading report builder..." />
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
            <Report size={32} />
            Custom Report Builder
          </h1>
          <p style={{ color: 'var(--cds-text-02)', marginBottom: '1rem' }}>
            Create, customize, and schedule business reports with drag-and-drop interface
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Button 
              kind="primary" 
              renderIcon={Add}
              onClick={() => setShowReportModal(true)}
            >
              Create Report
            </Button>
            
            <Button kind="secondary" renderIcon={TableIcon}>
              Report Templates
            </Button>
            
            <Button kind="tertiary" renderIcon={Calendar}>
              Schedule Manager
            </Button>
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
                <Report size={20} />
                Custom Reports
              </h3>
              
              <DataTable 
                rows={reportRows} 
                headers={reportHeaders}
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
          open={showReportModal}
          onRequestClose={() => {
            setShowReportModal(false);
            setEditingReport(null);
            setCurrentStep(1);
            resetForm();
          }}
          modalHeading="Create Custom Report"
          primaryButtonText={currentStep === 4 ? "Create Report" : "Next"}
          secondaryButtonText={currentStep === 1 ? "Cancel" : "Previous"}
          onRequestSubmit={() => {
            if (currentStep === 4) {
              createOrUpdateReport();
            } else {
              setCurrentStep(prev => prev + 1);
            }
          }}
          onSecondarySubmit={() => {
            if (currentStep === 1) {
              setShowReportModal(false);
              resetForm();
            } else {
              setCurrentStep(prev => prev - 1);
            }
          }}
          size="lg"
        >
          <div style={{ marginBottom: '1rem' }}>
            <ProgressBar 
              value={(currentStep / 4) * 100} 
              helperText={`Step ${currentStep} of 4`}
            />
          </div>

          {currentStep === 1 && (
            <div style={{ display: 'grid', gap: '1rem' }}>
              <h4>Basic Information</h4>
              <TextInput
                id="report-name"
                labelText="Report Name"
                value={reportForm.name}
                onChange={(e) => setReportForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter report name"
              />
              
              <TextInput
                id="report-description"
                labelText="Description"
                value={reportForm.description}
                onChange={(e) => setReportForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the report purpose"
              />
            </div>
          )}

          {currentStep === 2 && (
            <div style={{ display: 'grid', gap: '1rem' }}>
              <h4>Select Fields</h4>
              <p style={{ color: 'var(--cds-text-02)', fontSize: '0.875rem' }}>
                Choose the data fields to include in your report
              </p>
              
              <Accordion>
                {Array.from(new Set(availableFields.map(f => f.table))).map(table => (
                  <AccordionItem key={table} title={table.charAt(0).toUpperCase() + table.slice(1)}>
                    {availableFields.filter(f => f.table === table).map(field => (
                      <div key={field.id} style={{ marginBottom: '0.5rem' }}>
                        <Checkbox
                          id={field.id}
                          labelText={field.name}
                          checked={reportForm.selectedFields.includes(field.id)}
                          onChange={(checked) => {
                            if (checked) {
                              setReportForm(prev => ({
                                ...prev,
                                selectedFields: [...prev.selectedFields, field.id]
                              }));
                            } else {
                              setReportForm(prev => ({
                                ...prev,
                                selectedFields: prev.selectedFields.filter(id => id !== field.id)
                              }));
                            }
                          }}
                        />
                        <p style={{ 
                          fontSize: '0.75rem', 
                          color: 'var(--cds-text-02)', 
                          marginLeft: '1.5rem' 
                        }}>
                          {field.description}
                        </p>
                      </div>
                    ))}
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}

          {currentStep === 3 && (
            <div style={{ display: 'grid', gap: '1rem' }}>
              <h4>Filters & Grouping</h4>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label style={{ fontWeight: 'bold' }}>Filters</label>
                  <Button size="sm" kind="tertiary" renderIcon={Add} onClick={addFilter}>
                    Add Filter
                  </Button>
                </div>
                
                {reportForm.filters.map((filter, index) => (
                  <div key={index} style={{ 
                    display: 'flex', 
                    gap: '0.5rem', 
                    alignItems: 'center',
                    marginBottom: '0.5rem',
                    padding: '0.5rem',
                    border: '1px solid var(--cds-border-subtle)',
                    borderRadius: '0.25rem'
                  }}>
                    <Select
                      id={`filter-field-${index}`}
                      labelText=""
                      value={filter.field}
                      onChange={(e) => updateFilter(index, 'field', e.target.value)}
                      size="sm"
                    >
                      <SelectItem value="" text="Select Field" />
                      {availableFields.map(field => (
                        <SelectItem key={field.id} value={field.id} text={field.name} />
                      ))}
                    </Select>
                    
                    <Select
                      id={`filter-operator-${index}`}
                      labelText=""
                      value={filter.operator}
                      onChange={(e) => updateFilter(index, 'operator', e.target.value)}
                      size="sm"
                    >
                      <SelectItem value="equals" text="Equals" />
                      <SelectItem value="greater_than" text="Greater Than" />
                      <SelectItem value="less_than" text="Less Than" />
                      <SelectItem value="contains" text="Contains" />
                    </Select>
                    
                    <TextInput
                      id={`filter-value-${index}`}
                      labelText=""
                      value={filter.value as string}
                      onChange={(e) => updateFilter(index, 'value', e.target.value)}
                      size="sm"
                    />
                    
                    <Button 
                      size="sm" 
                      kind="ghost" 
                      hasIconOnly
                      renderIcon={() => <span>×</span>}
                      onClick={() => removeFilter(index)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div style={{ display: 'grid', gap: '1rem' }}>
              <h4>Output & Schedule</h4>
              
              <Select
                id="report-format"
                labelText="Output Format"
                value={reportForm.format}
                onChange={(e) => setReportForm(prev => ({ ...prev, format: e.target.value }))}
              >
                <SelectItem value="table" text="Table" />
                <SelectItem value="chart" text="Chart" />
                <SelectItem value="pivot" text="Pivot Table" />
              </Select>
              
              <Select
                id="report-schedule"
                labelText="Schedule"
                value={reportForm.schedule}
                onChange={(e) => setReportForm(prev => ({ ...prev, schedule: e.target.value }))}
              >
                <SelectItem value="none" text="Manual" />
                <SelectItem value="daily" text="Daily" />
                <SelectItem value="weekly" text="Weekly" />
                <SelectItem value="monthly" text="Monthly" />
              </Select>
              
              <TextInput
                id="report-recipients"
                labelText="Email Recipients (comma-separated)"
                value={reportForm.recipients.join(', ')}
                onChange={(e) => setReportForm(prev => ({ 
                  ...prev, 
                  recipients: e.target.value.split(',').map(email => email.trim()).filter(Boolean)
                }))}
                placeholder="user1@company.com, user2@company.com"
              />
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default CustomReportBuilder;