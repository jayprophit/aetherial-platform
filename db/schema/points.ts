import { pgTable, text, serial, integer, boolean, timestamp, jsonb, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

/**
 * Points System Schema
 * Tracks user points earned through various activities
 */
export const points = pgTable("points", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  
  // Points tracking
  totalPoints: integer("total_points").notNull().default(0),
  availablePoints: integer("available_points").notNull().default(0),
  usedPoints: integer("used_points").notNull().default(0),
  
  // Lifetime stats
  lifetimeEarned: integer("lifetime_earned").notNull().default(0),
  lifetimeSpent: integer("lifetime_spent").notNull().default(0),
  
  // Current tier
  membershipTier: text("membership_tier").notNull().default("bronze"), // bronze, silver, gold, platinum
  tierSince: timestamp("tier_since").defaultNow(),
  
  // Metadata
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

/**
 * Points Transactions Schema
 * Records all points earning and spending activities
 */
export const pointsTransactions = pgTable("points_transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  
  // Transaction details
  type: text("type").notNull(), // earn, spend, refund, bonus, penalty
  category: text("category").notNull(), // social, commerce, learning, trading, etc.
  activity: text("activity").notNull(), // like, comment, purchase, course_complete, etc.
  
  // Points
  points: integer("points").notNull(),
  balanceBefore: integer("balance_before").notNull(),
  balanceAfter: integer("balance_after").notNull(),
  
  // Reference
  referenceType: text("reference_type"), // post, product, course, trade, etc.
  referenceId: integer("reference_id"),
  
  // Metadata
  description: text("description"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

/**
 * Points Earning Rules Schema
 * Defines how many points users earn for different activities
 */
export const pointsEarningRules = pgTable("points_earning_rules", {
  id: serial("id").primaryKey(),
  
  // Rule identification
  category: text("category").notNull(), // social, commerce, learning, trading
  activity: text("activity").notNull(), // like, comment, purchase, etc.
  
  // Points configuration
  points: integer("points").notNull(),
  maxPerDay: integer("max_per_day"), // null = unlimited
  maxPerWeek: integer("max_per_week"),
  maxPerMonth: integer("max_per_month"),
  
  // Conditions
  minAmount: decimal("min_amount", { precision: 10, scale: 2 }), // for purchases
  multiplier: decimal("multiplier", { precision: 3, scale: 2 }).default("1.00"),
  
  // Status
  isActive: boolean("is_active").notNull().default(true),
  
  // Metadata
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

/**
 * Membership Tiers Schema
 * Defines benefits and requirements for each tier
 */
export const membershipTiers = pgTable("membership_tiers", {
  id: serial("id").primaryKey(),
  
  // Tier details
  name: text("name").notNull().unique(), // bronze, silver, gold, platinum
  displayName: text("display_name").notNull(),
  level: integer("level").notNull(), // 1, 2, 3, 4
  
  // Requirements
  minPoints: integer("min_points").notNull().default(0),
  minSpending: decimal("min_spending", { precision: 10, scale: 2 }),
  minActivity: integer("min_activity"), // days active
  
  // Benefits
  benefits: jsonb("benefits").notNull(), // array of benefit descriptions
  pointsMultiplier: decimal("points_multiplier", { precision: 3, scale: 2 }).notNull().default("1.00"),
  discountPercentage: integer("discount_percentage").notNull().default(0),
  
  // Limits
  maxCourseUploads: integer("max_course_uploads"),
  maxProductUploads: integer("max_product_uploads"),
  maxStorage: integer("max_storage"), // in GB
  
  // Features
  features: jsonb("features").notNull(), // array of feature flags
  
  // Pricing
  monthlyPrice: decimal("monthly_price", { precision: 10, scale: 2 }),
  yearlyPrice: decimal("yearly_price", { precision: 10, scale: 2 }),
  
  // Status
  isActive: boolean("is_active").notNull().default(true),
  
  // Metadata
  description: text("description"),
  icon: text("icon"),
  color: text("color"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

/**
 * Rewards Catalog Schema
 * Items users can redeem with points
 */
export const rewardsCatalog = pgTable("rewards_catalog", {
  id: serial("id").primaryKey(),
  
  // Reward details
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(), // discount, product, feature, voucher
  
  // Cost
  pointsCost: integer("points_cost").notNull(),
  
  // Reward value
  rewardType: text("reward_type").notNull(), // discount_percentage, discount_fixed, product, feature_unlock
  rewardValue: text("reward_value").notNull(), // "10%" or "5.00" or product_id or feature_name
  
  // Availability
  stock: integer("stock"), // null = unlimited
  maxPerUser: integer("max_per_user"),
  validDays: integer("valid_days"), // how many days reward is valid after redemption
  
  // Status
  isActive: boolean("is_active").notNull().default(true),
  
  // Metadata
  image: text("image"),
  termsAndConditions: text("terms_and_conditions"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

/**
 * User Rewards Schema
 * Tracks rewards redeemed by users
 */
export const userRewards = pgTable("user_rewards", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  rewardId: integer("reward_id").notNull(),
  
  // Redemption
  pointsSpent: integer("points_spent").notNull(),
  redeemedAt: timestamp("redeemed_at").defaultNow(),
  
  // Usage
  status: text("status").notNull().default("active"), // active, used, expired
  usedAt: timestamp("used_at"),
  expiresAt: timestamp("expires_at"),
  
  // Reward details (snapshot at redemption)
  rewardSnapshot: jsonb("reward_snapshot").notNull(),
  
  // Metadata
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

/**
 * Staking Schema
 * Users can stake points for additional rewards
 */
export const pointsStaking = pgTable("points_staking", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  
  // Staking details
  stakedPoints: integer("staked_points").notNull(),
  stakingPeriod: integer("staking_period").notNull(), // days
  apy: decimal("apy", { precision: 5, scale: 2 }).notNull(), // annual percentage yield
  
  // Dates
  stakedAt: timestamp("staked_at").defaultNow(),
  unlocksAt: timestamp("unlocks_at").notNull(),
  unstakedAt: timestamp("unstaked_at"),
  
  // Rewards
  estimatedReward: integer("estimated_reward").notNull(),
  actualReward: integer("actual_reward"),
  
  // Status
  status: text("status").notNull().default("active"), // active, completed, cancelled
  
  // Metadata
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Zod schemas for validation
export const insertPointsSchema = createInsertSchema(points);
export const selectPointsSchema = createSelectSchema(points);
export const insertPointsTransactionSchema = createInsertSchema(pointsTransactions);
export const selectPointsTransactionSchema = createSelectSchema(pointsTransactions);
export const insertPointsEarningRuleSchema = createInsertSchema(pointsEarningRules);
export const selectPointsEarningRuleSchema = createSelectSchema(pointsEarningRules);
export const insertMembershipTierSchema = createInsertSchema(membershipTiers);
export const selectMembershipTierSchema = createSelectSchema(membershipTiers);
export const insertRewardsCatalogSchema = createInsertSchema(rewardsCatalog);
export const selectRewardsCatalogSchema = createSelectSchema(rewardsCatalog);
export const insertUserRewardSchema = createInsertSchema(userRewards);
export const selectUserRewardSchema = createSelectSchema(userRewards);
export const insertPointsStakingSchema = createInsertSchema(pointsStaking);
export const selectPointsStakingSchema = createSelectSchema(pointsStaking);

// TypeScript types
export type Points = typeof points.$inferSelect;
export type InsertPoints = typeof points.$inferInsert;
export type PointsTransaction = typeof pointsTransactions.$inferSelect;
export type InsertPointsTransaction = typeof pointsTransactions.$inferInsert;
export type PointsEarningRule = typeof pointsEarningRules.$inferSelect;
export type InsertPointsEarningRule = typeof pointsEarningRules.$inferInsert;
export type MembershipTier = typeof membershipTiers.$inferSelect;
export type InsertMembershipTier = typeof membershipTiers.$inferInsert;
export type RewardsCatalog = typeof rewardsCatalog.$inferSelect;
export type InsertRewardsCatalog = typeof rewardsCatalog.$inferInsert;
export type UserReward = typeof userRewards.$inferSelect;
export type InsertUserReward = typeof userRewards.$inferInsert;
export type PointsStaking = typeof pointsStaking.$inferSelect;
export type InsertPointsStaking = typeof pointsStaking.$inferInsert;

