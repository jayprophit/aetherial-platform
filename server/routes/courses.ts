import { Router } from "express";
import type { Request, Response } from "express";
import { eq, like, and, or, desc, asc, sql } from "drizzle-orm";
import { getDb } from "../db";
import { courses, users, enrollments, lessons, reviews } from "../../drizzle/schema";

const router = Router();

// GET /api/courses - Get courses list with filtering
router.get("/", async (req: Request, res: Response) => {
  try {
    const {
      q,
      category,
      level,
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
    const conditions = [eq(courses.isPublished, true)];

    if (q && typeof q === "string") {
      conditions.push(
        or(
          like(courses.title, `%${q}%`),
          like(courses.description, `%${q}%`)
        )!
      );
    }

    if (category && typeof category === "string") {
      conditions.push(eq(courses.category, category));
    }

    if (level && typeof level === "string") {
      conditions.push(eq(courses.level, level as "beginner" | "intermediate" | "advanced"));
    }

    // Build order by clause
    let orderByClause;
    switch (sort) {
      case "popular":
        orderByClause = desc(courses.enrollmentsCount);
        break;
      case "rating":
        orderByClause = desc(courses.rating);
        break;
      case "price-low":
        orderByClause = asc(courses.price);
        break;
      case "price-high":
        orderByClause = desc(courses.price);
        break;
      default: // newest
        orderByClause = desc(courses.createdAt);
    }

    // Get courses with instructor info
    const courseResults = await db
      .select({
        id: courses.id,
        title: courses.title,
        description: courses.description,
        thumbnail: courses.thumbnail,
        price: courses.price,
        category: courses.category,
        level: courses.level,
        enrollmentsCount: courses.enrollmentsCount,
        rating: courses.rating,
        reviewsCount: courses.reviewsCount,
        createdAt: courses.createdAt,
        instructorId: users.id,
        instructorName: users.displayName,
        instructorAvatar: users.avatar,
        instructorIsVerified: users.isVerified,
      })
      .from(courses)
      .innerJoin(users, eq(courses.instructorId, users.id))
      .where(and(...conditions))
      .orderBy(orderByClause)
      .limit(limitNum)
      .offset(offset);

    // Get total count
    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(courses)
      .where(and(...conditions));
    const total = Number(totalResult[0]?.count || 0);

    const coursesWithInstructor = courseResults.map((course) => ({
      id: course.id,
      title: course.title,
      description: course.description,
      thumbnail: course.thumbnail,
      price: parseFloat(course.price),
      category: course.category,
      level: course.level,
      enrollmentsCount: course.enrollmentsCount,
      rating: course.rating ? parseFloat(course.rating) : 0,
      reviewsCount: course.reviewsCount,
      instructor: {
        id: course.instructorId,
        name: course.instructorName,
        avatar: course.instructorAvatar,
        isVerified: course.instructorIsVerified,
      },
      createdAt: course.createdAt,
    }));

    res.json({
      success: true,
      courses: coursesWithInstructor,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Error getting courses:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get courses",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// GET /api/courses/:id - Get single course with lessons
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const courseId = parseInt(req.params.id);

    if (isNaN(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    const db = await getDb();
    if (!db) {
      return res.status(503).json({
        success: false,
        message: "Database not available",
      });
    }

    // Get course with instructor
    const courseResult = await db
      .select({
        id: courses.id,
        title: courses.title,
        description: courses.description,
        thumbnail: courses.thumbnail,
        price: courses.price,
        category: courses.category,
        level: courses.level,
        enrollmentsCount: courses.enrollmentsCount,
        rating: courses.rating,
        reviewsCount: courses.reviewsCount,
        isPublished: courses.isPublished,
        createdAt: courses.createdAt,
        updatedAt: courses.updatedAt,
        instructorId: users.id,
        instructorName: users.displayName,
        instructorAvatar: users.avatar,
        instructorBio: users.bio,
        instructorIsVerified: users.isVerified,
      })
      .from(courses)
      .innerJoin(users, eq(courses.instructorId, users.id))
      .where(eq(courses.id, courseId))
      .limit(1);

    if (courseResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const course = courseResult[0];

    // Get lessons
    const courseLessons = await db
      .select({
        id: lessons.id,
        title: lessons.title,
        content: lessons.content,
        videoUrl: lessons.videoUrl,
        duration: lessons.duration,
        order: lessons.order,
      })
      .from(lessons)
      .where(eq(lessons.courseId, courseId))
      .orderBy(asc(lessons.order));

    res.json({
      success: true,
      course: {
        id: course.id,
        title: course.title,
        description: course.description,
        thumbnail: course.thumbnail,
        price: parseFloat(course.price),
        category: course.category,
        level: course.level,
        enrollmentsCount: course.enrollmentsCount,
        rating: course.rating ? parseFloat(course.rating) : 0,
        reviewsCount: course.reviewsCount,
        isPublished: course.isPublished,
        instructor: {
          id: course.instructorId,
          name: course.instructorName,
          avatar: course.instructorAvatar,
          bio: course.instructorBio,
          isVerified: course.instructorIsVerified,
        },
        lessons: courseLessons,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error getting course:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get course",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// POST /api/courses - Create new course
router.post("/", async (req: Request, res: Response) => {
  try {
    const { title, description, thumbnail, price = 0, category, level } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
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

    const result = await db.insert(courses).values({
      instructorId: currentUserId,
      title,
      description: description || null,
      thumbnail: thumbnail || null,
      price: price.toString(),
      category: category || null,
      level: level || null,
      enrollmentsCount: 0,
      rating: "0",
      reviewsCount: 0,
      isPublished: false,
    });

    const courseId = Number(result[0].insertId);

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      courseId,
    });
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create course",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// PUT /api/courses/:id - Update course
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const courseId = parseInt(req.params.id);
    const { title, description, thumbnail, price, category, level, isPublished } = req.body;

    if (isNaN(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    // TODO: Verify user owns this course via JWT
    const currentUserId = 1; // Mock user ID

    const db = await getDb();
    if (!db) {
      return res.status(503).json({
        success: false,
        message: "Database not available",
      });
    }

    // Check if course exists and belongs to user
    const existingCourse = await db
      .select()
      .from(courses)
      .where(eq(courses.id, courseId))
      .limit(1);

    if (existingCourse.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (existingCourse[0].instructorId !== currentUserId) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to edit this course",
      });
    }

    // Build update object
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (thumbnail !== undefined) updateData.thumbnail = thumbnail;
    if (price !== undefined) updateData.price = price.toString();
    if (category !== undefined) updateData.category = category;
    if (level !== undefined) updateData.level = level;
    if (isPublished !== undefined) updateData.isPublished = isPublished;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields to update",
      });
    }

    await db.update(courses).set(updateData).where(eq(courses.id, courseId));

    res.json({
      success: true,
      message: "Course updated successfully",
    });
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update course",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// DELETE /api/courses/:id - Delete course
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const courseId = parseInt(req.params.id);

    if (isNaN(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    // TODO: Verify user owns this course via JWT
    const currentUserId = 1; // Mock user ID

    const db = await getDb();
    if (!db) {
      return res.status(503).json({
        success: false,
        message: "Database not available",
      });
    }

    // Check if course exists and belongs to user
    const existingCourse = await db
      .select()
      .from(courses)
      .where(eq(courses.id, courseId))
      .limit(1);

    if (existingCourse.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (existingCourse[0].instructorId !== currentUserId) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to delete this course",
      });
    }

    // Soft delete by unpublishing
    await db
      .update(courses)
      .set({ isPublished: false })
      .where(eq(courses.id, courseId));

    res.json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete course",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// POST /api/courses/:id/enroll - Enroll in course
router.post("/:id/enroll", async (req: Request, res: Response) => {
  try {
    const courseId = parseInt(req.params.id);

    if (isNaN(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
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

    // Check if course exists
    const course = await db
      .select()
      .from(courses)
      .where(eq(courses.id, courseId))
      .limit(1);

    if (course.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (!course[0].isPublished) {
      return res.status(400).json({
        success: false,
        message: "Course is not published",
      });
    }

    // Check if already enrolled
    const existing = await db
      .select()
      .from(enrollments)
      .where(
        and(eq(enrollments.userId, currentUserId), eq(enrollments.courseId, courseId))
      )
      .limit(1);

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Already enrolled in this course",
      });
    }

    // Create enrollment
    await db.insert(enrollments).values({
      userId: currentUserId,
      courseId,
      progress: 0,
      completedAt: null,
      certificateId: null,
    });

    // Update course enrollment count
    await db
      .update(courses)
      .set({
        enrollmentsCount: sql`${courses.enrollmentsCount} + 1`,
      })
      .where(eq(courses.id, courseId));

    res.status(201).json({
      success: true,
      message: "Enrolled successfully",
    });
  } catch (error) {
    console.error("Error enrolling in course:", error);
    res.status(500).json({
      success: false,
      message: "Failed to enroll in course",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// GET /api/courses/:id/reviews - Get course reviews
router.get("/:id/reviews", async (req: Request, res: Response) => {
  try {
    const courseId = parseInt(req.params.id);
    const { page = "1", limit = "20" } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    if (isNaN(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
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
        and(eq(reviews.targetType, "course"), eq(reviews.targetId, courseId))
      )
      .orderBy(desc(reviews.createdAt))
      .limit(limitNum)
      .offset(offset);

    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(reviews)
      .where(
        and(eq(reviews.targetType, "course"), eq(reviews.targetId, courseId))
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
    console.error("Error getting course reviews:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get course reviews",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;

