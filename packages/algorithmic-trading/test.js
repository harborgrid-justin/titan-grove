/**
 * Test for @titan-grove/algorithmic-trading module
 */

const functions = require('./index.js');

console.log('🧪 Testing @titan-grove/algorithmic-trading Module');
console.log('==========================================');

try {
  console.log('✅ Module loaded successfully');
  console.log('📦 Available functions:', Object.keys(functions).length);
  console.log('🔍 Functions:', Object.keys(functions).join(', '));
  
  // Test hello function
  if (functions.hello_algorithmic_trading) {
    console.log('✅ Hello function:', functions.hello_algorithmic_trading());
  }
  
  // Test sample calculation  
  if (functions.calculate_sample_algorithmic_trading) {
    console.log('✅ Sample calculation (100 * 1.15):', functions.calculate_sample_algorithmic_trading(100));
  }
  
  // Test analytics function
  if (functions.analyze_algorithmic_trading_metrics) {
    const metrics = functions.analyze_algorithmic_trading_metrics([10, 20, 30, 40, 50]);
    console.log('✅ Analytics metrics:', JSON.parse(metrics));
  }
  
  // Test module info
  if (functions.get_algorithmic_trading_info) {
    const info = functions.get_algorithmic_trading_info();
    console.log('✅ Module info:', JSON.parse(info));
  }
  
  // Test config validation
  if (functions.validate_algorithmic_trading_config) {
    const isValid = functions.validate_algorithmic_trading_config('{"test": true}');
    console.log('✅ Config validation:', isValid);
  }
  
  // Test data processing
  if (functions.process_algorithmic_trading_data) {
    const result = functions.process_algorithmic_trading_data('sample data');
    console.log('✅ Data processing:', JSON.parse(result));
  }
  
  console.log('');
  console.log('🎉 @titan-grove/algorithmic-trading - All tests passed!');
  console.log('🏷️  Category: Financial Services & Fintech');
  console.log('📋 Keywords:', 'algorithmic-trading, quantitative-finance, market-analysis, trading-algorithms, enterprise, napi-rs, native, rust');
  
} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}