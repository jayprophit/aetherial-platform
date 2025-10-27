import { Router } from "express";
import type { Request, Response } from "express";
import { eq, or, and, desc, sql } from "drizzle-orm";
import { getDb } from "../db";
import { messages, users } from "../../drizzle/schema";

const router = Router();

// GET /api/messages - Get user's conversations
router.get("/", async (req: Request, res: Response) => {
  try {
    // TODO: Get current user ID from JWT
    const currentUserId = 1; // Mock user ID

    const db = await getDb();
    if (!db) {
      return res.status(503).json({
        success: false,
        message: "Database not available",
      });
    }

    // Get latest message from each conversation
    const conversations = await db
      .select({
        id: messages.id,
        content: messages.content,
        media: messages.media,
        isRead: messages.isRead,
        createdAt: messages.createdAt,
        senderId: messages.senderId,
        receiverId: messages.receiverId,
        otherUserId: sql<number>`CASE 
          WHEN ${messages.senderId} = ${currentUserId} THEN ${messages.receiverId}
          ELSE ${messages.senderId}
        END`,
      })
      .from(messages)
      .where(
        and(
          or(
            eq(messages.senderId, currentUserId),
            eq(messages.receiverId, currentUserId)
          ),
          sql`${messages.groupId} IS NULL` // Direct messages only
        )
      )
      .orderBy(desc(messages.createdAt))
      .limit(100);

    // Group by conversation partner and get latest message
    const conversationMap = new Map();
    for (const msg of conversations) {
      const otherUserId = msg.otherUserId;
      if (!conversationMap.has(otherUserId)) {
        conversationMap.set(otherUserId, msg);
      }
    }

    // Get user info for each conversation
    const otherUserIds = Array.from(conversationMap.keys());
    if (otherUserIds.length === 0) {
      return res.json({
        success: true,
        conversations: [],
      });
    }

    const otherUsers = await db
      .select({
        id: users.id,
        name: users.displayName,
        avatar: users.avatar,
        isVerified: users.isVerified,
      })
      .from(users)
      .where(sql`${users.id} IN (${sql.join(otherUserIds, sql`, `)})`);

    const userMap = new Map(otherUsers.map(u => [u.id, u]));

    const conversationsWithUsers = Array.from(conversationMap.entries()).map(([userId, msg]) => {
      const user = userMap.get(userId);
      return {
        user: user || { id: userId, name: "Unknown User", avatar: null, isVerified: false },
        lastMessage: {
          id: msg.id,
          content: msg.content,
          media: msg.media,
          isRead: msg.isRead,
          isSentByMe: msg.senderId === currentUserId,
          createdAt: msg.createdAt,
        },
      };
    });

    res.json({
      success: true,
      conversations: conversationsWithUsers,
    });
  } catch (error) {
    console.error("Error getting conversations:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get conversations",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// GET /api/messages/:userId - Get messages with specific user
router.get("/:userId", async (req: Request, res: Response) => {
  try {
    const otherUserId = parseInt(req.params.userId);
    const { page = "1", limit = "50" } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    if (isNaN(otherUserId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    // TODO: Get current user ID from JWT
    const currentUserId = 1; // Mock user ID

    const db = await getDb();
    if (!db) {
      return res.status(503).json({
        success: false,
        message: "Database not available",
      });
    }

    // Get messages between current user and other user
    const msgs = await db
      .select({
        id: messages.id,
        senderId: messages.senderId,
        receiverId: messages.receiverId,
        content: messages.content,
        media: messages.media,
        isRead: messages.isRead,
        createdAt: messages.createdAt,
      })
      .from(messages)
      .where(
        and(
          or(
            and(eq(messages.senderId, currentUserId), eq(messages.receiverId, otherUserId)),
            and(eq(messages.senderId, otherUserId), eq(messages.receiverId, currentUserId))
          ),
          sql`${messages.groupId} IS NULL`
        )
      )
      .orderBy(desc(messages.createdAt))
      .limit(limitNum)
      .offset(offset);

    // Mark unread messages as read
    await db
      .update(messages)
      .set({ isRead: true })
      .where(
        and(
          eq(messages.senderId, otherUserId),
          eq(messages.receiverId, currentUserId),
          eq(messages.isRead, false)
        )
      );

    // Get total count
    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(messages)
      .where(
        and(
          or(
            and(eq(messages.senderId, currentUserId), eq(messages.receiverId, otherUserId)),
            and(eq(messages.senderId, otherUserId), eq(messages.receiverId, currentUserId))
          ),
          sql`${messages.groupId} IS NULL`
        )
      );
    const total = Number(totalResult[0]?.count || 0);

    const messagesFormatted = msgs.map((msg) => ({
      id: msg.id,
      content: msg.content,
      media: msg.media,
      isRead: msg.isRead,
      isSentByMe: msg.senderId === currentUserId,
      createdAt: msg.createdAt,
    }));

    res.json({
      success: true,
      messages: messagesFormatted.reverse(), // Oldest first for chat display
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Error getting messages:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get messages",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// POST /api/messages - Send message
router.post("/", async (req: Request, res: Response) => {
  try {
    const { receiverId, groupId, content, media } = req.body;

    if (!content || content.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Content is required",
      });
    }

    if (!receiverId && !groupId) {
      return res.status(400).json({
        success: false,
        message: "Either receiverId or groupId is required",
      });
    }

    // TODO: Get current user ID from JWT
    const currentUserId = 1; // Mock user ID

    const db = await getDb();
    if (!db) {
      return res.status(503).json({
        success: false,
        message: "Database not available",
      });
    }

    // If sending to user, verify user exists
    if (receiverId) {
      const receiver = await db
        .select()
        .from(users)
        .where(eq(users.id, receiverId))
        .limit(1);

      if (receiver.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Receiver not found",
        });
      }
    }

    const result = await db.insert(messages).values({
      senderId: currentUserId,
      receiverId: receiverId || null,
      groupId: groupId || null,
      content,
      media: media || null,
      isRead: false,
    });

    const messageId = Number(result[0].insertId);

    // TODO: Send real-time notification via WebSocket

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      messageId,
    });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send message",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// DELETE /api/messages/:id - Delete message
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const messageId = parseInt(req.params.id);

    if (isNaN(messageId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid message ID",
      });
    }

    // TODO: Get current user ID from JWT
    const currentUserId = 1; // Mock user ID

    const db = await getDb();
    if (!db) {
      return res.status(503).json({
        success: false,
        message: "Database not available",
      });
    }

    // Verify message exists and belongs to user
    const msg = await db
      .select()
      .from(messages)
      .where(eq(messages.id, messageId))
      .limit(1);

    if (msg.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    if (msg[0].senderId !== currentUserId) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to delete this message",
      });
    }

    await db.delete(messages).where(eq(messages.id, messageId));

    res.json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete message",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// PUT /api/messages/read - Mark messages as read
router.put("/read", async (req: Request, res: Response) => {
  try {
    const { senderId } = req.body;

    if (!senderId) {
      return res.status(400).json({
        success: false,
        message: "Sender ID is required",
      });
    }

    // TODO: Get current user ID from JWT
    const currentUserId = 1; // Mock user ID

    const db = await getDb();
    if (!db) {
      return res.status(503).json({
        success: false,
        message: "Database not available",
      });
    }

    await db
      .update(messages)
      .set({ isRead: true })
      .where(
        and(
          eq(messages.senderId, senderId),
          eq(messages.receiverId, currentUserId),
          eq(messages.isRead, false)
        )
      );

    res.json({
      success: true,
      message: "Messages marked as read",
    });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    res.status(500).json({
      success: false,
      message: "Failed to mark messages as read",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;

