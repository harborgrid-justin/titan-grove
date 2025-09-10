#!/usr/bin/env node

const { ChangeManagementRecord } = require('./index.js');

console.log('🧪 Testing @titan-grove/change-management');
console.log('===============================');

try {
  // Test record creation
  const record = new ChangeManagementRecord(
    'Test Change Management & Organization Development',
    'Test description for Change Management & Organization Development',
    'Active'
  );
  
  console.log('✅ Record creation:', record.name);
  
  // Test status update
  record.updateStatus('Updated');
  console.log('✅ Status update:', record.status);
  
  // Test age calculation
  const age = record.getAgeInDays();
  console.log('✅ Age calculation:', age, 'days');
  
  console.log('🎉 All tests passed for @titan-grove/change-management');
  
} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}
