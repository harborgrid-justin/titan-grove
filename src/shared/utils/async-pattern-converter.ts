/**
 * Async/Await Pattern Conversion Utilities - Enterprise Grade
 * Implements Fix 37: Async/await pattern conversions
 */

import { promisify } from 'util';
import { getLogger } from '../../utils/enterprise-logger';

interface CallbackFunction<T = any> {
  (...args: any[]): void;
}

interface AsyncConversionOptions {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

export class AsyncPatternConverter {
  private logger = getLogger('AsyncPatternConverter');

  /**
   * Convert callback-based function to Promise-based
   */
  public static promisifyCallback<T>(
    fn: Function,
    context?: any,
    options: AsyncConversionOptions = {}
  ): (...args: any[]) => Promise<T> {
    return async (...args: any[]): Promise<T> => {
      const { timeout = 30000, retries = 3, retryDelay = 1000 } = options;
      
      let lastError: any;
      
      for (let attempt = 0; attempt < retries; attempt++) {
        try {
          return await new Promise<T>((resolve, reject) => {
            const timeoutId = setTimeout(() => {
              reject(new Error(`Operation timed out after ${timeout}ms`));
            }, timeout);

            const callback = (error: any, result: T) => {
              clearTimeout(timeoutId);
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            };

            // Call the original function with callback
            if (context) {
              fn.call(context, ...args, callback);
            } else {
              fn(...args, callback);
            }
          });
        } catch (error) {
          lastError = error;
          
          if (attempt < retries - 1) {
            await new Promise(resolve => setTimeout(resolve, retryDelay));
          }
        }
      }
      
      throw lastError;
    };
  }

  /**
   * Convert EventEmitter pattern to Promise
   */
  public static eventToPromise<T>(
    emitter: any,
    successEvent: string,
    errorEvent: string = 'error',
    timeout: number = 30000
  ): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        cleanup();
        reject(new Error(`Event ${successEvent} not received within ${timeout}ms`));
      }, timeout);

      const cleanup = () => {
        clearTimeout(timeoutId);
        emitter.removeListener(successEvent, onSuccess);
        emitter.removeListener(errorEvent, onError);
      };

      const onSuccess = (result: T) => {
        cleanup();
        resolve(result);
      };

      const onError = (error: any) => {
        cleanup();
        reject(error);
      };

      emitter.once(successEvent, onSuccess);
      emitter.once(errorEvent, onError);
    });
  }

  /**
   * Convert stream operations to async/await
   */
  public static streamToPromise(stream: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];

      stream.on('data', (chunk: Buffer) => {
        chunks.push(chunk);
      });

      stream.on('end', () => {
        resolve(Buffer.concat(chunks));
      });

      stream.on('error', (error: any) => {
        reject(error);
      });
    });
  }

  /**
   * Batch process async operations with concurrency control
   */
  public static async batchProcess<T, R>(
    items: T[],
    processor: (item: T) => Promise<R>,
    options: {
      batchSize?: number;
      concurrency?: number;
      retries?: number;
    } = {}
  ): Promise<R[]> {
    const {
      batchSize = 10,
      concurrency = 3,
      retries = 3
    } = options;

    const results: R[] = [];
    const batches = this.chunkArray(items, batchSize);

    for (const batch of batches) {
      const batchPromises = batch.map(async (item) => {
        return this.retryAsync(() => processor(item), retries);
      });

      // Process batch with concurrency control
      const batchResults = await this.limitConcurrency(batchPromises, concurrency);
      results.push(...batchResults);
    }

    return results;
  }

  /**
   * Retry async operation with exponential backoff
   */
  public static async retryAsync<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    let lastError: any;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        if (attempt < maxRetries - 1) {
          const delay = baseDelay * Math.pow(2, attempt);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError;
  }

  /**
   * Execute promises with concurrency limit
   */
  public static async limitConcurrency<T>(
    promises: Promise<T>[],
    limit: number
  ): Promise<T[]> {
    const results: T[] = [];
    const executing: Promise<any>[] = [];

    for (let i = 0; i < promises.length; i++) {
      const promise = promises[i].then(result => {
        results[i] = result;
        return result;
      });

      executing.push(promise);

      if (executing.length >= limit) {
        await Promise.race(executing);
        executing.splice(executing.findIndex(p => p === promise), 1);
      }
    }

    await Promise.all(executing);
    return results;
  }

  /**
   * Convert callback-style database operations to async/await
   */
  public static promisifyDatabase(dbConnection: any): any {
    const promisifiedMethods: any = {};

    // Common database methods to promisify
    const methodsToPromisify = [
      'query',
      'execute',
      'connect',
      'disconnect',
      'beginTransaction',
      'commit',
      'rollback'
    ];

    for (const methodName of methodsToPromisify) {
      if (typeof dbConnection[methodName] === 'function') {
        promisifiedMethods[methodName] = promisify(dbConnection[methodName].bind(dbConnection));
      }
    }

    return {
      ...dbConnection,
      ...promisifiedMethods,
      
      // Add async transaction wrapper
      async transaction<T>(callback: (connection: any) => Promise<T>): Promise<T> {
        await promisifiedMethods.beginTransaction();
        try {
          const result = await callback(promisifiedMethods);
          await promisifiedMethods.commit();
          return result;
        } catch (error) {
          await promisifiedMethods.rollback();
          throw error;
        }
      }
    };
  }

  /**
   * Convert file system operations to async/await
   */
  public static promisifyFS(): any {
    const fs = require('fs');
    return {
      readFile: promisify(fs.readFile),
      writeFile: promisify(fs.writeFile),
      readdir: promisify(fs.readdir),
      stat: promisify(fs.stat),
      mkdir: promisify(fs.mkdir),
      rmdir: promisify(fs.rmdir),
      unlink: promisify(fs.unlink),
      access: promisify(fs.access),
      copyFile: promisify(fs.copyFile),
      rename: promisify(fs.rename)
    };
  }

  /**
   * Convert HTTP request libraries to async/await
   */
  public static promisifyHTTP(httpLib: any): any {
    return {
      get: promisify(httpLib.get.bind(httpLib)),
      post: promisify(httpLib.post.bind(httpLib)),
      put: promisify(httpLib.put.bind(httpLib)),
      delete: promisify(httpLib.delete.bind(httpLib)),
      patch: promisify(httpLib.patch.bind(httpLib)),
      head: promisify(httpLib.head.bind(httpLib)),
      options: promisify(httpLib.options.bind(httpLib))
    };
  }

  /**
   * Create async iterator from callback-based stream
   */
  public static async* streamToAsyncIterator<T>(stream: any): AsyncGenerator<T, void, unknown> {
    const readable = stream;
    let ended = false;
    let error: any = null;
    const chunks: T[] = [];
    let resolveNext: ((value: IteratorResult<T>) => void) | null = null;

    readable.on('data', (chunk: T) => {
      if (resolveNext) {
        const resolve = resolveNext;
        resolveNext = null;
        resolve({ value: chunk, done: false });
      } else {
        chunks.push(chunk);
      }
    });

    readable.on('end', () => {
      ended = true;
      if (resolveNext) {
        resolveNext({ value: undefined, done: true });
      }
    });

    readable.on('error', (err: any) => {
      error = err;
      if (resolveNext) {
        resolveNext({ value: undefined, done: true });
      }
    });

    while (!ended && !error) {
      if (chunks.length > 0) {
        yield chunks.shift()!;
      } else {
        const result = await new Promise<IteratorResult<T>>((resolve) => {
          resolveNext = resolve;
        });
        
        if (error) throw error;
        if (result.done) break;
        if (result.value !== undefined) yield result.value;
      }
    }

    if (error) throw error;
  }

  /**
   * Convert legacy require() to dynamic import()
   */
  public static async dynamicImport(modulePath: string): Promise<any> {
    try {
      // Handle both ES modules and CommonJS modules
      const module = await import(modulePath);
      
      // Return default export if available, otherwise return the module
      return module.default || module;
    } catch (error) {
      // Fallback to require for CommonJS modules that don't support import
      try {
        return require(modulePath);
      } catch (requireError) {
        throw new Error(`Failed to import module ${modulePath}: ${(error as Error).message}`);
      }
    }
  }

  /**
   * Utility method to chunk array
   */
  private static chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  /**
   * Convert setTimeout/setInterval to Promise-based
   */
  public static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Create cancellable timeout
   */
  public static createCancellableTimeout(ms: number): {
    promise: Promise<void>;
    cancel: () => void;
  } {
    let timeoutId: NodeJS.Timeout;
    let cancelled = false;

    const promise = new Promise<void>((resolve, reject) => {
      timeoutId = setTimeout(() => {
        if (!cancelled) {
          resolve();
        }
      }, ms);
    });

    const cancel = () => {
      cancelled = true;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };

    return { promise, cancel };
  }

  /**
   * Race multiple promises with timeout
   */
  public static async raceWithTimeout<T>(
    promises: Promise<T>[],
    timeoutMs: number
  ): Promise<T> {
    const timeoutPromise = new Promise<T>((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Operation timed out after ${timeoutMs}ms`));
      }, timeoutMs);
    });

    return Promise.race([...promises, timeoutPromise]);
  }

  /**
   * Execute promises in sequence (not parallel)
   */
  public static async sequence<T>(
    operations: Array<() => Promise<T>>
  ): Promise<T[]> {
    const results: T[] = [];
    
    for (const operation of operations) {
      const result = await operation();
      results.push(result);
    }
    
    return results;
  }

  /**
   * Convert legacy callback patterns commonly found in Node.js
   */
  public static convertLegacyPatterns(obj: any): any {
    const converted: any = {};

    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'function') {
        // Convert callback-style functions
        converted[key] = this.promisifyCallback(value as Function, obj);
        converted[`${key}Sync`] = value; // Keep sync version if needed
      } else {
        converted[key] = value;
      }
    }

    return converted;
  }
}

// Export utility functions
export const {
  promisifyCallback,
  eventToPromise,
  streamToPromise,
  batchProcess,
  retryAsync,
  limitConcurrency,
  promisifyDatabase,
  promisifyFS,
  promisifyHTTP,
  streamToAsyncIterator,
  dynamicImport,
  delay,
  createCancellableTimeout,
  raceWithTimeout,
  sequence,
  convertLegacyPatterns
} = AsyncPatternConverter;

// Common promisified utilities
export const fsAsync = AsyncPatternConverter.promisifyFS();

// Pre-configured common patterns
export const commonPatterns = {
  // Database transaction wrapper
  withTransaction: async <T>(
    connection: any,
    callback: (conn: any) => Promise<T>
  ): Promise<T> => {
    const promisedConn = AsyncPatternConverter.promisifyDatabase(connection);
    return promisedConn.transaction(callback);
  },

  // File operations with error handling
  safeFileOperation: async <T>(
    operation: () => Promise<T>,
    retries: number = 3
  ): Promise<T> => {
    return AsyncPatternConverter.retryAsync(operation, retries);
  },

  // HTTP request with timeout and retries
  resilientHTTPRequest: async (
    requestFn: () => Promise<any>,
    options: {
      timeout?: number;
      retries?: number;
    } = {}
  ): Promise<any> => {
    const { timeout = 30000, retries = 3 } = options;
    
    return AsyncPatternConverter.raceWithTimeout([
      AsyncPatternConverter.retryAsync(requestFn, retries)
    ], timeout);
  }
};

export { AsyncConversionOptions };