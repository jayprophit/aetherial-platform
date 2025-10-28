/**
 * AETHERIAL Blockchain Explorer
 * 
 * 3D visualization of the custom blockchain
 * Real-time block and transaction viewing
 */

import React, { useState, useEffect, useRef } from 'react';
import './BlockchainExplorer.css';

interface Block {
  index: number;
  hash: string;
  previousHash: string;
  timestamp: number;
  transactions: Transaction[];
  nonce: number;
  difficulty: number;
  x: number; // 3D coordinates
  y: number;
  z: number;
}

interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  timestamp: number;
  signature: string;
}

export const BlockchainExplorer: React.FC = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [view3D, setView3D] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    loadBlockchain();
    const interval = setInterval(loadBlockchain, 5000); // Refresh every 5s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (view3D && canvasRef.current) {
      render3DBlockchain();
    }
  }, [blocks, view3D]);

  const loadBlockchain = async () => {
    try {
      const response = await fetch('/api/blockchain/blocks');
      const data = await response.json();
      setBlocks(data.blocks);
    } catch (error) {
      console.error('Failed to load blockchain:', error);
    }
  };

  const render3DBlockchain = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw 3D blockchain
    blocks.forEach((block, index) => {
      const x = 50 + (block.x * 100);
      const y = 50 + (block.y * 100);
      const z = block.z;

      // Draw block as cube (simplified 3D)
      const size = 40 - (z * 5); // Perspective
      ctx.fillStyle = selectedBlock?.hash === block.hash ? '#00ffff' : '#1a73e8';
      ctx.fillRect(x, y, size, size);

      // Draw connections
      if (index > 0) {
        const prevBlock = blocks[index - 1];
        const prevX = 50 + (prevBlock.x * 100) + 20;
        const prevY = 50 + (prevBlock.y * 100) + 20;
        
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(x + size/2, y + size/2);
        ctx.stroke();
      }

      // Draw block number
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Inter';
      ctx.fillText(`#${block.index}`, x + 5, y + 20);
    });
  };

  const searchBlockchain = (query: string) => {
    // Search by block hash, transaction hash, or address
    const results = blocks.filter(block =>
      block.hash.includes(query) ||
      block.transactions.some(tx =>
        tx.id.includes(query) ||
        tx.from.includes(query) ||
        tx.to.includes(query)
      )
    );

    if (results.length > 0) {
      setSelectedBlock(results[0]);
    }
  };

  const formatHash = (hash: string) => {
    return `${hash.substring(0, 8)}...${hash.substring(hash.length - 8)}`;
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="blockchain-explorer">
      <header className="explorer-header">
        <h1>🔗 Blockchain Explorer</h1>
        <p>Explore the AETHERIAL 3D Blockchain</p>
      </header>

      <div className="explorer-controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by block hash, transaction hash, or address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && searchBlockchain(searchQuery)}
          />
          <button onClick={() => searchBlockchain(searchQuery)}>
            🔍 Search
          </button>
        </div>

        <div className="view-toggle">
          <button
            className={view3D ? 'active' : ''}
            onClick={() => setView3D(true)}
          >
            3D View
          </button>
          <button
            className={!view3D ? 'active' : ''}
            onClick={() => setView3D(false)}
          >
            List View
          </button>
        </div>
      </div>

      <div className="explorer-content">
        {view3D ? (
          <div className="blockchain-3d">
            <canvas
              ref={canvasRef}
              width={1200}
              height={600}
              onClick={(e) => {
                // Handle block selection from canvas click
                const rect = canvasRef.current?.getBoundingClientRect();
                if (rect) {
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  
                  // Find clicked block
                  blocks.forEach(block => {
                    const blockX = 50 + (block.x * 100);
                    const blockY = 50 + (block.y * 100);
                    const size = 40 - (block.z * 5);
                    
                    if (x >= blockX && x <= blockX + size &&
                        y >= blockY && y <= blockY + size) {
                      setSelectedBlock(block);
                    }
                  });
                }
              }}
            />
          </div>
        ) : (
          <div className="blockchain-list">
            {blocks.map(block => (
              <div
                key={block.hash}
                className={`block-card ${selectedBlock?.hash === block.hash ? 'selected' : ''}`}
                onClick={() => setSelectedBlock(block)}
              >
                <div className="block-header">
                  <span className="block-number">Block #{block.index}</span>
                  <span className="block-time">{formatTimestamp(block.timestamp)}</span>
                </div>
                <div className="block-info">
                  <div className="info-row">
                    <span className="label">Hash:</span>
                    <span className="value">{formatHash(block.hash)}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Transactions:</span>
                    <span className="value">{block.transactions.length}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Position:</span>
                    <span className="value">({block.x}, {block.y}, {block.z})</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedBlock && (
          <div className="block-details">
            <h2>Block Details</h2>
            
            <div className="detail-section">
              <h3>Block Information</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="label">Block Number:</span>
                  <span className="value">#{selectedBlock.index}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Timestamp:</span>
                  <span className="value">{formatTimestamp(selectedBlock.timestamp)}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Hash:</span>
                  <span className="value">{selectedBlock.hash}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Previous Hash:</span>
                  <span className="value">{selectedBlock.previousHash}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Nonce:</span>
                  <span className="value">{selectedBlock.nonce}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Difficulty:</span>
                  <span className="value">{selectedBlock.difficulty}</span>
                </div>
                <div className="detail-item">
                  <span className="label">3D Position:</span>
                  <span className="value">({selectedBlock.x}, {selectedBlock.y}, {selectedBlock.z})</span>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h3>Transactions ({selectedBlock.transactions.length})</h3>
              <div className="transactions-list">
                {selectedBlock.transactions.map(tx => (
                  <div key={tx.id} className="transaction-card">
                    <div className="tx-header">
                      <span className="tx-id">{formatHash(tx.id)}</span>
                      <span className="tx-amount">{tx.amount} AETH</span>
                    </div>
                    <div className="tx-details">
                      <div className="tx-row">
                        <span className="label">From:</span>
                        <span className="value">{formatHash(tx.from)}</span>
                      </div>
                      <div className="tx-row">
                        <span className="label">To:</span>
                        <span className="value">{formatHash(tx.to)}</span>
                      </div>
                      <div className="tx-row">
                        <span className="label">Time:</span>
                        <span className="value">{formatTimestamp(tx.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="blockchain-stats">
        <div className="stat-card">
          <div className="stat-value">{blocks.length}</div>
          <div className="stat-label">Total Blocks</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {blocks.reduce((sum, block) => sum + block.transactions.length, 0)}
          </div>
          <div className="stat-label">Total Transactions</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {blocks.length > 0 ? blocks[blocks.length - 1].difficulty : 0}
          </div>
          <div className="stat-label">Current Difficulty</div>
        </div>
      </div>
    </div>
  );
};

export default BlockchainExplorer;

