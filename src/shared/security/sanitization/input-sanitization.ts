/**
 * Input Sanitization System - Enterprise Grade
 * Implements Fix 29: Input sanitization against XSS/SQL injection
 */

import { Request, Response, NextFunction } from 'express';
import DOMPurify from 'isomorphic-dompurify';
import validator from 'validator';
import { getLogger } from '../../../utils/enterprise-logger';
import { getAuditService } from '../audit-trail';

interface SanitizationRule {
  field: string;
  type: 'html' | 'sql' | 'email' | 'url' | 'alphanumeric' | 'numeric' | 'json' | 'custom';
  maxLength?: number;
  allowEmpty?: boolean;
  customValidator?: (value: any) => boolean;
  customSanitizer?: (value: any) => any;
  required?: boolean;
  pattern?: RegExp;
}

interface SanitizationResult {
  isValid: boolean;
  sanitizedValue: any;
  errors: string[];
  warnings: string[];
  originalValue: any;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

interface ValidationSchema {
  [key: string]: SanitizationRule;
}

export class InputSanitizationService {
  private logger = getLogger('InputSanitizationService');
  private suspiciousPatterns: RegExp[];
  private sqlInjectionPatterns: RegExp[];
  private xssPatterns: RegExp[];
  private traversalPatterns: RegExp[];

  constructor() {
    this.initializeSecurityPatterns();
    
    this.logger.logBusinessOperation(
      'INPUT_SANITIZATION_SERVICE_INITIALIZED',
      'InputSanitizationService',
      '',
      'SUCCESS',
      {
        securityPatterns: {
          sqlInjection: this.sqlInjectionPatterns.length,
          xss: this.xssPatterns.length,
          pathTraversal: this.traversalPatterns.length,
          suspicious: this.suspiciousPatterns.length
        }
      }
    );
  }

  private initializeSecurityPatterns(): void {
    // SQL Injection patterns
    this.sqlInjectionPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/gi,
      /('|(\\')|(;)|(--)|(\|\|))/gi,
      /(\bUNION\b.*\bSELECT\b)/gi,
      /(\bOR\b.*=.*\bOR\b)/gi,
      /(\b1\s*=\s*1\b)|(\b1\s*=\s*'1'\b)/gi,
      /(\bCAST\()|(\bCONVERT\()|(\bSUBSTRING\()/gi,
      /(\bWAITFOR\b)|(\bDELAY\b)/gi,
      /(\bxp_cmdshell\b)|(\bsp_executesql\b)/gi
    ];

    // XSS patterns
    this.xssPatterns = [
      /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
      /<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi,
      /<object[\s\S]*?>[\s\S]*?<\/object>/gi,
      /<embed[\s\S]*?>/gi,
      /<link[\s\S]*?>/gi,
      /<meta[\s\S]*?>/gi,
      /javascript:/gi,
      /vbscript:/gi,
      /data:text\/html/gi,
      /on\w+\s*=/gi, // Event handlers like onclick, onload, etc.
      /<svg[\s\S]*?>[\s\S]*?<\/svg>/gi,
      /expression\s*\(/gi,
      /url\s*\(\s*javascript:/gi
    ];

    // Path traversal patterns
    this.traversalPatterns = [
      /\.\.\/|\.\.\\|%2e%2e%2f|%2e%2e%5c/gi,
      /\/etc\/passwd|\/etc\/shadow|\/proc\/version/gi,
      /\.\.%2f|\.\.%5c|%252e%252e%252f/gi,
      /windows\/system32|winnt\/system32/gi
    ];

    // General suspicious patterns
    this.suspiciousPatterns = [
      /eval\s*\(/gi,
      /setTimeout\s*\(/gi,
      /setInterval\s*\(/gi,
      /Function\s*\(/gi,
      /ActiveXObject/gi,
      /XMLHttpRequest/gi,
      /<\?php|<%|<script|<\/script>/gi,
      /base64_decode|exec|system|shell_exec/gi,
      /document\.cookie|document\.write/gi,
      /window\.location|location\.href/gi
    ];
  }

  public sanitizeInput(value: any, rule: SanitizationRule): SanitizationResult {
    const originalValue = value;
    const result: SanitizationResult = {
      isValid: true,
      sanitizedValue: value,
      errors: [],
      warnings: [],
      originalValue,
      riskLevel: 'LOW'
    };

    try {
      // Handle null/undefined values
      if (value == null) {
        if (rule.required) {
          result.errors.push(`${rule.field} is required`);
          result.isValid = false;
        }
        result.sanitizedValue = rule.allowEmpty ? '' : null;
        return result;
      }

      // Convert to string for processing
      const stringValue = String(value);

      // Check length limits
      if (rule.maxLength && stringValue.length > rule.maxLength) {
        result.errors.push(`${rule.field} exceeds maximum length of ${rule.maxLength}`);
        result.isValid = false;
        return result;
      }

      // Detect security threats
      const threatLevel = this.detectThreats(stringValue);
      result.riskLevel = threatLevel;

      // Apply sanitization based on type
      switch (rule.type) {
        case 'html':
          result.sanitizedValue = this.sanitizeHTML(stringValue);
          break;
        case 'sql':
          result.sanitizedValue = this.sanitizeSQL(stringValue);
          break;
        case 'email':
          result.sanitizedValue = this.sanitizeEmail(stringValue);
          if (!validator.isEmail(result.sanitizedValue)) {
            result.errors.push(`${rule.field} is not a valid email address`);
            result.isValid = false;
          }
          break;
        case 'url':
          result.sanitizedValue = this.sanitizeURL(stringValue);
          if (!validator.isURL(result.sanitizedValue)) {
            result.errors.push(`${rule.field} is not a valid URL`);
            result.isValid = false;
          }
          break;
        case 'alphanumeric':
          result.sanitizedValue = this.sanitizeAlphanumeric(stringValue);
          break;
        case 'numeric':
          result.sanitizedValue = this.sanitizeNumeric(stringValue);
          if (isNaN(Number(result.sanitizedValue))) {
            result.errors.push(`${rule.field} is not a valid number`);
            result.isValid = false;
          }
          break;
        case 'json':
          result.sanitizedValue = this.sanitizeJSON(stringValue);
          break;
        case 'custom':
          if (rule.customSanitizer) {
            result.sanitizedValue = rule.customSanitizer(stringValue);
          }
          if (rule.customValidator && !rule.customValidator(result.sanitizedValue)) {
            result.errors.push(`${rule.field} failed custom validation`);
            result.isValid = false;
          }
          break;
        default:
          result.sanitizedValue = this.sanitizeGeneral(stringValue);
      }

      // Apply pattern validation
      if (rule.pattern && !rule.pattern.test(result.sanitizedValue)) {
        result.errors.push(`${rule.field} does not match required pattern`);
        result.isValid = false;
      }

      // Log security threats
      if (threatLevel === 'HIGH' || threatLevel === 'CRITICAL') {
        this.logSecurityThreat(rule.field, originalValue, threatLevel);
      }

      return result;

    } catch (error) {
      this.logger.logError('Input sanitization failed', error, {
        field: rule.field,
        type: rule.type,
        originalValue: typeof originalValue === 'string' ? originalValue.substring(0, 100) : originalValue
      });

      result.isValid = false;
      result.errors.push('Sanitization processing failed');
      result.riskLevel = 'CRITICAL';
      return result;
    }
  }

  public sanitizeObject(data: any, schema: ValidationSchema): { sanitized: any; isValid: boolean; errors: string[] } {
    const sanitized: any = {};
    const allErrors: string[] = [];
    let isValid = true;

    for (const [field, rule] of Object.entries(schema)) {
      const value = this.getNestedValue(data, field);
      const result = this.sanitizeInput(value, { ...rule, field });

      if (!result.isValid) {
        isValid = false;
        allErrors.push(...result.errors);
      }

      this.setNestedValue(sanitized, field, result.sanitizedValue);
    }

    return {
      sanitized,
      isValid,
      errors: allErrors
    };
  }

  // Express middleware
  public validateRequest(schema: ValidationSchema) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        // Combine body, query, and params for validation
        const requestData = {
          ...req.params,
          ...req.query,
          ...req.body
        };

        const { sanitized, isValid, errors } = this.sanitizeObject(requestData, schema);

        if (!isValid) {
          const auditService = getAuditService();
          await auditService.logSecurityEvent(
            'INPUT_VALIDATION_FAILED',
            req.originalUrl,
            'FAILURE',
            {
              userId: (req as any).user?.userId,
              ipAddress: req.ip,
              userAgent: req.get('User-Agent'),
              errors,
              suspiciousInput: this.extractSuspiciousFields(requestData, schema)
            }
          );

          return res.status(400).json({
            success: false,
            error: 'Input validation failed',
            details: errors
          });
        }

        // Replace request data with sanitized versions
        Object.assign(req.params, this.filterObjectFields(sanitized, Object.keys(req.params)));
        Object.assign(req.query, this.filterObjectFields(sanitized, Object.keys(req.query)));
        if (req.body) {
          Object.assign(req.body, this.filterObjectFields(sanitized, Object.keys(req.body)));
        }

        next();

      } catch (error) {
        this.logger.logError('Request validation middleware error', error);
        return res.status(500).json({
          success: false,
          error: 'Validation processing failed'
        });
      }
    };
  }

  public sanitizeMiddleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        // Sanitize common request fields
        if (req.body) {
          req.body = this.deepSanitizeObject(req.body);
        }
        
        if (req.query) {
          req.query = this.deepSanitizeObject(req.query);
        }

        next();
      } catch (error) {
        this.logger.logError('Sanitization middleware error', error);
        return res.status(500).json({
          success: false,
          error: 'Request processing failed'
        });
      }
    };
  }

  // Private sanitization methods
  private sanitizeHTML(value: string): string {
    // Use DOMPurify for comprehensive HTML sanitization
    return DOMPurify.sanitize(value, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
      ALLOWED_ATTR: [],
      KEEP_CONTENT: true,
      ALLOW_DATA_ATTR: false
    });
  }

  private sanitizeSQL(value: string): string {
    // Escape SQL special characters
    return value
      .replace(/'/g, "''")           // Escape single quotes
      .replace(/;/g, '\\;')          // Escape semicolons
      .replace(/--/g, '\\-\\-')      // Escape comment indicators
      .replace(/\/\*/g, '\\/\\*')    // Escape block comment start
      .replace(/\*\//g, '\\*\\/')    // Escape block comment end
      .replace(/xp_/gi, 'xp\\_')     // Escape extended stored procedures
      .replace(/sp_/gi, 'sp\\_');    // Escape system stored procedures
  }

  private sanitizeEmail(value: string): string {
    return validator.normalizeEmail(value.trim().toLowerCase()) || '';
  }

  private sanitizeURL(value: string): string {
    try {
      const url = new URL(value.trim());
      
      // Only allow http and https protocols
      if (!['http:', 'https:'].includes(url.protocol)) {
        return '';
      }
      
      return url.toString();
    } catch {
      return '';
    }
  }

  private sanitizeAlphanumeric(value: string): string {
    return value.replace(/[^a-zA-Z0-9\s]/g, '');
  }

  private sanitizeNumeric(value: string): string {
    return value.replace(/[^0-9.-]/g, '');
  }

  private sanitizeJSON(value: string): string {
    try {
      const parsed = JSON.parse(value);
      return JSON.stringify(this.deepSanitizeObject(parsed));
    } catch {
      return '';
    }
  }

  private sanitizeGeneral(value: string): string {
    return value
      .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
      .replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/vbscript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim();
  }

  private deepSanitizeObject(obj: any): any {
    if (obj === null || typeof obj !== 'object') {
      return typeof obj === 'string' ? this.sanitizeGeneral(obj) : obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.deepSanitizeObject(item));
    }

    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      const sanitizedKey = this.sanitizeGeneral(key);
      sanitized[sanitizedKey] = this.deepSanitizeObject(value);
    }

    return sanitized;
  }

  private detectThreats(value: string): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    let threatScore = 0;

    // Check for SQL injection patterns
    for (const pattern of this.sqlInjectionPatterns) {
      if (pattern.test(value)) {
        threatScore += 3;
      }
    }

    // Check for XSS patterns
    for (const pattern of this.xssPatterns) {
      if (pattern.test(value)) {
        threatScore += 3;
      }
    }

    // Check for path traversal patterns
    for (const pattern of this.traversalPatterns) {
      if (pattern.test(value)) {
        threatScore += 2;
      }
    }

    // Check for suspicious patterns
    for (const pattern of this.suspiciousPatterns) {
      if (pattern.test(value)) {
        threatScore += 1;
      }
    }

    if (threatScore >= 6) return 'CRITICAL';
    if (threatScore >= 4) return 'HIGH';
    if (threatScore >= 2) return 'MEDIUM';
    return 'LOW';
  }

  private async logSecurityThreat(field: string, value: any, riskLevel: string): Promise<void> {
    try {
      const auditService = getAuditService();
      await auditService.logSecurityEvent(
        'MALICIOUS_INPUT_DETECTED',
        field,
        'FAILURE',
        {
          field,
          riskLevel,
          threatType: 'INPUT_INJECTION',
          inputLength: typeof value === 'string' ? value.length : 0,
          inputSample: typeof value === 'string' ? value.substring(0, 200) : String(value)
        }
      );
    } catch (error) {
      this.logger.logError('Failed to log security threat', error);
    }
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  private setNestedValue(obj: any, path: string, value: any): void {
    const keys = path.split('.');
    const lastKey = keys.pop()!;
    const target = keys.reduce((current, key) => {
      if (!(key in current)) {
        current[key] = {};
      }
      return current[key];
    }, obj);
    target[lastKey] = value;
  }

  private filterObjectFields(source: any, fields: string[]): any {
    const filtered: any = {};
    for (const field of fields) {
      if (field in source) {
        filtered[field] = source[field];
      }
    }
    return filtered;
  }

  private extractSuspiciousFields(data: any, schema: ValidationSchema): any {
    const suspicious: any = {};
    
    for (const [field, rule] of Object.entries(schema)) {
      const value = this.getNestedValue(data, field);
      if (typeof value === 'string' && this.detectThreats(value) !== 'LOW') {
        suspicious[field] = value.substring(0, 100);
      }
    }
    
    return suspicious;
  }
}

// Common validation schemas
export const CommonSchemas = {
  userRegistration: {
    'username': {
      field: 'username',
      type: 'alphanumeric' as const,
      maxLength: 50,
      required: true,
      pattern: /^[a-zA-Z0-9_]{3,50}$/
    },
    'email': {
      field: 'email',
      type: 'email' as const,
      maxLength: 255,
      required: true
    },
    'password': {
      field: 'password',
      type: 'custom' as const,
      maxLength: 128,
      required: true,
      customValidator: (value: string) => value.length >= 8
    }
  },
  
  userQuery: {
    'search': {
      field: 'search',
      type: 'html' as const,
      maxLength: 500,
      allowEmpty: true
    },
    'page': {
      field: 'page',
      type: 'numeric' as const,
      required: false
    },
    'limit': {
      field: 'limit',
      type: 'numeric' as const,
      required: false,
      customValidator: (value: string) => {
        const num = Number(value);
        return num >= 1 && num <= 100;
      }
    }
  },
  
  generalText: {
    'content': {
      field: 'content',
      type: 'html' as const,
      maxLength: 10000,
      required: true
    },
    'title': {
      field: 'title',
      type: 'html' as const,
      maxLength: 255,
      required: true
    }
  }
};

// Singleton instance
let sanitizationService: InputSanitizationService | null = null;

export function initializeSanitizationService(): InputSanitizationService {
  if (sanitizationService) {
    throw new Error('Sanitization service already initialized');
  }
  
  sanitizationService = new InputSanitizationService();
  return sanitizationService;
}

export function getSanitizationService(): InputSanitizationService {
  if (!sanitizationService) {
    throw new Error('Sanitization service not initialized. Call initializeSanitizationService first.');
  }
  return sanitizationService;
}

export { SanitizationRule, SanitizationResult, ValidationSchema };