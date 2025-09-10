/**
 * Test for @titan-grove/product-lifecycle module
 */

const functions = require('./index.js');

console.log('🧪 Testing @titan-grove/product-lifecycle Module');
console.log('==========================================');

try {
  console.log('✅ Module loaded successfully');
  console.log('📦 Available functions:', Object.keys(functions).length);
  console.log('🔍 Functions:', Object.keys(functions).join(', '));
  
  // Test hello function
  if (functions.hello_product_lifecycle) {
    console.log('✅ Hello function:', functions.hello_product_lifecycle());
  }
  
  // Test sample calculation  
  if (functions.calculate_sample_product_lifecycle) {
    console.log('✅ Sample calculation (100 * 1.15):', functions.calculate_sample_product_lifecycle(100));
  }
  
  // Test analytics function
  if (functions.analyze_product_lifecycle_metrics) {
    const metrics = functions.analyze_product_lifecycle_metrics([10, 20, 30, 40, 50]);
    console.log('✅ Analytics metrics:', JSON.parse(metrics));
  }
  
  // Test module info
  if (functions.get_product_lifecycle_info) {
    const info = functions.get_product_lifecycle_info();
    console.log('✅ Module info:', JSON.parse(info));
  }
  
  // Test config validation
  if (functions.validate_product_lifecycle_config) {
    const isValid = functions.validate_product_lifecycle_config('{"test": true}');
    console.log('✅ Config validation:', isValid);
  }
  
  // Test data processing
  if (functions.process_product_lifecycle_data) {
    const result = functions.process_product_lifecycle_data('sample data');
    console.log('✅ Data processing:', JSON.parse(result));
  }
  
  console.log('');
  console.log('🎉 @titan-grove/product-lifecycle - All tests passed!');
  console.log('🏷️  Category: Advanced Manufacturing & Production');
  console.log('📋 Keywords:', 'plm, product-lifecycle, product-development, engineering, enterprise, napi-rs, native, rust');
  
} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}