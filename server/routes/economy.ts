import { Router } from "express";
import { getDb } from "../db";
import { wallets, transactions } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { authenticateToken } from "../middleware/auth";
import { getWallet, createTransaction } from "../economy";

const router = Router();

// Get user's wallet
router.get("/wallet", authenticateToken, async (req, res) => {
  const db = await getDb();
  if (!db) return res.status(503).json({ message: "Database not available" });

  const userId = req.user!.userId;
  const wallet = await getWallet(userId);

  if (!wallet) {
    return res.status(404).json({ message: "Wallet not found" });
  }

  res.json({ success: true, wallet });
});

// Get user's transactions
router.get("/transactions", authenticateToken, async (req, res) => {
  const db = await getDb();
  if (!db) return res.status(503).json({ message: "Database not available" });

  const userId = req.user!.userId;
  const wallet = await getWallet(userId);

  if (!wallet) {
    return res.status(404).json({ message: "Wallet not found" });
  }

  const userTransactions = await db.select().from(transactions).where(eq(transactions.toWalletId, wallet.id));

  res.json({ success: true, transactions: userTransactions });
});

// Tip a user
router.post("/tip", authenticateToken, async (req, res) => {
  const db = await getDb();
  if (!db) return res.status(503).json({ message: "Database not available" });

  const fromUserId = req.user!.userId;
  const { toUserId, amount, description } = req.body;

  try {
    await createTransaction(fromUserId, toUserId, amount, "tip", description);
    res.json({ success: true, message: "Tip sent successfully" });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

export default router;

