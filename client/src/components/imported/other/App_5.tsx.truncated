import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Database, 
  Cpu, 
  Shield, 
  Globe, 
  Zap, 
  Users, 
  BarChart3, 
  Settings, 
  Menu, 
  X, 
  ChevronRight,
  Play,
  Pause,
  Star,
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Layers,
  Smartphone,
  Monitor,
  Tablet,
  Wifi,
  Lock,
  Cloud,
  Code,
  Briefcase,
  Heart,
  Scale,
  DollarSign,
  Wrench,
  Building,
  Rocket,
  Target,
  Award,
  Lightbulb,
  Network,
  Gauge
} from 'lucide-react';
import './App.css';

// Types
interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  status: 'active' | 'beta' | 'coming-soon';
  color: string;
}

interface Industry {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  features: string[];
  color: string;
}

interface Metric {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
}

// Main App Component
function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Features data
  const features: Feature[] = [
    {
      id: 'ai-engine',
      title: 'Advanced AI Engine',
      description: 'Cutting-edge AI with reasoning, MCP integration, and quantum processing capabilities',
      icon: <Brain className="w-8 h-8" />,
      category: 'AI & Machine Learning',
      status: 'active',
      color: 'from-blue-500 to-purple-600'
    },
    {
      id: 'blockchain',
      title: '3D Blockchain with Runestones',
      description: 'Revolutionary multi-dimensional blockchain with X,Y,Z+ coordinates and mystical runestones',
      icon: <Layers className="w-8 h-8" />,
      category: 'Blockchain',
      status: 'active',
      color: 'from-purple-500 to-pink-600'
    },
    {
      id: 'iot-integration',
      title: 'Manufacturing IoT',
      description: 'Complete IoT integration for 3D printers, CNC machines, laser engravers, and more',
      icon: <Cpu className="w-8 h-8" />,
      category: 'IoT & Manufacturing',
      status: 'active',
      color: 'from-green-500 to-blue-600'
    },
    {
      id: 'specialized-databases',
      title: 'Specialized Field Databases',
      description: 'Comprehensive databases for medical, engineering, legal, and financial fields',
      icon: <Database className="w-8 h-8" />,
      category: 'Data & Analytics',
      status: 'active',
      color: 'from-orange-500 to-red-600'
    },
    {
      id: 'global-communication',
      title: 'Global VoIP Communication',
      description: 'VoIP services supporting 195-240 countries with multiple providers',
      icon: <Globe className="w-8 h-8" />,
      category: 'Communication',
      status: 'active',
      color: 'from-cyan-500 to-blue-600'
    },
    {
      id: 'offline-capabilities',
      title: 'Offline Capabilities',
      description: 'Full offline functionality with data synchronization and local processing',
      icon: <Wifi className="w-8 h-8" />,
      category: 'Infrastructure',
      status: 'active',
      color: 'from-indigo-500 to-purple-600'
    },
    {
      id: 'cloud-services',
      title: 'Cloud Services Suite',
      description: 'Complete IaaS, PaaS, and SaaS solutions for enterprise needs',
      icon: <Cloud className="w-8 h-8" />,
      category: 'Cloud Computing',
      status: 'active',
      color: 'from-teal-500 to-green-600'
    },
    {
      id: 'security',
      title: 'Advanced Security',
      description: 'Military-grade encryption, quantum-resistant security, and compliance frameworks',
      icon: <Shield className="w-8 h-8" />,
      category: 'Security',
      status: 'active',
      color: 'from-red-500 to-pink-600'
    }
  ];

  // Industries data
  const industries: Industry[] = [
    {
      id: 'medical',
      name: 'Medical & Healthcare',
      icon: <Heart className="w-12 h-12" />,
      description: 'Comprehensive medical database with research papers, equipment, pharmaceuticals, and education',
      features: ['Medical Research Database', 'Equipment Catalog', 'Pharmaceutical Database', 'Medical Education'],
      color: 'medical-theme'
    },
    {
      id: 'engineering',
      name: 'Engineering',
      icon: <Wrench className="w-12 h-12" />,
      description: 'Complete engineering solutions with CAD files, materials database, and simulation tools',
      features: ['CAD File Library', 'Materials Database', 'Engineering Tools', 'Simulation Engine'],
      color: 'engineering-theme'
    },
    {
      id: 'legal',
      name: 'Legal Services',
      icon: <Scale className="w-12 h-12" />,
      description: 'Legal research tools, case law database, document templates, and case management',
      features: ['Case Law Database', 'Legal Research', 'Document Templates', 'Case Management'],
      color: 'legal-theme'
    },
    {
      id: 'financial',
      name: 'Financial Services',
      icon: <DollarSign className="w-12 h-12" />,
      description: 'Advanced financial tools with market data, trading algorithms, and portfolio management',
      features: ['Market Data', 'Trading Algorithms', 'Portfolio Management', 'Risk Analysis'],
      color: 'financial-theme'
    },
    {
      id: 'manufacturing',
      name: 'Manufacturing',
      icon: <Building className="w-12 h-12" />,
      description: 'IoT integration for manufacturing equipment and production optimization',
      features: ['IoT Integration', 'Production Monitoring', 'Quality Control', 'Predictive Maintenance'],
      color: 'from-gray-500 to-blue-600'
    },
    {
      id: 'enterprise',
      name: 'Enterprise Solutions',
      icon: <Briefcase className="w-12 h-12" />,
      description: 'Complete ERP system with business process automation and analytics',
      features: ['ERP System', 'Business Analytics', 'Process Automation', 'Compliance Management'],
      color: 'from-purple-500 to-indigo-600'
    }
  ];

  // Metrics data
  const metrics: Metric[] = [
    { label: 'Active Users', value: '2.5M+', change: '+15%', trend: 'up' },
    { label: 'Data Processed', value: '50TB', change: '+25%', trend: 'up' },
    { label: 'API Calls/Day', value: '100M+', change: '+30%', trend: 'up' },
    { label: 'Uptime', value: '99.99%', change: '0%', trend: 'stable' },
    { label: 'Countries Served', value: '195+', change: '+5', trend: 'up' },
    { label: 'Industries', value: '50+', change: '+8', trend: 'up' }
  ];

  // Navigation items
  const navItems = [
    { id: 'home', label: 'Home', icon: <Monitor className="w-5 h-5" /> },
    { id: 'features', label: 'Features', icon: <Star className="w-5 h-5" /> },
    { id: 'industries', label: 'Industries', icon: <Building className="w-5 h-5" /> },
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'platform', label: 'Platform', icon: <Layers className="w-5 h-5" /> },
    { id: 'about', label: 'About', icon: <Lightbulb className="w-5 h-5" /> }
  ];

  // Component: Navigation
  const Navigation = () => (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center animate-pulse-glow">
              <Network className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient">Unified Platform</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`nav-link flex items-center space-x-2 ${
                  activeSection === item.id ? 'text-white' : 'text-white/70'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg glass hover-glow"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass-dark border-t border-white/10 animate-fade-in-up">
          <div className="px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  activeSection === item.id 
                    ? 'bg-white/20 text-white' 
                    : 'text-white/70 hover:bg-white/10'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );

  // Component: Hero Section
  const HeroSection = () => (
    <section className="hero-section">
      <div className="hero-background"></div>
      <div className="particles">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${6 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-gradient">Unified Platform</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-4xl mx-auto">
            Revolutionary world-class platform integrating AI, blockchain, IoT, specialized databases, 
            and comprehensive business solutions for every industry
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
            <button 
              onClick={() => setActiveSection('platform')}
              className="btn btn-primary hover-lift flex items-center space-x-2"
            >
              <Rocket className="w-5 h-5" />
              <span>Explore Platform</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setActiveSection('features')}
              className="btn btn-secondary hover-lift flex items-center space-x-2"
            >
              <Play className="w-5 h-5" />
              <span>View Features</span>
            </button>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl mx-auto">
            {metrics.map((metric, index) => (
              <div key={metric.label} className="card hover-scale animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="text-2xl font-bold text-gradient mb-1">{metric.value}</div>
                <div className="text-sm text-white/70 mb-2">{metric.label}</div>
                <div className={`text-xs flex items-center space-x-1 ${
                  metric.trend === 'up' ? 'text-green-400' : 
                  metric.trend === 'down' ? 'text-red-400' : 'text-gray-400'
                }`}>
                  <TrendingUp className="w-3 h-3" />
                  <span>{metric.change}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );

  // Component: Features Section
  const FeaturesSection = () => (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
            Powerful Features
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Comprehensive suite of advanced technologies and tools designed to revolutionize 
            how businesses operate across all industries
          </p>
        </div>

        <div className="feature-grid">
          {features.map((feature, index) => (
            <div 
              key={feature.id} 
              className="card hover-lift animate-slide-in-left"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-6 animate-float`}>
                {feature.icon}
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  feature.status === 'active' ? 'bg-green-500/20 text-green-400' :
                  feature.status === 'beta' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  {feature.status === 'active' ? 'Active' : 
                   feature.status === 'beta' ? 'Beta' : 'Coming Soon'}
                </span>
              </div>
              
              <p className="text-white/70 mb-4">{feature.description}</p>
              <div className="text-sm text-white/50 mb-4">{feature.category}</div>
              
              <button className="w-full btn btn-secondary hover-glow flex items-center justify-center space-x-2">
                <span>Learn More</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  // Component: Industries Section
  const IndustriesSection = () => (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
            Industry Solutions
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Specialized solutions tailored for specific industries with comprehensive 
            databases, tools, and workflows
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {industries.map((industry, index) => (
            <div 
              key={industry.id} 
              className="card hover-lift animate-scale-in"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center animate-float">
                  {industry.icon}
                </div>
                <h3 className="tex
(Content truncated due to size limit. Use line ranges to read in chunks)