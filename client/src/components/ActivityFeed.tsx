/**
 * AETHERIAL Activity Feed Component
 * 
 * Military-Grade Personalized Feed Algorithm
 * 
 * Features:
 * - Personalized content ranking
 * - Infinite scroll
 * - Real-time updates
 * - Multiple feed types (following, trending, recommended)
 * - Content filtering
 * 
 * @module components/ActivityFeed
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import './ActivityFeed.css';

interface Activity {
  id: number;
  type: 'post' | 'course' | 'job' | 'product' | 'achievement' | 'connection';
  user: {
    id: number;
    username: string;
    avatar: string;
    displayName: string;
  };
  content: string;
  media?: string[];
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  relevanceScore: number;
}

interface ActivityFeedProps {
  feedType?: 'following' | 'trending' | 'recommended' | 'all';
  userId?: number;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ 
  feedType = 'following',
  userId
}) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<string>('all');
  
  const observerTarget = useRef<HTMLDivElement>(null);
  const ws = useRef<WebSocket | null>(null);

  // Load initial activities
  useEffect(() => {
    loadActivities(1, true);
    setupWebSocket();
    
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [feedType, filter]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading, page]);

  /**
   * Setup WebSocket for real-time updates
   */
  const setupWebSocket = () => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/activity`;
    
    ws.current = new WebSocket(wsUrl);
    
    ws.current.onmessage = (event) => {
      const newActivity = JSON.parse(event.data);
      setActivities(prev => [newActivity, ...prev]);
    };
    
    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  };

  /**
   * Load activities from API
   */
  const loadActivities = async (pageNum: number, reset: boolean = false) => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        type: feedType,
        filter,
        page: pageNum.toString(),
        limit: '20'
      });
      
      if (userId) {
        params.append('userId', userId.toString());
      }
      
      const response = await fetch(`/api/activity?${params}`);
      const data = await response.json();
      
      if (reset) {
        setActivities(data.activities || []);
      } else {
        setActivities(prev => [...prev, ...(data.activities || [])]);
      }
      
      setHasMore(data.hasMore);
      setPage(pageNum);
    } catch (error) {
      console.error('Failed to load activities:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Load more activities (infinite scroll)
   */
  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      loadActivities(page + 1);
    }
  }, [loading, hasMore, page]);

  /**
   * Handle like action
   */
  const handleLike = async (activityId: number) => {
    try {
      const response = await fetch(`/api/activity/${activityId}/like`, {
        method: 'POST'
      });
      
      if (response.ok) {
        setActivities(prev => prev.map(activity => 
          activity.id === activityId
            ? { ...activity, isLiked: !activity.isLiked, likes: activity.isLiked ? activity.likes - 1 : activity.likes + 1 }
            : activity
        ));
      }
    } catch (error) {
      console.error('Failed to like activity:', error);
    }
  };

  /**
   * Handle share action
   */
  const handleShare = async (activityId: number) => {
    try {
      await navigator.share({
        title: 'Check this out on AETHERIAL',
        url: `${window.location.origin}/activity/${activityId}`
      });
      
      // Track share
      await fetch(`/api/activity/${activityId}/share`, {
        method: 'POST'
      });
    } catch (error) {
      console.error('Failed to share:', error);
    }
  };

  /**
   * Get activity icon
   */
  const getActivityIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      post: '📝',
      course: '📚',
      job: '💼',
      product: '🛍️',
      achievement: '🏆',
      connection: '🤝'
    };
    return icons[type] || '📄';
  };

  /**
   * Format timestamp
   */
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className="activity-feed">
      {/* Feed Header */}
      <div className="feed-header">
        <div className="feed-tabs">
          <button 
            className={feedType === 'following' ? 'active' : ''}
            onClick={() => window.location.href = '?feed=following'}
          >
            Following
          </button>
          <button 
            className={feedType === 'trending' ? 'active' : ''}
            onClick={() => window.location.href = '?feed=trending'}
          >
            Trending
          </button>
          <button 
            className={feedType === 'recommended' ? 'active' : ''}
            onClick={() => window.location.href = '?feed=recommended'}
          >
            Recommended
          </button>
        </div>

        <div className="feed-filters">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Activities</option>
            <option value="post">Posts</option>
            <option value="course">Courses</option>
            <option value="job">Jobs</option>
            <option value="product">Products</option>
            <option value="achievement">Achievements</option>
          </select>
        </div>
      </div>

      {/* Activity List */}
      <div className="activity-list">
        {activities.map((activity) => (
          <div key={activity.id} className="activity-card">
            <div className="activity-header">
              <img 
                src={activity.user.avatar || '/default-avatar.png'} 
                alt={activity.user.displayName}
                className="user-avatar"
              />
              <div className="user-info">
                <a href={`/profile/${activity.user.username}`} className="user-name">
                  {activity.user.displayName}
                </a>
                <div className="activity-meta">
                  <span className="activity-type">{getActivityIcon(activity.type)} {activity.type}</span>
                  <span className="activity-time">{formatTimestamp(activity.timestamp)}</span>
                </div>
              </div>
            </div>

            <div className="activity-content">
              <p>{activity.content}</p>
              {activity.media && activity.media.length > 0 && (
                <div className="activity-media">
                  {activity.media.map((url, index) => (
                    <img key={index} src={url} alt={`Media ${index + 1}`} />
                  ))}
                </div>
              )}
            </div>

            <div className="activity-actions">
              <button 
                className={`action-btn ${activity.isLiked ? 'liked' : ''}`}
                onClick={() => handleLike(activity.id)}
              >
                <span className="action-icon">{activity.isLiked ? '❤️' : '🤍'}</span>
                <span className="action-count">{activity.likes}</span>
              </button>

              <button className="action-btn">
                <span className="action-icon">💬</span>
                <span className="action-count">{activity.comments}</span>
              </button>

              <button 
                className="action-btn"
                onClick={() => handleShare(activity.id)}
              >
                <span className="action-icon">🔄</span>
                <span className="action-count">{activity.shares}</span>
              </button>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {loading && (
          <div className="feed-loading">
            <div className="spinner"></div>
            <p>Loading more activities...</p>
          </div>
        )}

        {/* Intersection observer target */}
        <div ref={observerTarget} className="load-more-trigger"></div>

        {/* End of feed */}
        {!hasMore && activities.length > 0 && (
          <div className="feed-end">
            <p>You've reached the end! 🎉</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && activities.length === 0 && (
          <div className="feed-empty">
            <p>No activities yet. Start following people to see their updates!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;

