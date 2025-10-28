import React, { useState } from 'react';
import './MyCourses.css';

interface Course {
  id: string;
  title: string;
  instructor: string;
  thumbnail: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  lastAccessed: string;
  category: string;
  certificate: boolean;
  certificateEarned: boolean;
}

const MyCourses: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'in-progress' | 'completed' | 'saved'>('in-progress');
  const [sortBy, setSortBy] = useState<'recent' | 'progress' | 'title'>('recent');

  // Mock data
  const courses: Course[] = [
    {
      id: '1',
      title: 'Complete Web Development Bootcamp 2025',
      instructor: 'Dr. Sarah Johnson',
      thumbnail: 'https://picsum.photos/400/225?random=1',
      progress: 65,
      totalLessons: 120,
      completedLessons: 78,
      lastAccessed: '2 hours ago',
      category: 'Web Development',
      certificate: true,
      certificateEarned: false
    },
    {
      id: '2',
      title: 'Python for Data Science',
      instructor: 'Prof. Michael Chen',
      thumbnail: 'https://picsum.photos/400/225?random=2',
      progress: 45,
      totalLessons: 85,
      completedLessons: 38,
      lastAccessed: '1 day ago',
      category: 'Data Science',
      certificate: true,
      certificateEarned: false
    },
    {
      id: '3',
      title: 'Machine Learning A-Z',
      instructor: 'Dr. Emily Rodriguez',
      thumbnail: 'https://picsum.photos/400/225?random=3',
      progress: 100,
      totalLessons: 95,
      completedLessons: 95,
      lastAccessed: '3 days ago',
      category: 'AI & ML',
      certificate: true,
      certificateEarned: true
    },
    {
      id: '4',
      title: 'Digital Marketing Masterclass',
      instructor: 'James Wilson',
      thumbnail: 'https://picsum.photos/400/225?random=4',
      progress: 30,
      totalLessons: 60,
      completedLessons: 18,
      lastAccessed: '5 days ago',
      category: 'Marketing',
      certificate: true,
      certificateEarned: false
    },
    {
      id: '5',
      title: 'Advanced React & Redux',
      instructor: 'Alex Thompson',
      thumbnail: 'https://picsum.photos/400/225?random=5',
      progress: 100,
      totalLessons: 75,
      completedLessons: 75,
      lastAccessed: '1 week ago',
      category: 'Web Development',
      certificate: true,
      certificateEarned: true
    }
  ];

  const stats = {
    totalCourses: courses.length,
    inProgress: courses.filter(c => c.progress > 0 && c.progress < 100).length,
    completed: courses.filter(c => c.progress === 100).length,
    certificates: courses.filter(c => c.certificateEarned).length,
    totalHours: 247,
    streak: 12
  };

  const filteredCourses = courses.filter(course => {
    if (activeTab === 'in-progress') return course.progress > 0 && course.progress < 100;
    if (activeTab === 'completed') return course.progress === 100;
    if (activeTab === 'saved') return false; // Would filter saved courses
    return true;
  });

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (sortBy === 'progress') return b.progress - a.progress;
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    return 0; // recent is default order
  });

  return (
    <div className="my-courses">
      <div className="courses-container">
        <h1>My Learning</h1>

        {/* Stats Overview */}
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-icon">📚</span>
            <div className="stat-info">
              <span className="stat-value">{stats.totalCourses}</span>
              <span className="stat-label">Total Courses</span>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">📖</span>
            <div className="stat-info">
              <span className="stat-value">{stats.inProgress}</span>
              <span className="stat-label">In Progress</span>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">✅</span>
            <div className="stat-info">
              <span className="stat-value">{stats.completed}</span>
              <span className="stat-label">Completed</span>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">🏆</span>
            <div className="stat-info">
              <span className="stat-value">{stats.certificates}</span>
              <span className="stat-label">Certificates</span>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">⏱️</span>
            <div className="stat-info">
              <span className="stat-value">{stats.totalHours}</span>
              <span className="stat-label">Hours Learned</span>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">🔥</span>
            <div className="stat-info">
              <span className="stat-value">{stats.streak}</span>
              <span className="stat-label">Day Streak</span>
            </div>
          </div>
        </div>

        {/* Tabs and Filters */}
        <div className="courses-controls">
          <div className="courses-tabs">
            <button
              className={activeTab === 'in-progress' ? 'active' : ''}
              onClick={() => setActiveTab('in-progress')}
            >
              In Progress ({stats.inProgress})
            </button>
            <button
              className={activeTab === 'completed' ? 'active' : ''}
              onClick={() => setActiveTab('completed')}
            >
              Completed ({stats.completed})
            </button>
            <button
              className={activeTab === 'saved' ? 'active' : ''}
              onClick={() => setActiveTab('saved')}
            >
              Saved
            </button>
          </div>

          <div className="courses-sort">
            <label>Sort by:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
              <option value="recent">Recently Accessed</option>
              <option value="progress">Progress</option>
              <option value="title">Title</option>
            </select>
          </div>
        </div>

        {/* Courses Grid */}
        {sortedCourses.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📚</span>
            <h2>No courses found</h2>
            <p>Start learning by exploring our course catalog</p>
            <a href="/learning" className="browse-btn">Browse Courses</a>
          </div>
        ) : (
          <div className="courses-grid">
            {sortedCourses.map(course => (
              <div key={course.id} className="course-card">
                <div className="course-thumbnail">
                  <img src={course.thumbnail} alt={course.title} />
                  {course.certificateEarned && (
                    <div className="certificate-badge">🏆 Certificate Earned</div>
                  )}
                  <div className="course-progress-overlay">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="course-info">
                  <span className="course-category">{course.category}</span>
                  <h3>{course.title}</h3>
                  <p className="course-instructor">By {course.instructor}</p>

                  <div className="course-stats">
                    <span>{course.completedLessons}/{course.totalLessons} lessons</span>
                    <span>{course.progress}% complete</span>
                  </div>

                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>

                  <div className="course-meta">
                    <span className="last-accessed">Last accessed {course.lastAccessed}</span>
                  </div>

                  <div className="course-actions">
                    {course.progress === 100 ? (
                      <>
                        <button className="review-btn">Review Course</button>
                        {course.certificateEarned && (
                          <button className="certificate-btn">View Certificate</button>
                        )}
                      </>
                    ) : (
                      <button className="continue-btn">Continue Learning →</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Recommendations */}
        <div className="recommendations-section">
          <h2>Recommended for You</h2>
          <div className="recommendations-grid">
            <div className="recommendation-card">
              <img src="https://picsum.photos/300/169?random=10" alt="Course" />
              <div className="recommendation-info">
                <h4>Node.js Complete Guide</h4>
                <p>Based on your interest in Web Development</p>
                <button>Enroll Now</button>
              </div>
            </div>
            <div className="recommendation-card">
              <img src="https://picsum.photos/300/169?random=11" alt="Course" />
              <div className="recommendation-info">
                <h4>Advanced Python Programming</h4>
                <p>Continue your Python journey</p>
                <button>Enroll Now</button>
              </div>
            </div>
            <div className="recommendation-card">
              <img src="https://picsum.photos/300/169?random=12" alt="Course" />
              <div className="recommendation-info">
                <h4>Deep Learning Specialization</h4>
                <p>Next step after Machine Learning</p>
                <button>Enroll Now</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCourses;

