import { useState } from 'react';
import { Link } from 'react-router-dom';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    bio: string;
  };
  publishedAt: string;
  readTime: number;
  claps: number;
  comments: number;
  bookmarked: boolean;
  tags: string[];
  image: string;
}

export default function Blog() {
  const [activeTab, setActiveTab] = useState('discover');
  const [selectedTag, setSelectedTag] = useState('all');

  const posts: BlogPost[] = [
    {
      id: '1',
      title: 'Building the Future of AI: A Comprehensive Guide',
      excerpt: 'Exploring the latest advances in artificial intelligence and how they\'re shaping our world...',
      content: '',
      author: {
        name: 'Sarah Chen',
        avatar: '',
        bio: 'AI Researcher & Tech Writer',
      },
      publishedAt: '2025-10-25',
      readTime: 8,
      claps: 1234,
      comments: 56,
      bookmarked: true,
      tags: ['AI', 'Technology', 'Future'],
      image: '',
    },
    {
      id: '2',
      title: 'Quantum Computing: From Theory to Practice',
      excerpt: 'A deep dive into quantum computing principles and real-world applications...',
      content: '',
      author: {
        name: 'Dr. James Wilson',
        avatar: '',
        bio: 'Quantum Physicist',
      },
      publishedAt: '2025-10-24',
      readTime: 12,
      claps: 892,
      comments: 34,
      bookmarked: false,
      tags: ['Quantum', 'Science', 'Technology'],
      image: '',
    },
    {
      id: '3',
      title: 'The Art of Building Scalable Platforms',
      excerpt: 'Lessons learned from building platforms that serve millions of users...',
      content: '',
      author: {
        name: 'Alex Rodriguez',
        avatar: '',
        bio: 'Platform Engineer',
      },
      publishedAt: '2025-10-23',
      readTime: 10,
      claps: 2156,
      comments: 89,
      bookmarked: true,
      tags: ['Engineering', 'Scalability', 'Architecture'],
      image: '',
    },
    {
      id: '4',
      title: 'Blockchain Beyond Cryptocurrency',
      excerpt: 'Exploring innovative blockchain use cases beyond digital currencies...',
      content: '',
      author: {
        name: 'Maria Santos',
        avatar: '',
        bio: 'Blockchain Developer',
      },
      publishedAt: '2025-10-22',
      readTime: 6,
      claps: 567,
      comments: 23,
      bookmarked: false,
      tags: ['Blockchain', 'Innovation', 'Technology'],
      image: '',
    },
  ];

  const allTags = ['All', ...Array.from(new Set(posts.flatMap(p => p.tags)))];

  const filteredPosts = selectedTag === 'all' 
    ? posts 
    : posts.filter(p => p.tags.map(t => t.toLowerCase()).includes(selectedTag.toLowerCase()));

  const handleClap = (postId: string) => {
    console.log(`Clapped for post ${postId}`);
    // TODO: Implement API call
  };

  const handleBookmark = (postId: string) => {
    console.log(`Bookmarked post ${postId}`);
    // TODO: Implement API call
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 sticky top-0 bg-white z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold">AETHERIAL Blog</h1>
              <nav className="flex space-x-6">
                <button
                  onClick={() => setActiveTab('discover')}
                  className={`pb-4 border-b-2 transition ${
                    activeTab === 'discover'
                      ? 'border-black font-semibold'
                      : 'border-transparent text-gray-600 hover:text-black'
                  }`}
                >
                  Discover
                </button>
                <button
                  onClick={() => setActiveTab('following')}
                  className={`pb-4 border-b-2 transition ${
                    activeTab === 'following'
                      ? 'border-black font-semibold'
                      : 'border-transparent text-gray-600 hover:text-black'
                  }`}
                >
                  Following
                </button>
                <button
                  onClick={() => setActiveTab('bookmarks')}
                  className={`pb-4 border-b-2 transition ${
                    activeTab === 'bookmarks'
                      ? 'border-black font-semibold'
                      : 'border-transparent text-gray-600 hover:text-black'
                  }`}
                >
                  Bookmarks
                </button>
              </nav>
            </div>
            <Link
              to="/blog/write"
              className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition font-medium"
            >
              Write
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-12">
          {/* Main Content */}
          <div className="flex-1 max-w-3xl">
            {/* Featured Post */}
            {filteredPosts.length > 0 && (
              <div className="mb-12 pb-12 border-b border-gray-200">
                <div className="mb-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                      {filteredPosts[0].author.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold">{filteredPosts[0].author.name}</div>
                      <div className="text-sm text-gray-600">
                        {new Date(filteredPosts[0].publishedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })} · {filteredPosts[0].readTime} min read
                      </div>
                    </div>
                  </div>
                  <h2 className="text-4xl font-bold mb-4 leading-tight hover:text-gray-700 cursor-pointer">
                    {filteredPosts[0].title}
                  </h2>
                  <p className="text-xl text-gray-600 mb-6">{filteredPosts[0].excerpt}</p>
                  <div className="h-96 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg mb-6"></div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <button
                        onClick={() => handleClap(filteredPosts[0].id)}
                        className="flex items-center space-x-2 text-gray-600 hover:text-black transition"
                      >
                        <span className="text-2xl">👏</span>
                        <span className="font-semibold">{filteredPosts[0].claps}</span>
                      </button>
                      <button className="flex items-center space-x-2 text-gray-600 hover:text-black transition">
                        <span className="text-xl">💬</span>
                        <span className="font-semibold">{filteredPosts[0].comments}</span>
                      </button>
                    </div>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleBookmark(filteredPosts[0].id)}
                        className="text-2xl hover:scale-110 transition"
                      >
                        {filteredPosts[0].bookmarked ? '🔖' : '📑'}
                      </button>
                      <button className="text-2xl hover:scale-110 transition">
                        🔗
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tags */}
            <div className="mb-8 flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag.toLowerCase())}
                  className={`px-4 py-2 rounded-full transition ${
                    selectedTag === tag.toLowerCase()
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Posts List */}
            <div className="space-y-8">
              {filteredPosts.slice(1).map((post) => (
                <article key={post.id} className="pb-8 border-b border-gray-200">
                  <div className="flex gap-6">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                          {post.author.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-semibold">{post.author.name}</div>
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold mb-2 hover:text-gray-700 cursor-pointer">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>
                            {new Date(post.publishedAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                          <span>·</span>
                          <span>{post.readTime} min read</span>
                          <span>·</span>
                          <div className="flex items-center space-x-1">
                            <span>👏</span>
                            <span>{post.claps}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span>💬</span>
                            <span>{post.comments}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleBookmark(post.id)}
                            className="text-xl hover:scale-110 transition"
                          >
                            {post.bookmarked ? '🔖' : '📑'}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="w-32 h-32 flex-shrink-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg"></div>
                  </div>
                </article>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <button className="px-8 py-3 border-2 border-black text-black rounded-full hover:bg-black hover:text-white transition font-semibold">
                Load More Stories
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-80 flex-shrink-0 sticky top-24 h-fit">
            {/* Trending Topics */}
            <div className="mb-8">
              <h3 className="text-lg font-bold mb-4">Trending Topics</h3>
              <div className="space-y-4">
                {['AI & Machine Learning', 'Quantum Computing', 'Blockchain', 'Web Development', 'Cybersecurity'].map((topic, index) => (
                  <div key={topic} className="flex items-start space-x-3">
                    <span className="text-gray-400 font-bold text-lg">{String(index + 1).padStart(2, '0')}</span>
                    <div>
                      <div className="font-semibold hover:text-gray-700 cursor-pointer">{topic}</div>
                      <div className="text-sm text-gray-600">{Math.floor(Math.random() * 1000) + 100} stories</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Authors */}
            <div className="mb-8">
              <h3 className="text-lg font-bold mb-4">Who to Follow</h3>
              <div className="space-y-4">
                {[
                  { name: 'Dr. Emily Zhang', bio: 'AI Researcher at MIT', followers: '12.5K' },
                  { name: 'Michael Brown', bio: 'Tech Entrepreneur', followers: '8.2K' },
                  { name: 'Lisa Anderson', bio: 'Quantum Physicist', followers: '15.3K' },
                ].map((author) => (
                  <div key={author.name} className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                        {author.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold hover:text-gray-700 cursor-pointer">{author.name}</div>
                        <div className="text-sm text-gray-600">{author.bio}</div>
                        <div className="text-xs text-gray-500">{author.followers} followers</div>
                      </div>
                    </div>
                    <button className="px-4 py-1 border border-black rounded-full text-sm hover:bg-black hover:text-white transition">
                      Follow
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Reading List */}
            <div className="mb-8">
              <h3 className="text-lg font-bold mb-4">Your Reading List</h3>
              <div className="space-y-3">
                <div className="text-sm text-gray-600">
                  {posts.filter(p => p.bookmarked).length} stories saved
                </div>
                <Link
                  to="/blog/reading-list"
                  className="block text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  View all →
                </Link>
              </div>
            </div>

            {/* Footer Links */}
            <div className="text-xs text-gray-600 space-y-2">
              <div className="flex flex-wrap gap-x-3 gap-y-1">
                <a href="#" className="hover:text-black">Help</a>
                <a href="#" className="hover:text-black">Status</a>
                <a href="#" className="hover:text-black">About</a>
                <a href="#" className="hover:text-black">Careers</a>
                <a href="#" className="hover:text-black">Blog</a>
                <a href="#" className="hover:text-black">Privacy</a>
                <a href="#" className="hover:text-black">Terms</a>
                <a href="#" className="hover:text-black">Text to speech</a>
                <a href="#" className="hover:text-black">Teams</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

