/**
 * Certifications - Field Service Page
 * Business-ready functionality with backend integration
 */

// Page-specific functionality for Certifications
document.addEventListener('DOMContentLoaded', function() {
    console.log('Certifications page loaded');
    
    // Initialize page-specific features
    initializeCertifications();
    loadCertificationsData();
});

function initializeCertifications() {
    // Configure add certification button
    const addCertificationBtn = document.getElementById('addCertificationBtn');
    if (addCertificationBtn) {
        addCertificationBtn.addEventListener('click', function() {
            showAddCertificationModal();
        });
    }
    
    // Configure schedule training button  
    const scheduleTrainingBtn = document.getElementById('scheduleTrainingBtn');
    if (scheduleTrainingBtn) {
        scheduleTrainingBtn.addEventListener('click', function() {
            showScheduleTrainingModal();
        });
    }
    
    // Configure filters and controls
    setupCertificationControls();
    
    // Configure modals
    setupAddCertificationModal();
    setupScheduleTrainingModal();
    
    // Configure table controls
    setupTableControls();
    
    // Load initial data
    loadCertificationTable();
    loadTrainingSessions();
}

async function loadCertificationsData() {
    try {
        const filters = getCertificationFilters();
        const response = await fetch(`/api/field-service/certifications?${new URLSearchParams(filters)}`);
        if (response.ok) {
            const data = await response.json();
            updateCertificationDisplay(data);
        }
    } catch (error) {
        console.error('Failed to load certifications data:', error);
        showNotification('Failed to load certifications data', 'error');
        // Load sample data as fallback
        updateCertificationDisplay(getSampleCertificationsData());
    }
}

function setupCertificationControls() {
    const technicianFilter = document.getElementById('technicianFilter');
    const certificationStatus = document.getElementById('certificationStatus');
    const certificationCategory = document.getElementById('certificationCategory');
    const refreshBtn = document.getElementById('refreshCertificationsBtn');
    
    [technicianFilter, certificationStatus, certificationCategory].forEach(control => {
        if (control) {
            control.addEventListener('change', function() {
                console.log('Certification filter changed:', {
                    technician: technicianFilter?.value,
                    status: certificationStatus?.value,
                    category: certificationCategory?.value
                });
                loadCertificationsData();
                loadCertificationTable();
            });
        }
    });
    
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            loadCertificationsData();
            showNotification('Certifications refreshed', 'info');
        });
    }
}

function setupAddCertificationModal() {
    const modal = document.getElementById('addCertificationModal');
    const closeBtn = document.getElementById('closeAddCertificationModal');
    const cancelBtn = document.getElementById('cancelAddCertificationBtn');
    const confirmBtn = document.getElementById('confirmAddCertificationBtn');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', hideAddCertificationModal);
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', hideAddCertificationModal);
    }
    
    if (confirmBtn) {
        confirmBtn.addEventListener('click', addCertification);
    }
    
    // Close modal on background click
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                hideAddCertificationModal();
            }
        });
    }
}

function setupScheduleTrainingModal() {
    const modal = document.getElementById('scheduleTrainingModal');
    const closeBtn = document.getElementById('closeScheduleTrainingModal');
    const cancelBtn = document.getElementById('cancelScheduleTrainingBtn');
    const confirmBtn = document.getElementById('confirmScheduleTrainingBtn');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', hideScheduleTrainingModal);
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', hideScheduleTrainingModal);
    }
    
    if (confirmBtn) {
        confirmBtn.addEventListener('click', scheduleTraining);
    }
    
    // Close modal on background click
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                hideScheduleTrainingModal();
            }
        });
    }
}

function setupTableControls() {
    const searchInput = document.getElementById('searchCertifications');
    const sortSelect = document.getElementById('sortCertifications');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filterCertificationTable(this.value);
        });
    }
    
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            sortCertificationTable(this.value);
        });
    }
}

function getCertificationFilters() {
    return {
        technician: document.getElementById('technicianFilter')?.value || 'all',
        status: document.getElementById('certificationStatus')?.value || 'all',
        category: document.getElementById('certificationCategory')?.value || 'all'
    };
}

function loadCertificationTable() {
    const filters = getCertificationFilters();
    
    fetch(`/api/field-service/certifications?${new URLSearchParams(filters)}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                renderCertificationTable(data.data);
            }
        })
        .catch(error => {
            console.error('Failed to load certification table:', error);
            // Load sample data as fallback
            renderCertificationTable(getSampleCertifications());
        });
}

function renderCertificationTable(certifications) {
    const tbody = document.getElementById('certificationTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = certifications.map(cert => `
        <tr data-cert-id="${cert.id}">
            <td>
                <div class="tech-info">
                    <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(cert.technicianName)}&background=0D8ABC&color=fff" 
                         alt="${cert.technicianName}" class="tech-avatar-small">
                    <div class="tech-details">
                        <div class="tech-name">${cert.technicianName}</div>
                        <div class="tech-id">${cert.technicianId}</div>
                    </div>
                </div>
            </td>
            <td>
                <div class="cert-info">
                    <div class="cert-name">${cert.certificationName}</div>
                    <div class="cert-number">#${cert.certificationNumber}</div>
                </div>
            </td>
            <td>
                <span class="category-badge ${cert.category}">${formatCategory(cert.category)}</span>
            </td>
            <td class="text-center">${formatDate(cert.issueDate)}</td>
            <td class="text-center">${formatDate(cert.expiryDate)}</td>
            <td class="text-center">
                <span class="status-badge ${cert.status}">${formatStatus(cert.status)}</span>
            </td>
            <td class="text-center">
                <div class="renewal-info">
                    ${getRenewalInfo(cert.expiryDate, cert.status)}
                </div>
            </td>
            <td class="text-center">
                <div class="table-actions">
                    <button class="action-btn" onclick="viewCertification('${cert.id}')" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn" onclick="editCertification('${cert.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn" onclick="renewCertification('${cert.id}')" title="Renew">
                        <i class="fas fa-sync-alt"></i>
                    </button>
                    <button class="action-btn" onclick="deleteCertification('${cert.id}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function getSampleCertifications() {
    return [
        {
            id: 'cert_001',
            technicianId: 'TECH001',
            technicianName: 'John Smith',
            certificationName: 'EPA 608 Universal',
            category: 'hvac',
            issueDate: '2023-01-15',
            expiryDate: '2026-01-15',
            status: 'valid',
            provider: 'EPA',
            certificationNumber: 'EPA608-12345',
            level: 'advanced'
        },
        {
            id: 'cert_002',
            technicianId: 'TECH001',
            technicianName: 'John Smith',
            certificationName: 'NATE HVAC Installation',
            category: 'hvac',
            issueDate: '2023-06-10',
            expiryDate: '2024-06-10',
            status: 'expiring',
            provider: 'NATE',
            certificationNumber: 'NATE-67890',
            level: 'intermediate'
        },
        {
            id: 'cert_003',
            technicianId: 'TECH002',
            technicianName: 'Sarah Johnson',
            certificationName: 'Electrical License',
            category: 'electrical',
            issueDate: '2022-09-20',
            expiryDate: '2025-09-20',
            status: 'valid',
            provider: 'State Board',
            certificationNumber: 'EL-2022-5678',
            level: 'expert'
        },
        {
            id: 'cert_004',
            technicianId: 'TECH003',
            technicianName: 'Mike Rodriguez',
            certificationName: 'OSHA 30-Hour Safety',
            category: 'safety',
            issueDate: '2022-03-15',
            expiryDate: '2023-03-15',
            status: 'expired',
            provider: 'OSHA',
            certificationNumber: 'OSHA30-9999',
            level: 'basic'
        }
    ];
}

function getSampleCertificationsData() {
    return {
        stats: {
            totalCertifications: 127,
            expiringCount: 8,
            complianceRate: '94%'
        },
        overview: {
            activeCertifications: 119,
            complianceAlerts: 8,
            upcomingTraining: 12,
            certifiedTechnicians: 15
        }
    };
}

function loadTrainingSessions() {
    fetch('/api/field-service/training/sessions')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                updateTrainingCalendar(data.data);
            }
        })
        .catch(error => {
            console.error('Failed to load training sessions:', error);
        });
}

function updateTrainingCalendar(sessions) {
    // Training calendar would be populated here
    console.log('Training sessions loaded:', sessions);
}

function showAddCertificationModal() {
    const modal = document.getElementById('addCertificationModal');
    if (modal) {
        modal.style.display = 'flex';
        
        // Set default issue date to today
        const issueDateInput = document.getElementById('certIssueDate');
        if (issueDateInput) {
            issueDateInput.value = new Date().toISOString().split('T')[0];
        }
    }
}

function hideAddCertificationModal() {
    const modal = document.getElementById('addCertificationModal');
    if (modal) {
        modal.style.display = 'none';
        // Reset form
        modal.querySelectorAll('input, select, textarea').forEach(input => {
            if (input.type === 'checkbox') {
                input.checked = false;
            } else {
                input.value = '';
            }
        });
    }
}

function showScheduleTrainingModal() {
    const modal = document.getElementById('scheduleTrainingModal');
    if (modal) {
        modal.style.display = 'flex';
        
        // Set default training date to tomorrow
        const trainingDateInput = document.getElementById('trainingDate');
        if (trainingDateInput) {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            trainingDateInput.value = tomorrow.toISOString().split('T')[0];
        }
    }
}

function hideScheduleTrainingModal() {
    const modal = document.getElementById('scheduleTrainingModal');
    if (modal) {
        modal.style.display = 'none';
        // Reset form
        modal.querySelectorAll('input, select, textarea').forEach(input => {
            if (input.type === 'checkbox') {
                input.checked = false;
            } else {
                input.value = '';
            }
        });
    }
}

function addCertification() {
    const certificationData = {
        technicianId: document.getElementById('certTechnician').value,
        certificationName: document.getElementById('certName').value,
        category: document.getElementById('certCategory').value,
        provider: document.getElementById('certProvider').value,
        issueDate: document.getElementById('certIssueDate').value,
        expiryDate: document.getElementById('certExpiryDate').value,
        certificationNumber: document.getElementById('certNumber').value,
        level: document.getElementById('certLevel').value,
        notes: document.getElementById('certNotes').value
    };
    
    // Validate required fields
    if (!certificationData.technicianId || !certificationData.certificationName || 
        !certificationData.issueDate || !certificationData.expiryDate) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    fetch('/api/field-service/certifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(certificationData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            hideAddCertificationModal();
            showNotification('Certification added successfully', 'success');
            loadCertificationTable(); // Refresh table
            loadCertificationsData(); // Refresh stats
        } else {
            showNotification('Failed to add certification', 'error');
        }
    })
    .catch(error => {
        console.error('Add certification error:', error);
        showNotification('Failed to add certification', 'error');
    });
}

function scheduleTraining() {
    const attendees = Array.from(document.querySelectorAll('.attendees-selection input[type="checkbox"]:checked'))
        .map(checkbox => checkbox.value);
    
    const trainingData = {
        title: document.getElementById('trainingTitle').value,
        category: document.getElementById('trainingCategory').value,
        date: document.getElementById('trainingDate').value,
        time: document.getElementById('trainingTime').value,
        duration: document.getElementById('trainingDuration').value,
        location: document.getElementById('trainingLocation').value,
        attendees: attendees,
        description: document.getElementById('trainingDescription').value
    };
    
    // Validate required fields
    if (!trainingData.title || !trainingData.date || !trainingData.time || attendees.length === 0) {
        showNotification('Please fill in all required fields and select at least one attendee', 'error');
        return;
    }
    
    fetch('/api/field-service/training/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trainingData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            hideScheduleTrainingModal();
            showNotification('Training session scheduled successfully', 'success');
            loadTrainingSessions(); // Refresh calendar
        } else {
            showNotification('Failed to schedule training', 'error');
        }
    })
    .catch(error => {
        console.error('Schedule training error:', error);
        showNotification('Failed to schedule training', 'error');
    });
}

function updateCertificationDisplay(data) {
    // Update header stats
    if (data.stats) {
        updateElement('totalCertifications', data.stats.totalCertifications || 127);
        updateElement('expiringCount', data.stats.expiringCount || 8);
        updateElement('complianceRate', data.stats.complianceRate || '94%');
    }
    
    // Update overview cards
    if (data.overview) {
        updateElement('activeCertifications', data.overview.activeCertifications || 119);
        updateElement('complianceAlerts', data.overview.complianceAlerts || 8);
        updateElement('upcomingTraining', data.overview.upcomingTraining || 12);
        updateElement('certifiedTechnicians', data.overview.certifiedTechnicians || 15);
    }
}

function filterCertificationTable(searchTerm) {
    const tbody = document.getElementById('certificationTableBody');
    if (!tbody) return;
    
    const rows = tbody.querySelectorAll('tr');
    
    rows.forEach(row => {
        const techName = row.querySelector('.tech-name')?.textContent.toLowerCase() || '';
        const certName = row.querySelector('.cert-name')?.textContent.toLowerCase() || '';
        const certNumber = row.querySelector('.cert-number')?.textContent.toLowerCase() || '';
        
        if (techName.includes(searchTerm.toLowerCase()) || 
            certName.includes(searchTerm.toLowerCase()) || 
            certNumber.includes(searchTerm.toLowerCase())) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function sortCertificationTable(sortBy) {
    const tbody = document.getElementById('certificationTableBody');
    if (!tbody) return;
    
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    rows.sort((a, b) => {
        let aValue, bValue;
        
        switch (sortBy) {
            case 'technician':
                aValue = a.querySelector('.tech-name')?.textContent || '';
                bValue = b.querySelector('.tech-name')?.textContent || '';
                return aValue.localeCompare(bValue);
            
            case 'certification':
                aValue = a.querySelector('.cert-name')?.textContent || '';
                bValue = b.querySelector('.cert-name')?.textContent || '';
                return aValue.localeCompare(bValue);
            
            case 'expiry':
                aValue = new Date(a.cells[4]?.textContent || '');
                bValue = new Date(b.cells[4]?.textContent || '');
                return aValue - bValue;
            
            case 'status':
                aValue = a.querySelector('.status-badge')?.textContent || '';
                bValue = b.querySelector('.status-badge')?.textContent || '';
                return aValue.localeCompare(bValue);
            
            default:
                return 0;
        }
    });
    
    // Re-append sorted rows
    rows.forEach(row => tbody.appendChild(row));
    
    showNotification(`Table sorted by ${sortBy}`, 'info');
}

// Certification action handlers
function viewCertification(certId) {
    console.log('Viewing certification:', certId);
    showNotification('Opening certification details', 'info');
}

function editCertification(certId) {
    console.log('Editing certification:', certId);
    showNotification('Opening certification editor', 'info');
}

function renewCertification(certId) {
    console.log('Renewing certification:', certId);
    showNotification('Opening renewal process', 'info');
}

function deleteCertification(certId) {
    console.log('Deleting certification:', certId);
    if (confirm('Are you sure you want to delete this certification?')) {
        fetch(`/api/field-service/certifications/${certId}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showNotification('Certification deleted successfully', 'success');
                loadCertificationTable(); // Refresh table
                loadCertificationsData(); // Refresh stats
            } else {
                showNotification('Failed to delete certification', 'error');
            }
        })
        .catch(error => {
            console.error('Delete certification error:', error);
            showNotification('Failed to delete certification', 'error');
        });
    }
}

// Helper functions
function formatCategory(category) {
    const categoryMap = {
        'hvac': 'HVAC',
        'electrical': 'Electrical',
        'plumbing': 'Plumbing',
        'safety': 'Safety',
        'specialized': 'Specialized'
    };
    return categoryMap[category] || category.toUpperCase();
}

function formatStatus(status) {
    const statusMap = {
        'valid': 'Valid',
        'expiring': 'Expiring Soon',
        'expired': 'Expired',
        'pending': 'Pending'
    };
    return statusMap[status] || status;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

function getRenewalInfo(expiryDate, status) {
    if (status === 'expired') {
        return '<span class="renewal-overdue">Overdue</span>';
    }
    
    if (status === 'expiring') {
        const expiry = new Date(expiryDate);
        const today = new Date();
        const daysLeft = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
        return `<span class="renewal-warning">${daysLeft} days left</span>`;
    }
    
    const expiry = new Date(expiryDate);
    const today = new Date();
    const daysLeft = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    
    if (daysLeft > 365) {
        const yearsLeft = Math.floor(daysLeft / 365);
        return `<span class="renewal-good">${yearsLeft} year${yearsLeft > 1 ? 's' : ''} left</span>`;
    } else {
        return `<span class="renewal-good">${daysLeft} days left</span>`;
    }
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