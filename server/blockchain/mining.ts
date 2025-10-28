/**
 * AETHERIAL Blockchain - Mining & Consensus
 * 
 * Mining Pool and Consensus Mechanism
 * 
 * Features:
 * - Mining pool with worker distribution
 * - Proof of Work algorithm
 * - Proof of Stake validator selection
 * - Reward distribution
 * - Difficulty adjustment
 * - Mining statistics
 * 
 * @module blockchain/mining
 */

import { Blockchain, Block, Transaction } from './core';
import * as crypto from 'crypto';

/**
 * Miner class
 */
export class Miner {
  private isMin ing: boolean = false;
  private hashRate: number = 0;
  private totalHashes: number = 0;

  constructor(
    public address: string,
    private blockchain: Blockchain
  ) {}

  /**
   * Start mining
   */
  async startMining(): Promise<void> {
    this.isMining = true;
    console.log(`Miner ${this.address} started mining`);

    while (this.isMining) {
      const block = this.blockchain.minePendingTransactions(this.address);
      
      if (block) {
        console.log(`Block mined by ${this.address}: ${block.hash}`);
        this.totalHashes += Math.pow(16, block.difficulty);
        this.updateHashRate();
      } else {
        // No pending transactions, wait
        await this.sleep(1000);
      }
    }
  }

  /**
   * Stop mining
   */
  stopMining(): void {
    this.isMining = false;
    console.log(`Miner ${this.address} stopped mining`);
  }

  /**
   * Update hash rate
   */
  private updateHashRate(): void {
    // Calculate hashes per second
    this.hashRate = this.totalHashes / (Date.now() / 1000);
  }

  /**
   * Get mining statistics
   */
  getStats(): MinerStats {
    return {
      address: this.address,
      isM ining: this.isMining,
      hashRate: this.hashRate,
      totalHashes: this.totalHashes,
      balance: this.blockchain.getBalance(this.address)
    };
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Mining Pool class
 */
export class MiningPool {
  private miners: Map<string, Miner> = new Map();
  private shares: Map<string, number> = new Map();
  private totalShares: number = 0;

  constructor(
    public name: string,
    private blockchain: Blockchain,
    public feePercent: number = 1
  ) {}

  /**
   * Add miner to pool
   */
  addMiner(address: string): Miner {
    if (this.miners.has(address)) {
      return this.miners.get(address)!;
    }

    const miner = new Miner(address, this.blockchain);
    this.miners.set(address, miner);
    this.shares.set(address, 0);

    console.log(`Miner ${address} joined pool ${this.name}`);
    return miner;
  }

  /**
   * Remove miner from pool
   */
  removeMiner(address: string): void {
    const miner = this.miners.get(address);
    if (miner) {
      miner.stopMining();
      this.miners.delete(address);
      this.shares.delete(address);
      console.log(`Miner ${address} left pool ${this.name}`);
    }
  }

  /**
   * Record share (work done by miner)
   */
  recordShare(address: string, difficulty: number): void {
    const currentShares = this.shares.get(address) || 0;
    const newShares = currentShares + difficulty;
    this.shares.set(address, newShares);
    this.totalShares += difficulty;
  }

  /**
   * Distribute rewards
   */
  distributeRewards(blockReward: number): Map<string, number> {
    const rewards = new Map<string, number>();
    
    // Calculate pool fee
    const poolFee = blockReward * (this.feePercent / 100);
    const netReward = blockReward - poolFee;

    // Distribute based on shares
    for (const [address, shares] of this.shares.entries()) {
      const minerReward = (shares / this.totalShares) * netReward;
      rewards.set(address, minerReward);
    }

    // Reset shares
    this.shares.clear();
    this.totalShares = 0;

    return rewards;
  }

  /**
   * Get pool statistics
   */
  getStats(): PoolStats {
    const miners = Array.from(this.miners.values()).map(m => m.getStats());
    const totalHashRate = miners.reduce((sum, m) => sum + m.hashRate, 0);

    return {
      name: this.name,
      miners: miners.length,
      totalHashRate,
      feePercent: this.feePercent,
      totalShares: this.totalShares
    };
  }
}

/**
 * Validator class (for Proof of Stake)
 */
export class Validator {
  private isValidating: boolean = false;
  private blocksValidated: number = 0;

  constructor(
    public address: string,
    public stake: number,
    private blockchain: Blockchain
  ) {
    // Register as validator
    blockchain.addValidator(address, stake);
  }

  /**
   * Start validating
   */
  async startValidating(): Promise<void> {
    this.isValidating = true;
    console.log(`Validator ${this.address} started validating (stake: ${this.stake})`);

    while (this.isValidating) {
      // Check if selected to validate
      if (this.isSelected()) {
        const block = this.blockchain.validateBlock(this.address);
        
        if (block) {
          console.log(`Block validated by ${this.address}: ${block.hash}`);
          this.blocksValidated++;
        }
      }

      // Wait before next validation attempt
      await this.sleep(5000);
    }
  }

  /**
   * Stop validating
   */
  stopValidating(): void {
    this.isValidating = false;
    this.blockchain.removeValidator(this.address);
    console.log(`Validator ${this.address} stopped validating`);
  }

  /**
   * Check if validator is selected
   */
  private isSelected(): boolean {
    // Probability based on stake
    const totalStake = Array.from(this.blockchain.validators.values())
      .reduce((sum, stake) => sum + stake, 0);
    
    const probability = this.stake / totalStake;
    return Math.random() < probability;
  }

  /**
   * Increase stake
   */
  increaseStake(amount: number): void {
    this.stake += amount;
    this.blockchain.addValidator(this.address, this.stake);
  }

  /**
   * Decrease stake
   */
  decreaseStake(amount: number): void {
    this.stake = Math.max(0, this.stake - amount);
    if (this.stake === 0) {
      this.stopValidating();
    } else {
      this.blockchain.addValidator(this.address, this.stake);
    }
  }

  /**
   * Get validator statistics
   */
  getStats(): ValidatorStats {
    return {
      address: this.address,
      stake: this.stake,
      isValidating: this.isValidating,
      blocksValidated: this.blocksValidated,
      balance: this.blockchain.getBalance(this.address)
    };
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Consensus Manager
 */
export class ConsensusManager {
  private miners: Map<string, Miner> = new Map();
  private validators: Map<string, Validator> = new Map();
  private miningPools: Map<string, MiningPool> = new Map();

  constructor(private blockchain: Blockchain) {}

  /**
   * Add miner
   */
  addMiner(address: string): Miner {
    if (this.miners.has(address)) {
      return this.miners.get(address)!;
    }

    const miner = new Miner(address, this.blockchain);
    this.miners.set(address, miner);
    return miner;
  }

  /**
   * Remove miner
   */
  removeMiner(address: string): void {
    const miner = this.miners.get(address);
    if (miner) {
      miner.stopMining();
      this.miners.delete(address);
    }
  }

  /**
   * Add validator
   */
  addValidator(address: string, stake: number): Validator {
    if (this.validators.has(address)) {
      return this.validators.get(address)!;
    }

    const validator = new Validator(address, stake, this.blockchain);
    this.validators.set(address, validator);
    return validator;
  }

  /**
   * Remove validator
   */
  removeValidator(address: string): void {
    const validator = this.validators.get(address);
    if (validator) {
      validator.stopValidating();
      this.validators.delete(address);
    }
  }

  /**
   * Create mining pool
   */
  createMiningPool(name: string, feePercent: number = 1): MiningPool {
    if (this.miningPools.has(name)) {
      return this.miningPools.get(name)!;
    }

    const pool = new MiningPool(name, this.blockchain, feePercent);
    this.miningPools.set(name, pool);
    return pool;
  }

  /**
   * Get mining pool
   */
  getMiningPool(name: string): MiningPool | undefined {
    return this.miningPools.get(name);
  }

  /**
   * Get consensus statistics
   */
  getStats(): ConsensusStats {
    const minerStats = Array.from(this.miners.values()).map(m => m.getStats());
    const validatorStats = Array.from(this.validators.values()).map(v => v.getStats());
    const poolStats = Array.from(this.miningPools.values()).map(p => p.getStats());

    const totalHashRate = minerStats.reduce((sum, m) => sum + m.hashRate, 0);
    const totalStake = validatorStats.reduce((sum, v) => sum + v.stake, 0);

    return {
      miners: minerStats.length,
      validators: validatorStats.length,
      miningPools: poolStats.length,
      totalHashRate,
      totalStake,
      minerStats,
      validatorStats,
      poolStats
    };
  }
}

/**
 * Type definitions
 */
export interface MinerStats {
  address: string;
  isMining: boolean;
  hashRate: number;
  totalHashes: number;
  balance: number;
}

export interface ValidatorStats {
  address: string;
  stake: number;
  isValidating: boolean;
  blocksValidated: number;
  balance: number;
}

export interface PoolStats {
  name: string;
  miners: number;
  totalHashRate: number;
  feePercent: number;
  totalShares: number;
}

export interface ConsensusStats {
  miners: number;
  validators: number;
  miningPools: number;
  totalHashRate: number;
  totalStake: number;
  minerStats: MinerStats[];
  validatorStats: ValidatorStats[];
  poolStats: PoolStats[];
}

// Export singleton
export const consensusManager = new ConsensusManager(require('./core').aetherial);

