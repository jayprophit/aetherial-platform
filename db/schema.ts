import { pgTable, serial, text, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  username: text('username').notNull().unique(),
  displayName: text('display_name'),
  bio: text('bio'),
  avatar: text('avatar'),
  coverImage: text('cover_image'),
  isVerified: boolean('is_verified').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  mfaSecret: text("mfa_secret"),
  mfaEnabled: boolean("mfa_enabled").default(false).notNull(),
});

export const auditLogs = pgTable('audit_logs', {
  id: serial('id').primaryKey(),
  eventId: text('event_id').notNull().unique(),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
  userId: text('user_id'),
  impersonatorId: text('impersonator_id'),
  action: text('action').notNull(),
  object: text('object').notNull(),
  objectId: text('object_id'),
  changes: jsonb('changes'),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  status: text('status').notNull(),
  context: jsonb('context'),
});

