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
  TextInput
} from '@carbon/react';
import {
  Document,
  UserAvatar,
  Time,
  Search,
  View
} from '@carbon/icons-react';
import Sidebar from '../../components/Sidebar';
import KPIWidget from '../../components/KPIWidget';

interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  entity: string;
  changes: string;
  status: 'Success' | 'Failed' | 'Warning';
  ipAddress: string;
}

const AuditTrailExplorer: React.FC = () => {
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAuditData();
  }, []);

  const loadAuditData = () => {
    setTimeout(() => {
      setAuditLogs([
        {
          id: 'audit-1',
          timestamp: '2024-03-22 14:35:22',
          user: 'john.smith@company.com',
          action: 'Update',
          entity: 'Invoice #INV-2024-001',
          changes: 'Amount: $5000 → $5250',
          status: 'Success',
          ipAddress: '192.168.1.45'
        },
        {
          id: 'audit-2',
          timestamp: '2024-03-22 14:28:15',
          user: 'jane.doe@company.com',
          action: 'Create',
          entity: 'Purchase Order #PO-2024-125',
          changes: 'New PO created',
          status: 'Success',
          ipAddress: '192.168.1.67'
        },
        {
          id: 'audit-3',
          timestamp: '2024-03-22 14:15:08',
          user: 'mike.johnson@company.com',
          action: 'Delete',
          entity: 'Purchase Report #EXP-2024-089',
          changes: 'Report deleted',
          status: 'Failed',
          ipAddress: '192.168.1.89'
        },
        {
          id: 'audit-4',
          timestamp: '2024-03-22 14:05:42',
          user: 'sarah.williams@company.com',
          action: 'Approve',
          entity: 'Budget Request #BR-2024-015',
          changes: 'Status: Pending → Approved',
          status: 'Success',
          ipAddress: '192.168.1.92'
        }
      ]);
      setLoading(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Success': return 'green';
      case 'Failed': return 'red';
      case 'Warning': return 'yellow';
      default: return 'gray';
    }
  };

  const kpiData = {
    totalEvents: auditLogs.length,
    successEvents: auditLogs.filter(a => a.status === 'Success').length,
    failedEvents: auditLogs.filter(a => a.status === 'Failed').length,
    uniqueUsers: new Set(auditLogs.map(a => a.user)).size
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Loading description="Loading audit trail..." withOverlay={false} />
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
              <Document size={32} />
              View Trail Explorer
            </h1>
            <p style={{ marginBottom: '2rem', color: '#525252' }}>
              Comprehensive audit logging and compliance tracking
            </p>
          </Column>

          <Column lg={4} md={4} sm={4}>
            <KPIWidget
              title="Total Events"
              value={kpiData.totalEvents.toString()}
              trend="up"
              trendValue="15%"
              icon={<Document size={24} />}
            />
          </Column>
          <Column lg={4} md={4} sm={4}>
            <KPIWidget
              title="Success Events"
              value={kpiData.successEvents.toString()}
              trend="up"
              trendValue="10%"
              icon={<Time size={24} />}
            />
          </Column>
          <Column lg={4} md={4} sm={4}>
            <KPIWidget
              title="Failed Events"
              value={kpiData.failedEvents.toString()}
              trend="down"
              trendValue="5%"
              icon={<Search size={24} />}
            />
          </Column>
          <Column lg={4} md={4} sm={4}>
            <KPIWidget
              title="Unique Users"
              value={kpiData.uniqueUsers.toString()}
              trend="neutral"
              trendValue="0%"
              icon={<UserAvatar size={24} />}
            />
          </Column>

          <Column lg={16} style={{ marginTop: '2rem' }}>
            <Tile style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3>View Log</h3>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <TextInput
                    id="search-audit"
                    placeholder="Search logs..."
                    labelText=""
                  />
                  <Button kind="primary" renderIcon={View}>
                    Export Log
                  </Button>
                </div>
              </div>

              <DataTable rows={[]} headers={[]}>
                {() => (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableHeader>Timestamp</TableHeader>
                          <TableHeader>User</TableHeader>
                          <TableHeader>Action</TableHeader>
                          <TableHeader>Entity</TableHeader>
                          <TableHeader>Changes</TableHeader>
                          <TableHeader>Status</TableHeader>
                          <TableHeader>IP Address</TableHeader>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {auditLogs.map((log) => (
                          <TableRow key={log.id}>
                            <TableCell>{log.timestamp}</TableCell>
                            <TableCell>{log.user}</TableCell>
                            <TableCell>{log.action}</TableCell>
                            <TableCell>{log.entity}</TableCell>
                            <TableCell>{log.changes}</TableCell>
                            <TableCell>
                              <Tag type={getStatusColor(log.status)}>
                                {log.status}
                              </Tag>
                            </TableCell>
                            <TableCell>{log.ipAddress}</TableCell>
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

export default AuditTrailExplorer;
