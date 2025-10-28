/**
 * AETHERIAL 4D+ Blockchain UI API Routes
 * 
 * API endpoints for 4D blockchain explorer with branching support
 */

import { Router } from 'express';
import type { Request, Response } from 'express';
import { blockchain4D } from '../blockchain/blockchain-4d';
import crypto from 'crypto';

const router = Router();

/**
 * Get all blocks with 4D coordinates and branching
 */
router.get('/blocks/4d', async (req: Request, res: Response) => {
  try {
    const { shard, layer, branch } = req.query;
    
    const blocks = blockchain4D.getAllBlocks().map(block => ({
      index: block.index,
      hash: block.hash,
      previousHash: block.previousHash,
      timestamp: block.timestamp,
      transactions: block.data.transactions || [],
      nonce: block.nonce,
      difficulty: block.difficulty,
      coordinates: block.coordinates,
      crossShardLinks: Array.from(block.crossShardLinks.entries()),
      crossLayerLinks: Array.from(block.crossLayerLinks.entries()),
      branchLinks: Array.from(block.branchLinks.entries()),
    }));

    res.json({ blocks });
  } catch (error) {
    console.error('Failed to get 4D blocks:', error);
    res.status(500).json({ error: 'Failed to retrieve blocks' });
  }
});

/**
 * Get blocks at specific coordinates
 */
router.get('/blocks/4d/at', async (req: Request, res: Response) => {
  try {
    const { x, y, z, branch } = req.query;
    
    const blocks = blockchain4D.getBlocksAt(
      x ? parseInt(x as string) : undefined,
      y ? parseInt(y as string) : undefined,
      z ? parseInt(z as string) : undefined,
      branch as string | undefined
    ).map(block => ({
      index: block.index,
      hash: block.hash,
      previousHash: block.previousHash,
      timestamp: block.timestamp,
      data: block.data,
      coordinates: block.coordinates,
      crossShardLinks: Array.from(block.crossShardLinks.entries()),
      crossLayerLinks: Array.from(block.crossLayerLinks.entries()),
      branchLinks: Array.from(block.branchLinks.entries()),
    }));

    res.json({ blocks });
  } catch (error) {
    console.error('Failed to get blocks at coordinates:', error);
    res.status(500).json({ error: 'Failed to retrieve blocks' });
  }
});

/**
 * Get branch tree structure
 */
router.get('/branches/tree', async (req: Request, res: Response) => {
  try {
    const { branchId } = req.query;
    const tree = blockchain4D.getBranchTree(branchId as string || 'main');
    res.json({ tree });
  } catch (error) {
    console.error('Failed to get branch tree:', error);
    res.status(500).json({ error: 'Failed to retrieve branch tree' });
  }
});

/**
 * Get all blocks in a specific branch
 */
router.get('/branches/:branchId/blocks', async (req: Request, res: Response) => {
  try {
    const { branchId } = req.params;
    const blocks = blockchain4D.getBlocksInBranch(branchId).map(block => ({
      index: block.index,
      hash: block.hash,
      coordinates: block.coordinates,
      timestamp: block.timestamp,
      data: block.data,
    }));

    res.json({ blocks });
  } catch (error) {
    console.error('Failed to get branch blocks:', error);
    res.status(500).json({ error: 'Failed to retrieve branch blocks' });
  }
});

/**
 * Create a new branch
 */
router.post('/branches/create', async (req: Request, res: Response) => {
  try {
    const { parentBranch, branchId, reason } = req.body;

    if (!parentBranch || !branchId || !reason) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const branch = blockchain4D.createBranch(
      parentBranch,
      branchId,
      reason as 'fork' | 'parallel' | 'state' | 'experimental'
    );

    res.json({
      success: true,
      branch,
      message: 'Branch created successfully',
    });
  } catch (error: any) {
    console.error('Failed to create branch:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create branch',
    });
  }
});

/**
 * Merge a branch back into its parent
 */
router.post('/branches/:branchId/merge', async (req: Request, res: Response) => {
  try {
    const { branchId } = req.params;
    blockchain4D.mergeBranch(branchId);

    res.json({
      success: true,
      message: 'Branch merged successfully',
    });
  } catch (error: any) {
    console.error('Failed to merge branch:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to merge branch',
    });
  }
});

/**
 * Add block to specific dimension
 */
router.post('/blocks/4d/add', async (req: Request, res: Response) => {
  try {
    const { data, shard, layer, branch, validator } = req.body;

    if (!data) {
      return res.status(400).json({ error: 'Data is required' });
    }

    const block = blockchain4D.addBlock(
      data,
      shard || 0,
      layer || 0,
      branch || 'main',
      validator
    );

    res.json({
      success: true,
      block: {
        index: block.index,
        hash: block.hash,
        coordinates: block.coordinates,
        timestamp: block.timestamp,
      },
      message: 'Block added successfully',
    });
  } catch (error: any) {
    console.error('Failed to add block:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to add block',
    });
  }
});

/**
 * Get 4D blockchain statistics
 */
router.get('/stats/4d', async (req: Request, res: Response) => {
  try {
    const stats = blockchain4D.getStats();
    
    res.json({
      stats: {
        ...stats,
        networkHashrate: 2.5e12, // 2.5 TH/s (simulated)
        blockTime: 5.2, // seconds
        transactionsPerSecond: 10000, // High TPS due to sharding
        price: 2500,
        marketCap: 2500000000,
        circulatingSupply: 1000000,
      },
    });
  } catch (error) {
    console.error('Failed to get 4D stats:', error);
    res.status(500).json({ error: 'Failed to retrieve statistics' });
  }
});

/**
 * Get chain for specific path through dimensions
 */
router.get('/chain/4d', async (req: Request, res: Response) => {
  try {
    const { shard, layer, branch } = req.query;
    
    const chain = blockchain4D.getChain(
      shard ? parseInt(shard as string) : 0,
      layer ? parseInt(layer as string) : 0,
      branch as string || 'main'
    ).map(block => ({
      index: block.index,
      hash: block.hash,
      coordinates: block.coordinates,
      timestamp: block.timestamp,
      data: block.data,
    }));

    res.json({ chain });
  } catch (error) {
    console.error('Failed to get chain:', error);
    res.status(500).json({ error: 'Failed to retrieve chain' });
  }
});

/**
 * Validate blockchain
 */
router.get('/validate/4d', async (req: Request, res: Response) => {
  try {
    const isValid = blockchain4D.isValid();
    res.json({
      valid: isValid,
      message: isValid ? 'Blockchain is valid' : 'Blockchain validation failed',
    });
  } catch (error) {
    console.error('Failed to validate blockchain:', error);
    res.status(500).json({ error: 'Failed to validate blockchain' });
  }
});

export default router;

