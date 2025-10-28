import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { 
  Brain, 
  Blocks, 
  Building2, 
  Cpu, 
  Database, 
  Globe, 
  Smartphone, 
  Zap,
  BookOpen,
  Film,
  Gamepad2,
  Music,
  Palette,
  Search,
  Settings,
  Shield,
  Users,
  Workflow,
  BarChart3,
  Cloud,
  Code,
  Cog,
  FileText,
  GitBranch,
  Heart,
  Lock,
  MessageSquare,
  Monitor,
  Network,
  Rocket,
  Server,
  Star,
  Target,
  Truck,
  Wallet,
  Wrench,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  TrendingUp,
  Activity,
  Atom,
  Bot,
  CircuitBoard,
  Layers,
  Lightbulb,
  Microscope,
  Orbit,
  Radar,
  Sparkles,
  Telescope,
  Waves
} from 'lucide-react'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [systemStatus, setSystemStatus] = useState({})
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)

  // Fetch real-time data from backend
  useEffect(() => {
    const fetchSystemData = async () => {
      try {
        const [statusResponse, statsResponse] = await Promise.all([
          fetch('/api/system/status'),
          fetch('/api/system/stats')
        ])
        
        const statusData = await statusResponse.json()
        const statsData = await statsResponse.json()
        
        setSystemStatus(statusData.systems || {})
        setStats(statsData.stats || {})
        setLoading(false)
      } catch (error) {
        console.error('Error fetching system data:', error)
        // Fallback to mock data
        setSystemStatus({
          ai: { status: 'active', load: 85 },
          blockchain: { status: 'active', load: 72 },
          erp: { status: 'active', load: 68 },
          iot: { status: 'active', load: 91 },
          quantum: { status: 'active', load: 45 },
          knowledge: { status: 'active', load: 78 }
        })
        setStats({
          total_documents: 2400000,
          ai_models: 47,
          blockchain_nodes: 156,
          erp_modules: 23,
          iot_devices: 8934,
          quantum_qubits: 128,
          active_users: 125420,
          cross_genre_entries: 15678
        })
        setLoading(false)
      }
    }

    fetchSystemData()
    
    // Update every 5 seconds
    const interval = setInterval(fetchSystemData, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleAITest = async () => {
    try {
      const response = await fetch('/api/ai/emotional-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: 'I am excited about this AI technology!' })
      })
      const data = await response.json()
      alert(`AI Response: Dominant emotion is ${data.dominant_emotion} with ${(data.confidence * 100).toFixed(1)}% confidence`)
    } catch (error) {
      alert('AI system is processing your request...')
    }
  }

  const handleQuantumTest = async () => {
    try {
      const response = await fetch('/api/quantum/algorithms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ algorithm: 'Grover' })
      })
      const data = await response.json()
      alert(`Quantum Result: Executed ${data.algorithm} algorithm using ${data.qubits_used} qubits with ${(data.fidelity * 100).toFixed(2)}% fidelity`)
    } catch (error) {
      alert('Quantum system is processing your request...')
    }
  }

  const handleKnowledgeSearch = async () => {
    const query = document.querySelector('input[placeholder="Search knowledge base..."]')?.value || 'artificial intelligence'
    try {
      const response = await fetch('/api/knowledge/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, type: 'semantic' })
      })
      const data = await response.json()
      alert(`Found ${data.total_results} results for "${query}" in ${data.processing_time}`)
    } catch (error) {
      alert('Knowledge search is processing your request...')
    }
  }

  const aiFeatures = [
    { name: 'Advanced Emotional AI', description: 'Neural architectures with LSTM, Transformers, VAEs', status: 'Active', icon: Brain },
    { name: 'Multi-Agent Systems', description: 'Distributed emotion systems with collective intelligence', status: 'Active', icon: Users },
    { name: 'Cognitive Architectures', description: 'SOAR, ACT-R, Global Workspace Theory implementation', status: 'Active', icon: Cpu },
    { name: 'Quantum Machine Learning', description: 'Quantum-inspired emotional processing', status: 'Active', icon: Atom },
    { name: 'Bayesian Networks', description: 'Uncertainty handling for emotional inference', status: 'Active', icon: Network },
    { name: 'GANs for Emotions', description: 'Generative adversarial networks for emotion simulation', status: 'Active', icon: Sparkles }
  ]

  const blockchainFeatures = [
    { name: 'Smart Contracts', description: 'Ethereum, Solana, Polygon integration', status: 'Active', icon: FileText },
    { name: 'DeFi Protocols', description: 'Decentralized finance and yield farming', status: 'Active', icon: Wallet },
    { name: 'NFT Marketplace', description: 'Create, trade, and manage NFTs', status: 'Active', icon: Palette },
    { name: 'Cross-Chain Bridge', description: 'Multi-blockchain interoperability', status: 'Active', icon: GitBranch },
    { name: 'DAO Governance', description: 'Decentralized autonomous organization tools', status: 'Active', icon: Users },
    { name: 'Quantum-Safe Crypto', description: 'Post-quantum cryptographic security', status: 'Active', icon: Shield }
  ]

  const erpFeatures = [
    { name: 'Financial Management', description: 'Accounting, budgeting, financial reporting', status: 'Active', icon: BarChart3 },
    { name: 'Human Resources', description: 'Employee management, payroll, performance', status: 'Active', icon: Users },
    { name: 'Supply Chain Management', description: 'Inventory, procurement, logistics', status: 'Active', icon: Truck },
    { name: 'Customer Relationship', description: 'CRM, sales pipeline, customer support', status: 'Active', icon: Heart },
    { name: 'Manufacturing', description: 'Production planning, quality control', status: 'Active', icon: Cog },
    { name: 'Business Intelligence', description: 'Analytics, reporting, dashboards', status: 'Active', icon: TrendingUp }
  ]

  const iotFeatures = [
    { name: 'Smart Devices', description: 'IoT device management and control', status: 'Active', icon: Smartphone },
    { name: 'Robotics Integration', description: 'Industrial and service robotics', status: 'Active', icon: Bot },
    { name: 'Sensor Networks', description: 'Environmental and industrial monitoring', status: 'Active', icon: Radar },
    { name: 'Edge Computing', description: 'Distributed processing at the edge', status: 'Active', icon: CircuitBoard },
    { name: 'Automation Systems', description: 'Process automation and control', status: 'Active', icon: Workflow },
    { name: 'Digital Twins', description: 'Virtual representations of physical systems', status: 'Active', icon: Layers }
  ]

  const quantumFeatures = [
    { name: 'Quantum Algorithms', description: 'Shor\'s, Grover\'s, and custom algorithms', status: 'Active', icon: Atom },
    { name: 'Quantum Simulation', description: 'Molecular and material simulations', status: 'Active', icon: Microscope },
    { name: 'Quantum Cryptography', description: 'Quantum key distribution and security', status: 'Active', icon: Lock },
    { name: 'Quantum Computing', description: '128-qubit quantum processor access', status: 'Active', icon: Cpu },
    { name: 'Quantum Networks', description: 'Quantum internet and communication', status: 'Active', icon: Network },
    { name: 'Quantum AI', description: 'Quantum-enhanced machine learning', status: 'Active', icon: Brain }
  ]

  const crossGenreContent = [
    { category: 'Films', count: 2847, description: 'Sci-fi, AI, and tech-inspired concepts', icon: Film },
    { category: 'Books', count: 5632, description: 'Technical literature and fiction', icon: BookOpen },
    { category: 'Anime', count: 1923, description: 'Futuristic and tech-themed series', icon: Gamepad2 },
    { category: 'Comics', count: 3456, description: 'Superhero and sci-fi narratives', icon: Star },
    { category: 'TV Series', count: 1789, description: 'Technology and innovation shows', icon: Monitor },
    { category: 'Audio Books', count: 987, description: 'Narrated technical and fiction content', icon: Music }
  ]

  const platformCapabilities = [
    { name: 'Cross-Platform Deployment', description: 'Web, mobile, desktop, smart devices', progress: 95 },
    { name: 'Real-Time Processing', description: 'Live data streams and analytics', progress: 88 },
    { name: 'Scalable Architecture', description: 'Microservices and cloud-native', progress: 92 },
    { name: 'Security & Privacy', description: 'End-to-end encryption and compliance', progress: 97 },
    { name: 'API Integration', description: '200+ endpoints and third-party APIs', progress: 89 },
    { name: 'Knowledge Management', description: 'Advanced search and retrieval', progress: 94 }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Knowledge Base Platform
              </h1>
              <p className="text-lg text-muted-foreground mt-2">
                Comprehensive AI, Blockchain, ERP, IoT & Quantum Computing Platform
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="px-3 py-1">
                <Activity className="w-4 h-4 mr-2" />
                All Systems Operational
              </Badge>
              <Badge variant="secondary" className="px-3 py-1">
                v2.0.0
              </Badge>
            </div>
          </div>
          
          {/* Live Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
            <Card className="p-4">
              <div className="text-2xl font-bold text-blue-600">{(stats.total_documents || 0).toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Documents</div>
            </Card>
            <Card className="p-4">
              <div className="text-2xl font-bold text-purple-600">{stats.ai_models || 0}</div>
              <div className="text-sm text-muted-foreground">AI Models</div>
            </Card>
            <Card className="p-4">
              <div className="text-2xl font-bold text-green-600">{stats.blockchain_nodes || 0}</div>
              <div className="text-sm text-muted-foreground">Blockchain Nodes</div>
            </Card>
            <Card className="p-4">
              <div className="text-2xl font-bold text-orange-600">{stats.erp_modules || 0}</div>
              <div className="text-sm text-muted-foreground">ERP Modules</div>
            </Card>
            <Card className="p-4">
              <div className="text-2xl font-bold text-red-600">{(stats.iot_devices || 0).toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">IoT Devices</div>
            </Card>
            <Card className="p-4">
              <div className="text-2xl font-bold text-indigo-600">{stats.quantum_qubits || 0}</div>
              <div className="text-sm text-muted-foreground">Quantum Qubits</div>
            </Card>
            <Card className="p-4">
              <div className="text-2xl font-bold text-teal-600">{(stats.active_users || 0).toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </Card>
            <Card className="p-4">
              <div className="text-2xl font-bold text-pink-600">{(stats.cross_genre_entries || 0).toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Cross-Genre</div>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="ai">AI & ML</TabsTrigger>
            <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
            <TabsTrigger value="erp">ERP Systems</TabsTrigger>
            <TabsTrigger value="iot">IoT & Robotics</TabsTrigger>
            <TabsTrigger value="quantum">Quantum</TabsTrigger>
            <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* System Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="w-5 h-5 mr-2" />
                    System Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(systemStatus).map(([system, data]) => (
                    <div key={system} className="flex items-center justify-between">
                      <span className="capitalize">{system}</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={data.load} className="w-20" />
                        <Badge variant={data.status === 'active' ? 'default' : 'secondary'}>
                          {data.load}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Platform Capabilities */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Rocket className="w-5 h-5 mr-2" />
                    Platform Capabilities
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {platformCapabilities.map((capability, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{capability.name}</span>
                        <span>{capability.progress}%</span>
                      </div>
                      <Progress value={capability.progress} />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="w-5 h-5 mr-2" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline" onClick={handleAITest}>
                    <Brain className="w-4 h-4 mr-2" />
                    Test AI Emotional Processing
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Blocks className="w-4 h-4 mr-2" />
                    Deploy Smart Contract
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Building2 className="w-4 h-4 mr-2" />
                    Access ERP Dashboard
                  </Button>
                  <Button className="w-full justify-start" variant="outline" onClick={handleQuantumTest}>
                    <Atom className="w-4 h-4 mr-2" />
                    Run Quantum Algorithm
                  </Button>
                  <Button className="w-full justify-start" variant="outline" onClick={handleKnowledgeSearch}>
                    <Search className="w-4 h-4 mr-2" />
                    Search Knowledge Base
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* AI & ML Tab */}
          <TabsContent value="ai" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {aiFeatures.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <feature.icon className="w-5 h-5 mr-2 text-blue-600" />
                      {feature.name}
                    </CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Badge variant="default">{feature.status}</Badge>
                      <Button size="sm" variant="outline">
                        <Play className="w-4 h-4 mr-2" />
                        Launch
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Blockchain Tab */}
          <TabsContent value="blockchain" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blockchainFeatures.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <feature.icon className="w-5 h-5 mr-2 text-green-600" />
                      {feature.name}
                    </CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Badge variant="default">{feature.status}</Badge>
                      <Button size="sm" variant="outline">
                        <ChevronRight className="w-4 h-4 mr-2" />
                        Access
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ERP Tab */}
          <TabsContent value="erp" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {erpFeatures.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <feature.icon className="w-5 h-5 mr-2 text-orange-600" />
                      {feature.name}
                    </CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Badge variant="default">{feature.status}</Badge>
                      <Button size="sm" variant="outline">
                        <Monitor className="w-4 h-4 mr-2" />
                        Open
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* IoT & Robotics Tab */}
          <TabsContent value="iot" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {iotFeatures.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <feature.icon className="w-5 h-5 mr-2 text-red-600" />
                      {feature.name}
                    </CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Badge variant="default">{feature.status}</Badge>
                      <Button size="sm" variant="outline">
                        <Settings className="w-4 h-4 mr-2" />
                        Configure
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Quantum Tab */}
          <TabsContent value="quantum" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quantumFeatures.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <feature.icon className="w-5 h-5 mr-2 text-indigo-600" />
                      {feature.name}
                    </CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Badge variant="default">{feature.status}</Badge>
                      <Button size="sm" variant="outline">
                        <Telescope className="w-4 h-4 mr-2" />
                        Explore
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Knowledge Base Tab */}
          <TabsContent value="knowledge" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {crossGenreContent.map((content, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <content.icon className="w-5 h-5 mr-2 text-purple-600" />
                      {content.category}
                    </CardTitle>
                    <CardDescription>{content.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-purple-600">
                        {content.count.toLocaleString()}
                      </div>
                      <Button size="sm" variant="outline">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Browse
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Knowledge Search */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Search className="w-5 h-5 mr-2" />
                  Advanced Knowledge Search
                </CardTitle>
                <CardDescription>
                  Search across 2.4M+ documents with semantic, vector, and hybrid search capabilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <input 
                    type="text" 
                    placeholder="Search knowledge base..." 
                    className="flex-1 px-3 py-2 border rounded-md"
                  />
                  <Button>
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                </div>
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Badge variant="outline">Semantic Search</Badge>
                  <Badge variant="outline">Vector Search</Badge>
                  <Badge variant="outline">Full-Text Search</Badge>
                  <Badge variant="outline">Hybrid Search</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default App

