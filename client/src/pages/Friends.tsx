import { useState } from 'react';
import { Users, UserPlus, UserCheck, Search, Filter, MoreVertical, MessageCircle, X } from 'lucide-react';

export default function Friends() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = [
    { id: 'all', label: 'All Friends', count: 1234 },
    { id: 'requests', label: 'Friend Requests', count: 12 },
    { id: 'suggestions', label: 'Suggestions', count: 48 },
    { id: 'sent', label: 'Sent Requests', count: 5 },
  ];

  const friends = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    name: `Friend ${i + 1}`,
    username: `@friend${i + 1}`,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=Friend${i}`,
    mutualFriends: Math.floor(Math.random() * 100),
    online: Math.random() > 0.5,
  }));

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Users className="w-8 h-8 text-purple-600" />
          Friends
        </h1>
        <div className="flex gap-4 mt-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search friends..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700"
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="border-b border-gray-200 dark:border-gray-700 flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 font-medium whitespace-nowrap border-b-2 ${
                activeTab === tab.id ? 'border-purple-600 text-purple-600' : 'border-transparent'
              }`}
            >
              {tab.label} <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-gray-100">{tab.count}</span>
            </button>
          ))}
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {friends.map((friend) => (
            <div key={friend.id} className="border rounded-lg p-4">
              <div className="flex items-start gap-3">
                <img src={friend.avatar} alt={friend.name} className="w-16 h-16 rounded-full" />
                <div className="flex-1">
                  <h3 className="font-semibold">{friend.name}</h3>
                  <p className="text-sm text-gray-600">{friend.username}</p>
                  <p className="text-xs text-gray-500">{friend.mutualFriends} mutual</p>
                </div>
              </div>
              <button className="w-full mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg">
                <MessageCircle className="w-4 h-4 inline mr-2" />
                Message
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
