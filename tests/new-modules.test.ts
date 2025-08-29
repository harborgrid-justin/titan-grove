/**
 * Test file for new modules
 */

import TitanGrove from '../src/business-suite';

describe('New Modules Integration', () => {
  let titanGrove: TitanGrove;

  beforeEach(() => {
    titanGrove = new TitanGrove();
  });

  test('should have all 19 modules available', () => {
    expect(titanGrove.financial).toBeDefined();
    expect(titanGrove.hr).toBeDefined();
    expect(titanGrove.crm).toBeDefined();
    expect(titanGrove.scm).toBeDefined();
    expect(titanGrove.project).toBeDefined();
    expect(titanGrove.bi).toBeDefined();
    expect(titanGrove.assets).toBeDefined();
    
    // New modules
    expect(titanGrove.manufacturing).toBeDefined();
    expect(titanGrove.procurement).toBeDefined();
    expect(titanGrove.orders).toBeDefined();
    expect(titanGrove.inventory).toBeDefined();
    expect(titanGrove.quality).toBeDefined();
    expect(titanGrove.service).toBeDefined();
    expect(titanGrove.maintenance).toBeDefined();
    expect(titanGrove.risk).toBeDefined();
    expect(titanGrove.compliance).toBeDefined();
    expect(titanGrove.document).toBeDefined();
    expect(titanGrove.workflow).toBeDefined();
    expect(titanGrove.integration).toBeDefined();
  });

  test('manufacturing module should work', async () => {
    const product = await titanGrove.manufacturing.createProduct({
      productCode: 'TEST-001',
      name: 'Test Product',
      description: 'Test product for manufacturing',
      category: 'FINISHED_GOODS',
      unitOfMeasure: 'EA',
      standardCost: 100.00,
      status: 'ACTIVE'
    });

    expect(product.id).toBeDefined();
    expect(product.productCode).toBe('TEST-001');
    expect(product.standardCost).toBe(100.00);
    expect(product.createdDate).toBeDefined();
  });

  test('procurement module should work', async () => {
    const supplier = await titanGrove.procurement.createSupplier({
      supplierCode: 'SUPP-001',
      name: 'Test Supplier',
      type: 'CORPORATION',
      category: ['MATERIALS'],
      status: 'ACTIVE',
      contact: {
        primaryContactName: 'John Doe',
        primaryContactEmail: 'john@supplier.com',
        primaryContactPhone: '555-0123'
      },
      address: {
        street: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        country: 'USA',
        postalCode: '12345',
        isRemitToAddress: true,
        isOrderAddress: true
      },
      bankDetails: {
        bankName: 'Test Bank',
        accountNumber: '123456789',
        routingNumber: '987654321',
        currency: 'USD'
      },
      taxInfo: {
        taxId: '12-3456789',
        taxType: 'EIN',
        taxExempt: false
      },
      certifications: ['ISO9001']
    });

    expect(supplier.id).toBeDefined();
    expect(supplier.supplierCode).toBe('SUPP-001');
    expect(supplier.name).toBe('Test Supplier');
    expect(supplier.createdDate).toBeDefined();
  });

  test('order management module should work', async () => {
    const quote = await titanGrove.orders.createQuote({
      customerId: 'CUST-001',
      customerName: 'Test Customer',
      quoteDate: new Date(),
      expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      salesRepId: 'REP-001',
      currency: 'USD',
      exchangeRate: 1.0,
      paymentTerms: 'Net 30',
      shippingTerms: 'FOB Origin',
      validityPeriod: 30,
      subtotal: 1000,
      taxAmount: 80,
      shippingAmount: 50,
      discountAmount: 0,
      totalAmount: 1130,
      lineItems: [],
      terms: ['Standard terms apply']
    });

    expect(quote.id).toBeDefined();
    expect(quote.quoteNumber).toBeDefined();
    expect(quote.customerId).toBe('CUST-001');
    expect(quote.status).toBe('DRAFT');
  });

  test('inventory module should work', async () => {
    const item = await titanGrove.inventory.createInventoryItem({
      itemCode: 'INV-001',
      description: 'Test Inventory Item',
      category: 'RAW_MATERIALS',
      unitOfMeasure: 'EA',
      standardCost: 50.00,
      status: 'ACTIVE',
      trackingMethod: 'STANDARD',
      reorderPoint: 10,
      maximumStock: 100,
      safetyStock: 5,
      leadTime: 7,
      abcClass: 'A'
    });

    expect(item.id).toBeDefined();
    expect(item.itemCode).toBe('INV-001');
    expect(item.standardCost).toBe(50.00);
    expect(item.averageCost).toBe(50.00);
  });

  test('workflow module should work', async () => {
    const workflow = await titanGrove.workflow.createWorkflowDefinition({
      workflowCode: 'WF-001',
      name: 'Test Workflow',
      description: 'Test workflow for approval',
      category: 'APPROVAL',
      version: '1.0',
      steps: [{
        stepId: 'step1',
        stepName: 'Initial Approval',
        stepType: 'APPROVAL',
        assigneeType: 'USER',
        assigneeId: 'user123',
        nextSteps: ['step2']
      }],
      triggers: [{
        triggerId: 'trigger1',
        triggerType: 'MANUAL',
        active: true
      }],
      variables: [{
        variableId: 'var1',
        name: 'requestAmount',
        dataType: 'NUMBER',
        required: true
      }]
    });

    expect(workflow.id).toBeDefined();
    expect(workflow.workflowCode).toBe('WF-001');
    expect(workflow.status).toBe('DRAFT');
  });

  test('risk management module should work', async () => {
    const riskAssessment = await titanGrove.risk.createRiskAssessment({
      assessmentName: 'Test Risk Assessment',
      riskCategory: 'OPERATIONAL',
      riskDescription: 'Test operational risk',
      likelihood: 'MEDIUM',
      impact: 'MODERATE',
      owner: 'risk_manager_001',
      status: 'IDENTIFIED',
      mitigation: {
        strategy: 'REDUCE',
        actions: [{
          actionId: 'action1',
          description: 'Implement controls',
          assignedTo: 'manager_001',
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          status: 'PLANNED'
        }],
        residualRiskScore: 6
      },
      assessmentDate: new Date(),
      reviewDate: new Date(),
      nextReviewDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
    });

    expect(riskAssessment.id).toBeDefined();
    expect(riskAssessment.assessmentName).toBe('Test Risk Assessment');
    expect(riskAssessment.riskScore).toBe(9); // MEDIUM (3) * MODERATE (3) = 9
    expect(riskAssessment.riskLevel).toBe('MEDIUM');
  });
});