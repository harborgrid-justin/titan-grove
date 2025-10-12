/**
 * User Repository
 * Data access layer for User operations using Sequelize
 */

import { User, UserAttributes, UserCreationAttributes } from '../models/User.model';
import { Op } from 'sequelize';

export class UserRepository {
  /**
   * Create a new user
   */
  async create(userData: UserCreationAttributes): Promise<User> {
    return await User.create(userData);
  }

  /**
   * Find user by ID
   */
  async findById(id: string): Promise<User | null> {
    return await User.findByPk(id);
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    return await User.findOne({
      where: { email },
    });
  }

  /**
   * Find user by username
   */
  async findByUsername(username: string): Promise<User | null> {
    return await User.findOne({
      where: { username },
    });
  }

  /**
   * Find all users with optional filters
   */
  async findAll(filters?: {
    isActive?: boolean;
    role?: 'admin' | 'user' | 'guest';
    limit?: number;
    offset?: number;
  }): Promise<User[]> {
    const where: any = {};
    
    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive;
    }
    
    if (filters?.role) {
      where.role = filters.role;
    }

    return await User.findAll({
      where,
      limit: filters?.limit,
      offset: filters?.offset,
      order: [['createdAt', 'DESC']],
    });
  }

  /**
   * Update user by ID
   */
  async update(id: string, updates: Partial<UserAttributes>): Promise<User | null> {
    const user = await User.findByPk(id);
    
    if (!user) {
      return null;
    }

    await user.update(updates);
    return user;
  }

  /**
   * Delete user by ID
   */
  async delete(id: string): Promise<boolean> {
    const deleted = await User.destroy({
      where: { id },
    });
    
    return deleted > 0;
  }

  /**
   * Search users by email or username
   */
  async search(query: string): Promise<User[]> {
    return await User.findAll({
      where: {
        [Op.or]: [
          { email: { [Op.like]: `%${query}%` } },
          { username: { [Op.like]: `%${query}%` } },
          { firstName: { [Op.like]: `%${query}%` } },
          { lastName: { [Op.like]: `%${query}%` } },
        ],
      },
      limit: 50,
    });
  }

  /**
   * Count total users
   */
  async count(filters?: { isActive?: boolean; role?: string }): Promise<number> {
    const where: any = {};
    
    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive;
    }
    
    if (filters?.role) {
      where.role = filters.role;
    }

    return await User.count({ where });
  }
}

// Export singleton instance
export const userRepository = new UserRepository();
