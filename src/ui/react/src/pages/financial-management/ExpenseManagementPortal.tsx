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
  Select,
  SelectItem
} from '@carbon/react';
import {
  Receipt,
  Money,
  Analytics,
  ArrowDown,
  Add
} from '@carbon/icons-react';
import Sidebar from '../../components/Sidebar';
import KPIWidget from '../../components/KPIWidget';

interface Purchase {
  id: string;
  description: string;
  category: string;
  amount: number;
  date: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  department: string;
  submittedBy: string;
}

const ExpenseManagementPortal: React.FC = () => {
  const [expenses, setExpenses] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('All');

  useEffect(() => {
    loadExpenseData();
  }, []);

  const loadExpenseData = () => {
    setTimeout(() => {
      setExpenses([
        {
          id: 'exp-1',
          description: 'Travel - Client Meeting',
          category: 'Travel',
          amount: 1250,
          date: '2024-03-20',
          status: 'Approved',
          department: 'Sales',
          submittedBy: 'John Smith'
        },
        {
          id: 'exp-2',
          description: 'Office Supplies',
          category: 'Operations',
          amount: 450,
          date: '2024-03-21',
          status: 'Approved',
          department: 'Admin',
          submittedBy: 'Jane Doe'
        },
        {
          id: 'exp-3',
          description: 'Software License',
          category: 'IT',
          amount: 2500,
          date: '2024-03-22',
          status: 'Pending',
          department: 'Technology',
          submittedBy: 'Mike Johnson'
        },
        {
          id: 'exp-4',
          description: 'Marketing Campaign',
          category: 'Marketing',
          amount: 5000,
          date: '2024-03-23',
          status: 'Pending',
          department: 'Marketing',
          submittedBy: 'Sarah Williams'
        }
      ]);
      setLoading(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'green';
      case 'Pending': return 'yellow';
      case 'Rejected': return 'red';
      default: return 'gray';
    }
  };

  const filteredExpenses = selectedStatus === 'All'
    ? expenses
    : expenses.filter(e => e.status === selectedStatus);

  const kpiData = {
    totalExpenses: expenses.reduce((sum, e) => sum + e.amount, 0),
    pendingExpenses: expenses.filter(e => e.status === 'Pending').length,
    approvedExpenses: expenses.filter(e => e.status === 'Approved').length,
    avgExpense: expenses.reduce((sum, e) => sum + e.amount, 0) / expenses.length
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Loading description="Loading expense data..." withOverlay={false} />
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
              <Receipt size={32} />
              Purchase Management Portal
            </h1>
            <p style={{ marginBottom: '2rem', color: '#525252' }}>
              Track, approve, and manage organizational expenses
            </p>
          </Column>

          <Column lg={4} md={4} sm={4}>
            <KPIWidget
              title="Total Expenses"
              value={`$${kpiData.totalExpenses.toLocaleString()}`}
              trend="down"
              trendValue="5%"
              icon={<Money size={24} />}
            />
          </Column>
          <Column lg={4} md={4} sm={4}>
            <KPIWidget
              title="Pending Approval"
              value={kpiData.pendingExpenses.toString()}
              trend="neutral"
              trendValue="0%"
              icon={<Receipt size={24} />}
            />
          </Column>
          <Column lg={4} md={4} sm={4}>
            <KPIWidget
              title="Approved"
              value={kpiData.approvedExpenses.toString()}
              trend="up"
              trendValue="8%"
              icon={<Analytics size={24} />}
            />
          </Column>
          <Column lg={4} md={4} sm={4}>
            <KPIWidget
              title="Avg Purchase"
              value={`$${kpiData.avgExpense.toFixed(0)}`}
              trend="down"
              trendValue="3%"
              icon={<ArrowDown size={24} />}
            />
          </Column>

          <Column lg={16} style={{ marginTop: '2rem' }}>
            <Tile style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3>Purchase Reports</h3>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <Select
                    id="status-filter"
                    labelText=""
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    <SelectItem value="All" text="All Status" />
                    <SelectItem value="Approved" text="Approved" />
                    <SelectItem value="Pending" text="Pending" />
                    <SelectItem value="Rejected" text="Rejected" />
                  </Select>
                  <Button kind="primary" renderIcon={Add}>
                    Submit Purchase
                  </Button>
                </div>
              </div>

              <DataTable rows={[]} headers={[]}>
                {() => (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableHeader>Description</TableHeader>
                          <TableHeader>Category</TableHeader>
                          <TableHeader>Amount</TableHeader>
                          <TableHeader>Date</TableHeader>
                          <TableHeader>Status</TableHeader>
                          <TableHeader>Department</TableHeader>
                          <TableHeader>Submitted By</TableHeader>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredExpenses.map((expense) => (
                          <TableRow key={expense.id}>
                            <TableCell>{expense.description}</TableCell>
                            <TableCell>{expense.category}</TableCell>
                            <TableCell>${expense.amount.toLocaleString()}</TableCell>
                            <TableCell>{expense.date}</TableCell>
                            <TableCell>
                              <Tag type={getStatusColor(expense.status)}>
                                {expense.status}
                              </Tag>
                            </TableCell>
                            <TableCell>{expense.department}</TableCell>
                            <TableCell>{expense.submittedBy}</TableCell>
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

export default ExpenseManagementPortal;
