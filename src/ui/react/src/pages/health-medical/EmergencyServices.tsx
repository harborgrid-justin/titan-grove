import React, { useState, useEffect } from 'react';
import {
  Grid,
  Column,
  Button,
  DataTable,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  Tile,
  ClickableTile,
  Tag,
  ProgressIndicator,
  ProgressStep,
  InlineNotification,
  Modal,
  TextInput,
  Select,
  SelectItem,
  DatePicker,
  DatePickerInput,
  NumberInput,
  Dropdown,
  MultiSelect,
  Toggle,
  RadioButton,
  RadioButtonGroup,
  Checkbox,
  FormGroup,
  TextArea,
  Loading,
  SkeletonPlaceholder,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel
} from '@carbon/react';
import {
  Add,
  Edit,
  Delete,
  View,
  Search,
  Filter,
  Download,
  Upload,
  Settings,
  Information,
  Warning,
  CheckmarkFilled,
  ErrorFilled,
  Time,
  Calendar,
  Location,
  User,
  Document,
  ChartLine,
  Report,
  Security,
  Notification,
  Email,
  Phone,
  Chat
} from '@carbon/icons-react';
import { healthMedicalDomainManager, HealthMedicalBusinessLogic } from '../../../../../domains/health-medical';

interface EmergencyServicesData {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'pending' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  dateCreated: string;
  lastUpdated: string;
  assignedTo?: string;
  category?: string;
  description?: string;
}

const EmergencyServices: React.FC = () => {
  const [data, setData] = useState<EmergencyServicesData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<EmergencyServicesData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [analytics, setAnalytics] = useState<any>(null);

  // Sample data specific to Emergency Services
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      // Simulate API call with healthcare-specific data
      const mockData: EmergencyServicesData[] = [
        {
          id: 'emergencyservices-001',
          name: 'Sample Emergency Services Record 1',
          status: 'active',
          priority: 'high',
          dateCreated: '2024-01-15',
          lastUpdated: '2024-01-20',
          assignedTo: 'Dr. Smith',
          category: 'Clinical Operations',
          description: 'Emergency department management and triage'
        },
        {
          id: 'emergencyservices-002',
          name: 'Sample Emergency Services Record 2',
          status: 'pending',
          priority: 'medium',
          dateCreated: '2024-01-18',
          lastUpdated: '2024-01-22',
          assignedTo: 'Nurse Johnson',
          category: 'Clinical Operations',
          description: 'Secondary record for emergency department management and triage'
        },
        {
          id: 'emergencyservices-003',
          name: 'Sample Emergency Services Record 3',
          status: 'completed',
          priority: 'low',
          dateCreated: '2024-01-10',
          lastUpdated: '2024-01-25',
          assignedTo: 'Admin Staff',
          category: 'Clinical Operations',
          description: 'Completed emergency department management and triage'
        }
      ];

      setData(mockData);
      
      // Load analytics data from health medical domain
      try {
        const analyticsData = await healthMedicalDomainManager.optimizeHealthcareOperations();
        setAnalytics(analyticsData);
      } catch (error) {
        console.error('Error loading healthcare analytics:', error);
      }
      
      setLoading(false);
    };

    loadData();
  }, []);

  // Filter data based on search and status
  const filteredData = data.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Table headers
  const headers = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Name' },
    { key: 'status', header: 'Status' },
    { key: 'priority', header: 'Priority' },
    { key: 'assignedTo', header: 'Assigned To' },
    { key: 'lastUpdated', header: 'Last Updated' },
    { key: 'actions', header: 'Actions' }
  ];

  // Transform data for table
  const rows = filteredData.map(item => ({
    ...item,
    id: item.id,
    name: item.name,
    status: (
      <Tag 
        type={item.status === 'active' ? 'green' : 
              item.status === 'pending' ? 'yellow' : 
              item.status === 'completed' ? 'blue' : 'red'}
      >
        {item.status.toUpperCase()}
      </Tag>
    ),
    priority: (
      <Tag 
        type={item.priority === 'critical' ? 'red' : 
              item.priority === 'high' ? 'magenta' : 
              item.priority === 'medium' ? 'blue' : 'gray'}
      >
        {item.priority.toUpperCase()}
      </Tag>
    ),
    assignedTo: item.assignedTo || 'Unassigned',
    lastUpdated: new Date(item.lastUpdated).toLocaleDateString(),
    actions: (
      <div style={{ display: 'flex', gap: '8px' }}>
        <Button
          kind="ghost"
          size="sm"
          iconDescription="View"
          renderIcon={View}
          onClick={() => handleView(item)}
        />
        <Button
          kind="ghost"
          size="sm"
          iconDescription="Edit"
          renderIcon={Edit}
          onClick={() => handleEdit(item)}
        />
        <Button
          kind="ghost"
          size="sm"
          iconDescription="Delete"
          renderIcon={Delete}
          onClick={() => handleDelete(item.id)}
        />
      </div>
    )
  }));

  const handleView = (item: EmergencyServicesData) => {
    // Implementation for viewing item details
    console.log('Viewing item:', item);
  };

  const handleEdit = (item: EmergencyServicesData) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    setData(prev => prev.filter(item => item.id !== id));
  };

  const handleAdd = () => {
    setEditingItem(null);
    setShowModal(true);
  };

  const handleSave = (formData: Partial<EmergencyServicesData>) => {
    if (editingItem) {
      // Update existing item
      setData(prev => prev.map(item => 
        item.id === editingItem.id 
          ? { ...item, ...formData, lastUpdated: new Date().toISOString().split('T')[0] }
          : item
      ));
    } else {
      // Add new item
      const newItem: EmergencyServicesData = {
        id: `emergencyservices-${Date.now()}`,
        name: formData.name || 'New Emergency Services',
        status: formData.status || 'pending',
        priority: formData.priority || 'medium',
        dateCreated: new Date().toISOString().split('T')[0],
        lastUpdated: new Date().toISOString().split('T')[0],
        assignedTo: formData.assignedTo,
        category: 'Clinical Operations',
        description: formData.description || 'Emergency department management and triage'
      };
      setData(prev => [...prev, newItem]);
    }
    setShowModal(false);
    setEditingItem(null);
  };

  // Calculate KPI metrics
  const totalItems = data.length;
  const activeItems = data.filter(item => item.status === 'active').length;
  const completedItems = data.filter(item => item.status === 'completed').length;
  const highPriorityItems = data.filter(item => item.priority === 'high' || item.priority === 'critical').length;

  if (loading) {
    return (
      <div style={{ padding: '2rem' }}>
        <Loading description="Loading Emergency Services..." />
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      {/* Page Header */}
      <Grid>
        <Column lg={16} md={8} sm={4}>
          <div style={{ marginBottom: '2rem' }}>
            <h1>Emergency Services</h1>
            <p style={{ color: '#6f6f6f', marginTop: '0.5rem' }}>
              Emergency department management and triage
            </p>
          </div>
        </Column>
      </Grid>

      {/* KPI Tiles */}
      <Grid style={{ marginBottom: '2rem' }}>
        <Column lg={4} md={2} sm={2}>
          <Tile style={{ padding: '1rem', textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', color: '#0f62fe' }}>{totalItems}</h3>
            <p style={{ margin: 0, color: '#6f6f6f' }}>Total Records</p>
          </Tile>
        </Column>
        <Column lg={4} md={2} sm={2}>
          <Tile style={{ padding: '1rem', textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', color: '#198038' }}>{activeItems}</h3>
            <p style={{ margin: 0, color: '#6f6f6f' }}>Active</p>
          </Tile>
        </Column>
        <Column lg={4} md={2} sm={2}>
          <Tile style={{ padding: '1rem', textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', color: '#8a3ffc' }}>{completedItems}</h3>
            <p style={{ margin: 0, color: '#6f6f6f' }}>Completed</p>
          </Tile>
        </Column>
        <Column lg={4} md={2} sm={2}>
          <Tile style={{ padding: '1rem', textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', color: '#da1e28' }}>{highPriorityItems}</h3>
            <p style={{ margin: 0, color: '#6f6f6f' }}>High Priority</p>
          </Tile>
        </Column>
      </Grid>

      {/* Healthcare Analytics Summary */}
      {analytics && (
        <Grid style={{ marginBottom: '2rem' }}>
          <Column lg={16} md={8} sm={4}>
            <Tile style={{ padding: '1.5rem' }}>
              <h4 style={{ marginBottom: '1rem' }}>Healthcare Analytics Summary</h4>
              <Grid>
                <Column lg={4} md={2} sm={2}>
                  <div>
                    <h5>Patient Risk Score</h5>
                    <p style={{ fontSize: '1.5rem', color: analytics.patientRiskAnalysis?.riskLevel === 'high' ? '#da1e28' : '#0f62fe' }}>
                      {analytics.patientRiskAnalysis?.riskScore || 'N/A'}
                    </p>
                  </div>
                </Column>
                <Column lg={4} md={2} sm={2}>
                  <div>
                    <h5>Quality Score</h5>
                    <p style={{ fontSize: '1.5rem', color: '#198038' }}>
                      {analytics.qualityMetrics?.complianceMetrics?.preventiveScreening?.toFixed(1) || 'N/A'}%
                    </p>
                  </div>
                </Column>
                <Column lg={4} md={2} sm={2}>
                  <div>
                    <h5>Collection Rate</h5>
                    <p style={{ fontSize: '1.5rem', color: '#8a3ffc' }}>
                      {analytics.revenueCycleAnalysis?.financialMetrics?.collectionRate?.toFixed(1) || 'N/A'}%
                    </p>
                  </div>
                </Column>
                <Column lg={4} md={2} sm={2}>
                  <div>
                    <h5>Clinical Alerts</h5>
                    <p style={{ fontSize: '1.5rem', color: '#da1e28' }}>
                      {analytics.clinicalDecisionSupport?.alerts?.length || 0}
                    </p>
                  </div>
                </Column>
              </Grid>
            </Tile>
          </Column>
        </Grid>
      )}

      {/* Search and Filter Controls */}
      <Grid style={{ marginBottom: '1rem' }}>
        <Column lg={4} md={2} sm={2}>
          <TextInput
            id="search"
            labelText="Search"
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Column>
        <Column lg={4} md={2} sm={2}>
          <Select
            id="status-filter"
            labelText="Filter by Status"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <SelectItem value="all" text="All Statuses" />
            <SelectItem value="active" text="Active" />
            <SelectItem value="pending" text="Pending" />
            <SelectItem value="completed" text="Completed" />
            <SelectItem value="inactive" text="Inactive" />
          </Select>
        </Column>
        <Column lg={4} md={2} sm={2}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'end', height: '100%' }}>
            <Button
              kind="primary"
              renderIcon={Add}
              onClick={handleAdd}
            >
              Add New
            </Button>
            <Button
              kind="secondary"
              renderIcon={Download}
              onClick={() => console.log('Export functionality')}
            >
              Export
            </Button>
          </div>
        </Column>
      </Grid>

      {/* Data Table */}
      <Grid>
        <Column lg={16} md={8} sm={4}>
          <DataTable
            rows={rows}
            headers={headers}
            render={({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
              <TableContainer title="Emergency Services Management">
                <Table {...getTableProps()}>
                  <TableHead>
                    <TableRow>
                      {headers.map(header => (
                        <TableHeader {...getHeaderProps({ header })} key={header.key}>
                          {header.header}
                        </TableHeader>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map(row => (
                      <TableRow {...getRowProps({ row })} key={row.id}>
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
        </Column>
      </Grid>

      {/* Add/Edit Modal */}
      <Modal
        open={showModal}
        onRequestClose={() => setShowModal(false)}
        modalHeading={editingItem ? `Edit ${editingItem.name}` : 'Add New Emergency Services'}
        primaryButtonText="Save"
        secondaryButtonText="Cancel"
        onRequestSubmit={() => {
          // Get form data and save
          const formData = {
            name: 'Updated Emergency Services',
            status: 'active' as const,
            priority: 'medium' as const,
            assignedTo: 'Current User',
            description: 'Updated emergency department management and triage'
          };
          handleSave(formData);
        }}
      >
        <div style={{ marginBottom: '1rem' }}>
          <TextInput
            id="modal-name"
            labelText="Name"
            placeholder="Enter name..."
            defaultValue={editingItem?.name || ''}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <Select
            id="modal-status"
            labelText="Status"
            defaultValue={editingItem?.status || 'pending'}
          >
            <SelectItem value="active" text="Active" />
            <SelectItem value="pending" text="Pending" />
            <SelectItem value="completed" text="Completed" />
            <SelectItem value="inactive" text="Inactive" />
          </Select>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <Select
            id="modal-priority"
            labelText="Priority"
            defaultValue={editingItem?.priority || 'medium'}
          >
            <SelectItem value="low" text="Low" />
            <SelectItem value="medium" text="Medium" />
            <SelectItem value="high" text="High" />
            <SelectItem value="critical" text="Critical" />
          </Select>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <TextInput
            id="modal-assigned"
            labelText="Assigned To"
            placeholder="Assign to..."
            defaultValue={editingItem?.assignedTo || ''}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <TextArea
            id="modal-description"
            labelText="Description"
            placeholder="Enter description..."
            defaultValue={editingItem?.description || ''}
          />
        </div>
      </Modal>
    </div>
  );
};

export default EmergencyServices;
