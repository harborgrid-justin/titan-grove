/**
 * Procurement Pages Index JavaScript
 * Handles navigation, search, and interactive features
 */

class ProcurementPagesManager {
  constructor() {
    this.pages = [];
    this.filteredPages = [];
    this.currentFilter = 'all';
    this.init();
  }

  init() {
    this.loadPageData();
    this.setupEventListeners();
    this.initializeAnimations();
    this.setupSearch();
    console.log('🛒 Procurement Pages Manager initialized');
  }

  loadPageData() {
    // Load all page information for search and filtering
    this.pages = [
      // Supplier Management
      {
        category: 'supplier-management',
        title: 'Supplier Onboarding',
        path: 'supplier-management/supplier-onboarding.html',
        keywords: ['supplier', 'onboarding', 'registration'],
      },
      {
        category: 'supplier-management',
        title: 'Supplier Portal',
        path: 'supplier-management/supplier-portal.html',
        keywords: ['supplier', 'portal', 'self-service'],
      },
      {
        category: 'supplier-management',
        title: 'Supplier Performance',
        path: 'supplier-management/supplier-performance.html',
        keywords: ['supplier', 'performance', 'kpi'],
      },
      {
        category: 'supplier-management',
        title: 'Supplier Risk Assessment',
        path: 'supplier-management/supplier-risk-assessment.html',
        keywords: ['supplier', 'risk', 'assessment'],
      },
      {
        category: 'supplier-management',
        title: 'Supplier Audit',
        path: 'supplier-management/supplier-audit.html',
        keywords: ['supplier', 'audit', 'compliance'],
      },
      {
        category: 'supplier-management',
        title: 'Supplier Diversity',
        path: 'supplier-management/supplier-diversity.html',
        keywords: ['supplier', 'diversity', 'inclusion'],
      },
      {
        category: 'supplier-management',
        title: 'Supplier Development',
        path: 'supplier-management/supplier-development.html',
        keywords: ['supplier', 'development', 'capacity'],
      },
      {
        category: 'supplier-management',
        title: 'Supplier Relationship',
        path: 'supplier-management/supplier-relationship.html',
        keywords: ['supplier', 'relationship', 'partnership'],
      },

      // Purchase Orders & Requisitions
      {
        category: 'purchase-orders-requisitions',
        title: 'Purchase Requisition Management',
        path: 'purchase-orders-requisitions/purchase-requisition-management.html',
        keywords: ['requisition', 'purchase', 'approval'],
      },
      {
        category: 'purchase-orders-requisitions',
        title: 'Purchase Order Creation',
        path: 'purchase-orders-requisitions/purchase-order-creation.html',
        keywords: ['purchase', 'order', 'creation'],
      },
      {
        category: 'purchase-orders-requisitions',
        title: 'PO Approval Workflow',
        path: 'purchase-orders-requisitions/po-approval-workflow.html',
        keywords: ['approval', 'workflow', 'process'],
      },
      {
        category: 'purchase-orders-requisitions',
        title: 'PO Tracking & Status',
        path: 'purchase-orders-requisitions/po-tracking.html',
        keywords: ['tracking', 'status', 'monitoring'],
      },
      {
        category: 'purchase-orders-requisitions',
        title: 'Goods Receipt',
        path: 'purchase-orders-requisitions/goods-receipt.html',
        keywords: ['goods', 'receipt', 'receiving'],
      },
      {
        category: 'purchase-orders-requisitions',
        title: 'Invoice Matching',
        path: 'purchase-orders-requisitions/invoice-matching.html',
        keywords: ['invoice', 'matching', 'three-way'],
      },
      {
        category: 'purchase-orders-requisitions',
        title: 'Budget Control',
        path: 'purchase-orders-requisitions/budget-control.html',
        keywords: ['budget', 'control', 'spending'],
      },
      {
        category: 'purchase-orders-requisitions',
        title: 'Emergency Purchases',
        path: 'purchase-orders-requisitions/emergency-purchases.html',
        keywords: ['emergency', 'urgent', 'expedited'],
      },

      // Contract Management
      {
        category: 'contract-management',
        title: 'Contract Lifecycle Management',
        path: 'contract-management/contract-lifecycle.html',
        keywords: ['contract', 'lifecycle', 'management'],
      },
      {
        category: 'contract-management',
        title: 'Contract Templates',
        path: 'contract-management/contract-templates.html',
        keywords: ['contract', 'templates', 'standardized'],
      },
      {
        category: 'contract-management',
        title: 'Contract Negotiations',
        path: 'contract-management/contract-negotiations.html',
        keywords: ['contract', 'negotiations', 'collaborative'],
      },
      {
        category: 'contract-management',
        title: 'Contract Compliance',
        path: 'contract-management/contract-compliance.html',
        keywords: ['contract', 'compliance', 'obligations'],
      },
      {
        category: 'contract-management',
        title: 'Contract Performance',
        path: 'contract-management/contract-performance.html',
        keywords: ['contract', 'performance', 'metrics'],
      },
      {
        category: 'contract-management',
        title: 'Contract Renewals',
        path: 'contract-management/contract-renewals.html',
        keywords: ['contract', 'renewals', 'alerts'],
      },

      // RFQ & Sourcing
      {
        category: 'rfq-sourcing',
        title: 'RFQ Management',
        path: 'rfq-sourcing/rfq-management.html',
        keywords: ['rfq', 'quotations', 'requests'],
      },
      {
        category: 'rfq-sourcing',
        title: 'Bidding Portal',
        path: 'rfq-sourcing/bidding-portal.html',
        keywords: ['bidding', 'portal', 'evaluation'],
      },
      {
        category: 'rfq-sourcing',
        title: 'Sourcing Events',
        path: 'rfq-sourcing/sourcing-events.html',
        keywords: ['sourcing', 'events', 'auctions'],
      },
      {
        category: 'rfq-sourcing',
        title: 'Bid Evaluation',
        path: 'rfq-sourcing/bid-evaluation.html',
        keywords: ['bid', 'evaluation', 'scoring'],
      },
      {
        category: 'rfq-sourcing',
        title: 'Award Management',
        path: 'rfq-sourcing/award-management.html',
        keywords: ['award', 'management', 'notification'],
      },

      // Procurement Analytics
      {
        category: 'procurement-analytics',
        title: 'Spend Analysis',
        path: 'procurement-analytics/spend-analysis.html',
        keywords: ['spend', 'analysis', 'visualization'],
      },
      {
        category: 'procurement-analytics',
        title: 'Savings Tracking',
        path: 'procurement-analytics/savings-tracking.html',
        keywords: ['savings', 'tracking', 'cost'],
      },
      {
        category: 'procurement-analytics',
        title: 'Performance Dashboard',
        path: 'procurement-analytics/performance-dashboard.html',
        keywords: ['performance', 'dashboard', 'kpis'],
      },
      {
        category: 'procurement-analytics',
        title: 'Market Intelligence',
        path: 'procurement-analytics/market-intelligence.html',
        keywords: ['market', 'intelligence', 'trends'],
      },
      {
        category: 'procurement-analytics',
        title: 'Compliance Reporting',
        path: 'procurement-analytics/compliance-reporting.html',
        keywords: ['compliance', 'reporting', 'audit'],
      },
    ];

    this.filteredPages = [...this.pages];
  }

  setupEventListeners() {
    // Add click tracking for pages
    document.querySelectorAll('.procurement-page-card').forEach((card) => {
      card.addEventListener('click', (e) => {
        e.preventDefault();
        this.handlePageNavigation(card);
      });
    });

    // Add category filter buttons if needed
    this.addCategoryFilters();

    // Add scroll animations
    this.setupScrollAnimations();
  }

  handlePageNavigation(card) {
    const href = card.getAttribute('href');
    const title = card.querySelector('h4').textContent;

    // Add loading state
    card.classList.add('loading');

    // Track page access
    this.trackPageAccess(href, title);

    // Navigate after short delay for UX
    setTimeout(() => {
      window.location.href = href;
    }, 300);
  }

  trackPageAccess(href, title) {
    const access = {
      page: href,
      title: title,
      timestamp: new Date().toISOString(),
      category: this.getCategoryFromPath(href),
    };

    // Store in session storage for tracking
    const accessHistory = JSON.parse(sessionStorage.getItem('procurementPageAccess') || '[]');
    accessHistory.push(access);
    sessionStorage.setItem('procurementPageAccess', JSON.stringify(accessHistory));

    console.log(`📊 Page accessed: ${title} (${href})`);
  }

  getCategoryFromPath(path) {
    if (path.includes('supplier-management')) return 'Supplier Management';
    if (path.includes('purchase-orders-requisitions')) return 'Purchase Orders & Requisitions';
    if (path.includes('contract-management')) return 'Contract Management';
    if (path.includes('rfq-sourcing')) return 'RFQ & Sourcing';
    if (path.includes('procurement-analytics')) return 'Procurement Analytics';
    return 'Unknown';
  }

  addCategoryFilters() {
    // Create filter buttons dynamically
    const categories = [
      { id: 'all', name: 'All Pages', count: 32 },
      { id: 'supplier-management', name: 'Supplier Management', count: 8 },
      { id: 'purchase-orders-requisitions', name: 'Purchase Orders', count: 8 },
      { id: 'contract-management', name: 'Contract Management', count: 6 },
      { id: 'rfq-sourcing', name: 'RFQ & Sourcing', count: 5 },
      { id: 'procurement-analytics', name: 'Analytics', count: 5 },
    ];

    // Add filter bar after header if not exists
    if (!document.querySelector('.procurement-filter-bar')) {
      const filterBar = document.createElement('div');
      filterBar.className = 'procurement-filter-bar';
      filterBar.innerHTML = `
                <div class="procurement-filter-title">Filter by Category:</div>
                <div class="procurement-filter-buttons">
                    ${categories
                      .map(
                        (cat) => `
                        <button class="procurement-filter-btn ${cat.id === 'all' ? 'active' : ''}" 
                                data-filter="${cat.id}">
                            ${cat.name} <span class="filter-count">(${cat.count})</span>
                        </button>
                    `
                      )
                      .join('')}
                </div>
            `;

      const mainContent = document.querySelector('.procurement-main-content');
      mainContent.insertBefore(filterBar, mainContent.firstChild.nextSibling);

      // Add filter event listeners
      filterBar.querySelectorAll('.procurement-filter-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          this.handleCategoryFilter(btn.dataset.filter);
        });
      });
    }
  }

  handleCategoryFilter(category) {
    this.currentFilter = category;

    // Update active button
    document.querySelectorAll('.procurement-filter-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.filter === category);
    });

    // Filter categories
    document.querySelectorAll('.procurement-category-section').forEach((section) => {
      const sectionCategory = this.getSectionCategory(section);
      const shouldShow = category === 'all' || sectionCategory === category;

      section.style.display = shouldShow ? 'block' : 'none';

      if (shouldShow) {
        section.style.animation = 'fadeInUp 0.5s ease-out';
      }
    });

    console.log(`🔍 Filtered to category: ${category}`);
  }

  getSectionCategory(section) {
    const title = section.querySelector('h2').textContent.toLowerCase();
    if (title.includes('supplier')) return 'supplier-management';
    if (title.includes('purchase orders')) return 'purchase-orders-requisitions';
    if (title.includes('contract')) return 'contract-management';
    if (title.includes('rfq')) return 'rfq-sourcing';
    if (title.includes('analytics')) return 'procurement-analytics';
    return '';
  }

  setupSearch() {
    // Add search bar
    const searchBar = document.createElement('div');
    searchBar.className = 'procurement-search-bar';
    searchBar.innerHTML = `
            <div class="procurement-search-container">
                <i class="fas fa-search"></i>
                <input type="text" placeholder="Search procurement pages..." class="procurement-search-input">
                <button class="procurement-search-clear" style="display: none;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

    const contentHeader = document.querySelector('.procurement-content-header');
    contentHeader.appendChild(searchBar);

    const searchInput = searchBar.querySelector('.procurement-search-input');
    const clearButton = searchBar.querySelector('.procurement-search-clear');

    searchInput.addEventListener('input', (e) => {
      this.handleSearch(e.target.value);
      clearButton.style.display = e.target.value ? 'block' : 'none';
    });

    clearButton.addEventListener('click', () => {
      searchInput.value = '';
      this.handleSearch('');
      clearButton.style.display = 'none';
      searchInput.focus();
    });
  }

  handleSearch(query) {
    const searchTerm = query.toLowerCase().trim();

    if (!searchTerm) {
      // Show all pages
      document.querySelectorAll('.procurement-page-card').forEach((card) => {
        card.style.display = 'block';
      });
      document.querySelectorAll('.procurement-category-section').forEach((section) => {
        section.style.display = 'block';
      });
      return;
    }

    // Filter pages based on search
    document.querySelectorAll('.procurement-page-card').forEach((card) => {
      const title = card.querySelector('h4').textContent.toLowerCase();
      const description = card.querySelector('p').textContent.toLowerCase();
      const matches = title.includes(searchTerm) || description.includes(searchTerm);

      card.style.display = matches ? 'block' : 'none';
    });

    // Hide empty categories
    document.querySelectorAll('.procurement-category-section').forEach((section) => {
      const visibleCards = section.querySelectorAll('.procurement-page-card[style*="block"]');
      section.style.display = visibleCards.length > 0 ? 'block' : 'none';
    });

    console.log(
      `🔍 Search performed: "${query}" - ${document.querySelectorAll('.procurement-page-card[style*="block"]').length} results`
    );
  }

  initializeAnimations() {
    // Stagger category animations
    const categories = document.querySelectorAll('.procurement-category-section');
    categories.forEach((category, index) => {
      category.style.animationDelay = `${index * 0.1}s`;
    });

    // Add hover sound effects (optional)
    document.querySelectorAll('.procurement-page-card').forEach((card) => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-2px) scale(1.02)';
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
      });
    });
  }

  setupScrollAnimations() {
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    document.querySelectorAll('.procurement-category-section').forEach((section) => {
      section.style.opacity = '0';
      section.style.transform = 'translateY(30px)';
      section.style.transition = 'all 0.6s ease-out';
      observer.observe(section);
    });
  }

  // Utility method to get page statistics
  getPageStatistics() {
    const stats = {
      totalPages: this.pages.length,
      categories: {
        'supplier-management': this.pages.filter((p) => p.category === 'supplier-management')
          .length,
        'purchase-orders-requisitions': this.pages.filter(
          (p) => p.category === 'purchase-orders-requisitions'
        ).length,
        'contract-management': this.pages.filter((p) => p.category === 'contract-management')
          .length,
        'rfq-sourcing': this.pages.filter((p) => p.category === 'rfq-sourcing').length,
        'procurement-analytics': this.pages.filter((p) => p.category === 'procurement-analytics')
          .length,
      },
      accessHistory: JSON.parse(sessionStorage.getItem('procurementPageAccess') || '[]'),
    };

    return stats;
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const procurementManager = new ProcurementPagesManager();

  // Make available globally for debugging
  window.procurementManager = procurementManager;

  console.log('🚀 Procurement Pages System Ready');
  console.log('📊 Page Statistics:', procurementManager.getPageStatistics());
});

// Add CSS for search and filter components
const additionalStyles = `
<style>
.procurement-search-bar {
    margin-top: 1.5rem;
}

.procurement-search-container {
    position: relative;
    max-width: 400px;
}

.procurement-search-container i {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #64748b;
}

.procurement-search-input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 2.5rem;
    border: 2px solid #e2e8f0;
    border-radius: 0.5rem;
    font-size: 1rem;
    transition: all 0.3s ease;
}

.procurement-search-input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.procurement-search-clear {
    position: absolute;
    right: 0.5rem;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    padding: 0.5rem;
    cursor: pointer;
    color: #64748b;
    border-radius: 0.25rem;
}

.procurement-search-clear:hover {
    background: #f1f5f9;
    color: #1e293b;
}

.procurement-filter-bar {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 1rem;
    padding: 1.5rem;
    margin-bottom: 2rem;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.procurement-filter-title {
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 1rem;
}

.procurement-filter-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.procurement-filter-btn {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    color: #64748b;
}

.procurement-filter-btn:hover {
    background: #e2e8f0;
    color: #1e293b;
}

.procurement-filter-btn.active {
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    color: white;
    border-color: #3b82f6;
}

.filter-count {
    opacity: 0.8;
    font-size: 0.75rem;
}

@media (max-width: 768px) {
    .procurement-filter-buttons {
        flex-direction: column;
    }
    
    .procurement-filter-btn {
        text-align: center;
    }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', additionalStyles);
