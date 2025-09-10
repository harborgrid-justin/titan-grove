#!/usr/bin/env node

const { AiMlRecord } = require('./index.js');

console.log('🧪 Testing @titan-grove/ai-ml');
console.log('===============================');

try {
  // Test record creation
  const record = new AiMlRecord(
    'Test AI/ML Management',
    'Test description for AI/ML Management',
    'Active'
  );
  
  console.log('✅ Record creation:', record.name);
  
  // Test status update
  record.updateStatus('Updated');
  console.log('✅ Status update:', record.status);
  
  // Test age calculation
  const age = record.getAgeInDays();
  console.log('✅ Age calculation:', age, 'days');
  
  console.log('🎉 All tests passed for @titan-grove/ai-ml');
  
} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}
