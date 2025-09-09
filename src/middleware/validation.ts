/**
 * Validation Middleware
 * Standardized request validation for business and customer systems
 */

import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { Logger } from 'winston';
import { validationLogger } from '../core/logger';

export interface ValidationRule {
  body?: Joi.ObjectSchema;
  query?: Joi.ObjectSchema;
  params?: Joi.ObjectSchema;
  headers?: Joi.ObjectSchema;
}

export interface ValidationConfig {
  enableBusinessValidation: boolean;
  enableCustomerValidation: boolean;
  enableDetailedErrors: boolean;
  maxRequestSize: string;
}

export class ValidationService {
  private config: ValidationConfig;
  private logger: Logger;

  constructor(config: ValidationConfig, logger: Logger) {
    this.config = config;
    this.logger = logger;
  }

  /**
   * Validate request data against Joi schemas
   */
  validateRequest(rules: ValidationRule) {
    return (req: Request, res: Response, next: NextFunction) => {
      const errors: { [key: string]: string[] } = {};

      // Validate body
      if (rules.body && req.body) {
        const { error } = rules.body.validate(req.body);
        if (error) {
          errors.body = error.details.map(detail => detail.message);
        }
      }

      // Validate query parameters
      if (rules.query && req.query) {
        const { error } = rules.query.validate(req.query);
        if (error) {
          errors.query = error.details.map(detail => detail.message);
        }
      }

      // Validate URL parameters
      if (rules.params && req.params) {
        const { error } = rules.params.validate(req.params);
        if (error) {
          errors.params = error.details.map(detail => detail.message);
        }
      }

      // Validate headers
      if (rules.headers && req.headers) {
        const { error } = rules.headers.validate(req.headers);
        if (error) {
          errors.headers = error.details.map(detail => detail.message);
        }
      }

      // Return validation errors if any
      if (Object.keys(errors).length > 0) {
        this.logger.warn('Request validation failed', {
          path: req.path,
          method: req.method,
          errors: this.config.enableDetailedErrors ? errors : 'Validation failed'
        });

        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Request validation failed',
            details: this.config.enableDetailedErrors ? errors : undefined
          }
        });
      }

      next();
    };
  }

  /**
   * Sanitize request data
   */
  sanitizeRequest() {
    return (req: Request, res: Response, next: NextFunction) => {
      // Sanitize common injection patterns
      if (req.body) {
        req.body = this.sanitizeObject(req.body);
      }
      
      if (req.query) {
        req.query = this.sanitizeObject(req.query);
      }
      
      if (req.params) {
        req.params = this.sanitizeObject(req.params);
      }

      next();
    };
  }

  private sanitizeObject(obj: any): any {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    const sanitized: any = Array.isArray(obj) ? [] : {};

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        
        if (typeof value === 'string') {
          // Remove potential SQL injection patterns
          sanitized[key] = value
            .replace(/['";\\]/g, '')
            .replace(/--/g, '')
            .replace(/\/\*/g, '')
            .replace(/\*\//g, '');
        } else if (typeof value === 'object' && value !== null) {
          sanitized[key] = this.sanitizeObject(value);
        } else {
          sanitized[key] = value;
        }
      }
    }

    return sanitized;
  }
}

// Default validation configuration
const defaultValidationConfig: ValidationConfig = {
  enableBusinessValidation: true,
  enableCustomerValidation: true,
  enableDetailedErrors: process.env.NODE_ENV !== 'production',
  maxRequestSize: '10mb'
};

// Create validation service instance
const validationService = new ValidationService(
  defaultValidationConfig,
  validationLogger
);

/**
 * Common validation schemas
 */
export const commonSchemas = {
  // ID validation
  id: Joi.string().uuid().required(),
  optionalId: Joi.string().uuid().optional(),
  
  // String validations
  email: Joi.string().email().required(),
  optionalEmail: Joi.string().email().optional(),
  
  // Number validations
  positiveNumber: Joi.number().positive().required(),
  optionalPositiveNumber: Joi.number().positive().optional(),
  
  // Date validations
  date: Joi.date().required(),
  optionalDate: Joi.date().optional(),
  
  // Business-specific validations
  businessEntity: Joi.object({
    id: Joi.string().uuid().optional(),
    name: Joi.string().min(1).max(255).required(),
    description: Joi.string().max(1000).optional(),
    createdAt: Joi.date().optional(),
    updatedAt: Joi.date().optional()
  }),
  
  // Customer-specific validations
  customerData: Joi.object({
    id: Joi.string().uuid().optional(),
    email: Joi.string().email().required(),
    firstName: Joi.string().min(1).max(100).required(),
    lastName: Joi.string().min(1).max(100).required(),
    phone: Joi.string().pattern(/^\+?[\d\s-()]+$/).optional()
  }),
  
  // Financial validations
  financialTransaction: Joi.object({
    amount: Joi.number().positive().precision(2).required(),
    currency: Joi.string().length(3).uppercase().required(),
    description: Joi.string().max(500).optional(),
    category: Joi.string().valid('income', 'expense', 'transfer').required()
  }),
  
  // Manufacturing validations
  manufacturingOrder: Joi.object({
    productId: Joi.string().uuid().required(),
    quantity: Joi.number().integer().positive().required(),
    dueDate: Joi.date().min('now').required(),
    priority: Joi.string().valid('low', 'medium', 'high', 'urgent').default('medium')
  }),
  
  // Pagination
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    sortBy: Joi.string().optional(),
    sortOrder: Joi.string().valid('asc', 'desc').default('asc')
  })
};

/**
 * Business system validation schemas
 */
export const businessValidation = {
  // Financial management
  createJournalEntry: {
    body: Joi.object({
      description: Joi.string().max(500).required(),
      reference: Joi.string().max(100).optional(),
      entries: Joi.array().items(
        Joi.object({
          accountId: Joi.string().uuid().required(),
          debit: Joi.number().precision(2).min(0).optional(),
          credit: Joi.number().precision(2).min(0).optional(),
          description: Joi.string().max(255).optional()
        })
      ).min(2).required()
    })
  },
  
  // HR management
  createEmployee: {
    body: Joi.object({
      employeeId: Joi.string().max(50).required(),
      firstName: Joi.string().max(100).required(),
      lastName: Joi.string().max(100).required(),
      email: Joi.string().email().required(),
      department: Joi.string().max(100).required(),
      position: Joi.string().max(100).required(),
      salary: Joi.number().positive().optional(),
      startDate: Joi.date().required()
    })
  },
  
  // Manufacturing
  createWorkOrder: {
    body: commonSchemas.manufacturingOrder
  },
  
  // Common business operations
  updateStatus: {
    body: Joi.object({
      status: Joi.string().required(),
      reason: Joi.string().max(500).optional(),
      updatedBy: Joi.string().uuid().required()
    }),
    params: Joi.object({
      id: commonSchemas.id
    })
  }
};

/**
 * Customer system validation schemas
 */
export const customerValidation = {
  // Customer registration
  register: {
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
      firstName: Joi.string().max(100).required(),
      lastName: Joi.string().max(100).required(),
      phone: Joi.string().pattern(/^\+?[\d\s-()]+$/).optional(),
      acceptTerms: Joi.boolean().valid(true).required()
    })
  },
  
  // Customer login
  login: {
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required()
    })
  },
  
  // Order creation
  createOrder: {
    body: Joi.object({
      items: Joi.array().items(
        Joi.object({
          productId: Joi.string().uuid().required(),
          quantity: Joi.number().integer().positive().required(),
          price: Joi.number().positive().precision(2).required()
        })
      ).min(1).required(),
      shippingAddress: Joi.object({
        street: Joi.string().max(255).required(),
        city: Joi.string().max(100).required(),
        state: Joi.string().max(100).required(),
        zipCode: Joi.string().max(20).required(),
        country: Joi.string().max(100).required()
      }).required(),
      paymentMethod: Joi.string().valid('credit_card', 'debit_card', 'paypal', 'bank_transfer').required()
    })
  },
  
  // Support case
  createSupportCase: {
    body: Joi.object({
      subject: Joi.string().max(255).required(),
      description: Joi.string().max(2000).required(),
      category: Joi.string().valid('technical', 'billing', 'general', 'complaint').required(),
      priority: Joi.string().valid('low', 'medium', 'high').default('medium')
    })
  },
  
  // Profile update
  updateProfile: {
    body: Joi.object({
      firstName: Joi.string().max(100).optional(),
      lastName: Joi.string().max(100).optional(),
      phone: Joi.string().pattern(/^\+?[\d\s-()]+$/).optional(),
      preferences: Joi.object({
        newsletter: Joi.boolean().optional(),
        notifications: Joi.boolean().optional(),
        language: Joi.string().max(10).optional()
      }).optional()
    })
  }
};

/**
 * Validation middleware factory
 */
export function validateRequest(rules: ValidationRule) {
  return validationService.validateRequest(rules);
}

/**
 * Sanitization middleware
 */
export const sanitizeRequest = validationService.sanitizeRequest();

/**
 * Business validation middleware factory
 */
export function validateBusiness(schemaName: keyof typeof businessValidation) {
  return validateRequest(businessValidation[schemaName]);
}

/**
 * Customer validation middleware factory
 */
export function validateCustomer(schemaName: keyof typeof customerValidation) {
  return validateRequest(customerValidation[schemaName]);
}

/**
 * Query parameter validation
 */
export const validatePagination = validateRequest({
  query: commonSchemas.pagination
});

/**
 * ID parameter validation
 */
export const validateIdParam = validateRequest({
  params: Joi.object({
    id: commonSchemas.id
  })
});

export { ValidationService, validationService };