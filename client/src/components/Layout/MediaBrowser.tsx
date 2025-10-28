/**
 * AETHERIAL Platform - Media Browser (Right Sidebar #2)
 * 
 * Features:
 * - Media gallery viewer
 * - Iframe content viewer
 * - Video player
 * - Document preview
 * - Cascading view options (grid/list/preview modes)
 * - Responsive design
 */

import React, { useState } from 'react';
import './MediaBrowser.css';

interface MediaItem {
  id: string;
  type: 'image' | 'video' | 'document' | 'iframe';
  title: string;
  url: string;
  thumbnail?: string;
  size?: string;
  date?: Date;
}

interface MediaBrowserProps {
  isOpen: boolean;
  deviceInfo: any;
  onClose: () => void;
}

export default function MediaBrowser({ isOpen, deviceInfo, onClose }: MediaBrowserProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'preview'>('grid');
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video' | 'document'>('all');
  const [showViewOptions, setShowViewOptions] = useState(false);

  // Sample media items (in production, fetch from API)
  const [mediaItems] = useState<MediaItem[]>([
    {
      id: '1',
      type: 'image',
      title: 'Dashboard Screenshot',
      url: 'https://via.placeholder.com/800x600',
      thumbnail: 'https://via.placeholder.com/200x150',
      size: '2.4 MB',
      date: new Date(),
    },
    {
      id: '2',
      type: 'video',
      title: 'Platform Demo',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      thumbnail: 'https://via.placeholder.com/200x150',
      size: '15.8 MB',
      date: new Date(),
    },
    {
      id: '3',
      type: 'document',
      title: 'User Guide.pdf',
      url: '/documents/user-guide.pdf',
      thumbnail: 'https://via.placeholder.com/200x150',
      size: '1.2 MB',
      date: new Date(),
    },
    {
      id: '4',
      type: 'iframe',
      title: 'External Content',
      url: 'https://example.com',
      thumbnail: 'https://via.placeholder.com/200x150',
      date: new Date(),
    },
  ]);

  /**
   * Filter media items by type
   */
  const filteredItems = mediaItems.filter(item =>
    filterType === 'all' ? true : item.type === filterType
  );

  /**
   * Render media item based on view mode
   */
  const renderMediaItem = (item: MediaItem) => {
    if (viewMode === 'grid') {
      return (
        <div
          key={item.id}
          className="media-grid-item"
          onClick={() => setSelectedMedia(item)}
        >
          <div className="media-thumbnail">
            {item.type === 'video' && <div className="play-icon">▶</div>}
            <img src={item.thumbnail} alt={item.title} />
          </div>
          <div className="media-info">
            <div className="media-title">{item.title}</div>
            {item.size && <div className="media-size">{item.size}</div>}
          </div>
        </div>
      );
    }

    if (viewMode === 'list') {
      return (
        <div
          key={item.id}
          className="media-list-item"
          onClick={() => setSelectedMedia(item)}
        >
          <img src={item.thumbnail} alt={item.title} className="list-thumbnail" />
          <div className="list-info">
            <div className="media-title">{item.title}</div>
            <div className="media-meta">
              <span className="media-type">{item.type}</span>
              {item.size && <span className="media-size">{item.size}</span>}
              {item.date && (
                <span className="media-date">
                  {item.date.toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
          <button className="list-action">⋯</button>
        </div>
      );
    }

    return null;
  };

  /**
   * Render preview panel
   */
  const renderPreview = () => {
    if (!selectedMedia) {
      return (
        <div className="preview-empty">
          <div className="empty-icon">🖼️</div>
          <p>Select a media item to preview</p>
        </div>
      );
    }

    return (
      <div className="preview-container">
        <div className="preview-header">
          <h3>{selectedMedia.title}</h3>
          <button onClick={() => setSelectedMedia(null)}>✕</button>
        </div>
        <div className="preview-content">
          {selectedMedia.type === 'image' && (
            <img src={selectedMedia.url} alt={selectedMedia.title} />
          )}
          {selectedMedia.type === 'video' && (
            <iframe
              src={selectedMedia.url}
              title={selectedMedia.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
          {selectedMedia.type === 'document' && (
            <iframe
              src={selectedMedia.url}
              title={selectedMedia.title}
              frameBorder="0"
            />
          )}
          {selectedMedia.type === 'iframe' && (
            <iframe
              src={selectedMedia.url}
              title={selectedMedia.title}
              frameBorder="0"
            />
          )}
        </div>
        <div className="preview-actions">
          <button className="preview-btn">📥 Download</button>
          <button className="preview-btn">🔗 Share</button>
          <button className="preview-btn">🗑️ Delete</button>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <aside className={`media-browser device-${deviceInfo.type}`}>
      {/* Panel Header */}
      <div className="panel-header">
        <div className="header-title">
          <span className="media-icon">🖼️</span>
          <span>Media Browser</span>
        </div>
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>
      </div>

      {/* Toolbar */}
      <div className="media-toolbar">
        {/* Filter Buttons */}
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
            onClick={() => setFilterType('all')}
          >
            All
          </button>
          <button
            className={`filter-btn ${filterType === 'image' ? 'active' : ''}`}
            onClick={() => setFilterType('image')}
          >
            📷 Images
          </button>
          <button
            className={`filter-btn ${filterType === 'video' ? 'active' : ''}`}
            onClick={() => setFilterType('video')}
          >
            🎥 Videos
          </button>
          <button
            className={`filter-btn ${filterType === 'document' ? 'active' : ''}`}
            onClick={() => setFilterType('document')}
          >
            📄 Docs
          </button>
        </div>

        {/* View Options (Cascading Dropdown) */}
        <div className="view-options">
          <button
            className="view-btn"
            onClick={() => setShowViewOptions(!showViewOptions)}
          >
            {viewMode === 'grid' && '⊞'}
            {viewMode === 'list' && '☰'}
            {viewMode === 'preview' && '👁️'}
            <span className="dropdown-arrow">▼</span>
          </button>
          {showViewOptions && (
            <div className="view-dropdown">
              <button
                className={`view-option ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => {
                  setViewMode('grid');
                  setShowViewOptions(false);
                }}
              >
                ⊞ Grid View
              </button>
              <button
                className={`view-option ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => {
                  setViewMode('list');
                  setShowViewOptions(false);
                }}
              >
                ☰ List View
              </button>
              <button
                className={`view-option ${viewMode === 'preview' ? 'active' : ''}`}
                onClick={() => {
                  setViewMode('preview');
                  setShowViewOptions(false);
                }}
              >
                👁️ Preview Mode
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Media Content */}
      <div className="media-content">
        {viewMode === 'preview' ? (
          <div className="preview-layout">
            <div className="preview-sidebar">
              {filteredItems.map(item => (
                <div
                  key={item.id}
                  className={`preview-thumb ${selectedMedia?.id === item.id ? 'active' : ''}`}
                  onClick={() => setSelectedMedia(item)}
                >
                  <img src={item.thumbnail} alt={item.title} />
                </div>
              ))}
            </div>
            <div className="preview-main">
              {renderPreview()}
            </div>
          </div>
        ) : (
          <div className={`media-${viewMode}`}>
            {filteredItems.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📂</div>
                <p>No media items found</p>
              </div>
            ) : (
              filteredItems.map(renderMediaItem)
            )}
          </div>
        )}
      </div>

      {/* Upload Button */}
      <div className="media-footer">
        <button className="upload-btn">
          📤 Upload Media
        </button>
      </div>
    </aside>
  );
}

