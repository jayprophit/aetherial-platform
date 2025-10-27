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

export const productOrders = mysqlTable('product_orders', {
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




// ============================================================================
// TRADING PLATFORM
// ============================================================================

export const tradingPairs = mysqlTable('trading_pairs', {
  id: int('id').autoincrement().primaryKey(),
  baseAsset: varchar('base_asset', { length: 20 }).notNull(), // AETH, BTC, ETH, etc.
  quoteAsset: varchar('quote_asset', { length: 20 }).notNull(), // USD, USDT, etc.
  currentPrice: decimal('current_price', { precision: 20, scale: 8 }).notNull(),
  volume24h: decimal('volume_24h', { precision: 20, scale: 8 }).default('0'),
  priceChange24h: decimal('price_change_24h', { precision: 10, scale: 4 }).default('0'),
  high24h: decimal('high_24h', { precision: 20, scale: 8 }),
  low24h: decimal('low_24h', { precision: 20, scale: 8 }),
  isActive: boolean('is_active').default(true),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
}, (table) => ({
  pairIdx: index('trading_pairs_pair_idx').on(table.baseAsset, table.quoteAsset),
}));

export const orders = mysqlTable('orders', {
  id: int('id').autoincrement().primaryKey(),
  userId: int('user_id').notNull(),
  pairId: int('pair_id').notNull(),
  type: mysqlEnum('type', ['market', 'limit', 'stop-loss', 'stop-limit']).notNull(),
  side: mysqlEnum('side', ['buy', 'sell']).notNull(),
  price: decimal('price', { precision: 20, scale: 8 }),
  amount: decimal('amount', { precision: 20, scale: 8 }).notNull(),
  filled: decimal('filled', { precision: 20, scale: 8 }).default('0'),
  status: mysqlEnum('status', ['pending', 'partial', 'filled', 'cancelled']).default('pending'),
  createdAt: timestamp('created_at').defaultNow(),
  filledAt: timestamp('filled_at'),
}, (table) => ({
  userIdx: index('orders_user_idx').on(table.userId),
  pairIdx: index('orders_pair_idx').on(table.pairId),
  statusIdx: index('orders_status_idx').on(table.status),
}));

export const trades = mysqlTable('trades', {
  id: int('id').autoincrement().primaryKey(),
  pairId: int('pair_id').notNull(),
  buyOrderId: int('buy_order_id').notNull(),
  sellOrderId: int('sell_order_id').notNull(),
  buyerId: int('buyer_id').notNull(),
  sellerId: int('seller_id').notNull(),
  price: decimal('price', { precision: 20, scale: 8 }).notNull(),
  amount: decimal('amount', { precision: 20, scale: 8 }).notNull(),
  total: decimal('total', { precision: 20, scale: 8 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  pairIdx: index('trades_pair_idx').on(table.pairId),
  createdIdx: index('trades_created_idx').on(table.createdAt),
}));

export const portfolios = mysqlTable('portfolios', {
  id: int('id').autoincrement().primaryKey(),
  userId: int('user_id').notNull(),
  asset: varchar('asset', { length: 20 }).notNull(),
  balance: decimal('balance', { precision: 20, scale: 8 }).default('0'),
  lockedBalance: decimal('locked_balance', { precision: 20, scale: 8 }).default('0'), // In open orders
  averageBuyPrice: decimal('average_buy_price', { precision: 20, scale: 8 }),
  totalInvested: decimal('total_invested', { precision: 20, scale: 8 }).default('0'),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
}, (table) => ({
  uniqueAsset: uniqueIndex('unique_portfolio_asset_idx').on(table.userId, table.asset),
}));

// ============================================================================
// NFT MARKETPLACE
// ============================================================================

export const nfts = mysqlTable('nfts', {
  id: int('id').autoincrement().primaryKey(),
  tokenId: varchar('token_id', { length: 255 }).notNull().unique(),
  contractAddress: varchar('contract_address', { length: 255 }),
  creatorId: int('creator_id').notNull(),
  ownerId: int('owner_id').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  imageUrl: text('image_url'),
  metadataUrl: text('metadata_url'), // IPFS URL
  category: mysqlEnum('category', ['art', 'collectible', 'certificate', 'achievement', 'inheritance', 'other']),
  royaltyPercentage: decimal('royalty_percentage', { precision: 5, scale: 2 }).default('0'), // 0-100%
  isListed: boolean('is_listed').default(false),
  price: decimal('price', { precision: 20, scale: 8 }),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  ownerIdx: index('nfts_owner_idx').on(table.ownerId),
  creatorIdx: index('nfts_creator_idx').on(table.creatorId),
  categoryIdx: index('nfts_category_idx').on(table.category),
}));

export const nftCollections = mysqlTable('nft_collections', {
  id: int('id').autoincrement().primaryKey(),
  creatorId: int('creator_id').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  coverImage: text('cover_image'),
  floorPrice: decimal('floor_price', { precision: 20, scale: 8 }),
  totalVolume: decimal('total_volume', { precision: 20, scale: 8 }).default('0'),
  itemCount: int('item_count').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

export const nftSales = mysqlTable('nft_sales', {
  id: int('id').autoincrement().primaryKey(),
  nftId: int('nft_id').notNull(),
  sellerId: int('seller_id').notNull(),
  buyerId: int('buyer_id').notNull(),
  price: decimal('price', { precision: 20, scale: 8 }).notNull(),
  royaltyPaid: decimal('royalty_paid', { precision: 20, scale: 8 }).default('0'),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  nftIdx: index('nft_sales_nft_idx').on(table.nftId),
  createdIdx: index('nft_sales_created_idx').on(table.createdAt),
}));

export const nftAuctions = mysqlTable('nft_auctions', {
  id: int('id').autoincrement().primaryKey(),
  nftId: int('nft_id').notNull(),
  sellerId: int('seller_id').notNull(),
  startingPrice: decimal('starting_price', { precision: 20, scale: 8 }).notNull(),
  currentBid: decimal('current_bid', { precision: 20, scale: 8 }),
  highestBidderId: int('highest_bidder_id'),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time').notNull(),
  status: mysqlEnum('status', ['active', 'ended', 'cancelled']).default('active'),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  nftIdx: index('nft_auctions_nft_idx').on(table.nftId),
  statusIdx: index('nft_auctions_status_idx').on(table.status),
}));

export const nftBids = mysqlTable('nft_bids', {
  id: int('id').autoincrement().primaryKey(),
  auctionId: int('auction_id').notNull(),
  bidderId: int('bidder_id').notNull(),
  amount: decimal('amount', { precision: 20, scale: 8 }).notNull(),
  isWinning: boolean('is_winning').default(false),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  auctionIdx: index('nft_bids_auction_idx').on(table.auctionId),
}));

// ============================================================================
// UPDATED EXPORTS
// ============================================================================

export type TradingPair = typeof tradingPairs.$inferSelect;
export type ProductOrder = typeof productOrders.$inferSelect;
export type TradingOrder = typeof orders.$inferSelect;
export type Trade = typeof trades.$inferSelect;
export type Portfolio = typeof portfolios.$inferSelect;
export type NFT = typeof nfts.$inferSelect;
export type NFTCollection = typeof nftCollections.$inferSelect;
export type NFTSale = typeof nftSales.$inferSelect;
export type NFTAuction = typeof nftAuctions.$inferSelect;
export type NFTBid = typeof nftBids.$inferSelect;




// ============================================================================
// IoT (INTERNET OF THINGS)
// ============================================================================

export const iotDevices = mysqlTable('iot_devices', {
  id: int('id').autoincrement().primaryKey(),
  ownerId: int('owner_id').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  deviceType: varchar('device_type', { length: 100 }).notNull(), // 'light', 'thermostat', 'camera', 'sensor', etc.
  manufacturer: varchar('manufacturer', { length: 255 }),
  model: varchar('model', { length: 255 }),
  deviceId: varchar('device_id', { length: 255 }).unique(), // Unique device identifier
  status: mysqlEnum('status', ['online', 'offline', 'error']).default('offline'),
  roomId: int('room_id'), // Group devices by room
  config: json('config'), // Device-specific configuration
  lastSeen: timestamp('last_seen'),
  firmwareVersion: varchar('firmware_version', { length: 50 }),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  ownerIdx: index('iot_devices_owner_idx').on(table.ownerId),
  typeIdx: index('iot_devices_type_idx').on(table.deviceType),
  statusIdx: index('iot_devices_status_idx').on(table.status),
}));

export const iotRooms = mysqlTable('iot_rooms', {
  id: int('id').autoincrement().primaryKey(),
  ownerId: int('owner_id').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  icon: varchar('icon', { length: 50 }),
  deviceCount: int('device_count').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

export const iotSensorData = mysqlTable('iot_sensor_data', {
  id: int('id').autoincrement().primaryKey(),
  deviceId: int('device_id').notNull(),
  dataType: varchar('data_type', { length: 50 }).notNull(), // 'temperature', 'humidity', 'motion', etc.
  value: decimal('value', { precision: 10, scale: 4 }).notNull(),
  unit: varchar('unit', { length: 20 }), // 'celsius', 'fahrenheit', '%', etc.
  timestamp: timestamp('timestamp').defaultNow(),
}, (table) => ({
  deviceIdx: index('iot_sensor_data_device_idx').on(table.deviceId),
  timestampIdx: index('iot_sensor_data_timestamp_idx').on(table.timestamp),
}));

export const iotAutomations = mysqlTable('iot_automations', {
  id: int('id').autoincrement().primaryKey(),
  ownerId: int('owner_id').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  trigger: json('trigger').notNull(), // Condition that triggers automation
  actions: json('actions').notNull(), // Actions to perform
  isActive: boolean('is_active').default(true),
  lastTriggered: timestamp('last_triggered'),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  ownerIdx: index('iot_automations_owner_idx').on(table.ownerId),
}));

// ============================================================================
// ROBOTICS
// ============================================================================

export const robots = mysqlTable('robots', {
  id: int('id').autoincrement().primaryKey(),
  ownerId: int('owner_id').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  robotType: varchar('robot_type', { length: 100 }).notNull(), // 'industrial', 'service', 'educational', 'drone', etc.
  manufacturer: varchar('manufacturer', { length: 255 }),
  model: varchar('model', { length: 255 }),
  serialNumber: varchar('serial_number', { length: 255 }).unique(),
  status: mysqlEnum('status', ['idle', 'working', 'charging', 'maintenance', 'offline', 'error']).default('offline'),
  batteryLevel: int('battery_level'), // 0-100%
  location: json('location'), // {latitude, longitude, altitude}
  capabilities: json('capabilities'), // Array of robot capabilities
  config: json('config'),
  firmwareVersion: varchar('firmware_version', { length: 50 }),
  lastSeen: timestamp('last_seen'),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  ownerIdx: index('robots_owner_idx').on(table.ownerId),
  typeIdx: index('robots_type_idx').on(table.robotType),
  statusIdx: index('robots_status_idx').on(table.status),
}));

export const robotTasks = mysqlTable('robot_tasks', {
  id: int('id').autoincrement().primaryKey(),
  robotId: int('robot_id').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  taskType: varchar('task_type', { length: 100 }).notNull(), // 'delivery', 'cleaning', 'inspection', etc.
  priority: mysqlEnum('priority', ['low', 'medium', 'high', 'urgent']).default('medium'),
  status: mysqlEnum('status', ['queued', 'in-progress', 'completed', 'failed', 'cancelled']).default('queued'),
  progress: int('progress').default(0), // 0-100%
  parameters: json('parameters'), // Task-specific parameters
  result: json('result'), // Task result data
  startedAt: timestamp('started_at'),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  robotIdx: index('robot_tasks_robot_idx').on(table.robotId),
  statusIdx: index('robot_tasks_status_idx').on(table.status),
}));

export const robotFleets = mysqlTable('robot_fleets', {
  id: int('id').autoincrement().primaryKey(),
  ownerId: int('owner_id').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  robotCount: int('robot_count').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

export const robotFleetMembers = mysqlTable('robot_fleet_members', {
  id: int('id').autoincrement().primaryKey(),
  fleetId: int('fleet_id').notNull(),
  robotId: int('robot_id').notNull(),
  role: varchar('role', { length: 100 }), // 'leader', 'worker', etc.
  joinedAt: timestamp('joined_at').defaultNow(),
}, (table) => ({
  uniqueMember: uniqueIndex('unique_fleet_robot_idx').on(table.fleetId, table.robotId),
}));

export const robotPrograms = mysqlTable('robot_programs', {
  id: int('id').autoincrement().primaryKey(),
  creatorId: int('creator_id').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  code: text('code').notNull(), // Robot program code
  language: varchar('language', { length: 50 }), // 'python', 'javascript', 'ros', etc.
  robotType: varchar('robot_type', { length: 100 }), // Compatible robot type
  isPublic: boolean('is_public').default(false),
  downloads: int('downloads').default(0),
  rating: decimal('rating', { precision: 3, scale: 2 }).default('0'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

export const robotMaintenanceLogs = mysqlTable('robot_maintenance_logs', {
  id: int('id').autoincrement().primaryKey(),
  robotId: int('robot_id').notNull(),
  type: mysqlEnum('type', ['routine', 'repair', 'upgrade', 'inspection']).notNull(),
  description: text('description'),
  performedBy: int('performed_by'), // User ID
  cost: decimal('cost', { precision: 10, scale: 2 }),
  nextMaintenanceDate: timestamp('next_maintenance_date'),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  robotIdx: index('robot_maintenance_robot_idx').on(table.robotId),
}));

// ============================================================================
// UPDATED EXPORTS
// ============================================================================

export type IoTDevice = typeof iotDevices.$inferSelect;
export type IoTRoom = typeof iotRooms.$inferSelect;
export type IoTSensorData = typeof iotSensorData.$inferSelect;
export type IoTAutomation = typeof iotAutomations.$inferSelect;
export type Robot = typeof robots.$inferSelect;
export type RobotTask = typeof robotTasks.$inferSelect;
export type RobotFleet = typeof robotFleets.$inferSelect;
export type RobotProgram = typeof robotPrograms.$inferSelect;
export type RobotMaintenanceLog = typeof robotMaintenanceLogs.$inferSelect;




// ============================================================================
// CV & CAREER MANAGEMENT
// ============================================================================

export const userCVs = mysqlTable('user_cvs', {
  id: int('id').autoincrement().primaryKey(),
  userId: int('user_id').notNull().unique(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  title: varchar('title', { length: 255 }), // Professional title
  summary: text('summary'),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 50 }),
  location: varchar('location', { length: 255 }),
  website: varchar('website', { length: 255 }),
  linkedIn: varchar('linked_in', { length: 255 }),
  github: varchar('github', { length: 255 }),
  isPublic: boolean('is_public').default(false),
  allowEmployerContact: boolean('allow_employer_contact').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

export const cvCertificates = mysqlTable('cv_certificates', {
  id: int('id').autoincrement().primaryKey(),
  cvId: int('cv_id').notNull(),
  certificateNftId: int('certificate_nft_id'), // Links to NFTs table
  courseName: varchar('course_name', { length: 255 }).notNull(),
  issuer: varchar('issuer', { length: 255 }).notNull(), // Aetherial, etc.
  issueDate: timestamp('issue_date').notNull(),
  expiryDate: timestamp('expiry_date'),
  credentialId: varchar('credential_id', { length: 255 }),
  blockchainTxHash: varchar('blockchain_tx_hash', { length: 255 }), // Verification
  skills: json('skills'), // Array of skills learned
  grade: varchar('grade', { length: 50 }),
  isVerified: boolean('is_verified').default(true),
  isVisible: boolean('is_visible').default(true),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  cvIdx: index('cv_certificates_cv_idx').on(table.cvId),
}));

export const cvExperience = mysqlTable('cv_experience', {
  id: int('id').autoincrement().primaryKey(),
  cvId: int('cv_id').notNull(),
  company: varchar('company', { length: 255 }).notNull(),
  position: varchar('position', { length: 255 }).notNull(),
  location: varchar('location', { length: 255 }),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date'),
  isCurrent: boolean('is_current').default(false),
  description: text('description'),
  achievements: json('achievements'), // Array of achievements
  skills: json('skills'), // Skills used
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  cvIdx: index('cv_experience_cv_idx').on(table.cvId),
}));

export const cvEducation = mysqlTable('cv_education', {
  id: int('id').autoincrement().primaryKey(),
  cvId: int('cv_id').notNull(),
  institution: varchar('institution', { length: 255 }).notNull(),
  degree: varchar('degree', { length: 255 }).notNull(),
  fieldOfStudy: varchar('field_of_study', { length: 255 }),
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  grade: varchar('grade', { length: 50 }),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  cvIdx: index('cv_education_cv_idx').on(table.cvId),
}));

export const cvSkills = mysqlTable('cv_skills', {
  id: int('id').autoincrement().primaryKey(),
  cvId: int('cv_id').notNull(),
  skillName: varchar('skill_name', { length: 255 }).notNull(),
  category: varchar('category', { length: 100 }), // 'technical', 'soft', 'language', etc.
  proficiency: mysqlEnum('proficiency', ['beginner', 'intermediate', 'advanced', 'expert']),
  yearsOfExperience: int('years_of_experience'),
  isVerified: boolean('is_verified').default(false), // Verified by certificates
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  cvIdx: index('cv_skills_cv_idx').on(table.cvId),
}));

// ============================================================================
// LEARNING POINTS & REWARDS
// ============================================================================

export const learningPoints = mysqlTable('learning_points', {
  id: int('id').autoincrement().primaryKey(),
  userId: int('user_id').notNull().unique(),
  totalPoints: int('total_points').default(0),
  availablePoints: int('available_points').default(0), // Not yet spent
  lifetimeEarned: int('lifetime_earned').default(0),
  lifetimeSpent: int('lifetime_spent').default(0),
  currentLevel: int('current_level').default(1),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

export const pointTransactions = mysqlTable('point_transactions', {
  id: int('id').autoincrement().primaryKey(),
  userId: int('user_id').notNull(),
  type: mysqlEnum('type', ['earned', 'spent', 'bonus', 'penalty']).notNull(),
  amount: int('amount').notNull(),
  source: varchar('source', { length: 255 }), // 'course_completion', 'quiz', 'achievement', etc.
  sourceId: int('source_id'), // ID of course, quiz, etc.
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  userIdx: index('point_transactions_user_idx').on(table.userId),
  createdIdx: index('point_transactions_created_idx').on(table.createdAt),
}));

export const courseUnlocks = mysqlTable('course_unlocks', {
  id: int('id').autoincrement().primaryKey(),
  userId: int('user_id').notNull(),
  courseId: int('course_id').notNull(),
  pointsCost: int('points_cost').notNull(),
  unlockedAt: timestamp('unlocked_at').defaultNow(),
}, (table) => ({
  uniqueUnlock: uniqueIndex('unique_course_unlock_idx').on(table.userId, table.courseId),
}));

// ============================================================================
// BARTERING SYSTEM
// ============================================================================

export const barterOffers = mysqlTable('barter_offers', {
  id: int('id').autoincrement().primaryKey(),
  userId: int('user_id').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  category: varchar('category', { length: 100 }),
  offeringType: mysqlEnum('offering_type', ['service', 'skill', 'time', 'product']).notNull(),
  offeringValue: decimal('offering_value', { precision: 10, scale: 2 }), // Estimated value in USD
  seekingType: mysqlEnum('seeking_type', ['service', 'skill', 'time', 'product', 'aeth', 'course']).notNull(),
  seekingValue: decimal('seeking_value', { precision: 10, scale: 2 }),
  duration: int('duration'), // In hours for services
  location: varchar('location', { length: 255 }),
  isRemote: boolean('is_remote').default(true),
  status: mysqlEnum('status', ['active', 'pending', 'completed', 'cancelled']).default('active'),
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  userIdx: index('barter_offers_user_idx').on(table.userId),
  categoryIdx: index('barter_offers_category_idx').on(table.category),
  statusIdx: index('barter_offers_status_idx').on(table.status),
}));

export const barterMatches = mysqlTable('barter_matches', {
  id: int('id').autoincrement().primaryKey(),
  offer1Id: int('offer1_id').notNull(),
  offer2Id: int('offer2_id').notNull(),
  user1Id: int('user1_id').notNull(),
  user2Id: int('user2_id').notNull(),
  matchScore: int('match_score'), // 0-100 compatibility score
  status: mysqlEnum('status', ['pending', 'accepted', 'rejected', 'completed']).default('pending'),
  agreedTerms: text('agreed_terms'),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  offer1Idx: index('barter_matches_offer1_idx').on(table.offer1Id),
  offer2Idx: index('barter_matches_offer2_idx').on(table.offer2Id),
}));

export const skillEquivalencies = mysqlTable('skill_equivalencies', {
  id: int('id').autoincrement().primaryKey(),
  skillName: varchar('skill_name', { length: 255 }).notNull().unique(),
  category: varchar('category', { length: 100 }),
  averageHourlyRate: decimal('average_hourly_rate', { precision: 10, scale: 2 }), // USD
  demandLevel: mysqlEnum('demand_level', ['low', 'medium', 'high', 'critical']),
  requiredCertificates: json('required_certificates'), // Array of certificate types
  marketValue: decimal('market_value', { precision: 10, scale: 2 }), // Overall market value
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

export const internationalWageStandards = mysqlTable('international_wage_standards', {
  id: int('id').autoincrement().primaryKey(),
  country: varchar('country', { length: 100 }).notNull(),
  skillCategory: varchar('skill_category', { length: 100 }).notNull(),
  experienceLevel: mysqlEnum('experience_level', ['entry', 'mid', 'senior', 'expert']).notNull(),
  averageHourlyRate: decimal('average_hourly_rate', { precision: 10, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 10 }).notNull(),
  usdEquivalent: decimal('usd_equivalent', { precision: 10, scale: 2 }).notNull(),
  costOfLiving: decimal('cost_of_living', { precision: 10, scale: 2 }), // Index
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
}, (table) => ({
  countryIdx: index('wage_standards_country_idx').on(table.country),
  categoryIdx: index('wage_standards_category_idx').on(table.skillCategory),
}));

// ============================================================================
// PRODUCT-COURSE LINKING
// ============================================================================

export const productCourseLinks = mysqlTable('product_course_links', {
  id: int('id').autoincrement().primaryKey(),
  productId: int('product_id').notNull(),
  courseId: int('course_id').notNull(),
  linkType: mysqlEnum('link_type', ['tutorial', 'related', 'required', 'recommended']).default('related'),
  displayOrder: int('display_order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  productIdx: index('product_course_links_product_idx').on(table.productId),
  courseIdx: index('product_course_links_course_idx').on(table.courseId),
}));

// ============================================================================
// UPDATED EXPORTS
// ============================================================================

export type UserCV = typeof userCVs.$inferSelect;
export type CVCertificate = typeof cvCertificates.$inferSelect;
export type CVExperience = typeof cvExperience.$inferSelect;
export type CVEducation = typeof cvEducation.$inferSelect;
export type CVSkill = typeof cvSkills.$inferSelect;
export type LearningPoints = typeof learningPoints.$inferSelect;
export type PointTransaction = typeof pointTransactions.$inferSelect;
export type CourseUnlock = typeof courseUnlocks.$inferSelect;
export type BarterOffer = typeof barterOffers.$inferSelect;
export type BarterMatch = typeof barterMatches.$inferSelect;
export type SkillEquivalency = typeof skillEquivalencies.$inferSelect;
export type InternationalWageStandard = typeof internationalWageStandards.$inferSelect;
export type ProductCourseLink = typeof productCourseLinks.$inferSelect;




// ============================================================================
// AI CONVERSATIONS & TRAINING DATA
// ============================================================================

/**
 * AI Conversations - stores all AI chat sessions
 * Used for history and training data collection
 */
export const aiConversations = mysqlTable('ai_conversations', {
  id: int('id').autoincrement().primaryKey(),
  userId: int('user_id').notNull(),
  
  // Conversation metadata
  title: text('title'),
  context: varchar('context', { length: 50 }).notNull(), // admin, user, product, course, support
  
  // Status
  isActive: boolean('is_active').default(true),
  isArchived: boolean('is_archived').default(false),
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
  lastMessageAt: timestamp('last_message_at').defaultNow().notNull(),
  
  // Metadata
  metadata: json('metadata'),
}, (table) => ({
  userIdx: index('ai_conversations_user_idx').on(table.userId),
  contextIdx: index('ai_conversations_context_idx').on(table.context),
}));

/**
 * AI Messages - individual messages in conversations
 * Stores both user queries and AI responses
 */
export const aiMessages = mysqlTable('ai_messages', {
  id: int('id').autoincrement().primaryKey(),
  conversationId: int('conversation_id').notNull(),
  
  // Message content
  role: varchar('role', { length: 20 }).notNull(), // user, assistant, system
  content: text('content').notNull(),
  
  // AI model info (for assistant messages)
  model: varchar('model', { length: 50 }), // gpt-4o, claude-sonnet-4-5, aetherial-ai
  taskType: varchar('task_type', { length: 50 }),
  
  // Token usage
  inputTokens: int('input_tokens'),
  outputTokens: int('output_tokens'),
  totalTokens: int('total_tokens'),
  
  // Cost tracking (in USD)
  inputCost: decimal('input_cost', { precision: 10, scale: 6 }),
  outputCost: decimal('output_cost', { precision: 10, scale: 6 }),
  totalCost: decimal('total_cost', { precision: 10, scale: 6 }),
  
  // Performance
  latencyMs: int('latency_ms'),
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  
  // Metadata
  metadata: json('metadata'),
}, (table) => ({
  conversationIdx: index('ai_messages_conversation_idx').on(table.conversationId),
  modelIdx: index('ai_messages_model_idx').on(table.model),
  createdIdx: index('ai_messages_created_idx').on(table.createdAt),
}));

/**
 * AI Feedback - user ratings and feedback
 * CRITICAL for training AETHERIAL AI!
 */
export const aiFeedback = mysqlTable('ai_feedback', {
  id: int('id').autoincrement().primaryKey(),
  messageId: int('message_id').notNull(),
  userId: int('user_id').notNull(),
  
  // Feedback type
  type: varchar('type', { length: 20 }).notNull(), // thumbs_up, thumbs_down, rating
  rating: int('rating'), // 1-5 stars
  comment: text('comment'),
  
  // Tags for categorization
  tags: json('tags'), // ["helpful", "accurate", "creative", "incorrect"]
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  messageIdx: index('ai_feedback_message_idx').on(table.messageId),
  userIdx: index('ai_feedback_user_idx').on(table.userId),
  typeIdx: index('ai_feedback_type_idx').on(table.type),
}));

/**
 * AI Training Data - curated examples for training AETHERIAL AI
 * Only high-quality interactions with positive feedback
 */
export const aiTrainingData = mysqlTable('ai_training_data', {
  id: int('id').autoincrement().primaryKey(),
  conversationId: int('conversation_id'),
  messageId: int('message_id'),
  
  // Training example
  instruction: text('instruction').notNull(), // User query
  input: text('input'), // Context
  output: text('output').notNull(), // AI response
  
  // Source
  sourceModel: varchar('source_model', { length: 50 }).notNull(), // Which model generated this
  taskType: varchar('task_type', { length: 50 }).notNull(),
  context: varchar('context', { length: 50 }).notNull(),
  
  // Quality
  rating: int('rating'),
  feedbackScore: decimal('feedback_score', { precision: 5, scale: 2 }),
  isVerified: boolean('is_verified').default(false),
  
  // Training status
  usedForTraining: boolean('used_for_training').default(false),
  trainingEpoch: int('training_epoch'),
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  
  // Metadata
  metadata: json('metadata'),
}, (table) => ({
  sourceModelIdx: index('ai_training_data_source_model_idx').on(table.sourceModel),
  taskTypeIdx: index('ai_training_data_task_type_idx').on(table.taskType),
  ratingIdx: index('ai_training_data_rating_idx').on(table.rating),
  verifiedIdx: index('ai_training_data_verified_idx').on(table.isVerified),
}));

/**
 * AI Model Benchmarks - compare AETHERIAL AI vs other models
 * Track performance improvements over time
 */
export const aiModelBenchmarks = mysqlTable('ai_model_benchmarks', {
  id: int('id').autoincrement().primaryKey(),
  
  // Test info
  testQuery: text('test_query').notNull(),
  taskType: varchar('task_type', { length: 50 }).notNull(),
  
  // Model responses
  aetherialResponse: text('aetherial_response'),
  gpt4oResponse: text('gpt4o_response'),
  claudeResponse: text('claude_response'),
  deepseekResponse: text('deepseek_response'),
  
  // Performance metrics
  aetherialLatencyMs: int('aetherial_latency_ms'),
  gpt4oLatencyMs: int('gpt4o_latency_ms'),
  claudeLatencyMs: int('claude_latency_ms'),
  deepseekLatencyMs: int('deepseek_latency_ms'),
  
  // Quality scores (1-5)
  aetherialScore: decimal('aetherial_score', { precision: 3, scale: 2 }),
  gpt4oScore: decimal('gpt4o_score', { precision: 3, scale: 2 }),
  claudeScore: decimal('claude_score', { precision: 3, scale: 2 }),
  deepseekScore: decimal('deepseek_score', { precision: 3, scale: 2 }),
  
  // Winner
  bestModel: varchar('best_model', { length: 50 }),
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  
  // Metadata
  metadata: json('metadata'),
}, (table) => ({
  taskTypeIdx: index('ai_model_benchmarks_task_type_idx').on(table.taskType),
  createdIdx: index('ai_model_benchmarks_created_idx').on(table.createdAt),
}));

/**
 * AI Model Usage - track usage and costs per model
 */
export const aiModelUsage = mysqlTable('ai_model_usage', {
  id: int('id').autoincrement().primaryKey(),
  
  // Model info
  model: varchar('model', { length: 50 }).notNull(),
  taskType: varchar('task_type', { length: 50 }),
  
  // Usage stats
  requestCount: int('request_count').default(0),
  totalInputTokens: int('total_input_tokens').default(0),
  totalOutputTokens: int('total_output_tokens').default(0),
  totalCost: decimal('total_cost', { precision: 10, scale: 2 }).default('0'),
  
  // Performance stats
  avgLatencyMs: int('avg_latency_ms'),
  minLatencyMs: int('min_latency_ms'),
  maxLatencyMs: int('max_latency_ms'),
  
  // Quality stats
  avgRating: decimal('avg_rating', { precision: 3, scale: 2 }),
  thumbsUpCount: int('thumbs_up_count').default(0),
  thumbsDownCount: int('thumbs_down_count').default(0),
  
  // Time period (daily aggregation)
  date: timestamp('date').notNull(),
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  modelIdx: index('ai_model_usage_model_idx').on(table.model),
  dateIdx: index('ai_model_usage_date_idx').on(table.date),
}));

