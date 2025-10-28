import { getDb } from "./db";

export class DigitalTwinService {
  async createTwin(userId: number, name: string, description: string) {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const result = await db.run(
      "INSERT INTO digital_twins (user_id, name, description) VALUES (?, ?, ?)",
      userId,
      name,
      description
    );
    return result;
  }

  async getTwin(twinId: number) {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const twin = await db.get(
      "SELECT * FROM digital_twins WHERE id = ?",
      twinId
    );
    return twin;
  }

  async getTwins(userId: number) {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const twins = await db.all(
      "SELECT * FROM digital_twins WHERE user_id = ?",
      userId
    );
    return twins;
  }

  async updateTwinData(twinId: number, data: any) {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const result = await db.run(
      "UPDATE digital_twins SET data = ? WHERE id = ?",
      JSON.stringify(data),
      twinId
    );
    return result;
  }
}

