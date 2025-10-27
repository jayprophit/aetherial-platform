import express from 'express';
import { db } from '../db';
import { users, posts, products, courses, jobs, groups } from '../../drizzle/schema';
import { like, or, sql } from 'drizzle-orm';

const router = express.Router();

// Global search across all resources
router.get('/', async (req, res) => {
  try {
    const { q, type, limit = 20 } = req.query;
    
    if (!q || typeof q !== 'string') {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const searchTerm = `%${q}%`;
    const resultLimit = Math.min(parseInt(limit as string) || 20, 100);

    const results: any = {
      query: q,
      results: {}
    };

    // Search users if type is 'all' or 'users'
    if (!type || type === 'all' || type === 'users') {
      const userResults = await db
        .select({
          id: users.id,
          fullName: users.fullName,
          email: users.email,
          createdAt: users.createdAt
        })
        .from(users)
        .where(
          or(
            like(users.fullName, searchTerm),
            like(users.email, searchTerm)
          )
        )
        .limit(resultLimit);
      
      results.results.users = userResults;
    }

    // Search posts if type is 'all' or 'posts'
    if (!type || type === 'all' || type === 'posts') {
      const postResults = await db
        .select({
          id: posts.id,
          content: posts.content,
          userId: posts.userId,
          createdAt: posts.createdAt
        })
        .from(posts)
        .where(like(posts.content, searchTerm))
        .limit(resultLimit);
      
      results.results.posts = postResults;
    }

    // Search products if type is 'all' or 'products'
    if (!type || type === 'all' || type === 'products') {
      const productResults = await db
        .select({
          id: products.id,
          name: products.name,
          description: products.description,
          price: products.price,
          category: products.category,
          sellerId: products.sellerId,
          createdAt: products.createdAt
        })
        .from(products)
        .where(
          or(
            like(products.name, searchTerm),
            like(products.description, searchTerm),
            like(products.category, searchTerm)
          )
        )
        .limit(resultLimit);
      
      results.results.products = productResults;
    }

    // Search courses if type is 'all' or 'courses'
    if (!type || type === 'all' || type === 'courses') {
      const courseResults = await db
        .select({
          id: courses.id,
          title: courses.title,
          description: courses.description,
          category: courses.category,
          level: courses.level,
          price: courses.price,
          instructorId: courses.instructorId,
          createdAt: courses.createdAt
        })
        .from(courses)
        .where(
          or(
            like(courses.title, searchTerm),
            like(courses.description, searchTerm),
            like(courses.category, searchTerm)
          )
        )
        .limit(resultLimit);
      
      results.results.courses = courseResults;
    }

    // Search jobs if type is 'all' or 'jobs'
    if (!type || type === 'all' || type === 'jobs') {
      const jobResults = await db
        .select({
          id: jobs.id,
          title: jobs.title,
          description: jobs.description,
          company: jobs.company,
          location: jobs.location,
          type: jobs.type,
          salary: jobs.salary,
          createdAt: jobs.createdAt
        })
        .from(jobs)
        .where(
          or(
            like(jobs.title, searchTerm),
            like(jobs.description, searchTerm),
            like(jobs.company, searchTerm),
            like(jobs.location, searchTerm)
          )
        )
        .limit(resultLimit);
      
      results.results.jobs = jobResults;
    }

    // Search groups if type is 'all' or 'groups'
    if (!type || type === 'all' || type === 'groups') {
      const groupResults = await db
        .select({
          id: groups.id,
          name: groups.name,
          description: groups.description,
          privacy: groups.privacy,
          createdAt: groups.createdAt
        })
        .from(groups)
        .where(
          or(
            like(groups.name, searchTerm),
            like(groups.description, searchTerm)
          )
        )
        .limit(resultLimit);
      
      results.results.groups = groupResults;
    }

    // Calculate total results
    results.totalResults = Object.values(results.results).reduce(
      (sum: number, arr: any) => sum + (arr?.length || 0),
      0
    );

    res.json(results);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Failed to perform search' });
  }
});

// Search suggestions/autocomplete
router.get('/suggestions', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || typeof q !== 'string') {
      return res.json({ suggestions: [] });
    }

    const searchTerm = `%${q}%`;
    const limit = 5;

    // Get top suggestions from users, products, and courses
    const [userSuggestions, productSuggestions, courseSuggestions] = await Promise.all([
      db
        .select({ id: users.id, text: users.fullName, type: sql`'user'` })
        .from(users)
        .where(like(users.fullName, searchTerm))
        .limit(limit),
      
      db
        .select({ id: products.id, text: products.name, type: sql`'product'` })
        .from(products)
        .where(like(products.name, searchTerm))
        .limit(limit),
      
      db
        .select({ id: courses.id, text: courses.title, type: sql`'course'` })
        .from(courses)
        .where(like(courses.title, searchTerm))
        .limit(limit)
    ]);

    const suggestions = [
      ...userSuggestions,
      ...productSuggestions,
      ...courseSuggestions
    ].slice(0, 10);

    res.json({ suggestions });
  } catch (error) {
    console.error('Suggestions error:', error);
    res.status(500).json({ error: 'Failed to get suggestions' });
  }
});

export default router;

