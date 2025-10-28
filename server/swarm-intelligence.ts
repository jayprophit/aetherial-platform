import { getDb } from "./db";

export class SwarmIntelligenceService {
  async createSwarm(userId: number, name: string, description: string, agentCount: number) {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const result = await db.run(
      "INSERT INTO swarms (user_id, name, description, agent_count) VALUES (?, ?, ?, ?)",
      userId,
      name,
      description,
      agentCount
    );
    return result;
  }

  async getSwarm(swarmId: number) {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const swarm = await db.get(
      "SELECT * FROM swarms WHERE id = ?",
      swarmId
    );
    return swarm;
  }

  async getSwarms(userId: number) {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const swarms = await db.all(
      "SELECT * FROM swarms WHERE user_id = ?",
      userId
    );
    return swarms;
  }

  async updateSwarm(swarmId: number, agentCount: number) {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const result = await db.run(
      "UPDATE swarms SET agent_count = ? WHERE id = ?",
      agentCount,
      swarmId
    );
    return result;
  }
}

