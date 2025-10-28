/**
 * AETHERIAL 4D+ Blockchain Explorer
 * 
 * Multi-dimensional blockchain visualization with tree branching:
 * - X-axis: Time (sequential progression)
 * - Y-axis: Shards (horizontal partitioning)
 * - Z-axis: Layers (vertical stacking)
 * - Branch dimension: Tree structure for forks and parallel chains
 */

import React, { useState, useEffect, useRef } from 'react';
import './BlockchainExplorer4D.css';

interface Block4D {
  index: number;
  hash: string;
  previousHash: string;
  timestamp: number;
  data: any;
  nonce: number;
  difficulty: number;
  coordinates: {
    x: number;
    y: number;
    z: number;
    branch: string;
    depth: number;
  };
  crossShardLinks: [number, string][];
  crossLayerLinks: [number, string][];
  branchLinks: [string, string][];
}

interface BranchNode {
  id: string;
  status: string;
  reason: string;
  createdAt: number;
  blockCount: number;
  children: BranchNode[];
}

export const BlockchainExplorer4D: React.FC = () => {
  const [blocks, setBlocks] = useState<Block4D[]>([]);
  const [branchTree, setBranchTree] = useState<BranchNode | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<Block4D | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<string>('main');
  const [selectedShard, setSelectedShard] = useState<number>(0);
  const [selectedLayer, setSelectedLayer] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'3d' | '4d' | 'tree'>('4d');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    loadBlockchain();
    loadBranchTree();
    const interval = setInterval(() => {
      loadBlockchain();
      loadBranchTree();
    }, 5000);
    return () => clearInterval(interval);
  }, [selectedBranch, selectedShard, selectedLayer]);

  useEffect(() => {
    if (canvasRef.current && blocks.length > 0) {
      renderBlockchain();
    }
  }, [blocks, viewMode, selectedBranch]);

  const loadBlockchain = async () => {
    try {
      const response = await fetch('/api/blockchain/blocks/4d');
      const data = await response.json();
      
      // Filter blocks based on selection
      const filteredBlocks = data.blocks.filter((block: Block4D) =>
        block.coordinates.branch === selectedBranch &&
        block.coordinates.y === selectedShard &&
        block.coordinates.z === selectedLayer
      );
      
      setBlocks(filteredBlocks);
    } catch (error) {
      console.error('Failed to load 4D blockchain:', error);
    }
  };

  const loadBranchTree = async () => {
    try {
      const response = await fetch('/api/blockchain/branches/tree');
      const data = await response.json();
      setBranchTree(data.tree);
    } catch (error) {
      console.error('Failed to load branch tree:', error);
    }
  };

  const renderBlockchain = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (viewMode === 'tree') {
      renderBranchTree(ctx);
    } else if (viewMode === '4d') {
      render4DView(ctx);
    } else {
      render3DView(ctx);
    }
  };

  const render4DView = (ctx: CanvasRenderingContext2D) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;

    // Draw grid
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    
    // X-axis (time) grid
    for (let i = 0; i <= 10; i++) {
      const x = (width / 10) * i;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Y-axis grid
    for (let i = 0; i <= 10; i++) {
      const y = (height / 10) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw blocks
    blocks.forEach((block, index) => {
      const x = 50 + (block.coordinates.x * 80);
      const y = height / 2 + (block.coordinates.depth * 60) - 100;
      const size = 50 - (block.coordinates.z * 5); // Z-axis affects size (perspective)

      // Draw block
      ctx.fillStyle = selectedBlock?.hash === block.hash ? '#00ffff' : '#1a73e8';
      ctx.fillRect(x, y, size, size);

      // Draw border
      ctx.strokeStyle = '#00ffff';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, size, size);

      // Draw connections
      if (index > 0 && blocks[index - 1].coordinates.branch === block.coordinates.branch) {
        const prevBlock = blocks[index - 1];
        const prevX = 50 + (prevBlock.coordinates.x * 80) + 25;
        const prevY = height / 2 + (prevBlock.coordinates.depth * 60) - 75;
        
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(x + size/2, y + size/2);
        ctx.stroke();
      }

      // Draw cross-dimensional links
      block.crossShardLinks.forEach(([shard, hash]) => {
        ctx.strokeStyle = '#ff9800';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(x + size/2, y + size/2);
        ctx.lineTo(x + size/2, y - 30);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // Draw branch links
      block.branchLinks.forEach(([branch, hash]) => {
        ctx.strokeStyle = '#9c27b0';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(x + size/2, y + size/2);
        ctx.lineTo(x + size/2, y + size + 30);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // Draw block info
      ctx.fillStyle = '#ffffff';
      ctx.font = '10px Inter';
      ctx.fillText(`#${block.index}`, x + 5, y + 15);
      ctx.fillText(`(${block.coordinates.x},${block.coordinates.y},${block.coordinates.z})`, x + 5, y + 30);
    });

    // Draw axis labels
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px Inter';
    ctx.fillText('Time (X) →', width - 100, height - 10);
    ctx.fillText('↑ Branch Depth', 10, 20);
  };

  const render3DView = (ctx: CanvasRenderingContext2D) => {
    // Simplified 3D view (similar to original)
    blocks.forEach((block, index) => {
      const x = 50 + (block.coordinates.x * 100);
      const y = 50 + (block.coordinates.y * 100);
      const size = 40 - (block.coordinates.z * 5);

      ctx.fillStyle = selectedBlock?.hash === block.hash ? '#00ffff' : '#1a73e8';
      ctx.fillRect(x, y, size, size);

      if (index > 0) {
        const prevBlock = blocks[index - 1];
        const prevX = 50 + (prevBlock.coordinates.x * 100) + 20;
        const prevY = 50 + (prevBlock.coordinates.y * 100) + 20;
        
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(x + size/2, y + size/2);
        ctx.stroke();
      }

      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Inter';
      ctx.fillText(`#${block.index}`, x + 5, y + 20);
    });
  };

  const renderBranchTree = (ctx: CanvasRenderingContext2D) => {
    if (!branchTree) return;

    const drawNode = (node: BranchNode, x: number, y: number, level: number) => {
      const nodeWidth = 120;
      const nodeHeight = 60;
      const verticalSpacing = 100;
      const horizontalSpacing = 150;

      // Draw node
      ctx.fillStyle = node.id === selectedBranch ? '#00ffff' : '#1a73e8';
      ctx.fillRect(x, y, nodeWidth, nodeHeight);
      
      ctx.strokeStyle = '#00ffff';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, nodeWidth, nodeHeight);

      // Draw text
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Inter';
      ctx.fillText(node.id, x + 10, y + 20);
      ctx.fillText(`${node.blockCount} blocks`, x + 10, y + 40);
      ctx.font = '10px Inter';
      ctx.fillText(node.status, x + 10, y + 55);

      // Draw children
      if (node.children && node.children.length > 0) {
        const totalWidth = node.children.length * horizontalSpacing;
        const startX = x + nodeWidth/2 - totalWidth/2;

        node.children.forEach((child, index) => {
          const childX = startX + index * horizontalSpacing;
          const childY = y + verticalSpacing;

          // Draw connection line
          ctx.strokeStyle = '#00ffff';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(x + nodeWidth/2, y + nodeHeight);
          ctx.lineTo(childX + nodeWidth/2, childY);
          ctx.stroke();

          // Draw child node
          drawNode(child, childX, childY, level + 1);
        });
      }
    };

    // Center the tree
    drawNode(branchTree, ctx.canvas.width / 2 - 60, 50, 0);
  };

  const createBranch = async () => {
    const branchId = prompt('Enter new branch ID:');
    const reason = prompt('Enter reason (fork/parallel/state/experimental):');
    
    if (!branchId || !reason) return;

    try {
      const response = await fetch('/api/blockchain/branches/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parentBranch: selectedBranch,
          branchId,
          reason,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert('Branch created successfully!');
        loadBranchTree();
      } else {
        alert('Failed to create branch: ' + data.error);
      }
    } catch (error) {
      console.error('Failed to create branch:', error);
      alert('Failed to create branch');
    }
  };

  const formatHash = (hash: string) => {
    return `${hash.substring(0, 8)}...${hash.substring(hash.length - 8)}`;
  };

  return (
    <div className="blockchain-explorer-4d">
      <header className="explorer-header">
        <h1>🌌 4D+ Blockchain Explorer</h1>
        <p>Multi-dimensional blockchain with tree branching</p>
      </header>

      <div className="explorer-controls">
        <div className="dimension-selectors">
          <div className="selector">
            <label>Branch:</label>
            <select value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)}>
              <option value="main">Main</option>
              {/* Add other branches dynamically */}
            </select>
          </div>

          <div className="selector">
            <label>Shard (Y):</label>
            <input
              type="number"
              value={selectedShard}
              onChange={(e) => setSelectedShard(parseInt(e.target.value))}
              min="0"
              max="7"
            />
          </div>

          <div className="selector">
            <label>Layer (Z):</label>
            <input
              type="number"
              value={selectedLayer}
              onChange={(e) => setSelectedLayer(parseInt(e.target.value))}
              min="0"
              max="4"
            />
          </div>
        </div>

        <div className="view-controls">
          <button
            className={viewMode === '3d' ? 'active' : ''}
            onClick={() => setViewMode('3d')}
          >
            3D View
          </button>
          <button
            className={viewMode === '4d' ? 'active' : ''}
            onClick={() => setViewMode('4d')}
          >
            4D View
          </button>
          <button
            className={viewMode === 'tree' ? 'active' : ''}
            onClick={() => setViewMode('tree')}
          >
            Branch Tree
          </button>
        </div>

        <button className="create-branch-btn" onClick={createBranch}>
          🌿 Create Branch
        </button>
      </div>

      <div className="explorer-content">
        <div className="visualization">
          <canvas
            ref={canvasRef}
            width={1200}
            height={600}
            onClick={(e) => {
              const rect = canvasRef.current?.getBoundingClientRect();
              if (rect) {
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                blocks.forEach(block => {
                  const blockX = 50 + (block.coordinates.x * 80);
                  const blockY = 300 + (block.coordinates.depth * 60) - 100;
                  const size = 50 - (block.coordinates.z * 5);
                  
                  if (x >= blockX && x <= blockX + size &&
                      y >= blockY && y <= blockY + size) {
                    setSelectedBlock(block);
                  }
                });
              }
            }}
          />

          <div className="dimension-info">
            <div className="dimension-card">
              <div className="dimension-label">X-Axis</div>
              <div className="dimension-value">Time</div>
              <div className="dimension-desc">Sequential progression</div>
            </div>
            <div className="dimension-card">
              <div className="dimension-label">Y-Axis</div>
              <div className="dimension-value">Shards</div>
              <div className="dimension-desc">Horizontal partitioning</div>
            </div>
            <div className="dimension-card">
              <div className="dimension-label">Z-Axis</div>
              <div className="dimension-value">Layers</div>
              <div className="dimension-desc">Vertical stacking</div>
            </div>
            <div className="dimension-card highlight">
              <div className="dimension-label">Branch</div>
              <div className="dimension-value">Tree</div>
              <div className="dimension-desc">Forks & parallel chains</div>
            </div>
          </div>
        </div>

        {selectedBlock && (
          <div className="block-details-4d">
            <h2>Block Details</h2>
            
            <div className="detail-section">
              <h3>4D Coordinates</h3>
              <div className="coordinates-grid">
                <div className="coord-item">
                  <span className="coord-label">X (Time):</span>
                  <span className="coord-value">{selectedBlock.coordinates.x}</span>
                </div>
                <div className="coord-item">
                  <span className="coord-label">Y (Shard):</span>
                  <span className="coord-value">{selectedBlock.coordinates.y}</span>
                </div>
                <div className="coord-item">
                  <span className="coord-label">Z (Layer):</span>
                  <span className="coord-value">{selectedBlock.coordinates.z}</span>
                </div>
                <div className="coord-item">
                  <span className="coord-label">Branch:</span>
                  <span className="coord-value">{selectedBlock.coordinates.branch}</span>
                </div>
                <div className="coord-item">
                  <span className="coord-label">Depth:</span>
                  <span className="coord-value">{selectedBlock.coordinates.depth}</span>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h3>Cross-Dimensional Links</h3>
              <div className="links-grid">
                {selectedBlock.crossShardLinks.length > 0 && (
                  <div className="link-group">
                    <div className="link-label">Cross-Shard Links:</div>
                    {selectedBlock.crossShardLinks.map(([shard, hash]) => (
                      <div key={shard} className="link-item">
                        Shard {shard}: {formatHash(hash)}
                      </div>
                    ))}
                  </div>
                )}
                
                {selectedBlock.crossLayerLinks.length > 0 && (
                  <div className="link-group">
                    <div className="link-label">Cross-Layer Links:</div>
                    {selectedBlock.crossLayerLinks.map(([layer, hash]) => (
                      <div key={layer} className="link-item">
                        Layer {layer}: {formatHash(hash)}
                      </div>
                    ))}
                  </div>
                )}
                
                {selectedBlock.branchLinks.length > 0 && (
                  <div className="link-group">
                    <div className="link-label">Branch Links:</div>
                    {selectedBlock.branchLinks.map(([branch, hash]) => (
                      <div key={branch} className="link-item">
                        {branch}: {formatHash(hash)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="detail-section">
              <h3>Block Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Hash:</span>
                  <span className="info-value">{selectedBlock.hash}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Previous Hash:</span>
                  <span className="info-value">{selectedBlock.previousHash}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Index:</span>
                  <span className="info-value">#{selectedBlock.index}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Timestamp:</span>
                  <span className="info-value">{new Date(selectedBlock.timestamp).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlockchainExplorer4D;

