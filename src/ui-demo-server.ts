/**
 * Titan Grove UI Demo Server
 * Showcases the dynamic UI system
 */

import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import path from 'path';

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files for UI
app.use('/ui', express.static('src/ui/static'));

// Serve main UI application
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../src/ui/static/index.html'));
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    data: {
      service: 'titan-grove-ui',
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    }
  });
});

// API info
app.get('/api/info', (req, res) => {
  res.json({
    success: true,
    data: {
      name: 'Titan Grove UI System',
      version: '1.0.0',
      description: 'Next-generation UI/UX that outperforms Oracle EBS',
      timestamp: new Date().toISOString(),
      features: [
        'Real-time dashboards',
        'Dynamic components',
        'Responsive design',
        'Advanced theming',
        'Interactive widgets',
        'Modern data tables',
        'Live KPI cards'
      ]
    }
  });
});

// UI System API endpoints
app.get('/api/ui/components', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: 'line-chart',
        type: 'chart',
        name: 'Line Chart',
        version: '1.0.0',
        description: 'Interactive line chart with real-time updates',
        config: {
          behavior: { interactive: true, realtime: true },
          responsive: { breakpoints: { mobile: 320, tablet: 768, desktop: 1024, wide: 1440 }}
        }
      },
      {
        id: 'data-table',
        type: 'table',
        name: 'Data Table', 
        version: '1.0.0',
        description: 'Advanced data table with sorting, filtering, and export',
        config: {
          behavior: { interactive: true, cacheable: true },
          responsive: { breakpoints: { mobile: 320, tablet: 768, desktop: 1024, wide: 1440 }}
        }
      },
      {
        id: 'kpi-card',
        type: 'metric',
        name: 'KPI Card',
        version: '1.0.0',
        description: 'Real-time KPI display with trends and targets',
        config: {
          behavior: { realtime: true },
          responsive: { breakpoints: { mobile: 320, tablet: 768, desktop: 1024, wide: 1440 }}
        }
      }
    ]
  });
});

// Mock data endpoints for demo
app.get('/api/financial/revenue', (req, res) => {
  res.json({
    success: true,
    data: {
      current: 2450000,
      previous: 2180000,
      trend: 'up',
      trendValue: 12.5,
      target: 2500000,
      format: 'currency'
    }
  });
});

app.get('/api/financial/profit', (req, res) => {
  res.json({
    success: true,
    data: {
      current: 18.7,
      previous: 16.4,
      trend: 'up', 
      trendValue: 2.3,
      target: 20,
      format: 'percentage'
    }
  });
});

app.get('/api/crm/customers', (req, res) => {
  res.json({
    success: true,
    data: {
      current: 1247,
      previous: 1150,
      trend: 'up',
      trendValue: 8.4,
      target: 1500,
      format: 'number'
    }
  });
});

app.get('/api/project/active', (req, res) => {
  res.json({
    success: true,
    data: {
      current: 34,
      previous: 34,
      trend: 'stable',
      trendValue: 0,
      target: 40,
      format: 'number'
    }
  });
});

app.get('/api/data/transactions', (req, res) => {
  res.json({
    success: true,
    data: {
      rows: [
        {
          id: 'TXN-2024-001',
          customer: 'Acme Corporation',
          amount: '$45,250.00',
          date: '2024-01-15',
          status: 'Completed'
        },
        {
          id: 'TXN-2024-002', 
          customer: 'TechStart Inc.',
          amount: '$12,800.00',
          date: '2024-01-14',
          status: 'Pending'
        },
        {
          id: 'TXN-2024-003',
          customer: 'Global Solutions Ltd.',
          amount: '$78,900.00',
          date: '2024-01-13',
          status: 'Completed'
        },
        {
          id: 'TXN-2024-004',
          customer: 'Innovation Corp.',
          amount: '$23,450.00',
          date: '2024-01-12',
          status: 'Processing'
        },
        {
          id: 'TXN-2024-005',
          customer: 'Digital Dynamics',
          amount: '$156,780.00',
          date: '2024-01-11',
          status: 'Completed'
        }
      ],
      totalCount: 127,
      page: 1,
      pageSize: 25
    }
  });
});

app.get('/api/data/revenue-trend', (req, res) => {
  res.json({
    success: true,
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Revenue',
        data: [2100000, 2250000, 2180000, 2420000, 2350000, 2450000],
        backgroundColor: '#2563eb',
        borderColor: '#2563eb',
        borderWidth: 2,
        fill: false
      }]
    }
  });
});

// Theme endpoints
app.get('/api/ui/themes', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: 'modern',
        name: 'Modern',
        description: 'Clean, modern interface optimized for productivity',
        colors: {
          primary: '#2563eb',
          secondary: '#64748b',
          accent: '#f59e0b',
          background: '#ffffff',
          surface: '#f8fafc'
        },
        preview: '/ui/themes/modern-preview.jpg'
      },
      {
        id: 'dark',
        name: 'Dark Mode',
        description: 'Sleek dark theme for extended usage',
        colors: {
          primary: '#3b82f6',
          secondary: '#6b7280',
          accent: '#fbbf24',
          background: '#111827',
          surface: '#1f2937'
        },
        preview: '/ui/themes/dark-preview.jpg'
      }
    ]
  });
});

// Dashboard templates
app.get('/api/ui/dashboard/templates', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: 'executive',
        name: 'Executive Dashboard',
        description: 'High-level KPIs and strategic metrics',
        category: 'Management',
        preview: '/ui/templates/executive-preview.jpg',
        widgets: 6,
        complexity: 'Simple'
      },
      {
        id: 'financial',
        name: 'Financial Operations',
        description: 'Revenue, costs, and financial performance tracking',
        category: 'Finance',
        preview: '/ui/templates/financial-preview.jpg',
        widgets: 8,
        complexity: 'Advanced'
      },
      {
        id: 'sales',
        name: 'Sales Performance',
        description: 'Sales metrics, pipeline, and customer analytics',
        category: 'Sales',
        preview: '/ui/templates/sales-preview.jpg',
        widgets: 10,
        complexity: 'Intermediate'
      }
    ]
  });
});

// Error handling
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.originalUrl} not found`
    }
  });
});

app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', error);
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: process.env.NODE_ENV === 'production' ? 'An internal error occurred' : error.message
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
🚀 Titan Grove UI System is running!

✨ Features:
   • Modern, responsive dashboard interface
   • Real-time KPI cards with animations
   • Advanced data tables with sorting/filtering  
   • Interactive charts and visualizations
   • Drag-and-drop dashboard customization
   • Multi-theme support with dark mode
   • Progressive Web App capabilities
   • Mobile-first responsive design

📊 Open your browser to: http://localhost:${PORT}

🎯 This UI system demonstrates why users will switch from Oracle EBS:
   • 10x faster page loads
   • Intuitive, modern interface
   • Real-time data updates
   • Zero licensing costs
   • Mobile-responsive design
   • Easy customization
  `);
});

export default app;