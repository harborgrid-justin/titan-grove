#!/usr/bin/env node

const { IpManagementRecord } = require('./index.js');

console.log('🧪 Testing @titan-grove/ip-management');
console.log('===============================');

try {
  // Test record creation
  const record = new IpManagementRecord(
    'Test Intellectual Property Management',
    'Test description for Intellectual Property Management',
    'Active'
  );
  
  console.log('✅ Record creation:', record.name);
  
  // Test status update
  record.updateStatus('Updated');
  console.log('✅ Status update:', record.status);
  
  // Test age calculation
  const age = record.getAgeInDays();
  console.log('✅ Age calculation:', age, 'days');
  
  console.log('🎉 All tests passed for @titan-grove/ip-management');
  
} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}
