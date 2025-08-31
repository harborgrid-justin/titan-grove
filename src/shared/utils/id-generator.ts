/**
 * Shared ID Generation Utility
 * Provides consistent ID generation patterns across all modules
 */

/**
 * Generate a unique ID with a given prefix
 * @param prefix - The prefix for the ID (e.g., 'emp', 'asset', 'order')
 * @returns A unique ID string in format: prefix_timestamp_randomString
 */
export function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generate a unique number-based ID
 * @param prefix - The prefix for the ID (e.g., 'EMP', 'WO', 'INV')
 * @returns A unique ID string in format: prefixNumber
 */
export function generateNumericId(prefix: string): string {
  return `${prefix}${Date.now().toString().slice(-6)}`;
}

/**
 * Generate a UUID-style ID without external dependencies
 * @returns A UUID-like string
 */
export function generateUuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}