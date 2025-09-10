const assert = require('assert');
const { 
  calculate_central_bank_digital_currency_metrics,
  process_central_bank_digital_currency_data,
  analyze_central_bank_digital_currency_performance,
  optimize_central_bank_digital_currency_operations,
  validate_central_bank_digital_currency_compliance
} = require('./index');

console.log('Testing @titan-grove/central-bank-digital-currency...');

// Test basic calculation
const result = calculate_central_bank_digital_currency_metrics(100);
assert(typeof result === 'number', 'Should return a number');
assert(result > 0, 'Should return positive result');

// Test data processing
const data = [1, 2, 3, 4, 5];
const processed = process_central_bank_digital_currency_data(data);
assert(Array.isArray(processed), 'Should return an array');
assert(processed.length === data.length, 'Should maintain array length');

// Test performance analysis
const metrics = [85, 90, 95, 88, 92];
const performance = analyze_central_bank_digital_currency_performance(metrics);
assert(typeof performance === 'number', 'Should return performance score');

// Test optimization
const parameters = [10, 20, 30];
const optimized = optimize_central_bank_digital_currency_operations(parameters);
assert(Array.isArray(optimized), 'Should return optimized parameters');

// Test compliance validation
const compliant = validate_central_bank_digital_currency_compliance(90);
assert(typeof compliant === 'boolean', 'Should return boolean');
assert(compliant === true, 'Should validate high score as compliant');

console.log('✅ All tests passed for @titan-grove/central-bank-digital-currency');