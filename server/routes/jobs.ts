import { Router } from "express";
import type { Request, Response } from "express";
import { eq, like, and, or, desc, sql } from "drizzle-orm";
import { getDb } from "../db";
import { jobs, applications, users } from "../../drizzle/schema";

const router = Router();

// GET /api/jobs - Get jobs list with filtering
router.get("/", async (req: Request, res: Response) => {
  try {
    const {
      q,
      category,
      location,
      jobType,
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
    const conditions = [eq(jobs.isActive, true)];

    if (q && typeof q === "string") {
      conditions.push(
        or(
          like(jobs.title, `%${q}%`),
          like(jobs.description, `%${q}%`)
        )!
      );
    }

    if (category && typeof category === "string") {
      conditions.push(eq(jobs.category, category));
    }

    if (location && typeof location === "string") {
      conditions.push(like(jobs.location, `%${location}%`));
    }

    if (jobType && typeof jobType === "string") {
      conditions.push(eq(jobs.jobType, jobType as "full-time" | "part-time" | "contract" | "freelance"));
    }

    // Get jobs with employer info
    const jobResults = await db
      .select({
        id: jobs.id,
        title: jobs.title,
        description: jobs.description,
        category: jobs.category,
        location: jobs.location,
        salary: jobs.salary,
        currency: jobs.currency,
        jobType: jobs.jobType,
        applicationsCount: jobs.applicationsCount,
        createdAt: jobs.createdAt,
        expiresAt: jobs.expiresAt,
        employerId: users.id,
        employerName: users.displayName,
        employerAvatar: users.avatar,
        employerIsVerified: users.isVerified,
      })
      .from(jobs)
      .innerJoin(users, eq(jobs.employerId, users.id))
      .where(and(...conditions))
      .orderBy(desc(jobs.createdAt))
      .limit(limitNum)
      .offset(offset);

    // Get total count
    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(jobs)
      .where(and(...conditions));
    const total = Number(totalResult[0]?.count || 0);

    const jobsWithEmployer = jobResults.map((job) => ({
      id: job.id,
      title: job.title,
      description: job.description,
      category: job.category,
      location: job.location,
      salary: job.salary ? parseFloat(job.salary) : null,
      currency: job.currency,
      jobType: job.jobType,
      applicationsCount: job.applicationsCount,
      employer: {
        id: job.employerId,
        name: job.employerName,
        avatar: job.employerAvatar,
        isVerified: job.employerIsVerified,
      },
      createdAt: job.createdAt,
      expiresAt: job.expiresAt,
    }));

    res.json({
      success: true,
      jobs: jobsWithEmployer,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Error getting jobs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get jobs",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// GET /api/jobs/:id - Get single job
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const jobId = parseInt(req.params.id);

    if (isNaN(jobId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
    }

    const db = await getDb();
    if (!db) {
      return res.status(503).json({
        success: false,
        message: "Database not available",
      });
    }

    const jobResult = await db
      .select({
        id: jobs.id,
        title: jobs.title,
        description: jobs.description,
        category: jobs.category,
        location: jobs.location,
        salary: jobs.salary,
        currency: jobs.currency,
        jobType: jobs.jobType,
        applicationsCount: jobs.applicationsCount,
        isActive: jobs.isActive,
        createdAt: jobs.createdAt,
        expiresAt: jobs.expiresAt,
        employerId: users.id,
        employerName: users.displayName,
        employerAvatar: users.avatar,
        employerBio: users.bio,
        employerIsVerified: users.isVerified,
      })
      .from(jobs)
      .innerJoin(users, eq(jobs.employerId, users.id))
      .where(eq(jobs.id, jobId))
      .limit(1);

    if (jobResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const job = jobResult[0];

    res.json({
      success: true,
      job: {
        id: job.id,
        title: job.title,
        description: job.description,
        category: job.category,
        location: job.location,
        salary: job.salary ? parseFloat(job.salary) : null,
        currency: job.currency,
        jobType: job.jobType,
        applicationsCount: job.applicationsCount,
        isActive: job.isActive,
        employer: {
          id: job.employerId,
          name: job.employerName,
          avatar: job.employerAvatar,
          bio: job.employerBio,
          isVerified: job.employerIsVerified,
        },
        createdAt: job.createdAt,
        expiresAt: job.expiresAt,
      },
    });
  } catch (error) {
    console.error("Error getting job:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get job",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// POST /api/jobs - Create new job posting
router.post("/", async (req: Request, res: Response) => {
  try {
    const { title, description, category, location, salary, currency = "AETH", jobType, expiresAt } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required",
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

    const result = await db.insert(jobs).values({
      employerId: currentUserId,
      title,
      description,
      category: category || null,
      location: location || null,
      salary: salary ? salary.toString() : null,
      currency,
      jobType: jobType || null,
      applicationsCount: 0,
      isActive: true,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    });

    const jobId = Number(result[0].insertId);

    res.status(201).json({
      success: true,
      message: "Job posted successfully",
      jobId,
    });
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create job",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// PUT /api/jobs/:id - Update job
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const jobId = parseInt(req.params.id);
    const { title, description, category, location, salary, jobType, isActive, expiresAt } = req.body;

    if (isNaN(jobId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
    }

    // TODO: Verify user owns this job via JWT
    const currentUserId = 1; // Mock user ID

    const db = await getDb();
    if (!db) {
      return res.status(503).json({
        success: false,
        message: "Database not available",
      });
    }

    // Check if job exists and belongs to user
    const existingJob = await db
      .select()
      .from(jobs)
      .where(eq(jobs.id, jobId))
      .limit(1);

    if (existingJob.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (existingJob[0].employerId !== currentUserId) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to edit this job",
      });
    }

    // Build update object
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (location !== undefined) updateData.location = location;
    if (salary !== undefined) updateData.salary = salary ? salary.toString() : null;
    if (jobType !== undefined) updateData.jobType = jobType;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (expiresAt !== undefined) updateData.expiresAt = expiresAt ? new Date(expiresAt) : null;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields to update",
      });
    }

    await db.update(jobs).set(updateData).where(eq(jobs.id, jobId));

    res.json({
      success: true,
      message: "Job updated successfully",
    });
  } catch (error) {
    console.error("Error updating job:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update job",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// DELETE /api/jobs/:id - Delete job
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const jobId = parseInt(req.params.id);

    if (isNaN(jobId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
    }

    // TODO: Verify user owns this job via JWT
    const currentUserId = 1; // Mock user ID

    const db = await getDb();
    if (!db) {
      return res.status(503).json({
        success: false,
        message: "Database not available",
      });
    }

    // Check if job exists and belongs to user
    const existingJob = await db
      .select()
      .from(jobs)
      .where(eq(jobs.id, jobId))
      .limit(1);

    if (existingJob.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (existingJob[0].employerId !== currentUserId) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to delete this job",
      });
    }

    // Soft delete by setting isActive to false
    await db
      .update(jobs)
      .set({ isActive: false })
      .where(eq(jobs.id, jobId));

    res.json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete job",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// POST /api/jobs/:id/apply - Apply to job
router.post("/:id/apply", async (req: Request, res: Response) => {
  try {
    const jobId = parseInt(req.params.id);
    const { coverLetter, resumeUrl } = req.body;

    if (isNaN(jobId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID",
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

    // Check if job exists and is active
    const job = await db
      .select()
      .from(jobs)
      .where(eq(jobs.id, jobId))
      .limit(1);

    if (job.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (!job[0].isActive) {
      return res.status(400).json({
        success: false,
        message: "Job is no longer active",
      });
    }

    // Check if already applied
    const existing = await db
      .select()
      .from(applications)
      .where(
        and(eq(applications.applicantId, currentUserId), eq(applications.jobId, jobId))
      )
      .limit(1);

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "You have already applied to this job",
      });
    }

    // Create application
    await db.insert(applications).values({
      jobId,
      applicantId: currentUserId,
      coverLetter: coverLetter || null,
      resumeUrl: resumeUrl || null,
      status: "pending",
    });

    // Update job applications count
    await db
      .update(jobs)
      .set({
        applicationsCount: sql`${jobs.applicationsCount} + 1`,
      })
      .where(eq(jobs.id, jobId));

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
    });
  } catch (error) {
    console.error("Error applying to job:", error);
    res.status(500).json({
      success: false,
      message: "Failed to apply to job",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// GET /api/jobs/:id/applications - Get job applications (employer only)
router.get("/:id/applications", async (req: Request, res: Response) => {
  try {
    const jobId = parseInt(req.params.id);
    const { status, page = "1", limit = "20" } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    if (isNaN(jobId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
    }

    // TODO: Verify user owns this job via JWT
    const currentUserId = 1; // Mock user ID

    const db = await getDb();
    if (!db) {
      return res.status(503).json({
        success: false,
        message: "Database not available",
      });
    }

    // Verify job ownership
    const job = await db
      .select()
      .from(jobs)
      .where(eq(jobs.id, jobId))
      .limit(1);

    if (job.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (job[0].employerId !== currentUserId) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to view these applications",
      });
    }

    // Build where conditions
    const conditions = [eq(applications.jobId, jobId)];
    if (status && typeof status === "string") {
      conditions.push(eq(applications.status, status as "pending" | "reviewed" | "accepted" | "rejected"));
    }

    // Get applications with applicant info
    const appResults = await db
      .select({
        id: applications.id,
        coverLetter: applications.coverLetter,
        resumeUrl: applications.resumeUrl,
        status: applications.status,
        createdAt: applications.createdAt,
        applicantId: users.id,
        applicantName: users.displayName,
        applicantAvatar: users.avatar,
        applicantBio: users.bio,
      })
      .from(applications)
      .innerJoin(users, eq(applications.applicantId, users.id))
      .where(and(...conditions))
      .orderBy(desc(applications.createdAt))
      .limit(limitNum)
      .offset(offset);

    // Get total count
    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(applications)
      .where(and(...conditions));
    const total = Number(totalResult[0]?.count || 0);

    res.json({
      success: true,
      applications: appResults,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Error getting job applications:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get job applications",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;

