#!/usr/bin/env node

const { EnergyRecord } = require('./index.js');

console.log('🧪 Testing @titan-grove/energy');
console.log('===============================');

try {
  // Test record creation
  const record = new EnergyRecord(
    'Test Energy Management',
    'Test description for Energy Management',
    'Active'
  );
  
  console.log('✅ Record creation:', record.name);
  
  // Test status update
  record.updateStatus('Updated');
  console.log('✅ Status update:', record.status);
  
  // Test age calculation
  const age = record.getAgeInDays();
  console.log('✅ Age calculation:', age, 'days');
  
  console.log('🎉 All tests passed for @titan-grove/energy');
  
} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}
