// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Custom commands for Titan Grove ERP testing

/**
 * Custom command to navigate to a specific module
 */
Cypress.Commands.add('navigateToModule', (moduleName) => {
  cy.get(`[data-module="${moduleName}"]`).click();
  cy.wait(1000); // Allow time for module to load
});

/**
 * Custom command to wait for page to be fully loaded
 */
Cypress.Commands.add('waitForPageLoad', () => {
  cy.get('body').should('be.visible');
  cy.document().should('have.property', 'readyState', 'complete');
});

/**
 * Custom command to check if an element is interactive
 */
Cypress.Commands.add('shouldBeInteractive', { prevSubject: 'element' }, (subject) => {
  cy.wrap(subject)
    .should('be.visible')
    .should('not.be.disabled')
    .should('have.css', 'pointer-events', 'auto');
});

/**
 * Custom command to test form input
 */
Cypress.Commands.add('testFormInput', (selector, testValue) => {
  cy.get(selector)
    .should('be.visible')
    .clear()
    .type(testValue)
    .should('have.value', testValue);
});

/**
 * Custom command to test button click
 */
Cypress.Commands.add('testButtonClick', (selector) => {
  cy.get(selector)
    .should('be.visible')
    .should('not.be.disabled')
    .click();
});

/**
 * Custom command to test dropdown selection
 */
Cypress.Commands.add('testDropdownSelection', (dropdownSelector, optionValue) => {
  cy.get(dropdownSelector)
    .should('be.visible')
    .click()
    .get(`[value="${optionValue}"], [data-value="${optionValue}"]`)
    .click();
});

/**
 * Custom command to test modal interaction
 */
Cypress.Commands.add('testModal', (triggerSelector, modalSelector, closeSelector) => {
  // Open modal
  cy.get(triggerSelector).click();
  cy.get(modalSelector).should('be.visible');
  
  // Close modal
  if (closeSelector) {
    cy.get(closeSelector).click();
    cy.get(modalSelector).should('not.be.visible');
  }
});

/**
 * Custom command to test search functionality
 */
Cypress.Commands.add('testSearch', (inputSelector, searchTerm, resultSelector) => {
  cy.get(inputSelector)
    .should('be.visible')
    .clear()
    .type(searchTerm);
  
  if (resultSelector) {
    cy.get(resultSelector).should('be.visible');
  }
});

/**
 * Custom command to test navigation menu
 */
Cypress.Commands.add('testNavigationMenu', (menuItems) => {
  menuItems.forEach(item => {
    cy.get(`[data-module="${item}"]`)
      .should('be.visible')
      .shouldBeInteractive();
  });
});

/**
 * Custom command to test notification system
 */
Cypress.Commands.add('testNotifications', (bellSelector, dropdownSelector) => {
  cy.get(bellSelector)
    .should('be.visible')
    .click();
  
  cy.get(dropdownSelector)
    .should('be.visible');
});

/**
 * Custom command to test charts and visualizations
 */
Cypress.Commands.add('testChart', (chartSelector) => {
  cy.get(chartSelector)
    .should('be.visible')
    .should('not.be.empty');
});

/**
 * Custom command to test tabs
 */
Cypress.Commands.add('testTabs', (tabSelector, activeClass = 'active') => {
  cy.get(tabSelector).each(($tab, index) => {
    cy.wrap($tab)
      .should('be.visible')
      .click()
      .should('have.class', activeClass);
  });
});

/**
 * Custom command for complex workflow testing
 */
Cypress.Commands.add('testWorkflow', (workflowSteps) => {
  workflowSteps.forEach((step, index) => {
    cy.log(`Executing workflow step ${index + 1}: ${step.name}`);
    
    if (step.action === 'click') {
      cy.get(step.selector).should('be.visible').click();
    } else if (step.action === 'type') {
      cy.get(step.selector).should('be.visible').type(step.value);
    } else if (step.action === 'select') {
      cy.get(step.selector).should('be.visible').select(step.value);
    } else if (step.action === 'check') {
      cy.get(step.selector).should('be.visible').check();
    } else if (step.action === 'verify') {
      cy.get(step.selector).should('contain', step.expected);
    }
    
    if (step.wait) {
      cy.wait(step.wait);
    }
  });
});

/**
 * Custom command for multi-step form completion
 */
Cypress.Commands.add('completeMultiStepForm', (formSteps) => {
  formSteps.forEach((step, index) => {
    cy.log(`Completing form step ${index + 1}`);
    
    Object.keys(step.fields).forEach(fieldName => {
      const field = step.fields[fieldName];
      cy.get(field.selector).then($el => {
        const tagName = $el.prop('tagName').toLowerCase();
        
        if (tagName === 'select') {
          cy.wrap($el).select(field.value);
        } else if (field.type === 'checkbox') {
          if (field.value) cy.wrap($el).check();
        } else {
          cy.wrap($el).type(field.value);
        }
      });
    });
    
    if (step.nextButton) {
      cy.get(step.nextButton).click();
    }
  });
});

/**
 * Custom command for approval workflow testing
 */
Cypress.Commands.add('processApprovalWorkflow', (approvalLevels) => {
  approvalLevels.forEach((level, index) => {
    cy.log(`Processing approval level ${index + 1}: ${level.role}`);
    
    if (level.selector) {
      cy.get(level.selector).click();
    }
    
    if (level.comments) {
      cy.get(level.commentsSelector || '#approvalComments').type(level.comments);
    }
    
    if (level.action === 'approve') {
      cy.get(level.approveButton || '.approve-btn').click();
    } else if (level.action === 'reject') {
      cy.get(level.rejectButton || '.reject-btn').click();
    }
    
    if (level.verification) {
      cy.get(level.verification.selector).should('contain', level.verification.expected);
    }
  });
});

/**
 * Custom command for real-time monitoring validation
 */
Cypress.Commands.add('validateRealTimeMonitoring', (monitoringConfig) => {
  cy.log('Validating real-time monitoring capabilities');
  
  // Check for live data updates
  if (monitoringConfig.liveDataSelectors) {
    monitoringConfig.liveDataSelectors.forEach(selector => {
      cy.get(selector).should('be.visible');
      const initialValue = cy.get(selector).invoke('text');
      cy.wait(monitoringConfig.refreshInterval || 5000);
      // Note: In a real scenario, we'd validate that data actually updates
    });
  }
  
  // Validate alert functionality
  if (monitoringConfig.alertTriggers) {
    monitoringConfig.alertTriggers.forEach(trigger => {
      cy.get(trigger.selector).click();
      cy.get(trigger.alertSelector).should('be.visible');
    });
  }
  
  // Check dashboard responsiveness
  if (monitoringConfig.responsiveElements) {
    monitoringConfig.responsiveElements.forEach(element => {
      cy.get(element).should('be.visible').shouldBeInteractive();
    });
  }
});

/**
 * Custom command for data integration testing
 */
Cypress.Commands.add('testDataIntegration', (integrationConfig) => {
  cy.log('Testing data integration capabilities');
  
  // Test data import
  if (integrationConfig.importTest) {
    cy.get(integrationConfig.importTest.selector).click();
    cy.get(integrationConfig.importTest.fileInput).selectFile(integrationConfig.importTest.testFile);
    cy.get(integrationConfig.importTest.submitButton).click();
    cy.get(integrationConfig.importTest.successIndicator).should('be.visible');
  }
  
  // Test data export
  if (integrationConfig.exportTest) {
    cy.get(integrationConfig.exportTest.selector).click();
    cy.get(integrationConfig.exportTest.formatSelector).select(integrationConfig.exportTest.format);
    cy.get(integrationConfig.exportTest.downloadButton).click();
  }
  
  // Test API connections
  if (integrationConfig.apiTests) {
    integrationConfig.apiTests.forEach(apiTest => {
      cy.get(apiTest.testButton).click();
      cy.get(apiTest.statusIndicator).should('contain', 'CONNECTED');
    });
  }
});

/**
 * Custom command for performance validation
 */
Cypress.Commands.add('validatePerformance', (performanceConfig) => {
  cy.log('Validating system performance');
  
  const startTime = Date.now();
  
  if (performanceConfig.pageLoadTest) {
    cy.visit(performanceConfig.pageLoadTest.url);
    cy.waitForPageLoad();
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).to.be.lessThan(performanceConfig.pageLoadTest.maxTime || 5000);
  }
  
  if (performanceConfig.interactionTests) {
    performanceConfig.interactionTests.forEach(test => {
      const interactionStart = Date.now();
      cy.get(test.selector).click();
      cy.get(test.resultSelector).should('be.visible');
      const interactionTime = Date.now() - interactionStart;
      expect(interactionTime).to.be.lessThan(test.maxTime || 2000);
    });
  }
});

/**
 * Custom command for accessibility testing
 */
Cypress.Commands.add('validateAccessibility', (accessibilityConfig) => {
  cy.log('Validating accessibility compliance');
  
  // Check for ARIA labels
  if (accessibilityConfig.ariaElements) {
    accessibilityConfig.ariaElements.forEach(element => {
      cy.get(element.selector).should('have.attr', 'aria-label');
    });
  }
  
  // Test keyboard navigation
  if (accessibilityConfig.keyboardNavigation) {
    accessibilityConfig.keyboardNavigation.forEach(navTest => {
      cy.get(navTest.startElement).focus();
      cy.get(navTest.startElement).type(navTest.keySequence);
      cy.get(navTest.expectedElement).should('be.focused');
    });
  }
  
  // Check color contrast (simplified check)
  if (accessibilityConfig.contrastElements) {
    accessibilityConfig.contrastElements.forEach(element => {
      cy.get(element).should('be.visible');
      // Note: Full contrast checking would require additional tools
    });
  }
});

/**
 * Custom command for security testing
 */
Cypress.Commands.add('validateSecurity', (securityConfig) => {
  cy.log('Validating security controls');
  
  // Test unauthorized access
  if (securityConfig.unauthorizedTests) {
    securityConfig.unauthorizedTests.forEach(test => {
      cy.visit(test.url, { failOnStatusCode: false });
      cy.get(test.accessDeniedSelector).should('be.visible');
    });
  }
  
  // Test input validation
  if (securityConfig.inputValidationTests) {
    securityConfig.inputValidationTests.forEach(test => {
      cy.get(test.inputSelector).type(test.maliciousInput);
      cy.get(test.submitSelector).click();
      cy.get(test.errorSelector).should('be.visible');
    });
  }
  
  // Test session management
  if (securityConfig.sessionTests) {
    cy.clearCookies();
    cy.visit(securityConfig.sessionTests.protectedUrl, { failOnStatusCode: false });
    cy.get(securityConfig.sessionTests.loginPrompt).should('be.visible');
  }
});

/**
 * Custom command for navigation menu testing
 */
Cypress.Commands.add('testNavigationMenu', (menuItems) => {
  cy.log('Testing navigation menu functionality');
  
  menuItems.forEach(item => {
    cy.get(`[data-module="${item}"], .nav-item[href*="${item}"], #${item}Nav`)
      .should('be.visible')
      .shouldBeInteractive();
  });
});

/**
 * Custom command for search functionality testing
 */
Cypress.Commands.add('testSearch', (searchSelector, searchTerm, resultsSelector) => {
  cy.get(searchSelector)
    .should('be.visible')
    .clear()
    .type(searchTerm);
    
  cy.get('body').then($body => {
    if ($body.find(resultsSelector).length > 0) {
      cy.get(resultsSelector)
        .should('be.visible');
    }
  });
});

/**
 * Custom command for notification testing
 */
Cypress.Commands.add('testNotifications', (triggerSelector, dropdownSelector) => {
  cy.get(triggerSelector)
    .should('be.visible')
    .click();
    
  cy.get('body').then($body => {
    if ($body.find(dropdownSelector).length > 0) {
      cy.get(dropdownSelector)
        .should('be.visible');
    }
  });
});