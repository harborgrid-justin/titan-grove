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