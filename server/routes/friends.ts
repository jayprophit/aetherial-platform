import { Router } from "express";
import type { Request, Response } from "express";
import { eq, or, and, sql } from "drizzle-orm";
import { getDb } from "../db";
import { friendships, users } from "../../drizzle/schema";

const router = Router();

// GET /api/friends - Get user's friends list
router.get("/", async (req: Request, res: Response) => {
  try {
    // TODO: Get current user ID from JWT
    const currentUserId = 1; // Mock user ID
    const { page = "1", limit = "20", status = "accepted" } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    const db = await getDb();
    if (!db) {
      return res.status(503).json({
        success: false,
        message: "Database not available",
      });
    }

    // Get friends where current user is either userId or friendId
    const friends = await db
      .select({
        friendshipId: friendships.id,
        userId: users.id,
        username: users.username,
        name: users.displayName,
        avatar: users.avatar,
        bio: users.bio,
        isVerified: users.isVerified,
        status: friendships.status,
        createdAt: friendships.createdAt,
        acceptedAt: friendships.acceptedAt,
      })
      .from(friendships)
      .innerJoin(
        users,
        sql\`\${users.id} = CASE 
          WHEN \${friendships.userId} = \${currentUserId} THEN \${friendships.friendId}
          ELSE \${friendships.userId}
        END\`
      )
      .where(
        and(
          or(
            eq(friendships.userId, currentUserId),
            eq(friendships.friendId, currentUserId)
          ),
          eq(friendships.status, status as "pending" | "accepted" | "blocked")
        )
      )
      .limit(limitNum)
      .offset(offset);

    // Get total count
    const totalResult = await db
      .select({ count: sql<number>\`count(*)\` })
      .from(friendships)
      .where(
        and(
          or(
            eq(friendships.userId, currentUserId),
            eq(friendships.friendId, currentUserId)
          ),
          eq(friendships.status, status as "pending" | "accepted" | "blocked")
        )
      );
    const total = Number(totalResult[0]?.count || 0);

    res.json({
      success: true,
      friends,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Error getting friends:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get friends",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// GET /api/friends/requests - Get friend requests
router.get("/requests", async (req: Request, res: Response) => {
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

    // Get pending requests where current user is the friendId (receiver)
    const requests = await db
      .select({
        requestId: friendships.id,
        userId: users.id,
        username: users.username,
        name: users.displayName,
        avatar: users.avatar,
        bio: users.bio,
        isVerified: users.isVerified,
        createdAt: friendships.createdAt,
      })
      .from(friendships)
      .innerJoin(users, eq(friendships.userId, users.id))
      .where(
        and(
          eq(friendships.friendId, currentUserId),
          eq(friendships.status, "pending")
        )
      );

    res.json({
      success: true,
      requests,
    });
  } catch (error) {
    console.error("Error getting friend requests:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get friend requests",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// POST /api/friends/requests/:id/accept - Accept friend request
router.post("/requests/:id/accept", async (req: Request, res: Response) => {
  try {
    const requestId = parseInt(req.params.id);

    if (isNaN(requestId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid request ID",
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

    // Verify request exists and is for current user
    const request = await db
      .select()
      .from(friendships)
      .where(eq(friendships.id, requestId))
      .limit(1);

    if (request.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Friend request not found",
      });
    }

    if (request[0].friendId !== currentUserId) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to accept this request",
      });
    }

    if (request[0].status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Request has already been processed",
      });
    }

    // Accept request
    await db
      .update(friendships)
      .set({
        status: "accepted",
        acceptedAt: new Date(),
      })
      .where(eq(friendships.id, requestId));

    // TODO: Send notification to requester

    res.json({
      success: true,
      message: "Friend request accepted",
    });
  } catch (error) {
    console.error("Error accepting friend request:", error);
    res.status(500).json({
      success: false,
      message: "Failed to accept friend request",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// POST /api/friends/requests/:id/decline - Decline friend request
router.post("/requests/:id/decline", async (req: Request, res: Response) => {
  try {
    const requestId = parseInt(req.params.id);

    if (isNaN(requestId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid request ID",
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

    // Verify request exists and is for current user
    const request = await db
      .select()
      .from(friendships)
      .where(eq(friendships.id, requestId))
      .limit(1);

    if (request.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Friend request not found",
      });
    }

    if (request[0].friendId !== currentUserId) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to decline this request",
      });
    }

    // Delete request
    await db.delete(friendships).where(eq(friendships.id, requestId));

    res.json({
      success: true,
      message: "Friend request declined",
    });
  } catch (error) {
    console.error("Error declining friend request:", error);
    res.status(500).json({
      success: false,
      message: "Failed to decline friend request",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// GET /api/friends/suggestions - Get friend suggestions
router.get("/suggestions", async (req: Request, res: Response) => {
  try {
    // TODO: Get current user ID from JWT
    const currentUserId = 1; // Mock user ID
    const { limit = "10" } = req.query;
    const limitNum = parseInt(limit as string);

    const db = await getDb();
    if (!db) {
      return res.status(503).json({
        success: false,
        message: "Database not available",
      });
    }

    // Get users who are not already friends
    const suggestions = await db
      .select({
        id: users.id,
        username: users.username,
        name: users.displayName,
        avatar: users.avatar,
        bio: users.bio,
        isVerified: users.isVerified,
      })
      .from(users)
      .where(
        and(
          sql\`\${users.id} != \${currentUserId}\`,
          sql\`\${users.id} NOT IN (
            SELECT CASE 
              WHEN \${friendships.userId} = \${currentUserId} THEN \${friendships.friendId}
              ELSE \${friendships.userId}
            END
            FROM \${friendships}
            WHERE (\${friendships.userId} = \${currentUserId} OR \${friendships.friendId} = \${currentUserId})
          )\`
        )
      )
      .limit(limitNum);

    res.json({
      success: true,
      suggestions,
    });
  } catch (error) {
    console.error("Error getting friend suggestions:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get friend suggestions",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
