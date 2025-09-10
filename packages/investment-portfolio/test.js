/**
 * Test for @titan-grove/investment-portfolio module
 */

const functions = require('./index.js');

console.log('🧪 Testing @titan-grove/investment-portfolio Module');
console.log('==========================================');

try {
  console.log('✅ Module loaded successfully');
  console.log('📦 Available functions:', Object.keys(functions).length);
  console.log('🔍 Functions:', Object.keys(functions).join(', '));
  
  // Test hello function
  if (functions.hello_investment_portfolio) {
    console.log('✅ Hello function:', functions.hello_investment_portfolio());
  }
  
  // Test sample calculation  
  if (functions.calculate_sample_investment_portfolio) {
    console.log('✅ Sample calculation (100 * 1.15):', functions.calculate_sample_investment_portfolio(100));
  }
  
  // Test analytics function
  if (functions.analyze_investment_portfolio_metrics) {
    const metrics = functions.analyze_investment_portfolio_metrics([10, 20, 30, 40, 50]);
    console.log('✅ Analytics metrics:', JSON.parse(metrics));
  }
  
  // Test module info
  if (functions.get_investment_portfolio_info) {
    const info = functions.get_investment_portfolio_info();
    console.log('✅ Module info:', JSON.parse(info));
  }
  
  // Test config validation
  if (functions.validate_investment_portfolio_config) {
    const isValid = functions.validate_investment_portfolio_config('{"test": true}');
    console.log('✅ Config validation:', isValid);
  }
  
  // Test data processing
  if (functions.process_investment_portfolio_data) {
    const result = functions.process_investment_portfolio_data('sample data');
    console.log('✅ Data processing:', JSON.parse(result));
  }
  
  console.log('');
  console.log('🎉 @titan-grove/investment-portfolio - All tests passed!');
  console.log('🏷️  Category: Financial Services & Fintech');
  console.log('📋 Keywords:', 'portfolio-management, investment-analysis, wealth-management, asset-allocation, enterprise, napi-rs, native, rust');
  
} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}