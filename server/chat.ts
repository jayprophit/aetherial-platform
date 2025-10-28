import { getDb } from "./db";
import { chat_messages } from "../drizzle/schema";
import { WebSocketManager } from "./websocket";

export async function sendMessage(wsManager: WebSocketManager, senderId: number, recipientId: number | null, channelId: number | null, message: string) {
  const db = await getDb();
  if (!db) return;

  await db.insert(chat_messages).values({
    senderId,
    recipientId,
    channelId,
    message,
    createdAt: new Date(),
  });

  if (recipientId) {
    wsManager.sendToUser(recipientId, { type: "new_message", senderId, message });
  } else if (channelId) {
    wsManager.broadcastToChannel(`chat-${channelId}`, { type: "new_message", senderId, message });
  }
}

