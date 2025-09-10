import { EventEmitter } from 'events';
import { performance } from 'perf_hooks';
import crypto from 'crypto';

// ============================================================================
// 🚀 PRODUCTION-GRADE FEATURES FRAMEWORK
// ============================================================================

export interface ProductionConfig {
    environment: 'development' | 'staging' | 'production';
    logLevel: 'debug' | 'info' | 'warn' | 'error';
    enableMetrics: boolean;
    enableCaching: boolean;
    enableAuditTrail: boolean;
    retryAttempts: number;
    timeoutMs: number;
    rateLimitRpm: number;
}

export interface ProductionMetrics {
    operationCount: number;
    successCount: number;
    errorCount: number;
    averageResponseTime: number;
    cacheHitRate: number;
    lastReset: Date;
}

export interface AuditEvent {
    id: string;
    timestamp: Date;
    module: string;
    operation: string;
    userId?: string;
    ipAddress?: string;
    input: any;
    output: any;
    duration: number;
    success: boolean;
    error?: string;
}

export interface ValidationRule {
    field: string;
    type: 'required' | 'string' | 'number' | 'email' | 'custom';
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    validator?: (value: any) => boolean | string;
}

export interface CacheEntry {
    key: string;
    value: any;
    expiry: Date;
    hitCount: number;
}

// Production Feature 1: Error Handling & Resilience
export class ProductionErrorHandler {
    private retryAttempts: number;
    private backoffMultiplier: number = 2;
    
    constructor(retryAttempts = 3) {
        this.retryAttempts = retryAttempts;
    }
    
    async executeWithRetry<T>(
        operation: () => Promise<T>,
        context: string
    ): Promise<T> {
        let lastError: Error;
        
        for (let attempt = 0; attempt <= this.retryAttempts; attempt++) {
            try {
                return await operation();
            } catch (error) {
                lastError = error as Error;
                
                if (attempt < this.retryAttempts) {
                    const delay = Math.pow(this.backoffMultiplier, attempt) * 100;
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }
        
        throw new Error(`Operation failed after ${this.retryAttempts + 1} attempts in ${context}: ${lastError.message}`);
    }
}

// Production Feature 2: Logging & Monitoring
export class ProductionLogger {
    private logLevel: string;
    
    constructor(logLevel = 'info') {
        this.logLevel = logLevel;
    }
    
    private shouldLog(level: string): boolean {
        const levels = ['debug', 'info', 'warn', 'error'];
        return levels.indexOf(level) >= levels.indexOf(this.logLevel);
    }
    
    private formatMessage(level: string, module: string, message: string, data?: any): string {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            level: level.toUpperCase(),
            module,
            message,
            ...(data && { data })
        };
        return JSON.stringify(logEntry);
    }
    
    debug(module: string, message: string, data?: any) {
        if (this.shouldLog('debug')) {
            console.log(this.formatMessage('debug', module, message, data));
        }
    }
    
    info(module: string, message: string, data?: any) {
        if (this.shouldLog('info')) {
            console.log(this.formatMessage('info', module, message, data));
        }
    }
    
    warn(module: string, message: string, data?: any) {
        if (this.shouldLog('warn')) {
            console.warn(this.formatMessage('warn', module, message, data));
        }
    }
    
    error(module: string, message: string, error?: Error, data?: any) {
        if (this.shouldLog('error')) {
            console.error(this.formatMessage('error', module, message, {
                error: error?.message,
                stack: error?.stack,
                ...data
            }));
        }
    }
}

// Production Feature 3: Security & Input Validation
export class ProductionValidator {
    static validateInput(data: any, rules: ValidationRule[]): string[] {
        const errors: string[] = [];
        
        for (const rule of rules) {
            const value = data[rule.field];
            
            if (rule.type === 'required' && (value === undefined || value === null || value === '')) {
                errors.push(`${rule.field} is required`);
                continue;
            }
            
            if (value === undefined || value === null) continue;
            
            switch (rule.type) {
                case 'string':
                    if (typeof value !== 'string') {
                        errors.push(`${rule.field} must be a string`);
                    } else {
                        if (rule.minLength && value.length < rule.minLength) {
                            errors.push(`${rule.field} must be at least ${rule.minLength} characters`);
                        }
                        if (rule.maxLength && value.length > rule.maxLength) {
                            errors.push(`${rule.field} must be no more than ${rule.maxLength} characters`);
                        }
                        if (rule.pattern && !rule.pattern.test(value)) {
                            errors.push(`${rule.field} format is invalid`);
                        }
                    }
                    break;
                    
                case 'number':
                    if (typeof value !== 'number' || isNaN(value)) {
                        errors.push(`${rule.field} must be a valid number`);
                    }
                    break;
                    
                case 'email':
                    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (typeof value !== 'string' || !emailPattern.test(value)) {
                        errors.push(`${rule.field} must be a valid email address`);
                    }
                    break;
                    
                case 'custom':
                    if (rule.validator) {
                        const result = rule.validator(value);
                        if (result !== true) {
                            errors.push(typeof result === 'string' ? result : `${rule.field} is invalid`);
                        }
                    }
                    break;
            }
        }
        
        return errors;
    }
    
    static sanitizeInput(input: string): string {
        return input
            .replace(/[<>&"']/g, char => {
                switch (char) {
                    case '<': return '&lt;';
                    case '>': return '&gt;';
                    case '&': return '&amp;';
                    case '"': return '&quot;';
                    case "'": return '&#x27;';
                    default: return char;
                }
            })
            .trim();
    }
}

// Production Feature 4: Performance & Caching
export class ProductionCache {
    private cache = new Map<string, CacheEntry>();
    private defaultTtl = 300000; // 5 minutes
    
    set(key: string, value: any, ttlMs = this.defaultTtl): void {
        const expiry = new Date(Date.now() + ttlMs);
        this.cache.set(key, {
            key,
            value,
            expiry,
            hitCount: 0
        });
    }
    
    get(key: string): any {
        const entry = this.cache.get(key);
        if (!entry) return undefined;
        
        if (new Date() > entry.expiry) {
            this.cache.delete(key);
            return undefined;
        }
        
        entry.hitCount++;
        return entry.value;
    }
    
    has(key: string): boolean {
        return this.get(key) !== undefined;
    }
    
    delete(key: string): boolean {
        return this.cache.delete(key);
    }
    
    clear(): void {
        this.cache.clear();
    }
    
    getStats() {
        const entries = Array.from(this.cache.values());
        const totalHits = entries.reduce((sum, entry) => sum + entry.hitCount, 0);
        
        return {
            size: this.cache.size,
            totalHits,
            averageHits: entries.length > 0 ? totalHits / entries.length : 0
        };
    }
}

// Production Feature 5: Metrics Collection
export class ProductionMetrics {
    private metrics: Map<string, ProductionMetrics> = new Map();
    private eventEmitter = new EventEmitter();
    
    record(module: string, operation: string, duration: number, success: boolean) {
        const key = `${module}:${operation}`;
        const existing = this.metrics.get(key) || {
            operationCount: 0,
            successCount: 0,
            errorCount: 0,
            averageResponseTime: 0,
            cacheHitRate: 0,
            lastReset: new Date()
        };
        
        existing.operationCount++;
        if (success) {
            existing.successCount++;
        } else {
            existing.errorCount++;
        }
        
        // Update running average
        existing.averageResponseTime = 
            (existing.averageResponseTime * (existing.operationCount - 1) + duration) / existing.operationCount;
        
        this.metrics.set(key, existing);
        
        this.eventEmitter.emit('metric', { module, operation, duration, success });
    }
    
    getMetrics(module?: string): Map<string, ProductionMetrics> {
        if (module) {
            const filtered = new Map();
            for (const [key, value] of this.metrics) {
                if (key.startsWith(module + ':')) {
                    filtered.set(key, value);
                }
            }
            return filtered;
        }
        return this.metrics;
    }
    
    onMetric(callback: (metric: any) => void) {
        this.eventEmitter.on('metric', callback);
    }
}

// Production Feature 6: Audit Trail
export class ProductionAuditor {
    private auditLog: AuditEvent[] = [];
    private maxLogSize = 10000;
    
    log(event: Omit<AuditEvent, 'id' | 'timestamp'>): void {
        const auditEvent: AuditEvent = {
            id: crypto.randomUUID(),
            timestamp: new Date(),
            ...event
        };
        
        this.auditLog.push(auditEvent);
        
        // Trim log if too large
        if (this.auditLog.length > this.maxLogSize) {
            this.auditLog = this.auditLog.slice(-this.maxLogSize);
        }
    }
    
    getAuditLog(module?: string, limit = 100): AuditEvent[] {
        let logs = this.auditLog;
        
        if (module) {
            logs = logs.filter(event => event.module === module);
        }
        
        return logs.slice(-limit);
    }
    
    searchAudit(criteria: Partial<AuditEvent>): AuditEvent[] {
        return this.auditLog.filter(event => {
            return Object.keys(criteria).every(key => {
                const criteriaValue = (criteria as any)[key];
                const eventValue = (event as any)[key];
                
                if (criteriaValue instanceof Date && eventValue instanceof Date) {
                    return criteriaValue.getTime() === eventValue.getTime();
                }
                
                return criteriaValue === eventValue;
            });
        });
    }
}

// Production Feature 7-15: Singleton Manager
export class ProductionManager {
    private static instance: ProductionManager;
    
    public readonly errorHandler: ProductionErrorHandler;
    public readonly logger: ProductionLogger;
    public readonly cache: ProductionCache;
    public readonly metrics: ProductionMetrics;
    public readonly auditor: ProductionAuditor;
    public readonly config: ProductionConfig;
    
    private constructor(config: Partial<ProductionConfig> = {}) {
        this.config = {
            environment: 'development',
            logLevel: 'info',
            enableMetrics: true,
            enableCaching: true,
            enableAuditTrail: true,
            retryAttempts: 3,
            timeoutMs: 30000,
            rateLimitRpm: 1000,
            ...config
        };
        
        this.errorHandler = new ProductionErrorHandler(this.config.retryAttempts);
        this.logger = new ProductionLogger(this.config.logLevel);
        this.cache = new ProductionCache();
        this.metrics = new ProductionMetrics();
        this.auditor = new ProductionAuditor();
    }
    
    static getInstance(config?: Partial<ProductionConfig>): ProductionManager {
        if (!ProductionManager.instance) {
            ProductionManager.instance = new ProductionManager(config);
        }
        return ProductionManager.instance;
    }
    
    async executeOperation<T>(
        module: string,
        operation: string,
        napiFunction: () => Promise<T>,
        input?: any,
        userId?: string,
        ipAddress?: string
    ): Promise<T> {
        const startTime = performance.now();
        let success = false;
        let result: T;
        let error: Error | undefined;
        
        try {
            // Create cache key
            const cacheKey = this.config.enableCaching && input ? 
                `${module}:${operation}:${crypto.createHash('md5').update(JSON.stringify(input)).digest('hex')}` : 
                null;
            
            // Check cache first
            if (cacheKey && this.cache.has(cacheKey)) {
                this.logger.debug(module, `Cache hit for ${operation}`);
                return this.cache.get(cacheKey);
            }
            
            // Execute with retry logic
            result = await this.errorHandler.executeWithRetry(napiFunction, `${module}:${operation}`);
            success = true;
            
            // Cache the result
            if (cacheKey) {
                this.cache.set(cacheKey, result);
            }
            
            this.logger.info(module, `Operation ${operation} completed successfully`);
            
            return result;
            
        } catch (err) {
            error = err as Error;
            this.logger.error(module, `Operation ${operation} failed`, error);
            throw error;
        } finally {
            const duration = performance.now() - startTime;
            
            // Record metrics
            if (this.config.enableMetrics) {
                this.metrics.record(module, operation, duration, success);
            }
            
            // Create audit trail
            if (this.config.enableAuditTrail) {
                this.auditor.log({
                    module,
                    operation,
                    userId,
                    ipAddress,
                    input,
                    output: success ? result : undefined,
                    duration,
                    success,
                    error: error?.message
                });
            }
        }
    }
}

export default ProductionManager;
