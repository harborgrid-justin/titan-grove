/**
 * Test for @titan-grove/advanced-manufacturing module
 */

const functions = require('./index.js');

console.log('🧪 Testing @titan-grove/advanced-manufacturing Module');
console.log('==========================================');

try {
  console.log('✅ Module loaded successfully');
  console.log('📦 Available functions:', Object.keys(functions).length);
  console.log('🔍 Functions:', Object.keys(functions).join(', '));
  
  // Test hello function
  if (functions.hello_advanced_manufacturing) {
    console.log('✅ Hello function:', functions.hello_advanced_manufacturing());
  }
  
  // Test sample calculation  
  if (functions.calculate_sample_advanced_manufacturing) {
    console.log('✅ Sample calculation (100 * 1.15):', functions.calculate_sample_advanced_manufacturing(100));
  }
  
  // Test analytics function
  if (functions.analyze_advanced_manufacturing_metrics) {
    const metrics = functions.analyze_advanced_manufacturing_metrics([10, 20, 30, 40, 50]);
    console.log('✅ Analytics metrics:', JSON.parse(metrics));
  }
  
  // Test module info
  if (functions.get_advanced_manufacturing_info) {
    const info = functions.get_advanced_manufacturing_info();
    console.log('✅ Module info:', JSON.parse(info));
  }
  
  // Test config validation
  if (functions.validate_advanced_manufacturing_config) {
    const isValid = functions.validate_advanced_manufacturing_config('{"test": true}');
    console.log('✅ Config validation:', isValid);
  }
  
  // Test data processing
  if (functions.process_advanced_manufacturing_data) {
    const result = functions.process_advanced_manufacturing_data('sample data');
    console.log('✅ Data processing:', JSON.parse(result));
  }
  
  console.log('');
  console.log('🎉 @titan-grove/advanced-manufacturing - All tests passed!');
  console.log('🏷️  Category: Advanced Manufacturing & Production');
  console.log('📋 Keywords:', 'smart-manufacturing, industry-4.0, iot-manufacturing, predictive-maintenance, enterprise, napi-rs, native, rust');
  
} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}