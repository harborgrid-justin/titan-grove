/**
 * Sourcing Service
 * Handles sourcing events and supplier evaluation within the procure-to-pay flow
 */

import { SourcingEvent, EvaluationCriteria, SupplierResponse, ResponseLineItem } from './types';

export class SourcingService {
  /**
   * Execute sourcing event with competitive requirements
   */
  async executeSourcingEvent(
    requisitionIds: string[],
    eventType: SourcingEvent['eventType']
  ): Promise<SourcingEvent> {
    const sourcingEvent: SourcingEvent = {
      id: `se_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      eventType,
      eventNumber: `SE${Date.now().toString().slice(-6)}`,
      title: `${eventType} for Requisitions: ${requisitionIds.join(', ')}`,
      description: 'Competitive sourcing event for federal procurement',
      requisitionIds,
      publishDate: new Date(),
      responseDeadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
      evaluationCriteria: this.generateEvaluationCriteria(eventType),
      invitedSuppliers: [],
      responses: [],
      status: 'DRAFT',
    };

    return sourcingEvent;
  }

  /**
   * Generate evaluation criteria based on event type
   */
  private generateEvaluationCriteria(eventType: SourcingEvent['eventType']): EvaluationCriteria[] {
    const criteria: EvaluationCriteria[] = [
      {
        criteriaId: 'crit_price',
        criteriaName: 'Price',
        weight: 60,
        type: 'PRICE',
        passFail: false,
        description: 'Total evaluated price including all costs',
      },
      {
        criteriaId: 'crit_technical',
        criteriaName: 'Technical Capability',
        weight: 25,
        type: 'TECHNICAL',
        passFail: false,
        description: 'Technical approach and capability to meet requirements',
      },
      {
        criteriaId: 'crit_past_perf',
        criteriaName: 'Past Performance',
        weight: 15,
        type: 'PAST_PERFORMANCE',
        passFail: false,
        description: 'Demonstrated past performance on similar contracts',
      },
    ];

    return criteria;
  }

  /**
   * Publish sourcing event to suppliers
   */
  async publishSourcingEvent(eventId: string, invitedSuppliers: string[]): Promise<void> {
    // Implementation would publish event to supplier portal
    console.log(`Publishing sourcing event ${eventId} to ${invitedSuppliers.length} suppliers`);
  }

  /**
   * Submit supplier response
   */
  async submitSupplierResponse(
    eventId: string,
    supplierId: string,
    response: Partial<SupplierResponse>
  ): Promise<SupplierResponse> {
    const supplierResponse: SupplierResponse = {
      responseId: `resp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      supplierId,
      supplierName: response.supplierName || 'Unknown Supplier',
      submitDate: new Date(),
      totalPrice: response.totalPrice || 0,
      lineItems: response.lineItems || [],
      technicalProposal: response.technicalProposal,
      certifications: response.certifications || [],
      evaluationScores: {},
    };

    return supplierResponse;
  }

  /**
   * Evaluate supplier responses
   */
  async evaluateResponses(
    eventId: string,
    responses: SupplierResponse[],
    criteria: EvaluationCriteria[]
  ): Promise<SupplierResponse[]> {
    const evaluatedResponses = responses.map((response) => {
      const evaluationScores: { [criteriaId: string]: number } = {};
      let totalScore = 0;

      criteria.forEach((criterion) => {
        let score = 0;

        switch (criterion.type) {
          case 'PRICE':
            // Lower price gets higher score (inverse relationship)
            const minPrice = Math.min(...responses.map((r) => r.totalPrice));
            score = minPrice > 0 ? (minPrice / response.totalPrice) * 100 : 0;
            break;
          case 'TECHNICAL':
            // Simulate technical evaluation
            score = 70 + Math.random() * 30; // 70-100 range
            break;
          case 'PAST_PERFORMANCE':
            // Simulate past performance evaluation
            score = 65 + Math.random() * 35; // 65-100 range
            break;
          default:
            score = 80; // Default score
        }

        evaluationScores[criterion.criteriaId] = score;
        totalScore += score * (criterion.weight / 100);
      });

      return {
        ...response,
        evaluationScores,
        overallScore: totalScore,
      };
    });

    // Rank responses by overall score
    evaluatedResponses.sort((a, b) => (b.overallScore || 0) - (a.overallScore || 0));
    evaluatedResponses.forEach((response, index) => {
      response.ranking = index + 1;
    });

    return evaluatedResponses;
  }

  /**
   * Award sourcing event to selected supplier
   */
  async awardSourcingEvent(eventId: string, selectedResponseId: string): Promise<void> {
    // Implementation would update event status and notify suppliers
    console.log(`Awarding sourcing event ${eventId} to response ${selectedResponseId}`);
  }

  /**
   * Generate sourcing event report
   */
  async generateSourcingReport(eventId: string): Promise<{
    eventSummary: any;
    responsesSummary: any;
    evaluationSummary: any;
    awardRecommendation: any;
  }> {
    return {
      eventSummary: {
        eventId,
        totalResponses: 3,
        responseRate: '75%',
        averageResponseTime: '8.5 days',
      },
      responsesSummary: {
        priceRange: {
          lowest: 85000,
          highest: 125000,
          average: 105000,
        },
        technicalScores: {
          average: 82.5,
          range: '70-95',
        },
      },
      evaluationSummary: {
        evaluationCompleted: true,
        evaluationDate: new Date(),
        evaluationDuration: '3 days',
      },
      awardRecommendation: {
        recommendedSupplier: 'supplier_001',
        justification: 'Best value based on price and technical capability',
        estimatedSavings: 15000,
      },
    };
  }

  /**
   * Close sourcing event
   */
  async closeSourcingEvent(eventId: string): Promise<void> {
    // Implementation would close the event and archive data
    console.log(`Closing sourcing event ${eventId}`);
  }

  /**
   * Extend response deadline
   */
  async extendResponseDeadline(
    eventId: string,
    newDeadline: Date,
    justification: string
  ): Promise<void> {
    // Implementation would extend deadline and notify suppliers
    console.log(
      `Extending deadline for event ${eventId} to ${newDeadline.toISOString()}: ${justification}`
    );
  }
}

// Export singleton instance
export const sourcingService = new SourcingService();
