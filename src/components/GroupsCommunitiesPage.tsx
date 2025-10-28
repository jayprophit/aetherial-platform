import React, { useState, useEffect, useCallback, useMemo } from 'react';

// --- 1. Full TypeScript interfaces and types ---

/**
 * Defines the structure for a Group Feed Post.
 */
interface GroupFeedPost {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  timestamp: Date;
  likes: number;
  commentsCount: number;
  // Aetherial Enhancement: AI-powered content tag/summary
  aiTags: string[];
}

/**
 * Defines the structure for a Group Role.
 */
interface GroupRole {
  id: string;
  name: 'Admin' | 'Moderator' | 'Member' | 'Guest';
  permissions: string[]; // e.g., ['post', 'moderate', 'invite']
  // Aetherial Enhancement: DeFi-related permissions for treasury management
  defiPermissions: 'view_treasury' | 'propose_spend' | 'vote_spend';
}

/**
 * Defines the structure for a Group Member.
 */
interface GroupMember {
  id: string;
  name: string;
  avatarUrl: string;
  roleId: string;
  joinDate: Date;
  // Aetherial Enhancement: Blockchain Wallet Address
  walletAddress: string;
}

/**
 * Defines the structure for a Group.
 */
interface Group {
  id: string;
  name: string;
  description: string;
  isPublic: boolean;
  memberCount: number;
  feed: GroupFeedPost[];
  members: GroupMember[];
  roles: GroupRole[];
  // Aetherial Enhancement: Group's Smart Contract/DAO Address
  blockchainAddress: string;
}

// --- 2. Sample data (in production would fetch from API) ---

const sampleRoles: GroupRole[] = [
  { id: 'r1', name: 'Admin', permissions: ['all'], defiPermissions: 'propose_spend' },
  { id: 'r2', name: 'Moderator', permissions: ['post', 'moderate', 'invite'], defiPermissions: 'vote_spend' },
  { id: 'r3', name: 'Member', permissions: ['post', 'view'], defiPermissions: 'view_treasury' },
];

const sampleMembers: GroupMember[] = [
  { id: 'm1', name: 'Alice', avatarUrl: '/avatars/alice.png', roleId: 'r1', joinDate: new Date('2024-01-15'), walletAddress: '0xAbC...123' },
  { id: 'm2', name: 'Bob', avatarUrl: '/avatars/bob.png', roleId: 'r3', joinDate: new Date('2024-03-20'), walletAddress: '0xDeF...456' },
  { id: 'm3', name: 'Charlie', avatarUrl: '/avatars/charlie.png', roleId: 'r2', joinDate: new Date('2024-05-01'), walletAddress: '0xGhi...789' },
];

const sampleFeed: GroupFeedPost[] = [
  { id: 'p1', authorId: 'm1', authorName: 'Alice', content: 'Welcome everyone to the new Aetherial Dev Group!', timestamp: new Date('2024-06-01T10:00:00'), likes: 15, commentsCount: 3, aiTags: ['welcome', 'announcement', 'community'] },
  { id: 'p2', authorId: 'm2', authorName: 'Bob', content: 'Just submitted a new DeFi proposal for the group treasury. Check it out!', timestamp: new Date('2024-06-01T14:30:00'), likes: 8, commentsCount: 1, aiTags: ['defi', 'proposal', 'treasury'] },
];

const initialGroupState: Group = {
  id: 'g1',
  name: 'Aetherial Dev Community',
  description: 'The official group for developers building on the Aetherial Platform. Discuss blockchain, AI, and more!',
  isPublic: true,
  memberCount: sampleMembers.length,
  feed: sampleFeed,
  members: sampleMembers,
  roles: sampleRoles,
  blockchainAddress: 'DAO-AET-001',
};

// --- Helper Components (Simplified for brevity, assuming utility classes) ---

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className = '', ...props }) => (
  <button
    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${className}`}
    {...props}
  >
    {children}
  </button>
);

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white shadow-lg rounded-xl p-6 ${className}`}>
    {children}
  </div>
);

// --- Core Component Logic ---

/**
 * Main component for the Groups & Communities Page.
 * It manages the state of the current group and handles interactive features.
 */
const GroupsCommunitiesPage: React.FC = () => {
  // --- State management with useState/useEffect ---
  const [currentGroup, setCurrentGroup] = useState<Group | null>(initialGroupState);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [activeTab, setActiveTab] = useState<'feed' | 'members' | 'settings'>('feed');
  const [isModalOpen, setIsModalOpen] = useState(false); // For Create/Join Group modal

  // Simulate fetching group data on component mount
  useEffect(() => {
    // In a real application, this would be an API call:
    // fetchGroupData(groupId).then(data => setCurrentGroup(data));
    console.log('Group data simulated fetch complete.');
  }, []);

  // --- Interactive Features (Handlers) ---

  // Handler for joining a group
  const handleJoinGroup = useCallback(() => {
    if (currentGroup) {
      // Simulate API call to join group
      const newMember: GroupMember = {
        id: `m${currentGroup.members.length + 1}`,
        name: 'New User', // Placeholder for logged-in user
        avatarUrl: '/avatars/default.png',
        roleId: 'r3', // Default to Member role
        joinDate: new Date(),
        walletAddress: '0xNew...Wallet',
      };
      setCurrentGroup(prev => prev ? {
        ...prev,
        members: [...prev.members, newMember],
        memberCount: prev.memberCount + 1,
      } : null);
      console.log('Joined group successfully.');
    }
  }, [currentGroup]);

  // Handler for submitting a new feed post
  const handlePostSubmit = useCallback(() => {
    if (!newPostContent.trim() || !currentGroup) return;

    // Aetherial Enhancement: Simulate AI-powered content analysis before posting
    const aiTags = newPostContent.toLowerCase().includes('defi') ? ['defi', 'finance'] : ['general'];
    const newPost: GroupFeedPost = {
      id: `p${currentGroup.feed.length + 1}`,
      authorId: 'm1', // Assuming current user is Alice for sample
      authorName: 'Alice',
      content: newPostContent,
      timestamp: new Date(),
      likes: 0,
      commentsCount: 0,
      aiTags: aiTags,
    };

    // Simulate API call to create post
    setCurrentGroup(prev => prev ? {
      ...prev,
      feed: [newPost, ...prev.feed], // Add to the top
    } : null);

    setNewPostContent('');
    setIsCreatingPost(false);
    console.log('New post submitted.');
  }, [newPostContent, currentGroup]);

  // Handler for changing a member's role
  const handleChangeRole = useCallback((memberId: string, newRoleId: string) => {
    if (!currentGroup) return;

    // Simulate API call to update role
    setCurrentGroup(prev => prev ? {
      ...prev,
      members: prev.members.map(m =>
        m.id === memberId ? { ...m, roleId: newRoleId } : m
      ),
    } : null);
    console.log(`Member ${memberId} role updated to ${newRoleId}.`);
  }, [currentGroup]);

  // Helper to get role name from ID
  const getRoleName = useCallback((roleId: string) => {
    return currentGroup?.roles.find(r => r.id === roleId)?.name || 'Unknown';
  }, [currentGroup]);

  // --- Render Functions (Sections) ---

  const renderGroupHeader = useMemo(() => {
    if (!currentGroup) return null;
    return (
      <Card className="mb-8 p-8 border-t-4 border-indigo-500">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">{currentGroup.name}</h1>
            <p className="text-gray-600 mt-2">{currentGroup.description}</p>
            <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
              <span>👥 {currentGroup.memberCount} Members</span>
              <span>🔒 {currentGroup.isPublic ? 'Public Group' : 'Private Group'}</span>
              {/* Aetherial Enhancement: Display Blockchain Address */}
              <span className="font-mono text-xs bg-gray-100 p-1 rounded">
                DAO: {currentGroup.blockchainAddress}
              </span>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button className="bg-indigo-600 text-white hover:bg-indigo-700" onClick={handleJoinGroup}>
              Join Group
            </Button>
            <Button className="bg-gray-200 text-gray-800 hover:bg-gray-300" onClick={() => setIsModalOpen(true)}>
              Create/Find Group
            </Button>
          </div>
        </div>
      </Card>
    );
  }, [currentGroup, handleJoinGroup]);

  const renderFeed = useMemo(() => {
    if (!currentGroup) return null;
    return (
      <div className="space-y-6">
        {/* Post Creation Form */}
        <Card>
          <h3 className="text-xl font-semibold mb-3">Share an Update</h3>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 resize-none"
            rows={isCreatingPost ? 4 : 2}
            placeholder="What's on your mind?..."
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            onFocus={() => setIsCreatingPost(true)}
          />
          {isCreatingPost && (
            <div className="mt-3 flex justify-end space-x-2">
              <Button className="bg-red-500 text-white hover:bg-red-600" onClick={() => { setNewPostContent(''); setIsCreatingPost(false); }}>
                Cancel
              </Button>
              <Button className="bg-green-500 text-white hover:bg-green-600 disabled:opacity-50" onClick={handlePostSubmit} disabled={!newPostContent.trim()}>
                Post
              </Button>
            </div>
          )}
        </Card>

        {/* Group Feed */}
        <h2 className="text-2xl font-bold pt-4">Group Feed</h2>
        {currentGroup.feed.length > 0 ? (
          currentGroup.feed.map(post => (
            <Card key={post.id} className="border-l-4 border-blue-500">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-lg">{post.authorName}</p>
                  <p className="text-sm text-gray-500">
                    {post.timestamp.toLocaleString()}
                  </p>
                </div>
                {/* Aetherial Enhancement: AI Tags */}
                <div className="text-xs text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full">
                  AI Tags: {post.aiTags.join(', ')}
                </div>
              </div>
              <p className="mt-4 text-gray-800">{post.content}</p>
              <div className="mt-4 flex space-x-4 text-sm text-gray-500">
                <Button className="text-blue-500 hover:text-blue-700 p-0 bg-transparent">
                  👍 {post.likes} Likes
                </Button>
                <Button className="text-blue-500 hover:text-blue-700 p-0 bg-transparent">
                  💬 {post.commentsCount} Comments
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <p className="text-center text-gray-500 p-10">No posts yet. Be the first to share an update!</p>
        )}
      </div>
    );
  }, [currentGroup, isCreatingPost, newPostContent, handlePostSubmit]);

  const renderMembers = useMemo(() => {
    if (!currentGroup) return null;
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Group Members ({currentGroup.memberCount})</h2>
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                  {/* Aetherial Enhancement: Wallet Address */}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wallet Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentGroup.members.map(member => (
                  <tr key={member.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{member.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {/* Role Filter/Selector */}
                      <select
                        value={member.roleId}
                        onChange={(e) => handleChangeRole(member.id, e.target.value)}
                        className="border border-gray-300 rounded-md p-1"
                      >
                        {currentGroup.roles.map(role => (
                          <option key={role.id} value={role.id}>{role.name}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.joinDate.toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-indigo-600">
                      {member.walletAddress}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button className="text-red-600 hover:text-red-900 p-0 bg-transparent">
                        Kick
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    );
  }, [currentGroup, handleChangeRole]);

  const renderSettings = useMemo(() => {
    if (!currentGroup) return null;
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Group Settings</h2>
        <Card>
          <h3 className="text-xl font-semibold mb-4">General</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Group Name</label>
              <input type="text" defaultValue={currentGroup.name} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea defaultValue={currentGroup.description} rows={3} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 resize-none" />
            </div>
            <div className="flex items-center">
              <input id="public-group" type="checkbox" defaultChecked={currentGroup.isPublic} className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
              <label htmlFor="public-group" className="ml-2 block text-sm text-gray-900">
                Public Group (Anyone can join)
              </label>
            </div>
            <Button className="bg-indigo-600 text-white hover:bg-indigo-700">Save Changes</Button>
          </div>
        </Card>

        {/* Aetherial Enhancement: Roles and DeFi Permissions */}
        <Card>
          <h3 className="text-xl font-semibold mb-4">Roles & DeFi Permissions</h3>
          <div className="space-y-4">
            {currentGroup.roles.map(role => (
              <div key={role.id} className="border p-4 rounded-lg">
                <p className="font-bold">{role.name}</p>
                <div className="mt-2 text-sm">
                  <p className="font-medium">Core Permissions:</p>
                  <p className="text-gray-600">{role.permissions.join(', ')}</p>
                  <p className="font-medium mt-2">DeFi/DAO Permissions:</p>
                  <p className="text-green-600 font-mono">{role.defiPermissions}</p>
                </div>
              </div>
            ))}
          </div>
          <Button className="mt-4 bg-blue-500 text-white hover:bg-blue-600">Manage Roles</Button>
        </Card>
      </div>
    );
  }, [currentGroup]);

  // --- Responsive Design Considerations (using utility classes for layout) ---
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {renderGroupHeader}

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {['feed', 'members', 'settings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as 'feed' | 'members' | 'settings')}
                className={`
                  ${activeTab === tab
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                  whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors
                `}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area - Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Main Content Area */}
            {activeTab === 'feed' && renderFeed}
            {activeTab === 'members' && renderMembers}
            {activeTab === 'settings' && renderSettings}
          </div>

          <div className="lg:col-span-1 space-y-6">
            {/* Sidebar - Quick Info/Filters */}
            <Card>
              <h3 className="text-xl font-semibold mb-4">Group Filters</h3>
              <div className="space-y-3">
                <input type="text" placeholder="Filter Feed by AI Tag..." className="w-full p-2 border rounded-md" />
                <select className="w-full p-2 border rounded-md">
                  <option>All Members</option>
                  {currentGroup?.roles.map(r => <option key={r.id}>{r.name}</option>)}
                </select>
                {/* Aetherial Enhancement: DeFi Treasury Status */}
                <div className="pt-4 border-t mt-4">
                  <p className="font-bold text-sm text-green-700">DAO Treasury Status</p>
                  <p className="text-lg font-mono">125.45 AET</p>
                  <p className="text-xs text-gray-500">Managed by Smart Contract</p>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button className="w-full bg-indigo-500 text-white hover:bg-indigo-600">
                  + Create New Post
                </Button>
                <Button className="w-full bg-yellow-500 text-white hover:bg-yellow-600">
                  🚀 Propose DAO Spend
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
      {/* Simple Modal for Create/Join Group */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
          <Card className="w-11/12 md:w-1/2">
            <h3 className="text-2xl font-bold mb-4">Create or Join Group</h3>
            <p>This modal would contain forms for creating a new group or a search/filter interface to find existing groups.</p>
            <div className="mt-6 flex justify-end">
              <Button className="bg-gray-300 text-gray-800 hover:bg-gray-400" onClick={() => setIsModalOpen(false)}>Close</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

// --- 7. Export default at the end ---
export default GroupsCommunitiesPage;
