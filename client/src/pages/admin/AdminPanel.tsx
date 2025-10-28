import React, { useState } from 'react';
import './AdminPanel.css';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'instructor' | 'seller' | 'employer';
  status: 'active' | 'suspended' | 'banned';
  joined: string;
  lastActive: string;
}

interface Report {
  id: string;
  type: 'content' | 'user' | 'transaction' | 'bug';
  reporter: string;
  reported: string;
  reason: string;
  status: 'pending' | 'reviewing' | 'resolved' | 'dismissed';
  date: string;
}

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'content' | 'reports' | 'analytics' | 'settings'>('overview');

  const stats = {
    totalUsers: 125847,
    activeUsers: 45678,
    totalRevenue: 2456789.50,
    pendingReports: 23,
    totalCourses: 1234,
    totalProducts: 5678,
    totalJobs: 456,
    serverUptime: 99.98
  };

  const recentUsers: User[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user',
      status: 'active',
      joined: '2025-10-20',
      lastActive: '2 hours ago'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'instructor',
      status: 'active',
      joined: '2025-10-18',
      lastActive: '5 hours ago'
    },
    {
      id: '3',
      name: 'Bob Johnson',
      email: 'bob@example.com',
      role: 'seller',
      status: 'active',
      joined: '2025-10-15',
      lastActive: '1 day ago'
    }
  ];

  const recentReports: Report[] = [
    {
      id: '1',
      type: 'content',
      reporter: 'User #12345',
      reported: 'Post #67890',
      reason: 'Inappropriate content',
      status: 'pending',
      date: '2025-10-28'
    },
    {
      id: '2',
      type: 'user',
      reporter: 'User #23456',
      reported: 'User #34567',
      reason: 'Harassment',
      status: 'reviewing',
      date: '2025-10-27'
    },
    {
      id: '3',
      type: 'transaction',
      reporter: 'User #45678',
      reported: 'Order #78901',
      reason: 'Payment issue',
      status: 'resolved',
      date: '2025-10-26'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#28a745';
      case 'suspended': return '#ffc107';
      case 'banned': return '#dc3545';
      case 'pending': return '#17a2b8';
      case 'reviewing': return '#ffc107';
      case 'resolved': return '#28a745';
      case 'dismissed': return '#6c757d';
      default: return '#6c757d';
    }
  };

  return (
    <div className="admin-panel">
      <div className="admin-container">
        {/* Header */}
        <div className="admin-header">
          <div>
            <h1>Admin Panel</h1>
            <p>Platform management and monitoring</p>
          </div>
          <div className="admin-actions">
            <button className="action-btn-header">🔔 Notifications</button>
            <button className="action-btn-header">⚙️ Settings</button>
          </div>
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          <button
            className={activeTab === 'overview' ? 'active' : ''}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button
            className={activeTab === 'users' ? 'active' : ''}
            onClick={() => setActiveTab('users')}
          >
            👥 Users
          </button>
          <button
            className={activeTab === 'content' ? 'active' : ''}
            onClick={() => setActiveTab('content')}
          >
            📝 Content
          </button>
          <button
            className={activeTab === 'reports' ? 'active' : ''}
            onClick={() => setActiveTab('reports')}
          >
            🚨 Reports
          </button>
          <button
            className={activeTab === 'analytics' ? 'active' : ''}
            onClick={() => setActiveTab('analytics')}
          >
            📈 Analytics
          </button>
          <button
            className={activeTab === 'settings' ? 'active' : ''}
            onClick={() => setActiveTab('settings')}
          >
            ⚙️ Settings
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="overview-content">
            {/* Stats Grid */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-info">
                  <div className="stat-value">{stats.totalUsers.toLocaleString()}</div>
                  <div className="stat-label">Total Users</div>
                  <div className="stat-change positive">+1,234 this week</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">🟢</div>
                <div className="stat-info">
                  <div className="stat-value">{stats.activeUsers.toLocaleString()}</div>
                  <div className="stat-label">Active Users</div>
                  <div className="stat-change positive">+567 today</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <div className="stat-info">
                  <div className="stat-value">${(stats.totalRevenue / 1000000).toFixed(2)}M</div>
                  <div className="stat-label">Total Revenue</div>
                  <div className="stat-change positive">+12.5% this month</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">🚨</div>
                <div className="stat-info">
                  <div className="stat-value">{stats.pendingReports}</div>
                  <div className="stat-label">Pending Reports</div>
                  <div className="stat-change negative">Needs attention</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">📚</div>
                <div className="stat-info">
                  <div className="stat-value">{stats.totalCourses.toLocaleString()}</div>
                  <div className="stat-label">Total Courses</div>
                  <div className="stat-change positive">+45 this week</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">🛍️</div>
                <div className="stat-info">
                  <div className="stat-value">{stats.totalProducts.toLocaleString()}</div>
                  <div className="stat-label">Total Products</div>
                  <div className="stat-change positive">+123 this week</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">💼</div>
                <div className="stat-info">
                  <div className="stat-value">{stats.totalJobs}</div>
                  <div className="stat-label">Active Jobs</div>
                  <div className="stat-change positive">+12 this week</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">🖥️</div>
                <div className="stat-info">
                  <div className="stat-value">{stats.serverUptime}%</div>
                  <div className="stat-label">Server Uptime</div>
                  <div className="stat-change positive">Excellent</div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="admin-grid">
              <div className="section-card">
                <h2>Recent Users</h2>
                <div className="users-list-mini">
                  {recentUsers.map(user => (
                    <div key={user.id} className="user-item-mini">
                      <div className="user-info-mini">
                        <h4>{user.name}</h4>
                        <p>{user.email}</p>
                        <span className="role-badge">{user.role}</span>
                      </div>
                      <div className="user-status-mini">
                        <span className="status-badge" style={{ background: getStatusColor(user.status) }}>
                          {user.status}
                        </span>
                        <p className="user-meta-mini">Joined {new Date(user.joined).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="section-card">
                <h2>Recent Reports</h2>
                <div className="reports-list-mini">
                  {recentReports.map(report => (
                    <div key={report.id} className="report-item-mini">
                      <div className="report-info-mini">
                        <h4>{report.type.toUpperCase()}: {report.reason}</h4>
                        <p>Reporter: {report.reporter}</p>
                        <p>Reported: {report.reported}</p>
                      </div>
                      <div className="report-status-mini">
                        <span className="status-badge" style={{ background: getStatusColor(report.status) }}>
                          {report.status}
                        </span>
                        <p className="report-date-mini">{new Date(report.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="section-card">
              <h2>Quick Actions</h2>
              <div className="quick-actions-grid">
                <button className="quick-action-btn">👥 Manage Users</button>
                <button className="quick-action-btn">📝 Review Content</button>
                <button className="quick-action-btn">🚨 Handle Reports</button>
                <button className="quick-action-btn">💰 View Transactions</button>
                <button className="quick-action-btn">📊 Generate Report</button>
                <button className="quick-action-btn">⚙️ System Settings</button>
                <button className="quick-action-btn">🔒 Security Logs</button>
                <button className="quick-action-btn">📧 Send Announcement</button>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="users-content">
            <div className="users-header">
              <input type="text" placeholder="Search users..." className="search-input" />
              <select className="filter-select">
                <option>All Roles</option>
                <option>Admin</option>
                <option>User</option>
                <option>Instructor</option>
                <option>Seller</option>
                <option>Employer</option>
              </select>
              <select className="filter-select">
                <option>All Status</option>
                <option>Active</option>
                <option>Suspended</option>
                <option>Banned</option>
              </select>
            </div>

            <div className="users-table">
              <table>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Last Active</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map(user => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td><span className="role-badge">{user.role}</span></td>
                      <td>
                        <span className="status-badge" style={{ background: getStatusColor(user.status) }}>
                          {user.status}
                        </span>
                      </td>
                      <td>{new Date(user.joined).toLocaleDateString()}</td>
                      <td>{user.lastActive}</td>
                      <td>
                        <button className="action-btn-small">Edit</button>
                        <button className="action-btn-small danger">Suspend</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Content Tab */}
        {activeTab === 'content' && (
          <div className="content-management">
            <div className="content-sections">
              <div className="content-section-card">
                <h3>📚 Courses</h3>
                <p>{stats.totalCourses} total courses</p>
                <button className="manage-btn">Manage Courses</button>
              </div>

              <div className="content-section-card">
                <h3>🛍️ Products</h3>
                <p>{stats.totalProducts} total products</p>
                <button className="manage-btn">Manage Products</button>
              </div>

              <div className="content-section-card">
                <h3>💼 Jobs</h3>
                <p>{stats.totalJobs} active jobs</p>
                <button className="manage-btn">Manage Jobs</button>
              </div>

              <div className="content-section-card">
                <h3>📝 Posts</h3>
                <p>12,345 total posts</p>
                <button className="manage-btn">Manage Posts</button>
              </div>

              <div className="content-section-card">
                <h3>💬 Comments</h3>
                <p>45,678 total comments</p>
                <button className="manage-btn">Manage Comments</button>
              </div>

              <div className="content-section-card">
                <h3>📸 Media</h3>
                <p>23,456 media files</p>
                <button className="manage-btn">Manage Media</button>
              </div>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="reports-content">
            <div className="reports-filters">
              <button className="filter-btn active">All ({recentReports.length})</button>
              <button className="filter-btn">Pending (1)</button>
              <button className="filter-btn">Reviewing (1)</button>
              <button className="filter-btn">Resolved (1)</button>
            </div>

            <div className="reports-table">
              <table>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Reporter</th>
                    <th>Reported</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentReports.map(report => (
                    <tr key={report.id}>
                      <td><span className="type-badge">{report.type}</span></td>
                      <td>{report.reporter}</td>
                      <td>{report.reported}</td>
                      <td>{report.reason}</td>
                      <td>
                        <span className="status-badge" style={{ background: getStatusColor(report.status) }}>
                          {report.status}
                        </span>
                      </td>
                      <td>{new Date(report.date).toLocaleDateString()}</td>
                      <td>
                        <button className="action-btn-small">Review</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="analytics-content">
            <div className="analytics-grid">
              <div className="chart-card">
                <h3>User Growth</h3>
                <div className="chart-placeholder">📈 User growth chart</div>
              </div>

              <div className="chart-card">
                <h3>Revenue Trends</h3>
                <div className="chart-placeholder">💰 Revenue trends chart</div>
              </div>

              <div className="chart-card">
                <h3>Content Activity</h3>
                <div className="chart-placeholder">📝 Content activity chart</div>
              </div>

              <div className="chart-card">
                <h3>Platform Usage</h3>
                <div className="chart-placeholder">🖥️ Platform usage chart</div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="settings-content">
            <div className="settings-sections">
              <div className="settings-section">
                <h3>General Settings</h3>
                <div className="setting-item">
                  <label>Platform Name</label>
                  <input type="text" value="AETHERIAL Platform" />
                </div>
                <div className="setting-item">
                  <label>Maintenance Mode</label>
                  <label className="toggle">
                    <input type="checkbox" />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div className="settings-section">
                <h3>Security Settings</h3>
                <div className="setting-item">
                  <label>Two-Factor Authentication</label>
                  <label className="toggle">
                    <input type="checkbox" checked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <div className="setting-item">
                  <label>Password Requirements</label>
                  <select>
                    <option>Strong</option>
                    <option>Medium</option>
                    <option>Basic</option>
                  </select>
                </div>
              </div>

              <div className="settings-section">
                <h3>Email Settings</h3>
                <div className="setting-item">
                  <label>SMTP Server</label>
                  <input type="text" placeholder="smtp.example.com" />
                </div>
                <div className="setting-item">
                  <label>Email Notifications</label>
                  <label className="toggle">
                    <input type="checkbox" checked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div className="settings-section">
                <h3>Payment Settings</h3>
                <div className="setting-item">
                  <label>Payment Gateway</label>
                  <select>
                    <option>Stripe</option>
                    <option>PayPal</option>
                    <option>Cryptocurrency</option>
                  </select>
                </div>
                <div className="setting-item">
                  <label>Commission Rate (%)</label>
                  <input type="number" value="10" />
                </div>
              </div>
            </div>

            <button className="save-settings-btn">💾 Save Settings</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;

