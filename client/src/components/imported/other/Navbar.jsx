import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Menu, X, Search, Bell, MessageCircle, User, Settings,
  Home, Users, ShoppingBag, Briefcase, Brain, CreditCard,
  Shield, Heart, BookOpen, Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const Navbar = ({ user, onLogin, onLogout, sidebarOpen, setSidebarOpen, currentTab, setCurrentTab }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [showUserMenu, setShowUserMenu] = useState(false)
  const navigate = useNavigate()

  const mainTabs = [
    { id: 'home', label: 'Home', icon: Home, path: '/' },
    { id: 'communities', label: 'Communities', icon: Users, path: '/communities' },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag, path: '/marketplace' },
    { id: 'business', label: 'Business', icon: Briefcase, path: '/business' },
  ]

  const platformTabs = [
    { id: 'ai', label: 'AI Hub', icon: Brain, path: '/ai' },
    { id: 'blockchain', label: 'Blockchain', icon: Zap, path: '/blockchain' },
    { id: 'banking', label: 'Banking', icon: CreditCard, path: '/banking' },
    { id: 'healthcare', label: 'Healthcare', icon: Heart, path: '/healthcare' },
    { id: 'learning', label: 'Learning', icon: BookOpen, path: '/learning' },
  ]

  const handleTabClick = (tab) => {
    setCurrentTab(tab.id)
    navigate(tab.path)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Implement search functionality
      console.log('Searching for:', searchQuery)
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-full px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            {/* Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>

            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Unified Platform
              </span>
            </Link>

            {/* Main Navigation Tabs */}
            <div className="hidden md:flex items-center space-x-1">
              {mainTabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={currentTab === tab.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleTabClick(tab)}
                  className="flex items-center space-x-2"
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Center Section - Search */}
          <div className="flex-1 max-w-md mx-4">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search posts, communities, users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </form>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2">
            {/* Platform Tabs */}
            <div className="hidden lg:flex items-center space-x-1">
              {platformTabs.slice(0, 3).map((tab) => (
                <Button
                  key={tab.id}
                  variant={currentTab === tab.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleTabClick(tab)}
                  className="flex items-center space-x-1"
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden xl:inline">{tab.label}</span>
                </Button>
              ))}
            </div>

            {user ? (
              <>
                {/* Notifications */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/notifications')}
                  className="relative"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                    3
                  </span>
                </Button>

                {/* Messages */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/messages')}
                  className="relative"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full text-xs flex items-center justify-center text-white">
                    5
                  </span>
                </Button>

                {/* User Menu */}
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {user.name?.charAt(0) || user.email?.charAt(0)}
                      </span>
                    </div>
                    <span className="hidden md:inline">{user.name || user.email}</span>
                  </Button>

                  {/* User Dropdown */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1">
                      <Link
                        to="/profile"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </Link>
                      <hr className="my-1 border-gray-200 dark:border-gray-600" />
                      <button
                        onClick={() => {
                          onLogout()
                          setShowUserMenu(false)
                        }}
                        className="w-full text-left flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <span>Sign out</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={onLogin}>
                  Sign In
                </Button>
                <Button size="sm" onClick={onLogin}>
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

