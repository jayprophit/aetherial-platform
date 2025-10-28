/**
 * AETHERIAL Breadcrumbs
 * 
 * Military-Grade Breadcrumb Navigation
 * - Automatic path generation
 * - Custom labels
 * - Icon support
 * - Accessible
 * 
 * @module components/Breadcrumbs
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Breadcrumbs.css';

/**
 * Breadcrumb item interface
 */
export interface BreadcrumbItem {
  label: string;
  path: string;
  icon?: string;
}

/**
 * Breadcrumbs Props
 */
export interface BreadcrumbsProps {
  /** Custom breadcrumb items (overrides automatic generation) */
  items?: BreadcrumbItem[];
  
  /** Custom labels for paths */
  labels?: Record<string, string>;
  
  /** Show home icon */
  showHome?: boolean;
  
  /** Maximum items to show before collapsing */
  maxItems?: number;
  
  /** Additional CSS classes */
  className?: string;
}

/**
 * Default labels for common paths
 */
const defaultLabels: Record<string, string> = {
  '': 'Home',
  'dashboard': 'Dashboard',
  'education': 'Education',
  'jobs': 'Jobs',
  'marketplace': 'Marketplace',
  'social': 'Social',
  'finance': 'Finance',
  'blockchain': 'Blockchain',
  'ai': 'AI Tools',
  'dev': 'Developer',
  'blog': 'Blog',
  'business': 'Business',
  'settings': 'Settings',
  'help': 'Help',
  'admin': 'Admin',
  'owner': 'Owner',
  'profile': 'Profile',
  'courses': 'Courses',
  'my-courses': 'My Courses',
  'create-course': 'Create Course',
  'browse': 'Browse',
  'post': 'Post',
  'my-jobs': 'My Jobs',
  'applications': 'Applications',
  'saved': 'Saved',
  'companies': 'Companies',
  'cv-builder': 'CV Builder',
  'wallet': 'Wallet',
  'trading': 'Trading',
  'portfolio': 'Portfolio',
  'transactions': 'Transactions',
  'staking': 'Staking',
  'mining': 'Mining',
  'nft': 'NFT',
  'defi': 'DeFi',
  'explorer': 'Explorer',
  'contracts': 'Contracts',
  'feed': 'Feed',
  'friends': 'Friends',
  'groups': 'Groups',
  'events': 'Events',
  'messages': 'Messages',
  'notifications': 'Notifications',
  'assistant': 'Assistant',
  'agents': 'Agents',
  'models': 'Models',
  'calendar': 'Calendar',
  'tasks': 'Tasks',
  'notes': 'Notes',
  'files': 'Files'
};

/**
 * Convert path segment to label
 */
const pathToLabel = (segment: string, customLabels?: Record<string, string>): string => {
  // Check custom labels first
  if (customLabels?.[segment]) {
    return customLabels[segment];
  }
  
  // Check default labels
  if (defaultLabels[segment]) {
    return defaultLabels[segment];
  }
  
  // Convert kebab-case to Title Case
  return segment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Generate breadcrumb items from current path
 */
const generateBreadcrumbs = (
  pathname: string,
  customLabels?: Record<string, string>
): BreadcrumbItem[] => {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];
  
  let currentPath = '';
  
  for (const segment of segments) {
    currentPath += `/${segment}`;
    
    // Skip dynamic route segments (e.g., :id)
    if (segment.startsWith(':')) continue;
    
    // Skip UUID-like segments
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(segment)) {
      continue;
    }
    
    // Skip numeric IDs
    if (/^\d+$/.test(segment)) {
      continue;
    }
    
    breadcrumbs.push({
      label: pathToLabel(segment, customLabels),
      path: currentPath
    });
  }
  
  return breadcrumbs;
};

/**
 * Breadcrumbs Component
 * 
 * Displays breadcrumb navigation based on current route.
 * Automatically generates breadcrumbs from URL path.
 * 
 * @example
 * ```tsx
 * // Automatic breadcrumbs
 * <Breadcrumbs />
 * 
 * // Custom labels
 * <Breadcrumbs
 *   labels={{
 *     'my-courses': 'My Learning',
 *     'create-course': 'New Course'
 *   }}
 * />
 * 
 * // Custom items
 * <Breadcrumbs
 *   items={[
 *     { label: 'Home', path: '/' },
 *     { label: 'Courses', path: '/education/courses' },
 *     { label: 'React Advanced', path: '/education/course/123' }
 *   ]}
 * />
 * ```
 */
export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  labels,
  showHome = true,
  maxItems = 5,
  className = ''
}) => {
  const location = useLocation();
  
  // Generate breadcrumbs
  const breadcrumbs = items || generateBreadcrumbs(location.pathname, labels);
  
  // Add home breadcrumb if needed
  const allBreadcrumbs: BreadcrumbItem[] = showHome
    ? [{ label: 'Home', path: '/', icon: '🏠' }, ...breadcrumbs]
    : breadcrumbs;
  
  // Handle collapsing if too many items
  let displayBreadcrumbs = allBreadcrumbs;
  let collapsed = false;
  
  if (allBreadcrumbs.length > maxItems) {
    collapsed = true;
    displayBreadcrumbs = [
      allBreadcrumbs[0],
      { label: '...', path: '#', icon: '⋯' },
      ...allBreadcrumbs.slice(-(maxItems - 2))
    ];
  }
  
  // Don't render if only home
  if (allBreadcrumbs.length <= 1 && showHome) {
    return null;
  }
  
  return (
    <nav
      className={`breadcrumbs ${className}`}
      aria-label="Breadcrumb"
    >
      <ol className="breadcrumbs-list">
        {displayBreadcrumbs.map((item, index) => {
          const isLast = index === displayBreadcrumbs.length - 1;
          const isCollapsed = item.label === '...';
          
          return (
            <li key={item.path} className="breadcrumbs-item">
              {!isLast && !isCollapsed ? (
                <>
                  <Link
                    to={item.path}
                    className="breadcrumbs-link"
                  >
                    {item.icon && (
                      <span className="breadcrumbs-icon">{item.icon}</span>
                    )}
                    <span className="breadcrumbs-label">{item.label}</span>
                  </Link>
                  <span className="breadcrumbs-separator" aria-hidden="true">
                    /
                  </span>
                </>
              ) : isCollapsed ? (
                <>
                  <span className="breadcrumbs-collapsed">
                    <span className="breadcrumbs-icon">{item.icon}</span>
                  </span>
                  <span className="breadcrumbs-separator" aria-hidden="true">
                    /
                  </span>
                </>
              ) : (
                <span className="breadcrumbs-current" aria-current="page">
                  {item.icon && (
                    <span className="breadcrumbs-icon">{item.icon}</span>
                  )}
                  <span className="breadcrumbs-label">{item.label}</span>
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;

