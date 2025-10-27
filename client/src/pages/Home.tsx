import { useState, useEffect } from 'react';
import {
  Heart, MessageCircle, Share2, MoreHorizontal, Image as ImageIcon,
  Video, Smile, MapPin, Users, TrendingUp, Award, Zap, Loader2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/api';

interface Post {
  id: number;
  userId: number;
  content: string;
  mediaUrl?: string;
  mediaType?: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  createdAt: string;
  user?: {
    id: number;
    fullName: string;
    email: string;
  };
  liked?: boolean;
}

export default function Home() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState('');

  // Fetch posts on mount
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await api.posts.getAll({ limit: 20 });
      setPosts(data);
    } catch (err) {
      setError('Failed to load posts');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePost = async () => {
    if (!newPost.trim()) return;
    if (!user) {
      setError('Please login to create posts');
      return;
    }

    try {
      setPosting(true);
      setError('');
      const post = await api.posts.create({ content: newPost });
      setPosts([post, ...posts]);
      setNewPost('');
    } catch (err) {
      setError('Failed to create post');
      console.error('Error creating post:', err);
    } finally {
      setPosting(false);
    }
  };

  const handleLike = async (postId: number) => {
    if (!user) {
      setError('Please login to like posts');
      return;
    }

    try {
      await api.posts.like(postId);
      setPosts(posts.map(post =>
        post.id === postId
          ? { ...post, liked: !post.liked, likesCount: post.liked ? post.likesCount - 1 : post.likesCount + 1 }
          : post
      ));
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Create Post Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
        <div className="flex gap-3">
          <img
            src={user ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}` : 'https://api.dicebear.com/7.x/avataaars/svg?seed=guest'}
            alt="Your avatar"
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1">
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder={user ? "What's on your mind?" : "Please login to post..."}
              disabled={!user || posting}
              className="w-full px-4 py-3 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
              rows={3}
            />
            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
            <div className="flex items-center justify-between mt-3">
              <div className="flex gap-2">
                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="Add image">
                  <ImageIcon className="w-5 h-5 text-slate-600" />
                </button>
                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="Add video">
                  <Video className="w-5 h-5 text-slate-600" />
                </button>
                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="Add emoji">
                  <Smile className="w-5 h-5 text-slate-600" />
                </button>
                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="Add location">
                  <MapPin className="w-5 h-5 text-slate-600" />
                </button>
              </div>
              <button
                onClick={handlePost}
                disabled={!newPost.trim() || !user || posting}
                className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {posting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Posting...
                  </>
                ) : (
                  'Post'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cyan-100 text-sm">AETH Balance</p>
              <p className="text-2xl font-bold">2,450</p>
            </div>
            <Zap className="w-8 h-8 text-cyan-200" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Friends</p>
              <p className="text-2xl font-bold">342</p>
            </div>
            <Users className="w-8 h-8 text-purple-200" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-pink-100 text-sm">Rank</p>
              <p className="text-2xl font-bold">#127</p>
            </div>
            <Award className="w-8 h-8 text-pink-200" />
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
        </div>
      )}

      {/* Posts Feed */}
      {!loading && posts.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
          <TrendingUp className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-800 mb-2">No posts yet</h3>
          <p className="text-slate-600">Be the first to share something!</p>
        </div>
      )}

      {!loading && posts.map((post) => (
        <div key={post.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-4">
          {/* Post Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <img
                src={post.user ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.user.email}` : 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'}
                alt={post.user?.fullName || 'User'}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-slate-800">
                    {post.user?.fullName || 'Unknown User'}
                  </h3>
                </div>
                <p className="text-sm text-slate-500">{formatTimestamp(post.createdAt)}</p>
              </div>
            </div>
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <MoreHorizontal className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          {/* Post Content */}
          <p className="text-slate-800 mb-4 whitespace-pre-wrap">{post.content}</p>

          {/* Post Image */}
          {post.mediaUrl && post.mediaType === 'image' && (
            <img
              src={post.mediaUrl}
              alt="Post content"
              className="w-full rounded-lg mb-4"
            />
          )}

          {/* Post Actions */}
          <div className="flex items-center gap-6 pt-4 border-t border-slate-200">
            <button
              onClick={() => handleLike(post.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                post.liked
                  ? 'text-red-500 bg-red-50 hover:bg-red-100'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Heart className={`w-5 h-5 ${post.liked ? 'fill-current' : ''}`} />
              <span className="font-medium">{post.likesCount}</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors">
              <MessageCircle className="w-5 h-5" />
              <span className="font-medium">{post.commentsCount}</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors">
              <Share2 className="w-5 h-5" />
              <span className="font-medium">{post.sharesCount}</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

