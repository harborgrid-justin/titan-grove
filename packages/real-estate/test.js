#!/usr/bin/env node

const { Real-estateRecord } = require('./index.js');

console.log('🧪 Testing @titan-grove/real-estate');
console.log('===============================');

try {
  // Test record creation
  const record = new Real-estateRecord(
    'Test Real Estate Management',
    'Test description for Real Estate Management',
    'Active'
  );
  
  console.log('✅ Record creation:', record.name);
  
  // Test status update
  record.updateStatus('Updated');
  console.log('✅ Status update:', record.status);
  
  // Test age calculation
  const age = record.getAgeInDays();
  console.log('✅ Age calculation:', age, 'days');
  
  console.log('🎉 All tests passed for @titan-grove/real-estate');
  
} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}
