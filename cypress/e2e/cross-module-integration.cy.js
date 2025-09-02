describe('Cross-Module Integration Tests', () => {
  beforeEach(() => {
    cy.visit('/src/ui/static/index.html');
    cy.waitForPageLoad();
  });

  describe('Global Navigation Integration', () => {
    it('should navigate between all major modules', () => {
      const modules = [
        { module: 'dashboard', file: 'dashboard.html' },
        { module: 'manufacturing', file: 'manufacturing.html' },
        { module: 'financials', file: 'financials.html' },
        { module: 'supply-chain', file: 'supply-chain-management.html' },
        { module: 'crm', file: 'crm-management.html' },
        { module: 'hr', file: 'hr-management.html' },
        { module: 'projects', file: 'project-management.html' },
        { module: 'analytics', file: 'business-intelligence.html' }
      ];

      modules.forEach(({ module, file }) => {
        cy.visit(`/src/ui/static/${file}`);
        cy.waitForPageLoad();
        
        // Verify module-specific elements are present
        cy.get('.titan-enterprise-header').should('be.visible');
        cy.get(`[data-module="${module}"]`).should('be.visible');
        
        // Test that global search exists in each module
        cy.get('#globalSearch, .global-search-input').should('be.visible');
      });
    });

    it('should maintain consistent header elements across modules', () => {
      const moduleFiles = [
        'dashboard.html',
        'manufacturing.html', 
        'financials.html',
        'business-intelligence.html'
      ];

      moduleFiles.forEach(file => {
        cy.visit(`/src/ui/static/${file}`);
        cy.waitForPageLoad();
        
        // Test consistent header elements
        cy.get('.titan-logo-enterprise').should('be.visible');
        cy.get('.titan-main-navigation').should('be.visible');
        
        // Test user menu consistency
        cy.get('body').then($body => {
          if ($body.find('.titan-user-menu, .user-profile-menu').length > 0) {
            cy.get('.titan-user-menu, .user-profile-menu').should('be.visible');
          }
        });
      });
    });
  });

  describe('Global Search Integration', () => {
    it('should test search functionality across different modules', () => {
      const searchTests = [
        { file: 'dashboard.html', query: 'revenue', context: 'executive' },
        { file: 'manufacturing.html', query: 'work order', context: 'manufacturing' },
        { file: 'financials.html', query: 'invoice', context: 'financial' },
        { file: 'business-intelligence.html', query: 'report', context: 'BI' }
      ];

      searchTests.forEach(({ file, query, context }) => {
        cy.visit(`/src/ui/static/${file}`);
        cy.waitForPageLoad();
        
        cy.get('#globalSearch, .global-search-input')
          .should('be.visible')
          .type(query)
          .should('have.value', query)
          .clear();
      });
    });

    it('should test search keyboard shortcuts across modules', () => {
      const moduleFiles = ['dashboard.html', 'manufacturing.html', 'financials.html'];

      moduleFiles.forEach(file => {
        cy.visit(`/src/ui/static/${file}`);
        cy.waitForPageLoad();
        
        // Test Ctrl+K shortcut if supported
        cy.get('body').type('{ctrl}k');
        cy.get('#globalSearch, .global-search-input').should('be.focused');
      });
    });
  });

  describe('Responsive Design Across Modules', () => {
    const testViewports = [
      { name: 'Mobile', width: 375, height: 667 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Desktop', width: 1280, height: 720 },
      { name: 'Large Desktop', width: 1920, height: 1080 }
    ];

    const moduleFiles = [
      'dashboard.html',
      'manufacturing.html',
      'financials.html',
      'business-intelligence.html'
    ];

    testViewports.forEach(({ name, width, height }) => {
      moduleFiles.forEach(file => {
        it(`should display correctly on ${name} viewport for ${file}`, () => {
          cy.viewport(width, height);
          cy.visit(`/src/ui/static/${file}`);
          cy.waitForPageLoad();
          
          // Test that header is visible and responsive
          cy.get('.titan-enterprise-header').should('be.visible');
          
          // Test that main content area is visible
          cy.get('.titan-main-content, .main-content').should('be.visible');
          
          // Test that no horizontal scrolling is needed (within reason)
          cy.get('body').should('have.css', 'overflow-x').and('match', /hidden|auto/);
        });
      });
    });
  });

  describe('Modal and Popup Integration', () => {
    it('should test modal functionality across modules', () => {
      const moduleFiles = [
        'dashboard.html',
        'manufacturing.html', 
        'business-intelligence.html',
        'setup.html'
      ];

      moduleFiles.forEach(file => {
        cy.visit(`/src/ui/static/${file}`);
        cy.waitForPageLoad();
        
        // Look for modal triggers and test if they exist
        cy.get('body').then($body => {
          if ($body.find('[data-modal], .modal-trigger, .open-modal').length > 0) {
            cy.get('[data-modal], .modal-trigger, .open-modal')
              .first()
              .click();
              
            // Check if modal opens
            cy.get('.modal-overlay, .modal, .modal-container')
              .should('be.visible');
              
            // Try to close modal
            if ($body.find('.modal-close, .close-modal, [data-dismiss="modal"]').length > 0) {
              cy.get('.modal-close, .close-modal, [data-dismiss="modal"]')
                .first()
                .click();
                
              cy.get('.modal-overlay, .modal, .modal-container')
                .should('not.be.visible');
            }
          }
        });
      });
    });
  });

  describe('Form Integration Across Modules', () => {
    it('should test form validation consistency', () => {
      const formPages = [
        'setup.html',
        'manufacturing.html',
        'financials.html'
      ];

      formPages.forEach(file => {
        cy.visit(`/src/ui/static/${file}`);
        cy.waitForPageLoad();
        
        // Test required field validation
        cy.get('body').then($body => {
          if ($body.find('input[required]').length > 0) {
            cy.get('input[required]')
              .first()
              .clear()
              .blur();
              
            // Should show some form of validation
            cy.get('input[required]')
              .first()
              .then($input => {
                const isInvalid = $input.hasClass('invalid') || 
                                $input.hasClass('error') || 
                                $input.is(':invalid');
                expect(isInvalid).to.be.true;
              });
          }
        });
      });
    });

    it('should test form submission buttons are interactive', () => {
      const formPages = ['setup.html', 'manufacturing.html', 'financials.html'];

      formPages.forEach(file => {
        cy.visit(`/src/ui/static/${file}`);
        cy.waitForPageLoad();
        
        cy.get('body').then($body => {
          if ($body.find('button[type="submit"], .submit-btn, .btn-primary').length > 0) {
            cy.get('button[type="submit"], .submit-btn, .btn-primary').each($btn => {
              cy.wrap($btn)
                .should('be.visible')
                .should('not.be.disabled')
                .shouldBeInteractive();
            });
          }
        });
      });
    });
  });

  describe('Chart and Visualization Integration', () => {
    it('should test charts load across different modules', () => {
      const chartModules = [
        { file: 'dashboard.html', expectedCharts: ['.kpi-card', '.dashboard-chart'] },
        { file: 'business-intelligence.html', expectedCharts: ['.analytics-chart', '.bi-visualization'] },
        { file: 'manufacturing.html', expectedCharts: ['.production-chart', '.oee-chart'] },
        { file: 'financials.html', expectedCharts: ['.financial-chart', '.revenue-chart'] }
      ];

      chartModules.forEach(({ file, expectedCharts }) => {
        cy.visit(`/src/ui/static/${file}`);
        cy.waitForPageLoad();
        
        // Wait for any charts to potentially load
        cy.wait(2000);
        
        expectedCharts.forEach(chartSelector => {
          cy.get('body').then($body => {
            if ($body.find(chartSelector).length > 0) {
              cy.get(chartSelector)
                .should('be.visible')
                .should('not.be.empty');
            }
          });
        });
      });
    });
  });

  describe('Notification System Integration', () => {
    it('should test notification systems across modules', () => {
      const moduleFiles = [
        'dashboard.html',
        'manufacturing.html',
        'business-intelligence.html'
      ];

      moduleFiles.forEach(file => {
        cy.visit(`/src/ui/static/${file}`);
        cy.waitForPageLoad();
        
        cy.get('body').then($body => {
          // Test notification bell/icon
          if ($body.find('.notification-bell, .notification-icon, #notificationBell').length > 0) {
            cy.get('.notification-bell, .notification-icon, #notificationBell')
              .should('be.visible')
              .shouldBeInteractive()
              .click();
              
            // Check if notification dropdown appears
            if ($body.find('.notification-dropdown, .notification-list').length > 0) {
              cy.get('.notification-dropdown, .notification-list')
                .should('be.visible');
            }
          }
        });
      });
    });
  });

  describe('Loading States and Performance', () => {
    it('should test that all modules load within reasonable time', () => {
      const moduleFiles = [
        'index.html',
        'dashboard.html',
        'manufacturing.html',
        'financials.html',
        'business-intelligence.html',
        'setup.html'
      ];

      moduleFiles.forEach(file => {
        const startTime = Date.now();
        
        cy.visit(`/src/ui/static/${file}`);
        cy.waitForPageLoad();
        
        cy.then(() => {
          const loadTime = Date.now() - startTime;
          expect(loadTime).to.be.lessThan(10000); // 10 seconds max
        });
        
        // Check that critical elements are visible
        cy.get('body').should('be.visible');
        cy.get('.titan-enterprise-header, header').should('be.visible');
      });
    });

    it('should test loading indicators if present', () => {
      const moduleFiles = ['dashboard.html', 'manufacturing.html', 'business-intelligence.html'];

      moduleFiles.forEach(file => {
        cy.visit(`/src/ui/static/${file}`);
        
        cy.get('body').then($body => {
          // Check for loading indicators
          if ($body.find('.loading, .spinner, .loader').length > 0) {
            cy.get('.loading, .spinner, .loader').should('exist');
          }
        });
        
        cy.waitForPageLoad();
      });
    });
  });

  describe('Accessibility Integration', () => {
    it('should test basic accessibility features across modules', () => {
      const moduleFiles = ['dashboard.html', 'manufacturing.html', 'setup.html'];

      moduleFiles.forEach(file => {
        cy.visit(`/src/ui/static/${file}`);
        cy.waitForPageLoad();
        
        // Test that page has proper title
        cy.title().should('not.be.empty');
        
        // Test that focusable elements can receive focus
        cy.get('button, input, select, textarea, a[href]').each($el => {
          cy.wrap($el)
            .focus()
            .should('be.focused')
            .blur();
        });
        
        // Test for alt attributes on images
        cy.get('img').each($img => {
          cy.wrap($img).should('have.attr', 'alt');
        });
        
        // Test for proper heading hierarchy
        cy.get('h1, h2, h3, h4, h5, h6').should('have.length.greaterThan', 0);
      });
    });

    it('should test keyboard navigation', () => {
      const moduleFiles = ['dashboard.html', 'setup.html'];

      moduleFiles.forEach(file => {
        cy.visit(`/src/ui/static/${file}`);
        cy.waitForPageLoad();
        
        // Test tab navigation through interactive elements
        cy.get('body').tab();
        cy.focused().should('exist');
        
        // Test multiple tabs
        for (let i = 0; i < 5; i++) {
          cy.focused().tab();
          cy.focused().should('exist');
        }
      });
    });
  });
});