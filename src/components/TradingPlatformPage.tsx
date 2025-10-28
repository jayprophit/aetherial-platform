import React, { useState, useEffect, useMemo } from 'react';
import './TradingPlatformPage.css'; // Assuming a CSS file for styling

// =============================================================================
// 1. TypeScript Interfaces and Types
// =============================================================================

// Type for the asset being traded (e.g., BTC/USD, ETH/EUR, EUR/USD)
export type TradingPair = string;

// Interface for a single order in the Order Book
export interface Order {
  price: number; // Price of the asset
  size: number; // Quantity of the asset at that price
  type: 'buy' | 'sell'; // Order type
}

// Interface for a single trade in the Recent Trades list
export interface Trade {
  id: string;
  time: string; // ISO string or formatted time
  price: number;
  size: number;
  type: 'buy' | 'sell';
}

// Interface for a user's portfolio asset summary
export interface PortfolioAsset {
  asset: TradingPair; // e.g., "BTC"
  balance: number; // Current balance
  usdValue: number; // Current value in USD
  profitLoss: number; // P&L in USD
  profitLossPercent: number; // P&L in percentage
}

// Interface for the overall market data (simulating a live feed)
export interface MarketData {
  lastPrice: number;
  high: number;
  low: number;
  volume: number;
  change: number; // Price change in 24h
  changePercent: number; // Price change percentage in 24h
}

// Interface for the component's props (though none are strictly needed for a full page)
export interface TradingPlatformPageProps {
  // Could accept initial trading pair or user ID here
}

// =============================================================================
// 2. Sample Data (Simulating API Fetch)
// =============================================================================

const mockMarketData: MarketData = {
  lastPrice: 65432.10,
  high: 66000.00,
  low: 64500.00,
  volume: 12345.67,
  change: -567.89,
  changePercent: -0.86,
};

const mockOrderBook: Order[] = [
  // Sell (Asks)
  { price: 65435.00, size: 0.5, type: 'sell' },
  { price: 65436.50, size: 1.2, type: 'sell' },
  { price: 65438.00, size: 2.0, type: 'sell' },
  // Buy (Bids)
  { price: 65430.00, size: 3.5, type: 'buy' },
  { price: 65428.50, size: 0.8, type: 'buy' },
  { price: 65427.00, size: 1.5, type: 'buy' },
];

const mockPortfolio: PortfolioAsset[] = [
  { asset: 'BTC', balance: 0.15, usdValue: 9814.82, profitLoss: 500.00, profitLossPercent: 5.37 },
  { asset: 'ETH', balance: 2.5, usdValue: 8750.00, profitLoss: -150.00, profitLossPercent: -1.69 },
  { asset: 'USD', balance: 1500.00, usdValue: 1500.00, profitLoss: 0.00, profitLossPercent: 0.00 },
];

// =============================================================================
// 3. Helper Components (for structure and reusability)
// =============================================================================

// Simple component to display market data
const MarketSummary: React.FC<{ data: MarketData, pair: TradingPair }> = ({ data, pair }) => (
  <div className="market-summary">
    <h2 className="market-summary__pair">{pair}</h2>
    <div className="market-summary__price-info">
      <span className={`market-summary__price ${data.change > 0 ? 'positive' : 'negative'}`}>
        {data.lastPrice.toFixed(2)}
      </span>
      <span className="market-summary__change">
        {data.change.toFixed(2)} ({data.changePercent.toFixed(2)}%)
      </span>
    </div>
    <div className="market-summary__stats">
      <span>High: {data.high.toFixed(2)}</span>
      <span>Low: {data.low.toFixed(2)}</span>
      <span>Volume: {data.volume.toFixed(2)}</span>
    </div>
  </div>
);

// =============================================================================
// 4. Main Component: TradingPlatformPage
// =============================================================================

const TradingPlatformPage: React.FC<TradingPlatformPageProps> = () => {
  // State for the currently selected trading pair
  const [selectedPair, setSelectedPair] = useState<TradingPair>('BTC/USD');
  // State for the order book data
  const [orderBook, setOrderBook] = useState<Order[]>(mockOrderBook);
  // State for the current market data
  const [marketData, setMarketData] = useState<MarketData>(mockMarketData);
  // State for the trade form inputs
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  // State for AI-powered trade suggestions (AETHERIAL Enhancement)
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);

  // Simulate fetching/updating data from an API (using useEffect)
  useEffect(() => {
    // In a real application, this would establish a WebSocket connection or
    // poll an API endpoint to get live data.
    const interval = setInterval(() => {
      // Simulate price fluctuation
      const newPrice = marketData.lastPrice + (Math.random() - 0.5) * 10;
      const newChange = newPrice - mockMarketData.lastPrice;
      setMarketData(prev => ({
        ...prev,
        lastPrice: newPrice,
        change: newChange,
        changePercent: (newChange / mockMarketData.lastPrice) * 100,
      }));

      // Simulate AI suggestion (AETHERIAL Enhancement)
      if (Math.random() < 0.2) { // 20% chance of a new suggestion
        const suggestions = [
          "AI: Strong 'Buy' signal detected. Target 65500.",
          "AI: Market is consolidating. Consider a 'Limit Order'.",
          "AI: Bearish divergence on RSI. Short-term 'Sell' advised.",
        ];
        setAiSuggestion(suggestions[Math.floor(Math.random() * suggestions.length)]);
      } else if (Math.random() > 0.95) {
         setAiSuggestion(null); // Clear suggestion
      }

    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [marketData.lastPrice]);

  // Derived state for easy access to Bids and Asks
  const { bids, asks } = useMemo(() => {
    const sortedOrders = [...orderBook].sort((a, b) => b.price - a.price);
    return {
      bids: sortedOrders.filter(o => o.type === 'buy').slice(0, 10),
      asks: sortedOrders.filter(o => o.type === 'sell').slice(0, 10).reverse(),
    };
  }, [orderBook]);

  // Handler for submitting a trade
  const handleTradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tradeAmount = parseFloat(amount);
    const tradePrice = parseFloat(price);

    if (isNaN(tradeAmount) || isNaN(tradePrice) || tradeAmount <= 0 || tradePrice <= 0) {
      alert('Please enter valid amount and price.');
      return;
    }

    // In a real app, this would call an API to place the order
    console.log(`Submitting ${tradeType} order for ${tradeAmount} ${selectedPair.split('/')[0]} at ${tradePrice} ${selectedPair.split('/')[1]}`);

    // Simple state reset after submission
    setAmount('');
    setPrice('');
    alert(`Order submitted: ${tradeType.toUpperCase()} ${tradeAmount} @ ${tradePrice}`);
  };

  // Handler for AI-powered trade execution (AETHERIAL Enhancement)
  const handleAITrade = () => {
    // This simulates a 'DeFi' smart contract interaction or an AI-driven trade
    console.log("Executing AI-Optimized Trade...");
    alert("AI-Optimized Trade Executed via AETHERIAL Smart Contract.");
    setAiSuggestion(null); // Clear suggestion after execution
  };

  // Render the Order Book component
  const renderOrderBook = () => (
    <div className="order-book">
      <h3>Order Book ({selectedPair})</h3>
      <div className="order-book__grid">
        {/* Asks (Sells) */}
        <div className="order-book__asks">
          <div className="order-book__header"><span>Price ({selectedPair.split('/')[1]})</span><span>Size ({selectedPair.split('/')[0]})</span></div>
          {asks.map((order, index) => (
            <div key={index} className="order-book__row sell">
              <span className="price">{order.price.toFixed(2)}</span>
              <span className="size">{order.size.toFixed(4)}</span>
            </div>
          ))}
        </div>

        {/* Mid Price */}
        <div className="order-book__mid-price">
          <span className={`price ${marketData.change > 0 ? 'positive' : 'negative'}`}>
            {marketData.lastPrice.toFixed(2)}
          </span>
        </div>

        {/* Bids (Buys) */}
        <div className="order-book__bids">
          <div className="order-book__header"><span>Price ({selectedPair.split('/')[1]})</span><span>Size ({selectedPair.split('/')[0]})</span></div>
          {bids.map((order, index) => (
            <div key={index} className="order-book__row buy">
              <span className="price">{order.price.toFixed(2)}</span>
              <span className="size">{order.size.toFixed(4)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Render the Trade Form component
  const renderTradeForm = () => (
    <div className="trade-form">
      <h3>Place Order</h3>
      <div className="trade-form__toggle">
        <button
          className={tradeType === 'buy' ? 'active' : ''}
          onClick={() => setTradeType('buy')}
        >
          Buy {selectedPair.split('/')[0]}
        </button>
        <button
          className={tradeType === 'sell' ? 'active' : ''}
          onClick={() => setTradeType('sell')}
        >
          Sell {selectedPair.split('/')[0]}
        </button>
      </div>

      <form onSubmit={handleTradeSubmit}>
        <div className="form-group">
          <label htmlFor="price">Price ({selectedPair.split('/')[1]})</label>
          <input
            id="price"
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Limit Price"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="amount">Amount ({selectedPair.split('/')[0]})</label>
          <input
            id="amount"
            type="number"
            step="0.0001"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            required
          />
        </div>
        <button type="submit" className={`trade-form__submit ${tradeType}`}>
          {tradeType.toUpperCase()} {selectedPair.split('/')[0]}
        </button>
      </form>

      {/* AETHERIAL AI Suggestion/Execution */}
      {aiSuggestion && (
        <div className="ai-suggestion-box">
          <p>{aiSuggestion}</p>
          <button onClick={handleAITrade} className="ai-suggestion__button">
            Execute AI Trade
          </button>
        </div>
      )}

      {/* Blockchain Integration Feature */}
      <div className="blockchain-feature">
        <p>
          <span role="img" aria-label="lock">🔒</span>
          Blockchain Settlement: All trades secured by AETHERIAL's Layer 2 solution.
        </p>
      </div>
    </div>
  );

  // Render the Portfolio Summary component
  const renderPortfolioSummary = () => (
    <div className="portfolio-summary">
      <h3>Portfolio Summary</h3>
      <table>
        <thead>
          <tr>
            <th>Asset</th>
            <th>Balance</th>
            <th>Value (USD)</th>
            <th>P&L (24h)</th>
          </tr>
        </thead>
        <tbody>
          {mockPortfolio.map((asset) => (
            <tr key={asset.asset}>
              <td>{asset.asset}</td>
              <td>{asset.balance.toFixed(4)}</td>
              <td>${asset.usdValue.toFixed(2)}</td>
              <td className={asset.profitLoss > 0 ? 'positive' : asset.profitLoss < 0 ? 'negative' : ''}>
                {asset.profitLoss.toFixed(2)} ({asset.profitLossPercent.toFixed(2)}%)
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="portfolio-actions">
        <button onClick={() => alert('Navigating to Deposit page.')}>Deposit</button>
        <button onClick={() => alert('Navigating to Withdraw page.')}>Withdraw</button>
        {/* DeFi Integration Feature */}
        <button onClick={() => alert('Connecting to AETHERIAL DeFi Staking Pool.')}>
          DeFi Staking
        </button>
      </div>
    </div>
  );

  // Render the Chart Placeholder
  const renderChart = () => (
    <div className="chart-container">
      {/* In a real app, this would be a charting library like TradingView, Recharts, or Nivo */}
      <div className="chart-placeholder">
        <p>Interactive Trading Chart for {selectedPair}</p>
        <p>Timeframe: 1H | Indicators: MA, RSI, MACD</p>
        {/* Responsive design consideration: Chart will fill its container */}
      </div>
      <div className="chart-filters">
        <button onClick={() => console.log('1H selected')}>1H</button>
        <button onClick={() => console.log('4H selected')}>4H</button>
        <button onClick={() => console.log('1D selected')}>1D</button>
        <button onClick={() => console.log('1W selected')}>1W</button>
        <button onClick={() => console.log('Add Indicator clicked')}>+ Indicator</button>
      </div>
    </div>
  );

  return (
    <div className="trading-platform-page">
      {/* Header/Market Summary Section */}
      <header className="trading-platform-header">
        <div className="pair-selector">
          <label htmlFor="pair-select">Trading Pair:</label>
          <select
            id="pair-select"
            value={selectedPair}
            onChange={(e) => setSelectedPair(e.target.value)}
          >
            <option value="BTC/USD">BTC/USD (Crypto)</option>
            <option value="ETH/USD">ETH/USD (Crypto)</option>
            <option value="EUR/USD">EUR/USD (Forex)</option>
            <option value="XAU/USD">XAU/USD (Commodity)</option>
          </select>
        </div>
        <MarketSummary data={marketData} pair={selectedPair} />
      </header>

      {/* Main Trading Grid (Responsive Layout) */}
      <main className="trading-platform-main-grid">
        {/* Left Column: Chart */}
        <section className="grid-item chart-area">
          {renderChart()}
        </section>

        {/* Right Column Top: Trade Form */}
        <section className="grid-item trade-form-area">
          {renderTradeForm()}
        </section>

        {/* Right Column Middle: Order Book */}
        <section className="grid-item order-book-area">
          {renderOrderBook()}
        </section>

        {/* Bottom Section: Portfolio Summary (Full Width on smaller screens) */}
        <section className="grid-item portfolio-area">
          {renderPortfolioSummary()}
        </section>

        {/* Optional: Recent Trades/News Feed (Placeholder) */}
        <section className="grid-item news-feed-area">
          <h3>Recent Trades/News</h3>
          <p>Live Trade Feed and AETHERIAL AI News Sentiment Analysis (Placeholder)</p>
        </section>
      </main>

      {/* Note on CSS: The responsiveness and layout are heavily dependent on the associated CSS file (TradingPlatformPage.css).
          The class names are designed for a flexible grid layout (e.g., using CSS Grid or Flexbox)
          to ensure a professional, responsive trading view.
      */}
    </div>
  );
};

export default TradingPlatformPage;

// =============================================================================
// Placeholder CSS for reference (Would be in TradingPlatformPage.css)
// =============================================================================
/*
.trading-platform-page {
  padding: 20px;
  background-color: #1a1a2e;
  color: #e0e0e0;
  min-height: 100vh;
  font-family: Arial, sans-serif;
}

.trading-platform-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 10px;
  background-color: #2a2a4a;
  border-radius: 8px;
}

.market-summary {
  display: flex;
  gap: 30px;
  align-items: center;
}

.market-summary__price {
  font-size: 2em;
  font-weight: bold;
}

.positive { color: #00ff80; }
.negative { color: #ff4d4d; }

.trading-platform-main-grid {
  display: grid;
  grid-template-columns: 3fr 1fr;
  grid-template-rows: auto auto 1fr;
  gap: 20px;
}

.chart-area { grid-column: 1 / 2; grid-row: 1 / 3; }
.trade-form-area { grid-column: 2 / 3; grid-row: 1 / 2; }
.order-book-area { grid-column: 2 / 3; grid-row: 2 / 3; }
.portfolio-area { grid-column: 1 / 3; grid-row: 3 / 4; }
.news-feed-area { grid-column: 1 / 3; grid-row: 4 / 5; }

// Responsive Design for smaller screens
@media (max-width: 1200px) {
  .trading-platform-main-grid {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
  }
  .chart-area, .trade-form-area, .order-book-area, .portfolio-area, .news-feed-area {
    grid-column: 1 / 2;
    grid-row: auto;
  }
}

.chart-placeholder {
  background-color: #111122;
  height: 500px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
}

.order-book__grid {
  display: grid;
  grid-template-columns: 1fr;
}

.order-book__asks, .order-book__bids {
  max-height: 250px;
  overflow-y: auto;
}

.order-book__row {
  display: flex;
  justify-content: space-between;
  padding: 5px;
}

.order-book__row.sell { background-color: rgba(255, 77, 77, 0.1); }
.order-book__row.buy { background-color: rgba(0, 255, 128, 0.1); }

.order-book__mid-price {
  text-align: center;
  padding: 5px 0;
  font-weight: bold;
  border-top: 1px solid #333;
  border-bottom: 1px solid #333;
}

.trade-form button.buy { background-color: #00ff80; color: #1a1a2e; }
.trade-form button.sell { background-color: #ff4d4d; color: #1a1a2e; }

.ai-suggestion-box {
  margin-top: 15px;
  padding: 10px;
  border: 1px solid #00ff80;
  border-radius: 4px;
  background-color: rgba(0, 255, 128, 0.1);
  text-align: center;
}
*/
