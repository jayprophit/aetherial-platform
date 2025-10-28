import React, { useState } from 'react';
import './AIToolsHub.css';

interface AITool {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  features: string[];
  pricing: 'free' | 'freemium' | 'paid';
}

const AIToolsHub: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', name: 'All Tools', icon: '🎯' },
    { id: 'writing', name: 'Writing & Content', icon: '✍️' },
    { id: 'design', name: 'Design & Creative', icon: '🎨' },
    { id: 'code', name: 'Code & Development', icon: '💻' },
    { id: 'business', name: 'Business & Marketing', icon: '📊' },
    { id: 'research', name: 'Research & Analysis', icon: '🔬' },
    { id: 'media', name: 'Media & Production', icon: '🎬' }
  ];

  const tools: AITool[] = [
    {
      id: '1',
      name: 'AI Writer Pro',
      category: 'writing',
      description: 'Generate high-quality content, articles, and copy with advanced AI',
      icon: '✍️',
      features: ['Blog posts', 'Marketing copy', 'SEO optimization', '50+ templates'],
      pricing: 'freemium'
    },
    {
      id: '2',
      name: 'Image Generator',
      category: 'design',
      description: 'Create stunning images from text descriptions using Stable Diffusion',
      icon: '🖼️',
      features: ['Text-to-image', 'Multiple styles', 'HD quality', 'Commercial use'],
      pricing: 'free'
    },
    {
      id: '3',
      name: 'Code Assistant',
      category: 'code',
      description: 'AI-powered coding companion for faster development',
      icon: '💻',
      features: ['Code completion', 'Bug detection', 'Refactoring', '40+ languages'],
      pricing: 'freemium'
    },
    {
      id: '4',
      name: 'Video Creator',
      category: 'media',
      description: 'Generate professional videos from text scripts',
      icon: '🎬',
      features: ['Text-to-video', 'AI avatars', 'Voice synthesis', '4K export'],
      pricing: 'paid'
    },
    {
      id: '5',
      name: 'Data Analyst',
      category: 'research',
      description: 'Analyze data and generate insights automatically',
      icon: '📊',
      features: ['Data visualization', 'Predictive analytics', 'Report generation', 'SQL queries'],
      pricing: 'freemium'
    },
    {
      id: '6',
      name: 'Logo Maker',
      category: 'design',
      description: 'Create professional logos in minutes',
      icon: '🎨',
      features: ['AI design', 'Brand kit', 'Vector files', 'Unlimited revisions'],
      pricing: 'paid'
    },
    {
      id: '7',
      name: 'SEO Optimizer',
      category: 'business',
      description: 'Optimize content for search engines with AI',
      icon: '🔍',
      features: ['Keyword research', 'Content analysis', 'Competitor tracking', 'Rank monitoring'],
      pricing: 'freemium'
    },
    {
      id: '8',
      name: 'Voice Synthesizer',
      category: 'media',
      description: 'Convert text to natural-sounding speech',
      icon: '🎙️',
      features: ['50+ voices', 'Multiple languages', 'Emotion control', 'Commercial license'],
      pricing: 'freemium'
    },
    {
      id: '9',
      name: 'Research Assistant',
      category: 'research',
      description: 'Find and summarize academic papers and research',
      icon: '📚',
      features: ['Paper search', 'Auto-summarization', 'Citation generator', 'Literature review'],
      pricing: 'free'
    },
    {
      id: '10',
      name: 'Email Writer',
      category: 'business',
      description: 'Compose professional emails with AI',
      icon: '📧',
      features: ['Email templates', 'Tone adjustment', 'Follow-ups', 'Multi-language'],
      pricing: 'free'
    },
    {
      id: '11',
      name: 'Presentation Builder',
      category: 'business',
      description: 'Create stunning presentations automatically',
      icon: '📊',
      features: ['Auto-design', 'Smart layouts', 'Stock images', 'Export to PPT'],
      pricing: 'freemium'
    },
    {
      id: '12',
      name: 'Music Composer',
      category: 'media',
      description: 'Generate original music tracks with AI',
      icon: '🎵',
      features: ['Multiple genres', 'Mood selection', 'Royalty-free', 'MIDI export'],
      pricing: 'paid'
    }
  ];

  const filteredTools = tools.filter(tool => {
    const matchesCategory = activeCategory === 'all' || tool.category === activeCategory;
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="ai-tools-hub">
      <div className="ai-tools-container">
        {/* Header */}
        <div className="ai-tools-header">
          <div>
            <h1>🤖 AI Tools Hub</h1>
            <p>Discover and use powerful AI tools for every task</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="search-section">
          <div className="search-bar-ai">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search AI tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Categories */}
        <div className="categories-section">
          <div className="categories-scroll">
            {categories.map(category => (
              <button
                key={category.id}
                className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(category.id)}
              >
                <span className="category-icon">{category.icon}</span>
                <span className="category-name">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="ai-stats-grid">
          <div className="ai-stat-card">
            <div className="ai-stat-icon">🎯</div>
            <div className="ai-stat-info">
              <span className="ai-stat-value">{tools.length}</span>
              <span className="ai-stat-label">AI Tools</span>
            </div>
          </div>
          <div className="ai-stat-card">
            <div className="ai-stat-icon">✨</div>
            <div className="ai-stat-info">
              <span className="ai-stat-value">{tools.filter(t => t.pricing === 'free').length}</span>
              <span className="ai-stat-label">Free Tools</span>
            </div>
          </div>
          <div className="ai-stat-card">
            <div className="ai-stat-icon">🚀</div>
            <div className="ai-stat-info">
              <span className="ai-stat-value">{categories.length - 1}</span>
              <span className="ai-stat-label">Categories</span>
            </div>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="tools-grid">
          {filteredTools.map(tool => (
            <div key={tool.id} className="tool-card">
              <div className="tool-header">
                <div className="tool-icon-large">{tool.icon}</div>
                <span className={`pricing-badge ${tool.pricing}`}>
                  {tool.pricing === 'free' ? '✨ Free' : tool.pricing === 'freemium' ? '🎁 Freemium' : '💎 Paid'}
                </span>
              </div>
              
              <h3 className="tool-name">{tool.name}</h3>
              <p className="tool-description">{tool.description}</p>
              
              <div className="tool-features">
                {tool.features.map((feature, index) => (
                  <span key={index} className="feature-tag">
                    ✓ {feature}
                  </span>
                ))}
              </div>

              <div className="tool-actions">
                <button className="tool-btn primary">Launch Tool</button>
                <button className="tool-btn secondary">Learn More</button>
              </div>
            </div>
          ))}
        </div>

        {filteredTools.length === 0 && (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <h3>No tools found</h3>
            <p>Try adjusting your search or category filter</p>
          </div>
        )}

        {/* Featured Section */}
        <div className="featured-section">
          <h2>🌟 Featured AI Capabilities</h2>
          <div className="capabilities-grid">
            <div className="capability-card">
              <div className="capability-icon">🧠</div>
              <h4>Natural Language Processing</h4>
              <p>Understand and generate human-like text</p>
            </div>
            <div className="capability-card">
              <div className="capability-icon">👁️</div>
              <h4>Computer Vision</h4>
              <p>Analyze and generate images with AI</p>
            </div>
            <div className="capability-card">
              <div className="capability-icon">🎵</div>
              <h4>Audio Processing</h4>
              <p>Speech recognition and synthesis</p>
            </div>
            <div className="capability-card">
              <div className="capability-icon">📊</div>
              <h4>Data Analytics</h4>
              <p>Extract insights from complex data</p>
            </div>
            <div className="capability-card">
              <div className="capability-icon">🤖</div>
              <h4>Machine Learning</h4>
              <p>Train custom AI models</p>
            </div>
            <div className="capability-card">
              <div className="capability-icon">⚡</div>
              <h4>Real-time Processing</h4>
              <p>Instant AI-powered results</p>
            </div>
          </div>
        </div>

        {/* Integration Section */}
        <div className="integration-section">
          <h2>🔗 Integrations & APIs</h2>
          <p>Connect AI tools to your favorite platforms</p>
          <div className="integration-logos">
            <div className="integration-logo">Slack</div>
            <div className="integration-logo">Discord</div>
            <div className="integration-logo">Notion</div>
            <div className="integration-logo">Google Workspace</div>
            <div className="integration-logo">Microsoft 365</div>
            <div className="integration-logo">Zapier</div>
            <div className="integration-logo">GitHub</div>
            <div className="integration-logo">Figma</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIToolsHub;

