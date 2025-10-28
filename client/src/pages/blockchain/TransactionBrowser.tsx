/**
 * AETHERIAL Transaction Browser
 * 
 * Advanced transaction search and filtering
 * Real-time transaction monitoring
 */

import React, { useState, useEffect } from 'react';
import './TransactionBrowser.css';

interface Transaction {
  id: string;
  blockNumber: number;
  from: string;
  to: string;
  amount: number;
  fee: number;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
  confirmations: number;
  gasUsed: number;
  type: 'transfer' | 'contract' | 'stake' | 'unstake';
}

interface SearchFilters {
  address?: string;
  blockNumber?: number;
  minAmount?: number;
  maxAmount?: number;
  status?: string;
  type?: string;
  dateFrom?: string;
  dateTo?: string;
}

export const TransactionBrowser: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadTransactions();
    const interval = setInterval(loadTransactions, 10000); // Refresh every 10s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [transactions, filters, searchQuery]);

  const loadTransactions = async () => {
    try {
      const response = await fetch('/api/blockchain/transactions');
      const data = await response.json();
      setTransactions(data.transactions);
    } catch (error) {
      console.error('Failed to load transactions:', error);
    }
  };

  const applyFilters = () => {
    let filtered = [...transactions];

    // Search query
    if (searchQuery) {
      filtered = filtered.filter(tx =>
        tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.to.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Address filter
    if (filters.address) {
      filtered = filtered.filter(tx =>
        tx.from.toLowerCase().includes(filters.address!.toLowerCase()) ||
        tx.to.toLowerCase().includes(filters.address!.toLowerCase())
      );
    }

    // Block number filter
    if (filters.blockNumber) {
      filtered = filtered.filter(tx => tx.blockNumber === filters.blockNumber);
    }

    // Amount filters
    if (filters.minAmount !== undefined) {
      filtered = filtered.filter(tx => tx.amount >= filters.minAmount!);
    }
    if (filters.maxAmount !== undefined) {
      filtered = filtered.filter(tx => tx.amount <= filters.maxAmount!);
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(tx => tx.status === filters.status);
    }

    // Type filter
    if (filters.type) {
      filtered = filtered.filter(tx => tx.type === filters.type);
    }

    // Date filters
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom).getTime();
      filtered = filtered.filter(tx => tx.timestamp >= fromDate);
    }
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo).getTime();
      filtered = filtered.filter(tx => tx.timestamp <= toDate);
    }

    setFilteredTransactions(filtered);
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
  };

  const exportTransactions = () => {
    const csv = [
      ['Transaction ID', 'Block', 'From', 'To', 'Amount', 'Fee', 'Status', 'Timestamp'].join(','),
      ...filteredTransactions.map(tx =>
        [
          tx.id,
          tx.blockNumber,
          tx.from,
          tx.to,
          tx.amount,
          tx.fee,
          tx.status,
          new Date(tx.timestamp).toISOString(),
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_${Date.now()}.csv`;
    a.click();
  };

  const formatHash = (hash: string) => {
    return `${hash.substring(0, 10)}...${hash.substring(hash.length - 8)}`;
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'transfer': return '💸';
      case 'contract': return '📄';
      case 'stake': return '🔒';
      case 'unstake': return '🔓';
      default: return '📝';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return '#4caf50';
      case 'pending': return '#ffc107';
      case 'failed': return '#ff5252';
      default: return '#9e9e9e';
    }
  };

  return (
    <div className="transaction-browser">
      <header className="browser-header">
        <h1>🔍 Transaction Browser</h1>
        <p>Search and explore all blockchain transactions</p>
      </header>

      <div className="browser-controls">
        <div className="search-section">
          <input
            type="text"
            className="search-input"
            placeholder="Search by transaction ID, address, or block number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            className="filter-toggle"
            onClick={() => setShowFilters(!showFilters)}
          >
            🎛️ {showFilters ? 'Hide' : 'Show'} Filters
          </button>
          <button className="export-button" onClick={exportTransactions}>
            📥 Export CSV
          </button>
        </div>

        {showFilters && (
          <div className="filters-panel">
            <div className="filter-grid">
              <div className="filter-group">
                <label>Address</label>
                <input
                  type="text"
                  placeholder="0x..."
                  value={filters.address || ''}
                  onChange={(e) => setFilters({ ...filters, address: e.target.value })}
                />
              </div>

              <div className="filter-group">
                <label>Block Number</label>
                <input
                  type="number"
                  placeholder="Block #"
                  value={filters.blockNumber || ''}
                  onChange={(e) => setFilters({ ...filters, blockNumber: parseInt(e.target.value) || undefined })}
                />
              </div>

              <div className="filter-group">
                <label>Min Amount (AETH)</label>
                <input
                  type="number"
                  placeholder="0.00"
                  step="0.0001"
                  value={filters.minAmount || ''}
                  onChange={(e) => setFilters({ ...filters, minAmount: parseFloat(e.target.value) || undefined })}
                />
              </div>

              <div className="filter-group">
                <label>Max Amount (AETH)</label>
                <input
                  type="number"
                  placeholder="0.00"
                  step="0.0001"
                  value={filters.maxAmount || ''}
                  onChange={(e) => setFilters({ ...filters, maxAmount: parseFloat(e.target.value) || undefined })}
                />
              </div>

              <div className="filter-group">
                <label>Status</label>
                <select
                  value={filters.status || ''}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value || undefined })}
                >
                  <option value="">All</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Type</label>
                <select
                  value={filters.type || ''}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value || undefined })}
                >
                  <option value="">All</option>
                  <option value="transfer">Transfer</option>
                  <option value="contract">Contract</option>
                  <option value="stake">Stake</option>
                  <option value="unstake">Unstake</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Date From</label>
                <input
                  type="date"
                  value={filters.dateFrom || ''}
                  onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value || undefined })}
                />
              </div>

              <div className="filter-group">
                <label>Date To</label>
                <input
                  type="date"
                  value={filters.dateTo || ''}
                  onChange={(e) => setFilters({ ...filters, dateTo: e.target.value || undefined })}
                />
              </div>
            </div>

            <div className="filter-actions">
              <button onClick={clearFilters}>Clear All Filters</button>
              <span className="results-count">
                {filteredTransactions.length} transaction(s) found
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="browser-content">
        <div className="transactions-table">
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Transaction ID</th>
                <th>Block</th>
                <th>From</th>
                <th>To</th>
                <th>Amount</th>
                <th>Fee</th>
                <th>Status</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={9} className="no-results">
                    No transactions found
                  </td>
                </tr>
              ) : (
                filteredTransactions.map(tx => (
                  <tr
                    key={tx.id}
                    className={selectedTransaction?.id === tx.id ? 'selected' : ''}
                    onClick={() => setSelectedTransaction(tx)}
                  >
                    <td className="type-cell">
                      <span title={tx.type}>{getTypeIcon(tx.type)}</span>
                    </td>
                    <td className="hash-cell">
                      <code>{formatHash(tx.id)}</code>
                    </td>
                    <td className="block-cell">#{tx.blockNumber}</td>
                    <td className="address-cell">
                      <code>{formatHash(tx.from)}</code>
                    </td>
                    <td className="address-cell">
                      <code>{formatHash(tx.to)}</code>
                    </td>
                    <td className="amount-cell">{tx.amount.toFixed(4)} AETH</td>
                    <td className="fee-cell">{tx.fee.toFixed(4)} AETH</td>
                    <td className="status-cell">
                      <span
                        className={`status-badge ${tx.status}`}
                        style={{ backgroundColor: getStatusColor(tx.status) }}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="time-cell">{formatTimestamp(tx.timestamp)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {selectedTransaction && (
          <div className="transaction-details">
            <div className="details-header">
              <h2>Transaction Details</h2>
              <button onClick={() => setSelectedTransaction(null)}>✕</button>
            </div>

            <div className="details-content">
              <div className="detail-section">
                <h3>Overview</h3>
                <div className="detail-grid">
                  <div className="detail-row">
                    <span className="label">Transaction ID:</span>
                    <span className="value">
                      <code>{selectedTransaction.id}</code>
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Status:</span>
                    <span className="value">
                      <span
                        className={`status-badge ${selectedTransaction.status}`}
                        style={{ backgroundColor: getStatusColor(selectedTransaction.status) }}
                      >
                        {selectedTransaction.status}
                      </span>
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Type:</span>
                    <span className="value">
                      {getTypeIcon(selectedTransaction.type)} {selectedTransaction.type}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Block Number:</span>
                    <span className="value">#{selectedTransaction.blockNumber}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Confirmations:</span>
                    <span className="value">{selectedTransaction.confirmations}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Timestamp:</span>
                    <span className="value">{formatTimestamp(selectedTransaction.timestamp)}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Transaction Details</h3>
                <div className="detail-grid">
                  <div className="detail-row">
                    <span className="label">From:</span>
                    <span className="value">
                      <code>{selectedTransaction.from}</code>
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="label">To:</span>
                    <span className="value">
                      <code>{selectedTransaction.to}</code>
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Amount:</span>
                    <span className="value amount-highlight">
                      {selectedTransaction.amount.toFixed(4)} AETH
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Transaction Fee:</span>
                    <span className="value">{selectedTransaction.fee.toFixed(4)} AETH</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Gas Used:</span>
                    <span className="value">{selectedTransaction.gasUsed.toLocaleString()}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Total Cost:</span>
                    <span className="value">
                      {(selectedTransaction.amount + selectedTransaction.fee).toFixed(4)} AETH
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionBrowser;

