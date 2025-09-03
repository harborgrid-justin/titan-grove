import React, { useState } from 'react';
import { WorkOrder } from '../services/apiService';

interface WorkOrderModalProps {
  isOpen: boolean;
  workOrder?: WorkOrder | null;
  onClose: () => void;
  onSave: (workOrder: Omit<WorkOrder, 'id'> | WorkOrder) => Promise<void>;
  loading?: boolean;
}

const WorkOrderModal: React.FC<WorkOrderModalProps> = ({
  isOpen,
  workOrder,
  onClose,
  onSave,
  loading = false
}) => {
  const [formData, setFormData] = useState({
    title: workOrder?.title || '',
    priority: workOrder?.priority || 'MEDIUM',
    status: workOrder?.status || 'CREATED',
    customer: workOrder?.customer || '',
    technician: workOrder?.technician || '',
    scheduledDate: workOrder?.scheduledDate 
      ? new Date(workOrder.scheduledDate).toISOString().split('T')[0] 
      : new Date().toISOString().split('T')[0],
    estimatedDuration: workOrder?.estimatedDuration || 120
  });

  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.customer.trim()) errors.customer = 'Customer is required';
    if (!formData.technician.trim()) errors.technician = 'Technician is required';
    if (formData.estimatedDuration < 30) errors.estimatedDuration = 'Duration must be at least 30 minutes';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const orderData = {
        ...formData,
        scheduledDate: new Date(formData.scheduledDate).toISOString(),
        estimatedDuration: parseInt(formData.estimatedDuration.toString())
      };

      if (workOrder?.id) {
        await onSave({ ...orderData, id: workOrder.id } as WorkOrder);
      } else {
        await onSave(orderData);
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving work order:', error);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      priority: 'MEDIUM',
      status: 'CREATED',
      customer: '',
      technician: '',
      scheduledDate: new Date().toISOString().split('T')[0],
      estimatedDuration: 120
    });
    setFormErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '24px',
        width: '90%',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <h2 style={{ margin: 0, color: 'var(--text-primary)' }}>
            {workOrder ? 'Edit Work Order' : 'Create New Work Order'}
          </h2>
          <button
            onClick={handleClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: 'var(--text-secondary)'
            }}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '4px', 
              fontWeight: 500,
              color: 'var(--text-primary)'
            }}>
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: `1px solid ${formErrors.title ? 'var(--error)' : '#e2e8f0'}`,
                borderRadius: '6px',
                fontSize: '14px',
                fontFamily: 'var(--font-primary)'
              }}
              placeholder="Enter work order title"
            />
            {formErrors.title && (
              <span style={{ color: 'var(--error)', fontSize: '12px' }}>{formErrors.title}</span>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '4px', 
                fontWeight: 500,
                color: 'var(--text-primary)'
              }}>
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontFamily: 'var(--font-primary)'
                }}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
                <option value="EMERGENCY">Emergency</option>
              </select>
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '4px', 
                fontWeight: 500,
                color: 'var(--text-primary)'
              }}>
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontFamily: 'var(--font-primary)'
                }}
              >
                <option value="CREATED">Created</option>
                <option value="SCHEDULED">Scheduled</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '4px', 
                fontWeight: 500,
                color: 'var(--text-primary)'
              }}>
                Customer *
              </label>
              <input
                type="text"
                name="customer"
                value={formData.customer}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: `1px solid ${formErrors.customer ? 'var(--error)' : '#e2e8f0'}`,
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontFamily: 'var(--font-primary)'
                }}
                placeholder="Customer name"
              />
              {formErrors.customer && (
                <span style={{ color: 'var(--error)', fontSize: '12px' }}>{formErrors.customer}</span>
              )}
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '4px', 
                fontWeight: 500,
                color: 'var(--text-primary)'
              }}>
                Technician *
              </label>
              <input
                type="text"
                name="technician"
                value={formData.technician}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: `1px solid ${formErrors.technician ? 'var(--error)' : '#e2e8f0'}`,
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontFamily: 'var(--font-primary)'
                }}
                placeholder="Assigned technician"
              />
              {formErrors.technician && (
                <span style={{ color: 'var(--error)', fontSize: '12px' }}>{formErrors.technician}</span>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '4px', 
                fontWeight: 500,
                color: 'var(--text-primary)'
              }}>
                Scheduled Date
              </label>
              <input
                type="date"
                name="scheduledDate"
                value={formData.scheduledDate}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontFamily: 'var(--font-primary)'
                }}
              />
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '4px', 
                fontWeight: 500,
                color: 'var(--text-primary)'
              }}>
                Duration (minutes)
              </label>
              <input
                type="number"
                name="estimatedDuration"
                value={formData.estimatedDuration}
                onChange={handleInputChange}
                min="30"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: `1px solid ${formErrors.estimatedDuration ? 'var(--error)' : '#e2e8f0'}`,
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontFamily: 'var(--font-primary)'
                }}
              />
              {formErrors.estimatedDuration && (
                <span style={{ color: 'var(--error)', fontSize: '12px' }}>{formErrors.estimatedDuration}</span>
              )}
            </div>
          </div>

          <div style={{ 
            display: 'flex', 
            gap: '12px', 
            justifyContent: 'flex-end',
            borderTop: '1px solid #e2e8f0',
            paddingTop: '16px'
          }}>
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              style={{
                padding: '8px 16px',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                background: 'white',
                color: 'var(--text-primary)',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '8px 16px',
                border: 'none',
                borderRadius: '6px',
                background: 'var(--primary)',
                color: 'white',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {loading && (
                <span style={{ 
                  display: 'inline-block',
                  width: '16px',
                  height: '16px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
              )}
              {workOrder ? 'Update' : 'Create'} Work Order
            </button>
          </div>
        </form>
      </div>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default WorkOrderModal;