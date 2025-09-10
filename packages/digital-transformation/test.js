#!/usr/bin/env node

const { DigitalTransformationRecord } = require('./index.js');

console.log('🧪 Testing @titan-grove/digital-transformation');
console.log('===============================');

try {
  // Test record creation
  const record = new DigitalTransformationRecord(
    'Test Digital Transformation Management',
    'Test description for Digital Transformation Management',
    'Active'
  );
  
  console.log('✅ Record creation:', record.name);
  
  // Test status update
  record.updateStatus('Updated');
  console.log('✅ Status update:', record.status);
  
  // Test age calculation
  const age = record.getAgeInDays();
  console.log('✅ Age calculation:', age, 'days');
  
  console.log('🎉 All tests passed for @titan-grove/digital-transformation');
  
} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}
