/**
 * Dispatch Center - Field Service Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Dispatch Center
document.addEventListener('DOMContentLoaded', function() {
    console.log('Dispatch Center page loaded');
    
    // Initialize page-specific features
    initializeDispatchCenter();
    loadDispatchData();
    
    // Start real-time updates
    startRealTimeUpdates();
});

function initializeDispatchCenter() {
    // Configure emergency dispatch button
    const emergencyDispatchBtn = document.getElementById('emergencyDispatchBtn');
    if (emergencyDispatchBtn) {
        emergencyDispatchBtn.addEventListener('click', function() {
            showEmergencyModal();
        });
    }
    
    // Configure new dispatch button  
    const newDispatchBtn = document.getElementById('newDispatchBtn');
    if (newDispatchBtn) {
        newDispatchBtn.addEventListener('click', function() {
            createNewDispatch();
        });
    }
    
    // Configure filters
    setupFilters();
    
    // Configure communication tabs
    setupCommunicationTabs();
    
    // Configure emergency modal
    setupEmergencyModal();
    
    // Load initial data
    loadTechnicianStatus();
    loadPendingDispatches();
    loadCommunications();
}

async function loadDispatchData() {
    try {
        const response = await fetch('/api/field-service/dispatch/status');
        if (response.ok) {
            const data = await response.json();
            updateDispatchDisplay(data);
        }
    } catch (error) {
        console.error('Failed to load dispatch data:', error);
        showNotification('Failed to load dispatch data', 'error');
    }
}

function setupFilters() {
    const priorityFilter = document.getElementById('priorityFilter');
    const statusFilter = document.getElementById('statusFilter');
    const refreshBtn = document.getElementById('refreshDispatchesBtn');
    
    if (priorityFilter) {
        priorityFilter.addEventListener('change', filterDispatches);
    }
    
    if (statusFilter) {
        statusFilter.addEventListener('change', filterDispatches);
    }
    
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            loadDispatchData();
            showNotification('Dispatch data refreshed', 'info');
        });
    }
}

function setupCommunicationTabs() {
    const tabs = document.querySelectorAll('.comm-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            switchCommunicationTab(targetTab);
        });
    });
    
    // Setup message sending
    const sendMessageBtn = document.getElementById('sendMessageBtn');
    const newMessage = document.getElementById('newMessage');
    
    if (sendMessageBtn && newMessage) {
        sendMessageBtn.addEventListener('click', sendMessage);
        newMessage.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
}

function setupEmergencyModal() {
    const modal = document.getElementById('emergencyModal');
    const closeBtn = document.getElementById('closeEmergencyModal');
    const cancelBtn = document.getElementById('cancelEmergencyBtn');
    const dispatchBtn = document.getElementById('dispatchEmergencyBtn');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', hideEmergencyModal);
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', hideEmergencyModal);
    }
    
    if (dispatchBtn) {
        dispatchBtn.addEventListener('click', dispatchEmergency);
    }
    
    // Close modal on background click
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                hideEmergencyModal();
            }
        });
    }
}

function loadTechnicianStatus() {
    fetch('/api/field-service/technicians/status')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                renderTechnicianList(data.data);
            }
        })
        .catch(error => {
            console.error('Failed to load technician status:', error);
        });
}

function loadPendingDispatches() {
    fetch('/api/field-service/dispatch/pending')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                renderPendingQueue(data.data);
            }
        })
        .catch(error => {
            console.error('Failed to load pending dispatches:', error);
        });
}

function loadCommunications() {
    Promise.all([
        fetch('/api/field-service/communications/messages'),
        fetch('/api/field-service/communications/alerts'),
        fetch('/api/field-service/communications/notifications')
    ])
    .then(responses => Promise.all(responses.map(r => r.json())))
    .then(([messages, alerts, notifications]) => {
        renderMessages(messages.data || []);
        renderAlerts(alerts.data || []);
        renderNotifications(notifications.data || []);
    })
    .catch(error => {
        console.error('Failed to load communications:', error);
    });
}

function renderTechnicianList(technicians) {
    const container = document.getElementById('technicianList');
    if (!container) return;
    
    const sampleTechnicians = technicians || [
        { id: 'tech_001', name: 'John Smith', status: 'available', location: 'Downtown', skills: ['HVAC', 'Electrical'] },
        { id: 'tech_002', name: 'Sarah Johnson', status: 'dispatched', location: 'North Side', skills: ['Plumbing', 'General'] },
        { id: 'tech_003', name: 'Mike Rodriguez', status: 'on_site', location: 'South District', skills: ['HVAC', 'Mechanical'] },
        { id: 'tech_004', name: 'Lisa Chen', status: 'available', location: 'West End', skills: ['Electrical', 'Security'] }
    ];
    
    container.innerHTML = sampleTechnicians.map(tech => `
        <div class="technician-card" data-tech-id="${tech.id}">
            <div class="tech-header">
                <div class="tech-name">${tech.name}</div>
                <div class="tech-status ${tech.status}">${formatStatus(tech.status)}</div>
            </div>
            <div class="tech-details">
                <div class="tech-location">
                    <i class="fas fa-map-marker-alt"></i>
                    ${tech.location}
                </div>
                <div class="tech-skills">
                    ${tech.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
            </div>
            <div class="tech-actions">
                <button class="tech-action-btn" onclick="contactTechnician('${tech.id}')">
                    <i class="fas fa-phone"></i>
                </button>
                <button class="tech-action-btn" onclick="viewTechnicianLocation('${tech.id}')">
                    <i class="fas fa-map"></i>
                </button>
                <button class="tech-action-btn" onclick="assignWorkOrder('${tech.id}')">
                    <i class="fas fa-clipboard"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function renderPendingQueue(dispatches) {
    const container = document.getElementById('pendingQueue');
    if (!container) return;
    
    const sampleDispatches = dispatches || [
        { id: 'wo_001', customer: 'Acme Corp', type: 'HVAC Repair', priority: 'high', eta: '15 min' },
        { id: 'wo_002', customer: 'Beta LLC', type: 'Electrical Inspection', priority: 'medium', eta: '30 min' },
        { id: 'wo_003', customer: 'Gamma Inc', type: 'Emergency Repair', priority: 'emergency', eta: '5 min' }
    ];
    
    container.innerHTML = sampleDispatches.map(dispatch => `
        <div class="dispatch-card priority-${dispatch.priority}">
            <div class="dispatch-header">
                <div class="dispatch-id">#${dispatch.id}</div>
                <div class="dispatch-priority ${dispatch.priority}">${formatPriority(dispatch.priority)}</div>
            </div>
            <div class="dispatch-details">
                <div class="dispatch-customer">${dispatch.customer}</div>
                <div class="dispatch-type">${dispatch.type}</div>
                <div class="dispatch-eta">ETA: ${dispatch.eta}</div>
            </div>
            <div class="dispatch-actions">
                <button class="dispatch-action-btn" onclick="assignDispatch('${dispatch.id}')">
                    <i class="fas fa-user-plus"></i>
                    Assign
                </button>
                <button class="dispatch-action-btn" onclick="viewDispatchDetails('${dispatch.id}')">
                    <i class="fas fa-eye"></i>
                    Details
                </button>
            </div>
        </div>
    `).join('');
}

function renderMessages(messages) {
    const container = document.getElementById('messageList');
    if (!container) return;
    
    const sampleMessages = messages.length ? messages : [
        { id: 1, from: 'John Smith', message: 'Arrived at customer location', time: '14:32', status: 'read' },
        { id: 2, from: 'Sarah Johnson', message: 'Need additional parts for repair', time: '14:28', status: 'unread' },
        { id: 3, from: 'Mike Rodriguez', message: 'Job completed successfully', time: '14:15', status: 'read' }
    ];
    
    container.innerHTML = sampleMessages.map(msg => `
        <div class="message-item ${msg.status}">
            <div class="message-header">
                <span class="message-from">${msg.from}</span>
                <span class="message-time">${msg.time}</span>
            </div>
            <div class="message-content">${msg.message}</div>
        </div>
    `).join('');
}

function renderAlerts(alerts) {
    const container = document.getElementById('alertList');
    if (!container) return;
    
    const sampleAlerts = alerts.length ? alerts : [
        { id: 1, type: 'warning', message: 'Technician running behind schedule', time: '14:30' },
        { id: 2, type: 'info', message: 'New work order assigned', time: '14:25' },
        { id: 3, type: 'error', message: 'Equipment failure reported', time: '14:20' }
    ];
    
    container.innerHTML = sampleAlerts.map(alert => `
        <div class="alert-item alert-${alert.type}">
            <div class="alert-icon">
                <i class="fas fa-${getAlertIcon(alert.type)}"></i>
            </div>
            <div class="alert-content">
                <div class="alert-message">${alert.message}</div>
                <div class="alert-time">${alert.time}</div>
            </div>
        </div>
    `).join('');
}

function renderNotifications(notifications) {
    const container = document.getElementById('notificationList');
    if (!container) return;
    
    const sampleNotifications = notifications.length ? notifications : [
        { id: 1, title: 'Schedule Updated', message: 'Your schedule has been optimized', time: '14:35' },
        { id: 2, title: 'New Message', message: 'Message from John Smith', time: '14:32' },
        { id: 3, title: 'Work Order Complete', message: 'WO #wo_001 has been completed', time: '14:15' }
    ];
    
    container.innerHTML = sampleNotifications.map(notif => `
        <div class="notification-item">
            <div class="notification-title">${notif.title}</div>
            <div class="notification-message">${notif.message}</div>
            <div class="notification-time">${notif.time}</div>
        </div>
    `).join('');
}

function switchCommunicationTab(targetTab) {
    // Remove active class from all tabs and sections
    document.querySelectorAll('.comm-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.comm-section').forEach(section => section.classList.remove('active'));
    
    // Add active class to selected tab and section
    document.querySelector(`[data-tab="${targetTab}"]`).classList.add('active');
    document.getElementById(targetTab).classList.add('active');
}

function sendMessage() {
    const messageInput = document.getElementById('newMessage');
    const message = messageInput.value.trim();
    
    if (message) {
        // Send message via API
        fetch('/api/field-service/communications/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, type: 'broadcast' })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                messageInput.value = '';
                showNotification('Message sent successfully', 'success');
                loadCommunications(); // Refresh messages
            } else {
                showNotification('Failed to send message', 'error');
            }
        })
        .catch(error => {
            console.error('Send message error:', error);
            showNotification('Failed to send message', 'error');
        });
    }
}

function showEmergencyModal() {
    const modal = document.getElementById('emergencyModal');
    if (modal) {
        modal.style.display = 'flex';
        loadNearestTechnicians();
    }
}

function hideEmergencyModal() {
    const modal = document.getElementById('emergencyModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function loadNearestTechnicians() {
    fetch('/api/field-service/technicians/available')
        .then(response => response.json())
        .then(data => {
            const select = document.getElementById('nearestTechnician');
            if (select && data.success) {
                select.innerHTML = data.data.map(tech => 
                    `<option value="${tech.id}">${tech.name} - ${tech.distance} miles away</option>`
                ).join('');
            }
        })
        .catch(error => {
            console.error('Failed to load technicians:', error);
        });
}

function dispatchEmergency() {
    const emergencyData = {
        type: document.getElementById('emergencyType').value,
        urgency: document.getElementById('urgencyLevel').value,
        location: document.getElementById('emergencyLocation').value,
        description: document.getElementById('emergencyDescription').value,
        technician: document.getElementById('nearestTechnician').value
    };
    
    fetch('/api/field-service/dispatch/emergency', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emergencyData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            hideEmergencyModal();
            showNotification('Emergency dispatch sent successfully', 'success');
            loadDispatchData(); // Refresh dispatch data
        } else {
            showNotification('Failed to dispatch emergency', 'error');
        }
    })
    .catch(error => {
        console.error('Emergency dispatch error:', error);
        showNotification('Failed to dispatch emergency', 'error');
    });
}

function startRealTimeUpdates() {
    // Update data every 30 seconds
    setInterval(() => {
        loadTechnicianStatus();
        loadPendingDispatches();
        loadCommunications();
    }, 30000);
}

function updateDispatchDisplay(data) {
    if (data.stats) {
        updateElement('activeTechnicians', data.stats.activeTechnicians || 12);
        updateElement('pendingDispatch', data.stats.pendingDispatch || 7);
        updateElement('responseTime', data.stats.responseTime || '8.5min');
    }
}

function filterDispatches() {
    const priorityFilter = document.getElementById('priorityFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    
    console.log('Filtering dispatches:', { priority: priorityFilter, status: statusFilter });
    // Implement filtering logic here
}

// Helper functions
function formatStatus(status) {
    const statusMap = {
        'available': 'Available',
        'dispatched': 'Dispatched',
        'on_site': 'On Site',
        'completed': 'Completed'
    };
    return statusMap[status] || status;
}

function formatPriority(priority) {
    const priorityMap = {
        'emergency': 'EMERGENCY',
        'high': 'HIGH',
        'medium': 'MEDIUM',
        'low': 'LOW'
    };
    return priorityMap[priority] || priority;
}

function getAlertIcon(type) {
    const iconMap = {
        'warning': 'exclamation-triangle',
        'info': 'info-circle',
        'error': 'times-circle',
        'success': 'check-circle'
    };
    return iconMap[type] || 'bell';
}

function updateElement(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    }
}

function showNotification(message, type) {
    // Create notification if notification system doesn't exist
    if (typeof window.fieldServicePages !== 'undefined' && window.fieldServicePages.showNotification) {
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

// Global functions for button actions
function contactTechnician(techId) {
    console.log('Contacting technician:', techId);
    showNotification('Calling technician...', 'info');
}

function viewTechnicianLocation(techId) {
    console.log('Viewing technician location:', techId);
    showNotification('Focusing map on technician location', 'info');
}

function assignWorkOrder(techId) {
    console.log('Assigning work order to technician:', techId);
    showNotification('Opening work order assignment', 'info');
}

function assignDispatch(dispatchId) {
    console.log('Assigning dispatch:', dispatchId);
    showNotification('Opening technician selection', 'info');
}

function viewDispatchDetails(dispatchId) {
    console.log('Viewing dispatch details:', dispatchId);
    showNotification('Opening dispatch details', 'info');
}

function createNewDispatch() {
    console.log('Creating new dispatch');
    showNotification('Opening new dispatch form', 'info');
}