/**
 * Titan Grove Enterprise Compliance & E-Records Suite
 * Complete compliance management system with audit trails, document management,
 * electronic signatures, and regulatory compliance - Oracle EBS competitive alternative
 */

class TitanComplianceSystem {
  constructor() {
    this.complianceItems = new Map();
    this.auditTrail = new Map();
    this.documents = new Map();
    this.signatureRequests = new Map();
    this.regulations = new Map();
    this.currentView = 'overview';
    this.filters = {
      status: 'all',
      regulation: 'all',
      department: 'all',
      priority: 'all',
    };
    this.notifications = [];
    this.initialize();
  }

  async initialize() {
    try {
      this.setupEventListeners();
      this.loadInitialData();
      this.initializeAuditTrail();
      this.setupRealTimeMonitoring();
      this.startComplianceMonitoring();
      console.log('✅ Titan Compliance System initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Compliance System:', error);
    }
  }

  setupEventListeners() {
    // Navigation events
    document.addEventListener('click', (e) => {
      if (e.target.matches('.nav-item')) {
        this.switchModule(e.target.dataset.module);
      }
      if (e.target.matches('.compliance-btn-primary')) {
        if (e.target.textContent.includes('New Compliance Item')) {
          this.openComplianceModal();
        } else if (e.target.textContent.includes('Document Upload')) {
          this.openDocumentUploadModal();
        } else if (e.target.textContent.includes('Signature Request')) {
          this.openSignatureRequestModal();
        }
      }
      if (e.target.matches('.compliance-btn-sm')) {
        this.handleItemAction(e.target);
      }
      if (e.target.matches('.modal-close') || e.target.matches('.modal-overlay')) {
        this.closeModal();
      }
    });

    // Form events
    document.addEventListener('submit', (e) => {
      if (e.target.matches('#complianceForm')) {
        e.preventDefault();
        this.submitComplianceItem(new FormData(e.target));
      }
      if (e.target.matches('#documentForm')) {
        e.preventDefault();
        this.submitDocument(new FormData(e.target));
      }
      if (e.target.matches('#signatureForm')) {
        e.preventDefault();
        this.submitSignatureRequest(new FormData(e.target));
      }
    });

    // Filter events
    document.addEventListener('change', (e) => {
      if (e.target.matches('.compliance-filter')) {
        this.applyFilters();
      }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'n':
            e.preventDefault();
            this.openComplianceModal();
            break;
          case 'd':
            e.preventDefault();
            this.openDocumentUploadModal();
            break;
          case 's':
            e.preventDefault();
            this.openSignatureRequestModal();
            break;
        }
      }
      if (e.key === 'Escape') {
        this.closeModal();
      }
    });
  }

  async loadInitialData() {
    try {
      // Load sample data - in production this would come from API
      const sampleComplianceItems = this.generateSampleComplianceItems();
      const sampleDocuments = this.generateSampleDocuments();
      const sampleSignatureRequests = this.generateSampleSignatureRequests();
      const sampleAuditEntries = this.generateSampleAuditEntries();

      sampleComplianceItems.forEach((item) => this.complianceItems.set(item.id, item));
      sampleDocuments.forEach((doc) => this.documents.set(doc.id, doc));
      sampleSignatureRequests.forEach((req) => this.signatureRequests.set(req.id, req));
      sampleAuditEntries.forEach((entry) => this.auditTrail.set(entry.id, entry));

      this.updateDashboard();
      this.updateComplianceList();
      this.updateDocumentGrid();
      this.updateSignatureRequests();
      this.updateAuditTrail();
    } catch (error) {
      console.error('Failed to load compliance data:', error);
      this.showNotification('Failed to load compliance data', 'error');
    }
  }

  generateSampleComplianceItems() {
    return [
      {
        id: 'comp-001',
        title: 'SOX Compliance - Financial Controls',
        description:
          'Quarterly review of financial controls and internal audit procedures as required by Sarbanes-Oxley Act',
        regulation: 'SOX',
        department: 'Finance',
        owner: 'Sarah Johnson',
        status: 'compliant',
        priority: 'high',
        dueDate: new Date('2024-12-31'),
        lastReview: new Date('2024-09-01'),
        nextReview: new Date('2024-12-01'),
        completionRate: 95,
        evidence: ['SOX_Controls_Q3.pdf', 'Audit_Report_092024.pdf'],
        findings: 'All financial controls operating effectively',
        remediation: null,
      },
      {
        id: 'comp-002',
        title: 'GDPR Data Processing Compliance',
        description:
          'Ensure all data processing activities comply with GDPR requirements including consent management and data retention',
        regulation: 'GDPR',
        department: 'IT',
        owner: 'David Chen',
        status: 'pending',
        priority: 'critical',
        dueDate: new Date('2024-10-15'),
        lastReview: new Date('2024-07-15'),
        nextReview: new Date('2024-10-15'),
        completionRate: 75,
        evidence: ['GDPR_Assessment.pdf', 'Data_Mapping.xlsx'],
        findings: 'Data retention policies need updating',
        remediation: 'Update data retention policies by October 15',
      },
      {
        id: 'comp-003',
        title: 'ISO 27001 Security Controls',
        description:
          'Quarterly assessment of information security management system controls and risk assessment',
        regulation: 'ISO 27001',
        department: 'IT Security',
        owner: 'Michael Rodriguez',
        status: 'non-compliant',
        priority: 'high',
        dueDate: new Date('2024-09-30'),
        lastReview: new Date('2024-06-01'),
        nextReview: new Date('2024-09-30'),
        completionRate: 60,
        evidence: ['Security_Assessment_Q2.pdf'],
        findings: 'Several security controls require immediate attention',
        remediation: 'Implement missing security controls within 30 days',
      },
      {
        id: 'comp-004',
        title: 'HIPAA Privacy & Security Rule',
        description:
          'Annual review of healthcare data privacy and security procedures including breach assessment',
        regulation: 'HIPAA',
        department: 'Healthcare',
        owner: 'Dr. Emily Watson',
        status: 'review',
        priority: 'medium',
        dueDate: new Date('2024-11-30'),
        lastReview: new Date('2024-08-01'),
        nextReview: new Date('2024-11-01'),
        completionRate: 85,
        evidence: ['HIPAA_Review_2024.pdf', 'Privacy_Training_Records.xlsx'],
        findings: 'Training completion rates need improvement',
        remediation: 'Complete privacy training for all staff',
      },
      {
        id: 'comp-005',
        title: 'Environmental Compliance - EPA Regulations',
        description:
          'Monthly monitoring of environmental compliance including waste management and emissions reporting',
        regulation: 'EPA',
        department: 'Environmental',
        owner: 'James Thompson',
        status: 'compliant',
        priority: 'medium',
        dueDate: new Date('2024-10-31'),
        lastReview: new Date('2024-09-01'),
        nextReview: new Date('2024-10-01'),
        completionRate: 100,
        evidence: ['EPA_Report_Q3.pdf', 'Emissions_Data.xlsx', 'Waste_Management_Log.pdf'],
        findings: 'All environmental controls operating within limits',
        remediation: null,
      },
    ];
  }

  generateSampleDocuments() {
    return [
      {
        id: 'doc-001',
        name: 'SOX Controls Assessment Q3 2024',
        type: 'pdf',
        size: '2.4 MB',
        uploadDate: new Date('2024-09-01'),
        category: 'Compliance Report',
        tags: ['SOX', 'Financial Controls', 'Q3 2024'],
        owner: 'Sarah Johnson',
        department: 'Finance',
        status: 'approved',
        version: '1.2',
        retention: new Date('2031-09-01'),
      },
      {
        id: 'doc-002',
        name: 'GDPR Data Processing Agreement',
        type: 'docx',
        size: '1.1 MB',
        uploadDate: new Date('2024-08-15'),
        category: 'Legal Document',
        tags: ['GDPR', 'Data Processing', 'Contract'],
        owner: 'Legal Department',
        department: 'Legal',
        status: 'pending-review',
        version: '2.0',
        retention: new Date('2029-08-15'),
      },
      {
        id: 'doc-003',
        name: 'ISO 27001 Risk Assessment Matrix',
        type: 'xlsx',
        size: '890 KB',
        uploadDate: new Date('2024-07-20'),
        category: 'Risk Assessment',
        tags: ['ISO 27001', 'Risk Management', 'Security'],
        owner: 'Michael Rodriguez',
        department: 'IT Security',
        status: 'approved',
        version: '3.1',
        retention: new Date('2027-07-20'),
      },
      {
        id: 'doc-004',
        name: 'HIPAA Training Materials 2024',
        type: 'pdf',
        size: '5.2 MB',
        uploadDate: new Date('2024-06-01'),
        category: 'Training Material',
        tags: ['HIPAA', 'Privacy Training', 'Healthcare'],
        owner: 'Dr. Emily Watson',
        department: 'Healthcare',
        status: 'approved',
        version: '1.0',
        retention: new Date('2027-06-01'),
      },
    ];
  }

  generateSampleSignatureRequests() {
    return [
      {
        id: 'sig-001',
        title: 'SOX Compliance Certification Q3',
        description: 'Executive certification of SOX compliance for Q3 2024 financial reporting',
        document: 'SOX_Certification_Q3.pdf',
        requestedBy: 'Sarah Johnson',
        requiredSigners: ['CEO', 'CFO', 'Chief Audit Executive'],
        currentSigner: 'CEO',
        status: 'pending',
        priority: 'high',
        dueDate: new Date('2024-10-15'),
        createdDate: new Date('2024-09-15'),
        signatures: [
          { signer: 'CEO', signed: false, date: null, ip: null },
          { signer: 'CFO', signed: false, date: null, ip: null },
          { signer: 'Chief Audit Executive', signed: false, date: null, ip: null },
        ],
      },
      {
        id: 'sig-002',
        title: 'GDPR Data Processing Agreement',
        description:
          'Third-party vendor data processing agreement requiring legal and IT security approval',
        document: 'Vendor_DPA_2024.pdf',
        requestedBy: 'David Chen',
        requiredSigners: ['Legal Counsel', 'IT Security Manager', 'Privacy Officer'],
        currentSigner: 'Legal Counsel',
        status: 'pending',
        priority: 'medium',
        dueDate: new Date('2024-10-30'),
        createdDate: new Date('2024-09-20'),
        signatures: [
          {
            signer: 'Legal Counsel',
            signed: true,
            date: new Date('2024-09-22'),
            ip: '192.168.1.101',
          },
          { signer: 'IT Security Manager', signed: false, date: null, ip: null },
          { signer: 'Privacy Officer', signed: false, date: null, ip: null },
        ],
      },
      {
        id: 'sig-003',
        title: 'ISO 27001 Security Policy Update',
        description:
          'Updated information security policy requiring management approval and acknowledgment',
        document: 'Security_Policy_v2.1.pdf',
        requestedBy: 'Michael Rodriguez',
        requiredSigners: ['CTO', 'CISO', 'HR Director'],
        currentSigner: 'CTO',
        status: 'signed',
        priority: 'low',
        dueDate: new Date('2024-11-15'),
        createdDate: new Date('2024-08-01'),
        signatures: [
          { signer: 'CTO', signed: true, date: new Date('2024-08-05'), ip: '192.168.1.102' },
          { signer: 'CISO', signed: true, date: new Date('2024-08-07'), ip: '192.168.1.103' },
          {
            signer: 'HR Director',
            signed: true,
            date: new Date('2024-08-10'),
            ip: '192.168.1.104',
          },
        ],
      },
    ];
  }

  generateSampleAuditEntries() {
    return [
      {
        id: 'audit-001',
        timestamp: new Date('2024-09-01T10:30:00'),
        action: 'CREATE',
        entity: 'Compliance Item',
        entityId: 'comp-001',
        user: 'Sarah Johnson',
        userRole: 'Compliance Manager',
        description: 'Created new SOX compliance item for Q3 financial controls review',
        ipAddress: '192.168.1.101',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        changes: {
          title: 'SOX Compliance - Financial Controls',
          status: 'pending',
          owner: 'Sarah Johnson',
        },
      },
      {
        id: 'audit-002',
        timestamp: new Date('2024-09-01T14:15:00'),
        action: 'UPDATE',
        entity: 'Compliance Item',
        entityId: 'comp-001',
        user: 'Chief Audit Executive',
        userRole: 'Auditor',
        description: 'Updated SOX compliance status to compliant after review',
        ipAddress: '192.168.1.105',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        changes: {
          status: 'compliant',
          completionRate: 95,
          findings: 'All financial controls operating effectively',
        },
      },
      {
        id: 'audit-003',
        timestamp: new Date('2024-09-02T09:20:00'),
        action: 'CREATE',
        entity: 'Document',
        entityId: 'doc-001',
        user: 'Sarah Johnson',
        userRole: 'Compliance Manager',
        description: 'Uploaded SOX controls assessment document',
        ipAddress: '192.168.1.101',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        changes: {
          name: 'SOX Controls Assessment Q3 2024',
          type: 'pdf',
          size: '2.4 MB',
        },
      },
      {
        id: 'audit-004',
        timestamp: new Date('2024-09-22T16:45:00'),
        action: 'SIGN',
        entity: 'Signature Request',
        entityId: 'sig-002',
        user: 'Legal Counsel',
        userRole: 'Legal',
        description: 'Signed GDPR data processing agreement',
        ipAddress: '192.168.1.110',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        changes: {
          signer: 'Legal Counsel',
          signed: true,
          timestamp: new Date('2024-09-22T16:45:00'),
        },
      },
    ];
  }

  updateDashboard() {
    // Update KPI cards
    const totalItems = this.complianceItems.size;
    const compliantItems = Array.from(this.complianceItems.values()).filter(
      (item) => item.status === 'compliant'
    ).length;
    const pendingItems = Array.from(this.complianceItems.values()).filter(
      (item) => item.status === 'pending'
    ).length;
    const overdueItems = Array.from(this.complianceItems.values()).filter(
      (item) => item.status !== 'compliant' && item.dueDate < new Date()
    ).length;

    const complianceRate = Math.round((compliantItems / totalItems) * 100);

    // Update KPI values
    const complianceRateEl = document.querySelector('.kpi-card.compliance .kpi-value');
    if (complianceRateEl) complianceRateEl.textContent = complianceRate + '%';

    const totalItemsEl = document.querySelector('.kpi-card.audit .kpi-value');
    if (totalItemsEl) totalItemsEl.textContent = totalItems;

    const documentsEl = document.querySelector('.kpi-card.documents .kpi-value');
    if (documentsEl) documentsEl.textContent = this.documents.size;

    const signaturesEl = document.querySelector('.kpi-card.signatures .kpi-value');
    if (signaturesEl) {
      const pendingSignatures = Array.from(this.signatureRequests.values()).filter(
        (req) => req.status === 'pending'
      ).length;
      signaturesEl.textContent = pendingSignatures;
    }
  }

  updateComplianceList() {
    const listContainer = document.querySelector('.compliance-list');
    if (!listContainer) return;

    const filteredItems = this.getFilteredComplianceItems();

    listContainer.innerHTML = filteredItems
      .map(
        (item) => `
            <div class="compliance-item" data-id="${item.id}">
                <div class="compliance-item-header">
                    <h3 class="compliance-item-title">${item.title}</h3>
                    <span class="compliance-status ${item.status}">${this.getStatusLabel(item.status)}</span>
                </div>
                <p class="compliance-item-description">${item.description}</p>
                <div class="compliance-item-meta">
                    <span><i class="fas fa-building"></i> ${item.department}</span>
                    <span><i class="fas fa-user"></i> ${item.owner}</span>
                    <span><i class="fas fa-calendar"></i> Due: ${item.dueDate.toLocaleDateString()}</span>
                    <span><i class="fas fa-chart-pie"></i> ${item.completionRate}% Complete</span>
                </div>
                <div class="compliance-item-actions">
                    <button class="compliance-btn compliance-btn-sm compliance-btn-primary" data-action="view" data-id="${item.id}">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button class="compliance-btn compliance-btn-sm compliance-btn-secondary" data-action="edit" data-id="${item.id}">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="compliance-btn compliance-btn-sm compliance-btn-success" data-action="review" data-id="${item.id}">
                        <i class="fas fa-check-circle"></i> Review
                    </button>
                </div>
            </div>
        `
      )
      .join('');
  }

  getFilteredComplianceItems() {
    let filtered = Array.from(this.complianceItems.values());

    if (this.filters.status !== 'all') {
      filtered = filtered.filter((item) => item.status === this.filters.status);
    }
    if (this.filters.regulation !== 'all') {
      filtered = filtered.filter((item) => item.regulation === this.filters.regulation);
    }
    if (this.filters.department !== 'all') {
      filtered = filtered.filter((item) => item.department === this.filters.department);
    }
    if (this.filters.priority !== 'all') {
      filtered = filtered.filter((item) => item.priority === this.filters.priority);
    }

    return filtered.sort((a, b) => a.dueDate - b.dueDate);
  }

  getStatusLabel(status) {
    const statusLabels = {
      compliant: 'Compliant',
      'non-compliant': 'Non-Compliant',
      pending: 'Pending Review',
      review: 'Under Review',
    };
    return statusLabels[status] || status;
  }

  updateDocumentGrid() {
    const gridContainer = document.querySelector('.document-grid');
    if (!gridContainer) return;

    const documents = Array.from(this.documents.values());

    gridContainer.innerHTML = documents
      .map(
        (doc) => `
            <div class="document-card" data-id="${doc.id}">
                <div class="document-icon">
                    <i class="fas fa-file-${this.getDocumentIcon(doc.type)}"></i>
                </div>
                <div class="document-name">${doc.name}</div>
                <div class="document-meta">
                    <div>${doc.size} • ${doc.version}</div>
                    <div>${doc.uploadDate.toLocaleDateString()}</div>
                    <div>by ${doc.owner}</div>
                </div>
                <div class="document-actions">
                    <button class="compliance-btn compliance-btn-sm compliance-btn-primary" data-action="view" data-id="${doc.id}">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="compliance-btn compliance-btn-sm compliance-btn-secondary" data-action="download" data-id="${doc.id}">
                        <i class="fas fa-download"></i>
                    </button>
                </div>
            </div>
        `
      )
      .join('');
  }

  getDocumentIcon(type) {
    const iconMap = {
      pdf: 'pdf',
      docx: 'word',
      xlsx: 'excel',
      pptx: 'powerpoint',
      txt: 'alt',
    };
    return iconMap[type] || 'alt';
  }

  updateSignatureRequests() {
    const container = document.querySelector('.signature-requests-container');
    if (!container) return;

    const requests = Array.from(this.signatureRequests.values());

    container.innerHTML = requests
      .map(
        (req) => `
            <div class="signature-request ${req.priority === 'high' ? 'urgent' : ''}" data-id="${req.id}">
                <div class="signature-header">
                    <h3 class="signature-title">${req.title}</h3>
                    <span class="signature-status ${req.status}">${this.getSignatureStatusLabel(req.status)}</span>
                </div>
                <p class="signature-description">${req.description}</p>
                <div class="signature-meta">
                    <span><i class="fas fa-user"></i> Requested by: ${req.requestedBy}</span>
                    <span><i class="fas fa-calendar"></i> Due: ${req.dueDate.toLocaleDateString()}</span>
                    <span><i class="fas fa-users"></i> ${req.signatures.filter((s) => s.signed).length}/${req.signatures.length} signed</span>
                </div>
                <div class="signature-actions">
                    <button class="compliance-btn compliance-btn-sm compliance-btn-primary" data-action="view-signature" data-id="${req.id}">
                        <i class="fas fa-eye"></i> View
                    </button>
                    ${
                      req.status === 'pending'
                        ? `
                        <button class="compliance-btn compliance-btn-sm compliance-btn-success" data-action="sign" data-id="${req.id}">
                            <i class="fas fa-signature"></i> Sign
                        </button>
                    `
                        : ''
                    }
                </div>
            </div>
        `
      )
      .join('');
  }

  getSignatureStatusLabel(status) {
    const statusLabels = {
      pending: 'Pending Signatures',
      signed: 'Fully Signed',
      rejected: 'Rejected',
    };
    return statusLabels[status] || status;
  }

  updateAuditTrail() {
    const trailContainer = document.querySelector('.audit-trail');
    if (!trailContainer) return;

    const entries = Array.from(this.auditTrail.values())
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 20); // Show latest 20 entries

    trailContainer.innerHTML = entries
      .map(
        (entry) => `
            <div class="audit-entry">
                <div class="audit-icon ${entry.action.toLowerCase()}">
                    <i class="fas fa-${this.getAuditIcon(entry.action)}"></i>
                </div>
                <div class="audit-content">
                    <div class="audit-header">
                        <span class="audit-action">${entry.action} ${entry.entity}</span>
                        <span class="audit-time">${this.formatTime(entry.timestamp)}</span>
                    </div>
                    <div class="audit-description">${entry.description}</div>
                    <div class="audit-user">by ${entry.user} (${entry.userRole})</div>
                </div>
            </div>
        `
      )
      .join('');
  }

  getAuditIcon(action) {
    const iconMap = {
      CREATE: 'plus',
      UPDATE: 'edit',
      DELETE: 'trash',
      REVIEW: 'search',
      SIGN: 'signature',
    };
    return iconMap[action] || 'info';
  }

  formatTime(date) {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  }

  handleItemAction(button) {
    const action = button.dataset.action;
    const id = button.dataset.id;

    switch (action) {
      case 'view':
        this.viewItem(id);
        break;
      case 'edit':
        this.editItem(id);
        break;
      case 'review':
        this.reviewItem(id);
        break;
      case 'download':
        this.downloadDocument(id);
        break;
      case 'sign':
        this.signDocument(id);
        break;
      case 'view-signature':
        this.viewSignatureRequest(id);
        break;
    }
  }

  viewItem(id) {
    const item = this.complianceItems.get(id);
    if (item) {
      console.log('Viewing compliance item:', item);
      this.showNotification(`Viewing ${item.title}`, 'info');
    }
  }

  editItem(id) {
    const item = this.complianceItems.get(id);
    if (item) {
      console.log('Editing compliance item:', item);
      this.showNotification(`Editing ${item.title}`, 'info');
    }
  }

  reviewItem(id) {
    const item = this.complianceItems.get(id);
    if (item) {
      // Update status to under review
      item.status = 'review';
      item.lastReview = new Date();

      // Log audit entry
      this.logAuditEntry(
        'REVIEW',
        'Compliance Item',
        id,
        'System User',
        'Compliance item marked for review'
      );

      this.updateComplianceList();
      this.updateDashboard();
      this.showNotification(`${item.title} marked for review`, 'success');
    }
  }

  downloadDocument(id) {
    const doc = this.documents.get(id);
    if (doc) {
      // Simulate document download
      console.log('Downloading document:', doc.name);
      this.showNotification(`Downloading ${doc.name}`, 'success');

      // Log audit entry
      this.logAuditEntry(
        'DOWNLOAD',
        'Document',
        id,
        'Current User',
        `Downloaded document: ${doc.name}`
      );
    }
  }

  signDocument(id) {
    const request = this.signatureRequests.get(id);
    if (request) {
      // Simulate digital signature
      const currentSignature = request.signatures.find((s) => !s.signed);
      if (currentSignature) {
        currentSignature.signed = true;
        currentSignature.date = new Date();
        currentSignature.ip = '192.168.1.100'; // Simulated IP

        // Check if all signatures are complete
        const allSigned = request.signatures.every((s) => s.signed);
        if (allSigned) {
          request.status = 'signed';
        }

        // Log audit entry
        this.logAuditEntry(
          'SIGN',
          'Signature Request',
          id,
          currentSignature.signer,
          `Signed document: ${request.title}`
        );

        this.updateSignatureRequests();
        this.showNotification(`Document signed successfully`, 'success');
      }
    }
  }

  viewSignatureRequest(id) {
    const request = this.signatureRequests.get(id);
    if (request) {
      console.log('Viewing signature request:', request);
      this.showNotification(`Viewing signature request: ${request.title}`, 'info');
    }
  }

  openComplianceModal() {
    const modal = document.getElementById('complianceModal');
    if (modal) {
      this.showModal(modal);
    }
  }

  openDocumentUploadModal() {
    const modal = document.getElementById('documentModal');
    if (modal) {
      this.showModal(modal);
    }
  }

  openSignatureRequestModal() {
    const modal = document.getElementById('signatureModal');
    if (modal) {
      this.showModal(modal);
    }
  }

  showModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    document.querySelectorAll('.modal-overlay.active').forEach((modal) => {
      modal.classList.remove('active');
    });
    document.body.style.overflow = '';
  }

  submitComplianceItem(formData) {
    const itemData = {
      id: 'comp-' + Date.now(),
      title: formData.get('title'),
      description: formData.get('description'),
      regulation: formData.get('regulation'),
      department: formData.get('department'),
      owner: formData.get('owner'),
      status: 'pending',
      priority: formData.get('priority'),
      dueDate: new Date(formData.get('dueDate')),
      lastReview: null,
      nextReview: new Date(formData.get('dueDate')),
      completionRate: 0,
      evidence: [],
      findings: null,
      remediation: null,
    };

    this.complianceItems.set(itemData.id, itemData);

    // Log audit entry
    this.logAuditEntry(
      'CREATE',
      'Compliance Item',
      itemData.id,
      'Current User',
      `Created new compliance item: ${itemData.title}`
    );

    this.updateComplianceList();
    this.updateDashboard();
    this.closeModal();
    this.showNotification('Compliance item created successfully', 'success');
  }

  submitDocument(formData) {
    const docData = {
      id: 'doc-' + Date.now(),
      name: formData.get('name'),
      type: this.getFileExtension(formData.get('name')),
      size: '1.2 MB', // Simulated
      uploadDate: new Date(),
      category: formData.get('category'),
      tags: formData
        .get('tags')
        .split(',')
        .map((tag) => tag.trim()),
      owner: 'Current User',
      department: formData.get('department'),
      status: 'pending-review',
      version: '1.0',
      retention: new Date(Date.now() + 7 * 365 * 24 * 60 * 60 * 1000), // 7 years
    };

    this.documents.set(docData.id, docData);

    // Log audit entry
    this.logAuditEntry(
      'CREATE',
      'Document',
      docData.id,
      'Current User',
      `Uploaded document: ${docData.name}`
    );

    this.updateDocumentGrid();
    this.updateDashboard();
    this.closeModal();
    this.showNotification('Document uploaded successfully', 'success');
  }

  submitSignatureRequest(formData) {
    const signers = formData
      .get('signers')
      .split(',')
      .map((s) => s.trim());
    const requestData = {
      id: 'sig-' + Date.now(),
      title: formData.get('title'),
      description: formData.get('description'),
      document: formData.get('document'),
      requestedBy: 'Current User',
      requiredSigners: signers,
      currentSigner: signers[0],
      status: 'pending',
      priority: formData.get('priority'),
      dueDate: new Date(formData.get('dueDate')),
      createdDate: new Date(),
      signatures: signers.map((signer) => ({
        signer: signer,
        signed: false,
        date: null,
        ip: null,
      })),
    };

    this.signatureRequests.set(requestData.id, requestData);

    // Log audit entry
    this.logAuditEntry(
      'CREATE',
      'Signature Request',
      requestData.id,
      'Current User',
      `Created signature request: ${requestData.title}`
    );

    this.updateSignatureRequests();
    this.updateDashboard();
    this.closeModal();
    this.showNotification('Signature request created successfully', 'success');
  }

  getFileExtension(filename) {
    return filename.split('.').pop().toLowerCase();
  }

  logAuditEntry(action, entity, entityId, user, description) {
    const entry = {
      id: 'audit-' + Date.now(),
      timestamp: new Date(),
      action: action,
      entity: entity,
      entityId: entityId,
      user: user,
      userRole: 'System User',
      description: description,
      ipAddress: '192.168.1.100',
      userAgent: navigator.userAgent,
      changes: {},
    };

    this.auditTrail.set(entry.id, entry);
    this.updateAuditTrail();
  }

  applyFilters() {
    // Update filters from form controls
    this.filters.status = document.querySelector('#statusFilter')?.value || 'all';
    this.filters.regulation = document.querySelector('#regulationFilter')?.value || 'all';
    this.filters.department = document.querySelector('#departmentFilter')?.value || 'all';
    this.filters.priority = document.querySelector('#priorityFilter')?.value || 'all';

    this.updateComplianceList();
  }

  switchModule(module) {
    // Handle navigation between modules
    console.log('Switching to module:', module);

    if (module === 'dashboard') {
      window.location.href = 'dashboard.html';
    } else if (module === 'asset-management') {
      window.location.href = 'asset-management.html';
    }
  }

  initializeAuditTrail() {
    // Initialize audit trail monitoring
    console.log('Initializing audit trail monitoring...');
  }

  setupRealTimeMonitoring() {
    // Setup real-time compliance monitoring
    console.log('Setting up real-time compliance monitoring...');
  }

  startComplianceMonitoring() {
    // Start periodic compliance checking
    setInterval(() => {
      this.checkComplianceDeadlines();
    }, 60000); // Check every minute
  }

  checkComplianceDeadlines() {
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    Array.from(this.complianceItems.values()).forEach((item) => {
      if (item.status !== 'compliant' && item.dueDate <= tomorrow && item.dueDate > now) {
        this.showNotification(`Compliance deadline approaching: ${item.title}`, 'warning');
      } else if (item.status !== 'compliant' && item.dueDate < now) {
        this.showNotification(`Compliance item overdue: ${item.title}`, 'error');
      }
    });
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type} show`;

    const iconMap = {
      success: 'fa-check-circle',
      error: 'fa-exclamation-circle',
      warning: 'fa-exclamation-triangle',
      info: 'fa-info-circle',
    };

    notification.innerHTML = `
            <div class="notification-icon">
                <i class="fas ${iconMap[type]}"></i>
            </div>
            <div class="notification-content">
                <div class="notification-title">${type.charAt(0).toUpperCase() + type.slice(1)}</div>
                <div class="notification-message">${message}</div>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 5000);

    // Manual close
    notification.querySelector('.notification-close').addEventListener('click', () => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    });
  }
}

// Initialize the Compliance System when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.complianceSystem = new TitanComplianceSystem();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TitanComplianceSystem;
}
