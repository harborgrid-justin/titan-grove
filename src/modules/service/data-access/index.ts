/**
 * Service Management Data Access Layer
 * Repository pattern implementation for service management entities
 */

// Placeholder for data access repositories
// In a full implementation, this would include:
// - TechnicianRepository
// - WorkOrderRepository  
// - InstallBaseRepository
// - ServiceContractRepository
// - etc.

export interface Repository<T> {
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  create(entity: T): Promise<T>;
  update(id: string, entity: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
}

// Future repository implementations would go here
export * from './repositories';