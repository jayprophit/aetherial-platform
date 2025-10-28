import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom'
import './App.css'

// Main App Component
function App() {
  const [user, setUser] = useState(null)
  const [showAuth, setShowAuth] = useState(false)

  // Check for existing user session
  useEffect(() => {
    const savedUser = localStorage.getItem('unifiedPlatformUser')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const handleLogin = (email, password) => {
    // Simulate login
    const userData = {
      id: Date.now(),
      name: email.split('@')[0],
      email: email,
      avatar: null,
      joinDate: new Date().toISOString(),
      verified: true,
      plan: 'premium'
    }
    setUser(userData)
    localStorage.setItem('unifiedPlatformUser', JSON.stringify(userData))
    setShowAuth(false)
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('unifiedPlatformUser')
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        {/* Navigation Header */}
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">UP</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Unified Platform
                </span>
              </Link>

              {/* Navigation Tabs */}
              <div className="hidden md:flex items-center space-x-1">
                <Link to="/" className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                  Home
                </Link>
                <Link to="/ai" className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                  AI Hub
                </Link>
                <Link to="/blockchain" className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                  Blockchain
                </Link>
                <Link to="/trading" className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                  Trading
                </Link>
                <Link to="/social" className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                  Social
                </Link>
                <Link to="/business" className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                  Business
                </Link>
              </div>

              {/* User Section */}
              <div className="flex items-center space-x-4">
                {user ? (
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {user.name?.charAt(0) || user.email?.charAt(0)}
                      </span>
                    </div>
                    <span className="hidden md:inline text-sm font-medium">{user.name}</span>
                    <button
                      onClick={handleLogout}
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAuth(true)}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-600 transition-colors"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="min-h-screen">
          <Routes>
            <Route path="/" element={<HomePage user={user} setShowAuth={setShowAuth} />} />
            <Route path="/ai" element={<AIPage user={user} setShowAuth={setShowAuth} />} />
            <Route path="/blockchain" element={<BlockchainPage user={user} setShowAuth={setShowAuth} />} />
            <Route path="/trading" element={<TradingPage user={user} setShowAuth={setShowAuth} />} />
            <Route path="/social" element={<SocialPage user={user} setShowAuth={setShowAuth} />} />
            <Route path="/business" element={<BusinessPage user={user} setShowAuth={setShowAuth} />} />
          </Routes>
        </main>

        {/* Authentication Modal */}
        {showAuth && (
          <AuthModal 
            onClose={() => setShowAuth(false)}
            onLogin={handleLogin}
          />
        )}
      </div>
    </Router>
  )
}

// Home Page Component
const HomePage = ({ user, setShowAuth }) => {
  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h1 className="text-6xl font-bold mb-6">
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            The Ultimate Unified Platform
          </span>
        </h1>
        <p className="text-xl text-gray-600 mb-12 max-w-4xl mx-auto">
          AI, Blockchain, Trading, Social Media, Business Tools, IoT, 5G/6G, Smart Technology, 
          Voice Commands, VPN, Healthcare, Banking, and 200+ Features in One Platform
        </p>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-16">
          {[
            { name: 'AI Hub', desc: 'ChatGPT, Claude, Gemini Pro', icon: '🧠', path: '/ai' },
            { name: 'Blockchain', desc: '3D Blockchain, DeFi, NFTs', icon: '⛓️', path: '/blockchain' },
            { name: 'Trading', desc: 'Crypto, Stocks, Forex', icon: '📈', path: '/trading' },
            { name: 'Social Media', desc: 'Posts, Communities, Chat', icon: '👥', path: '/social' },
            { name: 'Smart Tech', desc: '5G/6G, IoT, Wearables', icon: '📱', path: '/business' },
            { name: 'Voice Control', desc: 'Voice Commands, Calls', icon: '🎤', path: '/ai' },
            { name: 'VPN & Security', desc: 'Secure Networks, Privacy', icon: '🔒', path: '/business' },
            { name: 'Healthcare', desc: 'Medical AI, CRISPR, Health', icon: '🏥', path: '/business' },
            { name: 'Banking', desc: 'Digital Banking, Payments', icon: '💳', path: '/business' },
            { name: 'Business Suite', desc: 'ERP, CRM, Analytics', icon: '💼', path: '/business' },
            { name: 'Learning Hub', desc: 'Courses, Knowledge Base', icon: '📚', path: '/ai' },
            { name: 'Satellite Comm', desc: 'Global Communication', icon: '🛰️', path: '/business' }
          ].map((feature, index) => (
            <Link 
              key={index} 
              to={feature.path}
              className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/80 transition-colors border border-white/50 block"
            >
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h3 className="font-bold text-lg mb-2">{feature.name}</h3>
              <p className="text-sm text-gray-600">{feature.desc}</p>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="space-y-4">
          {user ? (
            <div className="text-2xl font-semibold text-green-600 mb-4">
              Welcome back, {user.name}! 🎉
            </div>
          ) : (
            <button
              onClick={() => setShowAuth(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-colors shadow-lg"
            >
              Get Started Free - Access All Features
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// AI Page Component
const AIPage = ({ user, setShowAuth }) => {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [selectedModel, setSelectedModel] = useState('gpt-4')

  if (!user) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">AI Hub - Premium Feature</h2>
        <p className="text-gray-600 mb-8">Sign in to access AI chat, code execution, voice calls, and more</p>
        <button
          onClick={() => setShowAuth(true)}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg"
        >
          Sign In to Continue
        </button>
      </div>
    )
  }

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        content: `${selectedModel.toUpperCase()} Response: I understand your request "${inputMessage}". I can help you with code execution, analysis, voice calls, email sending, and much more. What would you like to do next?`,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
    }, 1000)
  }

  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 p-6">
        <h2 className="text-2xl font-bold mb-6">AI Hub</h2>
        
        {/* Model Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">AI Model</label>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg"
          >
            <option value="gpt-4">GPT-4 (OpenAI)</option>
            <option value="claude-3">Claude 3 (Anthropic)</option>
            <option value="gemini-pro">Gemini Pro (Google)</option>
            <option value="deepseek">DeepSeek</option>
            <option value="qwen">Qwen (Alibaba)</option>
            <option value="copilot">Copilot (Microsoft)</option>
            <option value="manus">Manus AI</option>
            <option value="genspark">GenSpark</option>
          </select>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <button className="w-full bg-blue-100 text-blue-700 p-3 rounded-lg text-left">
            🎤 Voice Call with AI
          </button>
          <button className="w-full bg-green-100 text-green-700 p-3 rounded-lg text-left">
            💻 Code Execution
          </button>
          <button className="w-full bg-purple-100 text-purple-700 p-3 rounded-lg text-left">
            📧 Send Email
          </button>
          <button className="w-full bg-orange-100 text-orange-700 p-3 rounded-lg text-left">
            📱 Send SMS
          </button>
          <button className="w-full bg-pink-100 text-pink-700 p-3 rounded-lg text-left">
            📁 File Analysis
          </button>
          <button className="w-full bg-yellow-100 text-yellow-700 p-3 rounded-lg text-left">
            🎨 Image Generation
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <h3 className="font-semibold">Chat with {selectedModel.toUpperCase()}</h3>
          <p className="text-sm text-gray-600">Interactive AI with code execution, voice calls, and more</p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold mb-2">Start a conversation</h3>
              <p className="text-gray-600">Ask me anything! I can execute code, make calls, send emails, and more.</p>
            </div>
          ) : (
            messages.map(message => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-2xl p-4 rounded-2xl ${
                  message.type === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white border border-gray-200'
                }`}>
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  <div className="text-xs opacity-70 mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex space-x-4">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Blockchain Page Component
const BlockchainPage = ({ user, setShowAuth }) => {
  if (!user) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Blockchain Hub - Premium Feature</h2>
        <p className="text-gray-600 mb-8">Sign in to access trading, DeFi, NFTs, and blockchain features</p>
        <button
          onClick={() => setShowAuth(true)}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg"
        >
          Sign In to Continue
        </button>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Blockchain Hub</h1>
        
        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="text-sm text-gray-500 mb-1">Total Portfolio</div>
            <div className="text-2xl font-bold">$12,450.67</div>
            <div className="text-sm text-green-600">+2.45%</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="text-sm text-gray-500 mb-1">24h P&L</div>
            <div className="text-2xl font-bold text-green-600">+$304.23</div>
            <div className="text-sm text-green-600">+2.45%</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="text-sm text-gray-500 mb-1">Staking Rewards</div>
            <div className="text-2xl font-bold text-blue-600">$207.31</div>
            <div className="text-sm text-blue-600">This month</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="text-sm text-gray-500 mb-1">NFT Collection</div>
            <div className="text-2xl font-bold">23</div>
            <div className="text-sm text-gray-500">Items</div>
          </div>
        </div>

        {/* Trading Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm">
            <h3 className="text-lg font-semibold mb-4">BTC/USD Trading Chart</h3>
            <div className="h-96 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-4">📈</div>
                <div className="text-lg font-semibold">Real-time Trading Chart</div>
                <div className="text-sm text-gray-500">BTC: $43,250.67 (+2.45%)</div>
              </div>
            </div>
          </div>

          {/* Trading Panel */}
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Quick Trade</h3>
            <div className="space-y-4">
              <div className="flex space-x-2">
                <button className="flex-1 bg-green-500 text-white p-3 rounded-lg">Buy</button>
                <button className="flex-1 bg-red-500 text-white p-3 rounded-lg">Sell</button>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Amount</label>
                <input
                  type="number"
                  placeholder="0.00"
                  className="w-full p-3 border border-gray-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Price</label>
                <input
                  type="number"
                  placeholder="Market Price"
                  className="w-full p-3 border border-gray-200 rounded-lg"
                />
              </div>
              <button className="w-full bg-blue-500 text-white p-3 rounded-lg">
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Trading Page Component
const TradingPage = ({ user, setShowAuth }) => {
  if (!user) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Advanced Trading - Premium Feature</h2>
        <p className="text-gray-600 mb-8">Sign in to access advanced trading tools and analytics</p>
        <button
          onClick={() => setShowAuth(true)}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg"
        >
          Sign In to Continue
        </button>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Advanced Trading Hub</h1>
        
        {/* Market Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { name: 'BTC/USD', price: '$43,250', change: '+2.45%', color: 'green' },
            { name: 'ETH/USD', price: '$2,650', change: '-1.23%', color: 'red' },
            { name: 'S&P 500', price: '4,185', change: '+0.87%', color: 'green' },
            { name: 'NASDAQ', price: '12,450', change: '+1.34%', color: 'green' }
          ].map((asset, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
              <div className="font-medium">{asset.name}</div>
              <div className="text-lg font-bold">{asset.price}</div>
              <div className={`text-sm ${asset.color === 'green' ? 'text-green-600' : 'text-red-600'}`}>
                {asset.change}
              </div>
            </div>
          ))}
        </div>

        {/* Trading Interface */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h3 className="text-lg font-semibold mb-6">Multi-Asset Trading Platform</h3>
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2">Professional Trading Interface</h3>
            <p className="text-gray-600 mb-6">
              Advanced charts, order books, portfolio management, and algorithmic trading
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="font-semibold">Crypto Trading</div>
                <div className="text-sm text-gray-600">Bitcoin, Ethereum, Altcoins</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="font-semibold">Stock Trading</div>
                <div className="text-sm text-gray-600">NYSE, NASDAQ, Global Markets</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="font-semibold">Forex Trading</div>
                <div className="text-sm text-gray-600">Major Currency Pairs</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Social Page Component
const SocialPage = ({ user, setShowAuth }) => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: { name: 'John Doe', avatar: '👨‍💻' },
      content: 'Just made my first trade on the Unified Platform! The AI assistant helped me analyze the market trends. Amazing! 🚀',
      timestamp: '2 hours ago',
      likes: 24,
      comments: 5
    },
    {
      id: 2,
      user: { name: 'Sarah Chen', avatar: '👩‍🔬' },
      content: 'The healthcare AI just helped me analyze my genetic data. The CRISPR integration is mind-blowing! 🧬',
      timestamp: '4 hours ago',
      likes: 18,
      comments: 3
    }
  ])
  const [newPost, setNewPost] = useState('')

  if (!user) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Social Hub - Premium Feature</h2>
        <p className="text-gray-600 mb-8">Sign in to access social features, communities, and networking</p>
        <button
          onClick={() => setShowAuth(true)}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg"
        >
          Sign In to Continue
        </button>
      </div>
    )
  }

  const handleCreatePost = () => {
    if (!newPost.trim()) return

    const post = {
      id: Date.now(),
      user: { name: user.name, avatar: '👤' },
      content: newPost,
      timestamp: 'Just now',
      likes: 0,
      comments: 0
    }

    setPosts(prev => [post, ...prev])
    setNewPost('')
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Social Hub</h1>
        
        {/* Create Post */}
        <div className="bg-white p-6 rounded-2xl shadow-sm mb-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">
                {user.name?.charAt(0)}
              </span>
            </div>
            <div className="flex-1">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="What's on your mind? Share your experience with the platform..."
                className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
              <div className="flex justify-between items-center mt-3">
                <div className="flex space-x-2">
                  <button className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg">📷</button>
                  <button className="text-green-500 hover:bg-green-50 p-2 rounded-lg">📹</button>
                  <button className="text-purple-500 hover:bg-purple-50 p-2 rounded-lg">📊</button>
                </div>
                <button
                  onClick={handleCreatePost}
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.map(post => (
            <div key={post.id} className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="flex items-start space-x-4">
                <div className="text-3xl">{post.user.avatar}</div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-semibold">{post.user.name}</span>
                    <span className="text-gray-500 text-sm">{post.timestamp}</span>
                  </div>
                  <p className="text-gray-800 mb-4">{post.content}</p>
                  <div className="flex items-center space-x-6">
                    <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500">
                      <span>👍</span>
                      <span>{post.likes}</span>
                    </button>
                    <button className="flex items-center space-x-2 text-gray-500 hover:text-green-500">
                      <span>💬</span>
                      <span>{post.comments}</span>
                    </button>
                    <button className="flex items-center space-x-2 text-gray-500 hover:text-purple-500">
                      <span>🔄</span>
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Communities Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Popular Communities</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'AI Enthusiasts', members: '12.5K', topic: 'Artificial Intelligence' },
              { name: 'Crypto Traders', members: '8.2K', topic: 'Cryptocurrency' },
              { name: 'Tech Innovators', members: '15.7K', topic: 'Technology' }
            ].map((community, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-sm">
                <h3 className="font-semibold text-lg mb-2">{community.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{community.topic}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{community.members} members</span>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm">
                    Join
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Business Page Component
const BusinessPage = ({ user, setShowAuth }) => {
  if (!user) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Business Suite - Premium Feature</h2>
        <p className="text-gray-600 mb-8">Sign in to access ERP, CRM, analytics, and business tools</p>
        <button
          onClick={() => setShowAuth(true)}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg"
        >
          Sign In to Continue
        </button>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Business Suite</h1>
        
        {/* Business Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="text-sm text-gray-500 mb-1">Revenue</div>
            <div className="text-2xl font-bold">$125,430</div>
            <div className="text-sm text-green-600">+12.5%</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="text-sm text-gray-500 mb-1">Customers</div>
            <div className="text-2xl font-bold">2,847</div>
            <div className="text-sm text-blue-600">+8.2%</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="text-sm text-gray-500 mb-1">Orders</div>
            <div className="text-2xl font-bold">1,234</div>
            <div className="text-sm text-green-600">+15.3%</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="text-sm text-gray-500 mb-1">Profit Margin</div>
            <div className="text-2xl font-bold">23.4%</div>
            <div className="text-sm text-green-600">+2.1%</div>
          </div>
        </div>

        {/* Business Tools */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h3 className="text-lg font-semibold mb-4">📊 ERP System</h3>
            <p className="text-gray-600 mb-4">Complete enterprise resource planning</p>
            <ul className="space-y-2 text-sm">
              <li>• Inventory Management</li>
              <li>• Supply Chain Optimization</li>
              <li>• Financial Planning</li>
              <li>• Resource Allocation</li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h3 className="text-lg font-semibold mb-4">👥 CRM System</h3>
            <p className="text-gray-600 mb-4">Customer relationship management</p>
            <ul className="space-y-2 text-sm">
              <li>• Lead Management</li>
              <li>• Sales Pipeline</li>
              <li>• Customer Analytics</li>
              <li>• Communication Tools</li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h3 className="text-lg font-semibold mb-4">📈 Analytics</h3>
            <p className="text-gray-600 mb-4">Business intelligence and insights</p>
            <ul className="space-y-2 text-sm">
              <li>• Real-time Dashboards</li>
              <li>• Predictive Analytics</li>
              <li>• Performance Metrics</li>
              <li>• Custom Reports</li>
            </ul>
          </div>
        </div>

        {/* Additional Business Features */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Advanced Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Healthcare AI', icon: '🏥', desc: 'Medical analysis & CRISPR' },
              { name: 'Banking Suite', icon: '💳', desc: 'Digital banking & payments' },
              { name: 'IoT Control', icon: '📱', desc: '5G/6G smart devices' },
              { name: 'VPN Security', icon: '🔒', desc: 'Secure networks & privacy' },
              { name: 'Voice Commands', icon: '🎤', desc: 'Voice control & calls' },
              { name: 'Satellite Comm', icon: '🛰️', desc: 'Global communication' },
              { name: 'Smart Wearables', icon: '⌚', desc: 'Fitness & health tracking' },
              { name: 'Edge Computing', icon: '⚡', desc: 'Real-time processing' }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-4 rounded-xl shadow-sm text-center">
                <div className="text-3xl mb-2">{feature.icon}</div>
                <h4 className="font-semibold mb-1">{feature.name}</h4>
                <p className="text-xs text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Authentication Modal Component
const AuthModal = ({ onClose, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onLogin(email, password)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-colors"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="ml-1 text-blue-600 hover:text-blue-500 font-medium"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

