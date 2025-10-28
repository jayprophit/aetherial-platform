import { Router } from "express";
import { db } from "../db";
import { api_keys } from "../../db/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from 'uuid';

const router = Router();

router.post("/api-keys", async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const key = uuidv4();

  await db.insert(api_keys).values({
    userId,
    key,
    createdAt: new Date(),
  });

  res.status(201).json({ key });
});

router.get("/api-keys", async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const keys = await db.select().from(api_keys).where(eq(api_keys.userId, userId));
  res.json(keys);
});

router.delete("/api-keys/:id", async (req, res) => {
  const { id } = req.params;

  await db.delete(api_keys).where(eq(api_keys.id, id));

  res.status(204).send();
});

export default router;

