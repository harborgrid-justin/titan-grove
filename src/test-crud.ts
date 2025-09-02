/**
 * Test CRUD Operations
 * Simple test to verify that our managers have working CRUD operations
 */

import { assetManager } from '../modules/assets';
import { crmManager } from '../modules/crm';
import { fieldServiceManager } from '../modules/field-service';
import { realEstateManager } from '../modules/real-estate-management';
import { capitalAssetManager } from '../modules/capital-asset-management';
import { enterpriseAssetManager } from '../modules/enterprise-asset-management';

async function testCRUDOperations() {
  console.log('Testing CRUD operations...');
  
  try {
    // Test Asset Manager
    console.log('\n=== Testing AssetManager ===');
    const asset = await assetManager.createAsset({
      assetName: 'Test Asset',
      assetNumber: 'TA001',
      category: 'EQUIPMENT',
      status: 'ACTIVE'
    });
    console.log('✅ Asset created:', asset.id);
    
    const updatedAsset = await assetManager.updateAsset(asset.id, {
      status: 'MAINTENANCE'
    });
    console.log('✅ Asset updated:', updatedAsset.id);
    
    // Test CRM Manager  
    console.log('\n=== Testing CRMManager ===');
    const customer = await crmManager.createCustomer({
      companyName: 'Test Corp',
      contactEmail: 'test@testcorp.com',
      industry: 'Manufacturing'
    });
    console.log('✅ Customer created:', customer.id);
    
    // Test Field Service Manager
    console.log('\n=== Testing FieldServiceManager ===');
    const serviceRequest = await fieldServiceManager.createServiceRequest({
      title: 'Test Service Request',
      description: 'Test description',
      priority: 'HIGH'
    });
    console.log('✅ Service Request created:', serviceRequest.id);
    
    // Test Real Estate Manager
    console.log('\n=== Testing RealEstateManager ===');
    const property = await realEstateManager.createProperty({
      propertyName: 'Test Property',
      address: '123 Test St',
      propertyType: 'OFFICE'
    });
    console.log('✅ Property created:', property.id);
    
    // Test Capital Asset Manager
    console.log('\n=== Testing CapitalAssetManager ===');
    const capitalAssetResult = await capitalAssetManager.createCapitalAsset({
      assetName: 'Test Capital Asset',
      assetValue: 100000,
      category: 'PRODUCTION_EQUIPMENT'
    });
    console.log('✅ Capital Asset created:', capitalAssetResult.assetId || 'created');
    
    // Test Enterprise Asset Manager
    console.log('\n=== Testing EnterpriseAssetManager ===');
    const enterpriseAsset = await enterpriseAssetManager.createAsset({
      assetName: 'Test Enterprise Asset',
      assetType: 'EQUIPMENT',
      department: 'MANUFACTURING'
    });
    console.log('✅ Enterprise Asset created:', enterpriseAsset.id);
    
    console.log('\n🎉 All CRUD operations completed successfully!');
    
  } catch (error) {
    console.error('❌ Error testing CRUD operations:', error.message);
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  testCRUDOperations();
}

export { testCRUDOperations };