import { Router } from "express";
import type { Request, Response } from "express";
import { eq, desc, sql, and } from "drizzle-orm";
import { getDb } from "../db";
import { posts, users, likes, comments } from "../../drizzle/schema";

const router = Router();

// GET /api/posts - Get posts feed
router.get("/", async (req: Request, res: Response) => {
  try {
    const { page = "1", limit = "20", userId } = req.query;
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

    // Build query
    let query = db
      .select({
        id: posts.id,
        content: posts.content,
        media: posts.media,
        visibility: posts.visibility,
        likesCount: posts.likesCount,
        commentsCount: posts.commentsCount,
        sharesCount: posts.sharesCount,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        authorId: users.id,
        authorUsername: users.username,
        authorName: users.displayName,
        authorAvatar: users.avatar,
        authorIsVerified: users.isVerified,
      })
      .from(posts)
      .innerJoin(users, eq(posts.userId, users.id))
      .orderBy(desc(posts.createdAt));

    // Filter by userId if provided
    if (userId && typeof userId === "string") {
      const userIdNum = parseInt(userId);
      if (!isNaN(userIdNum)) {
        query = query.where(eq(posts.userId, userIdNum));
      }
    }

    // Get total count
    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(posts);
    const total = Number(totalResult[0]?.count || 0);

    // Get paginated results
    const postResults = await query.limit(limitNum).offset(offset);

    // TODO: Check if current user has liked each post
    const currentUserId = 1; // Mock user ID

    const postsWithLikes = postResults.map((post) => ({
      id: post.id,
      content: post.content,
      media: post.media,
      visibility: post.visibility,
      author: {
        id: post.authorId,
        username: post.authorUsername,
        name: post.authorName,
        avatar: post.authorAvatar,
        isVerified: post.authorIsVerified,
      },
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      likes: post.likesCount || 0,
      comments: post.commentsCount || 0,
      shares: post.sharesCount || 0,
      isLiked: false, // TODO: Check actual like status
    }));

    res.json({
      success: true,
      posts: postsWithLikes,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Error getting posts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get posts",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// POST /api/posts - Create new post
router.post("/", async (req: Request, res: Response) => {
  try {
    const { content, media, visibility = "public" } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Content is required",
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

    // Create post
    const result = await db.insert(posts).values({
      userId: currentUserId,
      content: content.trim(),
      media: media || null,
      visibility: visibility as "public" | "friends" | "private",
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
    });

    // Get the created post with author info
    const postId = Number(result[0].insertId);
    const createdPost = await db
      .select({
        id: posts.id,
        content: posts.content,
        media: posts.media,
        visibility: posts.visibility,
        likesCount: posts.likesCount,
        commentsCount: posts.commentsCount,
        sharesCount: posts.sharesCount,
        createdAt: posts.createdAt,
        authorId: users.id,
        authorUsername: users.username,
        authorName: users.displayName,
        authorAvatar: users.avatar,
      })
      .from(posts)
      .innerJoin(users, eq(posts.userId, users.id))
      .where(eq(posts.id, postId))
      .limit(1);

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: createdPost[0],
    });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create post",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// GET /api/posts/:id - Get single post
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.id);

    if (isNaN(postId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID",
      });
    }

    const db = await getDb();
    if (!db) {
      return res.status(503).json({
        success: false,
        message: "Database not available",
      });
    }

    const postResult = await db
      .select({
        id: posts.id,
        content: posts.content,
        media: posts.media,
        visibility: posts.visibility,
        likesCount: posts.likesCount,
        commentsCount: posts.commentsCount,
        sharesCount: posts.sharesCount,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        authorId: users.id,
        authorUsername: users.username,
        authorName: users.displayName,
        authorAvatar: users.avatar,
        authorIsVerified: users.isVerified,
      })
      .from(posts)
      .innerJoin(users, eq(posts.userId, users.id))
      .where(eq(posts.id, postId))
      .limit(1);

    if (postResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const post = postResult[0];

    res.json({
      success: true,
      post: {
        id: post.id,
        content: post.content,
        media: post.media,
        visibility: post.visibility,
        author: {
          id: post.authorId,
          username: post.authorUsername,
          name: post.authorName,
          avatar: post.authorAvatar,
          isVerified: post.authorIsVerified,
        },
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        likes: post.likesCount || 0,
        comments: post.commentsCount || 0,
        shares: post.sharesCount || 0,
      },
    });
  } catch (error) {
    console.error("Error getting post:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get post",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// PUT /api/posts/:id - Update post
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.id);
    const { content, media, visibility } = req.body;

    if (isNaN(postId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID",
      });
    }

    // TODO: Verify user owns this post via JWT
    const currentUserId = 1; // Mock user ID

    const db = await getDb();
    if (!db) {
      return res.status(503).json({
        success: false,
        message: "Database not available",
      });
    }

    // Check if post exists and belongs to user
    const existingPost = await db
      .select()
      .from(posts)
      .where(eq(posts.id, postId))
      .limit(1);

    if (existingPost.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (existingPost[0].userId !== currentUserId) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to edit this post",
      });
    }

    // Build update object
    const updateData: any = {};
    if (content !== undefined) updateData.content = content;
    if (media !== undefined) updateData.media = media;
    if (visibility !== undefined) updateData.visibility = visibility;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields to update",
      });
    }

    await db.update(posts).set(updateData).where(eq(posts.id, postId));

    // Get updated post
    const updatedPost = await db
      .select()
      .from(posts)
      .where(eq(posts.id, postId))
      .limit(1);

    res.json({
      success: true,
      message: "Post updated successfully",
      post: updatedPost[0],
    });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update post",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// DELETE /api/posts/:id - Delete post
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.id);

    if (isNaN(postId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID",
      });
    }

    // TODO: Verify user owns this post via JWT
    const currentUserId = 1; // Mock user ID

    const db = await getDb();
    if (!db) {
      return res.status(503).json({
        success: false,
        message: "Database not available",
      });
    }

    // Check if post exists and belongs to user
    const existingPost = await db
      .select()
      .from(posts)
      .where(eq(posts.id, postId))
      .limit(1);

    if (existingPost.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (existingPost[0].userId !== currentUserId) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to delete this post",
      });
    }

    // Delete associated likes and comments
    await db.delete(likes).where(
      and(eq(likes.targetType, "post"), eq(likes.targetId, postId))
    );
    await db.delete(comments).where(eq(comments.postId, postId));

    // Delete post
    await db.delete(posts).where(eq(posts.id, postId));

    res.json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete post",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// POST /api/posts/:id/like - Like post
router.post("/:id/like", async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.id);

    if (isNaN(postId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID",
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
          eq(likes.targetType, "post"),
          eq(likes.targetId, postId)
        )
      )
      .limit(1);

    if (existingLike.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Post already liked",
      });
    }

    // Create like
    await db.insert(likes).values({
      userId: currentUserId,
      targetType: "post",
      targetId: postId,
    });

    // Increment likes count
    await db
      .update(posts)
      .set({ likesCount: sql`${posts.likesCount} + 1` })
      .where(eq(posts.id, postId));

    // TODO: Send notification to post author

    res.json({
      success: true,
      message: "Post liked successfully",
    });
  } catch (error) {
    console.error("Error liking post:", error);
    res.status(500).json({
      success: false,
      message: "Failed to like post",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// DELETE /api/posts/:id/like - Unlike post
router.delete("/:id/like", async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.id);

    if (isNaN(postId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID",
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
    const result = await db
      .delete(likes)
      .where(
        and(
          eq(likes.userId, currentUserId),
          eq(likes.targetType, "post"),
          eq(likes.targetId, postId)
        )
      );

    // Decrement likes count
    await db
      .update(posts)
      .set({ likesCount: sql`GREATEST(${posts.likesCount} - 1, 0)` })
      .where(eq(posts.id, postId));

    res.json({
      success: true,
      message: "Post unliked successfully",
    });
  } catch (error) {
    console.error("Error unliking post:", error);
    res.status(500).json({
      success: false,
      message: "Failed to unlike post",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// POST /api/posts/:id/share - Share post
router.post("/:id/share", async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.id);
    const { comment } = req.body;

    if (isNaN(postId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID",
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

    // Get original post
    const originalPost = await db
      .select()
      .from(posts)
      .where(eq(posts.id, postId))
      .limit(1);

    if (originalPost.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Create share as a new post with reference
    const shareContent = comment
      ? `${comment}\n\n[Shared post: ${originalPost[0].content.substring(0, 100)}...]`
      : `[Shared post: ${originalPost[0].content.substring(0, 100)}...]`;

    await db.insert(posts).values({
      userId: currentUserId,
      content: shareContent,
      media: originalPost[0].media,
      visibility: "public",
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
    });

    // Increment shares count on original post
    await db
      .update(posts)
      .set({ sharesCount: sql`${posts.sharesCount} + 1` })
      .where(eq(posts.id, postId));

    // TODO: Send notification to original author

    res.json({
      success: true,
      message: "Post shared successfully",
    });
  } catch (error) {
    console.error("Error sharing post:", error);
    res.status(500).json({
      success: false,
      message: "Failed to share post",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;

