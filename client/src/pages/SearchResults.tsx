import { useState, useEffect } from 'react';
import { Search, User, ShoppingBag, BookOpen, Briefcase, Users, FileText, Loader2 } from 'lucide-react';
import { useLocation } from 'wouter';
import SearchBar from '../components/SearchBar';

interface SearchResults {
  query: string;
  totalResults: number;
  results: {
    users?: any[];
    posts?: any[];
    products?: any[];
    courses?: any[];
    jobs?: any[];
    groups?: any[];
  };
}

export default function SearchResults() {
  const [location] = useLocation();
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [error, setError] = useState('');

  const query = new URLSearchParams(location.split('?')[1]).get('q') || '';

  useEffect(() => {
    if (query) {
      performSearch(query, activeTab);
    }
  }, [query, activeTab]);

  const performSearch = async (searchQuery: string, type: string = 'all') => {
    try {
      setLoading(true);
      setError('');
      const typeParam = type === 'all' ? '' : `&type=${type}`;
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}${typeParam}`);
      
      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError('Failed to perform search');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'all', label: 'All', count: results?.totalResults || 0 },
    { id: 'users', label: 'Users', count: results?.results.users?.length || 0 },
    { id: 'posts', label: 'Posts', count: results?.results.posts?.length || 0 },
    { id: 'products', label: 'Products', count: results?.results.products?.length || 0 },
    { id: 'courses', label: 'Courses', count: results?.results.courses?.length || 0 },
    { id: 'jobs', label: 'Jobs', count: results?.results.jobs?.length || 0 },
    { id: 'groups', label: 'Groups', count: results?.results.groups?.length || 0 }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header with Search */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h1 className="text-3xl font-bold flex items-center gap-3 text-slate-800 mb-4">
          <Search className="w-8 h-8 text-blue-600" />
          Search Results
        </h1>
        <SearchBar placeholder="Search..." autoFocus={false} />
        {query && (
          <p className="text-slate-600 mt-4">
            Showing results for: <span className="font-semibold">{query}</span>
          </p>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="border-b border-slate-200 flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-800'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        )}

        {/* Results */}
        {!loading && results && (
          <div className="p-6">
            {results.totalResults === 0 ? (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-800 mb-2">No results found</h3>
                <p className="text-slate-600">Try adjusting your search terms</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Users */}
                {(activeTab === 'all' || activeTab === 'users') && results.results.users && results.results.users.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Users
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {results.results.users.map((user: any) => (
                        <div key={user.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                              <User className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-slate-800">{user.fullName}</h4>
                              <p className="text-sm text-slate-600">{user.email}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Posts */}
                {(activeTab === 'all' || activeTab === 'posts') && results.results.posts && results.results.posts.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Posts
                    </h3>
                    <div className="space-y-3">
                      {results.results.posts.map((post: any) => (
                        <div key={post.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <p className="text-slate-700">{post.content}</p>
                          <p className="text-xs text-slate-500 mt-2">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Products */}
                {(activeTab === 'all' || activeTab === 'products') && results.results.products && results.results.products.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5" />
                      Products
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {results.results.products.map((product: any) => (
                        <div key={product.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <h4 className="font-semibold text-slate-800 mb-2">{product.name}</h4>
                          <p className="text-sm text-slate-600 mb-2 line-clamp-2">{product.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-green-600">${product.price}</span>
                            <span className="text-xs text-slate-500">{product.category}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Courses */}
                {(activeTab === 'all' || activeTab === 'courses') && results.results.courses && results.results.courses.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      Courses
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {results.results.courses.map((course: any) => (
                        <div key={course.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <h4 className="font-semibold text-slate-800 mb-2">{course.title}</h4>
                          <p className="text-sm text-slate-600 mb-2 line-clamp-2">{course.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-blue-600">${course.price}</span>
                            <span className="text-xs text-slate-500">{course.level}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Jobs */}
                {(activeTab === 'all' || activeTab === 'jobs') && results.results.jobs && results.results.jobs.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                      <Briefcase className="w-5 h-5" />
                      Jobs
                    </h3>
                    <div className="space-y-3">
                      {results.results.jobs.map((job: any) => (
                        <div key={job.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <h4 className="font-semibold text-slate-800 mb-1">{job.title}</h4>
                          <p className="text-sm text-slate-600 mb-2">{job.company} • {job.location}</p>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span>{job.type}</span>
                            {job.salary && <span>• ${job.salary}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Groups */}
                {(activeTab === 'all' || activeTab === 'groups') && results.results.groups && results.results.groups.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Groups
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {results.results.groups.map((group: any) => (
                        <div key={group.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <h4 className="font-semibold text-slate-800 mb-2">{group.name}</h4>
                          <p className="text-sm text-slate-600 mb-2 line-clamp-2">{group.description}</p>
                          <span className="text-xs text-slate-500">{group.privacy}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

