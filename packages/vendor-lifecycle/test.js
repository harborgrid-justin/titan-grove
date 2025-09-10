#!/usr/bin/env node

const { VendorLifecycleRecord } = require('./index.js');

console.log('🧪 Testing @titan-grove/vendor-lifecycle');
console.log('===============================');

try {
  // Test record creation
  const record = new VendorLifecycleRecord(
    'Test Vendor Lifecycle Management',
    'Test description for Vendor Lifecycle Management',
    'Active'
  );
  
  console.log('✅ Record creation:', record.name);
  
  // Test status update
  record.updateStatus('Updated');
  console.log('✅ Status update:', record.status);
  
  // Test age calculation
  const age = record.getAgeInDays();
  console.log('✅ Age calculation:', age, 'days');
  
  console.log('🎉 All tests passed for @titan-grove/vendor-lifecycle');
  
} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}
