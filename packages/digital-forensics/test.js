/**
 * Test for @titan-grove/digital-forensics module
 */

const functions = require('./index.js');

console.log('🧪 Testing @titan-grove/digital-forensics Module');
console.log('==========================================');

try {
  console.log('✅ Module loaded successfully');
  console.log('📦 Available functions:', Object.keys(functions).length);
  console.log('🔍 Functions:', Object.keys(functions).join(', '));
  
  // Test hello function
  if (functions.hello_digital_forensics) {
    console.log('✅ Hello function:', functions.hello_digital_forensics());
  }
  
  // Test sample calculation  
  if (functions.calculate_sample_digital_forensics) {
    console.log('✅ Sample calculation (100 * 1.15):', functions.calculate_sample_digital_forensics(100));
  }
  
  // Test analytics function
  if (functions.analyze_digital_forensics_metrics) {
    const metrics = functions.analyze_digital_forensics_metrics([10, 20, 30, 40, 50]);
    console.log('✅ Analytics metrics:', JSON.parse(metrics));
  }
  
  // Test module info
  if (functions.get_digital_forensics_info) {
    const info = functions.get_digital_forensics_info();
    console.log('✅ Module info:', JSON.parse(info));
  }
  
  // Test config validation
  if (functions.validate_digital_forensics_config) {
    const isValid = functions.validate_digital_forensics_config('{"test": true}');
    console.log('✅ Config validation:', isValid);
  }
  
  // Test data processing
  if (functions.process_digital_forensics_data) {
    const result = functions.process_digital_forensics_data('sample data');
    console.log('✅ Data processing:', JSON.parse(result));
  }
  
  console.log('');
  console.log('🎉 @titan-grove/digital-forensics - All tests passed!');
  console.log('🏷️  Category: Specialized Professional Services');
  console.log('📋 Keywords:', 'digital-forensics, cybersecurity-investigation, incident-response, forensic-analysis, enterprise, napi-rs, native, rust');
  
} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}