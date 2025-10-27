import React, { useState, useEffect } from 'react';
import {
  Store, Package, ShoppingCart, DollarSign, TrendingUp, Users,
  BookOpen, Briefcase, BarChart3, Settings as SettingsIcon,
  Plus, Edit, Eye, Trash2, CheckCircle, XCircle, Clock
} from 'lucide-react';

interface BusinessStats {
  totalProducts?: number;
  totalOrders?: number;
  totalRevenue?: number;
  totalCourses?: number;
  totalJobs?: number;
  totalStudents?: number;
  totalApplicants?: number;
}

export default function BusinessDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [businessStatus, setBusinessStatus] = useState<any>(null);
  const [stats, setStats] = useState<BusinessStats>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBusinessStatus();
    loadStats();
  }, []);

  const loadBusinessStatus = async () => {
    try {
      const response = await fetch('/api/business/status', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setBusinessStatus(data);
    } catch (error) {
      console.error('Failed to load business status:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      // Load business-specific stats
      // This would aggregate data from products, orders, courses, jobs APIs
      setStats({
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
        totalCourses: 0,
        totalJobs: 0,
        totalStudents: 0,
        totalApplicants: 0,
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading business dashboard...</p>
        </div>
      </div>
    );
  }

  if (!businessStatus?.registered) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <Store className="w-16 h-16 text-cyan-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Business Dashboard</h2>
          <p className="text-gray-400 mb-6">
            Register your business to access seller, instructor, or employer features.
          </p>
          <button
            onClick={() => window.location.href = '/business/register'}
            className="bg-cyan-500 text-white px-6 py-3 rounded-lg hover:bg-cyan-600 transition"
          >
            Register Your Business
          </button>
        </div>
      </div>
    );
  }

  if (businessStatus.status === 'pending') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <Clock className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Registration Pending</h2>
          <p className="text-gray-400 mb-6">
            Your business registration is currently under review. We'll notify you once it's approved.
          </p>
          <div className="text-left bg-gray-900 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-sm text-gray-400 mb-2">Business Name:</p>
            <p className="text-white font-medium mb-4">{businessStatus.registration?.businessName}</p>
            <p className="text-sm text-gray-400 mb-2">Business Type:</p>
            <p className="text-white font-medium">{businessStatus.registration?.businessType}</p>
          </div>
        </div>
      </div>
    );
  }

  if (businessStatus.status === 'rejected') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Registration Rejected</h2>
          <p className="text-gray-400 mb-6">
            Unfortunately, your business registration was not approved. Please contact support for more information.
          </p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'jobs', label: 'Jobs', icon: Briefcase },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  const statCards = [
    { label: 'Products', value: stats.totalProducts || 0, icon: Package, color: 'cyan' },
    { label: 'Orders', value: stats.totalOrders || 0, icon: ShoppingCart, color: 'green' },
    { label: 'Revenue', value: `$${stats.totalRevenue || 0}`, icon: DollarSign, color: 'yellow' },
    { label: 'Courses', value: stats.totalCourses || 0, icon: BookOpen, color: 'purple' },
    { label: 'Students', value: stats.totalStudents || 0, icon: Users, color: 'blue' },
    { label: 'Jobs Posted', value: stats.totalJobs || 0, icon: Briefcase, color: 'orange' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Store className="w-8 h-8 text-cyan-500" />
              <div>
                <h1 className="text-2xl font-bold">Business Dashboard</h1>
                <p className="text-sm text-gray-400">{businessStatus.registration?.businessName}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm text-green-500">Verified Business</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 border-b-2 transition ${
                  activeTab === tab.id
                    ? 'border-cyan-500 text-cyan-500'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'overview' && (
          <div>
            <h2 className="text-xl font-bold mb-6">Business Overview</h2>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {statCards.map((stat, index) => (
                <div key={index} className="bg-gray-800 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <stat.icon className={`w-8 h-8 text-${stat.color}-500`} />
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  </div>
                  <p className="text-3xl font-bold mb-2">{stat.value}</p>
                  <p className="text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button className="flex items-center space-x-2 bg-cyan-500 text-white px-4 py-3 rounded-lg hover:bg-cyan-600 transition">
                  <Plus className="w-5 h-5" />
                  <span>Add Product</span>
                </button>
                <button className="flex items-center space-x-2 bg-purple-500 text-white px-4 py-3 rounded-lg hover:bg-purple-600 transition">
                  <Plus className="w-5 h-5" />
                  <span>Create Course</span>
                </button>
                <button className="flex items-center space-x-2 bg-orange-500 text-white px-4 py-3 rounded-lg hover:bg-orange-600 transition">
                  <Plus className="w-5 h-5" />
                  <span>Post Job</span>
                </button>
                <button className="flex items-center space-x-2 bg-gray-700 text-white px-4 py-3 rounded-lg hover:bg-gray-600 transition">
                  <Eye className="w-5 h-5" />
                  <span>View Analytics</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab !== 'overview' && (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <p className="text-gray-400">
              {tabs.find(t => t.id === activeTab)?.label} management coming soon...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

