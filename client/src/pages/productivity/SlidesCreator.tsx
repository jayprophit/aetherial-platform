import React, { useState } from 'react';
import './SlidesCreator.css';

interface Slide {
  id: string;
  type: 'title' | 'content' | 'image' | 'two-column' | 'quote' | 'chart';
  title: string;
  content: string;
  imageUrl?: string;
  backgroundColor: string;
  textColor: string;
}

const SlidesCreator: React.FC = () => {
  const [slides, setSlides] = useState<Slide[]>([
    {
      id: '1',
      type: 'title',
      title: 'Welcome to AETHERIAL',
      content: 'Your Presentation Subtitle',
      backgroundColor: '#667eea',
      textColor: '#ffffff',
    },
  ]);
  
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [presentationMode, setPresentationMode] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  
  const currentSlide = slides[currentSlideIndex];
  
  const templates = [
    { name: 'Business', color: '#667eea', icon: '💼' },
    { name: 'Creative', color: '#f093fb', icon: '🎨' },
    { name: 'Minimal', color: '#333333', icon: '⚡' },
    { name: 'Modern', color: '#4facfe', icon: '🚀' },
    { name: 'Dark', color: '#1a1a2e', icon: '🌙' },
    { name: 'Light', color: '#ffffff', icon: '☀️' },
  ];
  
  const slideTypes = [
    { type: 'title', name: 'Title Slide', icon: '📌' },
    { type: 'content', name: 'Content', icon: '📝' },
    { type: 'image', name: 'Image', icon: '🖼️' },
    { type: 'two-column', name: 'Two Column', icon: '📊' },
    { type: 'quote', name: 'Quote', icon: '💬' },
    { type: 'chart', name: 'Chart', icon: '📈' },
  ];
  
  const addSlide = (type: Slide['type']) => {
    const newSlide: Slide = {
      id: Date.now().toString(),
      type,
      title: 'New Slide Title',
      content: 'Add your content here...',
      backgroundColor: currentSlide.backgroundColor,
      textColor: currentSlide.textColor,
    };
    
    const newSlides = [...slides];
    newSlides.splice(currentSlideIndex + 1, 0, newSlide);
    setSlides(newSlides);
    setCurrentSlideIndex(currentSlideIndex + 1);
  };
  
  const deleteSlide = () => {
    if (slides.length === 1) return;
    const newSlides = slides.filter((_, idx) => idx !== currentSlideIndex);
    setSlides(newSlides);
    setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1));
  };
  
  const duplicateSlide = () => {
    const newSlide = { ...currentSlide, id: Date.now().toString() };
    const newSlides = [...slides];
    newSlides.splice(currentSlideIndex + 1, 0, newSlide);
    setSlides(newSlides);
    setCurrentSlideIndex(currentSlideIndex + 1);
  };
  
  const updateSlide = (updates: Partial<Slide>) => {
    const newSlides = [...slides];
    newSlides[currentSlideIndex] = { ...currentSlide, ...updates };
    setSlides(newSlides);
  };
  
  const moveSlide = (direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? currentSlideIndex - 1 : currentSlideIndex + 1;
    if (newIndex < 0 || newIndex >= slides.length) return;
    
    const newSlides = [...slides];
    [newSlides[currentSlideIndex], newSlides[newIndex]] = [newSlides[newIndex], newSlides[currentSlideIndex]];
    setSlides(newSlides);
    setCurrentSlideIndex(newIndex);
  };
  
  const applyTemplate = (template: typeof templates[0]) => {
    const newSlides = slides.map(slide => ({
      ...slide,
      backgroundColor: template.color,
      textColor: template.color === '#ffffff' ? '#333333' : '#ffffff',
    }));
    setSlides(newSlides);
    setShowTemplates(false);
  };
  
  const generateWithAI = async (prompt: string) => {
    // Simulate AI generation
    const aiSlides: Slide[] = [
      {
        id: '1',
        type: 'title',
        title: 'AI Generated Presentation',
        content: 'Created by AETHERIAL AI',
        backgroundColor: '#667eea',
        textColor: '#ffffff',
      },
      {
        id: '2',
        type: 'content',
        title: 'Introduction',
        content: 'This presentation was generated based on your prompt...',
        backgroundColor: '#667eea',
        textColor: '#ffffff',
      },
      {
        id: '3',
        type: 'two-column',
        title: 'Key Points',
        content: 'Left column content | Right column content',
        backgroundColor: '#667eea',
        textColor: '#ffffff',
      },
    ];
    
    setSlides(aiSlides);
    setCurrentSlideIndex(0);
    setShowAIAssistant(false);
  };
  
  const exportPresentation = (format: 'pdf' | 'pptx' | 'html') => {
    alert(`Exporting presentation as ${format.toUpperCase()}...`);
  };
  
  const renderSlidePreview = (slide: Slide) => {
    return (
      <div 
        className="slide-preview-content"
        style={{ 
          backgroundColor: slide.backgroundColor,
          color: slide.textColor,
        }}
      >
        {slide.type === 'title' && (
          <div className="slide-title-layout">
            <h1>{slide.title}</h1>
            <p>{slide.content}</p>
          </div>
        )}
        
        {slide.type === 'content' && (
          <div className="slide-content-layout">
            <h2>{slide.title}</h2>
            <p>{slide.content}</p>
          </div>
        )}
        
        {slide.type === 'image' && (
          <div className="slide-image-layout">
            <h2>{slide.title}</h2>
            {slide.imageUrl ? (
              <img src={slide.imageUrl} alt={slide.title} />
            ) : (
              <div className="image-placeholder">🖼️ Add Image</div>
            )}
          </div>
        )}
        
        {slide.type === 'two-column' && (
          <div className="slide-two-column-layout">
            <h2>{slide.title}</h2>
            <div className="two-columns">
              <div className="column">{slide.content.split('|')[0] || 'Left column'}</div>
              <div className="column">{slide.content.split('|')[1] || 'Right column'}</div>
            </div>
          </div>
        )}
        
        {slide.type === 'quote' && (
          <div className="slide-quote-layout">
            <blockquote>"{slide.content}"</blockquote>
            <cite>— {slide.title}</cite>
          </div>
        )}
        
        {slide.type === 'chart' && (
          <div className="slide-chart-layout">
            <h2>{slide.title}</h2>
            <div className="chart-placeholder">📈 Chart Visualization</div>
          </div>
        )}
      </div>
    );
  };
  
  if (presentationMode) {
    return (
      <div className="presentation-mode">
        <div className="presentation-slide">
          {renderSlidePreview(currentSlide)}
        </div>
        <div className="presentation-controls">
          <button onClick={() => setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))}>
            ← Previous
          </button>
          <span>{currentSlideIndex + 1} / {slides.length}</span>
          <button onClick={() => setCurrentSlideIndex(Math.min(slides.length - 1, currentSlideIndex + 1))}>
            Next →
          </button>
          <button onClick={() => setPresentationMode(false)}>Exit</button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="slides-creator">
      {/* Header */}
      <div className="slides-header">
        <div className="slides-title">
          <h1>📊 Slides Creator</h1>
          <input 
            type="text" 
            placeholder="Untitled Presentation"
            className="presentation-name-input"
          />
        </div>
        
        <div className="slides-actions">
          <button className="action-btn" onClick={() => setShowAIAssistant(true)}>
            🤖 AI Generate
          </button>
          <button className="action-btn" onClick={() => setShowTemplates(true)}>
            🎨 Templates
          </button>
          <button className="action-btn" onClick={() => setPresentationMode(true)}>
            ▶️ Present
          </button>
          <div className="export-dropdown">
            <button className="action-btn">📥 Export</button>
            <div className="dropdown-menu">
              <button onClick={() => exportPresentation('pdf')}>Export as PDF</button>
              <button onClick={() => exportPresentation('pptx')}>Export as PPTX</button>
              <button onClick={() => exportPresentation('html')}>Export as HTML</button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="slides-main">
        {/* Sidebar - Slide Thumbnails */}
        <div className="slides-sidebar">
          <div className="sidebar-header">
            <h3>Slides ({slides.length})</h3>
            <div className="add-slide-dropdown">
              <button className="add-slide-btn">+ Add</button>
              <div className="dropdown-menu">
                {slideTypes.map(type => (
                  <button key={type.type} onClick={() => addSlide(type.type as Slide['type'])}>
                    {type.icon} {type.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="slides-list">
            {slides.map((slide, idx) => (
              <div
                key={slide.id}
                className={`slide-thumbnail ${idx === currentSlideIndex ? 'active' : ''}`}
                onClick={() => setCurrentSlideIndex(idx)}
              >
                <div className="thumbnail-number">{idx + 1}</div>
                <div className="thumbnail-preview">
                  {renderSlidePreview(slide)}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Editor */}
        <div className="slides-editor">
          <div className="editor-toolbar">
            <div className="toolbar-group">
              <button onClick={() => moveSlide('up')} disabled={currentSlideIndex === 0}>
                ↑ Move Up
              </button>
              <button onClick={() => moveSlide('down')} disabled={currentSlideIndex === slides.length - 1}>
                ↓ Move Down
              </button>
            </div>
            
            <div className="toolbar-group">
              <button onClick={duplicateSlide}>📋 Duplicate</button>
              <button onClick={deleteSlide} disabled={slides.length === 1}>
                🗑️ Delete
              </button>
            </div>
            
            <div className="toolbar-group">
              <label>
                Background:
                <input
                  type="color"
                  value={currentSlide.backgroundColor}
                  onChange={(e) => updateSlide({ backgroundColor: e.target.value })}
                />
              </label>
              <label>
                Text Color:
                <input
                  type="color"
                  value={currentSlide.textColor}
                  onChange={(e) => updateSlide({ textColor: e.target.value })}
                />
              </label>
            </div>
          </div>
          
          <div className="editor-canvas">
            <div 
              className="slide-canvas"
              style={{
                backgroundColor: currentSlide.backgroundColor,
                color: currentSlide.textColor,
              }}
            >
              {renderSlidePreview(currentSlide)}
            </div>
          </div>
          
          <div className="editor-properties">
            <h3>Slide Properties</h3>
            <div className="property-group">
              <label>Title:</label>
              <input
                type="text"
                value={currentSlide.title}
                onChange={(e) => updateSlide({ title: e.target.value })}
              />
            </div>
            <div className="property-group">
              <label>Content:</label>
              <textarea
                value={currentSlide.content}
                onChange={(e) => updateSlide({ content: e.target.value })}
                rows={5}
              />
            </div>
            {currentSlide.type === 'image' && (
              <div className="property-group">
                <label>Image URL:</label>
                <input
                  type="text"
                  placeholder="https://example.com/image.jpg"
                  value={currentSlide.imageUrl || ''}
                  onChange={(e) => updateSlide({ imageUrl: e.target.value })}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Templates Modal */}
      {showTemplates && (
        <div className="modal-overlay" onClick={() => setShowTemplates(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Choose a Template</h2>
            <div className="templates-grid">
              {templates.map(template => (
                <div
                  key={template.name}
                  className="template-card"
                  style={{ backgroundColor: template.color }}
                  onClick={() => applyTemplate(template)}
                >
                  <span className="template-icon">{template.icon}</span>
                  <span className="template-name">{template.name}</span>
                </div>
              ))}
            </div>
            <button className="modal-close" onClick={() => setShowTemplates(false)}>
              Close
            </button>
          </div>
        </div>
      )}
      
      {/* AI Assistant Modal */}
      {showAIAssistant && (
        <div className="modal-overlay" onClick={() => setShowAIAssistant(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>🤖 AI Presentation Generator</h2>
            <p>Describe your presentation and AI will generate slides for you:</p>
            <textarea
              placeholder="E.g., Create a 5-slide presentation about climate change with introduction, causes, effects, solutions, and conclusion"
              rows={5}
              className="ai-prompt-input"
            />
            <div className="modal-actions">
              <button 
                className="primary-btn"
                onClick={() => generateWithAI('User prompt here')}
              >
                Generate Slides
              </button>
              <button onClick={() => setShowAIAssistant(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SlidesCreator;

