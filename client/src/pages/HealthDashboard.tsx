import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  Database, 
  Cpu, 
  HardDrive, 
  Zap, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Download,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// JARVIS-inspired color scheme
const COLORS = {
  primary: '#00D9FF', // Cyan (JARVIS blue)
  success: '#00FF41', // Matrix green
  warning: '#FFB800', // Warning amber
  danger: '#FF0040', // Alert red
  background: '#0A0E27', // Dark space blue
  surface: '#1A1F3A', // Elevated surface
  text: '#E0E7FF', // Light text
};

interface HealthMetric {
  name: string;
  status: 'healthy' | 'warning' | 'critical';
  value: number;
  unit: string;
  threshold: number;
  message: string;
  lastCheck: string;
}

interface HealthReport {
  status: 'healthy' | 'degraded' | 'critical';
  timestamp: string;
  uptime: number;
  checks: HealthMetric[];
  trends: {
    cpu: number[];
    memory: number[];
    database: number[];
    api: number[];
  };
  history: {
    timestamp: string;
    status: string;
    details: string;
  }[];
}

export default function HealthDashboard() {
  const [healthData, setHealthData] = useState<HealthReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [showDetails, setShowDetails] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  useEffect(() => {
    fetchHealthData();
    
    if (autoRefresh) {
      const interval = setInterval(fetchHealthData, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const fetchHealthData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/health/report', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setHealthData(data);
      }
    } catch (error) {
      console.error('Failed to fetch health data:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = async () => {
    if (!confirm('Are you sure you want to clear health history?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await fetch('/api/health/history', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      fetchHealthData();
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  };

  const exportReport = () => {
    if (!healthData) return;
    
    const dataStr = JSON.stringify(healthData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `health-report-${new Date().toISOString()}.json`;
    link.click();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'critical':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      healthy: 'default',
      warning: 'secondary',
      critical: 'destructive',
    };
    return (
      <Badge variant={variants[status] || 'outline'} className="ml-2">
        {status.toUpperCase()}
      </Badge>
    );
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="text-center">
          <Activity className="w-16 h-16 text-cyan-400 animate-pulse mx-auto mb-4" />
          <p className="text-cyan-400 text-xl font-mono">Initializing JARVIS Health Monitor...</p>
        </div>
      </div>
    );
  }

  if (!healthData) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <Card className="bg-slate-800/50 border-red-500">
          <CardHeader>
            <CardTitle className="text-red-500 flex items-center">
              <XCircle className="mr-2" />
              Health Data Unavailable
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300">Unable to fetch health monitoring data.</p>
            <Button onClick={fetchHealthData} className="mt-4">
              <RefreshCw className="mr-2 w-4 h-4" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Prepare chart data
  const trendData = healthData.trends.cpu.map((_, index) => ({
    time: `T-${healthData.trends.cpu.length - index}`,
    cpu: healthData.trends.cpu[index],
    memory: healthData.trends.memory[index],
    database: healthData.trends.database[index],
    api: healthData.trends.api[index],
  }));

  const statusDistribution = [
    { name: 'Healthy', value: healthData.checks.filter(c => c.status === 'healthy').length, color: '#00FF41' },
    { name: 'Warning', value: healthData.checks.filter(c => c.status === 'warning').length, color: '#FFB800' },
    { name: 'Critical', value: healthData.checks.filter(c => c.status === 'critical').length, color: '#FF0040' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      {/* JARVIS-inspired Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-cyan-400 font-mono mb-2 flex items-center">
              <Activity className="mr-3 w-10 h-10 animate-pulse" />
              AETHERIAL Health Monitor
            </h1>
            <p className="text-cyan-300/70 font-mono text-sm">
              Advanced Real-Time System Diagnostics & Performance Analytics
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant={autoRefresh ? 'default' : 'outline'}
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className="font-mono"
            >
              <RefreshCw className={`mr-2 w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
              Auto-Refresh
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              className="font-mono"
            >
              {showDetails ? <EyeOff className="mr-2 w-4 h-4" /> : <Eye className="mr-2 w-4 h-4" />}
              {showDetails ? 'Hide' : 'Show'} Details
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={exportReport}
              className="font-mono"
            >
              <Download className="mr-2 w-4 h-4" />
              Export
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={fetchHealthData}
              className="font-mono"
            >
              <RefreshCw className="mr-2 w-4 h-4" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* System Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-slate-800/50 border-cyan-500/30 backdrop-blur">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-mono text-cyan-400 flex items-center">
              <Activity className="mr-2 w-4 h-4" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-white font-mono">
                {healthData.status.toUpperCase()}
              </span>
              {getStatusIcon(healthData.status)}
            </div>
            {getStatusBadge(healthData.status)}
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-cyan-500/30 backdrop-blur">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-mono text-cyan-400 flex items-center">
              <Zap className="mr-2 w-4 h-4" />
              Uptime
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white font-mono">
              {formatUptime(healthData.uptime)}
            </div>
            <p className="text-xs text-gray-400 mt-1 font-mono">
              {healthData.uptime.toLocaleString()} seconds
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-cyan-500/30 backdrop-blur">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-mono text-cyan-400 flex items-center">
              <CheckCircle2 className="mr-2 w-4 h-4" />
              Health Checks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white font-mono">
              {healthData.checks.filter(c => c.status === 'healthy').length}/{healthData.checks.length}
            </div>
            <p className="text-xs text-gray-400 mt-1 font-mono">
              Passing checks
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-cyan-500/30 backdrop-blur">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-mono text-cyan-400 flex items-center">
              <AlertTriangle className="mr-2 w-4 h-4" />
              Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white font-mono">
              {healthData.checks.filter(c => c.status !== 'healthy').length}
            </div>
            <p className="text-xs text-gray-400 mt-1 font-mono">
              Warnings & Critical
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-slate-800/50 border border-cyan-500/30">
          <TabsTrigger value="overview" className="font-mono">Overview</TabsTrigger>
          <TabsTrigger value="metrics" className="font-mono">Metrics</TabsTrigger>
          <TabsTrigger value="trends" className="font-mono">Trends</TabsTrigger>
          <TabsTrigger value="history" className="font-mono">History</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Health Checks Grid */}
            <Card className="bg-slate-800/50 border-cyan-500/30 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-cyan-400 font-mono">System Health Checks</CardTitle>
                <CardDescription className="font-mono">Real-time component status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {healthData.checks.map((check, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-slate-700/30 border border-slate-600/30 hover:border-cyan-500/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedMetric(check.name)}
                    >
                      <div className="flex items-center gap-3">
                        {getStatusIcon(check.status)}
                        <div>
                          <p className="font-mono text-white font-semibold">{check.name}</p>
                          {showDetails && (
                            <p className="text-xs text-gray-400 font-mono">{check.message}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-white font-bold">
                          {check.value.toFixed(1)}{check.unit}
                        </p>
                        {showDetails && (
                          <p className="text-xs text-gray-400 font-mono">
                            Threshold: {check.threshold}{check.unit}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Status Distribution */}
            <Card className="bg-slate-800/50 border-cyan-500/30 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-cyan-400 font-mono">Status Distribution</CardTitle>
                <CardDescription className="font-mono">Component health breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        border: '1px solid #00D9FF',
                        fontFamily: 'monospace'
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Metrics Tab */}
        <TabsContent value="metrics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {healthData.checks.map((check, index) => (
              <Card key={index} className="bg-slate-800/50 border-cyan-500/30 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-sm font-mono text-cyan-400 flex items-center justify-between">
                    <span>{check.name}</span>
                    {getStatusIcon(check.status)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-baseline">
                      <span className="text-3xl font-bold text-white font-mono">
                        {check.value.toFixed(1)}
                      </span>
                      <span className="text-lg text-gray-400 font-mono">{check.unit}</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          check.status === 'healthy' ? 'bg-green-500' :
                          check.status === 'warning' ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${Math.min((check.value / check.threshold) * 100, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 font-mono">
                      Threshold: {check.threshold}{check.unit}
                    </p>
                    <p className="text-xs text-gray-300 font-mono">{check.message}</p>
                    <p className="text-xs text-gray-500 font-mono">
                      Last check: {new Date(check.lastCheck).toLocaleTimeString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-4">
          <Card className="bg-slate-800/50 border-cyan-500/30 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-cyan-400 font-mono">Performance Trends</CardTitle>
              <CardDescription className="font-mono">Historical performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00D9FF" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#00D9FF" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorMemory" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00FF41" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#00FF41" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorDatabase" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FFB800" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#FFB800" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorApi" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF0040" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#FF0040" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="time" stroke="#94a3b8" style={{ fontFamily: 'monospace' }} />
                  <YAxis stroke="#94a3b8" style={{ fontFamily: 'monospace' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: '1px solid #00D9FF',
                      fontFamily: 'monospace'
                    }} 
                  />
                  <Legend wrapperStyle={{ fontFamily: 'monospace' }} />
                  <Area type="monotone" dataKey="cpu" stroke="#00D9FF" fillOpacity={1} fill="url(#colorCpu)" name="CPU %" />
                  <Area type="monotone" dataKey="memory" stroke="#00FF41" fillOpacity={1} fill="url(#colorMemory)" name="Memory %" />
                  <Area type="monotone" dataKey="database" stroke="#FFB800" fillOpacity={1} fill="url(#colorDatabase)" name="DB Latency" />
                  <Area type="monotone" dataKey="api" stroke="#FF0040" fillOpacity={1} fill="url(#colorApi)" name="API Response" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-4">
          <Card className="bg-slate-800/50 border-cyan-500/30 backdrop-blur">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-cyan-400 font-mono">Health History</CardTitle>
                  <CardDescription className="font-mono">System health event log</CardDescription>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={clearHistory}
                  className="font-mono"
                >
                  <Trash2 className="mr-2 w-4 h-4" />
                  Clear History
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {healthData.history.length === 0 ? (
                  <p className="text-center text-gray-400 py-8 font-mono">No history available</p>
                ) : (
                  healthData.history.map((event, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-lg bg-slate-700/30 border border-slate-600/30 hover:border-cyan-500/50 transition-colors"
                    >
                      {getStatusIcon(event.status)}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono text-white font-semibold">
                            {event.status.toUpperCase()}
                          </span>
                          <span className="text-xs text-gray-400 font-mono">
                            {new Date(event.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-300 font-mono">{event.details}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* JARVIS-style Footer */}
      <div className="mt-6 text-center">
        <p className="text-cyan-400/50 font-mono text-sm">
          AETHERIAL Health Monitor v1.0 | Last Updated: {new Date(healthData.timestamp).toLocaleString()}
        </p>
        <p className="text-cyan-400/30 font-mono text-xs mt-1">
          "Monitoring system integrity. All systems operational." - JARVIS
        </p>
      </div>
    </div>
  );
}

