#!/usr/bin/env node

const { FacilityManagementRecord } = require('./index.js');

console.log('🧪 Testing @titan-grove/facility-management');
console.log('===============================');

try {
  // Test record creation
  const record = new FacilityManagementRecord(
    'Test Facility & Space Management',
    'Test description for Facility & Space Management',
    'Active'
  );
  
  console.log('✅ Record creation:', record.name);
  
  // Test status update
  record.updateStatus('Updated');
  console.log('✅ Status update:', record.status);
  
  // Test age calculation
  const age = record.getAgeInDays();
  console.log('✅ Age calculation:', age, 'days');
  
  console.log('🎉 All tests passed for @titan-grove/facility-management');
  
} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}
