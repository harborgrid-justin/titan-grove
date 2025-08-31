/**
 * Standard Data Access Layer Template
 * Provides consistent repository patterns across all modules
 */

/**
 * Base Repository Interface
 * All module repositories should implement this interface
 */
export interface BaseRepository<T> {
  create(entity: Omit<T, 'id'>): Promise<T>;
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  update(id: string, updates: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<void>;
}

/**
 * Search and Filter Interface
 * For repositories that support advanced querying
 */
export interface SearchableRepository<T> extends BaseRepository<T> {
  search(criteria: Record<string, any>): Promise<T[]>;
  findBy(field: keyof T, value: any): Promise<T[]>;
}

/**
 * Base Repository Implementation
 * Provides common repository functionality
 */
export abstract class BaseRepositoryImpl<T extends { id: string }> implements BaseRepository<T> {
  protected items: T[] = [];

  async create(entity: Omit<T, 'id'>): Promise<T> {
    const id = this.generateId();
    const newItem = { ...entity, id } as T;
    this.items.push(newItem);
    return newItem;
  }

  async findById(id: string): Promise<T | null> {
    return this.items.find(item => item.id === id) || null;
  }

  async findAll(): Promise<T[]> {
    return [...this.items];
  }

  async update(id: string, updates: Partial<T>): Promise<T | null> {
    const index = this.items.findIndex(item => item.id === id);
    if (index === -1) return null;
    
    this.items[index] = { ...this.items[index], ...updates };
    return this.items[index];
  }

  async delete(id: string): Promise<void> {
    const index = this.items.findIndex(item => item.id === id);
    if (index !== -1) {
      this.items.splice(index, 1);
    }
  }

  protected abstract generateId(): string;
}