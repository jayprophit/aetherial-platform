import { Router } from "express";
import { db } from "../db";
import { bug_reports } from "../../db/schema";
import { eq } from "drizzle-orm";

const router = Router();

router.post("/", async (req, res) => {
  const { userId, title, description } = req.body;

  if (!userId || !title || !description) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  await db.insert(bug_reports).values({
    userId,
    title,
    description,
    status: "open",
    createdAt: new Date(),
  });

  res.status(201).json({ message: "Bug report submitted successfully" });
});

router.get("/", async (req, res) => {
  const reports = await db.select().from(bug_reports);
  res.json(reports);
});

router.get("/:id", async (req, res) => {
  const report = await db.select().from(bug_reports).where(eq(bug_reports.id, parseInt(req.params.id)));
  res.json(report);
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  await db.update(bug_reports).set({ status }).where(eq(bug_reports.id, parseInt(id)));

  res.status(200).json({ message: "Bug report updated successfully" });
});

export default router;

