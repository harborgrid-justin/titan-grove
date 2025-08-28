import winston, { Logger, format } from 'winston';

export function createLogger(config?: { level?: string; format?: string }): Logger {
  const logLevel = config?.level || 'info';
  const logFormat = config?.format || 'simple';

  const formats = [format.timestamp(), format.errors({ stack: true })];

  if (logFormat === 'json') {
    formats.push(format.json());
  } else {
    formats.push(
      format.colorize(),
      format.simple(),
      format.printf(({ timestamp, level, message, ...meta }) => {
        return `${timestamp} [${level}]: ${message} ${
          Object.keys(meta).length ? JSON.stringify(meta) : ''
        }`;
      })
    );
  }

  const logger = winston.createLogger({
    level: logLevel,
    format: format.combine(...formats),
    transports: [
      new winston.transports.Console({
        handleExceptions: true,
        handleRejections: true,
      }),
      new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
        handleExceptions: true,
        handleRejections: true,
      }),
      new winston.transports.File({
        filename: 'logs/combined.log',
        handleExceptions: true,
        handleRejections: true,
      }),
    ],
    exitOnError: false,
  });

  return logger;
}
