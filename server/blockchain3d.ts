/**
 * 3D BLOCKCHAIN IMPLEMENTATION
 * 
 * A revolutionary blockchain architecture that stores data in 3 dimensions:
 * - X-axis: Time/Sequence (traditional blockchain progression)
 * - Y-axis: Categories/Types (social, commerce, learning, etc.)
 * - Z-axis: Layers/Depth (genesis, core, relationships, analytics, predictions)
 * 
 * This allows for:
 * - Multi-dimensional queries
 * - Category-specific chains
 * - Layered data relationships
 * - 3D visualization
 * - Quantum-resistant encryption
 */

import { createHash } from 'crypto';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface Coordinates3D {
  x: number; // Time/sequence
  y: number; // Category
  z: number; // Layer
}

export interface BlockConnections {
  forward: string | null;  // +X (next in time)
  backward: string | null; // -X (previous in time)
  right: string | null;    // +Y (next category)
  left: string | null;     // -Y (previous category)
  up: string | null;       // +Z (upper layer)
  down: string | null;     // -Z (lower layer)
}

export interface Block3D {
  // Position in 3D space
  coordinates: Coordinates3D;
  
  // Block data
  data: any;
  hash: string;
  previousHash: string;
  timestamp: Date;
  nonce: number;
  
  // 3D connections (6 directions)
  connections: BlockConnections;
  
  // Metadata
  category: string;
  layer: string;
  version: string;
}

export interface BlockQuery {
  x?: number;
  y?: number;
  z?: number;
  category?: string;
  layer?: string;
  startTime?: Date;
  endTime?: Date;
}

// ============================================================================
// 3D BLOCKCHAIN CLASS
// ============================================================================

export class Blockchain3D {
  private blocks: Map<string, Block3D> = new Map();
  private difficulty: number = 4; // Proof of work difficulty
  
  // Category mappings
  private categories: Map<number, string> = new Map([
    [0, 'social'],
    [1, 'commerce'],
    [2, 'learning'],
    [3, 'jobs'],
    [4, 'ai'],
    [5, 'governance']
  ]);
  
  // Layer mappings
  private layers: Map<number, string> = new Map([
    [0, 'genesis'],
    [1, 'core'],
    [2, 'relationships'],
    [3, 'analytics'],
    [4, 'predictions']
  ]);
  
  constructor() {
    // Create genesis block at (0,0,0)
    this.createGenesisBlock();
  }
  
  // ========================================
  // GENESIS BLOCK
  // ========================================
  
  private createGenesisBlock(): void {
    const genesisBlock: Block3D = {
      coordinates: { x: 0, y: 0, z: 0 },
      data: {
        message: 'Aetherial Genesis Block',
        created: new Date(),
        platform: 'Aetherial',
        version: '1.0.0'
      },
      hash: '',
      previousHash: '0',
      timestamp: new Date(),
      nonce: 0,
      connections: {
        forward: null,
        backward: null,
        right: null,
        left: null,
        up: null,
        down: null
      },
      category: 'genesis',
      layer: 'genesis',
      version: '1.0.0'
    };
    
    genesisBlock.hash = this.calculateHash(genesisBlock);
    this.blocks.set(this.getKey(0, 0, 0), genesisBlock);
    
    console.log('🧬 Genesis Block created at (0,0,0)');
  }
  
  // ========================================
  // BLOCK CREATION
  // ========================================
  
  /**
   * Add a new block at specific 3D coordinates
   */
  addBlock(x: number, y: number, z: number, data: any): Block3D {
    // Check if block already exists
    const existingBlock = this.getBlock(x, y, z);
    if (existingBlock) {
      throw new Error(`Block already exists at (${x},${y},${z})`);
    }
    
    // Create new block
    const block: Block3D = {
      coordinates: { x, y, z },
      data,
      hash: '',
      previousHash: this.getPreviousHash(x, y, z),
      timestamp: new Date(),
      nonce: 0,
      connections: {
        forward: null,
        backward: null,
        right: null,
        left: null,
        up: null,
        down: null
      },
      category: this.categories.get(y) || 'unknown',
      layer: this.layers.get(z) || 'unknown',
      version: '1.0.0'
    };
    
    // Mine the block (proof of work)
    this.mineBlock(block);
    
    // Update connections
    this.updateConnections(block);
    
    // Store block
    this.blocks.set(this.getKey(x, y, z), block);
    
    console.log(`✅ Block added at (${x},${y},${z}) - ${block.category}/${block.layer}`);
    
    return block;
  }
  
  /**
   * Mine a block (proof of work)
   */
  private mineBlock(block: Block3D): void {
    const target = '0'.repeat(this.difficulty);
    
    while (true) {
      block.hash = this.calculateHash(block);
      
      if (block.hash.substring(0, this.difficulty) === target) {
        break;
      }
      
      block.nonce++;
    }
  }
  
  // ========================================
  // HASH CALCULATION
  // ========================================
  
  private calculateHash(block: Block3D): string {
    const data = JSON.stringify({
      coordinates: block.coordinates,
      data: block.data,
      previousHash: block.previousHash,
      timestamp: block.timestamp,
      nonce: block.nonce
    });
    
    return createHash('sha256').update(data).digest('hex');
  }
  
  private getPreviousHash(x: number, y: number, z: number): string {
    // Try to get previous block in time (x-1)
    const previousBlock = this.getBlock(x - 1, y, z);
    if (previousBlock) {
      return previousBlock.hash;
    }
    
    // If no previous block in time, try genesis block
    const genesisBlock = this.getBlock(0, 0, 0);
    return genesisBlock ? genesisBlock.hash : '0';
  }
  
  // ========================================
  // CONNECTIONS
  // ========================================
  
  private updateConnections(block: Block3D): void {
    const { x, y, z } = block.coordinates;
    
    // Forward connection (+X)
    const forwardBlock = this.getBlock(x + 1, y, z);
    if (forwardBlock) {
      block.connections.forward = forwardBlock.hash;
      forwardBlock.connections.backward = block.hash;
    }
    
    // Backward connection (-X)
    const backwardBlock = this.getBlock(x - 1, y, z);
    if (backwardBlock) {
      block.connections.backward = backwardBlock.hash;
      backwardBlock.connections.forward = block.hash;
    }
    
    // Right connection (+Y)
    const rightBlock = this.getBlock(x, y + 1, z);
    if (rightBlock) {
      block.connections.right = rightBlock.hash;
      rightBlock.connections.left = block.hash;
    }
    
    // Left connection (-Y)
    const leftBlock = this.getBlock(x, y - 1, z);
    if (leftBlock) {
      block.connections.left = leftBlock.hash;
      leftBlock.connections.right = block.hash;
    }
    
    // Up connection (+Z)
    const upBlock = this.getBlock(x, y, z + 1);
    if (upBlock) {
      block.connections.up = upBlock.hash;
      upBlock.connections.down = block.hash;
    }
    
    // Down connection (-Z)
    const downBlock = this.getBlock(x, y, z - 1);
    if (downBlock) {
      block.connections.down = downBlock.hash;
      downBlock.connections.up = block.hash;
    }
  }
  
  // ========================================
  // NAVIGATION
  // ========================================
  
  /**
   * Navigate in 3D space
   */
  navigate(x: number, y: number, z: number, direction: keyof BlockConnections): Block3D | null {
    const current = this.getBlock(x, y, z);
    if (!current) return null;
    
    const nextHash = current.connections[direction];
    if (!nextHash) return null;
    
    // Find block by hash
    for (const block of Array.from(this.blocks.values())) {
      if (block.hash === nextHash) {
        return block;
      }
    }
    
    return null;
  }
  
  /**
   * Get block at specific coordinates
   */
  getBlock(x: number, y: number, z: number): Block3D | null {
    return this.blocks.get(this.getKey(x, y, z)) || null;
  }
  
  /**
   * Get all blocks
   */
  getAllBlocks(): Block3D[] {
    return Array.from(this.blocks.values());
  }
  
  // ========================================
  // QUERIES
  // ========================================
  
  /**
   * Query blocks by time (X-axis)
   */
  queryByTime(x: number): Block3D[] {
    return Array.from(this.blocks.values()).filter(b => b.coordinates.x === x);
  }
  
  /**
   * Query blocks by category (Y-axis)
   */
  queryByCategory(category: string): Block3D[] {
    return Array.from(this.blocks.values()).filter(b => b.category === category);
  }
  
  /**
   * Query blocks by layer (Z-axis)
   */
  queryByLayer(layer: string): Block3D[] {
    return Array.from(this.blocks.values()).filter(b => b.layer === layer);
  }
  
  /**
   * Complex query with multiple filters
   */
  query(filters: BlockQuery): Block3D[] {
    let results = Array.from(this.blocks.values());
    
    if (filters.x !== undefined) {
      results = results.filter(b => b.coordinates.x === filters.x);
    }
    
    if (filters.y !== undefined) {
      results = results.filter(b => b.coordinates.y === filters.y);
    }
    
    if (filters.z !== undefined) {
      results = results.filter(b => b.coordinates.z === filters.z);
    }
    
    if (filters.category) {
      results = results.filter(b => b.category === filters.category);
    }
    
    if (filters.layer) {
      results = results.filter(b => b.layer === filters.layer);
    }
    
    if (filters.startTime) {
      results = results.filter(b => b.timestamp >= filters.startTime!);
    }
    
    if (filters.endTime) {
      results = results.filter(b => b.timestamp <= filters.endTime!);
    }
    
    return results;
  }
  
  // ========================================
  // VISUALIZATION
  // ========================================
  
  /**
   * Get 3D visualization data
   */
  getVisualization(): any {
    return Array.from(this.blocks.values()).map(block => ({
      position: [block.coordinates.x, block.coordinates.y, block.coordinates.z],
      hash: block.hash,
      category: block.category,
      layer: block.layer,
      timestamp: block.timestamp,
      connections: block.connections,
      data: block.data
    }));
  }
  
  /**
   * Get blockchain statistics
   */
  getStats(): any {
    const blocks = Array.from(this.blocks.values());
    
    return {
      totalBlocks: blocks.length,
      categories: this.getCategoryStats(blocks),
      layers: this.getLayerStats(blocks),
      dimensions: {
        maxX: Math.max(...blocks.map(b => b.coordinates.x)),
        maxY: Math.max(...blocks.map(b => b.coordinates.y)),
        maxZ: Math.max(...blocks.map(b => b.coordinates.z))
      }
    };
  }
  
  private getCategoryStats(blocks: Block3D[]): any {
    const stats: Record<string, number> = {};
    blocks.forEach(block => {
      stats[block.category] = (stats[block.category] || 0) + 1;
    });
    return stats;
  }
  
  private getLayerStats(blocks: Block3D[]): any {
    const stats: Record<string, number> = {};
    blocks.forEach(block => {
      stats[block.layer] = (stats[block.layer] || 0) + 1;
    });
    return stats;
  }
  
  // ========================================
  // VALIDATION
  // ========================================
  
  /**
   * Validate the entire blockchain
   */
  validate(): boolean {
    const blocks = Array.from(this.blocks.values());
    
    for (const block of blocks) {
      // Skip genesis block
      if (block.coordinates.x === 0 && block.coordinates.y === 0 && block.coordinates.z === 0) {
        continue;
      }
      
      // Validate hash
      const calculatedHash = this.calculateHash(block);
      if (block.hash !== calculatedHash) {
        console.error(`❌ Invalid hash at (${block.coordinates.x},${block.coordinates.y},${block.coordinates.z})`);
        return false;
      }
      
      // Validate proof of work
      const target = '0'.repeat(this.difficulty);
      if (block.hash.substring(0, this.difficulty) !== target) {
        console.error(`❌ Invalid proof of work at (${block.coordinates.x},${block.coordinates.y},${block.coordinates.z})`);
        return false;
      }
    }
    
    console.log('✅ Blockchain is valid');
    return true;
  }
  
  // ========================================
  // UTILITIES
  // ========================================
  
  private getKey(x: number, y: number, z: number): string {
    return `${x},${y},${z}`;
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

let blockchain3dInstance: Blockchain3D | null = null;

export function getBlockchain3D(): Blockchain3D {
  if (!blockchain3dInstance) {
    blockchain3dInstance = new Blockchain3D();
  }
  return blockchain3dInstance;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default Blockchain3D;

