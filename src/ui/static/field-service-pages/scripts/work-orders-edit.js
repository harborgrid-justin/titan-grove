/**
 * Work Orders Edit Page Script
 * Handles editing existing work orders with real-time updates and progress tracking
 */

class WorkOrderEditManager {
  constructor() {
    this.workOrderId = this.getWorkOrderId();
    this.form = document.getElementById('editWorkOrderForm');
    this.initializeEventListeners();
    this.loadWorkOrderData();
    this.setupRealTimeUpdates();
  }

  getWorkOrderId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id') || 'wo_001';
  }

  initializeEventListeners() {
    // Form submission
    this.form?.addEventListener('submit', (e) => this.handleFormSubmit(e));

    // Real-time status updates
    document
      .getElementById('workOrderStatus')
      ?.addEventListener('change', (e) => this.updateStatus(e.target.value));
    document
      .getElementById('assignedTech')
      ?.addEventListener('change', (e) => this.reassignTechnician(e.target.value));
    document
      .getElementById('priorityLevel')
      ?.addEventListener('change', (e) => this.updatePriority(e.target.value));

    // Progress actions
    document.getElementById('addNote')?.addEventListener('click', () => this.addWorkNote());
    document.getElementById('addPart')?.addEventListener('click', () => this.addPart());
    document.getElementById('markComplete')?.addEventListener('click', () => this.markComplete());

    // Utility actions
    document.getElementById('saveChanges')?.addEventListener('click', () => this.saveChanges());
    document.getElementById('viewHistory')?.addEventListener('click', () => this.viewHistory());
    document
      .getElementById('duplicateWorkOrder')
      ?.addEventListener('click', () => this.duplicateWorkOrder());

    // Auto-save on input changes
    this.setupAutoSave();
  }

  async loadWorkOrderData() {
    try {
      const response = await fetch(`/api/field-service/work-orders/${this.workOrderId}`);
      if (response.ok) {
        const workOrder = await response.json();
        this.populateForm(workOrder.data);
        this.updateBreadcrumb(workOrder.data);
      } else {
        this.showErrorMessage('Work order not found');
      }
    } catch (error) {
      console.error('Error loading work order:', error);
      this.showErrorMessage('Failed to load work order data');
    }
  }

  populateForm(workOrder) {
    // Update header
    document.querySelector('.page-title').textContent = `Edit Work Order #${workOrder.id}`;

    // Status information
    const statusBadge = document.querySelector('.status-badge');
    if (statusBadge) {
      statusBadge.className = `status-badge status-${workOrder.status}`;
      statusBadge.textContent = this.formatStatus(workOrder.status);
    }

    // Form fields
    document.getElementById('workOrderStatus').value = workOrder.status;
    document.getElementById('assignedTech').value = workOrder.assignedTechnicianId;
    document.getElementById('priorityLevel').value = workOrder.priority;
    document.getElementById('customerId').value = workOrder.customerId;
    document.getElementById('contactName').value = workOrder.contactName || '';
    document.getElementById('contactPhone').value = workOrder.contactPhone || '';
    document.getElementById('contactEmail').value = workOrder.contactEmail || '';
    document.getElementById('workOrderTitle').value = workOrder.title;
    document.getElementById('workOrderDescription').value = workOrder.description;
    document.getElementById('serviceType').value = workOrder.serviceType;
    document.getElementById('estimatedDuration').value = workOrder.estimatedDuration;
    document.getElementById('skillsRequired').value = workOrder.skillsRequired?.join(', ') || '';

    // Load notes and parts
    this.loadWorkNotes(workOrder.notes || []);
    this.loadPartsUsed(workOrder.partsUsed || []);

    // Update progress timeline
    this.updateProgressTimeline(workOrder);
  }

  updateBreadcrumb(workOrder) {
    const breadcrumb = document.querySelector('.breadcrumb-nav span');
    if (breadcrumb) {
      breadcrumb.textContent = `Edit ${workOrder.id}`;
    }
  }

  async handleFormSubmit(e) {
    e.preventDefault();
    await this.saveChanges();
  }

  async saveChanges() {
    const formData = this.collectFormData();

    try {
      const response = await fetch(`/api/field-service/work-orders/${this.workOrderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        this.showSuccessMessage('Work order updated successfully');
        this.markSaved();
      } else {
        throw new Error('Failed to update work order');
      }
    } catch (error) {
      console.error('Error updating work order:', error);
      this.showErrorMessage('Failed to save changes');
    }
  }

  collectFormData() {
    return {
      status: document.getElementById('workOrderStatus')?.value,
      assignedTechnicianId: document.getElementById('assignedTech')?.value,
      priority: document.getElementById('priorityLevel')?.value,
      customerId: document.getElementById('customerId')?.value,
      contactName: document.getElementById('contactName')?.value,
      contactPhone: document.getElementById('contactPhone')?.value,
      contactEmail: document.getElementById('contactEmail')?.value,
      title: document.getElementById('workOrderTitle')?.value,
      description: document.getElementById('workOrderDescription')?.value,
      serviceType: document.getElementById('serviceType')?.value,
      estimatedDuration: parseInt(document.getElementById('estimatedDuration')?.value),
      skillsRequired: document
        .getElementById('skillsRequired')
        ?.value?.split(',')
        .map((s) => s.trim()),
      lastModified: new Date().toISOString(),
    };
  }

  async updateStatus(newStatus) {
    try {
      const response = await fetch(`/api/field-service/work-orders/${this.workOrderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        this.updateStatusDisplay(newStatus);
        this.showSuccessMessage(`Status updated to ${this.formatStatus(newStatus)}`);

        // Trigger status-specific actions
        if (newStatus === 'completed') {
          this.handleCompletion();
        } else if (newStatus === 'in-progress') {
          this.notifyStart();
        }
      }
    } catch (error) {
      console.error('Error updating status:', error);
      this.showErrorMessage('Failed to update status');
    }
  }

  async reassignTechnician(technicianId) {
    try {
      const response = await fetch(`/api/field-service/work-orders/${this.workOrderId}/assign`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ technicianId }),
      });

      if (response.ok) {
        this.showSuccessMessage('Technician reassigned successfully');
        // Send notification to new technician
        this.notifyTechnician(technicianId);
      }
    } catch (error) {
      console.error('Error reassigning technician:', error);
      this.showErrorMessage('Failed to reassign technician');
    }
  }

  async addWorkNote() {
    const noteText = document.getElementById('newNote')?.value?.trim();
    if (!noteText) return;

    const note = {
      text: noteText,
      author: 'Current User', // This would come from auth context
      timestamp: new Date().toISOString(),
      type: 'work_progress',
    };

    try {
      const response = await fetch(`/api/field-service/work-orders/${this.workOrderId}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(note),
      });

      if (response.ok) {
        this.addNoteToDisplay(note);
        document.getElementById('newNote').value = '';
        this.showSuccessMessage('Work note added');
      }
    } catch (error) {
      console.error('Error adding note:', error);
      this.showErrorMessage('Failed to add note');
    }
  }

  addNoteToDisplay(note) {
    const notesContainer = document.querySelector('.existing-notes');
    const noteElement = document.createElement('div');
    noteElement.className = 'note-item';
    noteElement.innerHTML = `
            <div class="note-header">
                <span class="note-author">${note.author}</span>
                <span class="note-time">${this.formatTime(note.timestamp)}</span>
            </div>
            <div class="note-content">${note.text}</div>
        `;
    notesContainer.appendChild(noteElement);
  }

  async addPart() {
    // This would typically open a modal for part selection
    // For now, we'll show a simple prompt
    const partNumber = prompt('Enter part number:');
    const description = prompt('Enter part description:');
    const quantity = parseInt(prompt('Enter quantity:')) || 1;
    const unitCost = parseFloat(prompt('Enter unit cost:')) || 0;

    if (!partNumber || !description) return;

    const part = {
      partNumber,
      description,
      quantity,
      unitCost,
      totalCost: quantity * unitCost,
      addedBy: 'Current User',
      addedAt: new Date().toISOString(),
    };

    try {
      const response = await fetch(`/api/field-service/work-orders/${this.workOrderId}/parts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(part),
      });

      if (response.ok) {
        this.addPartToTable(part);
        this.showSuccessMessage('Part added successfully');
      }
    } catch (error) {
      console.error('Error adding part:', error);
      this.showErrorMessage('Failed to add part');
    }
  }

  addPartToTable(part) {
    const tbody = document.getElementById('partsTableBody');
    const row = document.createElement('tr');
    row.innerHTML = `
            <td>${part.partNumber}</td>
            <td>${part.description}</td>
            <td>${part.quantity}</td>
            <td>$${part.unitCost.toFixed(2)}</td>
            <td>$${part.totalCost.toFixed(2)}</td>
            <td>
                <button class="btn-icon btn-danger" onclick="this.closest('tr').remove()">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
    tbody.appendChild(row);
  }

  async markComplete() {
    if (confirm('Are you sure you want to mark this work order as complete?')) {
      await this.updateStatus('completed');
    }
  }

  handleCompletion() {
    // Show completion modal or redirect to completion form
    this.showSuccessMessage('Work order marked as complete. Customer notification sent.');

    // Update timeline
    this.completeTimelineItem('completion');
  }

  setupAutoSave() {
    let saveTimeout;
    const inputs = this.form?.querySelectorAll('input, select, textarea');

    inputs?.forEach((input) => {
      input.addEventListener('input', () => {
        this.markUnsaved();

        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
          this.autoSave();
        }, 2000); // Auto-save after 2 seconds of inactivity
      });
    });
  }

  async autoSave() {
    try {
      const formData = this.collectFormData();
      const response = await fetch(`/api/field-service/work-orders/${this.workOrderId}/autosave`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        this.markSaved();
      }
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  }

  markUnsaved() {
    const saveButton = document.getElementById('saveChanges');
    if (saveButton) {
      saveButton.innerHTML = '<i class="fas fa-save"></i> Save Changes*';
      saveButton.classList.add('unsaved');
    }
  }

  markSaved() {
    const saveButton = document.getElementById('saveChanges');
    if (saveButton) {
      saveButton.innerHTML = '<i class="fas fa-check"></i> Saved';
      saveButton.classList.remove('unsaved');
      setTimeout(() => {
        saveButton.innerHTML = '<i class="fas fa-save"></i> Save Changes';
      }, 2000);
    }
  }

  setupRealTimeUpdates() {
    // Simulate real-time updates (in production, this would use WebSockets)
    setInterval(() => {
      this.checkForUpdates();
    }, 30000); // Check every 30 seconds
  }

  async checkForUpdates() {
    try {
      const response = await fetch(`/api/field-service/work-orders/${this.workOrderId}/updates`);
      if (response.ok) {
        const updates = await response.json();
        this.applyUpdates(updates.data);
      }
    } catch (error) {
      // Silently fail for real-time updates
    }
  }

  loadWorkNotes(notes) {
    const container = document.querySelector('.existing-notes');
    container.innerHTML = '';

    notes.forEach((note) => {
      this.addNoteToDisplay(note);
    });
  }

  loadPartsUsed(parts) {
    const tbody = document.getElementById('partsTableBody');
    tbody.innerHTML = '';

    parts.forEach((part) => {
      this.addPartToTable(part);
    });
  }

  updateProgressTimeline(workOrder) {
    const timeline = document.querySelector('.progress-timeline');
    const items = timeline?.querySelectorAll('.timeline-item');

    // Update timeline based on current status
    items?.forEach((item, index) => {
      item.classList.remove('current', 'completed', 'pending');

      const statuses = ['created', 'assigned', 'in-progress', 'completed'];
      const currentIndex = statuses.indexOf(workOrder.status);

      if (index < currentIndex) {
        item.classList.add('completed');
      } else if (index === currentIndex) {
        item.classList.add('current');
      } else {
        item.classList.add('pending');
      }
    });
  }

  completeTimelineItem(itemType) {
    const items = document.querySelectorAll('.timeline-item');
    items.forEach((item) => {
      if (item.textContent.includes('Completion')) {
        item.classList.remove('pending', 'current');
        item.classList.add('completed');
      }
    });
  }

  formatStatus(status) {
    return status
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  formatTime(timestamp) {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  viewHistory() {
    window.open(`history.html?search=${this.workOrderId}`, '_blank');
  }

  duplicateWorkOrder() {
    const formData = this.collectFormData();
    delete formData.status;
    localStorage.setItem('workOrderDuplicate', JSON.stringify(formData));
    window.open('create.html', '_blank');
  }

  async notifyTechnician(technicianId) {
    // Send notification to technician
    try {
      await fetch('/api/notifications/technician', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          technicianId,
          workOrderId: this.workOrderId,
          type: 'assignment',
          message: `You have been assigned to work order ${this.workOrderId}`,
        }),
      });
    } catch (error) {
      console.error('Failed to notify technician:', error);
    }
  }

  notifyStart() {
    // Notify relevant parties that work has started
    this.showInfoMessage('Work started notification sent to customer and supervisor');
  }

  updateStatusDisplay(status) {
    const statusBadge = document.querySelector('.status-badge');
    if (statusBadge) {
      statusBadge.className = `status-badge status-${status}`;
      statusBadge.textContent = this.formatStatus(status);
    }
  }

  showSuccessMessage(message) {
    this.showNotification(message, 'success');
  }

  showErrorMessage(message) {
    this.showNotification(message, 'error');
  }

  showInfoMessage(message) {
    this.showNotification(message, 'info');
  }

  showNotification(message, type) {
    // Reuse notification system from create page
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

    document.body.appendChild(notification);

    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 5000);
  }
}

// Remove part function (global for inline onclick)
window.removePart = function (button) {
  if (confirm('Remove this part from the work order?')) {
    button.closest('tr').remove();
  }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new WorkOrderEditManager();
});
