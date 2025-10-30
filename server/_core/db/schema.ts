import { pgTable, serial, varchar, text, timestamp, boolean, integer, jsonb, primaryKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  password_hash: varchar('password_hash', { length: 255 }).notNull(),
  display_name: varchar('display_name', { length: 100 }),
  avatar_url: text('avatar_url'),
  bio: text('bio'),
  is_verified: boolean('is_verified').notNull().default(false),
  verification_token: varchar('verification_token', { length: 255 }),
  verification_token_expires_at: timestamp('verification_token_expires_at', { withTimezone: true }),
  password_reset_token: varchar('password_reset_token', { length: 255 }),
  password_reset_expires_at: timestamp('password_reset_expires_at', { withTimezone: true }),
  mfa_secret: varchar('mfa_secret', { length: 255 }),
  mfa_enabled: boolean('mfa_enabled').notNull().default(false),
  last_login_at: timestamp('last_login_at', { withTimezone: true }),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  deleted_at: timestamp('deleted_at', { withTimezone: true }),
});

// Sessions table
export const sessions = pgTable('sessions', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  token: varchar('token', { length: 255 }).notNull().unique(),
  user_agent: text('user_agent'),
  ip_address: varchar('ip_address', { length: 45 }),
  expires_at: timestamp('expires_at', { withTimezone: true }).notNull(),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// Refresh tokens table
export const refreshTokens = pgTable('refresh_tokens', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  token: varchar('token', { length: 255 }).notNull().unique(),
  expires_at: timestamp('expires_at', { withTimezone: true }).notNull(),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  revoked: boolean('revoked').notNull().default(false),
  replaced_by_token: varchar('replaced_by_token', { length: 255 }),
  user_agent: text('user_agent'),
  ip_address: varchar('ip_address', { length: 45 }),
});

// Roles table
export const roles = pgTable('roles', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).notNull().unique(),
  description: text('description'),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// Permissions table
export const permissions = pgTable('permissions', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  description: text('description'),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// Role permissions junction table
export const rolePermissions = pgTable('role_permissions', {
  role_id: integer('role_id').notNull().references(() => roles.id, { onDelete: 'cascade' }),
  permission_id: integer('permission_id').notNull().references(() => permissions.id, { onDelete: 'cascade' }),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  pk: primaryKey({ columns: [table.role_id, table.permission_id] }),
}));

// User roles junction table
export const userRoles = pgTable('user_roles', {
  user_id: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  role_id: integer('role_id').notNull().references(() => roles.id, { onDelete: 'cascade' }),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  pk: primaryKey({ columns: [table.user_id, table.role_id] }),
}));

// Audit logs table
export const auditLogs = pgTable('audit_logs', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').references(() => users.id, { onDelete: 'set null' }),
  action: varchar('action', { length: 50 }).notNull(),
  entity_type: varchar('entity_type', { length: 50 }).notNull(),
  entity_id: integer('entity_id'),
  old_values: jsonb('old_values'),
  new_values: jsonb('new_values'),
  ip_address: varchar('ip_address', { length: 45 }),
  user_agent: text('user_agent'),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  refreshTokens: many(refreshTokens),
  userRoles: many(userRoles),
  auditLogs: many(auditLogs),
}));

export const rolesRelations = relations(roles, ({ many }) => ({
  rolePermissions: many(rolePermissions),
  userRoles: many(userRoles),
}));

export const permissionsRelations = relations(permissions, ({ many }) => ({
  rolePermissions: many(rolePermissions),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.user_id],
    references: [users.id],
  }),
}));

export const refreshTokensRelations = relations(refreshTokens, ({ one }) => ({
  user: one(users, {
    fields: [refreshTokens.user_id],
    references: [users.id],
  }),
}));

export const rolePermissionsRelations = relations(rolePermissions, ({ one }) => ({
  role: one(roles, {
    fields: [rolePermissions.role_id],
    references: [roles.id],
  }),
  permission: one(permissions, {
    fields: [rolePermissions.permission_id],
    references: [permissions.id],
  }),
}));

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  user: one(users, {
    fields: [userRoles.user_id],
    references: [users.id],
  }),
  role: one(roles, {
    fields: [userRoles.role_id],
    references: [roles.id],
  }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(users, {
    fields: [auditLogs.user_id],
    references: [users.id],
  }),
}));

// Export types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;

export type RefreshToken = typeof refreshTokens.$inferSelect;
export type NewRefreshToken = typeof refreshTokens.$inferInsert;

export type Role = typeof roles.$inferSelect;
export type NewRole = typeof roles.$inferInsert;

export type Permission = typeof permissions.$inferSelect;
export type NewPermission = typeof permissions.$inferInsert;

export type RolePermission = typeof rolePermissions.$inferSelect;
export type NewRolePermission = typeof rolePermissions.$inferInsert;

export type UserRole = typeof userRoles.$inferSelect;
export type NewUserRole = typeof userRoles.$inferInsert;

export type AuditLog = typeof auditLogs.$inferSelect;
export type NewAuditLog = typeof auditLogs.$inferInsert;
