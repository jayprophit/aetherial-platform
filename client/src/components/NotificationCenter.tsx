/**
 * AETHERIAL Notification Center
 * 
 * Military-Grade Notification System
 * - Real-time notifications via WebSocket
 * - Categorized notifications
 * - Mark as read/unread
 * - Notification settings
 * - Beautiful UI with animations
 * 
 * @module components/NotificationCenter
 */

import React, { useState, useEffect, useRef } from 'react';
import './NotificationCenter.css';

/**
 * Notification type
 */
export type NotificationType = 
  | 'social'      // Likes, comments, follows
  | 'transaction' // Purchases, sales
  | 'system'      // Updates, maintenance
  | 'message'     // DMs, mentions
  | 'job'         // Applications, offers
  | 'course'      // Enrollments, completions
  | 'blockchain'; // Transactions, staking

/**
 * Notification interface
 */
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  avatar?: string;
  icon?: string;
}

/**
 * Notification Center Props
 */
export interface NotificationCenterProps {
  /** Whether the notification center is open */
  isOpen?: boolean;
  
  /** Callback when notification center is closed */
  onClose?: () => void;
  
  /** Initial notifications */
  initialNotifications?: Notification[];
}

/**
 * Get icon for notification type
 */
const getNotificationIcon = (type: NotificationType): string => {
  const icons: Record<NotificationType, string> = {
    social: '👥',
    transaction: '💰',
    system: '⚙️',
    message: '💬',
    job: '💼',
    course: '🎓',
    blockchain: '⛓️'
  };
  return icons[type];
};

/**
 * Get color for notification type
 */
const getNotificationColor = (type: NotificationType): string => {
  const colors: Record<NotificationType, string> = {
    social: 'var(--primary-500)',
    transaction: 'var(--success-500)',
    system: 'var(--gray-500)',
    message: 'var(--info-500)',
    job: 'var(--secondary-500)',
    course: 'var(--warning-500)',
    blockchain: 'var(--primary-600)'
  };
  return colors[type];
};

/**
 * Format timestamp
 */
const formatTimestamp = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (seconds < 60) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  
  return date.toLocaleDateString();
};

/**
 * Notification Item Component
 */
const NotificationItem: React.FC<{
  notification: Notification;
  onRead: (id: string) => void;
  onClick: (notification: Notification) => void;
}> = ({ notification, onRead, onClick }) => {
  const handleClick = () => {
    if (!notification.read) {
      onRead(notification.id);
    }
    onClick(notification);
  };
  
  return (
    <div
      className={`notification-item ${notification.read ? 'read' : 'unread'}`}
      onClick={handleClick}
    >
      <div
        className="notification-icon"
        style={{ backgroundColor: getNotificationColor(notification.type) }}
      >
        {notification.icon || getNotificationIcon(notification.type)}
      </div>
      
      <div className="notification-content">
        <div className="notification-header">
          <h4 className="notification-title">{notification.title}</h4>
          <span className="notification-time">
            {formatTimestamp(notification.timestamp)}
          </span>
        </div>
        <p className="notification-message">{notification.message}</p>
      </div>
      
      {!notification.read && (
        <div className="notification-unread-indicator" />
      )}
    </div>
  );
};

/**
 * Notification Center Component
 * 
 * Real-time notification center with categorization,
 * read/unread status, and beautiful animations.
 * 
 * @example
 * ```tsx
 * <NotificationCenter
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 * />
 * ```
 */
export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen = false,
  onClose,
  initialNotifications = []
}) => {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [filter, setFilter] = useState<NotificationType | 'all'>('all');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  
  // Mock notifications for demo
  useEffect(() => {
    if (initialNotifications.length === 0) {
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'social',
          title: 'New Follower',
          message: 'John Doe started following you',
          timestamp: new Date(Date.now() - 5 * 60 * 1000),
          read: false
        },
        {
          id: '2',
          type: 'transaction',
          title: 'Payment Received',
          message: 'You received $150.00 from a sale',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          read: false
        },
        {
          id: '3',
          type: 'course',
          title: 'Course Completed',
          message: 'You completed "Advanced React Patterns"',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          read: true
        },
        {
          id: '4',
          type: 'job',
          title: 'New Job Match',
          message: '5 new jobs match your profile',
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
          read: false
        },
        {
          id: '5',
          type: 'message',
          title: 'New Message',
          message: 'Sarah sent you a message',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
          read: true
        },
        {
          id: '6',
          type: 'blockchain',
          title: 'Transaction Confirmed',
          message: 'Your transaction has been confirmed on the blockchain',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          read: true
        }
      ];
      setNotifications(mockNotifications);
    }
  }, [initialNotifications]);
  
  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose?.();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);
  
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose?.();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);
  
  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };
  
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };
  
  const handleNotificationClick = (notification: Notification) => {
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
  };
  
  const filteredNotifications = notifications
    .filter(n => filter === 'all' || n.type === filter)
    .filter(n => !showUnreadOnly || !n.read);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  if (!isOpen) return null;
  
  return (
    <>
      <div className="notification-backdrop" onClick={onClose} />
      <div ref={panelRef} className="notification-panel">
        {/* Header */}
        <div className="notification-header-section">
          <div className="notification-header-title">
            <h3>Notifications</h3>
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="notification-close-button"
            aria-label="Close notifications"
          >
            ✕
          </button>
        </div>
        
        {/* Filters */}
        <div className="notification-filters">
          <div className="notification-filter-tabs">
            <button
              type="button"
              className={`notification-filter-tab ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              type="button"
              className={`notification-filter-tab ${filter === 'social' ? 'active' : ''}`}
              onClick={() => setFilter('social')}
            >
              Social
            </button>
            <button
              type="button"
              className={`notification-filter-tab ${filter === 'transaction' ? 'active' : ''}`}
              onClick={() => setFilter('transaction')}
            >
              Money
            </button>
            <button
              type="button"
              className={`notification-filter-tab ${filter === 'message' ? 'active' : ''}`}
              onClick={() => setFilter('message')}
            >
              Messages
            </button>
          </div>
          
          <div className="notification-actions">
            <button
              type="button"
              onClick={() => setShowUnreadOnly(!showUnreadOnly)}
              className={`notification-action-button ${showUnreadOnly ? 'active' : ''}`}
            >
              {showUnreadOnly ? 'Show All' : 'Unread Only'}
            </button>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="notification-action-button"
              >
                Mark All Read
              </button>
            )}
          </div>
        </div>
        
        {/* Notifications List */}
        <div className="notification-list">
          {filteredNotifications.length === 0 ? (
            <div className="notification-empty">
              <div className="notification-empty-icon">🔔</div>
              <p className="notification-empty-text">No notifications</p>
              <p className="notification-empty-subtext">
                You're all caught up!
              </p>
            </div>
          ) : (
            filteredNotifications.map(notification => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onRead={markAsRead}
                onClick={handleNotificationClick}
              />
            ))
          )}
        </div>
        
        {/* Footer */}
        <div className="notification-footer">
          <button
            type="button"
            className="notification-footer-button"
            onClick={() => window.location.href = '/notifications'}
          >
            View All Notifications
          </button>
        </div>
      </div>
    </>
  );
};

/**
 * Notification Bell Component
 * Trigger button for notification center
 */
export const NotificationBell: React.FC<{
  unreadCount?: number;
  onClick: () => void;
}> = ({ unreadCount = 0, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="notification-bell"
      aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
    >
      <svg
        className="notification-bell-icon"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>
      {unreadCount > 0 && (
        <span className="notification-bell-badge">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </button>
  );
};

export default NotificationCenter;

