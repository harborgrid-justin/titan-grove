#!/usr/bin/env node

const { InnovationRdRecord } = require('./index.js');

console.log('🧪 Testing @titan-grove/innovation-rd');
console.log('===============================');

try {
  // Test record creation
  const record = new InnovationRdRecord(
    'Test Innovation & R&D Management',
    'Test description for Innovation & R&D Management',
    'Active'
  );
  
  console.log('✅ Record creation:', record.name);
  
  // Test status update
  record.updateStatus('Updated');
  console.log('✅ Status update:', record.status);
  
  // Test age calculation
  const age = record.getAgeInDays();
  console.log('✅ Age calculation:', age, 'days');
  
  console.log('🎉 All tests passed for @titan-grove/innovation-rd');
  
} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}
