# Cypress E2E Testing for Titan Grove ERP

This directory contains comprehensive end-to-end tests for all interactive page elements across the Titan Grove Enterprise Resource Planning (ERP) system.

## Overview

The Cypress test suite covers:
- **11 major UI modules** with comprehensive interactive element testing
- **Cross-module integration** testing
- **Responsive design** validation across multiple viewports
- **Accessibility** testing for compliance
- **Form validation** and user interaction flows
- **Real-time features** and dynamic content testing

## Test Structure

### Core Test Files

1. **`dashboard.cy.js`** - Executive dashboard navigation, KPIs, and widgets
2. **`business-intelligence.cy.js`** - BI dashboards, reports, and analytics controls
3. **`manufacturing.cy.js`** - Production controls, work orders, and quality management
4. **`financials.cy.js`** - GL, AP/AR, budgeting, and financial reporting
5. **`setup-wizard.cy.js`** - Installation wizard and configuration steps
6. **`all-modules.cy.js`** - HR, CRM, SCM, Project, Asset, and Compliance modules
7. **`cross-module-integration.cy.js`** - Integration between modules and global features

### Custom Commands

Located in `support/commands.js`, includes:
- `navigateToModule(moduleName)` - Navigate to specific modules
- `waitForPageLoad()` - Ensure page is fully loaded
- `shouldBeInteractive()` - Verify element interactivity
- `testFormInput(selector, value)` - Test form input functionality
- `testButtonClick(selector)` - Test button interactions
- `testModal(trigger, modal, close)` - Test modal dialog flows
- `testSearch(input, query, results)` - Test search functionality
- `testTabs(selector)` - Test tab navigation
- `testChart(selector)` - Verify chart/visualization presence

## Test Coverage

### Interactive Elements Tested

#### Navigation & Menus
- ✅ Main navigation between all modules
- ✅ Sidebar navigation and controls
- ✅ User menus and dropdowns
- ✅ Breadcrumb navigation
- ✅ Tab navigation within modules

#### Forms & Inputs
- ✅ Text inputs, dropdowns, and textareas
- ✅ Form validation (required fields, format validation)
- ✅ Submit buttons and form submission
- ✅ Multi-step form wizards
- ✅ File upload interfaces

#### Data Visualization
- ✅ Charts and graphs interactivity
- ✅ KPI cards and metric displays
- ✅ Real-time data updates
- ✅ Dashboard widget controls
- ✅ Report generation and export

#### Modal Dialogs & Popups
- ✅ Modal opening and closing
- ✅ Confirmation dialogs
- ✅ Help and information popups
- ✅ Form modals and data entry

#### Search & Filtering
- ✅ Global search functionality
- ✅ Module-specific search
- ✅ Advanced filters and sorting
- ✅ Search result interactions
- ✅ Keyboard shortcuts (Ctrl+K)

#### Real-time Features
- ✅ Live data updates
- ✅ Notification systems
- ✅ Real-time toggles and controls
- ✅ Auto-refresh functionality

### Module-Specific Testing

#### Manufacturing Module
- Production line controls (start/stop/pause)
- Work order management
- Quality control interfaces
- Machine status monitoring
- OEE (Overall Equipment Effectiveness) tracking

#### Financial Module
- Journal entry creation
- Invoice processing (AP/AR)
- Budget management
- Financial report generation
- Multi-currency support
- Approval workflows

#### Business Intelligence
- Dashboard configuration
- Report building and customization
- Data pipeline visualization
- Metric selectors and filters
- Export functionality

#### Setup Wizard
- Database configuration
- Environment setup
- Feature verification
- Progress tracking
- Validation steps

## Running Tests

### Prerequisites
```bash
npm install
```

### Run All E2E Tests
```bash
npm run test:e2e
```

### Open Interactive Test Runner
```bash
npm run test:e2e:open
```

### Run Specific Module Tests
```bash
npm run test:e2e:dashboard
npm run test:e2e:manufacturing  
npm run test:e2e:financials
npm run test:e2e:bi
npm run test:e2e:setup
npm run test:e2e:all-modules
npm run test:e2e:integration
```

### Run Tests in Headless Mode
```bash
npx cypress run
```

### Run Tests with Specific Browser
```bash
npx cypress run --browser chrome
npx cypress run --browser firefox
npx cypress run --browser edge
```

## Configuration

### Cypress Configuration (`cypress.config.js`)
- **Base URL**: `http://localhost:3000` (configurable)
- **Viewport**: 1280x720 (default desktop)
- **Timeouts**: 10s command, 30s response
- **Video**: Enabled for debugging
- **Screenshots**: Enabled on test failure

### Test Data (`fixtures/test-data.json`)
Contains structured test data including:
- User credentials for different roles
- Sample form data for all modules
- Module navigation mapping
- Viewport configurations for responsive testing

## Responsive Testing

Tests are automatically run across multiple viewports:
- **Mobile**: 375x667 (iPhone-like)
- **Tablet**: 768x1024 (iPad-like) 
- **Desktop**: 1280x720 (Standard desktop)
- **Large Desktop**: 1920x1080 (Full HD)

## Accessibility Testing

Basic accessibility features tested include:
- ✅ Proper heading hierarchy (h1-h6)
- ✅ Alt attributes on images
- ✅ Keyboard navigation (Tab, Ctrl+K)
- ✅ Focus management
- ✅ ARIA attributes where applicable

## Best Practices

### Writing Tests
1. **Use custom commands** for repetitive actions
2. **Test user workflows** end-to-end
3. **Verify interactive states** (hover, focus, active)
4. **Test error conditions** and edge cases
5. **Keep tests independent** - no dependencies between tests

### Selectors
1. **Prefer data attributes** (`[data-module="dashboard"]`)
2. **Use semantic selectors** (`.submit-btn` over generic `.btn`)
3. **Avoid brittle CSS selectors** that may change
4. **Use meaningful test IDs** when possible

### Test Organization
1. **Group related tests** with `describe` blocks
2. **Use descriptive test names** that explain the behavior
3. **Set up proper `beforeEach`** hooks for test isolation
4. **Clean up after tests** to prevent side effects

## Debugging

### Screenshots and Videos
- Screenshots are automatically taken on test failure
- Videos are recorded for all test runs
- Located in `cypress/screenshots/` and `cypress/videos/`

### Debug Mode
```bash
# Run in headed mode with DevTools open
npx cypress open --browser chrome

# Add debugging pauses in tests
cy.debug()
cy.pause()
```

### Console Logs
```javascript
cy.log('Custom debug message')
cy.task('log', 'Server-side logging')
```

## Continuous Integration

### GitHub Actions Example
```yaml
name: E2E Tests
on: [push, pull_request]
jobs:
  cypress-run:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: cypress-io/github-action@v5
        with:
          build: npm run build
          start: npm start
          wait-on: 'http://localhost:3000'
```

## Troubleshooting

### Common Issues
1. **Element not found**: Check if element exists conditionally
2. **Timing issues**: Use `cy.wait()` or `cy.waitFor...()` commands
3. **Flaky tests**: Add proper wait conditions
4. **Cross-origin errors**: Configure `baseUrl` correctly

### Performance
- Tests timeout after 10 seconds by default
- Use `cy.intercept()` for API mocking to speed up tests
- Consider parallel execution for large test suites

## Contributing

When adding new interactive elements:
1. **Add corresponding tests** in the appropriate spec file
2. **Use existing custom commands** when possible
3. **Test across different viewports** for responsive design
4. **Include accessibility checks** for new features
5. **Update this README** with new test coverage

## Resources

- [Cypress Documentation](https://docs.cypress.io)
- [Best Practices Guide](https://docs.cypress.io/guides/references/best-practices)
- [Custom Commands](https://docs.cypress.io/api/cypress-api/custom-commands)
- [Cypress Testing Library](https://testing-library.com/docs/cypress-testing-library/intro/)