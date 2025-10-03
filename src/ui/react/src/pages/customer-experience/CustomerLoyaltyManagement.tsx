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
  Trophy,
  Gift,
  Analytics,
  ArrowUp,
  Add,
  View
} from '@carbon/icons-react';
import Sidebar from '../../components/Sidebar';
import KPIWidget from '../../components/KPIWidget';

interface LoyaltyMember {
  id: string;
  customerName: string;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  points: number;
  lifetimeValue: number;
  joinDate: string;
  lastActivity: string;
  engagementScore: number;
}

const CustomerLoyaltyManagement: React.FC = () => {
  const [members, setMembers] = useState<LoyaltyMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLoyaltyData();
  }, []);

  const loadLoyaltyData = () => {
    setTimeout(() => {
      setMembers([
        {
          id: 'mem-1',
          customerName: 'Acme Corporation',
          tier: 'Platinum',
          points: 15420,
          lifetimeValue: 250000,
          joinDate: '2023-01-15',
          lastActivity: new Date().toISOString(),
          engagementScore: 92
        },
        {
          id: 'mem-2',
          customerName: 'TechStart Inc',
          tier: 'Gold',
          points: 8750,
          lifetimeValue: 125000,
          joinDate: '2023-03-22',
          lastActivity: new Date(Date.now() - 86400000).toISOString(),
          engagementScore: 78
        }
      ]);
      setLoading(false);
    }, 1500);
  };

  const kpiData = [
    {
      title: 'Active Members',
      value: members.length.toString(),
      change: 15.2,
      format: 'number' as const
    },
    {
      title: 'Avg Engagement',
      value: `${(members.reduce((sum, m) => sum + m.engagementScore, 0) / members.length).toFixed(1)}%`,
      change: 8.7,
      format: 'percentage' as const
    },
    {
      title: 'Total Points',
      value: members.reduce((sum, m) => sum + m.points, 0).toLocaleString(),
      change: 22.1,
      format: 'number' as const
    },
    {
      title: 'Retention Rate',
      value: '94.5%',
      change: 12.3,
      format: 'percentage' as const
    }
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{ flex: 1, padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Loading description="Loading loyalty data..." />
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
            <Trophy size={32} />
            Customer FavoriteFilled Management
          </h1>
          <p style={{ color: 'var(--cds-text-02)', marginBottom: '1rem' }}>
            Manage customer loyalty programs, rewards, and engagement initiatives
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Button kind="primary" renderIcon={Add}>
              Add UserMultiple
            </Button>
            <Button kind="secondary" renderIcon={Gift}>
              Gift Campaigns
            </Button>
            <Button kind="tertiary" renderIcon={Analytics}>
              FavoriteFilled Analytics
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
              <h3 style={{ marginBottom: '1rem' }}>FavoriteFilled Members</h3>
              <DataTable 
                rows={members.map(member => ({
                  id: member.id,
                  customerName: member.customerName,
                  tier: (
                    <Tag type={
                      member.tier === 'Platinum' ? 'purple' :
                      member.tier === 'Gold' ? 'yellow' :
                      member.tier === 'Silver' ? 'gray' : 'blue'
                    }>
                      {member.tier}
                    </Tag>
                  ),
                  points: member.points.toLocaleString(),
                  lifetimeValue: `$${member.lifetimeValue.toLocaleString()}`,
                  engagement: (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <ProgressBar value={member.engagementScore} size="sm" />
                      <span style={{ fontSize: '0.75rem' }}>{member.engagementScore}%</span>
                    </div>
                  ),
                  actions: (
                    <Button size="sm" kind="ghost" renderIcon={View}>
                      View Profile
                    </Button>
                  )
                }))} 
                headers={[
                  { key: 'customerName', header: 'Customer' },
                  { key: 'tier', header: 'Tier' },
                  { key: 'points', header: 'Points' },
                  { key: 'lifetimeValue', header: 'Lifetime Value' },
                  { key: 'engagement', header: 'Engagement' },
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

export default CustomerLoyaltyManagement;