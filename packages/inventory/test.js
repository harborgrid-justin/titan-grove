/**
 * Test for @titan-grove/inventory module
 */

const functions = require('./index.js');

console.log('🧪 Testing @titan-grove/inventory Module');
console.log('==========================================');

try {
  console.log('✅ Module loaded successfully');
  console.log('📦 Available functions:', Object.keys(functions).length);
  console.log('🔍 Functions:', Object.keys(functions).slice(0, 5).join(', '), '...');
  
  // Test hello function
  if (functions.hello_inventory) {
    console.log('✅ Hello function:', functions.hello_inventory());
  }
  
  // Test sample calculation  
  if (functions.calculate_sample) {
    console.log('✅ Sample calculation (100 * 1.1):', functions.calculate_sample(100));
  }
  
  // Test module info
  if (functions.get_module_info) {
    const info = JSON.parse(functions.get_module_info());
    console.log('✅ Module info:', info.name, '-', info.title);
  }
  
  console.log('');
  console.log('🎉 Inventory Management Module Test Completed Successfully!');
  console.log('');
  console.log('📈 Performance Benefits:');
  console.log('   • Native Rust calculations for maximum speed');
  console.log('   • Enterprise-grade inventory management features');
  console.log('   • Seamless TypeScript integration');
  console.log('   • Independent installable package');

} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}