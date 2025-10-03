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
  Tag
} from '@carbon/react';
import {
  Partnership,
  Network_3,
  Chat,
  DocumentAdd,
  Add
} from '@carbon/icons-react';
import Sidebar from '../../components/Sidebar';
import KPIWidget from '../../components/KPIWidget';

interface Vendor {
  id: string;
  name: string;
  category: string;
  status: 'Active' | 'Pending' | 'Inactive';
  lastCommunication: string;
  openOrders: number;
  collaboration: 'High' | 'Medium' | 'Low';
  rating: number;
}

const VendorCollaborationPortal: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVendorData();
  }, []);

  const loadVendorData = () => {
    setTimeout(() => {
      setVendors([
        {
          id: 'vendor-1',
          name: 'Global Components Inc.',
          category: 'Electronics',
          status: 'Active',
          lastCommunication: '2024-03-22',
          openOrders: 8,
          collaboration: 'High',
          rating: 4.8
        },
        {
          id: 'vendor-2',
          name: 'Steel Dynamics Corp',
          category: 'Raw Materials',
          status: 'Active',
          lastCommunication: '2024-03-20',
          openOrders: 5,
          collaboration: 'Medium',
          rating: 4.5
        },
        {
          id: 'vendor-3',
          name: 'Logistics Partners LLC',
          category: 'Transportation',
          status: 'Active',
          lastCommunication: '2024-03-21',
          openOrders: 12,
          collaboration: 'High',
          rating: 4.9
        },
        {
          id: 'vendor-4',
          name: 'Quality Supplies Co',
          category: 'General',
          status: 'Pending',
          lastCommunication: '2024-03-18',
          openOrders: 2,
          collaboration: 'Low',
          rating: 4.2
        }
      ]);
      setLoading(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'green';
      case 'Pending': return 'yellow';
      case 'Inactive': return 'gray';
      default: return 'gray';
    }
  };

  const kpiData = {
    activeVendors: vendors.filter(v => v.status === 'Active').length,
    totalOpenOrders: vendors.reduce((sum, v) => sum + v.openOrders, 0),
    highCollaboration: vendors.filter(v => v.collaboration === 'High').length,
    avgRating: vendors.reduce((sum, v) => sum + v.rating, 0) / vendors.length
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Loading description="Loading vendor data..." withOverlay={false} />
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
              <Partnership size={32} />
              Vendor Collaboration Portal
            </h1>
            <p style={{ marginBottom: '2rem', color: '#525252' }}>
              Collaborative platform for vendor management and communication
            </p>
          </Column>

          {/* KPI Widgets */}
          <Column lg={4} md={4} sm={4}>
            <KPIWidget
              title="Active Vendors"
              value={kpiData.activeVendors.toString()}
              trend="up"
              trendValue="5%"
              icon={<Partnership size={24} />}
            />
          </Column>
          <Column lg={4} md={4} sm={4}>
            <KPIWidget
              title="Open Orders"
              value={kpiData.totalOpenOrders.toString()}
              trend="up"
              trendValue="10%"
              icon={<DocumentAdd size={24} />}
            />
          </Column>
          <Column lg={4} md={4} sm={4}>
            <KPIWidget
              title="High Collaboration"
              value={kpiData.highCollaboration.toString()}
              trend="up"
              trendValue="8%"
              icon={<Network_3 size={24} />}
            />
          </Column>
          <Column lg={4} md={4} sm={4}>
            <KPIWidget
              title="Avg Rating"
              value={kpiData.avgRating.toFixed(1)}
              trend="up"
              trendValue="3%"
              icon={<Chat size={24} />}
            />
          </Column>

          {/* Vendor Directory */}
          <Column lg={16} style={{ marginTop: '2rem' }}>
            <Tile style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3>Vendor Directory</h3>
                <Button kind="primary" renderIcon={Add}>
                  Add Vendor
                </Button>
              </div>

              <DataTable rows={[]} headers={[]}>
                {() => (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableHeader>Vendor Name</TableHeader>
                          <TableHeader>Category</TableHeader>
                          <TableHeader>Status</TableHeader>
                          <TableHeader>Last Communication</TableHeader>
                          <TableHeader>Open Orders</TableHeader>
                          <TableHeader>Collaboration</TableHeader>
                          <TableHeader>Rating</TableHeader>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {vendors.map((vendor) => (
                          <TableRow key={vendor.id}>
                            <TableCell>{vendor.name}</TableCell>
                            <TableCell>{vendor.category}</TableCell>
                            <TableCell>
                              <Tag type={getStatusColor(vendor.status)}>
                                {vendor.status}
                              </Tag>
                            </TableCell>
                            <TableCell>{vendor.lastCommunication}</TableCell>
                            <TableCell>{vendor.openOrders}</TableCell>
                            <TableCell>{vendor.collaboration}</TableCell>
                            <TableCell>{vendor.rating.toFixed(1)} ⭐</TableCell>
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

export default VendorCollaborationPortal;
