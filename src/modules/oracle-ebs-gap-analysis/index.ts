/**
 * Oracle EBS Gap Analysis Module
 * 
 * Main module exports for gap analysis functionality
 */

export * from './business-logic/gap-analysis-service';
export * from './types';

// Module metadata
export const MODULE_INFO = {
  name: 'Oracle EBS Gap Analysis',
  version: '1.0.0',
  description: 'Comprehensive usability and functionality gap analysis between Titan Grove and Oracle EBS',
  domains: [
    'financial',
    'scm', 
    'manufacturing',
    'hr',
    'crm',
    'project',
    'procurement',
    'analytics'
  ],
  capabilities: [
    'Domain-specific analysis',
    'Usability gap identification',
    'Functionality gap assessment', 
    'Competitive scoring',
    'Recommendations engine',
    'Export capabilities',
    'Trend analysis'
  ]
};