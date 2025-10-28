import { getDb } from "./db";

export class BCIService {
  async registerDevice(userId: number, deviceId: string) {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const result = await db.run(
      "INSERT INTO bci_devices (user_id, device_id) VALUES (?, ?)",
      userId,
      deviceId
    );
    return result;
  }

  async getDevice(userId: number) {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const device = await db.get(
      "SELECT * FROM bci_devices WHERE user_id = ?",
      userId
    );
    return device;
  }

  async processBCIData(userId: number, data: any) {
    // This is a placeholder for the actual BCI data processing logic.
    // In a real-world application, this would involve complex signal processing and machine learning.
    console.log(`Processing BCI data for user ${userId}:`, data);
  }
}

