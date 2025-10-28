/**
 * AETHERIAL Platform - AI Chat Panel
 * 
 * Abstracts and combines features from:
 * - ChatGPT (OpenAI): Conversational AI, code interpreter, image generation
 * - Claude (Anthropic): Long context, artifacts, document analysis
 * - Manus: Task automation, browser control, parallel processing
 * - DeepSeek: Advanced reasoning, mathematical problem solving
 * - Perplexity: Real-time search, source citations
 * - Gemini (Google): Multimodal understanding, integrations
 * 
 * AETHERIAL Enhancements:
 * - Personal AI assistant per user
 * - Blockchain integration
 * - Multi-model switching
 * - Voice interaction
 * - Task scheduling
 * - Platform-wide automation
 */

import React, { useState, useEffect, useRef } from 'react';
import './AIChatPanel.css';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  attachments?: Attachment[];
  artifacts?: Artifact[];
  sources?: Source[];
  toolCalls?: ToolCall[];
}

interface Attachment {
  id: string;
  name: string;
  type: 'image' | 'document' | 'code' | 'data';
  url: string;
  size: number;
}

interface Artifact {
  id: string;
  type: 'code' | 'document' | 'chart' | 'interactive';
  title: string;
  content: string;
  language?: string;
}

interface Source {
  id: string;
  title: string;
  url: string;
  snippet: string;
}

interface ToolCall {
  id: string;
  tool: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: any;
}

interface AIChatPanelProps {
  isOpen: boolean;
  deviceInfo: any;
  onClose: () => void;
}

export default function AIChatPanel({ isOpen, deviceInfo, onClose }: AIChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedModel, setSelectedModel] = useState('aetherial-unified');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [activeTab, setActiveTab] = useState<'chat' | 'tools' | 'history' | 'settings'>('chat');
  const [voiceMode, setVoiceMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  /**
   * AI Models available
   */
  const aiModels = [
    {
      id: 'aetherial-unified',
      name: 'AETHERIAL Unified AI',
      description: 'Multi-model orchestration with all capabilities',
      icon: '⚡',
    },
    {
      id: 'gpt-4',
      name: 'GPT-4 Turbo',
      description: 'OpenAI\'s most capable model',
      icon: '🤖',
    },
    {
      id: 'claude-3',
      name: 'Claude 3 Opus',
      description: 'Long context, artifacts, safety-focused',
      icon: '🧠',
    },
    {
      id: 'deepseek',
      name: 'DeepSeek',
      description: 'Advanced reasoning and mathematics',
      icon: '🔬',
    },
    {
      id: 'gemini-pro',
      name: 'Gemini Pro',
      description: 'Multimodal understanding',
      icon: '✨',
    },
    {
      id: 'perplexity',
      name: 'Perplexity',
      description: 'Real-time search with citations',
      icon: '🔍',
    },
  ];

  /**
   * AI Tools available (abstracted from various platforms)
   */
  const aiTools = [
    // ChatGPT-inspired
    { id: 'code-interpreter', name: 'Code Interpreter', icon: '💻', category: 'Development' },
    { id: 'data-analysis', name: 'Data Analysis', icon: '📊', category: 'Analysis' },
    { id: 'image-generation', name: 'Image Generation', icon: '🎨', category: 'Creative' },
    { id: 'web-browsing', name: 'Web Browsing', icon: '🌐', category: 'Research' },
    
    // Manus-inspired
    { id: 'task-automation', name: 'Task Automation', icon: '⚙️', category: 'Automation' },
    { id: 'browser-control', name: 'Browser Control', icon: '🖱️', category: 'Automation' },
    { id: 'parallel-processing', name: 'Parallel Processing', icon: '⚡', category: 'Performance' },
    { id: 'scheduled-tasks', name: 'Scheduled Tasks', icon: '⏰', category: 'Automation' },
    
    // Claude-inspired
    { id: 'document-analysis', name: 'Document Analysis', icon: '📄', category: 'Analysis' },
    { id: 'artifact-creation', name: 'Artifact Creation', icon: '🎯', category: 'Creative' },
    { id: 'long-context', name: 'Long Context Processing', icon: '📚', category: 'Analysis' },
    
    // Perplexity-inspired
    { id: 'research-mode', name: 'Deep Research', icon: '🔬', category: 'Research' },
    { id: 'source-citations', name: 'Source Citations', icon: '📖', category: 'Research' },
    
    // AETHERIAL Unique
    { id: 'blockchain-query', name: 'Blockchain Query', icon: '⛓️', category: 'Blockchain' },
    { id: 'smart-contract', name: 'Smart Contract Builder', icon: '📝', category: 'Blockchain' },
    { id: 'defi-analysis', name: 'DeFi Analysis', icon: '💰', category: 'Finance' },
    { id: 'trading-bot', name: 'AI Trading Bot', icon: '📈', category: 'Finance' },
    { id: 'content-moderation', name: 'Content Moderation', icon: '🛡️', category: 'Safety' },
    { id: 'platform-analytics', name: 'Platform Analytics', icon: '📊', category: 'Analytics' },
  ];

  /**
   * Scroll to bottom when new messages arrive
   */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /**
   * Auto-focus input when panel opens
   */
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  /**
   * Handle message send
   */
  const handleSendMessage = async () => {
    if (!inputValue.trim() && attachments.length === 0) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
      attachments: attachments.map(file => ({
        id: Date.now().toString(),
        name: file.name,
        type: file.type.startsWith('image/') ? 'image' : 'document',
        url: URL.createObjectURL(file),
        size: file.size,
      })),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setAttachments([]);
    setIsTyping(true);

    // Simulate AI response (in production, call actual API)
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I understand you're asking about: "${inputValue}". I'm using the ${selectedModel} model to process your request.\n\nThis is a demonstration response. In production, this would connect to the actual AI backend with:\n- Multi-model orchestration\n- Tool calling capabilities\n- Real-time streaming\n- Context awareness\n- Source citations\n- Artifact generation`,
        timestamp: new Date(),
        sources: [
          {
            id: '1',
            title: 'AETHERIAL Documentation',
            url: 'https://aetherial.io/docs',
            snippet: 'Comprehensive platform documentation...',
          },
        ],
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  /**
   * Handle file upload
   */
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  /**
   * Handle voice input
   */
  const toggleVoiceMode = () => {
    setVoiceMode(!voiceMode);
    // In production, integrate with Web Speech API or voice service
  };

  /**
   * Render message
   */
  const renderMessage = (message: Message) => {
    return (
      <div key={message.id} className={`message ${message.role}`}>
        <div className="message-avatar">
          {message.role === 'user' ? '👤' : '🤖'}
        </div>
        <div className="message-content">
          <div className="message-header">
            <span className="message-role">
              {message.role === 'user' ? 'You' : selectedModel}
            </span>
            <span className="message-time">
              {message.timestamp.toLocaleTimeString()}
            </span>
          </div>
          <div className="message-text">{message.content}</div>
          
          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="message-attachments">
              {message.attachments.map(att => (
                <div key={att.id} className="attachment">
                  {att.type === 'image' ? (
                    <img src={att.url} alt={att.name} />
                  ) : (
                    <div className="attachment-file">
                      📄 {att.name}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {/* Artifacts (Claude-style) */}
          {message.artifacts && message.artifacts.length > 0 && (
            <div className="message-artifacts">
              {message.artifacts.map(artifact => (
                <div key={artifact.id} className="artifact">
                  <div className="artifact-header">
                    <span>{artifact.title}</span>
                    <button>View</button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Sources (Perplexity-style) */}
          {message.sources && message.sources.length > 0 && (
            <div className="message-sources">
              <div className="sources-header">Sources:</div>
              {message.sources.map(source => (
                <a
                  key={source.id}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="source-link"
                >
                  🔗 {source.title}
                </a>
              ))}
            </div>
          )}
          
          {/* Tool Calls (Manus-style) */}
          {message.toolCalls && message.toolCalls.length > 0 && (
            <div className="message-tools">
              {message.toolCalls.map(tool => (
                <div key={tool.id} className={`tool-call ${tool.status}`}>
                  🔧 {tool.tool} - {tool.status}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  /**
   * Render chat tab
   */
  const renderChatTab = () => {
    return (
      <div className="chat-container">
        {/* Messages */}
        <div className="messages-list">
          {messages.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">💬</div>
              <h3>Start a conversation</h3>
              <p>Ask me anything! I can help with:</p>
              <ul>
                <li>Code generation and debugging</li>
                <li>Data analysis and visualization</li>
                <li>Research and information gathering</li>
                <li>Task automation and scheduling</li>
                <li>Blockchain and DeFi operations</li>
                <li>Platform management</li>
              </ul>
            </div>
          ) : (
            messages.map(renderMessage)
          )}
          {isTyping && (
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="input-container">
          {/* Attachments Preview */}
          {attachments.length > 0 && (
            <div className="attachments-preview">
              {attachments.map((file, index) => (
                <div key={index} className="attachment-preview">
                  <span>{file.name}</span>
                  <button onClick={() => setAttachments(prev => prev.filter((_, i) => i !== index))}>
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Input Box */}
          <div className="input-box">
            <button
              className="input-btn"
              onClick={() => document.getElementById('file-upload')?.click()}
              title="Attach file"
            >
              📎
            </button>
            <input
              id="file-upload"
              type="file"
              multiple
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
            
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Ask AETHERIAL AI anything..."
              className="message-input"
              rows={1}
            />
            
            <button
              className={`input-btn ${voiceMode ? 'active' : ''}`}
              onClick={toggleVoiceMode}
              title="Voice input"
            >
              🎤
            </button>
            
            <button
              className="send-btn"
              onClick={handleSendMessage}
              disabled={!inputValue.trim() && attachments.length === 0}
            >
              ➤
            </button>
          </div>
        </div>
      </div>
    );
  };

  /**
   * Render tools tab
   */
  const renderToolsTab = () => {
    const categories = Array.from(new Set(aiTools.map(t => t.category)));
    
    return (
      <div className="tools-container">
        <h3>AI Tools</h3>
        {categories.map(category => (
          <div key={category} className="tool-category">
            <h4>{category}</h4>
            <div className="tool-grid">
              {aiTools.filter(t => t.category === category).map(tool => (
                <button key={tool.id} className="tool-card">
                  <span className="tool-icon">{tool.icon}</span>
                  <span className="tool-name">{tool.name}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  /**
   * Render settings tab
   */
  const renderSettingsTab = () => {
    return (
      <div className="settings-container">
        <h3>AI Settings</h3>
        
        <div className="setting-group">
          <label>AI Model</label>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="model-select"
          >
            {aiModels.map(model => (
              <option key={model.id} value={model.id}>
                {model.icon} {model.name}
              </option>
            ))}
          </select>
          <p className="setting-description">
            {aiModels.find(m => m.id === selectedModel)?.description}
          </p>
        </div>

        <div className="setting-group">
          <label>Response Style</label>
          <select className="setting-select">
            <option>Balanced</option>
            <option>Concise</option>
            <option>Detailed</option>
            <option>Creative</option>
            <option>Technical</option>
          </select>
        </div>

        <div className="setting-group">
          <label>Context Memory</label>
          <input type="range" min="0" max="100" defaultValue="50" />
          <p className="setting-description">Number of previous messages to remember</p>
        </div>

        <div className="setting-group">
          <label>
            <input type="checkbox" defaultChecked />
            Enable web browsing
          </label>
        </div>

        <div className="setting-group">
          <label>
            <input type="checkbox" defaultChecked />
            Enable code interpreter
          </label>
        </div>

        <div className="setting-group">
          <label>
            <input type="checkbox" defaultChecked />
            Enable source citations
          </label>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <aside className={`ai-chat-panel device-${deviceInfo.type}`}>
      {/* Panel Header */}
      <div className="panel-header">
        <div className="header-title">
          <span className="ai-icon">🤖</span>
          <span>AETHERIAL AI</span>
        </div>
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="tab-nav">
        <button
          className={`tab-btn ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          💬 Chat
        </button>
        <button
          className={`tab-btn ${activeTab === 'tools' ? 'active' : ''}`}
          onClick={() => setActiveTab('tools')}
        >
          🔧 Tools
        </button>
        <button
          className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          📜 History
        </button>
        <button
          className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          ⚙️ Settings
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'chat' && renderChatTab()}
        {activeTab === 'tools' && renderToolsTab()}
        {activeTab === 'history' && <div className="history-container">History coming soon...</div>}
        {activeTab === 'settings' && renderSettingsTab()}
      </div>
    </aside>
  );
}

