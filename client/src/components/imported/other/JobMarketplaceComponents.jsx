import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ResponsiveLayout } from '../../lib/responsive/ResponsiveLayout';

// Job Listing Component
export const JobListing = ({ jobs, filters, onFilterChange }) => {
  const [filteredJobs, setFilteredJobs] = useState(jobs);
  const [sortOption, setSortOption] = useState('recent');
  
  useEffect(() => {
    let result = [...jobs];
    
    // Apply filters
    if (filters.category) {
      result = result.filter(job => job.category === filters.category);
    }
    
    if (filters.location) {
      result = result.filter(job => job.location.includes(filters.location));
    }
    
    if (filters.jobType) {
      result = result.filter(job => job.jobType === filters.jobType);
    }
    
    if (filters.minSalary) {
      result = result.filter(job => job.salary >= filters.minSalary);
    }
    
    if (filters.qualificationLevel) {
      result = result.filter(job => job.qualificationLevel >= filters.qualificationLevel);
    }
    
    // Apply sorting
    switch (sortOption) {
      case 'recent':
        result.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
        break;
      case 'salary-high':
        result.sort((a, b) => b.salary - a.salary);
        break;
      case 'salary-low':
        result.sort((a, b) => a.salary - b.salary);
        break;
      case 'relevance':
        // Relevance would be calculated based on user profile and skills
        break;
      default:
        break;
    }
    
    setFilteredJobs(result);
  }, [jobs, filters, sortOption]);
  
  return (
    <ResponsiveLayout>
      <div className="job-marketplace">
        <div className="job-filters">
          <h3>Filter Jobs</h3>
          <div className="filter-group">
            <label>Category</label>
            <select 
              value={filters.category} 
              onChange={(e) => onFilterChange({...filters, category: e.target.value})}
            >
              <option value="">All Categories</option>
              <option value="technology">Technology</option>
              <option value="design">Design</option>
              <option value="marketing">Marketing</option>
              <option value="education">Education</option>
              <option value="finance">Finance</option>
              <option value="healthcare">Healthcare</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Location</label>
            <input 
              type="text" 
              value={filters.location} 
              onChange={(e) => onFilterChange({...filters, location: e.target.value})}
              placeholder="Enter location"
            />
          </div>
          
          <div className="filter-group">
            <label>Job Type</label>
            <select 
              value={filters.jobType} 
              onChange={(e) => onFilterChange({...filters, jobType: e.target.value})}
            >
              <option value="">All Types</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="freelance">Freelance</option>
              <option value="internship">Internship</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Minimum Salary</label>
            <input 
              type="number" 
              value={filters.minSalary} 
              onChange={(e) => onFilterChange({...filters, minSalary: parseInt(e.target.value)})}
              placeholder="Minimum salary"
            />
          </div>
          
          <div className="filter-group">
            <label>Qualification Level</label>
            <select 
              value={filters.qualificationLevel} 
              onChange={(e) => onFilterChange({...filters, qualificationLevel: parseInt(e.target.value)})}
            >
              <option value="">All Levels</option>
              <option value="1">Entry Level</option>
              <option value="2">Junior</option>
              <option value="3">Mid-Level</option>
              <option value="4">Senior</option>
              <option value="5">Expert</option>
            </select>
          </div>
        </div>
        
        <div className="job-list-container">
          <div className="job-list-header">
            <h2>Available Jobs ({filteredJobs.length})</h2>
            <div className="sort-options">
              <label>Sort by:</label>
              <select 
                value={sortOption} 
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="recent">Most Recent</option>
                <option value="salary-high">Highest Salary</option>
                <option value="salary-low">Lowest Salary</option>
                <option value="relevance">Relevance</option>
              </select>
            </div>
          </div>
          
          <div className="job-list">
            {filteredJobs.length > 0 ? (
              filteredJobs.map(job => (
                <JobCard key={job.id} job={job} />
              ))
            ) : (
              <div className="no-jobs-found">
                <p>No jobs match your current filters. Try adjusting your search criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

// Job Card Component
export const JobCard = ({ job }) => {
  return (
    <div className="job-card">
      <div className="job-card-header">
        <div className="company-logo">
          <img src={job.company.logo} alt={job.company.name} />
        </div>
        <div className="job-title-container">
          <h3 className="job-title">{job.title}</h3>
          <p className="company-name">{job.company.name}</p>
        </div>
        <div className="job-salary">
          {job.salaryDisplay}
        </div>
      </div>
      
      <div className="job-card-body">
        <div className="job-details">
          <span className="job-location">
            <i className="location-icon"></i> {job.location}
          </span>
          <span className="job-type">
            <i className="job-type-icon"></i> {job.jobType}
          </span>
          <span className="job-posted-date">
            <i className="calendar-icon"></i> Posted {job.postedTimeAgo}
          </span>
        </div>
        
        <p className="job-description">{job.shortDescription}</p>
        
        <div className="job-skills">
          {job.skills.map((skill, index) => (
            <span key={index} className="skill-tag">{skill}</span>
          ))}
        </div>
      </div>
      
      <div className="job-card-footer">
        <Link href={`/jobs/${job.id}`}>
          <a className="view-job-btn">View Details</a>
        </Link>
        <button className="save-job-btn">
          <i className="bookmark-icon"></i> Save
        </button>
      </div>
    </div>
  );
};

// Job Detail Component
export const JobDetail = ({ job, currentUser }) => {
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    resumeId: currentUser?.defaultResumeId || '',
    portfolioLinks: [],
    salary: job.salary,
  });
  
  const handleApply = () => {
    // Submit application logic
    console.log('Submitting application:', applicationData);
    setApplyModalOpen(false);
    // Show success message or redirect
  };
  
  return (
    <ResponsiveLayout>
      <div className="job-detail-page">
        <div className="job-detail-header">
          <div className="company-banner">
            <img src={job.company.banner} alt={job.company.name} />
          </div>
          
          <div className="job-header-content">
            <div className="company-logo">
              <img src={job.company.logo} alt={job.company.name} />
            </div>
            
            <div className="job-title-container">
              <h1 className="job-title">{job.title}</h1>
              <Link href={`/companies/${job.company.id}`}>
                <a className="company-name">{job.company.name}</a>
              </Link>
              <div className="job-meta">
                <span className="job-location">
                  <i className="location-icon"></i> {job.location}
                </span>
                <span className="job-type">
                  <i className="job-type-icon"></i> {job.jobType}
                </span>
                <span className="job-posted-date">
                  <i className="calendar-icon"></i> Posted {job.postedTimeAgo}
                </span>
              </div>
            </div>
            
            <div className="job-actions">
              <button 
                className="apply-btn primary-btn"
                onClick={() => setApplyModalOpen(true)}
              >
                Apply Now
              </button>
              <button className="save-job-btn secondary-btn">
                <i className="bookmark-icon"></i> Save Job
              </button>
              <button className="share-job-btn secondary-btn">
                <i className="share-icon"></i> Share
              </button>
            </div>
          </div>
        </div>
        
        <div className="job-detail-content">
          <div className="job-main-content">
            <div className="job-description-section">
              <h2>Job Description</h2>
              <div className="job-description" dangerouslySetInnerHTML={{ __html: job.description }} />
            </div>
            
            <div className="job-responsibilities-section">
              <h2>Responsibilities</h2>
              <ul className="responsibilities-list">
                {job.responsibilities.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            
            <div className="job-requirements-section">
              <h2>Requirements</h2>
              <ul className="requirements-list">
                {job.requirements.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            
            <div className="job-benefits-section">
              <h2>Benefits</h2>
              <ul className="benefits-list">
                {job.benefits.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            
            <div className="job-skills-section">
              <h2>Required Skills</h2>
              <div className="skills-container">
                {job.skills.map((skill, index) => (
                  <span key={index} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>
            
            {job.qualifications && (
              <div className="job-qualifications-section">
                <h2>Qualifications</h2>
                <div className="qualifications-container">
                  {job.qualifications.map((qualification, index) => (
                    <div key={index} className="qualification-item">
                      <span className="qualification-name">{qualification.name}</span>
                      <span className="qualification-level">Level: {qualification.level}</span>
                      <span className="qualification-min-salary">Minimum Salary: {qualification.minSalary}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="job-sidebar">
            <div className="job-summary-card">
              <h3>Job Summary</h3>
              <div className="summary-item">
                <span className="summary-label">Employment Type</span>
                <span className="summary-value">{job.jobType}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Experience Level</span>
                <span className="summary-value">{job.experienceLevel}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Salary Range</span>
                <span className="summary-value">{job.salaryDisplay}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Location</span>
                <span className="summary-value">{job.location}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Remote Work</span>
                <span className="summary-value">{job.remoteWork ? 'Yes' : 'No'}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Application Deadline</span>
                <span className="summary-value">{job.applicationDeadline}</span>
              </div>
            </div>
            
            <div className="company-card">
              <h3>About the Company</h3>
              <div className="company-info">
                <p>{job.company.shortDescription}</p>
                <div className="company-meta">
                  <div className="meta-item">
                    <span className="meta-label">Industry</span>
                    <span className="meta-value">{job.company.industry}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Company Size</span>
                    <span className="meta-value">{job.company.size}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Founded</span>
                    <span className="meta-value">{job.company.foundedYear}</span>
                  </div>
                </div>
                <Link href={`/companies/${job.company.id}`}>
                  <a className="view-company-btn">View Company Profile</a>
                </Link>
              </div>
            </div>
            
            <div className="similar-jobs-card">
              <h3>Similar Jobs</h3>
              <div className="similar-jobs-list">
                {job.similarJobs.map(similarJob => (
                  <div key={similarJob.id} className="similar-job-item">
                    <Link href={`/jobs/${similarJob.id}`}>
                      <a className="similar-job-title">{similarJob.title}</a>
                    </Link>
                    <div className="similar-job-company">{similarJob.company.name}</div>
                    <div className="similar-job-location">{similarJob.location}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {applyModalOpen && (
        <div className="apply-modal">
          <div className="apply-modal-content">
            <div className="modal-header">
              <h2>Apply for {job.title}</h2>
              <button className="close-modal-btn" onClick={() => setApplyModalOpen(false)}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label>Resume/CV</label>
                <select 
                  value={applicationData.resumeId} 
                  onChange={(e) => setApplicationData({...applicationData, resumeId: e.target.value})}
                >
                  <option value="">Select a Resume</option>
                  {currentUser.resumes.map(resume => (
                    <option <response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>