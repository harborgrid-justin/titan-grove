/**
 * ComponentRegistry - Manages dynamic component registration and loading
 */

import { EventEmitter } from 'events';
import { Logger } from 'winston';
import { UIComponent } from '../types';

export class ComponentRegistry extends EventEmitter {
  private logger: Logger;
  private components: Map<string, UIComponent> = new Map();
  private dependencies: Map<string, string[]> = new Map();

  constructor(logger: Logger) {
    super();
    this.logger = logger;
  }

  /**
   * Register a new component
   */
  async register(component: UIComponent): Promise<void> {
    // Validate component
    this.validateComponent(component);

    // Check dependencies
    if (component.dependencies) {
      await this.validateDependencies(component.dependencies);
      this.dependencies.set(component.id, component.dependencies);
    }

    // Register component
    this.components.set(component.id, component);
    
    this.logger.info(`Component registered: ${component.name} (${component.id})`);
    this.emit('componentRegistered', component);
  }

  /**
   * Get component by ID
   */
  async get(componentId: string): Promise<UIComponent | null> {
    return this.components.get(componentId) || null;
  }

  /**
   * Get all components
   */
  async getAll(): Promise<UIComponent[]> {
    return Array.from(this.components.values());
  }

  /**
   * Get components by type
   */
  async getByType(type: string): Promise<UIComponent[]> {
    return Array.from(this.components.values()).filter(c => c.type === type);
  }

  /**
   * Unregister component
   */
  async unregister(componentId: string): Promise<void> {
    const component = this.components.get(componentId);
    if (!component) {
      throw new Error(`Component ${componentId} not found`);
    }

    // Check if other components depend on this one
    const dependents = this.findDependents(componentId);
    if (dependents.length > 0) {
      throw new Error(
        `Cannot unregister ${componentId}: it has dependents: ${dependents.join(', ')}`
      );
    }

    this.components.delete(componentId);
    this.dependencies.delete(componentId);
    
    this.logger.info(`Component unregistered: ${component.name} (${componentId})`);
    this.emit('componentUnregistered', component);
  }

  /**
   * Get component dependencies in load order
   */
  async getDependencyOrder(componentId: string): Promise<string[]> {
    const visited = new Set<string>();
    const visiting = new Set<string>();
    const order: string[] = [];

    const visit = (id: string) => {
      if (visiting.has(id)) {
        throw new Error(`Circular dependency detected involving ${id}`);
      }
      if (visited.has(id)) {
        return;
      }

      visiting.add(id);
      
      const deps = this.dependencies.get(id) || [];
      for (const dep of deps) {
        visit(dep);
      }
      
      visiting.delete(id);
      visited.add(id);
      order.push(id);
    };

    visit(componentId);
    return order;
  }

  /**
   * Validate component structure
   */
  private validateComponent(component: UIComponent): void {
    if (!component.id) {
      throw new Error('Component ID is required');
    }
    if (!component.type) {
      throw new Error('Component type is required');
    }
    if (!component.name) {
      throw new Error('Component name is required');
    }
    if (!component.version) {
      throw new Error('Component version is required');
    }

    // Check for duplicate ID
    if (this.components.has(component.id)) {
      throw new Error(`Component with ID ${component.id} already exists`);
    }
  }

  /**
   * Validate component dependencies exist
   */
  private async validateDependencies(dependencies: string[]): Promise<void> {
    for (const dep of dependencies) {
      if (!this.components.has(dep)) {
        throw new Error(`Dependency ${dep} not found`);
      }
    }
  }

  /**
   * Find components that depend on the given component
   */
  private findDependents(componentId: string): string[] {
    const dependents: string[] = [];
    
    for (const [id, deps] of this.dependencies) {
      if (deps.includes(componentId)) {
        dependents.push(id);
      }
    }
    
    return dependents;
  }
}