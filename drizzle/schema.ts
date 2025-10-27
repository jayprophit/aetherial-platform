// Aetherial Platform - Complete Database Schema (MySQL)
// Production-ready schema for all platform features

import { mysqlTable, varchar, text, int, boolean, timestamp, json, decimal, index, uniqueIndex, mysqlEnum } from 'drizzle-orm/mysql-core';

// ============================================================================
// USERS & AUTHENTICATION
// ============================================================================

export const users = mysqlTable('users', {
  id: int('id').autoincrement().primaryKey(),
  openId: varchar('open_id', { length: 64 }).notNull().unique(), // OAuth ID
  email: varchar('email', { length: 320 }),
  username: varchar('username', { length: 50 }).unique(),
  name: text('name'),
  loginMethod: varchar('login_method', { length: 64 }),
  role: mysqlEnum('role', ['user', 'admin']).default('user').notNull(),
  
  // Profile
  firstName: text('first_name'),
  lastName: text('last_name'),
  displayName: text('display_name'),
  bio: text('bio'),
  avatar: text('avatar'),
  coverPhoto: text('cover_photo'),
  
  // Age & Permissions
  birthDate: timestamp('birth_date'),
  age: int('age'),
  ageTier: mysqlEnum('age_tier', ['infant', 'teen', 'adult']),
  
  // AETH Wallet
  walletAddress: varchar('wallet_address', { length: 100 }).unique(),
  aethBalance: decimal('aeth_balance', { precision: 20, scale: 8 }).default('0'),
  lockedBalance: decimal('locked_balance', { precision: 20, scale: 8 }).default('0'), // For under-18
  
  // Status
  isVerified: boolean('is_verified').default(false),
  isActive: boolean('is_active').default(true),
  lastSignedIn: timestamp('last_signed_in').defaultNow().notNull(),
  
  // Metadata
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  emailIdx: index('users_email_idx').on(table.email),
  usernameIdx: index('users_username_idx').on(table.username),
  ageTierIdx: index('users_age_tier_idx').on(table.ageTier),
}));

export const sessions = mysqlTable('sessions', {
  id: int('id').autoincrement().primaryKey(),
  userId: int('user_id').notNull(),
  token: varchar('token', { length: 255 }).notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// ============================================================================
// SOCIAL NETWORK
// ============================================================================

export const posts = mysqlTable('posts', {
  id: int('id').autoincrement().primaryKey(),
  userId: int('user_id').notNull(),
  content: text('content').notNull(),
  media: json('media'), // Array of image/video URLs
  visibility: mysqlEnum('visibility', ['public', 'friends', 'private']).default('public'),
  likesCount: int('likes_count').default(0),
  commentsCount: int('comments_count').default(0),
  sharesCount: int('shares_count').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
}, (table) => ({
  userIdx: index('posts_user_idx').on(table.userId),
  createdIdx: index('posts_created_idx').on(table.createdAt),
}));

export const comments = mysqlTable('comments', {
  id: int('id').autoincrement().primaryKey(),
  postId: int('post_id').notNull(),
  userId: int('user_id').notNull(),
  content: text('content').notNull(),
  likesCount: int('likes_count').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

export const likes = mysqlTable('likes', {
  id: int('id').autoincrement().primaryKey(),
  userId: int('user_id').notNull(),
  targetType: varchar('target_type', { length: 20 }).notNull(), // 'post', 'comment', 'product', 'course'
  targetId: int('target_id').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  uniqueLike: uniqueIndex('unique_like_idx').on(table.userId, table.targetType, table.targetId),
}));

export const friendships = mysqlTable('friendships', {
  id: int('id').autoincrement().primaryKey(),
  userId: int('user_id').notNull(),
  friendId: int('friend_id').notNull(),
  status: mysqlEnum('status', ['pending', 'accepted', 'blocked']).default('pending'),
  createdAt: timestamp('created_at').defaultNow(),
  acceptedAt: timestamp('accepted_at'),
}, (table) => ({
  uniqueFriendship: uniqueIndex('unique_friendship_idx').on(table.userId, table.friendId),
}));

export const groups = mysqlTable('groups', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  coverPhoto: text('cover_photo'),
  creatorId: int('creator_id').notNull(),
  membersCount: int('members_count').default(0),
  isPrivate: boolean('is_private').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const groupMembers = mysqlTable('group_members', {
  id: int('id').autoincrement().primaryKey(),
  groupId: int('group_id').notNull(),
  userId: int('user_id').notNull(),
  role: mysqlEnum('role', ['admin', 'moderator', 'member']).default('member'),
  joinedAt: timestamp('joined_at').defaultNow(),
}, (table) => ({
  uniqueMember: uniqueIndex('unique_group_member_idx').on(table.groupId, table.userId),
}));

export const messages = mysqlTable('messages', {
  id: int('id').autoincrement().primaryKey(),
  senderId: int('sender_id').notNull(),
  receiverId: int('receiver_id'),
  groupId: int('group_id'),
  content: text('content').notNull(),
  media: json('media'),
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// ============================================================================
// E-COMMERCE
// ============================================================================

export const products = mysqlTable('products', {
  id: int('id').autoincrement().primaryKey(),
  sellerId: int('seller_id').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  price: decimal('price', { precision: 20, scale: 8 }).notNull(),
  currency: varchar('currency', { length: 10 }).default('AETH'),
  images: json('images'), // Array of image URLs
  category: varchar('category', { length: 100 }),
  stock: int('stock').default(0),
  salesCount: int('sales_count').default(0),
  rating: decimal('rating', { precision: 3, scale: 2 }).default('0'),
  reviewsCount: int('reviews_count').default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
}, (table) => ({
  sellerIdx: index('products_seller_idx').on(table.sellerId),
  categoryIdx: index('products_category_idx').on(table.category),
}));

export const orders = mysqlTable('orders', {
  id: int('id').autoincrement().primaryKey(),
  buyerId: int('buyer_id').notNull(),
  sellerId: int('seller_id').notNull(),
  productId: int('product_id').notNull(),
  quantity: int('quantity').notNull(),
  totalPrice: decimal('total_price', { precision: 20, scale: 8 }).notNull(),
  status: mysqlEnum('status', ['pending', 'completed', 'cancelled']).default('pending'),
  createdAt: timestamp('created_at').defaultNow(),
  completedAt: timestamp('completed_at'),
});

export const reviews = mysqlTable('reviews', {
  id: int('id').autoincrement().primaryKey(),
  userId: int('user_id').notNull(),
  targetType: varchar('target_type', { length: 20 }).notNull(), // 'product', 'course', 'seller'
  targetId: int('target_id').notNull(),
  rating: int('rating').notNull(), // 1-5
  comment: text('comment'),
  createdAt: timestamp('created_at').defaultNow(),
});

// ============================================================================
// E-LEARNING
// ============================================================================

export const courses = mysqlTable('courses', {
  id: int('id').autoincrement().primaryKey(),
  instructorId: int('instructor_id').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  thumbnail: text('thumbnail'),
  price: decimal('price', { precision: 20, scale: 8 }).default('0'),
  category: varchar('category', { length: 100 }),
  level: mysqlEnum('level', ['beginner', 'intermediate', 'advanced']),
  enrollmentsCount: int('enrollments_count').default(0),
  rating: decimal('rating', { precision: 3, scale: 2 }).default('0'),
  reviewsCount: int('reviews_count').default(0),
  isPublished: boolean('is_published').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

export const lessons = mysqlTable('lessons', {
  id: int('id').autoincrement().primaryKey(),
  courseId: int('course_id').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content'),
  videoUrl: text('video_url'),
  duration: int('duration'), // in seconds
  order: int('order').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const quizzes = mysqlTable('quizzes', {
  id: int('id').autoincrement().primaryKey(),
  lessonId: int('lesson_id').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  questions: json('questions').notNull(), // Array of questions with answers
  passingScore: int('passing_score').default(80),
  createdAt: timestamp('created_at').defaultNow(),
});

export const enrollments = mysqlTable('enrollments', {
  id: int('id').autoincrement().primaryKey(),
  userId: int('user_id').notNull(),
  courseId: int('course_id').notNull(),
  progress: int('progress').default(0), // 0-100%
  completedAt: timestamp('completed_at'),
  certificateId: int('certificate_id'),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  uniqueEnrollment: uniqueIndex('unique_enrollment_idx').on(table.userId, table.courseId),
}));

export const certificates = mysqlTable('certificates', {
  id: int('id').autoincrement().primaryKey(),
  userId: int('user_id').notNull(),
  courseId: int('course_id').notNull(),
  nftTokenId: varchar('nft_token_id', { length: 255 }).unique(),
  issuedAt: timestamp('issued_at').defaultNow(),
});

// ============================================================================
// JOB MARKETPLACE
// ============================================================================

export const jobs = mysqlTable('jobs', {
  id: int('id').autoincrement().primaryKey(),
  employerId: int('employer_id').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  category: varchar('category', { length: 100 }),
  location: varchar('location', { length: 255 }),
  salary: decimal('salary', { precision: 20, scale: 8 }),
  currency: varchar('currency', { length: 10 }).default('AETH'),
  jobType: mysqlEnum('job_type', ['full-time', 'part-time', 'contract', 'freelance']),
  applicationsCount: int('applications_count').default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  expiresAt: timestamp('expires_at'),
});

export const applications = mysqlTable('applications', {
  id: int('id').autoincrement().primaryKey(),
  jobId: int('job_id').notNull(),
  applicantId: int('applicant_id').notNull(),
  coverLetter: text('cover_letter'),
  resumeUrl: text('resume_url'),
  status: mysqlEnum('status', ['pending', 'reviewed', 'accepted', 'rejected']).default('pending'),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  uniqueApplication: uniqueIndex('unique_application_idx').on(table.jobId, table.applicantId),
}));

// ============================================================================
// AI AGENTS
// ============================================================================

export const aiAgents = mysqlTable('ai_agents', {
  id: int('id').autoincrement().primaryKey(),
  ownerId: int('owner_id').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  avatar: text('avatar'),
  type: mysqlEnum('type', ['seller', 'instructor', 'assistant', 'developer']),
  config: json('config'), // AI configuration
  revenue: decimal('revenue', { precision: 20, scale: 8 }).default('0'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

export const agentTransactions = mysqlTable('agent_transactions', {
  id: int('id').autoincrement().primaryKey(),
  agentId: int('agent_id').notNull(),
  type: varchar('type', { length: 20 }).notNull(), // 'sale', 'purchase', 'service'
  amount: decimal('amount', { precision: 20, scale: 8 }).notNull(),
  partnerId: int('partner_id'), // Other agent or user
  createdAt: timestamp('created_at').defaultNow(),
});

// ============================================================================
// BLOCKCHAIN & TOKENS
// ============================================================================

export const transactions = mysqlTable('transactions', {
  id: int('id').autoincrement().primaryKey(),
  fromUserId: int('from_user_id'),
  toUserId: int('to_user_id'),
  amount: decimal('amount', { precision: 20, scale: 8 }).notNull(),
  type: varchar('type', { length: 20 }).notNull(), // 'transfer', 'earn', 'spend', 'stake'
  reason: varchar('reason', { length: 100 }), // 'post_created', 'course_completed', 'product_sold', etc.
  blockHash: varchar('block_hash', { length: 255 }),
  status: mysqlEnum('status', ['pending', 'completed', 'failed']).default('completed'),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  fromUserIdx: index('transactions_from_user_idx').on(table.fromUserId),
  toUserIdx: index('transactions_to_user_idx').on(table.toUserId),
}));

export const inheritanceNFTs = mysqlTable('inheritance_nfts', {
  id: int('id').autoincrement().primaryKey(),
  ownerId: int('owner_id').notNull(),
  amount: decimal('amount', { precision: 20, scale: 8 }).notNull(),
  beneficiaries: json('beneficiaries').notNull(), // Array of {userId, percentage, unlockAge}
  nftTokenId: varchar('nft_token_id', { length: 255 }).unique(),
  version: int('version').default(1), // v1, v2, v3...
  createdAt: timestamp('created_at').defaultNow(),
});

export const stakes = mysqlTable('stakes', {
  id: int('id').autoincrement().primaryKey(),
  userId: int('user_id').notNull(),
  amount: decimal('amount', { precision: 20, scale: 8 }).notNull(),
  startDate: timestamp('start_date').defaultNow(),
  endDate: timestamp('end_date'),
  interestRate: decimal('interest_rate', { precision: 5, scale: 2 }).default('8.00'), // 8% APY
  status: mysqlEnum('status', ['active', 'completed', 'cancelled']).default('active'),
});

// ============================================================================
// GOVERNANCE
// ============================================================================

export const proposals = mysqlTable('proposals', {
  id: int('id').autoincrement().primaryKey(),
  creatorId: int('creator_id').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  type: mysqlEnum('type', ['feature', 'policy', 'core_value']),
  status: mysqlEnum('status', ['voting', 'approved', 'rejected']).default('voting'),
  votesFor: int('votes_for').default(0),
  votesAgainst: int('votes_against').default(0),
  aiRecommendation: text('ai_recommendation'),
  createdAt: timestamp('created_at').defaultNow(),
  votingEndsAt: timestamp('voting_ends_at'),
});

export const votes = mysqlTable('votes', {
  id: int('id').autoincrement().primaryKey(),
  proposalId: int('proposal_id').notNull(),
  userId: int('user_id').notNull(),
  vote: mysqlEnum('vote', ['for', 'against']).notNull(),
  weight: decimal('weight', { precision: 20, scale: 8 }).default('1'), // Based on AETH holdings
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  uniqueVote: uniqueIndex('unique_vote_idx').on(table.proposalId, table.userId),
}));

// ============================================================================
// NOTIFICATIONS
// ============================================================================

export const notifications = mysqlTable('notifications', {
  id: int('id').autoincrement().primaryKey(),
  userId: int('user_id').notNull(),
  type: varchar('type', { length: 50 }).notNull(), // 'like', 'comment', 'friend_request', 'message', etc.
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message'),
  link: text('link'),
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  userIdx: index('notifications_user_idx').on(table.userId),
  isReadIdx: index('notifications_is_read_idx').on(table.isRead),
}));

// ============================================================================
// ANALYTICS
// ============================================================================

export const analytics = mysqlTable('analytics', {
  id: int('id').autoincrement().primaryKey(),
  userId: int('user_id'),
  eventType: varchar('event_type', { length: 100 }).notNull(), // 'page_view', 'click', 'purchase', etc.
  eventData: json('event_data'),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  eventTypeIdx: index('analytics_event_type_idx').on(table.eventType),
  createdIdx: index('analytics_created_idx').on(table.createdAt),
}));

// ============================================================================
// EXPORTS
// ============================================================================

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Post = typeof posts.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Course = typeof courses.$inferSelect;
export type Job = typeof jobs.$inferSelect;
export type AIAgent = typeof aiAgents.$inferSelect;

