/**
 * Blockchain API Routes
 */

import { Router } from 'express';
import { aetherial, Wallet, Transaction } from '../blockchain/core';
import { blockchain3D } from '../blockchain/blockchain-3d';
import { consensusManager } from '../blockchain/mining';

const router = Router();

// Get blockchain stats
router.get('/stats', (req, res) => {
  const stats = aetherial.getStats();
  res.json(stats);
});

// Get 3D blockchain stats
router.get('/3d/stats', (req, res) => {
  const stats = blockchain3D.getStats();
  res.json(stats);
});

// Get block by hash
router.get('/block/:hash', (req, res) => {
  const block = aetherial.getBlockByHash(req.params.hash);
  if (!block) {
    return res.status(404).json({ error: 'Block not found' });
  }
  res.json(block);
});

// Get transaction by hash
router.get('/transaction/:hash', (req, res) => {
  const tx = aetherial.getTransactionByHash(req.params.hash);
  if (!tx) {
    return res.status(404).json({ error: 'Transaction not found' });
  }
  res.json(tx);
});

// Get balance
router.get('/balance/:address', (req, res) => {
  const balance = aetherial.getBalance(req.params.address);
  res.json({ address: req.params.address, balance });
});

// Create wallet
router.post('/wallet/create', (req, res) => {
  const wallet = new Wallet();
  res.json({
    address: wallet.address,
    publicKey: wallet.getPublicKey()
  });
});

// Send transaction
router.post('/transaction/send', (req, res) => {
  const { from, to, amount, fee, privateKey } = req.body;
  
  try {
    const tx = new Transaction(from, to, amount, fee || 0);
    tx.sign(privateKey);
    
    const success = aetherial.addTransaction(tx);
    if (!success) {
      return res.status(400).json({ error: 'Invalid transaction' });
    }
    
    res.json({ success: true, hash: tx.hash });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

// Mine block
router.post('/mine', (req, res) => {
  const { minerAddress } = req.body;
  
  const block = aetherial.minePendingTransactions(minerAddress);
  if (!block) {
    return res.status(400).json({ error: 'No pending transactions' });
  }
  
  res.json({ success: true, block });
});

// Get consensus stats
router.get('/consensus/stats', (req, res) => {
  const stats = consensusManager.getStats();
  res.json(stats);
});

export default router;
