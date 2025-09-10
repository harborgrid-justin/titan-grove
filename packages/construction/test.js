#!/usr/bin/env node

const { ConstructionRecord } = require('./index.js');

console.log('🧪 Testing @titan-grove/construction');
console.log('===============================');

try {
  // Test record creation
  const record = new ConstructionRecord(
    'Test Construction Management',
    'Test description for Construction Management',
    'Active'
  );
  
  console.log('✅ Record creation:', record.name);
  
  // Test status update
  record.updateStatus('Updated');
  console.log('✅ Status update:', record.status);
  
  // Test age calculation
  const age = record.getAgeInDays();
  console.log('✅ Age calculation:', age, 'days');
  
  console.log('🎉 All tests passed for @titan-grove/construction');
  
} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}
