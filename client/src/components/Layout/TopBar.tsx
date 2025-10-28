/**
 * AETHERIAL Platform - Top Bar
 * 
 * Features:
 * - Search bar (left side)
 * - Context-sensitive submenu (changes based on active main menu)
 * - Notifications, Profile, Settings (right side)
 * - Overflow menu (3 dots) for responsive design
 * - Fully responsive across all devices
 */

import React, { useState, useRef, useEffect } from 'react';
import { TopBarAction, getOverflowActions } from '../../config/menu-structure';
import './TopBar.css';

interface TopBarProps {
  deviceInfo: any;
  activeMenuItem: string;
  topBarActions: TopBarAction[];
  onToggleLeftSidebar: () => void;
  onToggleAIChat: () => void;
  onToggleMediaBrowser: () => void;
}

export default function TopBar({
  deviceInfo,
  activeMenuItem,
  topBarActions,
  onToggleLeftSidebar,
  onToggleAIChat,
  onToggleMediaBrowser,
}: TopBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showOverflowMenu, setShowOverflowMenu] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: '1', title: 'New friend request', time: '5m ago', unread: true },
    { id: '2', title: 'Course completed', time: '1h ago', unread: true },
    { id: '3', title: 'New message from John', time: '2h ago', unread: false },
  ]);

  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const overflowRef = useRef<HTMLDivElement>(null);

  /**
   * Determine max visible actions based on screen width
   */
  const getMaxVisibleActions = () => {
    if (deviceInfo.type === 'smartwatch') return 0;
    if (deviceInfo.type === 'mobile') return 2;
    if (deviceInfo.type === 'tablet') return 4;
    return 6; // desktop
  };

  const maxVisible = getMaxVisibleActions();
  const { visible, overflow } = getOverflowActions(topBarActions, maxVisible);

  /**
   * Close dropdowns when clicking outside
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
      if (overflowRef.current && !overflowRef.current.contains(event.target as Node)) {
        setShowOverflowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /**
   * Handle search
   */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search:', searchQuery);
    // In production, implement actual search functionality
  };

  /**
   * Handle action click
   */
  const handleActionClick = (action: TopBarAction) => {
    console.log('Action clicked:', action.action);
    // In production, implement actual action handlers
  };

  /**
   * Mark notification as read
   */
  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className={`top-bar device-${deviceInfo.type}`}>
      {/* Left Section */}
      <div className="topbar-left">
        {/* Burger Menu (Mobile/Tablet) */}
        {(deviceInfo.type === 'mobile' || deviceInfo.type === 'tablet') && (
          <button
            className="burger-btn"
            onClick={onToggleLeftSidebar}
            aria-label="Toggle menu"
          >
            ☰
          </button>
        )}

        {/* Search Bar */}
        {deviceInfo.type !== 'smartwatch' && (
          <form className="search-form" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search AETHERIAL..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn" aria-label="Search">
              🔍
            </button>
          </form>
        )}
      </div>

      {/* Center Section - Context-Sensitive Actions */}
      {deviceInfo.type !== 'smartwatch' && visible.length > 0 && (
        <div className="topbar-center">
          <div className="context-actions">
            {visible.map(action => (
              <button
                key={action.id}
                className="action-btn"
                onClick={() => handleActionClick(action)}
                title={action.label}
              >
                <span className="action-icon">{action.icon}</span>
                {deviceInfo.type === 'desktop' && (
                  <span className="action-label">{action.label}</span>
                )}
              </button>
            ))}

            {/* Overflow Menu (3 dots) */}
            {overflow.length > 0 && (
              <div className="overflow-menu" ref={overflowRef}>
                <button
                  className="action-btn overflow-btn"
                  onClick={() => setShowOverflowMenu(!showOverflowMenu)}
                  title="More actions"
                >
                  ⋯
                </button>
                {showOverflowMenu && (
                  <div className="overflow-dropdown">
                    {overflow.map(action => (
                      <button
                        key={action.id}
                        className="overflow-item"
                        onClick={() => {
                          handleActionClick(action);
                          setShowOverflowMenu(false);
                        }}
                      >
                        <span className="action-icon">{action.icon}</span>
                        <span className="action-label">{action.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Right Section */}
      <div className="topbar-right">
        {/* AI Chat Toggle */}
        <button
          className="topbar-icon-btn"
          onClick={onToggleAIChat}
          title="AI Assistant"
        >
          🤖
        </button>

        {/* Media Browser Toggle */}
        {deviceInfo.type !== 'mobile' && deviceInfo.type !== 'smartwatch' && (
          <button
            className="topbar-icon-btn"
            onClick={onToggleMediaBrowser}
            title="Media Browser"
          >
            🖼️
          </button>
        )}

        {/* Notifications */}
        <div className="notification-container" ref={notificationRef}>
          <button
            className="topbar-icon-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            title="Notifications"
          >
            🔔
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </button>
          {showNotifications && (
            <div className="notification-dropdown">
              <div className="dropdown-header">
                <h3>Notifications</h3>
                <button onClick={() => setNotifications([])}>Clear all</button>
              </div>
              <div className="notification-list">
                {notifications.length === 0 ? (
                  <div className="empty-notifications">
                    No notifications
                  </div>
                ) : (
                  notifications.map(notif => (
                    <div
                      key={notif.id}
                      className={`notification-item ${notif.unread ? 'unread' : ''}`}
                      onClick={() => markAsRead(notif.id)}
                    >
                      <div className="notification-content">
                        <div className="notification-title">{notif.title}</div>
                        <div className="notification-time">{notif.time}</div>
                      </div>
                      {notif.unread && <span className="unread-dot"></span>}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Menu */}
        <div className="profile-container" ref={profileRef}>
          <button
            className="profile-btn"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            title="Profile"
          >
            <img
              src="https://via.placeholder.com/32"
              alt="Profile"
              className="profile-avatar"
            />
          </button>
          {showProfileMenu && (
            <div className="profile-dropdown">
              <div className="profile-header">
                <img
                  src="https://via.placeholder.com/48"
                  alt="Profile"
                  className="profile-avatar-large"
                />
                <div className="profile-info">
                  <div className="profile-name">John Doe</div>
                  <div className="profile-email">john@example.com</div>
                </div>
              </div>
              <div className="profile-menu">
                <button className="profile-menu-item">
                  👤 My Profile
                </button>
                <button className="profile-menu-item">
                  ⚙️ Settings
                </button>
                <button className="profile-menu-item">
                  💰 Wallet
                </button>
                <button className="profile-menu-item">
                  📊 Dashboard
                </button>
                <hr />
                <button className="profile-menu-item">
                  🌙 Dark Mode
                </button>
                <button className="profile-menu-item">
                  ❓ Help & Support
                </button>
                <hr />
                <button className="profile-menu-item logout">
                  🚪 Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

