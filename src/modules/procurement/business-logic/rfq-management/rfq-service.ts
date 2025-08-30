/**
 * RFQ Management Service
 * Business logic for Request for Quote management
 */

import { 
  RFQ, 
  RFQStatus,
  RFQResponse,
  ProcurementSearchCriteria
} from '../../types';
import { rfqRepository } from '../../data-access/repositories';
import { PaginatedResponse, SearchParams } from '../../../../types/common';

export class RFQService {
  
  /**
   * Create a new RFQ
   */
  async createRFQ(
    data: Omit<RFQ, 'id' | 'rfqNumber' | 'status' | 'publishedDate' | 'responses' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>
  ): Promise<RFQ> {
    this.validateRFQData(data);
    
    const rfqNumber = await this.generateRFQNumber();
    
    const rfqData = {
      ...data,
      rfqNumber,
      status: RFQStatus.DRAFT,
      responses: [],
      createdBy: 'system',
      updatedBy: 'system'
    };
    
    return await rfqRepository.create(rfqData);
  }

  async getRFQById(id: string): Promise<RFQ | null> {
    return await rfqRepository.getById(id);
  }

  async publishRFQ(rfqId: string): Promise<{
    status: 'PUBLISHED' | 'ERROR';
    publishedDate?: Date;
    invitedSuppliers: number;
  }> {
    const rfq = await this.getRFQById(rfqId);
    if (!rfq) {
      throw new Error(`RFQ with ID ${rfqId} not found`);
    }
    
    if (rfq.status !== RFQStatus.DRAFT) {
      throw new Error('Only draft RFQs can be published');
    }
    
    // Update status and published date
    await rfqRepository.update(rfqId, {
      status: RFQStatus.PUBLISHED,
      publishedDate: new Date()
    });
    
    return {
      status: 'PUBLISHED',
      publishedDate: new Date(),
      invitedSuppliers: rfq.invitedSuppliers.length
    };
  }

  async evaluateRFQResponses(rfqId: string): Promise<{
    recommendedSupplier: string;
    evaluationScores: Array<{ supplierId: string; score: number; ranking: number }>;
    costSavings: number;
    analysis: string;
  }> {
    const rfq = await this.getRFQById(rfqId);
    if (!rfq) {
      throw new Error(`RFQ with ID ${rfqId} not found`);
    }
    
    // Mock evaluation - in real implementation would analyze responses
    return {
      recommendedSupplier: 'supplier_001',
      evaluationScores: [
        { supplierId: 'supplier_001', score: 85, ranking: 1 },
        { supplierId: 'supplier_002', score: 78, ranking: 2 }
      ],
      costSavings: 15000,
      analysis: 'Supplier 001 offers the best value proposition with superior quality and competitive pricing.'
    };
  }

  private validateRFQData(data: Partial<RFQ>): void {
    if (!data.title || data.title.trim() === '') {
      throw new Error('RFQ title is required');
    }
    
    if (!data.responseDeadline) {
      throw new Error('Response deadline is required');
    }
    
    if (data.responseDeadline <= new Date()) {
      throw new Error('Response deadline must be in the future');
    }
  }

  private async generateRFQNumber(): Promise<string> {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `RFQ${timestamp.toString().slice(-6)}${random}`;
  }
}

export const rfqService = new RFQService();