/**
 * AETHERIAL Proprietary SEO Engine (Simplified)
 * 
 * Our own implementation - replaces Yoast, RankMath, All-in-One SEO
 * No external dependencies version
 */

export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  locale?: string;
  alternateLocales?: string[];
}

export interface SEOAnalysis {
  score: number;
  issues: SEOIssue[];
  recommendations: string[];
  keywords: KeywordAnalysis;
}

export interface SEOIssue {
  severity: 'critical' | 'warning' | 'info';
  type: string;
  message: string;
  fix?: string;
}

export interface KeywordAnalysis {
  primary: string;
  density: number;
  placement: {
    title: boolean;
    description: boolean;
    url: boolean;
  };
  related: string[];
}

export class SEOEngine {
  /**
   * Generate complete meta tags for a page
   */
  static generateMetaTags(metadata: SEOMetadata): string {
    const tags: string[] = [];

    // Basic meta tags
    tags.push(`<title>${this.escapeHtml(metadata.title)}</title>`);
    tags.push(`<meta name="description" content="${this.escapeHtml(metadata.description)}">`);
    
    if (metadata.keywords && metadata.keywords.length > 0) {
      tags.push(`<meta name="keywords" content="${metadata.keywords.join(', ')}">`);
    }

    if (metadata.author) {
      tags.push(`<meta name="author" content="${this.escapeHtml(metadata.author)}">`);
    }

    // Canonical URL
    if (metadata.canonicalUrl) {
      tags.push(`<link rel="canonical" href="${metadata.canonicalUrl}">`);
    }

    // Open Graph tags
    tags.push(`<meta property="og:title" content="${this.escapeHtml(metadata.title)}">`);
    tags.push(`<meta property="og:description" content="${this.escapeHtml(metadata.description)}">`);
    tags.push(`<meta property="og:type" content="${metadata.ogType || 'website'}">`);
    
    if (metadata.canonicalUrl) {
      tags.push(`<meta property="og:url" content="${metadata.canonicalUrl}">`);
    }
    
    if (metadata.ogImage) {
      tags.push(`<meta property="og:image" content="${metadata.ogImage}">`);
      tags.push(`<meta property="og:image:alt" content="${this.escapeHtml(metadata.title)}">`);
    }

    if (metadata.locale) {
      tags.push(`<meta property="og:locale" content="${metadata.locale}">`);
    }

    if (metadata.alternateLocales) {
      metadata.alternateLocales.forEach(locale => {
        tags.push(`<meta property="og:locale:alternate" content="${locale}">`);
      });
    }

    if (metadata.publishedTime) {
      tags.push(`<meta property="article:published_time" content="${metadata.publishedTime}">`);
    }

    if (metadata.modifiedTime) {
      tags.push(`<meta property="article:modified_time" content="${metadata.modifiedTime}">`);
    }

    // Twitter Card tags
    tags.push(`<meta name="twitter:card" content="${metadata.twitterCard || 'summary_large_image'}">`);
    tags.push(`<meta name="twitter:title" content="${this.escapeHtml(metadata.title)}">`);
    tags.push(`<meta name="twitter:description" content="${this.escapeHtml(metadata.description)}">`);
    
    if (metadata.ogImage) {
      tags.push(`<meta name="twitter:image" content="${metadata.ogImage}">`);
    }

    // Additional SEO tags
    tags.push(`<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">`);
    tags.push(`<meta name="googlebot" content="index, follow">`);

    return tags.join('\n');
  }

  /**
   * Generate JSON-LD structured data
   */
  static generateStructuredData(type: string, data: any): string {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': type,
      ...data
    };

    return `<script type="application/ld+json">${JSON.stringify(structuredData, null, 2)}</script>`;
  }

  /**
   * Analyze content for SEO (simplified version)
   */
  static analyzeContent(content: string, primaryKeyword: string, url?: string): SEOAnalysis {
    const issues: SEOIssue[] = [];
    const recommendations: string[] = [];

    // Remove HTML tags for analysis
    const text = content.replace(/<[^>]*>/g, '');
    const words = text.split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;

    // Analyze keyword usage
    const keywordLower = primaryKeyword.toLowerCase();
    const textLower = text.toLowerCase();
    const keywordCount = (textLower.match(new RegExp(keywordLower, 'g')) || []).length;
    const keywordDensity = (keywordCount / wordCount) * 100;

    // Check title (extract from content)
    const titleMatch = content.match(/<title[^>]*>(.*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1] : '';
    
    if (!title) {
      issues.push({
        severity: 'critical',
        type: 'missing_title',
        message: 'Page is missing a title tag',
        fix: 'Add a descriptive title tag (50-60 characters)'
      });
    } else if (title.length < 30) {
      issues.push({
        severity: 'warning',
        type: 'short_title',
        message: 'Title is too short',
        fix: 'Expand title to 50-60 characters'
      });
    } else if (title.length > 60) {
      issues.push({
        severity: 'warning',
        type: 'long_title',
        message: 'Title is too long',
        fix: 'Shorten title to 50-60 characters'
      });
    }

    // Check meta description
    const descMatch = content.match(/<meta\s+name="description"\s+content="([^"]*)"/i);
    const description = descMatch ? descMatch[1] : '';
    
    if (!description) {
      issues.push({
        severity: 'critical',
        type: 'missing_description',
        message: 'Page is missing a meta description',
        fix: 'Add a compelling meta description (150-160 characters)'
      });
    }

    // Keyword analysis
    const keywordAnalysis: KeywordAnalysis = {
      primary: primaryKeyword,
      density: keywordDensity,
      placement: {
        title: title.toLowerCase().includes(keywordLower),
        description: description.toLowerCase().includes(keywordLower),
        url: url?.toLowerCase().includes(keywordLower) || false
      },
      related: this.extractRelatedKeywords(text, primaryKeyword)
    };

    // Keyword recommendations
    if (keywordDensity < 0.5) {
      recommendations.push(`Increase keyword "${primaryKeyword}" usage (current density: ${keywordDensity.toFixed(2)}%)`);
    } else if (keywordDensity > 3) {
      recommendations.push(`Reduce keyword "${primaryKeyword}" usage to avoid keyword stuffing`);
    }

    if (!keywordAnalysis.placement.title) {
      recommendations.push(`Include "${primaryKeyword}" in the title tag`);
    }

    // Content length
    if (wordCount < 300) {
      recommendations.push(`Increase content length (current: ${wordCount} words, recommended: 300+)`);
    }

    // Calculate score
    let score = 100;
    issues.forEach(issue => {
      if (issue.severity === 'critical') score -= 15;
      else if (issue.severity === 'warning') score -= 5;
      else score -= 2;
    });
    score = Math.max(0, Math.min(100, score));

    return {
      score,
      issues,
      recommendations,
      keywords: keywordAnalysis
    };
  }

  /**
   * Extract related keywords
   */
  private static extractRelatedKeywords(text: string, primaryKeyword: string): string[] {
    const words = text.toLowerCase().split(/\s+/);
    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can']);
    
    const wordFreq = new Map<string, number>();
    words.forEach(word => {
      if (word.length > 3 && !stopWords.has(word) && word !== primaryKeyword.toLowerCase()) {
        wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
      }
    });

    return Array.from(wordFreq.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word);
  }

  /**
   * Escape HTML
   */
  private static escapeHtml(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }

  /**
   * Generate robots.txt content
   */
  static generateRobotsTxt(sitemapUrl: string, disallowPaths: string[] = []): string {
    let content = 'User-agent: *\n';
    
    if (disallowPaths.length > 0) {
      disallowPaths.forEach(path => {
        content += `Disallow: ${path}\n`;
      });
    } else {
      content += 'Disallow:\n';
    }

    content += `\nSitemap: ${sitemapUrl}\n`;

    return content;
  }

  /**
   * Optimize URL for SEO
   */
  static optimizeUrl(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 60);
  }
}
