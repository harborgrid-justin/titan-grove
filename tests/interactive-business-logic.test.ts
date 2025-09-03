/**
 * Interactive Business Logic Test
 * Validates that all service pages have proper JavaScript connections
 */

import * as fs from 'fs';
import * as path from 'path';

describe('Interactive Business Logic Integration Tests', () => {
  const servicePages = [
    { name: 'financials', script: 'financials.js', class: 'FinancialManagementEngine' },
    { name: 'setup', script: 'setup.js', class: 'TitanGroveSetupEngine' },
    { name: 'index', script: 'index.js', class: 'TitanGroveMainEngine' },
    { name: 'service-command-center', script: 'service-command-center.js', class: 'ServiceCommandCenterEngine' },
    { name: 'field-service', script: 'field-service.js', class: 'FieldServiceManagementEngine' },
    { name: 'business-intelligence', script: 'business-intelligence.js', class: 'TitanBusinessIntelligenceEngine' },
    { name: 'maintenance', script: 'maintenance.js', class: null },
    { name: 'asset-management', script: 'asset-management.js', class: null },
    { name: 'compliance', script: 'compliance.js', class: null },
    { name: 'crm-management', script: 'crm-management.js', class: null },
    { name: 'dashboard', script: 'dashboard.js', class: null },
    { name: 'hr-management', script: 'hr-management.js', class: null },
    { name: 'manufacturing', script: 'manufacturing.js', class: null },
    { name: 'project-management', script: 'project-management.js', class: null },
    { name: 'supply-chain-management', script: 'supply-chain-management.js', class: null }
  ];

  test('should have JavaScript files for all service pages', () => {
    servicePages.forEach(page => {
      const scriptPath = path.join(process.cwd(), 'src/ui/static/scripts', page.script);
      expect(fs.existsSync(scriptPath)).toBe(true);
    });
  });

  test('should validate new interactive business logic classes exist', () => {
    const newClasses = [
      { file: 'financials.js', className: 'FinancialManagementEngine' },
      { file: 'setup.js', className: 'TitanGroveSetupEngine' },
      { file: 'index.js', className: 'TitanGroveMainEngine' }
    ];

    newClasses.forEach(item => {
      const scriptPath = path.join(process.cwd(), 'src/ui/static/scripts', item.file);
      expect(fs.existsSync(scriptPath)).toBe(true);
      
      const content = fs.readFileSync(scriptPath, 'utf8');
      expect(content).toContain(`class ${item.className}`);
      expect(content).toContain('async initialize()');
      expect(content).toContain('setupEventListeners()');
      expect(content).toContain('messageQueue');
      expect(content).toContain('cacheManager');
    });
  });

  test('should validate API endpoints exist for all services', async () => {
    const apiEndpoints = [
      '/financial/accounts/balances',
      '/financial/transactions',
      '/financial/budgets',
      '/financial/cashflow',
      '/main/kpis',
      '/system/status',
      '/modules/status',
      '/service-command/kpis',
      '/field-service/work-orders',
      '/maintenance/orders'
    ];

    // Check that the endpoints are defined in service-api.js
    const apiFile = path.join(process.cwd(), 'src/api/service-api.js');
    const content = fs.readFileSync(apiFile, 'utf8');

    apiEndpoints.forEach(endpoint => {
      const routePattern = endpoint.replace(/\//g, '\\/');
      expect(content).toMatch(new RegExp(`router\\.get\\('${routePattern}`));
    });
  });

  test('should validate HTML files reference correct script files', () => {
    const htmlScriptMappings = [
      { html: 'financials.html', script: 'scripts/financials.js' },
      { html: 'setup.html', script: 'scripts/setup.js' },
      { html: 'index.html', script: 'scripts/index.js' }
    ];

    htmlScriptMappings.forEach(mapping => {
      const htmlPath = path.join(process.cwd(), 'src/ui/static', mapping.html);
      expect(fs.existsSync(htmlPath)).toBe(true);
      
      const content = fs.readFileSync(htmlPath, 'utf8');
      expect(content).toContain(`src="${mapping.script}"`);
    });
  });

  test('should validate consistent patterns across business logic files', () => {
    const requiredPatterns = [
      'dependency injection pattern',
      'messageQueue',
      'cacheManager', 
      'logger',
      'async initialize()',
      'setupEventListeners()',
      'handleMessage'
    ];

    const fileSpecificPatterns: Record<string, string[]> = {
      'financials.js': ['loadInitialData'],
      'setup.js': ['startSystemChecks', 'updateSystemInfo'],
      'index.js': ['loadInitialData', 'navigateToModule']
    };

    const mainLogicFiles = ['financials.js', 'setup.js', 'index.js'];
    
    mainLogicFiles.forEach(file => {
      const scriptPath = path.join(process.cwd(), 'src/ui/static/scripts', file);
      const content = fs.readFileSync(scriptPath, 'utf8');
      
      // Check common patterns
      requiredPatterns.forEach(pattern => {
        expect(content).toContain(pattern);
      });
      
      // Check file-specific patterns
      if (fileSpecificPatterns[file]) {
        fileSpecificPatterns[file].forEach(pattern => {
          expect(content).toContain(pattern);
        });
      }
    });
  });
});