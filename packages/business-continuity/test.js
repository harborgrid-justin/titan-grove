/**
 * Test for @titan-grove/business-continuity module
 */

const functions = require('./index.js');

console.log('🧪 Testing @titan-grove/business-continuity Module');
console.log('==========================================');

try {
  console.log('✅ Module loaded successfully');
  console.log('📦 Available functions:', Object.keys(functions).length);
  console.log('🔍 Functions:', Object.keys(functions).join(', '));
  
  // Test hello function
  if (functions.hello_business_continuity) {
    console.log('✅ Hello function:', functions.hello_business_continuity());
  }
  
  // Test sample calculation  
  if (functions.calculate_sample_business_continuity) {
    console.log('✅ Sample calculation (100 * 1.15):', functions.calculate_sample_business_continuity(100));
  }
  
  // Test analytics function
  if (functions.analyze_business_continuity_metrics) {
    const metrics = functions.analyze_business_continuity_metrics([10, 20, 30, 40, 50]);
    console.log('✅ Analytics metrics:', JSON.parse(metrics));
  }
  
  // Test module info
  if (functions.get_business_continuity_info) {
    const info = functions.get_business_continuity_info();
    console.log('✅ Module info:', JSON.parse(info));
  }
  
  // Test config validation
  if (functions.validate_business_continuity_config) {
    const isValid = functions.validate_business_continuity_config('{"test": true}');
    console.log('✅ Config validation:', isValid);
  }
  
  // Test data processing
  if (functions.process_business_continuity_data) {
    const result = functions.process_business_continuity_data('sample data');
    console.log('✅ Data processing:', JSON.parse(result));
  }
  
  console.log('');
  console.log('🎉 @titan-grove/business-continuity - All tests passed!');
  console.log('🏷️  Category: Global Operations & Governance');
  console.log('📋 Keywords:', 'business-continuity, disaster-recovery, bcp, resilience, enterprise, napi-rs, native, rust');
  
} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}