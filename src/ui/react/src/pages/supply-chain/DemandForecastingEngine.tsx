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
  NumberInput
} from '@carbon/react';
import {
  Predict,
  Analytics,
  TrendUp,
  ChartLine,
  Add,
  View,
  Settings
} from '@carbon/icons-react';
import Sidebar from '../../components/Sidebar';
import KPIWidget from '../../components/KPIWidget';

interface DemandForecast {
  id: string;
  product: string;
  category: string;
  currentDemand: number;
  forecastedDemand: number;
  timeframe: string;
  accuracy: number;
  confidence: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  seasonality: boolean;
}

const DemandForecastingEngine: React.FC = () => {
  const [forecasts, setForecasts] = useState<DemandForecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForecastModal, setShowForecastModal] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('Next Month');

  const [forecastForm, setForecastForm] = useState({
    product: '',
    category: 'Electronics',
    timeframe: 'Next Month'
  });

  useEffect(() => {
    loadForecastData();
  }, []);

  const loadForecastData = () => {
    setTimeout(() => {
      setForecasts([
        {
          id: 'forecast-1',
          product: 'Laptop Model X',
          category: 'Electronics',
          currentDemand: 1250,
          forecastedDemand: 1420,
          timeframe: 'Next Month',
          accuracy: 91.2,
          confidence: 87.5,
          trend: 'increasing',
          seasonality: true
        },
        {
          id: 'forecast-2',
          product: 'Steel Components',
          category: 'Raw Materials',
          currentDemand: 850,
          forecastedDemand: 780,
          timeframe: 'Next Month',
          accuracy: 88.7,
          confidence: 82.3,
          trend: 'decreasing',
          seasonality: false
        },
        {
          id: 'forecast-3',
          product: 'Office Supplies',
          category: 'General',
          currentDemand: 2100,
          forecastedDemand: 2150,
          timeframe: 'Next Month',
          accuracy: 94.1,
          confidence: 91.8,
          trend: 'stable',
          seasonality: true
        }
      ]);
      setLoading(false);
    }, 1500);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <TrendUp size={16} style={{ color: 'var(--cds-support-02)' }} />;
      case 'decreasing': return <TrendUp size={16} style={{ color: 'var(--cds-support-01)', transform: 'rotate(180deg)' }} />;
      default: return <span style={{ color: 'var(--cds-text-02)' }}>→</span>;
    }
  };

  const createForecast = () => {
    const newForecast: DemandForecast = {
      id: `forecast-${Date.now()}`,
      ...forecastForm,
      currentDemand: 0,
      forecastedDemand: 0,
      accuracy: 0,
      confidence: 0,
      trend: 'stable',
      seasonality: false
    };

    setForecasts(prev => [...prev, newForecast]);
    setShowForecastModal(false);
    setForecastForm({
      product: '',
      category: 'Electronics',
      timeframe: 'Next Month'
    });
  };

  const filteredForecasts = selectedTimeframe === 'All' 
    ? forecasts 
    : forecasts.filter(forecast => forecast.timeframe === selectedTimeframe);

  const kpiData = [
    {
      title: 'Active Forecasts',
      value: forecasts.length.toString(),
      change: 12.5,
      format: 'number' as const
    },
    {
      title: 'Avg Accuracy',
      value: `${(forecasts.reduce((sum, f) => sum + f.accuracy, 0) / forecasts.length).toFixed(1)}%`,
      change: 8.7,
      format: 'percentage' as const
    },
    {
      title: 'High Confidence',
      value: forecasts.filter(f => f.confidence > 85).length.toString(),
      change: 15.2,
      format: 'number' as const
    },
    {
      title: 'Total Demand',
      value: forecasts.reduce((sum, f) => sum + f.forecastedDemand, 0).toLocaleString(),
      change: 22.1,
      format: 'number' as const
    }
  ];

  const headers = [
    { key: 'product', header: 'Product' },
    { key: 'category', header: 'Category' },
    { key: 'current', header: 'Current Demand' },
    { key: 'forecasted', header: 'Forecasted' },
    { key: 'trend', header: 'Trend' },
    { key: 'accuracy', header: 'Accuracy' },
    { key: 'confidence', header: 'Confidence' },
    { key: 'actions', header: 'Actions' }
  ];

  const rows = filteredForecasts.map(forecast => ({
    id: forecast.id,
    product: forecast.product,
    category: forecast.category,
    current: forecast.currentDemand.toLocaleString(),
    forecasted: forecast.forecastedDemand.toLocaleString(),
    trend: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {getTrendIcon(forecast.trend)}
        <span style={{ fontSize: '0.875rem' }}>
          {forecast.trend}
        </span>
      </div>
    ),
    accuracy: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <ProgressBar value={forecast.accuracy} size="sm" />
        <span style={{ fontSize: '0.75rem' }}>{forecast.accuracy.toFixed(1)}%</span>
      </div>
    ),
    confidence: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <ProgressBar value={forecast.confidence} size="sm" />
        <span style={{ fontSize: '0.75rem' }}>{forecast.confidence.toFixed(1)}%</span>
      </div>
    ),
    actions: (
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <Button size="sm" kind="primary" renderIcon={View}>
          View
        </Button>
        <Button size="sm" kind="secondary" renderIcon={Analytics}>
          Analyze
        </Button>
      </div>
    )
  }));

  if (loading) {
    return (
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{ flex: 1, padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Loading description="Loading demand forecasts..." />
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
            <Predict size={32} />
            Demand Forecasting Engine
          </h1>
          <p style={{ color: 'var(--cds-text-02)', marginBottom: '1rem' }}>
            AI-powered demand forecasting with machine learning algorithms and trend analysis
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Select
              id="timeframe-filter"
              labelText=""
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              size="sm"
            >
              <SelectItem value="All" text="All Timeframes" />
              <SelectItem value="Next Month" text="Next Month" />
              <SelectItem value="Next Quarter" text="Next Quarter" />
              <SelectItem value="Next Year" text="Next Year" />
            </Select>
            
            <Button 
              kind="primary" 
              renderIcon={Add}
              onClick={() => setShowForecastModal(true)}
            >
              Create Forecast
            </Button>
            
            <Button kind="secondary" renderIcon={ChartLine}>
              Trend Analysis
            </Button>
            
            <Button kind="tertiary" renderIcon={Settings}>
              Model Settings
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
                <Predict size={20} />
                Demand Forecasts
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
          open={showForecastModal}
          onRequestClose={() => setShowForecastModal(false)}
          modalHeading="Create Demand Forecast"
          primaryButtonText="Create Forecast"
          secondaryButtonText="Cancel"
          onRequestSubmit={createForecast}
        >
          <div style={{ display: 'grid', gap: '1rem' }}>
            <TextInput
              id="forecast-product"
              labelText="Product Name"
              value={forecastForm.product}
              onChange={(e) => setForecastForm(prev => ({ ...prev, product: e.target.value }))}
              placeholder="Enter product name"
            />
            
            <Select
              id="forecast-category"
              labelText="Category"
              value={forecastForm.category}
              onChange={(e) => setForecastForm(prev => ({ ...prev, category: e.target.value }))}
            >
              <SelectItem value="Electronics" text="Electronics" />
              <SelectItem value="Raw Materials" text="Raw Materials" />
              <SelectItem value="General" text="General" />
            </Select>
            
            <Select
              id="forecast-timeframe"
              labelText="Timeframe"
              value={forecastForm.timeframe}
              onChange={(e) => setForecastForm(prev => ({ ...prev, timeframe: e.target.value }))}
            >
              <SelectItem value="Next Month" text="Next Month" />
              <SelectItem value="Next Quarter" text="Next Quarter" />
              <SelectItem value="Next Year" text="Next Year" />
            </Select>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default DemandForecastingEngine;