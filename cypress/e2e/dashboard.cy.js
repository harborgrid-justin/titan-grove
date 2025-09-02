describe('Dashboard Interactive Elements', () => {
  beforeEach(() => {
    cy.visit('/src/ui/static/dashboard.html');
    cy.waitForPageLoad();
  });

  describe('Header Navigation', () => {
    it('should display and interact with main navigation items', () => {
      const navigationItems = [
        'dashboard',
        'manufacturing', 
        'financials',
        'supply-chain',
        'crm',
        'hr',
        'projects',
        'analytics'
      ];
      
      cy.testNavigationMenu(navigationItems);
    });

    it('should handle global search functionality', () => {
      cy.testSearch('#globalSearch', 'test search', '#searchSuggestions');
      
      // Test keyboard shortcut
      cy.get('body').type('{ctrl}k');
      cy.get('#globalSearch').should('be.focused');
    });

    it('should display and interact with notification bell', () => {
      cy.testNotifications('#notificationBell', '#notificationDropdown');
      
      // Test mark all read functionality
      cy.get('#notificationDropdown .mark-all-read')
        .should('be.visible')
        .click();
    });

    it('should display and interact with user menu', () => {
      cy.get('#userAvatar')
        .should('be.visible')
        .click();
      
      cy.get('#userDropdown')
        .should('be.visible');
      
      // Test menu items
      const menuItems = [
        'Profile Settings',
        'Company Settings', 
        'Appearance',
        'Help & Support',
        'Sign Out'
      ];
      
      menuItems.forEach(item => {
        cy.get('#userDropdown').contains(item)
          .should('be.visible')
          .shouldBeInteractive();
      });
    });
  });

  describe('Sidebar Navigation', () => {
    it('should display sidebar controls', () => {
      cy.get('.sidebar-btn[title="Customize Dashboard"]')
        .should('be.visible')
        .shouldBeInteractive();
      
      cy.get('.sidebar-btn[title="Export Dashboard"]')
        .should('be.visible')
        .shouldBeInteractive();
        
      cy.get('.sidebar-btn[title="Full Screen"]')
        .should('be.visible')
        .shouldBeInteractive();
    });

    it('should navigate through sidebar menu items', () => {
      cy.get('.nav-list-item').each(($item) => {
        cy.wrap($item)
          .should('be.visible')
          .find('a')
          .shouldBeInteractive();
      });
    });
  });

  describe('Dashboard Widgets', () => {
    it('should display KPI cards as interactive elements', () => {
      cy.get('.kpi-card').each(($card) => {
        cy.wrap($card)
          .should('be.visible')
          .find('.kpi-value')
          .should('be.visible');
      });
    });

    it('should interact with chart elements', () => {
      // Test various chart containers that should be present
      const chartSelectors = [
        '.revenue-chart',
        '.performance-chart', 
        '.metrics-chart',
        '.analytics-chart'
      ];
      
      chartSelectors.forEach(selector => {
        cy.get('body').then($body => {
          if ($body.find(selector).length > 0) {
            cy.testChart(selector);
          }
        });
      });
    });

    it('should handle widget interactions', () => {
      // Test widget controls if they exist
      cy.get('.widget-header').then($headers => {
        if ($headers.length > 0) {
          cy.get('.widget-header').each(($header) => {
            cy.wrap($header)
              .find('.widget-controls')
              .should('be.visible');
          });
        }
      });
    });
  });

  describe('Responsive Elements', () => {
    it('should handle mobile viewport', () => {
      cy.viewport(375, 667);
      cy.get('.titan-enterprise-header').should('be.visible');
      cy.get('.titan-main-content').should('be.visible');
    });

    it('should handle tablet viewport', () => {
      cy.viewport(768, 1024);
      cy.get('.titan-enterprise-header').should('be.visible');
      cy.get('.titan-sidebar').should('be.visible');
    });
  });

  describe('Interactive State Management', () => {
    it('should handle active states in navigation', () => {
      cy.get('.nav-item.active')
        .should('exist')
        .should('have.class', 'active');
    });

    it('should handle hover states on interactive elements', () => {
      cy.get('.nav-item')
        .first()
        .trigger('mouseover')
        .should('be.visible');
    });

    it('should handle focus states on focusable elements', () => {
      cy.get('#globalSearch')
        .focus()
        .should('be.focused');
    });
  });
});