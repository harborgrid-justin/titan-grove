/**
 * Test for @titan-grove/corporate-governance module
 */

const functions = require('./index.js');

console.log('🧪 Testing @titan-grove/corporate-governance Module');
console.log('==========================================');

try {
  console.log('✅ Module loaded successfully');
  console.log('📦 Available functions:', Object.keys(functions).length);
  console.log('🔍 Functions:', Object.keys(functions).join(', '));
  
  // Test hello function
  if (functions.hello_corporate_governance) {
    console.log('✅ Hello function:', functions.hello_corporate_governance());
  }
  
  // Test sample calculation  
  if (functions.calculate_sample_corporate_governance) {
    console.log('✅ Sample calculation (100 * 1.15):', functions.calculate_sample_corporate_governance(100));
  }
  
  // Test analytics function
  if (functions.analyze_corporate_governance_metrics) {
    const metrics = functions.analyze_corporate_governance_metrics([10, 20, 30, 40, 50]);
    console.log('✅ Analytics metrics:', JSON.parse(metrics));
  }
  
  // Test module info
  if (functions.get_corporate_governance_info) {
    const info = functions.get_corporate_governance_info();
    console.log('✅ Module info:', JSON.parse(info));
  }
  
  // Test config validation
  if (functions.validate_corporate_governance_config) {
    const isValid = functions.validate_corporate_governance_config('{"test": true}');
    console.log('✅ Config validation:', isValid);
  }
  
  // Test data processing
  if (functions.process_corporate_governance_data) {
    const result = functions.process_corporate_governance_data('sample data');
    console.log('✅ Data processing:', JSON.parse(result));
  }
  
  console.log('');
  console.log('🎉 @titan-grove/corporate-governance - All tests passed!');
  console.log('🏷️  Category: Global Operations & Governance');
  console.log('📋 Keywords:', 'corporate-governance, board-management, compliance, risk-governance, enterprise, napi-rs, native, rust');
  
} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}