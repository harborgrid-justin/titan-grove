/**
 * Database Query Optimization System - Enterprise Grade
 * Implements Fix 31: Database query optimization
 */

import { getLogger } from '../../../utils/enterprise-logger';
import { getDatabasePool, QueryResult } from '../database-connection-pool';
import { getCacheManager } from '../../cache/enterprise-cache-manager';

interface QueryPlan {
  query: string;
  estimatedCost: number;
  estimatedRows: number;
  actualCost?: number;
  actualRows?: number;
  executionTime: number;
  indexUsage: string[];
  suggestions: string[];
}

interface QueryOptimizationConfig {
  enableQueryAnalysis: boolean;
  enableQueryCaching: boolean;
  enableIndexSuggestions: boolean;
  slowQueryThreshold: number; // in milliseconds
  enableQueryRewriting: boolean;
  cacheQueryPlans: boolean;
  maxQueryCacheSize: number;
}

interface IndexSuggestion {
  table: string;
  columns: string[];
  type: 'btree' | 'hash' | 'gin' | 'gist';
  estimatedImprovement: number;
  reason: string;
}

interface QueryStatistics {
  queryHash: string;
  query: string;
  totalExecutions: number;
  averageTime: number;
  minTime: number;
  maxTime: number;
  lastExecuted: Date;
  errorCount: number;
  cacheHits: number;
  cacheMisses: number;
}

export class DatabaseQueryOptimizer {
  private logger = getLogger('DatabaseQueryOptimizer');
  private config: QueryOptimizationConfig;
  private queryStats = new Map<string, QueryStatistics>();
  private queryPlanCache = new Map<string, QueryPlan>();
  private indexSuggestions = new Map<string, IndexSuggestion[]>();
  private rewriteRules = new Map<string, (query: string) => string>();

  constructor(config: Partial<QueryOptimizationConfig> = {}) {
    this.config = {
      enableQueryAnalysis: true,
      enableQueryCaching: true,
      enableIndexSuggestions: true,
      slowQueryThreshold: 1000, // 1 second
      enableQueryRewriting: true,
      cacheQueryPlans: true,
      maxQueryCacheSize: 1000,
      ...config
    };

    this.initializeRewriteRules();
    
    this.logger.logBusinessOperation(
      'QUERY_OPTIMIZER_INITIALIZED',
      'DatabaseQueryOptimizer',
      '',
      'SUCCESS',
      {
        slowQueryThreshold: this.config.slowQueryThreshold,
        enableQueryCaching: this.config.enableQueryCaching,
        enableIndexSuggestions: this.config.enableIndexSuggestions
      }
    );
  }

  private initializeRewriteRules(): void {
    // Common query optimization patterns
    this.rewriteRules.set('SELECT_COUNT_OPTIMIZATION', (query) => {
      // Optimize COUNT(*) queries
      return query.replace(
        /SELECT\s+COUNT\(\*\)\s+FROM\s+(\w+)\s*$/gi,
        'SELECT reltuples::bigint AS count FROM pg_class WHERE relname = \'$1\''
      );
    });

    this.rewriteRules.set('LIMIT_OFFSET_OPTIMIZATION', (query) => {
      // Optimize LIMIT/OFFSET with cursor-based pagination
      const limitOffsetPattern = /LIMIT\s+(\d+)\s+OFFSET\s+(\d+)/gi;
      if (limitOffsetPattern.test(query) && parseInt(RegExp.$2) > 1000) {
        // Suggest cursor-based pagination for large offsets
        this.logger.logBusinessOperation(
          'PAGINATION_OPTIMIZATION_SUGGESTION',
          'DatabaseQueryOptimizer',
          '',
          'WARNING',
          {
            query: query.substring(0, 100),
            offset: parseInt(RegExp.$2),
            suggestion: 'Consider cursor-based pagination for better performance'
          }
        );
      }
      return query;
    });

    this.rewriteRules.set('JOIN_ORDER_OPTIMIZATION', (query) => {
      // Basic JOIN order optimization
      return query.replace(
        /FROM\s+(\w+)\s+JOIN\s+(\w+)/gi,
        (match, table1, table2) => {
          // This is a simplified example - real optimization would analyze table sizes
          return `FROM ${table1} JOIN ${table2}`;
        }
      );
    });
  }

  // Main optimization method
  public async optimizeAndExecute<T = any>(
    query: string,
    params: any[] = [],
    userId?: string,
    options: {
      skipCache?: boolean;
      forceAnalyze?: boolean;
      timeout?: number;
    } = {}
  ): Promise<QueryResult<T>> {
    const startTime = Date.now();
    const queryHash = this.hashQuery(query, params);

    try {
      // Check cache first if enabled
      if (this.config.enableQueryCaching && !options.skipCache) {
        const cachedResult = await this.getCachedResult<T>(queryHash);
        if (cachedResult) {
          this.updateQueryStats(queryHash, query, Date.now() - startTime, true);
          return cachedResult;
        }
      }

      // Analyze and optimize query if enabled
      let optimizedQuery = query;
      if (this.config.enableQueryAnalysis || options.forceAnalyze) {
        optimizedQuery = await this.analyzeAndOptimizeQuery(query, params);
      }

      // Execute the query
      const dbPool = getDatabasePool();
      const result = await dbPool.query<T>(optimizedQuery, params, userId);

      const executionTime = Date.now() - startTime;

      // Update statistics
      this.updateQueryStats(queryHash, query, executionTime, false);

      // Log slow queries
      if (executionTime > this.config.slowQueryThreshold) {
        await this.logSlowQuery(query, params, executionTime, userId);
      }

      // Cache result if it's a SELECT query and caching is enabled
      if (this.config.enableQueryCaching && this.isSelectQuery(query)) {
        await this.cacheResult(queryHash, result, this.calculateCacheTTL(query));
      }

      // Generate index suggestions for slow queries
      if (this.config.enableIndexSuggestions && executionTime > this.config.slowQueryThreshold) {
        await this.generateIndexSuggestions(query, executionTime);
      }

      return result;

    } catch (error) {
      this.updateQueryStats(queryHash, query, Date.now() - startTime, false, true);
      this.logger.logError('Query optimization and execution failed', error, {
        query: query.substring(0, 200),
        params: params.length,
        userId
      });
      throw error;
    }
  }

  // Query analysis and optimization
  private async analyzeAndOptimizeQuery(query: string, params: any[]): Promise<string> {
    try {
      let optimizedQuery = query;

      // Apply rewrite rules if enabled
      if (this.config.enableQueryRewriting) {
        for (const [ruleName, rule] of this.rewriteRules.entries()) {
          const newQuery = rule(optimizedQuery);
          if (newQuery !== optimizedQuery) {
            this.logger.logBusinessOperation(
              'QUERY_REWRITE_APPLIED',
              'DatabaseQueryOptimizer',
              ruleName,
              'SUCCESS',
              {
                original: optimizedQuery.substring(0, 100),
                rewritten: newQuery.substring(0, 100)
              }
            );
            optimizedQuery = newQuery;
          }
        }
      }

      // Get query plan if caching is enabled
      if (this.config.cacheQueryPlans) {
        const planCacheKey = this.hashQuery(optimizedQuery, params);
        let queryPlan = this.queryPlanCache.get(planCacheKey);

        if (!queryPlan) {
          queryPlan = await this.getQueryPlan(optimizedQuery, params);
          this.queryPlanCache.set(planCacheKey, queryPlan);

          // Limit cache size
          if (this.queryPlanCache.size > this.config.maxQueryCacheSize) {
            const oldestKey = this.queryPlanCache.keys().next().value;
            this.queryPlanCache.delete(oldestKey);
          }
        }

        // Log optimization suggestions
        if (queryPlan.suggestions.length > 0) {
          this.logger.logBusinessOperation(
            'QUERY_OPTIMIZATION_SUGGESTIONS',
            'DatabaseQueryOptimizer',
            '',
            'INFO',
            {
              query: optimizedQuery.substring(0, 100),
              estimatedCost: queryPlan.estimatedCost,
              suggestions: queryPlan.suggestions
            }
          );
        }
      }

      return optimizedQuery;

    } catch (error) {
      this.logger.logError('Query analysis failed', error, {
        query: query.substring(0, 200)
      });
      return query; // Return original query on analysis failure
    }
  }

  private async getQueryPlan(query: string, params: any[]): Promise<QueryPlan> {
    try {
      const dbPool = getDatabasePool();
      const explainQuery = `EXPLAIN (FORMAT JSON, ANALYZE false, BUFFERS false) ${query}`;
      
      const result = await dbPool.query(explainQuery, params);
      const planData = result.rows[0]['QUERY PLAN'][0];

      const suggestions: string[] = [];
      const indexUsage: string[] = [];

      // Analyze plan for optimization opportunities
      this.analyzePlanNode(planData, suggestions, indexUsage);

      return {
        query: query.substring(0, 500),
        estimatedCost: planData['Total Cost'] || 0,
        estimatedRows: planData['Plan Rows'] || 0,
        executionTime: 0,
        indexUsage,
        suggestions
      };

    } catch (error) {
      this.logger.logError('Failed to get query plan', error);
      return {
        query: query.substring(0, 500),
        estimatedCost: 0,
        estimatedRows: 0,
        executionTime: 0,
        indexUsage: [],
        suggestions: ['Unable to analyze query plan']
      };
    }
  }

  private analyzePlanNode(node: any, suggestions: string[], indexUsage: string[], depth = 0): void {
    if (!node) return;

    const nodeType = node['Node Type'];
    
    // Track index usage
    if (nodeType === 'Index Scan' || nodeType === 'Index Only Scan') {
      indexUsage.push(node['Index Name'] || 'unknown');
    }

    // Identify optimization opportunities
    if (nodeType === 'Seq Scan' && node['Total Cost'] > 1000) {
      suggestions.push(`Consider adding index for table: ${node['Relation Name']}`);
    }

    if (nodeType === 'Hash Join' && node['Total Cost'] > 10000) {
      suggestions.push('Large hash join detected - consider query restructuring');
    }

    if (nodeType === 'Sort' && node['Total Cost'] > 1000) {
      suggestions.push('Expensive sort operation - consider adding index for ORDER BY clause');
    }

    if (nodeType === 'Nested Loop' && node['Plan Rows'] > 1000) {
      suggestions.push('Large nested loop - consider using hash or merge join');
    }

    // Recursively analyze child nodes
    if (node['Plans']) {
      for (const childNode of node['Plans']) {
        this.analyzePlanNode(childNode, suggestions, indexUsage, depth + 1);
      }
    }
  }

  // Query caching
  private async getCachedResult<T>(queryHash: string): Promise<QueryResult<T> | null> {
    try {
      const cacheManager = getCacheManager();
      const cached = await cacheManager.get<QueryResult<T>>(`query:${queryHash}`);
      return cached;
    } catch (error) {
      this.logger.logError('Cache retrieval failed', error, { queryHash });
      return null;
    }
  }

  private async cacheResult<T>(queryHash: string, result: QueryResult<T>, ttl: number): Promise<void> {
    try {
      const cacheManager = getCacheManager();
      await cacheManager.set(`query:${queryHash}`, result, ttl, ['query_cache']);
    } catch (error) {
      this.logger.logError('Cache storage failed', error, { queryHash });
    }
  }

  // Index suggestions
  private async generateIndexSuggestions(query: string, executionTime: number): Promise<void> {
    try {
      const suggestions: IndexSuggestion[] = [];
      
      // Extract table and column information from query
      const tables = this.extractTables(query);
      const whereColumns = this.extractWhereColumns(query);
      const joinColumns = this.extractJoinColumns(query);
      const orderByColumns = this.extractOrderByColumns(query);

      // Generate suggestions for WHERE clause columns
      for (const column of whereColumns) {
        suggestions.push({
          table: column.table,
          columns: [column.column],
          type: 'btree',
          estimatedImprovement: this.estimateIndexImprovement(executionTime),
          reason: 'Frequent filtering on this column'
        });
      }

      // Generate suggestions for JOIN columns
      for (const column of joinColumns) {
        suggestions.push({
          table: column.table,
          columns: [column.column],
          type: 'btree',
          estimatedImprovement: this.estimateIndexImprovement(executionTime, 0.6),
          reason: 'Join performance optimization'
        });
      }

      // Generate suggestions for ORDER BY columns
      if (orderByColumns.length > 0) {
        const table = orderByColumns[0].table;
        const columns = orderByColumns.map(c => c.column);
        
        suggestions.push({
          table,
          columns,
          type: 'btree',
          estimatedImprovement: this.estimateIndexImprovement(executionTime, 0.4),
          reason: 'Sort performance optimization'
        });
      }

      // Store suggestions
      if (suggestions.length > 0) {
        for (const table of tables) {
          const existingSuggestions = this.indexSuggestions.get(table) || [];
          const newSuggestions = suggestions.filter(s => s.table === table);
          this.indexSuggestions.set(table, [...existingSuggestions, ...newSuggestions]);
        }

        this.logger.logBusinessOperation(
          'INDEX_SUGGESTIONS_GENERATED',
          'DatabaseQueryOptimizer',
          '',
          'INFO',
          {
            query: query.substring(0, 100),
            executionTime,
            suggestionsCount: suggestions.length,
            tables
          }
        );
      }

    } catch (error) {
      this.logger.logError('Index suggestion generation failed', error);
    }
  }

  // Statistics and reporting
  public getQueryStatistics(): QueryStatistics[] {
    return Array.from(this.queryStats.values())
      .sort((a, b) => b.averageTime - a.averageTime);
  }

  public getSlowQueries(threshold?: number): QueryStatistics[] {
    const slowThreshold = threshold || this.config.slowQueryThreshold;
    return this.getQueryStatistics()
      .filter(stat => stat.averageTime > slowThreshold);
  }

  public getIndexSuggestions(): Map<string, IndexSuggestion[]> {
    return new Map(this.indexSuggestions);
  }

  public async generateOptimizationReport(): Promise<any> {
    const stats = this.getQueryStatistics();
    const slowQueries = this.getSlowQueries();
    const indexSuggestions = Array.from(this.indexSuggestions.entries());

    const report = {
      summary: {
        totalQueries: stats.length,
        slowQueries: slowQueries.length,
        averageExecutionTime: stats.reduce((sum, s) => sum + s.averageTime, 0) / stats.length,
        cacheHitRate: stats.reduce((sum, s) => sum + s.cacheHits, 0) / 
                     Math.max(1, stats.reduce((sum, s) => sum + s.cacheHits + s.cacheMisses, 0)),
        totalIndexSuggestions: indexSuggestions.reduce((sum, [_, suggestions]) => sum + suggestions.length, 0)
      },
      slowQueries: slowQueries.slice(0, 10).map(query => ({
        query: query.query.substring(0, 200),
        averageTime: query.averageTime,
        totalExecutions: query.totalExecutions,
        maxTime: query.maxTime
      })),
      indexSuggestions: indexSuggestions.slice(0, 10).map(([table, suggestions]) => ({
        table,
        suggestions: suggestions.slice(0, 5).map(s => ({
          columns: s.columns,
          type: s.type,
          estimatedImprovement: s.estimatedImprovement,
          reason: s.reason
        }))
      })),
      optimizationOpportunities: this.identifyOptimizationOpportunities(stats)
    };

    this.logger.logBusinessOperation(
      'OPTIMIZATION_REPORT_GENERATED',
      'DatabaseQueryOptimizer',
      '',
      'SUCCESS',
      {
        totalQueries: report.summary.totalQueries,
        slowQueries: report.summary.slowQueries,
        cacheHitRate: report.summary.cacheHitRate
      }
    );

    return report;
  }

  // Utility methods
  private hashQuery(query: string, params: any[]): string {
    const crypto = require('crypto');
    const normalizedQuery = query.trim().toLowerCase().replace(/\s+/g, ' ');
    const input = `${normalizedQuery}${JSON.stringify(params)}`;
    return crypto.createHash('sha256').update(input).digest('hex').substring(0, 16);
  }

  private updateQueryStats(
    queryHash: string,
    query: string,
    executionTime: number,
    cacheHit: boolean,
    error = false
  ): void {
    let stats = this.queryStats.get(queryHash);
    
    if (!stats) {
      stats = {
        queryHash,
        query: query.substring(0, 500),
        totalExecutions: 0,
        averageTime: 0,
        minTime: executionTime,
        maxTime: executionTime,
        lastExecuted: new Date(),
        errorCount: 0,
        cacheHits: 0,
        cacheMisses: 0
      };
    }

    stats.totalExecutions++;
    stats.lastExecuted = new Date();
    
    if (error) {
      stats.errorCount++;
    } else {
      // Update timing statistics
      stats.averageTime = (stats.averageTime * (stats.totalExecutions - 1) + executionTime) / stats.totalExecutions;
      stats.minTime = Math.min(stats.minTime, executionTime);
      stats.maxTime = Math.max(stats.maxTime, executionTime);
      
      // Update cache statistics
      if (cacheHit) {
        stats.cacheHits++;
      } else {
        stats.cacheMisses++;
      }
    }

    this.queryStats.set(queryHash, stats);
  }

  private async logSlowQuery(
    query: string,
    params: any[],
    executionTime: number,
    userId?: string
  ): Promise<void> {
    this.logger.logBusinessOperation(
      'SLOW_QUERY_DETECTED',
      'DatabaseQueryOptimizer',
      '',
      'WARNING',
      {
        query: query.substring(0, 300),
        executionTime,
        paramCount: params.length,
        userId,
        threshold: this.config.slowQueryThreshold
      }
    );
  }

  private isSelectQuery(query: string): boolean {
    return query.trim().toLowerCase().startsWith('select');
  }

  private calculateCacheTTL(query: string): number {
    // Base TTL of 5 minutes
    let ttl = 300;

    // Longer TTL for configuration/lookup queries
    if (query.toLowerCase().includes('config') || query.toLowerCase().includes('lookup')) {
      ttl = 3600; // 1 hour
    }

    // Shorter TTL for user-specific queries
    if (query.toLowerCase().includes('user') || query.toLowerCase().includes('session')) {
      ttl = 300; // 5 minutes
    }

    // Very short TTL for transactional data
    if (query.toLowerCase().includes('order') || query.toLowerCase().includes('payment')) {
      ttl = 60; // 1 minute
    }

    return ttl;
  }

  private extractTables(query: string): string[] {
    const tables: string[] = [];
    const fromMatch = query.match(/FROM\s+(\w+)/gi);
    const joinMatches = query.match(/JOIN\s+(\w+)/gi);

    if (fromMatch) {
      tables.push(...fromMatch.map(match => match.replace(/FROM\s+/gi, '')));
    }

    if (joinMatches) {
      tables.push(...joinMatches.map(match => match.replace(/JOIN\s+/gi, '')));
    }

    return [...new Set(tables)]; // Remove duplicates
  }

  private extractWhereColumns(query: string): Array<{ table: string; column: string }> {
    const columns: Array<{ table: string; column: string }> = [];
    const whereClause = query.match(/WHERE\s+(.+?)(?:\s+ORDER\s+BY|\s+GROUP\s+BY|\s+LIMIT|$)/i);
    
    if (whereClause) {
      const conditions = whereClause[1];
      const columnMatches = conditions.match(/(\w+\.)?(\w+)\s*[=<>!]/g);
      
      if (columnMatches) {
        for (const match of columnMatches) {
          const [table, column] = match.replace(/\s*[=<>!].*$/, '').split('.');
          columns.push({
            table: column ? table : 'unknown',
            column: column || table
          });
        }
      }
    }

    return columns;
  }

  private extractJoinColumns(query: string): Array<{ table: string; column: string }> {
    const columns: Array<{ table: string; column: string }> = [];
    const joinMatches = query.match(/JOIN\s+\w+\s+ON\s+(\w+\.)?(\w+)\s*=\s*(\w+\.)?(\w+)/gi);
    
    if (joinMatches) {
      for (const match of joinMatches) {
        const onClause = match.match(/ON\s+(\w+\.)?(\w+)\s*=\s*(\w+\.)?(\w+)/i);
        if (onClause) {
          const [, table1, column1, table2, column2] = onClause;
          columns.push(
            { table: table1 || 'unknown', column: column1 },
            { table: table2 || 'unknown', column: column2 }
          );
        }
      }
    }

    return columns;
  }

  private extractOrderByColumns(query: string): Array<{ table: string; column: string }> {
    const columns: Array<{ table: string; column: string }> = [];
    const orderByMatch = query.match(/ORDER\s+BY\s+(.+?)(?:\s+LIMIT|$)/i);
    
    if (orderByMatch) {
      const orderByClause = orderByMatch[1];
      const columnMatches = orderByClause.match(/(\w+\.)?(\w+)/g);
      
      if (columnMatches) {
        for (const match of columnMatches) {
          const [table, column] = match.split('.');
          columns.push({
            table: column ? table : 'unknown',
            column: column || table
          });
        }
      }
    }

    return columns;
  }

  private estimateIndexImprovement(executionTime: number, factor = 0.7): number {
    return Math.round(executionTime * factor);
  }

  private identifyOptimizationOpportunities(stats: QueryStatistics[]): string[] {
    const opportunities: string[] = [];

    // High cache miss ratio
    const totalCacheRequests = stats.reduce((sum, s) => sum + s.cacheHits + s.cacheMisses, 0);
    const cacheHitRate = stats.reduce((sum, s) => sum + s.cacheHits, 0) / Math.max(1, totalCacheRequests);
    
    if (cacheHitRate < 0.5) {
      opportunities.push('Low cache hit rate - review caching strategy');
    }

    // Frequent slow queries
    const slowQueries = this.getSlowQueries();
    if (slowQueries.length > 10) {
      opportunities.push('Multiple slow queries detected - review query performance');
    }

    // High error rates
    const totalErrors = stats.reduce((sum, s) => sum + s.errorCount, 0);
    const totalQueries = stats.reduce((sum, s) => sum + s.totalExecutions, 0);
    const errorRate = totalErrors / Math.max(1, totalQueries);
    
    if (errorRate > 0.05) {
      opportunities.push('High query error rate - review query reliability');
    }

    return opportunities;
  }

  public async shutdown(): Promise<void> {
    // Clear caches and statistics
    this.queryStats.clear();
    this.queryPlanCache.clear();
    this.indexSuggestions.clear();

    this.logger.logBusinessOperation(
      'QUERY_OPTIMIZER_SHUTDOWN',
      'DatabaseQueryOptimizer',
      '',
      'SUCCESS'
    );
  }
}

// Singleton instance
let queryOptimizer: DatabaseQueryOptimizer | null = null;

export function initializeQueryOptimizer(config?: Partial<QueryOptimizationConfig>): DatabaseQueryOptimizer {
  if (queryOptimizer) {
    throw new Error('Query optimizer already initialized');
  }
  
  queryOptimizer = new DatabaseQueryOptimizer(config);
  return queryOptimizer;
}

export function getQueryOptimizer(): DatabaseQueryOptimizer {
  if (!queryOptimizer) {
    throw new Error('Query optimizer not initialized. Call initializeQueryOptimizer first.');
  }
  return queryOptimizer;
}

export { QueryPlan, QueryOptimizationConfig, IndexSuggestion, QueryStatistics };