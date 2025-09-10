#!/usr/bin/env node

const { InsuranceRecord } = require('./index.js');

console.log('🧪 Testing @titan-grove/insurance');
console.log('===============================');

try {
  // Test record creation
  const record = new InsuranceRecord(
    'Test Insurance Management',
    'Test description for Insurance Management',
    'Active'
  );
  
  console.log('✅ Record creation:', record.name);
  
  // Test status update
  record.updateStatus('Updated');
  console.log('✅ Status update:', record.status);
  
  // Test age calculation
  const age = record.getAgeInDays();
  console.log('✅ Age calculation:', age, 'days');
  
  console.log('🎉 All tests passed for @titan-grove/insurance');
  
} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}
