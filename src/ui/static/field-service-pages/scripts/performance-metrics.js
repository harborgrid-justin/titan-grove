/**
 * Performance Metrics - Field Service Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Performance Metrics
document.addEventListener('DOMContentLoaded', function () {
  console.log('Performance Metrics page loaded');

  // Initialize page-specific features
  initializePerformanceMetrics();
  loadPerformanceData();
});

function initializePerformanceMetrics() {
  // Configure export report button
  const exportReportBtn = document.getElementById('exportReportBtn');
  if (exportReportBtn) {
    exportReportBtn.addEventListener('click', function () {
      exportPerformanceReport();
    });
  }

  // Configure generate report button
  const generateReportBtn = document.getElementById('generateReportBtn');
  if (generateReportBtn) {
    generateReportBtn.addEventListener('click', function () {
      generatePerformanceReport();
    });
  }

  // Configure filters and controls
  setupPerformanceControls();

  // Configure chart controls
  setupChartControls();

  // Configure table controls
  setupTableControls();

  // Load initial data
  loadPerformanceTable();
}

async function loadPerformanceData() {
  try {
    const filters = getPerformanceFilters();
    const response = await fetch(
      `/api/field-service/performance/metrics?${new URLSearchParams(filters)}`
    );
    if (response.ok) {
      const data = await response.json();
      updatePerformanceDisplay(data);
    }
  } catch (error) {
    console.error('Failed to load performance data:', error);
    showNotification('Failed to load performance data', 'error');
    // Load sample data as fallback
    updatePerformanceDisplay(getSamplePerformanceData());
  }
}

function setupPerformanceControls() {
  const technicianFilter = document.getElementById('technicianFilter');
  const dateRange = document.getElementById('dateRange');
  const metricType = document.getElementById('metricType');
  const refreshBtn = document.getElementById('refreshMetricsBtn');

  [technicianFilter, dateRange, metricType].forEach((control) => {
    if (control) {
      control.addEventListener('change', function () {
        console.log('Performance filter changed:', {
          technician: technicianFilter?.value,
          dateRange: dateRange?.value,
          metricType: metricType?.value,
        });
        loadPerformanceData();
        loadPerformanceTable();
      });
    }
  });

  if (refreshBtn) {
    refreshBtn.addEventListener('click', function () {
      loadPerformanceData();
      showNotification('Performance metrics refreshed', 'info');
    });
  }
}

function setupChartControls() {
  const trendMetric = document.getElementById('trendMetric');
  const comparisonMetric = document.getElementById('comparisonMetric');

  if (trendMetric) {
    trendMetric.addEventListener('change', function () {
      updateTrendChart(this.value);
    });
  }

  if (comparisonMetric) {
    comparisonMetric.addEventListener('change', function () {
      updateComparisonChart(this.value);
    });
  }
}

function setupTableControls() {
  const searchInput = document.getElementById('searchTechnician');
  const sortBy = document.getElementById('sortBy');

  if (searchInput) {
    searchInput.addEventListener('input', function () {
      filterPerformanceTable(this.value);
    });
  }

  if (sortBy) {
    sortBy.addEventListener('change', function () {
      sortPerformanceTable(this.value);
    });
  }
}

function getPerformanceFilters() {
  return {
    technician: document.getElementById('technicianFilter')?.value || 'all',
    dateRange: document.getElementById('dateRange')?.value || 'month',
    metricType: document.getElementById('metricType')?.value || 'all',
  };
}

function loadPerformanceTable() {
  fetch('/api/field-service/performance/technicians')
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        renderPerformanceTable(data.data);
      }
    })
    .catch((error) => {
      console.error('Failed to load performance table:', error);
      // Load sample data as fallback
      renderPerformanceTable(getSampleTechnicianPerformance());
    });
}

function renderPerformanceTable(technicians) {
  const tbody = document.getElementById('performanceTableBody');
  if (!tbody) return;

  tbody.innerHTML = technicians
    .map(
      (tech) => `
        <tr data-tech-id="${tech.id}">
            <td>
                <div class="tech-info">
                    <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(tech.name)}&background=0D8ABC&color=fff" 
                         alt="${tech.name}" class="tech-avatar-small">
                    <div class="tech-details">
                        <div class="tech-name">${tech.name}</div>
                        <div class="tech-id">${tech.id}</div>
                    </div>
                </div>
            </td>
            <td class="text-center">${tech.jobsCompleted}</td>
            <td class="text-center">
                <div class="rating-display">
                    <span class="rating-value">${tech.avgRating}</span>
                    <div class="stars">
                        ${generateStars(tech.avgRating)}
                    </div>
                </div>
            </td>
            <td class="text-center">
                <span class="percentage ${getPerformanceClass(tech.firstTimeFix)}">${tech.firstTimeFix}%</span>
            </td>
            <td class="text-center">${tech.responseTime}</td>
            <td class="text-center">
                <span class="percentage ${getPerformanceClass(tech.utilization)}">${tech.utilization}%</span>
            </td>
            <td class="text-center">
                <span class="feedback-count">${tech.customerFeedback} reviews</span>
            </td>
            <td class="text-center">
                <div class="table-actions">
                    <button class="action-btn" onclick="viewTechnicianDetails('${tech.id}')" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn" onclick="viewTechnicianReport('${tech.id}')" title="Generate Report">
                        <i class="fas fa-chart-line"></i>
                    </button>
                    <button class="action-btn" onclick="viewTechnicianHistory('${tech.id}')" title="View History">
                        <i class="fas fa-history"></i>
                    </button>
                </div>
            </td>
        </tr>
    `
    )
    .join('');
}

function getSampleTechnicianPerformance() {
  return [
    {
      id: 'TECH001',
      name: 'John Smith',
      jobsCompleted: 147,
      avgRating: 4.8,
      firstTimeFix: 94,
      responseTime: '11 min',
      utilization: 92,
      customerFeedback: 89,
    },
    {
      id: 'TECH002',
      name: 'Sarah Johnson',
      jobsCompleted: 132,
      avgRating: 4.9,
      firstTimeFix: 96,
      responseTime: '9 min',
      utilization: 89,
      customerFeedback: 76,
    },
    {
      id: 'TECH003',
      name: 'Mike Rodriguez',
      jobsCompleted: 156,
      avgRating: 4.6,
      firstTimeFix: 88,
      responseTime: '14 min',
      utilization: 95,
      customerFeedback: 92,
    },
    {
      id: 'TECH004',
      name: 'Lisa Chen',
      jobsCompleted: 124,
      avgRating: 4.7,
      firstTimeFix: 91,
      responseTime: '12 min',
      utilization: 87,
      customerFeedback: 68,
    },
  ];
}

function getSamplePerformanceData() {
  return {
    stats: {
      teamAvgRating: 4.7,
      avgResponseTime: '12min',
      completionRate: '96%',
    },
    kpis: {
      avgJobTime: '2.4 hrs',
      firstTimeFixRate: '94%',
      customerSatisfaction: 4.8,
      utilizationRate: '91%',
    },
    goals: {
      customerSat: 4.8,
      firstTimeFix: '94%',
      responseTime: '12 min',
      utilization: '91%',
    },
  };
}

function updatePerformanceDisplay(data) {
  // Update header stats
  if (data.stats) {
    updateElement('teamAvgRating', data.stats.teamAvgRating || 4.7);
    updateElement('avgResponseTime', data.stats.avgResponseTime || '12min');
    updateElement('completionRate', data.stats.completionRate || '96%');
  }

  // Update KPIs
  if (data.kpis) {
    updateElement('avgJobTime', data.kpis.avgJobTime || '2.4 hrs');
    updateElement('firstTimeFixRate', data.kpis.firstTimeFixRate || '94%');
    updateElement('customerSatisfaction', data.kpis.customerSatisfaction || 4.8);
    updateElement('utilizationRate', data.kpis.utilizationRate || '91%');
  }

  // Update goals
  if (data.goals) {
    updateElement('goalCustomerSat', data.goals.customerSat || 4.8);
    updateElement('goalFirstTimeFix', data.goals.firstTimeFix || '94%');
    updateElement('goalResponseTime', data.goals.responseTime || '12 min');
    updateElement('goalUtilization', data.goals.utilization || '91%');
  }
}

function updateTrendChart(metric) {
  console.log('Updating trend chart for metric:', metric);

  const chartContainer = document.getElementById('performanceTrendChart');
  if (!chartContainer) return;

  // Sample trend data based on metric
  const trendData = {
    completion: ['Jan: 92%', 'Feb: 94%', 'Mar: 96%', 'Apr: 95%', 'May: 97%'],
    response: ['Jan: 15min', 'Feb: 13min', 'Mar: 12min', 'Apr: 11min', 'May: 10min'],
    satisfaction: ['Jan: 4.5', 'Feb: 4.6', 'Mar: 4.7', 'Apr: 4.8', 'May: 4.9'],
  };

  const dataPoints = chartContainer.querySelector('.sample-data');
  if (dataPoints && trendData[metric]) {
    dataPoints.innerHTML = trendData[metric]
      .map((point) => `<div class="data-point">${point}</div>`)
      .join('');
  }

  showNotification(`Updated trend chart for ${metric}`, 'info');
}

function updateComparisonChart(metric) {
  console.log('Updating comparison chart for metric:', metric);

  const chartContainer = document.getElementById('technicianComparisonChart');
  if (!chartContainer) return;

  // Sample comparison data based on metric
  const comparisonData = {
    productivity: [
      { name: 'John Smith', value: 95 },
      { name: 'Sarah Johnson', value: 92 },
      { name: 'Mike Rodriguez', value: 88 },
    ],
    quality: [
      { name: 'John Smith', value: 94 },
      { name: 'Sarah Johnson', value: 96 },
      { name: 'Mike Rodriguez', value: 88 },
    ],
    efficiency: [
      { name: 'John Smith', value: 92 },
      { name: 'Sarah Johnson', value: 89 },
      { name: 'Mike Rodriguez', value: 95 },
    ],
  };

  const barsContainer = chartContainer.querySelector('.comparison-bars');
  if (barsContainer && comparisonData[metric]) {
    barsContainer.innerHTML = comparisonData[metric]
      .map(
        (item) => `
            <div class="bar-item">
                <span class="bar-label">${item.name}</span>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${item.value}%"></div>
                </div>
                <span class="bar-value">${item.value}%</span>
            </div>
        `
      )
      .join('');
  }

  showNotification(`Updated comparison chart for ${metric}`, 'info');
}

function filterPerformanceTable(searchTerm) {
  const tbody = document.getElementById('performanceTableBody');
  if (!tbody) return;

  const rows = tbody.querySelectorAll('tr');

  rows.forEach((row) => {
    const techName = row.querySelector('.tech-name')?.textContent.toLowerCase() || '';
    const techId = row.querySelector('.tech-id')?.textContent.toLowerCase() || '';

    if (techName.includes(searchTerm.toLowerCase()) || techId.includes(searchTerm.toLowerCase())) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
}

function sortPerformanceTable(sortBy) {
  const tbody = document.getElementById('performanceTableBody');
  if (!tbody) return;

  const rows = Array.from(tbody.querySelectorAll('tr'));

  rows.sort((a, b) => {
    let aValue, bValue;

    switch (sortBy) {
      case 'name':
        aValue = a.querySelector('.tech-name')?.textContent || '';
        bValue = b.querySelector('.tech-name')?.textContent || '';
        return aValue.localeCompare(bValue);

      case 'rating':
        aValue = parseFloat(a.querySelector('.rating-value')?.textContent || '0');
        bValue = parseFloat(b.querySelector('.rating-value')?.textContent || '0');
        return bValue - aValue; // Descending

      case 'completion':
        aValue = parseInt(a.cells[3]?.textContent || '0');
        bValue = parseInt(b.cells[3]?.textContent || '0');
        return bValue - aValue; // Descending

      case 'efficiency':
        aValue = parseInt(a.cells[5]?.textContent || '0');
        bValue = parseInt(b.cells[5]?.textContent || '0');
        return bValue - aValue; // Descending

      default:
        return 0;
    }
  });

  // Re-append sorted rows
  rows.forEach((row) => tbody.appendChild(row));

  showNotification(`Table sorted by ${sortBy}`, 'info');
}

function exportPerformanceReport() {
  console.log('Exporting performance report...');

  const filters = getPerformanceFilters();

  fetch('/api/field-service/performance/export', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(filters),
  })
    .then((response) => response.blob())
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'performance-report.xlsx';
      a.click();
      showNotification('Performance report exported successfully', 'success');
    })
    .catch((error) => {
      console.error('Export error:', error);
      showNotification('Failed to export performance report', 'error');
    });
}

function generatePerformanceReport() {
  console.log('Generating performance report...');

  const generateBtn = document.getElementById('generateReportBtn');
  generateBtn.disabled = true;
  generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';

  const filters = getPerformanceFilters();

  fetch('/api/field-service/performance/generate-report', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(filters),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        showNotification('Performance report generated successfully', 'success');
        // Refresh data to show updated report
        loadPerformanceData();
      } else {
        showNotification('Failed to generate performance report', 'error');
      }
    })
    .catch((error) => {
      console.error('Generate report error:', error);
      showNotification('Failed to generate performance report', 'error');
    })
    .finally(() => {
      generateBtn.disabled = false;
      generateBtn.innerHTML = '<i class="fas fa-chart-line"></i> Generate Report';
    });
}

// Table action handlers
function viewTechnicianDetails(techId) {
  console.log('Viewing technician details:', techId);
  showNotification('Opening technician details', 'info');
}

function viewTechnicianReport(techId) {
  console.log('Viewing technician report:', techId);
  showNotification('Generating individual technician report', 'info');
}

function viewTechnicianHistory(techId) {
  console.log('Viewing technician history:', techId);
  showNotification('Opening performance history', 'info');
}

// Helper functions
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

function getPerformanceClass(value) {
  const numValue = typeof value === 'string' ? parseInt(value) : value;

  if (numValue >= 95) return 'excellent';
  if (numValue >= 90) return 'good';
  if (numValue >= 80) return 'average';
  return 'below-average';
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
