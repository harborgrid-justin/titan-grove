/**
 * API Validation Utilities
 * Standardized validation patterns following Facebook/Google best practices
 */

export interface ValidationRule {
  field: string;
  type: 'required' | 'string' | 'number' | 'email' | 'min' | 'max';
  value?: any;
  message?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors?: string[];
  data?: any;
}

export function validateWithRules(data: any, rules: ValidationRule[]): ValidationResult {
  const errors: string[] = [];
  
  for (const rule of rules) {
    const fieldValue = data?.[rule.field];
    
    switch (rule.type) {
      case 'required':
        if (fieldValue === undefined || fieldValue === null || fieldValue === '') {
          errors.push(rule.message || `${rule.field} is required`);
        }
        break;
        
      case 'string':
        if (fieldValue && typeof fieldValue !== 'string') {
          errors.push(rule.message || `${rule.field} must be a string`);
        }
        break;
        
      case 'number':
        if (fieldValue && (typeof fieldValue !== 'number' || isNaN(fieldValue))) {
          errors.push(rule.message || `${rule.field} must be a number`);
        }
        break;
        
      case 'email':
        if (fieldValue && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fieldValue)) {
          errors.push(rule.message || `${rule.field} must be a valid email`);
        }
        break;
        
      case 'min':
        if (fieldValue && typeof fieldValue === 'number' && fieldValue < (rule.value || 0)) {
          errors.push(rule.message || `${rule.field} must be at least ${rule.value}`);
        }
        break;
        
      case 'max':
        if (fieldValue && typeof fieldValue === 'number' && fieldValue > (rule.value || Infinity)) {
          errors.push(rule.message || `${rule.field} must be at most ${rule.value}`);
        }
        break;
    }
  }
  
  return errors.length > 0 
    ? { valid: false, errors } 
    : { valid: true, data };
}