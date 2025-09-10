#!/usr/bin/env node

const { CrisisManagementRecord } = require('./index.js');

console.log('🧪 Testing @titan-grove/crisis-management');
console.log('===============================');

try {
  // Test record creation
  const record = new CrisisManagementRecord(
    'Test Crisis & Emergency Management',
    'Test description for Crisis & Emergency Management',
    'Active'
  );
  
  console.log('✅ Record creation:', record.name);
  
  // Test status update
  record.updateStatus('Updated');
  console.log('✅ Status update:', record.status);
  
  // Test age calculation
  const age = record.getAgeInDays();
  console.log('✅ Age calculation:', age, 'days');
  
  console.log('🎉 All tests passed for @titan-grove/crisis-management');
  
} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}
