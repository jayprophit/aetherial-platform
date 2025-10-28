import { Router } from "express";
import { getDb } from "../db";
import { listings, transactions, wallets } from "../../drizzle/schema";
import { eq, and, sql } from "drizzle-orm";
import { authenticateToken } from "../middleware/auth";

const router = Router();

// Get sales analytics
router.get("/analytics", authenticateToken, async (req, res) => {
  const db = await getDb();
  if (!db) return res.status(503).json({ message: "Database not available" });

  const sellerId = req.user!.userId;

  // Total revenue
  const revenueResult = await db.select({ total: sql<number>`sum(${transactions.amount})` }).from(transactions).innerJoin(wallets, eq(transactions.toWalletId, wallets.id)).where(and(eq(transactions.type, "purchase_listing"), eq(wallets.userId, sellerId)));
  const totalRevenue = Number(revenueResult[0].total) || 0;

  // Number of sales
  const salesCountResult = await db.select({ count: sql<number>`count(*)` }).from(listings).where(and(eq(listings.sellerId, sellerId), eq(listings.status, "sold")));
  const totalSales = Number(salesCountResult[0].count) || 0;

  // Top performing listings
  const topListings = await db.select().from(listings).where(eq(listings.sellerId, sellerId)).orderBy(sql`price DESC`).limit(5);

  res.json({ success: true, analytics: { totalRevenue, totalSales, topListings } });
});

// Get creator's listings
router.get("/listings", authenticateToken, async (req, res) => {
  const db = await getDb();
  if (!db) return res.status(503).json({ message: "Database not available" });

  const sellerId = req.user!.userId;

  const creatorListings = await db.select().from(listings).where(eq(listings.sellerId, sellerId));

  res.json({ success: true, listings: creatorListings });
});

export default router;

