/**
 * Oracle EBS Gap Analysis API Routes
 * 
 * Express routes for gap analysis functionality
 */

import { Router } from 'express';
import { oracleEBSGapAnalysisService } from '../modules/oracle-ebs-gap-analysis';
import type { GapAnalysisConfig } from '../modules/oracle-ebs-gap-analysis';

const router = Router();

/**
 * GET /api/gap-analysis
 * Get all gap analyses
 */
router.get('/', async (req, res) => {
  try {
    const analyses = await oracleEBSGapAnalysisService.getAllAnalyses();
    res.json({
      success: true,
      data: analyses,
      count: analyses.length
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: (error as Error).message
    });
  }
});

/**
 * POST /api/gap-analysis
 * Perform new gap analysis
 */
router.post('/', async (req, res) => {
  try {
    const config: GapAnalysisConfig = {
      analysisType: req.body.analysisType || 'comprehensive',
      domains: req.body.domains || ['financial', 'scm', 'manufacturing', 'hr', 'crm', 'procurement', 'analytics'],
      depth: req.body.depth || 'detailed',
      includeRecommendations: req.body.includeRecommendations !== false,
      comparativeScoring: req.body.comparativeScoring !== false
    };

    const result = await oracleEBSGapAnalysisService.performGapAnalysis(config);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: (error as Error).message
    });
  }
});

/**
 * GET /api/gap-analysis/:id
 * Get specific gap analysis
 */
router.get('/:id', async (req, res) => {
  try {
    const analysis = await oracleEBSGapAnalysisService.getAnalysis(req.params.id);
    
    if (!analysis) {
      return res.status(404).json({
        success: false,
        error: 'Analysis not found'
      });
    }

    res.json({
      success: true,
      data: analysis
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: (error as Error).message
    });
  }
});

/**
 * GET /api/gap-analysis/:id/export/:format
 * Export gap analysis in specified format
 */
router.get('/:id/export/:format', async (req, res) => {
  try {
    const { id, format } = req.params;
    
    if (!['json', 'csv', 'pdf'].includes(format)) {
      return res.status(400).json({
        success: false,
        error: 'Unsupported export format. Use json, csv, or pdf.'
      });
    }

    const exportContent = await oracleEBSGapAnalysisService.exportAnalysis(id, format as 'json' | 'csv' | 'pdf');
    
    // Set appropriate headers for download
    const filename = `gap-analysis-${id}.${format}`;
    const mimeTypes = {
      json: 'application/json',
      csv: 'text/csv',
      pdf: 'application/pdf'
    };

    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', mimeTypes[format as keyof typeof mimeTypes]);
    res.send(exportContent);

  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: (error as Error).message
    });
  }
});

/**
 * GET /api/gap-analysis/health
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    service: 'Oracle EBS Gap Analysis',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

export default router;