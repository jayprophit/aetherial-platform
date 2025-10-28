/**
 * AETHERIAL Platform - Advanced Trading Platform
 * 
 * TradingView-style interface with multiple exchange integrations
 * Features: Spot/Futures/Options trading, AI analysis, portfolio management
 * Exchanges: Coinbase, Binance, Kraken, Crypto.com
 * Data: CoinMarketCap, CoinGecko, and more
 */

import React, { useState, useEffect, useRef } from 'react';
import { unifiedSystemHub } from '../../lib/integration/unified-system-hub';
import './AdvancedTradingPlatform.css';

// ============================================
// TYPES & INTERFACES
// ============================================

interface Exchange {
  id: string;
  name: string;
  connected: boolean;
  apiKey?: string;
  balance?: Record<string, number>;
}

interface Asset {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  rank: number;
}

interface Order {
  id: string;
  exchange: string;
  type: 'market' | 'limit' | 'stop-loss' | 'take-profit';
  side: 'buy' | 'sell';
  symbol: string;
  amount: number;
  price?: number;
  status: 'pending' | 'filled' | 'cancelled' | 'rejected';
  timestamp: Date;
}

interface Trade {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  price: number;
  amount: number;
  timestamp: Date;
}

interface Candle {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface TradingStrategy {
  id: string;
  name: string;
  type: 'scalping' | 'day-trading' | 'swing' | 'hodl' | 'arbitrage';
  active: boolean;
  profitLoss: number;
  winRate: number;
}

interface AISignal {
  id: string;
  symbol: string;
  action: 'buy' | 'sell' | 'hold';
  confidence: number;
  reasoning: string;
  timestamp: Date;
}

// ============================================
// MAIN COMPONENT
// ============================================

export const AdvancedTradingPlatform: React.FC = () => {
  // State
  const [exchanges, setExchanges] = useState<Exchange[]>([
    { id: 'coinbase', name: 'Coinbase', connected: false },
    { id: 'binance', name: 'Binance', connected: false },
    { id: 'kraken', name: 'Kraken', connected: false },
    { id: 'crypto-com', name: 'Crypto.com', connected: false },
  ]);
  
  const [selectedExchange, setSelectedExchange] = useState<string>('binance');
  const [selectedSymbol, setSelectedSymbol] = useState<string>('BTC/USDT');
  const [timeframe, setTimeframe] = useState<string>('1h');
  const [chartType, setChartType] = useState<'candlestick' | 'line' | 'area'>('candlestick');
  
  const [assets, setAssets] = useState<Asset[]>([]);
  const [candles, setCandles] = useState<Candle[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [strategies, setStrategies] = useState<TradingStrategy[]>([]);
  const [aiSignals, setAISignals] = useState<AISignal[]>([]);
  
  const [orderType, setOrderType] = useState<'market' | 'limit'>('limit');
  const [orderSide, setOrderSide] = useState<'buy' | 'sell'>('buy');
  const [orderAmount, setOrderAmount] = useState<string>('');
  const [orderPrice, setOrderPrice] = useState<string>('');
  
  const [portfolio, setPortfolio] = useState<Record<string, number>>({});
  const [totalValue, setTotalValue] = useState<number>(0);
  
  const [view, setView] = useState<'trading' | 'portfolio' | 'strategies' | 'ai-signals'>('trading');
  
  const chartRef = useRef<HTMLCanvasElement>(null);

  // ============================================
  // DATA FETCHING
  // ============================================

  useEffect(() => {
    // Fetch market data from CoinMarketCap
    fetchMarketData();
    
    // Subscribe to real-time price updates
    subscribeToRealTimeData();
    
    // Fetch user portfolio
    fetchPortfolio();
    
    // Initialize AI trading bot
    initializeAIBot();
    
    const interval = setInterval(() => {
      fetchMarketData();
      updateChart();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [selectedSymbol, timeframe]);

  const fetchMarketData = async () => {
    try {
      // Fetch from CoinMarketCap API
      const response = await fetch('/api/trading/market-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbols: [selectedSymbol] }),
      });
      
      const data = await response.json();
      
      if (data.assets) {
        setAssets(data.assets);
      }
      
      if (data.candles) {
        setCandles(data.candles);
      }
    } catch (error) {
      console.error('Error fetching market data:', error);
    }
  };

  const subscribeToRealTimeData = () => {
    unifiedSystemHub.on('trading:price-update', (data: any) => {
      if (data.symbol === selectedSymbol) {
        // Update current price
        setAssets(prev => prev.map(asset => 
          asset.symbol === data.symbol 
            ? { ...asset, price: data.price, change24h: data.change24h }
            : asset
        ));
        
        // Add new candle data
        if (data.candle) {
          setCandles(prev => [...prev.slice(-999), data.candle]);
        }
      }
    });
    
    unifiedSystemHub.on('trading:order-update', (order: Order) => {
      setOrders(prev => {
        const index = prev.findIndex(o => o.id === order.id);
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = order;
          return updated;
        }
        return [order, ...prev];
      });
    });
    
    unifiedSystemHub.on('trading:ai-signal', (signal: AISignal) => {
      setAISignals(prev => [signal, ...prev.slice(0, 49)]);
    });
  };

  const fetchPortfolio = async () => {
    try {
      const response = await fetch('/api/trading/portfolio');
      const data = await response.json();
      
      setPortfolio(data.holdings);
      setTotalValue(data.totalValue);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    }
  };

  const initializeAIBot = () => {
    unifiedSystemHub.publishEvent({
      id: `trading-ai-init-${Date.now()}`,
      timestamp: new Date(),
      source: 'trading-platform',
      type: 'trading.ai.initialize',
      data: {
        symbols: [selectedSymbol],
        strategies: ['momentum', 'mean-reversion', 'arbitrage'],
      },
      priority: 'high',
      propagate: true,
    });
  };

  // ============================================
  // CHART RENDERING
  // ============================================

  useEffect(() => {
    if (chartRef.current && candles.length > 0) {
      renderChart();
    }
  }, [candles, chartType]);

  const renderChart = () => {
    const canvas = chartRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Calculate price range
    const prices = candles.flatMap(c => [c.high, c.low]);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;
    
    // Draw grid
    ctx.strokeStyle = '#2a2a2a';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
      const y = (height / 10) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    
    // Draw candles
    const candleWidth = width / candles.length;
    
    candles.forEach((candle, index) => {
      const x = index * candleWidth;
      const openY = height - ((candle.open - minPrice) / priceRange) * height;
      const closeY = height - ((candle.close - minPrice) / priceRange) * height;
      const highY = height - ((candle.high - minPrice) / priceRange) * height;
      const lowY = height - ((candle.low - minPrice) / priceRange) * height;
      
      // Determine color
      const isGreen = candle.close >= candle.open;
      ctx.fillStyle = isGreen ? '#26a69a' : '#ef5350';
      ctx.strokeStyle = isGreen ? '#26a69a' : '#ef5350';
      
      if (chartType === 'candlestick') {
        // Draw wick
        ctx.beginPath();
        ctx.moveTo(x + candleWidth / 2, highY);
        ctx.lineTo(x + candleWidth / 2, lowY);
        ctx.stroke();
        
        // Draw body
        const bodyHeight = Math.abs(closeY - openY);
        const bodyY = Math.min(openY, closeY);
        ctx.fillRect(x + 1, bodyY, candleWidth - 2, bodyHeight || 1);
      } else if (chartType === 'line') {
        if (index > 0) {
          const prevCandle = candles[index - 1];
          const prevCloseY = height - ((prevCandle.close - minPrice) / priceRange) * height;
          
          ctx.beginPath();
          ctx.moveTo((index - 1) * candleWidth + candleWidth / 2, prevCloseY);
          ctx.lineTo(x + candleWidth / 2, closeY);
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      } else if (chartType === 'area') {
        // Area chart implementation
        if (index === 0) {
          ctx.beginPath();
          ctx.moveTo(x, closeY);
        } else {
          ctx.lineTo(x, closeY);
        }
        
        if (index === candles.length - 1) {
          ctx.lineTo(x, height);
          ctx.lineTo(0, height);
          ctx.closePath();
          ctx.fillStyle = 'rgba(38, 166, 154, 0.2)';
          ctx.fill();
        }
      }
    });
    
    // Draw price labels
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px monospace';
    for (let i = 0; i <= 5; i++) {
      const price = minPrice + (priceRange / 5) * i;
      const y = height - (height / 5) * i;
      ctx.fillText(price.toFixed(2), 10, y);
    }
  };

  // ============================================
  // ORDER PLACEMENT
  // ============================================

  const placeOrder = async () => {
    if (!orderAmount || (orderType === 'limit' && !orderPrice)) {
      alert('Please fill in all order fields');
      return;
    }
    
    const order: Order = {
      id: `order-${Date.now()}`,
      exchange: selectedExchange,
      type: orderType,
      side: orderSide,
      symbol: selectedSymbol,
      amount: parseFloat(orderAmount),
      price: orderType === 'limit' ? parseFloat(orderPrice) : undefined,
      status: 'pending',
      timestamp: new Date(),
    };
    
    try {
      const response = await fetch('/api/trading/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setOrders(prev => [result.order, ...prev]);
        setOrderAmount('');
        setOrderPrice('');
        
        // Publish event
        unifiedSystemHub.publishEvent({
          id: `order-placed-${Date.now()}`,
          timestamp: new Date(),
          source: 'trading-platform',
          type: 'trading.order.placed',
          data: result.order,
          priority: 'high',
          propagate: true,
        });
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order');
    }
  };

  const cancelOrder = async (orderId: string) => {
    try {
      const response = await fetch(`/api/trading/orders/${orderId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setOrders(prev => prev.map(o => 
          o.id === orderId ? { ...o, status: 'cancelled' } : o
        ));
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
    }
  };

  // ============================================
  // RENDER FUNCTIONS
  // ============================================

  const renderTradingView = () => (
    <div className="trading-view">
      <div className="chart-container">
        <div className="chart-header">
          <div className="symbol-info">
            <h2>{selectedSymbol}</h2>
            {assets.length > 0 && (
              <div className="price-info">
                <span className="price">${assets[0].price.toFixed(2)}</span>
                <span className={`change ${assets[0].change24h >= 0 ? 'positive' : 'negative'}`}>
                  {assets[0].change24h >= 0 ? '+' : ''}{assets[0].change24h.toFixed(2)}%
                </span>
              </div>
            )}
          </div>
          
          <div className="chart-controls">
            <select value={timeframe} onChange={(e) => setTimeframe(e.target.value)}>
              <option value="1m">1m</option>
              <option value="5m">5m</option>
              <option value="15m">15m</option>
              <option value="1h">1h</option>
              <option value="4h">4h</option>
              <option value="1d">1D</option>
              <option value="1w">1W</option>
            </select>
            
            <div className="chart-type-buttons">
              <button 
                className={chartType === 'candlestick' ? 'active' : ''}
                onClick={() => setChartType('candlestick')}
              >
                Candles
              </button>
              <button 
                className={chartType === 'line' ? 'active' : ''}
                onClick={() => setChartType('line')}
              >
                Line
              </button>
              <button 
                className={chartType === 'area' ? 'active' : ''}
                onClick={() => setChartType('area')}
              >
                Area
              </button>
            </div>
          </div>
        </div>
        
        <canvas 
          ref={chartRef} 
          width={1200} 
          height={600}
          className="trading-chart"
        />
      </div>
      
      <div className="trading-panel">
        <div className="order-form">
          <h3>Place Order</h3>
          
          <div className="exchange-selector">
            <label>Exchange:</label>
            <select value={selectedExchange} onChange={(e) => setSelectedExchange(e.target.value)}>
              {exchanges.map(ex => (
                <option key={ex.id} value={ex.id} disabled={!ex.connected}>
                  {ex.name} {ex.connected ? '✓' : '(Not Connected)'}
                </option>
              ))}
            </select>
          </div>
          
          <div className="order-type-selector">
            <button 
              className={orderSide === 'buy' ? 'buy active' : 'buy'}
              onClick={() => setOrderSide('buy')}
            >
              BUY
            </button>
            <button 
              className={orderSide === 'sell' ? 'sell active' : 'sell'}
              onClick={() => setOrderSide('sell')}
            >
              SELL
            </button>
          </div>
          
          <div className="order-type-tabs">
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
          
          <div className="order-inputs">
            <div className="input-group">
              <label>Amount</label>
              <input 
                type="number" 
                value={orderAmount}
                onChange={(e) => setOrderAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>
            
            {orderType === 'limit' && (
              <div className="input-group">
                <label>Price</label>
                <input 
                  type="number" 
                  value={orderPrice}
                  onChange={(e) => setOrderPrice(e.target.value)}
                  placeholder="0.00"
                />
              </div>
            )}
          </div>
          
          <button className="place-order-btn" onClick={placeOrder}>
            Place {orderSide.toUpperCase()} Order
          </button>
        </div>
        
        <div className="open-orders">
          <h3>Open Orders</h3>
          <div className="orders-list">
            {orders.filter(o => o.status === 'pending').map(order => (
              <div key={order.id} className="order-item">
                <div className="order-info">
                  <span className={`side ${order.side}`}>{order.side.toUpperCase()}</span>
                  <span>{order.symbol}</span>
                  <span>{order.amount}</span>
                  {order.price && <span>@ ${order.price}</span>}
                </div>
                <button onClick={() => cancelOrder(order.id)}>Cancel</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPortfolio = () => (
    <div className="portfolio-view">
      <div className="portfolio-summary">
        <h2>Portfolio Value</h2>
        <div className="total-value">${totalValue.toFixed(2)}</div>
      </div>
      
      <div className="holdings-grid">
        {Object.entries(portfolio).map(([symbol, amount]) => {
          const asset = assets.find(a => a.symbol === symbol);
          const value = asset ? asset.price * amount : 0;
          
          return (
            <div key={symbol} className="holding-card">
              <h3>{symbol}</h3>
              <div className="holding-amount">{amount.toFixed(8)}</div>
              <div className="holding-value">${value.toFixed(2)}</div>
              {asset && (
                <div className={`holding-change ${asset.change24h >= 0 ? 'positive' : 'negative'}`}>
                  {asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(2)}%
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderStrategies = () => (
    <div className="strategies-view">
      <h2>Trading Strategies</h2>
      <div className="strategies-grid">
        {strategies.map(strategy => (
          <div key={strategy.id} className="strategy-card">
            <h3>{strategy.name}</h3>
            <div className="strategy-type">{strategy.type}</div>
            <div className="strategy-stats">
              <div className="stat">
                <label>P/L:</label>
                <span className={strategy.profitLoss >= 0 ? 'positive' : 'negative'}>
                  ${strategy.profitLoss.toFixed(2)}
                </span>
              </div>
              <div className="stat">
                <label>Win Rate:</label>
                <span>{strategy.winRate.toFixed(1)}%</span>
              </div>
            </div>
            <button className={strategy.active ? 'active' : ''}>
              {strategy.active ? 'Active' : 'Inactive'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAISignals = () => (
    <div className="ai-signals-view">
      <h2>AI Trading Signals</h2>
      <div className="signals-list">
        {aiSignals.map(signal => (
          <div key={signal.id} className="signal-card">
            <div className="signal-header">
              <span className="signal-symbol">{signal.symbol}</span>
              <span className={`signal-action ${signal.action}`}>
                {signal.action.toUpperCase()}
              </span>
              <span className="signal-confidence">
                {(signal.confidence * 100).toFixed(0)}% confidence
              </span>
            </div>
            <div className="signal-reasoning">{signal.reasoning}</div>
            <div className="signal-time">
              {new Date(signal.timestamp).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ============================================
  // MAIN RENDER
  // ============================================

  return (
    <div className="advanced-trading-platform">
      <div className="platform-header">
        <h1>Advanced Trading Platform</h1>
        <div className="exchange-status">
          {exchanges.map(ex => (
            <div key={ex.id} className={`exchange-badge ${ex.connected ? 'connected' : ''}`}>
              {ex.name}
            </div>
          ))}
        </div>
      </div>
      
      <div className="view-tabs">
        <button 
          className={view === 'trading' ? 'active' : ''}
          onClick={() => setView('trading')}
        >
          Trading
        </button>
        <button 
          className={view === 'portfolio' ? 'active' : ''}
          onClick={() => setView('portfolio')}
        >
          Portfolio
        </button>
        <button 
          className={view === 'strategies' ? 'active' : ''}
          onClick={() => setView('strategies')}
        >
          Strategies
        </button>
        <button 
          className={view === 'ai-signals' ? 'active' : ''}
          onClick={() => setView('ai-signals')}
        >
          AI Signals
        </button>
      </div>
      
      <div className="platform-content">
        {view === 'trading' && renderTradingView()}
        {view === 'portfolio' && renderPortfolio()}
        {view === 'strategies' && renderStrategies()}
        {view === 'ai-signals' && renderAISignals()}
      </div>
    </div>
  );
};

export default AdvancedTradingPlatform;

