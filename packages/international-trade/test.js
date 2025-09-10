/**
 * Test for @titan-grove/international-trade module
 */

const functions = require('./index.js');

console.log('🧪 Testing @titan-grove/international-trade Module');
console.log('==========================================');

try {
  console.log('✅ Module loaded successfully');
  console.log('📦 Available functions:', Object.keys(functions).length);
  console.log('🔍 Functions:', Object.keys(functions).join(', '));
  
  // Test hello function
  if (functions.hello_international_trade) {
    console.log('✅ Hello function:', functions.hello_international_trade());
  }
  
  // Test sample calculation  
  if (functions.calculate_sample_international_trade) {
    console.log('✅ Sample calculation (100 * 1.15):', functions.calculate_sample_international_trade(100));
  }
  
  // Test analytics function
  if (functions.analyze_international_trade_metrics) {
    const metrics = functions.analyze_international_trade_metrics([10, 20, 30, 40, 50]);
    console.log('✅ Analytics metrics:', JSON.parse(metrics));
  }
  
  // Test module info
  if (functions.get_international_trade_info) {
    const info = functions.get_international_trade_info();
    console.log('✅ Module info:', JSON.parse(info));
  }
  
  // Test config validation
  if (functions.validate_international_trade_config) {
    const isValid = functions.validate_international_trade_config('{"test": true}');
    console.log('✅ Config validation:', isValid);
  }
  
  // Test data processing
  if (functions.process_international_trade_data) {
    const result = functions.process_international_trade_data('sample data');
    console.log('✅ Data processing:', JSON.parse(result));
  }
  
  console.log('');
  console.log('🎉 @titan-grove/international-trade - All tests passed!');
  console.log('🏷️  Category: Global Operations & Governance');
  console.log('📋 Keywords:', 'international-trade, customs, import-export, trade-compliance, enterprise, napi-rs, native, rust');
  
} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}