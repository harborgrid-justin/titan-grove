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
  Modal,
  TextInput,
  NumberInput
} from '@carbon/react';
import {
  Delivery,
  Location,
  TrendUp,
  TrendDown,
  Time,
  Add,
  View,
  Map
} from '@carbon/icons-react';
import Sidebar from '../../components/Sidebar';
import KPIWidget from '../../components/KPIWidget';

interface Shipment {
  id: string;
  trackingNumber: string;
  origin: string;
  destination: string;
  status: 'In Transit' | 'Delivered' | 'Delayed' | 'Pending';
  eta: string;
  carrier: string;
  weight: number;
  cost: number;
}

const LogisticsCommandCenter: React.FC = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showShipmentModal, setShowShipmentModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('All');

  useEffect(() => {
    loadShipmentData();
  }, []);

  const loadShipmentData = () => {
    setTimeout(() => {
      setShipments([
        {
          id: 'ship-1',
          trackingNumber: 'TRK-001-2024',
          origin: 'Warehouse A - New York',
          destination: 'Distribution Center - Chicago',
          status: 'In Transit',
          eta: '2024-03-25 14:30',
          carrier: 'FedEx',
          weight: 1250.5,
          cost: 485.50
        },
        {
          id: 'ship-2',
          trackingNumber: 'TRK-002-2024',
          origin: 'Factory - Los Angeles',
          destination: 'Retail Store - Seattle',
          status: 'Delivered',
          eta: '2024-03-24 10:15',
          carrier: 'UPS',
          weight: 850.0,
          cost: 325.75
        },
        {
          id: 'ship-3',
          trackingNumber: 'TRK-003-2024',
          origin: 'Supplier - Houston',
          destination: 'Warehouse B - Dallas',
          status: 'Delayed',
          eta: '2024-03-26 09:00',
          carrier: 'DHL',
          weight: 2100.8,
          cost: 675.25
        },
        {
          id: 'ship-4',
          trackingNumber: 'TRK-004-2024',
          origin: 'Distribution Center - Boston',
          destination: 'Customer - Miami',
          status: 'In Transit',
          eta: '2024-03-25 16:45',
          carrier: 'FedEx',
          weight: 425.3,
          cost: 198.50
        }
      ]);
      setLoading(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'green';
      case 'In Transit': return 'blue';
      case 'Delayed': return 'red';
      case 'Pending': return 'gray';
      default: return 'gray';
    }
  };

  const filteredShipments = selectedStatus === 'All'
    ? shipments
    : shipments.filter(s => s.status === selectedStatus);

  const kpiData = {
    activeShipments: shipments.filter(s => s.status === 'In Transit').length,
    deliveredToday: shipments.filter(s => s.status === 'Delivered').length,
    delayedShipments: shipments.filter(s => s.status === 'Delayed').length,
    totalCost: shipments.reduce((sum, s) => sum + s.cost, 0)
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Loading description="Loading logistics data..." withOverlay={false} />
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
              <Delivery size={32} />
              Logistics Command Center
            </h1>
            <p style={{ marginBottom: '2rem', color: '#525252' }}>
              Real-time logistics tracking and route optimization
            </p>
          </Column>

          {/* KPI Widgets */}
          <Column lg={4} md={4} sm={4}>
            <KPIWidget
              title="Active Shipments"
              value={kpiData.activeShipments.toString()}
              trend="up"
              trendValue="8%"
              icon={<Delivery size={24} />}
            />
          </Column>
          <Column lg={4} md={4} sm={4}>
            <KPIWidget
              title="Delivered Today"
              value={kpiData.deliveredToday.toString()}
              trend="up"
              trendValue="12%"
              icon={<Location size={24} />}
            />
          </Column>
          <Column lg={4} md={4} sm={4}>
            <KPIWidget
              title="Delayed Shipments"
              value={kpiData.delayedShipments.toString()}
              trend="down"
              trendValue="3%"
              icon={<Time size={24} />}
            />
          </Column>
          <Column lg={4} md={4} sm={4}>
            <KPIWidget
              title="Total Cost"
              value={`$${kpiData.totalCost.toFixed(2)}`}
              trend="neutral"
              trendValue="0%"
              icon={<TrendUp size={24} />}
            />
          </Column>

          {/* Shipment Management */}
          <Column lg={16} style={{ marginTop: '2rem' }}>
            <Tile style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3>Active Shipments</h3>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <Select
                    id="status-filter"
                    labelText=""
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    <SelectItem value="All" text="All Status" />
                    <SelectItem value="In Transit" text="In Transit" />
                    <SelectItem value="Delivered" text="Delivered" />
                    <SelectItem value="Delayed" text="Delayed" />
                    <SelectItem value="Pending" text="Pending" />
                  </Select>
                  <Button
                    kind="primary"
                    renderIcon={Add}
                    onClick={() => setShowShipmentModal(true)}
                  >
                    New Shipment
                  </Button>
                </div>
              </div>

              <DataTable rows={[]} headers={[]}>
                {() => (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableHeader>Tracking Number</TableHeader>
                          <TableHeader>Origin</TableHeader>
                          <TableHeader>Destination</TableHeader>
                          <TableHeader>Status</TableHeader>
                          <TableHeader>ETA</TableHeader>
                          <TableHeader>Carrier</TableHeader>
                          <TableHeader>Weight (kg)</TableHeader>
                          <TableHeader>Cost</TableHeader>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredShipments.map((shipment) => (
                          <TableRow key={shipment.id}>
                            <TableCell>{shipment.trackingNumber}</TableCell>
                            <TableCell>{shipment.origin}</TableCell>
                            <TableCell>{shipment.destination}</TableCell>
                            <TableCell>
                              <Tag type={getStatusColor(shipment.status)}>
                                {shipment.status}
                              </Tag>
                            </TableCell>
                            <TableCell>{shipment.eta}</TableCell>
                            <TableCell>{shipment.carrier}</TableCell>
                            <TableCell>{shipment.weight.toFixed(1)}</TableCell>
                            <TableCell>${shipment.cost.toFixed(2)}</TableCell>
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

        {/* New Shipment Modal */}
        <Modal
          open={showShipmentModal}
          onRequestClose={() => setShowShipmentModal(false)}
          modalHeading="Create New Shipment"
          primaryButtonText="Create Shipment"
          secondaryButtonText="Cancel"
        >
          <div style={{ marginBottom: '1rem' }}>
            <TextInput
              id="tracking-number"
              labelText="Tracking Number"
              placeholder="Enter tracking number"
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <TextInput
              id="origin"
              labelText="Origin"
              placeholder="Enter origin location"
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <TextInput
              id="destination"
              labelText="Destination"
              placeholder="Enter destination location"
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <Select id="carrier" labelText="Carrier">
              <SelectItem value="FedEx" text="FedEx" />
              <SelectItem value="UPS" text="UPS" />
              <SelectItem value="DHL" text="DHL" />
              <SelectItem value="USPS" text="USPS" />
            </Select>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default LogisticsCommandCenter;
