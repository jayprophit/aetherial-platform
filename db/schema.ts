
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

