/**
 * Create Course Page
 * Military-Grade Course Creation Interface
 */

import React, { useState } from 'react';

export const CreateCourse: React.FC = () => {
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: 'beginner',
    price: 0,
    thumbnail: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement course creation logic
    console.log('Creating course:', courseData);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Create New Course</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Course Title
            </label>
            <input
              type="text"
              value={courseData.title}
              onChange={(e) => setCourseData({ ...courseData, title: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Enter course title"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              value={courseData.description}
              onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg h-32"
              placeholder="Describe your course"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Category
              </label>
              <select
                value={courseData.category}
                onChange={(e) => setCourseData({ ...courseData, category: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                required
              >
                <option value="">Select category</option>
                <option value="web-dev">Web Development</option>
                <option value="ai-ml">AI & Machine Learning</option>
                <option value="blockchain">Blockchain</option>
                <option value="mobile">Mobile Development</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Difficulty
              </label>
              <select
                value={courseData.difficulty}
                onChange={(e) => setCourseData({ ...courseData, difficulty: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Price (USD)
            </label>
            <input
              type="number"
              value={courseData.price}
              onChange={(e) => setCourseData({ ...courseData, price: parseFloat(e.target.value) })}
              className="w-full px-4 py-2 border rounded-lg"
              min="0"
              step="0.01"
            />
          </div>
          
          <div className="flex gap-4">
            <button
              type="submit"
              className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
            >
              Create Course
            </button>
            <button
              type="button"
              className="px-6 py-3 border rounded-lg hover:bg-gray-100"
            >
              Save as Draft
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCourse;

