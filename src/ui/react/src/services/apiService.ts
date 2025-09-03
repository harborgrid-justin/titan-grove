/**
 * API Service Layer for Titan Grove React Frontend
 * Handles all HTTP communication with the backend APIs
 */

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api'  // In production, API will be served from same origin
  : 'http://localhost:3000/api'; // In development, backend runs on port 3000

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
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

class ApiService {
  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // Health Check
  async getHealth(): Promise<ApiResponse<{ status: string; timestamp: string }>> {
    return this.makeRequest('/health');
  }

  // Field Service APIs
  async getWorkOrders(params?: { 
    status?: string; 
    priority?: string; 
    technicianId?: string 
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

  async createMaintenanceOrder(order: Omit<MaintenanceOrder, 'id'>): Promise<ApiResponse<MaintenanceOrder>> {
    return this.makeRequest('/maintenance/orders', {
      method: 'POST',
      body: JSON.stringify(order),
    });
  }

  // Financial APIs
  async getAccountBalances(): Promise<ApiResponse<any>> {
    return this.makeRequest('/financial/accounts/balances');
  }

  async getTransactions(params?: { 
    startDate?: string; 
    endDate?: string; 
    accountId?: string 
  }): Promise<ApiResponse<any[]>> {
    const queryParams = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.makeRequest(`/financial/transactions${queryParams}`);
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
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;