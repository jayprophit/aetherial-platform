import { Router } from "express";
import type { Request, Response } from "express";
import { eq, desc, sql, and } from "drizzle-orm";
import { getDb } from "../db";
import { productOrders, products, users, cartItems } from "../../drizzle/schema";

const router = Router();

// GET /api/orders - Get user's orders
router.get("/", async (req: Request, res: Response) => {
  try {
    const { status, page = "1", limit = "20" } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    // TODO: Get current user ID from JWT
    const currentUserId = 1; // Mock user ID

    const db = await getDb();
    if (!db) {
      return res.status(503).json({
        success: false,
        message: "Database not available",
      });
    }

    // Build where conditions
    const conditions = [eq(productOrders.buyerId, currentUserId)];
    if (status && typeof status === "string") {
      conditions.push(eq(productOrders.status, status as "pending" | "completed" | "cancelled"));
    }

    // Get orders with product and seller info
    const orders = await db
      .select({
        id: productOrders.id,
        quantity: productOrders.quantity,
        totalPrice: productOrders.totalPrice,
        status: productOrders.status,
        createdAt: productOrders.createdAt,
        completedAt: productOrders.completedAt,
        productId: products.id,
        productTitle: products.title,
        productPrice: products.price,
        productImages: products.images,
        sellerId: users.id,
        sellerName: users.displayName,
      })
      .from(productOrders)
      .innerJoin(products, eq(productOrders.productId, products.id))
      .innerJoin(users, eq(productOrders.sellerId, users.id))
      .where(and(...conditions))
      .orderBy(desc(productOrders.createdAt))
      .limit(limitNum)
      .offset(offset);

    // Get total count
    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(productOrders)
      .where(and(...conditions));
    const total = Number(totalResult[0]?.count || 0);

    const ordersFormatted = orders.map((order) => ({
      id: order.id,
      product: {
        id: order.productId,
        title: order.productTitle,
        price: parseFloat(order.productPrice),
        images: order.productImages,
      },
      seller: {
        id: order.sellerId,
        name: order.sellerName,
      },
      quantity: order.quantity,
      totalPrice: parseFloat(order.totalPrice),
      status: order.status,
      createdAt: order.createdAt,
      completedAt: order.completedAt,
    }));

    res.json({
      success: true,
      orders: ordersFormatted,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Error getting orders:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get orders",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// GET /api/orders/:id - Get order details
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const orderId = parseInt(req.params.id);

    if (isNaN(orderId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
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

    const order = await db
      .select({
        id: productOrders.id,
        buyerId: productOrders.buyerId,
        quantity: productOrders.quantity,
        totalPrice: productOrders.totalPrice,
        status: productOrders.status,
        createdAt: productOrders.createdAt,
        completedAt: productOrders.completedAt,
        productId: products.id,
        productTitle: products.title,
        productDescription: products.description,
        productPrice: products.price,
        productImages: products.images,
        sellerId: users.id,
        sellerName: users.displayName,
        sellerAvatar: users.avatar,
      })
      .from(productOrders)
      .innerJoin(products, eq(productOrders.productId, products.id))
      .innerJoin(users, eq(productOrders.sellerId, users.id))
      .where(eq(productOrders.id, orderId))
      .limit(1);

    if (order.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order[0].buyerId !== currentUserId) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to view this order",
      });
    }

    res.json({
      success: true,
      order: {
        id: order[0].id,
        product: {
          id: order[0].productId,
          title: order[0].productTitle,
          description: order[0].productDescription,
          price: parseFloat(order[0].productPrice),
          images: order[0].productImages,
        },
        seller: {
          id: order[0].sellerId,
          name: order[0].sellerName,
          avatar: order[0].sellerAvatar,
        },
        quantity: order[0].quantity,
        totalPrice: parseFloat(order[0].totalPrice),
        status: order[0].status,
        createdAt: order[0].createdAt,
        completedAt: order[0].completedAt,
      },
    });
  } catch (error) {
    console.error("Error getting order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get order",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// POST /api/orders - Create order (checkout)
router.post("/", async (req: Request, res: Response) => {
  try {
    const { items } = req.body; // items: [{ productId, quantity }]

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Items are required",
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

    // Process each item
    const orderIds = [];
    for (const item of items) {
      const { productId, quantity } = item;

      // Get product details
      const product = await db
        .select()
        .from(products)
        .where(eq(products.id, productId))
        .limit(1);

      if (product.length === 0) {
        return res.status(404).json({
          success: false,
          message: `Product ${productId} not found`,
        });
      }

      // Check stock
      if (product[0].stock < quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for product ${product[0].title}`,
        });
      }

      // Calculate total
      const totalPrice = parseFloat(product[0].price) * quantity;

      // Create order
      const result = await db.insert(productOrders).values({
        buyerId: currentUserId,
        sellerId: product[0].sellerId,
        productId,
        quantity,
        totalPrice: totalPrice.toString(),
        status: "pending",
      });

      orderIds.push(Number(result[0].insertId));

      // Update product stock and sales count
      await db
        .update(products)
        .set({
          stock: sql`${products.stock} - ${quantity}`,
          salesCount: sql`${products.salesCount} + ${quantity}`,
        })
        .where(eq(products.id, productId));
    }

    // Clear cart
    await db.delete(cartItems).where(eq(cartItems.userId, currentUserId));

    res.status(201).json({
      success: true,
      message: "Orders created successfully",
      orderIds,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// PUT /api/orders/:id/cancel - Cancel order
router.put("/:id/cancel", async (req: Request, res: Response) => {
  try {
    const orderId = parseInt(req.params.id);

    if (isNaN(orderId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
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

    // Get order
    const order = await db
      .select()
      .from(productOrders)
      .where(eq(productOrders.id, orderId))
      .limit(1);

    if (order.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order[0].buyerId !== currentUserId) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to cancel this order",
      });
    }

    if (order[0].status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending orders can be cancelled",
      });
    }

    // Cancel order
    await db
      .update(productOrders)
      .set({ status: "cancelled" })
      .where(eq(productOrders.id, orderId));

    // Restore product stock
    await db
      .update(products)
      .set({
        stock: sql`${products.stock} + ${order[0].quantity}`,
        salesCount: sql`GREATEST(${products.salesCount} - ${order[0].quantity}, 0)`,
      })
      .where(eq(products.id, order[0].productId));

    res.json({
      success: true,
      message: "Order cancelled successfully",
    });
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to cancel order",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;

