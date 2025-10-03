import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import DataTable from '../components/DataTable';
import CrudModal from '../components/CrudModal';
import KPIWidget from '../components/KPIWidget';
import { useFinancialTransactions, useAccountBalances, useRealtimeKPIs } from '../hooks/useApi';
import { Transaction } from '../services/apiService';

const Financials: React.FC = () => {
  // Fetch transactions from backend
  const { 
    transactions, 
    loading: transactionsLoading, 
    error: transactionsError, 
    refetch: refetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    actionLoading
  } = useFinancialTransactions();

  // Fetch account balances
  const { data: accountBalances, loading: balancesLoading, error: balancesError } = useAccountBalances();
  
  // Connect to real-time KPI updates
  const { kpiData: realtimeKpis, connected: kpiConnected, error: kpiError } = useRealtimeKPIs();

  // Modal state for CRUD operations
  const [showModal, setShowModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  // Transform transactions for table display
  const transformedTransactions = transactions.map(transaction => ({
    id: transaction.id,
    account: transaction.account,
    type: transaction.type,
    amount: `$${transaction.amount.toLocaleString()}`,
    description: transaction.description,
    date: new Date(transaction.date).toLocaleDateString(),
    reference: transaction.reference,
    status: transaction.status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()),
    statusClass: transaction.status === 'CLEARED' ? 'success' : 
                 transaction.status === 'RECONCILED' ? 'success' :
                 transaction.status === 'PENDING' ? 'warning' : 'neutral'
  }));

  const tableColumns = [
    { key: 'select', label: '', type: 'checkbox' },
    { key: 'id', label: 'Transaction ID', type: 'text' },
    { key: 'account', label: 'Account', type: 'text' },
    { key: 'type', label: 'Type', type: 'text' },
    { key: 'amount', label: 'Amount', type: 'currency' },
    { key: 'description', label: 'Description', type: 'text' },
    { key: 'date', label: 'Date', type: 'date' },
    { key: 'reference', label: 'Reference', type: 'text' },
    { key: 'status', label: 'Status', type: 'status' },
    { key: 'actions', label: 'Actions', type: 'actions' }
  ];

  // Static KPI data enhanced with real-time data
  const [kpiData] = useState([
    { title: 'Currency (YTD)', value: '$124.5M', change: '+8.7%', trend: 'positive', format: 'currency' },
    { title: 'EBITDA Margin', value: '23.8%', change: '+1.2%', trend: 'positive', format: 'percentage' },
    { title: 'Cash Flow', value: '$18.2M', change: '+15.3%', trend: 'positive', format: 'currency' },
    { title: 'Operating Ratio', value: '76.2%', change: '-2.1%', trend: 'negative', format: 'percentage' },
    { title: 'Accounts Receivable', value: '$32.1M', change: '+5.4%', trend: 'positive', format: 'currency' },
    { title: 'Working Capital', value: '$45.8M', change: '+12.3%', trend: 'positive', format: 'currency' }
  ]);

  // CRUD operation handlers
  const handleCreateTransaction = () => {
    setEditingTransaction(null);
    setShowModal(true);
  };

  const handleEditTransaction = (transaction: any) => {
    const originalTransaction = transactions.find(t => t.id === transaction.id);
    if (originalTransaction) {
      setEditingTransaction(originalTransaction);
      setShowModal(true);
    }
  };

  const handleDeleteTransaction = async (transaction: any) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await deleteTransaction(transaction.id);
      } catch (error) {
        console.error('Failed to delete transaction:', error);
        alert('Failed to delete transaction. Please try again.');
      }
    }
  };

  const handleViewTransaction = (transaction: any) => {
    alert(`Viewing transaction: ${transaction.id}\\nAccount: ${transaction.account}\\nAmount: ${transaction.amount}`);
  };

  const handleSaveTransaction = async (transactionData: Omit<Transaction, 'id'> | Transaction) => {
    try {
      if ('id' in transactionData) {
        await updateTransaction(transactionData.id, transactionData);
      } else {
        await createTransaction(transactionData);
      }
    } catch (error) {
      console.error('Failed to save transaction:', error);
      throw error;
    }
  };

  const validateTransaction = (formData: any) => {
    const errors: { [key: string]: string } = {};
    
    if (!formData.account?.trim()) errors.account = 'Account is required';
    if (!formData.amount || formData.amount <= 0) errors.amount = 'Amount must be greater than 0';
    if (!formData.description?.trim()) errors.description = 'Description is required';
    if (!formData.date) errors.date = 'Date is required';

    return errors;
  };

  const initialTransactionData = {
    account: '',
    type: 'DEBIT',
    amount: 0,
    description: '',
    date: new Date().toISOString().split('T')[0],
    reference: '',
    status: 'PENDING'
  };

  return (
    <>
      <Sidebar />
      <div className="titan-content">
        <div className="titan-dashboard">
          <div className="titan-dashboard-header">
            <h1 className="titan-dashboard-title">💰 Financial Management</h1>
            <div className="titan-dashboard-actions">
              <button 
                className="titan-button"
                onClick={handleCreateTransaction}
                disabled={!!actionLoading}
              >
                ➕ Create Transaction
              </button>
              <button className="titan-button">📊 Financial Report</button>
              <button className="titan-button titan-button-secondary">⚙️ Configure GL</button>
              {kpiConnected && (
                <span style={{ 
                  fontSize: '12px', 
                  color: 'var(--success)', 
                  marginLeft: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  ● Live Data Connected
                </span>
              )}
              {kpiError && (
                <span style={{ 
                  fontSize: '12px', 
                  color: 'var(--error)', 
                  marginLeft: '12px' 
                }}>
                  ⚠️ {kpiError}
                </span>
              )}
            </div>
          </div>

          <div className="titan-section">
            <h2 className="titan-section-title">
              <span>💰</span>
              Financial KPIs
            </h2>
            <div className="titan-kpi-grid">
              {kpiData.map((kpi, index) => (
                <KPIWidget 
                  key={index} 
                  title={kpi.title}
                  value={kpi.value}
                  change={kpi.change}
                  trend={kpi.trend as 'positive' | 'negative'}
                  format={kpi.format as 'currency' | 'percentage' | 'number'}
                />
              ))}
            </div>
          </div>

          <div className="titan-section">
            <h2 className="titan-section-title">
              <span>💳</span>
              Financial Transactions
              {transactionsLoading && <span style={{ fontSize: '14px', color: 'var(--text-secondary)', marginLeft: '8px' }}>Loading...</span>}
              {transactionsError && <span style={{ fontSize: '14px', color: 'var(--error)', marginLeft: '8px' }}>⚠️ {transactionsError}</span>}
            </h2>
            <DataTable
              columns={tableColumns}
              data={transformedTransactions}
              searchable={true}
              paginated={true}
              onEdit={handleEditTransaction}
              onDelete={handleDeleteTransaction}
              onView={handleViewTransaction}
            />
            {!transactionsLoading && transformedTransactions.length === 0 && (
              <div style={{ 
                padding: '40px', 
                textAlign: 'center', 
                color: 'var(--text-secondary)' 
              }}>
                No transactions found. <button 
                  onClick={refetchTransactions}
                  style={{ 
                    color: 'var(--primary)', 
                    textDecoration: 'underline',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Try refreshing
                </button>
              </div>
            )}
          </div>

          <div className="titan-widget-grid">
            <div className="titan-widget">
              <h3 style={{ margin: '0 0 16px 0' }}>📈 P&L Summary</h3>
              <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface)', borderRadius: '6px' }}>
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                  <div>Interactive P&L chart will be rendered here</div>
                </div>
              </div>
            </div>
            <div className="titan-widget">
              <h3 style={{ margin: '0 0 16px 0' }}>💳 Accounts Receivable</h3>
              <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface)', borderRadius: '6px' }}>
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                  <div>AR aging analysis will be rendered here</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction Modal */}
        <CrudModal<Transaction>
          isOpen={showModal}
          title="Transaction"
          item={editingTransaction}
          onClose={() => setShowModal(false)}
          onSave={handleSaveTransaction}
          loading={!!actionLoading}
          validation={validateTransaction}
          initialData={initialTransactionData}
        >
          {({ formData, handleInputChange, formErrors }) => (
            <>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '4px', 
                  fontWeight: 500,
                  color: 'var(--text-primary)'
                }}>
                  Account *
                </label>
                <input
                  type="text"
                  name="account"
                  value={formData.account || ''}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: `1px solid ${formErrors.account ? 'var(--error)' : '#e2e8f0'}`,
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontFamily: 'var(--font-primary)'
                  }}
                  placeholder="Enter account name"
                />
                {formErrors.account && (
                  <span style={{ color: 'var(--error)', fontSize: '12px' }}>{formErrors.account}</span>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '4px', 
                    fontWeight: 500,
                    color: 'var(--text-primary)'
                  }}>
                    Type
                  </label>
                  <select
                    name="type"
                    value={formData.type || 'DEBIT'}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontFamily: 'var(--font-primary)'
                    }}
                  >
                    <option value="DEBIT">Debit</option>
                    <option value="CREDIT">Credit</option>
                  </select>
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '4px', 
                    fontWeight: 500,
                    color: 'var(--text-primary)'
                  }}>
                    Amount *
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount || ''}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: `1px solid ${formErrors.amount ? 'var(--error)' : '#e2e8f0'}`,
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontFamily: 'var(--font-primary)'
                    }}
                    placeholder="0.00"
                  />
                  {formErrors.amount && (
                    <span style={{ color: 'var(--error)', fontSize: '12px' }}>{formErrors.amount}</span>
                  )}
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '4px', 
                  fontWeight: 500,
                  color: 'var(--text-primary)'
                }}>
                  Description *
                </label>
                <input
                  type="text"
                  name="description"
                  value={formData.description || ''}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: `1px solid ${formErrors.description ? 'var(--error)' : '#e2e8f0'}`,
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontFamily: 'var(--font-primary)'
                  }}
                  placeholder="Enter transaction description"
                />
                {formErrors.description && (
                  <span style={{ color: 'var(--error)', fontSize: '12px' }}>{formErrors.description}</span>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '4px', 
                    fontWeight: 500,
                    color: 'var(--text-primary)'
                  }}>
                    Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date || ''}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: `1px solid ${formErrors.date ? 'var(--error)' : '#e2e8f0'}`,
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontFamily: 'var(--font-primary)'
                    }}
                  />
                  {formErrors.date && (
                    <span style={{ color: 'var(--error)', fontSize: '12px' }}>{formErrors.date}</span>
                  )}
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '4px', 
                    fontWeight: 500,
                    color: 'var(--text-primary)'
                  }}>
                    Reference
                  </label>
                  <input
                    type="text"
                    name="reference"
                    value={formData.reference || ''}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontFamily: 'var(--font-primary)'
                    }}
                    placeholder="Reference number"
                  />
                </div>
              </div>
            </>
          )}
        </CrudModal>
      </div>
    </>
  );
};

export default Financials;