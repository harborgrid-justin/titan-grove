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
  Modal,
  TextInput,
  NumberInput,
  TextArea,
  Tag,
  ProgressBar
} from '@carbon/react';
import {
  DocumentAdd,
  Money,
  Analytics,
  Calculator,
  Add,
  Edit,
  View,
  Send
} from '@carbon/icons-react';
import Sidebar from '../../components/Sidebar';
import KPIWidget from '../../components/KPIWidget';

interface QuoteItem {
  id: string;
  product: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
}

interface Quote {
  id: string;
  customer: string;
  status: 'Draft' | 'Sent' | 'Approved' | 'Rejected' | 'Expired';
  total: number;
  validUntil: string;
  createdBy: string;
  createdDate: string;
  items: QuoteItem[];
  probability: number;
}

const QuoteConfigurationSystem: React.FC = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('All');

  const [quoteForm, setQuoteForm] = useState({
    customer: '',
    validDays: 30,
    items: [] as QuoteItem[]
  });

  useEffect(() => {
    loadQuoteData();
  }, []);

  const loadQuoteData = () => {
    setTimeout(() => {
      setQuotes([
        {
          id: 'quote-1',
          customer: 'Acme Corporation',
          status: 'Sent',
          total: 125000,
          validUntil: '2024-02-15',
          createdBy: 'John Smith',
          createdDate: new Date().toISOString(),
          items: [
            {
              id: 'item-1',
              product: 'Enterprise License',
              quantity: 1,
              unitPrice: 100000,
              discount: 10,
              total: 90000
            },
            {
              id: 'item-2',
              product: 'Support Package',
              quantity: 1,
              unitPrice: 35000,
              discount: 0,
              total: 35000
            }
          ],
          probability: 75
        },
        {
          id: 'quote-2',
          customer: 'TechStart Inc',
          status: 'Draft',
          total: 75000,
          validUntil: '2024-03-01',
          createdBy: 'Sarah Johnson',
          createdDate: new Date(Date.now() - 86400000).toISOString(),
          items: [
            {
              id: 'item-3',
              product: 'Professional Services',
              quantity: 50,
              unitPrice: 1500,
              discount: 0,
              total: 75000
            }
          ],
          probability: 45
        }
      ]);
      setLoading(false);
    }, 1500);
  };

  const createQuote = () => {
    const newQuote: Quote = {
      id: `quote-${Date.now()}`,
      customer: quoteForm.customer,
      status: 'Draft',
      total: 0,
      validUntil: new Date(Date.now() + quoteForm.validDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      createdBy: 'Current User',
      createdDate: new Date().toISOString(),
      items: [],
      probability: 50
    };

    setQuotes(prev => [...prev, newQuote]);
    setShowQuoteModal(false);
    setQuoteForm({
      customer: '',
      validDays: 30,
      items: []
    });
  };

  const filteredQuotes = selectedStatus === 'All' 
    ? quotes 
    : quotes.filter(quote => quote.status === selectedStatus);

  const kpiData = [
    {
      title: 'Total Quote Value',
      value: `$${quotes.reduce((sum, q) => sum + q.total, 0).toLocaleString()}`,
      change: 18.5,
      format: 'currency' as const
    },
    {
      title: 'Active Quotes',
      value: quotes.filter(q => q.status !== 'Rejected' && q.status !== 'Expired').length.toString(),
      change: 12.3,
      format: 'number' as const
    },
    {
      title: 'Avg Quote Size',
      value: `$${Math.round(quotes.reduce((sum, q) => sum + q.total, 0) / quotes.length).toLocaleString()}`,
      change: 8.7,
      format: 'currency' as const
    },
    {
      title: 'Win Rate',
      value: `${((quotes.filter(q => q.status === 'Approved').length / quotes.length) * 100).toFixed(1)}%`,
      change: 15.2,
      format: 'percentage' as const
    }
  ];

  const headers = [
    { key: 'customer', header: 'Customer' },
    { key: 'total', header: 'Total Value' },
    { key: 'status', header: 'Status' },
    { key: 'probability', header: 'Probability' },
    { key: 'validUntil', header: 'Valid Until' },
    { key: 'createdBy', header: 'Created By' },
    { key: 'actions', header: 'Actions' }
  ];

  const rows = filteredQuotes.map(quote => ({
    id: quote.id,
    customer: quote.customer,
    total: `$${quote.total.toLocaleString()}`,
    status: (
      <Tag type={
        quote.status === 'Approved' ? 'green' :
        quote.status === 'Sent' ? 'blue' :
        quote.status === 'Draft' ? 'gray' :
        quote.status === 'Rejected' ? 'red' : 'yellow'
      }>
        {quote.status}
      </Tag>
    ),
    probability: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <ProgressBar value={quote.probability} size="sm" />
        <span style={{ fontSize: '0.75rem' }}>{quote.probability}%</span>
      </div>
    ),
    validUntil: quote.validUntil,
    createdBy: quote.createdBy,
    actions: (
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <Button size="sm" kind="primary" renderIcon={View}>
          View
        </Button>
        <Button size="sm" kind="secondary" renderIcon={Edit}>
          Edit
        </Button>
        <Button size="sm" kind="tertiary" renderIcon={Send}>
          Send
        </Button>
      </div>
    )
  }));

  if (loading) {
    return (
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{ flex: 1, padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Loading description="Loading quote system..." />
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
            <DocumentAdd size={32} />
            Quote Configuration System
          </h1>
          <p style={{ color: 'var(--cds-text-02)', marginBottom: '1rem' }}>
            Create, configure, and manage sales quotes with automated pricing and approval workflows
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Button 
              kind="primary" 
              renderIcon={Add}
              onClick={() => setShowQuoteModal(true)}
            >
              Create Quote
            </Button>
            
            <Button kind="secondary" renderIcon={Calculator}>
              Price Calculator
            </Button>
            
            <Select
              id="status-filter"
              labelText=""
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              size="sm"
            >
              <SelectItem value="All" text="All Status" />
              <SelectItem value="Draft" text="Draft" />
              <SelectItem value="Sent" text="Sent" />
              <SelectItem value="Approved" text="Approved" />
              <SelectItem value="Rejected" text="Rejected" />
            </Select>
            
            <Button kind="tertiary" renderIcon={Analytics}>
              Quote Analytics
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
                <DocumentAdd size={20} />
                Sales Quotes
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
          open={showQuoteModal}
          onRequestClose={() => setShowQuoteModal(false)}
          modalHeading="Create New Quote"
          primaryButtonText="Create Quote"
          secondaryButtonText="Cancel"
          onRequestSubmit={createQuote}
        >
          <div style={{ display: 'grid', gap: '1rem' }}>
            <TextInput
              id="quote-customer"
              labelText="Customer Name"
              value={quoteForm.customer}
              onChange={(e) => setQuoteForm(prev => ({ ...prev, customer: e.target.value }))}
              placeholder="Enter customer name"
            />
            
            <NumberInput
              id="valid-days"
              label="Valid for (days)"
              value={quoteForm.validDays}
              onChange={(e) => setQuoteForm(prev => ({ ...prev, validDays: Number(e.target.value) }))}
              min={1}
              max={365}
            />
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default QuoteConfigurationSystem;