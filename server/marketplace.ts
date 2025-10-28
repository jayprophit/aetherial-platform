import { getDb } from "./db";
import { categories, listings, reviews, users } from "../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { createTransaction } from "./economy";

export async function createListing(sellerId: number, categoryId: number, title: string, description: string, price: number, media: any) {
  const db = await getDb();
  if (!db) return;

  await db.insert(listings).values({
    sellerId,
    categoryId,
    title,
    description,
    price,
    media,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

export async function purchaseListing(buyerId: number, listingId: number) {
  const db = await getDb();
  if (!db) return;

  const listingResult = await db.select().from(listings).where(eq(listings.id, listingId));
  const listing = listingResult[0];

  if (!listing) {
    throw new Error("Listing not found");
  }

  if (listing.status !== "active") {
    throw new Error("Listing is not active");
  }

  await createTransaction(buyerId, listing.sellerId, listing.price, "purchase_listing", `Purchased listing: ${listing.title}`);

  await db.update(listings).set({ status: "sold" }).where(eq(listings.id, listingId));
}

