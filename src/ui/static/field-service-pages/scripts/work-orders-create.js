/**
 * Work Orders Create Page Script
 * Handles the creation of new work orders with validation and auto-assignment
 */

class WorkOrderCreateManager {
    constructor() {
        this.form = document.getElementById('workOrderForm');
        this.initializeEventListeners();
        this.setupFormValidation();
        this.loadCustomerData();
        this.loadTechnicianData();
    }

    initializeEventListeners() {
        // Form submission
        this.form?.addEventListener('submit', (e) => this.handleFormSubmit(e));

        // Save draft functionality
        document.getElementById('saveDraft')?.addEventListener('click', () => this.saveDraft());
        document.getElementById('saveDraftBtn')?.addEventListener('click', () => this.saveDraft());

        // Customer selection auto-fill
        document.getElementById('customerId')?.addEventListener('change', (e) => this.loadCustomerDetails(e.target.value));

        // Service type change
        document.getElementById('serviceType')?.addEventListener('change', (e) => this.updateEstimatedDuration(e.target.value));

        // Auto-assignment based on skills and location
        document.getElementById('skillsRequired')?.addEventListener('blur', () => this.suggestTechnicians());
        document.getElementById('serviceAddress')?.addEventListener('blur', () => this.suggestTechnicians());

        // Priority change notifications
        document.getElementById('priority')?.addEventListener('change', (e) => this.handlePriorityChange(e.target.value));
    }

    setupFormValidation() {
        // Real-time validation
        const requiredFields = ['customerId', 'workOrderTitle', 'serviceType', 'priority', 'serviceAddress'];
        
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('blur', () => this.validateField(field));
                field.addEventListener('input', () => this.clearValidationError(field));
            }
        });
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        
        if (!this.validateForm()) {
            return;
        }

        const formData = this.collectFormData();
        
        try {
            const response = await fetch('/api/field-service/work-orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const result = await response.json();
                this.showSuccessMessage(`Work order ${result.data.id} created successfully!`);
                
                // Redirect to tracking page or edit page
                setTimeout(() => {
                    window.location.href = `edit.html?id=${result.data.id}`;
                }, 2000);
            } else {
                throw new Error('Failed to create work order');
            }
        } catch (error) {
            console.error('Error creating work order:', error);
            this.showErrorMessage('Failed to create work order. Please try again.');
        }
    }

    collectFormData() {
        return {
            customerId: document.getElementById('customerId')?.value,
            contactName: document.getElementById('contactName')?.value,
            contactPhone: document.getElementById('contactPhone')?.value,
            contactEmail: document.getElementById('contactEmail')?.value,
            title: document.getElementById('workOrderTitle')?.value,
            description: document.getElementById('workOrderDescription')?.value,
            serviceType: document.getElementById('serviceType')?.value,
            priority: document.getElementById('priority')?.value,
            estimatedDuration: parseInt(document.getElementById('estimatedDuration')?.value) || 120,
            skillsRequired: document.getElementById('skillsRequired')?.value?.split(',').map(s => s.trim()),
            serviceAddress: document.getElementById('serviceAddress')?.value,
            preferredDate: document.getElementById('preferredDate')?.value,
            preferredTime: document.getElementById('preferredTime')?.value,
            accessInstructions: document.getElementById('accessInstructions')?.value,
            assignedTechnician: document.getElementById('assignedTechnician')?.value,
            supervisorNotify: document.getElementById('supervisorNotify')?.value,
            warrantyInfo: document.getElementById('warrantyInfo')?.value,
            contractInfo: document.getElementById('contractInfo')?.value,
            specialInstructions: document.getElementById('specialInstructions')?.value,
            createdDate: new Date().toISOString(),
            status: 'created'
        };
    }

    async saveDraft() {
        const formData = { ...this.collectFormData(), status: 'draft' };
        
        try {
            // Save to localStorage as backup
            localStorage.setItem('workOrderDraft', JSON.stringify(formData));
            
            // Optionally save to server
            const response = await fetch('/api/field-service/work-orders/draft', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                this.showSuccessMessage('Draft saved successfully!');
            }
        } catch (error) {
            console.error('Error saving draft:', error);
            this.showSuccessMessage('Draft saved locally!');
        }
    }

    async loadCustomerData() {
        try {
            const response = await fetch('/api/field-service/customers');
            if (response.ok) {
                const customers = await response.json();
                this.populateCustomerSelect(customers.data);
            }
        } catch (error) {
            console.error('Error loading customers:', error);
        }
    }

    async loadTechnicianData() {
        try {
            const response = await fetch('/api/field-service/technicians');
            if (response.ok) {
                const technicians = await response.json();
                this.populateTechnicianSelect(technicians.data);
            }
        } catch (error) {
            console.error('Error loading technicians:', error);
        }
    }

    populateCustomerSelect(customers) {
        const select = document.getElementById('customerId');
        if (!select) return;

        // Clear existing options except the first one
        while (select.children.length > 1) {
            select.removeChild(select.lastChild);
        }

        customers.forEach(customer => {
            const option = document.createElement('option');
            option.value = customer.id;
            option.textContent = customer.name;
            select.appendChild(option);
        });
    }

    populateTechnicianSelect(technicians) {
        const select = document.getElementById('assignedTechnician');
        if (!select) return;

        // Clear existing options except the first one
        while (select.children.length > 1) {
            select.removeChild(select.lastChild);
        }

        technicians.forEach(tech => {
            const option = document.createElement('option');
            option.value = tech.id;
            option.textContent = `${tech.name} - ${tech.skills.join(', ')}`;
            select.appendChild(option);
        });
    }

    async loadCustomerDetails(customerId) {
        if (!customerId) return;

        try {
            const response = await fetch(`/api/field-service/customers/${customerId}`);
            if (response.ok) {
                const customer = await response.json();
                this.fillCustomerDetails(customer.data);
            }
        } catch (error) {
            console.error('Error loading customer details:', error);
        }
    }

    fillCustomerDetails(customer) {
        document.getElementById('contactName').value = customer.primaryContact?.name || '';
        document.getElementById('contactPhone').value = customer.primaryContact?.phone || '';
        document.getElementById('contactEmail').value = customer.primaryContact?.email || '';
        document.getElementById('serviceAddress').value = customer.defaultAddress || '';
    }

    updateEstimatedDuration(serviceType) {
        const durationInput = document.getElementById('estimatedDuration');
        if (!durationInput) return;

        const durations = {
            'installation': 240,
            'repair': 180,
            'maintenance': 120,
            'inspection': 90,
            'emergency': 60
        };

        durationInput.value = durations[serviceType] || 120;
    }

    async suggestTechnicians() {
        const skills = document.getElementById('skillsRequired')?.value;
        const address = document.getElementById('serviceAddress')?.value;
        
        if (!skills && !address) return;

        try {
            const params = new URLSearchParams();
            if (skills) params.append('skills', skills);
            if (address) params.append('location', address);

            const response = await fetch(`/api/field-service/technicians/suggest?${params}`);
            if (response.ok) {
                const suggestions = await response.json();
                this.showTechnicianSuggestions(suggestions.data);
            }
        } catch (error) {
            console.error('Error getting technician suggestions:', error);
        }
    }

    showTechnicianSuggestions(suggestions) {
        if (suggestions.length === 0) return;

        // Auto-select the best match if no technician is currently selected
        const techSelect = document.getElementById('assignedTechnician');
        if (techSelect && !techSelect.value) {
            techSelect.value = suggestions[0].id;
            
            // Show a notification about the auto-assignment
            this.showInfoMessage(`Auto-assigned to ${suggestions[0].name} based on skills and location`);
        }
    }

    handlePriorityChange(priority) {
        if (priority === 'critical') {
            this.showWarningMessage('Critical priority work orders will trigger immediate notifications to supervisors');
        }
    }

    validateForm() {
        const requiredFields = ['customerId', 'workOrderTitle', 'serviceType', 'priority', 'serviceAddress'];
        let isValid = true;

        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(field) {
        if (!field) return true;

        const value = field.value.trim();
        const isRequired = field.hasAttribute('required');
        
        if (isRequired && !value) {
            this.showFieldError(field, 'This field is required');
            return false;
        }

        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                this.showFieldError(field, 'Please enter a valid email address');
                return false;
            }
        }

        // Phone validation
        if (field.type === 'tel' && value) {
            const phoneRegex = /^\(\d{3}\)\s\d{3}-\d{4}$/;
            if (!phoneRegex.test(value)) {
                this.showFieldError(field, 'Please enter phone as (555) 123-4567');
                return false;
            }
        }

        this.clearValidationError(field);
        return true;
    }

    showFieldError(field, message) {
        this.clearValidationError(field);
        
        field.classList.add('error');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
    }

    clearValidationError(field) {
        field.classList.remove('error');
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    showSuccessMessage(message) {
        this.showNotification(message, 'success');
    }

    showErrorMessage(message) {
        this.showNotification(message, 'error');
    }

    showWarningMessage(message) {
        this.showNotification(message, 'warning');
    }

    showInfoMessage(message) {
        this.showNotification(message, 'info');
    }

    showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    // Load saved draft on page load
    loadDraft() {
        const draft = localStorage.getItem('workOrderDraft');
        if (draft) {
            try {
                const data = JSON.parse(draft);
                this.fillFormWithData(data);
                this.showInfoMessage('Loaded saved draft');
            } catch (error) {
                console.error('Error loading draft:', error);
            }
        }
    }

    fillFormWithData(data) {
        Object.keys(data).forEach(key => {
            const field = document.getElementById(key);
            if (field && data[key]) {
                field.value = data[key];
            }
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WorkOrderCreateManager();
});

// Add notification styles if not already present
if (!document.querySelector('#notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        .notification {
            position: fixed;
            top: 1rem;
            right: 1rem;
            z-index: 9999;
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem 1.5rem;
            background: white;
            border-radius: 0.5rem;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            border-left: 4px solid;
            animation: slideIn 0.3s ease-out;
        }
        
        .notification-success { border-left-color: #059669; }
        .notification-error { border-left-color: #dc2626; }
        .notification-warning { border-left-color: #d97706; }
        .notification-info { border-left-color: #0891b2; }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            flex: 1;
        }
        
        .notification-success .notification-content i { color: #059669; }
        .notification-error .notification-content i { color: #dc2626; }
        .notification-warning .notification-content i { color: #d97706; }
        .notification-info .notification-content i { color: #0891b2; }
        
        .notification-close {
            background: none;
            border: none;
            color: #94a3b8;
            cursor: pointer;
            padding: 0.25rem;
        }
        
        .field-error {
            color: #dc2626;
            font-size: 0.75rem;
            margin-top: 0.25rem;
        }
        
        .form-input.error,
        .form-select.error,
        .form-textarea.error {
            border-color: #dc2626;
            box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
        }
        
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
}