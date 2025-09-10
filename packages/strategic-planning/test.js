#!/usr/bin/env node

const { StrategicPlanningRecord } = require('./index.js');

console.log('🧪 Testing @titan-grove/strategic-planning');
console.log('===============================');

try {
  // Test record creation
  const record = new StrategicPlanningRecord(
    'Test Strategic Planning & Corporate Development',
    'Test description for Strategic Planning & Corporate Development',
    'Active'
  );
  
  console.log('✅ Record creation:', record.name);
  
  // Test status update
  record.updateStatus('Updated');
  console.log('✅ Status update:', record.status);
  
  // Test age calculation
  const age = record.getAgeInDays();
  console.log('✅ Age calculation:', age, 'days');
  
  console.log('🎉 All tests passed for @titan-grove/strategic-planning');
  
} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}
