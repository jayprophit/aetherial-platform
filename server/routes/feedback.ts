import { Router } from "express";
import { db } from "../db";
import { feedback } from "../../db/schema";
import { eq } from "drizzle-orm";

const router = Router();

router.post("/", async (req, res) => {
  const { userId, type, message } = req.body;

  if (!userId || !type || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  await db.insert(feedback).values({
    userId,
    type,
    message,
    createdAt: new Date(),
  });

  res.status(201).json({ message: "Feedback submitted successfully" });
});

export default router;

