/**
 * AETHERIAL Blockchain Statistics Dashboard
 * 
 * Real-time network statistics and analytics
 * Performance metrics and visualizations
 */

import React, { useState, useEffect, useRef } from 'react';
import './BlockchainStats.css';

interface NetworkStats {
  totalBlocks: number;
  totalTransactions: number;
  totalAddresses: number;
  networkHashrate: number;
  difficulty: number;
  blockTime: number;
  transactionsPerSecond: number;
  marketCap: number;
  circulatingSupply: number;
  price: number;
}

interface ChartData {
  timestamp: number;
  value: number;
}

export const BlockchainStats: React.FC = () => {
  const [stats, setStats] = useState<NetworkStats>({
    totalBlocks: 0,
    totalTransactions: 0,
    totalAddresses: 0,
    networkHashrate: 0,
    difficulty: 0,
    blockTime: 0,
    transactionsPerSecond: 0,
    marketCap: 0,
    circulatingSupply: 0,
    price: 2500,
  });

  const [blockHistory, setBlockHistory] = useState<ChartData[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (canvasRef.current && blockHistory.length > 0) {
      renderChart();
    }
  }, [blockHistory]);

  const loadStats = async () => {
    try {
      const response = await fetch('/api/blockchain/stats');
      const data = await response.json();
      setStats(data.stats);
      
      const now = Date.now();
      setBlockHistory(prev => [...prev.slice(-50), { timestamp: now, value: data.stats.totalBlocks }]);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const renderChart = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
      const y = (canvas.height / 10) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    if (blockHistory.length > 1) {
      const maxValue = Math.max(...blockHistory.map(d => d.value));
      const minValue = Math.min(...blockHistory.map(d => d.value));
      const range = maxValue - minValue || 1;

      ctx.strokeStyle = '#00ffff';
      ctx.lineWidth = 2;
      ctx.beginPath();

      blockHistory.forEach((data, index) => {
        const x = (canvas.width / (blockHistory.length - 1)) * index;
        const y = canvas.height - ((data.value - minValue) / range) * canvas.height;
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();

      ctx.fillStyle = '#00ffff';
      blockHistory.forEach((data, index) => {
        const x = (canvas.width / (blockHistory.length - 1)) * index;
        const y = canvas.height - ((data.value - minValue) / range) * canvas.height;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
    return num.toFixed(0);
  };

  const formatHashrate = (hashrate: number) => {
    if (hashrate >= 1e15) return `${(hashrate / 1e15).toFixed(2)} PH/s`;
    if (hashrate >= 1e12) return `${(hashrate / 1e12).toFixed(2)} TH/s`;
    if (hashrate >= 1e9) return `${(hashrate / 1e9).toFixed(2)} GH/s`;
    if (hashrate >= 1e6) return `${(hashrate / 1e6).toFixed(2)} MH/s`;
    return `${hashrate.toFixed(2)} H/s`;
  };

  return (
    <div className="blockchain-stats">
      <header className="stats-header">
        <h1>📊 Blockchain Statistics</h1>
        <p>Real-time network analytics and performance metrics</p>
      </header>

      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">🔗</div>
          <div className="stat-content">
            <div className="stat-label">Total Blocks</div>
            <div className="stat-value">{formatNumber(stats.totalBlocks)}</div>
            <div className="stat-change positive">+{stats.blockTime.toFixed(1)}s avg</div>
          </div>
        </div>

        <div className="stat-card primary">
          <div className="stat-icon">💸</div>
          <div className="stat-content">
            <div className="stat-label">Total Transactions</div>
            <div className="stat-value">{formatNumber(stats.totalTransactions)}</div>
            <div className="stat-change positive">+{stats.transactionsPerSecond.toFixed(2)} TPS</div>
          </div>
        </div>

        <div className="stat-card primary">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-label">Active Addresses</div>
            <div className="stat-value">{formatNumber(stats.totalAddresses)}</div>
            <div className="stat-change">Unique wallets</div>
          </div>
        </div>

        <div className="stat-card primary">
          <div className="stat-icon">⚡</div>
          <div className="stat-content">
            <div className="stat-label">Network Hashrate</div>
            <div className="stat-value">{formatHashrate(stats.networkHashrate)}</div>
            <div className="stat-change">Computing power</div>
          </div>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-card">
          <h2>Block Production</h2>
          <canvas ref={canvasRef} width={800} height={300} />
          <div className="chart-legend">
            <span>Last 50 blocks</span>
          </div>
        </div>

        <div className="metrics-card">
          <h2>Network Metrics</h2>
          <div className="metrics-list">
            <div className="metric-item">
              <div className="metric-label">Difficulty</div>
              <div className="metric-value">{formatNumber(stats.difficulty)}</div>
              <div className="metric-bar">
                <div className="metric-fill" style={{ width: '75%' }} />
              </div>
            </div>

            <div className="metric-item">
              <div className="metric-label">Block Time</div>
              <div className="metric-value">{stats.blockTime.toFixed(2)}s</div>
              <div className="metric-bar">
                <div className="metric-fill" style={{ width: '60%' }} />
              </div>
            </div>

            <div className="metric-item">
              <div className="metric-label">TPS</div>
              <div className="metric-value">{stats.transactionsPerSecond.toFixed(2)}</div>
              <div className="metric-bar">
                <div className="metric-fill" style={{ width: '85%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="market-section">
        <div className="market-card">
          <h2>💰 Market Data</h2>
          <div className="market-grid">
            <div className="market-item">
              <div className="market-label">AETH Price</div>
              <div className="market-value price">${stats.price.toFixed(2)}</div>
              <div className="market-change positive">+5.2%</div>
            </div>

            <div className="market-item">
              <div className="market-label">Market Cap</div>
              <div className="market-value">${formatNumber(stats.marketCap)}</div>
              <div className="market-change positive">+3.8%</div>
            </div>

            <div className="market-item">
              <div className="market-label">Circulating Supply</div>
              <div className="market-value">{formatNumber(stats.circulatingSupply)} AETH</div>
              <div className="market-change">{((stats.circulatingSupply / 1e9) * 100).toFixed(1)}% of max</div>
            </div>

            <div className="market-item">
              <div className="market-label">24h Volume</div>
              <div className="market-value">${formatNumber(stats.marketCap * 0.15)}</div>
              <div className="market-change positive">+12.4%</div>
            </div>
          </div>
        </div>

        <div className="consensus-card">
          <h2>⚙️ Consensus Mechanisms</h2>
          <div className="consensus-list">
            <div className="consensus-item active">
              <div className="consensus-name">Proof of Work (PoW)</div>
              <div className="consensus-status">Active</div>
              <div className="consensus-percentage">60%</div>
            </div>

            <div className="consensus-item active">
              <div className="consensus-name">Proof of Stake (PoS)</div>
              <div className="consensus-status">Active</div>
              <div className="consensus-percentage">40%</div>
            </div>

            <div className="consensus-item">
              <div className="consensus-name">Delegated PoS</div>
              <div className="consensus-status">Available</div>
              <div className="consensus-percentage">0%</div>
            </div>

            <div className="consensus-item">
              <div className="consensus-name">Byzantine Fault Tolerance</div>
              <div className="consensus-status">Available</div>
              <div className="consensus-percentage">0%</div>
            </div>
          </div>
        </div>
      </div>

      <div className="info-section">
        <div className="info-card">
          <h2>🔐 Security</h2>
          <div className="info-stats">
            <div className="info-item">
              <span className="info-icon">✓</span>
              <span>Military-grade encryption</span>
            </div>
            <div className="info-item">
              <span className="info-icon">✓</span>
              <span>Zero-knowledge proofs</span>
            </div>
            <div className="info-item">
              <span className="info-icon">✓</span>
              <span>Multi-signature support</span>
            </div>
            <div className="info-item">
              <span className="info-icon">✓</span>
              <span>Hardware wallet integration</span>
            </div>
          </div>
        </div>

        <div className="info-card">
          <h2>🌐 Network</h2>
          <div className="info-stats">
            <div className="info-item">
              <span className="info-icon">🌍</span>
              <span>Global node distribution</span>
            </div>
            <div className="info-item">
              <span className="info-icon">⚡</span>
              <span>Sub-second finality</span>
            </div>
            <div className="info-item">
              <span className="info-icon">📈</span>
              <span>Infinite scalability</span>
            </div>
            <div className="info-item">
              <span className="info-icon">♻️</span>
              <span>Energy efficient</span>
            </div>
          </div>
        </div>

        <div className="info-card">
          <h2>🚀 Features</h2>
          <div className="info-stats">
            <div className="info-item">
              <span className="info-icon">📦</span>
              <span>Smart contracts</span>
            </div>
            <div className="info-item">
              <span className="info-icon">🎨</span>
              <span>NFT marketplace</span>
            </div>
            <div className="info-item">
              <span className="info-icon">💎</span>
              <span>DeFi protocols</span>
            </div>
            <div className="info-item">
              <span className="info-icon">🏛️</span>
              <span>DAO governance</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockchainStats;
