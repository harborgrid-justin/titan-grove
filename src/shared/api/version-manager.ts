/**
 * API Versioning and Backwards Compatibility System - Enterprise Grade
 * Implements Fix 30: API versioning and backwards compatibility
 */

import { Request, Response, NextFunction, Router } from 'express';
import { getLogger } from '../../utils/enterprise-logger';
import { getAuditService } from '../security/audit-trail';

interface APIVersion {
  version: string;
  releaseDate: Date;
  deprecationDate?: Date;
  endOfLifeDate?: Date;
  isSupported: boolean;
  isDeprecated: boolean;
  migrationGuide?: string;
  breaking_changes?: string[];
  new_features?: string[];
}

interface VersionedEndpoint {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  versions: {
    [version: string]: {
      handler: (req: Request, res: Response, next: NextFunction) => void;
      deprecated?: boolean;
      migration?: {
        to: string;
        transformer?: (data: any) => any;
      };
    };
  };
}

interface VersioningConfig {
  defaultVersion: string;
  supportedVersions: string[];
  deprecationWarningHeader: string;
  versionHeader: string;
  urlVersionPrefix: string;
  enableVersionInQuery: boolean;
  enableVersionInHeader: boolean;
  enableVersionInAccept: boolean;
  strictVersioning: boolean; // Reject unsupported versions
}

interface CompatibilityRule {
  fromVersion: string;
  toVersion: string;
  transformRequest?: (data: any) => any;
  transformResponse?: (data: any) => any;
  fieldMappings?: { [oldField: string]: string };
  deprecatedFields?: string[];
  newFields?: { [field: string]: any };
}

export class APIVersionManager {
  private logger = getLogger('APIVersionManager');
  private versions = new Map<string, APIVersion>();
  private endpoints = new Map<string, VersionedEndpoint>();
  private compatibilityRules = new Map<string, CompatibilityRule[]>();
  private config: VersioningConfig;
  private versionStats = new Map<string, { requests: number; lastUsed: Date }>();

  constructor(config: Partial<VersioningConfig> = {}) {
    this.config = {
      defaultVersion: 'v1',
      supportedVersions: ['v1', 'v2'],
      deprecationWarningHeader: 'X-API-Deprecation-Warning',
      versionHeader: 'X-API-Version',
      urlVersionPrefix: '/api',
      enableVersionInQuery: true,
      enableVersionInHeader: true,
      enableVersionInAccept: true,
      strictVersioning: false,
      ...config
    };

    this.initializeVersions();
    
    this.logger.logBusinessOperation(
      'API_VERSION_MANAGER_INITIALIZED',
      'APIVersionManager',
      '',
      'SUCCESS',
      {
        defaultVersion: this.config.defaultVersion,
        supportedVersions: this.config.supportedVersions,
        strictVersioning: this.config.strictVersioning
      }
    );
  }

  private initializeVersions(): void {
    // Initialize version metadata
    const versions: APIVersion[] = [
      {
        version: 'v1',
        releaseDate: new Date('2024-01-01'),
        deprecationDate: new Date('2025-01-01'),
        endOfLifeDate: new Date('2025-06-01'),
        isSupported: true,
        isDeprecated: false,
        migrationGuide: '/docs/migration/v1-to-v2',
        breaking_changes: [],
        new_features: ['Initial API release']
      },
      {
        version: 'v2',
        releaseDate: new Date('2024-06-01'),
        isSupported: true,
        isDeprecated: false,
        migrationGuide: '/docs/api/v2',
        breaking_changes: [
          'Changed user ID format from numeric to UUID',
          'Removed deprecated /users/list endpoint',
          'Updated error response format'
        ],
        new_features: [
          'Enhanced authentication with JWT',
          'Improved error handling',
          'Added pagination to all list endpoints',
          'GraphQL support'
        ]
      }
    ];

    for (const version of versions) {
      this.versions.set(version.version, version);
      this.versionStats.set(version.version, { requests: 0, lastUsed: new Date() });
    }

    // Initialize compatibility rules
    this.setupCompatibilityRules();
  }

  private setupCompatibilityRules(): void {
    // v1 to v2 compatibility rules
    const v1ToV2Rules: CompatibilityRule[] = [
      {
        fromVersion: 'v1',
        toVersion: 'v2',
        transformRequest: (data) => {
          // Convert numeric user IDs to UUIDs for v2
          if (data.userId && typeof data.userId === 'number') {
            data.userId = `user_${data.userId}_${Date.now()}`;
          }
          return data;
        },
        transformResponse: (data) => {
          // Convert v2 response format back to v1 format
          if (data.data && data.meta) {
            return {
              ...data.data,
              pagination: data.meta.pagination
            };
          }
          return data;
        },
        fieldMappings: {
          'user_id': 'userId',
          'created_time': 'createdAt',
          'updated_time': 'updatedAt'
        },
        deprecatedFields: ['legacy_field', 'old_timestamp'],
        newFields: {
          'apiVersion': 'v1'
        }
      }
    ];

    this.compatibilityRules.set('v1->v2', v1ToV2Rules);
  }

  // Version detection middleware
  public versionMiddleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        let detectedVersion = this.config.defaultVersion;

        // 1. Check URL path for version (e.g., /api/v2/users)
        const urlVersionMatch = req.path.match(/^\/api\/(v\d+)\//);
        if (urlVersionMatch) {
          detectedVersion = urlVersionMatch[1];
        }

        // 2. Check version query parameter (e.g., ?version=v2)
        if (this.config.enableVersionInQuery && req.query.version) {
          detectedVersion = req.query.version as string;
        }

        // 3. Check version header (e.g., X-API-Version: v2)
        if (this.config.enableVersionInHeader && req.headers[this.config.versionHeader.toLowerCase()]) {
          detectedVersion = req.headers[this.config.versionHeader.toLowerCase()] as string;
        }

        // 4. Check Accept header (e.g., Accept: application/vnd.api+json; version=2)
        if (this.config.enableVersionInAccept && req.headers.accept) {
          const acceptVersionMatch = req.headers.accept.match(/version=(\d+)/);
          if (acceptVersionMatch) {
            detectedVersion = `v${acceptVersionMatch[1]}`;
          }
        }

        // Validate version
        const versionInfo = this.versions.get(detectedVersion);
        
        if (!versionInfo) {
          if (this.config.strictVersioning) {
            return res.status(400).json({
              error: 'Unsupported API version',
              requestedVersion: detectedVersion,
              supportedVersions: this.config.supportedVersions,
              defaultVersion: this.config.defaultVersion
            });
          } else {
            detectedVersion = this.config.defaultVersion;
          }
        } else if (!versionInfo.isSupported) {
          return res.status(410).json({
            error: 'API version no longer supported',
            requestedVersion: detectedVersion,
            endOfLifeDate: versionInfo.endOfLifeDate,
            migrationGuide: versionInfo.migrationGuide
          });
        }

        // Set version information in request
        (req as any).apiVersion = detectedVersion;
        (req as any).versionInfo = this.versions.get(detectedVersion);

        // Add version headers to response
        res.setHeader(this.config.versionHeader, detectedVersion);
        
        // Add deprecation warning if applicable
        const version = this.versions.get(detectedVersion);
        if (version?.isDeprecated) {
          res.setHeader(
            this.config.deprecationWarningHeader,
            `API version ${detectedVersion} is deprecated. Please migrate to ${this.config.supportedVersions[this.config.supportedVersions.length - 1]}. See: ${version.migrationGuide}`
          );
        }

        // Update usage statistics
        this.updateVersionStats(detectedVersion);

        // Log API version usage
        this.logVersionUsage(req, detectedVersion);

        next();

      } catch (error) {
        this.logger.logError('Version middleware error', error);
        return res.status(500).json({
          error: 'Version processing failed'
        });
      }
    };
  }

  // Backwards compatibility middleware
  public compatibilityMiddleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        const requestVersion = (req as any).apiVersion;
        const latestVersion = this.getLatestVersion();

        if (requestVersion !== latestVersion) {
          // Transform request for backwards compatibility
          const compatibilityKey = `${requestVersion}->${latestVersion}`;
          const rules = this.compatibilityRules.get(compatibilityKey) || [];

          for (const rule of rules) {
            if (rule.transformRequest) {
              req.body = rule.transformRequest(req.body);
              req.query = rule.transformRequest(req.query);
            }

            // Apply field mappings
            if (rule.fieldMappings) {
              this.applyFieldMappings(req.body, rule.fieldMappings);
              this.applyFieldMappings(req.query, rule.fieldMappings);
            }
          }

          // Store original response send method
          const originalSend = res.json.bind(res);
          
          // Override response to apply backwards compatibility transformations
          res.json = (data: any) => {
            try {
              let transformedData = data;

              for (const rule of rules) {
                if (rule.transformResponse) {
                  transformedData = rule.transformResponse(transformedData);
                }

                // Remove new fields that don't exist in older version
                if (rule.deprecatedFields) {
                  transformedData = this.removeFields(transformedData, rule.deprecatedFields);
                }

                // Add default values for new fields
                if (rule.newFields) {
                  transformedData = { ...transformedData, ...rule.newFields };
                }
              }

              return originalSend(transformedData);
            } catch (error) {
              this.logger.logError('Response transformation failed', error);
              return originalSend(data);
            }
          };
        }

        next();

      } catch (error) {
        this.logger.logError('Compatibility middleware error', error);
        next();
      }
    };
  }

  // Register versioned endpoint
  public registerEndpoint(
    path: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    versions: VersionedEndpoint['versions']
  ): void {
    const endpointKey = `${method}:${path}`;
    
    this.endpoints.set(endpointKey, {
      path,
      method,
      versions
    });

    this.logger.logBusinessOperation(
      'VERSIONED_ENDPOINT_REGISTERED',
      'APIVersionManager',
      endpointKey,
      'SUCCESS',
      {
        path,
        method,
        supportedVersions: Object.keys(versions)
      }
    );
  }

  // Create versioned router
  public createVersionedRouter(): Router {
    const router = Router();

    // Apply version middleware
    router.use(this.versionMiddleware());
    router.use(this.compatibilityMiddleware());

    // Register all versioned endpoints
    for (const [endpointKey, endpoint] of this.endpoints.entries()) {
      const { path, method, versions } = endpoint;

      router[method.toLowerCase() as 'get' | 'post' | 'put' | 'delete' | 'patch'](
        path,
        (req: Request, res: Response, next: NextFunction) => {
          const requestVersion = (req as any).apiVersion;
          const versionHandler = versions[requestVersion];

          if (!versionHandler) {
            // Try to find a compatible version
            const compatibleVersion = this.findCompatibleVersion(requestVersion, Object.keys(versions));
            
            if (compatibleVersion && versions[compatibleVersion]) {
              return versions[compatibleVersion].handler(req, res, next);
            }

            return res.status(404).json({
              error: 'Endpoint not available in this API version',
              requestedVersion: requestVersion,
              availableVersions: Object.keys(versions),
              endpoint: path
            });
          }

          // Check for deprecation warning
          if (versionHandler.deprecated) {
            res.setHeader(
              this.config.deprecationWarningHeader,
              `Endpoint ${method} ${path} is deprecated in version ${requestVersion}. ${versionHandler.migration?.to ? `Migrate to version ${versionHandler.migration.to}` : ''}`
            );
          }

          // Execute version-specific handler
          versionHandler.handler(req, res, next);
        }
      );
    }

    return router;
  }

  // Version management methods
  public addVersion(version: APIVersion): void {
    this.versions.set(version.version, version);
    this.versionStats.set(version.version, { requests: 0, lastUsed: new Date() });

    this.logger.logAuditEvent(
      'API_VERSION_ADDED',
      version.version,
      'SUCCESS',
      {
        version: version.version,
        releaseDate: version.releaseDate,
        deprecationDate: version.deprecationDate
      }
    );
  }

  public deprecateVersion(version: string, deprecationDate: Date, endOfLifeDate?: Date): void {
    const versionInfo = this.versions.get(version);
    
    if (versionInfo) {
      versionInfo.isDeprecated = true;
      versionInfo.deprecationDate = deprecationDate;
      if (endOfLifeDate) {
        versionInfo.endOfLifeDate = endOfLifeDate;
      }

      this.versions.set(version, versionInfo);

      this.logger.logAuditEvent(
        'API_VERSION_DEPRECATED',
        version,
        'SUCCESS',
        {
          version,
          deprecationDate,
          endOfLifeDate
        }
      );
    }
  }

  public retireVersion(version: string): void {
    const versionInfo = this.versions.get(version);
    
    if (versionInfo) {
      versionInfo.isSupported = false;
      this.versions.set(version, versionInfo);

      // Remove from supported versions
      this.config.supportedVersions = this.config.supportedVersions.filter(v => v !== version);

      this.logger.logAuditEvent(
        'API_VERSION_RETIRED',
        version,
        'SUCCESS',
        { version }
      );
    }
  }

  // Utility methods
  public getVersionInfo(version?: string): APIVersion | undefined {
    return this.versions.get(version || this.config.defaultVersion);
  }

  public getSupportedVersions(): string[] {
    return this.config.supportedVersions;
  }

  public getLatestVersion(): string {
    return this.config.supportedVersions[this.config.supportedVersions.length - 1];
  }

  public getVersionStats(): Map<string, { requests: number; lastUsed: Date }> {
    return new Map(this.versionStats);
  }

  public generateApiDocumentation(): any {
    const docs: any = {
      versions: {},
      supportedVersions: this.config.supportedVersions,
      defaultVersion: this.config.defaultVersion,
      deprecationPolicy: {
        minimumSupportPeriod: '12 months',
        deprecationWarningPeriod: '6 months'
      }
    };

    for (const [version, info] of this.versions.entries()) {
      docs.versions[version] = {
        releaseDate: info.releaseDate,
        deprecationDate: info.deprecationDate,
        endOfLifeDate: info.endOfLifeDate,
        isSupported: info.isSupported,
        isDeprecated: info.isDeprecated,
        migrationGuide: info.migrationGuide,
        breakingChanges: info.breaking_changes,
        newFeatures: info.new_features
      };
    }

    return docs;
  }

  // Private helper methods
  private updateVersionStats(version: string): void {
    const stats = this.versionStats.get(version);
    if (stats) {
      stats.requests += 1;
      stats.lastUsed = new Date();
      this.versionStats.set(version, stats);
    }
  }

  private async logVersionUsage(req: Request, version: string): Promise<void> {
    try {
      const auditService = getAuditService();
      await auditService.logAuditEvent(
        'API_VERSION_USED',
        'api_request',
        `${req.method}:${req.path}`,
        'READ',
        'SUCCESS',
        {
          userId: (req as any).user?.userId,
          ipAddress: req.ip,
          userAgent: req.get('User-Agent'),
          apiVersion: version,
          endpoint: req.path,
          method: req.method
        }
      );
    } catch (error) {
      this.logger.logError('Failed to log version usage', error);
    }
  }

  private findCompatibleVersion(requestedVersion: string, availableVersions: string[]): string | null {
    // Simple compatibility: try to find the highest compatible version
    const requestedMajor = parseInt(requestedVersion.replace('v', ''));
    const compatibleVersions = availableVersions
      .filter(v => parseInt(v.replace('v', '')) >= requestedMajor)
      .sort();

    return compatibleVersions.length > 0 ? compatibleVersions[0] : null;
  }

  private applyFieldMappings(data: any, mappings: { [oldField: string]: string }): void {
    if (!data || typeof data !== 'object') return;

    for (const [oldField, newField] of Object.entries(mappings)) {
      if (oldField in data) {
        data[newField] = data[oldField];
        delete data[oldField];
      }
    }

    // Recursively apply to nested objects
    for (const value of Object.values(data)) {
      if (typeof value === 'object' && value !== null) {
        this.applyFieldMappings(value, mappings);
      }
    }
  }

  private removeFields(data: any, fields: string[]): any {
    if (!data || typeof data !== 'object') return data;

    const cleaned = { ...data };
    
    for (const field of fields) {
      delete cleaned[field];
    }

    // Recursively remove from nested objects
    for (const [key, value] of Object.entries(cleaned)) {
      if (typeof value === 'object' && value !== null) {
        cleaned[key] = this.removeFields(value, fields);
      }
    }

    return cleaned;
  }
}

// Factory function to create version-specific handlers
export function createVersionedHandler(handlers: {
  [version: string]: (req: Request, res: Response, next: NextFunction) => void;
}): VersionedEndpoint['versions'] {
  const versionedHandlers: VersionedEndpoint['versions'] = {};
  
  for (const [version, handler] of Object.entries(handlers)) {
    versionedHandlers[version] = { handler };
  }
  
  return versionedHandlers;
}

// Singleton instance
let versionManager: APIVersionManager | null = null;

export function initializeVersionManager(config?: Partial<VersioningConfig>): APIVersionManager {
  if (versionManager) {
    throw new Error('Version manager already initialized');
  }
  
  versionManager = new APIVersionManager(config);
  return versionManager;
}

export function getVersionManager(): APIVersionManager {
  if (!versionManager) {
    throw new Error('Version manager not initialized. Call initializeVersionManager first.');
  }
  return versionManager;
}

export { APIVersion, VersionedEndpoint, VersioningConfig, CompatibilityRule };