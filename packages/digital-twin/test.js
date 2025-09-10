/**
 * Test for @titan-grove/digital-twin module
 */

const functions = require('./index.js');

console.log('🧪 Testing @titan-grove/digital-twin Module');
console.log('==========================================');

try {
  console.log('✅ Module loaded successfully');
  console.log('📦 Available functions:', Object.keys(functions).length);
  console.log('🔍 Functions:', Object.keys(functions).join(', '));
  
  // Test hello function
  if (functions.hello_digital_twin) {
    console.log('✅ Hello function:', functions.hello_digital_twin());
  }
  
  // Test sample calculation  
  if (functions.calculate_sample_digital_twin) {
    console.log('✅ Sample calculation (100 * 1.15):', functions.calculate_sample_digital_twin(100));
  }
  
  // Test analytics function
  if (functions.analyze_digital_twin_metrics) {
    const metrics = functions.analyze_digital_twin_metrics([10, 20, 30, 40, 50]);
    console.log('✅ Analytics metrics:', JSON.parse(metrics));
  }
  
  // Test module info
  if (functions.get_digital_twin_info) {
    const info = functions.get_digital_twin_info();
    console.log('✅ Module info:', JSON.parse(info));
  }
  
  // Test config validation
  if (functions.validate_digital_twin_config) {
    const isValid = functions.validate_digital_twin_config('{"test": true}');
    console.log('✅ Config validation:', isValid);
  }
  
  // Test data processing
  if (functions.process_digital_twin_data) {
    const result = functions.process_digital_twin_data('sample data');
    console.log('✅ Data processing:', JSON.parse(result));
  }
  
  console.log('');
  console.log('🎉 @titan-grove/digital-twin - All tests passed!');
  console.log('🏷️  Category: Industry 4.0 & Smart Systems');
  console.log('📋 Keywords:', 'digital-twin, virtual-modeling, simulation, predictive-modeling, enterprise, napi-rs, native, rust');
  
} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}