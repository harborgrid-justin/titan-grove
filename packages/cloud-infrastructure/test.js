#!/usr/bin/env node

const { CloudInfrastructureRecord } = require('./index.js');

console.log('🧪 Testing @titan-grove/cloud-infrastructure');
console.log('===============================');

try {
  // Test record creation
  const record = new CloudInfrastructureRecord(
    'Test Cloud Infrastructure Management',
    'Test description for Cloud Infrastructure Management',
    'Active'
  );
  
  console.log('✅ Record creation:', record.name);
  
  // Test status update
  record.updateStatus('Updated');
  console.log('✅ Status update:', record.status);
  
  // Test age calculation
  const age = record.getAgeInDays();
  console.log('✅ Age calculation:', age, 'days');
  
  console.log('🎉 All tests passed for @titan-grove/cloud-infrastructure');
  
} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}
