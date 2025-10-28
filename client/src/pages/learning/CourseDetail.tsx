import React, { useState } from 'react';
import './CourseDetail.css';

interface Course {
  id: string;
  title: string;
  subtitle: string;
  instructor: {
    name: string;
    title: string;
    avatar: string;
    rating: number;
    students: number;
  };
  rating: number;
  reviewCount: number;
  students: number;
  price: number;
  originalPrice?: number;
  thumbnail: string;
  previewVideo: string;
  description: string;
  whatYouLearn: string[];
  requirements: string[];
  curriculum: Array<{
    title: string;
    lectures: number;
    duration: string;
    lessons: Array<{
      title: string;
      duration: string;
      type: 'video' | 'quiz' | 'reading';
      preview: boolean;
    }>;
  }>;
  tags: string[];
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  language: string;
  lastUpdated: string;
  certificate: boolean;
}

const CourseDetail: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'curriculum' | 'instructor' | 'reviews'>('overview');
  const [expandedSection, setExpandedSection] = useState<number | null>(null);

  // Mock course data
  const course: Course = {
    id: 'course-1',
    title: 'Complete Web Development Bootcamp 2025',
    subtitle: 'Learn HTML, CSS, JavaScript, React, Node.js, and more',
    instructor: {
      name: 'Dr. Sarah Johnson',
      title: 'Senior Software Engineer',
      avatar: 'https://i.pravatar.cc/150?img=5',
      rating: 4.9,
      students: 125000
    },
    rating: 4.8,
    reviewCount: 45230,
    students: 187500,
    price: 89.99,
    originalPrice: 199.99,
    thumbnail: 'https://picsum.photos/800/450?random=1',
    previewVideo: 'https://example.com/preview.mp4',
    description: 'Master web development from scratch with this comprehensive bootcamp. Learn modern technologies including HTML5, CSS3, JavaScript ES6+, React, Node.js, Express, MongoDB, and more. Build real-world projects and get job-ready skills.',
    whatYouLearn: [
      'Build responsive websites with HTML5 and CSS3',
      'Master JavaScript fundamentals and ES6+ features',
      'Create dynamic web apps with React and Redux',
      'Build backend APIs with Node.js and Express',
      'Work with MongoDB and SQL databases',
      'Deploy applications to production',
      'Implement authentication and authorization',
      'Write clean, maintainable code following best practices'
    ],
    requirements: [
      'A computer with internet connection',
      'No prior programming experience required',
      'Willingness to learn and practice',
      'Basic computer skills'
    ],
    curriculum: [
      {
        title: 'Introduction to Web Development',
        lectures: 12,
        duration: '1h 45m',
        lessons: [
          { title: 'Welcome to the Course', duration: '5:30', type: 'video', preview: true },
          { title: 'How the Web Works', duration: '12:15', type: 'video', preview: true },
          { title: 'Setting Up Your Development Environment', duration: '18:45', type: 'video', preview: false },
          { title: 'Your First Web Page', duration: '15:20', type: 'video', preview: false }
        ]
      },
      {
        title: 'HTML5 Fundamentals',
        lectures: 24,
        duration: '3h 20m',
        lessons: [
          { title: 'HTML Basics', duration: '10:30', type: 'video', preview: false },
          { title: 'Semantic HTML', duration: '14:45', type: 'video', preview: false },
          { title: 'Forms and Input Elements', duration: '22:15', type: 'video', preview: false },
          { title: 'HTML5 Quiz', duration: '10:00', type: 'quiz', preview: false }
        ]
      },
      {
        title: 'CSS3 Mastery',
        lectures: 30,
        duration: '4h 15m',
        lessons: [
          { title: 'CSS Selectors', duration: '16:30', type: 'video', preview: false },
          { title: 'Flexbox Layout', duration: '25:45', type: 'video', preview: false },
          { title: 'CSS Grid', duration: '28:20', type: 'video', preview: false },
          { title: 'Responsive Design', duration: '32:15', type: 'video', preview: false }
        ]
      }
    ],
    tags: ['Web Development', 'JavaScript', 'React', 'Node.js', 'Full Stack'],
    level: 'Beginner',
    language: 'English',
    lastUpdated: '2025-10-15',
    certificate: true
  };

  const handleEnroll = () => {
    alert('Enrolling in course...');
  };

  const toggleSection = (index: number) => {
    setExpandedSection(expandedSection === index ? null : index);
  };

  const totalLectures = course.curriculum.reduce((sum, section) => sum + section.lectures, 0);
  const totalDuration = course.curriculum.reduce((sum, section) => {
    const [hours, minutes] = section.duration.split('h ');
    return sum + parseInt(hours) * 60 + parseInt(minutes);
  }, 0);

  return (
    <div className="course-detail">
      {/* Hero Section */}
      <div className="course-hero">
        <div className="hero-content">
          <div className="breadcrumb">
            <a href="/learning">Courses</a> / <a href={`/learning/category/${course.tags[0]}`}>{course.tags[0]}</a> / {course.title}
          </div>
          <h1>{course.title}</h1>
          <p className="subtitle">{course.subtitle}</p>
          
          <div className="course-meta">
            <div className="rating">
              <span className="rating-value">{course.rating}</span>
              <div className="stars">{'★'.repeat(Math.floor(course.rating))}{'☆'.repeat(5 - Math.floor(course.rating))}</div>
              <span className="review-count">({course.reviewCount.toLocaleString()} reviews)</span>
            </div>
            <span className="students">{course.students.toLocaleString()} students</span>
          </div>

          <div className="instructor-info">
            <span>Created by</span>
            <a href={`/instructor/${course.instructor.name}`}>{course.instructor.name}</a>
          </div>

          <div className="course-info-tags">
            <span>📅 Last updated {course.lastUpdated}</span>
            <span>🌐 {course.language}</span>
            <span>📜 Certificate of completion</span>
          </div>
        </div>

        <div className="course-card">
          <div className="course-preview">
            <img src={course.thumbnail} alt={course.title} />
            <button className="preview-btn">▶️ Preview this course</button>
          </div>
          
          <div className="course-price">
            <span className="current-price">${course.price}</span>
            {course.originalPrice && (
              <>
                <span className="original-price">${course.originalPrice}</span>
                <span className="discount">{Math.round((1 - course.price / course.originalPrice) * 100)}% off</span>
              </>
            )}
          </div>

          <button className="enroll-btn" onClick={handleEnroll}>
            Enroll Now
          </button>

          <div className="course-includes">
            <h4>This course includes:</h4>
            <ul>
              <li>📹 {totalLectures} lectures ({Math.floor(totalDuration / 60)}h {totalDuration % 60}m)</li>
              <li>📄 Downloadable resources</li>
              <li>📱 Access on mobile and TV</li>
              <li>♾️ Full lifetime access</li>
              <li>🏆 Certificate of completion</li>
            </ul>
          </div>

          <div className="course-share">
            <button>🔗 Share</button>
            <button>❤️ Save</button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="course-main">
        <div className="course-tabs">
          <button
            className={selectedTab === 'overview' ? 'active' : ''}
            onClick={() => setSelectedTab('overview')}
          >
            Overview
          </button>
          <button
            className={selectedTab === 'curriculum' ? 'active' : ''}
            onClick={() => setSelectedTab('curriculum')}
          >
            Curriculum
          </button>
          <button
            className={selectedTab === 'instructor' ? 'active' : ''}
            onClick={() => setSelectedTab('instructor')}
          >
            Instructor
          </button>
          <button
            className={selectedTab === 'reviews' ? 'active' : ''}
            onClick={() => setSelectedTab('reviews')}
          >
            Reviews
          </button>
        </div>

        <div className="tab-content">
          {selectedTab === 'overview' && (
            <div className="overview-content">
              <section className="what-you-learn">
                <h2>What you'll learn</h2>
                <div className="learn-grid">
                  {course.whatYouLearn.map((item, index) => (
                    <div key={index} className="learn-item">
                      <span className="check">✓</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="description">
                <h2>Description</h2>
                <p>{course.description}</p>
              </section>

              <section className="requirements">
                <h2>Requirements</h2>
                <ul>
                  {course.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </section>

              <section className="tags">
                {course.tags.map(tag => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </section>
            </div>
          )}

          {selectedTab === 'curriculum' && (
            <div className="curriculum-content">
              <div className="curriculum-header">
                <h2>Course Curriculum</h2>
                <p>{course.curriculum.length} sections • {totalLectures} lectures • {Math.floor(totalDuration / 60)}h {totalDuration % 60}m total length</p>
              </div>

              {course.curriculum.map((section, index) => (
                <div key={index} className="curriculum-section">
                  <div className="section-header" onClick={() => toggleSection(index)}>
                    <div className="section-title">
                      <span className="expand-icon">{expandedSection === index ? '▼' : '▶'}</span>
                      <h3>{section.title}</h3>
                    </div>
                    <span className="section-info">{section.lectures} lectures • {section.duration}</span>
                  </div>

                  {expandedSection === index && (
                    <div className="section-lessons">
                      {section.lessons.map((lesson, lessonIndex) => (
                        <div key={lessonIndex} className="lesson-item">
                          <span className="lesson-type">
                            {lesson.type === 'video' && '▶️'}
                            {lesson.type === 'quiz' && '📝'}
                            {lesson.type === 'reading' && '📄'}
                          </span>
                          <span className="lesson-title">{lesson.title}</span>
                          {lesson.preview && <span className="preview-badge">Preview</span>}
                          <span className="lesson-duration">{lesson.duration}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {selectedTab === 'instructor' && (
            <div className="instructor-content">
              <div className="instructor-profile">
                <img src={course.instructor.avatar} alt={course.instructor.name} />
                <div className="instructor-details">
                  <h2>{course.instructor.name}</h2>
                  <p className="instructor-title">{course.instructor.title}</p>
                  <div className="instructor-stats">
                    <span>⭐ {course.instructor.rating} Instructor Rating</span>
                    <span>👥 {course.instructor.students.toLocaleString()} Students</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'reviews' && (
            <div className="reviews-content">
              <div className="reviews-summary">
                <div className="average-rating">
                  <span className="rating-number">{course.rating}</span>
                  <div className="stars">{'★'.repeat(Math.floor(course.rating))}{'☆'.repeat(5 - Math.floor(course.rating))}</div>
                  <span className="total-reviews">{course.reviewCount.toLocaleString()} reviews</span>
                </div>
              </div>
              <p>Reviews coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;

