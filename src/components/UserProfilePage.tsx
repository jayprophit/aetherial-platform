import React, { useState, useEffect, useCallback, useMemo } from 'react';

// --- TypeScript Interfaces and Types ---

export interface IActivity {
  id: string;
  type: 'post' | 'comment' | 'achievement' | 'transaction';
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
}

export interface IFriend {
  id: string;
  name: string;
  avatarUrl: string;
  isOnline: boolean;
}

export interface IAchievement {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  dateEarned: string;
}

export interface IVerifiableCredential {
  id: string;
  issuer: string;
  credentialType: 'Education' | 'Work Experience' | 'Certification' | 'Skill';
  details: string;
  issueDate: string;
  blockchainTxHash: string;
  isValid: boolean;
}

export interface IUserProfile {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  coverImageUrl: string;
  bio: string;
  reputationScore: number;
  walletAddress: string;
  activities: IActivity[];
  friends: IFriend[];
  achievements: IAchievement[];
  blockchainCV: IVerifiableCredential[];
}

// --- Sample Data (for development) ---

const sampleActivities: IActivity[] = [
  {
    id: 'act1',
    type: 'post',
    content: 'Just finished the "Advanced Solidity" course! Feeling ready to deploy my first complex smart contract.',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    likes: 45,
    comments: 12,
  },
  {
    id: 'act2',
    type: 'achievement',
    content: 'Earned the "DeFi Pioneer" badge for staking over 1000 $AETH.',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    likes: 88,
    comments: 25,
  },
  {
    id: 'act3',
    type: 'transaction',
    content: 'Transferred 50 $AETH to @CryptoGuru for a consulting session.',
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    likes: 15,
    comments: 3,
  },
];

const sampleFriends: IFriend[] = [
  { id: 'fr1', name: 'Alice Smith', avatarUrl: '/avatars/alice.jpg', isOnline: true },
  { id: 'fr2', name: 'Bob Johnson', avatarUrl: '/avatars/bob.jpg', isOnline: false },
  { id: 'fr3', name: 'Charlie Brown', avatarUrl: '/avatars/charlie.jpg', isOnline: true },
];

const sampleAchievements: IAchievement[] = [
  {
    id: 'ach1',
    name: 'Genesis Member',
    description: 'Joined the Aetherial platform in the first month.',
    iconUrl: '/icons/genesis.png',
    dateEarned: '2025-01-15T10:00:00Z',
  },
  {
    id: 'ach2',
    name: 'Smart Contract Deployer',
    description: 'Successfully deployed 5+ smart contracts on the testnet.',
    iconUrl: '/icons/deployer.png',
    dateEarned: '2025-03-20T14:30:00Z',
  },
];

const sampleBlockchainCV: IVerifiableCredential[] = [
  {
    id: 'vc1',
    issuer: 'Aetherial Academy',
    credentialType: 'Certification',
    details: 'Certified Blockchain Developer (Level 3)',
    issueDate: '2025-05-01T09:00:00Z',
    blockchainTxHash: '0xabc123def456...',
    isValid: true,
  },
  {
    id: 'vc2',
    issuer: 'TechCorp Solutions',
    credentialType: 'Work Experience',
    details: 'Senior Full Stack Engineer (2022-2025)',
    issueDate: '2025-07-15T17:00:00Z',
    blockchainTxHash: '0xghi789jkl012...',
    isValid: true,
  },
];

export const sampleUserProfile: IUserProfile = {
  id: 'user123',
  username: 'crypto_architect',
  displayName: 'Alex "The Architect" Johnson',
  avatarUrl: '/avatars/alex.jpg',
  coverImageUrl: '/covers/default.jpg',
  bio: 'Decentralization advocate, Solidity developer, and Aetherial platform enthusiast. Building the future, one smart contract at a time.',
  reputationScore: 925,
  walletAddress: '0x1A2b3C4d5E6f7A8b9C0d1E2f3A4b5C6d7E8f9A0b',
  activities: sampleActivities,
  friends: sampleFriends,
  achievements: sampleAchievements,
  blockchainCV: sampleBlockchainCV,
};

// --- Component Props Interface ---
interface UserProfilePageProps {
  userId: string;
  isCurrentUser: boolean;
}

// --- Helper Components (Refined Implementations) ---

const ProfileHeader: React.FC<{ profile: IUserProfile; isCurrentUser: boolean }> = ({ profile, isCurrentUser }) => (
  <header className="profile-header">
    <div className="cover-image-container" style={{ backgroundImage: `url(${profile.coverImageUrl})` }}>
      {isCurrentUser && (
        <button className="edit-cover-btn interactive-feature" title="Change Cover Photo">
          <i className="icon-camera"></i> Edit Cover
        </button>
      )}
    </div>
    <div className="avatar-info-bar">
      <div className="avatar-wrapper">
        <img src={profile.avatarUrl} alt={profile.displayName} className="profile-avatar" />
      </div>
      <div className="user-details">
        <h1>{profile.displayName}</h1>
        <p className="username">@{profile.username}</p>
        <p className="bio">{profile.bio}</p>
        <div className="meta-info">
          <span className="reputation-score" title="AI-driven Reputation Score">
            ⭐ {profile.reputationScore}
          </span>
          <span className="wallet-address" title="Connected Blockchain Wallet Address">
            <i className="icon-wallet"></i> {profile.walletAddress.substring(0, 6)}...{profile.walletAddress.slice(-4)}
          </span>
        </div>
      </div>
      <div className="actions">
        {isCurrentUser ? (
          <button className="edit-profile-btn interactive-feature">
            <i className="icon-edit"></i> Edit Profile
          </button>
        ) : (
          <>
            <button className="add-friend-btn interactive-feature">
              <i className="icon-user-plus"></i> Add Friend
            </button>
            <button className="send-message-btn interactive-feature">
              <i className="icon-message"></i> Message
            </button>
          </>
        )}
      </div>
    </div>
  </header>
);

const ActivityTimeline: React.FC<{ activities: IActivity[] }> = ({ activities }) => (
  <section className="activity-timeline">
    <h3>Recent Activity</h3>
    {activities.length === 0 && <p className="no-activity">No recent activity to display.</p>}
    <div className="timeline-feed">
      {activities.map((activity) => (
        <article key={activity.id} className={`activity-item type-${activity.type}`}>
          <div className="activity-icon">
            {activity.type === 'post' && <i className="icon-post"></i>}
            {activity.type === 'achievement' && <i className="icon-trophy"></i>}
            {activity.type === 'transaction' && <i className="icon-blockchain"></i>}
          </div>
          <div className="activity-content-wrapper">
            <p className="activity-content">{activity.content}</p>
            <div className="activity-meta">
              <small>
                {activity.type.toUpperCase()} | {new Date(activity.timestamp).toLocaleString()}
              </small>
              <div className="activity-actions">
                <button className="like-btn interactive-feature"><i className="icon-heart"></i> {activity.likes}</button>
                <button className="comment-btn interactive-feature"><i className="icon-comment"></i> {activity.comments}</button>
                {activity.type === 'transaction' && (
                  <button className="view-tx-btn interactive-feature" title="View Transaction Details">
                    <i className="icon-external-link"></i> View TX
                  </button>
                )}
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  </section>
);

const FriendsList: React.FC<{ friends: IFriend[] }> = ({ friends }) => (
  <section className="friends-list">
    <h3>Friends ({friends.length})</h3>
    <div className="friend-grid responsive-grid">
      {friends.map((friend) => (
        <div key={friend.id} className="friend-card interactive-feature">
          <img src={friend.avatarUrl} alt={friend.name} className="friend-avatar" />
          <div className="friend-info">
            <p className="friend-name">{friend.name}</p>
            <span className={`status-dot ${friend.isOnline ? 'online' : 'offline'}`} title={friend.isOnline ? 'Online' : 'Offline'}></span>
          </div>
          <button className="profile-link-btn">View Profile</button>
        </div>
      ))}
    </div>
  </section>
);

const AchievementsSection: React.FC<{ achievements: IAchievement[] }> = ({ achievements }) => (
  <section className="achievements-section">
    <h3>Achievements & Badges</h3>
    <div className="achievement-grid responsive-grid">
      {achievements.map((ach) => (
        <div key={ach.id} className="achievement-card interactive-feature" title={ach.description}>
          <img src={ach.iconUrl} alt={ach.name} className="achievement-icon" />
          <p className="achievement-name">{ach.name}</p>
          <small className="date-earned">Earned: {new Date(ach.dateEarned).toLocaleDateString()}</small>
        </div>
      ))}
    </div>
  </section>
);

const BlockchainCVSection: React.FC<{ cv: IVerifiableCredential[] }> = ({ cv }) => (
  <section className="blockchain-cv-section">
    <h3>Blockchain CV (Verifiable Credentials)</h3>
    <p className="aetherial-enhancement-note">
      <i className="icon-shield"></i> AETHERIAL Enhancement: All credentials are cryptographically verified on-chain.
    </p>
    <div className="credential-list">
      {cv.map((cred) => (
        <div key={cred.id} className="credential-item">
          <div className="credential-details">
            <h4>{cred.details}</h4>
            <p><strong>Type:</strong> {cred.credentialType}</p>
            <p><strong>Issuer:</strong> {cred.issuer}</p>
            <p><strong>Issue Date:</strong> {new Date(cred.issueDate).toLocaleDateString()}</p>
          </div>
          <div className="credential-verification">
            <span className={`verification-status ${cred.isValid ? 'valid' : 'invalid'}`}>
              <i className={cred.isValid ? 'icon-check' : 'icon-x'}></i> {cred.isValid ? 'VERIFIED' : 'INVALID'}
            </span>
            <button
              onClick={() => window.open(`https://explorer.aetherial.io/tx/${cred.blockchainTxHash}`, '_blank')}
              className="verify-btn interactive-feature"
            >
              <i className="icon-link"></i> View on Chain
            </button>
            <small className="tx-hash">TX: <code>{cred.blockchainTxHash.substring(0, 10)}...</code></small>
          </div>
        </div>
      ))}
    </div>
  </section>
);

const UserProfilePage: React.FC<UserProfilePageProps> = ({ userId, isCurrentUser }) => {
  const [profile, setProfile] = useState<IUserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'timeline' | 'friends' | 'achievements' | 'cv'>('timeline');

  const fetchUserProfile = useCallback(async (id: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    if (id === sampleUserProfile.id || id === 'user123') {
      setProfile(sampleUserProfile);
    } else {
      setProfile({ ...sampleUserProfile, id, username: 'guest_user', displayName: 'Guest Profile' });
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchUserProfile(userId);
  }, [userId, fetchUserProfile]);

  const [activityFilter, setActivityFilter] = useState<'all' | 'post' | 'transaction' | 'achievement'>('all');

  const filteredActivities = useMemo(() => {
    if (!profile) return [];
    if (activityFilter === 'all') return profile.activities;
    return profile.activities.filter(act => act.type === activityFilter);
  }, [profile, activityFilter]);

  if (isLoading) {
    return <div className="user-profile-page loading">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="user-profile-page error">Error: Profile data could not be loaded.</div>;
  }

  return (
    <div className="user-profile-page">
      <ProfileHeader profile={profile} isCurrentUser={isCurrentUser} />
      <div className="profile-body-wrapper">
        <main className="profile-main-content">
          <nav className="profile-tabs">
            <button
              className={`tab-btn interactive-feature ${activeTab === 'timeline' ? 'active' : ''}`}
              onClick={() => setActiveTab('timeline')}
            >
              Timeline
            </button>
            <button
              className={`tab-btn interactive-feature ${activeTab === 'friends' ? 'active' : ''}`}
              onClick={() => setActiveTab('friends')}
            >
              Friends
            </button>
            <button
              className={`tab-btn interactive-feature ${activeTab === 'achievements' ? 'active' : ''}`}
              onClick={() => setActiveTab('achievements')}
            >
              Achievements
            </button>
            <button
              className={`tab-btn interactive-feature ${activeTab === 'cv' ? 'active' : ''}`}
              onClick={() => setActiveTab('cv')}
            >
              Blockchain CV
            </button>
          </nav>
          <div className="tab-content">
            {activeTab === 'timeline' && (
              <>
                <div className="activity-filter-bar interactive-feature">
                  <label htmlFor="activity-filter">Filter Activity:</label>
                  <select
                    id="activity-filter"
                    value={activityFilter}
                    onChange={(e) => setActivityFilter(e.target.value as typeof activityFilter)}
                  >
                    <option value="all">All Activities</option>
                    <option value="post">Posts</option>
                    <option value="transaction">Transactions (DeFi)</option>
                    <option value="achievement">Achievements (Gamification)</option>
                  </select>
                </div>
                <ActivityTimeline activities={filteredActivities} />
              </>
            )}
            {activeTab === 'friends' && <FriendsList friends={profile.friends} />}
            {activeTab === 'achievements' && <AchievementsSection achievements={profile.achievements} />}
            {activeTab === 'cv' && <BlockchainCVSection cv={profile.blockchainCV} />}
          </div>
        </main>
        <aside className="profile-sidebar">
          <div className="sidebar-widget">
            <h4>About {profile.displayName.split(' ')[0]}</h4>
            <p>{profile.bio}</p>
          </div>
          <div className="sidebar-widget">
            <h4>Quick Stats</h4>
            <ul className="stats-list">
              <li><i className="icon-users"></i> Friends: <strong>{profile.friends.length}</strong></li>
              <li><i className="icon-certificate"></i> Credentials: <strong>{profile.blockchainCV.length}</strong></li>
              <li><i className="icon-activity"></i> Total Activities: <strong>{profile.activities.length}</strong></li>
            </ul>
          </div>
          <div className="sidebar-widget ai-suggestion-box">
            <h4><i className="icon-ai"></i> AI Profile Insights</h4>
            <p>Based on your activity, you might be interested in the "Advanced DeFi Staking" course.</p>
            <button className="ai-cta-btn interactive-feature">View Course</button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default UserProfilePage;
