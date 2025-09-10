#!/usr/bin/env node

const { NonprofitRecord } = require('./index.js');

console.log('🧪 Testing @titan-grove/nonprofit');
console.log('===============================');

try {
  // Test record creation
  const record = new NonprofitRecord(
    'Test Nonprofit Management',
    'Test description for Nonprofit Management',
    'Active'
  );
  
  console.log('✅ Record creation:', record.name);
  
  // Test status update
  record.updateStatus('Updated');
  console.log('✅ Status update:', record.status);
  
  // Test age calculation
  const age = record.getAgeInDays();
  console.log('✅ Age calculation:', age, 'days');
  
  console.log('🎉 All tests passed for @titan-grove/nonprofit');
  
} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}
