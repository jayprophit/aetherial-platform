import { Router } from "express";
import { authenticate, requireAdmin } from "../middleware/auth";
import { db } from "../db";
import { auditLogs } from "../db/schema";
import { desc, like, and, ilike } from "drizzle-orm";

const router = Router();

// GET /api/audit - Get audit logs (admin only)
router.get("/", authenticate, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, search = "" } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const whereClauses = search
      ? and(
          ilike(auditLogs.action, `%${search}%`),
          ilike(auditLogs.userId, `%${search}%`),
          ilike(auditLogs.object, `%${search}%`)
        )
      : undefined;

    const logs = await db
      .select()
      .from(auditLogs)
      .where(whereClauses)
      .orderBy(desc(auditLogs.timestamp))
      .limit(Number(limit))
      .offset(offset);

    const total = await db.select({ count: auditLogs.id }).from(auditLogs).where(whereClauses);

    res.json({
      success: true,
      logs,
      total: total.length,
      page: Number(page),
      limit: Number(limit),
    });
  } catch (error) {
    console.error("Failed to fetch audit logs:", error);
    res.status(500).json({ success: false, message: "Failed to fetch audit logs" });
  }
});

export default router;
