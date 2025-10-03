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
  Document,
  DocumentSigned,
  Calendar,
  Money,
  Add
} from '@carbon/icons-react';
import Sidebar from '../../components/Sidebar';
import KPIWidget from '../../components/KPIWidget';

interface Contract {
  id: string;
  contractName: string;
  vendor: string;
  type: string;
  value: number;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Expiring Soon' | 'Expired' | 'Draft';
  compliance: number;
}

const ContractManagementSystem: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContractData();
  }, []);

  const loadContractData = () => {
    setTimeout(() => {
      setContracts([
        {
          id: 'contract-1',
          contractName: 'Annual Supply Agreement',
          vendor: 'Global Components Inc.',
          type: 'Supply',
          value: 2500000,
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          status: 'Active',
          compliance: 98
        },
        {
          id: 'contract-2',
          contractName: 'Logistics Service Agreement',
          vendor: 'Logistics Partners LLC',
          type: 'Service',
          value: 850000,
          startDate: '2024-02-01',
          endDate: '2025-01-31',
          status: 'Active',
          compliance: 95
        },
        {
          id: 'contract-3',
          contractName: 'Raw Materials Contract',
          vendor: 'Steel Dynamics Corp',
          type: 'Supply',
          value: 1200000,
          startDate: '2023-06-01',
          endDate: '2024-05-31',
          status: 'Expiring Soon',
          compliance: 92
        },
        {
          id: 'contract-4',
          contractName: 'Maintenance Agreement',
          vendor: 'Quality Supplies Co',
          type: 'Service',
          value: 450000,
          startDate: '2024-03-01',
          endDate: '2024-08-31',
          status: 'Draft',
          compliance: 100
        }
      ]);
      setLoading(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'green';
      case 'Expiring Soon': return 'yellow';
      case 'Expired': return 'red';
      case 'Draft': return 'gray';
      default: return 'gray';
    }
  };

  const kpiData = {
    activeContracts: contracts.filter(c => c.status === 'Active').length,
    expiringSoon: contracts.filter(c => c.status === 'Expiring Soon').length,
    totalValue: contracts.reduce((sum, c) => sum + c.value, 0),
    avgCompliance: contracts.reduce((sum, c) => sum + c.compliance, 0) / contracts.length
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Loading description="Loading contract data..." withOverlay={false} />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '2rem', backgroundColor: '#f4f4f4', overflowY: 'auto' }}>
        <Grid>
          <Column lg={16}>
            <h1 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <DocumentSigned size={32} />
              Contract Management System
            </h1>
            <p style={{ marginBottom: '2rem', color: '#525252' }}>
              Contract lifecycle management and compliance tracking
            </p>
          </Column>

          {/* KPI Widgets */}
          <Column lg={4} md={4} sm={4}>
            <KPIWidget
              title="Active Contracts"
              value={kpiData.activeContracts.toString()}
              trend="up"
              trendValue="5%"
              icon={<DocumentSigned size={24} />}
            />
          </Column>
          <Column lg={4} md={4} sm={4}>
            <KPIWidget
              title="Expiring Soon"
              value={kpiData.expiringSoon.toString()}
              trend="neutral"
              trendValue="0%"
              icon={<Calendar size={24} />}
            />
          </Column>
          <Column lg={4} md={4} sm={4}>
            <KPIWidget
              title="Total Value"
              value={`$${(kpiData.totalValue / 1000000).toFixed(1)}M`}
              trend="up"
              trendValue="12%"
              icon={<Money size={24} />}
            />
          </Column>
          <Column lg={4} md={4} sm={4}>
            <KPIWidget
              title="Avg Compliance"
              value={`${kpiData.avgCompliance.toFixed(1)}%`}
              trend="up"
              trendValue="2%"
              icon={<Document size={24} />}
            />
          </Column>

          {/* Contract Registry */}
          <Column lg={16} style={{ marginTop: '2rem' }}>
            <Tile style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3>Contract Registry</h3>
                <Button kind="primary" renderIcon={Add}>
                  New Contract
                </Button>
              </div>

              <DataTable rows={[]} headers={[]}>
                {() => (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableHeader>Contract Name</TableHeader>
                          <TableHeader>Vendor</TableHeader>
                          <TableHeader>Type</TableHeader>
                          <TableHeader>Value</TableHeader>
                          <TableHeader>Start Date</TableHeader>
                          <TableHeader>End Date</TableHeader>
                          <TableHeader>Status</TableHeader>
                          <TableHeader>Compliance</TableHeader>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {contracts.map((contract) => (
                          <TableRow key={contract.id}>
                            <TableCell>{contract.contractName}</TableCell>
                            <TableCell>{contract.vendor}</TableCell>
                            <TableCell>{contract.type}</TableCell>
                            <TableCell>${(contract.value / 1000000).toFixed(2)}M</TableCell>
                            <TableCell>{contract.startDate}</TableCell>
                            <TableCell>{contract.endDate}</TableCell>
                            <TableCell>
                              <Tag type={getStatusColor(contract.status)}>
                                {contract.status}
                              </Tag>
                            </TableCell>
                            <TableCell>
                              <div style={{ width: '100px' }}>
                                <ProgressBar value={contract.compliance} label={`${contract.compliance}%`} />
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </DataTable>
            </Tile>
          </Column>
        </Grid>
      </div>
    </div>
  );
};

export default ContractManagementSystem;
