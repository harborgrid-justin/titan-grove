/**
 * Simple Titan Grove Benchmark
 * Tests basic performance metrics
 */

async function benchmark() {
  const baseUrl = 'http://localhost:3000';
  
  console.log('🔬 Titan Grove Performance Benchmark');
  console.log('=====================================\n');

  // Test health endpoint performance
  console.log('📊 Testing /health endpoint...');
  const healthStart = Date.now();
  const healthPromises = [];
  
  for (let i = 0; i < 100; i++) {
    healthPromises.push(fetch(`${baseUrl}/health`));
  }
  
  try {
    const healthResults = await Promise.all(healthPromises);
    const healthEnd = Date.now();
    const healthTime = healthEnd - healthStart;
    const healthSuccess = healthResults.filter(r => r.ok).length;
    
    console.log(`✅ Health endpoint results:`);
    console.log(`   • Total requests: 100`);
    console.log(`   • Successful requests: ${healthSuccess}`);
    console.log(`   • Total time: ${healthTime}ms`);
    console.log(`   • Average response time: ${(healthTime / 100).toFixed(2)}ms`);
    console.log(`   • Requests per second: ${(100 / (healthTime / 1000)).toFixed(2)}\n`);
  } catch (error) {
    console.error('❌ Health endpoint benchmark failed:', error.message);
  }

  // Test API info endpoint performance
  console.log('📊 Testing /api/info endpoint...');
  const infoStart = Date.now();
  const infoPromises = [];
  
  for (let i = 0; i < 100; i++) {
    infoPromises.push(fetch(`${baseUrl}/api/info`));
  }
  
  try {
    const infoResults = await Promise.all(infoPromises);
    const infoEnd = Date.now();
    const infoTime = infoEnd - infoStart;
    const infoSuccess = infoResults.filter(r => r.ok).length;
    
    console.log(`✅ API info endpoint results:`);
    console.log(`   • Total requests: 100`);
    console.log(`   • Successful requests: ${infoSuccess}`);
    console.log(`   • Total time: ${infoTime}ms`);
    console.log(`   • Average response time: ${(infoTime / 100).toFixed(2)}ms`);
    console.log(`   • Requests per second: ${(100 / (infoTime / 1000)).toFixed(2)}\n`);
  } catch (error) {
    console.error('❌ API info endpoint benchmark failed:', error.message);
  }

  // Test database query endpoint performance
  console.log('📊 Testing /api/database/query endpoint...');
  const queryStart = Date.now();
  const queryPromises = [];
  
  const queryBody = JSON.stringify({
    sql: "SELECT 'Hello World' as message, datetime('now') as timestamp"
  });
  
  for (let i = 0; i < 50; i++) {
    queryPromises.push(
      fetch(`${baseUrl}/api/database/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: queryBody,
      })
    );
  }
  
  try {
    const queryResults = await Promise.all(queryPromises);
    const queryEnd = Date.now();
    const queryTime = queryEnd - queryStart;
    const querySuccess = queryResults.filter(r => r.ok).length;
    
    console.log(`✅ Database query endpoint results:`);
    console.log(`   • Total requests: 50`);
    console.log(`   • Successful requests: ${querySuccess}`);
    console.log(`   • Total time: ${queryTime}ms`);
    console.log(`   • Average response time: ${(queryTime / 50).toFixed(2)}ms`);
    console.log(`   • Requests per second: ${(50 / (queryTime / 1000)).toFixed(2)}\n`);
  } catch (error) {
    console.error('❌ Database query benchmark failed:', error.message);
  }

  console.log('🎯 Benchmark Complete!');
  console.log('\n💡 Tips for better performance:');
  console.log('   • Enable clustering for multi-core usage');
  console.log('   • Use Redis for distributed caching');
  console.log('   • Optimize database queries and indexes');
  console.log('   • Enable compression for large responses');
}

// Check if server is running
fetch('http://localhost:3000/health')
  .then(() => {
    benchmark();
  })
  .catch(() => {
    console.error('❌ Titan Grove server is not running!');
    console.log('Start the server first with: npm start');
    process.exit(1);
  });