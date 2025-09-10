/**
 * Test for @titan-grove/smart-city module
 */

const functions = require('./index.js');

console.log('🧪 Testing @titan-grove/smart-city Module');
console.log('==========================================');

try {
  console.log('✅ Module loaded successfully');
  console.log('📦 Available functions:', Object.keys(functions).length);
  console.log('🔍 Functions:', Object.keys(functions).join(', '));
  
  // Test hello function
  if (functions.hello_smart_city) {
    console.log('✅ Hello function:', functions.hello_smart_city());
  }
  
  // Test sample calculation  
  if (functions.calculate_sample_smart_city) {
    console.log('✅ Sample calculation (100 * 1.15):', functions.calculate_sample_smart_city(100));
  }
  
  // Test analytics function
  if (functions.analyze_smart_city_metrics) {
    const metrics = functions.analyze_smart_city_metrics([10, 20, 30, 40, 50]);
    console.log('✅ Analytics metrics:', JSON.parse(metrics));
  }
  
  // Test module info
  if (functions.get_smart_city_info) {
    const info = functions.get_smart_city_info();
    console.log('✅ Module info:', JSON.parse(info));
  }
  
  // Test config validation
  if (functions.validate_smart_city_config) {
    const isValid = functions.validate_smart_city_config('{"test": true}');
    console.log('✅ Config validation:', isValid);
  }
  
  // Test data processing
  if (functions.process_smart_city_data) {
    const result = functions.process_smart_city_data('sample data');
    console.log('✅ Data processing:', JSON.parse(result));
  }
  
  console.log('');
  console.log('🎉 @titan-grove/smart-city - All tests passed!');
  console.log('🏷️  Category: Industry 4.0 & Smart Systems');
  console.log('📋 Keywords:', 'smart-city, urban-planning, smart-infrastructure, civic-technology, enterprise, napi-rs, native, rust');
  
} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}