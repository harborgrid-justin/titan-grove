#!/usr/bin/env node

const { PharmaceuticalRecord } = require('./index.js');

console.log('🧪 Testing @titan-grove/pharmaceutical');
console.log('===============================');

try {
  // Test record creation
  const record = new PharmaceuticalRecord(
    'Test Pharmaceutical & Life Sciences',
    'Test description for Pharmaceutical & Life Sciences',
    'Active'
  );
  
  console.log('✅ Record creation:', record.name);
  
  // Test status update
  record.updateStatus('Updated');
  console.log('✅ Status update:', record.status);
  
  // Test age calculation
  const age = record.getAgeInDays();
  console.log('✅ Age calculation:', age, 'days');
  
  console.log('🎉 All tests passed for @titan-grove/pharmaceutical');
  
} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}
