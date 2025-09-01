import { generateId } from '../../../shared/utils/id-generator';

export abstract class BaseRepository<T extends Record<string, any>> {
  protected items: T[] = [];

  async create(entity: Omit<T, 'id'>): Promise<T> {
    const id = this.generateId();
    const newItem = { ...entity, id } as unknown as T;
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
    if (index !== -1) this.items.splice(index, 1);
  }

  protected abstract generateId(): string;
}

export class RentalManagementRepository extends BaseRepository<any> {
  protected generateId(): string {
    return generateId('rental_management');
  }
}

export const rentalManagementRepository = new RentalManagementRepository();
