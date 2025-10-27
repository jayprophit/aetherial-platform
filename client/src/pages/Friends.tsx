import { useState, useEffect } from 'react';
import { Users, UserPlus, UserCheck, Search, MessageCircle, X, Loader2, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/api';

interface Friend {
  id: number;
  status: string;
  createdAt: string;
  friend?: {
    id: number;
    fullName: string;
    email: string;
  };
}

export default function Friends() {
  const { user } = useAuth();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [requests, setRequests] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'requests'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      fetchFriends();
    }
  }, [user]);

  const fetchFriends = async () => {
    try {
      setLoading(true);
      const data = await api.friends.getAll();
      const accepted = data.filter((f: Friend) => f.status === 'accepted');
      const pending = data.filter((f: Friend) => f.status === 'pending');
      setFriends(accepted);
      setRequests(pending);
    } catch (err) {
      setError('Failed to load friends');
      console.error('Error fetching friends:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (friendId: number) => {
    try {
      await api.friends.accept(friendId);
      setError('');
      fetchFriends();
    } catch (err) {
      setError('Failed to accept friend request');
      console.error('Error accepting request:', err);
    }
  };

  const handleRejectRequest = async (friendId: number) => {
    try {
      await api.friends.reject(friendId);
      setError('');
      fetchFriends();
    } catch (err) {
      setError('Failed to reject friend request');
      console.error('Error rejecting request:', err);
    }
  };

  const handleRemoveFriend = async (friendId: number) => {
    if (!confirm('Are you sure you want to remove this friend?')) return;
    
    try {
      await api.friends.remove(friendId);
      setError('');
      fetchFriends();
    } catch (err) {
      setError('Failed to remove friend');
      console.error('Error removing friend:', err);
    }
  };

  const filteredFriends = friends.filter((f) =>
    f.friend?.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.friend?.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayList = activeTab === 'all' ? filteredFriends : requests;

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
          <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-800 mb-2">Please login to view friends</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3 text-slate-800">
              <Users className="w-8 h-8 text-green-600" />
              Friends
            </h1>
            <p className="text-slate-600 mt-1">Manage your connections</p>
          </div>
          <button className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Find Friends
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mt-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search friends..."
            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
            onClick={() => setActiveTab('all')}
            className={`px-6 py-4 font-medium border-b-2 transition-colors ${
              activeTab === 'all'
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-slate-600 hover:text-slate-800'
            }`}
          >
            All Friends ({friends.length})
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-6 py-4 font-medium border-b-2 transition-colors ${
              activeTab === 'requests'
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-slate-600 hover:text-slate-800'
            }`}
          >
            Friend Requests ({requests.length})
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
          </div>
        )}

        {/* Empty State */}
        {!loading && displayList.length === 0 && (
          <div className="p-12 text-center">
            <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-800 mb-2">
              {activeTab === 'all' ? 'No friends yet' : 'No friend requests'}
            </h3>
            <p className="text-slate-600">
              {activeTab === 'all'
                ? 'Start connecting with people'
                : 'Check back later for new requests'}
            </p>
          </div>
        )}

        {/* Friends Grid */}
        {!loading && displayList.length > 0 && (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayList.map((item) => (
              <div
                key={item.id}
                className="border border-slate-200 rounded-xl p-5 hover:shadow-lg transition-all"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-800 truncate">
                      {item.friend?.fullName || 'Unknown User'}
                    </h3>
                    <p className="text-sm text-slate-600 truncate">
                      {item.friend?.email || ''}
                    </p>
                    {activeTab === 'all' && (
                      <div className="flex items-center gap-1 mt-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-green-600">Online</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                {activeTab === 'all' ? (
                  <div className="flex gap-2">
                    <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      Message
                    </button>
                    <button
                      onClick={() => handleRemoveFriend(item.id)}
                      className="p-2 border border-slate-300 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors"
                    >
                      <X className="w-5 h-5 text-red-600" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAcceptRequest(item.id)}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <UserCheck className="w-4 h-4" />
                      Accept
                    </button>
                    <button
                      onClick={() => handleRejectRequest(item.id)}
                      className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      Decline
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

