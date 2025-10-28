import React, { useState } from 'react';
import './MediaBrowser.css';

interface MediaFile {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio' | 'document' | 'other';
  size: string;
  thumbnail?: string;
  url: string;
  uploadedAt: Date;
}

export const MediaBrowser: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'images' | 'videos' | 'audio' | 'documents'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());

  // Sample media files
  const [mediaFiles] = useState<MediaFile[]>([
    {
      id: '1',
      name: 'Project_Screenshot.png',
      type: 'image',
      size: '2.4 MB',
      url: '/api/placeholder/200/150',
      uploadedAt: new Date('2025-10-27'),
    },
    {
      id: '2',
      name: 'Tutorial_Video.mp4',
      type: 'video',
      size: '45.8 MB',
      url: '/videos/tutorial.mp4',
      uploadedAt: new Date('2025-10-26'),
    },
    {
      id: '3',
      name: 'Podcast_Episode.mp3',
      type: 'audio',
      size: '12.3 MB',
      url: '/audio/podcast.mp3',
      uploadedAt: new Date('2025-10-25'),
    },
    {
      id: '4',
      name: 'Business_Plan.pdf',
      type: 'document',
      size: '1.2 MB',
      url: '/documents/business-plan.pdf',
      uploadedAt: new Date('2025-10-24'),
    },
  ]);

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return '🖼️';
      case 'video': return '🎬';
      case 'audio': return '🎵';
      case 'document': return '📄';
      default: return '📁';
    }
  };

  const filteredFiles = mediaFiles.filter(file => {
    const matchesTab = activeTab === 'all' || file.type === activeTab.slice(0, -1);
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const toggleFileSelection = (fileId: string) => {
    const newSelected = new Set(selectedFiles);
    if (newSelected.has(fileId)) {
      newSelected.delete(fileId);
    } else {
      newSelected.add(fileId);
    }
    setSelectedFiles(newSelected);
  };

  return (
    <div className="media-browser">
      {/* Header */}
      <div className="browser-header">
        <h3>📁 Media Browser</h3>
        <button className="upload-btn">
          ⬆️ Upload
        </button>
      </div>

      {/* Search Bar */}
      <div className="browser-search">
        <input
          type="text"
          placeholder="Search files..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="search-btn">🔍</button>
      </div>

      {/* Tabs */}
      <div className="browser-tabs">
        <button
          className={`tab ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          📂 All
        </button>
        <button
          className={`tab ${activeTab === 'images' ? 'active' : ''}`}
          onClick={() => setActiveTab('images')}
        >
          🖼️ Images
        </button>
        <button
          className={`tab ${activeTab === 'videos' ? 'active' : ''}`}
          onClick={() => setActiveTab('videos')}
        >
          🎬 Videos
        </button>
        <button
          className={`tab ${activeTab === 'audio' ? 'active' : ''}`}
          onClick={() => setActiveTab('audio')}
        >
          🎵 Audio
        </button>
        <button
          className={`tab ${activeTab === 'documents' ? 'active' : ''}`}
          onClick={() => setActiveTab('documents')}
        >
          📄 Docs
        </button>
      </div>

      {/* View Mode Toggle */}
      <div className="view-controls">
        <button
          className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
          onClick={() => setViewMode('grid')}
          title="Grid View"
        >
          ▦
        </button>
        <button
          className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
          onClick={() => setViewMode('list')}
          title="List View"
        >
          ☰
        </button>
        <span className="file-count">{filteredFiles.length} files</span>
      </div>

      {/* Files Display */}
      <div className={`files-container ${viewMode}`}>
        {filteredFiles.map(file => (
          <div
            key={file.id}
            className={`file-item ${selectedFiles.has(file.id) ? 'selected' : ''}`}
            onClick={() => toggleFileSelection(file.id)}
          >
            {viewMode === 'grid' ? (
              <>
                <div className="file-thumbnail">
                  {file.type === 'image' ? (
                    <img src={file.url} alt={file.name} />
                  ) : (
                    <span className="file-icon-large">{getFileIcon(file.type)}</span>
                  )}
                </div>
                <div className="file-info">
                  <div className="file-name" title={file.name}>{file.name}</div>
                  <div className="file-size">{file.size}</div>
                </div>
              </>
            ) : (
              <>
                <span className="file-icon">{getFileIcon(file.type)}</span>
                <div className="file-details">
                  <div className="file-name">{file.name}</div>
                  <div className="file-meta">
                    <span>{file.size}</span>
                    <span>•</span>
                    <span>{file.uploadedAt.toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="file-actions">
                  <button className="action-btn" title="Download">⬇️</button>
                  <button className="action-btn" title="Share">🔗</button>
                  <button className="action-btn" title="More">⋮</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Selected Files Actions */}
      {selectedFiles.size > 0 && (
        <div className="selection-actions">
          <span>{selectedFiles.size} selected</span>
          <div className="action-buttons">
            <button className="action-btn">⬇️ Download</button>
            <button className="action-btn">🔗 Share</button>
            <button className="action-btn">🗑️ Delete</button>
            <button className="action-btn" onClick={() => setSelectedFiles(new Set())}>
              ✖️ Clear
            </button>
          </div>
        </div>
      )}

      {/* Storage Info */}
      <div className="storage-info">
        <div className="storage-bar">
          <div className="storage-used" style={{ width: '45%' }}></div>
        </div>
        <div className="storage-text">
          <span>45 GB used</span>
          <span>100 GB total</span>
        </div>
      </div>

      {/* Quick Access */}
      <div className="quick-access">
        <h4>Quick Access</h4>
        <div className="quick-folders">
          <button className="folder-btn">📸 Recent</button>
          <button className="folder-btn">⭐ Favorites</button>
          <button className="folder-btn">🗑️ Trash</button>
          <button className="folder-btn">☁️ Cloud</button>
        </div>
      </div>
    </div>
  );
};

