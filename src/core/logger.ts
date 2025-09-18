/**
 * Standardized Logger Configuration
 * Provides consistent logging across the platform architecture
 */

import * as winston from 'winston';

export interface LoggerConfig {
  level: 'error' | 'warn' | 'info' | 'debug';
  enableConsole: boolean;
  enableFile: boolean;
  enableJson: boolean;
  logFilePath?: string;
  maxFiles?: number;
  maxSize?: string;
}

// Default logger configuration
const defaultLoggerConfig: LoggerConfig = {
  level: (process.env.LOG_LEVEL as any) || 'info',
  enableConsole: true,
  enableFile: process.env.NODE_ENV === 'production',
  enableJson: process.env.NODE_ENV === 'production',
  logFilePath: './logs/titan-grove.log',
  maxFiles: 5,
  maxSize: '20m',
};

/**
 * Create a standardized Winston logger instance
 */
export function createLogger(serviceName: string, config: Partial<LoggerConfig> = {}): winston.Logger {
  const loggerConfig = { ...defaultLoggerConfig, ...config };

  const logFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
    winston.format.printf(({ timestamp, level, message, service, ...meta }) => {
      const logEntry = {
        timestamp,
        level,
        service: service || serviceName,
        message,
        ...meta,
      };

      if (loggerConfig.enableJson) {
        return JSON.stringify(logEntry);
      } else {
        return `${timestamp} [${level.toUpperCase()}] [${logEntry.service}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
      }
    })
  );

  const transports: winston.transport[] = [];

  // Console transport
  if (loggerConfig.enableConsole) {
    transports.push(
      new winston.transports.Console({
        level: loggerConfig.level,
        format: loggerConfig.enableJson
          ? logFormat
          : winston.format.combine(
              winston.format.colorize(),
              winston.format.simple(),
              winston.format.printf(({ timestamp, level, message, service, ...meta }) => {
                return `${timestamp} [${level}] [${service || serviceName}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
              })
            ),
      })
    );
  }

  // File transport
  if (loggerConfig.enableFile && loggerConfig.logFilePath) {
    transports.push(
      new winston.transports.File({
        filename: loggerConfig.logFilePath,
        level: loggerConfig.level,
        format: logFormat,
        maxsize: parseInt(loggerConfig.maxSize?.replace('m', '') || '20') * 1024 * 1024,
        maxFiles: loggerConfig.maxFiles,
      })
    );
  }

  return winston.createLogger({
    level: loggerConfig.level,
    format: logFormat,
    defaultMeta: { service: serviceName },
    transports,
    exitOnError: false,
  });
}

// Global logger instances for common services
export const platformLogger = createLogger('platform');
export const authLogger = createLogger('authentication');
export const validationLogger = createLogger('validation');
export const businessLogger = createLogger('business-system');
export const customerLogger = createLogger('customer-system');
export const integrationLogger = createLogger('integration-layer');

// Default logger for general use
export const logger = platformLogger;

export default createLogger;
