#!/usr/bin/env node

const { createTreasuryRecord, updateTreasuryRecordStatus, calculateCashFlow, optimizeCashPosition } = require('./index.js');

console.log('🧪 Testing @titan-grove/treasury');
console.log('===============================');

try {
  // Test record creation
  const record = createTreasuryRecord(
    'Test Treasury Management',
    'Test description for Treasury Management',
    'Active'
  );
  
  console.log('✅ Record creation:', record.name);
  
  // Test status update
  const updatedRecord = updateTreasuryRecordStatus(record, 'Updated');
  console.log('✅ Status update:', updatedRecord.status);
  
  // Test cash flow calculation
  const cashFlow = calculateCashFlow([100000, 150000], [80000, 90000]);
  console.log('✅ Cash flow calculation:', cashFlow);
  
  // Test cash position optimization
  const optimization = optimizeCashPosition(50000, 45000);
  console.log('✅ Cash position optimization:', optimization);
  
  console.log('🎉 All tests passed for @titan-grove/treasury');
  
} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}
