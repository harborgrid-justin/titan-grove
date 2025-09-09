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
  FaceNeutral,
  FaceWink,
  FaceSad,
  Analytics,
  Time,
  TrendUp,
  TrendDown,
  Email,
  Phone
} from '@carbon/icons-react';
import Sidebar from '../../components/Sidebar';
import KPIWidget from '../../components/KPIWidget';

interface SentimentData {
  id: string;
  customerId: string;
  customerName: string;
  channel: 'email' | 'phone' | 'chat' | 'social' | 'survey';
  sentiment: 'positive' | 'neutral' | 'negative';
  score: number;
  text: string;
  timestamp: string;
  category: 'product' | 'service' | 'support' | 'billing' | 'general';
  resolved: boolean;
}

interface SentimentTrend {
  date: string;
  positive: number;
  neutral: number;
  negative: number;
  total: number;
}

const CustomerSentimentAnalysis: React.FC = () => {
  const [sentiments, setSentiments] = useState<SentimentData[]>([]);
  const [trends, setTrends] = useState<SentimentTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChannel, setSelectedChannel] = useState('All');
  const [selectedSentiment, setSelectedSentiment] = useState('All');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<SentimentData | null>(null);

  useEffect(() => {
    loadSentimentData();
  }, []);

  const loadSentimentData = () => {
    setTimeout(() => {
      setSentiments([
        {
          id: 'sent-1',
          customerId: 'cust-001',
          customerName: 'Acme Corporation',
          channel: 'email',
          sentiment: 'positive',
          score: 0.85,
          text: 'Excellent service and quick response time. Very satisfied with the product quality.',
          timestamp: new Date().toISOString(),
          category: 'service',
          resolved: true
        },
        {
          id: 'sent-2',
          customerId: 'cust-002',
          customerName: 'TechStart Inc',
          channel: 'chat',
          sentiment: 'negative',
          score: -0.72,
          text: 'Disappointed with the recent update. Several features are not working as expected.',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          category: 'product',
          resolved: false
        },
        {
          id: 'sent-3',
          customerId: 'cust-003',
          customerName: 'Global Industries',
          channel: 'survey',
          sentiment: 'neutral',
          score: 0.15,
          text: 'The product meets our needs but there is room for improvement in documentation.',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          category: 'support',
          resolved: false
        },
        {
          id: 'sent-4',
          customerId: 'cust-004',
          customerName: 'Innovate LLC',
          channel: 'social',
          sentiment: 'positive',
          score: 0.91,
          text: 'Amazing customer support team! They resolved our issue within hours.',
          timestamp: new Date(Date.now() - 10800000).toISOString(),
          category: 'support',
          resolved: true
        },
        {
          id: 'sent-5',
          customerId: 'cust-005',
          customerName: 'Future Corp',
          channel: 'phone',
          sentiment: 'negative',
          score: -0.68,
          text: 'Billing issues persist despite multiple contacts. Very frustrating experience.',
          timestamp: new Date(Date.now() - 14400000).toISOString(),
          category: 'billing',
          resolved: false
        }
      ]);

      setTrends([
        {
          date: '2024-01-15',
          positive: 45,
          neutral: 30,
          negative: 25,
          total: 100
        },
        {
          date: '2024-01-14',
          positive: 52,
          neutral: 28,
          negative: 20,
          total: 95
        },
        {
          date: '2024-01-13',
          positive: 48,
          neutral: 32,
          negative: 20,
          total: 88
        }
      ]);

      setLoading(false);
    }, 1500);
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <FaceWink size={16} style={{ color: 'var(--cds-support-02)' }} />;
      case 'negative': return <FaceSad size={16} style={{ color: 'var(--cds-support-01)' }} />;
      default: return <FaceNeutral size={16} style={{ color: 'var(--cds-support-03)' }} />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'var(--cds-support-02)';
      case 'negative': return 'var(--cds-support-01)';
      default: return 'var(--cds-support-03)';
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email': return <Email size={16} />;
      case 'phone': return <Phone size={16} />;
      default: return null;
    }
  };

  const filteredSentiments = sentiments.filter(sentiment => {
    if (selectedChannel !== 'All' && sentiment.channel !== selectedChannel) return false;
    if (selectedSentiment !== 'All' && sentiment.sentiment !== selectedSentiment) return false;
    return true;
  });

  const overallScore = sentiments.length > 0 
    ? sentiments.reduce((sum, s) => sum + s.score, 0) / sentiments.length 
    : 0;

  const positiveCount = sentiments.filter(s => s.sentiment === 'positive').length;
  const negativeCount = sentiments.filter(s => s.sentiment === 'negative').length;
  const neutralCount = sentiments.filter(s => s.sentiment === 'neutral').length;

  const kpiData = [
    {
      title: 'Overall Sentiment',
      value: overallScore > 0 ? 'Positive' : overallScore < 0 ? 'Negative' : 'Neutral',
      change: 12.5,
      format: 'text' as const
    },
    {
      title: 'Sentiment Score',
      value: (overallScore * 100).toFixed(1),
      change: 8.3,
      format: 'number' as const
    },
    {
      title: 'Positive Feedback',
      value: `${((positiveCount / sentiments.length) * 100).toFixed(1)}%`,
      change: 15.2,
      format: 'percentage' as const
    },
    {
      title: 'Resolution Rate',
      value: `${((sentiments.filter(s => s.resolved).length / sentiments.length) * 100).toFixed(1)}%`,
      change: 5.7,
      format: 'percentage' as const
    }
  ];

  const headers = [
    { key: 'customer', header: 'Customer' },
    { key: 'channel', header: 'Channel' },
    { key: 'sentiment', header: 'Sentiment' },
    { key: 'score', header: 'Score' },
    { key: 'category', header: 'Category' },
    { key: 'timestamp', header: 'Time' },
    { key: 'status', header: 'Status' },
    { key: 'actions', header: 'Actions' }
  ];

  const rows = filteredSentiments.map(sentiment => ({
    id: sentiment.id,
    customer: sentiment.customerName,
    channel: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {getChannelIcon(sentiment.channel)}
        {sentiment.channel}
      </div>
    ),
    sentiment: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {getSentimentIcon(sentiment.sentiment)}
        <Tag style={{ backgroundColor: getSentimentColor(sentiment.sentiment) }}>
          {sentiment.sentiment.toUpperCase()}
        </Tag>
      </div>
    ),
    score: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <ProgressBar 
          value={Math.abs(sentiment.score) * 100} 
          size="sm"
          type={sentiment.score >= 0 ? 'success' : 'error'}
        />
        <span style={{ 
          fontSize: '0.75rem',
          color: sentiment.score >= 0 ? 'var(--cds-support-02)' : 'var(--cds-support-01)'
        }}>
          {(sentiment.score * 100).toFixed(0)}
        </span>
      </div>
    ),
    category: sentiment.category,
    timestamp: new Date(sentiment.timestamp).toLocaleTimeString(),
    status: (
      <Tag type={sentiment.resolved ? 'green' : 'red'}>
        {sentiment.resolved ? 'RESOLVED' : 'OPEN'}
      </Tag>
    ),
    actions: (
      <Button 
        size="sm" 
        kind="ghost"
        onClick={() => {
          setSelectedFeedback(sentiment);
          setShowDetailModal(true);
        }}
      >
        View Details
      </Button>
    )
  }));

  if (loading) {
    return (
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{ flex: 1, padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Loading description="Loading sentiment analysis..." />
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
            <FaceWink size={32} />
            Customer Sentiment Analysis
          </h1>
          <p style={{ color: 'var(--cds-text-02)', marginBottom: '1rem' }}>
            Monitor and analyze customer sentiment across all touchpoints using AI-powered insights
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Select
              id="channel-filter"
              labelText=""
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
              size="sm"
            >
              <SelectItem value="All" text="All Channels" />
              <SelectItem value="email" text="Email" />
              <SelectItem value="phone" text="Phone" />
              <SelectItem value="chat" text="Chat" />
              <SelectItem value="social" text="Social Media" />
              <SelectItem value="survey" text="Survey" />
            </Select>
            
            <Select
              id="sentiment-filter"
              labelText=""
              value={selectedSentiment}
              onChange={(e) => setSelectedSentiment(e.target.value)}
              size="sm"
            >
              <SelectItem value="All" text="All Sentiments" />
              <SelectItem value="positive" text="Positive" />
              <SelectItem value="neutral" text="Neutral" />
              <SelectItem value="negative" text="Negative" />
            </Select>
            
            <Button kind="primary" renderIcon={Analytics}>
              Generate Report
            </Button>
            
            <Button kind="secondary" renderIcon={TrendUp}>
              Sentiment Trends
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
          <Column lg={9} md={6} sm={4}>
            <Tile style={{ padding: '1.5rem' }}>
              <h3 style={{ 
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <FaceWink size={20} />
                Customer Feedback Analysis
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

          <Column lg={3} md={2} sm={4}>
            <Tile style={{ padding: '1.5rem', marginBottom: '1rem' }}>
              <h4 style={{ marginBottom: '1rem' }}>Sentiment Distribution</h4>
              
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.875rem' }}>Positive</span>
                  <span style={{ fontSize: '0.875rem' }}>{positiveCount}</span>
                </div>
                <ProgressBar 
                  value={(positiveCount / sentiments.length) * 100} 
                  size="sm"
                  type="success"
                />
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.875rem' }}>Neutral</span>
                  <span style={{ fontSize: '0.875rem' }}>{neutralCount}</span>
                </div>
                <ProgressBar 
                  value={(neutralCount / sentiments.length) * 100} 
                  size="sm"
                />
              </div>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.875rem' }}>Negative</span>
                  <span style={{ fontSize: '0.875rem' }}>{negativeCount}</span>
                </div>
                <ProgressBar 
                  value={(negativeCount / sentiments.length) * 100} 
                  size="sm"
                  type="error"
                />
              </div>
            </Tile>
            
            <Tile style={{ padding: '1.5rem' }}>
              <h4 style={{ marginBottom: '1rem' }}>AI Insights</h4>
              <div style={{ fontSize: '0.875rem', color: 'var(--cds-text-02)' }}>
                <div style={{ marginBottom: '0.5rem' }}>
                  • 85% of negative feedback relates to billing issues
                </div>
                <div style={{ marginBottom: '0.5rem' }}>
                  • Response time improved sentiment by 23%
                </div>
                <div>
                  • Social media shows highest satisfaction scores
                </div>
              </div>
            </Tile>
          </Column>
        </Grid>

        <Modal
          open={showDetailModal}
          onRequestClose={() => setShowDetailModal(false)}
          modalHeading="Feedback Details"
          primaryButtonText="Mark as Resolved"
          secondaryButtonText="Close"
          onRequestSubmit={() => {
            if (selectedFeedback) {
              setSentiments(prev => prev.map(s => 
                s.id === selectedFeedback.id ? { ...s, resolved: true } : s
              ));
            }
            setShowDetailModal(false);
          }}
        >
          {selectedFeedback && (
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <strong>Customer:</strong> {selectedFeedback.customerName}
              </div>
              <div>
                <strong>Channel:</strong> {selectedFeedback.channel}
              </div>
              <div>
                <strong>Category:</strong> {selectedFeedback.category}
              </div>
              <div>
                <strong>Sentiment Score:</strong> {(selectedFeedback.score * 100).toFixed(1)}
              </div>
              <div>
                <strong>Feedback:</strong>
                <div style={{ 
                  marginTop: '0.5rem',
                  padding: '0.75rem',
                  backgroundColor: 'var(--cds-layer-01)',
                  borderRadius: '0.25rem',
                  fontStyle: 'italic'
                }}>
                  "{selectedFeedback.text}"
                </div>
              </div>
              <div>
                <strong>Status:</strong> {selectedFeedback.resolved ? 'Resolved' : 'Open'}
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default CustomerSentimentAnalysis;