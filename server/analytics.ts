import { getDb } from "./db";

export class AnalyticsService {
  async getDailyActiveUsers() {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const result = await db.run(
      "SELECT COUNT(DISTINCT user_id) as dau FROM user_sessions WHERE strftime('%Y-%m-%d', session_start) >= strftime('%Y-%m-%d', 'now', '-1 day')"
    );
    return result;
  }

  async getMonthlyActiveUsers() {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const result = await db.run(
      "SELECT COUNT(DISTINCT user_id) as mau FROM user_sessions WHERE strftime('%Y-%m-%d', session_start) >= strftime('%Y-%m-%d', 'now', '-30 day')"
    );
    return result;
  }

  async getNewUsers() {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const result = await db.run(
      "SELECT COUNT(*) as new_users FROM users WHERE strftime('%Y-%m-%d', created_at) >= strftime('%Y-%m-%d', 'now', '-1 day')"
    );
    return result;
  }
}

