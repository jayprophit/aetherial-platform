import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
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