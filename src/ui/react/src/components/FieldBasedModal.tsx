import React, { useState, useEffect } from 'react';

interface Field {
  name: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'date' | 'select' | 'textarea';
  required?: boolean;
  options?: string[];
}

interface FieldBasedModalProps {
  isOpen: boolean;
  title: string;
  data?: any | null;
  fields: Field[];
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  loading?: boolean;
}

const FieldBasedModal: React.FC<FieldBasedModalProps> = ({
  isOpen,
  title,
  data,
  fields,
  onClose,
  onSave,
  loading = false
}) => {
  const [formData, setFormData] = useState<any>({});
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  // Initialize form data when data changes
  useEffect(() => {
    if (data) {
      setFormData(data);
    } else {
      // Initialize with empty values
      const initialData: any = {};
      fields.forEach(field => {
        initialData[field.name] = '';
      });
      setFormData(initialData);
    }
    setFormErrors({});
  }, [data, fields]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    fields.forEach(field => {
      if (field.required && !formData[field.name]?.toString().trim()) {
        errors[field.name] = `${field.label} is required`;
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Failed to save:', error);
      setFormErrors({ submit: 'Failed to save. Please try again.' });
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '24px',
        width: '90%',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          borderBottom: '1px solid #e2e8f0',
          paddingBottom: '16px'
        }}>
          <h2 style={{ margin: 0, color: 'var(--text-primary)' }}>{title}</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              padding: '4px'
            }}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: fields.length > 4 ? '1fr 1fr' : '1fr',
            gap: '16px',
            marginBottom: '24px'
          }}>
            {fields.map((field) => (
              <div key={field.name}>
                <label style={{
                  display: 'block',
                  marginBottom: '4px',
                  fontWeight: 500,
                  color: 'var(--text-primary)',
                  fontSize: '14px'
                }}>
                  {field.label} {field.required && <span style={{ color: 'var(--error)' }}>*</span>}
                </label>
                {field.type === 'select' ? (
                  <select
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: `1px solid ${formErrors[field.name] ? 'var(--error)' : '#e2e8f0'}`,
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontFamily: 'var(--font-primary)'
                    }}
                  >
                    <option value="">Select {field.label}</option>
                    {field.options?.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                ) : field.type === 'textarea' ? (
                  <textarea
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleInputChange}
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: `1px solid ${formErrors[field.name] ? 'var(--error)' : '#e2e8f0'}`,
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontFamily: 'var(--font-primary)',
                      resize: 'vertical'
                    }}
                  />
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: `1px solid ${formErrors[field.name] ? 'var(--error)' : '#e2e8f0'}`,
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontFamily: 'var(--font-primary)'
                    }}
                  />
                )}
                {formErrors[field.name] && (
                  <div style={{
                    color: 'var(--error)',
                    fontSize: '12px',
                    marginTop: '4px'
                  }}>
                    {formErrors[field.name]}
                  </div>
                )}
              </div>
            ))}
          </div>

          {formErrors.submit && (
            <div style={{
              color: 'var(--error)',
              fontSize: '14px',
              marginBottom: '16px',
              textAlign: 'center'
            }}>
              {formErrors.submit}
            </div>
          )}

          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px'
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 20px',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                background: 'white',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: '6px',
                background: loading ? 'var(--text-disabled)' : 'var(--primary)',
                color: 'white',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '14px'
              }}
            >
              {loading ? 'Saving...' : (data ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FieldBasedModal;