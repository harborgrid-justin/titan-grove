#!/usr/bin/env node

const { TransportationRecord } = require('./index.js');

console.log('🧪 Testing @titan-grove/transportation');
console.log('===============================');

try {
  // Test record creation
  const record = new TransportationRecord(
    'Test Transportation Management',
    'Test description for Transportation Management',
    'Active'
  );
  
  console.log('✅ Record creation:', record.name);
  
  // Test status update
  record.updateStatus('Updated');
  console.log('✅ Status update:', record.status);
  
  // Test age calculation
  const age = record.getAgeInDays();
  console.log('✅ Age calculation:', age, 'days');
  
  console.log('🎉 All tests passed for @titan-grove/transportation');
  
} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}
