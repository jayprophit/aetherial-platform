import { Router } from "express";
import type { Request, Response } from "express";
import { eq, and, sql } from "drizzle-orm";
import { getDb } from "../db";
import { cartItems, products, users } from "../../drizzle/schema";

const router = Router();

// GET /api/cart - Get user's cart
router.get("/", async (req: Request, res: Response) => {
  try {
    // TODO: Get current user ID from JWT
    const currentUserId = 1; // Mock user ID

    const db = await getDb();
    if (!db) {
      return res.status(503).json({
        success: false,
        message: "Database not available",
      });
    }

    // Get cart items with product details
    const items = await db
      .select({
        id: cartItems.id,
        quantity: cartItems.quantity,
        productId: products.id,
        productTitle: products.title,
        productPrice: products.price,
        productCurrency: products.currency,
        productImages: products.images,
        productStock: products.stock,
        sellerId: users.id,
        sellerName: users.displayName,
      })
      .from(cartItems)
      .innerJoin(products, eq(cartItems.productId, products.id))
      .innerJoin(users, eq(products.sellerId, users.id))
      .where(eq(cartItems.userId, currentUserId));

    // Calculate totals
    let subtotal = 0;
    const itemsWithTotal = items.map((item) => {
      const price = parseFloat(item.productPrice);
      const itemTotal = price * item.quantity;
      subtotal += itemTotal;

      return {
        id: item.id,
        quantity: item.quantity,
        product: {
          id: item.productId,
          title: item.productTitle,
          price,
          currency: item.productCurrency,
          images: item.productImages,
          stock: item.productStock,
          seller: {
            id: item.sellerId,
            name: item.sellerName,
          },
        },
        itemTotal,
      };
    });

    res.json({
      success: true,
      cart: {
        items: itemsWithTotal,
        subtotal,
        itemCount: items.length,
      },
    });
  } catch (error) {
    console.error("Error getting cart:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get cart",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// POST /api/cart - Add item to cart
router.post("/", async (req: Request, res: Response) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
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

    // Check if product exists and has stock
    const product = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

    if (product.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product[0].stock < quantity) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock",
      });
    }

    // Check if item already in cart
    const existing = await db
      .select()
      .from(cartItems)
      .where(
        and(eq(cartItems.userId, currentUserId), eq(cartItems.productId, productId))
      )
      .limit(1);

    if (existing.length > 0) {
      // Update quantity
      const newQuantity = existing[0].quantity + quantity;
      
      if (product[0].stock < newQuantity) {
        return res.status(400).json({
          success: false,
          message: "Insufficient stock for requested quantity",
        });
      }

      await db
        .update(cartItems)
        .set({ quantity: newQuantity })
        .where(eq(cartItems.id, existing[0].id));
    } else {
      // Add new item
      await db.insert(cartItems).values({
        userId: currentUserId,
        productId,
        quantity,
      });
    }

    res.status(201).json({
      success: true,
      message: "Item added to cart",
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add to cart",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// PUT /api/cart/:id - Update cart item quantity
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const cartItemId = parseInt(req.params.id);
    const { quantity } = req.body;

    if (isNaN(cartItemId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid cart item ID",
      });
    }

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
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

    // Get cart item with product info
    const cartItem = await db
      .select({
        cartItemId: cartItems.id,
        userId: cartItems.userId,
        productId: cartItems.productId,
        stock: products.stock,
      })
      .from(cartItems)
      .innerJoin(products, eq(cartItems.productId, products.id))
      .where(eq(cartItems.id, cartItemId))
      .limit(1);

    if (cartItem.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    if (cartItem[0].userId !== currentUserId) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to modify this cart item",
      });
    }

    if (cartItem[0].stock < quantity) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock",
      });
    }

    await db
      .update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, cartItemId));

    res.json({
      success: true,
      message: "Cart item updated",
    });
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update cart item",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// DELETE /api/cart/:id - Remove item from cart
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const cartItemId = parseInt(req.params.id);

    if (isNaN(cartItemId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid cart item ID",
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

    // Verify ownership
    const cartItem = await db
      .select()
      .from(cartItems)
      .where(eq(cartItems.id, cartItemId))
      .limit(1);

    if (cartItem.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    if (cartItem[0].userId !== currentUserId) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to remove this cart item",
      });
    }

    await db.delete(cartItems).where(eq(cartItems.id, cartItemId));

    res.json({
      success: true,
      message: "Item removed from cart",
    });
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({
      success: false,
      message: "Failed to remove from cart",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// DELETE /api/cart - Clear entire cart
router.delete("/", async (req: Request, res: Response) => {
  try {
    // TODO: Get current user ID from JWT
    const currentUserId = 1; // Mock user ID

    const db = await getDb();
    if (!db) {
      return res.status(503).json({
        success: false,
        message: "Database not available",
      });
    }

    await db.delete(cartItems).where(eq(cartItems.userId, currentUserId));

    res.json({
      success: true,
      message: "Cart cleared",
    });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({
      success: false,
      message: "Failed to clear cart",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;

