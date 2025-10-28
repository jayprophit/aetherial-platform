/**
 * AETHERIAL Platform - Activity Feed
 * 
 * Features abstracted from BuddyBoss:
 * - Global activity stream
 * - Personal activity
 * - Group activity
 * - Post types (text, images, videos, links, polls)
 * - Interactions (like, comment, share, react)
 * - Post scheduling
 * - Privacy controls
 * - Mentions and hashtags
 * - Filtering
 */

import React, { useState, useEffect } from 'react';
import './ActivityFeed.css';

interface Post {
  id: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    verified: boolean;
  };
  content: string;
  type: 'text' | 'image' | 'video' | 'link' | 'poll';
  media?: {
    type: 'image' | 'video';
    url: string;
    thumbnail?: string;
  }[];
  poll?: {
    question: string;
    options: { id: string; text: string; votes: number }[];
    totalVotes: number;
    userVoted?: string;
  };
  link?: {
    url: string;
    title: string;
    description: string;
    image?: string;
  };
  privacy: 'public' | 'friends' | 'private';
  timestamp: Date;
  likes: number;
  comments: number;
  shares: number;
  reactions: { type: string; count: number }[];
  userLiked: boolean;
  userReaction?: string;
  mentions: string[];
  hashtags: string[];
  group?: {
    id: string;
    name: string;
  };
}

interface Comment {
  id: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: Date;
  likes: number;
  userLiked: boolean;
}

export default function ActivityFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filter, setFilter] = useState<'all' | 'following' | 'groups' | 'mentions'>('all');
  const [postType, setPostType] = useState<'all' | 'text' | 'image' | 'video' | 'poll'>('all');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostPrivacy, setNewPostPrivacy] = useState<'public' | 'friends' | 'private'>('public');
  const [showComments, setShowComments] = useState<Set<string>>(new Set());
  const [comments, setComments] = useState<Record<string, Comment[]>>({});

  // Load posts (in production, fetch from API)
  useEffect(() => {
    const samplePosts: Post[] = [
      {
        id: '1',
        author: {
          id: 'user1',
          name: 'John Doe',
          avatar: 'https://via.placeholder.com/48',
          verified: true,
        },
        content: 'Just launched my new project on AETHERIAL! Check it out! #blockchain #web3 @JaneDoe',
        type: 'text',
        privacy: 'public',
        timestamp: new Date(Date.now() - 3600000),
        likes: 42,
        comments: 8,
        shares: 5,
        reactions: [
          { type: '👍', count: 25 },
          { type: '❤️', count: 12 },
          { type: '🚀', count: 5 },
        ],
        userLiked: false,
        mentions: ['JaneDoe'],
        hashtags: ['blockchain', 'web3'],
      },
      {
        id: '2',
        author: {
          id: 'user2',
          name: 'Jane Smith',
          avatar: 'https://via.placeholder.com/48',
          verified: false,
        },
        content: 'What do you think about the future of AI?',
        type: 'poll',
        poll: {
          question: 'What do you think about the future of AI?',
          options: [
            { id: 'opt1', text: 'Very promising', votes: 45 },
            { id: 'opt2', text: 'Somewhat promising', votes: 23 },
            { id: 'opt3', text: 'Neutral', votes: 12 },
            { id: 'opt4', text: 'Concerning', votes: 8 },
          ],
          totalVotes: 88,
        },
        privacy: 'public',
        timestamp: new Date(Date.now() - 7200000),
        likes: 18,
        comments: 15,
        shares: 3,
        reactions: [{ type: '👍', count: 18 }],
        userLiked: false,
        mentions: [],
        hashtags: [],
        group: {
          id: 'group1',
          name: 'AI Enthusiasts',
        },
      },
    ];

    setPosts(samplePosts);
  }, []);

  /**
   * Create new post
   */
  const handleCreatePost = () => {
    if (!newPostContent.trim()) return;

    const newPost: Post = {
      id: Date.now().toString(),
      author: {
        id: 'currentUser',
        name: 'Current User',
        avatar: 'https://via.placeholder.com/48',
        verified: false,
      },
      content: newPostContent,
      type: 'text',
      privacy: newPostPrivacy,
      timestamp: new Date(),
      likes: 0,
      comments: 0,
      shares: 0,
      reactions: [],
      userLiked: false,
      mentions: extractMentions(newPostContent),
      hashtags: extractHashtags(newPostContent),
    };

    setPosts([newPost, ...posts]);
    setNewPostContent('');
  };

  /**
   * Extract mentions from content
   */
  const extractMentions = (content: string): string[] => {
    const mentionRegex = /@(\w+)/g;
    const matches = content.match(mentionRegex);
    return matches ? matches.map(m => m.substring(1)) : [];
  };

  /**
   * Extract hashtags from content
   */
  const extractHashtags = (content: string): string[] => {
    const hashtagRegex = /#(\w+)/g;
    const matches = content.match(hashtagRegex);
    return matches ? matches.map(h => h.substring(1)) : [];
  };

  /**
   * Toggle like on post
   */
  const handleLike = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.userLiked ? post.likes - 1 : post.likes + 1,
          userLiked: !post.userLiked,
        };
      }
      return post;
    }));
  };

  /**
   * Toggle comments visibility
   */
  const toggleComments = (postId: string) => {
    const newShowComments = new Set(showComments);
    if (newShowComments.has(postId)) {
      newShowComments.delete(postId);
    } else {
      newShowComments.add(postId);
      // Load comments if not already loaded
      if (!comments[postId]) {
        loadComments(postId);
      }
    }
    setShowComments(newShowComments);
  };

  /**
   * Load comments for a post
   */
  const loadComments = (postId: string) => {
    // In production, fetch from API
    const sampleComments: Comment[] = [
      {
        id: 'c1',
        author: {
          id: 'user3',
          name: 'Bob Johnson',
          avatar: 'https://via.placeholder.com/32',
        },
        content: 'Great post! Looking forward to seeing more.',
        timestamp: new Date(Date.now() - 1800000),
        likes: 3,
        userLiked: false,
      },
    ];

    setComments(prev => ({
      ...prev,
      [postId]: sampleComments,
    }));
  };

  /**
   * Render post based on type
   */
  const renderPost = (post: Post) => {
    return (
      <div key={post.id} className="post-card">
        {/* Post Header */}
        <div className="post-header">
          <img src={post.author.avatar} alt={post.author.name} className="author-avatar" />
          <div className="author-info">
            <div className="author-name">
              {post.author.name}
              {post.author.verified && <span className="verified-badge">✓</span>}
            </div>
            <div className="post-meta">
              {post.group && <span className="group-name">in {post.group.name}</span>}
              <span className="post-time">{formatTime(post.timestamp)}</span>
              <span className="post-privacy">🔒 {post.privacy}</span>
            </div>
          </div>
          <button className="post-menu-btn">⋯</button>
        </div>

        {/* Post Content */}
        <div className="post-content">
          <p>{highlightMentionsAndHashtags(post.content)}</p>

          {/* Poll */}
          {post.type === 'poll' && post.poll && (
            <div className="poll-container">
              <div className="poll-question">{post.poll.question}</div>
              <div className="poll-options">
                {post.poll.options.map(option => {
                  const percentage = (option.votes / post.poll!.totalVotes) * 100;
                  return (
                    <button key={option.id} className="poll-option">
                      <div className="poll-option-bar" style={{ width: `${percentage}%` }} />
                      <span className="poll-option-text">{option.text}</span>
                      <span className="poll-option-votes">{percentage.toFixed(0)}%</span>
                    </button>
                  );
                })}
              </div>
              <div className="poll-footer">{post.poll.totalVotes} votes</div>
            </div>
          )}

          {/* Media */}
          {post.media && post.media.length > 0 && (
            <div className="post-media">
              {post.media.map((item, index) => (
                <div key={index} className="media-item">
                  {item.type === 'image' && <img src={item.url} alt="Post media" />}
                  {item.type === 'video' && (
                    <video controls poster={item.thumbnail}>
                      <source src={item.url} />
                    </video>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Link Preview */}
          {post.link && (
            <a href={post.link.url} target="_blank" rel="noopener noreferrer" className="link-preview">
              {post.link.image && <img src={post.link.image} alt={post.link.title} />}
              <div className="link-info">
                <div className="link-title">{post.link.title}</div>
                <div className="link-description">{post.link.description}</div>
                <div className="link-url">{new URL(post.link.url).hostname}</div>
              </div>
            </a>
          )}
        </div>

        {/* Post Actions */}
        <div className="post-actions">
          <button
            className={`action-btn ${post.userLiked ? 'active' : ''}`}
            onClick={() => handleLike(post.id)}
          >
            👍 {post.likes}
          </button>
          <button className="action-btn" onClick={() => toggleComments(post.id)}>
            💬 {post.comments}
          </button>
          <button className="action-btn">
            🔄 {post.shares}
          </button>
          <button className="action-btn">
            ➤ Share
          </button>
        </div>

        {/* Comments Section */}
        {showComments.has(post.id) && (
          <div className="comments-section">
            {comments[post.id]?.map(comment => (
              <div key={comment.id} className="comment">
                <img src={comment.author.avatar} alt={comment.author.name} className="comment-avatar" />
                <div className="comment-content">
                  <div className="comment-author">{comment.author.name}</div>
                  <div className="comment-text">{comment.content}</div>
                  <div className="comment-actions">
                    <button>Like ({comment.likes})</button>
                    <button>Reply</button>
                    <span className="comment-time">{formatTime(comment.timestamp)}</span>
                  </div>
                </div>
              </div>
            ))}
            <div className="comment-input">
              <input type="text" placeholder="Write a comment..." />
              <button>Post</button>
            </div>
          </div>
        )}
      </div>
    );
  };

  /**
   * Format timestamp
   */
  const formatTime = (date: Date): string => {
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

  /**
   * Highlight mentions and hashtags
   */
  const highlightMentionsAndHashtags = (content: string) => {
    return content.split(' ').map((word, index) => {
      if (word.startsWith('@')) {
        return <span key={index} className="mention">{word} </span>;
      }
      if (word.startsWith('#')) {
        return <span key={index} className="hashtag">{word} </span>;
      }
      return word + ' ';
    });
  };

  const filteredPosts = posts.filter(post => {
    if (postType !== 'all' && post.type !== postType) return false;
    return true;
  });

  return (
    <div className="activity-feed">
      {/* Create Post */}
      <div className="create-post-card">
        <textarea
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          placeholder="What's on your mind?"
          className="create-post-input"
        />
        <div className="create-post-actions">
          <div className="post-options">
            <button className="post-option-btn">📷 Photo</button>
            <button className="post-option-btn">🎥 Video</button>
            <button className="post-option-btn">📊 Poll</button>
            <button className="post-option-btn">📎 Link</button>
          </div>
          <div className="post-controls">
            <select
              value={newPostPrivacy}
              onChange={(e) => setNewPostPrivacy(e.target.value as any)}
              className="privacy-select"
            >
              <option value="public">🌐 Public</option>
              <option value="friends">👥 Friends</option>
              <option value="private">🔒 Private</option>
            </select>
            <button onClick={handleCreatePost} className="post-btn">
              Post
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="feed-filters">
        <div className="filter-group">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`filter-btn ${filter === 'following' ? 'active' : ''}`}
            onClick={() => setFilter('following')}
          >
            Following
          </button>
          <button
            className={`filter-btn ${filter === 'groups' ? 'active' : ''}`}
            onClick={() => setFilter('groups')}
          >
            Groups
          </button>
          <button
            className={`filter-btn ${filter === 'mentions' ? 'active' : ''}`}
            onClick={() => setFilter('mentions')}
          >
            Mentions
          </button>
        </div>
        <div className="filter-group">
          <select
            value={postType}
            onChange={(e) => setPostType(e.target.value as any)}
            className="type-select"
          >
            <option value="all">All Posts</option>
            <option value="text">Text</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
            <option value="poll">Polls</option>
          </select>
        </div>
      </div>

      {/* Posts */}
      <div className="posts-container">
        {filteredPosts.length === 0 ? (
          <div className="empty-feed">
            <div className="empty-icon">📭</div>
            <h3>No posts yet</h3>
            <p>Be the first to share something!</p>
          </div>
        ) : (
          filteredPosts.map(renderPost)
        )}
      </div>
    </div>
  );
}

