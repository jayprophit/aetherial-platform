import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import {
  Home, Users, UsersRound, MessageSquare, ShoppingCart, GraduationCap,
  Briefcase, Bot, Wallet, TrendingUp, Image, Cpu, Factory, Zap,
  Vote, Settings, Bell, Menu, X, ChevronDown, ChevronRight,
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
  };

  const isActive = (path?: string) => {
    if (!path) return false;
    return location === path;
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-50">
        <div className="flex items-center justify-between h-full px-4">
          {/* Left: Logo + Menu Toggle */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg lg:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold hidden sm:block">AETHERIAL</span>
            </Link>
          </div>

          {/* Center: Search */}
          <div className="flex-1 max-w-2xl mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search anything..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700"
              />
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
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
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dynamic Submenu Tabs (changes based on selected main menu) */}
        <div className="flex items-center gap-1 px-4 py-2 border-t border-gray-100 dark:border-gray-700 overflow-x-auto">
          {mainMenuItems.find(item => item.id === activeMainMenu)?.children?.map((submenu) => (
            <Link key={submenu.id} to={submenu.path || '#'}>
              <button className={`flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors whitespace-nowrap relative ${location === submenu.path ? 'text-purple-600 bg-purple-50 dark:bg-purple-900/20 font-semibold' : 'text-gray-700 dark:text-gray-300'}`}>
                <submenu.icon className="w-4 h-4" />
                <span className="text-sm">{submenu.label}</span>
                {submenu.badge && (
                  <span className="ml-1 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">{submenu.badge}</span>
                )}
              </button>
            </Link>
          ))}
          {/* AI Assistant Toggle */}
          <button
            onClick={() => setAiAssistantOpen(!aiAssistantOpen)}
            className={`ml-auto flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${aiAssistantOpen ? 'text-purple-600 bg-purple-50 dark:bg-purple-900/20 font-semibold' : 'text-gray-700 dark:text-gray-300'}`}
          >
            <Bot className="w-4 h-4" />
            <span className="text-sm">AI Assistant</span>
          </button>
        </div>
      </header>

      {/* Left Sidebar */}
      <aside
        className={`fixed left-0 top-16 bottom-0 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto z-40 transition-transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <nav className="p-4 space-y-1">
          {mainMenuItems.map((item) => (
            <div key={item.id}>
              <button
                onClick={() => {
                  toggleMenu(item.id);
                  setActiveMainMenu(item.id);
                }}
                className={`w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  expandedMenus.includes(item.id) || activeMainMenu === item.id ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
                      {item.badge}
                    </span>
                  )}
                </div>
                {item.children && (
                  expandedMenus.includes(item.id) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
                )}
              </button>

              {/* Submenu */}
              {item.children && expandedMenus.includes(item.id) && (
                <div className="ml-8 mt-1 space-y-1">
                  {item.children.map((child) => (
                    <Link
                      key={child.id}
                      to={child.path || '#'}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-sm ${
                        isActive(child.path) ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600' : ''
                      }`}
                    >
                      <span>{child.label}</span>
                      {child.badge && (
                        <span className="px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
                          {child.badge}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Settings at bottom */}
          <Link
            to="/settings"
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main
        className={`pt-16 transition-all ${
          sidebarOpen ? 'lg:ml-64' : 'ml-0'
        } ${aiAssistantOpen ? 'lg:mr-80' : 'mr-0'}`}
      >
        <div className="p-6">
          {children}
        </div>
      </main>

      {/* AI Assistant (Right Sidebar / Bottom on mobile) */}
      <div
        className={`fixed right-0 top-16 bottom-0 w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 z-40 transition-transform ${
          aiAssistantOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold flex items-center gap-2">
            <Bot className="w-5 h-5" />
            AI Assistant
          </h3>
          <button
            onClick={() => setAiAssistantOpen(false)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            AI assistant interface will be here. Ask me anything!
          </p>
        </div>
      </div>

      {/* AI Assistant Floating Button */}
      {!aiAssistantOpen && (
        <button
          onClick={() => setAiAssistantOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center z-50"
        >
          <Bot className="w-6 h-6" />
        </button>
      )}

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}

