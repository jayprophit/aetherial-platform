import React, { useState } from 'react';
import './TopBar.css';

interface TopBarProps {
  onToggleLeftSidebar: () => void;
  onToggleAIPanel: () => void;
  onToggleMediaBrowser: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onToggleLeftSidebar,
  onToggleAIPanel,
  onToggleMediaBrowser,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState(12);

  const quickActions = [
    { id: 'home', icon: '🏠', label: 'Home', action: () => {} },
    { id: 'search', icon: '🔍', label: 'Search', action: () => {} },
    { id: 'notifications', icon: '🔔', label: 'Notifications', badge: notifications, action: () => {} },
    { id: 'messages', icon: '💬', label: 'Messages', badge: 5, action: () => {} },
    { id: 'wallet', icon: '👛', label: 'Wallet', action: () => {} },
    { id: 'cart', icon: '🛒', label: 'Cart', badge: 3, action: () => {} },
    { id: 'profile', icon: '👤', label: 'Profile', action: () => {} },
    { id: 'settings', icon: '⚙️', label: 'Settings', action: () => {} },
  ];

  return (
    <div className="top-bar">
      <div className="top-bar-left">
        <button className="menu-toggle" onClick={onToggleLeftSidebar}>
          ☰
        </button>
        
        <div className="logo">
          <span className="logo-icon">⚡</span>
          <span className="logo-text">AETHERIAL</span>
        </div>
      </div>

      <div className="top-bar-center">
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search anything..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="voice-search">🎤</button>
        </div>
      </div>

      <div className="top-bar-right">
        <div className="quick-actions">
          {quickActions.map(action => (
            <button
              key={action.id}
              className="quick-action"
              onClick={action.action}
              title={action.label}
            >
              <span className="action-icon">{action.icon}</span>
              {action.badge && action.badge > 0 && (
                <span className="badge">{action.badge}</span>
              )}
            </button>
          ))}
        </div>

        <div className="panel-toggles">
          <button
            className="panel-toggle"
            onClick={onToggleAIPanel}
            title="Toggle AI Panel"
          >
            🤖
          </button>
          <button
            className="panel-toggle"
            onClick={onToggleMediaBrowser}
            title="Toggle Media Browser"
          >
            📁
          </button>
        </div>

        <div className="user-menu">
          <div className="user-avatar">
            <img src="/api/placeholder/40/40" alt="User" />
            <span className="online-indicator"></span>
          </div>
          <div className="user-info">
            <span className="user-name">John Doe</span>
            <span className="user-balance">💰 1,234.56 AETH</span>
          </div>
        </div>
      </div>
    </div>
  );
};

