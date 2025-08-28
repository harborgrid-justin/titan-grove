// Global test setup
import 'dotenv/config';

// Set test environment
process.env.NODE_ENV = 'test';

// Configure test database
process.env.DB_TYPE = 'sqlite';
process.env.DB_NAME = ':memory:';

// Disable analytics in tests
process.env.ANALYTICS_ENABLED = 'false';

// Set short JWT expiry for tests
process.env.JWT_SECRET = 'test-secret-key';

// Mock console methods to reduce test noise
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};