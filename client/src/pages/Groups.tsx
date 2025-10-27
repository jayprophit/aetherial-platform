import { useState, useEffect } from 'react';
import { Users, Search, Plus, Settings, Loader2, UserPlus, Lock, Globe } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/api';

interface Group {
  id: number;
  name: string;
  description: string;
  privacy: string;
  memberCount: number;
  createdAt: string;
}

export default function Groups() {
  const { user } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [myGroups, setMyGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'discover' | 'my-groups'>('discover');
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGroups();
  }, [searchQuery]);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const params: any = { limit: 20 };
      if (searchQuery) {
        params.search = searchQuery;
      }
      const data = await api.groups.getAll(params);
      setGroups(data);
      
      if (user) {
        const userGroups = data.filter((g: Group) => g.memberCount > 0);
        setMyGroups(userGroups);
      }
    } catch (err) {
      setError('Failed to load groups');
      console.error('Error fetching groups:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGroup = async (groupId: number) => {
    if (!user) {
      setError('Please login to join groups');
      return;
    }

    try {
      await api.groups.join(groupId);
      setError('');
      alert('Successfully joined group!');
      fetchGroups();
    } catch (err) {
      setError('Failed to join group');
      console.error('Error joining group:', err);
    }
  };

  const displayGroups = activeTab === 'my-groups' ? myGroups : groups;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3 text-slate-800">
              <Users className="w-8 h-8 text-indigo-600" />
              Groups
            </h1>
            <p className="text-slate-600 mt-1">Connect with communities that share your interests</p>
          </div>
          {user && (
            <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Create Group
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative mt-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search groups..."
            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm mt-3">{error}</p>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="border-b border-slate-200 flex">
          <button
            onClick={() => setActiveTab('discover')}
            className={`px-6 py-4 font-medium border-b-2 transition-colors ${
              activeTab === 'discover'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-600 hover:text-slate-800'
            }`}
          >
            Discover Groups
          </button>
          {user && (
            <button
              onClick={() => setActiveTab('my-groups')}
              className={`px-6 py-4 font-medium border-b-2 transition-colors ${
                activeTab === 'my-groups'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-600 hover:text-slate-800'
              }`}
            >
              My Groups ({myGroups.length})
            </button>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          </div>
        )}

        {/* Empty State */}
        {!loading && displayGroups.length === 0 && (
          <div className="p-12 text-center">
            <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-800 mb-2">
              {activeTab === 'my-groups' ? 'No groups joined yet' : 'No groups found'}
            </h3>
            <p className="text-slate-600">
              {activeTab === 'my-groups'
                ? 'Discover and join groups to connect with others'
                : 'Try adjusting your search'}
            </p>
          </div>
        )}

        {/* Groups Grid */}
        {!loading && displayGroups.length > 0 && (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayGroups.map((group) => (
              <div
                key={group.id}
                className="border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-all"
              >
                {/* Group Cover */}
                <div className="h-32 bg-gradient-to-br from-indigo-500 to-purple-600 relative">
                  <div className="absolute top-3 right-3">
                    {group.privacy === 'private' ? (
                      <div className="px-3 py-1 bg-white/90 rounded-full flex items-center gap-1 text-sm">
                        <Lock className="w-3 h-3" />
                        Private
                      </div>
                    ) : (
                      <div className="px-3 py-1 bg-white/90 rounded-full flex items-center gap-1 text-sm">
                        <Globe className="w-3 h-3" />
                        Public
                      </div>
                    )}
                  </div>
                </div>

                {/* Group Info */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-1">
                    {group.name}
                  </h3>
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                    {group.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-slate-600 mb-4 pb-4 border-b border-slate-200">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{group.memberCount} members</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {activeTab === 'my-groups' ? (
                      <>
                        <button className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                          View Group
                        </button>
                        <button className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                          <Settings className="w-5 h-5 text-slate-600" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleJoinGroup(group.id)}
                        disabled={!user}
                        className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <UserPlus className="w-4 h-4" />
                        Join Group
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

