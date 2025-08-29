import { TitanGrove } from '../src/core/TitanGrove';
import { validateConfig } from '../src/utils/config';

describe('TitanGrove Core', () => {
  describe('Configuration Validation', () => {
    test('should validate minimal configuration', () => {
      const config = {
        database: {
          type: 'sqlite' as const,
          database: ':memory:',
        },
        server: {
          port: 3000,
          host: 'localhost',
          security: {
            jwt: {
              secret: 'test-secret',
            },
          },
        },
      };

      expect(() => validateConfig(config)).not.toThrow();
    });

    test('should reject invalid database type', () => {
      const config = {
        database: {
          type: 'invalid' as any,
          database: 'test',
        },
        server: {
          port: 3000,
          host: 'localhost',
        },
      };

      expect(() => validateConfig(config)).toThrow();
    });

    test('should set default values', () => {
      const config = {
        database: {
          type: 'sqlite' as const,
          database: ':memory:',
        },
        server: {
          port: 3000,
          host: 'localhost',
          security: {
            jwt: {
              secret: 'test-secret',
            },
          },
        },
      };

      const validated = validateConfig(config);
      
      expect(validated.server.cors).toBeDefined();
      expect(validated.server.rateLimit).toBeDefined();
      expect(validated.database.pool).toBeDefined();
    });
  });

  describe('TitanGrove Instance', () => {
    let titan: TitanGrove;
    
    beforeEach(() => {
      const config = {
        database: {
          type: 'sqlite' as const,
          database: ':memory:',
        },
        server: {
          port: 3001, // Use different port for tests
          host: 'localhost',
          security: {
            jwt: {
              secret: 'test-secret',
              expiresIn: '1h',
            },
          },
        },
      };

      titan = new TitanGrove(config);
    });

    afterEach(async () => {
      if (titan.isStarted) {
        await titan.stop();
      }
    });

    test('should create TitanGrove instance', () => {
      expect(titan).toBeDefined();
      expect(titan.isInitialized).toBe(false);
      expect(titan.isStarted).toBe(false);
    });

    test('should have version property', () => {
      expect(titan.version).toBeDefined();
      expect(typeof titan.version).toBe('string');
    });

    test('should provide access to managers', () => {
      expect(titan.database).toBeDefined();
      expect(titan.server).toBeDefined();
      expect(titan.security).toBeDefined();
    });

    test('should initialize successfully', async () => {
      await titan.initialize();
      expect(titan.isInitialized).toBe(true);
    }, 10000);

    test('should start and stop successfully', async () => {
      await titan.start();
      expect(titan.isStarted).toBe(true);
      
      await titan.stop();
      expect(titan.isStarted).toBe(false);
    }, 15000);

    test('should perform health checks', async () => {
      await titan.initialize();
      
      const healthChecks = await titan.healthCheck();
      expect(Array.isArray(healthChecks)).toBe(true);
      expect(healthChecks.length).toBeGreaterThan(0);
      
      healthChecks.forEach(check => {
        expect(check).toHaveProperty('service');
        expect(check).toHaveProperty('status');
        expect(check).toHaveProperty('timestamp');
      });
    });
  });
});