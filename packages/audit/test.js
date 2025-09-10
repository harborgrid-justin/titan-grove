#!/usr/bin/env node

const { AuditRecord } = require('./index.js');

console.log('🧪 Testing @titan-grove/audit');
console.log('===============================');

try {
  // Test record creation
  const record = new AuditRecord(
    'Test Audit Management',
    'Test description for Audit Management',
    'Active'
  );
  
  console.log('✅ Record creation:', record.name);
  
  // Test status update
  record.updateStatus('Updated');
  console.log('✅ Status update:', record.status);
  
  // Test age calculation
  const age = record.getAgeInDays();
  console.log('✅ Age calculation:', age, 'days');
  
  console.log('🎉 All tests passed for @titan-grove/audit');
  
} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}
