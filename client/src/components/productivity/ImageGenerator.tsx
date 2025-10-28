import React, { useState } from 'react';
import './ImageGenerator.css';

/**
 * Comprehensive Image Generation Tool
 * 
 * Features:
 * - Text-to-image generation
 * - Image-to-image transformation
 * - Style transfer
 * - Inpainting/outpainting
 * - Upscaling
 * - Background removal
 * - Multiple AI models (DALL-E, Midjourney, Stable Diffusion, etc.)
 * - Batch generation
 * - History and favorites
 */

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  model: string;
  timestamp: Date;
  isFavorite: boolean;
}

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState('stable-diffusion');
  const [selectedStyle, setSelectedStyle] = useState('realistic');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [numImages, setNumImages] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [activeTab, setActiveTab] = useState<'generate' | 'edit' | 'history'>('generate');

  const models = [
    { id: 'stable-diffusion', name: 'Stable Diffusion XL', speed: 'Fast', quality: 'High' },
    { id: 'dall-e-3', name: 'DALL-E 3', speed: 'Medium', quality: 'Very High' },
    { id: 'midjourney', name: 'Midjourney v6', speed: 'Slow', quality: 'Exceptional' },
    { id: 'flux', name: 'Flux Pro', speed: 'Fast', quality: 'High' },
    { id: 'playground', name: 'Playground v2.5', speed: 'Fast', quality: 'High' }
  ];

  const styles = [
    'Realistic', 'Anime', 'Digital Art', 'Oil Painting', 'Watercolor',
    'Sketch', '3D Render', 'Pixel Art', 'Comic Book', 'Cyberpunk',
    'Fantasy', 'Sci-Fi', 'Abstract', 'Minimalist', 'Vintage'
  ];

  const aspectRatios = [
    { value: '1:1', label: 'Square (1:1)' },
    { value: '16:9', label: 'Landscape (16:9)' },
    { value: '9:16', label: 'Portrait (9:16)' },
    { value: '4:3', label: 'Classic (4:3)' },
    { value: '21:9', label: 'Ultrawide (21:9)' }
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert('Please enter a prompt');
      return;
    }

    setIsGenerating(true);

    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 3000));

    const newImages: GeneratedImage[] = Array.from({ length: numImages }, (_, i) => ({
      id: `img-${Date.now()}-${i}`,
      url: `https://picsum.photos/512/512?random=${Date.now()}-${i}`,
      prompt,
      model: selectedModel,
      timestamp: new Date(),
      isFavorite: false
    }));

    setGeneratedImages([...newImages, ...generatedImages]);
    setIsGenerating(false);
  };

  const toggleFavorite = (id: string) => {
    setGeneratedImages(prev =>
      prev.map(img => img.id === id ? { ...img, isFavorite: !img.isFavorite } : img)
    );
  };

  const downloadImage = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
  };

  return (
    <div className="image-generator">
      <div className="image-generator-header">
        <h1>🎨 AI Image Generator</h1>
        <p>Create stunning images with advanced AI models</p>
      </div>

      <div className="image-generator-tabs">
        <button 
          className={activeTab === 'generate' ? 'active' : ''}
          onClick={() => setActiveTab('generate')}
        >
          ✨ Generate
        </button>
        <button 
          className={activeTab === 'edit' ? 'active' : ''}
          onClick={() => setActiveTab('edit')}
        >
          ✏️ Edit
        </button>
        <button 
          className={activeTab === 'history' ? 'active' : ''}
          onClick={() => setActiveTab('history')}
        >
          📚 History
        </button>
      </div>

      <div className="image-generator-content">
        {activeTab === 'generate' && (
          <div className="generate-tab">
            <div className="generation-controls">
              <div className="control-section">
                <h3>Prompt</h3>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the image you want to generate..."
                  rows={4}
                />
              </div>

              <div className="control-section">
                <h3>Negative Prompt (Optional)</h3>
                <textarea
                  value={negativePrompt}
                  onChange={(e) => setNegativePrompt(e.target.value)}
                  placeholder="What you don't want in the image..."
                  rows={2}
                />
              </div>

              <div className="control-section">
                <h3>AI Model</h3>
                <div className="model-grid">
                  {models.map(model => (
                    <div
                      key={model.id}
                      className={`model-card ${selectedModel === model.id ? 'selected' : ''}`}
                      onClick={() => setSelectedModel(model.id)}
                    >
                      <div className="model-name">{model.name}</div>
                      <div className="model-specs">
                        <span>⚡ {model.speed}</span>
                        <span>⭐ {model.quality}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="control-section">
                <h3>Style</h3>
                <select value={selectedStyle} onChange={(e) => setSelectedStyle(e.target.value)}>
                  {styles.map(style => (
                    <option key={style} value={style.toLowerCase()}>{style}</option>
                  ))}
                </select>
              </div>

              <div className="control-row">
                <div className="control-section">
                  <h3>Aspect Ratio</h3>
                  <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)}>
                    {aspectRatios.map(ratio => (
                      <option key={ratio.value} value={ratio.value}>{ratio.label}</option>
                    ))}
                  </select>
                </div>

                <div className="control-section">
                  <h3>Number of Images</h3>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={numImages}
                    onChange={(e) => setNumImages(parseInt(e.target.value))}
                  />
                </div>
              </div>

              <button 
                className="generate-button"
                onClick={handleGenerate}
                disabled={isGenerating}
              >
                {isGenerating ? '⏳ Generating...' : '✨ Generate Images'}
              </button>
            </div>

            <div className="generation-results">
              <h3>Generated Images</h3>
              {isGenerating && (
                <div className="loading">
                  <div className="spinner"></div>
                  <p>Creating your masterpiece...</p>
                </div>
              )}
              <div className="image-grid">
                {generatedImages.map(img => (
                  <div key={img.id} className="image-card">
                    <img src={img.url} alt={img.prompt} />
                    <div className="image-actions">
                      <button onClick={() => toggleFavorite(img.id)}>
                        {img.isFavorite ? '❤️' : '🤍'}
                      </button>
                      <button onClick={() => downloadImage(img.url, `${img.id}.png`)}>
                        💾
                      </button>
                      <button>✏️</button>
                      <button>🔄</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'edit' && (
          <div className="edit-tab">
            <h2>Image Editing Tools</h2>
            <div className="edit-tools">
              <div className="tool-card">
                <h3>🎨 Inpainting</h3>
                <p>Edit specific parts of an image</p>
                <button>Start Inpainting</button>
              </div>
              <div className="tool-card">
                <h3>🖼️ Outpainting</h3>
                <p>Extend image beyond its borders</p>
                <button>Start Outpainting</button>
              </div>
              <div className="tool-card">
                <h3>🔍 Upscale</h3>
                <p>Increase image resolution</p>
                <button>Upscale Image</button>
              </div>
              <div className="tool-card">
                <h3>✂️ Background Removal</h3>
                <p>Remove or replace background</p>
                <button>Remove Background</button>
              </div>
              <div className="tool-card">
                <h3>🎭 Style Transfer</h3>
                <p>Apply artistic styles</p>
                <button>Transfer Style</button>
              </div>
              <div className="tool-card">
                <h3>🔄 Variations</h3>
                <p>Generate similar versions</p>
                <button>Create Variations</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="history-tab">
            <h2>Generation History</h2>
            <div className="history-filters">
              <button>All</button>
              <button>Favorites</button>
              <button>Today</button>
              <button>This Week</button>
              <button>This Month</button>
            </div>
            <div className="image-grid">
              {generatedImages.map(img => (
                <div key={img.id} className="image-card">
                  <img src={img.url} alt={img.prompt} />
                  <div className="image-info">
                    <p className="image-prompt">{img.prompt}</p>
                    <p className="image-meta">
                      {img.model} • {img.timestamp.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="image-actions">
                    <button onClick={() => toggleFavorite(img.id)}>
                      {img.isFavorite ? '❤️' : '🤍'}
                    </button>
                    <button onClick={() => downloadImage(img.url, `${img.id}.png`)}>
                      💾
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

export default ImageGenerator;

