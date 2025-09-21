/**
 * API Service Layer for Titan Grove React Frontend
 * Handles all HTTP communication with the backend APIs
 */

// Enhanced API configuration with fallbacks for browser environment
const API_CONFIG = {
  baseURL:
    (typeof process !== 'undefined' && process.env?.REACT_APP_API_URL) ||
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
    (window.location.hostname === 'localhost' ? 'http://localhost:3000/api' : '/api'),
  timeout: parseInt(
    (typeof process !== 'undefined' && process.env?.REACT_APP_API_TIMEOUT) ||
      (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_TIMEOUT) ||
      '30000'
  ),
  retryAttempts: parseInt(
    (typeof process !== 'undefined' && process.env?.REACT_APP_API_RETRY_ATTEMPTS) ||
      (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_RETRY_ATTEMPTS) ||
      '3'
  ),
  retryDelay: parseInt(
    (typeof process !== 'undefined' && process.env?.REACT_APP_API_RETRY_DELAY) ||
      (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_RETRY_DELAY) ||
      '1000'
  ),
};

const API_BASE_URL = API_CONFIG.baseURL;

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    endpoint?: string;
    retryCount?: number;
    timestamp?: string;
    [key: string]: any;
  };
}

export interface WorkOrder {
  id: string;
  title: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' | 'EMERGENCY';
  status: 'CREATED' | 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  customer: string;
  technician: string;
  scheduledDate: string;
  estimatedDuration: number;
}

export interface KPIData {
  activeWorkOrders: number;
  avgResponseTime: string;
  technicianUtilization: string;
  customerSatisfaction: string;
}

export interface MaintenanceOrder {
  id: string;
  assetId: string;
  assetName: string;
  type: 'PREVENTIVE' | 'CORRECTIVE' | 'PREDICTIVE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: string;
  scheduledDate: string;
  estimatedDuration: number;
}

// Manufacturing interfaces
export interface ProductionOrder {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  status: 'PLANNED' | 'RELEASED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  startDate: string;
  dueDate: string;
  workCenter: string;
}

// Project Management interfaces
export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'PLANNING' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  startDate: string;
  endDate: string;
  budget: number;
  manager: string;
  team: string[];
}

// HR Management interfaces
export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  position: string;
  status: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE' | 'TERMINATED';
  hireDate: string;
  salary: number;
}

// CRM interfaces
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PROSPECT' | 'LOST';
  industry: string;
  value: number;
  lastContact: string;
}

// Supply Chain interfaces
export interface PurchaseOrder {
  id: string;
  supplier: string;
  status: 'DRAFT' | 'SENT' | 'CONFIRMED' | 'DELIVERED' | 'CANCELLED';
  orderDate: string;
  deliveryDate: string;
  totalAmount: number;
  items: string[];
}

// Asset Management interfaces
export interface Asset {
  id: string;
  name: string;
  category: string;
  location: string;
  status: 'ACTIVE' | 'MAINTENANCE' | 'RETIRED' | 'DISPOSED';
  acquiredDate: string;
  value: number;
  depreciationRate: number;
}

// Compliance interfaces
export interface ComplianceItem {
  id: string;
  title: string;
  type: 'REGULATION' | 'AUDIT' | 'POLICY' | 'RISK_ASSESSMENT';
  status: 'COMPLIANT' | 'NON_COMPLIANT' | 'IN_PROGRESS' | 'OVERDUE';
  dueDate: string;
  owner: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

// Business Intelligence interfaces
export interface Report {
  id: string;
  name: string;
  type: 'FINANCIAL' | 'OPERATIONAL' | 'STRATEGIC' | 'COMPLIANCE';
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  createdBy: string;
  createdDate: string;
  lastUpdated: string;
}

// Financial interfaces
export interface Transaction {
  id: string;
  account: string;
  type: 'DEBIT' | 'CREDIT';
  amount: number;
  description: string;
  date: string;
  reference: string;
  status: 'PENDING' | 'CLEARED' | 'RECONCILED';
}

class ApiService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    retryCount = 0
  ): Promise<ApiResponse<T>> {
    try {
      // Add timeout wrapper
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        signal: controller.signal,
        ...options,
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      // Enhanced error handling with retry logic
      const isNetworkError =
        error instanceof TypeError ||
        (error as any)?.name === 'AbortError' ||
        (error as any)?.code === 'NETWORK_ERROR';

      if (isNetworkError && retryCount < API_CONFIG.retryAttempts) {
        console.warn(
          `API Error [${endpoint}] - Retrying (${retryCount + 1}/${API_CONFIG.retryAttempts}):`,
          error
        );

        // Exponential backoff
        const delay = API_CONFIG.retryDelay * Math.pow(2, retryCount);
        await new Promise((resolve) => setTimeout(resolve, delay));

        return this.makeRequest(endpoint, options, retryCount + 1);
      }

      console.error(`API Error [${endpoint}] (final):`, error);

      // Return structured error response
      const errorMessage = this.getErrorMessage(error);
      return {
        success: false,
        error: errorMessage,
        meta: {
          endpoint,
          retryCount,
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  private getErrorMessage(error: any): string {
    if (error instanceof TypeError) {
      return 'Network connection failed. Please check your internet connection.';
    }
    if (error?.name === 'AbortError') {
      return 'Request timed out. Please try again.';
    }
    if (error?.message?.includes('Failed to fetch')) {
      return 'Unable to connect to server. Please check if the service is running.';
    }
    return error instanceof Error ? (error as Error).message : 'An unexpected error occurred';
  }

  // Health Check
  async getHealth(): Promise<ApiResponse<{ status: string; timestamp: string }>> {
    return this.makeRequest('/health');
  }

  // Field Service APIs
  async getWorkOrders(params?: {
    status?: string;
    priority?: string;
    technicianId?: string;
  }): Promise<ApiResponse<WorkOrder[]>> {
    const queryParams = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.makeRequest(`/field-service/work-orders${queryParams}`);
  }

  async createWorkOrder(workOrder: Omit<WorkOrder, 'id'>): Promise<ApiResponse<WorkOrder>> {
    return this.makeRequest('/field-service/work-orders', {
      method: 'POST',
      body: JSON.stringify(workOrder),
    });
  }

  async updateWorkOrder(id: string, updates: Partial<WorkOrder>): Promise<ApiResponse<WorkOrder>> {
    return this.makeRequest(`/field-service/work-orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteWorkOrder(id: string): Promise<ApiResponse<void>> {
    return this.makeRequest(`/field-service/work-orders/${id}`, {
      method: 'DELETE',
    });
  }

  // Service Command Center APIs
  async getServiceKPIs(): Promise<ApiResponse<KPIData>> {
    return this.makeRequest('/service-command/kpis');
  }

  async getMapData(layers?: string[]): Promise<ApiResponse<any>> {
    const queryParams = layers ? '?layers=' + layers.join(',') : '';
    return this.makeRequest(`/service-command/map-data${queryParams}`);
  }

  // Maintenance APIs
  async getMaintenanceOrders(): Promise<ApiResponse<MaintenanceOrder[]>> {
    return this.makeRequest('/maintenance/orders');
  }

  async createMaintenanceOrder(
    order: Omit<MaintenanceOrder, 'id'>
  ): Promise<ApiResponse<MaintenanceOrder>> {
    return this.makeRequest('/maintenance/orders', {
      method: 'POST',
      body: JSON.stringify(order),
    });
  }

  // Financial APIs
  async getAccountBalances(): Promise<ApiResponse<any>> {
    return this.makeRequest('/financial/accounts/balances');
  }

  // Real-time Data Stream
  createEventSource(endpoint: string): EventSource {
    return new EventSource(`${API_BASE_URL}${endpoint}`);
  }

  // Real-time KPI updates using Server-Sent Events
  subscribeToKPIUpdates(callback: (data: KPIData) => void): EventSource {
    const eventSource = this.createEventSource('/realtime/stream');

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'KPI_UPDATE') {
          callback(data.data);
        }
      } catch (error) {
        console.error('Error parsing SSE data:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('EventSource error:', error);
    };

    return eventSource;
  }

  // Manufacturing APIs
  async getProductionOrders(params?: {
    status?: string;
    priority?: string;
    workCenter?: string;
  }): Promise<ApiResponse<ProductionOrder[]>> {
    const queryParams = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.makeRequest(`/manufacturing/production-orders${queryParams}`);
  }

  async createProductionOrder(
    order: Omit<ProductionOrder, 'id'>
  ): Promise<ApiResponse<ProductionOrder>> {
    return this.makeRequest('/manufacturing/production-orders', {
      method: 'POST',
      body: JSON.stringify(order),
    });
  }

  async updateProductionOrder(
    id: string,
    updates: Partial<ProductionOrder>
  ): Promise<ApiResponse<ProductionOrder>> {
    return this.makeRequest(`/manufacturing/production-orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteProductionOrder(id: string): Promise<ApiResponse<void>> {
    return this.makeRequest(`/manufacturing/production-orders/${id}`, {
      method: 'DELETE',
    });
  }

  // Project Management APIs
  async getProjects(params?: {
    status?: string;
    priority?: string;
    manager?: string;
  }): Promise<ApiResponse<Project[]>> {
    const queryParams = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.makeRequest(`/projects${queryParams}`);
  }

  async createProject(project: Omit<Project, 'id'>): Promise<ApiResponse<Project>> {
    return this.makeRequest('/projects', {
      method: 'POST',
      body: JSON.stringify(project),
    });
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<ApiResponse<Project>> {
    return this.makeRequest(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteProject(id: string): Promise<ApiResponse<void>> {
    return this.makeRequest(`/projects/${id}`, {
      method: 'DELETE',
    });
  }

  // HR Management APIs
  async getEmployees(params?: {
    department?: string;
    status?: string;
    position?: string;
  }): Promise<ApiResponse<Employee[]>> {
    const queryParams = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.makeRequest(`/hr/employees${queryParams}`);
  }

  async createEmployee(employee: Omit<Employee, 'id'>): Promise<ApiResponse<Employee>> {
    return this.makeRequest('/hr/employees', {
      method: 'POST',
      body: JSON.stringify(employee),
    });
  }

  async updateEmployee(id: string, updates: Partial<Employee>): Promise<ApiResponse<Employee>> {
    return this.makeRequest(`/hr/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteEmployee(id: string): Promise<ApiResponse<void>> {
    return this.makeRequest(`/hr/employees/${id}`, {
      method: 'DELETE',
    });
  }

  // CRM APIs
  async getCustomers(params?: {
    status?: string;
    industry?: string;
  }): Promise<ApiResponse<Customer[]>> {
    const queryParams = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.makeRequest(`/crm/customers${queryParams}`);
  }

  async createCustomer(customer: Omit<Customer, 'id'>): Promise<ApiResponse<Customer>> {
    return this.makeRequest('/crm/customers', {
      method: 'POST',
      body: JSON.stringify(customer),
    });
  }

  async updateCustomer(id: string, updates: Partial<Customer>): Promise<ApiResponse<Customer>> {
    return this.makeRequest(`/crm/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteCustomer(id: string): Promise<ApiResponse<void>> {
    return this.makeRequest(`/crm/customers/${id}`, {
      method: 'DELETE',
    });
  }

  // Supply Chain APIs
  async getPurchaseOrders(params?: {
    status?: string;
    supplier?: string;
  }): Promise<ApiResponse<PurchaseOrder[]>> {
    const queryParams = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.makeRequest(`/supply-chain/purchase-orders${queryParams}`);
  }

  async createPurchaseOrder(order: Omit<PurchaseOrder, 'id'>): Promise<ApiResponse<PurchaseOrder>> {
    return this.makeRequest('/supply-chain/purchase-orders', {
      method: 'POST',
      body: JSON.stringify(order),
    });
  }

  async updatePurchaseOrder(
    id: string,
    updates: Partial<PurchaseOrder>
  ): Promise<ApiResponse<PurchaseOrder>> {
    return this.makeRequest(`/supply-chain/purchase-orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deletePurchaseOrder(id: string): Promise<ApiResponse<void>> {
    return this.makeRequest(`/supply-chain/purchase-orders/${id}`, {
      method: 'DELETE',
    });
  }

  // Asset Management APIs
  async getAssets(params?: {
    category?: string;
    status?: string;
    location?: string;
  }): Promise<ApiResponse<Asset[]>> {
    const queryParams = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.makeRequest(`/assets${queryParams}`);
  }

  async createAsset(asset: Omit<Asset, 'id'>): Promise<ApiResponse<Asset>> {
    return this.makeRequest('/assets', {
      method: 'POST',
      body: JSON.stringify(asset),
    });
  }

  async updateAsset(id: string, updates: Partial<Asset>): Promise<ApiResponse<Asset>> {
    return this.makeRequest(`/assets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteAsset(id: string): Promise<ApiResponse<void>> {
    return this.makeRequest(`/assets/${id}`, {
      method: 'DELETE',
    });
  }

  // Compliance APIs
  async getComplianceItems(params?: {
    type?: string;
    status?: string;
    severity?: string;
  }): Promise<ApiResponse<ComplianceItem[]>> {
    const queryParams = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.makeRequest(`/compliance/items${queryParams}`);
  }

  async createComplianceItem(
    item: Omit<ComplianceItem, 'id'>
  ): Promise<ApiResponse<ComplianceItem>> {
    return this.makeRequest('/compliance/items', {
      method: 'POST',
      body: JSON.stringify(item),
    });
  }

  async updateComplianceItem(
    id: string,
    updates: Partial<ComplianceItem>
  ): Promise<ApiResponse<ComplianceItem>> {
    return this.makeRequest(`/compliance/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteComplianceItem(id: string): Promise<ApiResponse<void>> {
    return this.makeRequest(`/compliance/items/${id}`, {
      method: 'DELETE',
    });
  }

  // Business Intelligence APIs
  async getReports(params?: { type?: string; status?: string }): Promise<ApiResponse<Report[]>> {
    const queryParams = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.makeRequest(`/bi/reports${queryParams}`);
  }

  async createReport(report: Omit<Report, 'id'>): Promise<ApiResponse<Report>> {
    return this.makeRequest('/bi/reports', {
      method: 'POST',
      body: JSON.stringify(report),
    });
  }

  async updateReport(id: string, updates: Partial<Report>): Promise<ApiResponse<Report>> {
    return this.makeRequest(`/bi/reports/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteReport(id: string): Promise<ApiResponse<void>> {
    return this.makeRequest(`/bi/reports/${id}`, {
      method: 'DELETE',
    });
  }

  // Enhanced Financial APIs
  async getTransactions(params?: {
    startDate?: string;
    endDate?: string;
    accountId?: string;
  }): Promise<ApiResponse<Transaction[]>> {
    const queryParams = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.makeRequest(`/financial/transactions${queryParams}`);
  }

  async createTransaction(transaction: Omit<Transaction, 'id'>): Promise<ApiResponse<Transaction>> {
    return this.makeRequest('/financial/transactions', {
      method: 'POST',
      body: JSON.stringify(transaction),
    });
  }

  async updateTransaction(
    id: string,
    updates: Partial<Transaction>
  ): Promise<ApiResponse<Transaction>> {
    return this.makeRequest(`/financial/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteTransaction(id: string): Promise<ApiResponse<void>> {
    return this.makeRequest(`/financial/transactions/${id}`, {
      method: 'DELETE',
    });
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
