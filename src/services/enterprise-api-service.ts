/**
 * Production-Grade Enterprise API Service
 * Complete frontend-backend integration for 48 business modules
 * Provides standardized API access to all Rust-powered business logic
 */

import axios from 'axios';
import { createLogger } from '../core/logger';
import { v4 as uuidv4 } from 'uuid';

const logger = createLogger('EnterpriseAPIService');

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
  correlationId?: string;
}

export interface BusinessMetrics {
  module: string;
  efficiency: number;
  cost_savings: number;
  roi_percentage: number;
  processing_time_ms: number;
  last_updated: string;
}

export interface EnterpriseFeature {
  id: string;
  name: string;
  category: string;
  status: 'active' | 'processing' | 'error' | 'maintenance';
  metrics: BusinessMetrics;
  config: Record<string, any>;
}

export class EnterpriseAPIService {
  private client: any;
  private baseURL: string;

  constructor(baseURL = '/api/v1') {
    this.baseURL = baseURL;
    this.client = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Add request interceptors for logging and correlation
    this.client.interceptors.request.use(
      (config) => {
        const correlationId = this.generateCorrelationId();
        config.headers = config.headers || {};
        config.headers['X-Correlation-ID'] = correlationId;
        
        logger.info('API Request', {
          method: config.method,
          url: config.url,
          correlationId,
        });
        return config;
      },
      (error) => {
        logger.error('API Request Error', error);
        return Promise.reject(error);
      }
    );

    // Add response interceptors for logging and error handling
    this.client.interceptors.response.use(
      (response) => {
        logger.info('API Response Success', {
          status: response.status,
          url: response.config.url,
          correlationId: response.config.headers?.['X-Correlation-ID'],
        });
        return response;
      },
      (error: any) => {
        logger.error('API Response Error', {
          status: error.response?.status,
          url: error.config?.url,
          message: error.message,
          correlationId: error.config?.headers?.['X-Correlation-ID'],
        });
        return Promise.reject(error);
      }
    );
  }

  /**
   * Financial Module APIs
   */
  async getFinancialMetrics(): Promise<APIResponse<BusinessMetrics>> {
    try {
      const response = await this.client.get('/financial/metrics');
      return this.formatResponse(response.data);
    } catch (error) {
      return this.formatError(error as Error);
    }
  }

  async createFinancialTransaction(transaction: any): Promise<APIResponse<any>> {
    try {
      const response = await this.client.post('/financial/transactions', transaction);
      return this.formatResponse(response.data);
    } catch (error) {
      return this.formatError(error as Error);
    }
  }

  async calculateLeasePricing(params: {
    assetValue: number;
    termMonths: number;
    customerId?: string;
  }): Promise<APIResponse<any>> {
    try {
      const response = await this.client.post('/financial/lease-pricing', params);
      return this.formatResponse(response.data);
    } catch (error) {
      return this.formatError(error as Error);
    }
  }

  /**
   * Manufacturing Module APIs
   */
  async getManufacturingMetrics(): Promise<APIResponse<BusinessMetrics>> {
    try {
      const response = await this.client.get('/manufacturing/metrics');
      return this.formatResponse(response.data);
    } catch (error) {
      return this.formatError(error as Error);
    }
  }

  async optimizeProductionSchedule(params: {
    demands: number[];
    capacity: number;
    resources: any[];
  }): Promise<APIResponse<any>> {
    try {
      const response = await this.client.post('/manufacturing/optimize-schedule', params);
      return this.formatResponse(response.data);
    } catch (error) {
      return this.formatError(error as Error);
    }
  }

  /**
   * HR Module APIs
   */
  async getHRMetrics(): Promise<APIResponse<BusinessMetrics>> {
    try {
      const response = await this.client.get('/hr/metrics');
      return this.formatResponse(response.data);
    } catch (error) {
      return this.formatError(error as Error);
    }
  }

  async calculatePayroll(params: {
    employeeId: string;
    payPeriod: string;
    hoursWorked: number;
  }): Promise<APIResponse<any>> {
    try {
      const response = await this.client.post('/hr/payroll/calculate', params);
      return this.formatResponse(response.data);
    } catch (error) {
      return this.formatError(error as Error);
    }
  }

  /**
   * CRM Module APIs
   */
  async getCRMMetrics(): Promise<APIResponse<BusinessMetrics>> {
    try {
      const response = await this.client.get('/crm/metrics');
      return this.formatResponse(response.data);
    } catch (error) {
      return this.formatError(error as Error);
    }
  }

  async analyzeCustomerSegments(): Promise<APIResponse<any>> {
    try {
      const response = await this.client.get('/crm/customer-segments');
      return this.formatResponse(response.data);
    } catch (error) {
      return this.formatError(error as Error);
    }
  }

  /**
   * Advanced Analytics APIs
   */
  async getPredictiveAnalytics(params: {
    module: string;
    dataPoints: number[];
    forecastPeriods: number;
  }): Promise<APIResponse<any>> {
    try {
      const response = await this.client.post('/analytics/predictive', params);
      return this.formatResponse(response.data);
    } catch (error) {
      return this.formatError(error as Error);
    }
  }

  async generateBusinessIntelligenceReport(reportType: string): Promise<APIResponse<any>> {
    try {
      const response = await this.client.post('/analytics/bi-report', { reportType });
      return this.formatResponse(response.data);
    } catch (error) {
      return this.formatError(error as Error);
    }
  }

  /**
   * Enterprise Suite Status
   */
  async getAllModuleStatus(): Promise<APIResponse<EnterpriseFeature[]>> {
    try {
      const response = await this.client.get('/enterprise/status');
      return this.formatResponse(response.data);
    } catch (error) {
      return this.formatError(error as Error);
    }
  }

  async getSystemHealth(): Promise<APIResponse<any>> {
    try {
      const response = await this.client.get('/enterprise/health');
      return this.formatResponse(response.data);
    } catch (error) {
      return this.formatError(error as Error);
    }
  }

  /**
   * Business Rules Engine
   */
  async executeBusinessRule(ruleId: string, context: any): Promise<APIResponse<any>> {
    try {
      const response = await this.client.post('/business-rules/execute', {
        ruleId,
        context,
      });
      return this.formatResponse(response.data);
    } catch (error) {
      return this.formatError(error as Error);
    }
  }

  async validateBusinessData(data: any, rules: string[]): Promise<APIResponse<any>> {
    try {
      const response = await this.client.post('/business-rules/validate', {
        data,
        rules,
      });
      return this.formatResponse(response.data);
    } catch (error) {
      return this.formatError(error as Error);
    }
  }

  /**
   * Utility Methods
   */
  private formatResponse<T>(data: T): APIResponse<T> {
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  private formatError(error: Error): APIResponse<never> {
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  }

  private generateCorrelationId(): string {
    return `${Date.now()}-${uuidv4().substring(0, 8)}`;
  }
}

// Singleton instance for global use
export const enterpriseAPI = new EnterpriseAPIService();

export default EnterpriseAPIService;