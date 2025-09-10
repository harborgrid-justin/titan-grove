#!/usr/bin/env node

const { DataScienceRecord } = require('./index.js');

console.log('🧪 Testing @titan-grove/data-science');
console.log('===============================');

try {
  // Test record creation
  const record = new DataScienceRecord(
    'Test Data Science Platform',
    'Test description for Data Science Platform',
    'Active'
  );
  
  console.log('✅ Record creation:', record.name);
  
  // Test status update
  record.updateStatus('Updated');
  console.log('✅ Status update:', record.status);
  
  // Test age calculation
  const age = record.getAgeInDays();
  console.log('✅ Age calculation:', age, 'days');
  
  console.log('🎉 All tests passed for @titan-grove/data-science');
  
} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}
