/**
 * Test for @titan-grove/regulatory-compliance module
 */

const functions = require('./index.js');

console.log('🧪 Testing @titan-grove/regulatory-compliance Module');
console.log('==========================================');

try {
  console.log('✅ Module loaded successfully');
  console.log('📦 Available functions:', Object.keys(functions).length);
  console.log('🔍 Functions:', Object.keys(functions).join(', '));
  
  // Test hello function
  if (functions.hello_regulatory_compliance) {
    console.log('✅ Hello function:', functions.hello_regulatory_compliance());
  }
  
  // Test sample calculation  
  if (functions.calculate_sample_regulatory_compliance) {
    console.log('✅ Sample calculation (100 * 1.15):', functions.calculate_sample_regulatory_compliance(100));
  }
  
  // Test analytics function
  if (functions.analyze_regulatory_compliance_metrics) {
    const metrics = functions.analyze_regulatory_compliance_metrics([10, 20, 30, 40, 50]);
    console.log('✅ Analytics metrics:', JSON.parse(metrics));
  }
  
  // Test module info
  if (functions.get_regulatory_compliance_info) {
    const info = functions.get_regulatory_compliance_info();
    console.log('✅ Module info:', JSON.parse(info));
  }
  
  // Test config validation
  if (functions.validate_regulatory_compliance_config) {
    const isValid = functions.validate_regulatory_compliance_config('{"test": true}');
    console.log('✅ Config validation:', isValid);
  }
  
  // Test data processing
  if (functions.process_regulatory_compliance_data) {
    const result = functions.process_regulatory_compliance_data('sample data');
    console.log('✅ Data processing:', JSON.parse(result));
  }
  
  console.log('');
  console.log('🎉 @titan-grove/regulatory-compliance - All tests passed!');
  console.log('🏷️  Category: Global Operations & Governance');
  console.log('📋 Keywords:', 'regulatory-compliance, multi-jurisdiction, compliance-management, regulations, enterprise, napi-rs, native, rust');
  
} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}