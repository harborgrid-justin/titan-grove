const assert = require('assert');
const { 
  calculate_data_visualization_metrics,
  process_data_visualization_data,
  analyze_data_visualization_performance,
  optimize_data_visualization_operations,
  validate_data_visualization_compliance
} = require('./index');

console.log('Testing @titan-grove/data-visualization...');

// Test basic calculation
const result = calculate_data_visualization_metrics(100);
assert(typeof result === 'number', 'Should return a number');
assert(result > 0, 'Should return positive result');

// Test data processing
const data = [1, 2, 3, 4, 5];
const processed = process_data_visualization_data(data);
assert(Array.isArray(processed), 'Should return an array');
assert(processed.length === data.length, 'Should maintain array length');

// Test performance analysis
const metrics = [85, 90, 95, 88, 92];
const performance = analyze_data_visualization_performance(metrics);
assert(typeof performance === 'number', 'Should return performance score');

// Test optimization
const parameters = [10, 20, 30];
const optimized = optimize_data_visualization_operations(parameters);
assert(Array.isArray(optimized), 'Should return optimized parameters');

// Test compliance validation
const compliant = validate_data_visualization_compliance(90);
assert(typeof compliant === 'boolean', 'Should return boolean');
assert(compliant === true, 'Should validate high score as compliant');

console.log('✅ All tests passed for @titan-grove/data-visualization');