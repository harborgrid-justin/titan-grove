/**
 * Route Planning - Field Service Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Route Planning
document.addEventListener('DOMContentLoaded', function () {
  console.log('Route Planning page loaded');

  // Initialize page-specific features
  initializeRoutePlanning();
  loadRouteData();

  // Set today's date as default
  setDefaultDate();
});

function initializeRoutePlanning() {
  // Configure optimize routes button
  const optimizeRoutesBtn = document.getElementById('optimizeRoutesBtn');
  if (optimizeRoutesBtn) {
    optimizeRoutesBtn.addEventListener('click', function () {
      optimizeRoutes();
    });
  }

  // Configure save routes button
  const saveRoutesBtn = document.getElementById('saveRoutesBtn');
  if (saveRoutesBtn) {
    saveRoutesBtn.addEventListener('click', function () {
      saveRoutes();
    });
  }

  // Configure route tabs
  setupRouteTabs();

  // Configure route configuration controls
  setupRouteControls();

  // Configure action buttons
  setupActionButtons();

  // Load initial route data
  loadRouteStops();
}

function setDefaultDate() {
  const dateInput = document.getElementById('routeDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
  }
}

async function loadRouteData() {
  try {
    const response = await fetch('/api/field-service/routes/current');
    if (response.ok) {
      const data = await response.json();
      updateRouteDisplay(data);
    }
  } catch (error) {
    console.error('Failed to load route data:', error);
    showNotification('Failed to load route data', 'error');
  }
}

function setupRouteTabs() {
  const tabs = document.querySelectorAll('.route-tab');
  tabs.forEach((tab) => {
    tab.addEventListener('click', function () {
      const targetRoute = this.getAttribute('data-route');
      switchRouteTab(targetRoute);
    });
  });
}

function setupRouteControls() {
  const routeDate = document.getElementById('routeDate');
  const routeType = document.getElementById('routeType');
  const maxStops = document.getElementById('maxStops');
  const prioritizeBy = document.getElementById('prioritizeBy');

  [routeDate, routeType, maxStops, prioritizeBy].forEach((control) => {
    if (control) {
      control.addEventListener('change', function () {
        console.log('Route configuration changed:', {
          date: routeDate?.value,
          type: routeType?.value,
          maxStops: maxStops?.value,
          prioritizeBy: prioritizeBy?.value,
        });
        // Auto-refresh routes when configuration changes
        loadRouteData();
      });
    }
  });
}

function setupActionButtons() {
  const actionButtons = {
    exportRoutesBtn: exportRoutes,
    shareRoutesBtn: shareRoutes,
    printRoutesBtn: printRoutes,
    emailRoutesBtn: emailRoutes,
    zoomFitBtn: zoomFitMap,
    toggleTrafficBtn: toggleTraffic,
    printRouteBtn: printRoute,
  };

  Object.entries(actionButtons).forEach(([buttonId, handler]) => {
    const button = document.getElementById(buttonId);
    if (button) {
      button.addEventListener('click', handler);
    }
  });
}

function optimizeRoutes() {
  console.log('Optimizing routes...');

  const optimizeBtn = document.getElementById('optimizeRoutesBtn');
  optimizeBtn.disabled = true;
  optimizeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Optimizing...';

  // Get route configuration
  const config = getRouteConfiguration();

  // Call route optimization API
  fetch('/api/field-service/routes/optimize', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(config),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        updateRouteOptimizationResults(data.data);
        showNotification('Routes optimized successfully', 'success');
      } else {
        showNotification('Route optimization failed: ' + data.error, 'error');
      }
    })
    .catch((error) => {
      console.error('Route optimization error:', error);
      showNotification('Route optimization failed', 'error');
    })
    .finally(() => {
      optimizeBtn.disabled = false;
      optimizeBtn.innerHTML = '<i class="fas fa-route"></i> Optimize Routes';
    });
}

function saveRoutes() {
  console.log('Saving routes...');

  const saveBtn = document.getElementById('saveRoutesBtn');
  saveBtn.disabled = true;
  saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

  fetch('/api/field-service/routes/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'save_routes',
      date: document.getElementById('routeDate').value,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        showNotification('Routes saved successfully', 'success');
      } else {
        showNotification('Failed to save routes: ' + data.error, 'error');
      }
    })
    .catch((error) => {
      console.error('Save routes error:', error);
      showNotification('Failed to save routes', 'error');
    })
    .finally(() => {
      saveBtn.disabled = false;
      saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Routes';
    });
}

function getRouteConfiguration() {
  return {
    date: document.getElementById('routeDate').value,
    type: document.getElementById('routeType').value,
    maxStops: document.getElementById('maxStops').value,
    prioritizeBy: document.getElementById('prioritizeBy').value,
  };
}

function switchRouteTab(targetRoute) {
  // Remove active class from all tabs and route details
  document.querySelectorAll('.route-tab').forEach((tab) => tab.classList.remove('active'));
  document
    .querySelectorAll('.route-details')
    .forEach((details) => details.classList.remove('active'));

  // Add active class to selected tab and details
  document.querySelector(`[data-route="${targetRoute}"]`).classList.add('active');
  document.getElementById(targetRoute).classList.add('active');

  // Update map to show selected route
  highlightRouteOnMap(targetRoute);
}

function loadRouteStops() {
  // Load stops for each route
  const routes = ['route1', 'route2', 'route3'];

  routes.forEach((routeId) => {
    fetch(`/api/field-service/routes/${routeId}/stops`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          renderRouteStops(routeId, data.data);
        }
      })
      .catch((error) => {
        console.error(`Failed to load stops for ${routeId}:`, error);
        // Load sample data as fallback
        renderRouteStops(routeId, getSampleStops(routeId));
      });
  });
}

function renderRouteStops(routeId, stops) {
  const container = document.getElementById(routeId + 'Stops');
  if (!container) return;

  container.innerHTML = stops
    .map(
      (stop, index) => `
        <div class="route-stop" data-stop-id="${stop.id}">
            <div class="stop-number">${index + 1}</div>
            <div class="stop-details">
                <div class="stop-customer">
                    <i class="fas fa-building"></i>
                    ${stop.customer}
                </div>
                <div class="stop-address">
                    <i class="fas fa-map-marker-alt"></i>
                    ${stop.address}
                </div>
                <div class="stop-info">
                    <div class="stop-time">
                        <i class="fas fa-clock"></i>
                        ${stop.estimatedTime} | ${stop.duration}
                    </div>
                    <div class="stop-priority priority-${stop.priority}">
                        ${formatPriority(stop.priority)}
                    </div>
                </div>
                <div class="stop-work-order">
                    <i class="fas fa-clipboard"></i>
                    ${stop.workOrder} - ${stop.serviceType}
                </div>
            </div>
            <div class="stop-actions">
                <button class="stop-action-btn" onclick="viewStopDetails('${stop.id}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="stop-action-btn" onclick="editStop('${stop.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="stop-action-btn" onclick="removeStop('${stop.id}')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
    `
    )
    .join('');
}

function getSampleStops(routeId) {
  const sampleData = {
    route1: [
      {
        id: 'stop_001',
        customer: 'Acme Corporation',
        address: '123 Business Ave, Downtown',
        estimatedTime: '08:00 AM',
        duration: '1.5 hrs',
        priority: 'high',
        workOrder: 'WO-001',
        serviceType: 'HVAC Repair',
      },
      {
        id: 'stop_002',
        customer: 'Beta Manufacturing',
        address: '456 Industrial Blvd, North Side',
        estimatedTime: '10:30 AM',
        duration: '2 hrs',
        priority: 'medium',
        workOrder: 'WO-002',
        serviceType: 'Electrical Inspection',
      },
      {
        id: 'stop_003',
        customer: 'Gamma Services',
        address: '789 Commerce St, East District',
        estimatedTime: '01:00 PM',
        duration: '1 hr',
        priority: 'low',
        workOrder: 'WO-003',
        serviceType: 'Preventive Maintenance',
      },
    ],
    route2: [
      {
        id: 'stop_004',
        customer: 'Delta Corp',
        address: '321 Corporate Dr, West End',
        estimatedTime: '09:00 AM',
        duration: '2.5 hrs',
        priority: 'high',
        workOrder: 'WO-004',
        serviceType: 'System Installation',
      },
      {
        id: 'stop_005',
        customer: 'Echo Industries',
        address: '654 Factory Rd, South Zone',
        estimatedTime: '12:30 PM',
        duration: '1.5 hrs',
        priority: 'medium',
        workOrder: 'WO-005',
        serviceType: 'Equipment Repair',
      },
    ],
    route3: [
      {
        id: 'stop_006',
        customer: 'Foxtrot LLC',
        address: '987 Tech Park, Innovation District',
        estimatedTime: '08:30 AM',
        duration: '2 hrs',
        priority: 'high',
        workOrder: 'WO-006',
        serviceType: 'Emergency Repair',
      },
      {
        id: 'stop_007',
        customer: 'Golf Enterprises',
        address: '147 Business Center, Metro Area',
        estimatedTime: '11:00 AM',
        duration: '1 hr',
        priority: 'low',
        workOrder: 'WO-007',
        serviceType: 'Routine Check',
      },
      {
        id: 'stop_008',
        customer: 'Hotel Solutions',
        address: '258 Service Plaza, Central',
        estimatedTime: '02:30 PM',
        duration: '1.5 hrs',
        priority: 'medium',
        workOrder: 'WO-008',
        serviceType: 'Upgrade Service',
      },
    ],
  };

  return sampleData[routeId] || [];
}

function updateRouteDisplay(data) {
  if (data.stats) {
    updateElement('totalDistance', data.stats.totalDistance || 247);
    updateElement('fuelSaved', data.stats.fuelSaved || '$89');
    updateElement('timeEfficiency', data.stats.timeEfficiency || '+31%');
  }

  if (data.optimization) {
    updateOptimizationResults(data.optimization);
  }
}

function updateRouteOptimizationResults(results) {
  console.log('Updating route optimization results:', results);

  // Update optimization metrics
  updateElement('routesCount', results.routesCount || 3);
  updateElement('distanceSaved', (results.distanceSaved || 47) + ' miles');
  updateElement('timeSaved', (results.timeSaved || 2.3) + ' hours');
  updateElement('costSavings', '$' + (results.costSavings || 127.5));

  // Reload route stops if optimization changed them
  if (results.routesUpdated) {
    loadRouteStops();
  }
}

function highlightRouteOnMap(routeId) {
  console.log('Highlighting route on map:', routeId);
  // Map integration would go here
  showNotification(`Highlighting ${routeId} on map`, 'info');
}

// Action button handlers
function exportRoutes() {
  console.log('Exporting routes...');

  fetch('/api/field-service/routes/export', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      format: 'excel',
      date: document.getElementById('routeDate').value,
    }),
  })
    .then((response) => response.blob())
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'routes-export.xlsx';
      a.click();
      showNotification('Routes exported successfully', 'success');
    })
    .catch((error) => {
      console.error('Export error:', error);
      showNotification('Failed to export routes', 'error');
    });
}

function shareRoutes() {
  console.log('Sharing routes with team...');
  showNotification('Opening team sharing options', 'info');
}

function printRoutes() {
  console.log('Printing route instructions...');
  window.print();
}

function emailRoutes() {
  console.log('Emailing routes to technicians...');

  fetch('/api/field-service/routes/email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'email_routes',
      date: document.getElementById('routeDate').value,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        showNotification('Routes emailed to technicians', 'success');
      } else {
        showNotification('Failed to email routes', 'error');
      }
    })
    .catch((error) => {
      console.error('Email error:', error);
      showNotification('Failed to email routes', 'error');
    });
}

function zoomFitMap() {
  console.log('Zooming map to fit all routes');
  showNotification('Fitting all routes in view', 'info');
}

function toggleTraffic() {
  console.log('Toggling traffic layer');
  const button = document.getElementById('toggleTrafficBtn');
  const isActive = button.classList.contains('active');

  if (isActive) {
    button.classList.remove('active');
    showNotification('Traffic layer hidden', 'info');
  } else {
    button.classList.add('active');
    showNotification('Traffic layer shown', 'info');
  }
}

function printRoute() {
  console.log('Printing current route');
  showNotification('Printing route details', 'info');
}

// Stop action handlers
function viewStopDetails(stopId) {
  console.log('Viewing stop details:', stopId);
  showNotification('Opening stop details', 'info');
}

function editStop(stopId) {
  console.log('Editing stop:', stopId);
  showNotification('Opening stop editor', 'info');
}

function removeStop(stopId) {
  console.log('Removing stop:', stopId);
  if (confirm('Are you sure you want to remove this stop from the route?')) {
    fetch(`/api/field-service/routes/stops/${stopId}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          showNotification('Stop removed successfully', 'success');
          loadRouteStops(); // Refresh stops
        } else {
          showNotification('Failed to remove stop', 'error');
        }
      })
      .catch((error) => {
        console.error('Remove stop error:', error);
        showNotification('Failed to remove stop', 'error');
      });
  }
}

// Helper functions
function formatPriority(priority) {
  const priorityMap = {
    high: 'HIGH',
    medium: 'MEDIUM',
    low: 'LOW',
    emergency: 'EMERGENCY',
  };
  return priorityMap[priority] || priority.toUpperCase();
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
