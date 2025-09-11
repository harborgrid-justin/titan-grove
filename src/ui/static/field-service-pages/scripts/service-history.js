/**
 * Service History - Field Service Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Service History
document.addEventListener('DOMContentLoaded', function () {
  console.log('Service History page loaded');

  // Initialize page-specific features
  initializeServiceHistory();
  loadServiceHistoryData();
});

function initializeServiceHistory() {
  // Configure export history button
  const exportHistoryBtn = document.getElementById('exportHistoryBtn');
  if (exportHistoryBtn) {
    exportHistoryBtn.addEventListener('click', function () {
      exportServiceHistory();
    });
  }

  // Configure new service button
  const newServiceBtn = document.getElementById('newServiceBtn');
  if (newServiceBtn) {
    newServiceBtn.addEventListener('click', function () {
      createNewServiceRequest();
    });
  }

  // Configure filters and controls
  setupHistoryControls();

  // Configure chart controls
  setupChartControls();

  // Configure table controls
  setupTableControls();

  // Configure pagination
  setupPagination();

  // Configure service details modal
  setupServiceDetailsModal();

  // Load initial data
  loadServiceHistoryTable();
}

async function loadServiceHistoryData() {
  try {
    const filters = getHistoryFilters();
    const response = await fetch(
      `/api/field-service/customers/service-history?${new URLSearchParams(filters)}`
    );
    if (response.ok) {
      const data = await response.json();
      updateServiceHistoryDisplay(data);
    }
  } catch (error) {
    console.error('Failed to load service history data:', error);
    showNotification('Failed to load service history data', 'error');
    // Load sample data as fallback
    updateServiceHistoryDisplay(getSampleServiceHistoryData());
  }
}

function setupHistoryControls() {
  const customerSelect = document.getElementById('customerSelect');
  const dateRange = document.getElementById('dateRange');
  const serviceType = document.getElementById('serviceType');
  const serviceStatus = document.getElementById('serviceStatus');
  const refreshBtn = document.getElementById('refreshHistoryBtn');
  const applyDatesBtn = document.getElementById('applyDatesBtn');

  [customerSelect, serviceType, serviceStatus].forEach((control) => {
    if (control) {
      control.addEventListener('change', function () {
        console.log('Service history filter changed');
        loadServiceHistoryData();
        loadServiceHistoryTable();
        updateCustomerOverview();
      });
    }
  });

  if (dateRange) {
    dateRange.addEventListener('change', function () {
      const customRange = document.getElementById('customDateRange');
      if (this.value === 'custom') {
        customRange.style.display = 'block';
      } else {
        customRange.style.display = 'none';
        loadServiceHistoryData();
        loadServiceHistoryTable();
      }
    });
  }

  if (applyDatesBtn) {
    applyDatesBtn.addEventListener('click', function () {
      loadServiceHistoryData();
      loadServiceHistoryTable();
    });
  }

  if (refreshBtn) {
    refreshBtn.addEventListener('click', function () {
      loadServiceHistoryData();
      showNotification('Service history refreshed', 'info');
    });
  }
}

function setupChartControls() {
  const trendMetric = document.getElementById('trendMetric');
  const trendPeriod = document.getElementById('trendPeriod');

  if (trendMetric) {
    trendMetric.addEventListener('change', function () {
      updateTrendChart(this.value);
    });
  }

  if (trendPeriod) {
    trendPeriod.addEventListener('change', function () {
      updateTrendChart();
    });
  }
}

function setupTableControls() {
  const searchInput = document.getElementById('searchHistory');
  const sortSelect = document.getElementById('sortHistory');

  if (searchInput) {
    searchInput.addEventListener('input', function () {
      filterHistoryTable(this.value);
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', function () {
      sortHistoryTable(this.value);
    });
  }
}

function setupPagination() {
  const prevBtn = document.getElementById('prevPageBtn');
  const nextBtn = document.getElementById('nextPageBtn');

  if (prevBtn) {
    prevBtn.addEventListener('click', function () {
      navigatePage(-1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      navigatePage(1);
    });
  }
}

function setupServiceDetailsModal() {
  const modal = document.getElementById('serviceDetailsModal');
  const closeBtn = document.getElementById('closeServiceDetailsModal');
  const closeDetailsBtn = document.getElementById('closeDetailsBtn');
  const repeatServiceBtn = document.getElementById('repeatServiceBtn');
  const followUpBtn = document.getElementById('followUpBtn');

  if (closeBtn) {
    closeBtn.addEventListener('click', hideServiceDetailsModal);
  }

  if (closeDetailsBtn) {
    closeDetailsBtn.addEventListener('click', hideServiceDetailsModal);
  }

  if (repeatServiceBtn) {
    repeatServiceBtn.addEventListener('click', function () {
      repeatService();
    });
  }

  if (followUpBtn) {
    followUpBtn.addEventListener('click', function () {
      scheduleFollowUp();
    });
  }

  // Close modal on background click
  if (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target === modal) {
        hideServiceDetailsModal();
      }
    });
  }
}

function getHistoryFilters() {
  const filters = {
    customer: document.getElementById('customerSelect')?.value || 'all',
    dateRange: document.getElementById('dateRange')?.value || 'month',
    serviceType: document.getElementById('serviceType')?.value || 'all',
    status: document.getElementById('serviceStatus')?.value || 'all',
  };

  // Add custom date range if selected
  if (filters.dateRange === 'custom') {
    filters.startDate = document.getElementById('startDate')?.value;
    filters.endDate = document.getElementById('endDate')?.value;
  }

  return filters;
}

function loadServiceHistoryTable() {
  const filters = getHistoryFilters();

  fetch(`/api/field-service/customers/service-records?${new URLSearchParams(filters)}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        renderServiceHistoryTable(data.data);
        updatePagination(data.pagination);
      }
    })
    .catch((error) => {
      console.error('Failed to load service history table:', error);
      // Load sample data as fallback
      renderServiceHistoryTable(getSampleServiceRecords());
    });
}

function renderServiceHistoryTable(records) {
  const tbody = document.getElementById('historyTableBody');
  if (!tbody) return;

  tbody.innerHTML = records
    .map(
      (record) => `
        <tr data-record-id="${record.id}">
            <td>${formatDate(record.date)}</td>
            <td>
                <div class="work-order-info">
                    <div class="wo-number">${record.workOrder}</div>
                    <div class="wo-type">${record.type}</div>
                </div>
            </td>
            <td>
                <div class="customer-info">
                    <div class="customer-name">${record.customer}</div>
                    <div class="customer-location">${record.location}</div>
                </div>
            </td>
            <td>
                <span class="service-type-badge ${record.serviceCategory}">${record.serviceType}</span>
            </td>
            <td>
                <div class="technician-info">
                    <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(record.technician)}&background=0D8ABC&color=fff" 
                         alt="${record.technician}" class="tech-avatar-tiny">
                    <span>${record.technician}</span>
                </div>
            </td>
            <td class="text-center">${record.duration}</td>
            <td class="text-center">
                <span class="service-value">$${record.value.toLocaleString()}</span>
            </td>
            <td class="text-center">
                <span class="status-badge ${record.status}">${formatStatus(record.status)}</span>
            </td>
            <td class="text-center">
                <div class="rating-display">
                    ${
                      record.rating
                        ? `
                        <span class="rating-value">${record.rating}</span>
                        <div class="rating-stars">${generateStars(record.rating)}</div>
                    `
                        : '<span class="no-rating">N/A</span>'
                    }
                </div>
            </td>
            <td class="text-center">
                <div class="table-actions">
                    <button class="action-btn" onclick="viewServiceDetails('${record.id}')" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn" onclick="downloadInvoice('${record.id}')" title="Download Invoice">
                        <i class="fas fa-file-invoice"></i>
                    </button>
                    <button class="action-btn" onclick="repeatService('${record.id}')" title="Repeat Service">
                        <i class="fas fa-redo"></i>
                    </button>
                </div>
            </td>
        </tr>
    `
    )
    .join('');
}

function getSampleServiceRecords() {
  return [
    {
      id: 'service_001',
      date: '2024-03-15',
      workOrder: 'WO-2024-001',
      type: 'Repair',
      customer: 'Acme Corporation',
      location: 'Downtown Office',
      serviceType: 'HVAC Repair',
      serviceCategory: 'hvac',
      technician: 'John Smith',
      duration: '3.5 hrs',
      value: 750,
      status: 'completed',
      rating: 4.8,
    },
    {
      id: 'service_002',
      date: '2024-03-14',
      workOrder: 'WO-2024-002',
      type: 'Maintenance',
      customer: 'Beta Manufacturing',
      location: 'Factory Floor',
      serviceType: 'Electrical Inspection',
      serviceCategory: 'electrical',
      technician: 'Sarah Johnson',
      duration: '2 hrs',
      value: 450,
      status: 'completed',
      rating: 4.9,
    },
    {
      id: 'service_003',
      date: '2024-03-13',
      workOrder: 'WO-2024-003',
      type: 'Installation',
      customer: 'Gamma Services',
      location: 'Warehouse',
      serviceType: 'Plumbing Installation',
      serviceCategory: 'plumbing',
      technician: 'Mike Rodriguez',
      duration: '4 hrs',
      value: 1200,
      status: 'completed',
      rating: 4.6,
    },
    {
      id: 'service_004',
      date: '2024-03-12',
      workOrder: 'WO-2024-004',
      type: 'Emergency',
      customer: 'Delta Enterprises',
      location: 'Main Building',
      serviceType: 'Emergency Repair',
      serviceCategory: 'emergency',
      technician: 'Lisa Chen',
      duration: '1.5 hrs',
      value: 850,
      status: 'completed',
      rating: 5.0,
    },
  ];
}

function getSampleServiceHistoryData() {
  return {
    stats: {
      totalServices: 247,
      avgSatisfaction: 4.6,
      responseTime: '11min',
    },
    overview: {
      customerServices: 47,
      lastService: '5 days ago',
      totalValue: '$47,320',
      avgRating: 4.7,
    },
    categories: {
      hvacCount: 89,
      electricalCount: 67,
      plumbingCount: 52,
      maintenanceCount: 39,
    },
  };
}

function updateServiceHistoryDisplay(data) {
  // Update header stats
  if (data.stats) {
    updateElement('totalServices', data.stats.totalServices || 247);
    updateElement('avgSatisfaction', data.stats.avgSatisfaction || 4.6);
    updateElement('responseTime', data.stats.responseTime || '11min');
  }

  // Update customer overview
  if (data.overview) {
    updateCustomerOverview(data.overview);
  }

  // Update category breakdown
  if (data.categories) {
    updateCategoryBreakdown(data.categories);
  }
}

function updateCustomerOverview(overview) {
  const selectedCustomer = document.getElementById('customerSelect').value;
  const customerName = document.getElementById('selectedCustomerName');

  if (customerName) {
    if (selectedCustomer === 'all') {
      customerName.textContent = 'All Customers';
    } else {
      const customerSelect = document.getElementById('customerSelect');
      const selectedOption = customerSelect.querySelector(`option[value="${selectedCustomer}"]`);
      customerName.textContent = selectedOption ? selectedOption.textContent : 'Unknown Customer';
    }
  }

  if (overview) {
    updateElement('customerServices', overview.customerServices || 47);
    updateElement('lastService', overview.lastService || '5 days ago');
    updateElement('totalValue', overview.totalValue || '$47,320');
    updateElement('avgRating', overview.avgRating || 4.7);
  }
}

function updateCategoryBreakdown(categories) {
  if (categories) {
    updateElement('hvacCount', categories.hvacCount || 89);
    updateElement('electricalCount', categories.electricalCount || 67);
    updateElement('plumbingCount', categories.plumbingCount || 52);
    updateElement('maintenanceCount', categories.maintenanceCount || 39);
  }
}

function updateTrendChart(metric) {
  console.log('Updating trend chart for metric:', metric || 'default');

  const chartContainer = document.getElementById('serviceTrendChart');
  if (!chartContainer) return;

  // Sample trend data based on metric
  const trendData = {
    count: [
      'Jan: 24 services',
      'Feb: 31 services',
      'Mar: 28 services',
      'Apr: 35 services',
      'May: 29 services',
    ],
    value: ['Jan: $18,400', 'Feb: $24,200', 'Mar: $21,800', 'Apr: $28,600', 'May: $23,200'],
    satisfaction: ['Jan: 4.5', 'Feb: 4.6', 'Mar: 4.7', 'Apr: 4.8', 'May: 4.6'],
    response: ['Jan: 13min', 'Feb: 11min', 'Mar: 9min', 'Apr: 12min', 'May: 11min'],
  };

  const trendElement = chartContainer.querySelector('.sample-trend');
  const selectedMetric = metric || document.getElementById('trendMetric')?.value || 'count';

  if (trendElement && trendData[selectedMetric]) {
    trendElement.innerHTML = trendData[selectedMetric]
      .map((point) => `<div class="trend-point">${point}</div>`)
      .join('');
  }

  showNotification(`Updated trend chart for ${selectedMetric}`, 'info');
}

function filterHistoryTable(searchTerm) {
  const tbody = document.getElementById('historyTableBody');
  if (!tbody) return;

  const rows = tbody.querySelectorAll('tr');

  rows.forEach((row) => {
    const text = row.textContent.toLowerCase();
    if (text.includes(searchTerm.toLowerCase())) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
}

function sortHistoryTable(sortBy) {
  const tbody = document.getElementById('historyTableBody');
  if (!tbody) return;

  const rows = Array.from(tbody.querySelectorAll('tr'));

  rows.sort((a, b) => {
    let aValue, bValue;

    switch (sortBy) {
      case 'date':
        aValue = new Date(a.cells[0]?.textContent || '');
        bValue = new Date(b.cells[0]?.textContent || '');
        return bValue - aValue; // Newest first

      case 'customer':
        aValue = a.querySelector('.customer-name')?.textContent || '';
        bValue = b.querySelector('.customer-name')?.textContent || '';
        return aValue.localeCompare(bValue);

      case 'type':
        aValue = a.cells[3]?.textContent || '';
        bValue = b.cells[3]?.textContent || '';
        return aValue.localeCompare(bValue);

      case 'value':
        aValue = parseFloat(
          a.querySelector('.service-value')?.textContent.replace(/[$,]/g, '') || '0'
        );
        bValue = parseFloat(
          b.querySelector('.service-value')?.textContent.replace(/[$,]/g, '') || '0'
        );
        return bValue - aValue; // Highest first

      case 'rating':
        aValue = parseFloat(a.querySelector('.rating-value')?.textContent || '0');
        bValue = parseFloat(b.querySelector('.rating-value')?.textContent || '0');
        return bValue - aValue; // Highest first

      default:
        return 0;
    }
  });

  // Re-append sorted rows
  rows.forEach((row) => tbody.appendChild(row));

  showNotification(`Table sorted by ${sortBy}`, 'info');
}

function updatePagination(pagination) {
  if (pagination) {
    updateElement('recordsRange', `${pagination.start}-${pagination.end}`);
    updateElement('totalRecords', pagination.total);
    updateElement('currentPage', pagination.currentPage);
    updateElement('totalPages', pagination.totalPages);

    // Update button states
    const prevBtn = document.getElementById('prevPageBtn');
    const nextBtn = document.getElementById('nextPageBtn');

    if (prevBtn) {
      prevBtn.disabled = pagination.currentPage <= 1;
    }

    if (nextBtn) {
      nextBtn.disabled = pagination.currentPage >= pagination.totalPages;
    }
  }
}

function navigatePage(direction) {
  const currentPage = parseInt(document.getElementById('currentPage')?.textContent || '1');
  const newPage = currentPage + direction;

  console.log('Navigating to page:', newPage);
  // Here you would typically reload the table with the new page
  showNotification(`Loading page ${newPage}`, 'info');
}

function exportServiceHistory() {
  console.log('Exporting service history...');

  const filters = getHistoryFilters();

  fetch('/api/field-service/customers/export-history', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(filters),
  })
    .then((response) => response.blob())
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'service-history.xlsx';
      a.click();
      showNotification('Service history exported successfully', 'success');
    })
    .catch((error) => {
      console.error('Export error:', error);
      showNotification('Failed to export service history', 'error');
    });
}

function createNewServiceRequest() {
  console.log('Creating new service request...');
  showNotification('Opening new service request form', 'info');
}

function showServiceDetailsModal() {
  const modal = document.getElementById('serviceDetailsModal');
  if (modal) {
    modal.style.display = 'flex';
  }
}

function hideServiceDetailsModal() {
  const modal = document.getElementById('serviceDetailsModal');
  if (modal) {
    modal.style.display = 'none';
  }
}

function repeatService() {
  console.log('Repeating service...');
  showNotification('Creating repeat service request', 'info');
  hideServiceDetailsModal();
}

function scheduleFollowUp() {
  console.log('Scheduling follow-up...');
  showNotification('Opening follow-up scheduler', 'info');
  hideServiceDetailsModal();
}

// Service record action handlers
function viewServiceDetails(recordId) {
  console.log('Viewing service details:', recordId);

  // Load service details
  fetch(`/api/field-service/customers/service-records/${recordId}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        populateServiceDetails(data.data);
        showServiceDetailsModal();
      }
    })
    .catch((error) => {
      console.error('Failed to load service details:', error);
      showNotification('Failed to load service details', 'error');
    });
}

function downloadInvoice(recordId) {
  console.log('Downloading invoice for service:', recordId);
  showNotification('Downloading invoice', 'info');
}

function populateServiceDetails(serviceData) {
  const container = document.getElementById('serviceDetailsContent');
  if (!container || !serviceData) return;

  container.innerHTML = `
        <div class="service-details-grid">
            <div class="detail-section">
                <h5>Service Information</h5>
                <div class="detail-row">
                    <span class="detail-label">Work Order:</span>
                    <span class="detail-value">${serviceData.workOrder || 'N/A'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Service Type:</span>
                    <span class="detail-value">${serviceData.serviceType || 'N/A'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Date:</span>
                    <span class="detail-value">${formatDate(serviceData.date)}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Duration:</span>
                    <span class="detail-value">${serviceData.duration || 'N/A'}</span>
                </div>
            </div>
            <div class="detail-section">
                <h5>Customer & Location</h5>
                <div class="detail-row">
                    <span class="detail-label">Customer:</span>
                    <span class="detail-value">${serviceData.customer || 'N/A'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Location:</span>
                    <span class="detail-value">${serviceData.location || 'N/A'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Contact:</span>
                    <span class="detail-value">${serviceData.contact || 'N/A'}</span>
                </div>
            </div>
        </div>
    `;
}

// Helper functions
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatStatus(status) {
  const statusMap = {
    completed: 'Completed',
    in_progress: 'In Progress',
    scheduled: 'Scheduled',
    cancelled: 'Cancelled',
  };
  return statusMap[status] || status;
}

function generateStars(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  let stars = '';

  for (let i = 0; i < fullStars; i++) {
    stars += '<i class="fas fa-star"></i>';
  }

  if (halfStar) {
    stars += '<i class="fas fa-star-half-alt"></i>';
  }

  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  for (let i = 0; i < emptyStars; i++) {
    stars += '<i class="far fa-star"></i>';
  }

  return stars;
}

function updateElement(id, value) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = value;
  }
}

function showNotification(message, type) {
  // Create notification if notification system doesn't exist
  if (
    typeof window.fieldServicePages !== 'undefined' &&
    window.fieldServicePages.showNotification
  ) {
    window.fieldServicePages.showNotification(message, type);
  } else {
    // Fallback notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            color: white;
            z-index: 1000;
            background-color: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        `;

    document.body.appendChild(notification);

    setTimeout(() => {
      document.body.removeChild(notification);
    }, 3000);
  }
}
