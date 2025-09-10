#!/usr/bin/env node

const { ContractLifecycleRecord } = require('./index.js');

console.log('🧪 Testing @titan-grove/contract-lifecycle');
console.log('===============================');

try {
  // Test record creation
  const record = new ContractLifecycleRecord(
    'Test Contract Lifecycle Management',
    'Test description for Contract Lifecycle Management',
    'Active'
  );
  
  console.log('✅ Record creation:', record.name);
  
  // Test status update
  record.updateStatus('Updated');
  console.log('✅ Status update:', record.status);
  
  // Test age calculation
  const age = record.getAgeInDays();
  console.log('✅ Age calculation:', age, 'days');
  
  console.log('🎉 All tests passed for @titan-grove/contract-lifecycle');
  
} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}
