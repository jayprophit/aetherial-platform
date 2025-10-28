import { getDb } from "./db";
import { notifications } from "../drizzle/schema";
import { WebSocketManager } from "./websocket";

let wsManager: WebSocketManager;

export function initializeNotificationService(manager: WebSocketManager) {
  wsManager = manager;
}

export async function createNotification(userId: number, type: string, message: string, link?: string) {
  const db = await getDb();
  if (!db) return;

  const newNotification = {
    userId,
    type,
    message,
    link,
    isRead: false,
  };

  const [notification] = await db.insert(notifications).values(newNotification).returning();

  if (wsManager) {
    wsManager.sendNotification(userId, notification);
  }

  return notification;
}

export async function getNotifications(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(notifications).where({ userId }).orderBy({ column: "createdAt", direction: "desc" });
}

export async function markAsRead(notificationId: number) {
  const db = await getDb();
  if (!db) return;

  await db.update(notifications).set({ isRead: true }).where({ id: notificationId });
}

