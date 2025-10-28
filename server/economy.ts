import { getDb } from "./db";
import { wallets, transactions } from "../drizzle/schema";
import { eq, sql } from "drizzle-orm";

export async function createWallet(userId: number) {
  const db = await getDb();
  if (!db) return;

  await db.insert(wallets).values({
    userId,
    balance: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

export async function getWallet(userId: number) {
  const db = await getDb();
  if (!db) return null;

  const walletResult = await db.select().from(wallets).where(eq(wallets.userId, userId));
  return walletResult[0];
}

export async function createTransaction(fromUserId: number | null, toUserId: number, amount: number, type: string, description: string) {
  const db = await getDb();
  if (!db) return;

  const fromWallet = fromUserId ? await getWallet(fromUserId) : null;
  const toWallet = await getWallet(toUserId);

  if (!toWallet) {
    // Handle case where recipient doesn't have a wallet
    return;
  }

  if (fromWallet) {
    if (fromWallet.balance < amount) {
      throw new Error("Insufficient funds");
    }
    await db.update(wallets).set({ balance: sql`${wallets.balance} - ${amount}` }).where(eq(wallets.id, fromWallet.id));
  }

  await db.update(wallets).set({ balance: sql`${wallets.balance} + ${amount}` }).where(eq(wallets.id, toWallet.id));

  await db.insert(transactions).values({
    fromWalletId: fromWallet ? fromWallet.id : null,
    toWalletId: toWallet.id,
    amount,
    type,
    description,
    createdAt: new Date(),
  });
}

