import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import {
  Home, Users, UsersRound, MessageSquare, ShoppingCart, GraduationCap,
  Briefcase, Bot, Wallet, TrendingUp, Image, Cpu, Factory, Zap,
  Vote, Settings, Bell, Menu, X, ChevronDown, ChevronRight, ChevronLeft,
  Search, User, LogOut, Moon, Sun, MoreVertical, Plus, Star, Archive,
  Send, Inbox, BookmarkPlus, ShoppingBag, Package, BarChart3, Award,
  Video, FileText, Briefcase as BriefcaseIcon, Building, Heart, Clock,
  Shield, HelpCircle, Globe, Repeat, Download, Upload, Eye, Lock, Unlock, UserPlus
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  path?: string;
  badge?: string | number;
  children?: MenuItem[];
  moreActions?: {
    label: string;
    icon: any;
    action: () => void;
  }[];
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
      { id: 'saved', label: 'Saved', icon: BookmarkPlus, path: '/saved' },
    ],
    moreActions: [
      { label: 'Settings', icon: Settings, action: () => console.log('Settings') },
      { label: 'Privacy', icon: Lock, action: () => console.log('Privacy') },
      { label: 'Notifications', icon: Bell, action: () => console.log('Notifications') },
      { label: 'Help', icon: HelpCircle, action: () => console.log('Help') },
    ]
  },
  {
    id: 'friends',
    label: 'Friends',
    icon: Users,
    children: [
      { id: 'all-friends', label: 'All Friends', icon: Users, path: '/friends' },
      { id: 'requests', label: 'Requests', icon: UserPlus, path: '/friends/requests', badge: 3 },
      { id: 'suggestions', label: 'Suggestions', icon: Star, path: '/friends/suggestions' },
      { id: 'blocked', label: 'Blocked', icon: Shield, path: '/friends/blocked' },
    ],
    moreActions: [
      { label: 'Find Friends', icon: Search, action: () => console.log('Find Friends') },
      { label: 'Import Contacts', icon: Upload, action: () => console.log('Import Contacts') },
      { label: 'Settings', icon: Settings, action: () => console.log('Settings') },
      { label: 'Privacy', icon: Lock, action: () => console.log('Privacy') },
    ]
  },
  {
    id: 'groups',
    label: 'Groups',
    icon: UsersRound,
    children: [
      { id: 'my-groups', label: 'My Groups', icon: UsersRound, path: '/groups' },
      { id: 'discover', label: 'Discover', icon: Globe, path: '/groups/discover' },
      { id: 'create', label: 'Create Group', icon: Plus, path: '/groups/create' },
      { id: 'invitations', label: 'Invitations', icon: Send, path: '/groups/invitations', badge: 2 },
    ],
    moreActions: [
      { label: 'Group Settings', icon: Settings, action: () => console.log('Group Settings') },
      { label: 'Manage Members', icon: Users, action: () => console.log('Manage Members') },
      { label: 'Notifications', icon: Bell, action: () => console.log('Notifications') },
      { label: 'Help', icon: HelpCircle, action: () => console.log('Help') },
    ]
  },
  {
    id: 'messages',
    label: 'Messages',
    icon: MessageSquare,
    badge: 5,
    children: [
      { id: 'inbox', label: 'Inbox', icon: Inbox, path: '/messages', badge: 5 },
      { id: 'sent', label: 'Sent', icon: Send, path: '/messages/sent' },
      { id: 'archived', label: 'Archived', icon: Archive, path: '/messages/archived' },
      { id: 'starred', label: 'Starred', icon: Star, path: '/messages/starred' },
    ],
    moreActions: [
      { label: 'New Message', icon: Plus, action: () => console.log('New Message') },
      { label: 'Mark All Read', icon: Eye, action: () => console.log('Mark All Read') },
      { label: 'Settings', icon: Settings, action: () => console.log('Settings') },
      { label: 'Help', icon: HelpCircle, action: () => console.log('Help') },
    ]
  },
  {
    id: 'marketplace',
    label: 'Marketplace',
    icon: ShoppingCart,
    children: [
      { id: 'browse', label: 'Browse', icon: ShoppingBag, path: '/marketplace' },
      { id: 'categories', label: 'Categories', icon: Package, path: '/marketplace/categories' },
      { id: 'my-shop', label: 'My Shop', icon: Building, path: '/marketplace/shop' },
      { id: 'orders', label: 'Orders', icon: FileText, path: '/marketplace/orders' },
      { id: 'cart', label: 'Cart', icon: ShoppingCart, path: '/marketplace/cart', badge: 2 },
    ],
    moreActions: [
      { label: 'Sell Product', icon: Plus, action: () => console.log('Sell Product') },
      { label: 'My Listings', icon: Package, action: () => console.log('My Listings') },
      { label: 'Analytics', icon: BarChart3, action: () => console.log('Analytics') },
      { label: 'Settings', icon: Settings, action: () => console.log('Settings') },
    ]
  },
  {
    id: 'learning',
    label: 'Learning',
    icon: GraduationCap,
    children: [
      { id: 'courses', label: 'Courses', icon: Video, path: '/learning' },
      { id: 'my-learning', label: 'My Learning', icon: BookmarkPlus, path: '/learning/my-courses' },
      { id: 'certificates', label: 'Certificates', icon: Award, path: '/learning/certificates' },
      { id: 'teach', label: 'Teach', icon: GraduationCap, path: '/learning/teaching' },
    ],
    moreActions: [
      { label: 'Create Course', icon: Plus, action: () => console.log('Create Course') },
      { label: 'Student Dashboard', icon: BarChart3, action: () => console.log('Student Dashboard') },
      { label: 'Instructor Dashboard', icon: Building, action: () => console.log('Instructor Dashboard') },
      { label: 'Settings', icon: Settings, action: () => console.log('Settings') },
    ]
  },
  {
    id: 'jobs',
    label: 'Jobs',
    icon: Briefcase,
    children: [
      { id: 'browse-jobs', label: 'Browse Jobs', icon: Search, path: '/jobs' },
      { id: 'applications', label: 'My Applications', icon: FileText, path: '/jobs/applications' },
      { id: 'saved-jobs', label: 'Saved Jobs', icon: BookmarkPlus, path: '/jobs/saved' },
      { id: 'post-job', label: 'Post Job', icon: Plus, path: '/jobs/post' },
    ],
    moreActions: [
      { label: 'Resume Builder', icon: FileText, action: () => console.log('Resume Builder') },
      { label: 'Job Alerts', icon: Bell, action: () => console.log('Job Alerts') },
      { label: 'Company Reviews', icon: Star, action: () => console.log('Company Reviews') },
      { label: 'Settings', icon: Settings, action: () => console.log('Settings') },
    ]
  },
  {
    id: 'ai-agents',
    label: 'AI Agents',
    icon: Bot,
    children: [
      { id: 'chat', label: 'Chat', icon: MessageSquare, path: '/ai-agents' },
      { id: 'agents', label: 'Agents', icon: Bot, path: '/ai-agents/list' },
      { id: 'create', label: 'Create Agent', icon: Plus, path: '/ai-agents/create' },
      { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag, path: '/ai-agents/marketplace' },
    ],
    moreActions: [
      { label: 'Agent Settings', icon: Settings, action: () => console.log('Agent Settings') },
      { label: 'API Keys', icon: Lock, action: () => console.log('API Keys') },
      { label: 'Usage Stats', icon: BarChart3, action: () => console.log('Usage Stats') },
      { label: 'Help', icon: HelpCircle, action: () => console.log('Help') },
    ]
  },
  {
    id: 'wallet',
    label: 'Wallet',
    icon: Wallet,
    children: [
      { id: 'overview', label: 'Overview', icon: Eye, path: '/wallet' },
      { id: 'transactions', label: 'Transactions', icon: Repeat, path: '/wallet/transactions' },
      { id: 'send', label: 'Send', icon: Upload, path: '/wallet/send' },
      { id: 'receive', label: 'Receive', icon: Download, path: '/wallet/receive' },
    ],
    moreActions: [
      { label: 'Add Funds', icon: Plus, action: () => console.log('Add Funds') },
      { label: 'Withdraw', icon: Download, action: () => console.log('Withdraw') },
      { label: 'Security', icon: Shield, action: () => console.log('Security') },
      { label: 'Settings', icon: Settings, action: () => console.log('Settings') },
    ]
  },
  {
    id: 'trading',
    label: 'Trading',
    icon: TrendingUp,
    badge: 'LIVE',
    children: [
      { id: 'markets', label: 'Markets', icon: BarChart3, path: '/trading' },
      { id: 'portfolio', label: 'Portfolio', icon: Briefcase, path: '/trading/portfolio' },
      { id: 'orders', label: 'Orders', icon: FileText, path: '/trading/orders' },
      { id: 'history', label: 'History', icon: Clock, path: '/trading/history' },
    ],
    moreActions: [
      { label: 'Deposit', icon: Download, action: () => console.log('Deposit') },
      { label: 'Withdraw', icon: Upload, action: () => console.log('Withdraw') },
      { label: 'Settings', icon: Settings, action: () => console.log('Settings') },
      { label: 'Help', icon: HelpCircle, action: () => console.log('Help') },
    ]
  },
  {
    id: 'nfts',
    label: 'NFTs',
    icon: Image,
    children: [
      { id: 'explore', label: 'Explore', icon: Globe, path: '/nft' },
      { id: 'my-nfts', label: 'My NFTs', icon: Image, path: '/nft/collection' },
      { id: 'create', label: 'Create', icon: Plus, path: '/nft/create' },
      { id: 'activity', label: 'Activity', icon: Clock, path: '/nft/activity' },
    ],
    moreActions: [
      { label: 'Mint NFT', icon: Plus, action: () => console.log('Mint NFT') },
      { label: 'Collections', icon: Package, action: () => console.log('Collections') },
      { label: 'Analytics', icon: BarChart3, action: () => console.log('Analytics') },
      { label: 'Settings', icon: Settings, action: () => console.log('Settings') },
    ]
  },
  {
    id: 'iot',
    label: 'IoT',
    icon: Cpu,
    children: [
      { id: 'devices', label: 'Devices', icon: Cpu, path: '/iot' },
      { id: 'dashboard', label: 'Dashboard', icon: BarChart3, path: '/iot/dashboard' },
      { id: 'automation', label: 'Automation', icon: Zap, path: '/iot/automation' },
      { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/iot/analytics' },
    ],
    moreActions: [
      { label: 'Add Device', icon: Plus, action: () => console.log('Add Device') },
      { label: 'Settings', icon: Settings, action: () => console.log('Settings') },
      { label: 'Security', icon: Shield, action: () => console.log('Security') },
      { label: 'Help', icon: HelpCircle, action: () => console.log('Help') },
    ]
  },
  {
    id: 'robotics',
    label: 'Robotics',
    icon: Factory,
    children: [
      { id: 'robots', label: 'Robots', icon: Factory, path: '/robotics' },
      { id: 'control', label: 'Control', icon: Settings, path: '/robotics/control' },
      { id: 'programs', label: 'Programs', icon: FileText, path: '/robotics/programs' },
      { id: 'monitoring', label: 'Monitoring', icon: Eye, path: '/robotics/monitoring' },
    ],
    moreActions: [
      { label: 'Add Robot', icon: Plus, action: () => console.log('Add Robot') },
      { label: 'Settings', icon: Settings, action: () => console.log('Settings') },
      { label: 'Diagnostics', icon: BarChart3, action: () => console.log('Diagnostics') },
      { label: 'Help', icon: HelpCircle, action: () => console.log('Help') },
    ]
  },
  {
    id: 'governance',
    label: 'Governance',
    icon: Vote,
    children: [
      { id: 'proposals', label: 'Proposals', icon: FileText, path: '/governance' },
      { id: 'voting', label: 'Voting', icon: Vote, path: '/governance/voting' },
      { id: 'treasury', label: 'Treasury', icon: Wallet, path: '/governance/treasury' },
      { id: 'members', label: 'Members', icon: Users, path: '/governance/members' },
    ],
    moreActions: [
      { label: 'Create Proposal', icon: Plus, action: () => console.log('Create Proposal') },
      { label: 'Delegate', icon: Users, action: () => console.log('Delegate') },
      { label: 'Settings', icon: Settings, action: () => console.log('Settings') },
      { label: 'Help', icon: HelpCircle, action: () => console.log('Help') },
    ]
  },
];

export default function MainLayoutEnhanced({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
    setActiveMainMenu(menuId);
  };

  const isActive = (path?: string) => {
    if (!path) return false;
    return location === path;
  };

  const activeMenu = mainMenuItems.find(item => item.id === activeMainMenu);

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Left Sidebar - Desktop/Tablet */}
      <aside
        className={`fixed left-0 top-0 bottom-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto z-50 transition-all duration-300 hidden md:block ${
          sidebarOpen ? 'w-72' : 'w-20'
        }`}
      >
        {/* Logo & Toggle */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          {sidebarOpen ? (
            <>
              <Link to="/" className="flex items-center gap-2">
                <img 
                  src="/images/logo-icon.png" 
                  alt="AETHERIAL" 
                  className="w-10 h-10 object-contain animate-[glow_3s_ease-in-out_infinite]"
                />
                <span className="text-xl font-bold ethereal-text">AETHERIAL</span>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </>
          ) : (
            <button
              onClick={() => setSidebarOpen(true)}
              className="w-full flex justify-center"
            >
              <img 
                src="/images/logo-icon.png" 
                alt="AETHERIAL" 
                className="w-10 h-10 object-contain animate-[glow_3s_ease-in-out_infinite]"
              />
            </button>
          )}
        </div>

        {/* Main Navigation */}
        <nav className="p-2 space-y-1">
          {mainMenuItems.map((item) => (
            <div key={item.id}>
              <button
                onClick={() => {
                  if (!sidebarOpen && item.children && item.children[0]?.path) {
                    window.location.href = item.children[0].path;
                  } else if (sidebarOpen) {
                    toggleMenu(item.id);
                  }
                }}
                className={`w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  activeMainMenu === item.id ? 'bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600' : ''
                }`}
                title={item.label}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && (
                    <>
                      <span className="font-medium truncate">{item.label}</span>
                      {item.badge && (
                        <span className="ml-auto px-2 py-0.5 text-xs bg-red-500 text-white rounded-full flex-shrink-0">
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

              {/* Submenu (when expanded in sidebar) */}
              {sidebarOpen && item.children && expandedMenus.includes(item.id) && (
                <div className="ml-8 mt-1 space-y-1">
                  {item.children.map((child) => (
                    <Link key={child.id} to={child.path || '#'}>
                      <button
                        className={`w-full flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm ${
                          isActive(child.path) ? 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 font-medium' : 'text-gray-700 dark:text-gray-300'
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

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden" onClick={() => setMobileMenuOpen(false)}>
          <aside className="fixed left-0 top-0 bottom-0 w-72 bg-white dark:bg-gray-800 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <Link to="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                <img 
                  src="/images/logo-icon.png" 
                  alt="AETHERIAL" 
                  className="w-10 h-10 object-contain animate-[glow_3s_ease-in-out_infinite]"
                />
                <span className="text-xl font-bold ethereal-text">AETHERIAL</span>
              </Link>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="p-2 space-y-1">
              {mainMenuItems.map((item) => (
                <div key={item.id}>
                  <button
                    onClick={() => toggleMenu(item.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                      activeMainMenu === item.id ? 'bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600' : ''
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
                  {item.children && expandedMenus.includes(item.id) && (
                    <div className="ml-8 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <Link key={child.id} to={child.path || '#'} onClick={() => setMobileMenuOpen(false)}>
                          <button
                            className={`w-full flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm ${
                              isActive(child.path) ? 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 font-medium' : 'text-gray-700 dark:text-gray-300'
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
        </div>
      )}

      {/* Enhanced Top Bar with Complete Submenus and Three-Dot Menu */}
      <header
        className={`fixed top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-40 transition-all duration-300 ${
          sidebarOpen ? 'md:left-72' : 'md:left-20'
        } ${aiAssistantOpen ? 'md:right-80' : 'md:right-0'} left-0 right-0`}
      >
        <div className="flex items-center justify-between h-16 px-4">
          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg md:hidden"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Submenu Icons with Labels (Desktop/Tablet) */}
          <div className="hidden md:flex items-center gap-1 flex-1">
            {activeMenu?.children?.map((submenu) => (
              <Link key={submenu.id} to={submenu.path || '#'}>
                <button
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative ${
                    isActive(submenu.path) ? 'text-cyan-600 bg-cyan-50 dark:bg-cyan-900/20' : 'text-gray-700 dark:text-gray-300'
                  }`}
                  title={submenu.label}
                >
                  <submenu.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{submenu.label}</span>
                  {submenu.badge && (
                    <span className="px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">
                      {submenu.badge}
                    </span>
                  )}
                </button>
              </Link>
            ))}
            
            {/* Three-Dot Menu for More Actions */}
            {activeMenu?.moreActions && activeMenu.moreActions.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors ml-2">
                    <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  {activeMenu.moreActions.map((action, index) => (
                    <div key={index}>
                      <DropdownMenuItem onClick={action.action} className="cursor-pointer">
                        <action.icon className="w-4 h-4 mr-2" />
                        <span>{action.label}</span>
                      </DropdownMenuItem>
                      {index < activeMenu.moreActions!.length - 1 && index === 2 && (
                        <DropdownMenuSeparator />
                      )}
                    </div>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Search */}
          <div className="flex-1 max-w-md mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700"
              />
            </div>
          </div>

          {/* Actions */}
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
            <Link to="/profile">
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <User className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main
        className={`transition-all duration-300 pt-16 ${
          sidebarOpen ? 'md:ml-72' : 'md:ml-20'
        } ${aiAssistantOpen ? 'md:mr-80' : 'md:mr-0'}`}
      >
        <div className="p-4 md:p-6">
          {children}
        </div>
      </main>

      {/* Right AI Assistant Sidebar */}
      <aside
        className={`fixed right-0 top-0 bottom-0 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 overflow-y-auto z-50 transition-all duration-300 ${
          aiAssistantOpen ? 'w-80' : 'w-0'
        } hidden md:block`}
      >
        {aiAssistantOpen && (
          <>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Bot className="w-5 h-5 text-cyan-600" />
                AI Assistant
              </h3>
              <button
                onClick={() => setAiAssistantOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="bg-cyan-50 dark:bg-cyan-900/20 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    👋 Hi! I'm your AI assistant. How can I help you today?
                  </p>
                </div>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ask me anything..."
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700"
                  />
                  <button className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 text-sm">
                    Send
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </aside>

      {/* Floating AI Assistant Toggle */}
      {!aiAssistantOpen && (
        <button
          onClick={() => setAiAssistantOpen(true)}
          className="fixed bottom-6 right-6 p-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all z-50 animate-[glow_3s_ease-in-out_infinite]"
        >
          <Bot className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}

