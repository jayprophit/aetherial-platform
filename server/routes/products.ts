import { Router } from "express";
import type { Request, Response } from "express";
import { eq, like, and, or, gte, lte, desc, asc, sql } from "drizzle-orm";
import { getDb } from "../db";
import { products, users, reviews } from "../../drizzle/schema";

const router = Router();

// GET /api/products - Get products list with filtering and search
router.get("/", async (req: Request, res: Response) => {
  try {
    const {
      q,
      category,
      minPrice,
      maxPrice,
      sort = "newest",
      page = "1",
      limit = "20",
    } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    const db = await getDb();
    if (!db) {
      return res.status(503).json({
        success: false,
        message: "Database not available",
      });
    }

    // Build where conditions
    const conditions = [eq(products.isActive, true)];

    if (q && typeof q === "string") {
      conditions.push(
        or(
          like(products.title, `%${q}%`),
          like(products.description, `%${q}%`)
        )!
      );
    }

    if (category && typeof category === "string") {
      conditions.push(eq(products.category, category));
    }

    if (minPrice && typeof minPrice === "string") {
      const minPriceNum = parseFloat(minPrice);
      if (!isNaN(minPriceNum)) {
        conditions.push(gte(products.price, minPriceNum.toString()));
      }
    }

    if (maxPrice && typeof maxPrice === "string") {
      const maxPriceNum = parseFloat(maxPrice);
      if (!isNaN(maxPriceNum)) {
        conditions.push(lte(products.price, maxPriceNum.toString()));
      }
    }

    // Build order by clause
    let orderByClause;
    switch (sort) {
      case "price-low":
        orderByClause = asc(products.price);
        break;
      case "price-high":
        orderByClause = desc(products.price);
        break;
      case "popular":
        orderByClause = desc(products.salesCount);
        break;
      case "rating":
        orderByClause = desc(products.rating);
        break;
      default: // newest
        orderByClause = desc(products.createdAt);
    }

    // Get products with seller info
    const productResults = await db
      .select({
        id: products.id,
        title: products.title,
        description: products.description,
        price: products.price,
        currency: products.currency,
        images: products.images,
        category: products.category,
        stock: products.stock,
        salesCount: products.salesCount,
        rating: products.rating,
        reviewsCount: products.reviewsCount,
        createdAt: products.createdAt,
        sellerId: users.id,
        sellerName: users.displayName,
        sellerAvatar: users.avatar,
        sellerIsVerified: users.isVerified,
      })
      .from(products)
      .innerJoin(users, eq(products.sellerId, users.id))
      .where(and(...conditions))
      .orderBy(orderByClause)
      .limit(limitNum)
      .offset(offset);

    // Get total count
    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(products)
      .where(and(...conditions));
    const total = Number(totalResult[0]?.count || 0);

    const productsWithSeller = productResults.map((product) => ({
      id: product.id,
      title: product.title,
      description: product.description,
      price: parseFloat(product.price),
      currency: product.currency,
      images: product.images,
      category: product.category,
      stock: product.stock,
      salesCount: product.salesCount,
      rating: product.rating ? parseFloat(product.rating) : 0,
      reviewsCount: product.reviewsCount,
      seller: {
        id: product.sellerId,
        name: product.sellerName,
        avatar: product.sellerAvatar,
        isVerified: product.sellerIsVerified,
      },
      createdAt: product.createdAt,
    }));

    res.json({
      success: true,
      products: productsWithSeller,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Error getting products:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get products",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// GET /api/products/:id - Get single product
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const productId = parseInt(req.params.id);

    if (isNaN(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const db = await getDb();
    if (!db) {
      return res.status(503).json({
        success: false,
        message: "Database not available",
      });
    }

    const productResult = await db
      .select({
        id: products.id,
        title: products.title,
        description: products.description,
        price: products.price,
        currency: products.currency,
        images: products.images,
        category: products.category,
        stock: products.stock,
        salesCount: products.salesCount,
        rating: products.rating,
        reviewsCount: products.reviewsCount,
        isActive: products.isActive,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
        sellerId: users.id,
        sellerName: users.displayName,
        sellerAvatar: users.avatar,
        sellerIsVerified: users.isVerified,
      })
      .from(products)
      .innerJoin(users, eq(products.sellerId, users.id))
      .where(eq(products.id, productId))
      .limit(1);

    if (productResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const product = productResult[0];

    res.json({
      success: true,
      product: {
        id: product.id,
        title: product.title,
        description: product.description,
        price: parseFloat(product.price),
        currency: product.currency,
        images: product.images,
        category: product.category,
        stock: product.stock,
        salesCount: product.salesCount,
        rating: product.rating ? parseFloat(product.rating) : 0,
        reviewsCount: product.reviewsCount,
        isActive: product.isActive,
        seller: {
          id: product.sellerId,
          name: product.sellerName,
          avatar: product.sellerAvatar,
          isVerified: product.sellerIsVerified,
        },
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error getting product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get product",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// POST /api/products - Create new product
router.post("/", async (req: Request, res: Response) => {
  try {
    const { title, description, price, currency = "AETH", images, category, stock } = req.body;

    if (!title || !price) {
      return res.status(400).json({
        success: false,
        message: "Title and price are required",
      });
    }

    // TODO: Get current user ID from JWT
    const currentUserId = 1; // Mock user ID

    const db = await getDb();
    if (!db) {
      return res.status(503).json({
        success: false,
        message: "Database not available",
      });
    }

    const result = await db.insert(products).values({
      sellerId: currentUserId,
      title,
      description: description || null,
      price: price.toString(),
      currency,
      images: images || null,
      category: category || null,
      stock: stock || 0,
      salesCount: 0,
      rating: "0",
      reviewsCount: 0,
      isActive: true,
    });

    const productId = Number(result[0].insertId);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      productId,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create product",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// PUT /api/products/:id - Update product
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const productId = parseInt(req.params.id);
    const { title, description, price, images, category, stock, isActive } = req.body;

    if (isNaN(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    // TODO: Verify user owns this product via JWT
    const currentUserId = 1; // Mock user ID

    const db = await getDb();
    if (!db) {
      return res.status(503).json({
        success: false,
        message: "Database not available",
      });
    }

    // Check if product exists and belongs to user
    const existingProduct = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

    if (existingProduct.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (existingProduct[0].sellerId !== currentUserId) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to edit this product",
      });
    }

    // Build update object
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price.toString();
    if (images !== undefined) updateData.images = images;
    if (category !== undefined) updateData.category = category;
    if (stock !== undefined) updateData.stock = stock;
    if (isActive !== undefined) updateData.isActive = isActive;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields to update",
      });
    }

    await db.update(products).set(updateData).where(eq(products.id, productId));

    res.json({
      success: true,
      message: "Product updated successfully",
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// DELETE /api/products/:id - Delete product
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const productId = parseInt(req.params.id);

    if (isNaN(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    // TODO: Verify user owns this product via JWT
    const currentUserId = 1; // Mock user ID

    const db = await getDb();
    if (!db) {
      return res.status(503).json({
        success: false,
        message: "Database not available",
      });
    }

    // Check if product exists and belongs to user
    const existingProduct = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

    if (existingProduct.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (existingProduct[0].sellerId !== currentUserId) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to delete this product",
      });
    }

    // Soft delete by setting isActive to false
    await db
      .update(products)
      .set({ isActive: false })
      .where(eq(products.id, productId));

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// GET /api/products/:id/reviews - Get product reviews
router.get("/:id/reviews", async (req: Request, res: Response) => {
  try {
    const productId = parseInt(req.params.id);
    const { page = "1", limit = "20" } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    if (isNaN(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const db = await getDb();
    if (!db) {
      return res.status(503).json({
        success: false,
        message: "Database not available",
      });
    }

    const reviewResults = await db
      .select({
        id: reviews.id,
        rating: reviews.rating,
        comment: reviews.comment,
        createdAt: reviews.createdAt,
        userId: users.id,
        userName: users.displayName,
        userAvatar: users.avatar,
      })
      .from(reviews)
      .innerJoin(users, eq(reviews.userId, users.id))
      .where(
        and(eq(reviews.targetType, "product"), eq(reviews.targetId, productId))
      )
      .orderBy(desc(reviews.createdAt))
      .limit(limitNum)
      .offset(offset);

    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(reviews)
      .where(
        and(eq(reviews.targetType, "product"), eq(reviews.targetId, productId))
      );
    const total = Number(totalResult[0]?.count || 0);

    res.json({
      success: true,
      reviews: reviewResults,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Error getting product reviews:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get product reviews",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// POST /api/products/:id/reviews - Add product review
router.post("/:id/reviews", async (req: Request, res: Response) => {
  try {
    const productId = parseInt(req.params.id);
    const { rating, comment } = req.body;

    if (isNaN(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    // TODO: Get current user ID from JWT
    const currentUserId = 1; // Mock user ID

    const db = await getDb();
    if (!db) {
      return res.status(503).json({
        success: false,
        message: "Database not available",
      });
    }

    // Check if user already reviewed this product
    const existingReview = await db
      .select()
      .from(reviews)
      .where(
        and(
          eq(reviews.userId, currentUserId),
          eq(reviews.targetType, "product"),
          eq(reviews.targetId, productId)
        )
      )
      .limit(1);

    if (existingReview.length > 0) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product",
      });
    }

    // Create review
    await db.insert(reviews).values({
      userId: currentUserId,
      targetType: "product",
      targetId: productId,
      rating,
      comment: comment || null,
    });

    // Update product rating and review count
    await db
      .update(products)
      .set({
        reviewsCount: sql`${products.reviewsCount} + 1`,
        // Recalculate average rating
        rating: sql`(
          SELECT AVG(rating)
          FROM ${reviews}
          WHERE target_type = 'product' AND target_id = ${productId}
        )`,
      })
      .where(eq(products.id, productId));

    res.status(201).json({
      success: true,
      message: "Review added successfully",
    });
  } catch (error) {
    console.error("Error adding product review:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add product review",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;

