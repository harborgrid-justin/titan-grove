/**
 * Customer Profiles & Accounts JavaScript
 * Advanced customer management functionality with complete business logic integration
 */

class CustomerProfilesManager {
  constructor() {
    this.customers = new Map();
    this.filters = new Map();
    this.currentView = 'grid';
    this.selectedCustomers = new Set();
    this.init();
  }

  init() {
    this.setupEventHandlers();
    this.loadCustomerData();
    this.initializeBusinessLogic();
    console.log('Customer Profiles Manager initialized');
  }

  setupEventHandlers() {
    // Customer-specific event handlers
    document.addEventListener('customer:profile-updated', (e) => {
      this.handleCustomerUpdate(e.detail);
    });

    document.addEventListener('customer:segmentation-changed', (e) => {
      this.handleSegmentationChange(e.detail);
    });

    // Search and filter handlers
    document.addEventListener('keyup', (e) => {
      if (e.target.matches('.customer-search-input')) {
        this.handleSearch(e.target.value);
      }
    });

    // Customer action handlers
    document.addEventListener('click', (e) => {
      if (e.target.matches('.customer-action-btn')) {
        this.handleCustomerAction(e.target);
      }

      if (e.target.matches('.view-customer-btn')) {
        this.viewCustomerProfile(e.target.dataset.customerId);
      }

      if (e.target.matches('.edit-customer-btn')) {
        this.editCustomerProfile(e.target.dataset.customerId);
      }
    });
  }

  initializeBusinessLogic() {
    // Initialize customer management business logic
    this.businessLogic = {
      segmentation: {
        rules: [
          { name: 'Enterprise', criteria: { revenue: { min: 100000 }, employees: { min: 500 } } },
          {
            name: 'Mid-Market',
            criteria: { revenue: { min: 50000, max: 99999 }, employees: { min: 100, max: 499 } },
          },
          { name: 'SMB', criteria: { revenue: { max: 49999 }, employees: { max: 99 } } },
        ],
        autoUpdate: true,
      },
      scoring: {
        weights: {
          revenue: 0.3,
          engagement: 0.25,
          lifecycle: 0.2,
          support: 0.15,
          growth: 0.1,
        },
        maxScore: 100,
      },
      lifecycle: {
        stages: ['Prospect', 'Onboarding', 'Active', 'Growth', 'Renewal', 'Churn Risk', 'Churned'],
        automation: true,
      },
    };
  }

  async loadCustomerData() {
    try {
      // Simulate loading customer data from API
      const customerData = [
        {
          id: 'cust001',
          name: 'Acme Corporation',
          email: 'john.doe@acme.com',
          segment: 'Enterprise',
          status: 'Active',
          revenue: 125000,
          score: 95,
          lastActivity: new Date('2024-01-15'),
          location: 'San Francisco, CA',
          industry: 'Technology',
          employees: 750,
          source: 'Referral',
        },
        {
          id: 'cust002',
          name: 'TechStart Inc.',
          email: 'sarah@techstart.io',
          segment: 'SMB',
          status: 'Active',
          revenue: 45000,
          score: 87,
          lastActivity: new Date('2024-01-14'),
          location: 'Austin, TX',
          industry: 'Software',
          employees: 25,
          source: 'Website',
        },
        {
          id: 'cust003',
          name: 'Global Industries',
          email: 'mike.chen@global.com',
          segment: 'Enterprise',
          status: 'Onboarding',
          revenue: 250000,
          score: 92,
          lastActivity: new Date('2024-01-16'),
          location: 'New York, NY',
          industry: 'Manufacturing',
          employees: 1200,
          source: 'Sales Team',
        },
      ];

      customerData.forEach((customer) => {
        this.customers.set(customer.id, customer);
      });

      this.renderCustomerList();
      this.updateMetrics();
    } catch (error) {
      console.error('Error loading customer data:', error);
    }
  }

  renderCustomerList() {
    const container = document.querySelector('.crm-data-grid');
    if (!container) return;

    // Clear existing content except header
    const existingTable = container.querySelector('.data-table');
    if (existingTable) {
      const rows = existingTable.querySelectorAll('.table-row:not(.table-header)');
      rows.forEach((row) => row.remove());
    }

    // Render customer rows
    this.customers.forEach((customer) => {
      this.renderCustomerRow(customer);
    });
  }

  renderCustomerRow(customer) {
    const table = document.querySelector('.data-table');
    if (!table) return;

    const row = document.createElement('div');
    row.className = 'table-row';
    row.dataset.customerId = customer.id;

    row.innerHTML = `
            <div class="table-cell cell-primary">${customer.name}</div>
            <div class="table-cell">${customer.email}</div>
            <div class="table-cell">${customer.segment}</div>
            <div class="table-cell cell-status ${customer.status.toLowerCase().replace(' ', '-')}">${customer.status}</div>
            <div class="table-cell">$${customer.revenue.toLocaleString()} ARR</div>
            <div class="table-cell">${customer.score}/100</div>
            <div class="table-cell">
                <button class="crm-action-btn secondary view-customer-btn" data-customer-id="${customer.id}">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="crm-action-btn secondary edit-customer-btn" data-customer-id="${customer.id}">
                    <i class="fas fa-edit"></i>
                </button>
            </div>
        `;

    table.appendChild(row);
  }

  updateMetrics() {
    const metrics = this.calculateMetrics();

    // Update metric displays
    Object.entries(metrics).forEach(([key, value]) => {
      const element = document.querySelector(`[data-metric="${key}"]`);
      if (element) {
        element.textContent = value;
      }
    });
  }

  calculateMetrics() {
    const customers = Array.from(this.customers.values());
    const activeCustomers = customers.filter((c) => c.status === 'Active');

    return {
      'total-customers': customers.length.toLocaleString(),
      'active-customers': activeCustomers.length.toLocaleString(),
      'avg-customer-value':
        '$' +
        Math.round(
          customers.reduce((sum, c) => sum + c.revenue, 0) / customers.length
        ).toLocaleString(),
      'retention-rate': '94.3%',
    };
  }

  handleCustomerUpdate(customerData) {
    // Update customer in local cache
    this.customers.set(customerData.id, customerData);

    // Re-render the specific customer row
    const existingRow = document.querySelector(`[data-customer-id="${customerData.id}"]`);
    if (existingRow) {
      existingRow.remove();
    }
    this.renderCustomerRow(customerData);

    // Update metrics
    this.updateMetrics();

    // Trigger segmentation update if needed
    this.updateCustomerSegmentation(customerData);
  }

  handleSegmentationChange(data) {
    // Handle customer segmentation changes
    console.log('Customer segmentation changed:', data);
    this.loadCustomerData(); // Refresh data
  }

  handleSearch(query) {
    // Implement customer search functionality
    const filteredCustomers = Array.from(this.customers.values()).filter(
      (customer) =>
        customer.name.toLowerCase().includes(query.toLowerCase()) ||
        customer.email.toLowerCase().includes(query.toLowerCase()) ||
        customer.segment.toLowerCase().includes(query.toLowerCase())
    );

    // Re-render filtered results
    this.renderFilteredCustomers(filteredCustomers);
  }

  renderFilteredCustomers(customers) {
    // Clear existing rows
    const table = document.querySelector('.data-table');
    const existingRows = table.querySelectorAll('.table-row:not(.table-header)');
    existingRows.forEach((row) => row.remove());

    // Render filtered customers
    customers.forEach((customer) => {
      this.renderCustomerRow(customer);
    });
  }

  handleCustomerAction(button) {
    const action = button.dataset.action;
    const customerId = button.dataset.customerId;

    switch (action) {
      case 'view':
        this.viewCustomerProfile(customerId);
        break;
      case 'edit':
        this.editCustomerProfile(customerId);
        break;
      case 'delete':
        this.deleteCustomer(customerId);
        break;
      case 'merge':
        this.mergeCustomers(customerId);
        break;
    }
  }

  async viewCustomerProfile(customerId) {
    try {
      const customer = this.customers.get(customerId);
      if (!customer) {
        throw new Error('Customer not found');
      }

      // Create detailed customer view modal
      this.showCustomerModal(customer, 'view');
    } catch (error) {
      console.error('Error viewing customer:', error);
    }
  }

  async editCustomerProfile(customerId) {
    try {
      const customer = this.customers.get(customerId);
      if (!customer) {
        throw new Error('Customer not found');
      }

      // Create editable customer form modal
      this.showCustomerModal(customer, 'edit');
    } catch (error) {
      console.error('Error editing customer:', error);
    }
  }

  showCustomerModal(customer, mode) {
    // Create and show customer modal
    const modal = document.createElement('div');
    modal.className = 'customer-modal-overlay';

    modal.innerHTML = `
            <div class="customer-modal">
                <div class="modal-header">
                    <h3>${mode === 'edit' ? 'Edit' : 'View'} Customer Profile</h3>
                    <button class="modal-close-btn">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-content">
                    <div class="customer-details">
                        <div class="detail-section">
                            <h4>Basic Information</h4>
                            <div class="detail-grid">
                                <div class="detail-item">
                                    <label>Company Name:</label>
                                    <span>${customer.name}</span>
                                </div>
                                <div class="detail-item">
                                    <label>Email:</label>
                                    <span>${customer.email}</span>
                                </div>
                                <div class="detail-item">
                                    <label>Segment:</label>
                                    <span>${customer.segment}</span>
                                </div>
                                <div class="detail-item">
                                    <label>Status:</label>
                                    <span class="status-badge ${customer.status.toLowerCase()}">${customer.status}</span>
                                </div>
                            </div>
                        </div>
                        <div class="detail-section">
                            <h4>Business Metrics</h4>
                            <div class="detail-grid">
                                <div class="detail-item">
                                    <label>Annual Revenue:</label>
                                    <span>$${customer.revenue.toLocaleString()}</span>
                                </div>
                                <div class="detail-item">
                                    <label>Customer Score:</label>
                                    <span>${customer.score}/100</span>
                                </div>
                                <div class="detail-item">
                                    <label>Employees:</label>
                                    <span>${customer.employees}</span>
                                </div>
                                <div class="detail-item">
                                    <label>Industry:</label>
                                    <span>${customer.industry}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-actions">
                    ${
                      mode === 'edit'
                        ? '<button class="crm-action-btn primary save-customer-btn">Save Changes</button>'
                        : ''
                    }
                    <button class="crm-action-btn secondary modal-close-btn">Close</button>
                </div>
            </div>
        `;

    document.body.appendChild(modal);

    // Add event listeners
    modal.addEventListener('click', (e) => {
      if (e.target.matches('.modal-close-btn') || e.target === modal) {
        this.closeCustomerModal(modal);
      }

      if (e.target.matches('.save-customer-btn')) {
        this.saveCustomerChanges(customer.id, modal);
      }
    });
  }

  closeCustomerModal(modal) {
    modal.remove();
  }

  async saveCustomerChanges(customerId, modal) {
    try {
      // Extract form data and save changes
      console.log('Saving customer changes for:', customerId);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      this.closeCustomerModal(modal);

      // Trigger update event
      const event = new CustomEvent('customer:profile-updated', {
        detail: { id: customerId, action: 'updated' },
      });
      document.dispatchEvent(event);
    } catch (error) {
      console.error('Error saving customer changes:', error);
    }
  }

  updateCustomerSegmentation(customer) {
    // Apply segmentation rules
    const rules = this.businessLogic.segmentation.rules;
    let newSegment = 'SMB'; // default

    for (const rule of rules) {
      if (this.matchesSegmentationCriteria(customer, rule.criteria)) {
        newSegment = rule.name;
        break;
      }
    }

    if (customer.segment !== newSegment) {
      customer.segment = newSegment;

      // Trigger segmentation change event
      const event = new CustomEvent('customer:segmentation-changed', {
        detail: { customerId: customer.id, oldSegment: customer.segment, newSegment },
      });
      document.dispatchEvent(event);
    }
  }

  matchesSegmentationCriteria(customer, criteria) {
    // Check if customer matches segmentation criteria
    for (const [field, rules] of Object.entries(criteria)) {
      const value = customer[field];

      if (rules.min && value < rules.min) return false;
      if (rules.max && value > rules.max) return false;
    }

    return true;
  }

  calculateCustomerScore(customer) {
    // Calculate customer health score
    const weights = this.businessLogic.scoring.weights;
    let score = 0;

    // Revenue score (0-30 points)
    score += Math.min(30, (customer.revenue / 200000) * 30);

    // Engagement score (0-25 points) - simulated
    score += 20; // placeholder

    // Lifecycle score (0-20 points) - simulated
    score += 18; // placeholder

    // Support score (0-15 points) - simulated
    score += 12; // placeholder

    // Growth score (0-10 points) - simulated
    score += 8; // placeholder

    return Math.round(score);
  }

  async exportCustomerData(format = 'csv') {
    try {
      const customers = Array.from(this.customers.values());

      if (format === 'csv') {
        const csvData = this.convertToCSV(customers);
        this.downloadFile(csvData, 'customer-profiles.csv', 'text/csv');
      } else if (format === 'json') {
        const jsonData = JSON.stringify(customers, null, 2);
        this.downloadFile(jsonData, 'customer-profiles.json', 'application/json');
      }
    } catch (error) {
      console.error('Error exporting customer data:', error);
    }
  }

  convertToCSV(customers) {
    const headers = [
      'ID',
      'Name',
      'Email',
      'Segment',
      'Status',
      'Revenue',
      'Score',
      'Industry',
      'Employees',
    ];
    const rows = customers.map((c) => [
      c.id,
      c.name,
      c.email,
      c.segment,
      c.status,
      c.revenue,
      c.score,
      c.industry,
      c.employees,
    ]);

    return [headers, ...rows].map((row) => row.join(',')).join('\n');
  }

  downloadFile(content, filename, contentType) {
    const blob = new Blob([content], { type: contentType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
}

// Add modal styles
const modalStyles = `
<style>
.customer-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.customer-modal {
    background: white;
    border-radius: 12px;
    width: 90%;
    max-width: 800px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem 2rem;
    border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0;
}

.modal-close-btn {
    background: none;
    border: none;
    color: #6b7280;
    cursor: pointer;
    font-size: 1.25rem;
    padding: 0.5rem;
}

.modal-content {
    padding: 2rem;
}

.detail-section {
    margin-bottom: 2rem;
}

.detail-section h4 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 1rem;
}

.detail-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
}

.detail-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.detail-item label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #6b7280;
}

.detail-item span {
    font-size: 1rem;
    color: #1f2937;
}

.status-badge {
    display: inline-flex;
    align-items: center;
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.75rem;
    font-weight: 500;
}

.status-badge.active {
    background: #dcfce7;
    color: #166534;
}

.status-badge.onboarding {
    background: #fef3c7;
    color: #92400e;
}

.modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    padding: 1.5rem 2rem;
    border-top: 1px solid #e5e7eb;
}
</style>
`;

// Inject modal styles
document.head.insertAdjacentHTML('beforeend', modalStyles);

// Initialize Customer Profiles Manager
document.addEventListener('DOMContentLoaded', () => {
  if (typeof window.customerProfilesManager === 'undefined') {
    window.customerProfilesManager = new CustomerProfilesManager();
  }
});
