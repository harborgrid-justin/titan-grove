#!/usr/bin/env node

const { KnowledgeManagementRecord } = require('./index.js');

console.log('🧪 Testing @titan-grove/knowledge-management');
console.log('===============================');

try {
  // Test record creation
  const record = new KnowledgeManagementRecord(
    'Test Knowledge Management System',
    'Test description for Knowledge Management System',
    'Active'
  );
  
  console.log('✅ Record creation:', record.name);
  
  // Test status update
  record.updateStatus('Updated');
  console.log('✅ Status update:', record.status);
  
  // Test age calculation
  const age = record.getAgeInDays();
  console.log('✅ Age calculation:', age, 'days');
  
  console.log('🎉 All tests passed for @titan-grove/knowledge-management');
  
} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}
