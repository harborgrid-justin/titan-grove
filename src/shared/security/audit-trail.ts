/**
 * Audit Trails and Compliance Logging System - Enterprise Grade
 * Implements Fix 27: Audit trails and compliance logging
 */

import { getLogger } from '../../utils/enterprise-logger';
import { getDatabasePool } from '../database/database-connection-pool';
import { getEncryptionService } from './data-encryption';

interface AuditEvent {
  id: string;
  eventType: string;
  resourceType: string;
  resourceId: string;
  userId?: string;
  sessionId?: string;
  action: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'EXPORT' | 'IMPORT' | 'CONFIG_CHANGE';
  result: 'SUCCESS' | 'FAILURE' | 'PARTIAL';
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
  requestId?: string;
  correlationId?: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  metadata?: Record<string, any>;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  complianceFrameworks: string[]; // SOX, GDPR, HIPAA, PCI-DSS, etc.
  retentionPeriodDays: number;
  isEncrypted: boolean;
  checksumHash: string;
}

interface ComplianceRule {
  id: string;
  name: string;
  framework: string; // SOX, GDPR, HIPAA, PCI-DSS, ISO-27001, NIST, COSO
  description: string;
  eventTypes: string[];
  requiredFields: string[];
  retentionPeriodDays: number;
  encryptionRequired: boolean;
  alertOnViolation: boolean;
  isActive: boolean;
}

interface AuditQuery {
  eventTypes?: string[];
  resourceTypes?: string[];
  userIds?: string[];
  actions?: string[];
  results?: string[];
  startDate?: Date;
  endDate?: Date;
  riskLevels?: string[];
  complianceFrameworks?: string[];
  limit?: number;
  offset?: number;
  orderBy?: 'timestamp' | 'eventType' | 'riskLevel';
  orderDirection?: 'ASC' | 'DESC';
}

interface AuditReport {
  totalEvents: number;
  timeRange: {
    startDate: Date;
    endDate: Date;
  };
  eventTypeCounts: Record<string, number>;
  userActivityCounts: Record<string, number>;
  riskLevelCounts: Record<string, number>;
  complianceViolations: AuditEvent[];
  suspiciousActivities: AuditEvent[];
  topRiskyUsers: Array<{
    userId: string;
    riskScore: number;
    eventCount: number;
  }>;
}

export class AuditTrailService {
  private logger = getLogger('AuditTrailService');
  private complianceRules = new Map<string, ComplianceRule>();
  private auditBuffer: AuditEvent[] = [];
  private bufferFlushInterval: NodeJS.Timeout;

  constructor() {
    // Initialize compliance rules
    this.initializeComplianceRules();
    
    // Flush audit buffer every 30 seconds
    this.bufferFlushInterval = setInterval(() => {
      this.flushAuditBuffer();
    }, 30000);

    this.logger.logBusinessOperation(
      'AUDIT_TRAIL_SERVICE_INITIALIZED',
      'AuditTrailService',
      '',
      'SUCCESS',
      {
        complianceRulesCount: this.complianceRules.size,
        bufferFlushIntervalMs: 30000
      }
    );
  }

  public async logAuditEvent(
    eventType: string,
    resourceType: string,
    resourceId: string,
    action: AuditEvent['action'],
    result: AuditEvent['result'],
    context: {
      userId?: string;
      sessionId?: string;
      ipAddress?: string;
      userAgent?: string;
      requestId?: string;
      correlationId?: string;
      oldValues?: Record<string, any>;
      newValues?: Record<string, any>;
      metadata?: Record<string, any>;
    } = {}
  ): Promise<void> {
    try {
      const auditEvent = await this.createAuditEvent(
        eventType,
        resourceType,
        resourceId,
        action,
        result,
        context
      );

      // Add to buffer for batch processing
      this.auditBuffer.push(auditEvent);

      // Flush immediately for high-risk events
      if (auditEvent.riskLevel === 'CRITICAL' || auditEvent.riskLevel === 'HIGH') {
        await this.flushAuditBuffer();
      }

      // Check compliance violations
      await this.checkComplianceViolations(auditEvent);

    } catch (error) {
      this.logger.logError('Failed to log audit event', error, {
        eventType,
        resourceType,
        resourceId,
        action,
        result
      });
    }
  }

  public async logDataAccess(
    resourceType: string,
    resourceId: string,
    accessType: 'READ' | 'EXPORT' | 'PRINT',
    dataClassification: 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'RESTRICTED',
    context: {
      userId?: string;
      sessionId?: string;
      ipAddress?: string;
      recordCount?: number;
      fields?: string[];
      purpose?: string;
    } = {}
  ): Promise<void> {
    const riskLevel = this.calculateDataAccessRisk(accessType, dataClassification, context);
    
    await this.logAuditEvent(
      'DATA_ACCESS',
      resourceType,
      resourceId,
      accessType as AuditEvent['action'],
      'SUCCESS',
      {
        ...context,
        metadata: {
          dataClassification,
          recordCount: context.recordCount,
          fields: context.fields,
          purpose: context.purpose
        }
      }
    );
  }

  public async logConfigurationChange(
    configType: string,
    configId: string,
    oldConfig: Record<string, any>,
    newConfig: Record<string, any>,
    context: {
      userId?: string;
      sessionId?: string;
      ipAddress?: string;
      reason?: string;
    } = {}
  ): Promise<void> {
    await this.logAuditEvent(
      'CONFIGURATION_CHANGE',
      configType,
      configId,
      'UPDATE',
      'SUCCESS',
      {
        ...context,
        oldValues: oldConfig,
        newValues: newConfig,
        metadata: {
          reason: context.reason,
          changedFields: this.getChangedFields(oldConfig, newConfig)
        }
      }
    );
  }

  public async logSecurityEvent(
    eventType: string,
    resourceId: string,
    result: AuditEvent['result'],
    context: {
      userId?: string;
      threatType?: string;
      severity?: string;
      description?: string;
      ipAddress?: string;
      mitigationAction?: string;
    } = {}
  ): Promise<void> {
    await this.logAuditEvent(
      eventType,
      'SECURITY',
      resourceId,
      'READ',
      result,
      {
        ...context,
        metadata: {
          threatType: context.threatType,
          severity: context.severity,
          description: context.description,
          mitigationAction: context.mitigationAction
        }
      }
    );
  }

  public async queryAuditEvents(query: AuditQuery): Promise<AuditEvent[]> {
    try {
      const db = getDatabasePool();
      const conditions: string[] = [];
      const params: any[] = [];
      let paramIndex = 1;

      // Build WHERE conditions
      if (query.eventTypes && query.eventTypes.length > 0) {
        conditions.push(`event_type = ANY($${paramIndex++})`);
        params.push(query.eventTypes);
      }

      if (query.resourceTypes && query.resourceTypes.length > 0) {
        conditions.push(`resource_type = ANY($${paramIndex++})`);
        params.push(query.resourceTypes);
      }

      if (query.userIds && query.userIds.length > 0) {
        conditions.push(`user_id = ANY($${paramIndex++})`);
        params.push(query.userIds);
      }

      if (query.actions && query.actions.length > 0) {
        conditions.push(`action = ANY($${paramIndex++})`);
        params.push(query.actions);
      }

      if (query.results && query.results.length > 0) {
        conditions.push(`result = ANY($${paramIndex++})`);
        params.push(query.results);
      }

      if (query.startDate) {
        conditions.push(`timestamp >= $${paramIndex++}`);
        params.push(query.startDate);
      }

      if (query.endDate) {
        conditions.push(`timestamp <= $${paramIndex++}`);
        params.push(query.endDate);
      }

      if (query.riskLevels && query.riskLevels.length > 0) {
        conditions.push(`risk_level = ANY($${paramIndex++})`);
        params.push(query.riskLevels);
      }

      if (query.complianceFrameworks && query.complianceFrameworks.length > 0) {
        conditions.push(`compliance_frameworks && $${paramIndex++}`);
        params.push(query.complianceFrameworks);
      }

      // Build SQL query
      let sql = `
        SELECT * FROM audit_events
        ${conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : ''}
        ORDER BY ${query.orderBy || 'timestamp'} ${query.orderDirection || 'DESC'}
      `;

      if (query.limit) {
        sql += ` LIMIT $${paramIndex++}`;
        params.push(query.limit);
      }

      if (query.offset) {
        sql += ` OFFSET $${paramIndex++}`;
        params.push(query.offset);
      }

      const result = await db.query(sql, params);
      
      // Decrypt sensitive data if needed
      const events: AuditEvent[] = [];
      for (const row of result.rows) {
        const event = await this.deserializeAuditEvent(row);
        events.push(event);
      }

      this.logger.logAuditEvent(
        'AUDIT_QUERY_EXECUTED',
        'audit_events',
        'SUCCESS',
        {
          userId: query.userIds?.[0],
          metadata: {
            queryParameters: query,
            resultCount: events.length
          }
        }
      );

      return events;

    } catch (error) {
      this.logger.logError('Failed to query audit events', error, { query });
      throw error;
    }
  }

  public async generateComplianceReport(
    framework: string,
    startDate: Date,
    endDate: Date
  ): Promise<AuditReport> {
    try {
      const query: AuditQuery = {
        startDate,
        endDate,
        complianceFrameworks: [framework],
        limit: 10000
      };

      const events = await this.queryAuditEvents(query);
      
      const report: AuditReport = {
        totalEvents: events.length,
        timeRange: { startDate, endDate },
        eventTypeCounts: {},
        userActivityCounts: {},
        riskLevelCounts: {},
        complianceViolations: [],
        suspiciousActivities: [],
        topRiskyUsers: []
      };

      // Calculate statistics
      for (const event of events) {
        // Event type counts
        report.eventTypeCounts[event.eventType] = (report.eventTypeCounts[event.eventType] || 0) + 1;
        
        // User activity counts
        if (event.userId) {
          report.userActivityCounts[event.userId] = (report.userActivityCounts[event.userId] || 0) + 1;
        }
        
        // Risk level counts
        report.riskLevelCounts[event.riskLevel] = (report.riskLevelCounts[event.riskLevel] || 0) + 1;
        
        // Identify violations and suspicious activities
        if (event.result === 'FAILURE' || event.riskLevel === 'CRITICAL') {
          if (event.result === 'FAILURE') {
            report.complianceViolations.push(event);
          }
          if (event.riskLevel === 'CRITICAL' || event.riskLevel === 'HIGH') {
            report.suspiciousActivities.push(event);
          }
        }
      }

      // Calculate top risky users
      const userRiskScores: Record<string, { score: number; count: number }> = {};
      
      for (const event of events) {
        if (event.userId) {
          if (!userRiskScores[event.userId]) {
            userRiskScores[event.userId] = { score: 0, count: 0 };
          }
          
          const riskScore = this.calculateEventRiskScore(event);
          userRiskScores[event.userId].score += riskScore;
          userRiskScores[event.userId].count += 1;
        }
      }

      report.topRiskyUsers = Object.entries(userRiskScores)
        .map(([userId, { score, count }]) => ({
          userId,
          riskScore: score / count, // Average risk score
          eventCount: count
        }))
        .sort((a, b) => b.riskScore - a.riskScore)
        .slice(0, 10);

      this.logger.logAuditEvent(
        'COMPLIANCE_REPORT_GENERATED',
        'audit_reports',
        'SUCCESS',
        {
          metadata: {
            framework,
            startDate,
            endDate,
            totalEvents: report.totalEvents,
            violationCount: report.complianceViolations.length
          }
        }
      );

      return report;

    } catch (error) {
      this.logger.logError('Failed to generate compliance report', error, {
        framework,
        startDate,
        endDate
      });
      throw error;
    }
  }

  public async setupComplianceRule(rule: ComplianceRule): Promise<void> {
    try {
      this.complianceRules.set(rule.id, rule);

      // Persist to database
      const db = getDatabasePool();
      await db.query(`
        INSERT INTO compliance_rules (id, name, framework, description, event_types, required_fields, 
                                     retention_period_days, encryption_required, alert_on_violation, is_active)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (id) DO UPDATE SET
          name = $2, framework = $3, description = $4, event_types = $5, required_fields = $6,
          retention_period_days = $7, encryption_required = $8, alert_on_violation = $9, is_active = $10
      `, [
        rule.id, rule.name, rule.framework, rule.description, rule.eventTypes, rule.requiredFields,
        rule.retentionPeriodDays, rule.encryptionRequired, rule.alertOnViolation, rule.isActive
      ]);

      this.logger.logAuditEvent(
        'COMPLIANCE_RULE_CREATED',
        'compliance_rules',
        rule.id,
        'CREATE',
        'SUCCESS',
        { metadata: { framework: rule.framework, name: rule.name } }
      );

    } catch (error) {
      this.logger.logError('Failed to setup compliance rule', error, { rule });
      throw error;
    }
  }

  public async purgeExpiredAuditEvents(): Promise<number> {
    try {
      const db = getDatabasePool();
      
      // Find events that have exceeded their retention period
      const result = await db.query(`
        DELETE FROM audit_events
        WHERE timestamp < NOW() - INTERVAL '1 day' * retention_period_days
        RETURNING id
      `);

      const purgedCount = result.rowCount;

      if (purgedCount > 0) {
        this.logger.logAuditEvent(
          'AUDIT_DATA_PURGED',
          'audit_events',
          '',
          'DELETE',
          'SUCCESS',
          { metadata: { purgedCount } }
        );
      }

      return purgedCount;

    } catch (error) {
      this.logger.logError('Failed to purge expired audit events', error);
      throw error;
    }
  }

  // Private methods
  private async createAuditEvent(
    eventType: string,
    resourceType: string,
    resourceId: string,
    action: AuditEvent['action'],
    result: AuditEvent['result'],
    context: any
  ): Promise<AuditEvent> {
    const id = this.generateAuditId();
    const timestamp = new Date();
    const riskLevel = this.calculateRiskLevel(eventType, action, result, context);
    const complianceFrameworks = this.getApplicableFrameworks(eventType, resourceType);
    const retentionPeriod = this.calculateRetentionPeriod(complianceFrameworks);
    
    const auditEvent: AuditEvent = {
      id,
      eventType,
      resourceType,
      resourceId,
      action,
      result,
      timestamp,
      riskLevel,
      complianceFrameworks,
      retentionPeriodDays: retentionPeriod,
      isEncrypted: false,
      checksumHash: '',
      ...context
    };

    // Encrypt sensitive data if required
    const encryptionRequired = this.isEncryptionRequired(complianceFrameworks);
    if (encryptionRequired) {
      auditEvent.oldValues = await this.encryptSensitiveData(auditEvent.oldValues);
      auditEvent.newValues = await this.encryptSensitiveData(auditEvent.newValues);
      auditEvent.metadata = await this.encryptSensitiveData(auditEvent.metadata);
      auditEvent.isEncrypted = true;
    }

    // Generate integrity checksum
    auditEvent.checksumHash = this.generateChecksum(auditEvent);

    return auditEvent;
  }

  private async flushAuditBuffer(): Promise<void> {
    if (this.auditBuffer.length === 0) return;

    try {
      const db = getDatabasePool();
      const events = [...this.auditBuffer];
      this.auditBuffer = [];

      // Batch insert audit events
      const sql = `
        INSERT INTO audit_events (
          id, event_type, resource_type, resource_id, user_id, session_id, action, result,
          timestamp, ip_address, user_agent, request_id, correlation_id, old_values, new_values,
          metadata, risk_level, compliance_frameworks, retention_period_days, is_encrypted, checksum_hash
        ) VALUES ${events.map((_, i) => `($${i * 21 + 1}, $${i * 21 + 2}, $${i * 21 + 3}, $${i * 21 + 4}, $${i * 21 + 5}, $${i * 21 + 6}, $${i * 21 + 7}, $${i * 21 + 8}, $${i * 21 + 9}, $${i * 21 + 10}, $${i * 21 + 11}, $${i * 21 + 12}, $${i * 21 + 13}, $${i * 21 + 14}, $${i * 21 + 15}, $${i * 21 + 16}, $${i * 21 + 17}, $${i * 21 + 18}, $${i * 21 + 19}, $${i * 21 + 20}, $${i * 21 + 21})`).join(', ')}
      `;

      const params = events.flatMap(event => [
        event.id, event.eventType, event.resourceType, event.resourceId, event.userId,
        event.sessionId, event.action, event.result, event.timestamp, event.ipAddress,
        event.userAgent, event.requestId, event.correlationId,
        JSON.stringify(event.oldValues), JSON.stringify(event.newValues), JSON.stringify(event.metadata),
        event.riskLevel, event.complianceFrameworks, event.retentionPeriodDays, event.isEncrypted, event.checksumHash
      ]);

      await db.query(sql, params);

    } catch (error) {
      this.logger.logError('Failed to flush audit buffer', error, {
        bufferSize: this.auditBuffer.length
      });
      // Re-add events to buffer for retry
      this.auditBuffer.unshift(...this.auditBuffer);
    }
  }

  private calculateRiskLevel(eventType: string, action: string, result: string, context: any): AuditEvent['riskLevel'] {
    let score = 0;

    // Base risk by event type
    const highRiskEvents = ['LOGIN', 'LOGOUT', 'CONFIG_CHANGE', 'DATA_EXPORT', 'SECURITY_VIOLATION'];
    if (highRiskEvents.includes(eventType)) score += 3;

    // Risk by action
    if (action === 'DELETE') score += 2;
    if (action === 'UPDATE') score += 1;

    // Risk by result
    if (result === 'FAILURE') score += 2;

    // Additional context risks
    if (context.ipAddress && this.isHighRiskIP(context.ipAddress)) score += 2;
    if (context.userAgent && this.isAutomatedRequest(context.userAgent)) score += 1;

    if (score >= 5) return 'CRITICAL';
    if (score >= 3) return 'HIGH';
    if (score >= 1) return 'MEDIUM';
    return 'LOW';
  }

  private calculateDataAccessRisk(
    accessType: string,
    dataClassification: string,
    context: any
  ): AuditEvent['riskLevel'] {
    let score = 0;

    // Risk by data classification
    if (dataClassification === 'RESTRICTED') score += 3;
    else if (dataClassification === 'CONFIDENTIAL') score += 2;
    else if (dataClassification === 'INTERNAL') score += 1;

    // Risk by access type
    if (accessType === 'EXPORT') score += 2;
    else if (accessType === 'PRINT') score += 1;

    // Risk by volume
    if (context.recordCount > 1000) score += 2;
    else if (context.recordCount > 100) score += 1;

    if (score >= 5) return 'CRITICAL';
    if (score >= 3) return 'HIGH';
    if (score >= 1) return 'MEDIUM';
    return 'LOW';
  }

  private getApplicableFrameworks(eventType: string, resourceType: string): string[] {
    const frameworks: string[] = ['SOX']; // Default compliance framework

    // GDPR for personal data
    if (resourceType.includes('user') || resourceType.includes('customer')) {
      frameworks.push('GDPR');
    }

    // HIPAA for health data
    if (resourceType.includes('health') || resourceType.includes('medical')) {
      frameworks.push('HIPAA');
    }

    // PCI-DSS for payment data
    if (resourceType.includes('payment') || resourceType.includes('card')) {
      frameworks.push('PCI-DSS');
    }

    return frameworks;
  }

  private calculateRetentionPeriod(complianceFrameworks: string[]): number {
    let maxRetention = 2555; // 7 years default

    for (const framework of complianceFrameworks) {
      const rule = Array.from(this.complianceRules.values()).find(r => r.framework === framework);
      if (rule && rule.retentionPeriodDays > maxRetention) {
        maxRetention = rule.retentionPeriodDays;
      }
    }

    return maxRetention;
  }

  private isEncryptionRequired(complianceFrameworks: string[]): boolean {
    return complianceFrameworks.some(framework => {
      const rule = Array.from(this.complianceRules.values()).find(r => r.framework === framework);
      return rule?.encryptionRequired || false;
    });
  }

  private async encryptSensitiveData(data: any): Promise<any> {
    if (!data || typeof data !== 'object') return data;

    try {
      const encryptionService = getEncryptionService();
      const encrypted = await encryptionService.encryptData(JSON.stringify(data));
      return { __encrypted: true, ...encrypted };
    } catch (error) {
      this.logger.logError('Failed to encrypt audit data', error);
      return data;
    }
  }

  private generateChecksum(event: AuditEvent): string {
    const crypto = require('crypto');
    const data = JSON.stringify({
      id: event.id,
      eventType: event.eventType,
      resourceType: event.resourceType,
      resourceId: event.resourceId,
      timestamp: event.timestamp,
      result: event.result
    });
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  private generateAuditId(): string {
    return `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private calculateEventRiskScore(event: AuditEvent): number {
    const scores = { LOW: 1, MEDIUM: 2, HIGH: 3, CRITICAL: 4 };
    return scores[event.riskLevel];
  }

  private getChangedFields(oldValues: Record<string, any>, newValues: Record<string, any>): string[] {
    const changed: string[] = [];
    
    for (const key in newValues) {
      if (oldValues[key] !== newValues[key]) {
        changed.push(key);
      }
    }
    
    return changed;
  }

  private async deserializeAuditEvent(row: any): Promise<AuditEvent> {
    const event: AuditEvent = { ...row };

    // Decrypt encrypted fields if needed
    if (event.isEncrypted) {
      try {
        const encryptionService = getEncryptionService();
        
        if (event.oldValues?.__encrypted) {
          const decrypted = await encryptionService.decryptData(event.oldValues);
          event.oldValues = JSON.parse(decrypted);
        }
        
        if (event.newValues?.__encrypted) {
          const decrypted = await encryptionService.decryptData(event.newValues);
          event.newValues = JSON.parse(decrypted);
        }
        
        if (event.metadata?.__encrypted) {
          const decrypted = await encryptionService.decryptData(event.metadata);
          event.metadata = JSON.parse(decrypted);
        }
      } catch (error) {
        this.logger.logError('Failed to decrypt audit event data', error, { eventId: event.id });
      }
    }

    return event;
  }

  private async checkComplianceViolations(event: AuditEvent): Promise<void> {
    for (const framework of event.complianceFrameworks) {
      const rule = Array.from(this.complianceRules.values()).find(r => r.framework === framework);
      
      if (rule && rule.isActive && rule.eventTypes.includes(event.eventType)) {
        // Check required fields
        for (const requiredField of rule.requiredFields) {
          if (!event[requiredField as keyof AuditEvent] && !event.metadata?.[requiredField]) {
            this.logger.logSecurityEvent('COMPLIANCE_VIOLATION', 'HIGH', {
              eventId: event.id,
              framework,
              violation: 'MISSING_REQUIRED_FIELD',
              field: requiredField
            });
          }
        }

        // Alert on violations if configured
        if (rule.alertOnViolation && (event.result === 'FAILURE' || event.riskLevel === 'CRITICAL')) {
          this.logger.logSecurityEvent('COMPLIANCE_ALERT', 'HIGH', {
            eventId: event.id,
            framework,
            eventType: event.eventType,
            riskLevel: event.riskLevel
          });
        }
      }
    }
  }

  private isHighRiskIP(ipAddress: string): boolean {
    // This would typically check against threat intelligence feeds
    // For now, just basic checks for known patterns
    return ipAddress.includes('tor-') || ipAddress.includes('vpn-') || ipAddress.includes('proxy-');
  }

  private isAutomatedRequest(userAgent: string): boolean {
    const botPatterns = ['bot', 'crawler', 'spider', 'scraper', 'curl', 'wget'];
    return botPatterns.some(pattern => userAgent.toLowerCase().includes(pattern));
  }

  private initializeComplianceRules(): void {
    // SOX compliance rule
    this.complianceRules.set('sox-001', {
      id: 'sox-001',
      name: 'SOX Financial Data Access',
      framework: 'SOX',
      description: 'Monitor access to financial data and systems',
      eventTypes: ['DATA_ACCESS', 'CONFIGURATION_CHANGE', 'LOGIN', 'LOGOUT'],
      requiredFields: ['userId', 'timestamp', 'ipAddress', 'result'],
      retentionPeriodDays: 2555, // 7 years
      encryptionRequired: true,
      alertOnViolation: true,
      isActive: true
    });

    // GDPR compliance rule
    this.complianceRules.set('gdpr-001', {
      id: 'gdpr-001',
      name: 'GDPR Personal Data Processing',
      framework: 'GDPR',
      description: 'Monitor processing of personal data',
      eventTypes: ['DATA_ACCESS', 'EXPORT', 'DELETE', 'UPDATE'],
      requiredFields: ['userId', 'timestamp', 'resourceId', 'action'],
      retentionPeriodDays: 1095, // 3 years
      encryptionRequired: true,
      alertOnViolation: true,
      isActive: true
    });

    // PCI-DSS compliance rule
    this.complianceRules.set('pci-001', {
      id: 'pci-001',
      name: 'PCI-DSS Payment Data Access',
      framework: 'PCI-DSS',
      description: 'Monitor access to payment card data',
      eventTypes: ['DATA_ACCESS', 'EXPORT', 'LOGIN', 'CONFIGURATION_CHANGE'],
      requiredFields: ['userId', 'timestamp', 'ipAddress', 'userAgent', 'result'],
      retentionPeriodDays: 365, // 1 year minimum
      encryptionRequired: true,
      alertOnViolation: true,
      isActive: true
    });
  }
}

// Singleton instance
let auditService: AuditTrailService | null = null;

export function initializeAuditService(): AuditTrailService {
  if (auditService) {
    throw new Error('Audit service already initialized');
  }
  
  auditService = new AuditTrailService();
  return auditService;
}

export function getAuditService(): AuditTrailService {
  if (!auditService) {
    throw new Error('Audit service not initialized. Call initializeAuditService first.');
  }
  return auditService;
}

export { AuditEvent, ComplianceRule, AuditQuery, AuditReport };