/**
 * AETHERIAL Platform - Forums & Discussion Board
 * Complete community forums with threads, posts, categories, and moderation
 */

import React, { useState, useEffect } from 'react';
import { unifiedSystemHub } from '../../lib/integration/unified-system-hub';
import './ForumsDashboard.css';

interface Category {
  id: string;
  name: string;
  description: string;
  threads: number;
  posts: number;
  icon: string;
}

interface Thread {
  id: string;
  title: string;
  author: string;
  category: string;
  replies: number;
  views: number;
  lastActivity: string;
  isPinned: boolean;
  isLocked: boolean;
}

interface Post {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  likes: number;
  replies: number;
}

const CATEGORIES: Category[] = [
  {
    id: 'cat_1',
    name: 'General Discussion',
    description: 'Talk about anything related to AETHERIAL Platform',
    threads: 1234,
    posts: 5678,
    icon: '💬'
  },
  {
    id: 'cat_2',
    name: 'AI & Machine Learning',
    description: 'Discuss AI technologies, models, and applications',
    threads: 892,
    posts: 4521,
    icon: '🤖'
  },
  {
    id: 'cat_3',
    name: 'Blockchain & Crypto',
    description: 'Cryptocurrency, DeFi, and blockchain technology',
    threads: 567,
    posts: 2890,
    icon: '⛓️'
  },
  {
    id: 'cat_4',
    name: 'Quantum Computing',
    description: 'Quantum algorithms, hardware, and research',
    threads: 234,
    posts: 1123,
    icon: '⚛️'
  },
  {
    id: 'cat_5',
    name: 'Development',
    description: 'Programming, APIs, and technical discussions',
    threads: 789,
    posts: 3456,
    icon: '💻'
  },
  {
    id: 'cat_6',
    name: 'Support & Help',
    description: 'Get help with platform features and issues',
    threads: 456,
    posts: 1890,
    icon: '❓'
  }
];

export const ForumsDashboard: React.FC = () => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeTab, setActiveTab] = useState<'categories' | 'recent' | 'popular' | 'my-threads'>('categories');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    unifiedSystemHub.publishEvent({
      id: `forums-init-${Date.now()}`,
      timestamp: new Date(),
      source: 'forums-dashboard',
      type: 'forums.system.initialized',
      data: { categories: CATEGORIES.length },
      priority: 'high',
      propagate: true,
    });

    // Simulate loading data
    setTimeout(() => {
      setThreads([
        {
          id: 'thread_1',
          title: 'How to get started with Quantum Computing on AETHERIAL?',
          author: 'QuantumExplorer',
          category: 'Quantum Computing',
          replies: 23,
          views: 456,
          lastActivity: '2 hours ago',
          isPinned: true,
          isLocked: false
        },
        {
          id: 'thread_2',
          title: 'Best practices for training AI models',
          author: 'AIEnthusiast',
          category: 'AI & Machine Learning',
          replies: 45,
          views: 892,
          lastActivity: '5 hours ago',
          isPinned: false,
          isLocked: false
        },
        {
          id: 'thread_3',
          title: 'DeFi integration guide',
          author: 'CryptoGuru',
          category: 'Blockchain & Crypto',
          replies: 67,
          views: 1234,
          lastActivity: '1 day ago',
          isPinned: false,
          isLocked: false
        },
        {
          id: 'thread_4',
          title: 'Platform Update v2.0 - New Features!',
          author: 'Admin',
          category: 'General Discussion',
          replies: 89,
          views: 2345,
          lastActivity: '3 days ago',
          isPinned: true,
          isLocked: true
        }
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const handleCreateThread = () => {
    alert('Create Thread - Opens thread creation form');
  };

  if (loading) {
    return (
      <div className="forums-dashboard">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading forums...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="forums-dashboard">
      <header className="forums-header">
        <h1>💬 Community Forums</h1>
        <p>Join discussions, ask questions, and share knowledge</p>
      </header>

      <div className="forums-stats">
        <div className="stat-item">
          <div className="stat-value">{CATEGORIES.reduce((sum, cat) => sum + cat.threads, 0).toLocaleString()}</div>
          <div className="stat-label">Threads</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{CATEGORIES.reduce((sum, cat) => sum + cat.posts, 0).toLocaleString()}</div>
          <div className="stat-label">Posts</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{CATEGORIES.length}</div>
          <div className="stat-label">Categories</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">12.5K</div>
          <div className="stat-label">Members</div>
        </div>
      </div>

      <div className="forums-tabs">
        <button className={`tab ${activeTab === 'categories' ? 'active' : ''}`} onClick={() => setActiveTab('categories')}>Categories</button>
        <button className={`tab ${activeTab === 'recent' ? 'active' : ''}`} onClick={() => setActiveTab('recent')}>Recent</button>
        <button className={`tab ${activeTab === 'popular' ? 'active' : ''}`} onClick={() => setActiveTab('popular')}>Popular</button>
        <button className={`tab ${activeTab === 'my-threads' ? 'active' : ''}`} onClick={() => setActiveTab('my-threads')}>My Threads</button>
      </div>

      <div className="forums-content">
        {activeTab === 'categories' && (
          <div className="categories-section">
            <div className="section-header">
              <h2>Forum Categories</h2>
              <button className="btn btn-primary" onClick={handleCreateThread}>+ New Thread</button>
            </div>
            <div className="categories-grid">
              {CATEGORIES.map(category => (
                <div key={category.id} className="category-card">
                  <div className="category-icon">{category.icon}</div>
                  <div className="category-info">
                    <h3>{category.name}</h3>
                    <p>{category.description}</p>
                    <div className="category-stats">
                      <span>{category.threads.toLocaleString()} threads</span>
                      <span>•</span>
                      <span>{category.posts.toLocaleString()} posts</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(activeTab === 'recent' || activeTab === 'popular' || activeTab === 'my-threads') && (
          <div className="threads-section">
            <div className="section-header">
              <h2>
                {activeTab === 'recent' && 'Recent Threads'}
                {activeTab === 'popular' && 'Popular Threads'}
                {activeTab === 'my-threads' && 'My Threads'}
              </h2>
              <button className="btn btn-primary" onClick={handleCreateThread}>+ New Thread</button>
            </div>
            <div className="threads-list">
              {threads.map(thread => (
                <div key={thread.id} className="thread-card">
                  <div className="thread-main">
                    <div className="thread-title-section">
                      {thread.isPinned && <span className="badge pinned">📌 Pinned</span>}
                      {thread.isLocked && <span className="badge locked">🔒 Locked</span>}
                      <h3 className="thread-title">{thread.title}</h3>
                      <div className="thread-meta">
                        <span className="thread-author">by {thread.author}</span>
                        <span className="thread-category">in {thread.category}</span>
                      </div>
                    </div>
                    <div className="thread-stats">
                      <div className="stat">
                        <span className="stat-icon">💬</span>
                        <span>{thread.replies}</span>
                      </div>
                      <div className="stat">
                        <span className="stat-icon">👁️</span>
                        <span>{thread.views}</span>
                      </div>
                      <div className="thread-activity">
                        <span>Last activity: {thread.lastActivity}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="forums-sidebar">
        <div className="sidebar-card">
          <h3>Forum Rules</h3>
          <ul>
            <li>Be respectful and courteous</li>
            <li>No spam or self-promotion</li>
            <li>Stay on topic</li>
            <li>No hate speech or harassment</li>
            <li>Follow community guidelines</li>
          </ul>
        </div>

        <div className="sidebar-card">
          <h3>Top Contributors</h3>
          <div className="contributors-list">
            <div className="contributor">
              <span className="contributor-rank">🥇</span>
              <span className="contributor-name">QuantumExplorer</span>
              <span className="contributor-posts">1,234 posts</span>
            </div>
            <div className="contributor">
              <span className="contributor-rank">🥈</span>
              <span className="contributor-name">AIEnthusiast</span>
              <span className="contributor-posts">892 posts</span>
            </div>
            <div className="contributor">
              <span className="contributor-rank">🥉</span>
              <span className="contributor-name">CryptoGuru</span>
              <span className="contributor-posts">567 posts</span>
            </div>
          </div>
        </div>

        <div className="sidebar-card">
          <h3>Recent Activity</h3>
          <div className="activity-feed">
            <div className="activity-item">
              <strong>Alice</strong> replied to <em>"AI Training Tips"</em>
              <span className="activity-time">5 min ago</span>
            </div>
            <div className="activity-item">
              <strong>Bob</strong> created <em>"Blockchain Tutorial"</em>
              <span className="activity-time">15 min ago</span>
            </div>
            <div className="activity-item">
              <strong>Carol</strong> liked <em>"Quantum Basics"</em>
              <span className="activity-time">30 min ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumsDashboard;

