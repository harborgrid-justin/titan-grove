/**
 * Custom React hooks for API data management
 */

import { useState, useEffect, useCallback } from 'react';
import apiService, { ApiResponse, WorkOrder, KPIData, MaintenanceOrder } from '../services/apiService';

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
 * Hook for financial data
 */
export function useAccountBalances() {
  return useApi(() => apiService.getAccountBalances());
}

export function useTransactions(params?: { startDate?: string; endDate?: string; accountId?: string }) {
  return useApi(() => apiService.getTransactions(params), [params]);
}