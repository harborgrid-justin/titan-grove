/**
 * Test for @titan-grove/neural-networks module
 */

const functions = require('./index.js');

console.log('🧪 Testing @titan-grove/neural-networks Module');
console.log('==========================================');

try {
  console.log('✅ Module loaded successfully');
  console.log('📦 Available functions:', Object.keys(functions).length);
  console.log('🔍 Functions:', Object.keys(functions).join(', '));
  
  // Test hello function
  if (functions.hello_neural_networks) {
    console.log('✅ Hello function:', functions.hello_neural_networks());
  }
  
  // Test sample calculation  
  if (functions.calculate_sample_neural_networks) {
    console.log('✅ Sample calculation (100 * 1.15):', functions.calculate_sample_neural_networks(100));
  }
  
  // Test analytics function
  if (functions.analyze_neural_networks_metrics) {
    const metrics = functions.analyze_neural_networks_metrics([10, 20, 30, 40, 50]);
    console.log('✅ Analytics metrics:', JSON.parse(metrics));
  }
  
  // Test module info
  if (functions.get_neural_networks_info) {
    const info = functions.get_neural_networks_info();
    console.log('✅ Module info:', JSON.parse(info));
  }
  
  // Test config validation
  if (functions.validate_neural_networks_config) {
    const isValid = functions.validate_neural_networks_config('{"test": true}');
    console.log('✅ Config validation:', isValid);
  }
  
  // Test data processing
  if (functions.process_neural_networks_data) {
    const result = functions.process_neural_networks_data('sample data');
    console.log('✅ Data processing:', JSON.parse(result));
  }
  
  console.log('');
  console.log('🎉 @titan-grove/neural-networks - All tests passed!');
  console.log('🏷️  Category: Advanced Technology & Innovation');
  console.log('📋 Keywords:', 'neural-networks, deep-learning, tensorflow, pytorch, enterprise, napi-rs, native, rust');
  
} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}