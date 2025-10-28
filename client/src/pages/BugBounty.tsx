import React, { useState, useEffect } from 'react';
import './BugBounty.css';

interface BugReport {
  id: number;
  userId: number;
  title: string;
  description: string;
  status: string;
  createdAt: string;
}

const BugBounty: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [reports, setReports] = useState<BugReport[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch('/api/bug-bounty');
      const data = await response.json();
      setReports(data);
    } catch (error) {
      console.error('Error fetching bug reports:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/bug-bounty', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 1, // TODO: Get from auth context
          title,
          description,
        }),
      });

      if (response.ok) {
        setMessage('Bug report submitted successfully! Thank you for helping improve AETHERIAL.');
        setTitle('');
        setDescription('');
        fetchReports();
      } else {
        setMessage('Error submitting bug report. Please try again.');
      }
    } catch (error) {
      setMessage('Error submitting bug report. Please try again.');
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusUpdate = async (id: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/bug-bounty/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchReports();
      }
    } catch (error) {
      console.error('Error updating bug report:', error);
    }
  };

  return (
    <div className="bug-bounty-container">
      <div className="bug-bounty-header">
        <h1>🐛 Bug Bounty Program</h1>
        <p>Help us improve AETHERIAL by reporting bugs and earn rewards!</p>
      </div>

      <div className="bug-bounty-content">
        <div className="submission-section">
          <h2>Submit a Bug Report</h2>
          <form onSubmit={handleSubmit} className="bug-report-form">
            <div className="form-group">
              <label htmlFor="title">Bug Title *</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Brief description of the bug"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed description including steps to reproduce, expected behavior, and actual behavior"
                rows={8}
                required
              />
            </div>

            <button type="submit" disabled={isSubmitting} className="submit-button">
              {isSubmitting ? 'Submitting...' : 'Submit Bug Report'}
            </button>

            {message && (
              <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
                {message}
              </div>
            )}
          </form>
        </div>

        <div className="info-section">
          <h2>Reward Tiers</h2>
          <div className="reward-tiers">
            <div className="tier critical">
              <h3>🔴 Critical</h3>
              <p className="reward">1000 Aether Coins</p>
              <p>Security vulnerabilities, data loss, system crashes</p>
            </div>
            <div className="tier high">
              <h3>🟠 High</h3>
              <p className="reward">500 Aether Coins</p>
              <p>Major functionality broken, performance issues</p>
            </div>
            <div className="tier medium">
              <h3>🟡 Medium</h3>
              <p className="reward">250 Aether Coins</p>
              <p>Feature not working as expected, UI issues</p>
            </div>
            <div className="tier low">
              <h3>🟢 Low</h3>
              <p className="reward">100 Aether Coins</p>
              <p>Minor bugs, typos, cosmetic issues</p>
            </div>
          </div>

          <div className="guidelines">
            <h3>Guidelines</h3>
            <ul>
              <li>Provide clear steps to reproduce the bug</li>
              <li>Include screenshots or videos if possible</li>
              <li>Check if the bug has already been reported</li>
              <li>One bug per report</li>
              <li>Be respectful and constructive</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="admin-section">
        <button 
          onClick={() => setShowAdminPanel(!showAdminPanel)} 
          className="admin-toggle"
        >
          {showAdminPanel ? 'Hide' : 'Show'} Admin Panel
        </button>

        {showAdminPanel && (
          <div className="admin-panel">
            <h2>Bug Reports ({reports.length})</h2>
            <div className="reports-list">
              {reports.map((report) => (
                <div key={report.id} className="report-card">
                  <div className="report-header">
                    <h3>{report.title}</h3>
                    <span className={`status-badge ${report.status}`}>
                      {report.status}
                    </span>
                  </div>
                  <p className="report-description">{report.description}</p>
                  <div className="report-meta">
                    <span>User ID: {report.userId}</span>
                    <span>Created: {new Date(report.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="report-actions">
                    <button onClick={() => handleStatusUpdate(report.id, 'reviewing')}>
                      Mark as Reviewing
                    </button>
                    <button onClick={() => handleStatusUpdate(report.id, 'fixed')}>
                      Mark as Fixed
                    </button>
                    <button onClick={() => handleStatusUpdate(report.id, 'closed')}>
                      Close
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BugBounty;

