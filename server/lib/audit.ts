import { db } from "../db";
import { auditLogs } from "../db/schema";

interface AuditLogData {
  userId?: string;
  impersonatorId?: string;
  action: string;
  object: string;
  objectId?: string;
  changes?: any;
  ipAddress?: string;
  userAgent?: string;
  status: string;
  context?: any;
}

export class AuditLogger {
  static async log(data: AuditLogData) {
    try {
      await db.insert(auditLogs).values({
        eventId: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
        ...data,
      });
    } catch (error) {
      console.error("Failed to write to audit log:", error);
    }
  }
}

