import { Router } from "express";
import { db } from "../db";
import { forum_posts, forum_replies } from "../../db/schema";
import { eq } from "drizzle-orm";

const router = Router();

router.post("/posts", async (req, res) => {
  const { userId, title, message } = req.body;

  if (!userId || !title || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  await db.insert(forum_posts).values({
    userId,
    title,
    message,
    createdAt: new Date(),
  });

  res.status(201).json({ message: "Post created successfully" });
});

router.post("/replies", async (req, res) => {
  const { postId, userId, message } = req.body;

  if (!postId || !userId || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  await db.insert(forum_replies).values({
    postId,
    userId,
    message,
    createdAt: new Date(),
  });

  res.status(201).json({ message: "Reply created successfully" });
});

router.get("/posts", async (req, res) => {
  const posts = await db.select().from(forum_posts);
  res.json(posts);
});

router.get("/posts/:id", async (req, res) => {
  const post = await db.select().from(forum_posts).where(eq(forum_posts.id, req.params.id));
  res.json(post);
});

router.get("/posts/:id/replies", async (req, res) => {
  const replies = await db.select().from(forum_replies).where(eq(forum_replies.postId, req.params.id));
  res.json(replies);
});

export default router;

