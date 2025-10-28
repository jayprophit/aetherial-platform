import React, { useState } from 'react';
import './TradingPlatform.css';

interface Asset {
  id: string;
  symbol: string;
  name: string;
  type: 'stock' | 'crypto' | 'forex' | 'commodity';
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  marketCap: string;
  high24h: number;
  low24h: number;
}

interface Position {
  id: string;
  asset: string;
  symbol: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  totalValue: number;
  profitLoss: number;
  profitLossPercent: number;
}

const TradingPlatform: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'markets' | 'portfolio' | 'trade' | 'ai-trading'>('markets');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');

  const assets: Asset[] = [
    {
      id: '1',
      symbol: 'BTC',
      name: 'Bitcoin',
      type: 'crypto',
      price: 67845.32,
      change: 2345.67,
      changePercent: 3.58,
      volume: '$45.2B',
      marketCap: '$1.32T',
      high24h: 68234.56,
      low24h: 65432.10
    },
    {
      id: '2',
      symbol: 'ETH',
      name: 'Ethereum',
      type: 'crypto',
      price: 3456.78,
      change: -123.45,
      changePercent: -3.45,
      volume: '$18.5B',
      marketCap: '$415B',
      high24h: 3589.90,
      low24h: 3401.23
    },
    {
      id: '3',
      symbol: 'AAPL',
      name: 'Apple Inc.',
      type: 'stock',
      price: 178.45,
      change: 2.34,
      changePercent: 1.33,
      volume: '$67.8M',
      marketCap: '$2.8T',
      high24h: 179.23,
      low24h: 176.12
    },
    {
      id: '4',
      symbol: 'TSLA',
      name: 'Tesla Inc.',
      type: 'stock',
      price: 234.56,
      change: -5.67,
      changePercent: -2.36,
      volume: '$45.2M',
      marketCap: '$745B',
      high24h: 241.23,
      low24h: 232.45
    },
    {
      id: '5',
      symbol: 'EUR/USD',
      name: 'Euro / US Dollar',
      type: 'forex',
      price: 1.0856,
      change: 0.0023,
      changePercent: 0.21,
      volume: '$1.2T',
      marketCap: '-',
      high24h: 1.0879,
      low24h: 1.0834
    },
    {
      id: '6',
      symbol: 'GOLD',
      name: 'Gold',
      type: 'commodity',
      price: 2034.56,
      change: 12.34,
      changePercent: 0.61,
      volume: '$156B',
      marketCap: '-',
      high24h: 2045.67,
      low24h: 2021.23
    }
  ];

  const portfolio: Position[] = [
    {
      id: '1',
      asset: 'Bitcoin',
      symbol: 'BTC',
      quantity: 0.5,
      avgPrice: 65000.00,
      currentPrice: 67845.32,
      totalValue: 33922.66,
      profitLoss: 1422.66,
      profitLossPercent: 4.38
    },
    {
      id: '2',
      asset: 'Ethereum',
      symbol: 'ETH',
      quantity: 5.0,
      avgPrice: 3500.00,
      currentPrice: 3456.78,
      totalValue: 17283.90,
      profitLoss: -216.10,
      profitLossPercent: -1.23
    },
    {
      id: '3',
      asset: 'Apple Inc.',
      symbol: 'AAPL',
      quantity: 100,
      avgPrice: 175.00,
      currentPrice: 178.45,
      totalValue: 17845.00,
      profitLoss: 345.00,
      profitLossPercent: 1.97
    }
  ];

  const totalPortfolioValue = portfolio.reduce((sum, pos) => sum + pos.totalValue, 0);
  const totalProfitLoss = portfolio.reduce((sum, pos) => sum + pos.profitLoss, 0);
  const totalProfitLossPercent = (totalProfitLoss / (totalPortfolioValue - totalProfitLoss)) * 100;

  return (
    <div className="trading-platform">
      <div className="trading-container">
        {/* Header */}
        <div className="trading-header">
          <div>
            <h1>Trading Platform</h1>
            <p>Trade stocks, crypto, forex, and commodities with AI-powered insights</p>
          </div>
          <div className="header-stats">
            <div className="stat-item-trading">
              <span className="stat-label-trading">Portfolio Value</span>
              <span className="stat-value-trading">${totalPortfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="stat-item-trading">
              <span className="stat-label-trading">Today's P/L</span>
              <span className={`stat-value-trading ${totalProfitLoss >= 0 ? 'positive' : 'negative'}`}>
                {totalProfitLoss >= 0 ? '+' : ''}${totalProfitLoss.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                ({totalProfitLoss >= 0 ? '+' : ''}{totalProfitLossPercent.toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="trading-tabs">
          <button
            className={activeTab === 'markets' ? 'active' : ''}
            onClick={() => setActiveTab('markets')}
          >
            📊 Markets
          </button>
          <button
            className={activeTab === 'portfolio' ? 'active' : ''}
            onClick={() => setActiveTab('portfolio')}
          >
            💼 Portfolio
          </button>
          <button
            className={activeTab === 'trade' ? 'active' : ''}
            onClick={() => setActiveTab('trade')}
          >
            💱 Trade
          </button>
          <button
            className={activeTab === 'ai-trading' ? 'active' : ''}
            onClick={() => setActiveTab('ai-trading')}
          >
            🤖 AI Trading
          </button>
        </div>

        {/* Markets Tab */}
        {activeTab === 'markets' && (
          <div className="markets-content">
            <div className="markets-filters">
              <button className="filter-btn-trading active">All</button>
              <button className="filter-btn-trading">Crypto</button>
              <button className="filter-btn-trading">Stocks</button>
              <button className="filter-btn-trading">Forex</button>
              <button className="filter-btn-trading">Commodities</button>
            </div>

            <div className="markets-table">
              <table>
                <thead>
                  <tr>
                    <th>Asset</th>
                    <th>Price</th>
                    <th>24h Change</th>
                    <th>24h Volume</th>
                    <th>Market Cap</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {assets.map(asset => (
                    <tr key={asset.id} onClick={() => setSelectedAsset(asset)}>
                      <td>
                        <div className="asset-info">
                          <strong>{asset.symbol}</strong>
                          <span className="asset-name">{asset.name}</span>
                        </div>
                      </td>
                      <td className="price-cell">${asset.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td className={asset.change >= 0 ? 'positive' : 'negative'}>
                        {asset.change >= 0 ? '+' : ''}{asset.changePercent.toFixed(2)}%
                        <br />
                        <span className="change-amount">
                          {asset.change >= 0 ? '+' : ''}${Math.abs(asset.change).toFixed(2)}
                        </span>
                      </td>
                      <td>{asset.volume}</td>
                      <td>{asset.marketCap}</td>
                      <td>
                        <button className="trade-btn-small">Trade</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Portfolio Tab */}
        {activeTab === 'portfolio' && (
          <div className="portfolio-content">
            <div className="portfolio-summary">
              <div className="summary-card-trading">
                <h3>Total Value</h3>
                <p className="summary-value">${totalPortfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
              <div className="summary-card-trading">
                <h3>Total P/L</h3>
                <p className={`summary-value ${totalProfitLoss >= 0 ? 'positive' : 'negative'}`}>
                  {totalProfitLoss >= 0 ? '+' : ''}${totalProfitLoss.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div className="summary-card-trading">
                <h3>Total Return</h3>
                <p className={`summary-value ${totalProfitLossPercent >= 0 ? 'positive' : 'negative'}`}>
                  {totalProfitLossPercent >= 0 ? '+' : ''}{totalProfitLossPercent.toFixed(2)}%
                </p>
              </div>
            </div>

            <div className="positions-table">
              <h3>Your Positions</h3>
              <table>
                <thead>
                  <tr>
                    <th>Asset</th>
                    <th>Quantity</th>
                    <th>Avg Price</th>
                    <th>Current Price</th>
                    <th>Total Value</th>
                    <th>P/L</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolio.map(position => (
                    <tr key={position.id}>
                      <td>
                        <div className="asset-info">
                          <strong>{position.symbol}</strong>
                          <span className="asset-name">{position.asset}</span>
                        </div>
                      </td>
                      <td>{position.quantity}</td>
                      <td>${position.avgPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td>${position.currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td>${position.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td className={position.profitLoss >= 0 ? 'positive' : 'negative'}>
                        {position.profitLoss >= 0 ? '+' : ''}${position.profitLoss.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        <br />
                        <span className="change-percent">
                          ({position.profitLoss >= 0 ? '+' : ''}{position.profitLossPercent.toFixed(2)}%)
                        </span>
                      </td>
                      <td>
                        <button className="sell-btn-small">Sell</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Trade Tab */}
        {activeTab === 'trade' && (
          <div className="trade-content">
            <div className="trade-panel">
              <div className="trade-type-selector">
                <button
                  className={tradeType === 'buy' ? 'active buy' : 'buy'}
                  onClick={() => setTradeType('buy')}
                >
                  Buy
                </button>
                <button
                  className={tradeType === 'sell' ? 'active sell' : 'sell'}
                  onClick={() => setTradeType('sell')}
                >
                  Sell
                </button>
              </div>

              <div className="trade-form">
                <div className="form-group-trading">
                  <label>Asset</label>
                  <select>
                    <option>Select an asset</option>
                    {assets.map(asset => (
                      <option key={asset.id} value={asset.symbol}>
                        {asset.symbol} - {asset.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group-trading">
                  <label>Order Type</label>
                  <div className="order-type-selector">
                    <button
                      className={orderType === 'market' ? 'active' : ''}
                      onClick={() => setOrderType('market')}
                    >
                      Market
                    </button>
                    <button
                      className={orderType === 'limit' ? 'active' : ''}
                      onClick={() => setOrderType('limit')}
                    >
                      Limit
                    </button>
                  </div>
                </div>

                {orderType === 'limit' && (
                  <div className="form-group-trading">
                    <label>Limit Price</label>
                    <input type="number" placeholder="0.00" />
                  </div>
                )}

                <div className="form-group-trading">
                  <label>Quantity</label>
                  <input type="number" placeholder="0.00" />
                </div>

                <div className="form-group-trading">
                  <label>Total</label>
                  <input type="number" placeholder="0.00" disabled />
                </div>

                <button className={`submit-trade-btn ${tradeType}`}>
                  {tradeType === 'buy' ? 'Buy' : 'Sell'}
                </button>
              </div>
            </div>

            <div className="chart-panel">
              <div className="chart-placeholder">
                📈 TradingView Chart
                <p>Real-time price chart with technical indicators</p>
              </div>
            </div>
          </div>
        )}

        {/* AI Trading Tab */}
        {activeTab === 'ai-trading' && (
          <div className="ai-trading-content">
            <div className="ai-features-grid">
              <div className="ai-feature-card">
                <div className="ai-icon">🤖</div>
                <h3>AI Trading Bot</h3>
                <p>Automated trading with machine learning algorithms</p>
                <button className="ai-btn">Configure Bot</button>
              </div>
              <div className="ai-feature-card">
                <div className="ai-icon">📊</div>
                <h3>Market Analysis</h3>
                <p>AI-powered market insights and predictions</p>
                <button className="ai-btn">View Analysis</button>
              </div>
              <div className="ai-feature-card">
                <div className="ai-icon">⚡</div>
                <h3>Flash Loan Trading</h3>
                <p>Execute arbitrage opportunities with flash loans</p>
                <button className="ai-btn">Start Trading</button>
              </div>
              <div className="ai-feature-card">
                <div className="ai-icon">🎯</div>
                <h3>Portfolio Optimization</h3>
                <p>AI-driven portfolio rebalancing and optimization</p>
                <button className="ai-btn">Optimize Now</button>
              </div>
            </div>

            <div className="ai-signals">
              <h3>AI Trading Signals</h3>
              <div className="signals-list">
                <div className="signal-item buy">
                  <span className="signal-badge">BUY</span>
                  <div className="signal-info">
                    <strong>BTC/USD</strong>
                    <span>Strong bullish momentum detected</span>
                  </div>
                  <span className="signal-confidence">95% confidence</span>
                </div>
                <div className="signal-item sell">
                  <span className="signal-badge">SELL</span>
                  <div className="signal-info">
                    <strong>ETH/USD</strong>
                    <span>Overbought conditions, potential correction</span>
                  </div>
                  <span className="signal-confidence">87% confidence</span>
                </div>
                <div className="signal-item hold">
                  <span className="signal-badge">HOLD</span>
                  <div className="signal-info">
                    <strong>AAPL</strong>
                    <span>Consolidation phase, wait for breakout</span>
                  </div>
                  <span className="signal-confidence">78% confidence</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TradingPlatform;

