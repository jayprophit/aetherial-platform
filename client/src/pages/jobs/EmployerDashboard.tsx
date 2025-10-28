import React, { useState } from 'react';
import './EmployerDashboard.css';

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'remote';
  applications: number;
  views: number;
  status: 'active' | 'closed' | 'draft';
  postedDate: string;
  salary: string;
}

interface Applicant {
  id: string;
  name: string;
  avatar: string;
  position: string;
  experience: string;
  skills: string[];
  appliedDate: string;
  status: 'new' | 'reviewing' | 'shortlisted' | 'rejected' | 'hired';
  matchScore: number;
}

const EmployerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'jobs' | 'applicants' | 'analytics'>('overview');

  const stats = {
    activeJobs: 15,
    totalApplications: 1247,
    shortlisted: 89,
    hired: 23,
    avgTimeToHire: 18,
    applicationRate: 83.2,
    interviewScheduled: 34,
    totalViews: 45678
  };

  const jobs: Job[] = [
    {
      id: '1',
      title: 'Senior Full Stack Developer',
      department: 'Engineering',
      location: 'San Francisco, CA',
      type: 'full-time',
      applications: 234,
      views: 1567,
      status: 'active',
      postedDate: '2025-10-15',
      salary: '$120k - $180k'
    },
    {
      id: '2',
      title: 'Product Manager',
      department: 'Product',
      location: 'Remote',
      type: 'remote',
      applications: 189,
      views: 2134,
      status: 'active',
      postedDate: '2025-10-20',
      salary: '$130k - $160k'
    },
    {
      id: '3',
      title: 'UX/UI Designer',
      department: 'Design',
      location: 'New York, NY',
      type: 'full-time',
      applications: 156,
      views: 1892,
      status: 'active',
      postedDate: '2025-10-22',
      salary: '$90k - $130k'
    },
    {
      id: '4',
      title: 'DevOps Engineer',
      department: 'Engineering',
      location: 'Austin, TX',
      type: 'contract',
      applications: 0,
      views: 234,
      status: 'draft',
      postedDate: '2025-10-28',
      salary: '$110k - $150k'
    }
  ];

  const recentApplicants: Applicant[] = [
    {
      id: '1',
      name: 'Alex Thompson',
      avatar: 'https://i.pravatar.cc/150?img=11',
      position: 'Senior Full Stack Developer',
      experience: '8 years',
      skills: ['React', 'Node.js', 'TypeScript', 'AWS'],
      appliedDate: '2025-10-27',
      status: 'new',
      matchScore: 95
    },
    {
      id: '2',
      name: 'Maria Garcia',
      avatar: 'https://i.pravatar.cc/150?img=12',
      position: 'Product Manager',
      experience: '6 years',
      skills: ['Product Strategy', 'Agile', 'Data Analysis', 'Leadership'],
      appliedDate: '2025-10-26',
      status: 'reviewing',
      matchScore: 88
    },
    {
      id: '3',
      name: 'James Wilson',
      avatar: 'https://i.pravatar.cc/150?img=13',
      position: 'UX/UI Designer',
      experience: '5 years',
      skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
      appliedDate: '2025-10-25',
      status: 'shortlisted',
      matchScore: 92
    },
    {
      id: '4',
      name: 'Sophie Chen',
      avatar: 'https://i.pravatar.cc/150?img=14',
      position: 'Senior Full Stack Developer',
      experience: '7 years',
      skills: ['Vue.js', 'Python', 'Docker', 'PostgreSQL'],
      appliedDate: '2025-10-24',
      status: 'shortlisted',
      matchScore: 90
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#28a745';
      case 'closed': return '#dc3545';
      case 'draft': return '#ffc107';
      case 'new': return '#17a2b8';
      case 'reviewing': return '#ffc107';
      case 'shortlisted': return '#28a745';
      case 'rejected': return '#dc3545';
      case 'hired': return '#6f42c1';
      default: return '#6c757d';
    }
  };

  return (
    <div className="employer-dashboard">
      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1>Employer Dashboard</h1>
            <p>Manage job postings and applicants</p>
          </div>
          <button className="post-job-btn">
            ➕ Post New Job
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
            className={activeTab === 'jobs' ? 'active' : ''}
            onClick={() => setActiveTab('jobs')}
          >
            💼 Job Postings
          </button>
          <button
            className={activeTab === 'applicants' ? 'active' : ''}
            onClick={() => setActiveTab('applicants')}
          >
            👥 Applicants
          </button>
          <button
            className={activeTab === 'analytics' ? 'active' : ''}
            onClick={() => setActiveTab('analytics')}
          >
            📈 Analytics
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="overview-content">
            {/* Stats Grid */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">💼</div>
                <div className="stat-info">
                  <div className="stat-value">{stats.activeJobs}</div>
                  <div className="stat-label">Active Jobs</div>
                  <div className="stat-change neutral">1 in draft</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">📝</div>
                <div className="stat-info">
                  <div className="stat-value">{stats.totalApplications.toLocaleString()}</div>
                  <div className="stat-label">Total Applications</div>
                  <div className="stat-change positive">+156 this week</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">⭐</div>
                <div className="stat-info">
                  <div className="stat-value">{stats.shortlisted}</div>
                  <div className="stat-label">Shortlisted</div>
                  <div className="stat-change positive">+12 this week</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">✅</div>
                <div className="stat-info">
                  <div className="stat-value">{stats.hired}</div>
                  <div className="stat-label">Hired</div>
                  <div className="stat-change positive">+3 this month</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">⏱️</div>
                <div className="stat-info">
                  <div className="stat-value">{stats.avgTimeToHire} days</div>
                  <div className="stat-label">Avg Time to Hire</div>
                  <div className="stat-change positive">-2 days</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">📊</div>
                <div className="stat-info">
                  <div className="stat-value">{stats.applicationRate}%</div>
                  <div className="stat-label">Application Rate</div>
                  <div className="stat-change positive">+5.2%</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">📅</div>
                <div className="stat-info">
                  <div className="stat-value">{stats.interviewScheduled}</div>
                  <div className="stat-label">Interviews Scheduled</div>
                  <div className="stat-change positive">+8 this week</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">👁️</div>
                <div className="stat-info">
                  <div className="stat-value">{stats.totalViews.toLocaleString()}</div>
                  <div className="stat-label">Total Job Views</div>
                  <div className="stat-change positive">+2,345</div>
                </div>
              </div>
            </div>

            {/* Recent Applicants */}
            <div className="section-card">
              <h2>Recent Applicants</h2>
              <div className="applicants-list">
                {recentApplicants.map(applicant => (
                  <div key={applicant.id} className="applicant-item">
                    <img src={applicant.avatar} alt={applicant.name} className="applicant-avatar" />
                    <div className="applicant-details">
                      <h4>{applicant.name}</h4>
                      <p className="applicant-position">{applicant.position}</p>
                      <p className="applicant-experience">{applicant.experience} experience</p>
                      <div className="applicant-skills">
                        {applicant.skills.slice(0, 3).map((skill, idx) => (
                          <span key={idx} className="skill-tag">{skill}</span>
                        ))}
                      </div>
                    </div>
                    <div className="applicant-match">
                      <div className="match-score">{applicant.matchScore}%</div>
                      <p>Match</p>
                    </div>
                    <div className="applicant-status">
                      <span className="status-badge" style={{ background: getStatusColor(applicant.status) }}>
                        {applicant.status}
                      </span>
                      <p className="applied-date">Applied {new Date(applicant.appliedDate).toLocaleDateString()}</p>
                    </div>
                    <div className="applicant-actions">
                      <button className="view-btn-small">View</button>
                      <button className="shortlist-btn">Shortlist</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Jobs */}
            <div className="section-card">
              <h2>Top Performing Jobs</h2>
              <div className="jobs-grid-mini">
                {jobs.filter(j => j.status === 'active').slice(0, 3).map(job => (
                  <div key={job.id} className="job-card-mini">
                    <h4>{job.title}</h4>
                    <p className="job-department">{job.department} • {job.location}</p>
                    <div className="job-stats-mini">
                      <span>📝 {job.applications} applications</span>
                      <span>👁️ {job.views} views</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <div className="jobs-content">
            <div className="jobs-filters">
              <button className="filter-btn active">All ({jobs.length})</button>
              <button className="filter-btn">Active ({jobs.filter(j => j.status === 'active').length})</button>
              <button className="filter-btn">Draft ({jobs.filter(j => j.status === 'draft').length})</button>
              <button className="filter-btn">Closed ({jobs.filter(j => j.status === 'closed').length})</button>
            </div>

            <div className="jobs-list">
              {jobs.map(job => (
                <div key={job.id} className="job-card">
                  <div className="job-header">
                    <div>
                      <h3>{job.title}</h3>
                      <p className="job-meta">{job.department} • {job.location} • {job.type}</p>
                      <p className="job-salary">{job.salary}</p>
                    </div>
                    <span className="status-badge" style={{ background: getStatusColor(job.status) }}>
                      {job.status}
                    </span>
                  </div>
                  <div className="job-stats">
                    <div className="job-stat">
                      <span className="stat-number">{job.applications}</span>
                      <span className="stat-label">Applications</span>
                    </div>
                    <div className="job-stat">
                      <span className="stat-number">{job.views}</span>
                      <span className="stat-label">Views</span>
                    </div>
                    <div className="job-stat">
                      <span className="stat-number">{new Date(job.postedDate).toLocaleDateString()}</span>
                      <span className="stat-label">Posted</span>
                    </div>
                  </div>
                  <div className="job-actions">
                    <button className="edit-btn">✏️ Edit</button>
                    <button className="view-btn">👁️ View</button>
                    <button className="applicants-btn">👥 Applicants</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Applicants Tab */}
        {activeTab === 'applicants' && (
          <div className="applicants-content">
            <div className="applicants-filters">
              <input type="text" placeholder="Search applicants..." className="search-input" />
              <select className="filter-select">
                <option>All Jobs</option>
                {jobs.filter(j => j.status === 'active').map(job => (
                  <option key={job.id}>{job.title}</option>
                ))}
              </select>
              <select className="filter-select">
                <option>All Status</option>
                <option>New</option>
                <option>Reviewing</option>
                <option>Shortlisted</option>
                <option>Rejected</option>
                <option>Hired</option>
              </select>
            </div>

            <div className="applicants-table">
              <table>
                <thead>
                  <tr>
                    <th>Applicant</th>
                    <th>Position</th>
                    <th>Experience</th>
                    <th>Match</th>
                    <th>Status</th>
                    <th>Applied</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentApplicants.map(applicant => (
                    <tr key={applicant.id}>
                      <td>
                        <div className="applicant-cell">
                          <img src={applicant.avatar} alt={applicant.name} />
                          <span>{applicant.name}</span>
                        </div>
                      </td>
                      <td>{applicant.position}</td>
                      <td>{applicant.experience}</td>
                      <td>
                        <div className="match-cell">{applicant.matchScore}%</div>
                      </td>
                      <td>
                        <span className="status-badge" style={{ background: getStatusColor(applicant.status) }}>
                          {applicant.status}
                        </span>
                      </td>
                      <td>{new Date(applicant.appliedDate).toLocaleDateString()}</td>
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
                <h3>Application Trends</h3>
                <div className="chart-placeholder">📈 Application trends chart</div>
              </div>

              <div className="chart-card">
                <h3>Hiring Funnel</h3>
                <div className="chart-placeholder">🎯 Hiring funnel visualization</div>
              </div>

              <div className="chart-card">
                <h3>Time to Hire</h3>
                <div className="chart-placeholder">⏱️ Time to hire metrics</div>
              </div>

              <div className="chart-card">
                <h3>Source of Applications</h3>
                <div className="chart-placeholder">🌐 Application sources</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployerDashboard;

