/**
 * AETHERIAL Membership Tiers Configuration
 * 
 * Military-Grade Subscription System
 * 
 * Tiers:
 * - Free: Basic access
 * - Pro: Individual professionals
 * - Business: Small teams and businesses
 * - Enterprise: Large organizations
 * 
 * @module config/membership-tiers
 */

export interface MembershipTier {
  id: string;
  name: string;
  description: string;
  price: {
    monthly: number;
    yearly: number;
    yearlyDiscount: number;
  };
  features: {
    [key: string]: boolean | number | string;
  };
  limits: {
    storage: number; // GB
    apiCalls: number; // per month
    projects: number;
    teamMembers: number;
    courses: number;
    jobPostings: number;
    products: number;
    dropshippingProducts: number;
    aiRequests: number; // per month
    blockchainTransactions: number; // per month
    customDomain: boolean;
    whiteLabel: boolean;
    prioritySupport: boolean;
    dedicatedAccount: boolean;
  };
  permissions: string[];
}

/**
 * Membership Tiers Definition
 */
export const MEMBERSHIP_TIERS: Record<string, MembershipTier> = {
  free: {
    id: 'free',
    name: 'Free',
    description: 'Perfect for getting started and exploring the platform',
    price: {
      monthly: 0,
      yearly: 0,
      yearlyDiscount: 0
    },
    features: {
      'Basic Features': true,
      'Community Access': true,
      'Public Courses': true,
      'Job Search': true,
      'Basic Marketplace': true,
      'Social Networking': true,
      'Basic AI Assistant': true,
      'Standard Support': true
    },
    limits: {
      storage: 1, // 1 GB
      apiCalls: 1000,
      projects: 3,
      teamMembers: 1,
      courses: 5,
      jobPostings: 2,
      products: 10,
      dropshippingProducts: 5,
      aiRequests: 100,
      blockchainTransactions: 10,
      customDomain: false,
      whiteLabel: false,
      prioritySupport: false,
      dedicatedAccount: false
    },
    permissions: [
      'basic:read',
      'basic:write',
      'community:join',
      'courses:view',
      'jobs:search',
      'marketplace:browse'
    ]
  },
  
  pro: {
    id: 'pro',
    name: 'Pro',
    description: 'For professionals who need advanced features and more capacity',
    price: {
      monthly: 29,
      yearly: 290,
      yearlyDiscount: 17 // ~2 months free
    },
    features: {
      'Everything in Free': true,
      'Advanced AI Assistant': true,
      'CV Builder with Blockchain': true,
      'Drop Shipping Tools': true,
      'Advanced Analytics': true,
      'Priority Support': true,
      'Custom Branding': true,
      'API Access': true,
      'Export Data': true,
      'Remove Ads': true
    },
    limits: {
      storage: 50, // 50 GB
      apiCalls: 50000,
      projects: 25,
      teamMembers: 5,
      courses: 50,
      jobPostings: 20,
      products: 100,
      dropshippingProducts: 50,
      aiRequests: 5000,
      blockchainTransactions: 500,
      customDomain: true,
      whiteLabel: false,
      prioritySupport: true,
      dedicatedAccount: false
    },
    permissions: [
      'basic:read',
      'basic:write',
      'pro:read',
      'pro:write',
      'community:join',
      'community:create',
      'courses:view',
      'courses:create',
      'jobs:search',
      'jobs:post',
      'marketplace:browse',
      'marketplace:sell',
      'dropshipping:access',
      'analytics:advanced',
      'api:access',
      'export:data'
    ]
  },
  
  business: {
    id: 'business',
    name: 'Business',
    description: 'For teams and businesses that need collaboration and scalability',
    price: {
      monthly: 99,
      yearly: 990,
      yearlyDiscount: 17 // ~2 months free
    },
    features: {
      'Everything in Pro': true,
      'Team Collaboration': true,
      'Advanced Permissions': true,
      'White Label Options': true,
      'Dedicated Support': true,
      'SLA Guarantee': true,
      'Advanced Security': true,
      'Custom Integrations': true,
      'Bulk Operations': true,
      'Advanced Reporting': true,
      'Multi-Store Management': true
    },
    limits: {
      storage: 500, // 500 GB
      apiCalls: 500000,
      projects: 100,
      teamMembers: 25,
      courses: 200,
      jobPostings: 100,
      products: 1000,
      dropshippingProducts: 500,
      aiRequests: 50000,
      blockchainTransactions: 5000,
      customDomain: true,
      whiteLabel: true,
      prioritySupport: true,
      dedicatedAccount: true
    },
    permissions: [
      'basic:read',
      'basic:write',
      'pro:read',
      'pro:write',
      'business:read',
      'business:write',
      'community:join',
      'community:create',
      'community:moderate',
      'courses:view',
      'courses:create',
      'courses:manage',
      'jobs:search',
      'jobs:post',
      'jobs:manage',
      'marketplace:browse',
      'marketplace:sell',
      'marketplace:manage',
      'dropshipping:access',
      'dropshipping:advanced',
      'analytics:advanced',
      'analytics:custom',
      'api:access',
      'api:advanced',
      'export:data',
      'team:manage',
      'permissions:manage'
    ]
  },
  
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large organizations with custom needs and dedicated support',
    price: {
      monthly: 499,
      yearly: 4990,
      yearlyDiscount: 17 // ~2 months free
    },
    features: {
      'Everything in Business': true,
      'Unlimited Everything': true,
      'Custom Development': true,
      'Dedicated Infrastructure': true,
      'On-Premise Deployment': true,
      '24/7 Phone Support': true,
      'Custom SLA': true,
      'Security Audit': true,
      'Compliance Support': true,
      'Training & Onboarding': true,
      'Strategic Consulting': true,
      'Early Access to Features': true
    },
    limits: {
      storage: -1, // Unlimited
      apiCalls: -1, // Unlimited
      projects: -1, // Unlimited
      teamMembers: -1, // Unlimited
      courses: -1, // Unlimited
      jobPostings: -1, // Unlimited
      products: -1, // Unlimited
      dropshippingProducts: -1, // Unlimited
      aiRequests: -1, // Unlimited
      blockchainTransactions: -1, // Unlimited
      customDomain: true,
      whiteLabel: true,
      prioritySupport: true,
      dedicatedAccount: true
    },
    permissions: [
      'basic:read',
      'basic:write',
      'pro:read',
      'pro:write',
      'business:read',
      'business:write',
      'enterprise:read',
      'enterprise:write',
      'community:join',
      'community:create',
      'community:moderate',
      'community:admin',
      'courses:view',
      'courses:create',
      'courses:manage',
      'courses:admin',
      'jobs:search',
      'jobs:post',
      'jobs:manage',
      'jobs:admin',
      'marketplace:browse',
      'marketplace:sell',
      'marketplace:manage',
      'marketplace:admin',
      'dropshipping:access',
      'dropshipping:advanced',
      'dropshipping:admin',
      'analytics:advanced',
      'analytics:custom',
      'analytics:admin',
      'api:access',
      'api:advanced',
      'api:admin',
      'export:data',
      'team:manage',
      'team:admin',
      'permissions:manage',
      'permissions:admin',
      'platform:admin'
    ]
  }
};

/**
 * Get tier by ID
 */
export function getTier(tierId: string): MembershipTier | null {
  return MEMBERSHIP_TIERS[tierId] || null;
}

/**
 * Get all tiers
 */
export function getAllTiers(): MembershipTier[] {
  return Object.values(MEMBERSHIP_TIERS);
}

/**
 * Check if user has permission
 */
export function hasPermission(userTier: string, permission: string): boolean {
  const tier = getTier(userTier);
  if (!tier) return false;
  return tier.permissions.includes(permission);
}

/**
 * Check if user is within limits
 */
export function isWithinLimit(
  userTier: string,
  limitType: keyof MembershipTier['limits'],
  currentUsage: number
): boolean {
  const tier = getTier(userTier);
  if (!tier) return false;
  
  const limit = tier.limits[limitType];
  
  // -1 means unlimited
  if (typeof limit === 'number' && limit === -1) return true;
  
  // Boolean limits
  if (typeof limit === 'boolean') return limit;
  
  // Numeric limits
  if (typeof limit === 'number') return currentUsage < limit;
  
  return false;
}

/**
 * Get remaining quota
 */
export function getRemainingQuota(
  userTier: string,
  limitType: keyof MembershipTier['limits'],
  currentUsage: number
): number | 'unlimited' {
  const tier = getTier(userTier);
  if (!tier) return 0;
  
  const limit = tier.limits[limitType];
  
  // -1 means unlimited
  if (typeof limit === 'number' && limit === -1) return 'unlimited';
  
  // Numeric limits
  if (typeof limit === 'number') {
    const remaining = limit - currentUsage;
    return remaining > 0 ? remaining : 0;
  }
  
  return 0;
}

/**
 * Compare tiers (returns true if tier1 >= tier2)
 */
export function compareTiers(tier1: string, tier2: string): boolean {
  const tierOrder = ['free', 'pro', 'business', 'enterprise'];
  const index1 = tierOrder.indexOf(tier1);
  const index2 = tierOrder.indexOf(tier2);
  
  if (index1 === -1 || index2 === -1) return false;
  
  return index1 >= index2;
}

/**
 * Get upgrade path
 */
export function getUpgradePath(currentTier: string): MembershipTier[] {
  const tierOrder = ['free', 'pro', 'business', 'enterprise'];
  const currentIndex = tierOrder.indexOf(currentTier);
  
  if (currentIndex === -1 || currentIndex === tierOrder.length - 1) {
    return [];
  }
  
  return tierOrder
    .slice(currentIndex + 1)
    .map(tierId => getTier(tierId))
    .filter((tier): tier is MembershipTier => tier !== null);
}

export default MEMBERSHIP_TIERS;

