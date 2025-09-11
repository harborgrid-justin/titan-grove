/**
 * Production-Grade NAPI-RS Demo Application
 * Demonstrates all enhanced features and integrations
 */

import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { 
  evaluateBusinessRule,
  standardizeDataRecord,
  generateDataQualityReport,
  calculateCompoundInterest,
  calculateNetPresentValue,
  validateEmail,
  validatePhoneNumber
} from '../native';

import { ProductionIntegrationService } from '../src/services/production-integration-service';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

const integrationService = new ProductionIntegrationService();

app.use(express.json());
app.use(express.static('public'));

// ============================================================================
// REST API ENDPOINTS
// ============================================================================

/**
 * Health Check Endpoint
 */
app.get('/api/health', async (req, res) => {
  try {
    const healthResult = await integrationService.healthCheck();
    res.json(healthResult);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Health check failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Business Rules Evaluation Demo
 */
app.post('/api/business-rules/evaluate', (req, res) => {
  try {
    const { rule, context } = req.body;
    
    const result = evaluateBusinessRule(rule, context);
    
    res.json({
      success: true,
      data: {
        evaluation: result,
        demo_info: {
          description: 'Production-grade business rules engine evaluation',
          features: [
            'Complex condition evaluation',
            'Flexible action execution',
            'Performance monitoring',
            'Error handling'
          ]
        }
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Business rule evaluation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Data Standardization Demo
 */
app.post('/api/data-standardization/process', (req, res) => {
  try {
    const { data, rules } = req.body;
    
    const validationResults = standardizeDataRecord(data, rules);
    const qualityReport = generateDataQualityReport(validationResults);
    
    res.json({
      success: true,
      data: {
        validation_results: validationResults,
        quality_report: qualityReport,
        demo_info: {
          description: 'Production-grade data standardization and validation',
          features: [
            'Email validation and formatting',
            'Phone number standardization',
            'Address normalization',
            'Currency amount validation',
            'Comprehensive quality reporting'
          ]
        }
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Data standardization failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Advanced Financial Calculations Demo
 */
app.post('/api/calculations/financial', (req, res) => {
  try {
    const { calculation_type, parameters } = req.body;
    let result;
    
    switch (calculation_type) {
      case 'compound_interest':
        result = calculateCompoundInterest(
          parameters.principal,
          parameters.rate,
          parameters.frequency,
          parameters.time
        );
        break;
        
      case 'net_present_value':
        result = calculateNetPresentValue(
          parameters.cash_flows,
          parameters.discount_rate
        );
        break;
        
      default:
        throw new Error(`Unknown calculation type: ${calculation_type}`);
    }
    
    res.json({
      success: true,
      data: {
        calculation_type,
        result,
        parameters,
        demo_info: {
          description: 'High-performance native financial calculations',
          features: [
            'Rust-powered performance',
            'Complex mathematical operations',
            'Enterprise-grade precision',
            'Multiple calculation types'
          ]
        }
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Financial calculation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Complete Business Process Demo
 */
app.post('/api/process/business-data', async (req, res) => {
  try {
    const context = {
      userId: req.headers['x-user-id'] as string || 'demo_user',
      sessionId: `session_${Date.now()}`,
      permissions: ['read', 'write', 'calculate'],
      correlationId: `demo_${Date.now()}`,
      requestTimestamp: new Date(),
    };
    
    const result = await integrationService.processBusinessData(req.body, context);
    
    res.json({
      ...result,
      demo_info: {
        description: 'Complete production-grade business process pipeline',
        pipeline_steps: [
          '1. Data Standardization & Validation',
          '2. Quality Assessment & Reporting',
          '3. Business Rules Evaluation',
          '4. Native Performance Calculations',
          '5. Real-time Event Broadcasting',
          '6. Performance Metrics Collection'
        ],
        features: [
          'End-to-end data processing',
          'Real-time WebSocket notifications',
          'Comprehensive error handling',
          'Performance monitoring',
          'Production-grade logging'
        ]
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Business process failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Quick Validation Utilities
 */
app.post('/api/utils/validate-email', (req, res) => {
  try {
    const { email } = req.body;
    const result = validateEmail(email);
    
    res.json({
      success: true,
      data: result,
      demo_info: {
        description: 'Production-grade email validation using Rust regex engine'
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Email validation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.post('/api/utils/validate-phone', (req, res) => {
  try {
    const { phone } = req.body;
    const result = validatePhoneNumber(phone);
    
    res.json({
      success: true,
      data: result,
      demo_info: {
        description: 'Production-grade phone number validation and standardization'
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Phone validation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ============================================================================
// WEBSOCKET REAL-TIME INTEGRATION
// ============================================================================

wss.on('connection', (ws, req) => {
  const userId = (req.url?.includes('userId=') 
    ? new URL(req.url, 'http://localhost').searchParams.get('userId') 
    : null) || 'anonymous';
  
  console.log(`WebSocket connection established for user: ${userId}`);
  
  // Setup real-time integration
  integrationService.setupWebSocketConnection(ws as any, userId);
  
  // Send welcome message with demo capabilities
  ws.send(JSON.stringify({
    type: 'welcome',
    message: 'Connected to Production-Grade NAPI-RS Demo',
    capabilities: {
      business_rules: 'Real-time business rule evaluation',
      data_standardization: 'Live data validation and standardization',
      calculations: 'High-performance native calculations',
      notifications: 'Real-time event broadcasting',
      monitoring: 'Live performance metrics'
    },
    demo_instructions: {
      send_data: 'Send JSON with { type: "process_data", data: {...} }',
      business_rules: 'Send JSON with { type: "evaluate_rule", rule: {...}, context: {...} }',
      calculations: 'Send JSON with { type: "calculate", calculation_type: "...", parameters: {...} }'
    }
  }));
});

// ============================================================================
// STATIC DEMO PAGE
// ============================================================================

app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Production-Grade NAPI-RS Demo</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            max-width: 1200px; 
            margin: 0 auto; 
            padding: 20px;
            background: #f5f5f5;
        }
        .container { 
            background: white; 
            padding: 30px; 
            border-radius: 8px; 
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 { 
            color: #333; 
            text-align: center; 
            margin-bottom: 30px;
        }
        h2 { 
            color: #555; 
            border-bottom: 2px solid #007bff;
            padding-bottom: 10px;
        }
        .demo-section { 
            margin: 30px 0; 
            padding: 20px; 
            background: #f8f9fa; 
            border-radius: 5px;
        }
        .feature-list { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
            gap: 20px; 
            margin: 20px 0;
        }
        .feature-card { 
            background: white; 
            padding: 20px; 
            border-radius: 5px; 
            border-left: 4px solid #007bff;
        }
        button { 
            background: #007bff; 
            color: white; 
            border: none; 
            padding: 10px 20px; 
            border-radius: 5px; 
            cursor: pointer; 
            margin: 5px;
        }
        button:hover { background: #0056b3; }
        textarea, input { 
            width: 100%; 
            padding: 10px; 
            margin: 10px 0; 
            border: 1px solid #ccc; 
            border-radius: 4px;
        }
        .status { 
            padding: 10px; 
            border-radius: 4px; 
            margin: 10px 0;
        }
        .success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .error { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
        .info { background: #cce7ff; color: #004085; border: 1px solid #99d6ff; }
        pre { 
            background: #f8f9fa; 
            padding: 15px; 
            border-radius: 4px; 
            overflow-x: auto;
            border: 1px solid #e9ecef;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Production-Grade NAPI-RS Demo</h1>
        <p style="text-align: center; font-size: 1.2em; color: #666;">
            Comprehensive demonstration of enhanced business logic, rules, solutions, calculations, 
            data standardization, and complete frontend-backend integration
        </p>
        
        <div class="demo-section">
            <h2>🎯 Core Features</h2>
            <div class="feature-list">
                <div class="feature-card">
                    <h3>Business Rules Engine</h3>
                    <p>Advanced rule evaluation with complex conditions, flexible actions, and real-time processing</p>
                </div>
                <div class="feature-card">
                    <h3>Data Standardization</h3>
                    <p>Production-grade data validation, cleaning, transformation, and quality assessment</p>
                </div>
                <div class="feature-card">
                    <h3>Native Calculations</h3>
                    <p>High-performance financial, mathematical, and business calculations powered by Rust</p>
                </div>
                <div class="feature-card">
                    <h3>Real-time Integration</h3>
                    <p>WebSocket-based real-time communication with comprehensive error handling</p>
                </div>
            </div>
        </div>

        <div class="demo-section">
            <h2>🧪 Interactive Tests</h2>
            
            <h3>Health Check</h3>
            <button onclick="healthCheck()">Test System Health</button>
            <div id="health-status"></div>

            <h3>Email Validation</h3>
            <input type="email" id="email-input" placeholder="Enter email address" value="test@example.com">
            <button onclick="validateEmail()">Validate Email</button>
            <div id="email-status"></div>

            <h3>Financial Calculations</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;">
                <input type="number" id="principal" placeholder="Principal" value="10000">
                <input type="number" id="rate" placeholder="Rate %" value="5">
                <input type="number" id="time" placeholder="Years" value="5">
            </div>
            <button onclick="calculateCompoundInterest()">Calculate Compound Interest</button>
            <div id="calculation-status"></div>

            <h3>Business Rule Evaluation</h3>
            <textarea id="rule-data" rows="4" placeholder="Enter transaction data as JSON">
{
  "amount": "15000",
  "currency": "USD",
  "customer_type": "enterprise"
}
            </textarea>
            <button onclick="evaluateBusinessRule()">Evaluate Business Rules</button>
            <div id="rule-status"></div>

            <h3>Real-time WebSocket Connection</h3>
            <button onclick="connectWebSocket()">Connect WebSocket</button>
            <button onclick="sendTestMessage()" disabled id="ws-send">Send Test Message</button>
            <div id="ws-status"></div>
            <pre id="ws-messages" style="height: 200px; overflow-y: auto;"></pre>
        </div>

        <div class="demo-section">
            <h2>📊 API Endpoints</h2>
            <ul>
                <li><code>GET /api/health</code> - System health check</li>
                <li><code>POST /api/business-rules/evaluate</code> - Evaluate business rules</li>
                <li><code>POST /api/data-standardization/process</code> - Data standardization</li>
                <li><code>POST /api/calculations/financial</code> - Financial calculations</li>
                <li><code>POST /api/process/business-data</code> - Complete business process</li>
                <li><code>POST /api/utils/validate-email</code> - Email validation</li>
                <li><code>POST /api/utils/validate-phone</code> - Phone validation</li>
            </ul>
        </div>

        <div class="demo-section">
            <h2>🔧 Technical Implementation</h2>
            <p><strong>NAPI-RS Integration:</strong> Over 120+ native Rust modules providing high-performance business logic</p>
            <p><strong>Production Features:</strong> Error handling, monitoring, caching, audit trails, and real-time capabilities</p>
            <p><strong>Data Pipeline:</strong> Complete data standardization → validation → business rules → calculations</p>
            <p><strong>Frontend Integration:</strong> REST APIs + WebSocket real-time communication</p>
        </div>
    </div>

    <script>
        let ws = null;

        async function healthCheck() {
            try {
                const response = await fetch('/api/health');
                const result = await response.json();
                document.getElementById('health-status').innerHTML = 
                    '<div class="' + (result.success ? 'success' : 'error') + '">' +
                    '<strong>Status:</strong> ' + JSON.stringify(result, null, 2) +
                    '</div>';
            } catch (error) {
                document.getElementById('health-status').innerHTML = 
                    '<div class="error">Error: ' + error.message + '</div>';
            }
        }

        async function validateEmail() {
            const email = document.getElementById('email-input').value;
            try {
                const response = await fetch('/api/utils/validate-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });
                const result = await response.json();
                document.getElementById('email-status').innerHTML = 
                    '<pre class="' + (result.success ? 'success' : 'error') + '">' +
                    JSON.stringify(result, null, 2) + '</pre>';
            } catch (error) {
                document.getElementById('email-status').innerHTML = 
                    '<div class="error">Error: ' + error.message + '</div>';
            }
        }

        async function calculateCompoundInterest() {
            const principal = parseFloat(document.getElementById('principal').value);
            const rate = parseFloat(document.getElementById('rate').value);
            const time = parseFloat(document.getElementById('time').value);
            
            try {
                const response = await fetch('/api/calculations/financial', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        calculation_type: 'compound_interest',
                        parameters: { principal, rate, frequency: 12, time }
                    })
                });
                const result = await response.json();
                document.getElementById('calculation-status').innerHTML = 
                    '<pre class="' + (result.success ? 'success' : 'error') + '">' +
                    JSON.stringify(result, null, 2) + '</pre>';
            } catch (error) {
                document.getElementById('calculation-status').innerHTML = 
                    '<div class="error">Error: ' + error.message + '</div>';
            }
        }

        async function evaluateBusinessRule() {
            const data = JSON.parse(document.getElementById('rule-data').value);
            
            const rule = {
                id: 'DEMO_RULE_001',
                name: 'Large Transaction Alert',
                description: 'Demo rule for large transactions',
                category: 'Financial',
                rule_type: 'alert',
                conditions: [{
                    field: 'amount',
                    operator: 'greater_than',
                    value: '10000',
                    data_type: 'number'
                }],
                actions: [{
                    action_type: 'send_notification',
                    target: 'finance_team',
                    value: 'Large transaction detected',
                    parameters: {}
                }],
                priority: 100,
                enabled: true,
                effective_date: '2024-01-01',
                expiry_date: null
            };
            
            const context = {
                entity_type: 'transaction',
                entity_id: 'demo_001',
                data: data,
                user_id: 'demo_user',
                timestamp: new Date().toISOString()
            };

            try {
                const response = await fetch('/api/business-rules/evaluate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ rule, context })
                });
                const result = await response.json();
                document.getElementById('rule-status').innerHTML = 
                    '<pre class="' + (result.success ? 'success' : 'error') + '">' +
                    JSON.stringify(result, null, 2) + '</pre>';
            } catch (error) {
                document.getElementById('rule-status').innerHTML = 
                    '<div class="error">Error: ' + error.message + '</div>';
            }
        }

        function connectWebSocket() {
            const wsUrl = (window.location.protocol === 'https:' ? 'wss:' : 'ws:') + 
                         '//' + window.location.host + '?userId=demo_user';
            
            ws = new WebSocket(wsUrl);
            
            ws.onopen = function() {
                document.getElementById('ws-status').innerHTML = 
                    '<div class="success">WebSocket connected!</div>';
                document.getElementById('ws-send').disabled = false;
            };
            
            ws.onmessage = function(event) {
                const messages = document.getElementById('ws-messages');
                messages.textContent += new Date().toISOString() + ': ' + event.data + '\\n';
                messages.scrollTop = messages.scrollHeight;
            };
            
            ws.onclose = function() {
                document.getElementById('ws-status').innerHTML = 
                    '<div class="error">WebSocket disconnected</div>';
                document.getElementById('ws-send').disabled = true;
            };
        }

        function sendTestMessage() {
            if (ws && ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({
                    type: 'test_message',
                    data: {
                        message: 'Hello from production-grade NAPI-RS demo!',
                        timestamp: new Date().toISOString()
                    }
                }));
            }
        }

        // Auto health check on load
        window.onload = function() {
            healthCheck();
        };
    </script>
</body>
</html>
  `);
});

// ============================================================================
// SERVER STARTUP
// ============================================================================

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log('🚀 Production-Grade NAPI-RS Demo Server Started');
  console.log('===============================================');
  console.log(`📡 Server running on port ${PORT}`);
  console.log(`🌐 Demo UI: http://localhost:${PORT}`);
  console.log(`🔧 API Base: http://localhost:${PORT}/api`);
  console.log(`⚡ WebSocket: ws://localhost:${PORT}`);
  console.log('');
  console.log('🎯 Features Demonstrated:');
  console.log('  ✅ Business Rules Engine with complex evaluation');
  console.log('  ✅ Data Standardization & Validation Pipeline');  
  console.log('  ✅ High-Performance Native Calculations');
  console.log('  ✅ Real-time WebSocket Integration');
  console.log('  ✅ Production-Grade Error Handling');
  console.log('  ✅ Performance Monitoring & Metrics');
  console.log('  ✅ Complete Frontend-Backend Integration');
  console.log('');
  console.log('📊 Native Modules: 120+ NAPI-RS business logic modules');
  console.log('🔒 Production Ready: Error handling, monitoring, validation');
  console.log('⚡ Performance: Rust-powered calculations with millisecond response times');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

export default app;