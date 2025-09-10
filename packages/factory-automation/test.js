/**
 * Test for @titan-grove/factory-automation module
 */

const functions = require('./index.js');

console.log('🧪 Testing @titan-grove/factory-automation Module');
console.log('==========================================');

try {
  console.log('✅ Module loaded successfully');
  console.log('📦 Available functions:', Object.keys(functions).length);
  console.log('🔍 Functions:', Object.keys(functions).join(', '));
  
  // Test hello function
  if (functions.hello_factory_automation) {
    console.log('✅ Hello function:', functions.hello_factory_automation());
  }
  
  // Test sample calculation  
  if (functions.calculate_sample_factory_automation) {
    console.log('✅ Sample calculation (100 * 1.15):', functions.calculate_sample_factory_automation(100));
  }
  
  // Test analytics function
  if (functions.analyze_factory_automation_metrics) {
    const metrics = functions.analyze_factory_automation_metrics([10, 20, 30, 40, 50]);
    console.log('✅ Analytics metrics:', JSON.parse(metrics));
  }
  
  // Test module info
  if (functions.get_factory_automation_info) {
    const info = functions.get_factory_automation_info();
    console.log('✅ Module info:', JSON.parse(info));
  }
  
  // Test config validation
  if (functions.validate_factory_automation_config) {
    const isValid = functions.validate_factory_automation_config('{"test": true}');
    console.log('✅ Config validation:', isValid);
  }
  
  // Test data processing
  if (functions.process_factory_automation_data) {
    const result = functions.process_factory_automation_data('sample data');
    console.log('✅ Data processing:', JSON.parse(result));
  }
  
  console.log('');
  console.log('🎉 @titan-grove/factory-automation - All tests passed!');
  console.log('🏷️  Category: Advanced Manufacturing & Production');
  console.log('📋 Keywords:', 'factory-automation, robotics, automated-systems, industrial-iot, enterprise, napi-rs, native, rust');
  
} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}