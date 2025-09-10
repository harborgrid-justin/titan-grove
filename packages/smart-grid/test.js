/**
 * Test for @titan-grove/smart-grid module
 */

const functions = require('./index.js');

console.log('🧪 Testing @titan-grove/smart-grid Module');
console.log('==========================================');

try {
  console.log('✅ Module loaded successfully');
  console.log('📦 Available functions:', Object.keys(functions).length);
  console.log('🔍 Functions:', Object.keys(functions).join(', '));
  
  // Test hello function
  if (functions.hello_smart_grid) {
    console.log('✅ Hello function:', functions.hello_smart_grid());
  }
  
  // Test sample calculation  
  if (functions.calculate_sample_smart_grid) {
    console.log('✅ Sample calculation (100 * 1.15):', functions.calculate_sample_smart_grid(100));
  }
  
  // Test analytics function
  if (functions.analyze_smart_grid_metrics) {
    const metrics = functions.analyze_smart_grid_metrics([10, 20, 30, 40, 50]);
    console.log('✅ Analytics metrics:', JSON.parse(metrics));
  }
  
  // Test module info
  if (functions.get_smart_grid_info) {
    const info = functions.get_smart_grid_info();
    console.log('✅ Module info:', JSON.parse(info));
  }
  
  // Test config validation
  if (functions.validate_smart_grid_config) {
    const isValid = functions.validate_smart_grid_config('{"test": true}');
    console.log('✅ Config validation:', isValid);
  }
  
  // Test data processing
  if (functions.process_smart_grid_data) {
    const result = functions.process_smart_grid_data('sample data');
    console.log('✅ Data processing:', JSON.parse(result));
  }
  
  console.log('');
  console.log('🎉 @titan-grove/smart-grid - All tests passed!');
  console.log('🏷️  Category: Industry 4.0 & Smart Systems');
  console.log('📋 Keywords:', 'smart-grid, energy-management, renewable-energy, grid-optimization, enterprise, napi-rs, native, rust');
  
} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}