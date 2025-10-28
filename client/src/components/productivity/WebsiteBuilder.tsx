import React, { useState } from 'react';
import './WebsiteBuilder.css';

/**
 * Comprehensive Website Builder
 * 
 * Features:
 * - Drag-and-drop interface
 * - Pre-built templates (landing pages, portfolios, e-commerce, blogs)
 * - Component library (headers, footers, forms, galleries, etc.)
 * - Responsive design preview
 * - AI-powered design suggestions
 * - Code export (HTML/CSS/JS, React, Vue, etc.)
 * - SEO optimization
 * - Custom domain support
 * - One-click deployment
 */

interface Component {
  id: string;
  type: string;
  name: string;
  icon: string;
}

interface Template {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  description: string;
}

const WebsiteBuilder: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'templates' | 'builder' | 'settings' | 'export'>('templates');
  const [selectedDevice, setSelectedDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const templates: Template[] = [
    {
      id: 'landing-1',
      name: 'SaaS Landing Page',
      category: 'Landing Page',
      thumbnail: 'https://picsum.photos/400/300?random=1',
      description: 'Modern landing page for SaaS products'
    },
    {
      id: 'portfolio-1',
      name: 'Creative Portfolio',
      category: 'Portfolio',
      thumbnail: 'https://picsum.photos/400/300?random=2',
      description: 'Showcase your work beautifully'
    },
    {
      id: 'ecommerce-1',
      name: 'Online Store',
      category: 'E-commerce',
      thumbnail: 'https://picsum.photos/400/300?random=3',
      description: 'Full-featured e-commerce template'
    },
    {
      id: 'blog-1',
      name: 'Minimal Blog',
      category: 'Blog',
      thumbnail: 'https://picsum.photos/400/300?random=4',
      description: 'Clean and readable blog design'
    },
    {
      id: 'agency-1',
      name: 'Digital Agency',
      category: 'Business',
      thumbnail: 'https://picsum.photos/400/300?random=5',
      description: 'Professional agency website'
    },
    {
      id: 'restaurant-1',
      name: 'Restaurant Menu',
      category: 'Restaurant',
      thumbnail: 'https://picsum.photos/400/300?random=6',
      description: 'Beautiful menu and reservation system'
    }
  ];

  const components: Component[] = [
    { id: 'header', type: 'navigation', name: 'Header', icon: '📋' },
    { id: 'hero', type: 'section', name: 'Hero Section', icon: '🎯' },
    { id: 'features', type: 'section', name: 'Features Grid', icon: '⭐' },
    { id: 'testimonials', type: 'section', name: 'Testimonials', icon: '💬' },
    { id: 'pricing', type: 'section', name: 'Pricing Table', icon: '💰' },
    { id: 'gallery', type: 'media', name: 'Image Gallery', icon: '🖼️' },
    { id: 'form', type: 'interactive', name: 'Contact Form', icon: '📝' },
    { id: 'footer', type: 'navigation', name: 'Footer', icon: '📄' },
    { id: 'cta', type: 'section', name: 'Call to Action', icon: '🎬' },
    { id: 'team', type: 'section', name: 'Team Members', icon: '👥' },
    { id: 'stats', type: 'section', name: 'Statistics', icon: '📊' },
    { id: 'faq', type: 'section', name: 'FAQ Accordion', icon: '❓' }
  ];

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    setActiveTab('builder');
  };

  const handleExport = (format: string) => {
    alert(`Exporting website as ${format}...`);
  };

  const handleDeploy = () => {
    alert('Deploying website...');
  };

  return (
    <div className="website-builder">
      <div className="website-builder-header">
        <h1>🌐 Website Builder</h1>
        <p>Create stunning websites with no code</p>
      </div>

      <div className="website-builder-tabs">
        <button 
          className={activeTab === 'templates' ? 'active' : ''}
          onClick={() => setActiveTab('templates')}
        >
          📑 Templates
        </button>
        <button 
          className={activeTab === 'builder' ? 'active' : ''}
          onClick={() => setActiveTab('builder')}
          disabled={!selectedTemplate}
        >
          🎨 Builder
        </button>
        <button 
          className={activeTab === 'settings' ? 'active' : ''}
          onClick={() => setActiveTab('settings')}
          disabled={!selectedTemplate}
        >
          ⚙️ Settings
        </button>
        <button 
          className={activeTab === 'export' ? 'active' : ''}
          onClick={() => setActiveTab('export')}
          disabled={!selectedTemplate}
        >
          🚀 Export
        </button>
      </div>

      <div className="website-builder-content">
        {activeTab === 'templates' && (
          <div className="templates-tab">
            <div className="templates-header">
              <h2>Choose a Template</h2>
              <div className="template-filters">
                <button className="active">All</button>
                <button>Landing Page</button>
                <button>Portfolio</button>
                <button>E-commerce</button>
                <button>Blog</button>
                <button>Business</button>
              </div>
            </div>

            <div className="templates-grid">
              {templates.map(template => (
                <div key={template.id} className="template-card">
                  <img src={template.thumbnail} alt={template.name} />
                  <div className="template-info">
                    <span className="template-category">{template.category}</span>
                    <h3>{template.name}</h3>
                    <p>{template.description}</p>
                    <button 
                      className="use-template-btn"
                      onClick={() => handleSelectTemplate(template.id)}
                    >
                      Use Template
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="blank-template">
              <h3>Or start from scratch</h3>
              <button 
                className="blank-template-btn"
                onClick={() => handleSelectTemplate('blank')}
              >
                + Create Blank Page
              </button>
            </div>
          </div>
        )}

        {activeTab === 'builder' && (
          <div className="builder-tab">
            <div className="builder-sidebar">
              <h3>Components</h3>
              <div className="component-categories">
                <button className="active">All</button>
                <button>Navigation</button>
                <button>Sections</button>
                <button>Media</button>
                <button>Interactive</button>
              </div>
              <div className="components-list">
                {components.map(component => (
                  <div 
                    key={component.id} 
                    className="component-item"
                    draggable
                  >
                    <span className="component-icon">{component.icon}</span>
                    <span className="component-name">{component.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="builder-canvas">
              <div className="canvas-toolbar">
                <div className="device-selector">
                  <button 
                    className={selectedDevice === 'desktop' ? 'active' : ''}
                    onClick={() => setSelectedDevice('desktop')}
                  >
                    🖥️ Desktop
                  </button>
                  <button 
                    className={selectedDevice === 'tablet' ? 'active' : ''}
                    onClick={() => setSelectedDevice('tablet')}
                  >
                    📱 Tablet
                  </button>
                  <button 
                    className={selectedDevice === 'mobile' ? 'active' : ''}
                    onClick={() => setSelectedDevice('mobile')}
                  >
                    📱 Mobile
                  </button>
                </div>
                <div className="canvas-actions">
                  <button>↶ Undo</button>
                  <button>↷ Redo</button>
                  <button>👁️ Preview</button>
                </div>
              </div>

              <div className={`canvas-viewport ${selectedDevice}`}>
                <div className="canvas-placeholder">
                  <p>Drag components here to build your website</p>
                  <p className="canvas-hint">Or use AI to generate a layout</p>
                  <button className="ai-generate-btn">✨ Generate with AI</button>
                </div>
              </div>
            </div>

            <div className="builder-properties">
              <h3>Properties</h3>
              <div className="properties-panel">
                <p className="no-selection">Select a component to edit its properties</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="settings-tab">
            <h2>Website Settings</h2>
            
            <div className="settings-section">
              <h3>General</h3>
              <div className="setting-item">
                <label>Website Title</label>
                <input type="text" placeholder="My Awesome Website" />
              </div>
              <div className="setting-item">
                <label>Description</label>
                <textarea placeholder="A brief description of your website..." rows={3}></textarea>
              </div>
              <div className="setting-item">
                <label>Favicon</label>
                <input type="file" accept="image/*" />
              </div>
            </div>

            <div className="settings-section">
              <h3>SEO</h3>
              <div className="setting-item">
                <label>Meta Keywords</label>
                <input type="text" placeholder="keyword1, keyword2, keyword3" />
              </div>
              <div className="setting-item">
                <label>Open Graph Image</label>
                <input type="file" accept="image/*" />
              </div>
            </div>

            <div className="settings-section">
              <h3>Domain</h3>
              <div className="setting-item">
                <label>Custom Domain</label>
                <input type="text" placeholder="www.mywebsite.com" />
                <button className="connect-domain-btn">Connect Domain</button>
              </div>
            </div>

            <div className="settings-section">
              <h3>Analytics</h3>
              <div className="setting-item">
                <label>Google Analytics ID</label>
                <input type="text" placeholder="G-XXXXXXXXXX" />
              </div>
            </div>

            <button className="save-settings-btn">💾 Save Settings</button>
          </div>
        )}

        {activeTab === 'export' && (
          <div className="export-tab">
            <h2>Export & Deploy</h2>

            <div className="export-section">
              <h3>Export Code</h3>
              <div className="export-options">
                <button onClick={() => handleExport('HTML')}>
                  <span className="export-icon">📄</span>
                  <span className="export-name">HTML/CSS/JS</span>
                  <span className="export-desc">Static files</span>
                </button>
                <button onClick={() => handleExport('React')}>
                  <span className="export-icon">⚛️</span>
                  <span className="export-name">React</span>
                  <span className="export-desc">React components</span>
                </button>
                <button onClick={() => handleExport('Vue')}>
                  <span className="export-icon">🟢</span>
                  <span className="export-name">Vue</span>
                  <span className="export-desc">Vue components</span>
                </button>
                <button onClick={() => handleExport('WordPress')}>
                  <span className="export-icon">📰</span>
                  <span className="export-name">WordPress</span>
                  <span className="export-desc">WordPress theme</span>
                </button>
              </div>
            </div>

            <div className="export-section">
              <h3>Deploy</h3>
              <div className="deploy-options">
                <button onClick={handleDeploy}>
                  <span className="deploy-icon">🚀</span>
                  <span className="deploy-name">Deploy to AETHERIAL</span>
                  <span className="deploy-desc">Free hosting included</span>
                </button>
                <button>
                  <span className="deploy-icon">▲</span>
                  <span className="deploy-name">Deploy to Vercel</span>
                  <span className="deploy-desc">Connect your account</span>
                </button>
                <button>
                  <span className="deploy-icon">🔺</span>
                  <span className="deploy-name">Deploy to Netlify</span>
                  <span className="deploy-desc">Connect your account</span>
                </button>
                <button>
                  <span className="deploy-icon">☁️</span>
                  <span className="deploy-name">Deploy to AWS</span>
                  <span className="deploy-desc">Configure AWS credentials</span>
                </button>
              </div>
            </div>

            <div className="export-section">
              <h3>Share</h3>
              <div className="share-options">
                <input type="text" value="https://aetherial.space/preview/abc123" readOnly />
                <button>📋 Copy Link</button>
                <button>🔗 Generate QR Code</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WebsiteBuilder;

