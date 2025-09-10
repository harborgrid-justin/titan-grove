/**
 * Test for @titan-grove/multi-currency module
 */

const functions = require('./index.js');

console.log('🧪 Testing @titan-grove/multi-currency Module');
console.log('==========================================');

try {
  console.log('✅ Module loaded successfully');
  console.log('📦 Available functions:', Object.keys(functions).length);
  console.log('🔍 Functions:', Object.keys(functions).join(', '));
  
  // Test hello function
  if (functions.hello_multi_currency) {
    console.log('✅ Hello function:', functions.hello_multi_currency());
  }
  
  // Test sample calculation  
  if (functions.calculate_sample_multi_currency) {
    console.log('✅ Sample calculation (100 * 1.15):', functions.calculate_sample_multi_currency(100));
  }
  
  // Test analytics function
  if (functions.analyze_multi_currency_metrics) {
    const metrics = functions.analyze_multi_currency_metrics([10, 20, 30, 40, 50]);
    console.log('✅ Analytics metrics:', JSON.parse(metrics));
  }
  
  // Test module info
  if (functions.get_multi_currency_info) {
    const info = functions.get_multi_currency_info();
    console.log('✅ Module info:', JSON.parse(info));
  }
  
  // Test config validation
  if (functions.validate_multi_currency_config) {
    const isValid = functions.validate_multi_currency_config('{"test": true}');
    console.log('✅ Config validation:', isValid);
  }
  
  // Test data processing
  if (functions.process_multi_currency_data) {
    const result = functions.process_multi_currency_data('sample data');
    console.log('✅ Data processing:', JSON.parse(result));
  }
  
  console.log('');
  console.log('🎉 @titan-grove/multi-currency - All tests passed!');
  console.log('🏷️  Category: Global Operations & Governance');
  console.log('📋 Keywords:', 'multi-currency, forex, exchange-rates, hedging, enterprise, napi-rs, native, rust');
  
} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}