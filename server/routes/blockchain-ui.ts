/**
 * AETHERIAL Blockchain UI API Routes
 * 
 * API endpoints for blockchain explorer, wallet, and statistics
 */

import { Router } from 'express';
import type { Request, Response } from 'express';
import { Blockchain3D } from '../blockchain/blockchain-3d';
import crypto from 'crypto';

const router = Router();

// Initialize blockchain instance
const blockchain = new Blockchain3D();

/**
 * Get all blocks for blockchain explorer
 */
router.get('/blocks', async (req: Request, res: Response) => {
  try {
    const blocks = blockchain.getChain().map((block, index) => ({
      index: block.index,
      hash: block.hash,
      previousHash: block.previousHash,
      timestamp: block.timestamp,
      transactions: block.data.transactions || [],
      nonce: block.nonce,
      difficulty: block.difficulty,
      x: block.coordinates.x,
      y: block.coordinates.y,
      z: block.coordinates.z,
    }));

    res.json({ blocks });
  } catch (error) {
    console.error('Failed to get blocks:', error);
    res.status(500).json({ error: 'Failed to retrieve blocks' });
  }
});

/**
 * Get blockchain statistics
 */
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const chain = blockchain.getChain();
    const totalBlocks = chain.length;
    
    // Calculate total transactions
    let totalTransactions = 0;
    const addresses = new Set<string>();
    
    chain.forEach(block => {
      const transactions = block.data.transactions || [];
      totalTransactions += transactions.length;
      
      transactions.forEach((tx: any) => {
        addresses.add(tx.from);
        addresses.add(tx.to);
      });
    });

    // Calculate network metrics
    const recentBlocks = chain.slice(-10);
    const avgBlockTime = recentBlocks.length > 1
      ? (recentBlocks[recentBlocks.length - 1].timestamp - recentBlocks[0].timestamp) / (recentBlocks.length - 1)
      : 10000;

    const transactionsPerSecond = totalTransactions / (chain[chain.length - 1].timestamp - chain[0].timestamp) * 1000;

    const stats = {
      totalBlocks,
      totalTransactions,
      totalAddresses: addresses.size,
      networkHashrate: 1.5e12, // 1.5 TH/s (simulated)
      difficulty: chain[chain.length - 1]?.difficulty || 4,
      blockTime: avgBlockTime / 1000, // Convert to seconds
      transactionsPerSecond,
      marketCap: 2500000000, // $2.5B (simulated)
      circulatingSupply: 1000000, // 1M AETH (simulated)
      price: 2500, // $2500 per AETH (simulated)
    };

    res.json({ stats });
  } catch (error) {
    console.error('Failed to get stats:', error);
    res.status(500).json({ error: 'Failed to retrieve statistics' });
  }
});

/**
 * Get all transactions
 */
router.get('/transactions', async (req: Request, res: Response) => {
  try {
    const chain = blockchain.getChain();
    const transactions: any[] = [];

    chain.forEach((block, blockIndex) => {
      const blockTransactions = block.data.transactions || [];
      blockTransactions.forEach((tx: any) => {
        transactions.push({
          id: tx.id || crypto.randomBytes(32).toString('hex'),
          blockNumber: block.index,
          from: tx.from,
          to: tx.to,
          amount: tx.amount,
          fee: tx.fee || 0.001,
          timestamp: tx.timestamp || block.timestamp,
          status: 'confirmed',
          confirmations: chain.length - blockIndex,
          gasUsed: tx.gasUsed || 21000,
          type: tx.type || 'transfer',
        });
      });
    });

    // Sort by timestamp (newest first)
    transactions.sort((a, b) => b.timestamp - a.timestamp);

    res.json({ transactions });
  } catch (error) {
    console.error('Failed to get transactions:', error);
    res.status(500).json({ error: 'Failed to retrieve transactions' });
  }
});

/**
 * Get wallet information
 */
router.get('/wallet', async (req: Request, res: Response) => {
  try {
    // Get or create wallet from session/database
    // For now, return a simulated wallet
    const wallet = {
      address: '0x' + crypto.randomBytes(20).toString('hex'),
      balance: 10.5234,
      publicKey: crypto.randomBytes(33).toString('hex'),
      transactions: [],
    };

    res.json({ wallet });
  } catch (error) {
    console.error('Failed to get wallet:', error);
    res.status(500).json({ error: 'Failed to retrieve wallet' });
  }
});

/**
 * Create new wallet
 */
router.post('/wallet/create', async (req: Request, res: Response) => {
  try {
    // Generate new wallet
    const privateKey = crypto.randomBytes(32).toString('hex');
    const publicKey = crypto.randomBytes(33).toString('hex');
    const address = '0x' + crypto.randomBytes(20).toString('hex');

    const wallet = {
      address,
      balance: 0,
      privateKey,
      publicKey,
      transactions: [],
    };

    // In production, store wallet securely
    res.json({ wallet });
  } catch (error) {
    console.error('Failed to create wallet:', error);
    res.status(500).json({ error: 'Failed to create wallet' });
  }
});

/**
 * Import existing wallet
 */
router.post('/wallet/import', async (req: Request, res: Response) => {
  try {
    const { privateKey } = req.body;

    if (!privateKey) {
      return res.status(400).json({ error: 'Private key is required' });
    }

    // Derive public key and address from private key
    // In production, use proper cryptographic functions
    const publicKey = crypto.createHash('sha256').update(privateKey).digest('hex');
    const address = '0x' + crypto.createHash('ripemd160').update(publicKey).digest('hex');

    const wallet = {
      address,
      balance: 5.1234, // Fetch actual balance from blockchain
      privateKey,
      publicKey,
      transactions: [],
    };

    res.json({ wallet });
  } catch (error) {
    console.error('Failed to import wallet:', error);
    res.status(500).json({ error: 'Failed to import wallet' });
  }
});

/**
 * Send transaction
 */
router.post('/transaction/send', async (req: Request, res: Response) => {
  try {
    const { from, to, amount, fee } = req.body;

    if (!from || !to || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create transaction
    const transaction = {
      id: crypto.randomBytes(32).toString('hex'),
      from,
      to,
      amount: parseFloat(amount),
      fee: parseFloat(fee) || 0.001,
      timestamp: Date.now(),
      status: 'pending',
    };

    // Add transaction to blockchain
    // In production, validate signature and balance
    blockchain.addBlock({
      transactions: [transaction],
      type: 'transaction',
    });

    res.json({
      success: true,
      transaction,
      message: 'Transaction submitted successfully',
    });
  } catch (error) {
    console.error('Failed to send transaction:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send transaction',
    });
  }
});

/**
 * Get token balances
 */
router.get('/tokens', async (req: Request, res: Response) => {
  try {
    // Return simulated token balances
    const tokens = [
      {
        symbol: 'USDT',
        name: 'Tether USD',
        balance: 1000.00,
        value: 1000.00,
      },
      {
        symbol: 'BTC',
        name: 'Bitcoin',
        balance: 0.05,
        value: 4500.00,
      },
      {
        symbol: 'ETH',
        name: 'Ethereum',
        balance: 2.5,
        value: 7500.00,
      },
    ];

    res.json({ tokens });
  } catch (error) {
    console.error('Failed to get tokens:', error);
    res.status(500).json({ error: 'Failed to retrieve tokens' });
  }
});

export default router;

