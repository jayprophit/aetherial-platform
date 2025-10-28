import React, { useState, useEffect } from 'react';
import './App.css';
import { 
  Menu, X, ChevronDown, Play, Pause, Volume2, 
  Link, Brain, CreditCard, ShoppingCart, Users, 
  Shield, Gavel, FileText, Cpu, Database, Zap,
  Globe, Smartphone, Monitor, Tablet, Star, TrendingUp,
  BarChart3, PieChart, Activity, Clock, CheckCircle,
  ArrowRight, Sparkles, Rocket, Target, Award
} from 'lucide-react';

const UnifiedPlatform = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [isAvatarListening, setIsAvatarListening] = useState(false);
  const [isAvatarSpeaking, setIsAvatarSpeaking] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [metrics, setMetrics] = useState({
    users: 2500000,
    transactions: 125000000,
    uptime: 99.99,
    countries: 195
  });

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Animate metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        users: prev.users + Math.floor(Math.random() * 10),
        transactions: prev.transactions + Math.floor(Math.random() * 100),
        uptime: 99.99,
        countries: 195
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Link className="w-8 h-8" />,
      title: "Advanced Blockchain",
      description: "3D blockchain with runestones, multi-consensus, quantum-resistant cryptography",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI & Machine Learning",
      description: "GPT-4, Claude-3, advanced reasoning, multi-modal processing",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: "Banking & Finance",
      description: "Complete banking services, loans, credit cards, investment management",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <ShoppingCart className="w-8 h-8" />,
      title: "E-commerce Platform",
      description: "Full e-commerce solution with inventory, payments, and analytics",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Social Media",
      description: "Complete social networking with posts, comments, messaging",
      color: "from-indigo-500 to-purple-500"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Privacy & Security",
      description: "VPN, Tor integration, quantum encryption, privacy analytics",
      color: "from-gray-500 to-slate-500"
    },
    {
      icon: <Gavel className="w-8 h-8" />,
      title: "Legal Services",
      description: "Legal consultation, case management, document generation",
      color: "from-amber-500 to-yellow-500"
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Universal File Processing",
      description: "Read/write 200+ file formats, advanced analysis and conversion",
      color: "from-teal-500 to-cyan-500"
    }
  ];

  const industries = [
    { name: "Healthcare", icon: "🏥", description: "Medical AI, patient management, CRISPR gene editing" },
    { name: "Engineering", icon: "⚙️", description: "CAD files, simulations, IoT manufacturing integration" },
    { name: "Legal", icon: "⚖️", description: "Case law, research tools, document templates" },
    { name: "Financial", icon: "💰", description: "Trading algorithms, portfolio management, risk analysis" },
    { name: "Manufacturing", icon: "🏭", description: "3D printing, CNC machines, quality control" },
    { name: "Enterprise", icon: "🏢", description: "ERP systems, workflow automation, business intelligence" }
  ];

  const platforms = [
    { name: "Website", icon: <Globe className="w-6 h-6" />, status: "Live" },
    { name: "Mobile", icon: <Smartphone className="w-6 h-6" />, status: "Live" },
    { name: "Desktop", icon: <Monitor className="w-6 h-6" />, status: "Live" },
    { name: "Tablet", icon: <Tablet className="w-6 h-6" />, status: "Live" }
  ];

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    setActiveSection(sectionId);
    setIsMenuOpen(false);
  };

  const handleVoiceCommand = () => {
    if (!isAvatarListening && !isAvatarSpeaking) {
      setIsAvatarListening(true);
      // Simulate voice recognition
      setTimeout(() => {
        setIsAvatarListening(false);
        setIsAvatarSpeaking(true);
        // Simulate AI response
        setTimeout(() => {
          setIsAvatarSpeaking(false);
        }, 3000);
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Unified Platform
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              {['Features', 'Industries', 'Dashboard', 'Platform', 'About'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className={`text-sm font-medium transition-colors hover:text-blue-400 ${
                    activeSection === item.toLowerCase() ? 'text-blue-400' : 'text-gray-300'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-black/90 backdrop-blur-md">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {['Features', 'Industries', 'Dashboard', 'Platform', 'About'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-blue-400 transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="hero" className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                The Ultimate
              </span>
              <br />
              <span className="text-white">Unified Platform</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto">
              Combining blockchain, AI, banking, e-commerce, social media, and comprehensive business solutions 
              in one revolutionary platform
            </p>
            
            {/* Live Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <div className="text-3xl font-bold text-blue-400">{metrics.users.toLocaleString()}+</div>
                <div className="text-sm text-gray-300">Active Users</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <div className="text-3xl font-bold text-green-400">{metrics.transactions.toLocaleString()}+</div>
                <div className="text-sm text-gray-300">Transactions</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <div className="text-3xl font-bold text-purple-400">{metrics.uptime}%</div>
                <div className="text-sm text-gray-300">Uptime</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <div className="text-3xl font-bold text-orange-400">{metrics.countries}+</div>
                <div className="text-sm text-gray-300">Countries</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-105 shadow-lg">
                Get Started Free
              </button>
              <button className="px-8 py-4 bg-white/10 backdrop-blur-md rounded-xl font-semibold text-lg border border-white/20 hover:bg-white/20 transition-all">
                Watch Demo
              </button>
            </div>
          </div>

          {/* 3D Avatar Virtual Assistant */}
          <div className="flex justify-center mb-16">
            <div className="relative">
              <div className={`w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center cursor-pointer transition-all duration-300 ${
                isAvatarListening ? 'animate-pulse scale-110' : isAvatarSpeaking ? 'animate-bounce' : 'hover:scale-105'
              }`} onClick={handleVoiceCommand}>
                <Brain className="w-16 h-16 text-white" />
              </div>
              
              {/* Status Indicators */}
              {isAvatarListening && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                  Listening...
                </div>
              )}
              {isAvatarSpeaking && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                  Speaking...
                </div>
              )}
              
              {/* Voice Visualization */}
              {(isAvatarListening || isAvatarSpeaking) && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-1 bg-white rounded-full animate-pulse`}
                        style={{
                          height: `${Math.random() * 20 + 10}px`,
                          animationDelay: `${i * 0.1}s`
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Comprehensive Features
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Everything you need for modern business operations in one unified platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105"
              >
                <div className={`w-16 h-16 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section id="industries" className="py-16 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                Industry Solutions
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Specialized solutions tailored for every industry
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {industries.map((industry, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105"
              >
                <div className="text-4xl mb-4">{industry.icon}</div>
                <h3 className="text-2xl font-semibold mb-4 text-white">{industry.name}</h3>
                <p className="text-gray-300 leading-relaxed">{industry.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Section */}
      <section id="dashboard" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Real-Time Dashboard
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Monitor your entire business ecosystem in real-time
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* System Status */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-green-400" />
                System Status
              </h3>
              <div className="space-y-3">
                {['Blockchain Network', 'AI Services', 'Banking System', 'E-commerce Platform'].map((service, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-gray-300">{service}</span>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                      <span className="text-green-400 text-sm">Online</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-blue-400" />
                Performance
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">CPU Usage</span>
                    <span className="text-blue-400">45%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-400 h-2 rounded-full" style={{width: '45%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">Memory</span>
                    <span className="text-green-400">62%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-green-400 h-2 rounded-full" style={{width: '62%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">Network</span>
                    <span className="text-purple-400">78%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-purple-400 h-2 rounded-full" style={{width: '78%'}}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Activity */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-orange-400" />
                Live Activity
              </h3>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></div>
                  <span className="text-gray-300">New user registered</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3 animate-pulse"></div>
                  <span className="text-gray-300">Blockchain transaction confirmed</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3 animate-pulse"></div>
                  <span className="text-gray-300">AI model completed analysis</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-orange-400 rounded-full mr-3 animate-pulse"></div>
                  <span className="text-gray-300">E-commerce order processed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Current Time Display */}
          <div className="mt-8 text-center">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 inline-block">
              <div className="text-2xl font-mono text-blue-400">
                {currentTime.toLocaleTimeString()}
              </div>
              <div className="text-sm text-gray-300 mt-1">
                {currentTime.toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Section */}
      <section id="platform" className="py-16 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                Cross-Platform Access
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Access the Unified Platform from any device, anywhere
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {platforms.map((platform, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 text-center"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    {platform.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">{platform.name}</h3>
                <div className="flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-green-400 text-sm">{platform.status}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Technology Stack */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-center mb-8 text-white">Technology Stack</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {['React', 'Node.js', 'Python', 'PostgreSQL', 'Redis', 'Docker'].map((tech, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20 text-center hover:bg-white/20 transition-all"
                >
                  <div className="text-sm font-medium text-gray-300">{tech}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              The Future is Unified
            </span>
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-4xl mx-auto">
            Join millions of users who trust the Unified Platform for their business needs. 
            Experience the power of having everything you need in one place.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Innovation</h3>
              <p className="text-gray-300">Cutting-edge technology that pushes boundaries</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Precision</h3>
              <p className="text-gray-300">Accurate, reliable, and efficient solutions</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Excellence</h3>
              <p className="text-gray-300">World-class platform trusted globally</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-105 shadow-lg">
              Start Your Journey
            </button>
            <button className="px-8 py-4 bg-white/10 backdrop-blur-md rounded-xl font-semibold text-lg border border-white/20 hover:bg-white/20 transition-all">
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-black/40 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white">Unified Platform</span>
              </div>
              <p className="text-gray-400 text-sm">
                The ultimate business and technology solution for the modern world.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 Unified Platform. All rights reserved. Built with cutting-edge technology.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UnifiedPlatform;

