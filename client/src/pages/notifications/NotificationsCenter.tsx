import React, { useState } from 'react';
import './NotificationsCenter.css';

interface Notification {
  id: string;
  type: 'course' | 'job' | 'marketplace' | 'system' | 'social';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  icon: string;
}

const NotificationsCenter: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'course' | 'job' | 'marketplace' | 'system' | 'social'>('all');
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'course',
      title: 'New lesson available',
      message: 'A new lesson "Advanced React Hooks" has been added to your course "Complete Web Development Bootcamp"',
      timestamp: '5 minutes ago',
      read: false,
      actionUrl: '/learning/course/1',
      icon: '📚'
    },
    {
      id: '2',
      type: 'job',
      title: 'Application viewed',
      message: 'TechCorp Solutions viewed your application for Senior Full Stack Developer position',
      timestamp: '1 hour ago',
      read: false,
      actionUrl: '/jobs/application/1',
      icon: '👀'
    },
    {
      id: '3',
      type: 'marketplace',
      title: 'Order shipped',
      message: 'Your order #12345 has been shipped and will arrive in 2-3 business days',
      timestamp: '2 hours ago',
      read: false,
      actionUrl: '/orders/12345',
      icon: '📦'
    },
    {
      id: '4',
      type: 'course',
      title: 'Certificate earned',
      message: 'Congratulations! You\'ve earned a certificate for completing "Machine Learning A-Z"',
      timestamp: '3 hours ago',
      read: true,
      actionUrl: '/certificates/ml-az',
      icon: '🏆'
    },
    {
      id: '5',
      type: 'social',
      title: 'New follower',
      message: 'Sarah Johnson started following you',
      timestamp: '5 hours ago',
      read: true,
      actionUrl: '/profile/sarah-johnson',
      icon: '👤'
    },
    {
      id: '6',
      type: 'job',
      title: 'New job match',
      message: '3 new jobs match your profile: React Developer, Full Stack Engineer, Frontend Lead',
      timestamp: '1 day ago',
      read: true,
      actionUrl: '/jobs/matches',
      icon: '💼'
    },
    {
      id: '7',
      type: 'system',
      title: 'Security alert',
      message: 'New login detected from Chrome on Windows in San Francisco, CA',
      timestamp: '2 days ago',
      read: true,
      actionUrl: '/settings/security',
      icon: '🔒'
    },
    {
      id: '8',
      type: 'marketplace',
      title: 'Price drop alert',
      message: 'The item in your wishlist "Wireless Headphones" is now 20% off!',
      timestamp: '2 days ago',
      read: true,
      actionUrl: '/marketplace/product/456',
      icon: '💰'
    },
    {
      id: '9',
      type: 'course',
      title: 'Assignment due soon',
      message: 'Your assignment for "Python for Data Science" is due in 24 hours',
      timestamp: '3 days ago',
      read: true,
      actionUrl: '/learning/assignment/789',
      icon: '⏰'
    },
    {
      id: '10',
      type: 'social',
      title: 'Comment on your post',
      message: 'Michael Chen commented on your post about React best practices',
      timestamp: '4 days ago',
      read: true,
      actionUrl: '/community/post/123',
      icon: '💬'
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    return notification.type === filter;
  });

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all notifications?')) {
      setNotifications([]);
    }
  };

  const stats = {
    all: notifications.length,
    unread: unreadCount,
    course: notifications.filter(n => n.type === 'course').length,
    job: notifications.filter(n => n.type === 'job').length,
    marketplace: notifications.filter(n => n.type === 'marketplace').length,
    system: notifications.filter(n => n.type === 'system').length,
    social: notifications.filter(n => n.type === 'social').length
  };

  return (
    <div className="notifications-center">
      <div className="notifications-container">
        <div className="notifications-header">
          <div className="header-left">
            <h1>Notifications</h1>
            {unreadCount > 0 && (
              <span className="unread-badge">{unreadCount} unread</span>
            )}
          </div>
          <div className="header-actions">
            {unreadCount > 0 && (
              <button className="mark-all-btn" onClick={handleMarkAllAsRead}>
                ✓ Mark all as read
              </button>
            )}
            {notifications.length > 0 && (
              <button className="clear-all-btn" onClick={handleClearAll}>
                🗑️ Clear all
              </button>
            )}
          </div>
        </div>

        <div className="notifications-content">
          {/* Filters Sidebar */}
          <div className="notifications-filters">
            <button
              className={filter === 'all' ? 'active' : ''}
              onClick={() => setFilter('all')}
            >
              <span className="filter-icon">📋</span>
              <span className="filter-label">All</span>
              <span className="filter-count">{stats.all}</span>
            </button>
            <button
              className={filter === 'unread' ? 'active' : ''}
              onClick={() => setFilter('unread')}
            >
              <span className="filter-icon">🔔</span>
              <span className="filter-label">Unread</span>
              {stats.unread > 0 && (
                <span className="filter-count unread">{stats.unread}</span>
              )}
            </button>
            <button
              className={filter === 'course' ? 'active' : ''}
              onClick={() => setFilter('course')}
            >
              <span className="filter-icon">📚</span>
              <span className="filter-label">Courses</span>
              <span className="filter-count">{stats.course}</span>
            </button>
            <button
              className={filter === 'job' ? 'active' : ''}
              onClick={() => setFilter('job')}
            >
              <span className="filter-icon">💼</span>
              <span className="filter-label">Jobs</span>
              <span className="filter-count">{stats.job}</span>
            </button>
            <button
              className={filter === 'marketplace' ? 'active' : ''}
              onClick={() => setFilter('marketplace')}
            >
              <span className="filter-icon">🛒</span>
              <span className="filter-label">Marketplace</span>
              <span className="filter-count">{stats.marketplace}</span>
            </button>
            <button
              className={filter === 'social' ? 'active' : ''}
              onClick={() => setFilter('social')}
            >
              <span className="filter-icon">👥</span>
              <span className="filter-label">Social</span>
              <span className="filter-count">{stats.social}</span>
            </button>
            <button
              className={filter === 'system' ? 'active' : ''}
              onClick={() => setFilter('system')}
            >
              <span className="filter-icon">⚙️</span>
              <span className="filter-label">System</span>
              <span className="filter-count">{stats.system}</span>
            </button>
          </div>

          {/* Notifications List */}
          <div className="notifications-list">
            {filteredNotifications.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">🔔</span>
                <h2>No notifications</h2>
                <p>You're all caught up! Check back later for updates.</p>
              </div>
            ) : (
              filteredNotifications.map(notification => (
                <div
                  key={notification.id}
                  className={`notification-item ${!notification.read ? 'unread' : ''}`}
                >
                  <div className="notification-icon">{notification.icon}</div>
                  <div className="notification-content">
                    <div className="notification-header">
                      <h3>{notification.title}</h3>
                      <span className="notification-time">{notification.timestamp}</span>
                    </div>
                    <p className="notification-message">{notification.message}</p>
                    {notification.actionUrl && (
                      <a href={notification.actionUrl} className="notification-action">
                        View details →
                      </a>
                    )}
                  </div>
                  <div className="notification-actions">
                    {!notification.read && (
                      <button
                        className="mark-read-btn"
                        onClick={() => handleMarkAsRead(notification.id)}
                        title="Mark as read"
                      >
                        ✓
                      </button>
                    )}
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(notification.id)}
                      title="Delete"
                    >
                      ✕
                    </button>
                  </div>
                  {!notification.read && <div className="unread-indicator"></div>}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Settings Section */}
        <div className="notifications-settings">
          <h3>Notification Preferences</h3>
          <div className="settings-grid">
            <label className="setting-item">
              <input type="checkbox" defaultChecked />
              <span>Email notifications</span>
            </label>
            <label className="setting-item">
              <input type="checkbox" defaultChecked />
              <span>Push notifications</span>
            </label>
            <label className="setting-item">
              <input type="checkbox" defaultChecked />
              <span>Course updates</span>
            </label>
            <label className="setting-item">
              <input type="checkbox" defaultChecked />
              <span>Job alerts</span>
            </label>
            <label className="setting-item">
              <input type="checkbox" defaultChecked />
              <span>Order updates</span>
            </label>
            <label className="setting-item">
              <input type="checkbox" />
              <span>Marketing emails</span>
            </label>
          </div>
          <button className="save-settings-btn">Save Preferences</button>
        </div>
      </div>
    </div>
  );
};

export default NotificationsCenter;

