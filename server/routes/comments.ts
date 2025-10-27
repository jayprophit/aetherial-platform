import { Router } from "express";
import type { Request, Response } from "express";
import { eq, desc, sql, and } from "drizzle-orm";
import { getDb } from "../db";
import { comments, users, likes, posts } from "../../drizzle/schema";

const router = Router();

// GET /api/comments?postId=:postId - Get comments for a post
router.get("/", async (req: Request, res: Response) => {
  try {
    const { postId, page = "1", limit = "20" } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    if (!postId) {
      return res.status(400).json({
        success: false,
        message: "postId is required",
      });
    }

    const postIdNum = parseInt(postId as string);
    if (isNaN(postIdNum)) {
      return res.status(400).json({
        success: false,
        message: "Invalid postId",
      });
    }

    const db = await getDb();
    if (!db) {
      return res.status(503).json({
        success: false,
        message: "Database not available",
      });
    }

    // Get comments with author info
    const commentResults = await db
      .select({
        id: comments.id,
        content: comments.content,
        likesCount: comments.likesCount,
        createdAt: comments.createdAt,
        updatedAt: comments.updatedAt,
        authorId: users.id,
        authorUsername: users.username,
        authorName: users.displayName,
        authorAvatar: users.avatar,
        authorIsVerified: users.isVerified,
      })
      .from(comments)
      .innerJoin(users, eq(comments.userId, users.id))
      .where(eq(comments.postId, postIdNum))
      .orderBy(desc(comments.createdAt))
      .limit(limitNum)
      .offset(offset);

    // Get total count
    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(comments)
      .where(eq(comments.postId, postIdNum));
    const total = Number(totalResult[0]?.count || 0);

    const commentsWithAuthor = commentResults.map((comment) => ({
      id: comment.id,
      content: comment.content,
      author: {
        id: comment.authorId,
        username: comment.authorUsername,
        name: comment.authorName,
        avatar: comment.authorAvatar,
        isVerified: comment.authorIsVerified,
      },
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      likes: comment.likesCount || 0,
      isLiked: false, // TODO: Check actual like status
    }));

    res.json({
      success: true,
      comments: commentsWithAuthor,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Error getting comments:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get comments",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// POST /api/comments - Create comment
router.post("/", async (req: Request, res: Response) => {
  try {
    const { postId, content } = req.body;

    if (!postId) {
      return res.status(400).json({
        success: false,
        message: "postId is required",
      });
    }

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Content is required",
      });
    }

    const postIdNum = parseInt(postId);
    if (isNaN(postIdNum)) {
      return res.status(400).json({
        success: false,
        message: "Invalid postId",
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

    // Verify post exists
    const postExists = await db
      .select()
      .from(posts)
      .where(eq(posts.id, postIdNum))
      .limit(1);

    if (postExists.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Create comment
    const result = await db.insert(comments).values({
      postId: postIdNum,
      userId: currentUserId,
      content: content.trim(),
      likesCount: 0,
    });

    // Increment comments count on post
    await db
      .update(posts)
      .set({ commentsCount: sql`${posts.commentsCount} + 1` })
      .where(eq(posts.id, postIdNum));

    // Get created comment with author info
    const commentId = Number(result[0].insertId);
    const createdComment = await db
      .select({
        id: comments.id,
        content: comments.content,
        likesCount: comments.likesCount,
        createdAt: comments.createdAt,
        authorId: users.id,
        authorUsername: users.username,
        authorName: users.displayName,
        authorAvatar: users.avatar,
      })
      .from(comments)
      .innerJoin(users, eq(comments.userId, users.id))
      .where(eq(comments.id, commentId))
      .limit(1);

    // TODO: Send notification to post author

    res.status(201).json({
      success: true,
      message: "Comment created successfully",
      comment: createdComment[0],
    });
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create comment",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// PUT /api/comments/:id - Update comment
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const commentId = parseInt(req.params.id);
    const { content } = req.body;

    if (isNaN(commentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid comment ID",
      });
    }

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Content is required",
      });
    }

    // TODO: Verify user owns this comment via JWT
    const currentUserId = 1; // Mock user ID

    const db = await getDb();
    if (!db) {
      return res.status(503).json({
        success: false,
        message: "Database not available",
      });
    }

    // Check if comment exists and belongs to user
    const existingComment = await db
      .select()
      .from(comments)
      .where(eq(comments.id, commentId))
      .limit(1);

    if (existingComment.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    if (existingComment[0].userId !== currentUserId) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to edit this comment",
      });
    }

    // Update comment
    await db
      .update(comments)
      .set({ content: content.trim() })
      .where(eq(comments.id, commentId));

    // Get updated comment
    const updatedComment = await db
      .select()
      .from(comments)
      .where(eq(comments.id, commentId))
      .limit(1);

    res.json({
      success: true,
      message: "Comment updated successfully",
      comment: updatedComment[0],
    });
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update comment",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// DELETE /api/comments/:id - Delete comment
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const commentId = parseInt(req.params.id);

    if (isNaN(commentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid comment ID",
      });
    }

    // TODO: Verify user owns this comment via JWT
    const currentUserId = 1; // Mock user ID

    const db = await getDb();
    if (!db) {
      return res.status(503).json({
        success: false,
        message: "Database not available",
      });
    }

    // Check if comment exists and belongs to user
    const existingComment = await db
      .select()
      .from(comments)
      .where(eq(comments.id, commentId))
      .limit(1);

    if (existingComment.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    if (existingComment[0].userId !== currentUserId) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to delete this comment",
      });
    }

    const postId = existingComment[0].postId;

    // Delete associated likes
    await db
      .delete(likes)
      .where(
        and(eq(likes.targetType, "comment"), eq(likes.targetId, commentId))
      );

    // Delete comment
    await db.delete(comments).where(eq(comments.id, commentId));

    // Decrement comments count on post
    await db
      .update(posts)
      .set({ commentsCount: sql`GREATEST(${posts.commentsCount} - 1, 0)` })
      .where(eq(posts.id, postId));

    res.json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete comment",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// POST /api/comments/:id/like - Like comment
router.post("/:id/like", async (req: Request, res: Response) => {
  try {
    const commentId = parseInt(req.params.id);

    if (isNaN(commentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid comment ID",
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

    // Check if already liked
    const existingLike = await db
      .select()
      .from(likes)
      .where(
        and(
          eq(likes.userId, currentUserId),
          eq(likes.targetType, "comment"),
          eq(likes.targetId, commentId)
        )
      )
      .limit(1);

    if (existingLike.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Comment already liked",
      });
    }

    // Create like
    await db.insert(likes).values({
      userId: currentUserId,
      targetType: "comment",
      targetId: commentId,
    });

    // Increment likes count
    await db
      .update(comments)
      .set({ likesCount: sql`${comments.likesCount} + 1` })
      .where(eq(comments.id, commentId));

    res.json({
      success: true,
      message: "Comment liked successfully",
    });
  } catch (error) {
    console.error("Error liking comment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to like comment",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// DELETE /api/comments/:id/like - Unlike comment
router.delete("/:id/like", async (req: Request, res: Response) => {
  try {
    const commentId = parseInt(req.params.id);

    if (isNaN(commentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid comment ID",
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

    // Delete like
    await db
      .delete(likes)
      .where(
        and(
          eq(likes.userId, currentUserId),
          eq(likes.targetType, "comment"),
          eq(likes.targetId, commentId)
        )
      );

    // Decrement likes count
    await db
      .update(comments)
      .set({ likesCount: sql`GREATEST(${comments.likesCount} - 1, 0)` })
      .where(eq(comments.id, commentId));

    res.json({
      success: true,
      message: "Comment unliked successfully",
    });
  } catch (error) {
    console.error("Error unliking comment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to unlike comment",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;

