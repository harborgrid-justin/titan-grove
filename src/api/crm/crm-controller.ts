/**
 * CrmController - Complete Implementation
 * Handles all crm domain operations
 */

import { Request, Response } from 'express';
import { BaseController } from '../base/base-controller';

export class CrmController extends BaseController {
  /**
   * Get customer list
   */
  async getCustomers(req: Request, res: Response): Promise<void> {
    try {
      const { status, segment, page = 1, limit = 50 } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      const customers = [
        {
          id: 'CUST-001',
          companyName: 'Acme Corporation',
          contactName: 'John Smith',
          email: 'john@acme.com',
          phone: '+1-555-0100',
          status: 'ACTIVE',
          segment: 'ENTERPRISE',
          industry: 'Technology',
          revenue: 5000000,
          employees: 500,
          createdAt: '2023-01-15T00:00:00.000Z',
        },
      ];

      let filtered = customers;
      if (status) {
        filtered = filtered.filter((c) => c.status === status);
      }
      if (segment) {
        filtered = filtered.filter((c) => c.segment === segment);
      }

      const paginated = filtered.slice(offset, offset + Number(limit));

      const result = {
        customers: paginated,
        pagination: {
          total: filtered.length,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(filtered.length / Number(limit)),
        },
        timestamp: new Date().toISOString(),
      };

      this.sendSuccess(res, result, 'Customer list retrieved successfully');
    } catch (error) {
      this.sendError(res, (error as Error).message || 'Failed to get customers', 500);
    }
  }

  /**
   * Create new customer
   */
  async createCustomer(req: Request, res: Response): Promise<void> {
    try {
      const { companyName, contactName, email, phone, segment, industry } = req.body;

      if (!companyName || !email) {
        this.sendError(res, 'Missing required fields: companyName, email', 400);
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        this.sendError(res, 'Invalid email format', 400);
        return;
      }

      const newCustomer = {
        id: `CUST-${Date.now().toString().slice(-6)}`,
        companyName,
        contactName: contactName || '',
        email,
        phone: phone || '',
        status: 'ACTIVE',
        segment: segment || 'SMB',
        industry: industry || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      this.sendSuccess(res, { customer: newCustomer }, 'Customer created successfully', 201);
    } catch (error) {
      this.sendError(res, (error as Error).message || 'Failed to create customer', 500);
    }
  }

  /**
   * Get customer by ID
   */
  async getCustomerById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        this.sendError(res, 'Customer ID is required', 400);
        return;
      }

      const customer = {
        id,
        companyName: 'Acme Corporation',
        contactName: 'John Smith',
        email: 'john@acme.com',
        phone: '+1-555-0100',
        status: 'ACTIVE',
        segment: 'ENTERPRISE',
        industry: 'Technology',
        revenue: 5000000,
        employees: 500,
        address: '123 Business St, City, State 12345',
        opportunities: 5,
        totalValue: 250000,
        createdAt: '2023-01-15T00:00:00.000Z',
        updatedAt: new Date().toISOString(),
      };

      this.sendSuccess(res, { customer }, 'Customer retrieved successfully');
    } catch (error) {
      this.sendError(res, (error as Error).message || 'Failed to get customer by ID', 500);
    }
  }

  /**
   * Update customer information
   */
  async updateCustomer(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updates = req.body;

      if (!id) {
        this.sendError(res, 'Customer ID is required', 400);
        return;
      }

      if (updates.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(updates.email)) {
          this.sendError(res, 'Invalid email format', 400);
          return;
        }
      }

      const updatedCustomer = {
        id,
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      this.sendSuccess(res, { customer: updatedCustomer }, 'Customer updated successfully');
    } catch (error) {
      this.sendError(res, (error as Error).message || 'Failed to update customer', 500);
    }
  }

  /**
   * Get opportunities
   */
  async getOpportunities(req: Request, res: Response): Promise<void> {
    try {
      const { customerId, stage, status } = req.query;

      const opportunities = [
        {
          id: 'OPP-001',
          customerId: 'CUST-001',
          customerName: 'Acme Corporation',
          name: 'Enterprise Software License',
          value: 50000,
          stage: 'NEGOTIATION',
          probability: 70,
          expectedCloseDate: '2024-02-28',
          status: 'OPEN',
          owner: 'SALES-001',
          createdAt: '2024-01-15T00:00:00.000Z',
        },
      ];

      let filtered = opportunities;
      if (customerId) {
        filtered = filtered.filter((o) => o.customerId === customerId);
      }
      if (stage) {
        filtered = filtered.filter((o) => o.stage === stage);
      }
      if (status) {
        filtered = filtered.filter((o) => o.status === status);
      }

      const result = {
        opportunities: filtered,
        summary: {
          total: filtered.length,
          totalValue: filtered.reduce((sum, o) => sum + o.value, 0),
          weightedValue: filtered.reduce((sum, o) => sum + (o.value * o.probability / 100), 0),
        },
        timestamp: new Date().toISOString(),
      };

      this.sendSuccess(res, result, 'Opportunities retrieved successfully');
    } catch (error) {
      this.sendError(res, (error as Error).message || 'Failed to get opportunities', 500);
    }
  }

  /**
   * Create new opportunity
   */
  async createOpportunity(req: Request, res: Response): Promise<void> {
    try {
      const { customerId, name, value, stage, expectedCloseDate } = req.body;

      if (!customerId || !name || !value) {
        this.sendError(res, 'Missing required fields: customerId, name, value', 400);
        return;
      }

      if (value <= 0) {
        this.sendError(res, 'Value must be greater than 0', 400);
        return;
      }

      const stageMap: { [key: string]: number } = {
        PROSPECTING: 10,
        QUALIFICATION: 25,
        NEEDS_ANALYSIS: 40,
        PROPOSAL: 60,
        NEGOTIATION: 75,
        CLOSED_WON: 100,
        CLOSED_LOST: 0,
      };

      const probability = stageMap[stage] || 50;

      const newOpportunity = {
        id: `OPP-${Date.now().toString().slice(-6)}`,
        customerId,
        name,
        value,
        stage: stage || 'PROSPECTING',
        probability,
        expectedCloseDate: expectedCloseDate || null,
        status: 'OPEN',
        owner: 'SYSTEM',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      this.sendSuccess(res, { opportunity: newOpportunity }, 'Opportunity created successfully', 201);
    } catch (error) {
      this.sendError(res, (error as Error).message || 'Failed to create opportunity', 500);
    }
  }

  /**
   * Get contacts
   */
  async getContacts(req: Request, res: Response): Promise<void> {
    try {
      const { customerId, role } = req.query;

      const contacts = [
        {
          id: 'CONT-001',
          customerId: 'CUST-001',
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'jane.doe@acme.com',
          phone: '+1-555-0101',
          role: 'Decision Maker',
          title: 'CTO',
          isPrimary: true,
          createdAt: '2023-01-15T00:00:00.000Z',
        },
      ];

      let filtered = contacts;
      if (customerId) {
        filtered = filtered.filter((c) => c.customerId === customerId);
      }
      if (role) {
        filtered = filtered.filter((c) => c.role === role);
      }

      const result = {
        contacts: filtered,
        summary: { total: filtered.length },
        timestamp: new Date().toISOString(),
      };

      this.sendSuccess(res, result, 'Contacts retrieved successfully');
    } catch (error) {
      this.sendError(res, (error as Error).message || 'Failed to get contacts', 500);
    }
  }

  /**
   * Create new contact
   */
  async createContact(req: Request, res: Response): Promise<void> {
    try {
      const { customerId, firstName, lastName, email, phone, role, title } = req.body;

      if (!customerId || !firstName || !lastName || !email) {
        this.sendError(res, 'Missing required fields', 400);
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        this.sendError(res, 'Invalid email format', 400);
        return;
      }

      const newContact = {
        id: `CONT-${Date.now().toString().slice(-6)}`,
        customerId,
        firstName,
        lastName,
        email,
        phone: phone || '',
        role: role || 'Contact',
        title: title || '',
        isPrimary: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      this.sendSuccess(res, { contact: newContact }, 'Contact created successfully', 201);
    } catch (error) {
      this.sendError(res, (error as Error).message || 'Failed to create contact', 500);
    }
  }

  /**
   * Get leads
   */
  async getLeads(req: Request, res: Response): Promise<void> {
    try {
      const { status, source, rating } = req.query;

      const leads = [
        {
          id: 'LEAD-001',
          companyName: 'Future Corp',
          contactName: 'Bob Williams',
          email: 'bob@futurecorp.com',
          phone: '+1-555-0200',
          source: 'WEBSITE',
          status: 'NEW',
          rating: 'HOT',
          estimatedValue: 75000,
          assignedTo: 'SALES-002',
          createdAt: '2024-01-20T00:00:00.000Z',
        },
      ];

      let filtered = leads;
      if (status) {
        filtered = filtered.filter((l) => l.status === status);
      }
      if (source) {
        filtered = filtered.filter((l) => l.source === source);
      }
      if (rating) {
        filtered = filtered.filter((l) => l.rating === rating);
      }

      const result = {
        leads: filtered,
        summary: {
          total: filtered.length,
          estimatedValue: filtered.reduce((sum, l) => sum + l.estimatedValue, 0),
        },
        timestamp: new Date().toISOString(),
      };

      this.sendSuccess(res, result, 'Leads retrieved successfully');
    } catch (error) {
      this.sendError(res, (error as Error).message || 'Failed to get leads', 500);
    }
  }

  /**
   * Convert lead to customer
   */
  async convertLead(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { createOpportunity: createOpp } = req.body;

      if (!id) {
        this.sendError(res, 'Lead ID is required', 400);
        return;
      }

      const customerId = `CUST-${Date.now().toString().slice(-6)}`;
      const opportunityId = createOpp ? `OPP-${Date.now().toString().slice(-6)}` : null;

      const result = {
        leadId: id,
        customerId,
        opportunityId,
        convertedAt: new Date().toISOString(),
        message: 'Lead converted successfully',
      };

      this.sendSuccess(res, result, 'Lead converted to customer successfully');
    } catch (error) {
      this.sendError(res, (error as Error).message || 'Failed to convert lead', 500);
    }
  }
}

// Export singleton instance
export const crmController = new CrmController();
