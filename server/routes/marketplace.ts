import { Router } from "express";
import { getDb } from "../db";
import { categories, listings, reviews, users } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { authenticateToken } from "../middleware/auth";
import { createListing, purchaseListing } from "../marketplace";

const router = Router();

// Get all categories
router.get("/categories", async (req, res) => {
  const db = await getDb();
  if (!db) return res.status(503).json({ message: "Database not available" });

  const allCategories = await db.select().from(categories);
  res.json({ success: true, categories: allCategories });
});

// Get all listings
router.get("/listings", async (req, res) => {
  const db = await getDb();
  if (!db) return res.status(503).json({ message: "Database not available" });

  const allListings = await db.select().from(listings).where(eq(listings.status, "active"));
  res.json({ success: true, listings: allListings });
});

// Get a single listing
router.get("/listings/:id", async (req, res) => {
  const db = await getDb();
  if (!db) return res.status(503).json({ message: "Database not available" });

  const listingId = parseInt(req.params.id);
  const listingResult = await db.select().from(listings).where(eq(listings.id, listingId));
  const listing = listingResult[0];

  if (!listing) {
    return res.status(404).json({ message: "Listing not found" });
  }

  res.json({ success: true, listing });
});

// Create a new listing
router.post("/listings", authenticateToken, async (req, res) => {
  const sellerId = req.user!.userId;
  const { categoryId, title, description, price, media } = req.body;

  try {
    await createListing(sellerId, categoryId, title, description, price, media);
    res.json({ success: true, message: "Listing created successfully" });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

// Purchase a listing
router.post("/listings/:id/purchase", authenticateToken, async (req, res) => {
  const buyerId = req.user!.userId;
  const listingId = parseInt(req.params.id);

  try {
    await purchaseListing(buyerId, listingId);
    res.json({ success: true, message: "Listing purchased successfully" });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

export default router;

