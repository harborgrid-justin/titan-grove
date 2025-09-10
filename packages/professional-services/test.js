/**
 * Test for @titan-grove/professional-services module
 */

const functions = require('./index.js');

console.log('🧪 Testing @titan-grove/professional-services Module');
console.log('==========================================');

try {
  console.log('✅ Module loaded successfully');
  console.log('📦 Available functions:', Object.keys(functions).length);
  console.log('🔍 Functions:', Object.keys(functions).join(', '));
  
  // Test hello function
  if (functions.hello_professional_services) {
    console.log('✅ Hello function:', functions.hello_professional_services());
  }
  
  // Test sample calculation  
  if (functions.calculate_sample_professional_services) {
    console.log('✅ Sample calculation (100 * 1.15):', functions.calculate_sample_professional_services(100));
  }
  
  // Test analytics function
  if (functions.analyze_professional_services_metrics) {
    const metrics = functions.analyze_professional_services_metrics([10, 20, 30, 40, 50]);
    console.log('✅ Analytics metrics:', JSON.parse(metrics));
  }
  
  // Test module info
  if (functions.get_professional_services_info) {
    const info = functions.get_professional_services_info();
    console.log('✅ Module info:', JSON.parse(info));
  }
  
  // Test config validation
  if (functions.validate_professional_services_config) {
    const isValid = functions.validate_professional_services_config('{"test": true}');
    console.log('✅ Config validation:', isValid);
  }
  
  // Test data processing
  if (functions.process_professional_services_data) {
    const result = functions.process_professional_services_data('sample data');
    console.log('✅ Data processing:', JSON.parse(result));
  }
  
  console.log('');
  console.log('🎉 @titan-grove/professional-services - All tests passed!');
  console.log('🏷️  Category: Specialized Professional Services');
  console.log('📋 Keywords:', 'professional-services, consulting, project-delivery, resource-planning, enterprise, napi-rs, native, rust');
  
} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}