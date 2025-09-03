import React, { useState, useEffect } from 'react';

interface CrudModalProps<T> {
  isOpen: boolean;
  title: string;
  item?: T | null;
  onClose: () => void;
  onSave: (item: Omit<T, 'id'> | T) => Promise<void>;
  loading?: boolean;
  children: (props: {
    formData: any;
    setFormData: (data: any) => void;
    formErrors: { [key: string]: string };
    setFormErrors: (errors: { [key: string]: string }) => void;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  }) => React.ReactNode;
  validation?: (formData: any) => { [key: string]: string };
  initialData?: any;
}

function CrudModal<T extends { id?: string }>({
  isOpen,
  title,
  item,
  onClose,
  onSave,
  loading = false,
  children,
  validation,
  initialData = {}
}: CrudModalProps<T>) {
  const [formData, setFormData] = useState(initialData);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Initialize form data when item changes
  useEffect(() => {
    if (item) {
      setFormData(item);
    } else {
      setFormData(initialData);
    }
    setFormErrors({});
  }, [item, initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    if (!validation) return true;
    
    const errors = validation(formData);
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      if (item?.id) {
        await onSave({ ...formData, id: item.id } as T);
      } else {
        await onSave(formData);
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving item:', error);
    }
  };

  const handleClose = () => {
    setFormData(initialData);
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
            {item ? `Edit ${title}` : `Create New ${title}`}
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
          {children({
            formData,
            setFormData,
            formErrors,
            setFormErrors,
            handleInputChange
          })}

          <div style={{ 
            display: 'flex', 
            gap: '12px', 
            justifyContent: 'flex-end',
            borderTop: '1px solid #e2e8f0',
            paddingTop: '16px',
            marginTop: '24px'
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
              {item ? 'Update' : 'Create'} {title}
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
}

export default CrudModal;