/**
 * AETHERIAL Platform Routes Configuration
 * 
 * Complete route structure based on Figma menu design
 * Military-Grade routing with authentication guards
 */

export interface RouteConfig {
  path: string;
  name: string;
  component: string;
  requiresAuth?: boolean;
  requiresAdmin?: boolean;
  requiresOwner?: boolean;
  icon?: string;
  description?: string;
  category?: string;
}

/**
 * Complete route configuration
 * All 100+ routes from Figma design
 */
export const routes: RouteConfig[] = [
  // ============================================
  // CORE PAGES
  // ============================================
  { path: '/', name: 'Home', component: 'Home', icon: '🏠' },
  { path: '/dashboard', name: 'Dashboard', component: 'Dashboard', requiresAuth: true, icon: '📊' },
  { path: '/login', name: 'Login', component: 'Login', icon: '🔐' },
  { path: '/register', name: 'Register', component: 'Register', icon: '📝' },
  { path: '/profile', name: 'Profile', component: 'Profile', requiresAuth: true, icon: '👤' },
  { path: '/settings', name: 'Settings', component: 'Settings', requiresAuth: true, icon: '⚙️' },
  
  // ============================================
  // EDUCATION HUB
  // ============================================
  { path: '/education', name: 'Education Hub', component: 'Learning', category: 'education', icon: '🎓' },
  { path: '/education/courses', name: 'Browse Courses', component: 'education/Courses', category: 'education' },
  { path: '/education/my-courses', name: 'My Courses', component: 'education/MyCourses', requiresAuth: true, category: 'education' },
  { path: '/education/create-course', name: 'Create Course', component: 'education/CreateCourse', requiresAuth: true, category: 'education' },
  { path: '/education/course/:id', name: 'Course Details', component: 'education/CourseDetails', category: 'education' },
  { path: '/education/course/:id/learn', name: 'Learn Course', component: 'education/LearnCourse', requiresAuth: true, category: 'education' },
  { path: '/education/certificates', name: 'Certificates', component: 'education/Certificates', requiresAuth: true, category: 'education' },
  { path: '/education/instructors', name: 'Instructors', component: 'education/Instructors', category: 'education' },
  { path: '/education/categories', name: 'Categories', component: 'education/Categories', category: 'education' },
  { path: '/education/live-classes', name: 'Live Classes', component: 'education/LiveClasses', category: 'education' },
  { path: '/education/study-groups', name: 'Study Groups', component: 'education/StudyGroups', category: 'education' },
  { path: '/education/quizzes', name: 'Quizzes', component: 'education/Quizzes', requiresAuth: true, category: 'education' },
  { path: '/education/assignments', name: 'Assignments', component: 'education/Assignments', requiresAuth: true, category: 'education' },
  { path: '/education/progress', name: 'Learning Progress', component: 'education/Progress', requiresAuth: true, category: 'education' },
  
  // ============================================
  // JOB PLATFORM
  // ============================================
  { path: '/jobs', name: 'Job Marketplace', component: 'Jobs', category: 'jobs', icon: '💼' },
  { path: '/jobs/browse', name: 'Browse Jobs', component: 'jobs/BrowseJobs', category: 'jobs' },
  { path: '/jobs/post', name: 'Post Job', component: 'jobs/PostJob', requiresAuth: true, category: 'jobs' },
  { path: '/jobs/my-jobs', name: 'My Jobs', component: 'jobs/MyJobs', requiresAuth: true, category: 'jobs' },
  { path: '/jobs/applications', name: 'Applications', component: 'jobs/Applications', requiresAuth: true, category: 'jobs' },
  { path: '/jobs/saved', name: 'Saved Jobs', component: 'jobs/SavedJobs', requiresAuth: true, category: 'jobs' },
  { path: '/jobs/companies', name: 'Companies', component: 'jobs/Companies', category: 'jobs' },
  { path: '/jobs/cv-builder', name: 'CV Builder', component: 'jobs/CVBuilder', requiresAuth: true, category: 'jobs' },
  { path: '/jobs/cover-letter', name: 'Cover Letter', component: 'jobs/CoverLetter', requiresAuth: true, category: 'jobs' },
  { path: '/jobs/interview-prep', name: 'Interview Prep', component: 'jobs/InterviewPrep', category: 'jobs' },
  { path: '/jobs/salary-calculator', name: 'Salary Calculator', component: 'jobs/SalaryCalculator', category: 'jobs' },
  { path: '/jobs/career-path', name: 'Career Path', component: 'jobs/CareerPath', requiresAuth: true, category: 'jobs' },
  { path: '/jobs/skills', name: 'Skills Assessment', component: 'jobs/Skills', requiresAuth: true, category: 'jobs' },
  
  // ============================================
  // MARKETPLACE
  // ============================================
  { path: '/marketplace', name: 'Marketplace', component: 'Marketplace', category: 'marketplace', icon: '🛒' },
  { path: '/marketplace/browse', name: 'Browse Products', component: 'marketplace/BrowseProducts', category: 'marketplace' },
  { path: '/marketplace/sell', name: 'Sell Product', component: 'marketplace/SellProduct', requiresAuth: true, category: 'marketplace' },
  { path: '/marketplace/my-products', name: 'My Products', component: 'marketplace/MyProducts', requiresAuth: true, category: 'marketplace' },
  { path: '/marketplace/orders', name: 'Orders', component: 'marketplace/Orders', requiresAuth: true, category: 'marketplace' },
  { path: '/marketplace/cart', name: 'Shopping Cart', component: 'marketplace/Cart', category: 'marketplace' },
  { path: '/marketplace/wishlist', name: 'Wishlist', component: 'marketplace/Wishlist', requiresAuth: true, category: 'marketplace' },
  { path: '/marketplace/categories', name: 'Categories', component: 'marketplace/Categories', category: 'marketplace' },
  { path: '/marketplace/deals', name: 'Deals & Offers', component: 'marketplace/Deals', category: 'marketplace' },
  { path: '/marketplace/drop-shipping', name: 'Drop Shipping', component: 'marketplace/DropShipping', requiresAuth: true, category: 'marketplace' },
  { path: '/marketplace/seller-dashboard', name: 'Seller Dashboard', component: 'marketplace/SellerDashboard', requiresAuth: true, category: 'marketplace' },
  { path: '/marketplace/reviews', name: 'Reviews', component: 'marketplace/Reviews', category: 'marketplace' },
  { path: '/marketplace/shipping', name: 'Shipping', component: 'marketplace/Shipping', requiresAuth: true, category: 'marketplace' },
  
  // ============================================
  // SOCIAL NETWORK
  // ============================================
  { path: '/social', name: 'Social Network', component: 'Home', category: 'social', icon: '👥' },
  { path: '/social/feed', name: 'News Feed', component: 'social/Feed', requiresAuth: true, category: 'social' },
  { path: '/social/friends', name: 'Friends', component: 'Friends', requiresAuth: true, category: 'social' },
  { path: '/social/groups', name: 'Groups', component: 'Groups', category: 'social' },
  { path: '/social/events', name: 'Events', component: 'Events', category: 'social' },
  { path: '/social/messages', name: 'Messages', component: 'Messages', requiresAuth: true, category: 'social' },
  { path: '/social/notifications', name: 'Notifications', component: 'social/Notifications', requiresAuth: true, category: 'social' },
  { path: '/social/pages', name: 'Pages', component: 'social/Pages', category: 'social' },
  { path: '/social/communities', name: 'Communities', component: 'social/Communities', category: 'social' },
  { path: '/social/live', name: 'Live Streaming', component: 'social/LiveStreaming', category: 'social' },
  { path: '/social/stories', name: 'Stories', component: 'social/Stories', requiresAuth: true, category: 'social' },
  { path: '/social/photos', name: 'Photos', component: 'social/Photos', requiresAuth: true, category: 'social' },
  { path: '/social/videos', name: 'Videos', component: 'social/Videos', category: 'social' },
  
  // ============================================
  // FINANCE & TRADING
  // ============================================
  { path: '/finance', name: 'Finance Hub', component: 'finance/FinanceHub', category: 'finance', icon: '💰' },
  { path: '/finance/wallet', name: 'Wallet', component: 'Wallet', requiresAuth: true, category: 'finance' },
  { path: '/finance/trading', name: 'Trading', component: 'Trading', requiresAuth: true, category: 'finance' },
  { path: '/finance/portfolio', name: 'Portfolio', component: 'finance/Portfolio', requiresAuth: true, category: 'finance' },
  { path: '/finance/transactions', name: 'Transactions', component: 'finance/Transactions', requiresAuth: true, category: 'finance' },
  { path: '/finance/staking', name: 'Staking', component: 'finance/Staking', requiresAuth: true, category: 'finance' },
  { path: '/finance/mining', name: 'Mining Pool', component: 'finance/Mining', requiresAuth: true, category: 'finance' },
  { path: '/finance/nft', name: 'NFT Marketplace', component: 'NFTMarketplace', category: 'finance' },
  { path: '/finance/defi', name: 'DeFi', component: 'finance/DeFi', category: 'finance' },
  { path: '/finance/analytics', name: 'Analytics', component: 'finance/Analytics', requiresAuth: true, category: 'finance' },
  { path: '/finance/charts', name: 'Charts', component: 'finance/Charts', category: 'finance' },
  { path: '/finance/alerts', name: 'Price Alerts', component: 'finance/Alerts', requiresAuth: true, category: 'finance' },
  
  // ============================================
  // BLOCKCHAIN
  // ============================================
  { path: '/blockchain', name: 'Blockchain', component: 'blockchain/BlockchainHub', category: 'blockchain', icon: '⛓️' },
  { path: '/blockchain/explorer', name: 'Block Explorer', component: 'blockchain/Explorer', category: 'blockchain' },
  { path: '/blockchain/contracts', name: 'Smart Contracts', component: 'blockchain/Contracts', category: 'blockchain' },
  { path: '/blockchain/deploy', name: 'Deploy Contract', component: 'blockchain/DeployContract', requiresAuth: true, category: 'blockchain' },
  { path: '/blockchain/verify', name: 'Verify Contract', component: 'blockchain/VerifyContract', category: 'blockchain' },
  { path: '/blockchain/tokens', name: 'Tokens', component: 'blockchain/Tokens', category: 'blockchain' },
  { path: '/blockchain/governance', name: 'Governance', component: 'Governance', category: 'blockchain' },
  { path: '/blockchain/validators', name: 'Validators', component: 'blockchain/Validators', category: 'blockchain' },
  
  // ============================================
  // AI & DEVELOPMENT
  // ============================================
  { path: '/ai', name: 'AI Tools', component: 'AITools', category: 'dev-tools', icon: '🤖' },
  { path: '/ai/assistant', name: 'AI Assistant', component: 'AIAssistant', category: 'dev-tools' },
  { path: '/ai/agents', name: 'AI Agents', component: 'AIAgents', category: 'dev-tools' },
  { path: '/ai/models', name: 'AI Models', component: 'dev-tools/AIModels', category: 'dev-tools' },
  { path: '/ai/training', name: 'Model Training', component: 'dev-tools/ModelTraining', requiresAuth: true, category: 'dev-tools' },
  { path: '/dev/code-editor', name: 'Code Editor', component: 'dev-tools/CodeEditor', requiresAuth: true, category: 'dev-tools' },
  { path: '/dev/api-docs', name: 'API Documentation', component: 'dev-tools/APIDocs', category: 'dev-tools' },
  { path: '/dev/webhooks', name: 'Webhooks', component: 'dev-tools/Webhooks', requiresAuth: true, category: 'dev-tools' },
  { path: '/dev/playground', name: 'API Playground', component: 'dev-tools/Playground', category: 'dev-tools' },
  
  // ============================================
  // CONTENT & MEDIA
  // ============================================
  { path: '/blog', name: 'Blog', component: 'Blog', category: 'content', icon: '📝' },
  { path: '/blog/create', name: 'Create Post', component: 'blog/CreatePost', requiresAuth: true, category: 'content' },
  { path: '/blog/my-posts', name: 'My Posts', component: 'blog/MyPosts', requiresAuth: true, category: 'content' },
  { path: '/podcast', name: 'Podcasts', component: 'content/Podcasts', category: 'content' },
  { path: '/rss', name: 'RSS Feeds', component: 'content/RSS', category: 'content' },
  { path: '/media', name: 'Media Library', component: 'content/MediaLibrary', requiresAuth: true, category: 'content' },
  
  // ============================================
  // PRODUCTIVITY
  // ============================================
  { path: '/calendar', name: 'Calendar', component: 'productivity/Calendar', requiresAuth: true, category: 'productivity', icon: '📅' },
  { path: '/tasks', name: 'Tasks', component: 'productivity/Tasks', requiresAuth: true, category: 'productivity' },
  { path: '/kanban', name: 'Kanban Board', component: 'productivity/Kanban', requiresAuth: true, category: 'productivity' },
  { path: '/notes', name: 'Notes', component: 'productivity/Notes', requiresAuth: true, category: 'productivity' },
  { path: '/wiki', name: 'Wiki', component: 'productivity/Wiki', category: 'productivity' },
  { path: '/files', name: 'File Manager', component: 'productivity/FileManager', requiresAuth: true, category: 'productivity' },
  { path: '/forms', name: 'Forms', component: 'productivity/Forms', category: 'productivity' },
  
  // ============================================
  // BUSINESS TOOLS
  // ============================================
  { path: '/business', name: 'Business Hub', component: 'BusinessDashboard', requiresAuth: true, category: 'business', icon: '📊' },
  { path: '/business/analytics', name: 'Analytics', component: 'AnalyticsDashboard', requiresAuth: true, category: 'business' },
  { path: '/business/crm', name: 'CRM', component: 'business/CRM', requiresAuth: true, category: 'business' },
  { path: '/business/invoicing', name: 'Invoicing', component: 'business/Invoicing', requiresAuth: true, category: 'business' },
  { path: '/business/accounting', name: 'Accounting', component: 'business/Accounting', requiresAuth: true, category: 'business' },
  { path: '/business/team', name: 'Team Management', component: 'business/TeamManagement', requiresAuth: true, category: 'business' },
  { path: '/business/projects', name: 'Projects', component: 'business/Projects', requiresAuth: true, category: 'business' },
  
  // ============================================
  // SETTINGS & ACCOUNT
  // ============================================
  { path: '/settings/profile', name: 'Profile Settings', component: 'settings/ProfileSettings', requiresAuth: true, category: 'settings' },
  { path: '/settings/account', name: 'Account Settings', component: 'settings/AccountSettings', requiresAuth: true, category: 'settings' },
  { path: '/settings/privacy', name: 'Privacy Settings', component: 'settings/PrivacySettings', requiresAuth: true, category: 'settings' },
  { path: '/settings/security', name: 'Security Settings', component: 'settings/SecuritySettings', requiresAuth: true, category: 'settings' },
  { path: '/settings/notifications', name: 'Notification Settings', component: 'settings/NotificationSettings', requiresAuth: true, category: 'settings' },
  { path: '/settings/billing', name: 'Billing', component: 'billing/Billing', requiresAuth: true, category: 'settings' },
  { path: '/settings/subscription', name: 'Subscription', component: 'billing/Subscription', requiresAuth: true, category: 'settings' },
  { path: '/settings/api-keys', name: 'API Keys', component: 'settings/APIKeys', requiresAuth: true, category: 'settings' },
  
  // ============================================
  // HELP & SUPPORT
  // ============================================
  { path: '/help', name: 'Help Center', component: 'help/HelpCenter', category: 'help', icon: '❓' },
  { path: '/help/faq', name: 'FAQ', component: 'help/FAQ', category: 'help' },
  { path: '/help/docs', name: 'Documentation', component: 'DocPage', category: 'help' },
  { path: '/help/tutorials', name: 'Tutorials', component: 'help/Tutorials', category: 'help' },
  { path: '/help/support', name: 'Support', component: 'help/Support', category: 'help' },
  { path: '/help/contact', name: 'Contact Us', component: 'help/Contact', category: 'help' },
  { path: '/help/bug-bounty', name: 'Bug Bounty', component: 'BugBounty', category: 'help' },
  
  // ============================================
  // ADMIN & OWNER
  // ============================================
  { path: '/admin', name: 'Admin Panel', component: 'Admin', requiresAdmin: true, category: 'admin', icon: '🔧' },
  { path: '/admin/users', name: 'User Management', component: 'admin/UserManagement', requiresAdmin: true, category: 'admin' },
  { path: '/admin/content', name: 'Content Moderation', component: 'admin/ContentModeration', requiresAdmin: true, category: 'admin' },
  { path: '/admin/reports', name: 'Reports', component: 'admin/Reports', requiresAdmin: true, category: 'admin' },
  { path: '/admin/audit-logs', name: 'Audit Logs', component: 'AuditLogs', requiresAdmin: true, category: 'admin' },
  { path: '/owner', name: 'Owner Portal', component: 'OwnerPortal', requiresOwner: true, category: 'admin' },
  { path: '/owner/health', name: 'System Health', component: 'HealthDashboard', requiresOwner: true, category: 'admin' },
  
  // ============================================
  // SPECIAL PAGES
  // ============================================
  { path: '/search', name: 'Search', component: 'SearchResults', icon: '🔍' },
  { path: '/world', name: '3D World', component: 'World', icon: '🌍' },
  { path: '/iot', name: 'IoT Dashboard', component: 'IoT', requiresAuth: true, icon: '📡' },
  { path: '/robotics', name: 'Robotics', component: 'Robotics', requiresAuth: true, icon: '🤖' },
  { path: '*', name: 'Not Found', component: 'NotFound' }
];

/**
 * Get routes by category
 */
export const getRoutesByCategory = (category: string): RouteConfig[] => {
  return routes.filter(route => route.category === category);
};

/**
 * Get route by path
 */
export const getRouteByPath = (path: string): RouteConfig | undefined => {
  return routes.find(route => route.path === path);
};

/**
 * Check if route requires authentication
 */
export const requiresAuth = (path: string): boolean => {
  const route = getRouteByPath(path);
  return route?.requiresAuth || route?.requiresAdmin || route?.requiresOwner || false;
};

/**
 * Check if route requires admin
 */
export const requiresAdmin = (path: string): boolean => {
  const route = getRouteByPath(path);
  return route?.requiresAdmin || route?.requiresOwner || false;
};

/**
 * Check if route requires owner
 */
export const requiresOwner = (path: string): boolean => {
  const route = getRouteByPath(path);
  return route?.requiresOwner || false;
};

export default routes;

