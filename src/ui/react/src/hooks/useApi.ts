/**
 * Custom React hooks for API data management
 */

import { useState, useEffect, useCallback } from 'react';
import apiService, { 
  ApiResponse, 
  WorkOrder, 
  KPIData, 
  MaintenanceOrder,
  ProductionOrder,
  Project,
  Employee,
  Customer,
  PurchaseOrder,
  Asset,
  ComplianceItem,
  Report,
  Transaction
} from '../services/apiService';

export interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Generic hook for API calls with loading and error states
 */
export function useApi<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  dependencies: any[] = []
): UseApiState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiCall();
      
      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError(response.error || 'Unknown error occurred');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
}

/**
 * Hook for managing work orders with CRUD operations
 */
export function useWorkOrders(filters?: { status?: string; priority?: string; technicianId?: string }) {
  const { data, loading, error, refetch } = useApi(
    () => apiService.getWorkOrders(filters),
    [filters]
  );

  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const createWorkOrder = useCallback(async (workOrder: Omit<WorkOrder, 'id'>) => {
    setActionLoading('create');
    try {
      const response = await apiService.createWorkOrder(workOrder);
      if (response.success) {
        refetch(); // Refresh the list
        return response;
      }
      throw new Error(response.error || 'Failed to create work order');
    } finally {
      setActionLoading(null);
    }
  }, [refetch]);

  const updateWorkOrder = useCallback(async (id: string, updates: Partial<WorkOrder>) => {
    setActionLoading(`update-${id}`);
    try {
      const response = await apiService.updateWorkOrder(id, updates);
      if (response.success) {
        refetch(); // Refresh the list
        return response;
      }
      throw new Error(response.error || 'Failed to update work order');
    } finally {
      setActionLoading(null);
    }
  }, [refetch]);

  const deleteWorkOrder = useCallback(async (id: string) => {
    setActionLoading(`delete-${id}`);
    try {
      const response = await apiService.deleteWorkOrder(id);
      if (response.success) {
        refetch(); // Refresh the list
        return response;
      }
      throw new Error(response.error || 'Failed to delete work order');
    } finally {
      setActionLoading(null);
    }
  }, [refetch]);

  return {
    workOrders: data || [],
    loading,
    error,
    actionLoading,
    refetch,
    createWorkOrder,
    updateWorkOrder,
    deleteWorkOrder,
  };
}

/**
 * Hook for real-time KPI data with Server-Sent Events
 */
export function useRealtimeKPIs() {
  const [kpiData, setKpiData] = useState<KPIData | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let eventSource: EventSource | null = null;

    try {
      eventSource = apiService.subscribeToKPIUpdates((data) => {
        setKpiData(data);
        setConnected(true);
        setError(null);
      });

      eventSource.onopen = () => {
        setConnected(true);
        setError(null);
      };

      eventSource.onerror = () => {
        setConnected(false);
        setError('Connection to real-time updates lost');
      };

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect to real-time updates');
    }

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, []);

  return { kpiData, connected, error };
}

/**
 * Hook for maintenance orders
 */
export function useMaintenanceOrders() {
  const { data, loading, error, refetch } = useApi(() => apiService.getMaintenanceOrders());
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  const createMaintenanceOrder = useCallback(async (order: Omit<MaintenanceOrder, 'id'>) => {
    setActionLoading(true);
    try {
      const response = await apiService.createMaintenanceOrder(order);
      if (response.success) {
        refetch();
        return response;
      }
      throw new Error(response.error || 'Failed to create maintenance order');
    } finally {
      setActionLoading(false);
    }
  }, [refetch]);

  return {
    orders: data || [],
    loading,
    error,
    actionLoading,
    refetch,
    createMaintenanceOrder,
  };
}

/**
 * Hook for manufacturing production orders
 */
export function useProductionOrders(filters?: { status?: string; priority?: string; workCenter?: string }) {
  const { data, loading, error, refetch } = useApi(
    () => apiService.getProductionOrders(filters),
    [filters]
  );

  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const createProductionOrder = useCallback(async (order: Omit<ProductionOrder, 'id'>) => {
    setActionLoading('create');
    try {
      const response = await apiService.createProductionOrder(order);
      if (response.success) {
        refetch();
        return response;
      }
      throw new Error(response.error || 'Failed to create production order');
    } finally {
      setActionLoading(null);
    }
  }, [refetch]);

  const updateProductionOrder = useCallback(async (id: string, updates: Partial<ProductionOrder>) => {
    setActionLoading(`update-${id}`);
    try {
      const response = await apiService.updateProductionOrder(id, updates);
      if (response.success) {
        refetch();
        return response;
      }
      throw new Error(response.error || 'Failed to update production order');
    } finally {
      setActionLoading(null);
    }
  }, [refetch]);

  const deleteProductionOrder = useCallback(async (id: string) => {
    setActionLoading(`delete-${id}`);
    try {
      const response = await apiService.deleteProductionOrder(id);
      if (response.success) {
        refetch();
        return response;
      }
      throw new Error(response.error || 'Failed to delete production order');
    } finally {
      setActionLoading(null);
    }
  }, [refetch]);

  return {
    productionOrders: data || [],
    loading,
    error,
    actionLoading,
    refetch,
    createProductionOrder,
    updateProductionOrder,
    deleteProductionOrder,
  };
}

/**
 * Hook for project management
 */
export function useProjects(filters?: { status?: string; priority?: string; manager?: string }) {
  const { data, loading, error, refetch } = useApi(
    () => apiService.getProjects(filters),
    [filters]
  );

  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const createProject = useCallback(async (project: Omit<Project, 'id'>) => {
    setActionLoading('create');
    try {
      const response = await apiService.createProject(project);
      if (response.success) {
        refetch();
        return response;
      }
      throw new Error(response.error || 'Failed to create project');
    } finally {
      setActionLoading(null);
    }
  }, [refetch]);

  const updateProject = useCallback(async (id: string, updates: Partial<Project>) => {
    setActionLoading(`update-${id}`);
    try {
      const response = await apiService.updateProject(id, updates);
      if (response.success) {
        refetch();
        return response;
      }
      throw new Error(response.error || 'Failed to update project');
    } finally {
      setActionLoading(null);
    }
  }, [refetch]);

  const deleteProject = useCallback(async (id: string) => {
    setActionLoading(`delete-${id}`);
    try {
      const response = await apiService.deleteProject(id);
      if (response.success) {
        refetch();
        return response;
      }
      throw new Error(response.error || 'Failed to delete project');
    } finally {
      setActionLoading(null);
    }
  }, [refetch]);

  return {
    projects: data || [],
    loading,
    error,
    actionLoading,
    refetch,
    createProject,
    updateProject,
    deleteProject,
  };
}

/**
 * Hook for HR employee management
 */
export function useEmployees(filters?: { department?: string; status?: string; position?: string }) {
  const { data, loading, error, refetch } = useApi(
    () => apiService.getEmployees(filters),
    [filters]
  );

  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const createEmployee = useCallback(async (employee: Omit<Employee, 'id'>) => {
    setActionLoading('create');
    try {
      const response = await apiService.createEmployee(employee);
      if (response.success) {
        refetch();
        return response;
      }
      throw new Error(response.error || 'Failed to create employee');
    } finally {
      setActionLoading(null);
    }
  }, [refetch]);

  const updateEmployee = useCallback(async (id: string, updates: Partial<Employee>) => {
    setActionLoading(`update-${id}`);
    try {
      const response = await apiService.updateEmployee(id, updates);
      if (response.success) {
        refetch();
        return response;
      }
      throw new Error(response.error || 'Failed to update employee');
    } finally {
      setActionLoading(null);
    }
  }, [refetch]);

  const deleteEmployee = useCallback(async (id: string) => {
    setActionLoading(`delete-${id}`);
    try {
      const response = await apiService.deleteEmployee(id);
      if (response.success) {
        refetch();
        return response;
      }
      throw new Error(response.error || 'Failed to delete employee');
    } finally {
      setActionLoading(null);
    }
  }, [refetch]);

  return {
    employees: data || [],
    loading,
    error,
    actionLoading,
    refetch,
    createEmployee,
    updateEmployee,
    deleteEmployee,
  };
}

/**
 * Hook for CRM customer management
 */
export function useCustomers(filters?: { status?: string; industry?: string }) {
  const { data, loading, error, refetch } = useApi(
    () => apiService.getCustomers(filters),
    [filters]
  );

  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const createCustomer = useCallback(async (customer: Omit<Customer, 'id'>) => {
    setActionLoading('create');
    try {
      const response = await apiService.createCustomer(customer);
      if (response.success) {
        refetch();
        return response;
      }
      throw new Error(response.error || 'Failed to create customer');
    } finally {
      setActionLoading(null);
    }
  }, [refetch]);

  const updateCustomer = useCallback(async (id: string, updates: Partial<Customer>) => {
    setActionLoading(`update-${id}`);
    try {
      const response = await apiService.updateCustomer(id, updates);
      if (response.success) {
        refetch();
        return response;
      }
      throw new Error(response.error || 'Failed to update customer');
    } finally {
      setActionLoading(null);
    }
  }, [refetch]);

  const deleteCustomer = useCallback(async (id: string) => {
    setActionLoading(`delete-${id}`);
    try {
      const response = await apiService.deleteCustomer(id);
      if (response.success) {
        refetch();
        return response;
      }
      throw new Error(response.error || 'Failed to delete customer');
    } finally {
      setActionLoading(null);
    }
  }, [refetch]);

  return {
    customers: data || [],
    loading,
    error,
    actionLoading,
    refetch,
    createCustomer,
    updateCustomer,
    deleteCustomer,
  };
}

/**
 * Hook for supply chain purchase orders
 */
export function usePurchaseOrders(filters?: { status?: string; supplier?: string }) {
  const { data, loading, error, refetch } = useApi(
    () => apiService.getPurchaseOrders(filters),
    [filters]
  );

  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const createPurchaseOrder = useCallback(async (order: Omit<PurchaseOrder, 'id'>) => {
    setActionLoading('create');
    try {
      const response = await apiService.createPurchaseOrder(order);
      if (response.success) {
        refetch();
        return response;
      }
      throw new Error(response.error || 'Failed to create purchase order');
    } finally {
      setActionLoading(null);
    }
  }, [refetch]);

  const updatePurchaseOrder = useCallback(async (id: string, updates: Partial<PurchaseOrder>) => {
    setActionLoading(`update-${id}`);
    try {
      const response = await apiService.updatePurchaseOrder(id, updates);
      if (response.success) {
        refetch();
        return response;
      }
      throw new Error(response.error || 'Failed to update purchase order');
    } finally {
      setActionLoading(null);
    }
  }, [refetch]);

  const deletePurchaseOrder = useCallback(async (id: string) => {
    setActionLoading(`delete-${id}`);
    try {
      const response = await apiService.deletePurchaseOrder(id);
      if (response.success) {
        refetch();
        return response;
      }
      throw new Error(response.error || 'Failed to delete purchase order');
    } finally {
      setActionLoading(null);
    }
  }, [refetch]);

  return {
    purchaseOrders: data || [],
    loading,
    error,
    actionLoading,
    refetch,
    createPurchaseOrder,
    updatePurchaseOrder,
    deletePurchaseOrder,
  };
}

/**
 * Hook for asset management
 */
export function useAssets(filters?: { category?: string; status?: string; location?: string }) {
  const { data, loading, error, refetch } = useApi(
    () => apiService.getAssets(filters),
    [filters]
  );

  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const createAsset = useCallback(async (asset: Omit<Asset, 'id'>) => {
    setActionLoading('create');
    try {
      const response = await apiService.createAsset(asset);
      if (response.success) {
        refetch();
        return response;
      }
      throw new Error(response.error || 'Failed to create asset');
    } finally {
      setActionLoading(null);
    }
  }, [refetch]);

  const updateAsset = useCallback(async (id: string, updates: Partial<Asset>) => {
    setActionLoading(`update-${id}`);
    try {
      const response = await apiService.updateAsset(id, updates);
      if (response.success) {
        refetch();
        return response;
      }
      throw new Error(response.error || 'Failed to update asset');
    } finally {
      setActionLoading(null);
    }
  }, [refetch]);

  const deleteAsset = useCallback(async (id: string) => {
    setActionLoading(`delete-${id}`);
    try {
      const response = await apiService.deleteAsset(id);
      if (response.success) {
        refetch();
        return response;
      }
      throw new Error(response.error || 'Failed to delete asset');
    } finally {
      setActionLoading(null);
    }
  }, [refetch]);

  return {
    assets: data || [],
    loading,
    error,
    actionLoading,
    refetch,
    createAsset,
    updateAsset,
    deleteAsset,
  };
}

/**
 * Hook for compliance management
 */
export function useComplianceItems(filters?: { type?: string; status?: string; severity?: string }) {
  const { data, loading, error, refetch } = useApi(
    () => apiService.getComplianceItems(filters),
    [filters]
  );

  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const createComplianceItem = useCallback(async (item: Omit<ComplianceItem, 'id'>) => {
    setActionLoading('create');
    try {
      const response = await apiService.createComplianceItem(item);
      if (response.success) {
        refetch();
        return response;
      }
      throw new Error(response.error || 'Failed to create compliance item');
    } finally {
      setActionLoading(null);
    }
  }, [refetch]);

  const updateComplianceItem = useCallback(async (id: string, updates: Partial<ComplianceItem>) => {
    setActionLoading(`update-${id}`);
    try {
      const response = await apiService.updateComplianceItem(id, updates);
      if (response.success) {
        refetch();
        return response;
      }
      throw new Error(response.error || 'Failed to update compliance item');
    } finally {
      setActionLoading(null);
    }
  }, [refetch]);

  const deleteComplianceItem = useCallback(async (id: string) => {
    setActionLoading(`delete-${id}`);
    try {
      const response = await apiService.deleteComplianceItem(id);
      if (response.success) {
        refetch();
        return response;
      }
      throw new Error(response.error || 'Failed to delete compliance item');
    } finally {
      setActionLoading(null);
    }
  }, [refetch]);

  return {
    complianceItems: data || [],
    loading,
    error,
    actionLoading,
    refetch,
    createComplianceItem,
    updateComplianceItem,
    deleteComplianceItem,
  };
}

/**
 * Hook for business intelligence reports
 */
export function useReports(filters?: { type?: string; status?: string }) {
  const { data, loading, error, refetch } = useApi(
    () => apiService.getReports(filters),
    [filters]
  );

  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const createReport = useCallback(async (report: Omit<Report, 'id'>) => {
    setActionLoading('create');
    try {
      const response = await apiService.createReport(report);
      if (response.success) {
        refetch();
        return response;
      }
      throw new Error(response.error || 'Failed to create report');
    } finally {
      setActionLoading(null);
    }
  }, [refetch]);

  const updateReport = useCallback(async (id: string, updates: Partial<Report>) => {
    setActionLoading(`update-${id}`);
    try {
      const response = await apiService.updateReport(id, updates);
      if (response.success) {
        refetch();
        return response;
      }
      throw new Error(response.error || 'Failed to update report');
    } finally {
      setActionLoading(null);
    }
  }, [refetch]);

  const deleteReport = useCallback(async (id: string) => {
    setActionLoading(`delete-${id}`);
    try {
      const response = await apiService.deleteReport(id);
      if (response.success) {
        refetch();
        return response;
      }
      throw new Error(response.error || 'Failed to delete report');
    } finally {
      setActionLoading(null);
    }
  }, [refetch]);

  return {
    reports: data || [],
    loading,
    error,
    actionLoading,
    refetch,
    createReport,
    updateReport,
    deleteReport,
  };
}

/**
 * Hook for enhanced financial transaction management
 */
export function useFinancialTransactions(filters?: { startDate?: string; endDate?: string; accountId?: string }) {
  const { data, loading, error, refetch } = useApi(
    () => apiService.getTransactions(filters),
    [filters]
  );

  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const createTransaction = useCallback(async (transaction: Omit<Transaction, 'id'>) => {
    setActionLoading('create');
    try {
      const response = await apiService.createTransaction(transaction);
      if (response.success) {
        refetch();
        return response;
      }
      throw new Error(response.error || 'Failed to create transaction');
    } finally {
      setActionLoading(null);
    }
  }, [refetch]);

  const updateTransaction = useCallback(async (id: string, updates: Partial<Transaction>) => {
    setActionLoading(`update-${id}`);
    try {
      const response = await apiService.updateTransaction(id, updates);
      if (response.success) {
        refetch();
        return response;
      }
      throw new Error(response.error || 'Failed to update transaction');
    } finally {
      setActionLoading(null);
    }
  }, [refetch]);

  const deleteTransaction = useCallback(async (id: string) => {
    setActionLoading(`delete-${id}`);
    try {
      const response = await apiService.deleteTransaction(id);
      if (response.success) {
        refetch();
        return response;
      }
      throw new Error(response.error || 'Failed to delete transaction');
    } finally {
      setActionLoading(null);
    }
  }, [refetch]);

  return {
    transactions: data || [],
    loading,
    error,
    actionLoading,
    refetch,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  };
}

/**
 * Hook for financial data
 */
export function useAccountBalances() {
  return useApi(() => apiService.getAccountBalances());
}

export function useTransactions(params?: { startDate?: string; endDate?: string; accountId?: string }) {
  return useApi(() => apiService.getTransactions(params), [params]);
}