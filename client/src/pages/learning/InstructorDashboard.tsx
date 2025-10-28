import React, { useState } from 'react';
import './InstructorDashboard.css';

interface Course {
  id: string;
  title: string;
  thumbnail: string;
  students: number;
  revenue: number;
  rating: number;
  reviews: number;
  status: 'published' | 'draft' | 'pending';
  progress: number;
}

interface Student {
  id: string;
  name: string;
  avatar: string;
  course: string;
  progress: number;
  lastActive: string;
  enrolled: string;
}

const InstructorDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'students' | 'analytics' | 'earnings'>('overview');

  const stats = {
    totalStudents: 2847,
    totalRevenue: 89450.75,
    activeCourses: 12,
    avgRating: 4.8,
    totalEnrollments: 5234,
    completionRate: 78.5,
    monthlyEarnings: 12340.50,
    courseViews: 45678
  };

  const courses: Course[] = [
    {
      id: '1',
      title: 'Complete Web Development Bootcamp 2025',
      thumbnail: 'https://picsum.photos/300/200?random=1',
      students: 1234,
      revenue: 34567.89,
      rating: 4.9,
      reviews: 456,
      status: 'published',
      progress: 100
    },
    {
      id: '2',
      title: 'Advanced React & Next.js Masterclass',
      thumbnail: 'https://picsum.photos/300/200?random=2',
      students: 892,
      revenue: 25678.45,
      rating: 4.8,
      reviews: 234,
      status: 'published',
      progress: 100
    },
    {
      id: '3',
      title: 'AI & Machine Learning Fundamentals',
      thumbnail: 'https://picsum.photos/300/200?random=3',
      students: 567,
      revenue: 18945.23,
      rating: 4.7,
      reviews: 189,
      status: 'published',
      progress: 100
    },
    {
      id: '4',
      title: 'Blockchain Development with Solidity',
      thumbnail: 'https://picsum.photos/300/200?random=4',
      students: 0,
      revenue: 0,
      rating: 0,
      reviews: 0,
      status: 'draft',
      progress: 65
    }
  ];

  const recentStudents: Student[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      avatar: 'https://i.pravatar.cc/150?img=1',
      course: 'Complete Web Development Bootcamp 2025',
      progress: 85,
      lastActive: '2 hours ago',
      enrolled: '2025-10-15'
    },
    {
      id: '2',
      name: 'Michael Chen',
      avatar: 'https://i.pravatar.cc/150?img=2',
      course: 'Advanced React & Next.js Masterclass',
      progress: 62,
      lastActive: '5 hours ago',
      enrolled: '2025-10-20'
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      avatar: 'https://i.pravatar.cc/150?img=3',
      course: 'AI & Machine Learning Fundamentals',
      progress: 45,
      lastActive: '1 day ago',
      enrolled: '2025-10-22'
    },
    {
      id: '4',
      name: 'David Kim',
      avatar: 'https://i.pravatar.cc/150?img=4',
      course: 'Complete Web Development Bootcamp 2025',
      progress: 92,
      lastActive: '3 hours ago',
      enrolled: '2025-10-10'
    }
  ];

  return (
    <div className="instructor-dashboard">
      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1>Instructor Dashboard</h1>
            <p>Manage your courses, students, and earnings</p>
          </div>
          <button className="create-course-btn">
            ➕ Create New Course
          </button>
        </div>

        {/* Tabs */}
        <div className="dashboard-tabs">
          <button
            className={activeTab === 'overview' ? 'active' : ''}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button
            className={activeTab === 'courses' ? 'active' : ''}
            onClick={() => setActiveTab('courses')}
          >
            📚 My Courses
          </button>
          <button
            className={activeTab === 'students' ? 'active' : ''}
            onClick={() => setActiveTab('students')}
          >
            👥 Students
          </button>
          <button
            className={activeTab === 'analytics' ? 'active' : ''}
            onClick={() => setActiveTab('analytics')}
          >
            📈 Analytics
          </button>
          <button
            className={activeTab === 'earnings' ? 'active' : ''}
            onClick={() => setActiveTab('earnings')}
          >
            💰 Earnings
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="overview-content">
            {/* Stats Grid */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-info">
                  <div className="stat-value">{stats.totalStudents.toLocaleString()}</div>
                  <div className="stat-label">Total Students</div>
                  <div className="stat-change positive">+234 this month</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <div className="stat-info">
                  <div className="stat-value">${stats.totalRevenue.toLocaleString()}</div>
                  <div className="stat-label">Total Revenue</div>
                  <div className="stat-change positive">+15.3% this month</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">📚</div>
                <div className="stat-info">
                  <div className="stat-value">{stats.activeCourses}</div>
                  <div className="stat-label">Active Courses</div>
                  <div className="stat-change neutral">1 in draft</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">⭐</div>
                <div className="stat-info">
                  <div className="stat-value">{stats.avgRating}</div>
                  <div className="stat-label">Average Rating</div>
                  <div className="stat-change positive">+0.2 points</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">📝</div>
                <div className="stat-info">
                  <div className="stat-value">{stats.totalEnrollments.toLocaleString()}</div>
                  <div className="stat-label">Total Enrollments</div>
                  <div className="stat-change positive">+456 this week</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">✅</div>
                <div className="stat-info">
                  <div className="stat-value">{stats.completionRate}%</div>
                  <div className="stat-label">Completion Rate</div>
                  <div className="stat-change positive">+3.2%</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">💵</div>
                <div className="stat-info">
                  <div className="stat-value">${stats.monthlyEarnings.toLocaleString()}</div>
                  <div className="stat-label">This Month</div>
                  <div className="stat-change positive">+$2,340</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">👁️</div>
                <div className="stat-info">
                  <div className="stat-value">{stats.courseViews.toLocaleString()}</div>
                  <div className="stat-label">Course Views</div>
                  <div className="stat-change positive">+1,234</div>
                </div>
              </div>
            </div>

            {/* Recent Students */}
            <div className="section-card">
              <h2>Recent Student Activity</h2>
              <div className="students-list">
                {recentStudents.map(student => (
                  <div key={student.id} className="student-item">
                    <img src={student.avatar} alt={student.name} className="student-avatar" />
                    <div className="student-details">
                      <h4>{student.name}</h4>
                      <p className="student-course">{student.course}</p>
                      <div className="student-meta">
                        <span>Enrolled: {new Date(student.enrolled).toLocaleDateString()}</span>
                        <span>Last active: {student.lastActive}</span>
                      </div>
                    </div>
                    <div className="student-progress">
                      <div className="progress-circle">{student.progress}%</div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${student.progress}%` }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Courses */}
            <div className="section-card">
              <h2>Top Performing Courses</h2>
              <div className="courses-grid-mini">
                {courses.filter(c => c.status === 'published').slice(0, 3).map(course => (
                  <div key={course.id} className="course-card-mini">
                    <img src={course.thumbnail} alt={course.title} />
                    <div className="course-info-mini">
                      <h4>{course.title}</h4>
                      <div className="course-stats-mini">
                        <span>👥 {course.students}</span>
                        <span>⭐ {course.rating}</span>
                        <span>💰 ${course.revenue.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <div className="courses-content">
            <div className="courses-filters">
              <button className="filter-btn active">All ({courses.length})</button>
              <button className="filter-btn">Published ({courses.filter(c => c.status === 'published').length})</button>
              <button className="filter-btn">Draft ({courses.filter(c => c.status === 'draft').length})</button>
            </div>

            <div className="courses-list">
              {courses.map(course => (
                <div key={course.id} className="course-card">
                  <img src={course.thumbnail} alt={course.title} />
                  <div className="course-details">
                    <h3>{course.title}</h3>
                    <div className="course-meta">
                      <span>👥 {course.students} students</span>
                      <span>⭐ {course.rating} ({course.reviews} reviews)</span>
                      <span>💰 ${course.revenue.toLocaleString()}</span>
                    </div>
                    {course.status === 'draft' && (
                      <div className="course-progress-info">
                        <span>Course completion: {course.progress}%</span>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${course.progress}%` }}></div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="course-status">
                    <span className={`status-badge ${course.status}`}>
                      {course.status}
                    </span>
                  </div>
                  <div className="course-actions">
                    <button className="edit-btn">✏️ Edit</button>
                    <button className="view-btn">👁️ View</button>
                    <button className="stats-btn">📊 Stats</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Students Tab */}
        {activeTab === 'students' && (
          <div className="students-content">
            <div className="students-header">
              <input type="text" placeholder="Search students..." className="search-input" />
              <select className="filter-select">
                <option>All Courses</option>
                {courses.filter(c => c.status === 'published').map(course => (
                  <option key={course.id}>{course.title}</option>
                ))}
              </select>
            </div>

            <div className="students-table">
              <table>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Course</th>
                    <th>Progress</th>
                    <th>Enrolled</th>
                    <th>Last Active</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentStudents.map(student => (
                    <tr key={student.id}>
                      <td>
                        <div className="student-cell">
                          <img src={student.avatar} alt={student.name} />
                          <span>{student.name}</span>
                        </div>
                      </td>
                      <td>{student.course}</td>
                      <td>
                        <div className="progress-cell">
                          <span>{student.progress}%</span>
                          <div className="progress-bar-small">
                            <div className="progress-fill" style={{ width: `${student.progress}%` }}></div>
                          </div>
                        </div>
                      </td>
                      <td>{new Date(student.enrolled).toLocaleDateString()}</td>
                      <td>{student.lastActive}</td>
                      <td>
                        <button className="action-btn-small">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="analytics-content">
            <div className="analytics-grid">
              <div className="chart-card">
                <h3>Student Enrollment Trend</h3>
                <div className="chart-placeholder">📈 Enrollment chart</div>
              </div>

              <div className="chart-card">
                <h3>Revenue by Course</h3>
                <div className="chart-placeholder">💰 Revenue breakdown</div>
              </div>

              <div className="chart-card">
                <h3>Course Completion Rates</h3>
                <div className="chart-placeholder">✅ Completion chart</div>
              </div>

              <div className="chart-card">
                <h3>Student Engagement</h3>
                <div className="chart-placeholder">👥 Engagement metrics</div>
              </div>
            </div>
          </div>
        )}

        {/* Earnings Tab */}
        {activeTab === 'earnings' && (
          <div className="earnings-content">
            <div className="earnings-summary">
              <div className="earnings-card">
                <h3>Total Earnings</h3>
                <div className="earnings-amount">${stats.totalRevenue.toLocaleString()}</div>
                <p>All time</p>
              </div>
              <div className="earnings-card">
                <h3>This Month</h3>
                <div className="earnings-amount">${stats.monthlyEarnings.toLocaleString()}</div>
                <p>+15.3% from last month</p>
              </div>
              <div className="earnings-card">
                <h3>Pending Payout</h3>
                <div className="earnings-amount">$3,456.78</div>
                <p>Available on Nov 1</p>
              </div>
            </div>

            <div className="section-card">
              <h2>Earnings by Course</h2>
              <div className="earnings-list">
                {courses.filter(c => c.revenue > 0).map(course => (
                  <div key={course.id} className="earnings-item">
                    <div className="earnings-course-info">
                      <h4>{course.title}</h4>
                      <p>{course.students} students</p>
                    </div>
                    <div className="earnings-amount-large">
                      ${course.revenue.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorDashboard;

