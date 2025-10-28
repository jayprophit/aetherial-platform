/**
 * AETHERIAL Universal Rewards & Engagement System
 * 
 * Complete rewards system with:
 * - Login bonuses (daily, weekly, monthly, quarterly, yearly, decade)
 * - Cultural celebrations (all religions, cultures, beliefs)
 * - Airdrops for asset holders
 * - Quests and missions
 * - Bug bounties
 * - Achievement system
 * - Age-gated accounts with compound growth
 * - Referral rewards
 * - Educational rewards
 */

import { EventEmitter } from 'events';
import * as crypto from 'crypto';

/**
 * User account with age verification
 */
interface UserAccount {
  userId: string;
  age: number;
  isMinor: boolean;
  kycVerified: boolean;
  lockedFunds: number;
  availableFunds: number;
  compoundOptIn: boolean; // Adults can opt in/out
  createdAt: number;
  lastLogin: number;
  consecutiveLogins: number;
}

/**
 * Login streak bonuses
 */
interface LoginStreak {
  daily: number;
  weekly: number;
  monthly: number;
  quarterly: number;
  yearly: number;
  decade: number;
  consecutiveDays: number;
  multiplier: number;
}

/**
 * Cultural celebration
 */
interface CulturalEvent {
  id: string;
  name: string;
  culture: string;
  religion?: string;
  date: Date;
  duration: number; // days
  bonusMultiplier: number;
  description: string;
}

/**
 * Airdrop campaign
 */
interface AirdropCampaign {
  id: string;
  name: string;
  requiredAsset: string;
  minHoldAmount: number;
  minHoldDays: number;
  rewardAmount: number;
  rewardAsset: string;
  startDate: number;
  endDate: number;
  snapshotDate?: number;
  participants: Set<string>;
}

/**
 * Quest/Mission
 */
interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'special';
  category: 'trading' | 'social' | 'educational' | 'gaming' | 'contribution';
  requirements: {
    action: string;
    target: number;
    current?: number;
  }[];
  rewards: {
    asset: string;
    amount: number;
  }[];
  expiry: number;
  completed: boolean;
}

/**
 * Bug bounty
 */
interface BugBounty {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  reward: number;
  description: string;
  reporter: string;
  status: 'submitted' | 'verified' | 'paid' | 'rejected';
  submittedAt: number;
}

/**
 * Achievement
 */
interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  reward: number;
  unlocked: boolean;
  unlockedAt?: number;
}

/**
 * Rewards & Engagement System
 */
export class RewardsEngagementSystem extends EventEmitter {
  private users: Map<string, UserAccount> = new Map();
  private loginStreaks: Map<string, LoginStreak> = new Map();
  private culturalEvents: CulturalEvent[] = [];
  private airdrops: Map<string, AirdropCampaign> = new Map();
  private quests: Map<string, Quest[]> = new Map(); // userId -> quests
  private bugBounties: Map<string, BugBounty> = new Map();
  private achievements: Map<string, Achievement[]> = new Map(); // userId -> achievements
  
  // Compound interest configuration
  private readonly MINOR_COMPOUND_APY = 0.15; // 15% APY for minors
  private readonly ADULT_COMPOUND_APY = 0.12; // 12% APY for adults who opt-in
  private readonly COMPOUND_FREQUENCY = 24; // Hourly compounding
  
  constructor() {
    super();
    this.initializeCulturalEvents();
    this.startCompoundingEngine();
  }
  
  /**
   * Create user account with age verification
   */
  createAccount(userId: string, age: number, kycVerified: boolean = false): UserAccount {
    const isMinor = age < 18;
    
    const account: UserAccount = {
      userId,
      age,
      isMinor,
      kycVerified,
      lockedFunds: 0,
      availableFunds: 0,
      compoundOptIn: isMinor, // Minors always opted in
      createdAt: Date.now(),
      lastLogin: Date.now(),
      consecutiveLogins: 1,
    };
    
    this.users.set(userId, account);
    
    this.loginStreaks.set(userId, {
      daily: 1,
      weekly: 0,
      monthly: 0,
      quarterly: 0,
      yearly: 0,
      decade: 0,
      consecutiveDays: 1,
      multiplier: 1.0,
    });
    
    // Initialize achievements
    this.achievements.set(userId, this.createDefaultAchievements());
    
    // Give welcome bonus
    this.giveWelcomeBonus(userId);
    
    this.emit('account-created', account);
    return account;
  }
  
  /**
   * Process user login and give bonuses
   */
  processLogin(userId: string): {
    bonuses: { type: string; amount: number }[];
    streak: LoginStreak;
    events: CulturalEvent[];
  } {
    const user = this.users.get(userId);
    if (!user) throw new Error('User not found');
    
    const streak = this.loginStreaks.get(userId)!;
    const now = Date.now();
    const daysSinceLastLogin = Math.floor((now - user.lastLogin) / 86400000);
    
    const bonuses: { type: string; amount: number }[] = [];
    
    // Check if consecutive
    if (daysSinceLastLogin === 1) {
      streak.consecutiveDays++;
      streak.multiplier = Math.min(1 + (streak.consecutiveDays * 0.01), 3.0); // Max 3x
    } else if (daysSinceLastLogin > 1) {
      // Streak broken
      streak.consecutiveDays = 1;
      streak.multiplier = 1.0;
    }
    
    // Daily bonus
    streak.daily++;
    const dailyBonus = 10 * streak.multiplier;
    bonuses.push({ type: 'daily', amount: dailyBonus });
    this.addFunds(userId, dailyBonus);
    
    // Weekly bonus (every 7 days)
    if (streak.daily % 7 === 0) {
      streak.weekly++;
      const weeklyBonus = 100 * streak.multiplier;
      bonuses.push({ type: 'weekly', amount: weeklyBonus });
      this.addFunds(userId, weeklyBonus);
    }
    
    // Monthly bonus (every 30 days)
    if (streak.daily % 30 === 0) {
      streak.monthly++;
      const monthlyBonus = 500 * streak.multiplier;
      bonuses.push({ type: 'monthly', amount: monthlyBonus });
      this.addFunds(userId, monthlyBonus);
    }
    
    // Quarterly bonus (every 90 days)
    if (streak.daily % 90 === 0) {
      streak.quarterly++;
      const quarterlyBonus = 2000 * streak.multiplier;
      bonuses.push({ type: 'quarterly', amount: quarterlyBonus });
      this.addFunds(userId, quarterlyBonus);
    }
    
    // Yearly bonus (every 365 days)
    if (streak.daily % 365 === 0) {
      streak.yearly++;
      const yearlyBonus = 10000 * streak.multiplier;
      bonuses.push({ type: 'yearly', amount: yearlyBonus });
      this.addFunds(userId, yearlyBonus);
    }
    
    // Decade bonus (every 3650 days)
    if (streak.daily % 3650 === 0) {
      streak.decade++;
      const decadeBonus = 100000 * streak.multiplier;
      bonuses.push({ type: 'decade', amount: decadeBonus });
      this.addFunds(userId, decadeBonus);
    }
    
    // Check for cultural event bonuses
    const activeEvents = this.getActiveCulturalEvents();
    for (const event of activeEvents) {
      const eventBonus = 50 * event.bonusMultiplier;
      bonuses.push({ type: `event:${event.name}`, amount: eventBonus });
      this.addFunds(userId, eventBonus);
    }
    
    user.lastLogin = now;
    user.consecutiveLogins = streak.consecutiveDays;
    
    this.emit('login-processed', { userId, bonuses, streak });
    
    return { bonuses, streak, events: activeEvents };
  }
  
  /**
   * Add funds to user account (respects age restrictions)
   */
  addFunds(userId: string, amount: number): void {
    const user = this.users.get(userId);
    if (!user) throw new Error('User not found');
    
    if (user.isMinor) {
      // Minors: all funds locked and compounded
      user.lockedFunds += amount;
    } else if (user.compoundOptIn) {
      // Adults opted in: funds locked and compounded
      user.lockedFunds += amount;
    } else {
      // Adults opted out: funds available immediately
      user.availableFunds += amount;
    }
    
    this.emit('funds-added', { userId, amount, locked: user.isMinor || user.compoundOptIn });
  }
  
  /**
   * Withdraw funds (only for adults with KYC)
   */
  withdrawFunds(userId: string, amount: number): boolean {
    const user = this.users.get(userId);
    if (!user) throw new Error('User not found');
    
    if (user.isMinor) {
      throw new Error('Minors cannot withdraw funds until age 18');
    }
    
    if (!user.kycVerified) {
      throw new Error('KYC verification required for withdrawal');
    }
    
    if (user.availableFunds < amount) {
      throw new Error('Insufficient available funds');
    }
    
    user.availableFunds -= amount;
    this.emit('funds-withdrawn', { userId, amount });
    return true;
  }
  
  /**
   * Unlock minor account (when turning 18 with KYC)
   */
  unlockMinorAccount(userId: string, kycVerified: boolean): number {
    const user = this.users.get(userId);
    if (!user) throw new Error('User not found');
    
    if (!user.isMinor) {
      throw new Error('Account is not a minor account');
    }
    
    if (!kycVerified) {
      throw new Error('KYC verification required to unlock account');
    }
    
    // Transfer locked funds to available
    const unlockedAmount = user.lockedFunds;
    user.availableFunds += user.lockedFunds;
    user.lockedFunds = 0;
    user.isMinor = false;
    user.kycVerified = true;
    user.compoundOptIn = false; // Default to opt-out for adults
    
    this.emit('account-unlocked', { userId, amount: unlockedAmount });
    return unlockedAmount;
  }
  
  /**
   * Toggle compound opt-in for adults
   */
  toggleCompoundOptIn(userId: string, optIn: boolean): void {
    const user = this.users.get(userId);
    if (!user) throw new Error('User not found');
    
    if (user.isMinor) {
      throw new Error('Minors cannot change compound settings');
    }
    
    user.compoundOptIn = optIn;
    
    if (optIn) {
      // Move available funds to locked for compounding
      user.lockedFunds += user.availableFunds;
      user.availableFunds = 0;
    } else {
      // Move locked funds to available
      user.availableFunds += user.lockedFunds;
      user.lockedFunds = 0;
    }
    
    this.emit('compound-toggled', { userId, optIn });
  }
  
  /**
   * Start compounding engine
   */
  private startCompoundingEngine(): void {
    // Compound every hour
    setInterval(() => {
      this.compoundAllAccounts();
    }, 3600000); // 1 hour
  }
  
  /**
   * Compound all accounts
   */
  private compoundAllAccounts(): void {
    for (const [userId, user] of this.users.entries()) {
      if (user.lockedFunds > 0) {
        const apy = user.isMinor ? this.MINOR_COMPOUND_APY : this.ADULT_COMPOUND_APY;
        const hourlyRate = apy / 365 / 24;
        const interest = user.lockedFunds * hourlyRate;
        
        user.lockedFunds += interest;
        
        this.emit('interest-compounded', { userId, interest, newBalance: user.lockedFunds });
      }
    }
  }
  
  /**
   * Create airdrop campaign
   */
  createAirdrop(
    name: string,
    requiredAsset: string,
    minHoldAmount: number,
    minHoldDays: number,
    rewardAmount: number,
    rewardAsset: string,
    durationDays: number
  ): AirdropCampaign {
    const airdrop: AirdropCampaign = {
      id: crypto.randomBytes(16).toString('hex'),
      name,
      requiredAsset,
      minHoldAmount,
      minHoldDays,
      rewardAmount,
      rewardAsset,
      startDate: Date.now(),
      endDate: Date.now() + (durationDays * 86400000),
      participants: new Set(),
    };
    
    this.airdrops.set(airdrop.id, airdrop);
    this.emit('airdrop-created', airdrop);
    return airdrop;
  }
  
  /**
   * Check airdrop eligibility and distribute
   */
  checkAirdropEligibility(
    userId: string,
    airdropId: string,
    holdAmount: number,
    holdDays: number
  ): boolean {
    const airdrop = this.airdrops.get(airdropId);
    if (!airdrop) return false;
    
    if (Date.now() > airdrop.endDate) return false;
    if (airdrop.participants.has(userId)) return false;
    
    if (holdAmount >= airdrop.minHoldAmount && holdDays >= airdrop.minHoldDays) {
      // Eligible! Distribute reward
      this.addFunds(userId, airdrop.rewardAmount);
      airdrop.participants.add(userId);
      
      this.emit('airdrop-claimed', { userId, airdropId, amount: airdrop.rewardAmount });
      return true;
    }
    
    return false;
  }
  
  /**
   * Create quest
   */
  createQuest(
    userId: string,
    title: string,
    description: string,
    type: Quest['type'],
    category: Quest['category'],
    requirements: Quest['requirements'],
    rewards: Quest['rewards'],
    durationDays: number
  ): Quest {
    const quest: Quest = {
      id: crypto.randomBytes(16).toString('hex'),
      title,
      description,
      type,
      category,
      requirements,
      rewards,
      expiry: Date.now() + (durationDays * 86400000),
      completed: false,
    };
    
    const userQuests = this.quests.get(userId) || [];
    userQuests.push(quest);
    this.quests.set(userId, userQuests);
    
    this.emit('quest-created', { userId, quest });
    return quest;
  }
  
  /**
   * Complete quest
   */
  completeQuest(userId: string, questId: string): boolean {
    const userQuests = this.quests.get(userId);
    if (!userQuests) return false;
    
    const quest = userQuests.find(q => q.id === questId);
    if (!quest || quest.completed) return false;
    
    // Check if all requirements met
    const allMet = quest.requirements.every(req => 
      req.current !== undefined && req.current >= req.target
    );
    
    if (allMet) {
      quest.completed = true;
      
      // Distribute rewards
      for (const reward of quest.rewards) {
        this.addFunds(userId, reward.amount);
      }
      
      this.emit('quest-completed', { userId, questId, rewards: quest.rewards });
      return true;
    }
    
    return false;
  }
  
  /**
   * Submit bug bounty
   */
  submitBugBounty(
    userId: string,
    severity: BugBounty['severity'],
    description: string
  ): BugBounty {
    const rewards = {
      critical: 10000,
      high: 5000,
      medium: 1000,
      low: 100,
    };
    
    const bounty: BugBounty = {
      id: crypto.randomBytes(16).toString('hex'),
      severity,
      reward: rewards[severity],
      description,
      reporter: userId,
      status: 'submitted',
      submittedAt: Date.now(),
    };
    
    this.bugBounties.set(bounty.id, bounty);
    this.emit('bug-bounty-submitted', bounty);
    return bounty;
  }
  
  /**
   * Verify and pay bug bounty
   */
  verifyBugBounty(bountyId: string, approved: boolean): void {
    const bounty = this.bugBounties.get(bountyId);
    if (!bounty) throw new Error('Bounty not found');
    
    if (approved) {
      bounty.status = 'verified';
      this.addFunds(bounty.reporter, bounty.reward);
      bounty.status = 'paid';
      
      this.emit('bug-bounty-paid', { bountyId, userId: bounty.reporter, amount: bounty.reward });
    } else {
      bounty.status = 'rejected';
    }
  }
  
  /**
   * Give welcome bonus
   */
  private giveWelcomeBonus(userId: string): void {
    const welcomeBonus = 100;
    this.addFunds(userId, welcomeBonus);
    this.emit('welcome-bonus', { userId, amount: welcomeBonus });
  }
  
  /**
   * Initialize cultural events
   */
  private initializeCulturalEvents(): void {
    this.culturalEvents = [
      // Western
      { id: '1', name: 'New Year', culture: 'Western', date: new Date('2025-01-01'), duration: 1, bonusMultiplier: 2.0, description: 'New Year celebration' },
      { id: '2', name: 'Valentine\'s Day', culture: 'Western', date: new Date('2025-02-14'), duration: 1, bonusMultiplier: 1.5, description: 'Day of love' },
      { id: '3', name: 'Easter', culture: 'Christian', religion: 'Christianity', date: new Date('2025-04-20'), duration: 2, bonusMultiplier: 1.8, description: 'Easter celebration' },
      { id: '4', name: 'Christmas', culture: 'Christian', religion: 'Christianity', date: new Date('2025-12-25'), duration: 3, bonusMultiplier: 3.0, description: 'Christmas celebration' },
      
      // Islamic
      { id: '5', name: 'Ramadan', culture: 'Islamic', religion: 'Islam', date: new Date('2025-03-01'), duration: 30, bonusMultiplier: 2.5, description: 'Holy month of fasting' },
      { id: '6', name: 'Eid al-Fitr', culture: 'Islamic', religion: 'Islam', date: new Date('2025-03-31'), duration: 3, bonusMultiplier: 2.0, description: 'Festival of breaking fast' },
      { id: '7', name: 'Eid al-Adha', culture: 'Islamic', religion: 'Islam', date: new Date('2025-06-07'), duration: 4, bonusMultiplier: 2.0, description: 'Festival of sacrifice' },
      
      // Hindu
      { id: '8', name: 'Diwali', culture: 'Hindu', religion: 'Hinduism', date: new Date('2025-10-20'), duration: 5, bonusMultiplier: 2.5, description: 'Festival of lights' },
      { id: '9', name: 'Holi', culture: 'Hindu', religion: 'Hinduism', date: new Date('2025-03-14'), duration: 2, bonusMultiplier: 2.0, description: 'Festival of colors' },
      
      // Chinese
      { id: '10', name: 'Chinese New Year', culture: 'Chinese', date: new Date('2025-01-29'), duration: 15, bonusMultiplier: 2.5, description: 'Lunar New Year' },
      { id: '11', name: 'Mid-Autumn Festival', culture: 'Chinese', date: new Date('2025-09-15'), duration: 3, bonusMultiplier: 1.8, description: 'Moon festival' },
      
      // Jewish
      { id: '12', name: 'Hanukkah', culture: 'Jewish', religion: 'Judaism', date: new Date('2025-12-14'), duration: 8, bonusMultiplier: 2.0, description: 'Festival of lights' },
      { id: '13', name: 'Passover', culture: 'Jewish', religion: 'Judaism', date: new Date('2025-04-13'), duration: 8, bonusMultiplier: 1.8, description: 'Pesach celebration' },
      
      // Other
      { id: '14', name: 'Thanksgiving', culture: 'American', date: new Date('2025-11-27'), duration: 1, bonusMultiplier: 2.0, description: 'Day of thanks' },
      { id: '15', name: 'Halloween', culture: 'Western', date: new Date('2025-10-31'), duration: 1, bonusMultiplier: 1.5, description: 'Spooky celebration' },
    ];
  }
  
  /**
   * Get active cultural events
   */
  private getActiveCulturalEvents(): CulturalEvent[] {
    const now = new Date();
    return this.culturalEvents.filter(event => {
      const eventStart = event.date.getTime();
      const eventEnd = eventStart + (event.duration * 86400000);
      const nowTime = now.getTime();
      return nowTime >= eventStart && nowTime <= eventEnd;
    });
  }
  
  /**
   * Create default achievements
   */
  private createDefaultAchievements(): Achievement[] {
    return [
      { id: '1', title: 'First Login', description: 'Log in for the first time', icon: '🎉', tier: 'bronze', reward: 50, unlocked: false },
      { id: '2', title: 'Week Warrior', description: 'Log in for 7 consecutive days', icon: '🔥', tier: 'silver', reward: 200, unlocked: false },
      { id: '3', title: 'Month Master', description: 'Log in for 30 consecutive days', icon: '💎', tier: 'gold', reward: 1000, unlocked: false },
      { id: '4', title: 'Trader', description: 'Complete your first trade', icon: '📈', tier: 'bronze', reward: 100, unlocked: false },
      { id: '5', title: 'Staker', description: 'Stake your first tokens', icon: '🏦', tier: 'silver', reward: 250, unlocked: false },
      { id: '6', title: 'NFT Collector', description: 'Mint or buy your first NFT', icon: '🖼️', tier: 'gold', reward: 500, unlocked: false },
      { id: '7', title: 'Bug Hunter', description: 'Report your first bug', icon: '🐛', tier: 'platinum', reward: 1000, unlocked: false },
      { id: '8', title: 'Millionaire', description: 'Reach 1,000,000 AETH', icon: '💰', tier: 'diamond', reward: 10000, unlocked: false },
    ];
  }
  
  /**
   * Get user status
   */
  getUserStatus(userId: string) {
    const user = this.users.get(userId);
    const streak = this.loginStreaks.get(userId);
    const quests = this.quests.get(userId) || [];
    const achievements = this.achievements.get(userId) || [];
    
    return {
      user,
      streak,
      quests,
      achievements,
      totalBalance: user ? user.lockedFunds + user.availableFunds : 0,
      compoundingActive: user ? (user.isMinor || user.compoundOptIn) : false,
    };
  }
}

export const rewardsSystem = new RewardsEngagementSystem();

