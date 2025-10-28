/**
 * AETHERIAL Platform - Reorganized Menu Structure
 * 
 * Features:
 * - Left sidebar: Main menu (collapsible with icons)
 * - Top bar: Context-sensitive submenu (changes based on main menu selection)
 * - All items have SVG icons
 * - Overflow menu (3 dots) for responsive design
 */

export interface MenuItem {
  id: string;
  label: string;
  icon: string; // SVG icon name
  path?: string;
  badge?: number;
  children?: MenuItem[];
  topBarActions?: TopBarAction[]; // Context-sensitive actions for top bar
}

export interface TopBarAction {
  id: string;
  label: string;
  icon: string;
  action: string;
  priority: number; // Lower = higher priority (shows first)
}

/**
 * MAIN MENU STRUCTURE (Left Sidebar)
 * Organized by logical groupings
 */
export const mainMenu: MenuItem[] = [
  // ============================================
  // CORE FEATURES
  // ============================================
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'dashboard',
    path: '/dashboard',
    topBarActions: [
      { id: 'overview', label: 'Overview', icon: 'chart', action: 'view-overview', priority: 1 },
      { id: 'analytics', label: 'Analytics', icon: 'analytics', action: 'view-analytics', priority: 2 },
      { id: 'notifications', label: 'Notifications', icon: 'bell', action: 'view-notifications', priority: 3 },
      { id: 'settings', label: 'Quick Settings', icon: 'settings', action: 'quick-settings', priority: 4 },
    ],
  },

  // ============================================
  // SOCIAL & COMMUNITY
  // ============================================
  {
    id: 'social',
    label: 'Social Media',
    icon: 'users',
    children: [
      { id: 'feed', label: 'Activity Feed', icon: 'activity', path: '/social/feed' },
      { id: 'profile', label: 'My Profile', icon: 'user', path: '/social/profile' },
      { id: 'friends', label: 'Friends', icon: 'user-friends', path: '/social/friends' },
      { id: 'groups', label: 'Groups', icon: 'users-group', path: '/social/groups' },
      { id: 'pages', label: 'Pages', icon: 'file-text', path: '/social/pages' },
      { id: 'videos', label: 'Videos (Shorts)', icon: 'video', path: '/social/videos' },
      { id: 'photos', label: 'Photos', icon: 'image', path: '/social/photos' },
      { id: 'stories', label: 'Stories', icon: 'clock', path: '/social/stories' },
      { id: 'marketplace', label: 'Marketplace', icon: 'shopping-bag', path: '/social/marketplace' },
    ],
    topBarActions: [
      { id: 'create-post', label: 'Create Post', icon: 'plus', action: 'create-post', priority: 1 },
      { id: 'messages', label: 'Messages', icon: 'message', action: 'open-messages', priority: 2 },
      { id: 'notifications', label: 'Notifications', icon: 'bell', action: 'view-notifications', priority: 3 },
      { id: 'friends-requests', label: 'Friend Requests', icon: 'user-plus', action: 'view-requests', priority: 4 },
      { id: 'create-group', label: 'Create Group', icon: 'users-plus', action: 'create-group', priority: 5 },
    ],
  },

  {
    id: 'communication',
    label: 'Communication',
    icon: 'message-circle',
    children: [
      { id: 'chat', label: 'Chat (VoIP)', icon: 'message-square', path: '/communication/chat' },
      { id: 'voice-call', label: 'Voice Call', icon: 'phone', path: '/communication/voice' },
      { id: 'video-call', label: 'Video Call', icon: 'video-camera', path: '/communication/video' },
      { id: 'voice-notes', label: 'Voice Notes', icon: 'mic', path: '/communication/voice-notes' },
      { id: 'file-sharing', label: 'File Sharing', icon: 'paperclip', path: '/communication/files' },
      { id: 'status', label: 'Status Updates', icon: 'status', path: '/communication/status' },
      { id: 'integrations', label: 'Platform Integrations', icon: 'link', path: '/communication/integrations' },
    ],
    topBarActions: [
      { id: 'new-chat', label: 'New Chat', icon: 'message-plus', action: 'new-chat', priority: 1 },
      { id: 'voice-call', label: 'Voice Call', icon: 'phone', action: 'voice-call', priority: 2 },
      { id: 'video-call', label: 'Video Call', icon: 'video', action: 'video-call', priority: 3 },
      { id: 'share-file', label: 'Share File', icon: 'upload', action: 'share-file', priority: 4 },
    ],
  },

  // ============================================
  // EDUCATION & LEARNING
  // ============================================
  {
    id: 'elearning',
    label: 'E-Learning',
    icon: 'graduation-cap',
    children: [
      { id: 'browse-courses', label: 'Browse Courses', icon: 'book-open', path: '/elearning/browse' },
      { id: 'my-courses', label: 'My Courses', icon: 'book', path: '/elearning/my-courses' },
      { id: 'ai-learning-path', label: 'AI Learning Path', icon: 'brain', path: '/elearning/ai-path' },
      { id: 'certificates', label: 'Certificates', icon: 'award', path: '/elearning/certificates' },
      { id: 'cv-builder', label: 'CV Builder', icon: 'file-user', path: '/elearning/cv-builder' },
      { id: 'blockchain-cv', label: 'Blockchain CV', icon: 'blockchain', path: '/elearning/blockchain-cv' },
      { id: 'instructor-tools', label: 'Instructor Tools', icon: 'chalkboard', path: '/elearning/instructor' },
      { id: 'course-materials', label: 'Course Materials', icon: 'folder', path: '/elearning/materials' },
    ],
    topBarActions: [
      { id: 'browse', label: 'Browse Courses', icon: 'search', action: 'browse-courses', priority: 1 },
      { id: 'my-courses', label: 'My Courses', icon: 'book', action: 'view-my-courses', priority: 2 },
      { id: 'create-course', label: 'Create Course', icon: 'plus', action: 'create-course', priority: 3 },
      { id: 'certificates', label: 'Certificates', icon: 'award', action: 'view-certificates', priority: 4 },
    ],
  },

  // ============================================
  // COMMERCE & BUSINESS
  // ============================================
  {
    id: 'ecommerce',
    label: 'E-Commerce',
    icon: 'shopping-cart',
    children: [
      { id: 'browse-products', label: 'Browse Products', icon: 'grid', path: '/ecommerce/browse' },
      { id: 'categories', label: 'Categories', icon: 'tag', path: '/ecommerce/categories' },
      { id: 'my-cart', label: 'My Cart', icon: 'shopping-cart', path: '/ecommerce/cart' },
      { id: 'orders', label: 'Orders', icon: 'package', path: '/ecommerce/orders' },
      { id: 'wishlist', label: 'Wishlist', icon: 'heart', path: '/ecommerce/wishlist' },
      { id: 'seller-dashboard', label: 'Seller Dashboard', icon: 'store', path: '/ecommerce/seller' },
      { id: 'patents', label: 'Patents', icon: 'shield', path: '/ecommerce/patents' },
      { id: 'blueprints', label: 'Blueprints', icon: 'blueprint', path: '/ecommerce/blueprints' },
    ],
    topBarActions: [
      { id: 'search', label: 'Search Products', icon: 'search', action: 'search-products', priority: 1 },
      { id: 'cart', label: 'Cart', icon: 'shopping-cart', action: 'view-cart', priority: 2 },
      { id: 'orders', label: 'Orders', icon: 'package', action: 'view-orders', priority: 3 },
      { id: 'sell', label: 'Sell Product', icon: 'plus', action: 'sell-product', priority: 4 },
    ],
  },

  {
    id: 'jobs',
    label: 'Jobs & Recruitment',
    icon: 'briefcase',
    children: [
      { id: 'search-jobs', label: 'Search Jobs', icon: 'search', path: '/jobs/search' },
      { id: 'geographic-search', label: 'Geographic Search', icon: 'map', path: '/jobs/geographic' },
      { id: 'my-applications', label: 'My Applications', icon: 'file-check', path: '/jobs/applications' },
      { id: 'employer-signup', label: 'Employer Signup', icon: 'building', path: '/jobs/employer-signup' },
      { id: 'freelance-barter', label: 'Freelance Barter', icon: 'exchange', path: '/jobs/freelance' },
      { id: 'wage-calculator', label: 'Wage Calculator', icon: 'calculator', path: '/jobs/wage-calculator' },
      { id: 'skill-verification', label: 'Skill Verification', icon: 'check-circle', path: '/jobs/verification' },
    ],
    topBarActions: [
      { id: 'search', label: 'Search Jobs', icon: 'search', action: 'search-jobs', priority: 1 },
      { id: 'apply', label: 'Quick Apply', icon: 'send', action: 'quick-apply', priority: 2 },
      { id: 'applications', label: 'My Applications', icon: 'file', action: 'view-applications', priority: 3 },
      { id: 'post-job', label: 'Post Job', icon: 'plus', action: 'post-job', priority: 4 },
    ],
  },

  // ============================================
  // FINANCE & TRADING
  // ============================================
  {
    id: 'trading',
    label: 'Trading',
    icon: 'trending-up',
    children: [
      { id: 'fiat-forex', label: 'Fiat Trading (Forex)', icon: 'dollar', path: '/trading/forex' },
      { id: 'cryptocurrency', label: 'Cryptocurrency', icon: 'bitcoin', path: '/trading/crypto' },
      { id: 'ai-trading', label: 'AI Trading Bot', icon: 'robot', path: '/trading/ai-bot' },
      { id: 'portfolio', label: 'Portfolio Management', icon: 'pie-chart', path: '/trading/portfolio' },
      { id: 'market-analysis', label: 'Market Analysis', icon: 'chart-line', path: '/trading/analysis' },
      { id: 'flash-loans', label: 'Flash Loan Trading', icon: 'zap', path: '/trading/flash-loans' },
      { id: 'traditional', label: 'Traditional Markets', icon: 'building', path: '/trading/traditional' },
      { id: 'bonds-shares', label: 'Bonds, Shares, Commodities', icon: 'coins', path: '/trading/bonds' },
      { id: 'penny-trading', label: 'Penny Trading', icon: 'cent', path: '/trading/penny' },
    ],
    topBarActions: [
      { id: 'buy', label: 'Buy', icon: 'arrow-up', action: 'buy', priority: 1 },
      { id: 'sell', label: 'Sell', icon: 'arrow-down', action: 'sell', priority: 2 },
      { id: 'portfolio', label: 'Portfolio', icon: 'pie-chart', action: 'view-portfolio', priority: 3 },
      { id: 'charts', label: 'Charts', icon: 'chart', action: 'view-charts', priority: 4 },
      { id: 'history', label: 'History', icon: 'history', action: 'view-history', priority: 5 },
    ],
  },

  {
    id: 'blockchain',
    label: 'Blockchain & Web3',
    icon: 'blockchain',
    children: [
      { id: 'blockchain-explorer', label: '4D Blockchain Explorer', icon: 'cube', path: '/blockchain/explorer' },
      { id: 'wallet', label: 'Multi-Chain Wallet', icon: 'wallet', path: '/blockchain/wallet' },
      { id: 'nft-marketplace', label: 'NFT Marketplace', icon: 'image-gallery', path: '/blockchain/nft' },
      { id: 'smart-contracts', label: 'Smart Contracts', icon: 'code', path: '/blockchain/contracts' },
      { id: 'defi', label: 'DeFi Protocols', icon: 'coins-stack', path: '/blockchain/defi' },
      { id: 'staking', label: 'Staking Pools', icon: 'lock', path: '/blockchain/staking' },
      { id: 'yield-farming', label: 'Yield Farming', icon: 'plant', path: '/blockchain/yield' },
      { id: 'arbitrage', label: 'Arbitrage', icon: 'exchange-alt', path: '/blockchain/arbitrage' },
      { id: 'dao', label: 'DAO Governance', icon: 'vote', path: '/blockchain/dao' },
      { id: 'cross-chain', label: 'Cross-Chain Bridge', icon: 'bridge', path: '/blockchain/bridge' },
      { id: 'vault', label: 'Vault System', icon: 'safe', path: '/blockchain/vault' },
    ],
    topBarActions: [
      { id: 'wallet', label: 'Wallet', icon: 'wallet', action: 'open-wallet', priority: 1 },
      { id: 'send', label: 'Send', icon: 'send', action: 'send-crypto', priority: 2 },
      { id: 'receive', label: 'Receive', icon: 'download', action: 'receive-crypto', priority: 3 },
      { id: 'nft', label: 'NFTs', icon: 'image', action: 'view-nfts', priority: 4 },
      { id: 'stake', label: 'Stake', icon: 'lock', action: 'stake-tokens', priority: 5 },
    ],
  },

  // ============================================
  // EVENTS & ENTERTAINMENT
  // ============================================
  {
    id: 'events',
    label: 'Events',
    icon: 'calendar',
    children: [
      { id: 'calendar', label: 'Event Calendar', icon: 'calendar-days', path: '/events/calendar' },
      { id: 'clubs', label: 'Clubs', icon: 'music', path: '/events/clubs' },
      { id: 'bars', label: 'Bars', icon: 'beer', path: '/events/bars' },
      { id: 'restaurants', label: 'Restaurants', icon: 'utensils', path: '/events/restaurants' },
      { id: 'stadiums', label: 'Stadiums', icon: 'stadium', path: '/events/stadiums' },
      { id: 'concerts', label: 'Concerts', icon: 'guitar', path: '/events/concerts' },
      { id: 'museums', label: 'Museums', icon: 'museum', path: '/events/museums' },
    ],
    topBarActions: [
      { id: 'browse', label: 'Browse Events', icon: 'search', action: 'browse-events', priority: 1 },
      { id: 'create', label: 'Create Event', icon: 'plus', action: 'create-event', priority: 2 },
      { id: 'my-events', label: 'My Events', icon: 'calendar-check', action: 'view-my-events', priority: 3 },
      { id: 'tickets', label: 'My Tickets', icon: 'ticket', action: 'view-tickets', priority: 4 },
    ],
  },

  {
    id: 'gaming',
    label: 'Gaming',
    icon: 'gamepad',
    children: [
      { id: 'blockchain-games', label: 'Blockchain Games', icon: 'cube-game', path: '/gaming/blockchain' },
      { id: 'crypto-games', label: 'Crypto Games', icon: 'bitcoin-game', path: '/gaming/crypto' },
      { id: 'play-to-earn', label: 'Play to Earn', icon: 'coins', path: '/gaming/p2e' },
      { id: 'game-chat', label: 'Game Chat', icon: 'message-game', path: '/gaming/chat' },
      { id: 'tournaments', label: 'Tournaments', icon: 'trophy', path: '/gaming/tournaments' },
      { id: 'rewards', label: 'Rewards & Airdrops', icon: 'gift', path: '/gaming/rewards' },
    ],
    topBarActions: [
      { id: 'play', label: 'Play Now', icon: 'play', action: 'play-game', priority: 1 },
      { id: 'leaderboard', label: 'Leaderboard', icon: 'trophy', action: 'view-leaderboard', priority: 2 },
      { id: 'inventory', label: 'Inventory', icon: 'backpack', action: 'view-inventory', priority: 3 },
      { id: 'rewards', label: 'Rewards', icon: 'gift', action: 'view-rewards', priority: 4 },
    ],
  },

  // ============================================
  // AI & AUTOMATION
  // ============================================
  {
    id: 'ai-tools',
    label: 'AI Tools',
    icon: 'brain',
    children: [
      // Design & Creative
      {
        id: 'design-creative',
        label: 'Design & Creative',
        icon: 'palette',
        children: [
          { id: 'ai-color-analysis', label: 'AI Color Analysis', icon: 'color-palette', path: '/ai/color-analysis' },
          { id: 'sketch-converter', label: 'Sketch Photo Converter', icon: 'image-convert', path: '/ai/sketch-converter' },
          { id: 'logo-generator', label: 'Logo Generator', icon: 'logo', path: '/ai/logo-generator' },
          { id: 'banner-creator', label: 'Banner Creator', icon: 'banner', path: '/ai/banner-creator' },
          { id: 'theme-builder', label: 'Theme Builder', icon: 'theme', path: '/ai/theme-builder' },
          { id: 'meme-maker', label: 'Make a Meme', icon: 'laugh', path: '/ai/meme-maker' },
          { id: 'interior-designer', label: 'AI Interior Designer', icon: 'home', path: '/ai/interior-designer' },
          { id: 'video-design', label: 'AI Video Design', icon: 'video-edit', path: '/ai/video-design' },
        ],
      },
      // Business Tools
      {
        id: 'business-tools',
        label: 'Business Tools',
        icon: 'briefcase',
        children: [
          { id: 'market-research', label: 'Market Research Tool', icon: 'chart-bar', path: '/ai/market-research' },
          { id: 'swat-analysis', label: 'SWAT Analysis', icon: 'analyze', path: '/ai/swat-analysis' },
          { id: 'business-canvas', label: 'Business Canvas Maker', icon: 'canvas', path: '/ai/business-canvas' },
        ],
      },
      // Development Tools
      {
        id: 'development-tools',
        label: 'Development Tools',
        icon: 'code',
        children: [
          { id: 'website-builder', label: 'AI Website Builder', icon: 'globe', path: '/ai/website-builder' },
          { id: 'app-builder', label: 'APP Builder', icon: 'mobile', path: '/ai/app-builder' },
          { id: 'api-builder', label: 'API Builder', icon: 'api', path: '/ai/api-builder' },
          { id: 'game-design', label: 'Game Design', icon: 'gamepad', path: '/ai/game-design' },
          { id: 'cad-design', label: 'CAD Design', icon: 'cad', path: '/ai/cad-design' },
          { id: 'github-deploy', label: 'Github Repository Deployment', icon: 'github', path: '/ai/github-deploy' },
          { id: 'web-development', label: 'Web Development', icon: 'code-web', path: '/ai/web-development' },
        ],
      },
      // Research & Analysis
      {
        id: 'research-analysis',
        label: 'Research & Analysis',
        icon: 'search',
        children: [
          { id: 'wide-research', label: 'Wide Research', icon: 'search-wide', path: '/ai/wide-research' },
          { id: 'deep-research', label: 'Deep Research', icon: 'search-deep', path: '/ai/deep-research' },
          { id: 'fact-checker', label: 'AI Fact Checker', icon: 'check-fact', path: '/ai/fact-checker' },
          { id: 'nanobrain', label: 'Nanobrain AI', icon: 'brain-nano', path: '/ai/nanobrain' },
          { id: 'quantum-assistant', label: 'Quantum AI Assistant', icon: 'quantum', path: '/ai/quantum-assistant' },
        ],
      },
      // Content Creation
      {
        id: 'content-creation',
        label: 'Content Creation',
        icon: 'edit',
        children: [
          { id: 'chatbot', label: 'Chat Bot', icon: 'bot', path: '/ai/chatbot' },
          { id: 'content-creation', label: 'Content Creation', icon: 'document', path: '/ai/content-creation' },
          { id: 'book-writing', label: 'Book Writing', icon: 'book-write', path: '/ai/book-writing' },
          { id: 'course-creation', label: 'Course Creation', icon: 'course', path: '/ai/course-creation' },
        ],
      },
      // Production Tools
      {
        id: 'production-tools',
        label: 'Production Tools',
        icon: 'tools',
        children: [
          { id: 'unified-quantum', label: 'Unified Quantum AI', icon: 'quantum-unified', path: '/ai/unified-quantum' },
          { id: 'ai-trading', label: 'AI Trading', icon: 'chart-trading', path: '/ai/trading' },
          { id: 'mcp', label: 'MCP', icon: 'mcp', path: '/ai/mcp' },
        ],
      },
    ],
    topBarActions: [
      { id: 'quick-ai', label: 'Quick AI', icon: 'zap', action: 'quick-ai', priority: 1 },
      { id: 'chat', label: 'AI Chat', icon: 'message', action: 'ai-chat', priority: 2 },
      { id: 'generate', label: 'Generate', icon: 'sparkles', action: 'ai-generate', priority: 3 },
      { id: 'history', label: 'History', icon: 'history', action: 'ai-history', priority: 4 },
    ],
  },

  // ============================================
  // ADVANCED TECH
  // ============================================
  {
    id: 'quantum',
    label: 'Quantum Computing',
    icon: 'atom',
    children: [
      { id: 'simulator', label: 'Quantum Simulator', icon: 'cpu', path: '/quantum/simulator' },
    ],
    topBarActions: [
      { id: 'simulate', label: 'Simulate', icon: 'play', action: 'run-simulation', priority: 1 },
      { id: 'algorithms', label: 'Algorithms', icon: 'code', action: 'view-algorithms', priority: 2 },
    ],
  },

  {
    id: 'iot',
    label: 'IoT & Manufacturing',
    icon: 'microchip',
    children: [
      { id: 'devices', label: 'Internet of Things', icon: 'wifi', path: '/iot/devices' },
      { id: 'manufacturing', label: 'Manufacturing', icon: 'factory', path: '/iot/manufacturing' },
    ],
    topBarActions: [
      { id: 'devices', label: 'Devices', icon: 'microchip', action: 'view-devices', priority: 1 },
      { id: 'add-device', label: 'Add Device', icon: 'plus', action: 'add-device', priority: 2 },
      { id: 'automation', label: 'Automation', icon: 'robot', action: 'automation', priority: 3 },
    ],
  },

  {
    id: 'robotics',
    label: 'Robotics',
    icon: 'robot',
    children: [
      { id: 'control', label: 'Robot Control', icon: 'gamepad', path: '/robotics/control' },
      { id: 'fleet', label: 'Fleet Management', icon: 'robots', path: '/robotics/fleet' },
    ],
    topBarActions: [
      { id: 'control', label: 'Control', icon: 'gamepad', action: 'robot-control', priority: 1 },
      { id: 'status', label: 'Status', icon: 'activity', action: 'robot-status', priority: 2 },
    ],
  },

  {
    id: 'health',
    label: 'Health Care',
    icon: 'heart-pulse',
    children: [
      { id: 'monitoring', label: 'Health Monitoring', icon: 'heartbeat', path: '/health/monitoring' },
    ],
    topBarActions: [
      { id: 'dashboard', label: 'Dashboard', icon: 'chart', action: 'health-dashboard', priority: 1 },
    ],
  },

  {
    id: 'rd-labs',
    label: 'R&D Labs',
    icon: 'flask',
    children: [
      { id: 'crisphr', label: 'Crisphr Gene Lab', icon: 'dna', path: '/rd/crisphr' },
      { id: 'rife', label: 'Rife Frequency Healing', icon: 'wave', path: '/rd/rife' },
      { id: 'element', label: 'Element Laboratory', icon: 'atom', path: '/rd/element' },
      { id: 'cymatic', label: 'Cymatic Technology', icon: 'sound-wave', path: '/rd/cymatic' },
      { id: 'funding', label: 'Research Funding Pools', icon: 'money', path: '/rd/funding' },
    ],
    topBarActions: [
      { id: 'projects', label: 'Projects', icon: 'folder', action: 'view-projects', priority: 1 },
      { id: 'funding', label: 'Funding', icon: 'dollar', action: 'view-funding', priority: 2 },
    ],
  },

  // ============================================
  // REAL ESTATE & HOSPITALITY
  // ============================================
  {
    id: 'estate',
    label: 'Estate Agents (Housing)',
    icon: 'home',
    children: [
      { id: 'search', label: 'Property Search', icon: 'search', path: '/estate/search' },
      { id: 'listings', label: 'My Listings', icon: 'list', path: '/estate/listings' },
    ],
    topBarActions: [
      { id: 'search', label: 'Search', icon: 'search', action: 'search-properties', priority: 1 },
      { id: 'list', label: 'List Property', icon: 'plus', action: 'list-property', priority: 2 },
    ],
  },

  {
    id: 'hotels',
    label: 'Hotels & Restaurants',
    icon: 'hotel',
    children: [
      { id: 'hotels', label: 'Hotels', icon: 'bed', path: '/hotels/search' },
      { id: 'restaurants', label: 'Restaurants', icon: 'utensils', path: '/hotels/restaurants' },
    ],
    topBarActions: [
      { id: 'book', label: 'Book Now', icon: 'calendar', action: 'book-hotel', priority: 1 },
      { id: 'reservations', label: 'Reservations', icon: 'ticket', action: 'view-reservations', priority: 2 },
    ],
  },

  // ============================================
  // SETTINGS & ADMIN
  // ============================================
  {
    id: 'settings',
    label: 'Settings',
    icon: 'settings',
    children: [
      { id: 'profile', label: 'Profile Settings', icon: 'user-cog', path: '/settings/profile' },
      { id: 'account', label: 'Account', icon: 'user', path: '/settings/account' },
      { id: 'kyc', label: 'KYC Verification', icon: 'id-card', path: '/settings/kyc' },
      { id: 'auth', label: '3rd Party Authentication', icon: 'key', path: '/settings/auth' },
      { id: 'privacy', label: 'Privacy Policy', icon: 'shield', path: '/settings/privacy' },
      { id: 'security', label: 'Security', icon: 'lock', path: '/settings/security' },
      { id: 'notifications', label: 'Notifications', icon: 'bell', path: '/settings/notifications' },
      { id: 'language', label: 'Language', icon: 'globe', path: '/settings/language' },
    ],
    topBarActions: [
      { id: 'profile', label: 'Profile', icon: 'user', action: 'edit-profile', priority: 1 },
      { id: 'security', label: 'Security', icon: 'lock', action: 'security-settings', priority: 2 },
      { id: 'privacy', label: 'Privacy', icon: 'shield', action: 'privacy-settings', priority: 3 },
    ],
  },

  {
    id: 'admin',
    label: 'Admin Dashboard',
    icon: 'shield-check',
    path: '/admin',
    topBarActions: [
      { id: 'users', label: 'Users', icon: 'users', action: 'manage-users', priority: 1 },
      { id: 'content', label: 'Content', icon: 'file', action: 'manage-content', priority: 2 },
      { id: 'analytics', label: 'Analytics', icon: 'chart', action: 'view-analytics', priority: 3 },
      { id: 'settings', label: 'Settings', icon: 'settings', action: 'admin-settings', priority: 4 },
    ],
  },

  // ============================================
  // HELP & SUPPORT
  // ============================================
  {
    id: 'help',
    label: 'Help & Support',
    icon: 'help-circle',
    children: [
      { id: 'about', label: 'About Us', icon: 'info', path: '/help/about' },
      { id: 'contact', label: 'Contact Us', icon: 'mail', path: '/help/contact' },
      { id: 'faq', label: 'FAQ', icon: 'question', path: '/help/faq' },
      { id: 'tutorials', label: 'Tutorials', icon: 'book-open', path: '/help/tutorials' },
    ],
    topBarActions: [
      { id: 'help', label: 'Help Center', icon: 'help', action: 'help-center', priority: 1 },
      { id: 'contact', label: 'Contact', icon: 'mail', action: 'contact-support', priority: 2 },
    ],
  },
];

/**
 * Get top bar actions for a specific menu item
 */
export function getTopBarActions(menuId: string): TopBarAction[] {
  const findActions = (items: MenuItem[]): TopBarAction[] | null => {
    for (const item of items) {
      if (item.id === menuId && item.topBarActions) {
        return item.topBarActions;
      }
      if (item.children) {
        const result = findActions(item.children);
        if (result) return result;
      }
    }
    return null;
  };

  return findActions(mainMenu) || [];
}

/**
 * Get overflow actions (those with priority > 4 or when screen is small)
 */
export function getOverflowActions(actions: TopBarAction[], maxVisible: number = 4): {
  visible: TopBarAction[];
  overflow: TopBarAction[];
} {
  const sorted = [...actions].sort((a, b) => a.priority - b.priority);
  return {
    visible: sorted.slice(0, maxVisible),
    overflow: sorted.slice(maxVisible),
  };
}

