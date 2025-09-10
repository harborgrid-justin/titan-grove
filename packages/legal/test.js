#!/usr/bin/env node

const { LegalRecord } = require('./index.js');

console.log('🧪 Testing @titan-grove/legal');
console.log('===============================');

try {
  // Test record creation
  const record = new LegalRecord(
    'Test Legal Management',
    'Test description for Legal Management',
    'Active'
  );
  
  console.log('✅ Record creation:', record.name);
  
  // Test status update
  record.updateStatus('Updated');
  console.log('✅ Status update:', record.status);
  
  // Test age calculation
  const age = record.getAgeInDays();
  console.log('✅ Age calculation:', age, 'days');
  
  console.log('🎉 All tests passed for @titan-grove/legal');
  
} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}
