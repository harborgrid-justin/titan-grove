/**
 * Logistics Controller Tests
 * Tests for logistics and supply chain management functionality
 */

import request from 'supertest';
import express from 'express';
import { logisticsController } from '../../src/api/logistics/logistics-controller';

const app = express();
app.use(express.json());

// Setup routes
app.get('/logistics/shipments', (req, res) => logisticsController.getShipments(req, res));
app.post('/logistics/shipments', (req, res) => logisticsController.createShipment(req, res));
app.get('/logistics/tracking/:trackingNumber', (req, res) => logisticsController.trackShipment(req, res));
app.put('/logistics/shipments/:id', (req, res) => logisticsController.updateShipment(req, res));
app.get('/logistics/routes', (req, res) => logisticsController.getRoutes(req, res));
app.post('/logistics/routes/optimize', (req, res) => logisticsController.optimizeRoute(req, res));

describe('LogisticsController Integration Tests', () => {
  describe('Shipment Management', () => {
    it('should get shipments with filtering and tracking', async () => {
      const response = await request(app)
        .get('/logistics/shipments')
        .query({
          status: 'IN_TRANSIT',
          carrier: 'FEDEX',
          destination: 'NEW_YORK',
          priority: 'HIGH'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.domain).toBe('logistics');
      expect(response.body.data.method).toBe('getShipments');
    });

    it('should create shipment with complex routing', async () => {
      const shipmentData = {
        orderId: 'ORDER-001',
        origin: {
          address: '123 Warehouse St',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90210',
          country: 'US'
        },
        destination: {
          address: '456 Customer Ave',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'US'
        },
        carrier: 'FEDEX',
        serviceLevel: 'OVERNIGHT',
        packages: [
          {
            weight: 5.5,
            dimensions: { length: 12, width: 8, height: 6 },
            value: 500.00,
            contents: 'Electronics'
          }
        ],
        specialInstructions: 'Fragile - Handle with care'
      };

      const response = await request(app)
        .post('/logistics/shipments')
        .send(shipmentData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.method).toBe('createShipment');
    });

    it('should track shipment with real-time updates', async () => {
      const trackingNumber = 'FDX123456789';
      const response = await request(app)
        .get(`/logistics/tracking/${trackingNumber}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.params.trackingNumber).toBe(trackingNumber);
    });
  });

  describe('Route Optimization', () => {
    it('should get available routes', async () => {
      const response = await request(app)
        .get('/logistics/routes')
        .query({
          origin: 'LOS_ANGELES_CA',
          destination: 'NEW_YORK_NY',
          serviceLevel: 'GROUND'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.method).toBe('getRoutes');
    });

    it('should optimize routes for multiple deliveries', async () => {
      const optimizationData = {
        vehicle: {
          capacity: 1000,
          maxDistance: 500,
          startLocation: 'WAREHOUSE_001'
        },
        deliveries: [
          { address: '123 Main St', priority: 1, timeWindow: '09:00-12:00' },
          { address: '456 Oak Ave', priority: 2, timeWindow: '13:00-17:00' },
          { address: '789 Pine Rd', priority: 1, timeWindow: '10:00-14:00' }
        ],
        optimization: {
          objective: 'MINIMIZE_DISTANCE',
          considerTraffic: true,
          avoidTolls: false
        }
      };

      const response = await request(app)
        .post('/logistics/routes/optimize')
        .send(optimizationData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.method).toBe('optimizeRoute');
    });
  });
});

/**
 * Support Controller Tests
 * Tests for customer support and service functionality
 */

import { supportController } from '../../src/api/support/support-controller';

const supportApp = express();
supportApp.use(express.json());

// Setup support routes
supportApp.get('/support/tickets', (req, res) => supportController.getTickets(req, res));
supportApp.post('/support/tickets', (req, res) => supportController.createTicket(req, res));
supportApp.get('/support/tickets/:id', (req, res) => supportController.getTicketById(req, res));
supportApp.put('/support/tickets/:id', (req, res) => supportController.updateTicket(req, res));
supportApp.get('/support/knowledge-base', (req, res) => supportController.getKnowledgeBase(req, res));
supportApp.post('/support/knowledge-base', (req, res) => supportController.createKnowledgeArticle(req, res));

describe('SupportController Integration Tests', () => {
  describe('Ticket Management', () => {
    it('should get support tickets with SLA tracking', async () => {
      const response = await request(supportApp)
        .get('/support/tickets')
        .query({
          status: 'OPEN',
          priority: 'HIGH',
          assignedTo: 'AGENT_001',
          slaBreached: false
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.domain).toBe('support');
      expect(response.body.data.method).toBe('getTickets');
    });

    it('should create support ticket with classification', async () => {
      const ticketData = {
        customerId: 'CUST_001',
        subject: 'System Performance Issues',
        description: 'Application is running slowly since last update',
        priority: 'HIGH',
        category: 'TECHNICAL',
        subcategory: 'PERFORMANCE',
        contactMethod: 'EMAIL',
        customerImpact: 'BUSINESS_CRITICAL',
        environment: 'PRODUCTION'
      };

      const response = await request(supportApp)
        .post('/support/tickets')
        .send(ticketData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.method).toBe('createTicket');
    });
  });

  describe('Knowledge Management', () => {
    it('should get knowledge base articles', async () => {
      const response = await request(supportApp)
        .get('/support/knowledge-base')
        .query({
          category: 'TROUBLESHOOTING',
          searchTerm: 'login issues',
          language: 'en'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.method).toBe('getKnowledgeBase');
    });

    it('should create knowledge article', async () => {
      const articleData = {
        title: 'How to Reset Password',
        content: 'Step-by-step guide for password reset...',
        category: 'USER_GUIDE',
        tags: ['password', 'security', 'authentication'],
        difficulty: 'BEGINNER',
        estimatedTime: '5 minutes'
      };

      const response = await request(supportApp)
        .post('/support/knowledge-base')
        .send(articleData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.method).toBe('createKnowledgeArticle');
    });
  });
});

/**
 * All Controllers Integration Test
 * Tests that verify all controllers are properly instantiated and accessible
 */
describe('All Controllers Integration', () => {
  it('should have all controllers properly exported and functional', async () => {
    // Test that all controller instances exist and have expected methods
    expect(hrController).toBeDefined();
    expect(typeof hrController.getEmployees).toBe('function');

    expect(crmController).toBeDefined();
    expect(typeof crmController.getCustomers).toBe('function');

    expect(financeController).toBeDefined();
    expect(typeof financeController.getAccounts).toBe('function');

    expect(manufacturingController).toBeDefined();
    expect(typeof manufacturingController.getWorkOrders).toBe('function');

    expect(logisticsController).toBeDefined();
    expect(typeof logisticsController.getShipments).toBe('function');

    expect(supportController).toBeDefined();
    expect(typeof supportController.getTickets).toBe('function');
  });

  it('should handle cross-domain operations', async () => {
    // Test scenario: Customer places order that triggers manufacturing and logistics
    const customerOrder = {
      customerId: 'CUST_001',
      products: [
        { productId: 'PROD_001', quantity: 10 }
      ],
      deliveryAddress: {
        street: '123 Main St',
        city: 'Anytown',
        state: 'NY',
        zipCode: '12345'
      }
    };

    // Create customer in CRM
    const crmResponse = await request(app)
      .post('/crm/customers')
      .send({
        name: 'Test Customer',
        email: 'test@customer.com',
        type: 'COMPANY'
      })
      .expect(200);

    // Create work order in manufacturing
    const mfgResponse = await request(app)
      .post('/manufacturing/work-orders')
      .send({
        productId: 'PROD_001',
        quantity: 10,
        dueDate: '2024-02-15'
      })
      .expect(200);

    // Create shipment in logistics
    const logResponse = await request(app)
      .post('/logistics/shipments')
      .send({
        orderId: 'ORDER_001',
        destination: customerOrder.deliveryAddress
      })
      .expect(200);

    expect(crmResponse.body.success).toBe(true);
    expect(mfgResponse.body.success).toBe(true);
    expect(logResponse.body.success).toBe(true);
  });
});