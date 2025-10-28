/**
 * AETHERIAL Platform - Finance Dashboard
 * Complete financial management: portfolio, stocks, crypto, analytics, transactions
 */

import React, { useState, useEffect } from 'react';
import { unifiedSystemHub } from '../../lib/integration/unified-system-hub';
import './FinanceDashboard.css';

interface Asset {
  id: string;
  name: string;
  symbol: string;
  type: 'stock' | 'crypto' | 'bond' | 'etf';
  quantity: number;
  buyPrice: number;
  currentPrice: number;
  change24h: number;
}

interface Transaction {
  id: string;
  type: 'buy' | 'sell' | 'transfer' | 'dividend';
  asset: string;
  amount: number;
  price: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

interface PortfolioStats {
  totalValue: number;
  totalInvested: number;
  totalProfit: number;
  profitPercentage: number;
  dayChange: number;
  dayChangePercent: number;
}

export const FinanceDashboard: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [portfolioStats, setPortfolioStats] = useState<PortfolioStats | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'portfolio' | 'transactions' | 'analytics' | 'markets'>('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    unifiedSystemHub.publishEvent({
      id: `finance-dashboard-init-${Date.now()}`,
      timestamp: new Date(),
      source: 'finance-dashboard',
      type: 'finance.system.initialized',
      data: {},
      priority: 'high',
      propagate: true,
    });

    // Simulate loading data
    setTimeout(() => {
      setAssets([
        {
          id: 'asset_1',
          name: 'Bitcoin',
          symbol: 'BTC',
          type: 'crypto',
          quantity: 0.5,
          buyPrice: 40000,
          currentPrice: 67000,
          change24h: 3.5
        },
        {
          id: 'asset_2',
          name: 'Ethereum',
          symbol: 'ETH',
          type: 'crypto',
          quantity: 5,
          buyPrice: 2000,
          currentPrice: 3500,
          change24h: 5.2
        },
        {
          id: 'asset_3',
          name: 'Apple Inc.',
          symbol: 'AAPL',
          type: 'stock',
          quantity: 10,
          buyPrice: 150,
          currentPrice: 185,
          change24h: 1.8
        },
        {
          id: 'asset_4',
          name: 'Tesla Inc.',
          symbol: 'TSLA',
          type: 'stock',
          quantity: 5,
          buyPrice: 200,
          currentPrice: 245,
          change24h: -0.5
        }
      ]);

      setTransactions([
        {
          id: 'tx_001',
          type: 'buy',
          asset: 'BTC',
          amount: 0.5,
          price: 40000,
          date: '2025-10-28',
          status: 'completed'
        },
        {
          id: 'tx_002',
          type: 'buy',
          asset: 'ETH',
          amount: 5,
          price: 2000,
          date: '2025-10-27',
          status: 'completed'
        },
        {
          id: 'tx_003',
          type: 'sell',
          asset: 'AAPL',
          amount: 2,
          price: 185,
          date: '2025-10-26',
          status: 'completed'
        }
      ]);

      setPortfolioStats({
        totalValue: 52850,
        totalInvested: 42000,
        totalProfit: 10850,
        profitPercentage: 25.83,
        dayChange: 1250,
        dayChangePercent: 2.42
      });

      setLoading(false);
    }, 1000);
  }, []);

  const calculateAssetValue = (asset: Asset) => {
    return asset.quantity * asset.currentPrice;
  };

  const calculateAssetProfit = (asset: Asset) => {
    return (asset.currentPrice - asset.buyPrice) * asset.quantity;
  };

  const calculateAssetProfitPercent = (asset: Asset) => {
    return ((asset.currentPrice - asset.buyPrice) / asset.buyPrice) * 100;
  };

  if (loading) {
    return (
      <div className="finance-dashboard">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading finance dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="finance-dashboard">
      <header className="finance-header">
        <h1>💰 Finance Dashboard</h1>
        <p>Manage your portfolio, track investments, and analyze market trends</p>
      </header>

      <div className="finance-tabs">
        <button className={`tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Overview</button>
        <button className={`tab ${activeTab === 'portfolio' ? 'active' : ''}`} onClick={() => setActiveTab('portfolio')}>Portfolio</button>
        <button className={`tab ${activeTab === 'transactions' ? 'active' : ''}`} onClick={() => setActiveTab('transactions')}>Transactions</button>
        <button className={`tab ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>Analytics</button>
        <button className={`tab ${activeTab === 'markets' ? 'active' : ''}`} onClick={() => setActiveTab('markets')}>Markets</button>
      </div>

      <div className="finance-content">
        {activeTab === 'overview' && portfolioStats && (
          <div className="overview-section">
            <div className="portfolio-summary">
              <div className="summary-card main-card">
                <h2>Total Portfolio Value</h2>
                <div className="portfolio-value">${portfolioStats.totalValue.toLocaleString()}</div>
                <div className={`portfolio-change ${portfolioStats.dayChange >= 0 ? 'positive' : 'negative'}`}>
                  {portfolioStats.dayChange >= 0 ? '↑' : '↓'} ${Math.abs(portfolioStats.dayChange).toLocaleString()} ({portfolioStats.dayChangePercent.toFixed(2)}%) today
                </div>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-label">Total Invested</div>
                  <div className="stat-value">${portfolioStats.totalInvested.toLocaleString()}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Total Profit</div>
                  <div className="stat-value positive">${portfolioStats.totalProfit.toLocaleString()}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Return</div>
                  <div className="stat-value positive">{portfolioStats.profitPercentage.toFixed(2)}%</div>
                </div>
              </div>
            </div>

            <div className="assets-overview">
              <h2>Top Holdings</h2>
              <div className="assets-list">
                {assets.slice(0, 4).map(asset => (
                  <div key={asset.id} className="asset-item">
                    <div className="asset-info">
                      <div className="asset-symbol">{asset.symbol}</div>
                      <div className="asset-name">{asset.name}</div>
                    </div>
                    <div className="asset-stats">
                      <div className="asset-value">${calculateAssetValue(asset).toLocaleString()}</div>
                      <div className={`asset-change ${asset.change24h >= 0 ? 'positive' : 'negative'}`}>
                        {asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="quick-actions">
              <h2>Quick Actions</h2>
              <div className="actions-grid">
                <button className="action-btn">
                  <span className="action-icon">💵</span>
                  <span className="action-text">Buy Asset</span>
                </button>
                <button className="action-btn">
                  <span className="action-icon">💸</span>
                  <span className="action-text">Sell Asset</span>
                </button>
                <button className="action-btn">
                  <span className="action-icon">🔄</span>
                  <span className="action-text">Transfer</span>
                </button>
                <button className="action-btn">
                  <span className="action-icon">📊</span>
                  <span className="action-text">View Reports</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'portfolio' && (
          <div className="portfolio-section">
            <div className="section-header">
              <h2>My Portfolio</h2>
              <button className="btn btn-primary">+ Add Asset</button>
            </div>
            <div className="portfolio-table">
              <table>
                <thead>
                  <tr>
                    <th>Asset</th>
                    <th>Type</th>
                    <th>Quantity</th>
                    <th>Buy Price</th>
                    <th>Current Price</th>
                    <th>Value</th>
                    <th>Profit/Loss</th>
                    <th>24h Change</th>
                  </tr>
                </thead>
                <tbody>
                  {assets.map(asset => {
                    const profit = calculateAssetProfit(asset);
                    const profitPercent = calculateAssetProfitPercent(asset);
                    return (
                      <tr key={asset.id}>
                        <td>
                          <div className="asset-cell">
                            <strong>{asset.symbol}</strong>
                            <span className="asset-name-small">{asset.name}</span>
                          </div>
                        </td>
                        <td><span className={`type-badge ${asset.type}`}>{asset.type}</span></td>
                        <td>{asset.quantity}</td>
                        <td>${asset.buyPrice.toLocaleString()}</td>
                        <td>${asset.currentPrice.toLocaleString()}</td>
                        <td>${calculateAssetValue(asset).toLocaleString()}</td>
                        <td className={profit >= 0 ? 'positive' : 'negative'}>
                          ${profit.toLocaleString()} ({profitPercent.toFixed(2)}%)
                        </td>
                        <td className={asset.change24h >= 0 ? 'positive' : 'negative'}>
                          {asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(2)}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="transactions-section">
            <h2>Transaction History</h2>
            <div className="transactions-table">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Asset</th>
                    <th>Amount</th>
                    <th>Price</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map(tx => (
                    <tr key={tx.id}>
                      <td>{tx.date}</td>
                      <td><span className={`type-badge ${tx.type}`}>{tx.type}</span></td>
                      <td>{tx.asset}</td>
                      <td>{tx.amount}</td>
                      <td>${tx.price.toLocaleString()}</td>
                      <td>${(tx.amount * tx.price).toLocaleString()}</td>
                      <td><span className={`status-badge ${tx.status}`}>{tx.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && portfolioStats && (
          <div className="analytics-section">
            <h2>Portfolio Analytics</h2>
            <div className="analytics-grid">
              <div className="analytics-card">
                <h3>Asset Allocation</h3>
                <div className="chart-placeholder">
                  <p>📊 Pie chart showing asset distribution by type</p>
                </div>
              </div>
              <div className="analytics-card">
                <h3>Performance Over Time</h3>
                <div className="chart-placeholder">
                  <p>📈 Line chart showing portfolio value over time</p>
                </div>
              </div>
            </div>
            <div className="performance-metrics">
              <h3>Performance Metrics</h3>
              <div className="metrics-grid">
                <div className="metric-card">
                  <div className="metric-label">Best Performer</div>
                  <div className="metric-value">ETH (+75%)</div>
                </div>
                <div className="metric-card">
                  <div className="metric-label">Worst Performer</div>
                  <div className="metric-value">TSLA (+22.5%)</div>
                </div>
                <div className="metric-card">
                  <div className="metric-label">Avg. Return</div>
                  <div className="metric-value">{portfolioStats.profitPercentage.toFixed(2)}%</div>
                </div>
                <div className="metric-card">
                  <div className="metric-label">Volatility</div>
                  <div className="metric-value">Medium</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'markets' && (
          <div className="markets-section">
            <h2>Market Overview</h2>
            <div className="market-stats">
              <div className="market-card">
                <h3>Cryptocurrency</h3>
                <div className="market-items">
                  <div className="market-item">
                    <span>BTC</span>
                    <span className="positive">$67,000 (+3.5%)</span>
                  </div>
                  <div className="market-item">
                    <span>ETH</span>
                    <span className="positive">$3,500 (+5.2%)</span>
                  </div>
                  <div className="market-item">
                    <span>BNB</span>
                    <span className="negative">$580 (-1.2%)</span>
                  </div>
                </div>
              </div>
              <div className="market-card">
                <h3>Stock Market</h3>
                <div className="market-items">
                  <div className="market-item">
                    <span>S&P 500</span>
                    <span className="positive">5,850 (+0.8%)</span>
                  </div>
                  <div className="market-item">
                    <span>NASDAQ</span>
                    <span className="positive">18,200 (+1.2%)</span>
                  </div>
                  <div className="market-item">
                    <span>DOW</span>
                    <span className="negative">42,500 (-0.3%)</span>
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

export default FinanceDashboard;

