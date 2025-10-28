import { sqliteTable, integer, text, sql, alterTable } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable("users", {
  did: text("did"),
  id: integer('id').primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  username: text('username').notNull().unique(),
  displayName: text('display_name'),
  bio: text('bio'),
  avatar: text('avatar'),
  coverImage: text('cover_image'),
  isVerified: integer('is_verified', { mode: 'boolean' }).default(false).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
  mfaSecret: text("mfa_secret"),
  mfaEnabled: integer("mfa_enabled", { mode: 'boolean' }).default(false).notNull(),
});

export const auditLogs = sqliteTable('audit_logs', {
  id: integer('id').primaryKey(),
  eventId: text('event_id').notNull().unique(),
  timestamp: integer('timestamp', { mode: 'timestamp' }).notNull(),
  userId: text('user_id'),
  impersonatorId: text('impersonator_id'),
  action: text('action').notNull(),
  object: text('object').notNull(),
  objectId: text('object_id'),
  changes: text('changes', { mode: 'json' }),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  status: text('status').notNull(),
  context: text('context', { mode: 'json' }),
});

// RBAC Tables
export const roles = sqliteTable("roles", {
  id: integer("id").primaryKey(),
  name: text("name").notNull().unique(),
});

export const permissions = sqliteTable("permissions", {
  id: integer("id").primaryKey(),
  name: text("name").notNull().unique(), // e.g., "post:create"
});

export const rolePermissions = sqliteTable("role_permissions", {
  roleId: integer("role_id").references(() => roles.id, { onDelete: "cascade" }).notNull(),
  permissionId: integer("permission_id").references(() => permissions.id, { onDelete: "cascade" }).notNull(),
});

export const userRoles = sqliteTable("user_roles", {
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  roleId: integer("role_id").references(() => roles.id, { onDelete: "cascade" }).notNull(),
});


// Gamification
export const user_points = sqliteTable("user_points", {
  id: integer("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  points: integer("points").notNull(),
  action: text("action").notNull(),
  createdAt: integer("created_at", { mode: 'timestamp' }).notNull(),
});

export const badges = sqliteTable("badges", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  iconUrl: text("icon_url"),
});

export const user_badges = sqliteTable("user_badges", {
  id: integer("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  badgeId: integer("badge_id").notNull().references(() => badges.id),
  createdAt: integer("created_at", { mode: 'timestamp' }).notNull(),
});

// Quest System
export const quests = sqliteTable("quests", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  rewardPoints: integer("reward_points"),
  rewardBadgeId: integer("reward_badge_id").references(() => badges.id),
});

export const quest_objectives = sqliteTable("quest_objectives", {
  id: integer("id").primaryKey(),
  questId: integer("quest_id").notNull().references(() => quests.id),
  objectiveType: text("objective_type").notNull(),
  targetCount: integer("target_count").notNull(),
});

export const user_quests = sqliteTable("user_quests", {
  id: integer("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  questId: integer("quest_id").notNull().references(() => quests.id),
  status: text("status").notNull(),
  progress: integer("progress").default(0),
  createdAt: integer("created_at", { mode: 'timestamp' }).notNull(),
  completedAt: integer("completed_at", { mode: 'timestamp' }),
});



// Virtual Economy
export const wallets = sqliteTable("wallets", {
  id: integer("id").primaryKey(),
  userId: integer("user_id").notNull().unique().references(() => users.id),
  balance: integer("balance").notNull().default(0),
  createdAt: integer("created_at", { mode: 'timestamp' }).notNull(),
  updatedAt: integer("updated_at", { mode: 'timestamp' }).notNull(),
});

export const transactions = sqliteTable("transactions", {
  id: integer("id").primaryKey(),
  fromWalletId: integer("from_wallet_id").references(() => wallets.id),
  toWalletId: integer("to_wallet_id").references(() => wallets.id),
  amount: integer("amount").notNull(),
  type: text("type").notNull(),
  description: text("description"),
  createdAt: integer("created_at", { mode: 'timestamp' }).notNull(),

});


// Marketplace
export const categories = sqliteTable("categories", {
  id: integer("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
});

export const listings = sqliteTable("listings", {
  id: integer("id").primaryKey(),
  sellerId: integer("seller_id").notNull().references(() => users.id),
  categoryId: integer("category_id").notNull().references(() => categories.id),
  title: text("title").notNull(),
  description: text("description"),
  price: integer("price").notNull(),
  media: text("media", { mode: "json" }),
  status: text("status").notNull().default("active"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  nftTokenId: integer("nft_token_id"),
  nftContractAddress: text("nft_contract_address"),
});

export const reviews = sqliteTable("reviews", {
  id: integer("id").primaryKey(),
  listingId: integer("listing_id").notNull().references(() => listings.id),
  buyerId: integer("buyer_id").notNull().references(() => users.id),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});



// RTS Game Engine
export const games = sqliteTable("games", {
  id: integer("id").primaryKey(),
  gameType: text("game_type").notNull(),
  status: text("status").notNull().default("pending"),
  gameState: text("game_state", { mode: "json" }),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const game_players = sqliteTable("game_players", {
  id: integer("id").primaryKey(),
  gameId: integer("game_id").notNull().references(() => games.id),
  userId: integer("user_id").notNull().references(() => users.id),
  team: integer("team"),
});



// Add nftTokenId and nftContractAddress to listings table
alterTable(listings, {
  nftTokenId: integer("nft_token_id"),
  nftContractAddress: text("nft_contract_address"),
});



// AI NPCs
export const npcs = sqliteTable("npcs", {
  id: integer("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  personality: text("personality", { mode: "json" }),
  backstory: text("backstory"),
  currentLocation: text("current_location"),
  currentActivity: text("current_activity"),
});



// Voice and Text Chat
export const chat_messages = sqliteTable("chat_messages", {
  id: integer("id").primaryKey(),
  senderId: integer("sender_id").notNull().references(() => users.id),
  recipientId: integer("recipient_id").references(() => users.id),
  channelId: integer("channel_id"), // Assuming a channels table exists
  message: text("message").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});



// Biometric Authentication
export const authenticators = sqliteTable("authenticators", {
  id: integer("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  credentialID: text("credential_id").notNull().unique(),
  credentialPublicKey: text("credential_public_key").notNull(),
  counter: integer("counter").notNull(),
  transports: text("transports", { mode: "json" }),
});



// Decentralized Identity






// Live Streams Table
export const liveStreams = sqliteTable("live_streams", {
  id: integer("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});


// Cloud Gaming Sessions Table
export const cloudGamingSessions = sqliteTable("cloud_gaming_sessions", {
  id: integer("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  gameId: integer("game_id").notNull().references(() => games.id),
  status: text("status").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  endedAt: text("ended_at"),
});




// Digital Twins Table
export const digitalTwins = sqliteTable("digital_twins", {
  id: integer("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  data: text("data", { mode: "json" }),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});




// BCI Devices Table
export const bciDevices = sqliteTable("bci_devices", {
  id: integer("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  deviceId: text("device_id").notNull().unique(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});




// Quantum Algorithms Table
export const quantumAlgorithms = sqliteTable("quantum_algorithms", {
  id: integer("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  code: text("code").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});




// Swarms Table
export const swarms = sqliteTable("swarms", {
  id: integer("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  agentCount: integer("agent_count").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});




// Student Models Table
export const studentModels = sqliteTable("student_models", {
  id: integer("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id).unique(),
  data: text("data", { mode: "json" }),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});




// Crowdsourcing Projects Table
export const crowdsourcingProjects = sqliteTable("crowdsourcing_projects", {
  id: integer("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Crowdsourcing Data Table
export const crowdsourcingData = sqliteTable("crowdsourcing_data", {
  id: integer("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  projectId: integer("project_id").notNull().references(() => crowdsourcingProjects.id),
  data: text("data", { mode: "json" }),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});



export const feedback = sqliteTable(
  'feedback',
  {
    id: integer("id").primaryKey(),
    userId: integer("user_id").notNull(),
    type: text("type").notNull(),
    message: text("message").notNull(),
    createdAt: integer("created_at", { mode: 'timestamp' }).notNull(),
  }
);


export const forum_posts = sqliteTable(
  'forum_posts',
  {
    id: integer("id").primaryKey(),
    userId: integer("user_id").notNull(),
    title: text("title").notNull(),
    message: text("message").notNull(),
    createdAt: integer("created_at", { mode: 'timestamp' }).notNull(),
  }
);

export const forum_replies = sqliteTable(
  'forum_replies',
  {
    id: integer("id").primaryKey(),
    postId: integer("post_id").notNull(),
    userId: integer("user_id").notNull(),
    message: text("message").notNull(),
    createdAt: integer("created_at", { mode: 'timestamp' }).notNull(),
  }
);


export const knowledge_base_articles = sqliteTable(
  'knowledge_base_articles',
  {
    id: integer("id").primaryKey(),
    title: text("title").notNull(),
    content: text("content").notNull(),
    createdAt: integer("created_at", { mode: 'timestamp' }).notNull(),
  }
);


export const api_keys = sqliteTable(
  'api_keys',
  {
    id: integer("id").primaryKey(),
    userId: integer("user_id").notNull(),
    key: text("key").notNull(),
    createdAt: integer("created_at", { mode: 'timestamp' }).notNull(),
  }
);
