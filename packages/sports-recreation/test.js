#!/usr/bin/env node

const { SportsRecreationRecord } = require('./index.js');

console.log('🧪 Testing @titan-grove/sports-recreation');
console.log('===============================');

try {
  // Test record creation
  const record = new SportsRecreationRecord(
    'Test Sports & Recreation Management',
    'Test description for Sports & Recreation Management',
    'Active'
  );
  
  console.log('✅ Record creation:', record.name);
  
  // Test status update
  record.updateStatus('Updated');
  console.log('✅ Status update:', record.status);
  
  // Test age calculation
  const age = record.getAgeInDays();
  console.log('✅ Age calculation:', age, 'days');
  
  console.log('🎉 All tests passed for @titan-grove/sports-recreation');
  
} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}
