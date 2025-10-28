import { Router } from "express";
import { db } from "../db";
import { knowledge_base_articles } from "../../db/schema";
import { eq } from "drizzle-orm";

const router = Router();

router.post("/", async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  await db.insert(knowledge_base_articles).values({
    title,
    content,
    createdAt: new Date(),
  });

  res.status(201).json({ message: "Article created successfully" });
});

router.get("/", async (req, res) => {
  const articles = await db.select().from(knowledge_base_articles);
  res.json(articles);
});

router.get("/:id", async (req, res) => {
  const article = await db.select().from(knowledge_base_articles).where(eq(knowledge_base_articles.id, req.params.id));
  res.json(article);
});

export default router;

