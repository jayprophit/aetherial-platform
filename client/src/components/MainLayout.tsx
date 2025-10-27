import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import {
  Home, Users, UsersRound, MessageSquare, ShoppingCart, GraduationCap,
  Briefcase, Bot, Wallet, TrendingUp, Image, Cpu, Factory, Zap,
  Vote, Settings, Bell, Menu, X, ChevronDown, ChevronRight, ChevronLeft,
  Search, User, LogOut, Moon, Sun
} from 'lucide-react';

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  path?: string;
  badge?: string | number;
  children?: MenuItem[];
}

const mainMenuItems: MenuItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: Home,
    children: [
      { id: 'feed', label: 'Activity Feed', icon: Home, path: '/' },
      { id: 'trending', label: 'Trending', icon: TrendingUp, path: '/trending' },
      { id: 'following', label: 'Following', icon: Users, path: '/following' },
    ]
  },
  {
    id: 'friends',
    label: 'Friends',
    icon: Users,
    children: [
      { id: 'all-friends', label: 'All Friends', icon: Users, path: '/friends' },
      { id: 'requests', label: 'Friend Requests', icon: Users, path: '/friends/requests', badge: 3 },
      { id: 'suggestions', label: 'Suggestions', icon: Users, path: '/friends/suggestions' },
    ]
  },
  {
    id: 'groups',
    label: 'Groups',
    icon: UsersRound,
    children: [
      { id: 'my-groups', label: 'My Groups', icon: UsersRound, path: '/groups' },
      { id: 'discover-groups', label: 'Discover', icon: UsersRound, path: '/groups/discover' },
      { id: 'create-group', label: 'Create Group', icon: UsersRound, path: '/groups/create' },
    ]
  },
  {
    id: 'messages',
    label: 'Messages',
    icon: MessageSquare,
    badge: 5,
    children: [
      { id: 'inbox', label: 'Inbox', icon: MessageSquare, path: '/messages', badge: 5 },
      { id: 'sent', label: 'Sent', icon: MessageSquare, path: '/messages/sent' },
      { id: 'archived', label: 'Archived', icon: MessageSquare, path: '/messages/archived' },
    ]
  },
  {
    id: 'marketplace',
    label: 'Marketplace',
    icon: ShoppingCart,
    children: [
      { id: 'browse-products', label: 'Browse Products', icon: ShoppingCart, path: '/marketplace' },
      { id: 'my-shop', label: 'My Shop', icon: ShoppingCart, path: '/marketplace/shop' },
      { id: 'orders', label: 'Orders', icon: ShoppingCart, path: '/marketplace/orders' },
      { id: 'cart', label: 'Cart', icon: ShoppingCart, path: '/marketplace/cart', badge: 2 },
    ]
  },
  {
    id: 'learning',
    label: 'Learning',
    icon: GraduationCap,
    children: [
      { id: 'browse-courses', label: 'Browse Courses', icon: GraduationCap, path: '/learning' },
      { id: 'my-courses', label: 'My Courses', icon: GraduationCap, path: '/learning/my-courses' },
      { id: 'teaching', label: 'Teaching', icon: GraduationCap, path: '/learning/teaching' },
      { id: 'certificates', label: 'Certificates', icon: GraduationCap, path: '/learning/certificates' },
    ]
  },
  {
    id: 'jobs',
    label: 'Jobs',
    icon: Briefcase,
    children: [
      { id: 'find-jobs', label: 'Find Jobs', icon: Briefcase, path: '/jobs' },
      { id: 'applications', label: 'My Applications', icon: Briefcase, path: '/jobs/applications' },
      { id: 'saved-jobs', label: 'Saved Jobs', icon: Briefcase, path: '/jobs/saved' },
      { id: 'post-job', label: 'Post a Job', icon: Briefcase, path: '/jobs/post' },
    ]
  },
  {
    id: 'ai-agents',
    label: 'AI Agents',
    icon: Bot,
    children: [
      { id: 'my-agents', label: 'My Agents', icon: Bot, path: '/ai-agents' },
      { id: 'create-agent', label: 'Create Agent', icon: Bot, path: '/ai-agents/create' },
      { id: 'agent-marketplace', label: 'Agent Marketplace', icon: Bot, path: '/ai-agents/marketplace' },
    ]
  },
  {
    id: 'wallet',
    label: 'Wallet',
    icon: Wallet,
    children: [
      { id: 'balance', label: 'Balance', icon: Wallet, path: '/wallet' },
      { id: 'send-receive', label: 'Send/Receive', icon: Wallet, path: '/wallet/transfer' },
      { id: 'history', label: 'History', icon: Wallet, path: '/wallet/history' },
      { id: 'staking', label: 'Staking', icon: Wallet, path: '/wallet/staking' },
    ]
  },
  {
    id: 'trading',
    label: 'Trading',
    icon: TrendingUp,
    badge: 'LIVE',
    children: [
      { id: 'dashboard', label: 'Dashboard', icon: TrendingUp, path: '/trading' },
      { id: 'markets', label: 'Markets', icon: TrendingUp, path: '/trading/markets' },
      { id: 'portfolio', label: 'Portfolio', icon: TrendingUp, path: '/trading/portfolio' },
    ]
  },
  {
    id: 'nfts',
    label: 'NFTs',
    icon: Image,
    children: [
      { id: 'browse-nfts', label: 'Browse NFTs', icon: Image, path: '/nfts' },
      { id: 'my-nfts', label: 'My NFTs', icon: Image, path: '/nfts/my-collection' },
      { id: 'create-nft', label: 'Create NFT', icon: Image, path: '/nfts/create' },
    ]
  },
  {
    id: 'iot',
    label: 'IoT',
    icon: Cpu,
    children: [
      { id: 'devices', label: 'My Devices', icon: Cpu, path: '/iot' },
      { id: 'automation', label: 'Automation', icon: Cpu, path: '/iot/automation' },
      { id: 'analytics', label: 'Analytics', icon: Cpu, path: '/iot/analytics' },
    ]
  },
  {
    id: 'robotics',
    label: 'Robotics',
    icon: Factory,
    children: [
      { id: 'fleet', label: 'Robot Fleet', icon: Factory, path: '/robotics' },
      { id: 'control', label: 'Control', icon: Factory, path: '/robotics/control' },
      { id: 'marketplace', label: 'Marketplace', icon: Factory, path: '/robotics/marketplace' },
    ]
  },
  {
    id: 'governance',
    label: 'Governance',
    icon: Vote,
    children: [
      { id: 'proposals', label: 'Proposals', icon: Vote, path: '/governance' },
      { id: 'my-votes', label: 'My Votes', icon: Vote, path: '/governance/votes' },
      { id: 'create-proposal', label: 'Create Proposal', icon: Vote, path: '/governance/create' },
    ]
  },
];

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['home']);
  const [darkMode, setDarkMode] = useState(false);
  const [location] = useLocation();
  const [activeMainMenu, setActiveMainMenu] = useState<string>('home');

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev =>
      prev.includes(menuId)
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
    setActiveMainMenu(menuId);
  };

  const isActive = (path?: string) => {
    if (!path) return false;
    return location === path;
  };

  const leftSidebarWidth = sidebarOpen ? 'w-72' : 'w-20';
  const rightSidebarWidth = aiAssistantOpen ? 'w-80' : 'w-0';

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Left Sidebar - Full Height */}
      <aside
        className={`fixed left-0 top-0 bottom-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto z-50 transition-all duration-300 ${leftSidebarWidth}`}
      >
        {/* Logo & Toggle */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          {sidebarOpen ? (
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">AETHERIAL</span>
            </Link>
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center mx-auto">
              <Zap className="w-6 h-6 text-white" />
            </div>
          )}
          {sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="absolute top-4 left-1/2 transform -translate-x-1/2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Main Navigation */}
        <nav className="p-2 space-y-1">
          {mainMenuItems.map((item) => (
            <div key={item.id}>
              <button
                onClick={() => toggleMenu(item.id)}
                className={`w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  activeMainMenu === item.id ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600' : ''
                }`}
                title={item.label}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && (
                    <>
                      <span className="font-medium">{item.label}</span>
                      {item.badge && (
                        <span className="ml-auto px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </div>
                {sidebarOpen && item.children && (
                  expandedMenus.includes(item.id) ? <ChevronDown className="w-4 h-4 flex-shrink-0" /> : <ChevronRight className="w-4 h-4 flex-shrink-0" />
                )}
              </button>

              {/* Submenu (when expanded) */}
              {sidebarOpen && item.children && expandedMenus.includes(item.id) && (
                <div className="ml-8 mt-1 space-y-1">
                  {item.children.map((child) => (
                    <Link key={child.id} to={child.path || '#'}>
                      <button
                        className={`w-full flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm ${
                          isActive(child.path) ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 font-medium' : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <child.icon className="w-4 h-4" />
                        <span>{child.label}</span>
                        {child.badge && (
                          <span className="ml-auto px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
                            {child.badge}
                          </span>
                        )}
                      </button>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Top Bar - Shifts between sidebars */}
      <header
        className={`fixed top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-40 transition-all duration-300 ${
          sidebarOpen ? 'left-72' : 'left-20'
        } ${aiAssistantOpen ? 'right-80' : 'right-0'}`}
      >
        <div className="flex items-center justify-between h-16 px-4">
          {/* Search */}
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search anything..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <Link to="/profile">
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <User className="w-5 h-5" />
              </button>
            </Link>
            <button
              onClick={() => setAiAssistantOpen(!aiAssistantOpen)}
              className={`p-2 rounded-lg ${aiAssistantOpen ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              <Bot className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dynamic Submenu Tabs */}
        <div className="flex items-center gap-1 px-4 py-2 border-t border-gray-100 dark:border-gray-700 overflow-x-auto">
          {mainMenuItems.find(item => item.id === activeMainMenu)?.children?.map((submenu) => (
            <Link key={submenu.id} to={submenu.path || '#'}>
              <button className={`flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors whitespace-nowrap ${
                location === submenu.path ? 'text-purple-600 bg-purple-50 dark:bg-purple-900/20 font-semibold' : 'text-gray-700 dark:text-gray-300'
              }`}>
                <submenu.icon className="w-4 h-4" />
                <span className="text-sm">{submenu.label}</span>
                {submenu.badge && (
                  <span className="ml-1 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">{submenu.badge}</span>
                )}
              </button>
            </Link>
          ))}
        </div>
      </header>

      {/* Main Content Area */}
      <main
        className={`transition-all duration-300 pt-32 ${
          sidebarOpen ? 'ml-72' : 'ml-20'
        } ${aiAssistantOpen ? 'mr-80' : 'mr-0'}`}
      >
        <div className="p-6">
          {children}
        </div>
      </main>

      {/* Right AI Assistant Sidebar */}
      <aside
        className={`fixed right-0 top-0 bottom-0 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 overflow-y-auto z-50 transition-all duration-300 ${rightSidebarWidth}`}
      >
        {aiAssistantOpen && (
          <>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Bot className="w-5 h-5 text-purple-600" />
                AI Assistant
              </h3>
              <button
                onClick={() => setAiAssistantOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    👋 Hi! I'm your AI assistant. How can I help you today?
                  </p>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ask me anything..."
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700"
                  />
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                    Send
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

