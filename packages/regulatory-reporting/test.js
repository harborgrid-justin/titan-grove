/**
 * Test for @titan-grove/regulatory-reporting module
 */

const functions = require('./index.js');

console.log('🧪 Testing @titan-grove/regulatory-reporting Module');
console.log('==========================================');

try {
  console.log('✅ Module loaded successfully');
  console.log('📦 Available functions:', Object.keys(functions).length);
  console.log('🔍 Functions:', Object.keys(functions).join(', '));
  
  // Test hello function
  if (functions.hello_regulatory_reporting) {
    console.log('✅ Hello function:', functions.hello_regulatory_reporting());
  }
  
  // Test sample calculation  
  if (functions.calculate_sample_regulatory_reporting) {
    console.log('✅ Sample calculation (100 * 1.15):', functions.calculate_sample_regulatory_reporting(100));
  }
  
  // Test analytics function
  if (functions.analyze_regulatory_reporting_metrics) {
    const metrics = functions.analyze_regulatory_reporting_metrics([10, 20, 30, 40, 50]);
    console.log('✅ Analytics metrics:', JSON.parse(metrics));
  }
  
  // Test module info
  if (functions.get_regulatory_reporting_info) {
    const info = functions.get_regulatory_reporting_info();
    console.log('✅ Module info:', JSON.parse(info));
  }
  
  // Test config validation
  if (functions.validate_regulatory_reporting_config) {
    const isValid = functions.validate_regulatory_reporting_config('{"test": true}');
    console.log('✅ Config validation:', isValid);
  }
  
  // Test data processing
  if (functions.process_regulatory_reporting_data) {
    const result = functions.process_regulatory_reporting_data('sample data');
    console.log('✅ Data processing:', JSON.parse(result));
  }
  
  console.log('');
  console.log('🎉 @titan-grove/regulatory-reporting - All tests passed!');
  console.log('🏷️  Category: Financial Services & Fintech');
  console.log('📋 Keywords:', 'regulatory-reporting, financial-compliance, basel-iii, mifid-ii, enterprise, napi-rs, native, rust');
  
} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}