import { useState } from 'react';
import {
  Heart, MessageCircle, Share2, MoreHorizontal, Image as ImageIcon,
  Video, Smile, MapPin, Users, TrendingUp, Award, Zap
} from 'lucide-react';

interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
  timestamp: string;
  liked?: boolean;
}

const mockPosts: Post[] = [
  {
    id: '1',
    author: {
      name: 'Sarah Johnson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      verified: true
    },
    content: 'Just completed my first blockchain development course! 🎉 Earned 500 AETH tokens and unlocked a premium AI course. This platform is amazing!',
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
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
      verified: false
    },
    content: 'Check out my new IoT device setup! Automated my entire home with the robotics marketplace. Who else is into smart home automation?',
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=800',
    likes: 567,
    comments: 89,
    shares: 34,
    timestamp: '5 hours ago',
    liked: true
  },
  {
    id: '3',
    author: {
      name: 'Emma Davis',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
      verified: true
    },
    content: 'My trading bot just hit 94% win rate! 🚀 Thanks to the AI agents marketplace. Anyone want to collaborate on a new trading strategy?',
    likes: 891,
    comments: 156,
    shares: 67,
    timestamp: '1 day ago',
    liked: false
  },
];

export default function Home() {
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [newPost, setNewPost] = useState('');

  const handleLike = (postId: string) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const handlePost = () => {
    if (!newPost.trim()) return;

    const post: Post = {
      id: Date.now().toString(),
      author: {
        name: 'You',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=You',
        verified: false
      },
      content: newPost,
      likes: 0,
      comments: 0,
      shares: 0,
      timestamp: 'Just now',
      liked: false
    };

    setPosts([post, ...posts]);
    setNewPost('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">AETH Balance</p>
              <p className="text-2xl font-bold">15,420</p>
            </div>
            <Zap className="w-8 h-8 text-purple-600" />
          </div>
          <p className="text-xs text-green-600 mt-2">+12.5% growth</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Friends</p>
              <p className="text-2xl font-bold">1,234</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-xs text-green-600 mt-2">+8.3% new</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Courses</p>
              <p className="text-2xl font-bold">47</p>
            </div>
            <Award className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-xs text-green-600 mt-2">+15.2% completed</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Rank</p>
              <p className="text-2xl font-bold">Diamond</p>
            </div>
            <TrendingUp className="w-8 h-8 text-yellow-600" />
          </div>
          <p className="text-xs text-gray-600 mt-2">Level 12</p>
        </div>
      </div>

      {/* Create Post */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
        <div className="flex gap-3">
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=You"
            alt="Your avatar"
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1">
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700"
              rows={3}
            />
            <div className="flex items-center justify-between mt-3">
              <div className="flex gap-2">
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  <ImageIcon className="w-5 h-5 text-green-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  <Video className="w-5 h-5 text-red-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  <Smile className="w-5 h-5 text-yellow-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </button>
              </div>
              <button
                onClick={handlePost}
                disabled={!newPost.trim()}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
            {/* Post Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex gap-3">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{post.author.name}</h3>
                    {post.author.verified && (
                      <span className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                        ✓
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{post.timestamp}</p>
                </div>
              </div>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            {/* Post Content */}
            <p className="mb-4 whitespace-pre-wrap">{post.content}</p>

            {/* Post Image */}
            {post.image && (
              <img
                src={post.image}
                alt="Post content"
                className="w-full rounded-lg mb-4 max-h-96 object-cover"
              />
            )}

            {/* Post Stats */}
            <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
              <span>{post.likes} likes</span>
              <span>{post.comments} comments</span>
              <span>{post.shares} shares</span>
            </div>

            {/* Post Actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleLike(post.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  post.liked ? 'text-red-600' : ''
                }`}
              >
                <Heart className={`w-5 h-5 ${post.liked ? 'fill-current' : ''}`} />
                <span>Like</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                <MessageCircle className="w-5 h-5" />
                <span>Comment</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                <Share2 className="w-5 h-5" />
                <span>Share</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <button className="px-6 py-3 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow">
          Load More Posts
        </button>
      </div>
    </div>
  );
}

