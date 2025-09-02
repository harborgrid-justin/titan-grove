#!/usr/bin/env node

/**
 * Enhanced HTTP server with TypeScript service API integration
 * Serves static UI files and connects to real backend services
 */

const express = require('express');
const path = require('path');

// Check if we're in a built environment or need to use ts-node
let serviceApiRouter;
try {
  // Try to use compiled version first
  const compiledApi = require('./dist/api/service-api.js');
  serviceApiRouter = compiledApi.serviceApiRouter;
} catch (error) {
  try {
    // Fall back to ts-node for development
    require('ts-node/register');
    const { serviceApiRouter: tsApiRouter } = require('./src/api/service-api.ts');
    serviceApiRouter = tsApiRouter;
  } catch (tsError) {
    console.warn('⚠️  TypeScript API not available, falling back to JavaScript API');
    // Fallback to the old JS API
    serviceApiRouter = require('./src/api/service-api.js');
  }
}

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Serve static files from the UI directory
app.use('/src/ui/static', express.static(path.join(__dirname, 'src/ui/static')));

// API routes - now using the enhanced TypeScript API
app.use('/api', serviceApiRouter);

// WebSocket simulation endpoint for real-time updates
app.get('/api/realtime/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Send real-time updates every 15 seconds
  const interval = setInterval(() => {
    const data = {
      timestamp: new Date().toISOString(),
      type: 'KPI_UPDATE',
      data: {
        activeWorkOrders: Math.floor(Math.random() * 50) + 40,
        avgResponseTime: (Math.random() * 5 + 15).toFixed(1),
        technicianUtilization: (Math.random() * 0.2 + 0.7).toFixed(3),
        customerSatisfaction: (Math.random() * 0.5 + 4.2).toFixed(1)
      }
    };
    
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  }, 15000);

  req.on('close', () => {
    clearInterval(interval);
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    services: {
      api: 'operational',
      database: 'simulated',
      messageQueue: 'simulated'
    }
  });
});

// Serve root index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/ui/static/index.html'));
});

// Handle all other routes by serving the appropriate HTML file
app.get('/:module', (req, res) => {
    const module = req.params.module;
    const filePath = path.join(__dirname, 'src/ui/static', `${module}.html`);
    
    // Check if file exists, otherwise serve index
    res.sendFile(filePath, (err) => {
        if (err) {
            res.sendFile(path.join(__dirname, 'src/ui/static/index.html'));
        }
    });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server Error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: error.message
  });
});

app.listen(PORT, () => {
    console.log('🚀 Titan Grove Enhanced Server Started');
    console.log(`📍 Server: http://localhost:${PORT}`);
    console.log(`📁 Static files: ${path.join(__dirname, 'src/ui/static')}`);
    console.log(`🔌 API: http://localhost:${PORT}/api`);
    console.log(`💓 Health check: http://localhost:${PORT}/api/health`);
    console.log('🔄 Real-time integration: ENABLED');
    console.log('✅ Ready for business logic integration testing!');
});

module.exports = app;