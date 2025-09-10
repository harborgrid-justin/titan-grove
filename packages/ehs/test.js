#!/usr/bin/env node

const { EhsRecord } = require('./index.js');

console.log('🧪 Testing @titan-grove/ehs');
console.log('===============================');

try {
  // Test record creation
  const record = new EhsRecord(
    'Test Environmental Health & Safety',
    'Test description for Environmental Health & Safety',
    'Active'
  );
  
  console.log('✅ Record creation:', record.name);
  
  // Test status update
  record.updateStatus('Updated');
  console.log('✅ Status update:', record.status);
  
  // Test age calculation
  const age = record.getAgeInDays();
  console.log('✅ Age calculation:', age, 'days');
  
  console.log('🎉 All tests passed for @titan-grove/ehs');
  
} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}
