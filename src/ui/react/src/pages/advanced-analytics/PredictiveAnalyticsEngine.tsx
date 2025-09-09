import React, { useState, useEffect } from 'react';
import {
  Grid,
  Column,
  Tile,
  Button,
  Loading,
  Select,
  SelectItem,
  NumberInput,
  Dropdown,
  DataTable,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  ProgressBar,
  Modal,
  TextInput,
  TextArea
} from '@carbon/react';
import {
  MachineLearningModel,
  Analytics,
  ChartScatter,
  Prediction,
  Time,
  Settings,
  Play,
  Stop
} from '@carbon/icons-react';
import Sidebar from '../../components/Sidebar';
import KPIWidget from '../../components/KPIWidget';

interface PredictionModel {
  id: string;
  name: string;
  type: 'Sales' | 'Demand' | 'Risk' | 'Churn' | 'Quality';
  accuracy: number;
  status: 'Training' | 'Ready' | 'Running' | 'Error';
  lastTrained: string;
  predictions: number;
}

interface PredictionResult {
  id: string;
  model: string;
  prediction: number;
  confidence: number;
  timeframe: string;
  category: string;
  factors: string[];
}

const PredictiveAnalyticsEngine: React.FC = () => {
  const [models, setModels] = useState<PredictionModel[]>([]);
  const [predictions, setPredictions] = useState<PredictionResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [isTraining, setIsTraining] = useState(false);
  const [showNewModelModal, setShowNewModelModal] = useState(false);
  const [newModelForm, setNewModelForm] = useState({
    name: '',
    type: 'Sales',
    description: ''
  });

  useEffect(() => {
    loadPredictiveModels();
  }, []);

  const loadPredictiveModels = () => {
    setTimeout(() => {
      setModels([
        {
          id: 'sales-forecast',
          name: 'Sales Forecasting Model',
          type: 'Sales',
          accuracy: 94.2,
          status: 'Ready',
          lastTrained: '2024-01-15T10:30:00Z',
          predictions: 1250
        },
        {
          id: 'demand-planning',
          name: 'Demand Planning Model',
          type: 'Demand',
          accuracy: 87.8,
          status: 'Running',
          lastTrained: '2024-01-14T15:45:00Z',
          predictions: 856
        },
        {
          id: 'risk-assessment',
          name: 'Risk Assessment Model',
          type: 'Risk',
          accuracy: 91.5,
          status: 'Training',
          lastTrained: '2024-01-13T09:20:00Z',
          predictions: 432
        },
        {
          id: 'churn-prediction',
          name: 'Customer Churn Prediction',
          type: 'Churn',
          accuracy: 89.3,
          status: 'Ready',
          lastTrained: '2024-01-12T14:15:00Z',
          predictions: 2108
        }
      ]);

      setPredictions([
        {
          id: 'pred-1',
          model: 'Sales Forecasting Model',
          prediction: 2850000,
          confidence: 94.2,
          timeframe: 'Q1 2024',
          category: 'Revenue',
          factors: ['Seasonal trends', 'Market conditions', 'Product launches']
        },
        {
          id: 'pred-2',
          model: 'Demand Planning Model',
          prediction: 15800,
          confidence: 87.8,
          timeframe: 'Next 30 days',
          category: 'Units',
          factors: ['Historical demand', 'Inventory levels', 'Market analysis']
        },
        {
          id: 'pred-3',
          model: 'Customer Churn Prediction',
          prediction: 8.5,
          confidence: 89.3,
          timeframe: 'Next Quarter',
          category: 'Churn Rate (%)',
          factors: ['Usage patterns', 'Support tickets', 'Payment history']
        }
      ]);

      setLoading(false);
    }, 1500);
  };

  const runPrediction = (modelId: string) => {
    setIsTraining(true);
    setTimeout(() => {
      // Simulate running prediction
      setModels(prev => prev.map(model => 
        model.id === modelId 
          ? { ...model, status: 'Running' as const, predictions: model.predictions + 1 }
          : model
      ));
      setIsTraining(false);
    }, 3000);
  };

  const createNewModel = () => {
    const newModel: PredictionModel = {
      id: `model-${Date.now()}`,
      name: newModelForm.name,
      type: newModelForm.type as any,
      accuracy: 0,
      status: 'Training',
      lastTrained: new Date().toISOString(),
      predictions: 0
    };

    setModels(prev => [...prev, newModel]);
    setShowNewModelModal(false);
    setNewModelForm({ name: '', type: 'Sales', description: '' });
  };

  const kpiData = [
    {
      title: 'Active Models',
      value: models.length.toString(),
      change: 2.5,
      format: 'number' as const
    },
    {
      title: 'Avg Accuracy',
      value: `${(models.reduce((sum, m) => sum + m.accuracy, 0) / models.length).toFixed(1)}%`,
      change: 1.8,
      format: 'percentage' as const
    },
    {
      title: 'Total Predictions',
      value: models.reduce((sum, m) => sum + m.predictions, 0).toString(),
      change: 15.2,
      format: 'number' as const
    },
    {
      title: 'Models Running',
      value: models.filter(m => m.status === 'Running').length.toString(),
      change: 0,
      format: 'number' as const
    }
  ];

  const modelHeaders = [
    { key: 'name', header: 'Model Name' },
    { key: 'type', header: 'Type' },
    { key: 'accuracy', header: 'Accuracy' },
    { key: 'status', header: 'Status' },
    { key: 'lastTrained', header: 'Last Trained' },
    { key: 'actions', header: 'Actions' }
  ];

  const modelRows = models.map(model => ({
    id: model.id,
    name: model.name,
    type: model.type,
    accuracy: `${model.accuracy}%`,
    status: (
      <span style={{ 
        padding: '0.25rem 0.5rem',
        borderRadius: '0.25rem',
        fontSize: '0.75rem',
        fontWeight: 'bold',
        backgroundColor: 
          model.status === 'Ready' ? 'var(--cds-support-02)' :
          model.status === 'Running' ? 'var(--cds-support-03)' :
          model.status === 'Training' ? 'var(--cds-support-04)' : 
          'var(--cds-support-01)',
        color: 'white'
      }}>
        {model.status}
      </span>
    ),
    lastTrained: new Date(model.lastTrained).toLocaleDateString(),
    actions: (
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <Button 
          size="sm" 
          kind="primary" 
          renderIcon={Play}
          disabled={model.status === 'Training' || isTraining}
          onClick={() => runPrediction(model.id)}
        >
          Run
        </Button>
        <Button size="sm" kind="secondary" renderIcon={Settings}>
          Configure
        </Button>
      </div>
    )
  }));

  const predictionHeaders = [
    { key: 'model', header: 'Model' },
    { key: 'prediction', header: 'Prediction' },
    { key: 'confidence', header: 'Confidence' },
    { key: 'timeframe', header: 'Timeframe' },
    { key: 'category', header: 'Category' }
  ];

  const predictionRows = predictions.map(pred => ({
    id: pred.id,
    model: pred.model,
    prediction: pred.category === 'Revenue' 
      ? `$${pred.prediction.toLocaleString()}` 
      : pred.prediction.toLocaleString(),
    confidence: `${pred.confidence}%`,
    timeframe: pred.timeframe,
    category: pred.category
  }));

  if (loading) {
    return (
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{ flex: 1, padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Loading description="Loading predictive analytics models..." />
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
            <MachineLearningModel size={32} />
            Predictive Analytics Engine
          </h1>
          <p style={{ color: 'var(--cds-text-02)', marginBottom: '1rem' }}>
            Machine learning models for business forecasting and prediction
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Button 
              kind="primary" 
              renderIcon={MachineLearningModel}
              onClick={() => setShowNewModelModal(true)}
            >
              Create New Model
            </Button>
            
            <Button kind="secondary" renderIcon={Analytics}>
              Model Performance
            </Button>
            
            <Button kind="tertiary" renderIcon={ChartScatter}>
              Prediction History
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
            <Tile style={{ padding: '1.5rem', marginBottom: '1rem' }}>
              <h3 style={{ 
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <MachineLearningModel size={20} />
                Prediction Models
              </h3>
              
              <DataTable 
                rows={modelRows} 
                headers={modelHeaders}
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

        <Grid>
          <Column lg={12} md={8} sm={4}>
            <Tile style={{ padding: '1.5rem' }}>
              <h3 style={{ 
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Prediction size={20} />
                Recent Predictions
              </h3>
              
              <DataTable 
                rows={predictionRows} 
                headers={predictionHeaders}
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
          open={showNewModelModal}
          onRequestClose={() => setShowNewModelModal(false)}
          modalHeading="Create New Prediction Model"
          primaryButtonText="Create Model"
          secondaryButtonText="Cancel"
          onRequestSubmit={createNewModel}
        >
          <div style={{ marginBottom: '1rem' }}>
            <TextInput
              id="model-name"
              labelText="Model Name"
              value={newModelForm.name}
              onChange={(e) => setNewModelForm(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter model name"
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <Select
              id="model-type"
              labelText="Model Type"
              value={newModelForm.type}
              onChange={(e) => setNewModelForm(prev => ({ ...prev, type: e.target.value }))}
            >
              <SelectItem value="Sales" text="Sales Forecasting" />
              <SelectItem value="Demand" text="Demand Planning" />
              <SelectItem value="Risk" text="Risk Assessment" />
              <SelectItem value="Churn" text="Customer Churn" />
              <SelectItem value="Quality" text="Quality Prediction" />
            </Select>
          </div>
          
          <div>
            <TextArea
              id="model-description"
              labelText="Description"
              value={newModelForm.description}
              onChange={(e) => setNewModelForm(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the model purpose and use case"
              rows={3}
            />
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default PredictiveAnalyticsEngine;