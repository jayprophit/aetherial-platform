import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { 
  Brain, 
  Shield, 
  DollarSign, 
  Users, 
  Cloud, 
  Smartphone, 
  Activity, 
  Globe, 
  Lock, 
  Zap,
  Database,
  Settings,
  BarChart3,
  Rocket,
  Star,
  CheckCircle,
  ArrowRight,
  Play,
  Pause,
  Download,
  Upload,
  Eye,
  EyeOff,
  Menu,
  X,
  Home,
  MessageSquare,
  Bell,
  User,
  Search,
  Plus,
  Filter,
  RefreshCw,
  TrendingUp,
  Layers,
  Code,
  Cpu,
  HardDrive,
  Network,
  Server,
  Monitor,
  Tablet,
  Watch,
  Gamepad2,
  Headphones,
  Camera,
  Mic,
  Video,
  Image,
  FileText,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Share2,
  Heart,
  Bookmark,
  Flag,
  AlertTriangle,
  Info,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import './App.css'

// API Base URL
const API_BASE = 'https://5000-iamp7d3pke2oar9cw7htr-0a42b8b7.manusvm.computer/api'

// Main App Component
function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [platformStats, setPlatformStats] = useState(null)
  const [features, setFeatures] = useState(null)
  const [capabilities, setCapabilities] = useState(null)
  const [loading, setLoading] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Fetch platform data
  useEffect(() => {
    const fetchPlatformData = async () => {
      try {
        const [healthRes, statsRes, featuresRes, capabilitiesRes] = await Promise.all([
          fetch(`${API_BASE}/health`),
          fetch(`${API_BASE}/stats`),
          fetch(`${API_BASE}/features`),
          fetch(`${API_BASE}/capabilities`)
        ])

        const [health, stats, features, capabilities] = await Promise.all([
          healthRes.json(),
          statsRes.json(),
          featuresRes.json(),
          capabilitiesRes.json()
        ])

        setPlatformStats(stats.stats)
        setFeatures(features.categories)
        setCapabilities(capabilities.capabilities)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching platform data:', error)
        setLoading(false)
      }
    }

    fetchPlatformData()
  }, [])

  // Toggle dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading Ultimate Unified Platform...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden"
              >
                {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Zap className="h-4 w-4 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Ultimate Unified Platform
                </h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Search className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <User className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDarkMode(!darkMode)}
              >
                {darkMode ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 overflow-hidden bg-card border-r`}>
          <div className="p-4 space-y-2">
            <SidebarItem 
              icon={Home} 
              label="Dashboard" 
              active={currentPage === 'dashboard'}
              onClick={() => setCurrentPage('dashboard')}
            />
            <SidebarItem 
              icon={Brain} 
              label="AI Protocols" 
              active={currentPage === 'ai'}
              onClick={() => setCurrentPage('ai')}
            />
            <SidebarItem 
              icon={Shield} 
              label="Privacy & Security" 
              active={currentPage === 'privacy'}
              onClick={() => setCurrentPage('privacy')}
            />
            <SidebarItem 
              icon={DollarSign} 
              label="Monetization" 
              active={currentPage === 'monetization'}
              onClick={() => setCurrentPage('monetization')}
            />
            <SidebarItem 
              icon={Users} 
              label="Social Auth" 
              active={currentPage === 'social'}
              onClick={() => setCurrentPage('social')}
            />
            <SidebarItem 
              icon={Cloud} 
              label="Cloud Services" 
              active={currentPage === 'cloud'}
              onClick={() => setCurrentPage('cloud')}
            />
            <SidebarItem 
              icon={Smartphone} 
              label="App Store" 
              active={currentPage === 'appstore'}
              onClick={() => setCurrentPage('appstore')}
            />
            <SidebarItem 
              icon={BarChart3} 
              label="Analytics" 
              active={currentPage === 'analytics'}
              onClick={() => setCurrentPage('analytics')}
            />
            <SidebarItem 
              icon={Settings} 
              label="Settings" 
              active={currentPage === 'settings'}
              onClick={() => setCurrentPage('settings')}
            />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          {currentPage === 'dashboard' && <DashboardPage stats={platformStats} features={features} />}
          {currentPage === 'ai' && <AIProtocolsPage />}
          {currentPage === 'privacy' && <PrivacySecurityPage />}
          {currentPage === 'monetization' && <MonetizationPage />}
          {currentPage === 'social' && <SocialAuthPage />}
          {currentPage === 'cloud' && <CloudServicesPage />}
          {currentPage === 'appstore' && <AppStorePage />}
          {currentPage === 'analytics' && <AnalyticsPage stats={platformStats} />}
          {currentPage === 'settings' && <SettingsPage />}
        </main>
      </div>
    </div>
  )
}

// Sidebar Item Component
function SidebarItem({ icon: Icon, label, active, onClick }) {
  return (
    <Button
      variant={active ? "default" : "ghost"}
      className="w-full justify-start"
      onClick={onClick}
    >
      <Icon className="h-4 w-4 mr-2" />
      {label}
    </Button>
  )
}

// Dashboard Page
function DashboardPage({ stats, features }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Platform Dashboard</h2>
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          <Activity className="h-3 w-3 mr-1" />
          System Healthy
        </Badge>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Users"
            value={stats.users?.total?.toLocaleString() || '0'}
            icon={Users}
            trend="+12.5%"
            color="blue"
          />
          <StatsCard
            title="AI Requests"
            value={stats.ai_protocols?.requests_processed?.toLocaleString() || '0'}
            icon={Brain}
            trend="+8.3%"
            color="purple"
          />
          <StatsCard
            title="Revenue"
            value={`$${(stats.monetization?.total_revenue / 1000000).toFixed(1)}M` || '$0'}
            icon={DollarSign}
            trend="+15.2%"
            color="green"
          />
          <StatsCard
            title="Active Sessions"
            value={stats.ai_protocols?.active_sessions?.toLocaleString() || '0'}
            icon={Activity}
            trend="+5.7%"
            color="orange"
          />
        </div>
      )}

      {/* Feature Categories */}
      {features && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Object.entries(features).map(([key, category]) => (
            <FeatureCard key={key} category={category} />
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common platform operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuickActionButton icon={Plus} label="Create App" />
            <QuickActionButton icon={Upload} label="Deploy" />
            <QuickActionButton icon={Settings} label="Configure" />
            <QuickActionButton icon={BarChart3} label="Analytics" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Stats Card Component
function StatsCard({ title, value, icon: Icon, trend, color }) {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-100',
    purple: 'text-purple-600 bg-purple-100',
    green: 'text-green-600 bg-green-100',
    orange: 'text-orange-600 bg-orange-100'
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {trend && (
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                {trend}
              </p>
            )}
          </div>
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Feature Card Component
function FeatureCard({ category }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>{category.name}</span>
          <Badge variant="outline">{category.features?.length || 0} features</Badge>
        </CardTitle>
        <CardDescription>{category.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {category.features?.slice(0, 4).map((feature, index) => (
            <div key={index} className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
          {category.features?.length > 4 && (
            <p className="text-sm text-muted-foreground">
              +{category.features.length - 4} more features
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Quick Action Button Component
function QuickActionButton({ icon: Icon, label }) {
  return (
    <Button variant="outline" className="h-20 flex-col space-y-2">
      <Icon className="h-6 w-6" />
      <span className="text-sm">{label}</span>
    </Button>
  )
}

// AI Protocols Page
function AIProtocolsPage() {
  const [protocols, setProtocols] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API_BASE}/ai-protocols/overview`)
      .then(res => res.json())
      .then(data => {
        setProtocols(data.overview?.protocols || [])
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching AI protocols:', err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">AI Protocols</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Protocol
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ProtocolCard
          title="Model Context Protocol (MCP)"
          description="Universal protocol for AI model interaction"
          status="Active"
          models={15}
          icon={Brain}
        />
        <ProtocolCard
          title="Retrieval-Augmented Generation (RAG)"
          description="Knowledge-enhanced AI responses"
          status="Active"
          models={8}
          icon={Database}
        />
        <ProtocolCard
          title="Knowledge-Augmented Generation (KAG)"
          description="Structured knowledge graph integration"
          status="Active"
          models={6}
          icon={Network}
        />
        <ProtocolCard
          title="Content-Augmented Generation (CAG)"
          description="Multi-modal content processing"
          status="Active"
          models={12}
          icon={Layers}
        />
        <ProtocolCard
          title="Agent-to-Agent Communication (A2A)"
          description="Multi-agent coordination system"
          status="Active"
          models={10}
          icon={Users}
        />
      </div>
    </div>
  )
}

// Protocol Card Component
function ProtocolCard({ title, description, status, models, icon: Icon }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Icon className="h-8 w-8 text-primary" />
          <Badge variant={status === 'Active' ? 'default' : 'secondary'}>
            {status}
          </Badge>
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{models} models</span>
          <Button size="sm" variant="outline">
            Configure
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Privacy & Security Page
function PrivacySecurityPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Privacy & Security</h2>
        <Button>
          <Shield className="h-4 w-4 mr-2" />
          Security Scan
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SecurityFeatureCard
          title="Onion Router Network"
          description="Anonymous routing with 20 global nodes"
          status="Active"
          connections={234}
          icon={Globe}
        />
        <SecurityFeatureCard
          title="Global VPN Service"
          description="10 server locations worldwide"
          status="Active"
          connections={5678}
          icon={Shield}
        />
        <SecurityFeatureCard
          title="End-to-End Encryption"
          description="Advanced cryptographic protection"
          status="Active"
          connections={123456}
          icon={Lock}
        />
        <SecurityFeatureCard
          title="Anonymous Authentication"
          description="Zero-knowledge proof systems"
          status="Active"
          connections={987}
          icon={Eye}
        />
      </div>
    </div>
  )
}

// Security Feature Card Component
function SecurityFeatureCard({ title, description, status, connections, icon: Icon }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Icon className="h-8 w-8 text-green-600" />
          <Badge variant="default" className="bg-green-100 text-green-800">
            {status}
          </Badge>
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {connections.toLocaleString()} active connections
          </span>
          <Button size="sm" variant="outline">
            Manage
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Monetization Page
function MonetizationPage() {
  const subscriptionTiers = [
    {
      name: 'Free',
      price: '$0',
      features: ['Basic AI access', '100 requests/month', 'Community support'],
      popular: false
    },
    {
      name: 'Basic',
      price: '$9.99',
      features: ['Advanced AI models', '10,000 requests/month', 'Email support', 'Basic analytics'],
      popular: false
    },
    {
      name: 'Pro',
      price: '$29.99',
      features: ['All AI protocols', 'Unlimited requests', 'Priority support', 'Advanced analytics', 'Custom integrations'],
      popular: true
    },
    {
      name: 'Enterprise',
      price: '$99.99',
      features: ['Everything in Pro', 'Dedicated support', 'Custom deployment', 'SLA guarantee', 'White-label options'],
      popular: false
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Monetization</h2>
        <Button>
          <BarChart3 className="h-4 w-4 mr-2" />
          Revenue Analytics
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {subscriptionTiers.map((tier, index) => (
          <SubscriptionCard key={index} tier={tier} />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>Supported payment options</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <PaymentMethodCard name="Credit Cards" icon={DollarSign} />
            <PaymentMethodCard name="PayPal" icon={Globe} />
            <PaymentMethodCard name="Apple Pay" icon={Smartphone} />
            <PaymentMethodCard name="Cryptocurrency" icon={Cpu} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Subscription Card Component
function SubscriptionCard({ tier }) {
  return (
    <Card className={tier.popular ? 'border-primary shadow-lg' : ''}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{tier.name}</CardTitle>
          {tier.popular && <Badge>Popular</Badge>}
        </div>
        <div className="text-3xl font-bold">{tier.price}</div>
        <CardDescription>per month</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {tier.features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>
        <Button className="w-full mt-4" variant={tier.popular ? 'default' : 'outline'}>
          {tier.name === 'Free' ? 'Current Plan' : 'Upgrade'}
        </Button>
      </CardContent>
    </Card>
  )
}

// Payment Method Card Component
function PaymentMethodCard({ name, icon: Icon }) {
  return (
    <div className="flex items-center space-x-2 p-3 border rounded-lg">
      <Icon className="h-5 w-5 text-muted-foreground" />
      <span className="text-sm">{name}</span>
    </div>
  )
}

// Social Auth Page
function SocialAuthPage() {
  const providers = [
    { name: 'Google', icon: Globe, users: '45.2K', status: 'Active' },
    { name: 'Microsoft', icon: Monitor, users: '32.1K', status: 'Active' },
    { name: 'GitHub', icon: Code, users: '28.7K', status: 'Active' },
    { name: 'Facebook', icon: Users, users: '51.3K', status: 'Active' },
    { name: 'Apple', icon: Smartphone, users: '38.9K', status: 'Active' },
    { name: 'LinkedIn', icon: Network, users: '22.4K', status: 'Active' }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Social Authentication</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Provider
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {providers.map((provider, index) => (
          <ProviderCard key={index} provider={provider} />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Multi-Factor Authentication</CardTitle>
          <CardDescription>Enhanced security options</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <MFAOption name="TOTP (Time-based)" enabled={true} />
            <MFAOption name="SMS Verification" enabled={true} />
            <MFAOption name="Email Verification" enabled={true} />
            <MFAOption name="Backup Codes" enabled={true} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Provider Card Component
function ProviderCard({ provider }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <provider.icon className="h-8 w-8 text-primary" />
          <Badge variant="default" className="bg-green-100 text-green-800">
            {provider.status}
          </Badge>
        </div>
        <CardTitle className="text-lg">{provider.name}</CardTitle>
        <CardDescription>{provider.users} connected users</CardDescription>
      </CardHeader>
      <CardContent>
        <Button size="sm" variant="outline" className="w-full">
          Configure
        </Button>
      </CardContent>
    </Card>
  )
}

// MFA Option Component
function MFAOption({ name, enabled }) {
  return (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <span className="text-sm font-medium">{name}</span>
      <Badge variant={enabled ? 'default' : 'secondary'}>
        {enabled ? 'Enabled' : 'Disabled'}
      </Badge>
    </div>
  )
}

// Cloud Services Page
function CloudServicesPage() {
  const cloudProviders = [
    { name: 'AWS', regions: 4, services: 6, status: 'Active' },
    { name: 'Azure', regions: 4, services: 6, status: 'Active' },
    { name: 'Google Cloud', regions: 4, services: 6, status: 'Active' },
    { name: 'IBM Cloud', regions: 4, services: 6, status: 'Active' }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Cloud Services</h2>
        <Button>
          <Cloud className="h-4 w-4 mr-2" />
          Deploy Infrastructure
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cloudProviders.map((provider, index) => (
          <CloudProviderCard key={index} provider={provider} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Database Types</CardTitle>
            <CardDescription>Supported database systems</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <DatabaseType name="PostgreSQL" type="Relational" />
              <DatabaseType name="MongoDB" type="NoSQL" />
              <DatabaseType name="Redis" type="In-Memory" />
              <DatabaseType name="Neo4j" type="Graph" />
              <DatabaseType name="InfluxDB" type="Time-Series" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Multi-Cloud Deployments</CardTitle>
            <CardDescription>Cross-provider infrastructure</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Active Deployments</span>
                <Badge>12</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Cross-Cloud Connections</span>
                <Badge>8</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Total Resources</span>
                <Badge>156</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Cloud Provider Card Component
function CloudProviderCard({ provider }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Cloud className="h-8 w-8 text-blue-600" />
          <Badge variant="default" className="bg-blue-100 text-blue-800">
            {provider.status}
          </Badge>
        </div>
        <CardTitle className="text-lg">{provider.name}</CardTitle>
        <CardDescription>
          {provider.regions} regions, {provider.services} services
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button size="sm" variant="outline" className="w-full">
          Manage
        </Button>
      </CardContent>
    </Card>
  )
}

// Database Type Component
function DatabaseType({ name, type }) {
  return (
    <div className="flex items-center justify-between p-2 border rounded">
      <span className="text-sm font-medium">{name}</span>
      <Badge variant="outline">{type}</Badge>
    </div>
  )
}

// App Store Page
function AppStorePage() {
  const platforms = [
    { name: 'iOS App Store', apps: 12, status: 'Active', icon: Smartphone },
    { name: 'Google Play', apps: 15, status: 'Active', icon: Smartphone },
    { name: 'Microsoft Store', apps: 8, status: 'Active', icon: Monitor },
    { name: 'Mac App Store', apps: 6, status: 'Active', icon: Monitor },
    { name: 'Web (PWA)', apps: 20, status: 'Active', icon: Globe },
    { name: 'Linux', apps: 4, status: 'Active', icon: Server }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">App Store Deployment</h2>
        <Button>
          <Rocket className="h-4 w-4 mr-2" />
          Deploy App
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {platforms.map((platform, index) => (
          <PlatformCard key={index} platform={platform} />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>App Categories</CardTitle>
          <CardDescription>Available app categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {['Productivity', 'Entertainment', 'Social', 'Business', 'Education', 'Health', 'Utilities', 'Lifestyle', 'Finance', 'News'].map((category, index) => (
              <Badge key={index} variant="outline" className="justify-center">
                {category}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Platform Card Component
function PlatformCard({ platform }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <platform.icon className="h-8 w-8 text-primary" />
          <Badge variant="default" className="bg-green-100 text-green-800">
            {platform.status}
          </Badge>
        </div>
        <CardTitle className="text-lg">{platform.name}</CardTitle>
        <CardDescription>{platform.apps} deployed apps</CardDescription>
      </CardHeader>
      <CardContent>
        <Button size="sm" variant="outline" className="w-full">
          Manage Apps
        </Button>
      </CardContent>
    </Card>
  )
}

// Analytics Page
function AnalyticsPage({ stats }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Analytics Dashboard</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Users"
            value={stats.users?.total?.toLocaleString() || '0'}
            change="+12.5%"
            positive={true}
          />
          <MetricCard
            title="Active Today"
            value={stats.users?.active_today?.toLocaleString() || '0'}
            change="+8.3%"
            positive={true}
          />
          <MetricCard
            title="Premium Subscribers"
            value={stats.users?.premium_subscribers?.toLocaleString() || '0'}
            change="+15.2%"
            positive={true}
          />
          <MetricCard
            title="Enterprise Clients"
            value={stats.users?.enterprise_clients?.toLocaleString() || '0'}
            change="+5.7%"
            positive={true}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>System Performance</CardTitle>
            <CardDescription>Real-time system metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <PerformanceMetric label="Uptime" value="99.99%" />
              <PerformanceMetric label="Response Time" value="45ms" />
              <PerformanceMetric label="Error Rate" value="0.01%" />
              <PerformanceMetric label="Capacity Usage" value="67%" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Feature Usage</CardTitle>
            <CardDescription>Most popular platform features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <FeatureUsage feature="AI Protocols" usage={85} />
              <FeatureUsage feature="Cloud Services" usage={72} />
              <FeatureUsage feature="App Store" usage={68} />
              <FeatureUsage feature="Social Auth" usage={91} />
              <FeatureUsage feature="Privacy Tools" usage={56} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Metric Card Component
function MetricCard({ title, value, change, positive }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            <p className={`text-xs flex items-center mt-1 ${positive ? 'text-green-600' : 'text-red-600'}`}>
              <TrendingUp className="h-3 w-3 mr-1" />
              {change}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Performance Metric Component
function PerformanceMetric({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  )
}

// Feature Usage Component
function FeatureUsage({ feature, usage }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{feature}</span>
        <span className="text-sm text-muted-foreground">{usage}%</span>
      </div>
      <Progress value={usage} className="h-2" />
    </div>
  )
}

// Settings Page
function SettingsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Settings</h2>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Manage your platform preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <SettingItem label="Platform Name" value="Ultimate Unified Platform" />
              <SettingItem label="Default Theme" value="System" />
              <SettingItem label="Language" value="English" />
              <SettingItem label="Timezone" value="UTC" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage security and privacy options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <SettingItem label="Two-Factor Authentication" value="Enabled" />
              <SettingItem label="Session Timeout" value="30 minutes" />
              <SettingItem label="Login Notifications" value="Enabled" />
              <SettingItem label="API Access" value="Restricted" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <SettingItem label="Email Notifications" value="Enabled" />
              <SettingItem label="Push Notifications" value="Enabled" />
              <SettingItem label="SMS Notifications" value="Disabled" />
              <SettingItem label="Weekly Reports" value="Enabled" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Billing Settings</CardTitle>
              <CardDescription>Manage your subscription and billing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <SettingItem label="Current Plan" value="Pro ($29.99/month)" />
              <SettingItem label="Payment Method" value="**** 1234" />
              <SettingItem label="Billing Cycle" value="Monthly" />
              <SettingItem label="Next Billing Date" value="Feb 15, 2024" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Setting Item Component
function SettingItem({ label, value }) {
  return (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <span className="text-sm font-medium">{label}</span>
      <span className="text-sm text-muted-foreground">{value}</span>
    </div>
  )
}

export default App

