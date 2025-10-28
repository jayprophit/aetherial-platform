import { getDb } from "./db";

export class LiveStreamingService {
  async createStream(userId: number, title: string) {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const result = await db.run(
      "INSERT INTO live_streams (user_id, title) VALUES (?, ?)",
      userId,
      title
    );
    return result;
  }

  async getStream(streamId: number) {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const stream = await db.get(
      "SELECT * FROM live_streams WHERE id = ?",
      streamId
    );
    return stream;
  }

  async getStreams() {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const streams = await db.all("SELECT * FROM live_streams");
    return streams;
  }
}

