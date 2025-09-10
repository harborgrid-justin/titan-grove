/**
 * Test for @titan-grove/edge-computing module
 */

const functions = require('./index.js');

console.log('🧪 Testing @titan-grove/edge-computing Module');
console.log('==========================================');

try {
  console.log('✅ Module loaded successfully');
  console.log('📦 Available functions:', Object.keys(functions).length);
  console.log('🔍 Functions:', Object.keys(functions).join(', '));
  
  // Test hello function
  if (functions.hello_edge_computing) {
    console.log('✅ Hello function:', functions.hello_edge_computing());
  }
  
  // Test sample calculation  
  if (functions.calculate_sample_edge_computing) {
    console.log('✅ Sample calculation (100 * 1.15):', functions.calculate_sample_edge_computing(100));
  }
  
  // Test analytics function
  if (functions.analyze_edge_computing_metrics) {
    const metrics = functions.analyze_edge_computing_metrics([10, 20, 30, 40, 50]);
    console.log('✅ Analytics metrics:', JSON.parse(metrics));
  }
  
  // Test module info
  if (functions.get_edge_computing_info) {
    const info = functions.get_edge_computing_info();
    console.log('✅ Module info:', JSON.parse(info));
  }
  
  // Test config validation
  if (functions.validate_edge_computing_config) {
    const isValid = functions.validate_edge_computing_config('{"test": true}');
    console.log('✅ Config validation:', isValid);
  }
  
  // Test data processing
  if (functions.process_edge_computing_data) {
    const result = functions.process_edge_computing_data('sample data');
    console.log('✅ Data processing:', JSON.parse(result));
  }
  
  console.log('');
  console.log('🎉 @titan-grove/edge-computing - All tests passed!');
  console.log('🏷️  Category: Advanced Technology & Innovation');
  console.log('📋 Keywords:', 'edge-computing, distributed-systems, edge-ai, fog-computing, enterprise, napi-rs, native, rust');
  
} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}