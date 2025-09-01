#!/usr/bin/env node
/**
 * Simple test to verify the Business Suite functionality
 */
import { TitanGrove } from '../src/business-suite';

async function main() {
  try {
    console.log('🏢 Testing Titan Grove Enterprise Business Suite...');
    
    // Create business suite instance
    const titan = new TitanGrove({
      server: { port: 3001 },
      modules: {
        financial: true,
        hr: true,
        crm: true,
        scm: true,
        project: true,
        bi: true
      }
    });

    // Start the suite
    await titan.start();
    
    // Test health check
    const health = await titan.getHealthStatus();
    console.log('✅ Health check:', health.success ? 'PASSED' : 'FAILED');
    
    // Test system info
    const info = await titan.getSystemInfo();
    console.log('✅ System info:', info.success ? 'PASSED' : 'FAILED');
    console.log('📊 Business modules:', Object.keys(info.data.modules).length);
    
    // Test a simple business transaction
    try {
      const customer = await titan.crm.createCustomer({
        name: 'Test Customer Corp',
        type: 'COMPANY',
        email: 'test@testcorp.com',
        phone: '555-0123',
        address: {
          street: '123 Test St',
          city: 'Test City',
          state: 'TS',
          zipCode: '12345',
          country: 'USA'
        },
        status: 'ACTIVE'
      });
      console.log('✅ Customer creation: PASSED');
    } catch (error) {
      console.log('❌ Customer creation: FAILED', error.message);
    }
    
    // Stop the suite
    await titan.stop();
    console.log('✅ Titan Grove Business Suite test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}