/**
 * AETHERIAL Platform - E-Learning Instructor Dashboard
 * Complete instructor dashboard for managing courses, students, content, and analytics
 */

import React, { useState, useEffect } from 'react';
import { unifiedSystemHub } from '../../lib/integration/unified-system-hub';
import './InstructorDashboard.css';

interface Course {
  id: string;
  title: string;
  category: string;
  students: number;
  rating: number;
  revenue: number;
  status: 'published' | 'draft' | 'archived';
  progress: number;
}

interface Student {
  id: string;
  name: string;
  email: string;
  course: string;
  progress: number;
  lastActive: string;
  grade: number;
}

interface Analytics {
  totalStudents: number;
  totalRevenue: number;
  totalCourses: number;
  averageRating: number;
  completionRate: number;
  activeStudents: number;
}

export const InstructorDashboard: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'students' | 'content' | 'analytics'>('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    unifiedSystemHub.publishEvent({
      id: `instructor-dashboard-init-${Date.now()}`,
      timestamp: new Date(),
      source: 'instructor-dashboard',
      type: 'elearning.instructor.initialized',
      data: {},
      priority: 'high',
      propagate: true,
    });

    // Simulate loading data
    setTimeout(() => {
      setCourses([
        {
          id: 'course_1',
          title: 'Advanced Quantum Computing',
          category: 'Technology',
          students: 1234,
          rating: 4.8,
          revenue: 24680,
          status: 'published',
          progress: 100
        },
        {
          id: 'course_2',
          title: 'AI & Machine Learning Fundamentals',
          category: 'Technology',
          students: 2567,
          rating: 4.9,
          revenue: 51340,
          status: 'published',
          progress: 100
        },
        {
          id: 'course_3',
          title: 'Blockchain Development Masterclass',
          category: 'Technology',
          students: 892,
          rating: 4.7,
          revenue: 17840,
          status: 'published',
          progress: 100
        },
        {
          id: 'course_4',
          title: 'IoT and Smart Devices',
          category: 'Technology',
          students: 0,
          rating: 0,
          revenue: 0,
          status: 'draft',
          progress: 65
        }
      ]);

      setStudents([
        {
          id: 'student_1',
          name: 'Alice Johnson',
          email: 'alice@example.com',
          course: 'Advanced Quantum Computing',
          progress: 85,
          lastActive: '2025-10-28',
          grade: 92
        },
        {
          id: 'student_2',
          name: 'Bob Smith',
          email: 'bob@example.com',
          course: 'AI & Machine Learning Fundamentals',
          progress: 60,
          lastActive: '2025-10-27',
          grade: 88
        },
        {
          id: 'student_3',
          name: 'Carol Williams',
          email: 'carol@example.com',
          course: 'Blockchain Development Masterclass',
          progress: 95,
          lastActive: '2025-10-28',
          grade: 95
        }
      ]);

      setAnalytics({
        totalStudents: 4693,
        totalRevenue: 93860,
        totalCourses: 4,
        averageRating: 4.8,
        completionRate: 78.5,
        activeStudents: 3245
      });

      setLoading(false);
    }, 1000);
  }, []);

  const handleCreateCourse = () => {
    alert('Create Course - Opens course creation wizard');
  };

  const handleEditCourse = (courseId: string) => {
    alert(`Edit course: ${courseId}`);
  };

  const handleMessageStudent = (studentId: string) => {
    alert(`Message student: ${studentId}`);
  };

  if (loading) {
    return (
      <div className="instructor-dashboard">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading instructor dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="instructor-dashboard">
      <header className="instructor-header">
        <h1>👨‍🏫 Instructor Dashboard</h1>
        <p>Manage your courses, students, content, and track performance</p>
      </header>

      <div className="instructor-tabs">
        <button className={`tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Overview</button>
        <button className={`tab ${activeTab === 'courses' ? 'active' : ''}`} onClick={() => setActiveTab('courses')}>My Courses</button>
        <button className={`tab ${activeTab === 'students' ? 'active' : ''}`} onClick={() => setActiveTab('students')}>Students</button>
        <button className={`tab ${activeTab === 'content' ? 'active' : ''}`} onClick={() => setActiveTab('content')}>Content Library</button>
        <button className={`tab ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>Analytics</button>
      </div>

      <div className="instructor-content">
        {activeTab === 'overview' && analytics && (
          <div className="overview-section">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-value">{analytics.totalStudents.toLocaleString()}</div>
                <div className="stat-label">Total Students</div>
                <div className="stat-subtext">{analytics.activeStudents.toLocaleString()} active</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <div className="stat-value">${analytics.totalRevenue.toLocaleString()}</div>
                <div className="stat-label">Total Revenue</div>
                <div className="stat-subtext">+15.3% from last month</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📚</div>
                <div className="stat-value">{analytics.totalCourses}</div>
                <div className="stat-label">Total Courses</div>
                <div className="stat-subtext">{courses.filter(c => c.status === 'published').length} published</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⭐</div>
                <div className="stat-value">{analytics.averageRating.toFixed(1)}</div>
                <div className="stat-label">Average Rating</div>
                <div className="stat-subtext">Across all courses</div>
              </div>
            </div>

            <div className="quick-actions">
              <h2>Quick Actions</h2>
              <div className="actions-grid">
                <button className="action-btn" onClick={handleCreateCourse}>
                  <span className="action-icon">➕</span>
                  <span className="action-text">Create New Course</span>
                </button>
                <button className="action-btn">
                  <span className="action-icon">📹</span>
                  <span className="action-text">Upload Video</span>
                </button>
                <button className="action-btn">
                  <span className="action-icon">📝</span>
                  <span className="action-text">Create Quiz</span>
                </button>
                <button className="action-btn">
                  <span className="action-icon">💬</span>
                  <span className="action-text">Message Students</span>
                </button>
              </div>
            </div>

            <div className="recent-activity">
              <h2>Recent Activity</h2>
              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-icon">🎓</div>
                  <div className="activity-details">
                    <strong>Carol Williams</strong> completed <strong>Blockchain Development Masterclass</strong>
                    <div className="activity-time">2 hours ago</div>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">⭐</div>
                  <div className="activity-details">
                    <strong>New 5-star review</strong> on <strong>AI & Machine Learning Fundamentals</strong>
                    <div className="activity-time">5 hours ago</div>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">👤</div>
                  <div className="activity-details">
                    <strong>15 new students</strong> enrolled in your courses
                    <div className="activity-time">Today</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="courses-section">
            <div className="section-header">
              <h2>My Courses</h2>
              <button className="btn btn-primary" onClick={handleCreateCourse}>+ Create Course</button>
            </div>
            <div className="courses-grid">
              {courses.map(course => (
                <div key={course.id} className="course-card">
                  <div className="course-header">
                    <h3>{course.title}</h3>
                    <span className={`status-badge ${course.status}`}>{course.status}</span>
                  </div>
                  <div className="course-category">{course.category}</div>
                  <div className="course-stats">
                    <div className="stat-item">
                      <span className="stat-icon">👥</span>
                      <span>{course.students} students</span>
                    </div>
                    {course.rating > 0 && (
                      <div className="stat-item">
                        <span className="stat-icon">⭐</span>
                        <span>{course.rating.toFixed(1)} rating</span>
                      </div>
                    )}
                    <div className="stat-item">
                      <span className="stat-icon">💰</span>
                      <span>${course.revenue.toLocaleString()}</span>
                    </div>
                  </div>
                  {course.status === 'draft' && (
                    <div className="course-progress">
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${course.progress}%` }}></div>
                      </div>
                      <div className="progress-text">{course.progress}% complete</div>
                    </div>
                  )}
                  <div className="course-actions">
                    <button className="btn btn-small" onClick={() => handleEditCourse(course.id)}>Edit</button>
                    <button className="btn btn-small btn-secondary">View</button>
                    <button className="btn btn-small btn-secondary">Analytics</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'students' && (
          <div className="students-section">
            <h2>Students</h2>
            <div className="students-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Course</th>
                    <th>Progress</th>
                    <th>Grade</th>
                    <th>Last Active</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(student => (
                    <tr key={student.id}>
                      <td>{student.name}</td>
                      <td>{student.email}</td>
                      <td>{student.course}</td>
                      <td>
                        <div className="progress-bar-small">
                          <div className="progress-fill" style={{ width: `${student.progress}%` }}></div>
                        </div>
                        <span className="progress-text-small">{student.progress}%</span>
                      </td>
                      <td>
                        <span className={`grade-badge ${student.grade >= 90 ? 'excellent' : student.grade >= 80 ? 'good' : 'average'}`}>
                          {student.grade}%
                        </span>
                      </td>
                      <td>{student.lastActive}</td>
                      <td>
                        <button className="btn btn-small" onClick={() => handleMessageStudent(student.id)}>Message</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="content-section">
            <div className="section-header">
              <h2>Content Library</h2>
              <button className="btn btn-primary">+ Upload Content</button>
            </div>
            <div className="content-types">
              <div className="content-type-card">
                <div className="content-icon">📹</div>
                <h3>Videos</h3>
                <p>45 videos • 12.5 hours</p>
                <button className="btn btn-small">Manage</button>
              </div>
              <div className="content-type-card">
                <div className="content-icon">📄</div>
                <h3>Documents</h3>
                <p>28 documents • 340 pages</p>
                <button className="btn btn-small">Manage</button>
              </div>
              <div className="content-type-card">
                <div className="content-icon">📝</div>
                <h3>Quizzes</h3>
                <p>15 quizzes • 180 questions</p>
                <button className="btn btn-small">Manage</button>
              </div>
              <div className="content-type-card">
                <div className="content-icon">💻</div>
                <h3>Assignments</h3>
                <p>12 assignments</p>
                <button className="btn btn-small">Manage</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && analytics && (
          <div className="analytics-section">
            <h2>Course Analytics</h2>
            <div className="analytics-grid">
              <div className="analytics-card">
                <h3>Completion Rate</h3>
                <div className="analytics-value">{analytics.completionRate}%</div>
                <p>Students who completed courses</p>
              </div>
              <div className="analytics-card">
                <h3>Engagement Rate</h3>
                <div className="analytics-value">82.3%</div>
                <p>Active student participation</p>
              </div>
              <div className="analytics-card">
                <h3>Average Watch Time</h3>
                <div className="analytics-value">45 min</div>
                <p>Per session per student</p>
              </div>
              <div className="analytics-card">
                <h3>Student Satisfaction</h3>
                <div className="analytics-value">{analytics.averageRating}/5.0</div>
                <p>Based on course reviews</p>
              </div>
            </div>
            <div className="chart-placeholder">
              <h3>Revenue & Enrollment Trends</h3>
              <p>📈 Monthly revenue and student enrollment chart (visualization would go here)</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorDashboard;

