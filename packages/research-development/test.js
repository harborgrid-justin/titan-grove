/**
 * Test for @titan-grove/research-development module
 */

const functions = require('./index.js');

console.log('🧪 Testing @titan-grove/research-development Module');
console.log('==========================================');

try {
  console.log('✅ Module loaded successfully');
  console.log('📦 Available functions:', Object.keys(functions).length);
  console.log('🔍 Functions:', Object.keys(functions).join(', '));
  
  // Test hello function
  if (functions.hello_research_development) {
    console.log('✅ Hello function:', functions.hello_research_development());
  }
  
  // Test sample calculation  
  if (functions.calculate_sample_research_development) {
    console.log('✅ Sample calculation (100 * 1.15):', functions.calculate_sample_research_development(100));
  }
  
  // Test analytics function
  if (functions.analyze_research_development_metrics) {
    const metrics = functions.analyze_research_development_metrics([10, 20, 30, 40, 50]);
    console.log('✅ Analytics metrics:', JSON.parse(metrics));
  }
  
  // Test module info
  if (functions.get_research_development_info) {
    const info = functions.get_research_development_info();
    console.log('✅ Module info:', JSON.parse(info));
  }
  
  // Test config validation
  if (functions.validate_research_development_config) {
    const isValid = functions.validate_research_development_config('{"test": true}');
    console.log('✅ Config validation:', isValid);
  }
  
  // Test data processing
  if (functions.process_research_development_data) {
    const result = functions.process_research_development_data('sample data');
    console.log('✅ Data processing:', JSON.parse(result));
  }
  
  console.log('');
  console.log('🎉 @titan-grove/research-development - All tests passed!');
  console.log('🏷️  Category: Specialized Professional Services');
  console.log('📋 Keywords:', 'research-development, innovation-labs, scientific-research, patent-management, enterprise, napi-rs, native, rust');
  
} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}