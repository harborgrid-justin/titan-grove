#!/usr/bin/env node

const { MiningResourcesRecord } = require('./index.js');

console.log('🧪 Testing @titan-grove/mining-resources');
console.log('===============================');

try {
  // Test record creation
  const record = new MiningResourcesRecord(
    'Test Mining & Natural Resources',
    'Test description for Mining & Natural Resources',
    'Active'
  );
  
  console.log('✅ Record creation:', record.name);
  
  // Test status update
  record.updateStatus('Updated');
  console.log('✅ Status update:', record.status);
  
  // Test age calculation
  const age = record.getAgeInDays();
  console.log('✅ Age calculation:', age, 'days');
  
  console.log('🎉 All tests passed for @titan-grove/mining-resources');
  
} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}
