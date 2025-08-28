export interface DatabaseConfig {
  type: 'postgresql' | 'mysql' | 'sqlite' | 'mongodb' | 'redis';
  host?: string;
  port?: number;
  database?: string;
  username?: string;
  password?: string;
  url?: string;
  ssl?: boolean | object;
  pool?: {
    min: number;
    max: number;
    idleTimeout: number;
  };
  migrations?: {
    directory: string;
    tableName: string;
  };
}

export interface ServerConfig {
  port: number;
  host: string;
  cors?: {
    origin: string | string[] | boolean;
    credentials?: boolean;
  };
  rateLimit?: {
    windowMs: number;
    max: number;
  };
  compression?: boolean;
  security?: {
    helmet?: boolean;
    jwt?: {
      secret: string;
      expiresIn: string;
    };
  };
}

export interface CacheConfig {
  type: 'memory' | 'redis' | 'memcached';
  host?: string;
  port?: number;
  ttl?: number;
  maxKeys?: number;
}

export interface AnalyticsConfig {
  enabled: boolean;
  elasticsearch?: {
    host: string;
    port: number;
    index: string;
  };
  metrics?: {
    enabled: boolean;
    interval: number;
  };
}

export interface ClusterConfig {
  enabled: boolean;
  workers?: number;
  gracefulTimeout?: number;
}

export interface TitanConfig {
  database: DatabaseConfig;
  server: ServerConfig;
  cache?: CacheConfig;
  analytics?: AnalyticsConfig;
  cluster?: ClusterConfig;
  logging?: {
    level: 'error' | 'warn' | 'info' | 'debug';
    format: 'json' | 'simple';
  };
}

export interface QueryOptions {
  select?: string[] | string;
  where?: Record<string, any>;
  orderBy?: Record<string, 'asc' | 'desc'> | string;
  limit?: number;
  offset?: number;
  join?: Array<{
    table: string;
    on: string;
    type?: 'inner' | 'left' | 'right' | 'full';
  }>;
}

export interface QueryResult<T = any> {
  data: T[];
  count: number;
  hasMore: boolean;
  executionTime: number;
}

export interface ConnectionPool {
  acquire(): Promise<any>;
  release(connection: any): void;
  destroy(): Promise<void>;
  size(): number;
  available(): number;
}

export interface Transaction {
  id: string;
  commit(): Promise<void>;
  rollback(): Promise<void>;
  query(sql: string, params?: any[]): Promise<QueryResult>;
}

export interface DatabaseDriver {
  connect(config: DatabaseConfig): Promise<void>;
  disconnect(): Promise<void>;
  query(sql: string, params?: any[]): Promise<QueryResult>;
  transaction(): Promise<Transaction>;
  migrate(): Promise<void>;
  seed(): Promise<void>;
}

export interface CacheDriver {
  get(key: string): Promise<any>;
  set(key: string, value: any, ttl?: number): Promise<void>;
  del(key: string): Promise<void>;
  clear(): Promise<void>;
  keys(pattern?: string): Promise<string[]>;
}

export interface AnalyticsEvent {
  type: string;
  timestamp: Date;
  userId?: string;
  sessionId?: string;
  data: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface MetricData {
  name: string;
  value: number;
  timestamp: Date;
  tags?: Record<string, string>;
}

export interface SecurityContext {
  user?: {
    id: string;
    username: string;
    roles: string[];
    permissions: string[];
  };
  session?: {
    id: string;
    ip: string;
    userAgent: string;
  };
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    executionTime?: number;
  };
}

export interface HealthCheck {
  service: string;
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: Date;
  details?: Record<string, any>;
}
