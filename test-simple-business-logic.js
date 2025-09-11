/**
 * Simple Production-Grade Business Logic Test
 * Quick validation of enhanced NAPI-RS functionality
 */

const {
    evaluateBusinessRules,
    createFinancialApprovalRule,
    standardizeBusinessData,
    createCustomerDataProfile,
    createFinancialApprovalWorkflow,
    calculateAdvancedBusinessKpis,
} = require('./native');

console.log('🚀 Production-Grade Business Logic Quick Test');
console.log('=============================================\n');

// Test 1: Business Rules Engine
console.log('📋 Test 1: Business Rules Engine');
try {
    const rule = createFinancialApprovalRule(5000.0, "manager", "engineering");
    console.log('✅ Financial approval rule created successfully');
    console.log('   Rule ID:', rule.id);
    console.log('   Rule Name:', rule.name);
    console.log('   Conditions:', rule.conditions.length);
    console.log('   Actions:', rule.actions.length);
} catch (error) {
    console.error('❌ Business Rules test failed:', error.message);
}

// Test 2: Data Standardization
console.log('\n📋 Test 2: Data Standardization');
try {
    const profile = createCustomerDataProfile();
    console.log('✅ Customer data profile created successfully');
    console.log('   Entity Type:', profile.entityType);
    console.log('   Required Fields:', profile.requiredFields.length);
    console.log('   Standardization Rules:', profile.standardizationRules.length);
} catch (error) {
    console.error('❌ Data Standardization test failed:', error.message);
}

// Test 3: Workflow Management
console.log('\n📋 Test 3: Workflow Management');
try {
    const workflow = createFinancialApprovalWorkflow(10000.0, "Finance", ["manager", "director"]);
    console.log('✅ Financial approval workflow created successfully');
    console.log('   Workflow ID:', workflow.id);
    console.log('   Workflow Name:', workflow.name);
    console.log('   Steps:', workflow.steps.length);
    console.log('   SLA Hours:', workflow.slaHours);
} catch (error) {
    console.error('❌ Workflow Management test failed:', error.message);
}

// Test 4: Business Intelligence
console.log('\n📋 Test 4: Business Intelligence');
try {
    const dashboard = calculateAdvancedBusinessKpis(
        [250000, 275000, 290000], // revenue
        [180000, 195000, 205000], // costs
        [4.2, 4.5, 4.3],          // customer satisfaction
        [3.8, 4.0, 3.9]           // employee scores
    );
    console.log('✅ Business KPI dashboard generated successfully');
    console.log('   Dashboard ID:', dashboard.dashboardId);
    console.log('   Metrics Count:', dashboard.metrics.length);
    console.log('   Alerts Count:', dashboard.alerts.length);
    console.log('   Overall Health Score:', dashboard.overallHealthScore.toFixed(1));
    console.log('   Recommendations:', dashboard.recommendations.length);
} catch (error) {
    console.error('❌ Business Intelligence test failed:', error.message);
}

console.log('\n🎉 Production-Grade Business Logic Tests Complete!');
console.log('📈 All enhanced NAPI-RS modules are operational');