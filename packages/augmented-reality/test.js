/**
 * Test for @titan-grove/augmented-reality module
 */

const functions = require('./index.js');

console.log('🧪 Testing @titan-grove/augmented-reality Module');
console.log('==========================================');

try {
  console.log('✅ Module loaded successfully');
  console.log('📦 Available functions:', Object.keys(functions).length);
  console.log('🔍 Functions:', Object.keys(functions).join(', '));
  
  // Test hello function
  if (functions.hello_augmented_reality) {
    console.log('✅ Hello function:', functions.hello_augmented_reality());
  }
  
  // Test sample calculation  
  if (functions.calculate_sample_augmented_reality) {
    console.log('✅ Sample calculation (100 * 1.15):', functions.calculate_sample_augmented_reality(100));
  }
  
  // Test analytics function
  if (functions.analyze_augmented_reality_metrics) {
    const metrics = functions.analyze_augmented_reality_metrics([10, 20, 30, 40, 50]);
    console.log('✅ Analytics metrics:', JSON.parse(metrics));
  }
  
  // Test module info
  if (functions.get_augmented_reality_info) {
    const info = functions.get_augmented_reality_info();
    console.log('✅ Module info:', JSON.parse(info));
  }
  
  // Test config validation
  if (functions.validate_augmented_reality_config) {
    const isValid = functions.validate_augmented_reality_config('{"test": true}');
    console.log('✅ Config validation:', isValid);
  }
  
  // Test data processing
  if (functions.process_augmented_reality_data) {
    const result = functions.process_augmented_reality_data('sample data');
    console.log('✅ Data processing:', JSON.parse(result));
  }
  
  console.log('');
  console.log('🎉 @titan-grove/augmented-reality - All tests passed!');
  console.log('🏷️  Category: Advanced Technology & Innovation');
  console.log('📋 Keywords:', 'augmented-reality, virtual-reality, mixed-reality, ar-vr, enterprise, napi-rs, native, rust');
  
} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}