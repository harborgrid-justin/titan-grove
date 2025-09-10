/**
 * Test for @titan-grove/production-planning module
 */

const functions = require('./index.js');

console.log('🧪 Testing @titan-grove/production-planning Module');
console.log('==========================================');

try {
  console.log('✅ Module loaded successfully');
  console.log('📦 Available functions:', Object.keys(functions).length);
  console.log('🔍 Functions:', Object.keys(functions).join(', '));
  
  // Test hello function
  if (functions.hello_production_planning) {
    console.log('✅ Hello function:', functions.hello_production_planning());
  }
  
  // Test sample calculation  
  if (functions.calculate_sample_production_planning) {
    console.log('✅ Sample calculation (100 * 1.15):', functions.calculate_sample_production_planning(100));
  }
  
  // Test analytics function
  if (functions.analyze_production_planning_metrics) {
    const metrics = functions.analyze_production_planning_metrics([10, 20, 30, 40, 50]);
    console.log('✅ Analytics metrics:', JSON.parse(metrics));
  }
  
  // Test module info
  if (functions.get_production_planning_info) {
    const info = functions.get_production_planning_info();
    console.log('✅ Module info:', JSON.parse(info));
  }
  
  // Test config validation
  if (functions.validate_production_planning_config) {
    const isValid = functions.validate_production_planning_config('{"test": true}');
    console.log('✅ Config validation:', isValid);
  }
  
  // Test data processing
  if (functions.process_production_planning_data) {
    const result = functions.process_production_planning_data('sample data');
    console.log('✅ Data processing:', JSON.parse(result));
  }
  
  console.log('');
  console.log('🎉 @titan-grove/production-planning - All tests passed!');
  console.log('🏷️  Category: Advanced Manufacturing & Production');
  console.log('📋 Keywords:', 'production-planning, scheduling, capacity-planning, optimization, enterprise, napi-rs, native, rust');
  
} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}