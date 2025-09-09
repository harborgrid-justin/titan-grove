/**
 * Platform Configuration Management
 * Centralizes all configuration values to eliminate hardcoded magic numbers
 */

export interface PlatformThresholds {
  // Health monitoring thresholds
  health: {
    business: {
      maxFailuresForWarning: number;
      maxFailuresForViolation: number;
    };
    customer: {
      maxResponseTimeForDegraded: number;
      maxResponseTimeForUnhealthy: number;
      minCacheHitRateForDegraded: number;
      minCacheHitRateForUnhealthy: number;
    };
  };
  
  // Memory management limits
  memory: {
    audit: {
      maxLogEntries: number;
      cleanupBatchSize: number;
    };
    interactions: {
      maxInteractionEntries: number;
      cleanupBatchSize: number;
    };
    cache: {
      defaultTTL: number;
      cleanupInterval: number;
    };
  };
  
  // Performance thresholds
  performance: {
    responseTime: {
      warningThreshold: number;
      errorThreshold: number;
    };
    errorRate: {
      warningThreshold: number;
      errorThreshold: number;
    };
  };
  
  // Security and compliance
  security: {
    rateLimit: {
      defaultRequestsPerMinute: number;
      rateLimitWindow: number;
    };
    authentication: {
      jwtExpiresIn: string;
      refreshTokenExpiresIn: string;
    };
  };
  
  // Integration settings
  integration: {
    circuitBreaker: {
      defaultThreshold: number;
      timeoutMs: number;
    };
    retry: {
      maxAttempts: number;
      delayMs: number;
    };
  };
}

// Default production-ready configuration
const defaultThresholds: PlatformThresholds = {
  health: {
    business: {
      maxFailuresForWarning: 5,
      maxFailuresForViolation: 10
    },
    customer: {
      maxResponseTimeForDegraded: 2000,
      maxResponseTimeForUnhealthy: 5000,
      minCacheHitRateForDegraded: 0.6,
      minCacheHitRateForUnhealthy: 0.3
    }
  },
  
  memory: {
    audit: {
      maxLogEntries: 10000,
      cleanupBatchSize: 1000
    },
    interactions: {
      maxInteractionEntries: 50000,
      cleanupBatchSize: 10000
    },
    cache: {
      defaultTTL: 300, // 5 minutes
      cleanupInterval: 60000 // 1 minute
    }
  },
  
  performance: {
    responseTime: {
      warningThreshold: 2000,
      errorThreshold: 5000
    },
    errorRate: {
      warningThreshold: 0.05, // 5%
      errorThreshold: 0.1 // 10%
    }
  },
  
  security: {
    rateLimit: {
      defaultRequestsPerMinute: 100,
      rateLimitWindow: 60000 // 1 minute
    },
    authentication: {
      jwtExpiresIn: '24h',
      refreshTokenExpiresIn: '7d'
    }
  },
  
  integration: {
    circuitBreaker: {
      defaultThreshold: 5,
      timeoutMs: 60000 // 1 minute
    },
    retry: {
      maxAttempts: 3,
      delayMs: 1000
    }
  }
};

// Environment-specific overrides (using deep merge to override only specific values)
const environmentOverrides: { [env: string]: any } = {
  development: {
    memory: {
      audit: {
        maxLogEntries: 1000,
        cleanupBatchSize: 100
      },
      interactions: {
        maxInteractionEntries: 5000,
        cleanupBatchSize: 1000
      }
    },
    security: {
      rateLimit: {
        defaultRequestsPerMinute: 1000 // More lenient for development
      }
    }
  },
  
  test: {
    memory: {
      audit: {
        maxLogEntries: 100,
        cleanupBatchSize: 10
      },
      interactions: {
        maxInteractionEntries: 500,
        cleanupBatchSize: 100
      }
    },
    performance: {
      responseTime: {
        warningThreshold: 1000,
        errorThreshold: 2000
      }
    }
  },
  
  production: {
    memory: {
      audit: {
        maxLogEntries: 50000,
        cleanupBatchSize: 5000
      },
      interactions: {
        maxInteractionEntries: 100000,
        cleanupBatchSize: 20000
      }
    },
    performance: {
      responseTime: {
        warningThreshold: 1500,
        errorThreshold: 3000
      }
    }
  }
};

/**
 * Get platform configuration with environment-specific overrides
 */
export function getPlatformConfig(environment?: string): PlatformThresholds {
  const env = environment || process.env.NODE_ENV || 'development';
  const overrides = environmentOverrides[env] || {};
  
  return mergeDeep(defaultThresholds, overrides);
}

/**
 * Deep merge configuration objects
 */
function mergeDeep<T>(target: T, source: any): T {
  const result = { ...target };
  
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = mergeDeep(target[key], source[key]);
    } else if (source[key] !== undefined) {
      result[key] = source[key];
    }
  }
  
  return result;
}

// Export default configuration
export const platformConfig = getPlatformConfig();

// Export specific configuration sections for easy access
export const healthThresholds = platformConfig.health;
export const memoryLimits = platformConfig.memory;
export const performanceThresholds = platformConfig.performance;
export const securityConfig = platformConfig.security;
export const integrationConfig = platformConfig.integration;