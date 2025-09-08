/**
 * Purchase Order Creation JavaScript
 * Handles PO creation, line items, calculations, and workflow management
 */

class PurchaseOrderManager {
    constructor() {
        this.lineItems = [];
        this.suppliers = [];
        this.currentPO = {
            number: 'PO-2025-0247',
            supplier: '',
            deliveryDate: '',
            priority: 'medium',
            department: 'manufacturing',
            costCenter: '',
            currency: 'USD',
            description: '',
            subtotal: 0,
            tax: 0,
            shipping: 0,
            total: 0
        };
        this.taxRate = 0.085; // 8.5%
        this.init();
    }

    async init() {
        this.loadSuppliers();
        this.setupEventListeners();
        this.setupValidation();
        this.addInitialLineItem();
        this.setDefaultDate();
        console.log('📋 Purchase Order Manager initialized');
    }

    loadSuppliers() {
        // Mock supplier data - in real app would fetch from API
        this.suppliers = [
            {
                id: 'sup_001',
                name: 'Acme Manufacturing Inc.',
                email: 'orders@acme-mfg.com',
                paymentTerms: 'net30',
                category: 'Manufacturing',
                rating: 4.8
            },
            {
                id: 'sup_002',
                name: 'Global Tech Solutions',
                email: 'procurement@globaltech.com',
                paymentTerms: 'net60',
                category: 'Technology',
                rating: 4.9
            },
            {
                id: 'sup_003',
                name: 'Industrial Parts Corp',
                email: 'sales@industrialparts.com',
                paymentTerms: '2-10-net30',
                category: 'Parts',
                rating: 4.7
            },
            {
                id: 'sup_004',
                name: 'Quality Components Ltd',
                email: 'orders@qualitycomp.com',
                paymentTerms: 'net30',
                category: 'Components',
                rating: 4.6
            }
        ];
    }

    setupEventListeners() {
        // Supplier change
        document.getElementById('supplier').addEventListener('change', (e) => {
            this.handleSupplierChange(e.target.value);
        });

        // Priority change
        document.getElementById('priority').addEventListener('change', (e) => {
            this.updateApprovalWorkflow();
        });

        // Payment terms change
        document.getElementById('paymentTerms').addEventListener('change', (e) => {
            this.currentPO.paymentTerms = e.target.value;
        });

        // Currency change
        document.getElementById('currency').addEventListener('change', (e) => {
            this.currentPO.currency = e.target.value;
            this.updateDisplayCurrency();
        });

        // Form field changes
        ['deliveryDate', 'department', 'costCenter', 'description'].forEach(field => {
            const element = document.getElementById(field);
            if (element) {
                element.addEventListener('change', (e) => {
                    this.currentPO[field] = e.target.value;
                    this.validateForm();
                });
            }
        });

        // Header action buttons
        document.querySelectorAll('.procurement-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleHeaderAction(e.currentTarget);
            });
        });
    }

    setupValidation() {
        // Real-time validation
        const requiredFields = ['supplier', 'deliveryDate'];
        requiredFields.forEach(field => {
            const element = document.getElementById(field);
            if (element) {
                element.addEventListener('blur', () => {
                    this.validateField(field);
                });
            }
        });
    }

    setDefaultDate() {
        // Set default delivery date to 2 weeks from now
        const defaultDate = new Date();
        defaultDate.setDate(defaultDate.getDate() + 14);
        document.getElementById('deliveryDate').value = defaultDate.toISOString().split('T')[0];
        this.currentPO.deliveryDate = defaultDate.toISOString().split('T')[0];
    }

    addLineItem(data = null) {
        const lineItem = {
            id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            description: data?.description || '',
            quantity: data?.quantity || 1,
            unit: data?.unit || 'Each',
            unitPrice: data?.unitPrice || 0,
            total: data?.total || 0
        };

        this.lineItems.push(lineItem);
        this.renderLineItems();
        this.calculateTotals();
        
        console.log('➕ Line item added:', lineItem.id);
    }

    removeLineItem(itemId) {
        this.lineItems = this.lineItems.filter(item => item.id !== itemId);
        this.renderLineItems();
        this.calculateTotals();
        
        console.log('➖ Line item removed:', itemId);
    }

    renderLineItems() {
        const container = document.getElementById('lineItemsContainer');
        if (!container) return;

        container.innerHTML = this.lineItems.map(item => `
            <div class="line-item-row" data-item-id="${item.id}">
                <div class="item-col-desc">
                    <input type="text" class="form-control" placeholder="Item description..." 
                           value="${item.description}" 
                           onchange="poManager.updateLineItem('${item.id}', 'description', this.value)">
                </div>
                <div class="item-col-qty">
                    <input type="number" class="form-control" min="1" step="1" 
                           value="${item.quantity}" 
                           onchange="poManager.updateLineItem('${item.id}', 'quantity', this.value)">
                </div>
                <div class="item-col-unit">
                    <select class="form-control" onchange="poManager.updateLineItem('${item.id}', 'unit', this.value)">
                        <option value="Each" ${item.unit === 'Each' ? 'selected' : ''}>Each</option>
                        <option value="Box" ${item.unit === 'Box' ? 'selected' : ''}>Box</option>
                        <option value="Case" ${item.unit === 'Case' ? 'selected' : ''}>Case</option>
                        <option value="Pound" ${item.unit === 'Pound' ? 'selected' : ''}>Pound</option>
                        <option value="Kilogram" ${item.unit === 'Kilogram' ? 'selected' : ''}>Kilogram</option>
                        <option value="Meter" ${item.unit === 'Meter' ? 'selected' : ''}>Meter</option>
                        <option value="Foot" ${item.unit === 'Foot' ? 'selected' : ''}>Foot</option>
                        <option value="Hour" ${item.unit === 'Hour' ? 'selected' : ''}>Hour</option>
                    </select>
                </div>
                <div class="item-col-price">
                    <input type="number" class="form-control" min="0" step="0.01" 
                           value="${item.unitPrice}" 
                           onchange="poManager.updateLineItem('${item.id}', 'unitPrice', this.value)">
                </div>
                <div class="item-col-total">
                    <span class="item-total">$${item.total.toFixed(2)}</span>
                </div>
                <div class="item-col-actions">
                    <button class="btn-icon btn-danger" onclick="poManager.removeLineItem('${item.id}')" 
                            title="Remove Item">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');

        // Show add button if no items or always show
        if (this.lineItems.length === 0) {
            this.addInitialLineItem();
        }
    }

    addInitialLineItem() {
        if (this.lineItems.length === 0) {
            this.addLineItem();
        }
    }

    updateLineItem(itemId, field, value) {
        const item = this.lineItems.find(item => item.id === itemId);
        if (!item) return;

        // Update field
        if (field === 'quantity' || field === 'unitPrice') {
            item[field] = parseFloat(value) || 0;
        } else {
            item[field] = value;
        }

        // Recalculate item total
        item.total = item.quantity * item.unitPrice;

        // Update display
        const row = document.querySelector(`[data-item-id="${itemId}"]`);
        if (row) {
            const totalSpan = row.querySelector('.item-total');
            if (totalSpan) {
                totalSpan.textContent = `$${item.total.toFixed(2)}`;
            }
        }

        this.calculateTotals();
        console.log(`📝 Line item updated: ${itemId} - ${field}: ${value}`);
    }

    calculateTotals() {
        // Calculate subtotal
        this.currentPO.subtotal = this.lineItems.reduce((sum, item) => sum + item.total, 0);
        
        // Calculate tax
        this.currentPO.tax = this.currentPO.subtotal * this.taxRate;
        
        // Calculate shipping (could be dynamic based on supplier/items)
        this.currentPO.shipping = this.calculateShipping();
        
        // Calculate total
        this.currentPO.total = this.currentPO.subtotal + this.currentPO.tax + this.currentPO.shipping;

        // Update display
        this.updateTotalDisplay();
        this.updateBudgetInfo();
        this.updateApprovalWorkflow();
    }

    calculateShipping() {
        // Simple shipping calculation - in real app would be more complex
        if (this.currentPO.subtotal > 1000) return 0; // Free shipping over $1000
        if (this.currentPO.subtotal > 500) return 25; // $25 for orders $500-$1000
        return 50; // $50 for orders under $500
    }

    updateTotalDisplay() {
        const elements = {
            subtotal: document.getElementById('subtotal'),
            tax: document.getElementById('tax'),
            shipping: document.getElementById('shipping'),
            total: document.getElementById('total')
        };

        Object.keys(elements).forEach(key => {
            if (elements[key]) {
                elements[key].textContent = `$${this.currentPO[key].toFixed(2)}`;
            }
        });
    }

    updateDisplayCurrency() {
        // Update currency symbols throughout the form
        const currencySymbol = this.getCurrencySymbol(this.currentPO.currency);
        
        document.querySelectorAll('.item-total, #subtotal, #tax, #shipping, #total').forEach(element => {
            const value = parseFloat(element.textContent.replace(/[^0-9.-]+/g, ''));
            element.textContent = `${currencySymbol}${value.toFixed(2)}`;
        });
    }

    getCurrencySymbol(currency) {
        const symbols = {
            'USD': '$',
            'EUR': '€',
            'GBP': '£',
            'CAD': 'C$'
        };
        return symbols[currency] || '$';
    }

    updateBudgetInfo() {
        const budgetTotal = 150000; // Department budget
        const budgetUsed = 45200; // Already used
        const budgetAvailable = budgetTotal - budgetUsed;
        
        // Update PO amount in budget
        document.getElementById('budgetPOAmount').textContent = `$${this.currentPO.total.toFixed(2)}`;
        
        // Calculate remaining
        const remaining = budgetAvailable - this.currentPO.total;
        document.getElementById('budgetRemaining').textContent = `$${remaining.toFixed(2)}`;
        
        // Update budget status
        const budgetStatus = document.querySelector('.budget-status');
        const remainingElement = document.getElementById('budgetRemaining');
        
        if (remaining < 0) {
            budgetStatus.className = 'budget-status exceeded';
            budgetStatus.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Budget Exceeded';
            remainingElement.style.color = '#ef4444';
        } else if (remaining < budgetAvailable * 0.1) {
            budgetStatus.className = 'budget-status warning';
            budgetStatus.innerHTML = '<i class="fas fa-exclamation-circle"></i> Budget Warning';
            remainingElement.style.color = '#f59e0b';
        } else {
            budgetStatus.className = 'budget-status available';
            budgetStatus.innerHTML = '<i class="fas fa-check-circle"></i> Budget Available';
            remainingElement.style.color = '#10b981';
        }

        // Update budget bar
        const usedPercentage = (budgetUsed / budgetTotal) * 100;
        const poPercentage = (this.currentPO.total / budgetTotal) * 100;
        
        document.querySelector('.budget-used').style.width = `${usedPercentage}%`;
        document.getElementById('budgetReserved').style.width = `${poPercentage}%`;
        document.getElementById('budgetPercentage').textContent = 
            `Available: ${(100 - usedPercentage - poPercentage).toFixed(1)}%`;
    }

    updateApprovalWorkflow() {
        const steps = document.querySelectorAll('.approval-step');
        const total = this.currentPO.total;
        const priority = document.getElementById('priority').value;

        // Reset all steps
        steps.forEach(step => {
            step.querySelector('.step-icon').className = 'step-icon pending';
        });

        // Determine which approvals are needed based on amount and priority
        if (total > 0) {
            // Department Manager (always required)
            steps[0].querySelector('.step-icon').className = 'step-icon required';
            
            // Finance Director (required for $25K+)
            if (total >= 25000) {
                steps[1].querySelector('.step-icon').className = 'step-icon required';
            }
            
            // CEO (required for $100K+)
            if (total >= 100000) {
                steps[2].querySelector('.step-icon').className = 'step-icon required';
            }
            
            // Priority adjustments
            if (priority === 'urgent' && total >= 10000) {
                steps[1].querySelector('.step-icon').className = 'step-icon required';
            }
        }
    }

    handleSupplierChange(supplierId) {
        const supplier = this.suppliers.find(s => s.id === supplierId);
        if (!supplier) return;

        this.currentPO.supplier = supplierId;
        
        // Auto-fill payment terms based on supplier
        const paymentTermsSelect = document.getElementById('paymentTerms');
        if (paymentTermsSelect && supplier.paymentTerms) {
            paymentTermsSelect.value = supplier.paymentTerms;
            this.currentPO.paymentTerms = supplier.paymentTerms;
        }

        this.validateForm();
        console.log(`🏢 Supplier selected: ${supplier.name}`);
    }

    handleHeaderAction(button) {
        const hasIcon = button.querySelector('i');
        if (hasIcon) {
            const iconClass = hasIcon.className;
            if (iconClass.includes('fa-save')) {
                this.saveDraft();
            } else if (iconClass.includes('fa-paper-plane')) {
                this.submitPO();
            }
        }
    }

    validateForm() {
        const errors = [];
        
        // Check required fields
        if (!this.currentPO.supplier) {
            errors.push('Supplier is required');
        }
        
        if (!this.currentPO.deliveryDate) {
            errors.push('Delivery date is required');
        }
        
        // Check delivery date is in future
        if (this.currentPO.deliveryDate && new Date(this.currentPO.deliveryDate) <= new Date()) {
            errors.push('Delivery date must be in the future');
        }
        
        // Check line items
        if (this.lineItems.length === 0 || this.lineItems.every(item => !item.description)) {
            errors.push('At least one line item with description is required');
        }
        
        // Check total amount
        if (this.currentPO.total <= 0) {
            errors.push('Purchase order total must be greater than zero');
        }

        // Update submit button state
        const submitBtn = document.querySelector('.procurement-btn-primary[onclick*="submitPO"]');
        if (submitBtn) {
            submitBtn.disabled = errors.length > 0;
            if (errors.length > 0) {
                submitBtn.title = 'Please fix validation errors: ' + errors.join(', ');
            } else {
                submitBtn.title = 'Submit purchase order for approval';
            }
        }

        return errors;
    }

    validateField(fieldName) {
        const field = document.getElementById(fieldName);
        if (!field) return;

        let isValid = true;
        
        switch (fieldName) {
            case 'supplier':
                isValid = !!field.value;
                break;
            case 'deliveryDate':
                isValid = !!field.value && new Date(field.value) > new Date();
                break;
        }

        // Update field styling
        if (isValid) {
            field.classList.remove('error');
        } else {
            field.classList.add('error');
        }
    }

    saveDraft() {
        // Validate minimum requirements for draft
        if (!this.currentPO.supplier) {
            this.showError('Please select a supplier before saving draft');
            return;
        }

        const draftData = {
            ...this.currentPO,
            lineItems: this.lineItems,
            status: 'draft',
            savedAt: new Date().toISOString()
        };

        // In real app, would save to backend
        sessionStorage.setItem(`po_draft_${this.currentPO.number}`, JSON.stringify(draftData));
        
        this.showSuccess('Purchase order saved as draft');
        console.log('💾 PO draft saved:', this.currentPO.number);
    }

    previewPO() {
        const supplier = this.suppliers.find(s => s.id === this.currentPO.supplier);
        
        const modal = this.createModal('Purchase Order Preview', `
            <div class="po-preview">
                <div class="po-preview-header">
                    <div class="po-info">
                        <h3>Purchase Order ${this.currentPO.number}</h3>
                        <div class="po-dates">
                            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                            <p><strong>Delivery Date:</strong> ${new Date(this.currentPO.deliveryDate).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <div class="supplier-info">
                        <h4>Supplier:</h4>
                        <p>${supplier ? supplier.name : 'No supplier selected'}</p>
                        <p>${supplier ? supplier.email : ''}</p>
                    </div>
                </div>
                
                <div class="po-preview-items">
                    <h4>Line Items:</h4>
                    <table class="preview-table">
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th>Qty</th>
                                <th>Unit</th>
                                <th>Unit Price</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.lineItems.map(item => `
                                <tr>
                                    <td>${item.description}</td>
                                    <td>${item.quantity}</td>
                                    <td>${item.unit}</td>
                                    <td>$${item.unitPrice.toFixed(2)}</td>
                                    <td>$${item.total.toFixed(2)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                
                <div class="po-preview-totals">
                    <div class="total-row">
                        <span>Subtotal:</span>
                        <span>$${this.currentPO.subtotal.toFixed(2)}</span>
                    </div>
                    <div class="total-row">
                        <span>Tax:</span>
                        <span>$${this.currentPO.tax.toFixed(2)}</span>
                    </div>
                    <div class="total-row">
                        <span>Shipping:</span>
                        <span>$${this.currentPO.shipping.toFixed(2)}</span>
                    </div>
                    <div class="total-row total-final">
                        <span><strong>Total:</strong></span>
                        <span><strong>$${this.currentPO.total.toFixed(2)}</strong></span>
                    </div>
                </div>
                
                <div class="modal-actions">
                    <button class="btn btn-secondary" onclick="poManager.closeModal()">
                        Close Preview
                    </button>
                    <button class="btn btn-primary" onclick="poManager.printPO()">
                        Print PO
                    </button>
                </div>
            </div>
        `);
        
        this.showModal(modal);
    }

    printPO() {
        window.print();
    }

    submitPO() {
        // Validate form
        const errors = this.validateForm();
        if (errors.length > 0) {
            this.showError('Please fix the following errors:\n' + errors.join('\n'));
            return;
        }

        // Check budget
        const budgetStatus = document.querySelector('.budget-status');
        if (budgetStatus.classList.contains('exceeded')) {
            if (!confirm('This purchase order exceeds the available budget. Do you want to continue?')) {
                return;
            }
        }

        const submitData = {
            ...this.currentPO,
            lineItems: this.lineItems,
            status: 'submitted',
            submittedAt: new Date().toISOString(),
            submittedBy: 'current_user_id' // Would be actual user ID
        };

        // In real app, would submit to backend
        console.log('📤 PO submitted:', submitData);

        // Show success and redirect
        this.showSuccess('Purchase order submitted successfully for approval!');
        
        setTimeout(() => {
            // In real app, would redirect to PO tracking page
            window.location.href = 'po-tracking.html';
        }, 2000);
    }

    // Utility methods
    createModal(title, content) {
        return `
            <div class="modal-overlay" onclick="poManager.closeModal()">
                <div class="modal-dialog" onclick="event.stopPropagation()">
                    <div class="modal-header">
                        <h3>${title}</h3>
                        <button class="modal-close" onclick="poManager.closeModal()">
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
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const poManager = new PurchaseOrderManager();
    
    // Make available globally for HTML onclick handlers
    window.poManager = poManager;
    
    console.log('🚀 Purchase Order Creation System Ready');
});

// Add additional styles for PO creation
const poStyles = `
<style>
/* PO Creation Specific Styles */
.po-creation-container {
    max-width: 1200px;
    margin: 0 auto;
}

.form-grid-3 {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
    margin-bottom: 1rem;
}

.line-items-container {
    background: #f8fafc;
    border-radius: 0.5rem;
    padding: 1rem;
}

.line-items-header {
    display: grid;
    grid-template-columns: 3fr 1fr 1fr 1fr 1fr 1fr;
    gap: 1rem;
    padding: 0.75rem;
    background: #e2e8f0;
    border-radius: 0.375rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.5rem;
}

.line-item-row {
    display: grid;
    grid-template-columns: 3fr 1fr 1fr 1fr 1fr 1fr;
    gap: 1rem;
    padding: 0.75rem;
    background: white;
    border-radius: 0.375rem;
    margin-bottom: 0.5rem;
    align-items: center;
}

.item-total {
    font-weight: 600;
    color: #059669;
}

.btn-add-item {
    background: #f1f5f9;
    border: 2px dashed #cbd5e1;
    border-radius: 0.375rem;
    padding: 1rem;
    width: 100%;
    cursor: pointer;
    color: #64748b;
    transition: all 0.2s;
}

.btn-add-item:hover {
    background: #e2e8f0;
    border-color: #94a3b8;
    color: #475569;
}

.procurement-form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-bottom: 2rem;
}

.po-total-display {
    background: #f8fafc;
    border-radius: 0.5rem;
    padding: 1rem;
}

.total-line {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
}

.total-final {
    border-top: 1px solid #e2e8f0;
    padding-top: 0.5rem;
    margin-top: 0.5rem;
    font-weight: 600;
    font-size: 1.125rem;
}

.approval-workflow {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem;
    background: #f8fafc;
    border-radius: 0.5rem;
}

.approval-step {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    flex: 1;
}

.step-icon {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.5rem;
    font-size: 1.25rem;
}

.step-icon.pending {
    background: #e2e8f0;
    color: #64748b;
}

.step-icon.required {
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    color: white;
}

.step-info {
    font-size: 0.75rem;
}

.step-title {
    font-weight: 600;
    color: #374151;
}

.step-person {
    color: #64748b;
    margin: 0.25rem 0;
}

.step-amount {
    color: #059669;
    font-size: 0.625rem;
}

.approval-arrow {
    color: #cbd5e1;
    font-size: 1.25rem;
}

.budget-info {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 2rem;
    align-items: center;
}

.budget-details {
    display: grid;
    gap: 0.5rem;
}

.budget-item {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 0;
}

.budget-label {
    color: #64748b;
}

.budget-value {
    font-weight: 600;
}

.budget-value.available {
    color: #059669;
}

.budget-chart {
    text-align: center;
}

.budget-bar {
    height: 1rem;
    background: #e2e8f0;
    border-radius: 0.5rem;
    display: flex;
    overflow: hidden;
    margin-bottom: 0.5rem;
}

.budget-used {
    background: #f59e0b;
    transition: width 0.3s ease;
}

.budget-reserved {
    background: #3b82f6;
    transition: width 0.3s ease;
}

.budget-labels {
    display: flex;
    justify-content: space-between;
    font-size: 0.75rem;
    color: #64748b;
}

.budget-status.available {
    color: #059669;
}

.budget-status.warning {
    color: #f59e0b;
}

.budget-status.exceeded {
    color: #ef4444;
}

.workflow-status {
    background: #f1f5f9;
    color: #64748b;
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.75rem;
    font-weight: 500;
}

.form-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid #e2e8f0;
}

.btn-icon.btn-danger {
    color: #ef4444;
}

.btn-icon.btn-danger:hover {
    background: #fef2f2;
    color: #dc2626;
}

.form-control.error {
    border-color: #ef4444;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.po-preview {
    max-width: 600px;
}

.po-preview-header {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #e2e8f0;
}

.preview-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 1rem;
}

.preview-table th,
.preview-table td {
    padding: 0.5rem;
    text-align: left;
    border-bottom: 1px solid #e2e8f0;
}

.preview-table th {
    background: #f8fafc;
    font-weight: 600;
}

.po-preview-totals {
    background: #f8fafc;
    padding: 1rem;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
}

@media (max-width: 768px) {
    .line-items-header,
    .line-item-row {
        grid-template-columns: 1fr;
        gap: 0.5rem;
    }
    
    .procurement-form-grid {
        grid-template-columns: 1fr;
    }
    
    .approval-workflow {
        flex-direction: column;
        gap: 0.5rem;
    }
    
    .approval-arrow {
        transform: rotate(90deg);
    }
    
    .budget-info {
        grid-template-columns: 1fr;
    }
    
    .form-actions {
        flex-direction: column;
    }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', poStyles);