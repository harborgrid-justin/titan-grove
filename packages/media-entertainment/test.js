#!/usr/bin/env node

const { MediaEntertainmentRecord } = require('./index.js');

console.log('🧪 Testing @titan-grove/media-entertainment');
console.log('===============================');

try {
  // Test record creation
  const record = new MediaEntertainmentRecord(
    'Test Media & Entertainment Management',
    'Test description for Media & Entertainment Management',
    'Active'
  );
  
  console.log('✅ Record creation:', record.name);
  
  // Test status update
  record.updateStatus('Updated');
  console.log('✅ Status update:', record.status);
  
  // Test age calculation
  const age = record.getAgeInDays();
  console.log('✅ Age calculation:', age, 'days');
  
  console.log('🎉 All tests passed for @titan-grove/media-entertainment');
  
} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}
