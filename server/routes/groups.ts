import { Router } from "express";
import type { Request, Response } from "express";
import { eq, like, and, or, desc, sql } from "drizzle-orm";
import { getDb } from "../db";
import { groups, groupMembers, users, posts } from "../../drizzle/schema";

const router = Router();

// GET /api/groups - Get groups list with filtering
router.get("/", async (req: Request, res: Response) => {
  try {
    const {
      q,
      category,
      privacy,
      page = "1",
      limit = "20",
    } = req.query;
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

    // Build where conditions
    const conditions = [];

    if (q && typeof q === "string") {
      conditions.push(
        or(
          like(groups.name, `%${q}%`),
          like(groups.description, `%${q}%`)
        )!
      );
    }

    if (category && typeof category === "string") {
      conditions.push(eq(groups.category, category));
    }

    if (privacy && typeof privacy === "string") {
      conditions.push(eq(groups.privacy, privacy as "public" | "private"));
    }

    // Get groups
    const groupResults = await db
      .select({
        id: groups.id,
        name: groups.name,
        description: groups.description,
        avatar: groups.avatar,
        coverImage: groups.coverImage,
        category: groups.category,
        privacy: groups.privacy,
        membersCount: groups.membersCount,
        createdAt: groups.createdAt,
      })
      .from(groups)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(groups.membersCount))
      .limit(limitNum)
      .offset(offset);

    // Get total count
    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(groups)
      .where(conditions.length > 0 ? and(...conditions) : undefined);
    const total = Number(totalResult[0]?.count || 0);

    res.json({
      success: true,
      groups: groupResults,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Error getting groups:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get groups",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// GET /api/groups/:id - Get single group
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const groupId = parseInt(req.params.id);

    if (isNaN(groupId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid group ID",
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

    const groupResult = await db
      .select()
      .from(groups)
      .where(eq(groups.id, groupId))
      .limit(1);

    if (groupResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    const group = groupResult[0];

    // Check if user is member
    const membership = await db
      .select()
      .from(groupMembers)
      .where(
        and(eq(groupMembers.groupId, groupId), eq(groupMembers.userId, currentUserId))
      )
      .limit(1);

    const isMember = membership.length > 0;
    const role = membership.length > 0 ? membership[0].role : null;

    res.json({
      success: true,
      group: {
        ...group,
        isMember,
        role,
      },
    });
  } catch (error) {
    console.error("Error getting group:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get group",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// POST /api/groups - Create new group
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, description, avatar, coverImage, category, privacy = "public" } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
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

    const result = await db.insert(groups).values({
      name,
      description: description || null,
      avatar: avatar || null,
      coverImage: coverImage || null,
      category: category || null,
      privacy,
      membersCount: 1, // Creator is first member
    });

    const groupId = Number(result[0].insertId);

    // Add creator as admin
    await db.insert(groupMembers).values({
      groupId,
      userId: currentUserId,
      role: "admin",
    });

    res.status(201).json({
      success: true,
      message: "Group created successfully",
      groupId,
    });
  } catch (error) {
    console.error("Error creating group:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create group",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// PUT /api/groups/:id - Update group
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const groupId = parseInt(req.params.id);
    const { name, description, avatar, coverImage, category, privacy } = req.body;

    if (isNaN(groupId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid group ID",
      });
    }

    // TODO: Verify user is admin via JWT
    const currentUserId = 1; // Mock user ID

    const db = await getDb();
    if (!db) {
      return res.status(503).json({
        success: false,
        message: "Database not available",
      });
    }

    // Check if group exists
    const existingGroup = await db
      .select()
      .from(groups)
      .where(eq(groups.id, groupId))
      .limit(1);

    if (existingGroup.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    // Verify user is admin
    const membership = await db
      .select()
      .from(groupMembers)
      .where(
        and(
          eq(groupMembers.groupId, groupId),
          eq(groupMembers.userId, currentUserId),
          eq(groupMembers.role, "admin")
        )
      )
      .limit(1);

    if (membership.length === 0) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to edit this group",
      });
    }

    // Build update object
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (avatar !== undefined) updateData.avatar = avatar;
    if (coverImage !== undefined) updateData.coverImage = coverImage;
    if (category !== undefined) updateData.category = category;
    if (privacy !== undefined) updateData.privacy = privacy;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields to update",
      });
    }

    await db.update(groups).set(updateData).where(eq(groups.id, groupId));

    res.json({
      success: true,
      message: "Group updated successfully",
    });
  } catch (error) {
    console.error("Error updating group:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update group",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// DELETE /api/groups/:id - Delete group
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const groupId = parseInt(req.params.id);

    if (isNaN(groupId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid group ID",
      });
    }

    // TODO: Verify user is admin via JWT
    const currentUserId = 1; // Mock user ID

    const db = await getDb();
    if (!db) {
      return res.status(503).json({
        success: false,
        message: "Database not available",
      });
    }

    // Verify user is admin
    const membership = await db
      .select()
      .from(groupMembers)
      .where(
        and(
          eq(groupMembers.groupId, groupId),
          eq(groupMembers.userId, currentUserId),
          eq(groupMembers.role, "admin")
        )
      )
      .limit(1);

    if (membership.length === 0) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to delete this group",
      });
    }

    // Delete group (cascade will delete members and posts)
    await db.delete(groups).where(eq(groups.id, groupId));

    res.json({
      success: true,
      message: "Group deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting group:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete group",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// POST /api/groups/:id/join - Join group
router.post("/:id/join", async (req: Request, res: Response) => {
  try {
    const groupId = parseInt(req.params.id);

    if (isNaN(groupId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid group ID",
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

    // Check if group exists
    const group = await db
      .select()
      .from(groups)
      .where(eq(groups.id, groupId))
      .limit(1);

    if (group.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    // Check if already member
    const existing = await db
      .select()
      .from(groupMembers)
      .where(
        and(eq(groupMembers.groupId, groupId), eq(groupMembers.userId, currentUserId))
      )
      .limit(1);

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Already a member of this group",
      });
    }

    // Add member
    await db.insert(groupMembers).values({
      groupId,
      userId: currentUserId,
      role: "member",
    });

    // Update group members count
    await db
      .update(groups)
      .set({
        membersCount: sql`${groups.membersCount} + 1`,
      })
      .where(eq(groups.id, groupId));

    res.status(201).json({
      success: true,
      message: "Joined group successfully",
    });
  } catch (error) {
    console.error("Error joining group:", error);
    res.status(500).json({
      success: false,
      message: "Failed to join group",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// POST /api/groups/:id/leave - Leave group
router.post("/:id/leave", async (req: Request, res: Response) => {
  try {
    const groupId = parseInt(req.params.id);

    if (isNaN(groupId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid group ID",
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

    // Check if member
    const membership = await db
      .select()
      .from(groupMembers)
      .where(
        and(eq(groupMembers.groupId, groupId), eq(groupMembers.userId, currentUserId))
      )
      .limit(1);

    if (membership.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Not a member of this group",
      });
    }

    // Remove member
    await db
      .delete(groupMembers)
      .where(
        and(eq(groupMembers.groupId, groupId), eq(groupMembers.userId, currentUserId))
      );

    // Update group members count
    await db
      .update(groups)
      .set({
        membersCount: sql`${groups.membersCount} - 1`,
      })
      .where(eq(groups.id, groupId));

    res.json({
      success: true,
      message: "Left group successfully",
    });
  } catch (error) {
    console.error("Error leaving group:", error);
    res.status(500).json({
      success: false,
      message: "Failed to leave group",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// GET /api/groups/:id/members - Get group members
router.get("/:id/members", async (req: Request, res: Response) => {
  try {
    const groupId = parseInt(req.params.id);
    const { page = "1", limit = "50" } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    if (isNaN(groupId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid group ID",
      });
    }

    const db = await getDb();
    if (!db) {
      return res.status(503).json({
        success: false,
        message: "Database not available",
      });
    }

    // Get members with user info
    const members = await db
      .select({
        userId: users.id,
        userName: users.displayName,
        userAvatar: users.avatar,
        userBio: users.bio,
        userIsVerified: users.isVerified,
        role: groupMembers.role,
        joinedAt: groupMembers.joinedAt,
      })
      .from(groupMembers)
      .innerJoin(users, eq(groupMembers.userId, users.id))
      .where(eq(groupMembers.groupId, groupId))
      .orderBy(desc(groupMembers.joinedAt))
      .limit(limitNum)
      .offset(offset);

    // Get total count
    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(groupMembers)
      .where(eq(groupMembers.groupId, groupId));
    const total = Number(totalResult[0]?.count || 0);

    res.json({
      success: true,
      members,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Error getting group members:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get group members",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;

