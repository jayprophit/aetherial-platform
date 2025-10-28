import React, { useState, useEffect } from 'react';
import './App.css';

const UnifiedPlatform = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
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

  const comprehensiveFeatures = [
    {
      category: "Blockchain & Cryptocurrency",
      features: [
        "3D Blockchain with Runestones",
        "Multi-Consensus Mechanisms (PoW, PoS, DPoS, PoA, PoH, Quantum)",
        "UBC Native Coin & Q-Tokens",
        "Advanced Mining & Staking (8% APY)",
        "NFT Minting & Marketplace",
        "Flash Loans & DeFi Protocols",
        "Cross-Chain Interoperability",
        "Quantum-Resistant Cryptography"
      ]
    },
    {
      category: "AI & Machine Learning",
      features: [
        "GPT-4, Claude-3, DALL-E 3 Integration",
        "Advanced Reasoning Frameworks",
        "Multi-Modal Processing",
        "Seven-Node AI Architecture",
        "Quantum AI Enhancement",
        "Real-Time AI Analytics",
        "Custom Model Training",
        "AI-Powered Automation"
      ]
    },
    {
      category: "Banking & Financial Services",
      features: [
        "Complete Banking Services",
        "Multiple Account Types",
        "Loan Products (Personal, Auto, Mortgage, Business)",
        "Credit & Debit Card Services",
        "Investment Management",
        "Tax & Capital Gains Calculator",
        "AI Tax Accountant",
        "Offshore Accounts & Trust Funds"
      ]
    },
    {
      category: "E-commerce & Business",
      features: [
        "Full E-commerce Platform",
        "Inventory Management",
        "Payment Processing",
        "Business Setup Assistance",
        "ERP Systems",
        "Workflow Automation",
        "Supply Chain Management",
        "Customer Analytics"
      ]
    },
    {
      category: "Legal & Compliance",
      features: [
        "Legal Consultation Services",
        "Case Management System",
        "Document Generation",
        "LLP Formation",
        "Compliance Monitoring",
        "Legal Research Database",
        "Contract Management",
        "Regulatory Compliance"
      ]
    },
    {
      category: "Privacy & Security",
      features: [
        "Global VPN Network",
        "Tor/Onion Router Integration",
        "Military-Grade Encryption",
        "Privacy Analytics",
        "Quantum-Resistant Security",
        "Zero-Logs Policy",
        "Advanced Threat Protection",
        "Secure Communications"
      ]
    },
    {
      category: "Healthcare & Life Sciences",
      features: [
        "Medical AI Diagnostics",
        "Patient Management System",
        "CRISPR Gene Editing Tools",
        "Clinical Decision Support",
        "Drug Discovery Platform",
        "Telemedicine Integration",
        "Health Analytics",
        "Medical Research Database"
      ]
    },
    {
      category: "Knowledge & Education",
      features: [
        "Universal Knowledge Engine",
        "Sociology & Philosophy Databases",
        "Psychology & Spirituality Content",
        "Astrology & Hermetics Systems",
        "Personalized Learning",
        "Research Assistance",
        "Educational Analytics",
        "Skill Assessment"
      ]
    },
    {
      category: "Communication & Social",
      features: [
        "Global Communication Network",
        "VoIP Services (195+ Countries)",
        "Social Media Platform",
        "Real-Time Messaging",
        "Video Conferencing",
        "Community Management",
        "Content Moderation",
        "Social Analytics"
      ]
    },
    {
      category: "Manufacturing & IoT",
      features: [
        "IoT Device Integration",
        "3D Printing Control",
        "CNC Machine Management",
        "Robotics Control (Four Laws)",
        "Text-to-Robot Commands",
        "Manufacturing Analytics",
        "Quality Control Systems",
        "Predictive Maintenance"
      ]
    },
    {
      category: "File Processing & Data",
      features: [
        "Universal File Processing (200+ Formats)",
        "Advanced Data Analysis",
        "Format Conversion",
        "Metadata Extraction",
        "Content Analysis",
        "Real-Time Processing",
        "Cloud Storage Integration",
        "Data Visualization"
      ]
    },
    {
      category: "Trading & Investment",
      features: [
        "eToro-Style Social Trading",
        "Copy Trading Platform",
        "Multi-Asset Trading",
        "Automatic Investment Entry",
        "Portfolio Management",
        "Risk Assessment",
        "Market Analytics",
        "Trading Algorithms"
      ]
    }
  ];

  const industries = [
    { name: "Healthcare", icon: "🏥", description: "Medical AI, patient management, CRISPR gene editing" },
    { name: "Engineering", icon: "⚙️", description: "CAD files, simulations, IoT manufacturing integration" },
    { name: "Legal", icon: "⚖️", description: "Case law, research tools, document templates" },
    { name: "Financial", icon: "💰", description: "Trading algorithms, portfolio management, risk analysis" },
    { name: "Manufacturing", icon: "🏭", description: "3D printing, CNC machines, quality control" },
    { name: "Enterprise", icon: "🏢", description: "ERP systems, workflow automation, business intelligence" },
    { name: "Education", icon: "🎓", description: "Knowledge systems, personalized learning, research tools" },
    { name: "Technology", icon: "💻", description: "AI services, blockchain, quantum computing" }
  ];

  const platforms = [
    { name: "Website", icon: "🌐", status: "Live", users: "2.5M+" },
    { name: "Mobile", icon: "📱", status: "Live", users: "1.8M+" },
    { name: "Desktop", icon: "🖥️", status: "Live", users: "900K+" },
    { name: "Tablet", icon: "📟", status: "Live", users: "600K+" }
  ];

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    setActiveSection(sectionId);
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">UP</span>
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
              {isMenuOpen ? '✕' : '☰'}
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
                  className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-blue-400 transition-colors w-full text-left"
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
              The most comprehensive business and technology platform ever created, integrating 
              blockchain, AI, banking, e-commerce, healthcare, legal services, and 200+ advanced features
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
              <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105">
                <span className="text-4xl">🤖</span>
              </div>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                AI Assistant Ready
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comprehensive Features Section */}
      <section id="features" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Comprehensive Features
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Over 200 advanced features across 12 major categories
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {comprehensiveFeatures.map((category, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <h3 className="text-2xl font-semibold mb-4 text-white">{category.category}</h3>
                <div className="grid grid-cols-1 gap-2">
                  {category.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center text-gray-300">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
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
              Specialized solutions for every industry
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {industries.map((industry, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 text-center"
              >
                <div className="text-4xl mb-4">{industry.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-white">{industry.name}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{industry.description}</p>
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
                <span className="w-5 h-5 mr-2 text-green-400">📊</span>
                System Status
              </h3>
              <div className="space-y-3">
                {['Blockchain Network', 'AI Services', 'Banking System', 'E-commerce Platform'].map((service, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-gray-300">{service}</span>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                      <span className="text-green-400 text-sm">Online</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <span className="w-5 h-5 mr-2 text-blue-400">📈</span>
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
                <span className="w-5 h-5 mr-2 text-orange-400">⏰</span>
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
                <div className="text-4xl mb-4">{platform.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-white">{platform.name}</h3>
                <div className="flex items-center justify-center mb-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-green-400 text-sm">{platform.status}</span>
                </div>
                <div className="text-gray-300 text-sm">{platform.users} users</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              The Most Comprehensive Platform Ever Created
            </span>
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-4xl mx-auto">
            Join millions of users who trust the Unified Platform for their business needs. 
            Experience the power of having everything you need in one revolutionary platform.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Innovation</h3>
              <p className="text-gray-300">Cutting-edge technology that pushes boundaries</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Precision</h3>
              <p className="text-gray-300">Accurate, reliable, and efficient solutions</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏆</span>
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
                  <span className="text-white font-bold text-sm">UP</span>
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
            <p>&copy; 2024 Unified Platform. All rights reserved. The most comprehensive business platform ever created.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UnifiedPlatform;

