import React, { useState } from 'react';
import './SocialFeed.css';

interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  content: string;
  media?: {
    type: 'image' | 'video';
    url: string;
  }[];
  likes: number;
  comments: number;
  shares: number;
  timestamp: string;
  liked: boolean;
}

interface Comment {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
  likes: number;
}

const SocialFeed: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'feed' | 'friends' | 'groups' | 'media'>('feed');
  const [postContent, setPostContent] = useState('');
  const [showComments, setShowComments] = useState<string | null>(null);

  const posts: Post[] = [
    {
      id: '1',
      author: {
        name: 'Sarah Johnson',
        avatar: '👩‍💼',
        role: 'AI Researcher'
      },
      content: 'Just completed my first quantum computing course on AETHERIAL! The future is here 🚀 #QuantumComputing #AI #Learning',
      media: [
        {
          type: 'image',
          url: '/placeholder-course.jpg'
        }
      ],
      likes: 234,
      comments: 45,
      shares: 12,
      timestamp: '2 hours ago',
      liked: false
    },
    {
      id: '2',
      author: {
        name: 'Michael Chen',
        avatar: '👨‍💻',
        role: 'Blockchain Developer'
      },
      content: 'Excited to announce that my new NFT collection is now live on the AETHERIAL marketplace! Check it out and let me know what you think. Limited edition of 100 pieces. 🎨✨',
      likes: 567,
      comments: 89,
      shares: 34,
      timestamp: '5 hours ago',
      liked: true
    },
    {
      id: '3',
      author: {
        name: 'Emily Rodriguez',
        avatar: '👩‍🎨',
        role: 'Digital Artist'
      },
      content: 'Working on a new 3D avatar design for the metaverse. Here\'s a sneak peek! What do you all think? 🎭',
      media: [
        {
          type: 'image',
          url: '/placeholder-avatar.jpg'
        }
      ],
      likes: 892,
      comments: 156,
      shares: 67,
      timestamp: '1 day ago',
      liked: false
    }
  ];

  const comments: Comment[] = [
    {
      id: '1',
      author: {
        name: 'John Doe',
        avatar: '👨'
      },
      content: 'This is amazing! Can\'t wait to try it out.',
      timestamp: '1 hour ago',
      likes: 12
    },
    {
      id: '2',
      author: {
        name: 'Jane Smith',
        avatar: '👩'
      },
      content: 'Great work! Keep it up 👏',
      timestamp: '30 minutes ago',
      likes: 8
    }
  ];

  const handleLike = (postId: string) => {
    console.log('Liked post:', postId);
  };

  const handleComment = (postId: string) => {
    setShowComments(showComments === postId ? null : postId);
  };

  const handleShare = (postId: string) => {
    console.log('Shared post:', postId);
  };

  const handlePost = () => {
    if (postContent.trim()) {
      console.log('New post:', postContent);
      setPostContent('');
    }
  };

  return (
    <div className="social-feed">
      <div className="social-container">
        {/* Header */}
        <div className="social-header">
          <h1>Social Feed</h1>
          <p>Connect with the AETHERIAL community</p>
        </div>

        {/* Tabs */}
        <div className="social-tabs">
          <button
            className={activeTab === 'feed' ? 'active' : ''}
            onClick={() => setActiveTab('feed')}
          >
            🏠 Feed
          </button>
          <button
            className={activeTab === 'friends' ? 'active' : ''}
            onClick={() => setActiveTab('friends')}
          >
            👥 Friends
          </button>
          <button
            className={activeTab === 'groups' ? 'active' : ''}
            onClick={() => setActiveTab('groups')}
          >
            👨‍👩‍👧‍👦 Groups
          </button>
          <button
            className={activeTab === 'media' ? 'active' : ''}
            onClick={() => setActiveTab('media')}
          >
            📸 Media
          </button>
        </div>

        <div className="social-content">
          {/* Sidebar */}
          <div className="social-sidebar">
            {/* Profile Card */}
            <div className="profile-card">
              <div className="profile-cover"></div>
              <div className="profile-avatar">👤</div>
              <h3>Your Name</h3>
              <p className="profile-role">Platform Member</p>
              <div className="profile-stats">
                <div className="stat">
                  <span className="stat-value">1,234</span>
                  <span className="stat-label">Friends</span>
                </div>
                <div className="stat">
                  <span className="stat-value">567</span>
                  <span className="stat-label">Posts</span>
                </div>
                <div className="stat">
                  <span className="stat-value">89</span>
                  <span className="stat-label">Groups</span>
                </div>
              </div>
              <button className="view-profile-btn">View Profile</button>
            </div>

            {/* Quick Links */}
            <div className="quick-links-card">
              <h3>Quick Links</h3>
              <a href="#" className="quick-link">
                <span>📝</span>
                <span>My Posts</span>
              </a>
              <a href="#" className="quick-link">
                <span>❤️</span>
                <span>Liked Posts</span>
              </a>
              <a href="#" className="quick-link">
                <span>🔖</span>
                <span>Saved Posts</span>
              </a>
              <a href="#" className="quick-link">
                <span>📸</span>
                <span>My Photos</span>
              </a>
              <a href="#" className="quick-link">
                <span>🎥</span>
                <span>My Videos</span>
              </a>
            </div>

            {/* Suggested Friends */}
            <div className="suggested-card">
              <h3>Suggested Friends</h3>
              <div className="suggested-list">
                <div className="suggested-item">
                  <span className="suggested-avatar">👨‍💼</span>
                  <div className="suggested-info">
                    <h4>Alex Thompson</h4>
                    <p>AI Engineer</p>
                  </div>
                  <button className="add-friend-btn">+</button>
                </div>
                <div className="suggested-item">
                  <span className="suggested-avatar">👩‍🔬</span>
                  <div className="suggested-info">
                    <h4>Lisa Wang</h4>
                    <p>Data Scientist</p>
                  </div>
                  <button className="add-friend-btn">+</button>
                </div>
                <div className="suggested-item">
                  <span className="suggested-avatar">👨‍🎨</span>
                  <div className="suggested-info">
                    <h4>David Kim</h4>
                    <p>3D Artist</p>
                  </div>
                  <button className="add-friend-btn">+</button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Feed */}
          <div className="feed-main">
            {/* Post Creator */}
            <div className="post-creator">
              <div className="post-creator-avatar">👤</div>
              <div className="post-creator-input">
                <textarea
                  placeholder="What's on your mind?"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  rows={3}
                />
                <div className="post-creator-actions">
                  <button className="media-btn">📸 Photo</button>
                  <button className="media-btn">🎥 Video</button>
                  <button className="media-btn">📄 Document</button>
                  <button className="media-btn">😊 Emoji</button>
                  <button className="post-btn" onClick={handlePost}>
                    Post
                  </button>
                </div>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="feed-filter">
              <button className="filter-btn active">All Posts</button>
              <button className="filter-btn">Friends</button>
              <button className="filter-btn">Groups</button>
              <button className="filter-btn">Following</button>
            </div>

            {/* Posts */}
            <div className="posts-list">
              {posts.map(post => (
                <div key={post.id} className="post-card">
                  <div className="post-header">
                    <div className="post-author">
                      <span className="post-avatar">{post.author.avatar}</span>
                      <div className="post-author-info">
                        <h4>{post.author.name}</h4>
                        <p>{post.author.role} • {post.timestamp}</p>
                      </div>
                    </div>
                    <button className="post-menu">⋮</button>
                  </div>

                  <div className="post-content">
                    <p>{post.content}</p>
                    {post.media && post.media.length > 0 && (
                      <div className="post-media">
                        {post.media.map((item, index) => (
                          <div key={index} className="media-item">
                            {item.type === 'image' ? (
                              <div className="media-placeholder">🖼️ Image</div>
                            ) : (
                              <div className="media-placeholder">🎥 Video</div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="post-stats">
                    <span>{post.likes} likes</span>
                    <span>{post.comments} comments</span>
                    <span>{post.shares} shares</span>
                  </div>

                  <div className="post-actions">
                    <button
                      className={`action-btn ${post.liked ? 'liked' : ''}`}
                      onClick={() => handleLike(post.id)}
                    >
                      {post.liked ? '❤️' : '🤍'} Like
                    </button>
                    <button
                      className="action-btn"
                      onClick={() => handleComment(post.id)}
                    >
                      💬 Comment
                    </button>
                    <button
                      className="action-btn"
                      onClick={() => handleShare(post.id)}
                    >
                      🔄 Share
                    </button>
                  </div>

                  {showComments === post.id && (
                    <div className="comments-section">
                      <div className="comments-list">
                        {comments.map(comment => (
                          <div key={comment.id} className="comment-item">
                            <span className="comment-avatar">{comment.author.avatar}</span>
                            <div className="comment-content">
                              <div className="comment-bubble">
                                <h5>{comment.author.name}</h5>
                                <p>{comment.content}</p>
                              </div>
                              <div className="comment-meta">
                                <span>{comment.timestamp}</span>
                                <button>Like</button>
                                <button>Reply</button>
                                <span>{comment.likes} likes</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="comment-input">
                        <span className="comment-avatar">👤</span>
                        <input type="text" placeholder="Write a comment..." />
                        <button className="send-comment-btn">Send</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="social-right-sidebar">
            {/* Trending Topics */}
            <div className="trending-card">
              <h3>Trending Topics</h3>
              <div className="trending-list">
                <div className="trending-item">
                  <span className="trending-rank">1</span>
                  <div className="trending-info">
                    <h4>#QuantumComputing</h4>
                    <p>1,234 posts</p>
                  </div>
                </div>
                <div className="trending-item">
                  <span className="trending-rank">2</span>
                  <div className="trending-info">
                    <h4>#NFTArt</h4>
                    <p>987 posts</p>
                  </div>
                </div>
                <div className="trending-item">
                  <span className="trending-rank">3</span>
                  <div className="trending-info">
                    <h4>#AILearning</h4>
                    <p>756 posts</p>
                  </div>
                </div>
                <div className="trending-item">
                  <span className="trending-rank">4</span>
                  <div className="trending-info">
                    <h4>#Metaverse</h4>
                    <p>654 posts</p>
                  </div>
                </div>
                <div className="trending-item">
                  <span className="trending-rank">5</span>
                  <div className="trending-info">
                    <h4>#DeFi</h4>
                    <p>543 posts</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Groups */}
            <div className="groups-card">
              <h3>Your Groups</h3>
              <div className="groups-list">
                <div className="group-item">
                  <span className="group-icon">🤖</span>
                  <div className="group-info">
                    <h4>AI Enthusiasts</h4>
                    <p>12.5K members</p>
                  </div>
                </div>
                <div className="group-item">
                  <span className="group-icon">🎨</span>
                  <div className="group-info">
                    <h4>Digital Artists</h4>
                    <p>8.7K members</p>
                  </div>
                </div>
                <div className="group-item">
                  <span className="group-icon">💎</span>
                  <div className="group-info">
                    <h4>Crypto Traders</h4>
                    <p>15.2K members</p>
                  </div>
                </div>
              </div>
              <button className="view-all-btn">View All Groups</button>
            </div>

            {/* Upcoming Events */}
            <div className="events-card">
              <h3>Upcoming Events</h3>
              <div className="events-list">
                <div className="event-item">
                  <div className="event-date">
                    <span className="event-day">28</span>
                    <span className="event-month">OCT</span>
                  </div>
                  <div className="event-info">
                    <h4>AI Summit 2025</h4>
                    <p>Virtual Event</p>
                  </div>
                </div>
                <div className="event-item">
                  <div className="event-date">
                    <span className="event-day">05</span>
                    <span className="event-month">NOV</span>
                  </div>
                  <div className="event-info">
                    <h4>NFT Art Exhibition</h4>
                    <p>Metaverse Gallery</p>
                  </div>
                </div>
              </div>
              <button className="view-all-btn">View All Events</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialFeed;

