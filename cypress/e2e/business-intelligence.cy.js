describe('Business Intelligence Interactive Elements', () => {
  beforeEach(() => {
    cy.visit('/src/ui/static/business-intelligence.html');
    cy.waitForPageLoad();
  });

  describe('BI Header Elements', () => {
    it('should display BI-specific search functionality', () => {
      cy.testSearch('#biGlobalSearch', 'revenue report', '#biSearchSuggestions');
      
      cy.get('#biGlobalSearch')
        .should('have.attr', 'placeholder')
        .and('contain', 'Search reports, KPIs, data sources');
    });

    it('should display BI metrics summary', () => {
      const expectedMetrics = ['Data Sources', 'Reports', 'Refresh Rate'];
      
      expectedMetrics.forEach(metric => {
        cy.get('.bi-metrics-summary')
          .contains(metric)
          .should('be.visible')
          .siblings('.metric-value')
          .should('be.visible');
      });
    });

    it('should handle notification center interactions', () => {
      cy.get('.titan-notification-center')
        .should('be.visible')
        .find('.notification-icon')
        .should('be.visible')
        .shouldBeInteractive();
      
      cy.get('.notification-badge')
        .should('be.visible');
    });

    it('should display user profile menu', () => {
      cy.get('.user-profile-menu')
        .should('be.visible')
        .find('.profile-avatar')
        .should('be.visible');
        
      cy.get('.profile-name')
        .should('contain.text', 'Michael Chen');
        
      cy.get('.profile-role')
        .should('contain.text', 'BI Director');
    });
  });

  describe('BI Dashboard Navigation', () => {
    it('should have active BI module in navigation', () => {
      cy.get('.nav-item[data-module="bi"]')
        .should('have.class', 'active')
        .find('span')
        .should('contain.text', 'Analytics');
    });

    it('should navigate to other modules', () => {
      const modules = [
        'dashboard',
        'hr-management', 
        'crm',
        'supply-chain',
        'project',
        'manufacturing',
        'financials'
      ];
      
      modules.forEach(module => {
        cy.get(`[data-module="${module}"]`)
          .should('be.visible')
          .shouldBeInteractive();
      });
    });
  });

  describe('BI Dashboard Controls', () => {
    it('should test dashboard tabs if present', () => {
      cy.get('body').then($body => {
        if ($body.find('.bi-dashboard-tab').length > 0) {
          cy.get('.bi-dashboard-tab').each(($tab) => {
            cy.wrap($tab)
              .should('be.visible')
              .shouldBeInteractive()
              .click();
          });
        }
      });
    });

    it('should test filter panels', () => {
      cy.get('body').then($body => {
        if ($body.find('.bi-filter-panel').length > 0) {
          cy.get('.bi-filter-panel').each(($panel) => {
            cy.wrap($panel)
              .should('be.visible')
              .find('.bi-filter-apply')
              .should('be.visible')
              .shouldBeInteractive();
          });
        }
      });
    });

    it('should test export functionality', () => {
      cy.get('body').then($body => {
        if ($body.find('.bi-export-btn').length > 0) {
          cy.get('.bi-export-btn').each(($btn) => {
            cy.wrap($btn)
              .should('be.visible')
              .shouldBeInteractive();
          });
        }
      });
    });
  });

  describe('BI Real-time Controls', () => {
    it('should test real-time toggle controls', () => {
      cy.get('body').then($body => {
        if ($body.find('.bi-realtime-toggle').length > 0) {
          cy.get('.bi-realtime-toggle')
            .should('be.visible')
            .click();
        }
      });
    });

    it('should test time range selectors', () => {
      cy.get('body').then($body => {
        if ($body.find('.bi-time-range-selector').length > 0) {
          cy.get('.bi-time-range-selector')
            .should('be.visible')
            .select('7d'); // Assuming this option exists
        }
      });
    });

    it('should test metric selectors', () => {
      cy.get('body').then($body => {
        if ($body.find('.bi-metric-selector').length > 0) {
          cy.get('.bi-metric-selector').each(($selector) => {
            cy.wrap($selector)
              .should('be.visible')
              .shouldBeInteractive()
              .click();
          });
        }
      });
    });
  });

  describe('BI Search and Filter Elements', () => {
    it('should test search inputs', () => {
      cy.get('body').then($body => {
        if ($body.find('.bi-search-input').length > 0) {
          cy.get('.bi-search-input').each(($input) => {
            cy.wrap($input)
              .should('be.visible')
              .type('test query')
              .clear();
          });
        }
      });
    });

    it('should test filter inputs', () => {
      cy.get('body').then($body => {
        if ($body.find('.bi-filter-input').length > 0) {
          cy.get('.bi-filter-input').each(($input) => {
            cy.wrap($input)
              .should('be.visible')
              .type('filter value')
              .clear();
          });
        }
      });
    });
  });

  describe('BI Data Pipeline Visualization', () => {
    it('should display data sources as interactive elements', () => {
      cy.get('body').then($body => {
        if ($body.find('.data-source').length > 0) {
          cy.get('.data-source').each(($source) => {
            cy.wrap($source)
              .should('be.visible')
              .find('.source-metrics')
              .should('be.visible');
          });
        }
      });
    });

    it('should test pipeline toggle buttons', () => {
      cy.get('body').then($body => {
        if ($body.find('.pipeline-toggle').length > 0) {
          cy.get('.pipeline-toggle').each(($toggle) => {
            cy.wrap($toggle)
              .should('be.visible')
              .shouldBeInteractive()
              .click();
          });
        }
      });
    });

    it('should display data processor status', () => {
      cy.get('body').then($body => {
        if ($body.find('.data-processor').length > 0) {
          cy.get('.data-processor').each(($processor) => {
            cy.wrap($processor)
              .should('be.visible')
              .find('.processor-status')
              .should('be.visible');
          });
        }
      });
    });
  });

  describe('BI Modal Interactions', () => {
    it('should test modal overlay functionality', () => {
      cy.get('body').then($body => {
        if ($body.find('#biModalOverlay').length > 0) {
          // Test if there are buttons that trigger the modal
          if ($body.find('[data-modal="bi-details"]').length > 0) {
            cy.get('[data-modal="bi-details"]')
              .first()
              .click();
              
            cy.get('#biModalOverlay')
              .should('be.visible');
              
            cy.get('#closeBiModal')
              .should('be.visible')
              .click();
              
            cy.get('#biModalOverlay')
              .should('not.be.visible');
          }
        }
      });
    });
  });

  describe('BI Chart Interactions', () => {
    it('should test interactive charts', () => {
      // Test various chart containers that might be present
      const chartSelectors = [
        '.analytics-chart',
        '.revenue-chart', 
        '.kpi-chart',
        '.performance-metrics',
        '.trend-chart'
      ];
      
      chartSelectors.forEach(selector => {
        cy.get('body').then($body => {
          if ($body.find(selector).length > 0) {
            cy.testChart(selector);
          }
        });
      });
    });
  });

  describe('BI Responsive Design', () => {
    it('should handle mobile viewport in BI interface', () => {
      cy.viewport(375, 667);
      cy.get('.titan-enterprise-header').should('be.visible');
      cy.get('.bi-metrics-summary').should('be.visible');
    });

    it('should handle tablet viewport in BI interface', () => {
      cy.viewport(768, 1024);
      cy.get('.titan-enterprise-header').should('be.visible');
      cy.get('.user-profile-menu').should('be.visible');
    });
  });
});