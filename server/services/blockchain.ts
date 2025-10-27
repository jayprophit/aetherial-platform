import crypto from 'crypto';

/**
 * Block in the blockchain
 */
export interface Block {
  index: number;
  timestamp: number;
  data: any;
  previousHash: string;
  hash: string;
  nonce: number;
}

/**
 * Transaction on the blockchain
 */
export interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  type: 'transfer' | 'reward' | 'payment' | 'stake' | 'nft';
  metadata?: any;
  timestamp: number;
  signature?: string;
}

/**
 * Wallet for storing AETH tokens
 */
export interface Wallet {
  address: string;
  publicKey: string;
  privateKey: string;
  balance: number;
}

/**
 * Blockchain Service
 * Unified distributed ledger system for the AETHERIAL platform
 */
export class BlockchainService {
  private chain: Block[];
  private pendingTransactions: Transaction[];
  private difficulty: number;
  private miningReward: number;

  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.pendingTransactions = [];
    this.difficulty = 2; // Number of leading zeros required in hash
    this.miningReward = 10; // AETH tokens
  }

  /**
   * Create the genesis block (first block in chain)
   */
  private createGenesisBlock(): Block {
    return {
      index: 0,
      timestamp: Date.now(),
      data: { message: 'AETHERIAL Genesis Block' },
      previousHash: '0',
      hash: this.calculateHash(0, Date.now(), { message: 'AETHERIAL Genesis Block' }, '0', 0),
      nonce: 0,
    };
  }

  /**
   * Calculate hash for a block
   */
  private calculateHash(index: number, timestamp: number, data: any, previousHash: string, nonce: number): string {
    return crypto
      .createHash('sha256')
      .update(index + timestamp + JSON.stringify(data) + previousHash + nonce)
      .digest('hex');
  }

  /**
   * Get the latest block in the chain
   */
  getLatestBlock(): Block {
    return this.chain[this.chain.length - 1];
  }

  /**
   * Mine a new block (Proof of Work)
   */
  private mineBlock(block: Block): Block {
    while (block.hash.substring(0, this.difficulty) !== Array(this.difficulty + 1).join('0')) {
      block.nonce++;
      block.hash = this.calculateHash(block.index, block.timestamp, block.data, block.previousHash, block.nonce);
    }
    return block;
  }

  /**
   * Add a new block to the chain
   */
  addBlock(data: any): Block {
    const previousBlock = this.getLatestBlock();
    const newBlock: Block = {
      index: previousBlock.index + 1,
      timestamp: Date.now(),
      data,
      previousHash: previousBlock.hash,
      hash: '',
      nonce: 0,
    };

    newBlock.hash = this.calculateHash(newBlock.index, newBlock.timestamp, newBlock.data, newBlock.previousHash, newBlock.nonce);
    const minedBlock = this.mineBlock(newBlock);
    
    this.chain.push(minedBlock);
    return minedBlock;
  }

  /**
   * Add a transaction to pending transactions
   */
  addTransaction(transaction: Transaction): void {
    this.pendingTransactions.push(transaction);
  }

  /**
   * Mine pending transactions and reward the miner
   */
  minePendingTransactions(minerAddress: string): Block {
    const block = this.addBlock({
      transactions: this.pendingTransactions,
    });

    // Reward the miner
    this.pendingTransactions = [
      {
        id: crypto.randomUUID(),
        from: 'system',
        to: minerAddress,
        amount: this.miningReward,
        type: 'reward',
        timestamp: Date.now(),
      },
    ];

    return block;
  }

  /**
   * Get balance for an address
   */
  getBalance(address: string): number {
    let balance = 0;

    for (const block of this.chain) {
      if (block.data.transactions) {
        for (const trans of block.data.transactions) {
          if (trans.from === address) {
            balance -= trans.amount;
          }
          if (trans.to === address) {
            balance += trans.amount;
          }
        }
      }
    }

    return balance;
  }

  /**
   * Get all transactions for an address
   */
  getTransactions(address: string): Transaction[] {
    const transactions: Transaction[] = [];

    for (const block of this.chain) {
      if (block.data.transactions) {
        for (const trans of block.data.transactions) {
          if (trans.from === address || trans.to === address) {
            transactions.push(trans);
          }
        }
      }
    }

    return transactions;
  }

  /**
   * Validate the blockchain
   */
  isChainValid(): boolean {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      // Verify current block's hash
      const calculatedHash = this.calculateHash(
        currentBlock.index,
        currentBlock.timestamp,
        currentBlock.data,
        currentBlock.previousHash,
        currentBlock.nonce
      );

      if (currentBlock.hash !== calculatedHash) {
        return false;
      }

      // Verify link to previous block
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }

      // Verify proof of work
      if (currentBlock.hash.substring(0, this.difficulty) !== Array(this.difficulty + 1).join('0')) {
        return false;
      }
    }

    return true;
  }

  /**
   * Get the entire blockchain
   */
  getChain(): Block[] {
    return this.chain;
  }

  /**
   * Get pending transactions
   */
  getPendingTransactions(): Transaction[] {
    return this.pendingTransactions;
  }
}

/**
 * Wallet Service
 * Manage AETH token wallets
 */
export class WalletService {
  /**
   * Create a new wallet
   */
  createWallet(): Wallet {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });

    const address = crypto
      .createHash('sha256')
      .update(publicKey)
      .digest('hex')
      .substring(0, 40);

    return {
      address,
      publicKey,
      privateKey,
      balance: 0,
    };
  }

  /**
   * Sign a transaction
   */
  signTransaction(transaction: Transaction, privateKey: string): string {
    const sign = crypto.createSign('SHA256');
    sign.update(JSON.stringify({
      from: transaction.from,
      to: transaction.to,
      amount: transaction.amount,
      timestamp: transaction.timestamp,
    }));
    return sign.sign(privateKey, 'hex');
  }

  /**
   * Verify a transaction signature
   */
  verifyTransaction(transaction: Transaction, publicKey: string): boolean {
    if (!transaction.signature) return false;

    const verify = crypto.createVerify('SHA256');
    verify.update(JSON.stringify({
      from: transaction.from,
      to: transaction.to,
      amount: transaction.amount,
      timestamp: transaction.timestamp,
    }));
    return verify.verify(publicKey, transaction.signature, 'hex');
  }
}

/**
 * Smart Contract Service
 * Execute smart contracts on the blockchain
 */
export class SmartContractService {
  private blockchain: BlockchainService;

  constructor(blockchain: BlockchainService) {
    this.blockchain = blockchain;
  }

  /**
   * Execute a token transfer contract
   */
  executeTransfer(from: string, to: string, amount: number): Transaction {
    const transaction: Transaction = {
      id: crypto.randomUUID(),
      from,
      to,
      amount,
      type: 'transfer',
      timestamp: Date.now(),
    };

    this.blockchain.addTransaction(transaction);
    return transaction;
  }

  /**
   * Execute a reward contract
   */
  executeReward(to: string, amount: number, reason: string): Transaction {
    const transaction: Transaction = {
      id: crypto.randomUUID(),
      from: 'system',
      to,
      amount,
      type: 'reward',
      metadata: { reason },
      timestamp: Date.now(),
    };

    this.blockchain.addTransaction(transaction);
    return transaction;
  }

  /**
   * Execute a payment contract
   */
  executePayment(from: string, to: string, amount: number, orderId: string): Transaction {
    const transaction: Transaction = {
      id: crypto.randomUUID(),
      from,
      to,
      amount,
      type: 'payment',
      metadata: { orderId },
      timestamp: Date.now(),
    };

    this.blockchain.addTransaction(transaction);
    return transaction;
  }

  /**
   * Execute an NFT minting contract
   */
  mintNFT(owner: string, metadata: any): Transaction {
    const transaction: Transaction = {
      id: crypto.randomUUID(),
      from: 'system',
      to: owner,
      amount: 0,
      type: 'nft',
      metadata: {
        ...metadata,
        tokenId: crypto.randomUUID(),
        mintedAt: Date.now(),
      },
      timestamp: Date.now(),
    };

    this.blockchain.addTransaction(transaction);
    return transaction;
  }

  /**
   * Execute a staking contract
   */
  executeStake(from: string, amount: number, duration: number): Transaction {
    const transaction: Transaction = {
      id: crypto.randomUUID(),
      from,
      to: 'staking_pool',
      amount,
      type: 'stake',
      metadata: {
        duration,
        startTime: Date.now(),
        endTime: Date.now() + duration,
      },
      timestamp: Date.now(),
    };

    this.blockchain.addTransaction(transaction);
    return transaction;
  }
}

/**
 * Token Rewards Service
 * Manage AETH token rewards for platform activities
 */
export class TokenRewardsService {
  private smartContract: SmartContractService;

  constructor(smartContract: SmartContractService) {
    this.smartContract = smartContract;
  }

  /**
   * Reward user for creating a post
   */
  rewardPost(userId: string): Transaction {
    return this.smartContract.executeReward(userId, 1, 'Created a post');
  }

  /**
   * Reward user for getting likes
   */
  rewardLikes(userId: string, likesCount: number): Transaction {
    const amount = Math.min(likesCount * 0.1, 10); // Max 10 AETH
    return this.smartContract.executeReward(userId, amount, `Received ${likesCount} likes`);
  }

  /**
   * Reward user for completing a course
   */
  rewardCourseCompletion(userId: string, courseId: string): Transaction {
    return this.smartContract.executeReward(userId, 50, `Completed course ${courseId}`);
  }

  /**
   * Reward user for making a sale
   */
  rewardSale(sellerId: string, saleAmount: number): Transaction {
    const reward = saleAmount * 0.01; // 1% of sale as reward
    return this.smartContract.executeReward(sellerId, reward, `Made a sale of ${saleAmount} AETH`);
  }

  /**
   * Reward user for daily login
   */
  rewardDailyLogin(userId: string): Transaction {
    return this.smartContract.executeReward(userId, 0.5, 'Daily login bonus');
  }
}

// Export singleton instances
export const blockchain = new BlockchainService();
export const walletService = new WalletService();
export const smartContractService = new SmartContractService(blockchain);
export const tokenRewardsService = new TokenRewardsService(smartContractService);

