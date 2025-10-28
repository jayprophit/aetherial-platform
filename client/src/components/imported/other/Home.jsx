import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  ArrowRight, Play, Star, TrendingUp, Users, Globe, Zap, Shield,
  Brain, CreditCard, Heart, BookOpen, Smartphone, Wifi, Bluetooth,
  Radio, Satellite, Watch, Home as HomeIcon, Car, Lightbulb,
  Camera, Headphones, Gamepad2, Tv, Speaker, Thermometer,
  Lock, Eye, Mic, Video, MessageCircle, Phone, Mail,
  BarChart3, PieChart, LineChart, Activity, Clock, Award,
  Rocket, Target, Sparkles, Crown, Diamond, Gem
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const Home = ({ user }) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [liveStats, setLiveStats] = useState({
    users: 2547832,
    transactions: 125847293,
    countries: 195,
    uptime: 99.99
  })

  // Hero slides
  const heroSlides = [
    {
      title: "The Ultimate Unified Platform",
      subtitle: "AI, Blockchain, Banking, Healthcare, and 200+ Features in One Platform",
      image: "/api/placeholder/800/400",
      cta: "Get Started Free"
    },
    {
      title: "Smart Technology Ecosystem",
      subtitle: "5G/6G, IoT, Smart Wearables, Satellite Communication, and Future-Proof Tech",
      image: "/api/placeholder/800/400",
      cta: "Explore Technology"
    },
    {
      title: "Advanced Connectivity Hub",
      subtitle: "Voice, VPN, Bluetooth, Mesh Networks, and Quantum Communication",
      image: "/api/placeholder/800/400",
      cta: "Connect Everything"
    }
  ]

  // Platform features
  const platformFeatures = [
    {
      category: "AI & Intelligence",
      icon: Brain,
      color: "from-purple-500 to-pink-500",
      features: [
        "GPT-4, Claude-3, Gemini Pro Integration",
        "Interactive Chat with Code Execution",
        "Voice & Video AI Calls",
        "Multi-Modal Processing",
        "Quantum-Enhanced AI",
        "Real-Time Learning",
        "Custom Model Training",
        "AI-Powered Automation"
      ]
    },
    {
      category: "Smart Connectivity",
      icon: Wifi,
      color: "from-blue-500 to-cyan-500",
      features: [
        "5G/6G Network Optimization",
        "Satellite Communication",
        "Bluetooth Device Management",
        "Mesh Network Creation",
        "VPN & Secure Tunneling",
        "Voice Recognition & Commands",
        "Future-Proof Protocols",
        "Edge Computing Integration"
      ]
    },
    {
      category: "IoT & Smart Devices",
      icon: HomeIcon,
      color: "from-green-500 to-emerald-500",
      features: [
        "Smart Home Automation",
        "Wearable Device Integration",
        "Industrial IoT Control",
        "Smart City Infrastructure",
        "Automotive Connectivity",
        "Health Monitoring Devices",
        "Environmental Sensors",
        "Predictive Maintenance"
      ]
    },
    {
      category: "Blockchain & Finance",
      icon: Shield,
      color: "from-orange-500 to-red-500",
      features: [
        "3D Blockchain with Runestones",
        "Multi-Consensus Mechanisms",
        "DeFi Protocols & Flash Loans",
        "NFT Marketplace",
        "Quantum-Resistant Cryptography",
        "Cross-Chain Interoperability",
        "Smart Contract Automation",
        "Decentralized Identity"
      ]
    },
    {
      category: "Healthcare & Life Sciences",
      icon: Heart,
      color: "from-red-500 to-pink-500",
      features: [
        "AI Medical Diagnostics",
        "CRISPR Gene Editing Tools",
        "Telemedicine Platform",
        "Health Data Analytics",
        "Drug Discovery AI",
        "Clinical Trial Management",
        "Wearable Health Monitoring",
        "Personalized Medicine"
      ]
    },
    {
      category: "Business & Enterprise",
      icon: BarChart3,
      color: "from-indigo-500 to-purple-500",
      features: [
        "Complete ERP System",
        "CRM & Sales Automation",
        "Advanced Analytics",
        "Workflow Automation",
        "Supply Chain Management",
        "Financial Planning",
        "Team Collaboration",
        "Business Intelligence"
      ]
    }
  ]

  // Smart devices showcase
  const smartDevices = [
    { name: "Smart Watch", icon: Watch, status: "Connected", battery: 85 },
    { name: "Smart Phone", icon: Smartphone, status: "Connected", battery: 92 },
    { name: "Smart Home", icon: HomeIcon, status: "Active", devices: 24 },
    { name: "Smart Car", icon: Car, status: "Parked", range: "285 miles" },
    { name: "Smart Lights", icon: Lightbulb, status: "Auto", brightness: 75 },
    { name: "Security Camera", icon: Camera, status: "Recording", quality: "4K" },
    { name: "Smart Speaker", icon: Speaker, status: "Listening", volume: 60 },
    { name: "Thermostat", icon: Thermometer, status: "Auto", temp: "72°F" }
  ]

  // Connectivity features
  const connectivityFeatures = [
    { name: "5G Network", icon: Radio, status: "Ultra Fast", speed: "2.1 Gbps" },
    { name: "6G Ready", icon: Zap, status: "Future-Proof", speed: "100+ Gbps" },
    { name: "Satellite", icon: Satellite, status: "Global", coverage: "100%" },
    { name: "Bluetooth", icon: Bluetooth, status: "Connected", devices: 8 },
    { name: "WiFi 7", icon: Wifi, status: "Active", speed: "46 Gbps" },
    { name: "VPN Shield", icon: Lock, status: "Protected", servers: 150 }
  ]

  // Live stats animation
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        users: prev.users + Math.floor(Math.random() * 50),
        transactions: prev.transactions + Math.floor(Math.random() * 500),
        countries: 195,
        uptime: 99.99
      }))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  // Auto-slide hero
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
          <div className="absolute inset-0 opacity-20 animate-pulse">
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-400 rounded-full blur-3xl" />
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          {/* Hero Content */}
          <div className="mb-8">
            <h1 className="text-6xl md:text-8xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Unified Platform
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-4xl mx-auto">
              {heroSlides[currentSlide].subtitle}
            </p>
          </div>

          {/* Live Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-md rounded-2xl p-6 border border-white/30">
              <div className="text-3xl font-bold text-blue-600">{liveStats.users.toLocaleString()}+</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Active Users</div>
            </div>
            <div className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-md rounded-2xl p-6 border border-white/30">
              <div className="text-3xl font-bold text-green-600">{liveStats.transactions.toLocaleString()}+</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Transactions</div>
            </div>
            <div className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-md rounded-2xl p-6 border border-white/30">
              <div className="text-3xl font-bold text-purple-600">{liveStats.countries}+</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Countries</div>
            </div>
            <div className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-md rounded-2xl p-6 border border-white/30">
              <div className="text-3xl font-bold text-orange-600">{liveStats.uptime}%</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Uptime</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            {user ? (
              <Link to="/ai">
                <Button size="lg" className="px-8 py-4 text-lg">
                  <Rocket className="w-5 h-5 mr-2" />
                  Launch Platform
                </Button>
              </Link>
            ) : (
              <Button size="lg" className="px-8 py-4 text-lg">
                <Sparkles className="w-5 h-5 mr-2" />
                Get Started Free
              </Button>
            )}
            <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>

          {/* Hero Slide Indicators */}
          <div className="flex justify-center space-x-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Smart Connectivity Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Smart Connectivity Ecosystem
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Future-proof connectivity with 5G/6G, satellite, IoT, and quantum communication
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-16">
            {connectivityFeatures.map((feature, index) => (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-6 text-center hover:scale-105 transition-transform">
                <feature.icon className="w-8 h-8 mx-auto mb-3 text-blue-600" />
                <div className="font-semibold text-sm mb-1">{feature.name}</div>
                <div className="text-xs text-green-600 mb-1">{feature.status}</div>
                <div className="text-xs text-gray-500">{feature.speed || feature.coverage || feature.devices || feature.servers}</div>
              </div>
            ))}
          </div>

          {/* Smart Devices Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {smartDevices.map((device, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-center hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                <device.icon className="w-6 h-6 mx-auto mb-2 text-gray-600 dark:text-gray-300" />
                <div className="text-xs font-medium mb-1">{device.name}</div>
                <div className="text-xs text-green-600">{device.status}</div>
                {device.battery && (
                  <div className="text-xs text-gray-500">{device.battery}%</div>
                )}
                {device.devices && (
                  <div className="text-xs text-gray-500">{device.devices} devices</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Comprehensive Platform Features
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Everything you need in one unified platform - from AI to blockchain, healthcare to IoT
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {platformFeatures.map((category, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${category.color} flex items-center justify-center mb-6`}>
                  <category.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{category.category}</h3>
                <ul className="space-y-2">
                  {category.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-gray-600 dark:text-gray-300">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button className="w-full mt-6" variant="outline">
                  Explore {category.category}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Voice & Communication Features */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Advanced Communication Hub
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Voice commands, video calls, messaging, email, and quantum-secure communication
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-6 text-center">
              <Mic className="w-12 h-12 mx-auto mb-4 text-blue-600" />
              <h3 className="font-bold mb-2">Voice Control</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Natural language commands</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-6 text-center">
              <Video className="w-12 h-12 mx-auto mb-4 text-green-600" />
              <h3 className="font-bold mb-2">Video Calls</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">HD video conferencing</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-6 text-center">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-purple-600" />
              <h3 className="font-bold mb-2">Messaging</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Secure instant messaging</p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-6 text-center">
              <Mail className="w-12 h-12 mx-auto mb-4 text-orange-600" />
              <h3 className="font-bold mb-2">Email</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Integrated email system</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Ready to Experience the Future?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join millions of users already using the most comprehensive platform ever created
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="px-8 py-4 text-lg">
              <Crown className="w-5 h-5 mr-2" />
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-white text-white hover:bg-white hover:text-blue-600">
              <Diamond className="w-5 h-5 mr-2" />
              View Pricing
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home

