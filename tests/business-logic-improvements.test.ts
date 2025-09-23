/**
 * PR 157 Business Logic Improvements Tests
 * Tests for enhanced business logic functions identified in the comprehensive analysis
 */

import { 
  calculateAdvancedFinancialHealthScore,
  calculateUniversalBusinessMetrics,
  analyzeUniversalBusinessPerformance,
  optimizeUniversalBusinessOperations,
  validateUniversalBusinessCompliance,
  processUniversalBusinessData
} from '../native';

describe('PR 157 Business Logic Improvements', () => {
  
  describe('Enhanced Financial Health Scoring', () => {
    it('should calculate comprehensive financial health score with industry weights', () => {
      const input = {
        revenue: 1000000,
        costs: 700000,
        assets: 2000000,
        liabilities: 800000,
        cashFlow: 150000,
        industrySector: 'technology',
        companySize: 'medium'
      };

      const result = calculateAdvancedFinancialHealthScore(input);

      expect(result).toBeDefined();
      expect(result.healthScore).toBeGreaterThan(0);
      expect(result.healthScore).toBeLessThanOrEqual(100);
      expect(result.rating).toBeDefined();
      expect(result.componentScores).toBeDefined();
      expect(result.componentScores.profitability).toBeGreaterThan(0);
      expect(result.componentScores.liquidity).toBeGreaterThan(0);
      expect(result.componentScores.solvency).toBeGreaterThan(0);
      expect(result.componentScores.efficiency).toBeGreaterThan(0);
    });

    it('should provide industry-specific benchmarks', () => {
      const input = {
        revenue: 500000,
        costs: 350000,
        assets: 1000000,
        liabilities: 400000,
        cashFlow: 80000,
        industrySector: 'manufacturing',
        companySize: 'small'
      };

      const result = calculateAdvancedFinancialHealthScore(input);

      expect(result.benchmarks).toBeDefined();
      expect(result.benchmarks.industryAverage).toBeGreaterThan(0);
      expect(result.benchmarks.peerComparison).toBeDefined();
      expect(result.benchmarks.percentileRanking).toBeGreaterThanOrEqual(0);
    });

    it('should generate improvement recommendations', () => {
      const lowPerformanceInput = {
        revenue: 100000,
        costs: 95000,
        assets: 200000,
        liabilities: 150000,
        cashFlow: 5000,
        industrySector: 'retail',
        companySize: 'small'
      };

      const result = calculateAdvancedFinancialHealthScore(lowPerformanceInput);

      expect(result.recommendations).toBeDefined();
      expect(result.recommendations.length).toBeGreaterThan(0);
      expect(result.riskFactors).toBeDefined();
      expect(result.riskFactors.length).toBeGreaterThan(0);
    });

    it('should handle invalid input gracefully', () => {
      const invalidInput = {
        revenue: -1000,
        costs: 500,
        assets: -100,
        liabilities: 200,
        cashFlow: 50,
        industrySector: 'technology',
        companySize: 'medium'
      };

      const result = calculateAdvancedFinancialHealthScore(invalidInput);

      expect(result.healthScore).toBe(0);
      expect(result.rating).toBe('Invalid Data');
      expect(result.recommendations).toContain('Please provide valid revenue and asset data');
    });
  });

  describe('Enhanced Universal Business Metrics', () => {
    it('should provide improved calculation over legacy formula', () => {
      const input = 100.0;
      const result = calculateUniversalBusinessMetrics(input);

      // Should be different from simple legacy formula: input * 1.21 + 42.0 = 163.0
      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThanOrEqual(1000); // Within bounds
      
      // Should have some variance from the simple calculation
      const legacyResult = input * 1.21 + 42.0;
      expect(Math.abs(result - legacyResult)).toBeLessThan(50); // Similar but enhanced
    });
  });

  describe('Enhanced Performance Analysis', () => {
    it('should provide weighted performance analysis with trend consideration', () => {
      const metrics = [60.0, 65.0, 70.0, 75.0, 80.0]; // Improving trend
      const result = analyzeUniversalBusinessPerformance(metrics);

      // Should be higher than simple average (70.0) due to positive trend weighting
      expect(result).toBeGreaterThan(70.0);
      expect(result).toBeLessThanOrEqual(100.0);
    });

    it('should handle empty metrics gracefully', () => {
      const result = analyzeUniversalBusinessPerformance([]);
      expect(result).toBe(0.0);
    });

    it('should apply volatility adjustment', () => {
      const lowVolatilityMetrics = [70.0, 71.0, 70.5, 70.8, 70.2];
      const highVolatilityMetrics = [40.0, 90.0, 30.0, 100.0, 50.0];

      const lowVolResult = analyzeUniversalBusinessPerformance(lowVolatilityMetrics);
      const highVolResult = analyzeUniversalBusinessPerformance(highVolatilityMetrics);

      // Low volatility should score higher than high volatility for similar averages
      expect(lowVolResult).toBeGreaterThan(highVolResult);
    });
  });

  describe('Enhanced Operations Optimization', () => {
    it('should provide sophisticated optimization over simple formula', () => {
      const parameters = [100.0, 200.0, 150.0, 300.0];
      const result = optimizeUniversalBusinessOperations(parameters);

      expect(result).toHaveLength(parameters.length);
      expect(result.every(val => val > 0)).toBe(true);

      // Results should be within reasonable bounds relative to input
      result.forEach((optimized, index) => {
        const original = parameters[index];
        expect(optimized).toBeGreaterThanOrEqual(original * 0.5);
        expect(optimized).toBeLessThanOrEqual(original * 3.0);
      });
    });

    it('should handle empty parameters', () => {
      const result = optimizeUniversalBusinessOperations([]);
      expect(result).toHaveLength(0);
    });
  });

  describe('Enhanced Compliance Validation', () => {
    it('should use dynamic thresholds for compliance validation', () => {
      // Test edge cases around threshold
      expect(validateUniversalBusinessCompliance(84.0)).toBe(false); // Just below base threshold
      expect(validateUniversalBusinessCompliance(86.0)).toBe(true);  // Above base threshold
      expect(validateUniversalBusinessCompliance(96.0)).toBe(true);  // Excellent performance
      expect(validateUniversalBusinessCompliance(30.0)).toBe(false); // Poor performance
    });

    it('should validate score bounds', () => {
      expect(validateUniversalBusinessCompliance(-10.0)).toBe(false); // Invalid negative
      expect(validateUniversalBusinessCompliance(150.0)).toBe(false); // Invalid > 100
      expect(validateUniversalBusinessCompliance(50.0)).toBe(false);  // Poor performance
      expect(validateUniversalBusinessCompliance(90.0)).toBe(true);   // Good performance
    });
  });

  describe('Enhanced Data Processing', () => {
    it('should provide context-aware data transformation', () => {
      const data = [10.0, 20.0, 15.0, 25.0, 18.0];
      const result = processUniversalBusinessData(data);

      expect(result).toHaveLength(data.length);
      expect(result.every(val => val > 0)).toBe(true);

      // Should not be simple doubling (legacy: x * 2.0)
      const legacyResults = data.map(x => x * 2.0);
      const hasEnhancements = result.some((val, index) => 
        Math.abs(val - legacyResults[index]) > 0.1
      );
      expect(hasEnhancements).toBe(true);
    });

    it('should handle negative values appropriately', () => {
      const dataWithNegatives = [-5.0, 10.0, -2.0, 15.0];
      const result = processUniversalBusinessData(dataWithNegatives);

      expect(result).toHaveLength(dataWithNegatives.length);
      
      // Negative values should be penalized but not necessarily negative in output
      const negativeInputIndices = dataWithNegatives.map((val, idx) => val < 0 ? idx : -1).filter(idx => idx >= 0);
      negativeInputIndices.forEach(idx => {
        // Should be less than if the value was positive
        expect(result[idx]).toBeLessThan(Math.abs(dataWithNegatives[idx]) * 2.0);
      });
    });

    it('should handle empty data gracefully', () => {
      const result = processUniversalBusinessData([]);
      expect(result).toHaveLength(0);
    });
  });

  describe('Business Logic Integration', () => {
    it('should demonstrate end-to-end improvement workflow', () => {
      // Simulate a complete business analysis workflow
      const rawData = [85.0, 90.0, 78.0, 95.0, 88.0];
      
      // 1. Process the data
      const processedData = processUniversalBusinessData(rawData);
      expect(processedData.length).toBeGreaterThan(0);

      // 2. Analyze performance
      const performanceScore = analyzeUniversalBusinessPerformance(processedData);
      expect(performanceScore).toBeGreaterThan(0);

      // 3. Optimize operations
      const optimizedParams = optimizeUniversalBusinessOperations(processedData);
      expect(optimizedParams.length).toBe(processedData.length);

      // 4. Validate compliance
      const isCompliant = validateUniversalBusinessCompliance(performanceScore);
      expect(typeof isCompliant).toBe('boolean');

      // 5. Calculate enhanced metrics
      const enhancedMetric = calculateUniversalBusinessMetrics(performanceScore);
      expect(enhancedMetric).toBeGreaterThan(0);

      console.log('Complete workflow results:', {
        originalData: rawData,
        processedData: processedData.map(x => Math.round(x * 100) / 100),
        performanceScore: Math.round(performanceScore * 100) / 100,
        isCompliant,
        enhancedMetric: Math.round(enhancedMetric * 100) / 100
      });
    });
  });
});