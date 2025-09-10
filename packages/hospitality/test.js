#!/usr/bin/env node

const { HospitalityRecord } = require('./index.js');

console.log('🧪 Testing @titan-grove/hospitality');
console.log('===============================');

try {
  // Test record creation
  const record = new HospitalityRecord(
    'Test Hospitality Management',
    'Test description for Hospitality Management',
    'Active'
  );
  
  console.log('✅ Record creation:', record.name);
  
  // Test status update
  record.updateStatus('Updated');
  console.log('✅ Status update:', record.status);
  
  // Test age calculation
  const age = record.getAgeInDays();
  console.log('✅ Age calculation:', age, 'days');
  
  console.log('🎉 All tests passed for @titan-grove/hospitality');
  
} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}
