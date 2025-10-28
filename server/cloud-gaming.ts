import { getDb } from "./db";

export class CloudGamingService {
  async createSession(userId: number, gameId: number) {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    // Check if the user is already in a session
    const existingSession = await db.get(
      "SELECT * FROM cloud_gaming_sessions WHERE user_id = ? AND status = ?",
      userId,
      "active"
    );
    if (existingSession) {
      throw new Error("User is already in a session");
    }

    // Create a new session
    const result = await db.run(
      "INSERT INTO cloud_gaming_sessions (user_id, game_id, status) VALUES (?, ?, ?)",
      userId,
      gameId,
      "active"
    );
    return result;
  }

  async getSession(sessionId: number) {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const session = await db.get(
      "SELECT * FROM cloud_gaming_sessions WHERE id = ?",
      sessionId
    );
    return session;
  }

  async endSession(sessionId: number) {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const result = await db.run(
      "UPDATE cloud_gaming_sessions SET status = ? WHERE id = ?",
      "ended",
      sessionId
    );
    return result;
  }
}

