/**
 * AI Conversations Database Schema
 * 
 * This schema stores all AI interactions for:
 * 1. Conversation history
 * 2. User feedback collection
 * 3. Training data for AETHERIAL AI
 * 4. Model usage tracking
 * 5. Cost monitoring
 */

import { pgTable, text, timestamp, integer, boolean, jsonb, uuid, real, index } from "drizzle-orm/pg-core";
import { users } from "./schema";

// ============================================================================
// AI CONVERSATIONS
// ============================================================================

/**
 * Stores conversation sessions
 */
export const aiConversations = pgTable("ai_conversations", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").references(() => users.id).notNull(),
  
  // Conversation metadata
  title: text("title"), // Auto-generated or user-provided
  context: text("context").notNull(), // admin, user, product, course, support, etc.
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  lastMessageAt: timestamp("last_message_at").defaultNow().notNull(),
  
  // Status
  isActive: boolean("is_active").default(true).notNull(),
  isArchived: boolean("is_archived").default(false).notNull(),
  
  // Metadata
  metadata: jsonb("metadata"), // Additional context, tags, etc.
}, (table) => ({
  userIdIdx: index("ai_conversations_user_id_idx").on(table.userId),
  contextIdx: index("ai_conversations_context_idx").on(table.context),
  createdAtIdx: index("ai_conversations_created_at_idx").on(table.createdAt),
}));

// ============================================================================
// AI MESSAGES
// ============================================================================

/**
 * Stores individual messages in conversations
 */
export const aiMessages = pgTable("ai_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  conversationId: uuid("conversation_id").references(() => aiConversations.id, { onDelete: "cascade" }).notNull(),
  
  // Message content
  role: text("role").notNull(), // user, assistant, system
  content: text("content").notNull(),
  
  // AI model information (for assistant messages)
  model: text("model"), // gpt-4o, claude-sonnet-4-5, etc.
  taskType: text("task_type"), // product_description, course_outline, etc.
  
  // Token usage (for cost tracking)
  inputTokens: integer("input_tokens"),
  outputTokens: integer("output_tokens"),
  totalTokens: integer("total_tokens"),
  
  // Cost tracking
  inputCost: real("input_cost"), // Cost in USD
  outputCost: real("output_cost"),
  totalCost: real("total_cost"),
  
  // Performance metrics
  latencyMs: integer("latency_ms"), // Response time in milliseconds
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  
  // Metadata
  metadata: jsonb("metadata"), // Model parameters, temperature, etc.
}, (table) => ({
  conversationIdIdx: index("ai_messages_conversation_id_idx").on(table.conversationId),
  roleIdx: index("ai_messages_role_idx").on(table.role),
  modelIdx: index("ai_messages_model_idx").on(table.model),
  createdAtIdx: index("ai_messages_created_at_idx").on(table.createdAt),
}));

// ============================================================================
// AI FEEDBACK
// ============================================================================

/**
 * Stores user feedback on AI responses
 * Critical for training AETHERIAL AI!
 */
export const aiFeedback = pgTable("ai_feedback", {
  id: uuid("id").primaryKey().defaultRandom(),
  messageId: uuid("message_id").references(() => aiMessages.id, { onDelete: "cascade" }).notNull(),
  userId: text("user_id").references(() => users.id).notNull(),
  
  // Feedback type
  type: text("type").notNull(), // thumbs_up, thumbs_down, rating, comment
  
  // Rating (1-5 stars)
  rating: integer("rating"), // 1-5
  
  // Detailed feedback
  comment: text("comment"),
  
  // What was wrong/right
  tags: jsonb("tags").$type<string[]>(), // ["helpful", "accurate", "creative", "incorrect", "unclear"]
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  
  // Metadata
  metadata: jsonb("metadata"),
}, (table) => ({
  messageIdIdx: index("ai_feedback_message_id_idx").on(table.messageId),
  userIdIdx: index("ai_feedback_user_id_idx").on(table.userId),
  typeIdx: index("ai_feedback_type_idx").on(table.type),
  ratingIdx: index("ai_feedback_rating_idx").on(table.rating),
}));

// ============================================================================
// AI MODEL USAGE
// ============================================================================

/**
 * Tracks model usage and costs
 * Helps optimize model selection
 */
export const aiModelUsage = pgTable("ai_model_usage", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Model information
  model: text("model").notNull(), // gpt-4o, claude-sonnet-4-5, etc.
  taskType: text("task_type"), // product_description, course_outline, etc.
  
  // Usage statistics
  requestCount: integer("request_count").default(0).notNull(),
  totalInputTokens: integer("total_input_tokens").default(0).notNull(),
  totalOutputTokens: integer("total_output_tokens").default(0).notNull(),
  totalTokens: integer("total_tokens").default(0).notNull(),
  
  // Cost statistics
  totalCost: real("total_cost").default(0).notNull(),
  
  // Performance statistics
  avgLatencyMs: integer("avg_latency_ms"),
  minLatencyMs: integer("min_latency_ms"),
  maxLatencyMs: integer("max_latency_ms"),
  
  // Quality statistics (from feedback)
  avgRating: real("avg_rating"),
  thumbsUpCount: integer("thumbs_up_count").default(0).notNull(),
  thumbsDownCount: integer("thumbs_down_count").default(0).notNull(),
  
  // Time period
  date: timestamp("date").notNull(), // Daily aggregation
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  modelIdx: index("ai_model_usage_model_idx").on(table.model),
  taskTypeIdx: index("ai_model_usage_task_type_idx").on(table.taskType),
  dateIdx: index("ai_model_usage_date_idx").on(table.date),
}));

// ============================================================================
// AI TRAINING DATA
// ============================================================================

/**
 * Stores curated training data for AETHERIAL AI
 * Only high-quality interactions with positive feedback
 */
export const aiTrainingData = pgTable("ai_training_data", {
  id: uuid("id").primaryKey().defaultRandom(),
  conversationId: uuid("conversation_id").references(() => aiConversations.id),
  messageId: uuid("message_id").references(() => aiMessages.id),
  
  // Training example
  instruction: text("instruction").notNull(), // User query
  input: text("input"), // Additional context
  output: text("output").notNull(), // AI response
  
  // Source information
  sourceModel: text("source_model").notNull(), // Which teacher model generated this
  taskType: text("task_type").notNull(),
  context: text("context").notNull(),
  
  // Quality indicators
  rating: integer("rating"), // User rating
  feedbackScore: real("feedback_score"), // Calculated quality score
  isVerified: boolean("is_verified").default(false).notNull(), // Manually verified
  
  // Training metadata
  usedForTraining: boolean("used_for_training").default(false).notNull(),
  trainingEpoch: integer("training_epoch"), // Which training run used this
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  
  // Metadata
  metadata: jsonb("metadata"),
}, (table) => ({
  sourceModelIdx: index("ai_training_data_source_model_idx").on(table.sourceModel),
  taskTypeIdx: index("ai_training_data_task_type_idx").on(table.taskType),
  contextIdx: index("ai_training_data_context_idx").on(table.context),
  ratingIdx: index("ai_training_data_rating_idx").on(table.rating),
  isVerifiedIdx: index("ai_training_data_is_verified_idx").on(table.isVerified),
  usedForTrainingIdx: index("ai_training_data_used_for_training_idx").on(table.usedForTraining),
}));

// ============================================================================
// TYPES
// ============================================================================

export type AIConversation = typeof aiConversations.$inferSelect;
export type NewAIConversation = typeof aiConversations.$inferInsert;

export type AIMessage = typeof aiMessages.$inferSelect;
export type NewAIMessage = typeof aiMessages.$inferInsert;

export type AIFeedback = typeof aiFeedback.$inferSelect;
export type NewAIFeedback = typeof aiFeedback.$inferInsert;

export type AIModelUsage = typeof aiModelUsage.$inferSelect;
export type NewAIModelUsage = typeof aiModelUsage.$inferInsert;

export type AITrainingData = typeof aiTrainingData.$inferSelect;
export type NewAITrainingData = typeof aiTrainingData.$inferInsert;

