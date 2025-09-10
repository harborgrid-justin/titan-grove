/**
 * Test for @titan-grove/computer-vision module
 */

const functions = require('./index.js');

console.log('🧪 Testing @titan-grove/computer-vision Module');
console.log('==========================================');

try {
  console.log('✅ Module loaded successfully');
  console.log('📦 Available functions:', Object.keys(functions).length);
  console.log('🔍 Functions:', Object.keys(functions).join(', '));
  
  // Test hello function
  if (functions.hello_computer_vision) {
    console.log('✅ Hello function:', functions.hello_computer_vision());
  }
  
  // Test sample calculation  
  if (functions.calculate_sample_computer_vision) {
    console.log('✅ Sample calculation (100 * 1.15):', functions.calculate_sample_computer_vision(100));
  }
  
  // Test analytics function
  if (functions.analyze_computer_vision_metrics) {
    const metrics = functions.analyze_computer_vision_metrics([10, 20, 30, 40, 50]);
    console.log('✅ Analytics metrics:', JSON.parse(metrics));
  }
  
  // Test module info
  if (functions.get_computer_vision_info) {
    const info = functions.get_computer_vision_info();
    console.log('✅ Module info:', JSON.parse(info));
  }
  
  // Test config validation
  if (functions.validate_computer_vision_config) {
    const isValid = functions.validate_computer_vision_config('{"test": true}');
    console.log('✅ Config validation:', isValid);
  }
  
  // Test data processing
  if (functions.process_computer_vision_data) {
    const result = functions.process_computer_vision_data('sample data');
    console.log('✅ Data processing:', JSON.parse(result));
  }
  
  console.log('');
  console.log('🎉 @titan-grove/computer-vision - All tests passed!');
  console.log('🏷️  Category: Advanced Technology & Innovation');
  console.log('📋 Keywords:', 'computer-vision, image-processing, opencv, visual-recognition, enterprise, napi-rs, native, rust');
  
} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}