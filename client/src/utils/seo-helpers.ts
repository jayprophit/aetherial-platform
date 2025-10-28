/**
 * AETHERIAL SEO Helper Functions
 * 
 * Frontend utilities for SEO optimization
 */

/**
 * Generate structured data for different content types
 */

export function generateArticleStructuredData(article: {
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified: string;
  author: { name: string; url?: string };
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.headline,
    description: article.description,
    image: article.image,
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    author: {
      '@type': 'Person',
      name: article.author.name,
      url: article.author.url
    },
    publisher: {
      '@type': 'Organization',
      name: 'AETHERIAL',
      logo: {
        '@type': 'ImageObject',
        url: `${window.location.origin}/images/logo.png`
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.url
    }
  };
}

export function generateProductStructuredData(product: {
  name: string;
  description: string;
  image: string;
  brand: string;
  sku: string;
  price: number;
  currency: string;
  availability: 'InStock' | 'OutOfStock' | 'PreOrder';
  url: string;
  rating?: {
    value: number;
    count: number;
  };
}) {
  const data: any = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    brand: {
      '@type': 'Brand',
      name: product.brand
    },
    sku: product.sku,
    offers: {
      '@type': 'Offer',
      url: product.url,
      priceCurrency: product.currency,
      price: product.price,
      availability: `https://schema.org/${product.availability}`
    }
  };

  if (product.rating) {
    data.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: product.rating.value,
      reviewCount: product.rating.count
    };
  }

  return data;
}

export function generateCourseStructuredData(course: {
  name: string;
  description: string;
  provider: string;
  price: number;
  currency: string;
  url: string;
  instructor?: string;
  duration?: string;
}) {
  const data: any = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.name,
    description: course.description,
    provider: {
      '@type': 'Organization',
      name: course.provider
    },
    offers: {
      '@type': 'Offer',
      url: course.url,
      priceCurrency: course.currency,
      price: course.price
    }
  };

  if (course.instructor) {
    data.instructor = {
      '@type': 'Person',
      name: course.instructor
    };
  }

  if (course.duration) {
    data.timeRequired = course.duration;
  }

  return data;
}

export function generateBreadcrumbStructuredData(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

export function generateOrganizationStructuredData() {
  const origin = window.location.origin;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'AETHERIAL',
    url: origin,
    logo: `${origin}/images/logo.png`,
    description: 'World-class platform combining social media, e-commerce, e-learning, job sourcing, asset trading, blockchain, and quantum AI',
    sameAs: [
      'https://facebook.com/aetherial',
      'https://twitter.com/aetherial',
      'https://linkedin.com/company/aetherial',
      'https://instagram.com/aetherial',
      'https://github.com/jayprophit/aetherial-platform'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'support@aetherial.com',
      availableLanguage: ['en', 'es', 'fr', 'de', 'zh']
    }
  };
}

export function generateWebsiteStructuredData() {
  const origin = window.location.origin;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'AETHERIAL',
    url: origin,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${origin}/search?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };
}

export function generateFAQStructuredData(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}

export function generateJobPostingStructuredData(job: {
  title: string;
  description: string;
  datePosted: string;
  validThrough: string;
  employmentType: string;
  hiringOrganization: { name: string; url: string };
  jobLocation: { address: string; city: string; country: string };
  baseSalary?: { currency: string; value: number; unitText: string };
}) {
  const data: any = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description,
    datePosted: job.datePosted,
    validThrough: job.validThrough,
    employmentType: job.employmentType,
    hiringOrganization: {
      '@type': 'Organization',
      name: job.hiringOrganization.name,
      sameAs: job.hiringOrganization.url
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        streetAddress: job.jobLocation.address,
        addressLocality: job.jobLocation.city,
        addressCountry: job.jobLocation.country
      }
    }
  };

  if (job.baseSalary) {
    data.baseSalary = {
      '@type': 'MonetaryAmount',
      currency: job.baseSalary.currency,
      value: {
        '@type': 'QuantitativeValue',
        value: job.baseSalary.value,
        unitText: job.baseSalary.unitText
      }
    };
  }

  return data;
}

/**
 * Optimize URL slug for SEO
 */
export function optimizeUrlSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 60);
}

/**
 * Generate meta description from content
 */
export function generateMetaDescription(content: string, maxLength: number = 160): string {
  // Remove HTML tags
  const text = content.replace(/<[^>]*>/g, '');
  
  // Trim to max length
  if (text.length <= maxLength) {
    return text;
  }
  
  // Find last complete sentence within limit
  const truncated = text.substring(0, maxLength);
  const lastPeriod = truncated.lastIndexOf('.');
  
  if (lastPeriod > maxLength * 0.7) {
    return truncated.substring(0, lastPeriod + 1);
  }
  
  // Find last complete word
  const lastSpace = truncated.lastIndexOf(' ');
  return truncated.substring(0, lastSpace) + '...';
}

/**
 * Extract keywords from content
 */
export function extractKeywords(content: string, maxKeywords: number = 10): string[] {
  // Remove HTML tags
  const text = content.replace(/<[^>]*>/g, '').toLowerCase();
  
  // Common stop words to exclude
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
    'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
    'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these',
    'those', 'it', 'its', 'they', 'them', 'their'
  ]);
  
  // Extract words
  const words = text.split(/\s+/).filter(word => 
    word.length > 3 && !stopWords.has(word) && /^[a-z]+$/.test(word)
  );
  
  // Count frequency
  const frequency = new Map<string, number>();
  words.forEach(word => {
    frequency.set(word, (frequency.get(word) || 0) + 1);
  });
  
  // Sort by frequency and return top keywords
  return Array.from(frequency.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxKeywords)
    .map(([word]) => word);
}

/**
 * Calculate reading time
 */
export function calculateReadingTime(content: string): number {
  const text = content.replace(/<[^>]*>/g, '');
  const words = text.split(/\s+/).length;
  const wordsPerMinute = 200;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Generate social sharing URLs
 */
export function generateSocialShareUrls(url: string, title: string, description?: string) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = description ? encodeURIComponent(description) : '';
  
  return {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`
  };
}

