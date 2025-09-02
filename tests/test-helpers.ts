/**
 * Shared test utilities for common patterns across test files
 * Reduces code duplication and standardizes test setup
 */

/**
 * Initializes a service with error handling and logging
 * Extracts repeated try-catch service initialization pattern
 * @param ServiceClass Constructor function for the service
 * @param serviceName Name for logging purposes
 * @returns Service instance or undefined if initialization failed
 */
export function initService<T>(ServiceClass: new () => T, serviceName: string): T | undefined {
  try {
    return new ServiceClass();
  } catch (e) {
    console.log(`${serviceName} not available:`, e.message);
    return undefined;
  }
}