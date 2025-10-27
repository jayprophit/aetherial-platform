import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Dashboard() {
  const [user] = useState({
    name: 'John Doe',
    username: '@johndoe',
    avatar: '',
    level: 12,
    points: 2450,
    nextLevelPoints: 3000,
  });

  const stats = [
    { label: 'Posts', value: '124', icon: '📝', color: 'blue' },
    { label: 'Followers', value: '1.2K', icon: '👥', color: 'purple' },
    { label: 'Courses', value: '8', icon: '🎓', color: 'green' },
    { label: 'Points', value: '2.4K', icon: '⭐', color: 'yellow' },
  ];

  const recentActivity = [
    { type: 'post', text: 'You published a new blog post', time: '2 hours ago', icon: '✍️' },
    { type: 'course', text: 'Completed "Advanced AI" course', time: '5 hours ago', icon: '🎓' },
    { type: 'achievement', text: 'Earned "Content Creator" badge', time: '1 day ago', icon: '🏆' },
    { type: 'social', text: 'John Smith started following you', time: '2 days ago', icon: '👤' },
  ];

  const upcomingEvents = [
    { title: 'AI Workshop', date: 'Oct 28, 2025', time: '2:00 PM', attendees: 45 },
    { title: 'Community Meetup', date: 'Oct 30, 2025', time: '6:00 PM', attendees: 120 },
    { title: 'Live Webinar', date: 'Nov 2, 2025', time: '10:00 AM', attendees: 89 },
  ];

  const quickActions = [
    { label: 'Create Post', icon: '✍️', link: '/blog/new', color: 'blue' },
    { label: 'Upload PDF', icon: '📄', link: '/pdf-library/upload', color: 'red' },
    { label: 'Start Course', icon: '🎓', link: '/learning', color: 'green' },
    { label: 'Create Event', icon: '📅', link: '/events/new', color: 'purple' },
    { label: 'List Product', icon: '🛍️', link: '/marketplace/sell', color: 'yellow' },
    { label: 'Join Forum', icon: '💬', link: '/forums', color: 'pink' },
  ];

  const progressPercentage = (user.points / user.nextLevelPoints) * 100;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user.name}!</h1>
          <p className="text-gray-600">Here's what's happening with your account today.</p>
        </div>

        {/* Level Progress Card */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 mb-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">Level {user.level}</h2>
              <p className="opacity-90">{user.points} / {user.nextLevelPoints} XP</p>
            </div>
            <div className="text-5xl">🏆</div>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
            <div
              className="bg-white h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <p className="mt-2 text-sm opacity-90">
            {user.nextLevelPoints - user.points} XP to next level
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">{stat.icon}</span>
                <span className={`text-3xl font-bold text-${stat.color}-600`}>{stat.value}</span>
              </div>
              <p className="text-gray-600 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    to={action.link}
                    className={`p-4 border-2 border-gray-200 rounded-lg hover:border-${action.color}-400 hover:bg-${action.color}-50 transition text-center`}
                  >
                    <div className="text-3xl mb-2">{action.icon}</div>
                    <p className="text-sm font-medium text-gray-700">{action.label}</p>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Recent Activity</h3>
                <Link to="/activity" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-0">
                    <div className="text-2xl">{activity.icon}</div>
                    <div className="flex-1">
                      <p className="text-gray-900">{activity.text}</p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Events */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Upcoming Events</h3>
                <Link to="/events" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer">
                    <h4 className="font-semibold text-gray-900 mb-1">{event.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      📅 {event.date} at {event.time}
                    </p>
                    <p className="text-xs text-gray-500">👥 {event.attendees} attending</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Recent Achievements</h3>
                <Link to="/achievements" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View All
                </Link>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">🏆</div>
                  <div>
                    <p className="font-semibold text-sm">Content Creator</p>
                    <p className="text-xs text-gray-500">Published 10 posts</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">⭐</div>
                  <div>
                    <p className="font-semibold text-sm">Rising Star</p>
                    <p className="text-xs text-gray-500">Reached Level 10</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">🎓</div>
                  <div>
                    <p className="font-semibold text-sm">Quick Learner</p>
                    <p className="text-xs text-gray-500">Completed 5 courses</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Notifications</h3>
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">3</span>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-900">New message from Sarah</p>
                  <p className="text-xs text-blue-600 mt-1">5 minutes ago</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm font-medium text-green-900">Course certificate ready</p>
                  <p className="text-xs text-green-600 mt-1">1 hour ago</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm font-medium text-purple-900">Event reminder: AI Workshop</p>
                  <p className="text-xs text-purple-600 mt-1">Tomorrow at 2 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

