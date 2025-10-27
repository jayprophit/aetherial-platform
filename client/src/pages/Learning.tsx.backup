import { useState } from 'react';
import { GraduationCap, Search, Filter, Star, Clock, Users, Play, BookOpen } from 'lucide-react';

export default function Learning() {
  const [activeTab, setActiveTab] = useState('all-courses');

  const courses = Array.from({ length: 9 }, (_, i) => ({
    id: i + 1,
    title: `Course ${i + 1}: Advanced Topics`,
    instructor: `Instructor ${i + 1}`,
    rating: (Math.random() * 2 + 3).toFixed(1),
    students: Math.floor(Math.random() * 10000),
    duration: `${Math.floor(Math.random() * 20 + 5)}h`,
    lessons: Math.floor(Math.random() * 50 + 10),
    price: i % 3 === 0 ? 'Free' : `$${(Math.random() * 100 + 20).toFixed(2)}`,
    image: `https://api.dicebear.com/7.x/shapes/svg?seed=course${i}`,
    progress: i < 3 ? Math.floor(Math.random() * 100) : null,
  }));

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <GraduationCap className="w-8 h-8 text-indigo-600" />
              E-Learning
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Learn new skills, advance your career</p>
          </div>
          <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg">
            Become Instructor
          </button>
        </div>

        <div className="flex gap-4 mt-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700"
            />
          </div>
          <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="border-b border-gray-200 dark:border-gray-700 flex">
          {['all-courses', 'my-courses', 'certificates'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 font-medium border-b-2 ${
                activeTab === tab ? 'border-indigo-600 text-indigo-600' : 'border-transparent'
              }`}
            >
              {tab.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
            </button>
          ))}
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <div key={course.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition">
              <div className="relative">
                <img src={course.image} alt={course.title} className="w-full h-40 object-cover" />
                <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-sm font-bold text-indigo-600">
                  {course.price}
                </div>
                {course.progress !== null && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2">
                    <div className="w-full bg-gray-300 rounded-full h-2">
                      <div 
                        className="bg-indigo-600 h-2 rounded-full" 
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                    <p className="text-white text-xs mt-1">{course.progress}% complete</p>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-2">{course.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{course.instructor}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{course.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{course.students.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{course.lessons} lessons</span>
                  </div>
                </div>
                <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2">
                  <Play className="w-4 h-4" />
                  {course.progress !== null ? 'Continue Learning' : 'Enroll Now'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
