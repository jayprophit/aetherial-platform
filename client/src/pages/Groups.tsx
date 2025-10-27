import { useState } from 'react';
import { Users, Plus, Search, TrendingUp, Lock, Globe, Clock } from 'lucide-react';

export default function Groups() {
  const [activeTab, setActiveTab] = useState('my-groups');

  const myGroups = Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    name: `Group ${i + 1}`,
    members: Math.floor(Math.random() * 10000),
    posts: Math.floor(Math.random() * 500),
    image: `https://api.dicebear.com/7.x/shapes/svg?seed=group${i}`,
    privacy: i % 2 === 0 ? 'Public' : 'Private',
  }));

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Users className="w-8 h-8 text-purple-600" />
              Groups
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Connect with communities</p>
          </div>
          <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Create Group
          </button>
        </div>

        <div className="flex gap-4 mt-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search groups..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700"
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="border-b border-gray-200 dark:border-gray-700 flex">
          {['my-groups', 'discover', 'invitations'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 font-medium border-b-2 ${
                activeTab === tab ? 'border-purple-600 text-purple-600' : 'border-transparent'
              }`}
            >
              {tab.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
            </button>
          ))}
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {myGroups.map((group) => (
            <div key={group.id} className="border rounded-lg p-4 hover:shadow-lg transition">
              <img src={group.image} alt={group.name} className="w-full h-32 object-cover rounded-lg mb-3" />
              <h3 className="font-semibold text-lg">{group.name}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mt-2">
                {group.privacy === 'Public' ? <Globe className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                <span>{group.privacy}</span>
              </div>
              <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400 mt-2">
                <span>{group.members.toLocaleString()} members</span>
                <span>{group.posts} posts</span>
              </div>
              <button className="w-full mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                View Group
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
