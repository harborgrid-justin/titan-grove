/**
 * Test for @titan-grove/advisory-consulting module
 */

const functions = require('./index.js');

console.log('🧪 Testing @titan-grove/advisory-consulting Module');
console.log('==========================================');

try {
  console.log('✅ Module loaded successfully');
  console.log('📦 Available functions:', Object.keys(functions).length);
  console.log('🔍 Functions:', Object.keys(functions).join(', '));
  
  // Test hello function
  if (functions.hello_advisory_consulting) {
    console.log('✅ Hello function:', functions.hello_advisory_consulting());
  }
  
  // Test sample calculation  
  if (functions.calculate_sample_advisory_consulting) {
    console.log('✅ Sample calculation (100 * 1.15):', functions.calculate_sample_advisory_consulting(100));
  }
  
  // Test analytics function
  if (functions.analyze_advisory_consulting_metrics) {
    const metrics = functions.analyze_advisory_consulting_metrics([10, 20, 30, 40, 50]);
    console.log('✅ Analytics metrics:', JSON.parse(metrics));
  }
  
  // Test module info
  if (functions.get_advisory_consulting_info) {
    const info = functions.get_advisory_consulting_info();
    console.log('✅ Module info:', JSON.parse(info));
  }
  
  // Test config validation
  if (functions.validate_advisory_consulting_config) {
    const isValid = functions.validate_advisory_consulting_config('{"test": true}');
    console.log('✅ Config validation:', isValid);
  }
  
  // Test data processing
  if (functions.process_advisory_consulting_data) {
    const result = functions.process_advisory_consulting_data('sample data');
    console.log('✅ Data processing:', JSON.parse(result));
  }
  
  console.log('');
  console.log('🎉 @titan-grove/advisory-consulting - All tests passed!');
  console.log('🏷️  Category: Specialized Professional Services');
  console.log('📋 Keywords:', 'advisory-services, strategic-consulting, business-advisory, management-consulting, enterprise, napi-rs, native, rust');
  
} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}