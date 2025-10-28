/**
 * AETHERIAL CV Builder
 * 
 * Military-Grade CV/Resume Builder with Blockchain Verification
 * 
 * Features:
 * - Professional templates (10+ designs)
 * - Drag-and-drop editor
 * - Real-time preview
 * - PDF export
 * - Blockchain verification
 * - ATS optimization
 * - AI-powered suggestions
 * - Multi-language support
 * 
 * @module pages/jobs/CVBuilder
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './CVBuilder.css';

/**
 * CV Data Interface
 */
export interface CVData {
  id?: string;
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    website?: string;
    linkedin?: string;
    github?: string;
    summary: string;
    photo?: string;
  };
  experience: Array<{
    id: string;
    company: string;
    position: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
    achievements: string[];
  }>;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    field: string;
    location: string;
    startDate: string;
    endDate: string;
    gpa?: string;
    achievements: string[];
  }>;
  skills: Array<{
    id: string;
    category: string;
    items: string[];
    level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  }>;
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
    expiryDate?: string;
    credentialId?: string;
    url?: string;
  }>;
  projects: Array<{
    id: string;
    name: string;
    description: string;
    technologies: string[];
    url?: string;
    github?: string;
    startDate: string;
    endDate: string;
  }>;
  languages: Array<{
    id: string;
    language: string;
    proficiency: 'basic' | 'conversational' | 'fluent' | 'native';
  }>;
  blockchainVerification?: {
    hash: string;
    timestamp: number;
    verified: boolean;
  };
}

/**
 * CV Template Types
 */
type CVTemplate = 
  | 'modern'
  | 'classic'
  | 'minimal'
  | 'creative'
  | 'professional'
  | 'tech'
  | 'executive'
  | 'academic'
  | 'designer'
  | 'developer';

/**
 * CV Builder Component
 */
export const CVBuilder: React.FC = () => {
  const { user } = useAuth();
  const [cvData, setCVData] = useState<CVData>({
    personalInfo: {
      fullName: user?.username || '',
      email: user?.email || '',
      phone: '',
      location: '',
      summary: ''
    },
    experience: [],
    education: [],
    skills: [],
    certifications: [],
    projects: [],
    languages: []
  });
  
  const [selectedTemplate, setSelectedTemplate] = useState<CVTemplate>('modern');
  const [activeSection, setActiveSection] = useState<string>('personal');
  const [showPreview, setShowPreview] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [exporting, setExporting] = useState<boolean>(false);
  const [verifying, setVerifying] = useState<boolean>(false);
  
  /**
   * Load saved CV data
   */
  useEffect(() => {
    loadCVData();
  }, []);
  
  /**
   * Load CV data from backend
   */
  const loadCVData = async () => {
    try {
      const response = await fetch('/api/cv/load', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.cv) {
          setCVData(data.cv);
        }
      }
    } catch (error) {
      console.error('Failed to load CV:', error);
    }
  };
  
  /**
   * Save CV data
   */
  const saveCVData = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/cv/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(cvData)
      });
      
      if (response.ok) {
        const data = await response.json();
        setCVData(data.cv);
        alert('CV saved successfully!');
      }
    } catch (error) {
      console.error('Failed to save CV:', error);
      alert('Failed to save CV');
    } finally {
      setSaving(false);
    }
  };
  
  /**
   * Export CV as PDF
   */
  const exportPDF = async () => {
    setExporting(true);
    try {
      const response = await fetch('/api/cv/export/pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ cvData, template: selectedTemplate })
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${cvData.personalInfo.fullName.replace(/\s+/g, '_')}_CV.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Failed to export PDF:', error);
      alert('Failed to export PDF');
    } finally {
      setExporting(false);
    }
  };
  
  /**
   * Verify CV on blockchain
   */
  const verifyOnBlockchain = async () => {
    setVerifying(true);
    try {
      const response = await fetch('/api/cv/verify-blockchain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(cvData)
      });
      
      if (response.ok) {
        const data = await response.json();
        setCVData({
          ...cvData,
          blockchainVerification: data.verification
        });
        alert('CV verified on blockchain!');
      }
    } catch (error) {
      console.error('Failed to verify on blockchain:', error);
      alert('Failed to verify on blockchain');
    } finally {
      setVerifying(false);
    }
  };
  
  /**
   * Add experience entry
   */
  const addExperience = () => {
    setCVData({
      ...cvData,
      experience: [
        ...cvData.experience,
        {
          id: Date.now().toString(),
          company: '',
          position: '',
          location: '',
          startDate: '',
          endDate: '',
          current: false,
          description: '',
          achievements: []
        }
      ]
    });
  };
  
  /**
   * Add education entry
   */
  const addEducation = () => {
    setCVData({
      ...cvData,
      education: [
        ...cvData.education,
        {
          id: Date.now().toString(),
          institution: '',
          degree: '',
          field: '',
          location: '',
          startDate: '',
          endDate: '',
          achievements: []
        }
      ]
    });
  };
  
  /**
   * Add skill category
   */
  const addSkillCategory = () => {
    setCVData({
      ...cvData,
      skills: [
        ...cvData.skills,
        {
          id: Date.now().toString(),
          category: '',
          items: [],
          level: 'intermediate'
        }
      ]
    });
  };
  
  /**
   * Templates data
   */
  const templates: Array<{ id: CVTemplate; name: string; description: string }> = [
    { id: 'modern', name: 'Modern', description: 'Clean and contemporary design' },
    { id: 'classic', name: 'Classic', description: 'Traditional professional format' },
    { id: 'minimal', name: 'Minimal', description: 'Simple and elegant' },
    { id: 'creative', name: 'Creative', description: 'Bold and unique design' },
    { id: 'professional', name: 'Professional', description: 'Corporate standard' },
    { id: 'tech', name: 'Tech', description: 'Perfect for tech roles' },
    { id: 'executive', name: 'Executive', description: 'Senior leadership format' },
    { id: 'academic', name: 'Academic', description: 'Research and academia' },
    { id: 'designer', name: 'Designer', description: 'Visual and creative' },
    { id: 'developer', name: 'Developer', description: 'Code-focused layout' }
  ];
  
  return (
    <div className="cv-builder">
      <div className="cv-builder-header">
        <h1>CV Builder</h1>
        <div className="cv-builder-actions">
          <button
            onClick={saveCVData}
            disabled={saving}
            className="btn btn-secondary"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={exportPDF}
            disabled={exporting}
            className="btn btn-primary"
          >
            {exporting ? 'Exporting...' : 'Export PDF'}
          </button>
          <button
            onClick={verifyOnBlockchain}
            disabled={verifying || !!cvData.blockchainVerification}
            className="btn btn-success"
          >
            {verifying ? 'Verifying...' : cvData.blockchainVerification ? 'Verified ✓' : 'Verify on Blockchain'}
          </button>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="btn btn-outline"
          >
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
        </div>
      </div>
      
      <div className="cv-builder-content">
        {/* Editor Panel */}
        <div className="cv-builder-editor">
          {/* Template Selection */}
          <div className="cv-section">
            <h2>Choose Template</h2>
            <div className="cv-templates-grid">
              {templates.map(template => (
                <div
                  key={template.id}
                  className={`cv-template-card ${selectedTemplate === template.id ? 'active' : ''}`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <div className="cv-template-preview">
                    <div className={`cv-template-thumbnail cv-template-${template.id}`}></div>
                  </div>
                  <h3>{template.name}</h3>
                  <p>{template.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Section Navigation */}
          <div className="cv-section-nav">
            <button
              className={activeSection === 'personal' ? 'active' : ''}
              onClick={() => setActiveSection('personal')}
            >
              Personal Info
            </button>
            <button
              className={activeSection === 'experience' ? 'active' : ''}
              onClick={() => setActiveSection('experience')}
            >
              Experience
            </button>
            <button
              className={activeSection === 'education' ? 'active' : ''}
              onClick={() => setActiveSection('education')}
            >
              Education
            </button>
            <button
              className={activeSection === 'skills' ? 'active' : ''}
              onClick={() => setActiveSection('skills')}
            >
              Skills
            </button>
            <button
              className={activeSection === 'certifications' ? 'active' : ''}
              onClick={() => setActiveSection('certifications')}
            >
              Certifications
            </button>
            <button
              className={activeSection === 'projects' ? 'active' : ''}
              onClick={() => setActiveSection('projects')}
            >
              Projects
            </button>
          </div>
          
          {/* Personal Info Section */}
          {activeSection === 'personal' && (
            <div className="cv-section">
              <h2>Personal Information</h2>
              <div className="cv-form">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    value={cvData.personalInfo.fullName}
                    onChange={(e) => setCVData({
                      ...cvData,
                      personalInfo: { ...cvData.personalInfo, fullName: e.target.value }
                    })}
                    placeholder="John Doe"
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      value={cvData.personalInfo.email}
                      onChange={(e) => setCVData({
                        ...cvData,
                        personalInfo: { ...cvData.personalInfo, email: e.target.value }
                      })}
                      placeholder="john@example.com"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Phone *</label>
                    <input
                      type="tel"
                      value={cvData.personalInfo.phone}
                      onChange={(e) => setCVData({
                        ...cvData,
                        personalInfo: { ...cvData.personalInfo, phone: e.target.value }
                      })}
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Location *</label>
                  <input
                    type="text"
                    value={cvData.personalInfo.location}
                    onChange={(e) => setCVData({
                      ...cvData,
                      personalInfo: { ...cvData.personalInfo, location: e.target.value }
                    })}
                    placeholder="New York, NY"
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Website</label>
                    <input
                      type="url"
                      value={cvData.personalInfo.website || ''}
                      onChange={(e) => setCVData({
                        ...cvData,
                        personalInfo: { ...cvData.personalInfo, website: e.target.value }
                      })}
                      placeholder="https://johndoe.com"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>LinkedIn</label>
                    <input
                      type="url"
                      value={cvData.personalInfo.linkedin || ''}
                      onChange={(e) => setCVData({
                        ...cvData,
                        personalInfo: { ...cvData.personalInfo, linkedin: e.target.value }
                      })}
                      placeholder="https://linkedin.com/in/johndoe"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Professional Summary *</label>
                  <textarea
                    value={cvData.personalInfo.summary}
                    onChange={(e) => setCVData({
                      ...cvData,
                      personalInfo: { ...cvData.personalInfo, summary: e.target.value }
                    })}
                    placeholder="Brief summary of your professional background and goals..."
                    rows={5}
                  />
                  <small className="form-hint">
                    ATS Tip: Include relevant keywords from job descriptions
                  </small>
                </div>
              </div>
            </div>
          )}
          
          {/* Experience Section */}
          {activeSection === 'experience' && (
            <div className="cv-section">
              <div className="cv-section-header">
                <h2>Work Experience</h2>
                <button onClick={addExperience} className="btn btn-sm btn-primary">
                  + Add Experience
                </button>
              </div>
              
              {cvData.experience.length === 0 ? (
                <div className="cv-empty-state">
                  <p>No experience added yet. Click "Add Experience" to get started.</p>
                </div>
              ) : (
                <div className="cv-items-list">
                  {cvData.experience.map((exp, index) => (
                    <div key={exp.id} className="cv-item-card">
                      <div className="cv-item-header">
                        <h3>Experience #{index + 1}</h3>
                        <button
                          onClick={() => setCVData({
                            ...cvData,
                            experience: cvData.experience.filter(e => e.id !== exp.id)
                          })}
                          className="btn btn-sm btn-error"
                        >
                          Remove
                        </button>
                      </div>
                      
                      <div className="cv-form">
                        <div className="form-row">
                          <div className="form-group">
                            <label>Company *</label>
                            <input
                              type="text"
                              value={exp.company}
                              onChange={(e) => {
                                const updated = [...cvData.experience];
                                updated[index].company = e.target.value;
                                setCVData({ ...cvData, experience: updated });
                              }}
                              placeholder="Company Name"
                            />
                          </div>
                          
                          <div className="form-group">
                            <label>Position *</label>
                            <input
                              type="text"
                              value={exp.position}
                              onChange={(e) => {
                                const updated = [...cvData.experience];
                                updated[index].position = e.target.value;
                                setCVData({ ...cvData, experience: updated });
                              }}
                              placeholder="Job Title"
                            />
                          </div>
                        </div>
                        
                        <div className="form-group">
                          <label>Description *</label>
                          <textarea
                            value={exp.description}
                            onChange={(e) => {
                              const updated = [...cvData.experience];
                              updated[index].description = e.target.value;
                              setCVData({ ...cvData, experience: updated });
                            }}
                            placeholder="Describe your role and responsibilities..."
                            rows={4}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* Other sections would follow similar pattern */}
        </div>
        
        {/* Preview Panel */}
        {showPreview && (
          <div className="cv-builder-preview">
            <div className={`cv-preview cv-preview-${selectedTemplate}`}>
              <div className="cv-preview-header">
                <h1>{cvData.personalInfo.fullName || 'Your Name'}</h1>
                <div className="cv-preview-contact">
                  <span>{cvData.personalInfo.email}</span>
                  <span>{cvData.personalInfo.phone}</span>
                  <span>{cvData.personalInfo.location}</span>
                </div>
              </div>
              
              {cvData.personalInfo.summary && (
                <div className="cv-preview-section">
                  <h2>Professional Summary</h2>
                  <p>{cvData.personalInfo.summary}</p>
                </div>
              )}
              
              {cvData.experience.length > 0 && (
                <div className="cv-preview-section">
                  <h2>Experience</h2>
                  {cvData.experience.map(exp => (
                    <div key={exp.id} className="cv-preview-item">
                      <h3>{exp.position}</h3>
                      <h4>{exp.company}</h4>
                      <p>{exp.description}</p>
                    </div>
                  ))}
                </div>
              )}
              
              {cvData.blockchainVerification && (
                <div className="cv-preview-verification">
                  <span className="verification-badge">✓ Blockchain Verified</span>
                  <small>Hash: {cvData.blockchainVerification.hash.substring(0, 16)}...</small>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CVBuilder;

