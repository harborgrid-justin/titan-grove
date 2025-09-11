/**
 * Supplier Onboarding JavaScript
 * Handles supplier registration, approval workflow, and real-time updates
 */

class SupplierOnboardingManager {
  constructor() {
    this.suppliers = [];
    this.filteredSuppliers = [];
    this.currentFilter = 'all';
    this.apiEndpoint = '/api/procurement/suppliers';
    this.init();
  }

  async init() {
    await this.loadSuppliers();
    this.setupEventListeners();
    this.initializeRealTimeUpdates();
    this.updateKPIs();
    console.log('🔄 Supplier Onboarding Manager initialized');
  }

  async loadSuppliers() {
    try {
      // Mock data for demonstration - in real app would fetch from API
      this.suppliers = [
        {
          id: 'sup_001',
          name: 'Acme Manufacturing Inc.',
          email: 'contact@acme-mfg.com',
          category: 'Manufacturing',
          status: 'pending',
          submitted: '2025-01-15',
          priority: 'high',
          phone: '+1-555-0123',
          website: 'https://acme-mfg.com',
          address: '123 Industrial Blvd, City, State 12345',
          businessType: 'Corporation',
          taxId: '12-3456789',
          yearsInBusiness: 15,
          annualRevenue: 25000000,
          employees: 150,
          certifications: ['ISO 9001', 'ISO 14001'],
          documents: ['Business License', 'Tax Certificate', 'Insurance Certificate'],
          workflow: {
            currentStep: 3,
            steps: [
              { id: 1, name: 'Application Submitted', status: 'completed', date: '2025-01-15' },
              { id: 2, name: 'Initial Review', status: 'completed', date: '2025-01-16' },
              { id: 3, name: 'Document Verification', status: 'active', date: null },
              { id: 4, name: 'Risk Assessment', status: 'pending', date: null },
              { id: 5, name: 'Final Approval', status: 'pending', date: null },
            ],
          },
        },
        {
          id: 'sup_002',
          name: 'Global Tech Solutions',
          email: 'procurement@globaltech.com',
          category: 'Technology',
          status: 'approved',
          submitted: '2025-01-12',
          priority: 'medium',
          phone: '+1-555-0456',
          website: 'https://globaltech.com',
          address: '456 Tech Park Dr, Silicon Valley, CA 94041',
          businessType: 'LLC',
          taxId: '98-7654321',
          yearsInBusiness: 8,
          annualRevenue: 12000000,
          employees: 75,
          certifications: ['SOC 2', 'CMMI Level 3'],
          documents: ['Articles of Incorporation', 'Financial Statements', 'SOC 2 Report'],
          workflow: {
            currentStep: 5,
            steps: [
              { id: 1, name: 'Application Submitted', status: 'completed', date: '2025-01-12' },
              { id: 2, name: 'Initial Review', status: 'completed', date: '2025-01-13' },
              { id: 3, name: 'Document Verification', status: 'completed', date: '2025-01-14' },
              { id: 4, name: 'Risk Assessment', status: 'completed', date: '2025-01-15' },
              { id: 5, name: 'Final Approval', status: 'completed', date: '2025-01-16' },
            ],
          },
        },
        {
          id: 'sup_003',
          name: 'Green Energy Corp',
          email: 'info@greenenergy.com',
          category: 'Services',
          status: 'under-review',
          submitted: '2025-01-10',
          priority: 'low',
          phone: '+1-555-0789',
          website: 'https://greenenergy.com',
          address: '789 Renewable Way, Portland, OR 97201',
          businessType: 'Corporation',
          taxId: '45-6789012',
          yearsInBusiness: 12,
          annualRevenue: 8000000,
          employees: 45,
          certifications: ['B Corp', 'LEED Gold'],
          documents: ['Environmental Certificates', 'Financial Statements'],
          workflow: {
            currentStep: 4,
            steps: [
              { id: 1, name: 'Application Submitted', status: 'completed', date: '2025-01-10' },
              { id: 2, name: 'Initial Review', status: 'completed', date: '2025-01-11' },
              { id: 3, name: 'Document Verification', status: 'completed', date: '2025-01-13' },
              { id: 4, name: 'Risk Assessment', status: 'active', date: null },
              { id: 5, name: 'Final Approval', status: 'pending', date: null },
            ],
          },
        },
      ];

      this.filteredSuppliers = [...this.suppliers];
      this.renderSuppliersTable();
    } catch (error) {
      console.error('Failed to load suppliers:', error);
      this.showError('Failed to load supplier data');
    }
  }

  setupEventListeners() {
    // Search functionality
    const searchInput = document.querySelector('.procurement-search-input-sm');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.handleSearch(e.target.value);
      });
    }

    // Status filter
    const statusFilter = document.querySelector('.procurement-select-sm');
    if (statusFilter) {
      statusFilter.addEventListener('change', (e) => {
        this.handleStatusFilter(e.target.value);
      });
    }

    // Quick action buttons
    document.querySelectorAll('.quick-action-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        this.handleQuickAction(e.currentTarget);
      });
    });

    // Table action buttons
    document.addEventListener('click', (e) => {
      if (e.target.closest('.btn-icon')) {
        this.handleTableAction(e.target.closest('.btn-icon'));
      }
    });

    // Header action buttons
    document.querySelectorAll('.procurement-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        this.handleHeaderAction(e.currentTarget);
      });
    });
  }

  renderSuppliersTable() {
    const tableBody = document.getElementById('suppliersTable');
    if (!tableBody) return;

    tableBody.innerHTML = this.filteredSuppliers
      .map(
        (supplier) => `
            <tr data-supplier-id="${supplier.id}">
                <td>
                    <div class="supplier-info">
                        <div class="supplier-name">${supplier.name}</div>
                        <div class="supplier-email">${supplier.email}</div>
                    </div>
                </td>
                <td><span class="category-tag ${supplier.category.toLowerCase()}">${supplier.category}</span></td>
                <td><span class="status-badge ${supplier.status}">${this.formatStatus(supplier.status)}</span></td>
                <td>${this.formatDate(supplier.submitted)}</td>
                <td><span class="priority-badge ${supplier.priority}">${this.capitalize(supplier.priority)}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon" title="View Details" data-action="view" data-supplier-id="${supplier.id}">
                            <i class="fas fa-eye"></i>
                        </button>
                        ${
                          supplier.status === 'pending'
                            ? `
                            <button class="btn-icon" title="Approve" data-action="approve" data-supplier-id="${supplier.id}">
                                <i class="fas fa-check"></i>
                            </button>
                            <button class="btn-icon" title="Request Info" data-action="request-info" data-supplier-id="${supplier.id}">
                                <i class="fas fa-question"></i>
                            </button>
                        `
                            : supplier.status === 'approved'
                              ? `
                            <button class="btn-icon" title="Edit" data-action="edit" data-supplier-id="${supplier.id}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-icon" title="Documents" data-action="documents" data-supplier-id="${supplier.id}">
                                <i class="fas fa-file-alt"></i>
                            </button>
                        `
                              : `
                            <button class="btn-icon" title="Request Info" data-action="request-info" data-supplier-id="${supplier.id}">
                                <i class="fas fa-question"></i>
                            </button>
                            <button class="btn-icon" title="Schedule Meeting" data-action="schedule" data-supplier-id="${supplier.id}">
                                <i class="fas fa-calendar"></i>
                            </button>
                        `
                        }
                    </div>
                </td>
            </tr>
        `
      )
      .join('');
  }

  handleSearch(query) {
    const searchTerm = query.toLowerCase().trim();

    if (!searchTerm) {
      this.filteredSuppliers = [...this.suppliers];
    } else {
      this.filteredSuppliers = this.suppliers.filter(
        (supplier) =>
          supplier.name.toLowerCase().includes(searchTerm) ||
          supplier.email.toLowerCase().includes(searchTerm) ||
          supplier.category.toLowerCase().includes(searchTerm)
      );
    }

    this.renderSuppliersTable();
    console.log(`🔍 Search: "${query}" - ${this.filteredSuppliers.length} results`);
  }

  handleStatusFilter(status) {
    this.currentFilter = status;

    if (status === 'all') {
      this.filteredSuppliers = [...this.suppliers];
    } else {
      this.filteredSuppliers = this.suppliers.filter((supplier) => supplier.status === status);
    }

    this.renderSuppliersTable();
    console.log(`🔽 Filter: ${status} - ${this.filteredSuppliers.length} results`);
  }

  handleTableAction(button) {
    const action = button.dataset.action;
    const supplierId = button.dataset.supplierId;
    const supplier = this.suppliers.find((s) => s.id === supplierId);

    if (!supplier) return;

    switch (action) {
      case 'view':
        this.viewSupplierDetails(supplier);
        break;
      case 'approve':
        this.approveSupplier(supplier);
        break;
      case 'request-info':
        this.requestAdditionalInfo(supplier);
        break;
      case 'edit':
        this.editSupplier(supplier);
        break;
      case 'documents':
        this.viewDocuments(supplier);
        break;
      case 'schedule':
        this.scheduleMeeting(supplier);
        break;
    }
  }

  handleQuickAction(button) {
    const text = button.querySelector('span').textContent.trim();

    switch (text) {
      case 'Add New Supplier':
        this.showNewSupplierForm();
        break;
      case 'Bulk Import':
        this.showBulkImportDialog();
        break;
      case 'Export Applications':
        this.exportApplications();
        break;
      case 'Workflow Settings':
        this.showWorkflowSettings();
        break;
    }
  }

  handleHeaderAction(button) {
    const hasIcon = button.querySelector('i');
    if (hasIcon) {
      const iconClass = hasIcon.className;
      if (iconClass.includes('fa-plus')) {
        this.showNewSupplierForm();
      } else if (iconClass.includes('fa-download')) {
        this.exportApplications();
      }
    }
  }

  async approveSupplier(supplier) {
    if (confirm(`Are you sure you want to approve ${supplier.name}?`)) {
      try {
        // Update supplier status
        supplier.status = 'approved';
        supplier.workflow.currentStep = 5;
        supplier.workflow.steps[4].status = 'completed';
        supplier.workflow.steps[4].date = new Date().toISOString().split('T')[0];

        // Re-render table
        this.renderSuppliersTable();
        this.updateKPIs();

        // Show success message
        this.showSuccess(`${supplier.name} has been approved successfully!`);

        // Track activity
        this.addActivity('approved', `${supplier.name} has been approved`, 'just now');

        console.log(`✅ Supplier approved: ${supplier.name}`);
      } catch (error) {
        console.error('Failed to approve supplier:', error);
        this.showError('Failed to approve supplier');
      }
    }
  }

  viewSupplierDetails(supplier) {
    // Create modal with supplier details
    const modal = this.createModal(
      'Supplier Details',
      `
            <div class="supplier-details">
                <div class="supplier-header">
                    <h3>${supplier.name}</h3>
                    <span class="status-badge ${supplier.status}">${this.formatStatus(supplier.status)}</span>
                </div>
                
                <div class="supplier-info-grid">
                    <div class="info-section">
                        <h4>Contact Information</h4>
                        <p><strong>Email:</strong> ${supplier.email}</p>
                        <p><strong>Phone:</strong> ${supplier.phone}</p>
                        <p><strong>Website:</strong> <a href="${supplier.website}" target="_blank">${supplier.website}</a></p>
                        <p><strong>Address:</strong> ${supplier.address}</p>
                    </div>
                    
                    <div class="info-section">
                        <h4>Business Information</h4>
                        <p><strong>Business Type:</strong> ${supplier.businessType}</p>
                        <p><strong>Tax ID:</strong> ${supplier.taxId}</p>
                        <p><strong>Years in Business:</strong> ${supplier.yearsInBusiness}</p>
                        <p><strong>Annual Revenue:</strong> $${(supplier.annualRevenue / 1000000).toFixed(1)}M</p>
                        <p><strong>Employees:</strong> ${supplier.employees}</p>
                    </div>
                    
                    <div class="info-section">
                        <h4>Certifications</h4>
                        <div class="certification-tags">
                            ${supplier.certifications.map((cert) => `<span class="cert-tag">${cert}</span>`).join('')}
                        </div>
                    </div>
                    
                    <div class="info-section">
                        <h4>Documents</h4>
                        <div class="document-list">
                            ${supplier.documents
                              .map(
                                (doc) => `
                                <div class="document-item">
                                    <i class="fas fa-file-alt"></i>
                                    <span>${doc}</span>
                                    <button class="btn-link">View</button>
                                </div>
                            `
                              )
                              .join('')}
                        </div>
                    </div>
                </div>
                
                <div class="workflow-section">
                    <h4>Onboarding Progress</h4>
                    <div class="workflow-progress">
                        ${supplier.workflow.steps
                          .map(
                            (step) => `
                            <div class="progress-step ${step.status}">
                                <div class="step-number">${step.id}</div>
                                <div class="step-info">
                                    <div class="step-name">${step.name}</div>
                                    ${step.date ? `<div class="step-date">${this.formatDate(step.date)}</div>` : ''}
                                </div>
                            </div>
                        `
                          )
                          .join('')}
                    </div>
                </div>
            </div>
        `
    );

    this.showModal(modal);
  }

  requestAdditionalInfo(supplier) {
    const modal = this.createModal(
      'Request Additional Information',
      `
            <div class="request-info-form">
                <p>Request additional information from <strong>${supplier.name}</strong></p>
                
                <div class="form-group">
                    <label>Information Type:</label>
                    <select class="form-control" id="infoType">
                        <option value="financial">Financial Documents</option>
                        <option value="legal">Legal Certificates</option>
                        <option value="technical">Technical Specifications</option>
                        <option value="references">Customer References</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label>Message:</label>
                    <textarea class="form-control" id="requestMessage" rows="4" 
                              placeholder="Please provide details about the additional information needed..."></textarea>
                </div>
                
                <div class="form-group">
                    <label>Priority:</label>
                    <select class="form-control" id="requestPriority">
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                    </select>
                </div>
                
                <div class="modal-actions">
                    <button class="btn btn-primary" onclick="procurementManager.sendInfoRequest('${supplier.id}')">
                        Send Request
                    </button>
                    <button class="btn btn-secondary" onclick="procurementManager.closeModal()">
                        Cancel
                    </button>
                </div>
            </div>
        `
    );

    this.showModal(modal);
  }

  sendInfoRequest(supplierId) {
    const infoType = document.getElementById('infoType').value;
    const message = document.getElementById('requestMessage').value;
    const priority = document.getElementById('requestPriority').value;

    if (!message.trim()) {
      this.showError('Please provide a message for the information request');
      return;
    }

    const supplier = this.suppliers.find((s) => s.id === supplierId);

    // Simulate sending request
    this.showSuccess(`Information request sent to ${supplier.name}`);
    this.addActivity(
      'info',
      `Additional ${infoType} documents requested from ${supplier.name}`,
      'just now'
    );
    this.closeModal();

    console.log(`📤 Info request sent to ${supplier.name}: ${infoType} - ${priority} priority`);
  }

  showNewSupplierForm() {
    const modal = this.createModal(
      'Add New Supplier',
      `
            <div class="new-supplier-form">
                <div class="form-grid">
                    <div class="form-group">
                        <label>Company Name *</label>
                        <input type="text" class="form-control" id="companyName" required>
                    </div>
                    
                    <div class="form-group">
                        <label>Contact Email *</label>
                        <input type="email" class="form-control" id="contactEmail" required>
                    </div>
                    
                    <div class="form-group">
                        <label>Phone Number</label>
                        <input type="tel" class="form-control" id="phoneNumber">
                    </div>
                    
                    <div class="form-group">
                        <label>Category *</label>
                        <select class="form-control" id="supplierCategory" required>
                            <option value="">Select Category</option>
                            <option value="Manufacturing">Manufacturing</option>
                            <option value="Technology">Technology</option>
                            <option value="Services">Services</option>
                            <option value="Construction">Construction</option>
                            <option value="Healthcare">Healthcare</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>Website</label>
                        <input type="url" class="form-control" id="website">
                    </div>
                    
                    <div class="form-group">
                        <label>Priority</label>
                        <select class="form-control" id="priority">
                            <option value="low">Low</option>
                            <option value="medium" selected>Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-group">
                    <label>Address</label>
                    <textarea class="form-control" id="address" rows="3"></textarea>
                </div>
                
                <div class="modal-actions">
                    <button class="btn btn-primary" onclick="procurementManager.createSupplier()">
                        Create Supplier
                    </button>
                    <button class="btn btn-secondary" onclick="procurementManager.closeModal()">
                        Cancel
                    </button>
                </div>
            </div>
        `
    );

    this.showModal(modal);
  }

  createSupplier() {
    const formData = {
      name: document.getElementById('companyName').value,
      email: document.getElementById('contactEmail').value,
      phone: document.getElementById('phoneNumber').value,
      category: document.getElementById('supplierCategory').value,
      website: document.getElementById('website').value,
      priority: document.getElementById('priority').value,
      address: document.getElementById('address').value,
    };

    // Validate required fields
    if (!formData.name || !formData.email || !formData.category) {
      this.showError('Please fill in all required fields');
      return;
    }

    // Create new supplier object
    const newSupplier = {
      id: `sup_${Date.now()}`,
      ...formData,
      status: 'pending',
      submitted: new Date().toISOString().split('T')[0],
      businessType: 'Corporation',
      taxId: '',
      yearsInBusiness: 0,
      annualRevenue: 0,
      employees: 0,
      certifications: [],
      documents: [],
      workflow: {
        currentStep: 1,
        steps: [
          {
            id: 1,
            name: 'Application Submitted',
            status: 'completed',
            date: new Date().toISOString().split('T')[0],
          },
          { id: 2, name: 'Initial Review', status: 'pending', date: null },
          { id: 3, name: 'Document Verification', status: 'pending', date: null },
          { id: 4, name: 'Risk Assessment', status: 'pending', date: null },
          { id: 5, name: 'Final Approval', status: 'pending', date: null },
        ],
      },
    };

    // Add to suppliers array
    this.suppliers.unshift(newSupplier);
    this.filteredSuppliers = [...this.suppliers];

    // Update UI
    this.renderSuppliersTable();
    this.updateKPIs();
    this.closeModal();

    // Show success message
    this.showSuccess(`Supplier ${formData.name} has been added successfully!`);
    this.addActivity('pending', `New supplier application: ${formData.name}`, 'just now');

    console.log(`➕ New supplier created: ${formData.name}`);
  }

  updateKPIs() {
    const kpis = {
      pending: this.suppliers.filter((s) => s.status === 'pending').length,
      approved: this.suppliers.filter((s) => s.status === 'approved').length,
      avgProcessingDays: 5.2, // Would be calculated from actual data
      approvalRate: Math.round(
        (this.suppliers.filter((s) => s.status === 'approved').length / this.suppliers.length) * 100
      ),
    };

    // Update KPI cards
    const kpiCards = document.querySelectorAll('.procurement-kpi-card');
    if (kpiCards.length >= 4) {
      kpiCards[0].querySelector('.procurement-kpi-value').textContent = kpis.pending;
      kpiCards[1].querySelector('.procurement-kpi-value').textContent = kpis.approved;
      kpiCards[2].querySelector('.procurement-kpi-value').textContent = kpis.avgProcessingDays;
      kpiCards[3].querySelector('.procurement-kpi-value').textContent = `${kpis.approvalRate}%`;
    }
  }

  addActivity(type, title, time) {
    const activityFeed = document.querySelector('.activity-feed');
    if (!activityFeed) return;

    const iconMap = {
      approved: 'fas fa-check',
      pending: 'fas fa-clock',
      info: 'fas fa-info',
    };

    const activityItem = document.createElement('div');
    activityItem.className = 'activity-item';
    activityItem.innerHTML = `
            <div class="activity-icon ${type}">
                <i class="${iconMap[type] || 'fas fa-info'}"></i>
            </div>
            <div class="activity-content">
                <div class="activity-title">${type === 'approved' ? 'Supplier Approved' : type === 'pending' ? 'New Application' : 'Document Requested'}</div>
                <div class="activity-description">${title}</div>
                <div class="activity-time">${time}</div>
            </div>
        `;

    activityFeed.insertBefore(activityItem, activityFeed.firstChild);
  }

  // Utility methods
  formatStatus(status) {
    const statusMap = {
      pending: 'Pending Review',
      approved: 'Approved',
      rejected: 'Rejected',
      'under-review': 'Under Review',
    };
    return statusMap[status] || status;
  }

  formatDate(dateString) {
    return new Date(dateString).toLocaleDateString();
  }

  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  createModal(title, content) {
    return `
            <div class="modal-overlay" onclick="procurementManager.closeModal()">
                <div class="modal-dialog" onclick="event.stopPropagation()">
                    <div class="modal-header">
                        <h3>${title}</h3>
                        <button class="modal-close" onclick="procurementManager.closeModal()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        ${content}
                    </div>
                </div>
            </div>
        `;
  }

  showModal(modalHtml) {
    const existingModal = document.querySelector('.modal-overlay');
    if (existingModal) {
      existingModal.remove();
    }

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
      modal.remove();
      document.body.style.overflow = '';
    }
  }

  showSuccess(message) {
    this.showNotification(message, 'success');
  }

  showError(message) {
    this.showNotification(message, 'error');
  }

  showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 5000);
  }

  initializeRealTimeUpdates() {
    // Simulate real-time updates
    setInterval(() => {
      // Update KPIs with small random variations
      const kpiValues = document.querySelectorAll('.procurement-kpi-value');
      kpiValues.forEach((value) => {
        value.style.animation = 'none';
        setTimeout(() => {
          value.style.animation = 'pulse 2s ease-in-out';
        }, 10);
      });
    }, 30000); // Every 30 seconds
  }

  exportApplications() {
    // Generate CSV data
    const csvData = this.suppliers.map((supplier) => ({
      'Supplier Name': supplier.name,
      Email: supplier.email,
      Category: supplier.category,
      Status: this.formatStatus(supplier.status),
      Submitted: supplier.submitted,
      Priority: this.capitalize(supplier.priority),
      Phone: supplier.phone,
      Website: supplier.website,
    }));

    this.downloadCSV(csvData, 'supplier-applications.csv');
    this.showSuccess('Applications exported successfully!');
  }

  downloadCSV(data, filename) {
    if (!data.length) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map((row) => headers.map((header) => `"${row[header]}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  showBulkImportDialog() {
    const modal = this.createModal(
      'Bulk Import Suppliers',
      `
            <div class="bulk-import-form">
                <p>Upload a CSV file with supplier information. The file should contain the following columns:</p>
                <div class="required-columns">
                    <code>Company Name, Email, Phone, Category, Website, Address, Priority</code>
                </div>
                
                <div class="form-group">
                    <label>Select CSV File:</label>
                    <input type="file" class="form-control" id="bulkImportFile" accept=".csv">
                </div>
                
                <div class="modal-actions">
                    <button class="btn btn-primary" onclick="procurementManager.processBulkImport()">
                        Import Suppliers
                    </button>
                    <button class="btn btn-secondary" onclick="procurementManager.closeModal()">
                        Cancel
                    </button>
                </div>
            </div>
        `
    );

    this.showModal(modal);
  }

  processBulkImport() {
    const fileInput = document.getElementById('bulkImportFile');
    const file = fileInput.files[0];

    if (!file) {
      this.showError('Please select a CSV file');
      return;
    }

    // In a real application, you would parse the CSV and create suppliers
    this.showSuccess('Bulk import completed successfully! 5 suppliers added.');
    this.closeModal();

    console.log('📂 Bulk import processed:', file.name);
  }

  showWorkflowSettings() {
    const modal = this.createModal(
      'Workflow Settings',
      `
            <div class="workflow-settings">
                <h4>Onboarding Workflow Configuration</h4>
                
                <div class="workflow-step-config">
                    <div class="step-item">
                        <input type="checkbox" id="step1" checked disabled>
                        <label for="step1">Application Submitted (Required)</label>
                    </div>
                    <div class="step-item">
                        <input type="checkbox" id="step2" checked>
                        <label for="step2">Initial Review</label>
                    </div>
                    <div class="step-item">
                        <input type="checkbox" id="step3" checked>
                        <label for="step3">Document Verification</label>
                    </div>
                    <div class="step-item">
                        <input type="checkbox" id="step4" checked>
                        <label for="step4">Risk Assessment</label>
                    </div>
                    <div class="step-item">
                        <input type="checkbox" id="step5" checked disabled>
                        <label for="step5">Final Approval (Required)</label>
                    </div>
                </div>
                
                <div class="form-group">
                    <label>Auto-approve suppliers below risk threshold:</label>
                    <select class="form-control">
                        <option value="low">Low Risk Only</option>
                        <option value="medium">Low & Medium Risk</option>
                        <option value="none" selected>Manual Approval Required</option>
                    </select>
                </div>
                
                <div class="modal-actions">
                    <button class="btn btn-primary" onclick="procurementManager.saveWorkflowSettings()">
                        Save Settings
                    </button>
                    <button class="btn btn-secondary" onclick="procurementManager.closeModal()">
                        Cancel
                    </button>
                </div>
            </div>
        `
    );

    this.showModal(modal);
  }

  saveWorkflowSettings() {
    this.showSuccess('Workflow settings saved successfully!');
    this.closeModal();
    console.log('⚙️ Workflow settings updated');
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const procurementManager = new SupplierOnboardingManager();

  // Make available globally for modal interactions
  window.procurementManager = procurementManager;

  console.log('🚀 Supplier Onboarding System Ready');
});

// Add modal and notification styles
const modalStyles = `
<style>
/* Modal Styles */
.modal-overlay {
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

.modal-dialog {
    background: white;
    border-radius: 0.75rem;
    max-width: 600px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
    margin: 0;
    color: #1e293b;
}

.modal-close {
    background: none;
    border: none;
    font-size: 1.25rem;
    cursor: pointer;
    color: #64748b;
    padding: 0.5rem;
    border-radius: 0.25rem;
}

.modal-close:hover {
    background: #f1f5f9;
    color: #1e293b;
}

.modal-body {
    padding: 1.5rem;
}

.modal-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid #e2e8f0;
}

/* Form Styles */
.form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
    margin-bottom: 1rem;
}

.form-group {
    margin-bottom: 1rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #374151;
}

.form-control {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 0.875rem;
}

.form-control:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Button Styles */
.btn {
    padding: 0.75rem 1.5rem;
    border-radius: 0.375rem;
    font-weight: 500;
    font-size: 0.875rem;
    cursor: pointer;
    border: none;
    transition: all 0.2s;
}

.btn-primary {
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    color: white;
}

.btn-primary:hover {
    background: linear-gradient(135deg, #2563eb, #1e40af);
}

.btn-secondary {
    background: #f1f5f9;
    color: #64748b;
    border: 1px solid #e2e8f0;
}

.btn-secondary:hover {
    background: #e2e8f0;
    color: #475569;
}

/* Notification Styles */
.notification {
    position: fixed;
    top: 2rem;
    right: 2rem;
    background: white;
    border-radius: 0.5rem;
    padding: 1rem 1.5rem;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: 0.75rem;
    z-index: 1001;
    border-left: 4px solid #10b981;
    animation: slideIn 0.3s ease;
}

.notification.error {
    border-left-color: #ef4444;
}

.notification.error i {
    color: #ef4444;
}

.notification.success i {
    color: #10b981;
}

.notification button {
    background: none;
    border: none;
    cursor: pointer;
    color: #64748b;
    padding: 0.25rem;
}

@keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

@keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', modalStyles);
