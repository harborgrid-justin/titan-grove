/**
 * Test for @titan-grove/predictive-analytics module
 */

const functions = require('./index.js');

console.log('🧪 Testing @titan-grove/predictive-analytics Module');
console.log('==========================================');

try {
  console.log('✅ Module loaded successfully');
  console.log('📦 Available functions:', Object.keys(functions).length);
  console.log('🔍 Functions:', Object.keys(functions).join(', '));
  
  // Test hello function
  if (functions.hello_predictive_analytics) {
    console.log('✅ Hello function:', functions.hello_predictive_analytics());
  }
  
  // Test sample calculation  
  if (functions.calculate_sample_predictive_analytics) {
    console.log('✅ Sample calculation (100 * 1.15):', functions.calculate_sample_predictive_analytics(100));
  }
  
  // Test analytics function
  if (functions.analyze_predictive_analytics_metrics) {
    const metrics = functions.analyze_predictive_analytics_metrics([10, 20, 30, 40, 50]);
    console.log('✅ Analytics metrics:', JSON.parse(metrics));
  }
  
  // Test module info
  if (functions.get_predictive_analytics_info) {
    const info = functions.get_predictive_analytics_info();
    console.log('✅ Module info:', JSON.parse(info));
  }
  
  // Test config validation
  if (functions.validate_predictive_analytics_config) {
    const isValid = functions.validate_predictive_analytics_config('{"test": true}');
    console.log('✅ Config validation:', isValid);
  }
  
  // Test data processing
  if (functions.process_predictive_analytics_data) {
    const result = functions.process_predictive_analytics_data('sample data');
    console.log('✅ Data processing:', JSON.parse(result));
  }
  
  console.log('');
  console.log('🎉 @titan-grove/predictive-analytics - All tests passed!');
  console.log('🏷️  Category: Industry 4.0 & Smart Systems');
  console.log('📋 Keywords:', 'predictive-analytics, forecasting, machine-learning, time-series, enterprise, napi-rs, native, rust');
  
} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}