/**
 * Integration Management Service
 * Business logic for system integration and data synchronization
 */

import type {
  IntegrationEndpoint,
  DataMapping,
  IntegrationJob,
  JobExecution,
  DataQualityReport,
} from '../types';
import { integrationRepository } from '../data-access/repositories';

export class IntegrationService {
  async createEndpoint(
    endpointData: Omit<IntegrationEndpoint, 'id' | 'createdDate'>
  ): Promise<IntegrationEndpoint> {
    // Validate endpoint configuration
    this.validateEndpointData(endpointData);

    // Create the endpoint
    const endpoint = await integrationRepository.createEndpoint(endpointData);

    // Test initial connection
    try {
      const connectionResult = await integrationRepository.testEndpointConnection(endpoint.id);
      if (!connectionResult.success) {
        console.warn(
          `Initial connection test failed for endpoint ${endpoint.id}: ${connectionResult.error}`
        );
      }
    } catch (error) {
      console.warn(`Could not test initial connection for endpoint ${endpoint.id}:`, error);
    }

    return endpoint;
  }

  async updateEndpoint(
    endpointId: string,
    updates: Partial<IntegrationEndpoint>
  ): Promise<IntegrationEndpoint> {
    const existingEndpoint = await integrationRepository.getEndpointById(endpointId);
    if (!existingEndpoint) {
      throw new Error(`Endpoint with ID ${endpointId} not found`);
    }

    return await integrationRepository.updateEndpoint(endpointId, updates);
  }

  async testEndpointConnection(
    endpointId: string
  ): Promise<{ success: boolean; responseTime: number; error?: string }> {
    const endpoint = await integrationRepository.getEndpointById(endpointId);
    if (!endpoint) {
      throw new Error(`Endpoint with ID ${endpointId} not found`);
    }

    return await integrationRepository.testEndpointConnection(endpointId);
  }

  async createDataMapping(
    mappingData: Omit<DataMapping, 'id' | 'createdDate'>
  ): Promise<DataMapping> {
    // Validate mapping configuration
    await this.validateMappingData(mappingData);

    return await integrationRepository.createDataMapping(mappingData);
  }

  async createIntegrationJob(
    jobData: Omit<IntegrationJob, 'id' | 'createdDate' | 'executionHistory'>
  ): Promise<IntegrationJob> {
    // Validate job configuration
    await this.validateJobData(jobData);

    return await integrationRepository.createIntegrationJob(jobData);
  }

  async executeIntegrationJob(
    jobId: string,
    immediate: boolean = false
  ): Promise<{ executionId: string; status: 'STARTED' | 'QUEUED' | 'ERROR' }> {
    const job = await integrationRepository.getIntegrationJobById(jobId);
    if (!job) {
      throw new Error(`Integration job with ID ${jobId} not found`);
    }

    if (job.status !== 'ACTIVE') {
      throw new Error(`Job ${jobId} is not active. Current status: ${job.status}`);
    }

    // Create execution record
    const execution = await integrationRepository.createJobExecution({
      jobId,
      startTime: new Date(),
      status: 'RUNNING',
      recordsProcessed: 0,
      recordsSuccessful: 0,
      recordsFailed: 0,
      logs: [
        {
          timestamp: new Date(),
          level: 'INFO',
          message: 'Job execution started',
        },
      ],
    });

    // In a real implementation, this would trigger the actual job execution
    // For now, simulate execution
    setTimeout(
      async () => {
        try {
          await this.simulateJobExecution(execution.id);
        } catch (error) {
          console.error(`Job execution ${execution.id} failed:`, error);
        }
      },
      immediate ? 0 : 1000
    );

    return {
      executionId: execution.id,
      status: 'STARTED',
    };
  }

  async monitorDataQuality(mappingId: string): Promise<{
    totalRecords: number;
    validRecords: number;
    invalidRecords: number;
    qualityScore: number;
    commonIssues: Array<{ issue: string; count: number }>;
  }> {
    const mapping = await integrationRepository.getDataMappingById(mappingId);
    if (!mapping) {
      throw new Error(`Data mapping with ID ${mappingId} not found`);
    }

    // Generate quality report (mock implementation)
    const totalRecords = 10000;
    const invalidRecords = Math.floor(Math.random() * 200) + 50;
    const validRecords = totalRecords - invalidRecords;
    const qualityScore = (validRecords / totalRecords) * 100;

    const commonIssues = [
      { issue: 'Missing required field', count: Math.floor(invalidRecords * 0.4) },
      { issue: 'Invalid date format', count: Math.floor(invalidRecords * 0.3) },
      { issue: 'Data type mismatch', count: Math.floor(invalidRecords * 0.2) },
      { issue: 'Constraint violation', count: Math.floor(invalidRecords * 0.1) },
    ];

    // Create quality report
    await integrationRepository.createQualityReport({
      mappingId,
      reportDate: new Date(),
      totalRecords,
      validRecords,
      invalidRecords,
      qualityScore,
      ruleResults: [],
      issues: [],
    });

    return {
      totalRecords,
      validRecords,
      invalidRecords,
      qualityScore,
      commonIssues,
    };
  }

  async getIntegrationMetrics(period: 'day' | 'week' | 'month'): Promise<{
    totalJobs: number;
    successfulJobs: number;
    failedJobs: number;
    averageExecutionTime: number;
    dataQualityScore: number;
    endpointsStatus: { active: number; inactive: number; error: number };
  }> {
    const allJobs = await integrationRepository.getActiveJobs();
    const allEndpoints = await integrationRepository.getAllEndpoints();

    // Mock metrics calculation
    const totalJobs = allJobs.length;
    const successfulJobs = Math.floor(totalJobs * 0.85);
    const failedJobs = totalJobs - successfulJobs;

    const endpointsStatus = allEndpoints.reduce(
      (acc, endpoint) => {
        acc[endpoint.status.toLowerCase() as keyof typeof acc]++;
        return acc;
      },
      { active: 0, inactive: 0, error: 0 }
    );

    return {
      totalJobs,
      successfulJobs,
      failedJobs,
      averageExecutionTime: Math.random() * 30000 + 5000, // 5-35 seconds
      dataQualityScore: Math.random() * 20 + 80, // 80-100%
      endpointsStatus,
    };
  }

  private validateEndpointData(
    endpointData: Omit<IntegrationEndpoint, 'id' | 'createdDate'>
  ): void {
    if (!endpointData.name || endpointData.name.trim() === '') {
      throw new Error('Endpoint name is required');
    }

    if (!endpointData.url || endpointData.url.trim() === '') {
      throw new Error('Endpoint URL is required');
    }

    // Validate URL format
    try {
      new URL(endpointData.url);
    } catch {
      throw new Error('Invalid URL format');
    }

    if (endpointData.connectionTimeout <= 0) {
      throw new Error('Connection timeout must be greater than 0');
    }
  }

  private async validateMappingData(
    mappingData: Omit<DataMapping, 'id' | 'createdDate'>
  ): Promise<void> {
    if (!mappingData.mappingName || mappingData.mappingName.trim() === '') {
      throw new Error('Mapping name is required');
    }

    // Validate source and target endpoints exist
    const sourceEndpoint = await integrationRepository.getEndpointById(
      mappingData.sourceEndpointId
    );
    if (!sourceEndpoint) {
      throw new Error(`Source endpoint ${mappingData.sourceEndpointId} not found`);
    }

    const targetEndpoint = await integrationRepository.getEndpointById(
      mappingData.targetEndpointId
    );
    if (!targetEndpoint) {
      throw new Error(`Target endpoint ${mappingData.targetEndpointId} not found`);
    }

    if (mappingData.fieldMappings.length === 0) {
      throw new Error('At least one field mapping is required');
    }
  }

  private async validateJobData(
    jobData: Omit<IntegrationJob, 'id' | 'createdDate' | 'executionHistory'>
  ): Promise<void> {
    if (!jobData.name || jobData.name.trim() === '') {
      throw new Error('Job name is required');
    }

    // Validate mapping exists
    const mapping = await integrationRepository.getDataMappingById(jobData.mappingId);
    if (!mapping) {
      throw new Error(`Data mapping ${jobData.mappingId} not found`);
    }

    // Validate schedule
    if (
      jobData.schedule.type === 'RECURRING' &&
      !jobData.schedule.cronExpression &&
      !jobData.schedule.interval
    ) {
      throw new Error('Recurring jobs must have either cron expression or interval specified');
    }
  }

  private async simulateJobExecution(executionId: string): Promise<void> {
    // Simulate job execution with random success/failure
    const isSuccess = Math.random() > 0.15; // 85% success rate
    const recordsProcessed = Math.floor(Math.random() * 10000) + 1000;
    const recordsFailed = isSuccess
      ? Math.floor(recordsProcessed * 0.02)
      : Math.floor(recordsProcessed * 0.1);

    await integrationRepository.updateJobExecution(executionId, {
      endTime: new Date(),
      status: isSuccess ? 'COMPLETED' : 'FAILED',
      recordsProcessed,
      recordsSuccessful: recordsProcessed - recordsFailed,
      recordsFailed,
      duration: Math.floor(Math.random() * 30000) + 5000,
      errorMessage: isSuccess ? undefined : 'Simulated execution failure',
    });
  }
}

export const integrationService = new IntegrationService();
