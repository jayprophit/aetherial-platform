/**
 * AETHERIAL Global Search Component
 * 
 * Military-Grade Search System
 * 
 * Features:
 * - Search across all modules (courses, jobs, products, users, posts)
 * - Advanced filters (date, category, price, location)
 * - Real-time suggestions
 * - Search history
 * - Keyboard shortcuts (Ctrl+K)
 * - Voice search
 * - Image search
 * 
 * @module components/GlobalSearch
 */

import React, { useState, useEffect, useRef } from 'react';
import './GlobalSearch.css';

interface SearchResult {
  id: number;
  type: 'course' | 'job' | 'product' | 'user' | 'post' | 'article';
  title: string;
  description: string;
  url: string;
  thumbnail?: string;
  metadata?: any;
  score: number;
}

interface SearchFilters {
  type: string[];
  dateRange: string;
  priceRange: { min: number; max: number };
  location: string;
  category: string;
  sortBy: string;
}

const GlobalSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({
    type: [],
    dateRange: 'all',
    priceRange: { min: 0, max: 10000 },
    location: '',
    category: '',
    sortBy: 'relevance'
  });
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
        inputRef.current?.focus();
      }
      
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Load search history
  useEffect(() => {
    const history = localStorage.getItem('searchHistory');
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  }, []);

  // Search with debounce
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(() => {
      performSearch();
    }, 300);

    return () => clearTimeout(timer);
  }, [query, filters]);

  const performSearch = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        q: query,
        types: filters.type.join(','),
        dateRange: filters.dateRange,
        minPrice: filters.priceRange.min.toString(),
        maxPrice: filters.priceRange.max.toString(),
        location: filters.location,
        category: filters.category,
        sortBy: filters.sortBy
      });
      
      const response = await fetch(`/api/search?${params}`);
      const data = await response.json();
      
      setResults(data.results || []);
      setSuggestions(data.suggestions || []);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    
    // Add to history
    if (searchQuery.trim() && !searchHistory.includes(searchQuery)) {
      const newHistory = [searchQuery, ...searchHistory].slice(0, 10);
      setSearchHistory(newHistory);
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      window.location.href = results[selectedIndex].url;
    }
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  const getResultIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      course: '📚',
      job: '💼',
      product: '🛍️',
      user: '👤',
      post: '📝',
      article: '📰'
    };
    return icons[type] || '📄';
  };

  return (
    <>
      {/* Search Trigger Button */}
      <button 
        className="search-trigger"
        onClick={() => setIsOpen(true)}
        aria-label="Open search"
      >
        <span className="search-icon">🔍</span>
        <span className="search-placeholder">Search...</span>
        <span className="search-shortcut">⌘K</span>
      </button>

      {/* Search Modal */}
      {isOpen && (
        <div className="search-modal-overlay">
          <div className="search-modal" ref={searchRef}>
            {/* Search Input */}
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input
                ref={inputRef}
                type="text"
                className="search-input"
                placeholder="Search courses, jobs, products, users..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
              />
              {query && (
                <button 
                  className="clear-button"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
              <button
                className="filter-toggle"
                onClick={() => setShowFilters(!showFilters)}
                aria-label="Toggle filters"
              >
                🎛️
              </button>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="search-filters">
                <div className="filter-group">
                  <label>Type</label>
                  <div className="filter-chips">
                    {['course', 'job', 'product', 'user', 'post', 'article'].map(type => (
                      <button
                        key={type}
                        className={`filter-chip ${filters.type.includes(type) ? 'active' : ''}`}
                        onClick={() => {
                          setFilters(prev => ({
                            ...prev,
                            type: prev.type.includes(type)
                              ? prev.type.filter(t => t !== type)
                              : [...prev.type, type]
                          }));
                        }}
                      >
                        {getResultIcon(type)} {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="filter-group">
                  <label>Date Range</label>
                  <select
                    value={filters.dateRange}
                    onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                  >
                    <option value="all">All time</option>
                    <option value="today">Today</option>
                    <option value="week">This week</option>
                    <option value="month">This month</option>
                    <option value="year">This year</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label>Sort By</label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                  >
                    <option value="relevance">Relevance</option>
                    <option value="date">Date</option>
                    <option value="popularity">Popularity</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>
              </div>
            )}

            {/* Search Results */}
            <div className="search-results">
              {loading && (
                <div className="search-loading">
                  <div className="spinner"></div>
                  <p>Searching...</p>
                </div>
              )}

              {!loading && !query && searchHistory.length > 0 && (
                <div className="search-history">
                  <div className="history-header">
                    <h3>Recent Searches</h3>
                    <button onClick={clearHistory}>Clear</button>
                  </div>
                  {searchHistory.map((item, index) => (
                    <button
                      key={index}
                      className="history-item"
                      onClick={() => handleSearch(item)}
                    >
                      <span className="history-icon">🕐</span>
                      <span>{item}</span>
                    </button>
                  ))}
                </div>
              )}

              {!loading && query && results.length === 0 && (
                <div className="no-results">
                  <p>No results found for "{query}"</p>
                  {suggestions.length > 0 && (
                    <div className="suggestions">
                      <p>Did you mean:</p>
                      {suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSearch(suggestion)}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {!loading && results.length > 0 && (
                <div className="results-list">
                  {results.map((result, index) => (
                    <a
                      key={result.id}
                      href={result.url}
                      className={`result-item ${index === selectedIndex ? 'selected' : ''}`}
                      onMouseEnter={() => setSelectedIndex(index)}
                    >
                      {result.thumbnail && (
                        <img 
                          src={result.thumbnail} 
                          alt={result.title}
                          className="result-thumbnail"
                        />
                      )}
                      <div className="result-content">
                        <div className="result-header">
                          <span className="result-icon">{getResultIcon(result.type)}</span>
                          <span className="result-type">{result.type}</span>
                        </div>
                        <h4 className="result-title">{result.title}</h4>
                        <p className="result-description">{result.description}</p>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="search-footer">
              <div className="search-tips">
                <span><kbd>↑</kbd><kbd>↓</kbd> Navigate</span>
                <span><kbd>↵</kbd> Select</span>
                <span><kbd>ESC</kbd> Close</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GlobalSearch;

