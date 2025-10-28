import React, { useState } from 'react';
import './CommunityGroups.css';

interface Group {
  id: string;
  name: string;
  icon: string;
  description: string;
  members: number;
  category: string;
  privacy: 'public' | 'private';
  joined: boolean;
}

const CommunityGroups: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'discover' | 'my-groups' | 'create'>('discover');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    'All',
    'AI & Technology',
    'Art & Design',
    'Blockchain',
    'Business',
    'Education',
    'Gaming',
    'Health & Fitness',
    'Music',
    'Science'
  ];

  const groups: Group[] = [
    {
      id: '1',
      name: 'AI Enthusiasts',
      icon: '🤖',
      description: 'A community for AI researchers, developers, and enthusiasts to share knowledge and collaborate on projects.',
      members: 12543,
      category: 'AI & Technology',
      privacy: 'public',
      joined: true
    },
    {
      id: '2',
      name: 'Digital Artists',
      icon: '🎨',
      description: 'Connect with fellow digital artists, share your work, get feedback, and learn new techniques.',
      members: 8765,
      category: 'Art & Design',
      privacy: 'public',
      joined: true
    },
    {
      id: '3',
      name: 'Crypto Traders',
      icon: '💎',
      description: 'Discuss cryptocurrency trading strategies, market analysis, and DeFi opportunities.',
      members: 15234,
      category: 'Blockchain',
      privacy: 'public',
      joined: false
    },
    {
      id: '4',
      name: 'Startup Founders',
      icon: '🚀',
      description: 'Network with entrepreneurs, share experiences, and get advice on building successful startups.',
      members: 6789,
      category: 'Business',
      privacy: 'private',
      joined: false
    },
    {
      id: '5',
      name: 'Quantum Computing',
      icon: '⚛️',
      description: 'Explore the fascinating world of quantum computing, quantum algorithms, and quantum applications.',
      members: 3456,
      category: 'AI & Technology',
      privacy: 'public',
      joined: true
    },
    {
      id: '6',
      name: 'NFT Collectors',
      icon: '🖼️',
      description: 'Discover, trade, and discuss NFT art, collectibles, and the latest trends in the NFT space.',
      members: 9876,
      category: 'Blockchain',
      privacy: 'public',
      joined: false
    }
  ];

  const filteredGroups = selectedCategory === 'all' 
    ? groups 
    : groups.filter(g => g.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="community-groups">
      <div className="groups-container">
        {/* Header */}
        <div className="groups-header">
          <div>
            <h1>Community Groups</h1>
            <p>Connect with like-minded people and grow together</p>
          </div>
          <button className="create-group-btn">➕ Create Group</button>
        </div>

        {/* Tabs */}
        <div className="groups-tabs">
          <button
            className={activeTab === 'discover' ? 'active' : ''}
            onClick={() => setActiveTab('discover')}
          >
            🔍 Discover
          </button>
          <button
            className={activeTab === 'my-groups' ? 'active' : ''}
            onClick={() => setActiveTab('my-groups')}
          >
            👥 My Groups
          </button>
          <button
            className={activeTab === 'create' ? 'active' : ''}
            onClick={() => setActiveTab('create')}
          >
            ➕ Create Group
          </button>
        </div>

        {/* Discover Tab */}
        {activeTab === 'discover' && (
          <div className="discover-content">
            {/* Search and Filter */}
            <div className="groups-controls">
              <div className="search-box">
                <input type="text" placeholder="Search groups..." />
                <button className="search-btn">🔍</button>
              </div>
              <div className="category-filter">
                <select 
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat.toLowerCase()}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Groups Grid */}
            <div className="groups-grid">
              {filteredGroups.map(group => (
                <div key={group.id} className="group-card">
                  <div className="group-card-header">
                    <div className="group-icon-large">{group.icon}</div>
                    {group.privacy === 'private' && (
                      <span className="privacy-badge">🔒 Private</span>
                    )}
                  </div>
                  <div className="group-card-body">
                    <h3>{group.name}</h3>
                    <p className="group-category">{group.category}</p>
                    <p className="group-description">{group.description}</p>
                    <div className="group-stats">
                      <span>👥 {group.members.toLocaleString()} members</span>
                    </div>
                  </div>
                  <div className="group-card-footer">
                    {group.joined ? (
                      <button className="group-btn joined">✓ Joined</button>
                    ) : (
                      <button className="group-btn">Join Group</button>
                    )}
                    <button className="group-btn-secondary">View</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* My Groups Tab */}
        {activeTab === 'my-groups' && (
          <div className="my-groups-content">
            <div className="my-groups-stats">
              <div className="stat-card-group">
                <div className="stat-icon-group">👥</div>
                <div>
                  <div className="stat-value-group">3</div>
                  <div className="stat-label-group">Groups Joined</div>
                </div>
              </div>
              <div className="stat-card-group">
                <div className="stat-icon-group">📝</div>
                <div>
                  <div className="stat-value-group">45</div>
                  <div className="stat-label-group">Posts Made</div>
                </div>
              </div>
              <div className="stat-card-group">
                <div className="stat-icon-group">💬</div>
                <div>
                  <div className="stat-value-group">123</div>
                  <div className="stat-label-group">Comments</div>
                </div>
              </div>
            </div>

            <div className="groups-list">
              {groups.filter(g => g.joined).map(group => (
                <div key={group.id} className="group-list-item">
                  <div className="group-list-icon">{group.icon}</div>
                  <div className="group-list-info">
                    <h4>{group.name}</h4>
                    <p>{group.members.toLocaleString()} members • {group.category}</p>
                  </div>
                  <div className="group-list-actions">
                    <button className="action-btn-group">View</button>
                    <button className="action-btn-group">Leave</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Create Group Tab */}
        {activeTab === 'create' && (
          <div className="create-group-content">
            <div className="create-group-form">
              <h2>Create a New Group</h2>
              
              <div className="form-group">
                <label>Group Icon</label>
                <div className="icon-selector">
                  <div className="icon-option selected">🤖</div>
                  <div className="icon-option">🎨</div>
                  <div className="icon-option">💎</div>
                  <div className="icon-option">🚀</div>
                  <div className="icon-option">⚛️</div>
                  <div className="icon-option">🖼️</div>
                  <div className="icon-option">🎮</div>
                  <div className="icon-option">🎵</div>
                  <div className="icon-option">📚</div>
                  <div className="icon-option">💪</div>
                </div>
              </div>

              <div className="form-group">
                <label>Group Name *</label>
                <input type="text" placeholder="Enter group name" />
              </div>

              <div className="form-group">
                <label>Category *</label>
                <select>
                  <option>Select a category</option>
                  {categories.slice(1).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea 
                  rows={4} 
                  placeholder="Describe your group and what it's about..."
                />
              </div>

              <div className="form-group">
                <label>Privacy</label>
                <div className="privacy-options">
                  <label className="privacy-option">
                    <input type="radio" name="privacy" value="public" defaultChecked />
                    <div>
                      <strong>🌐 Public</strong>
                      <p>Anyone can see and join this group</p>
                    </div>
                  </label>
                  <label className="privacy-option">
                    <input type="radio" name="privacy" value="private" />
                    <div>
                      <strong>🔒 Private</strong>
                      <p>Members must be approved to join</p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label>Group Rules (Optional)</label>
                <textarea 
                  rows={3} 
                  placeholder="Set guidelines for your group members..."
                />
              </div>

              <div className="form-actions">
                <button className="cancel-btn">Cancel</button>
                <button className="submit-btn">Create Group</button>
              </div>
            </div>

            <div className="create-group-tips">
              <h3>Tips for Creating a Great Group</h3>
              <div className="tip-item">
                <span className="tip-icon">💡</span>
                <div>
                  <h4>Choose a Clear Name</h4>
                  <p>Make it easy for people to understand what your group is about</p>
                </div>
              </div>
              <div className="tip-item">
                <span className="tip-icon">📝</span>
                <div>
                  <h4>Write a Detailed Description</h4>
                  <p>Explain the purpose, goals, and what members can expect</p>
                </div>
              </div>
              <div className="tip-item">
                <span className="tip-icon">🎯</span>
                <div>
                  <h4>Set Clear Rules</h4>
                  <p>Establish guidelines to maintain a positive community</p>
                </div>
              </div>
              <div className="tip-item">
                <span className="tip-icon">🤝</span>
                <div>
                  <h4>Engage Regularly</h4>
                  <p>Post content and interact with members to keep the group active</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityGroups;

