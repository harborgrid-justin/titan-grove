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
  ProgressBar,
  Modal,
  TextInput,
  TextArea
} from '@carbon/react';
import {
  UserFollow,
  Analytics,
  Add,
  View,
  Edit,
  Email,
  Phone,
  Location
} from '@carbon/icons-react';
import Sidebar from '../../components/Sidebar';
import KPIWidget from '../../components/KPIWidget';

interface TalentCandidate {
  id: string;
  name: string;
  position: string;
  department: string;
  experience: number;
  skills: string[];
  status: 'New' | 'Screening' | 'Interview' | 'Offer' | 'Hired' | 'Rejected';
  source: string;
  matchScore: number;
  salary: number;
  location: string;
  appliedDate: string;
}

const TalentAcquisitionPortal: React.FC = () => {
  const [candidates, setCandidates] = useState<TalentCandidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCandidateModal, setShowCandidateModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedDepartment, setSelectedDepartment] = useState('All');

  const [candidateForm, setCandidateForm] = useState({
    name: '',
    position: '',
    department: 'Engineering',
    experience: 0,
    location: '',
    source: 'Job Board'
  });

  useEffect(() => {
    loadTalentData();
  }, []);

  const loadTalentData = () => {
    setTimeout(() => {
      setCandidates([
        {
          id: 'cand-1',
          name: 'Sarah Johnson',
          position: 'Senior Software Engineer',
          department: 'Engineering',
          experience: 8,
          skills: ['React', 'Node.js', 'Python', 'AWS'],
          status: 'Interview',
          source: 'LinkedIn',
          matchScore: 94,
          salary: 120000,
          location: 'San Francisco, CA',
          appliedDate: '2024-01-15'
        },
        {
          id: 'cand-2',
          name: 'Michael Chen',
          position: 'Product Manager',
          department: 'Product',
          experience: 6,
          skills: ['Product Strategy', 'Agile', 'Analytics', 'Leadership'],
          status: 'Offer',
          source: 'Referral',
          matchScore: 88,
          salary: 130000,
          location: 'New York, NY',
          appliedDate: '2024-01-12'
        },
        {
          id: 'cand-3',
          name: 'Emily Rodriguez',
          position: 'UX Designer',
          department: 'Design',
          experience: 5,
          skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
          status: 'Screening',
          source: 'Job Board',
          matchScore: 91,
          salary: 95000,
          location: 'Austin, TX',
          appliedDate: '2024-01-10'
        }
      ]);
      setLoading(false);
    }, 1500);
  };

  const addCandidate = () => {
    const newCandidate: TalentCandidate = {
      id: `cand-${Date.now()}`,
      ...candidateForm,
      skills: [],
      status: 'New',
      matchScore: 0,
      salary: 0,
      appliedDate: new Date().toISOString().split('T')[0]
    };

    setCandidates(prev => [...prev, newCandidate]);
    setShowCandidateModal(false);
    setCandidateForm({
      name: '',
      position: '',
      department: 'Engineering',
      experience: 0,
      location: '',
      source: 'Job Board'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Hired': return 'green';
      case 'Offer': return 'blue';
      case 'Interview': return 'purple';
      case 'Screening': return 'yellow';
      case 'Rejected': return 'red';
      default: return 'gray';
    }
  };

  const filteredCandidates = candidates.filter(candidate => {
    if (selectedStatus !== 'All' && candidate.status !== selectedStatus) return false;
    if (selectedDepartment !== 'All' && candidate.department !== selectedDepartment) return false;
    return true;
  });

  const kpiData = [
    {
      title: 'Active Candidates',
      value: candidates.filter(c => !['Hired', 'Rejected'].includes(c.status)).length.toString(),
      change: 15.2,
      format: 'number' as const
    },
    {
      title: 'Avg Match Score',
      value: `${(candidates.reduce((sum, c) => sum + c.matchScore, 0) / candidates.length).toFixed(1)}%`,
      change: 8.7,
      format: 'percentage' as const
    },
    {
      title: 'Offers Extended',
      value: candidates.filter(c => c.status === 'Offer').length.toString(),
      change: 25.0,
      format: 'number' as const
    },
    {
      title: 'Time to Hire',
      value: '18 days',
      change: -12.3,
      format: 'text' as const
    }
  ];

  const headers = [
    { key: 'name', header: 'Candidate' },
    { key: 'position', header: 'Position' },
    { key: 'department', header: 'Department' },
    { key: 'experience', header: 'Experience' },
    { key: 'match', header: 'Match Score' },
    { key: 'status', header: 'Status' },
    { key: 'source', header: 'Source' },
    { key: 'actions', header: 'Actions' }
  ];

  const rows = filteredCandidates.map(candidate => ({
    id: candidate.id,
    name: (
      <div>
        <div style={{ fontWeight: 'bold' }}>{candidate.name}</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--cds-text-02)' }}>
          {candidate.location}
        </div>
      </div>
    ),
    position: candidate.position,
    department: candidate.department,
    experience: `${candidate.experience} years`,
    match: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <ProgressBar value={candidate.matchScore} size="sm" />
        <span style={{ fontSize: '0.75rem' }}>{candidate.matchScore}%</span>
      </div>
    ),
    status: (
      <Tag type={getStatusColor(candidate.status)}>
        {candidate.status}
      </Tag>
    ),
    source: candidate.source,
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
          <Loading description="Loading talent acquisition data..." />
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
            <UserFollow size={32} />
            Talent Acquisition Portal
          </h1>
          <p style={{ color: 'var(--cds-text-02)', marginBottom: '1rem' }}>
            Streamline recruitment with AI-powered candidate matching and workflow automation
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Select
              id="status-filter"
              labelText=""
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              size="sm"
            >
              <SelectItem value="All" text="All Status" />
              <SelectItem value="New" text="New" />
              <SelectItem value="Screening" text="Screening" />
              <SelectItem value="Interview" text="Interview" />
              <SelectItem value="Offer" text="Offer" />
              <SelectItem value="Hired" text="Hired" />
            </Select>
            
            <Select
              id="department-filter"
              labelText=""
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              size="sm"
            >
              <SelectItem value="All" text="All Departments" />
              <SelectItem value="Engineering" text="Engineering" />
              <SelectItem value="Product" text="Product" />
              <SelectItem value="Design" text="Design" />
              <SelectItem value="Sales" text="Sales" />
            </Select>
            
            <Button 
              kind="primary" 
              renderIcon={Add}
              onClick={() => setShowCandidateModal(true)}
            >
              Add Candidate
            </Button>
            
            <Button kind="secondary" renderIcon={Analytics}>
              Hiring Analytics
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
                <UserFollow size={20} />
                Candidate Pipeline
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

        <Modal
          open={showCandidateModal}
          onRequestClose={() => setShowCandidateModal(false)}
          modalHeading="Add New Candidate"
          primaryButtonText="Add Candidate"
          secondaryButtonText="Cancel"
          onRequestSubmit={addCandidate}
        >
          <div style={{ display: 'grid', gap: '1rem' }}>
            <TextInput
              id="candidate-name"
              labelText="Full Name"
              value={candidateForm.name}
              onChange={(e) => setCandidateForm(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter candidate name"
            />
            
            <TextInput
              id="candidate-position"
              labelText="Position"
              value={candidateForm.position}
              onChange={(e) => setCandidateForm(prev => ({ ...prev, position: e.target.value }))}
              placeholder="Enter position title"
            />
            
            <Select
              id="candidate-department"
              labelText="Department"
              value={candidateForm.department}
              onChange={(e) => setCandidateForm(prev => ({ ...prev, department: e.target.value }))}
            >
              <SelectItem value="Engineering" text="Engineering" />
              <SelectItem value="Product" text="Product" />
              <SelectItem value="Design" text="Design" />
              <SelectItem value="Sales" text="Sales" />
              <SelectItem value="Marketing" text="Marketing" />
            </Select>
            
            <TextInput
              id="candidate-location"
              labelText="Location"
              value={candidateForm.location}
              onChange={(e) => setCandidateForm(prev => ({ ...prev, location: e.target.value }))}
              placeholder="City, State"
            />
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default TalentAcquisitionPortal;