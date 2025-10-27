import { describe, it, expect, beforeEach } from 'vitest';
import { BlockchainService, WalletService, SmartContractService, TokenRewardsService } from './blockchain';

describe('BlockchainService', () => {
  let blockchain: BlockchainService;

  beforeEach(() => {
    blockchain = new BlockchainService();
  });

  it('should create genesis block', () => {
    const chain = blockchain.getChain();
    expect(chain).toHaveLength(1);
    expect(chain[0].index).toBe(0);
    expect(chain[0].previousHash).toBe('0');
  });

  it('should add a new block', () => {
    const data = { test: 'data' };
    const block = blockchain.addBlock(data);
    
    expect(block.index).toBe(1);
    expect(block.data).toEqual(data);
    expect(blockchain.getChain()).toHaveLength(2);
  });

  it('should validate a valid chain', () => {
    blockchain.addBlock({ test: 'data1' });
    blockchain.addBlock({ test: 'data2' });
    
    expect(blockchain.isChainValid()).toBe(true);
  });

  it('should add transaction to pending', () => {
    const transaction = {
      id: 'test-1',
      from: 'address1',
      to: 'address2',
      amount: 100,
      type: 'transfer' as const,
      timestamp: Date.now(),
    };

    blockchain.addTransaction(transaction);
    const pending = blockchain.getPendingTransactions();
    
    expect(pending).toHaveLength(1);
    expect(pending[0]).toEqual(transaction);
  });

  it('should mine pending transactions', () => {
    const transaction = {
      id: 'test-1',
      from: 'address1',
      to: 'address2',
      amount: 100,
      type: 'transfer' as const,
      timestamp: Date.now(),
    };

    blockchain.addTransaction(transaction);
    const block = blockchain.minePendingTransactions('miner-address');
    
    expect(block.data.transactions).toHaveLength(1);
    expect(blockchain.getPendingTransactions()).toHaveLength(1); // Reward transaction
  });

  it('should calculate balance correctly', () => {
    blockchain.addTransaction({
      id: 'test-1',
      from: 'system',
      to: 'address1',
      amount: 100,
      type: 'reward',
      timestamp: Date.now(),
    });
    blockchain.minePendingTransactions('miner');
    
    const balance = blockchain.getBalance('address1');
    expect(balance).toBe(100);
  });

  it('should get transactions for address', () => {
    blockchain.addTransaction({
      id: 'test-1',
      from: 'system',
      to: 'address1',
      amount: 100,
      type: 'reward',
      timestamp: Date.now(),
    });
    blockchain.minePendingTransactions('miner');
    
    const transactions = blockchain.getTransactions('address1');
    expect(transactions.length).toBeGreaterThan(0);
  });
});

describe('WalletService', () => {
  let walletService: WalletService;

  beforeEach(() => {
    walletService = new WalletService();
  });

  it('should create a new wallet', () => {
    const wallet = walletService.createWallet();
    
    expect(wallet.address).toBeTruthy();
    expect(wallet.publicKey).toBeTruthy();
    expect(wallet.privateKey).toBeTruthy();
    expect(wallet.balance).toBe(0);
  });

  it('should sign a transaction', () => {
    const wallet = walletService.createWallet();
    const transaction = {
      id: 'test-1',
      from: wallet.address,
      to: 'address2',
      amount: 100,
      type: 'transfer' as const,
      timestamp: Date.now(),
    };

    const signature = walletService.signTransaction(transaction, wallet.privateKey);
    expect(signature).toBeTruthy();
  });

  it('should verify a transaction signature', () => {
    const wallet = walletService.createWallet();
    const transaction = {
      id: 'test-1',
      from: wallet.address,
      to: 'address2',
      amount: 100,
      type: 'transfer' as const,
      timestamp: Date.now(),
    };

    const signature = walletService.signTransaction(transaction, wallet.privateKey);
    transaction.signature = signature;
    
    const isValid = walletService.verifyTransaction(transaction, wallet.publicKey);
    expect(isValid).toBe(true);
  });
});

describe('SmartContractService', () => {
  let blockchain: BlockchainService;
  let smartContract: SmartContractService;

  beforeEach(() => {
    blockchain = new BlockchainService();
    smartContract = new SmartContractService(blockchain);
  });

  it('should execute transfer contract', () => {
    const transaction = smartContract.executeTransfer('address1', 'address2', 100);
    
    expect(transaction.from).toBe('address1');
    expect(transaction.to).toBe('address2');
    expect(transaction.amount).toBe(100);
    expect(transaction.type).toBe('transfer');
  });

  it('should execute reward contract', () => {
    const transaction = smartContract.executeReward('address1', 50, 'Test reward');
    
    expect(transaction.from).toBe('system');
    expect(transaction.to).toBe('address1');
    expect(transaction.amount).toBe(50);
    expect(transaction.type).toBe('reward');
    expect(transaction.metadata?.reason).toBe('Test reward');
  });

  it('should execute payment contract', () => {
    const transaction = smartContract.executePayment('address1', 'address2', 200, 'order-123');
    
    expect(transaction.from).toBe('address1');
    expect(transaction.to).toBe('address2');
    expect(transaction.amount).toBe(200);
    expect(transaction.type).toBe('payment');
    expect(transaction.metadata?.orderId).toBe('order-123');
  });

  it('should mint NFT', () => {
    const metadata = { name: 'Test NFT', image: 'test.jpg' };
    const transaction = smartContract.mintNFT('address1', metadata);
    
    expect(transaction.from).toBe('system');
    expect(transaction.to).toBe('address1');
    expect(transaction.type).toBe('nft');
    expect(transaction.metadata?.tokenId).toBeTruthy();
    expect(transaction.metadata?.name).toBe('Test NFT');
  });

  it('should execute stake contract', () => {
    const duration = 30 * 24 * 60 * 60 * 1000; // 30 days
    const transaction = smartContract.executeStake('address1', 1000, duration);
    
    expect(transaction.from).toBe('address1');
    expect(transaction.to).toBe('staking_pool');
    expect(transaction.amount).toBe(1000);
    expect(transaction.type).toBe('stake');
    expect(transaction.metadata?.duration).toBe(duration);
  });
});

describe('TokenRewardsService', () => {
  let blockchain: BlockchainService;
  let smartContract: SmartContractService;
  let rewards: TokenRewardsService;

  beforeEach(() => {
    blockchain = new BlockchainService();
    smartContract = new SmartContractService(blockchain);
    rewards = new TokenRewardsService(smartContract);
  });

  it('should reward post creation', () => {
    const transaction = rewards.rewardPost('user1');
    
    expect(transaction.to).toBe('user1');
    expect(transaction.amount).toBe(1);
    expect(transaction.type).toBe('reward');
  });

  it('should reward likes', () => {
    const transaction = rewards.rewardLikes('user1', 50);
    
    expect(transaction.to).toBe('user1');
    expect(transaction.amount).toBe(5); // 50 * 0.1 = 5
    expect(transaction.type).toBe('reward');
  });

  it('should cap likes reward at 10 AETH', () => {
    const transaction = rewards.rewardLikes('user1', 200);
    
    expect(transaction.amount).toBe(10); // Capped at 10
  });

  it('should reward course completion', () => {
    const transaction = rewards.rewardCourseCompletion('user1', 'course-123');
    
    expect(transaction.to).toBe('user1');
    expect(transaction.amount).toBe(50);
    expect(transaction.type).toBe('reward');
  });

  it('should reward sales', () => {
    const transaction = rewards.rewardSale('seller1', 1000);
    
    expect(transaction.to).toBe('seller1');
    expect(transaction.amount).toBe(10); // 1% of 1000
    expect(transaction.type).toBe('reward');
  });

  it('should reward daily login', () => {
    const transaction = rewards.rewardDailyLogin('user1');
    
    expect(transaction.to).toBe('user1');
    expect(transaction.amount).toBe(0.5);
    expect(transaction.type).toBe('reward');
  });
});

