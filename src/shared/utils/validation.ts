/**
 * Enterprise Input Validation and Sanitization
 * Comprehensive validation utilities to replace ad-hoc validation
 */

import { ValidationResult, ValidationError, ValidationWarning } from '../types/enterprise-types';
import { SYSTEM_CONSTANTS, FINANCIAL_CONSTANTS, COMPLIANCE_CONSTANTS } from '../constants/business-constants';

// ============================================================================
// VALIDATION SCHEMAS AND RULES
// ============================================================================

export interface ValidationRule {
  field: string;
  type: 'string' | 'number' | 'email' | 'phone' | 'date' | 'uuid' | 'boolean' | 'url' | 'currency';
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  customValidator?: (value: any) => ValidationError | null;
  sanitize?: boolean;
}

export interface ValidationSchema {
  name: string;
  rules: ValidationRule[];
  crossFieldValidation?: (data: any) => ValidationError[];
}

// ============================================================================
// INPUT SANITIZATION UTILITIES
// ============================================================================

export class InputSanitizer {
  /**
   * Sanitize HTML input to prevent XSS attacks
   */
  static sanitizeHtml(input: string): string {
    if (!input) return '';
    
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  /**
   * Sanitize SQL input to prevent injection
   */
  static sanitizeSql(input: string): string {
    if (!input) return '';
    
    return input
      .replace(/(['";\\])/g, '\\$1')
      .replace(/--/g, '')
      .replace(/\/\*/g, '')
      .replace(/\*\//g, '');
  }

  /**
   * Sanitize file paths to prevent directory traversal
   */
  static sanitizeFilePath(input: string): string {
    if (!input) return '';
    
    return input
      .replace(/\.\./g, '')
      .replace(/[<>:"|?*]/g, '')
      .replace(/[\x00-\x1f\x80-\x9f]/g, '')
      .trim();
  }

  /**
   * Sanitize user input for general use
   */
  static sanitizeGeneral(input: string): string {
    if (!input) return '';
    
    return input
      .trim()
      .replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '') // Remove control chars
      .replace(/\s+/g, ' ') // Normalize whitespace
      .substring(0, 10000); // Reasonable length limit
  }

  /**
   * Sanitize phone numbers
   */
  static sanitizePhone(input: string): string {
    if (!input) return '';
    
    return input.replace(/[^\d\+\-\(\)\s]/g, '');
  }

  /**
   * Sanitize email addresses
   */
  static sanitizeEmail(input: string): string {
    if (!input) return '';
    
    return input
      .toLowerCase()
      .trim()
      .replace(/[^\w@\.\-\+]/g, '');
  }

  /**
   * Sanitize currency amounts
   */
  static sanitizeCurrency(input: string): string {
    if (!input) return '';
    
    return input.replace(/[^\d\.\-]/g, '');
  }
}

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

export class Validator {
  /**
   * Validate email address format
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email);
  }

  /**
   * Validate phone number format
   */
  static isValidPhone(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  }

  /**
   * Validate UUID format
   */
  static isValidUuid(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  /**
   * Validate URL format
   */
  static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Validate date string (ISO format)
   */
  static isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  }

  /**
   * Validate currency amount
   */
  static isValidCurrency(amount: number): boolean {
    return typeof amount === 'number' &&
           !isNaN(amount) &&
           isFinite(amount) &&
           amount >= FINANCIAL_CONSTANTS.MIN_TRANSACTION_AMOUNT &&
           amount <= FINANCIAL_CONSTANTS.MAX_TRANSACTION_AMOUNT;
  }

  /**
   * Validate password strength
   */
  static validatePassword(password: string): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    if (password.length < SYSTEM_CONSTANTS.PASSWORD_MIN_LENGTH) {
      errors.push({
        field: 'password',
        code: 'PASSWORD_TOO_SHORT',
        message: `Password must be at least ${SYSTEM_CONSTANTS.PASSWORD_MIN_LENGTH} characters long`,
        value: password.length
      });
    }

    if (password.length > SYSTEM_CONSTANTS.PASSWORD_MAX_LENGTH) {
      errors.push({
        field: 'password',
        code: 'PASSWORD_TOO_LONG',
        message: `Password must not exceed ${SYSTEM_CONSTANTS.PASSWORD_MAX_LENGTH} characters`,
        value: password.length
      });
    }

    // Check complexity requirements
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    if (!hasLowerCase) {
      errors.push({
        field: 'password',
        code: 'PASSWORD_NO_LOWERCASE',
        message: 'Password must contain at least one lowercase letter'
      });
    }

    if (!hasUpperCase) {
      errors.push({
        field: 'password',
        code: 'PASSWORD_NO_UPPERCASE',
        message: 'Password must contain at least one uppercase letter'
      });
    }

    if (!hasNumbers) {
      warnings.push({
        field: 'password',
        code: 'PASSWORD_NO_NUMBERS',
        message: 'Password should contain at least one number'
      });
    }

    if (!hasSpecialChars) {
      warnings.push({
        field: 'password',
        code: 'PASSWORD_NO_SPECIAL',
        message: 'Password should contain at least one special character'
      });
    }

    // Check for common patterns
    if (/(\d{3,}|[a-zA-Z]{4,})/.test(password)) {
      warnings.push({
        field: 'password',
        code: 'PASSWORD_SEQUENTIAL',
        message: 'Avoid using sequential characters in passwords'
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validate credit card number using Luhn algorithm
   */
  static isValidCreditCard(cardNumber: string): boolean {
    const cleanNumber = cardNumber.replace(/\D/g, '');
    
    if (cleanNumber.length < 13 || cleanNumber.length > 19) {
      return false;
    }

    let sum = 0;
    let alternate = false;

    for (let i = cleanNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cleanNumber.charAt(i), 10);

      if (alternate) {
        digit *= 2;
        if (digit > 9) {
          digit = (digit % 10) + 1;
        }
      }

      sum += digit;
      alternate = !alternate;
    }

    return sum % 10 === 0;
  }

  /**
   * Validate social security number format
   */
  static isValidSSN(ssn: string): boolean {
    const ssnRegex = /^\d{3}-\d{2}-\d{4}$/;
    return ssnRegex.test(ssn) && ssn !== '000-00-0000';
  }

  /**
   * Validate business tax ID (EIN) format
   */
  static isValidEIN(ein: string): boolean {
    const einRegex = /^\d{2}-\d{7}$/;
    return einRegex.test(ein);
  }
}

// ============================================================================
// COMPREHENSIVE INPUT VALIDATOR
// ============================================================================

export class EnterpriseValidator {
  private schemas: Map<string, ValidationSchema> = new Map();

  /**
   * Register a validation schema
   */
  registerSchema(schema: ValidationSchema): void {
    this.schemas.set(schema.name, schema);
  }

  /**
   * Validate data against a registered schema
   */
  validate(schemaName: string, data: any, sanitize: boolean = true): ValidationResult {
    const schema = this.schemas.get(schemaName);
    if (!schema) {
      throw new Error(`Validation schema '${schemaName}' not found`);
    }

    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    const sanitizedData = sanitize ? { ...data } : data;

    // Validate individual fields
    for (const rule of schema.rules) {
      const fieldValue = data[rule.field];
      const fieldResult = this.validateField(rule, fieldValue, sanitizedData);
      
      errors.push(...fieldResult.errors);
      warnings.push(...fieldResult.warnings);
    }

    // Cross-field validation
    if (schema.crossFieldValidation) {
      const crossFieldErrors = schema.crossFieldValidation(sanitizedData);
      errors.push(...crossFieldErrors);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validate a single field against a rule
   */
  private validateField(rule: ValidationRule, value: any, data: any): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Required field validation
    if (rule.required && (value === undefined || value === null || value === '')) {
      errors.push({
        field: rule.field,
        code: 'REQUIRED_FIELD',
        message: `${rule.field} is required`,
        value
      });
      return { isValid: false, errors, warnings };
    }

    // Skip further validation if field is empty and not required
    if (!rule.required && (value === undefined || value === null || value === '')) {
      return { isValid: true, errors: [], warnings: [] };
    }

    // Sanitize value if requested
    if (rule.sanitize && typeof value === 'string') {
      data[rule.field] = this.sanitizeValue(rule.type, value);
      value = data[rule.field];
    }

    // Type-specific validation
    switch (rule.type) {
      case 'string':
        this.validateString(rule, value, errors, warnings);
        break;
      case 'number':
        this.validateNumber(rule, value, errors, warnings);
        break;
      case 'email':
        this.validateEmail(rule, value, errors, warnings);
        break;
      case 'phone':
        this.validatePhone(rule, value, errors, warnings);
        break;
      case 'date':
        this.validateDate(rule, value, errors, warnings);
        break;
      case 'uuid':
        this.validateUuid(rule, value, errors, warnings);
        break;
      case 'url':
        this.validateUrl(rule, value, errors, warnings);
        break;
      case 'currency':
        this.validateCurrency(rule, value, errors, warnings);
        break;
      case 'boolean':
        this.validateBoolean(rule, value, errors, warnings);
        break;
    }

    // Custom validation
    if (rule.customValidator) {
      const customError = rule.customValidator(value);
      if (customError) {
        errors.push(customError);
      }
    }

    // Pattern validation
    if (rule.pattern && typeof value === 'string') {
      if (!rule.pattern.test(value)) {
        errors.push({
          field: rule.field,
          code: 'PATTERN_MISMATCH',
          message: `${rule.field} does not match required pattern`,
          value
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  private sanitizeValue(type: ValidationRule['type'], value: string): string {
    switch (type) {
      case 'email':
        return InputSanitizer.sanitizeEmail(value);
      case 'phone':
        return InputSanitizer.sanitizePhone(value);
      case 'currency':
        return InputSanitizer.sanitizeCurrency(value);
      default:
        return InputSanitizer.sanitizeGeneral(value);
    }
  }

  private validateString(rule: ValidationRule, value: any, errors: ValidationError[], warnings: ValidationWarning[]): void {
    if (typeof value !== 'string') {
      errors.push({
        field: rule.field,
        code: 'INVALID_TYPE',
        message: `${rule.field} must be a string`,
        value
      });
      return;
    }

    if (rule.minLength && value.length < rule.minLength) {
      errors.push({
        field: rule.field,
        code: 'MIN_LENGTH',
        message: `${rule.field} must be at least ${rule.minLength} characters long`,
        value: value.length
      });
    }

    if (rule.maxLength && value.length > rule.maxLength) {
      errors.push({
        field: rule.field,
        code: 'MAX_LENGTH',
        message: `${rule.field} must not exceed ${rule.maxLength} characters`,
        value: value.length
      });
    }
  }

  private validateNumber(rule: ValidationRule, value: any, errors: ValidationError[], warnings: ValidationWarning[]): void {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;

    if (typeof numValue !== 'number' || isNaN(numValue)) {
      errors.push({
        field: rule.field,
        code: 'INVALID_NUMBER',
        message: `${rule.field} must be a valid number`,
        value
      });
      return;
    }

    if (rule.min !== undefined && numValue < rule.min) {
      errors.push({
        field: rule.field,
        code: 'MIN_VALUE',
        message: `${rule.field} must be at least ${rule.min}`,
        value: numValue
      });
    }

    if (rule.max !== undefined && numValue > rule.max) {
      errors.push({
        field: rule.field,
        code: 'MAX_VALUE',
        message: `${rule.field} must not exceed ${rule.max}`,
        value: numValue
      });
    }
  }

  private validateEmail(rule: ValidationRule, value: any, errors: ValidationError[], warnings: ValidationWarning[]): void {
    if (typeof value !== 'string' || !Validator.isValidEmail(value)) {
      errors.push({
        field: rule.field,
        code: 'INVALID_EMAIL',
        message: `${rule.field} must be a valid email address`,
        value
      });
    }
  }

  private validatePhone(rule: ValidationRule, value: any, errors: ValidationError[], warnings: ValidationWarning[]): void {
    if (typeof value !== 'string' || !Validator.isValidPhone(value)) {
      errors.push({
        field: rule.field,
        code: 'INVALID_PHONE',
        message: `${rule.field} must be a valid phone number`,
        value
      });
    }
  }

  private validateDate(rule: ValidationRule, value: any, errors: ValidationError[], warnings: ValidationWarning[]): void {
    if (typeof value !== 'string' || !Validator.isValidDate(value)) {
      errors.push({
        field: rule.field,
        code: 'INVALID_DATE',
        message: `${rule.field} must be a valid date`,
        value
      });
    }
  }

  private validateUuid(rule: ValidationRule, value: any, errors: ValidationError[], warnings: ValidationWarning[]): void {
    if (typeof value !== 'string' || !Validator.isValidUuid(value)) {
      errors.push({
        field: rule.field,
        code: 'INVALID_UUID',
        message: `${rule.field} must be a valid UUID`,
        value
      });
    }
  }

  private validateUrl(rule: ValidationRule, value: any, errors: ValidationError[], warnings: ValidationWarning[]): void {
    if (typeof value !== 'string' || !Validator.isValidUrl(value)) {
      errors.push({
        field: rule.field,
        code: 'INVALID_URL',
        message: `${rule.field} must be a valid URL`,
        value
      });
    }
  }

  private validateCurrency(rule: ValidationRule, value: any, errors: ValidationError[], warnings: ValidationWarning[]): void {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;

    if (!Validator.isValidCurrency(numValue)) {
      errors.push({
        field: rule.field,
        code: 'INVALID_CURRENCY',
        message: `${rule.field} must be a valid currency amount`,
        value
      });
    }
  }

  private validateBoolean(rule: ValidationRule, value: any, errors: ValidationError[], warnings: ValidationWarning[]): void {
    if (typeof value !== 'boolean') {
      errors.push({
        field: rule.field,
        code: 'INVALID_BOOLEAN',
        message: `${rule.field} must be true or false`,
        value
      });
    }
  }
}

// ============================================================================
// PREDEFINED VALIDATION SCHEMAS
// ============================================================================

export const COMMON_SCHEMAS: ValidationSchema[] = [
  // Customer validation schema
  {
    name: 'customer',
    rules: [
      { field: 'customerNumber', type: 'string', required: true, maxLength: 20, sanitize: true },
      { field: 'companyName', type: 'string', required: true, maxLength: 200, sanitize: true },
      { field: 'email', type: 'email', required: true, sanitize: true },
      { field: 'phone', type: 'phone', required: false, sanitize: true },
      { field: 'creditLimit', type: 'currency', required: true, min: 0 },
    ],
    crossFieldValidation: (data) => {
      const errors: ValidationError[] = [];
      
      if (data.customerType === 'BUSINESS' && !data.taxId) {
        errors.push({
          field: 'taxId',
          code: 'BUSINESS_REQUIRES_TAX_ID',
          message: 'Business customers must provide a tax ID'
        });
      }
      
      return errors;
    }
  },

  // Employee validation schema
  {
    name: 'employee',
    rules: [
      { field: 'employeeNumber', type: 'string', required: true, maxLength: 20, sanitize: true },
      { field: 'firstName', type: 'string', required: true, maxLength: 50, sanitize: true },
      { field: 'lastName', type: 'string', required: true, maxLength: 50, sanitize: true },
      { field: 'email', type: 'email', required: true, sanitize: true },
      { field: 'hireDate', type: 'date', required: true },
      { field: 'baseSalary', type: 'currency', required: true, min: 0 },
    ]
  },

  // Financial transaction validation schema
  {
    name: 'financial-transaction',
    rules: [
      { field: 'amount', type: 'currency', required: true },
      { field: 'fromAccount', type: 'uuid', required: true },
      { field: 'toAccount', type: 'uuid', required: true },
      { field: 'description', type: 'string', required: true, maxLength: 500, sanitize: true },
    ],
    crossFieldValidation: (data) => {
      const errors: ValidationError[] = [];
      
      if (data.fromAccount === data.toAccount) {
        errors.push({
          field: 'toAccount',
          code: 'SAME_ACCOUNT_TRANSFER',
          message: 'Cannot transfer to the same account'
        });
      }
      
      if (data.amount > COMPLIANCE_CONSTANTS.SIGNIFICANT_TRANSACTION_AMOUNT && !data.approvedBy) {
        errors.push({
          field: 'approvedBy',
          code: 'LARGE_TRANSACTION_APPROVAL',
          message: 'Large transactions require approval'
        });
      }
      
      return errors;
    }
  },

  // User registration validation schema
  {
    name: 'user-registration',
    rules: [
      { field: 'username', type: 'string', required: true, minLength: 3, maxLength: 50, sanitize: true },
      { field: 'email', type: 'email', required: true, sanitize: true },
      { field: 'password', type: 'string', required: true, customValidator: (value) => {
        const result = Validator.validatePassword(value);
        return result.isValid ? null : {
          field: 'password',
          code: 'WEAK_PASSWORD',
          message: result.errors[0]?.message || 'Password is too weak',
          value
        };
      }},
      { field: 'firstName', type: 'string', required: true, maxLength: 50, sanitize: true },
      { field: 'lastName', type: 'string', required: true, maxLength: 50, sanitize: true },
    ]
  }
];

// ============================================================================
// SINGLETON VALIDATOR INSTANCE
// ============================================================================

export const enterpriseValidator = new EnterpriseValidator();

// Register common schemas
COMMON_SCHEMAS.forEach(schema => {
  enterpriseValidator.registerSchema(schema);
});

export default {
  EnterpriseValidator,
  Validator,
  InputSanitizer,
  enterpriseValidator,
  COMMON_SCHEMAS
};