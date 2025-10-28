/**
 * AETHERIAL Platform - Developer Tools & API Management Hub
 * Complete developer tools, API management, SDK, and documentation system
 */

import React, { useState, useEffect } from 'react';
import { unifiedSystemHub } from '../../lib/integration/unified-system-hub';
import './DeveloperHub.css';

interface APIKey {
  id: string;
  name: string;
  key: string;
  created: string;
  lastUsed: string;
  requests: number;
  status: 'active' | 'revoked';
}

interface APIEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description: string;
  category: string;
}

interface WebhookConfig {
  id: string;
  url: string;
  events: string[];
  status: 'active' | 'inactive';
  lastTriggered?: string;
}

const API_CATEGORIES = [
  { id: 'ai', name: 'AI & Machine Learning', icon: '🤖' },
  { id: 'blockchain', name: 'Blockchain & Crypto', icon: '⛓️' },
  { id: 'quantum', name: 'Quantum Computing', icon: '⚛️' },
  { id: 'iot', name: 'IoT & Robotics', icon: '🤖' },
  { id: 'data', name: 'Data & Analytics', icon: '📊' },
  { id: 'social', name: 'Social & Community', icon: '👥' },
  { id: 'commerce', name: 'E-Commerce', icon: '🛒' },
  { id: 'learning', name: 'E-Learning', icon: '📚' },
];

const SAMPLE_ENDPOINTS: APIEndpoint[] = [
  { method: 'POST', path: '/api/v1/ai/generate-text', description: 'Generate text using AI', category: 'ai' },
  { method: 'POST', path: '/api/v1/ai/generate-image', description: 'Generate images using AI', category: 'ai' },
  { method: 'GET', path: '/api/v1/blockchain/wallet/balance', description: 'Get wallet balance', category: 'blockchain' },
  { method: 'POST', path: '/api/v1/blockchain/transaction', description: 'Create transaction', category: 'blockchain' },
  { method: 'POST', path: '/api/v1/quantum/circuit', description: 'Execute quantum circuit', category: 'quantum' },
  { method: 'GET', path: '/api/v1/iot/devices', description: 'List IoT devices', category: 'iot' },
  { method: 'POST', path: '/api/v1/iot/command', description: 'Send command to device', category: 'iot' },
  { method: 'GET', path: '/api/v1/analytics/stats', description: 'Get platform statistics', category: 'data' },
];

const SDK_LANGUAGES = [
  { name: 'JavaScript', icon: '📜', code: 'npm install @aetherial/sdk' },
  { name: 'Python', icon: '🐍', code: 'pip install aetherial-sdk' },
  { name: 'Java', icon: '☕', code: 'maven: com.aetherial:sdk:1.0.0' },
  { name: 'Go', icon: '🔷', code: 'go get github.com/aetherial/sdk' },
  { name: 'Ruby', icon: '💎', code: 'gem install aetherial-sdk' },
  { name: 'PHP', icon: '🐘', code: 'composer require aetherial/sdk' },
];

export const DeveloperHub: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'overview' | 'api-keys' | 'endpoints' | 'webhooks' | 'sdk' | 'docs'>('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    unifiedSystemHub.publishEvent({
      id: `dev-hub-init-${Date.now()}`,
      timestamp: new Date(),
      source: 'developer-hub',
      type: 'developer.system.initialized',
      data: { endpoints: SAMPLE_ENDPOINTS.length },
      priority: 'high',
      propagate: true,
    });

    // Simulate loading data
    setTimeout(() => {
      setApiKeys([
        {
          id: 'key_1',
          name: 'Production API Key',
          key: 'ae_live_xxxxxxxxxxxxxxxxxxx',
          created: '2025-10-01',
          lastUsed: '2025-10-28',
          requests: 15234,
          status: 'active'
        },
        {
          id: 'key_2',
          name: 'Development API Key',
          key: 'ae_test_xxxxxxxxxxxxxxxxxxx',
          created: '2025-10-15',
          lastUsed: '2025-10-27',
          requests: 8921,
          status: 'active'
        }
      ]);

      setWebhooks([
        {
          id: 'wh_1',
          url: 'https://example.com/webhook',
          events: ['ai.generation.complete', 'blockchain.transaction.confirmed'],
          status: 'active',
          lastTriggered: '2025-10-28 14:32:00'
        }
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const handleGenerateKey = () => {
    const newKey: APIKey = {
      id: `key_${Date.now()}`,
      name: `API Key ${apiKeys.length + 1}`,
      key: `ae_live_${Math.random().toString(36).substring(2, 25)}`,
      created: new Date().toISOString().split('T')[0],
      lastUsed: 'Never',
      requests: 0,
      status: 'active'
    };
    setApiKeys([...apiKeys, newKey]);
    unifiedSystemHub.publishEvent({
      id: `api-key-generated-${Date.now()}`,
      timestamp: new Date(),
      source: 'developer-hub',
      type: 'developer.apikey.generated',
      data: { keyId: newKey.id },
      priority: 'high',
      propagate: true,
    });
  };

  const handleRevokeKey = (keyId: string) => {
    if (confirm('Are you sure you want to revoke this API key?')) {
      setApiKeys(apiKeys.map(key => 
        key.id === keyId ? { ...key, status: 'revoked' as const } : key
      ));
    }
  };

  const filteredEndpoints = selectedCategory === 'all' 
    ? SAMPLE_ENDPOINTS 
    : SAMPLE_ENDPOINTS.filter(e => e.category === selectedCategory);

  if (loading) {
    return (
      <div className="developer-hub">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading developer tools...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="developer-hub">
      <header className="dev-header">
        <h1>👨‍💻 Developer Hub</h1>
        <p>API Management, SDKs, Documentation & Developer Tools</p>
      </header>

      <div className="dev-tabs">
        <button className={`tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Overview</button>
        <button className={`tab ${activeTab === 'api-keys' ? 'active' : ''}`} onClick={() => setActiveTab('api-keys')}>API Keys</button>
        <button className={`tab ${activeTab === 'endpoints' ? 'active' : ''}`} onClick={() => setActiveTab('endpoints')}>Endpoints</button>
        <button className={`tab ${activeTab === 'webhooks' ? 'active' : ''}`} onClick={() => setActiveTab('webhooks')}>Webhooks</button>
        <button className={`tab ${activeTab === 'sdk' ? 'active' : ''}`} onClick={() => setActiveTab('sdk')}>SDKs</button>
        <button className={`tab ${activeTab === 'docs' ? 'active' : ''}`} onClick={() => setActiveTab('docs')}>Documentation</button>
      </div>

      <div className="dev-content">
        {activeTab === 'overview' && (
          <div className="overview-section">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">🔑</div>
                <div className="stat-value">{apiKeys.filter(k => k.status === 'active').length}</div>
                <div className="stat-label">Active API Keys</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📡</div>
                <div className="stat-value">{SAMPLE_ENDPOINTS.length}</div>
                <div className="stat-label">API Endpoints</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🔔</div>
                <div className="stat-value">{webhooks.filter(w => w.status === 'active').length}</div>
                <div className="stat-label">Active Webhooks</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📊</div>
                <div className="stat-value">{apiKeys.reduce((sum, key) => sum + key.requests, 0).toLocaleString()}</div>
                <div className="stat-label">Total Requests</div>
              </div>
            </div>

            <div className="quick-start">
              <h2>Quick Start Guide</h2>
              <div className="steps">
                <div className="step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h3>Generate API Key</h3>
                    <p>Create your first API key to authenticate requests</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h3>Install SDK</h3>
                    <p>Choose your preferred language and install our SDK</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h3>Make Your First Request</h3>
                    <p>Start building with our comprehensive API</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="api-categories-grid">
              <h2>API Categories</h2>
              <div className="categories">
                {API_CATEGORIES.map(category => (
                  <div key={category.id} className="category-card">
                    <div className="category-icon">{category.icon}</div>
                    <div className="category-name">{category.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'api-keys' && (
          <div className="api-keys-section">
            <div className="section-header">
              <h2>API Keys</h2>
              <button className="btn btn-primary" onClick={handleGenerateKey}>+ Generate New Key</button>
            </div>
            <div className="api-keys-list">
              {apiKeys.map(key => (
                <div key={key.id} className="api-key-card">
                  <div className="key-header">
                    <h3>{key.name}</h3>
                    <span className={`status-badge ${key.status}`}>{key.status}</span>
                  </div>
                  <div className="key-value">
                    <code>{key.key}</code>
                    <button className="btn btn-small">Copy</button>
                  </div>
                  <div className="key-stats">
                    <div className="key-stat">
                      <span className="label">Created:</span>
                      <span className="value">{key.created}</span>
                    </div>
                    <div className="key-stat">
                      <span className="label">Last Used:</span>
                      <span className="value">{key.lastUsed}</span>
                    </div>
                    <div className="key-stat">
                      <span className="label">Requests:</span>
                      <span className="value">{key.requests.toLocaleString()}</span>
                    </div>
                  </div>
                  {key.status === 'active' && (
                    <button className="btn btn-danger btn-small" onClick={() => handleRevokeKey(key.id)}>
                      Revoke Key
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'endpoints' && (
          <div className="endpoints-section">
            <h2>API Endpoints</h2>
            <div className="category-filter">
              <button 
                className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('all')}
              >
                All
              </button>
              {API_CATEGORIES.map(category => (
                <button
                  key={category.id}
                  className={`filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.icon} {category.name}
                </button>
              ))}
            </div>
            <div className="endpoints-list">
              {filteredEndpoints.map((endpoint, index) => (
                <div key={index} className="endpoint-card">
                  <div className="endpoint-method">{endpoint.method}</div>
                  <div className="endpoint-details">
                    <code className="endpoint-path">{endpoint.path}</code>
                    <p className="endpoint-description">{endpoint.description}</p>
                  </div>
                  <button className="btn btn-small">Try It</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'webhooks' && (
          <div className="webhooks-section">
            <div className="section-header">
              <h2>Webhooks</h2>
              <button className="btn btn-primary">+ Add Webhook</button>
            </div>
            <div className="webhooks-list">
              {webhooks.map(webhook => (
                <div key={webhook.id} className="webhook-card">
                  <div className="webhook-header">
                    <h3>{webhook.url}</h3>
                    <span className={`status-badge ${webhook.status}`}>{webhook.status}</span>
                  </div>
                  <div className="webhook-events">
                    <strong>Events:</strong>
                    {webhook.events.map((event, idx) => (
                      <span key={idx} className="event-tag">{event}</span>
                    ))}
                  </div>
                  {webhook.lastTriggered && (
                    <div className="webhook-last-triggered">
                      Last triggered: {webhook.lastTriggered}
                    </div>
                  )}
                  <div className="webhook-actions">
                    <button className="btn btn-small">Edit</button>
                    <button className="btn btn-small btn-danger">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'sdk' && (
          <div className="sdk-section">
            <h2>Official SDKs</h2>
            <p className="sdk-intro">Install our official SDKs to integrate AETHERIAL Platform into your applications</p>
            <div className="sdk-grid">
              {SDK_LANGUAGES.map((sdk, index) => (
                <div key={index} className="sdk-card">
                  <div className="sdk-icon">{sdk.icon}</div>
                  <h3>{sdk.name}</h3>
                  <code className="sdk-install">{sdk.code}</code>
                  <button className="btn btn-primary">View Docs</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'docs' && (
          <div className="docs-section">
            <h2>📚 Documentation</h2>
            <div className="docs-grid">
              <div className="doc-card">
                <h3>Getting Started</h3>
                <p>Learn the basics of integrating with AETHERIAL Platform</p>
                <button className="btn">Read Guide</button>
              </div>
              <div className="doc-card">
                <h3>API Reference</h3>
                <p>Complete reference for all API endpoints</p>
                <button className="btn">View Reference</button>
              </div>
              <div className="doc-card">
                <h3>Code Examples</h3>
                <p>Sample code and implementation examples</p>
                <button className="btn">Browse Examples</button>
              </div>
              <div className="doc-card">
                <h3>Best Practices</h3>
                <p>Guidelines for optimal integration</p>
                <button className="btn">Learn More</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeveloperHub;

