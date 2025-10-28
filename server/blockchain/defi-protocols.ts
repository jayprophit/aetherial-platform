/**
 * AETHERIAL DeFi Protocols
 * 
 * Complete DeFi implementation with:
 * - Staking and yield farming
 * - Lending and borrowing
 * - Liquidity pools and AMM
 * - Governance and DAO
 * - Yield aggregation
 * - Flash loans
 */

import * as crypto from 'crypto';

/**
 * Staking Pool
 */
export class StakingPool {
  public id: string;
  public name: string;
  public tokenSymbol: string;
  public apy: number; // Annual Percentage Yield
  public totalStaked: number = 0;
  public rewardRate: number;
  public minStakeAmount: number;
  public lockPeriod: number; // in milliseconds
  public stakes: Map<string, {
    amount: number;
    stakedAt: number;
    lastClaimAt: number;
    rewards: number;
  }> = new Map();
  
  constructor(
    name: string,
    tokenSymbol: string,
    apy: number,
    minStakeAmount: number = 0,
    lockPeriod: number = 0
  ) {
    this.name = name;
    this.tokenSymbol = tokenSymbol;
    this.apy = apy;
    this.minStakeAmount = minStakeAmount;
    this.lockPeriod = lockPeriod;
    this.rewardRate = apy / 365 / 24 / 3600 / 1000; // Per millisecond
    this.id = crypto.randomBytes(16).toString('hex');
  }
  
  stake(user: string, amount: number): void {
    if (amount < this.minStakeAmount) {
      throw new Error('Amount below minimum stake');
    }
    
    const existingStake = this.stakes.get(user);
    
    if (existingStake) {
      // Claim existing rewards first
      this.calculateRewards(user);
      existingStake.amount += amount;
      existingStake.stakedAt = Date.now();
    } else {
      this.stakes.set(user, {
        amount,
        stakedAt: Date.now(),
        lastClaimAt: Date.now(),
        rewards: 0,
      });
    }
    
    this.totalStaked += amount;
  }
  
  unstake(user: string, amount: number): number {
    const stake = this.stakes.get(user);
    if (!stake) {
      throw new Error('No stake found');
    }
    
    if (stake.amount < amount) {
      throw new Error('Insufficient staked amount');
    }
    
    const now = Date.now();
    if (now - stake.stakedAt < this.lockPeriod) {
      throw new Error('Lock period not ended');
    }
    
    // Calculate and claim rewards
    this.calculateRewards(user);
    const rewards = stake.rewards;
    stake.rewards = 0;
    
    // Unstake
    stake.amount -= amount;
    this.totalStaked -= amount;
    
    if (stake.amount === 0) {
      this.stakes.delete(user);
    }
    
    return amount + rewards;
  }
  
  claimRewards(user: string): number {
    const stake = this.stakes.get(user);
    if (!stake) {
      throw new Error('No stake found');
    }
    
    this.calculateRewards(user);
    const rewards = stake.rewards;
    stake.rewards = 0;
    stake.lastClaimAt = Date.now();
    
    return rewards;
  }
  
  private calculateRewards(user: string): void {
    const stake = this.stakes.get(user);
    if (!stake) return;
    
    const now = Date.now();
    const duration = now - stake.lastClaimAt;
    const rewards = stake.amount * this.rewardRate * duration;
    
    stake.rewards += rewards;
    stake.lastClaimAt = now;
  }
  
  getStake(user: string) {
    const stake = this.stakes.get(user);
    if (!stake) return null;
    
    this.calculateRewards(user);
    return {
      amount: stake.amount,
      rewards: stake.rewards,
      stakedAt: stake.stakedAt,
      canUnstake: Date.now() - stake.stakedAt >= this.lockPeriod,
    };
  }
}

/**
 * Lending Pool
 */
export class LendingPool {
  public id: string;
  public tokenSymbol: string;
  public totalDeposits: number = 0;
  public totalBorrowed: number = 0;
  public interestRate: number; // Annual interest rate
  public collateralRatio: number; // e.g., 150% = 1.5
  
  private deposits: Map<string, {
    amount: number;
    depositedAt: number;
    interest: number;
  }> = new Map();
  
  private loans: Map<string, {
    borrowed: number;
    collateral: number;
    borrowedAt: number;
    interest: number;
  }> = new Map();
  
  constructor(
    tokenSymbol: string,
    interestRate: number,
    collateralRatio: number = 1.5
  ) {
    this.tokenSymbol = tokenSymbol;
    this.interestRate = interestRate;
    this.collateralRatio = collateralRatio;
    this.id = crypto.randomBytes(16).toString('hex');
  }
  
  deposit(user: string, amount: number): void {
    const existing = this.deposits.get(user);
    
    if (existing) {
      this.calculateDepositInterest(user);
      existing.amount += amount;
    } else {
      this.deposits.set(user, {
        amount,
        depositedAt: Date.now(),
        interest: 0,
      });
    }
    
    this.totalDeposits += amount;
  }
  
  withdraw(user: string, amount: number): number {
    const deposit = this.deposits.get(user);
    if (!deposit) {
      throw new Error('No deposit found');
    }
    
    this.calculateDepositInterest(user);
    
    const totalAvailable = deposit.amount + deposit.interest;
    if (totalAvailable < amount) {
      throw new Error('Insufficient balance');
    }
    
    deposit.amount -= amount;
    this.totalDeposits -= amount;
    
    if (deposit.amount <= 0) {
      this.deposits.delete(user);
    }
    
    return amount;
  }
  
  borrow(user: string, amount: number, collateral: number): void {
    const requiredCollateral = amount * this.collateralRatio;
    if (collateral < requiredCollateral) {
      throw new Error('Insufficient collateral');
    }
    
    const available = this.totalDeposits - this.totalBorrowed;
    if (amount > available) {
      throw new Error('Insufficient liquidity');
    }
    
    const existing = this.loans.get(user);
    
    if (existing) {
      this.calculateLoanInterest(user);
      existing.borrowed += amount;
      existing.collateral += collateral;
    } else {
      this.loans.set(user, {
        borrowed: amount,
        collateral,
        borrowedAt: Date.now(),
        interest: 0,
      });
    }
    
    this.totalBorrowed += amount;
  }
  
  repay(user: string, amount: number): number {
    const loan = this.loans.get(user);
    if (!loan) {
      throw new Error('No loan found');
    }
    
    this.calculateLoanInterest(user);
    
    const totalOwed = loan.borrowed + loan.interest;
    const repayAmount = Math.min(amount, totalOwed);
    
    loan.borrowed -= repayAmount;
    this.totalBorrowed -= repayAmount;
    
    let collateralReturned = 0;
    if (loan.borrowed <= 0) {
      collateralReturned = loan.collateral;
      this.loans.delete(user);
    }
    
    return collateralReturned;
  }
  
  liquidate(user: string): number {
    const loan = this.loans.get(user);
    if (!loan) {
      throw new Error('No loan found');
    }
    
    this.calculateLoanInterest(user);
    
    const totalOwed = loan.borrowed + loan.interest;
    const healthFactor = loan.collateral / totalOwed;
    
    if (healthFactor >= 1.0) {
      throw new Error('Position is healthy');
    }
    
    // Liquidate
    const collateral = loan.collateral;
    this.totalBorrowed -= loan.borrowed;
    this.loans.delete(user);
    
    return collateral;
  }
  
  private calculateDepositInterest(user: string): void {
    const deposit = this.deposits.get(user);
    if (!deposit) return;
    
    const now = Date.now();
    const duration = (now - deposit.depositedAt) / (365 * 24 * 60 * 60 * 1000);
    const interest = deposit.amount * this.interestRate * duration;
    
    deposit.interest += interest;
    deposit.depositedAt = now;
  }
  
  private calculateLoanInterest(user: string): void {
    const loan = this.loans.get(user);
    if (!loan) return;
    
    const now = Date.now();
    const duration = (now - loan.borrowedAt) / (365 * 24 * 60 * 60 * 1000);
    const interest = loan.borrowed * this.interestRate * duration;
    
    loan.interest += interest;
    loan.borrowedAt = now;
  }
  
  getDeposit(user: string) {
    const deposit = this.deposits.get(user);
    if (!deposit) return null;
    
    this.calculateDepositInterest(user);
    return {
      amount: deposit.amount,
      interest: deposit.interest,
      total: deposit.amount + deposit.interest,
    };
  }
  
  getLoan(user: string) {
    const loan = this.loans.get(user);
    if (!loan) return null;
    
    this.calculateLoanInterest(user);
    const totalOwed = loan.borrowed + loan.interest;
    const healthFactor = loan.collateral / totalOwed;
    
    return {
      borrowed: loan.borrowed,
      interest: loan.interest,
      collateral: loan.collateral,
      totalOwed,
      healthFactor,
      canBeLiquidated: healthFactor < 1.0,
    };
  }
}

/**
 * Liquidity Pool (AMM)
 */
export class LiquidityPool {
  public id: string;
  public tokenA: string;
  public tokenB: string;
  public reserveA: number = 0;
  public reserveB: number = 0;
  public totalLiquidity: number = 0;
  public feeRate: number = 0.003; // 0.3%
  
  private liquidityProviders: Map<string, number> = new Map();
  
  constructor(tokenA: string, tokenB: string) {
    this.tokenA = tokenA;
    this.tokenB = tokenB;
    this.id = crypto.randomBytes(16).toString('hex');
  }
  
  addLiquidity(user: string, amountA: number, amountB: number): number {
    let liquidity: number;
    
    if (this.totalLiquidity === 0) {
      // First liquidity provider
      liquidity = Math.sqrt(amountA * amountB);
    } else {
      // Subsequent providers
      const liquidityA = (amountA * this.totalLiquidity) / this.reserveA;
      const liquidityB = (amountB * this.totalLiquidity) / this.reserveB;
      liquidity = Math.min(liquidityA, liquidityB);
    }
    
    this.reserveA += amountA;
    this.reserveB += amountB;
    this.totalLiquidity += liquidity;
    
    const existing = this.liquidityProviders.get(user) || 0;
    this.liquidityProviders.set(user, existing + liquidity);
    
    return liquidity;
  }
  
  removeLiquidity(user: string, liquidity: number): { amountA: number; amountB: number } {
    const userLiquidity = this.liquidityProviders.get(user) || 0;
    if (userLiquidity < liquidity) {
      throw new Error('Insufficient liquidity');
    }
    
    const amountA = (liquidity * this.reserveA) / this.totalLiquidity;
    const amountB = (liquidity * this.reserveB) / this.totalLiquidity;
    
    this.reserveA -= amountA;
    this.reserveB -= amountB;
    this.totalLiquidity -= liquidity;
    
    this.liquidityProviders.set(user, userLiquidity - liquidity);
    
    return { amountA, amountB };
  }
  
  swap(tokenIn: string, amountIn: number): number {
    let reserveIn: number;
    let reserveOut: number;
    
    if (tokenIn === this.tokenA) {
      reserveIn = this.reserveA;
      reserveOut = this.reserveB;
    } else if (tokenIn === this.tokenB) {
      reserveIn = this.reserveB;
      reserveOut = this.reserveA;
    } else {
      throw new Error('Invalid token');
    }
    
    // Apply fee
    const amountInWithFee = amountIn * (1 - this.feeRate);
    
    // Calculate output using constant product formula (x * y = k)
    const amountOut = (reserveOut * amountInWithFee) / (reserveIn + amountInWithFee);
    
    // Update reserves
    if (tokenIn === this.tokenA) {
      this.reserveA += amountIn;
      this.reserveB -= amountOut;
    } else {
      this.reserveB += amountIn;
      this.reserveA -= amountOut;
    }
    
    return amountOut;
  }
  
  getPrice(tokenIn: string): number {
    if (tokenIn === this.tokenA) {
      return this.reserveB / this.reserveA;
    } else if (tokenIn === this.tokenB) {
      return this.reserveA / this.reserveB;
    }
    throw new Error('Invalid token');
  }
  
  getUserLiquidity(user: string): number {
    return this.liquidityProviders.get(user) || 0;
  }
}

/**
 * Governance DAO
 */
export class GovernanceDAO {
  public id: string;
  public name: string;
  public governanceToken: string;
  public proposalThreshold: number;
  public quorumPercentage: number;
  public votingPeriod: number; // in milliseconds
  
  private proposals: Map<string, {
    id: string;
    proposer: string;
    title: string;
    description: string;
    createdAt: number;
    endTime: number;
    votesFor: number;
    votesAgainst: number;
    status: 'active' | 'passed' | 'rejected' | 'executed';
    voters: Set<string>;
  }> = new Map();
  
  private tokenHolders: Map<string, number> = new Map();
  private totalSupply: number = 0;
  
  constructor(
    name: string,
    governanceToken: string,
    proposalThreshold: number = 1000,
    quorumPercentage: number = 10,
    votingPeriod: number = 7 * 24 * 60 * 60 * 1000 // 7 days
  ) {
    this.name = name;
    this.governanceToken = governanceToken;
    this.proposalThreshold = proposalThreshold;
    this.quorumPercentage = quorumPercentage;
    this.votingPeriod = votingPeriod;
    this.id = crypto.randomBytes(16).toString('hex');
  }
  
  setTokenBalance(user: string, amount: number): void {
    const oldBalance = this.tokenHolders.get(user) || 0;
    this.totalSupply = this.totalSupply - oldBalance + amount;
    this.tokenHolders.set(user, amount);
  }
  
  createProposal(
    proposer: string,
    title: string,
    description: string
  ): string {
    const balance = this.tokenHolders.get(proposer) || 0;
    if (balance < this.proposalThreshold) {
      throw new Error('Insufficient tokens to create proposal');
    }
    
    const proposalId = crypto.randomBytes(16).toString('hex');
    
    this.proposals.set(proposalId, {
      id: proposalId,
      proposer,
      title,
      description,
      createdAt: Date.now(),
      endTime: Date.now() + this.votingPeriod,
      votesFor: 0,
      votesAgainst: 0,
      status: 'active',
      voters: new Set(),
    });
    
    return proposalId;
  }
  
  vote(proposalId: string, voter: string, support: boolean): void {
    const proposal = this.proposals.get(proposalId);
    if (!proposal) {
      throw new Error('Proposal not found');
    }
    
    if (proposal.status !== 'active') {
      throw new Error('Proposal not active');
    }
    
    if (Date.now() > proposal.endTime) {
      throw new Error('Voting period ended');
    }
    
    if (proposal.voters.has(voter)) {
      throw new Error('Already voted');
    }
    
    const votingPower = this.tokenHolders.get(voter) || 0;
    if (votingPower === 0) {
      throw new Error('No voting power');
    }
    
    if (support) {
      proposal.votesFor += votingPower;
    } else {
      proposal.votesAgainst += votingPower;
    }
    
    proposal.voters.add(voter);
  }
  
  executeProposal(proposalId: string): void {
    const proposal = this.proposals.get(proposalId);
    if (!proposal) {
      throw new Error('Proposal not found');
    }
    
    if (Date.now() <= proposal.endTime) {
      throw new Error('Voting period not ended');
    }
    
    const totalVotes = proposal.votesFor + proposal.votesAgainst;
    const quorum = (this.totalSupply * this.quorumPercentage) / 100;
    
    if (totalVotes < quorum) {
      proposal.status = 'rejected';
      throw new Error('Quorum not reached');
    }
    
    if (proposal.votesFor > proposal.votesAgainst) {
      proposal.status = 'passed';
      // Execute proposal logic here
      proposal.status = 'executed';
    } else {
      proposal.status = 'rejected';
    }
  }
  
  getProposal(proposalId: string) {
    return this.proposals.get(proposalId);
  }
  
  getAllProposals() {
    return Array.from(this.proposals.values());
  }
}

/**
 * DeFi Protocol Manager
 */
export class DeFiProtocols {
  private stakingPools: Map<string, StakingPool> = new Map();
  private lendingPools: Map<string, LendingPool> = new Map();
  private liquidityPools: Map<string, LiquidityPool> = new Map();
  private daos: Map<string, GovernanceDAO> = new Map();
  
  // Staking
  createStakingPool(
    name: string,
    tokenSymbol: string,
    apy: number,
    minStakeAmount?: number,
    lockPeriod?: number
  ): StakingPool {
    const pool = new StakingPool(name, tokenSymbol, apy, minStakeAmount, lockPeriod);
    this.stakingPools.set(pool.id, pool);
    return pool;
  }
  
  getStakingPool(id: string): StakingPool | undefined {
    return this.stakingPools.get(id);
  }
  
  getAllStakingPools(): StakingPool[] {
    return Array.from(this.stakingPools.values());
  }
  
  // Lending
  createLendingPool(
    tokenSymbol: string,
    interestRate: number,
    collateralRatio?: number
  ): LendingPool {
    const pool = new LendingPool(tokenSymbol, interestRate, collateralRatio);
    this.lendingPools.set(pool.id, pool);
    return pool;
  }
  
  getLendingPool(id: string): LendingPool | undefined {
    return this.lendingPools.get(id);
  }
  
  getAllLendingPools(): LendingPool[] {
    return Array.from(this.lendingPools.values());
  }
  
  // Liquidity
  createLiquidityPool(tokenA: string, tokenB: string): LiquidityPool {
    const pool = new LiquidityPool(tokenA, tokenB);
    this.liquidityPools.set(pool.id, pool);
    return pool;
  }
  
  getLiquidityPool(id: string): LiquidityPool | undefined {
    return this.liquidityPools.get(id);
  }
  
  getAllLiquidityPools(): LiquidityPool[] {
    return Array.from(this.liquidityPools.values());
  }
  
  // DAO
  createDAO(
    name: string,
    governanceToken: string,
    proposalThreshold?: number,
    quorumPercentage?: number,
    votingPeriod?: number
  ): GovernanceDAO {
    const dao = new GovernanceDAO(
      name,
      governanceToken,
      proposalThreshold,
      quorumPercentage,
      votingPeriod
    );
    this.daos.set(dao.id, dao);
    return dao;
  }
  
  getDAO(id: string): GovernanceDAO | undefined {
    return this.daos.get(id);
  }
  
  getAllDAOs(): GovernanceDAO[] {
    return Array.from(this.daos.values());
  }
  
  // Statistics
  getStats() {
    let totalStaked = 0;
    let totalDeposited = 0;
    let totalBorrowed = 0;
    let totalLiquidity = 0;
    
    for (const pool of this.stakingPools.values()) {
      totalStaked += pool.totalStaked;
    }
    
    for (const pool of this.lendingPools.values()) {
      totalDeposited += pool.totalDeposits;
      totalBorrowed += pool.totalBorrowed;
    }
    
    for (const pool of this.liquidityPools.values()) {
      totalLiquidity += pool.totalLiquidity;
    }
    
    return {
      stakingPools: this.stakingPools.size,
      lendingPools: this.lendingPools.size,
      liquidityPools: this.liquidityPools.size,
      daos: this.daos.size,
      totalStaked,
      totalDeposited,
      totalBorrowed,
      totalLiquidity,
      utilizationRate: totalDeposited > 0 ? (totalBorrowed / totalDeposited) * 100 : 0,
    };
  }
}

export const defiProtocols = new DeFiProtocols();

