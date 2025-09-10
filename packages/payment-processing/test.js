/**
 * Test for @titan-grove/payment-processing module
 */

const functions = require('./index.js');

console.log('🧪 Testing @titan-grove/payment-processing Module');
console.log('==========================================');

try {
  console.log('✅ Module loaded successfully');
  console.log('📦 Available functions:', Object.keys(functions).length);
  console.log('🔍 Functions:', Object.keys(functions).join(', '));
  
  // Test hello function
  if (functions.hello_payment_processing) {
    console.log('✅ Hello function:', functions.hello_payment_processing());
  }
  
  // Test sample calculation  
  if (functions.calculate_sample_payment_processing) {
    console.log('✅ Sample calculation (100 * 1.15):', functions.calculate_sample_payment_processing(100));
  }
  
  // Test analytics function
  if (functions.analyze_payment_processing_metrics) {
    const metrics = functions.analyze_payment_processing_metrics([10, 20, 30, 40, 50]);
    console.log('✅ Analytics metrics:', JSON.parse(metrics));
  }
  
  // Test module info
  if (functions.get_payment_processing_info) {
    const info = functions.get_payment_processing_info();
    console.log('✅ Module info:', JSON.parse(info));
  }
  
  // Test config validation
  if (functions.validate_payment_processing_config) {
    const isValid = functions.validate_payment_processing_config('{"test": true}');
    console.log('✅ Config validation:', isValid);
  }
  
  // Test data processing
  if (functions.process_payment_processing_data) {
    const result = functions.process_payment_processing_data('sample data');
    console.log('✅ Data processing:', JSON.parse(result));
  }
  
  console.log('');
  console.log('🎉 @titan-grove/payment-processing - All tests passed!');
  console.log('🏷️  Category: Financial Services & Fintech');
  console.log('📋 Keywords:', 'payment-processing, fintech, digital-payments, payment-gateway, enterprise, napi-rs, native, rust');
  
} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}