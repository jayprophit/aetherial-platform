/**
 * AETHERIAL SEO API Routes
 * 
 * Manages SEO optimization across the platform
 */

import { Router, Request, Response } from 'express';
import { db } from '../db';
import { SEOEngine, SEOMetadata } from '../utils/seo-engine';
import { SitemapGenerator, SitemapUrl } from '../utils/sitemap-generator';
import { products, courses, articles, users } from '../../db/schema';
import { eq } from 'drizzle-orm';

const router = Router();

/**
 * GET /api/seo/analyze
 * Analyze content for SEO
 */
router.post('/analyze', async (req: Request, res: Response) => {
  try {
    const { content, primaryKeyword, url } = req.body;

    if (!content || !primaryKeyword) {
      return res.status(400).json({ error: 'Content and primary keyword are required' });
    }

    const analysis = SEOEngine.analyzeContent(content, primaryKeyword, url);

    res.json(analysis);
  } catch (error) {
    console.error('SEO analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze content' });
  }
});

/**
 * POST /api/seo/meta-tags
 * Generate meta tags for a page
 */
router.post('/meta-tags', async (req: Request, res: Response) => {
  try {
    const metadata: SEOMetadata = req.body;

    if (!metadata.title || !metadata.description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    const metaTags = SEOEngine.generateMetaTags(metadata);

    res.json({ metaTags });
  } catch (error) {
    console.error('Meta tags generation error:', error);
    res.status(500).json({ error: 'Failed to generate meta tags' });
  }
});

/**
 * POST /api/seo/structured-data/article
 * Generate article structured data
 */
router.post('/structured-data/article', async (req: Request, res: Response) => {
  try {
    const article = req.body;

    if (!article.headline || !article.description) {
      return res.status(400).json({ error: 'Headline and description are required' });
    }

    const structuredData = SEOEngine.generateArticleSchema(article);

    res.json({ structuredData });
  } catch (error) {
    console.error('Structured data generation error:', error);
    res.status(500).json({ error: 'Failed to generate structured data' });
  }
});

/**
 * POST /api/seo/structured-data/product
 * Generate product structured data
 */
router.post('/structured-data/product', async (req: Request, res: Response) => {
  try {
    const product = req.body;

    if (!product.name || !product.description) {
      return res.status(400).json({ error: 'Name and description are required' });
    }

    const structuredData = SEOEngine.generateProductSchema(product);

    res.json({ structuredData });
  } catch (error) {
    console.error('Structured data generation error:', error);
    res.status(500).json({ error: 'Failed to generate structured data' });
  }
});

/**
 * POST /api/seo/structured-data/course
 * Generate course structured data
 */
router.post('/structured-data/course', async (req: Request, res: Response) => {
  try {
    const course = req.body;

    if (!course.name || !course.description) {
      return res.status(400).json({ error: 'Name and description are required' });
    }

    const structuredData = SEOEngine.generateCourseSchema(course);

    res.json({ structuredData });
  } catch (error) {
    console.error('Structured data generation error:', error);
    res.status(500).json({ error: 'Failed to generate structured data' });
  }
});

/**
 * GET /api/seo/sitemap.xml
 * Generate complete sitemap
 */
router.get('/sitemap.xml', async (req: Request, res: Response) => {
  try {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const urls: SitemapUrl[] = [];

    // Add static pages
    urls.push({
      loc: baseUrl,
      changefreq: 'daily',
      priority: 1.0,
      lastmod: new Date().toISOString()
    });

    urls.push({
      loc: `${baseUrl}/about`,
      changefreq: 'monthly',
      priority: 0.8
    });

    urls.push({
      loc: `${baseUrl}/contact`,
      changefreq: 'monthly',
      priority: 0.7
    });

    // Add products
    const allProducts = await db.select().from(products);
    allProducts.forEach(product => {
      urls.push({
        loc: `${baseUrl}/products/${product.id}`,
        lastmod: product.updatedAt?.toISOString() || new Date().toISOString(),
        changefreq: 'weekly',
        priority: 0.8,
        images: product.images ? product.images.map((img: string) => ({
          loc: img,
          title: product.name,
          caption: product.description
        })) : undefined
      });
    });

    // Add courses
    const allCourses = await db.select().from(courses);
    allCourses.forEach(course => {
      urls.push({
        loc: `${baseUrl}/courses/${course.id}`,
        lastmod: course.updatedAt?.toISOString() || new Date().toISOString(),
        changefreq: 'weekly',
        priority: 0.8
      });
    });

    // Add articles
    const allArticles = await db.select().from(articles);
    allArticles.forEach(article => {
      urls.push({
        loc: `${baseUrl}/articles/${article.id}`,
        lastmod: article.updatedAt?.toISOString() || new Date().toISOString(),
        changefreq: 'monthly',
        priority: 0.6
      });
    });

    const sitemap = SitemapGenerator.generateSitemap(urls);

    res.header('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (error) {
    console.error('Sitemap generation error:', error);
    res.status(500).json({ error: 'Failed to generate sitemap' });
  }
});

/**
 * GET /api/seo/sitemap-index.xml
 * Generate sitemap index for large sites
 */
router.get('/sitemap-index.xml', async (req: Request, res: Response) => {
  try {
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    const sitemaps = [
      {
        loc: `${baseUrl}/api/seo/sitemap-products.xml`,
        lastmod: new Date().toISOString()
      },
      {
        loc: `${baseUrl}/api/seo/sitemap-courses.xml`,
        lastmod: new Date().toISOString()
      },
      {
        loc: `${baseUrl}/api/seo/sitemap-articles.xml`,
        lastmod: new Date().toISOString()
      }
    ];

    const sitemapIndex = SitemapGenerator.generateSitemapIndex(sitemaps);

    res.header('Content-Type', 'application/xml');
    res.send(sitemapIndex);
  } catch (error) {
    console.error('Sitemap index generation error:', error);
    res.status(500).json({ error: 'Failed to generate sitemap index' });
  }
});

/**
 * GET /api/seo/sitemap-products.xml
 * Generate products sitemap
 */
router.get('/sitemap-products.xml', async (req: Request, res: Response) => {
  try {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const urls: SitemapUrl[] = [];

    const allProducts = await db.select().from(products);
    allProducts.forEach(product => {
      urls.push({
        loc: `${baseUrl}/products/${product.id}`,
        lastmod: product.updatedAt?.toISOString() || new Date().toISOString(),
        changefreq: 'weekly',
        priority: 0.8,
        images: product.images ? product.images.map((img: string) => ({
          loc: img,
          title: product.name,
          caption: product.description
        })) : undefined
      });
    });

    const sitemap = SitemapGenerator.generateSitemap(urls);

    res.header('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (error) {
    console.error('Products sitemap generation error:', error);
    res.status(500).json({ error: 'Failed to generate products sitemap' });
  }
});

/**
 * GET /api/seo/sitemap-courses.xml
 * Generate courses sitemap
 */
router.get('/sitemap-courses.xml', async (req: Request, res: Response) => {
  try {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const urls: SitemapUrl[] = [];

    const allCourses = await db.select().from(courses);
    allCourses.forEach(course => {
      urls.push({
        loc: `${baseUrl}/courses/${course.id}`,
        lastmod: course.updatedAt?.toISOString() || new Date().toISOString(),
        changefreq: 'weekly',
        priority: 0.8
      });
    });

    const sitemap = SitemapGenerator.generateSitemap(urls);

    res.header('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (error) {
    console.error('Courses sitemap generation error:', error);
    res.status(500).json({ error: 'Failed to generate courses sitemap' });
  }
});

/**
 * GET /api/seo/sitemap-articles.xml
 * Generate articles sitemap
 */
router.get('/sitemap-articles.xml', async (req: Request, res: Response) => {
  try {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const urls: SitemapUrl[] = [];

    const allArticles = await db.select().from(articles);
    allArticles.forEach(article => {
      urls.push({
        loc: `${baseUrl}/articles/${article.id}`,
        lastmod: article.updatedAt?.toISOString() || new Date().toISOString(),
        changefreq: 'monthly',
        priority: 0.6
      });
    });

    const sitemap = SitemapGenerator.generateSitemap(urls);

    res.header('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (error) {
    console.error('Articles sitemap generation error:', error);
    res.status(500).json({ error: 'Failed to generate articles sitemap' });
  }
});

/**
 * GET /api/seo/robots.txt
 * Generate robots.txt
 */
router.get('/robots.txt', async (req: Request, res: Response) => {
  try {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const sitemapUrl = `${baseUrl}/api/seo/sitemap.xml`;

    const disallowPaths = [
      '/admin',
      '/api',
      '/private',
      '/*.json',
      '/*?*sort=',
      '/*?*filter='
    ];

    const robotsTxt = SEOEngine.generateRobotsTxt(sitemapUrl, disallowPaths);

    res.header('Content-Type', 'text/plain');
    res.send(robotsTxt);
  } catch (error) {
    console.error('Robots.txt generation error:', error);
    res.status(500).json({ error: 'Failed to generate robots.txt' });
  }
});

/**
 * POST /api/seo/optimize-url
 * Optimize URL slug for SEO
 */
router.post('/optimize-url', async (req: Request, res: Response) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const optimizedUrl = SEOEngine.optimizeUrl(title);

    res.json({ url: optimizedUrl });
  } catch (error) {
    console.error('URL optimization error:', error);
    res.status(500).json({ error: 'Failed to optimize URL' });
  }
});

export default router;

