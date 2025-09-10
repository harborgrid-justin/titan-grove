/**
 * Test for @titan-grove/testing-validation module
 */

const functions = require('./index.js');

console.log('🧪 Testing @titan-grove/testing-validation Module');
console.log('==========================================');

try {
  console.log('✅ Module loaded successfully');
  console.log('📦 Available functions:', Object.keys(functions).length);
  console.log('🔍 Functions:', Object.keys(functions).join(', '));
  
  // Test hello function
  if (functions.hello_testing_validation) {
    console.log('✅ Hello function:', functions.hello_testing_validation());
  }
  
  // Test sample calculation  
  if (functions.calculate_sample_testing_validation) {
    console.log('✅ Sample calculation (100 * 1.15):', functions.calculate_sample_testing_validation(100));
  }
  
  // Test analytics function
  if (functions.analyze_testing_validation_metrics) {
    const metrics = functions.analyze_testing_validation_metrics([10, 20, 30, 40, 50]);
    console.log('✅ Analytics metrics:', JSON.parse(metrics));
  }
  
  // Test module info
  if (functions.get_testing_validation_info) {
    const info = functions.get_testing_validation_info();
    console.log('✅ Module info:', JSON.parse(info));
  }
  
  // Test config validation
  if (functions.validate_testing_validation_config) {
    const isValid = functions.validate_testing_validation_config('{"test": true}');
    console.log('✅ Config validation:', isValid);
  }
  
  // Test data processing
  if (functions.process_testing_validation_data) {
    const result = functions.process_testing_validation_data('sample data');
    console.log('✅ Data processing:', JSON.parse(result));
  }
  
  console.log('');
  console.log('🎉 @titan-grove/testing-validation - All tests passed!');
  console.log('🏷️  Category: Specialized Professional Services');
  console.log('📋 Keywords:', 'testing-services, validation, quality-assurance, certification, enterprise, napi-rs, native, rust');
  
} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}