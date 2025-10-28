import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Home, Users, ShoppingBag, MessageCircle, Bell, User, Settings,
  TrendingUp, BarChart3, Wallet, CreditCard, PieChart, LineChart,
  Brain, Cpu, Zap, Shield, Lock, Globe, Heart, Stethoscope,
  BookOpen, GraduationCap, Building, Briefcase, Factory,
  FileText, Database, Cloud, Smartphone, Monitor, Tablet,
  Camera, Video, Music, Headphones, Gamepad2, Coffee,
  Car, Plane, Home as HomeIcon, MapPin, Calendar, Clock,
  Star, Award, Trophy, Target, Rocket, Sparkles
} from 'lucide-react'

const Sidebar = ({ user, isOpen, currentTab, setCurrentTab }) => {
  const location = useLocation()

  const sidebarSections = [
    {
      title: 'Main',
      items: [
        { id: 'home', label: 'Home Feed', icon: Home, path: '/', badge: null },
        { id: 'profile', label: 'My Profile', icon: User, path: '/profile', badge: null },
        { id: 'communities', label: 'Communities', icon: Users, path: '/communities', badge: '12' },
        { id: 'messages', label: 'Messages', icon: MessageCircle, path: '/messages', badge: '5' },
        { id: 'notifications', label: 'Notifications', icon: Bell, path: '/notifications', badge: '3' },
      ]
    },
    {
      title: 'Trading & Finance',
      items: [
        { id: 'trading', label: 'Trading Hub', icon: TrendingUp, path: '/trading', badge: 'Live' },
        { id: 'portfolio', label: 'Portfolio', icon: PieChart, path: '/portfolio', badge: '+2.4%' },
        { id: 'charts', label: 'Charts', icon: BarChart3, path: '/charts', badge: null },
        { id: 'watchlist', label: 'Watchlist', icon: Star, path: '/watchlist', badge: '24' },
        { id: 'banking', label: 'Banking', icon: CreditCard, path: '/banking', badge: null },
        { id: 'wallet', label: 'Crypto Wallet', icon: Wallet, path: '/wallet', badge: null },
        { id: 'defi', label: 'DeFi Protocols', icon: Zap, path: '/defi', badge: 'New' },
        { id: 'nft', label: 'NFT Marketplace', icon: Award, path: '/nft', badge: null },
      ]
    },
    {
      title: 'AI & Technology',
      items: [
        { id: 'ai-hub', label: 'AI Hub', icon: Brain, path: '/ai', badge: null },
        { id: 'ai-chat', label: 'AI Assistant', icon: MessageCircle, path: '/ai/chat', badge: null },
        { id: 'ai-tools', label: 'AI Tools', icon: Cpu, path: '/ai/tools', badge: null },
        { id: 'blockchain', label: 'Blockchain', icon: Shield, path: '/blockchain', badge: null },
        { id: 'quantum', label: 'Quantum Computing', icon: Sparkles, path: '/quantum', badge: 'Beta' },
      ]
    },
    {
      title: 'Business & Enterprise',
      items: [
        { id: 'business', label: 'Business Suite', icon: Briefcase, path: '/business', badge: null },
        { id: 'erp', label: 'ERP System', icon: Building, path: '/erp', badge: null },
        { id: 'crm', label: 'CRM', icon: Users, path: '/crm', badge: null },
        { id: 'analytics', label: 'Analytics', icon: LineChart, path: '/analytics', badge: null },
        { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag, path: '/marketplace', badge: null },
      ]
    },
    {
      title: 'Healthcare & Life',
      items: [
        { id: 'healthcare', label: 'Healthcare', icon: Heart, path: '/healthcare', badge: null },
        { id: 'medical', label: 'Medical Records', icon: Stethoscope, path: '/medical', badge: null },
        { id: 'fitness', label: 'Fitness Tracker', icon: Target, path: '/fitness', badge: null },
        { id: 'nutrition', label: 'Nutrition', icon: Coffee, path: '/nutrition', badge: null },
      ]
    },
    {
      title: 'Learning & Knowledge',
      items: [
        { id: 'learning', label: 'Learning Hub', icon: BookOpen, path: '/learning', badge: null },
        { id: 'courses', label: 'Courses', icon: GraduationCap, path: '/courses', badge: '3 Active' },
        { id: 'knowledge', label: 'Knowledge Base', icon: Database, path: '/knowledge', badge: null },
        { id: 'research', label: 'Research Tools', icon: FileText, path: '/research', badge: null },
      ]
    },
    {
      title: 'Media & Content',
      items: [
        { id: 'media', label: 'Media Center', icon: Video, path: '/media', badge: null },
        { id: 'photos', label: 'Photos', icon: Camera, path: '/photos', badge: null },
        { id: 'music', label: 'Music', icon: Music, path: '/music', badge: null },
        { id: 'podcasts', label: 'Podcasts', icon: Headphones, path: '/podcasts', badge: null },
        { id: 'games', label: 'Games', icon: Gamepad2, path: '/games', badge: null },
      ]
    },
    {
      title: 'Lifestyle & Services',
      items: [
        { id: 'travel', label: 'Travel', icon: Plane, path: '/travel', badge: null },
        { id: 'real-estate', label: 'Real Estate', icon: HomeIcon, path: '/real-estate', badge: null },
        { id: 'automotive', label: 'Automotive', icon: Car, path: '/automotive', badge: null },
        { id: 'events', label: 'Events', icon: Calendar, path: '/events', badge: '2 Today' },
        { id: 'local', label: 'Local Services', icon: MapPin, path: '/local', badge: null },
      ]
    },
    {
      title: 'Platform & Cloud',
      items: [
        { id: 'cloud', label: 'Cloud Storage', icon: Cloud, path: '/cloud', badge: '85% Used' },
        { id: 'mobile', label: 'Mobile Apps', icon: Smartphone, path: '/mobile', badge: null },
        { id: 'desktop', label: 'Desktop Apps', icon: Monitor, path: '/desktop', badge: null },
        { id: 'tablet', label: 'Tablet Apps', icon: Tablet, path: '/tablet', badge: null },
      ]
    }
  ]

  const isActive = (path) => {
    return location.pathname === path
  }

  if (!isOpen) return null

  return (
    <div className="fixed left-0 top-16 bottom-0 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto z-40">
      <div className="p-4">
        {/* User Info */}
        {user && (
          <div className="mb-6 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {user.name?.charAt(0) || user.email?.charAt(0)}
                </span>
              </div>
              <div>
                <div className="font-semibold text-sm">{user.name || 'User'}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{user.email}</div>
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-green-600 dark:text-green-400">● Online</span>
              <span className="text-gray-500">Level 5</span>
            </div>
          </div>
        )}

        {/* Navigation Sections */}
        {sidebarSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              {section.title}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive(item.path)
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setCurrentTab(item.id)}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      item.badge === 'Live' ? 'bg-red-100 text-red-600' :
                      item.badge === 'New' ? 'bg-green-100 text-green-600' :
                      item.badge === 'Beta' ? 'bg-yellow-100 text-yellow-600' :
                      item.badge.includes('%') ? 'bg-green-100 text-green-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* Quick Stats */}
        <div className="mt-6 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            Quick Stats
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Portfolio Value</span>
              <span className="font-semibold text-green-600">$12,450</span>
            </div>
            <div className="flex justify-between">
              <span>Active Trades</span>
              <span className="font-semibold">3</span>
            </div>
            <div className="flex justify-between">
              <span>Communities</span>
              <span className="font-semibold">12</span>
            </div>
            <div className="flex justify-between">
              <span>AI Credits</span>
              <span className="font-semibold text-blue-600">2,450</span>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="mt-6">
          <Link
            to="/settings"
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Sidebar

