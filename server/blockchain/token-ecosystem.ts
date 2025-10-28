/**
 * AETHERIAL Three-Token Ecosystem
 * 
 * Complete token system with:
 * 1. AETH Coin - Native blockchain currency (like BTC)
 * 2. AETH Token - Smart contract token (like ETH)
 * 3. AGAS Token - Pegged gas token for predictable fees
 * 
 * Plus:
 * - DEX (Uniswap/PancakeSwap style)
 * - Dust sweeper for small balances
 * - Age-based safety controls
 * - Parental controls
 */

import { EventEmitter } from 'events';
import * as crypto from 'crypto';

/**
 * Token types
 */
export enum TokenType {
  AETH_COIN = 'AETH_COIN',    // Native coin
  AETH_TOKEN = 'AETH_TOKEN',  // Smart contract token
  AGAS = 'AGAS',              // Gas token
  CUSTOM = 'CUSTOM'           // User-created tokens
}

/**
 * Token balance
 */
interface TokenBalance {
  token: string;
  type: TokenType;
  amount: number;
  value: number; // USD value
  locked: number;
  staked: number;
}

/**
 * Age tier permissions
 */
interface AgeTierPermissions {
  canTrade: boolean;
  canWithdraw: boolean;
  canStake: boolean;
  canCreateSmartContracts: boolean;
  canUseDeFi: boolean;
  canBuyNFT: boolean;
  canSellNFT: boolean;
  canP2PTransfer: boolean;
  canUseSocial: boolean;
  maxDailyTrade: number;
  maxDailyWithdraw: number;
  requiresParentalApproval: boolean;
}

/**
 * Parental control settings
 */
interface ParentalControls {
  enabled: boolean;
  parentUserId: string;
  spendingLimit: number;
  dailyLimit: number;
  approvalRequired: boolean;
  alertsEnabled: boolean;
  allowedFeatures: string[];
  blockedFeatures: string[];
  emergencyFreeze: boolean;
}

/**
 * Liquidity pool
 */
interface LiquidityPool {
  id: string;
  tokenA: string;
  tokenB: string;
  reserveA: number;
  reserveB: number;
  totalLiquidity: number;
  feeRate: number;
  lpTokenSupply: number;
  providers: Map<string, number>; // userId -> LP tokens
}

/**
 * Swap route
 */
interface SwapRoute {
  path: string[];
  expectedOutput: number;
  priceImpact: number;
  minimumOutput: number;
}

/**
 * Token Ecosystem Manager
 */
export class TokenEcosystem extends EventEmitter {
  // Token supplies
  private readonly AETH_COIN_MAX_SUPPLY = 21_000_000; // Like Bitcoin
  private readonly AETH_TOKEN_INITIAL_SUPPLY = 100_000_000;
  private readonly AGAS_PEG_PRICE = 0.01; // $0.01 per AGAS
  private readonly NEW_USER_AGAS_BONUS = 1000; // 1000 AGAS = $10
  
  // Token balances
  private balances: Map<string, Map<string, TokenBalance>> = new Map(); // userId -> token -> balance
  private totalSupply: Map<string, number> = new Map();
  
  // Liquidity pools
  private pools: Map<string, LiquidityPool> = new Map();
  
  // Age permissions
  private agePermissions: Map<string, AgeTierPermissions> = new Map();
  
  // Parental controls
  private parentalControls: Map<string, ParentalControls> = new Map();
  
  // Dust threshold
  private readonly DUST_THRESHOLD = 1.0; // $1 USD
  
  constructor() {
    super();
    this.initializeAgePermissions();
    this.initializeTokens();
    this.initializeLiquidityPools();
  }
  
  /**
   * Initialize age-based permissions
   */
  private initializeAgePermissions(): void {
    // Under 13 - Maximum protection
    this.agePermissions.set('under13', {
      canTrade: false,
      canWithdraw: false,
      canStake: false,
      canCreateSmartContracts: false,
      canUseDeFi: false,
      canBuyNFT: false,
      canSellNFT: false,
      canP2PTransfer: false,
      canUseSocial: false,
      maxDailyTrade: 0,
      maxDailyWithdraw: 0,
      requiresParentalApproval: true,
    });
    
    // 13-15 - Limited access
    this.agePermissions.set('13-15', {
      canTrade: true,
      canWithdraw: false,
      canStake: true,
      canCreateSmartContracts: false,
      canUseDeFi: false,
      canBuyNFT: true,
      canSellNFT: false,
      canP2PTransfer: false,
      canUseSocial: true,
      maxDailyTrade: 100,
      maxDailyWithdraw: 0,
      requiresParentalApproval: true,
    });
    
    // 16-17 - Moderate access
    this.agePermissions.set('16-17', {
      canTrade: true,
      canWithdraw: true,
      canStake: true,
      canCreateSmartContracts: true,
      canUseDeFi: true,
      canBuyNFT: true,
      canSellNFT: true,
      canP2PTransfer: true,
      canUseSocial: true,
      maxDailyTrade: 500,
      maxDailyWithdraw: 100,
      requiresParentalApproval: false,
    });
    
    // 18+ - Full access
    this.agePermissions.set('18+', {
      canTrade: true,
      canWithdraw: true,
      canStake: true,
      canCreateSmartContracts: true,
      canUseDeFi: true,
      canBuyNFT: true,
      canSellNFT: true,
      canP2PTransfer: true,
      canUseSocial: true,
      maxDailyTrade: Infinity,
      maxDailyWithdraw: Infinity,
      requiresParentalApproval: false,
    });
  }
  
  /**
   * Get age tier
   */
  private getAgeTier(age: number): string {
    if (age < 13) return 'under13';
    if (age >= 13 && age <= 15) return '13-15';
    if (age >= 16 && age <= 17) return '16-17';
    return '18+';
  }
  
  /**
   * Check permission
   */
  checkPermission(userId: string, age: number, action: keyof AgeTierPermissions): boolean {
    const tier = this.getAgeTier(age);
    const permissions = this.agePermissions.get(tier)!;
    
    // Check parental controls
    const parentalControl = this.parentalControls.get(userId);
    if (parentalControl?.emergencyFreeze) {
      return false;
    }
    
    if (parentalControl?.enabled && parentalControl.blockedFeatures.includes(action)) {
      return false;
    }
    
    return permissions[action] as boolean;
  }
  
  /**
   * Set up parental controls
   */
  setupParentalControls(
    childUserId: string,
    parentUserId: string,
    settings: Partial<ParentalControls>
  ): void {
    this.parentalControls.set(childUserId, {
      enabled: true,
      parentUserId,
      spendingLimit: settings.spendingLimit || 100,
      dailyLimit: settings.dailyLimit || 50,
      approvalRequired: settings.approvalRequired !== undefined ? settings.approvalRequired : true,
      alertsEnabled: settings.alertsEnabled !== undefined ? settings.alertsEnabled : true,
      allowedFeatures: settings.allowedFeatures || [],
      blockedFeatures: settings.blockedFeatures || [],
      emergencyFreeze: false,
    });
    
    this.emit('parental-controls-set', { childUserId, parentUserId });
  }
  
  /**
   * Emergency freeze account
   */
  emergencyFreeze(userId: string, freeze: boolean): void {
    const controls = this.parentalControls.get(userId);
    if (controls) {
      controls.emergencyFreeze = freeze;
      this.emit('emergency-freeze', { userId, freeze });
    }
  }
  
  /**
   * Initialize tokens
   */
  private initializeTokens(): void {
    this.totalSupply.set(TokenType.AETH_COIN, 0); // Mined over time
    this.totalSupply.set(TokenType.AETH_TOKEN, this.AETH_TOKEN_INITIAL_SUPPLY);
    this.totalSupply.set(TokenType.AGAS, 0); // Minted on demand
  }
  
  /**
   * Initialize liquidity pools
   */
  private initializeLiquidityPools(): void {
    // Create default pools
    this.createPool('AETH_COIN', 'AETH_TOKEN', 0.003);
    this.createPool('AETH_TOKEN', 'USDT', 0.003);
    this.createPool('AETH_COIN', 'USDT', 0.003);
    this.createPool('AETH_TOKEN', 'BTC', 0.003);
    this.createPool('AETH_TOKEN', 'ETH', 0.003);
  }
  
  /**
   * Create new user account with starter bonuses
   */
  createUserAccount(userId: string, age: number): void {
    const userBalances = new Map<string, TokenBalance>();
    
    // Give starter AGAS for gas fees
    userBalances.set(TokenType.AGAS, {
      token: TokenType.AGAS,
      type: TokenType.AGAS,
      amount: this.NEW_USER_AGAS_BONUS,
      value: this.NEW_USER_AGAS_BONUS * this.AGAS_PEG_PRICE,
      locked: 0,
      staked: 0,
    });
    
    // Give welcome bonus in AETH Token
    userBalances.set(TokenType.AETH_TOKEN, {
      token: TokenType.AETH_TOKEN,
      type: TokenType.AETH_TOKEN,
      amount: 100,
      value: 100, // Assume $1 per token
      locked: 0,
      staked: 0,
    });
    
    this.balances.set(userId, userBalances);
    
    this.emit('account-created', { userId, agasBonus: this.NEW_USER_AGAS_BONUS });
  }
  
  /**
   * Get balance
   */
  getBalance(userId: string, token: string): TokenBalance | undefined {
    return this.balances.get(userId)?.get(token);
  }
  
  /**
   * Get all balances
   */
  getAllBalances(userId: string): TokenBalance[] {
    const userBalances = this.balances.get(userId);
    return userBalances ? Array.from(userBalances.values()) : [];
  }
  
  /**
   * Add balance
   */
  addBalance(userId: string, token: string, amount: number, type: TokenType = TokenType.CUSTOM): void {
    let userBalances = this.balances.get(userId);
    if (!userBalances) {
      userBalances = new Map();
      this.balances.set(userId, userBalances);
    }
    
    const existing = userBalances.get(token);
    if (existing) {
      existing.amount += amount;
      existing.value = existing.amount; // Simplified
    } else {
      userBalances.set(token, {
        token,
        type,
        amount,
        value: amount,
        locked: 0,
        staked: 0,
      });
    }
    
    this.emit('balance-added', { userId, token, amount });
  }
  
  /**
   * Transfer tokens
   */
  transfer(fromUserId: string, toUserId: string, token: string, amount: number, age: number): boolean {
    if (!this.checkPermission(fromUserId, age, 'canP2PTransfer')) {
      throw new Error('P2P transfers not allowed for this age group');
    }
    
    const fromBalance = this.getBalance(fromUserId, token);
    if (!fromBalance || fromBalance.amount < amount) {
      throw new Error('Insufficient balance');
    }
    
    // Deduct from sender
    fromBalance.amount -= amount;
    
    // Add to receiver
    this.addBalance(toUserId, token, amount, fromBalance.type);
    
    this.emit('transfer', { fromUserId, toUserId, token, amount });
    return true;
  }
  
  /**
   * Create liquidity pool
   */
  createPool(tokenA: string, tokenB: string, feeRate: number = 0.003): LiquidityPool {
    const poolId = `${tokenA}-${tokenB}`;
    
    const pool: LiquidityPool = {
      id: poolId,
      tokenA,
      tokenB,
      reserveA: 0,
      reserveB: 0,
      totalLiquidity: 0,
      feeRate,
      lpTokenSupply: 0,
      providers: new Map(),
    };
    
    this.pools.set(poolId, pool);
    this.emit('pool-created', pool);
    return pool;
  }
  
  /**
   * Add liquidity to pool
   */
  addLiquidity(
    userId: string,
    poolId: string,
    amountA: number,
    amountB: number,
    age: number
  ): number {
    if (!this.checkPermission(userId, age, 'canUseDeFi')) {
      throw new Error('DeFi not allowed for this age group');
    }
    
    const pool = this.pools.get(poolId);
    if (!pool) throw new Error('Pool not found');
    
    // Check balances
    const balanceA = this.getBalance(userId, pool.tokenA);
    const balanceB = this.getBalance(userId, pool.tokenB);
    
    if (!balanceA || balanceA.amount < amountA) throw new Error('Insufficient token A');
    if (!balanceB || balanceB.amount < amountB) throw new Error('Insufficient token B');
    
    // Calculate LP tokens
    let lpTokens: number;
    if (pool.totalLiquidity === 0) {
      lpTokens = Math.sqrt(amountA * amountB);
    } else {
      const lpA = (amountA * pool.lpTokenSupply) / pool.reserveA;
      const lpB = (amountB * pool.lpTokenSupply) / pool.reserveB;
      lpTokens = Math.min(lpA, lpB);
    }
    
    // Update pool
    pool.reserveA += amountA;
    pool.reserveB += amountB;
    pool.totalLiquidity += lpTokens;
    pool.lpTokenSupply += lpTokens;
    
    // Update provider
    const existing = pool.providers.get(userId) || 0;
    pool.providers.set(userId, existing + lpTokens);
    
    // Deduct tokens from user
    balanceA.amount -= amountA;
    balanceB.amount -= amountB;
    
    this.emit('liquidity-added', { userId, poolId, amountA, amountB, lpTokens });
    return lpTokens;
  }
  
  /**
   * Remove liquidity from pool
   */
  removeLiquidity(
    userId: string,
    poolId: string,
    lpTokens: number,
    age: number
  ): { amountA: number; amountB: number } {
    if (!this.checkPermission(userId, age, 'canUseDeFi')) {
      throw new Error('DeFi not allowed for this age group');
    }
    
    const pool = this.pools.get(poolId);
    if (!pool) throw new Error('Pool not found');
    
    const userLpTokens = pool.providers.get(userId) || 0;
    if (userLpTokens < lpTokens) throw new Error('Insufficient LP tokens');
    
    // Calculate amounts
    const amountA = (lpTokens * pool.reserveA) / pool.lpTokenSupply;
    const amountB = (lpTokens * pool.reserveB) / pool.lpTokenSupply;
    
    // Update pool
    pool.reserveA -= amountA;
    pool.reserveB -= amountB;
    pool.totalLiquidity -= lpTokens;
    pool.lpTokenSupply -= lpTokens;
    pool.providers.set(userId, userLpTokens - lpTokens);
    
    // Return tokens to user
    this.addBalance(userId, pool.tokenA, amountA);
    this.addBalance(userId, pool.tokenB, amountB);
    
    this.emit('liquidity-removed', { userId, poolId, lpTokens, amountA, amountB });
    return { amountA, amountB };
  }
  
  /**
   * Swap tokens
   */
  swap(
    userId: string,
    tokenIn: string,
    tokenOut: string,
    amountIn: number,
    minAmountOut: number,
    age: number
  ): number {
    if (!this.checkPermission(userId, age, 'canTrade')) {
      throw new Error('Trading not allowed for this age group');
    }
    
    // Find best route
    const route = this.findBestRoute(tokenIn, tokenOut, amountIn);
    
    if (route.expectedOutput < minAmountOut) {
      throw new Error('Slippage too high');
    }
    
    // Execute swap along route
    let currentAmount = amountIn;
    let currentToken = tokenIn;
    
    for (let i = 0; i < route.path.length - 1; i++) {
      const from = route.path[i];
      const to = route.path[i + 1];
      const poolId = `${from}-${to}`;
      const pool = this.pools.get(poolId);
      
      if (!pool) throw new Error(`Pool ${poolId} not found`);
      
      // Execute single swap
      currentAmount = this.executeSwap(pool, currentToken, currentAmount);
      currentToken = to;
    }
    
    // Deduct input from user
    const balanceIn = this.getBalance(userId, tokenIn);
    if (!balanceIn || balanceIn.amount < amountIn) {
      throw new Error('Insufficient balance');
    }
    balanceIn.amount -= amountIn;
    
    // Add output to user
    this.addBalance(userId, tokenOut, currentAmount);
    
    this.emit('swap-executed', { userId, tokenIn, tokenOut, amountIn, amountOut: currentAmount });
    return currentAmount;
  }
  
  /**
   * Execute single swap in pool
   */
  private executeSwap(pool: LiquidityPool, tokenIn: string, amountIn: number): number {
    let reserveIn: number;
    let reserveOut: number;
    
    if (tokenIn === pool.tokenA) {
      reserveIn = pool.reserveA;
      reserveOut = pool.reserveB;
    } else {
      reserveIn = pool.reserveB;
      reserveOut = pool.reserveA;
    }
    
    // Apply fee
    const amountInWithFee = amountIn * (1 - pool.feeRate);
    
    // Constant product formula: x * y = k
    const amountOut = (reserveOut * amountInWithFee) / (reserveIn + amountInWithFee);
    
    // Update reserves
    if (tokenIn === pool.tokenA) {
      pool.reserveA += amountIn;
      pool.reserveB -= amountOut;
    } else {
      pool.reserveB += amountIn;
      pool.reserveA -= amountOut;
    }
    
    return amountOut;
  }
  
  /**
   * Find best swap route
   */
  private findBestRoute(tokenIn: string, tokenOut: string, amountIn: number): SwapRoute {
    // Direct route
    const directPoolId = `${tokenIn}-${tokenOut}`;
    const directPool = this.pools.get(directPoolId);
    
    if (directPool) {
      const output = this.calculateSwapOutput(directPool, tokenIn, amountIn);
      return {
        path: [tokenIn, tokenOut],
        expectedOutput: output,
        priceImpact: this.calculatePriceImpact(directPool, tokenIn, amountIn),
        minimumOutput: output * 0.99, // 1% slippage tolerance
      };
    }
    
    // Multi-hop route (simplified - just try through AETH_TOKEN)
    const route1 = `${tokenIn}-${TokenType.AETH_TOKEN}`;
    const route2 = `${TokenType.AETH_TOKEN}-${tokenOut}`;
    
    const pool1 = this.pools.get(route1);
    const pool2 = this.pools.get(route2);
    
    if (pool1 && pool2) {
      const intermediate = this.calculateSwapOutput(pool1, tokenIn, amountIn);
      const output = this.calculateSwapOutput(pool2, TokenType.AETH_TOKEN, intermediate);
      
      return {
        path: [tokenIn, TokenType.AETH_TOKEN, tokenOut],
        expectedOutput: output,
        priceImpact: 0.01, // Simplified
        minimumOutput: output * 0.99,
      };
    }
    
    throw new Error('No route found');
  }
  
  /**
   * Calculate swap output
   */
  private calculateSwapOutput(pool: LiquidityPool, tokenIn: string, amountIn: number): number {
    let reserveIn: number;
    let reserveOut: number;
    
    if (tokenIn === pool.tokenA) {
      reserveIn = pool.reserveA;
      reserveOut = pool.reserveB;
    } else {
      reserveIn = pool.reserveB;
      reserveOut = pool.reserveA;
    }
    
    const amountInWithFee = amountIn * (1 - pool.feeRate);
    return (reserveOut * amountInWithFee) / (reserveIn + amountInWithFee);
  }
  
  /**
   * Calculate price impact
   */
  private calculatePriceImpact(pool: LiquidityPool, tokenIn: string, amountIn: number): number {
    const reserveIn = tokenIn === pool.tokenA ? pool.reserveA : pool.reserveB;
    return amountIn / reserveIn;
  }
  
  /**
   * Sweep dust (convert small balances to AETH)
   */
  sweepDust(userId: string, age: number): number {
    if (!this.checkPermission(userId, age, 'canTrade')) {
      throw new Error('Trading not allowed for this age group');
    }
    
    const balances = this.getAllBalances(userId);
    let totalSwept = 0;
    
    for (const balance of balances) {
      // Skip AETH and AGAS
      if (balance.token === TokenType.AETH_COIN || 
          balance.token === TokenType.AETH_TOKEN ||
          balance.token === TokenType.AGAS) {
        continue;
      }
      
      // Check if dust
      if (balance.value < this.DUST_THRESHOLD && balance.amount > 0) {
        try {
          // Swap to AETH Token
          const output = this.swap(
            userId,
            balance.token,
            TokenType.AETH_TOKEN,
            balance.amount,
            0, // Accept any output for dust
            age
          );
          totalSwept += output;
        } catch (error) {
          // Skip if swap fails
          console.error(`Failed to sweep ${balance.token}:`, error);
        }
      }
    }
    
    this.emit('dust-swept', { userId, totalSwept });
    return totalSwept;
  }
  
  /**
   * Buy AGAS tokens (always pegged price)
   */
  buyAGAS(userId: string, usdAmount: number): number {
    const agasAmount = usdAmount / this.AGAS_PEG_PRICE;
    
    // Mint new AGAS
    this.addBalance(userId, TokenType.AGAS, agasAmount, TokenType.AGAS);
    
    const currentSupply = this.totalSupply.get(TokenType.AGAS) || 0;
    this.totalSupply.set(TokenType.AGAS, currentSupply + agasAmount);
    
    this.emit('agas-purchased', { userId, usdAmount, agasAmount });
    return agasAmount;
  }
  
  /**
   * Get token prices
   */
  getPrice(token: string): number {
    // Simplified pricing
    const prices: Record<string, number> = {
      [TokenType.AETH_COIN]: 50000, // Like BTC
      [TokenType.AETH_TOKEN]: 2500,  // Like ETH
      [TokenType.AGAS]: this.AGAS_PEG_PRICE,
      'BTC': 50000,
      'ETH': 2500,
      'USDT': 1,
      'USDC': 1,
    };
    
    return prices[token] || 1;
  }
  
  /**
   * Get ecosystem stats
   */
  getStats() {
    return {
      totalUsers: this.balances.size,
      totalPools: this.pools.size,
      aethCoinSupply: this.totalSupply.get(TokenType.AETH_COIN) || 0,
      aethTokenSupply: this.totalSupply.get(TokenType.AETH_TOKEN) || 0,
      agasSupply: this.totalSupply.get(TokenType.AGAS) || 0,
      aethCoinMaxSupply: this.AETH_COIN_MAX_SUPPLY,
      agasPegPrice: this.AGAS_PEG_PRICE,
      newUserBonus: this.NEW_USER_AGAS_BONUS,
    };
  }
}

export const tokenEcosystem = new TokenEcosystem();

