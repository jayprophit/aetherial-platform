import { Router } from "express";
import type { Request, Response } from "express";
import { eq, like, or, desc, sql } from "drizzle-orm";
import { getDb } from "../db";
import { users, friendships, posts } from "../../drizzle/schema";
import { EncryptionService } from "../lib/encryption";

const router = Router();

// Helper function to get user stats
async function getUserStats(userId: number) {
  const db = await getDb();
  if (!db) return { posts: 0, friends: 0, followers: 0, following: 0 };

  try {
    // Count posts
    const postCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(posts)
      .where(eq(posts.userId, userId));

    // Count friends (accepted friendships)
    const friendCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(friendships)
      .where(
        sql`(${friendships.userId} = ${userId} OR ${friendships.friendId} = ${userId}) AND ${friendships.status} = 'accepted'`
      );

    return {
      posts: Number(postCount[0]?.count || 0),
      friends: Number(friendCount[0]?.count || 0),
      followers: Number(friendCount[0]?.count || 0),
      following: Number(friendCount[0]?.count || 0),
    };
  } catch (error) {
    console.error("Error getting user stats:", error);
    return { posts: 0, friends: 0, followers: 0, following: 0 };
  }
}

// GET /api/users/:id - Get user profile
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    
    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const db = await getDb();
    if (!db) {
      return res.status(503).json({
        success: false,
        message: "Database not available",
      });
    }

    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (userResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const user = userResult[0];
    const stats = await getUserStats(userId);

    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name || user.displayName,
        firstName: user.firstName,
        lastName: user.lastName,
        displayName: user.displayName,
        bio: user.bio ? EncryptionService.decrypt(user.bio) : null,
        avatar: user.avatar,
        coverPhoto: user.coverPhoto,
        walletAddress: user.walletAddress,
        aethBalance: user.aethBalance,
        isVerified: user.isVerified,
        joinedAt: user.createdAt,
        stats,
      },
    });
  } catch (error) {
    console.error("Error getting user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get user",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// PUT /api/users/:id - Update user profile
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    
    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    // TODO: Verify user owns this profile (JWT authentication)
    // For now, allowing updates without auth for development

    const {
      username,
      firstName,
      lastName,
      displayName,
      bio,
      avatar,
      coverPhoto,
    } = req.body;

    const db = await getDb();
    if (!db) {
      return res.status(503).json({
        success: false,
        message: "Database not available",
      });
    }

    // Build update object with only provided fields
    const updateData: any = {};
    if (username !== undefined) updateData.username = username;
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (displayName !== undefined) updateData.displayName = displayName;
    if (bio !== undefined) updateData.bio = EncryptionService.encrypt(bio);
    if (avatar !== undefined) updateData.avatar = avatar;
    if (coverPhoto !== undefined) updateData.coverPhoto = coverPhoto;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields to update",
      });
    }

    await db.update(users).set(updateData).where(eq(users.id, userId));

    // Fetch updated user
    const updatedUser = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser[0],
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// DELETE /api/users/:id - Delete user account
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    
    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    // TODO: Verify user owns this account (JWT authentication)
    // TODO: Implement cascade deletion of related data

    const db = await getDb();
    if (!db) {
      return res.status(503).json({
        success: false,
        message: "Database not available",
      });
    }

    await db.delete(users).where(eq(users.id, userId));

    res.json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete account",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// GET /api/users - Search/list users
router.get("/", async (req: Request, res: Response) => {
  try {
    const { q, page = "1", limit = "20" } = req.query;
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

    let query = db.select().from(users).where(eq(users.isActive, true));

    // Add search filter if query provided
    if (q && typeof q === "string") {
      query = query.where(
        or(
          like(users.username, `%${q}%`),
          like(users.displayName, `%${q}%`),
          like(users.firstName, `%${q}%`),
          like(users.lastName, `%${q}%`)
        )
      );
    }

    // Get total count
    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(eq(users.isActive, true));
    
    const total = Number(totalResult[0]?.count || 0);

    // Get paginated results
    const userResults = await query
      .orderBy(desc(users.createdAt))
      .limit(limitNum)
      .offset(offset);

    res.json({
      success: true,
      users: userResults.map((user) => ({
        id: user.id,
        username: user.username,
        name: user.displayName || user.name,
        avatar: user.avatar,
        bio: user.bio ? EncryptionService.decrypt(user.bio) : null,
        isVerified: user.isVerified,
      })),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({
      success: false,
      message: "Failed to search users",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// POST /api/users/:id/follow - Follow user
router.post("/:id/follow", async (req: Request, res: Response) => {
  try {
    const targetUserId = parseInt(req.params.id);
    
    if (isNaN(targetUserId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    // TODO: Get current user ID from JWT
    // For now, using a mock user ID
    const currentUserId = 1;

    if (currentUserId === targetUserId) {
      return res.status(400).json({
        success: false,
        message: "Cannot follow yourself",
      });
    }

    const db = await getDb();
    if (!db) {
      return res.status(503).json({
        success: false,
        message: "Database not available",
      });
    }

    // Check if friendship already exists
    const existing = await db
      .select()
      .from(friendships)
      .where(
        sql`(${friendships.userId} = ${currentUserId} AND ${friendships.friendId} = ${targetUserId}) OR (${friendships.userId} = ${targetUserId} AND ${friendships.friendId} = ${currentUserId})`
      )
      .limit(1);

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Friendship already exists",
      });
    }

    // Create friendship
    await db.insert(friendships).values({
      userId: currentUserId,
      friendId: targetUserId,
      status: "pending",
    });

    // TODO: Send notification to target user

    res.json({
      success: true,
      message: "Friend request sent successfully",
    });
  } catch (error) {
    console.error("Error following user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to follow user",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// DELETE /api/users/:id/follow - Unfollow user
router.delete("/:id/follow", async (req: Request, res: Response) => {
  try {
    const targetUserId = parseInt(req.params.id);
    
    if (isNaN(targetUserId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    // TODO: Get current user ID from JWT
    const currentUserId = 1;

    const db = await getDb();
    if (!db) {
      return res.status(503).json({
        success: false,
        message: "Database not available",
      });
    }

    await db
      .delete(friendships)
      .where(
        sql`(${friendships.userId} = ${currentUserId} AND ${friendships.friendId} = ${targetUserId}) OR (${friendships.userId} = ${targetUserId} AND ${friendships.friendId} = ${currentUserId})`
      );

    res.json({
      success: true,
      message: "User unfollowed successfully",
    });
  } catch (error) {
    console.error("Error unfollowing user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to unfollow user",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// GET /api/users/:id/followers - Get user followers
router.get("/:id/followers", async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    const { page = "1", limit = "20" } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const db = await getDb();
    if (!db) {
      return res.status(503).json({
        success: false,
        message: "Database not available",
      });
    }

    // Get followers (users who have this user as friendId)
    const followers = await db
      .select({
        id: users.id,
        username: users.username,
        name: users.displayName,
        avatar: users.avatar,
        bio: users.bio,
        isVerified: users.isVerified,
      })
      .from(friendships)
      .innerJoin(users, eq(friendships.userId, users.id))
      .where(
        sql`${friendships.friendId} = ${userId} AND ${friendships.status} = 'accepted'`
      )
      .limit(limitNum)
      .offset(offset);

    // Get total count
    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(friendships)
      .where(
        sql`${friendships.friendId} = ${userId} AND ${friendships.status} = 'accepted'`
      );
    
    const total = Number(totalResult[0]?.count || 0);

    res.json({
      success: true,
      followers,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Error getting followers:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get followers",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// GET /api/users/:id/following - Get users being followed
router.get("/:id/following", async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    const { page = "1", limit = "20" } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const db = await getDb();
    if (!db) {
      return res.status(503).json({
        success: false,
        message: "Database not available",
      });
    }

    // Get following (users who this user has as friendId)
    const following = await db
      .select({
        id: users.id,
        username: users.username,
        name: users.displayName,
        avatar: users.avatar,
        bio: users.bio,
        isVerified: users.isVerified,
      })
      .from(friendships)
      .innerJoin(users, eq(friendships.friendId, users.id))
      .where(
        sql`${friendships.userId} = ${userId} AND ${friendships.status} = 'accepted'`
      )
      .limit(limitNum)
      .offset(offset);

    // Get total count
    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(friendships)
      .where(
        sql`${friendships.userId} = ${userId} AND ${friendships.status} = 'accepted'`
      );
    
    const total = Number(totalResult[0]?.count || 0);

    res.json({
      success: true,
      following,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Error getting following:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get following",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;

