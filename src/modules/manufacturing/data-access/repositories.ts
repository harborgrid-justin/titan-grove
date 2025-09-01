import { generateId } from '../../../shared/utils/id-generator';

export abstract class BaseManufacturingRepository<T extends Record<string, any>> {
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

export class ProductRepository extends BaseManufacturingRepository<any> {
  protected generateId(): string {
    return generateId('product');
  }

  async findByStatus(status: string): Promise<any[]> {
    return this.items.filter(product => product.status === status);
  }
}

export class WorkOrderRepository extends BaseManufacturingRepository<any> {
  protected generateId(): string {
    return generateId('work_order');
  }

  async findOverdue(): Promise<any[]> {
    const now = new Date();
    return this.items.filter(wo => new Date(wo.dueDate) < now && wo.status !== 'COMPLETED');
  }
}

export const productRepository = new ProductRepository();
export const workOrderRepository = new WorkOrderRepository();
