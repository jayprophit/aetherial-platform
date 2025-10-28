import React, { useState } from 'react';
import './JobDetail.css';

interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Freelance';
  remote: boolean;
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  postedDate: string;
  applicants: number;
  description: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
  benefits: string[];
  skills: string[];
  experience: string;
  education: string;
  companyInfo: {
    size: string;
    industry: string;
    founded: string;
    website: string;
    description: string;
  };
}

const JobDetail: React.FC = () => {
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    resume: null as File | null,
    portfolio: '',
    availability: ''
  });

  // Mock job data
  const job: Job = {
    id: 'job-1',
    title: 'Senior Full Stack Developer',
    company: 'TechCorp Solutions',
    companyLogo: 'https://i.pravatar.cc/100?img=1',
    location: 'San Francisco, CA',
    type: 'Full-time',
    remote: true,
    salary: {
      min: 120000,
      max: 180000,
      currency: 'USD'
    },
    postedDate: '2 days ago',
    applicants: 47,
    description: 'We are seeking a talented Senior Full Stack Developer to join our growing engineering team. You will be responsible for designing, developing, and maintaining scalable web applications using modern technologies. This role offers the opportunity to work on cutting-edge projects and make a significant impact on our product.',
    responsibilities: [
      'Design and develop full-stack web applications using React, Node.js, and PostgreSQL',
      'Collaborate with cross-functional teams to define and implement new features',
      'Write clean, maintainable, and well-documented code',
      'Participate in code reviews and provide constructive feedback',
      'Optimize application performance and scalability',
      'Mentor junior developers and contribute to team knowledge sharing',
      'Stay up-to-date with emerging technologies and industry trends'
    ],
    requirements: [
      '5+ years of professional software development experience',
      'Strong proficiency in JavaScript/TypeScript, React, and Node.js',
      'Experience with SQL and NoSQL databases',
      'Solid understanding of RESTful APIs and microservices architecture',
      'Experience with Git and modern development workflows',
      'Strong problem-solving and analytical skills',
      'Excellent communication and teamwork abilities',
      'Bachelor\'s degree in Computer Science or related field'
    ],
    niceToHave: [
      'Experience with cloud platforms (AWS, Azure, or GCP)',
      'Knowledge of Docker and Kubernetes',
      'Familiarity with CI/CD pipelines',
      'Experience with GraphQL',
      'Contributions to open-source projects',
      'Experience with Agile/Scrum methodologies'
    ],
    benefits: [
      'Competitive salary and equity package',
      'Comprehensive health, dental, and vision insurance',
      'Flexible work hours and remote work options',
      '401(k) with company match',
      'Unlimited PTO and paid holidays',
      'Professional development budget',
      'Modern office with free snacks and beverages',
      'Team building events and company retreats'
    ],
    skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS', 'Docker', 'Git'],
    experience: '5+ years',
    education: 'Bachelor\'s degree',
    companyInfo: {
      size: '50-200 employees',
      industry: 'Software Development',
      founded: '2015',
      website: 'https://techcorp.example.com',
      description: 'TechCorp Solutions is a leading software development company specializing in enterprise solutions and cloud-based applications. We work with Fortune 500 companies to transform their digital presence and streamline their operations.'
    }
  };

  const handleApply = () => {
    setShowApplicationModal(true);
  };

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Application submitted successfully!');
    setShowApplicationModal(false);
  };

  const handleSaveJob = () => {
    alert('Job saved to your favorites!');
  };

  const handleShareJob = () => {
    alert('Share link copied to clipboard!');
  };

  return (
    <div className="job-detail">
      <div className="job-container">
        {/* Job Header */}
        <div className="job-header">
          <div className="job-header-content">
            <div className="company-logo">
              <img src={job.companyLogo} alt={job.company} />
            </div>
            <div className="job-title-section">
              <h1>{job.title}</h1>
              <div className="company-name">
                <a href={`/company/${job.company}`}>{job.company}</a>
              </div>
              <div className="job-meta">
                <span>📍 {job.location}</span>
                <span>💼 {job.type}</span>
                {job.remote && <span>🏠 Remote</span>}
                <span>💰 ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}</span>
              </div>
              <div className="job-stats">
                <span>Posted {job.postedDate}</span>
                <span>•</span>
                <span>{job.applicants} applicants</span>
              </div>
            </div>
          </div>

          <div className="job-actions">
            <button className="apply-btn" onClick={handleApply}>
              Apply Now
            </button>
            <button className="save-btn" onClick={handleSaveJob}>
              💾 Save
            </button>
            <button className="share-btn" onClick={handleShareJob}>
              🔗 Share
            </button>
          </div>
        </div>

        <div className="job-content">
          {/* Main Content */}
          <div className="job-main">
            {/* Description */}
            <section className="job-section">
              <h2>Job Description</h2>
              <p>{job.description}</p>
            </section>

            {/* Responsibilities */}
            <section className="job-section">
              <h2>Responsibilities</h2>
              <ul>
                {job.responsibilities.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>

            {/* Requirements */}
            <section className="job-section">
              <h2>Requirements</h2>
              <ul>
                {job.requirements.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>

            {/* Nice to Have */}
            <section className="job-section">
              <h2>Nice to Have</h2>
              <ul>
                {job.niceToHave.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>

            {/* Benefits */}
            <section className="job-section">
              <h2>Benefits</h2>
              <ul className="benefits-list">
                {job.benefits.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>

            {/* Skills */}
            <section className="job-section">
              <h2>Required Skills</h2>
              <div className="skills-tags">
                {job.skills.map(skill => (
                  <span key={skill} className="skill-tag">{skill}</span>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="job-sidebar">
            {/* Quick Apply Card */}
            <div className="sidebar-card">
              <h3>Quick Apply</h3>
              <button className="apply-btn-full" onClick={handleApply}>
                Apply for this Position
              </button>
              <p className="apply-note">Application takes ~5 minutes</p>
            </div>

            {/* Job Details Card */}
            <div className="sidebar-card">
              <h3>Job Details</h3>
              <div className="detail-item">
                <span className="detail-label">Job Type</span>
                <span className="detail-value">{job.type}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Experience</span>
                <span className="detail-value">{job.experience}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Education</span>
                <span className="detail-value">{job.education}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Remote Work</span>
                <span className="detail-value">{job.remote ? 'Yes' : 'No'}</span>
              </div>
            </div>

            {/* Company Info Card */}
            <div className="sidebar-card">
              <h3>About {job.company}</h3>
              <p>{job.companyInfo.description}</p>
              <div className="company-details">
                <div className="detail-item">
                  <span className="detail-label">Industry</span>
                  <span className="detail-value">{job.companyInfo.industry}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Company Size</span>
                  <span className="detail-value">{job.companyInfo.size}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Founded</span>
                  <span className="detail-value">{job.companyInfo.founded}</span>
                </div>
              </div>
              <a href={job.companyInfo.website} target="_blank" rel="noopener noreferrer" className="company-website">
                Visit Website →
              </a>
            </div>

            {/* Similar Jobs */}
            <div className="sidebar-card">
              <h3>Similar Jobs</h3>
              <div className="similar-jobs">
                <div className="similar-job-item">
                  <h4>Full Stack Engineer</h4>
                  <p>StartupXYZ • Remote</p>
                  <span className="salary">$100k - $150k</span>
                </div>
                <div className="similar-job-item">
                  <h4>Backend Developer</h4>
                  <p>MegaCorp • San Francisco</p>
                  <span className="salary">$130k - $170k</span>
                </div>
                <div className="similar-job-item">
                  <h4>React Developer</h4>
                  <p>InnovateTech • New York</p>
                  <span className="salary">$110k - $160k</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {showApplicationModal && (
        <div className="modal-overlay" onClick={() => setShowApplicationModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Apply for {job.title}</h2>
              <button className="close-btn" onClick={() => setShowApplicationModal(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitApplication}>
              <div className="form-group">
                <label>Cover Letter *</label>
                <textarea
                  required
                  rows={6}
                  placeholder="Tell us why you're a great fit for this role..."
                  value={applicationData.coverLetter}
                  onChange={(e) => setApplicationData({...applicationData, coverLetter: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Resume/CV *</label>
                <input
                  type="file"
                  required
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setApplicationData({...applicationData, resume: e.target.files?.[0] || null})}
                />
                <small>PDF, DOC, or DOCX (Max 5MB)</small>
              </div>

              <div className="form-group">
                <label>Portfolio URL</label>
                <input
                  type="url"
                  placeholder="https://yourportfolio.com"
                  value={applicationData.portfolio}
                  onChange={(e) => setApplicationData({...applicationData, portfolio: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Availability</label>
                <select
                  value={applicationData.availability}
                  onChange={(e) => setApplicationData({...applicationData, availability: e.target.value})}
                >
                  <option value="">Select availability</option>
                  <option value="immediate">Immediate</option>
                  <option value="2weeks">2 weeks notice</option>
                  <option value="1month">1 month notice</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowApplicationModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetail;

