/**
 * Titan Grove GUI Screenshots Generator
 * Automatically captures screenshots of all GUI pages for documentation
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// Configuration
const BASE_URL = 'http://localhost:3000';
const SCREENSHOTS_DIR = './screenshots';
const VIEWPORT_DESKTOP = { width: 1920, height: 1080 };
const VIEWPORT_MOBILE = { width: 375, height: 812 };

// GUI Pages to capture
const GUI_PAGES = [
  { 
    name: 'index', 
    url: '/ui/index.html',
    title: 'Main Landing Page - Titan Grove ERP',
    description: 'Main entry point showing enterprise performance metrics and navigation'
  },
  { 
    name: 'dashboard', 
    url: '/ui/dashboard.html',
    title: 'Executive Dashboard',
    description: 'High-level KPIs and strategic metrics for executives'
  },
  { 
    name: 'setup', 
    url: '/ui/setup.html',
    title: 'System Setup Wizard',
    description: 'Installation and configuration wizard for new deployments'
  },
  { 
    name: 'manufacturing', 
    url: '/ui/manufacturing.html',
    title: 'Manufacturing Operations',
    description: 'Production oversight, work orders, and manufacturing intelligence'
  },
  { 
    name: 'project-management', 
    url: '/ui/project-management.html',
    title: 'Project Management Command Center',
    description: 'Enterprise project portfolio oversight and resource optimization'
  },
  { 
    name: 'business-intelligence', 
    url: '/ui/business-intelligence.html',
    title: 'Business Intelligence & Analytics',
    description: 'Data analytics, reporting, and business intelligence dashboards'
  },
  { 
    name: 'financials', 
    url: '/ui/financials.html',
    title: 'Financial Management',
    description: 'General ledger, accounts payable/receivable, and financial reporting'
  },
  { 
    name: 'hr-management', 
    url: '/ui/hr-management.html',
    title: 'Human Resources Management',
    description: 'Employee management, payroll, and HR analytics'
  },
  { 
    name: 'crm-management', 
    url: '/ui/crm-management.html',
    title: 'Customer Relationship Management',
    description: 'Customer data, sales pipeline, and customer service management'
  },
  { 
    name: 'supply-chain-management', 
    url: '/ui/supply-chain-management.html',
    title: 'Supply Chain Management',
    description: 'Procurement, inventory, supplier management, and logistics'
  },
  { 
    name: 'asset-management', 
    url: '/ui/asset-management.html',
    title: 'Asset Management',
    description: 'Fixed assets, equipment tracking, and asset lifecycle management'
  },
  { 
    name: 'compliance', 
    url: '/ui/compliance.html',
    title: 'Compliance & Risk Management',
    description: 'Regulatory compliance, risk assessment, and audit management'
  }
];

/**
 * Ensure screenshots directory exists
 */
function ensureDirectoryExists() {
  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  }
  
  // Create subdirectories for desktop and mobile
  ['desktop', 'mobile'].forEach(type => {
    const dir = path.join(SCREENSHOTS_DIR, type);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

/**
 * Wait for page to be fully loaded including any dynamic content
 */
async function waitForPageLoad(page) {
  // Wait for network to be idle
  await page.waitForLoadState('networkidle');
  
  // Additional wait for any JavaScript animations or dynamic content
  await page.waitForTimeout(3000);
  
  // Wait for common loading indicators to disappear (if any)
  try {
    await page.waitForSelector('.loading', { state: 'hidden', timeout: 5000 });
  } catch (e) {
    // No loading indicator found, that's fine
  }
}

/**
 * Take screenshot of a single page
 */
async function takePageScreenshot(browser, pageInfo, viewport, viewportType) {
  console.log(`📸 Capturing ${pageInfo.title} (${viewportType})...`);
  
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  
  try {
    // Navigate to the page
    const fullUrl = `${BASE_URL}${pageInfo.url}`;
    console.log(`   Navigating to: ${fullUrl}`);
    
    await page.goto(fullUrl, { waitUntil: 'networkidle', timeout: 30000 });
    
    // Wait for page to fully load
    await waitForPageLoad(page);
    
    // Take full page screenshot
    const screenshotPath = path.join(SCREENSHOTS_DIR, viewportType, `${pageInfo.name}-${viewportType}.png`);
    await page.screenshot({ 
      path: screenshotPath, 
      fullPage: true,
      animations: 'disabled' // Disable animations for consistent screenshots
    });
    
    console.log(`   ✅ Screenshot saved: ${screenshotPath}`);
    
    return {
      page: pageInfo.name,
      viewport: viewportType,
      path: screenshotPath,
      url: fullUrl,
      title: pageInfo.title,
      description: pageInfo.description,
      success: true
    };
    
  } catch (error) {
    console.error(`   ❌ Failed to capture ${pageInfo.name} (${viewportType}):`, error.message);
    return {
      page: pageInfo.name,
      viewport: viewportType,
      url: `${BASE_URL}${pageInfo.url}`,
      title: pageInfo.title,
      description: pageInfo.description,
      success: false,
      error: error.message
    };
  } finally {
    await context.close();
  }
}

/**
 * Generate comprehensive documentation
 */
function generateDocumentation(results) {
  let markdown = `# Titan Grove GUI Screenshots\n\n`;
  markdown += `Generated on: ${new Date().toISOString()}\n\n`;
  markdown += `This document contains visual screenshots of all GUI pages in the Titan Grove Enterprise Business Suite.\n\n`;
  
  // Summary
  const successCount = results.filter(r => r.success).length;
  const totalCount = results.length;
  
  markdown += `## Summary\n\n`;
  markdown += `- **Total Pages**: ${GUI_PAGES.length}\n`;
  markdown += `- **Screenshots Captured**: ${successCount}/${totalCount}\n`;
  markdown += `- **Viewports**: Desktop (1920x1080), Mobile (375x812)\n\n`;
  
  // Group by page
  const pages = {};
  results.forEach(result => {
    if (!pages[result.page]) {
      pages[result.page] = { desktop: null, mobile: null };
    }
    pages[result.page][result.viewport] = result;
  });
  
  markdown += `## Page Screenshots\n\n`;
  
  GUI_PAGES.forEach(pageInfo => {
    const pageResults = pages[pageInfo.name];
    if (!pageResults) return;
    
    markdown += `### ${pageInfo.title}\n\n`;
    markdown += `**Description**: ${pageInfo.description}\n\n`;
    markdown += `**URL**: \`${pageInfo.url}\`\n\n`;
    
    // Desktop screenshot
    if (pageResults.desktop && pageResults.desktop.success) {
      markdown += `#### Desktop View (1920x1080)\n\n`;
      markdown += `![${pageInfo.title} - Desktop](${pageResults.desktop.path.replace('./screenshots/', 'screenshots/')})\n\n`;
    }
    
    // Mobile screenshot  
    if (pageResults.mobile && pageResults.mobile.success) {
      markdown += `#### Mobile View (375x812)\n\n`;
      markdown += `![${pageInfo.title} - Mobile](${pageResults.mobile.path.replace('./screenshots/', 'screenshots/')})\n\n`;
    }
    
    // Error information
    const errors = [pageResults.desktop, pageResults.mobile].filter(r => r && !r.success);
    if (errors.length > 0) {
      markdown += `#### Capture Issues\n\n`;
      errors.forEach(error => {
        markdown += `- **${error.viewport}**: ${error.error}\n`;
      });
      markdown += `\n`;
    }
    
    markdown += `---\n\n`;
  });
  
  // Failed captures section
  const failures = results.filter(r => !r.success);
  if (failures.length > 0) {
    markdown += `## Failed Captures\n\n`;
    failures.forEach(failure => {
      markdown += `- **${failure.page}** (${failure.viewport}): ${failure.error}\n`;
    });
    markdown += `\n`;
  }
  
  return markdown;
}

/**
 * Main screenshot generation function
 */
async function generateScreenshots() {
  console.log('🚀 Starting Titan Grove GUI Screenshots Generation...\n');
  
  // Ensure directories exist
  ensureDirectoryExists();
  
  // Launch browser
  console.log('🌐 Launching browser...');
  const browser = await chromium.launch({ headless: true });
  
  const results = [];
  
  try {
    // Take screenshots for each page in both desktop and mobile viewports
    for (const pageInfo of GUI_PAGES) {
      console.log(`\n📄 Processing: ${pageInfo.title}`);
      
      // Desktop screenshot
      const desktopResult = await takePageScreenshot(browser, pageInfo, VIEWPORT_DESKTOP, 'desktop');
      results.push(desktopResult);
      
      // Mobile screenshot
      const mobileResult = await takePageScreenshot(browser, pageInfo, VIEWPORT_MOBILE, 'mobile');
      results.push(mobileResult);
    }
    
  } finally {
    await browser.close();
  }
  
  // Generate documentation
  console.log('\n📝 Generating documentation...');
  const documentation = generateDocumentation(results);
  fs.writeFileSync(path.join(SCREENSHOTS_DIR, 'README.md'), documentation);
  
  // Generate JSON report
  const jsonReport = {
    timestamp: new Date().toISOString(),
    summary: {
      totalPages: GUI_PAGES.length,
      totalScreenshots: results.length,
      successfulCaptures: results.filter(r => r.success).length,
      failedCaptures: results.filter(r => !r.success).length
    },
    results: results
  };
  fs.writeFileSync(path.join(SCREENSHOTS_DIR, 'report.json'), JSON.stringify(jsonReport, null, 2));
  
  console.log('\n✅ Screenshot generation complete!');
  console.log(`📊 Results: ${results.filter(r => r.success).length}/${results.length} successful captures`);
  console.log(`📁 Screenshots saved to: ${SCREENSHOTS_DIR}`);
  console.log(`📚 Documentation: ${path.join(SCREENSHOTS_DIR, 'README.md')}`);
  console.log(`📋 Report: ${path.join(SCREENSHOTS_DIR, 'report.json')}`);
}

// Run if called directly
if (require.main === module) {
  generateScreenshots().catch(error => {
    console.error('❌ Screenshot generation failed:', error);
    process.exit(1);
  });
}

module.exports = { generateScreenshots, GUI_PAGES };