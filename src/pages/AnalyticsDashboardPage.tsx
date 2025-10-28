import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

// --- 1. TypeScript Interfaces and Types ---

/** Defines the structure for a single data point in a chart. */
interface ChartDataPoint {
  name: string; // e.g., 'Jan', 'Feb', 'Week 1'
  value: number;
  aetherialMetric?: number; // For AETHERIAL-specific data
}

/** Defines the structure for a key performance indicator (KPI) card. */
interface KPI {
  id: string;
  title: string;
  value: string;
  change: number; // Percentage change
  isPositive: boolean;
  icon: string; // Placeholder for an icon name
}

/** Defines the structure for the overall dashboard state. */
interface DashboardState {
  timeframe: 'day' | 'week' | 'month' | 'quarter';
  filter: string;
  data: {
    userEngagement: ChartDataPoint[];
    revenue: ChartDataPoint[];
    platformMetrics: ChartDataPoint[];
  };
}

// --- 2. Sample Data (Simulated API Fetch) ---

const generateSampleData = (timeframe: string): DashboardState['data'] => {
  const dataPoints = timeframe === 'day' ? 7 : 12;
  const names = timeframe === 'day' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] : 
                timeframe === 'week' ? Array.from({length: 4}, (_, i) => `Week ${i+1}`) :
                ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const generateMetrics = (base: number, variance: number) => 
    Array.from({ length: dataPoints }, (_, i) => ({
      name: names[i % names.length],
      value: Math.floor(base + Math.random() * variance * (Math.random() > 0.5 ? 1 : -1)),
      aetherialMetric: Math.floor(base * 0.1 + Math.random() * variance * 0.2), // Simulated blockchain/DeFi metric
    }));

  return {
    userEngagement: generateMetrics(1500, 500),
    revenue: generateMetrics(50000, 15000),
    platformMetrics: generateMetrics(100, 30),
  };
};

const initialDashboardState: DashboardState = {
  timeframe: 'month',
  filter: 'All Users',
  data: generateSampleData('month'),
};

// --- 3. Utility Components (Simulated) ---

// In a real application, these would be components from a UI library (e.g., Tailwind, Material UI, BuddyBoss-like theme)
const Card: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white shadow-lg rounded-xl p-6 transition-all duration-300 hover:shadow-2xl border border-gray-100">
    <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
    {children}
  </div>
);

const KPIComponent: React.FC<{ kpi: KPI }> = ({ kpi }) => (
  <Card title={kpi.title}>
    <div className="flex items-center justify-between">
      <div className="text-4xl font-bold text-gray-900">{kpi.value}</div>
      <div className={`text-lg font-medium ${kpi.isPositive ? 'text-green-500' : 'text-red-500'}`}>
        {kpi.isPositive ? '▲' : '▼'} {kpi.change.toFixed(2)}%
      </div>
    </div>
    <p className="text-sm text-gray-500 mt-1">vs. last period</p>
    <div className="text-sm text-purple-600 mt-3 flex items-center">
      <span className="mr-2">{kpi.icon}</span>
      <span className="font-medium">AETHERIAL Insight</span>
    </div>
  </Card>
);

const ChartWrapper: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
  <Card title={title}>
    <div className="h-80 w-full">
      {children}
    </div>
  </Card>
);

// --- 4. Main Component: AnalyticsDashboardPage ---

const AnalyticsDashboardPage: React.FC = () => {
  // State management for the dashboard
  const [dashboardState, setDashboardState] = useState<DashboardState>(initialDashboardState);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Simulated data fetching effect
  useEffect(() => {
    // In a production app, this would be an API call
    setLoading(true);
    setError(null);
    const timer = setTimeout(() => {
      try {
        const newData = generateSampleData(dashboardState.timeframe);
        setDashboardState(prev => ({ ...prev, data: newData }));
        setLoading(false);
      } catch (e) {
        setError('Failed to fetch analytics data.');
        setLoading(false);
      }
    }, 500); // Simulate network delay

    return () => clearTimeout(timer);
  }, [dashboardState.timeframe]); // Re-fetch data when timeframe changes

  // Handler for interactive features (Timeframe/Filter change)
  const handleTimeframeChange = useCallback((newTimeframe: DashboardState['timeframe']) => {
    setDashboardState(prev => ({ ...prev, timeframe: newTimeframe }));
  }, []);

  const handleFilterChange = useCallback((newFilter: string) => {
    setDashboardState(prev => ({ ...prev, filter: newFilter }));
  }, []);

  // Memoized KPIs for performance
  const kpis: KPI[] = useMemo(() => {
    // Calculate current values and changes from the last data point
    const lastRevenue = dashboardState.data.revenue.slice(-1)[0]?.value || 0;
    const prevRevenue = dashboardState.data.revenue.slice(-2)[0]?.value || lastRevenue;
    const revenueChange = ((lastRevenue - prevRevenue) / prevRevenue) * 100;

    const lastUsers = dashboardState.data.userEngagement.slice(-1)[0]?.value || 0;
    const prevUsers = dashboardState.data.userEngagement.slice(-2)[0]?.value || lastUsers;
    const userChange = ((lastUsers - prevUsers) / prevUsers) * 100;

    // AETHERIAL-specific metric: Total Value Locked (TVL) in simulated DeFi contracts
    const totalTVL = dashboardState.data.platformMetrics.reduce((sum, p) => sum + (p.aetherialMetric || 0), 0);

    return [
      {
        id: 'revenue',
        title: 'Total Revenue',
        value: `$${(lastRevenue * 10).toLocaleString()}`, // Scaled up for dashboard look
        change: Math.abs(revenueChange),
        isPositive: revenueChange >= 0,
        icon: '💰',
      },
      {
        id: 'users',
        title: 'Active Users',
        value: lastUsers.toLocaleString(),
        change: Math.abs(userChange),
        isPositive: userChange >= 0,
        icon: '👥',
      },
      {
        id: 'tvl',
        title: 'AETHERIAL TVL (Simulated)',
        value: `$${totalTVL.toLocaleString()}M`, // Simulated millions
        change: Math.abs(Math.random() * 10 - 5), // Random change for simulated metric
        isPositive: Math.random() > 0.5,
        icon: '🔗', // Blockchain/DeFi icon
      },
      {
        id: 'ai_score',
        title: 'AI Engagement Score',
        value: '8.7/10',
        change: 0.3,
        isPositive: true,
        icon: '🧠', // AI icon
      },
    ];
  }, [dashboardState.data]);

  // Responsive design consideration: Grid layout for main content
  const gridClasses = "grid grid-cols-1 lg:grid-cols-4 gap-6";
  const chartGridClasses = "grid grid-cols-1 lg:grid-cols-2 gap-6";

  if (loading) return <div className="p-8 text-center text-xl text-gray-500">Loading Dashboard Data...</div>;
  if (error) return <div className="p-8 text-center text-xl text-red-500">Error: {error}</div>;

  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
      {/* Header and Controls */}
      <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h1 className="text-3xl font-extrabold text-gray-900">Analytics Dashboard</h1>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          {/* Timeframe Filter Buttons */}
          {['day', 'week', 'month', 'quarter'].map(tf => (
            <button
              key={tf}
              onClick={() => handleTimeframeChange(tf as DashboardState['timeframe'])}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                dashboardState.timeframe === tf
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              {tf.charAt(0).toUpperCase() + tf.slice(1)}
            </button>
          ))}
          {/* Filter Dropdown (Simulated) */}
          <select
            value={dashboardState.filter}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="All Users">All Users</option>
            <option value="Pro Members">Pro Members</option>
            <option value="Guests">Guests</option>
          </select>
        </div>
      </header>

      {/* KPI Cards Section */}
      <section className={`${gridClasses} mb-8`}>
        {kpis.map(kpi => (
          <KPIComponent key={kpi.id} kpi={kpi} />
        ))}
      </section>

      {/* Charts Section */}
      <section className={`${chartGridClasses} mb-8`}>
        {/* User Engagement Chart */}
        <ChartWrapper title={`User Engagement Over Time (${dashboardState.filter})`}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dashboardState.data.userEngagement} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px' }}
                labelStyle={{ fontWeight: 'bold', color: '#4c1d95' }}
              />
              <Legend />
              {/* Primary Metric: Users */}
              <Line type="monotone" dataKey="value" name="Total Users" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} />
              {/* AETHERIAL Enhancement: AI-Driven User Sessions */}
              <Line type="monotone" dataKey="aetherialMetric" name="AI Sessions" stroke="#4c1d95" strokeWidth={2} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </ChartWrapper>

        {/* Revenue and DeFi Metrics Chart */}
        <ChartWrapper title="Revenue & AETHERIAL DeFi Volume">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dashboardState.data.revenue} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis yAxisId="left" orientation="left" stroke="#10b981" />
              <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px' }}
                labelStyle={{ fontWeight: 'bold', color: '#4c1d95' }}
              />
              <Legend />
              {/* Primary Metric: Revenue */}
              <Bar yAxisId="left" dataKey="value" name="Revenue" fill="#10b981" />
              {/* AETHERIAL Enhancement: DeFi Transaction Volume */}
              <Bar yAxisId="right" dataKey="aetherialMetric" name="DeFi Tx Volume" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </section>

      {/* BuddyBoss Abstraction: Platform Metrics (e.g., Posts, Comments) */}
      <section className="mb-8">
        <ChartWrapper title="Platform Activity Metrics (BuddyBoss Abstraction)">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dashboardState.data.platformMetrics} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px' }}
                labelStyle={{ fontWeight: 'bold', color: '#4c1d95' }}
              />
              <Legend />
              {/* BuddyBoss Metric: Total Posts/Activity */}
              <Line type="monotone" dataKey="value" name="Total Activity" stroke="#ef4444" strokeWidth={2} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </section>

      {/* Interactive Feature: Data Export Button */}
      <div className="flex justify-end">
        <button
          onClick={() => alert('Simulating data export for selected timeframe: ' + dashboardState.timeframe)}
          className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
        >
          Export Data (.csv)
        </button>
      </div>

      {/* Responsive Design Note for Comments */}
      {/* The use of Tailwind CSS grid classes (grid-cols-1, lg:grid-cols-4, etc.) ensures the layout is fully responsive. */}
      {/* The ResponsiveContainer component from recharts ensures charts scale correctly. */}
    </div>
  );
};

// --- 7. Export Default ---
export default AnalyticsDashboardPage;