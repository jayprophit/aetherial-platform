/**
 * AETHERIAL Proprietary Sitemap Generator
 * 
 * Generates XML sitemaps for search engine optimization
 * Supports multiple sitemap types and automatic updates
 */

export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
  images?: SitemapImage[];
  videos?: SitemapVideo[];
}

export interface SitemapImage {
  loc: string;
  caption?: string;
  title?: string;
  license?: string;
}

export interface SitemapVideo {
  thumbnail_loc: string;
  title: string;
  description: string;
  content_loc?: string;
  player_loc?: string;
  duration?: number;
  publication_date?: string;
}

export class SitemapGenerator {
  /**
   * Generate XML sitemap
   */
  static generateSitemap(urls: SitemapUrl[]): string {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
    xml += '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"\n';
    xml += '        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">\n';

    urls.forEach(url => {
      xml += this.generateUrlEntry(url);
    });

    xml += '</urlset>';

    return xml;
  }

  /**
   * Generate single URL entry
   */
  private static generateUrlEntry(url: SitemapUrl): string {
    let entry = '  <url>\n';
    entry += `    <loc>${this.escapeXml(url.loc)}</loc>\n`;

    if (url.lastmod) {
      entry += `    <lastmod>${url.lastmod}</lastmod>\n`;
    }

    if (url.changefreq) {
      entry += `    <changefreq>${url.changefreq}</changefreq>\n`;
    }

    if (url.priority !== undefined) {
      entry += `    <priority>${url.priority.toFixed(1)}</priority>\n`;
    }

    // Add images
    if (url.images && url.images.length > 0) {
      url.images.forEach(image => {
        entry += '    <image:image>\n';
        entry += `      <image:loc>${this.escapeXml(image.loc)}</image:loc>\n`;
        if (image.caption) {
          entry += `      <image:caption>${this.escapeXml(image.caption)}</image:caption>\n`;
        }
        if (image.title) {
          entry += `      <image:title>${this.escapeXml(image.title)}</image:title>\n`;
        }
        if (image.license) {
          entry += `      <image:license>${this.escapeXml(image.license)}</image:license>\n`;
        }
        entry += '    </image:image>\n';
      });
    }

    // Add videos
    if (url.videos && url.videos.length > 0) {
      url.videos.forEach(video => {
        entry += '    <video:video>\n';
        entry += `      <video:thumbnail_loc>${this.escapeXml(video.thumbnail_loc)}</video:thumbnail_loc>\n`;
        entry += `      <video:title>${this.escapeXml(video.title)}</video:title>\n`;
        entry += `      <video:description>${this.escapeXml(video.description)}</video:description>\n`;
        
        if (video.content_loc) {
          entry += `      <video:content_loc>${this.escapeXml(video.content_loc)}</video:content_loc>\n`;
        }
        if (video.player_loc) {
          entry += `      <video:player_loc>${this.escapeXml(video.player_loc)}</video:player_loc>\n`;
        }
        if (video.duration) {
          entry += `      <video:duration>${video.duration}</video:duration>\n`;
        }
        if (video.publication_date) {
          entry += `      <video:publication_date>${video.publication_date}</video:publication_date>\n`;
        }
        
        entry += '    </video:video>\n';
      });
    }

    entry += '  </url>\n';

    return entry;
  }

  /**
   * Generate sitemap index (for multiple sitemaps)
   */
  static generateSitemapIndex(sitemaps: { loc: string; lastmod?: string }[]): string {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    sitemaps.forEach(sitemap => {
      xml += '  <sitemap>\n';
      xml += `    <loc>${this.escapeXml(sitemap.loc)}</loc>\n`;
      if (sitemap.lastmod) {
        xml += `    <lastmod>${sitemap.lastmod}</lastmod>\n`;
      }
      xml += '  </sitemap>\n';
    });

    xml += '</sitemapindex>';

    return xml;
  }

  /**
   * Split large sitemap into multiple files
   */
  static splitSitemap(urls: SitemapUrl[], maxUrlsPerSitemap: number = 50000): SitemapUrl[][] {
    const chunks: SitemapUrl[][] = [];
    
    for (let i = 0; i < urls.length; i += maxUrlsPerSitemap) {
      chunks.push(urls.slice(i, i + maxUrlsPerSitemap));
    }

    return chunks;
  }

  /**
   * Escape XML special characters
   */
  private static escapeXml(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&apos;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }

  /**
   * Format date for sitemap (W3C Datetime format)
   */
  static formatDate(date: Date): string {
    return date.toISOString();
  }

  /**
   * Generate news sitemap (Google News specific)
   */
  static generateNewsSitemap(articles: {
    loc: string;
    publication: { name: string; language: string };
    publication_date: string;
    title: string;
    keywords?: string;
  }[]): string {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
    xml += '        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n';

    articles.forEach(article => {
      xml += '  <url>\n';
      xml += `    <loc>${this.escapeXml(article.loc)}</loc>\n`;
      xml += '    <news:news>\n';
      xml += '      <news:publication>\n';
      xml += `        <news:name>${this.escapeXml(article.publication.name)}</news:name>\n`;
      xml += `        <news:language>${article.publication.language}</news:language>\n`;
      xml += '      </news:publication>\n';
      xml += `      <news:publication_date>${article.publication_date}</news:publication_date>\n`;
      xml += `      <news:title>${this.escapeXml(article.title)}</news:title>\n`;
      if (article.keywords) {
        xml += `      <news:keywords>${this.escapeXml(article.keywords)}</news:keywords>\n`;
      }
      xml += '    </news:news>\n';
      xml += '  </url>\n';
    });

    xml += '</urlset>';

    return xml;
  }
}

