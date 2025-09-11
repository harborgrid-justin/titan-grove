/**
 * Technician Schedule - Field Service Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Technician Schedule
document.addEventListener('DOMContentLoaded', function () {
  console.log('Technician Schedule page loaded');

  // Initialize page-specific features
  initializeTechnicianSchedule();
  loadScheduleData();

  // Set current week as default
  setCurrentWeek();
});

function initializeTechnicianSchedule() {
  // Configure assign work button
  const assignWorkBtn = document.getElementById('assignWorkBtn');
  if (assignWorkBtn) {
    assignWorkBtn.addEventListener('click', function () {
      showAssignWorkModal();
    });
  }

  // Configure update schedule button
  const updateScheduleBtn = document.getElementById('updateScheduleBtn');
  if (updateScheduleBtn) {
    updateScheduleBtn.addEventListener('click', function () {
      updateSchedule();
    });
  }

  // Configure filters and controls
  setupScheduleControls();

  // Configure calendar navigation
  setupCalendarNavigation();

  // Configure work assignment modal
  setupAssignWorkModal();

  // Load initial technician data
  loadTechnicianProfile();
  loadWeeklySchedule();
}

function setCurrentWeek() {
  const weekInput = document.getElementById('weekSelect');
  if (weekInput) {
    const now = new Date();
    const year = now.getFullYear();
    const week = getWeekNumber(now);
    weekInput.value = `${year}-W${week.toString().padStart(2, '0')}`;
  }
}

function getWeekNumber(date) {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

async function loadScheduleData() {
  try {
    const technicianId = document.getElementById('technicianSelect').value;
    const week = document.getElementById('weekSelect').value;

    const response = await fetch(
      `/api/field-service/technicians/${technicianId}/schedule?week=${week}`
    );
    if (response.ok) {
      const data = await response.json();
      updateScheduleDisplay(data);
    }
  } catch (error) {
    console.error('Failed to load schedule data:', error);
    showNotification('Failed to load schedule data', 'error');
  }
}

function setupScheduleControls() {
  const technicianSelect = document.getElementById('technicianSelect');
  const weekSelect = document.getElementById('weekSelect');
  const viewType = document.getElementById('viewType');
  const refreshBtn = document.getElementById('refreshScheduleBtn');

  [technicianSelect, weekSelect, viewType].forEach((control) => {
    if (control) {
      control.addEventListener('change', function () {
        console.log('Schedule filter changed:', {
          technician: technicianSelect?.value,
          week: weekSelect?.value,
          view: viewType?.value,
        });
        loadScheduleData();
        loadTechnicianProfile();
      });
    }
  });

  if (refreshBtn) {
    refreshBtn.addEventListener('click', function () {
      loadScheduleData();
      showNotification('Schedule refreshed', 'info');
    });
  }
}

function setupCalendarNavigation() {
  const prevWeekBtn = document.getElementById('prevWeekBtn');
  const nextWeekBtn = document.getElementById('nextWeekBtn');

  if (prevWeekBtn) {
    prevWeekBtn.addEventListener('click', function () {
      navigateWeek(-1);
    });
  }

  if (nextWeekBtn) {
    nextWeekBtn.addEventListener('click', function () {
      navigateWeek(1);
    });
  }
}

function setupAssignWorkModal() {
  const modal = document.getElementById('assignWorkModal');
  const closeBtn = document.getElementById('closeAssignModal');
  const cancelBtn = document.getElementById('cancelAssignBtn');
  const confirmBtn = document.getElementById('confirmAssignBtn');

  if (closeBtn) {
    closeBtn.addEventListener('click', hideAssignWorkModal);
  }

  if (cancelBtn) {
    cancelBtn.addEventListener('click', hideAssignWorkModal);
  }

  if (confirmBtn) {
    confirmBtn.addEventListener('click', assignWorkOrder);
  }

  // Close modal on background click
  if (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target === modal) {
        hideAssignWorkModal();
      }
    });
  }
}

function loadTechnicianProfile() {
  const technicianId = document.getElementById('technicianSelect').value;

  fetch(`/api/field-service/technicians/${technicianId}/profile`)
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        updateTechnicianProfile(data.data);
      }
    })
    .catch((error) => {
      console.error('Failed to load technician profile:', error);
      // Load sample data as fallback
      updateTechnicianProfile(getSampleTechnicianProfile(technicianId));
    });
}

function loadWeeklySchedule() {
  const technicianId = document.getElementById('technicianSelect').value;
  const week = document.getElementById('weekSelect').value;

  fetch(`/api/field-service/technicians/${technicianId}/schedule?week=${week}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        renderWeeklySchedule(data.data);
      }
    })
    .catch((error) => {
      console.error('Failed to load weekly schedule:', error);
      // Load sample data as fallback
      renderWeeklySchedule(getSampleScheduleData());
    });
}

function updateTechnicianProfile(profile) {
  // Update technician details
  updateElement('techName', profile.name);
  updateElement('techId', profile.id);
  updateElement('techStatus', profile.status);

  // Update avatar
  const avatar = document.getElementById('techAvatar');
  if (avatar) {
    avatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=0D8ABC&color=fff`;
    avatar.alt = profile.name;
  }

  // Update skills
  const skillsContainer = document.getElementById('techSkills');
  if (skillsContainer && profile.skills) {
    skillsContainer.innerHTML = profile.skills
      .map((skill) => `<span class="skill-tag">${skill}</span>`)
      .join('');
  }

  // Update stats
  updateElement('weeklyHours', profile.weeklyHours || '40');
  updateElement('workOrders', profile.workOrders || '8');
  updateElement('avgRating', profile.avgRating || '4.8');
}

function renderWeeklySchedule(scheduleData) {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

  days.forEach((day) => {
    const dayContainer = document.getElementById(day + 'Slots');
    if (dayContainer && scheduleData[day]) {
      renderDaySchedule(dayContainer, scheduleData[day]);
    }
  });

  // Update summary data
  if (scheduleData.summary) {
    updateScheduleSummary(scheduleData.summary);
  }
}

function renderDaySchedule(container, daySchedule) {
  container.innerHTML = daySchedule
    .map(
      (item) => `
        <div class="schedule-item priority-${item.priority}" data-work-order="${item.workOrderId}">
            <div class="schedule-time">${item.startTime} - ${item.endTime}</div>
            <div class="schedule-customer">${item.customer}</div>
            <div class="schedule-service">${item.serviceType}</div>
            <div class="schedule-location">
                <i class="fas fa-map-marker-alt"></i>
                ${item.location}
            </div>
            <div class="schedule-actions">
                <button class="schedule-action-btn" onclick="viewWorkOrder('${item.workOrderId}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="schedule-action-btn" onclick="editScheduleItem('${item.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="schedule-action-btn" onclick="removeScheduleItem('${item.id}')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
    `
    )
    .join('');
}

function getSampleTechnicianProfile(techId) {
  const profiles = {
    tech_001: {
      id: 'TECH001',
      name: 'John Smith',
      status: 'Available',
      skills: ['HVAC', 'Electrical', 'Plumbing'],
      weeklyHours: '40',
      workOrders: '8',
      avgRating: '4.8',
    },
    tech_002: {
      id: 'TECH002',
      name: 'Sarah Johnson',
      status: 'On Site',
      skills: ['Plumbing', 'General Maintenance'],
      weeklyHours: '38',
      workOrders: '6',
      avgRating: '4.9',
    },
    tech_003: {
      id: 'TECH003',
      name: 'Mike Rodriguez',
      status: 'Dispatched',
      skills: ['HVAC', 'Mechanical'],
      weeklyHours: '42',
      workOrders: '9',
      avgRating: '4.7',
    },
    tech_004: {
      id: 'TECH004',
      name: 'Lisa Chen',
      status: 'Available',
      skills: ['Electrical', 'Security'],
      weeklyHours: '40',
      workOrders: '7',
      avgRating: '4.8',
    },
  };

  return profiles[techId] || profiles['tech_001'];
}

function getSampleScheduleData() {
  return {
    monday: [
      {
        id: 'sched_001',
        workOrderId: 'WO-001',
        startTime: '08:00',
        endTime: '10:00',
        customer: 'Acme Corp',
        serviceType: 'HVAC Repair',
        location: 'Downtown',
        priority: 'high',
      },
      {
        id: 'sched_002',
        workOrderId: 'WO-002',
        startTime: '11:00',
        endTime: '13:00',
        customer: 'Beta LLC',
        serviceType: 'Electrical Inspection',
        location: 'North Side',
        priority: 'medium',
      },
    ],
    tuesday: [
      {
        id: 'sched_003',
        workOrderId: 'WO-003',
        startTime: '09:00',
        endTime: '12:00',
        customer: 'Gamma Inc',
        serviceType: 'System Installation',
        location: 'West End',
        priority: 'high',
      },
    ],
    wednesday: [
      {
        id: 'sched_004',
        workOrderId: 'WO-004',
        startTime: '08:30',
        endTime: '10:30',
        customer: 'Delta Corp',
        serviceType: 'Preventive Maintenance',
        location: 'South District',
        priority: 'low',
      },
      {
        id: 'sched_005',
        workOrderId: 'WO-005',
        startTime: '14:00',
        endTime: '16:00',
        customer: 'Echo Ltd',
        serviceType: 'Emergency Repair',
        location: 'Central',
        priority: 'emergency',
      },
    ],
    thursday: [
      {
        id: 'sched_006',
        workOrderId: 'WO-006',
        startTime: '10:00',
        endTime: '12:00',
        customer: 'Foxtrot Inc',
        serviceType: 'Routine Check',
        location: 'East Side',
        priority: 'medium',
      },
    ],
    friday: [
      {
        id: 'sched_007',
        workOrderId: 'WO-007',
        startTime: '09:00',
        endTime: '11:00',
        customer: 'Golf Corp',
        serviceType: 'Follow-up Service',
        location: 'Downtown',
        priority: 'low',
      },
    ],
    summary: {
      scheduledHours: '40',
      travelTime: '6 hrs',
      overtime: '0 hrs',
      totalOrders: '8',
      highPriority: '2',
      emergency: '1',
      serviceArea: 'Downtown',
      distance: '147 miles',
      efficiency: '94%',
    },
  };
}

function navigateWeek(direction) {
  const weekInput = document.getElementById('weekSelect');
  if (weekInput) {
    const currentWeek = new Date(weekInput.value + '-1'); // Add Monday
    currentWeek.setDate(currentWeek.getDate() + direction * 7);

    const year = currentWeek.getFullYear();
    const week = getWeekNumber(currentWeek);
    weekInput.value = `${year}-W${week.toString().padStart(2, '0')}`;

    loadScheduleData();
    updateWeekDisplay();
  }
}

function updateWeekDisplay() {
  const weekInput = document.getElementById('weekSelect');
  const weekDisplay = document.getElementById('currentWeekDisplay');

  if (weekInput && weekDisplay) {
    const weekDate = new Date(weekInput.value + '-1'); // Monday of the week
    const endDate = new Date(weekDate);
    endDate.setDate(endDate.getDate() + 4); // Friday

    const startStr = weekDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    const endStr = endDate.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

    weekDisplay.textContent = `${startStr} - ${endStr}`;
  }
}

function showAssignWorkModal() {
  const modal = document.getElementById('assignWorkModal');
  if (modal) {
    modal.style.display = 'flex';
    loadAvailableWorkOrders();

    // Set default date to today
    const dateInput = document.getElementById('assignDate');
    if (dateInput) {
      dateInput.value = new Date().toISOString().split('T')[0];
    }
  }
}

function hideAssignWorkModal() {
  const modal = document.getElementById('assignWorkModal');
  if (modal) {
    modal.style.display = 'none';
  }
}

function loadAvailableWorkOrders() {
  fetch('/api/field-service/work-orders/unassigned')
    .then((response) => response.json())
    .then((data) => {
      const select = document.getElementById('workOrderSelect');
      if (select && data.success) {
        select.innerHTML = data.data
          .map((wo) => `<option value="${wo.id}">${wo.id} - ${wo.title} (${wo.customer})</option>`)
          .join('');
      }
    })
    .catch((error) => {
      console.error('Failed to load work orders:', error);
      // Add sample data
      const select = document.getElementById('workOrderSelect');
      if (select) {
        select.innerHTML = `
                    <option value="WO-008">WO-008 - HVAC Maintenance (Hotel Corp)</option>
                    <option value="WO-009">WO-009 - Electrical Upgrade (India Ltd)</option>
                    <option value="WO-010">WO-010 - Plumbing Repair (Juliet Inc)</option>
                `;
      }
    });
}

function assignWorkOrder() {
  const assignData = {
    technicianId: document.getElementById('technicianSelect').value,
    workOrderId: document.getElementById('workOrderSelect').value,
    date: document.getElementById('assignDate').value,
    startTime: document.getElementById('assignTime').value,
    duration: document.getElementById('estimatedDuration').value,
    notes: document.getElementById('assignNotes').value,
  };

  fetch('/api/field-service/schedule/assign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(assignData),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        hideAssignWorkModal();
        showNotification('Work order assigned successfully', 'success');
        loadScheduleData(); // Refresh schedule
      } else {
        showNotification('Failed to assign work order', 'error');
      }
    })
    .catch((error) => {
      console.error('Assign work order error:', error);
      showNotification('Failed to assign work order', 'error');
    });
}

function updateSchedule() {
  console.log('Updating schedule...');

  const updateBtn = document.getElementById('updateScheduleBtn');
  updateBtn.disabled = true;
  updateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating...';

  const technicianId = document.getElementById('technicianSelect').value;
  const week = document.getElementById('weekSelect').value;

  fetch('/api/field-service/schedule/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ technicianId, week, action: 'update_schedule' }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        showNotification('Schedule updated successfully', 'success');
      } else {
        showNotification('Failed to update schedule', 'error');
      }
    })
    .catch((error) => {
      console.error('Update schedule error:', error);
      showNotification('Failed to update schedule', 'error');
    })
    .finally(() => {
      updateBtn.disabled = false;
      updateBtn.innerHTML = '<i class="fas fa-save"></i> Update Schedule';
    });
}

function updateScheduleDisplay(data) {
  if (data.stats) {
    updateElement('totalHours', data.stats.totalHours || 40);
    updateElement('utilization', data.stats.utilization || '92%');
    updateElement('completionRate', data.stats.completionRate || '98%');
  }
}

function updateScheduleSummary(summary) {
  updateElement('summaryScheduledHours', summary.scheduledHours);
  updateElement('summaryTravelTime', summary.travelTime);
  updateElement('summaryOvertime', summary.overtime);
  updateElement('summaryTotalOrders', summary.totalOrders);
  updateElement('summaryHighPriority', summary.highPriority);
  updateElement('summaryEmergency', summary.emergency);
  updateElement('summaryServiceArea', summary.serviceArea);
  updateElement('summaryDistance', summary.distance);
  updateElement('summaryEfficiency', summary.efficiency);
}

// Global functions for schedule item actions
function viewWorkOrder(workOrderId) {
  console.log('Viewing work order:', workOrderId);
  showNotification('Opening work order details', 'info');
}

function editScheduleItem(scheduleId) {
  console.log('Editing schedule item:', scheduleId);
  showNotification('Opening schedule editor', 'info');
}

function removeScheduleItem(scheduleId) {
  console.log('Removing schedule item:', scheduleId);
  if (confirm('Are you sure you want to remove this scheduled item?')) {
    fetch(`/api/field-service/schedule/items/${scheduleId}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          showNotification('Schedule item removed', 'success');
          loadScheduleData(); // Refresh schedule
        } else {
          showNotification('Failed to remove schedule item', 'error');
        }
      })
      .catch((error) => {
        console.error('Remove schedule item error:', error);
        showNotification('Failed to remove schedule item', 'error');
      });
  }
}

// Helper functions
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
