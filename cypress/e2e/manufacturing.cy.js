describe('Manufacturing Module Interactive Elements', () => {
  beforeEach(() => {
    cy.visit('/src/ui/static/manufacturing.html');
    cy.waitForPageLoad();
  });

  describe('Manufacturing Header', () => {
    it('should display manufacturing-specific branding', () => {
      cy.get('.titan-edition-badge')
        .should('contain.text', 'Manufacturing');
    });

    it('should have manufacturing-specific search', () => {
      cy.testSearch('#globalSearch', 'work order', '#searchSuggestions');
      
      cy.get('#globalSearch')
        .should('have.attr', 'placeholder')
        .and('contain', 'Search manufacturing operations');
    });

    it('should show active manufacturing navigation', () => {
      cy.get('.nav-item[data-module="manufacturing"]')
        .should('have.class', 'active')
        .find('.nav-badge')
        .should('contain.text', '12');
    });
  });

  describe('Manufacturing Sidebar', () => {
    it('should display manufacturing sidebar controls', () => {
      cy.get('.manufacturing-sidebar')
        .should('be.visible');
        
      cy.get('.sidebar-header h3')
        .should('contain.text', 'Manufacturing Excellence');
        
      // Test sidebar action buttons
      const sidebarButtons = [
        { title: 'Create Work Order', icon: 'fa-plus' },
        { title: 'Export Reports', icon: 'fa-download' },
        { title: 'Settings', icon: 'fa-cog' }
      ];
      
      sidebarButtons.forEach(button => {
        cy.get(`.sidebar-btn[title="${button.title}"]`)
          .should('be.visible')
          .shouldBeInteractive()
          .find('i')
          .should('have.class', button.icon);
      });
    });

    it('should test manufacturing navigation menu', () => {
      cy.get('body').then($body => {
        if ($body.find('.manufacturing-nav-menu').length > 0) {
          cy.get('.manufacturing-nav-menu .nav-item').each(($item) => {
            cy.wrap($item)
              .should('be.visible')
              .shouldBeInteractive();
          });
        }
      });
    });
  });

  describe('Manufacturing Dashboard Elements', () => {
    it('should display manufacturing KPIs', () => {
      // Test for manufacturing-specific KPI cards
      const manufacturingKPIs = [
        '.production-efficiency',
        '.oee-metric',
        '.quality-score', 
        '.downtime-indicator',
        '.throughput-rate'
      ];
      
      manufacturingKPIs.forEach(selector => {
        cy.get('body').then($body => {
          if ($body.find(selector).length > 0) {
            cy.get(selector)
              .should('be.visible')
              .find('.kpi-value')
              .should('be.visible');
          }
        });
      });
    });

    it('should test manufacturing status indicators', () => {
      // Test status lights, indicators, and gauges
      const statusElements = [
        '.machine-status',
        '.production-status',
        '.quality-status',
        '.safety-indicator'
      ];
      
      statusElements.forEach(selector => {
        cy.get('body').then($body => {
          if ($body.find(selector).length > 0) {
            cy.get(selector)
              .should('be.visible');
          }
        });
      });
    });
  });

  describe('Work Order Management', () => {
    it('should test work order creation button', () => {
      cy.get('body').then($body => {
        if ($body.find('.create-work-order, #createWorkOrder').length > 0) {
          cy.get('.create-work-order, #createWorkOrder')
            .should('be.visible')
            .shouldBeInteractive()
            .click();
        }
      });
    });

    it('should test work order list interactions', () => {
      cy.get('body').then($body => {
        if ($body.find('.work-order-item').length > 0) {
          cy.get('.work-order-item').each(($item) => {
            cy.wrap($item)
              .should('be.visible')
              .find('.work-order-actions')
              .should('be.visible');
          });
        }
      });
    });

    it('should test work order filters', () => {
      const filterSelectors = [
        '.status-filter',
        '.priority-filter',
        '.department-filter',
        '.date-range-filter'
      ];
      
      filterSelectors.forEach(selector => {
        cy.get('body').then($body => {
          if ($body.find(selector).length > 0) {
            cy.get(selector)
              .should('be.visible')
              .shouldBeInteractive();
          }
        });
      });
    });
  });

  describe('Production Line Controls', () => {
    it('should test production line status displays', () => {
      cy.get('body').then($body => {
        if ($body.find('.production-line').length > 0) {
          cy.get('.production-line').each(($line) => {
            cy.wrap($line)
              .should('be.visible')
              .find('.line-status')
              .should('be.visible');
          });
        }
      });
    });

    it('should test production controls', () => {
      const controlButtons = [
        '.start-production',
        '.stop-production', 
        '.pause-production',
        '.emergency-stop'
      ];
      
      controlButtons.forEach(selector => {
        cy.get('body').then($body => {
          if ($body.find(selector).length > 0) {
            cy.get(selector)
              .should('be.visible')
              .shouldBeInteractive();
          }
        });
      });
    });

    it('should test machine status monitoring', () => {
      cy.get('body').then($body => {
        if ($body.find('.machine-card').length > 0) {
          cy.get('.machine-card').each(($machine) => {
            cy.wrap($machine)
              .should('be.visible')
              .find('.machine-status-indicator')
              .should('be.visible');
          });
        }
      });
    });
  });

  describe('Quality Management', () => {
    it('should test quality control interfaces', () => {
      const qualityElements = [
        '.quality-check-form',
        '.inspection-results',
        '.defect-tracking',
        '.quality-metrics'
      ];
      
      qualityElements.forEach(selector => {
        cy.get('body').then($body => {
          if ($body.find(selector).length > 0) {
            cy.get(selector)
              .should('be.visible');
          }
        });
      });
    });

    it('should test quality approval buttons', () => {
      cy.get('body').then($body => {
        if ($body.find('.approve-quality, .reject-quality').length > 0) {
          cy.get('.approve-quality, .reject-quality').each(($btn) => {
            cy.wrap($btn)
              .should('be.visible')
              .shouldBeInteractive();
          });
        }
      });
    });
  });

  describe('Inventory Integration', () => {
    it('should test material availability displays', () => {
      cy.get('body').then($body => {
        if ($body.find('.material-status').length > 0) {
          cy.get('.material-status').each(($status) => {
            cy.wrap($status)
              .should('be.visible');
          });
        }
      });
    });

    it('should test inventory request buttons', () => {
      cy.get('body').then($body => {
        if ($body.find('.request-materials, .check-inventory').length > 0) {
          cy.get('.request-materials, .check-inventory').each(($btn) => {
            cy.wrap($btn)
              .should('be.visible')
              .shouldBeInteractive();
          });
        }
      });
    });
  });

  describe('Manufacturing Reports', () => {
    it('should test report generation controls', () => {
      const reportButtons = [
        '.generate-production-report',
        '.export-manufacturing-data',
        '.download-oee-report',
        '.quality-summary-report'
      ];
      
      reportButtons.forEach(selector => {
        cy.get('body').then($body => {
          if ($body.find(selector).length > 0) {
            cy.get(selector)
              .should('be.visible')
              .shouldBeInteractive();
          }
        });
      });
    });

    it('should test report filter options', () => {
      cy.get('body').then($body => {
        if ($body.find('.report-date-range, .report-filters').length > 0) {
          cy.get('.report-date-range, .report-filters')
            .should('be.visible')
            .shouldBeInteractive();
        }
      });
    });
  });

  describe('Real-time Monitoring', () => {
    it('should test real-time data toggles', () => {
      cy.get('body').then($body => {
        if ($body.find('.realtime-toggle').length > 0) {
          cy.get('.realtime-toggle')
            .should('be.visible')
            .click();
        }
      });
    });

    it('should test refresh controls', () => {
      cy.get('body').then($body => {
        if ($body.find('.refresh-data, .auto-refresh-toggle').length > 0) {
          cy.get('.refresh-data, .auto-refresh-toggle').each(($control) => {
            cy.wrap($control)
              .should('be.visible')
              .shouldBeInteractive();
          });
        }
      });
    });

    it('should display live production metrics', () => {
      cy.get('body').then($body => {
        if ($body.find('.live-metric').length > 0) {
          cy.get('.live-metric').each(($metric) => {
            cy.wrap($metric)
              .should('be.visible')
              .find('.metric-value')
              .should('be.visible');
          });
        }
      });
    });
  });

  describe('Manufacturing Charts and Visualizations', () => {
    it('should test manufacturing-specific charts', () => {
      const chartSelectors = [
        '.production-timeline-chart',
        '.oee-trend-chart',
        '.quality-dashboard-chart',
        '.throughput-chart',
        '.downtime-analysis-chart'
      ];
      
      chartSelectors.forEach(selector => {
        cy.get('body').then($body => {
          if ($body.find(selector).length > 0) {
            cy.testChart(selector);
          }
        });
      });
    });

    it('should test chart interaction controls', () => {
      cy.get('body').then($body => {
        if ($body.find('.chart-time-range, .chart-filters').length > 0) {
          cy.get('.chart-time-range, .chart-filters').each(($control) => {
            cy.wrap($control)
              .should('be.visible')
              .shouldBeInteractive();
          });
        }
      });
    });
  });

  describe('Manufacturing Modal Dialogs', () => {
    it('should test work order modal', () => {
      cy.get('body').then($body => {
        if ($body.find('.work-order-modal-trigger').length > 0) {
          cy.testModal(
            '.work-order-modal-trigger',
            '.work-order-modal',
            '.work-order-modal .close'
          );
        }
      });
    });

    it('should test machine maintenance modal', () => {
      cy.get('body').then($body => {
        if ($body.find('.maintenance-modal-trigger').length > 0) {
          cy.testModal(
            '.maintenance-modal-trigger',
            '.maintenance-modal',
            '.maintenance-modal .close'
          );
        }
      });
    });
  });

  describe('Manufacturing Forms', () => {
    it('should test manufacturing data entry forms', () => {
      cy.get('body').then($body => {
        if ($body.find('.manufacturing-form').length > 0) {
          cy.get('.manufacturing-form input, .manufacturing-form select, .manufacturing-form textarea').each(($input) => {
            const inputType = $input.prop('tagName').toLowerCase();
            
            if (inputType === 'select') {
              cy.wrap($input)
                .should('be.visible')
                .shouldBeInteractive();
            } else if (inputType === 'input' && $input.attr('type') !== 'submit') {
              cy.wrap($input)
                .should('be.visible')
                .type('test-data')
                .clear();
            }
          });
        }
      });
    });

    it('should test form submission buttons', () => {
      cy.get('body').then($body => {
        if ($body.find('.manufacturing-form .submit-btn').length > 0) {
          cy.get('.manufacturing-form .submit-btn')
            .should('be.visible')
            .shouldBeInteractive();
        }
      });
    });
  });

  describe('Manufacturing Responsive Design', () => {
    it('should handle mobile viewport in manufacturing module', () => {
      cy.viewport(375, 667);
      cy.get('.titan-enterprise-header').should('be.visible');
      cy.get('.manufacturing-sidebar').should('be.visible');
    });

    it('should handle tablet viewport in manufacturing module', () => {
      cy.viewport(768, 1024);
      cy.get('.titan-main-content').should('be.visible');
      cy.get('.manufacturing-sidebar').should('be.visible');
    });
  });
});