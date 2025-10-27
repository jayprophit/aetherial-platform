import { useState } from 'react';
import { Link } from 'react-router-dom';

interface PDFDocument {
  id: string;
  title: string;
  description: string;
  author: string;
  uploadedBy: string;
  uploadedAt: string;
  fileSize: string;
  pages: number;
  category: string;
  tags: string[];
  downloads: number;
  views: number;
  thumbnail: string;
  favorite: boolean;
}

export default function PDFLibrary() {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  const documents: PDFDocument[] = [
    {
      id: '1',
      title: 'AI & Machine Learning Fundamentals',
      description: 'Comprehensive guide to AI and ML concepts, algorithms, and applications',
      author: 'Dr. Sarah Johnson',
      uploadedBy: 'Admin',
      uploadedAt: '2025-10-25',
      fileSize: '5.2 MB',
      pages: 156,
      category: 'Technology',
      tags: ['AI', 'Machine Learning', 'Tutorial'],
      downloads: 1234,
      views: 5678,
      thumbnail: '',
      favorite: true,
    },
    {
      id: '2',
      title: 'Quantum Computing: Theory and Practice',
      description: 'From quantum mechanics to practical quantum algorithms',
      author: 'Prof. Michael Chen',
      uploadedBy: 'Community',
      uploadedAt: '2025-10-24',
      fileSize: '8.7 MB',
      pages: 245,
      category: 'Science',
      tags: ['Quantum', 'Physics', 'Computing'],
      downloads: 892,
      views: 3421,
      thumbnail: '',
      favorite: false,
    },
    {
      id: '3',
      title: 'Blockchain Architecture Whitepaper',
      description: 'Technical deep-dive into blockchain protocols and consensus mechanisms',
      author: 'Alex Rodriguez',
      uploadedBy: 'Verified User',
      uploadedAt: '2025-10-23',
      fileSize: '3.4 MB',
      pages: 89,
      category: 'Technology',
      tags: ['Blockchain', 'Cryptocurrency', 'Whitepaper'],
      downloads: 2156,
      views: 8934,
      thumbnail: '',
      favorite: true,
    },
    {
      id: '4',
      title: 'Cybersecurity Best Practices 2025',
      description: 'Essential security practices for modern applications',
      author: 'Security Team',
      uploadedBy: 'Official',
      uploadedAt: '2025-10-22',
      fileSize: '2.1 MB',
      pages: 67,
      category: 'Security',
      tags: ['Security', 'Best Practices', 'Guide'],
      downloads: 1567,
      views: 6234,
      thumbnail: '',
      favorite: false,
    },
  ];

  const categories = ['All', 'Technology', 'Science', 'Security', 'Business', 'Education', 'Research'];
  const allTags = Array.from(new Set(documents.flatMap(d => d.tags)));

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
      case 'popular':
        return b.views - a.views;
      case 'downloads':
        return b.downloads - a.downloads;
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const handleFavorite = (docId: string) => {
    console.log(`Toggled favorite for ${docId}`);
    // TODO: Implement API call
  };

  const handleDownload = (docId: string) => {
    console.log(`Downloading ${docId}`);
    // TODO: Implement download
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">PDF Library</h1>
            <p className="text-gray-600">Browse, read, and manage your document collection</p>
          </div>
          <Link
            to="/pdf/upload"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition font-semibold"
          >
            + Upload PDF
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Documents', value: documents.length, icon: '📄' },
            { label: 'Total Downloads', value: documents.reduce((sum, d) => sum + d.downloads, 0), icon: '⬇️' },
            { label: 'Total Views', value: documents.reduce((sum, d) => sum + d.views, 0), icon: '👁️' },
            { label: 'Favorites', value: documents.filter(d => d.favorite).length, icon: '⭐' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">{stat.icon}</span>
                <span className="text-3xl font-bold text-gray-900">{stat.value.toLocaleString()}</span>
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Search */}
            <div className="flex-1 min-w-[300px]">
              <input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(cat => (
                <option key={cat} value={cat.toLowerCase()}>{cat}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="recent">Most Recent</option>
              <option value="popular">Most Popular</option>
              <option value="downloads">Most Downloaded</option>
              <option value="title">Title (A-Z)</option>
            </select>

            {/* View Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setView('grid')}
                className={`px-4 py-2 rounded-lg transition ${
                  view === 'grid' ? 'bg-white shadow-sm' : 'text-gray-600'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setView('list')}
                className={`px-4 py-2 rounded-lg transition ${
                  view === 'list' ? 'bg-white shadow-sm' : 'text-gray-600'
                }`}
              >
                List
              </button>
            </div>
          </div>
        </div>

        {/* Popular Tags */}
        <div className="mb-6 flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm hover:border-blue-500 hover:text-blue-600 transition"
            >
              #{tag}
            </button>
          ))}
        </div>

        {/* Documents Grid View */}
        {view === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedDocuments.map((doc) => (
              <div key={doc.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition group">
                {/* Thumbnail */}
                <div className="h-64 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white relative">
                  <div className="text-center">
                    <div className="text-6xl mb-2">📄</div>
                    <div className="text-sm font-medium">{doc.pages} pages</div>
                  </div>
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={() => handleFavorite(doc.id)}
                      className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition"
                    >
                      {doc.favorite ? '⭐' : '☆'}
                    </button>
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Link
                      to={`/pdf/view/${doc.id}`}
                      className="px-6 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition"
                    >
                      Open PDF
                    </Link>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                      {doc.category}
                    </span>
                    <span className="text-sm text-gray-600">{doc.fileSize}</span>
                  </div>

                  <h3 className="text-lg font-bold mb-2 text-gray-900 line-clamp-2">{doc.title}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{doc.description}</p>

                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <span className="font-medium">{doc.author}</span>
                    <span className="mx-2">·</span>
                    <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <span>👁️</span>
                        <span>{doc.views}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span>⬇️</span>
                        <span>{doc.downloads}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      to={`/pdf/view/${doc.id}`}
                      className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-center font-semibold hover:bg-blue-700 transition"
                    >
                      Read
                    </Link>
                    <button
                      onClick={() => handleDownload(doc.id)}
                      className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                    >
                      ⬇️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Documents List View */}
        {view === 'list' && (
          <div className="space-y-4">
            {sortedDocuments.map((doc) => (
              <div key={doc.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
                <div className="flex gap-6">
                  {/* Thumbnail */}
                  <div className="w-32 h-40 flex-shrink-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white">
                    <div className="text-center">
                      <div className="text-4xl mb-1">📄</div>
                      <div className="text-xs">{doc.pages} pages</div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{doc.title}</h3>
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                            {doc.category}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3">{doc.description}</p>
                      </div>
                      <button
                        onClick={() => handleFavorite(doc.id)}
                        className="text-2xl hover:scale-110 transition"
                      >
                        {doc.favorite ? '⭐' : '☆'}
                      </button>
                    </div>

                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <span className="font-medium">{doc.author}</span>
                      <span className="mx-2">·</span>
                      <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                      <span className="mx-2">·</span>
                      <span>{doc.fileSize}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <span>👁️</span>
                          <span>{doc.views} views</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span>⬇️</span>
                          <span>{doc.downloads} downloads</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {doc.tags.map(tag => (
                            <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Link
                          to={`/pdf/view/${doc.id}`}
                          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                        >
                          Read
                        </Link>
                        <button
                          onClick={() => handleDownload(doc.id)}
                          className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                        >
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {sortedDocuments.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No documents found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

