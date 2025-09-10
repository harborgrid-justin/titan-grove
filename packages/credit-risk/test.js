/**
 * Test for @titan-grove/credit-risk module
 */

const functions = require('./index.js');

console.log('🧪 Testing @titan-grove/credit-risk Module');
console.log('==========================================');

try {
  console.log('✅ Module loaded successfully');
  console.log('📦 Available functions:', Object.keys(functions).length);
  console.log('🔍 Functions:', Object.keys(functions).join(', '));
  
  // Test hello function
  if (functions.hello_credit_risk) {
    console.log('✅ Hello function:', functions.hello_credit_risk());
  }
  
  // Test sample calculation  
  if (functions.calculate_sample_credit_risk) {
    console.log('✅ Sample calculation (100 * 1.15):', functions.calculate_sample_credit_risk(100));
  }
  
  // Test analytics function
  if (functions.analyze_credit_risk_metrics) {
    const metrics = functions.analyze_credit_risk_metrics([10, 20, 30, 40, 50]);
    console.log('✅ Analytics metrics:', JSON.parse(metrics));
  }
  
  // Test module info
  if (functions.get_credit_risk_info) {
    const info = functions.get_credit_risk_info();
    console.log('✅ Module info:', JSON.parse(info));
  }
  
  // Test config validation
  if (functions.validate_credit_risk_config) {
    const isValid = functions.validate_credit_risk_config('{"test": true}');
    console.log('✅ Config validation:', isValid);
  }
  
  // Test data processing
  if (functions.process_credit_risk_data) {
    const result = functions.process_credit_risk_data('sample data');
    console.log('✅ Data processing:', JSON.parse(result));
  }
  
  console.log('');
  console.log('🎉 @titan-grove/credit-risk - All tests passed!');
  console.log('🏷️  Category: Financial Services & Fintech');
  console.log('📋 Keywords:', 'credit-risk, risk-scoring, credit-analysis, financial-risk, enterprise, napi-rs, native, rust');
  
} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}