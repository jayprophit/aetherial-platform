/**
 * Component Registry - Central system for integrating all existing components
 * This allows us to dynamically load and use the 418 existing components
 */

import { lazy, ComponentType } from 'react';

export interface ComponentMetadata {
  id: string;
  name: string;
  category: string;
  description: string;
  path: string;
  props?: Record<string, any>;
}

// Component categories from the Aetherial repository
export const COMPONENT_CATEGORIES = {
  AI: 'ai',
  BLOCKCHAIN: 'blockchain',
  BUDDYBOSS: 'buddyboss',
  BUSINESS: 'business',
  CHAT: 'chat',
  ECOMMERCE: 'ecommerce',
  ELEARNING: 'elearning',
  EVENTS: 'events',
  GAMIFICATION: 'gamification',
  JOBS: 'jobs',
  SOCIAL: 'social',
  TRADING: 'trading',
  IOT: 'iot',
  ROBOTICS: 'robotics',
  QUANTUM: 'quantum',
  HEALTHCARE: 'healthcare',
} as const;

// Component Registry - Maps component IDs to their implementations
class ComponentRegistryClass {
  private components: Map<string, ComponentMetadata> = new Map();
  private loadedComponents: Map<string, ComponentType<any>> = new Map();

  /**
   * Register a component in the registry
   */
  register(metadata: ComponentMetadata): void {
    this.components.set(metadata.id, metadata);
  }

  /**
   * Register multiple components at once
   */
  registerBulk(components: ComponentMetadata[]): void {
    components.forEach(comp => this.register(comp));
  }

  /**
   * Get component metadata by ID
   */
  getMetadata(id: string): ComponentMetadata | undefined {
    return this.components.get(id);
  }

  /**
   * Get all components in a category
   */
  getByCategory(category: string): ComponentMetadata[] {
    return Array.from(this.components.values()).filter(
      comp => comp.category === category
    );
  }

  /**
   * Lazy load a component by ID
   */
  loadComponent(id: string): ComponentType<any> | null {
    // Check if already loaded
    if (this.loadedComponents.has(id)) {
      return this.loadedComponents.get(id)!;
    }

    const metadata = this.getMetadata(id);
    if (!metadata) {
      console.error(`Component ${id} not found in registry`);
      return null;
    }

    // Lazy load the component
    try {
      const LazyComponent = lazy(() => import(`../components/imported/${metadata.path}`));
      this.loadedComponents.set(id, LazyComponent);
      return LazyComponent;
    } catch (error) {
      console.error(`Failed to load component ${id}:`, error);
      return null;
    }
  }

  /**
   * Search components by name or description
   */
  search(query: string): ComponentMetadata[] {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.components.values()).filter(
      comp =>
        comp.name.toLowerCase().includes(lowerQuery) ||
        comp.description.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Get all registered components
   */
  getAll(): ComponentMetadata[] {
    return Array.from(this.components.values());
  }

  /**
   * Get component count
   */
  getCount(): number {
    return this.components.size;
  }

  /**
   * Get component count by category
   */
  getCountByCategory(): Record<string, number> {
    const counts: Record<string, number> = {};
    this.components.forEach(comp => {
      counts[comp.category] = (counts[comp.category] || 0) + 1;
    });
    return counts;
  }
}

// Export singleton instance
export const ComponentRegistry = new ComponentRegistryClass();

// Register all existing components from Aetherial repository
export function registerExistingComponents(): void {
  // AI Components
  ComponentRegistry.registerBulk([
    {
      id: 'ai-chatbot',
      name: 'AI Chatbot',
      category: COMPONENT_CATEGORIES.AI,
      description: 'Intelligent chatbot with NLP capabilities',
      path: 'ai/AIComponents',
    },
    {
      id: 'ai-assistant',
      name: 'AI Assistant',
      category: COMPONENT_CATEGORIES.AI,
      description: 'Personal AI assistant interface',
      path: 'ai/AIComponents',
    },
  ]);

  // Blockchain Components
  ComponentRegistry.registerBulk([
    {
      id: 'blockchain-wallet',
      name: 'Blockchain Wallet',
      category: COMPONENT_CATEGORIES.BLOCKCHAIN,
      description: 'Multi-chain cryptocurrency wallet',
      path: 'blockchain/BlockchainComponents',
    },
    {
      id: 'nft-marketplace',
      name: 'NFT Marketplace',
      category: COMPONENT_CATEGORIES.BLOCKCHAIN,
      description: 'NFT trading and marketplace',
      path: 'blockchain/BlockchainComponents',
    },
  ]);

  // BuddyBoss/Social Components
  ComponentRegistry.registerBulk([
    {
      id: 'social-feed',
      name: 'Social Feed',
      category: COMPONENT_CATEGORIES.SOCIAL,
      description: 'Activity feed with posts and interactions',
      path: 'social/BuddyBossComponents',
    },
    {
      id: 'social-groups',
      name: 'Social Groups',
      category: COMPONENT_CATEGORIES.SOCIAL,
      description: 'Community groups and discussions',
      path: 'social/BuddyBossComponents',
    },
  ]);

  // E-Commerce Components
  ComponentRegistry.registerBulk([
    {
      id: 'product-catalog',
      name: 'Product Catalog',
      category: COMPONENT_CATEGORIES.ECOMMERCE,
      description: 'Product listing and browsing',
      path: 'ecommerce/EcommerceComponents',
    },
    {
      id: 'shopping-cart',
      name: 'Shopping Cart',
      category: COMPONENT_CATEGORIES.ECOMMERCE,
      description: 'Shopping cart and checkout',
      path: 'ecommerce/EcommerceComponents',
    },
  ]);

  // E-Learning Components
  ComponentRegistry.registerBulk([
    {
      id: 'course-catalog',
      name: 'Course Catalog',
      category: COMPONENT_CATEGORIES.ELEARNING,
      description: 'Browse and enroll in courses',
      path: 'elearning/ElearningComponents',
    },
    {
      id: 'course-player',
      name: 'Course Player',
      category: COMPONENT_CATEGORIES.ELEARNING,
      description: 'Video course player with progress tracking',
      path: 'elearning/ElearningComponents',
    },
  ]);

  // Chat Components
  ComponentRegistry.registerBulk([
    {
      id: 'chat-interface',
      name: 'Chat Interface',
      category: COMPONENT_CATEGORIES.CHAT,
      description: 'Real-time messaging interface',
      path: 'chat/ChatComponents',
    },
  ]);

  // Event Components
  ComponentRegistry.registerBulk([
    {
      id: 'event-calendar',
      name: 'Event Calendar',
      category: COMPONENT_CATEGORIES.EVENTS,
      description: 'Event calendar and scheduling',
      path: 'events/EventComponents',
    },
  ]);

  // Business Components
  ComponentRegistry.registerBulk([
    {
      id: 'business-dashboard',
      name: 'Business Dashboard',
      category: COMPONENT_CATEGORIES.BUSINESS,
      description: 'Business analytics and management',
      path: 'business/BusinessComponents',
    },
  ]);

  // Gamification Components
  ComponentRegistry.registerBulk([
    {
      id: 'rewards-system',
      name: 'Rewards System',
      category: COMPONENT_CATEGORIES.GAMIFICATION,
      description: 'Points, badges, and rewards',
      path: 'gamification/GamificationComponents',
    },
  ]);

  console.log(`Registered ${ComponentRegistry.getCount()} components`);
  console.log('Components by category:', ComponentRegistry.getCountByCategory());
}

// Auto-register on import
registerExistingComponents();

