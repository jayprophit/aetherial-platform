import express from 'express';
import { getDb } from '../db';
import { users, posts, products, courses, orders, payments } from '../../drizzle/schema';
import { eq, sql, desc, and, gte, lte } from 'drizzle-orm';
import { authenticateToken } from '../middleware/auth';
import { checkPermission } from '../middleware/rbac';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticateToken);


// GET /api/admin/stats - Platform statistics
router.get('/stats', checkPermission('dashboard:view'), async (req, res) => {
  try {
    const db = await getDb();
    if (!db) {
      return res.status(503).json({ error: 'Database not available' });
    }

    // Get counts
    const [userCount] = await db.select({ count: sql<number>`count(*)` }).from(users);
    const [postCount] = await db.select({ count: sql<number>`count(*)` }).from(posts);
    const [productCount] = await db.select({ count: sql<number>`count(*)` }).from(products);
    const [courseCount] = await db.select({ count: sql<number>`count(*)` }).from(courses);
    const [orderCount] = await db.select({ count: sql<number>`count(*)` }).from(orders);
    
    // Get revenue
    const [revenueResult] = await db
      .select({ total: sql<number>`sum(${payments.amount})` })
      .from(payments)
      .where(eq(payments.status, 'completed'));

    res.json({
      users: userCount.count,
      posts: postCount.count,
      products: productCount.count,
      courses: courseCount.count,
      orders: orderCount.count,
      revenue: revenueResult.total || 0,
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// GET /api/admin/users - Get all users with pagination
router.get('/users', checkPermission('user:view:full'), async (req, res) => {
  try {
    const { page = '1', limit = '20', search, role, status } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    const db = await getDb();
    if (!db) {
      return res.status(503).json({ error: 'Database not available' });
    }

    let query = db.select().from(users);

    // Apply filters
    const conditions = [];
    if (search) {
      conditions.push(sql`${users.username} LIKE ${'%' + search + '%'} OR ${users.email} LIKE ${'%' + search + '%'}`);
    }
    if (role) {
      conditions.push(eq(users.role, role as string));
    }
    if (status) {
      conditions.push(eq(users.status, status as string));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const allUsers = await query
      .orderBy(desc(users.createdAt))
      .limit(limitNum)
      .offset(offset);

    // Get total count
    const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(users);

    res.json({
      users: allUsers,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: count,
        pages: Math.ceil(count / limitNum),
      },
    });
  } catch (error) {
    console.error('Admin get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// PUT /api/admin/users/:id - Update user (ban, suspend, verify, change role)
router.put('/users/:id', checkPermission('user:edit:any'), async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { status, role, isVerified } = req.body;

    const db = await getDb();
    if (!db) {
      return res.status(503).json({ error: 'Database not available' });
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (role) {
      // Only super admin can change roles
      if (req.user!.role !== 'super_admin') {
        return res.status(403).json({ error: 'Super admin access required to change roles' });
      }
      updateData.role = role;
    }
    if (isVerified !== undefined) updateData.isVerified = isVerified;

    await db.update(users).set(updateData).where(eq(users.id, userId));

    const [updatedUser] = await db.select().from(users).where(eq(users.id, userId));

    res.json({ user: updatedUser });
  } catch (error) {
    console.error('Admin update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// DELETE /api/admin/users/:id - Delete user (super admin only)
router.delete('/users/:id', checkPermission('user:delete:any'), async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    const db = await getDb();
    if (!db) {
      return res.status(503).json({ error: 'Database not available' });
    }

    await db.delete(users).where(eq(users.id, userId));

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Admin delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// GET /api/admin/posts - Get all posts for moderation
router.get('/posts', checkPermission('post:view:any'), async (req, res) => {
  try {
    const { page = '1', limit = '20', status } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    const db = await getDb();
    if (!db) {
      return res.status(503).json({ error: 'Database not available' });
    }

    let query = db
      .select({
        id: posts.id,
        content: posts.content,
        media: posts.media,
        visibility: posts.visibility,
        likesCount: posts.likesCount,
        commentsCount: posts.commentsCount,
        createdAt: posts.createdAt,
        authorId: users.id,
        authorUsername: users.username,
        authorEmail: users.email,
      })
      .from(posts)
      .innerJoin(users, eq(posts.userId, users.id));

    if (status) {
      query = query.where(eq(posts.visibility, status as string));
    }

    const allPosts = await query
      .orderBy(desc(posts.createdAt))
      .limit(limitNum)
      .offset(offset);

    const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(posts);

    res.json({
      posts: allPosts,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: count,
        pages: Math.ceil(count / limitNum),
      },
    });
  } catch (error) {
    console.error('Admin get posts error:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// DELETE /api/admin/posts/:id - Delete post
router.delete('/posts/:id', checkPermission('post:delete:any'), async (req, res) => {
  try {
    const postId = parseInt(req.params.id);

    const db = await getDb();
    if (!db) {
      return res.status(503).json({ error: 'Database not available' });
    }

    await db.delete(posts).where(eq(posts.id, postId));

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Admin delete post error:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

// GET /api/admin/orders - Get all orders
router.get('/orders', checkPermission('order:view:any'), async (req, res) => {
  try {
    const { page = '1', limit = '20', status } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    const db = await getDb();
    if (!db) {
      return res.status(503).json({ error: 'Database not available' });
    }

    let query = db
      .select({
        id: orders.id,
        userId: orders.userId,
        totalAmount: orders.totalAmount,
        status: orders.status,
        createdAt: orders.createdAt,
        userEmail: users.email,
        username: users.username,
      })
      .from(orders)
      .innerJoin(users, eq(orders.userId, users.id));

    if (status) {
      query = query.where(eq(orders.status, status as string));
    }

    const allOrders = await query
      .orderBy(desc(orders.createdAt))
      .limit(limitNum)
      .offset(offset);

    const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(orders);

    res.json({
      orders: allOrders,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: count,
        pages: Math.ceil(count / limitNum),
      },
    });
  } catch (error) {
    console.error('Admin get orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// PUT /api/admin/orders/:id - Update order status
router.put('/orders/:id', checkPermission('order:edit:any'), async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const { status } = req.body;

    const db = await getDb();
    if (!db) {
      return res.status(503).json({ error: 'Database not available' });
    }

    await db.update(orders).set({ status }).where(eq(orders.id, orderId));

    const [updatedOrder] = await db.select().from(orders).where(eq(orders.id, orderId));

    res.json({ order: updatedOrder });
  } catch (error) {
    console.error('Admin update order error:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// GET /api/admin/analytics - Platform analytics
router.get('/analytics', checkPermission('analytics:view'), async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const db = await getDb();
    if (!db) {
      return res.status(503).json({ error: 'Database not available' });
    }

    // User growth
    let userQuery = db.select({ 
      date: sql<string>`DATE(${users.createdAt})`,
      count: sql<number>`count(*)` 
    }).from(users);

    if (startDate && endDate) {
      userQuery = userQuery.where(
        and(
          gte(users.createdAt, new Date(startDate as string)),
          lte(users.createdAt, new Date(endDate as string))
        )
      );
    }

    const userGrowth = await userQuery.groupBy(sql`DATE(${users.createdAt})`);

    // Revenue over time
    let revenueQuery = db.select({
      date: sql<string>`DATE(${payments.createdAt})`,
      total: sql<number>`sum(${payments.amount})`
    }).from(payments).where(eq(payments.status, 'completed'));

    if (startDate && endDate) {
      revenueQuery = revenueQuery.where(
        and(
          eq(payments.status, 'completed'),
          gte(payments.createdAt, new Date(startDate as string)),
          lte(payments.createdAt, new Date(endDate as string))
        )
      );
    }

    const revenueData = await revenueQuery.groupBy(sql`DATE(${payments.createdAt})`);

    res.json({
      userGrowth,
      revenue: revenueData,
    });
  } catch (error) {
    console.error('Admin analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

export default router;

