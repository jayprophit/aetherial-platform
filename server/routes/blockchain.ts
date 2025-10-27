import express from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  blockchain,
  walletService,
  smartContractService,
  tokenRewardsService,
} from '../services/blockchain';

const router = express.Router();

// GET /api/blockchain/chain - Get the entire blockchain
router.get('/chain', authenticateToken, async (req, res) => {
  try {
    const chain = blockchain.getChain();
    const isValid = blockchain.isChainValid();

    res.json({ chain, isValid, length: chain.length });
  } catch (error) {
    console.error('Get blockchain error:', error);
    res.status(500).json({ error: 'Failed to get blockchain' });
  }
});

// GET /api/blockchain/validate - Validate the blockchain
router.get('/validate', authenticateToken, async (req, res) => {
  try {
    const isValid = blockchain.isChainValid();

    res.json({ isValid });
  } catch (error) {
    console.error('Validate blockchain error:', error);
    res.status(500).json({ error: 'Failed to validate blockchain' });
  }
});

// POST /api/blockchain/mine - Mine pending transactions
router.post('/mine', authenticateToken, async (req, res) => {
  try {
    const { minerAddress } = req.body;

    if (!minerAddress) {
      return res.status(400).json({ error: 'Miner address is required' });
    }

    const block = blockchain.minePendingTransactions(minerAddress);

    res.json({ block, message: 'Block mined successfully' });
  } catch (error) {
    console.error('Mine block error:', error);
    res.status(500).json({ error: 'Failed to mine block' });
  }
});

// POST /api/blockchain/wallet/create - Create a new wallet
router.post('/wallet/create', authenticateToken, async (req, res) => {
  try {
    const wallet = walletService.createWallet();

    // Don't send private key in response - store it securely
    res.json({
      address: wallet.address,
      publicKey: wallet.publicKey,
      balance: wallet.balance,
    });
  } catch (error) {
    console.error('Create wallet error:', error);
    res.status(500).json({ error: 'Failed to create wallet' });
  }
});

// GET /api/blockchain/wallet/:address/balance - Get wallet balance
router.get('/wallet/:address/balance', authenticateToken, async (req, res) => {
  try {
    const { address } = req.params;
    const balance = blockchain.getBalance(address);

    res.json({ address, balance });
  } catch (error) {
    console.error('Get balance error:', error);
    res.status(500).json({ error: 'Failed to get balance' });
  }
});

// GET /api/blockchain/wallet/:address/transactions - Get wallet transactions
router.get('/wallet/:address/transactions', authenticateToken, async (req, res) => {
  try {
    const { address } = req.params;
    const transactions = blockchain.getTransactions(address);

    res.json({ address, transactions, count: transactions.length });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: 'Failed to get transactions' });
  }
});

// POST /api/blockchain/transfer - Transfer tokens
router.post('/transfer', authenticateToken, async (req, res) => {
  try {
    const { from, to, amount } = req.body;

    if (!from || !to || !amount) {
      return res.status(400).json({ error: 'From, to, and amount are required' });
    }

    if (amount <= 0) {
      return res.status(400).json({ error: 'Amount must be positive' });
    }

    const balance = blockchain.getBalance(from);
    if (balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    const transaction = smartContractService.executeTransfer(from, to, amount);

    res.json({ transaction, message: 'Transfer initiated' });
  } catch (error) {
    console.error('Transfer error:', error);
    res.status(500).json({ error: 'Failed to transfer tokens' });
  }
});

// POST /api/blockchain/payment - Process payment
router.post('/payment', authenticateToken, async (req, res) => {
  try {
    const { from, to, amount, orderId } = req.body;

    if (!from || !to || !amount || !orderId) {
      return res.status(400).json({ error: 'From, to, amount, and orderId are required' });
    }

    const balance = blockchain.getBalance(from);
    if (balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    const transaction = smartContractService.executePayment(from, to, amount, orderId);

    res.json({ transaction, message: 'Payment processed' });
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ error: 'Failed to process payment' });
  }
});

// POST /api/blockchain/nft/mint - Mint an NFT
router.post('/nft/mint', authenticateToken, async (req, res) => {
  try {
    const { owner, metadata } = req.body;

    if (!owner || !metadata) {
      return res.status(400).json({ error: 'Owner and metadata are required' });
    }

    const transaction = smartContractService.mintNFT(owner, metadata);

    res.json({ transaction, tokenId: transaction.metadata.tokenId, message: 'NFT minted successfully' });
  } catch (error) {
    console.error('Mint NFT error:', error);
    res.status(500).json({ error: 'Failed to mint NFT' });
  }
});

// POST /api/blockchain/stake - Stake tokens
router.post('/stake', authenticateToken, async (req, res) => {
  try {
    const { from, amount, duration } = req.body;

    if (!from || !amount || !duration) {
      return res.status(400).json({ error: 'From, amount, and duration are required' });
    }

    const balance = blockchain.getBalance(from);
    if (balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    const transaction = smartContractService.executeStake(from, amount, duration);

    res.json({ transaction, message: 'Tokens staked successfully' });
  } catch (error) {
    console.error('Stake error:', error);
    res.status(500).json({ error: 'Failed to stake tokens' });
  }
});

// POST /api/blockchain/rewards/post - Reward for creating post
router.post('/rewards/post', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const transaction = tokenRewardsService.rewardPost(userId);

    res.json({ transaction, message: 'Post reward issued' });
  } catch (error) {
    console.error('Reward post error:', error);
    res.status(500).json({ error: 'Failed to issue reward' });
  }
});

// POST /api/blockchain/rewards/likes - Reward for getting likes
router.post('/rewards/likes', authenticateToken, async (req, res) => {
  try {
    const { userId, likesCount } = req.body;

    if (!userId || likesCount === undefined) {
      return res.status(400).json({ error: 'User ID and likes count are required' });
    }

    const transaction = tokenRewardsService.rewardLikes(userId, likesCount);

    res.json({ transaction, message: 'Likes reward issued' });
  } catch (error) {
    console.error('Reward likes error:', error);
    res.status(500).json({ error: 'Failed to issue reward' });
  }
});

// POST /api/blockchain/rewards/course - Reward for completing course
router.post('/rewards/course', authenticateToken, async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    if (!userId || !courseId) {
      return res.status(400).json({ error: 'User ID and course ID are required' });
    }

    const transaction = tokenRewardsService.rewardCourseCompletion(userId, courseId);

    res.json({ transaction, message: 'Course completion reward issued' });
  } catch (error) {
    console.error('Reward course error:', error);
    res.status(500).json({ error: 'Failed to issue reward' });
  }
});

// POST /api/blockchain/rewards/sale - Reward for making a sale
router.post('/rewards/sale', authenticateToken, async (req, res) => {
  try {
    const { sellerId, saleAmount } = req.body;

    if (!sellerId || !saleAmount) {
      return res.status(400).json({ error: 'Seller ID and sale amount are required' });
    }

    const transaction = tokenRewardsService.rewardSale(sellerId, saleAmount);

    res.json({ transaction, message: 'Sale reward issued' });
  } catch (error) {
    console.error('Reward sale error:', error);
    res.status(500).json({ error: 'Failed to issue reward' });
  }
});

// POST /api/blockchain/rewards/login - Reward for daily login
router.post('/rewards/login', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const transaction = tokenRewardsService.rewardDailyLogin(userId);

    res.json({ transaction, message: 'Daily login reward issued' });
  } catch (error) {
    console.error('Reward login error:', error);
    res.status(500).json({ error: 'Failed to issue reward' });
  }
});

// GET /api/blockchain/pending - Get pending transactions
router.get('/pending', authenticateToken, async (req, res) => {
  try {
    const pending = blockchain.getPendingTransactions();

    res.json({ transactions: pending, count: pending.length });
  } catch (error) {
    console.error('Get pending transactions error:', error);
    res.status(500).json({ error: 'Failed to get pending transactions' });
  }
});

export default router;

