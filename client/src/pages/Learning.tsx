import { useState, useEffect } from 'react';
import { BookOpen, Search, Filter, Star, Clock, Users, Award, Loader2, Play } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/api';

interface Course {
  id: number;
  instructorId: number;
  title: string;
  description: string;
  category: string;
  level: string;
  price: string;
  duration: number;
  thumbnail: string;
  rating: string;
  enrollmentCount: number;
  createdAt: string;
}

export default function Learning() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [error, setError] = useState('');

  const categories = ['All', 'Programming', 'Design', 'Business', 'Marketing', 'Data Science'];

  useEffect(() => {
    fetchCourses();
  }, [activeCategory, searchQuery]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const params: any = { limit: 20 };
      if (activeCategory !== 'all') {
        params.category = activeCategory;
      }
      if (searchQuery) {
        params.search = searchQuery;
      }
      const data = await api.courses.getAll(params);
      setCourses(data);
    } catch (err) {
      setError('Failed to load courses');
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId: number) => {
    if (!user) {
      setError('Please login to enroll in courses');
      return;
    }

    try {
      await api.courses.enroll(courseId);
      setError('');
      alert('Successfully enrolled in course!');
    } catch (err) {
      setError('Failed to enroll in course');
      console.error('Error enrolling:', err);
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3 text-slate-800">
              <BookOpen className="w-8 h-8 text-blue-600" />
              Learning Hub
            </h1>
            <p className="text-slate-600 mt-1">Expand your skills with expert-led courses</p>
          </div>
          {user && (
            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all">
              My Learning
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div className="flex gap-4 mt-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses..."
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="px-4 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </button>
        </div>

        {error && (
          <p className="text-red-500 text-sm mt-3">{error}</p>
        )}
      </div>

      {/* Categories */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="border-b border-slate-200 flex overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat.toLowerCase())}
              className={`px-6 py-4 font-medium border-b-2 whitespace-nowrap transition-colors ${
                activeCategory === cat.toLowerCase()
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        )}

        {/* Empty State */}
        {!loading && courses.length === 0 && (
          <div className="p-12 text-center">
            <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-800 mb-2">No courses found</h3>
            <p className="text-slate-600">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Courses Grid */}
        {!loading && courses.length > 0 && (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-all group"
              >
                {/* Course Thumbnail */}
                <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="w-16 h-16 text-white opacity-50" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                    <Play className="w-16 h-16 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  {/* Level Badge */}
                  <div className="absolute top-3 left-3 px-3 py-1 bg-white rounded-full text-sm font-medium">
                    {course.level}
                  </div>
                </div>

                {/* Course Info */}
                <div className="p-5">
                  <h3 className="font-bold text-lg text-slate-800 mb-2 line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mb-4 text-sm text-slate-600">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{course.rating || '0.0'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{course.enrollmentCount || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatDuration(course.duration)}</span>
                    </div>
                  </div>

                  {/* Price and Action */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                    <div>
                      {parseFloat(course.price) > 0 ? (
                        <p className="text-2xl font-bold text-blue-600">
                          ${parseFloat(course.price).toFixed(2)}
                        </p>
                      ) : (
                        <p className="text-2xl font-bold text-green-600">Free</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleEnroll(course.id)}
                      disabled={!user}
                      className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                      Enroll Now
                    </button>
                  </div>

                  {/* Category Badge */}
                  {course.category && (
                    <div className="mt-3">
                      <span className="text-xs px-3 py-1 bg-blue-100 text-blue-600 rounded-full font-medium">
                        {course.category}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

