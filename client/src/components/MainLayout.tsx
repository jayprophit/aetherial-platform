import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  Home, Users, UsersRound, MessageCircle, ShoppingCart,
  BookOpen, Briefcase, Bot, Wallet, TrendingUp, Image,
  Wifi, Cpu, Vote, Bell, Settings, Menu, X, ChevronDown,
  User, LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/_core/hooks/useAuth';
import { APP_TITLE, getLoginUrl } from '@/const';

interface NavItem {
  label: string;
  icon: any;
  href: string;
  children?: NavItem[];
}

const navigation: NavItem[] = [
  { label: 'Home', icon: Home, href: '/' },
  { label: 'Friends', icon: Users, href: '/friends' },
  { label: 'Groups', icon: UsersRound, href: '/groups' },
  { label: 'Messages', icon: MessageCircle, href: '/messages' },
  { label: 'Marketplace', icon: ShoppingCart, href: '/marketplace' },
  { label: 'Learning', icon: BookOpen, href: '/learning' },
  { label: 'Jobs', icon: Briefcase, href: '/jobs' },
  { label: 'AI Agents', icon: Bot, href: '/ai-agents' },
  { label: 'Wallet', icon: Wallet, href: '/wallet' },
  { label: 'Trading', icon: TrendingUp, href: '/trading' },
  { label: 'NFTs', icon: Image, href: '/nft' },
  { label: 'IoT', icon: Wifi, href: '/iot' },
  { label: 'Robotics', icon: Cpu, href: '/robotics' },
  { label: 'Governance', icon: Vote, href: '/governance' },
];

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [location] = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <Link href="/">
              <h1 className="text-xl font-bold text-blue-600">{APP_TITLE}</h1>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link href="/profile">
                  <Button variant="ghost" className="gap-2">
                    <User className="h-5 w-5" />
                    <span>{user?.name || 'Profile'}</span>
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => logout()}>
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <Button asChild>
                <a href={getLoginUrl()}>Login</a>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 bottom-0 w-64 bg-white border-r border-gray-200 transition-transform duration-300 z-40 overflow-y-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav className="p-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            
            return (
              <Link key={item.href} href={item.href}>
                <a
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </a>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main
        className={`pt-16 transition-all duration-300 ${
          sidebarOpen ? 'ml-64' : 'ml-0'
        }`}
      >
        <div className="container max-w-6xl mx-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}

