import React, { useState } from 'react';
import './EnhancedAIChatPanel.css';

// Icons (using Unicode for now, can be replaced with icon library)
const icons = {
  // Chat Models
  chatgpt: '💬',
  claude: '🤖',
  gemini: '🔮',
  grok: '🐦',
  deepseek: '🧠',
  llama: '🦙',
  mistral: '🌟',
  qwen: '🎭',
  manus: '⚡',
  
  // Reasoning
  thinking: '🧠',
  reasoning: '💡',
  deep: '🤔',
  o1: '🎯',
  
  // Search
  search: '🔍',
  web: '🌐',
  bing: '🔵',
  
  // Code
  code: '💻',
  github: '🐙',
  
  // Image
  image: '🎨',
  midjourney: '🖼️',
  stable: '🌈',
  flux: '⚡',
  firefly: '🔥',
  
  // Video
  video: '🎬',
  sora: '🎥',
  runway: '🎞️',
  pika: '📹',
  
  // Audio
  audio: '🎙️',
  voice: '🗣️',
  music: '🎵',
  sound: '🎶',
  
  // Tools
  slides: '📊',
  spreadsheet: '📈',
  website: '🌐',
  playbook: '📋',
  phone: '📞',
  email: '✉️',
  file: '📁',
  upload: '📤',
  
  // Capabilities
  chat: '💬',
  analyze: '👁️',
  generate: '✨',
  document: '📄',
  function: '🔗',
  agent: '🤖',
  memory: '💾',
  
  // Settings
  settings: '⚙️',
  cost: '💰',
  analytics: '📊',
  test: '🧪',
  train: '🎓',
};

interface AIModel {
  id: string;
  name: string;
  icon: string;
  category: string;
  description: string;
  capabilities: string[];
  costPer1M: number;
  contextWindow: number;
}

const aiModels: AIModel[] = [
  // Chat Models
  { id: 'gpt-4o', name: 'ChatGPT (GPT-4o)', icon: icons.chatgpt, category: 'chat', description: 'Most capable model, multimodal', capabilities: ['chat', 'code', 'vision', 'function'], costPer1M: 5.0, contextWindow: 128000 },
  { id: 'claude-sonnet-4.5', name: 'Claude Sonnet 4.5', icon: icons.claude, category: 'chat', description: 'Best coding model', capabilities: ['chat', 'code', 'reasoning', 'web'], costPer1M: 3.0, contextWindow: 1000000 },
  { id: 'claude-opus-4.1', name: 'Claude Opus 4.1', icon: icons.claude, category: 'chat', description: 'Most intelligent, extended thinking', capabilities: ['chat', 'reasoning', 'deep'], costPer1M: 15.0, contextWindow: 1000000 },
  { id: 'gemini-2.0-pro', name: 'Gemini 2.0 Pro', icon: icons.gemini, category: 'chat', description: 'Google\'s most capable', capabilities: ['chat', 'vision', 'search'], costPer1M: 2.5, contextWindow: 1000000 },
  { id: 'grok-2', name: 'Grok-2', icon: icons.grok, category: 'chat', description: 'Real-time X/Twitter integration', capabilities: ['chat', 'search', 'image'], costPer1M: 2.0, contextWindow: 128000 },
  { id: 'deepseek-v3.2', name: 'DeepSeek V3.2', icon: icons.deepseek, category: 'chat', description: 'Advanced reasoning, cost-effective', capabilities: ['chat', 'code', 'reasoning'], costPer1M: 0.5, contextWindow: 64000 },
  
  // Reasoning Models
  { id: 'claude-opus-thinking', name: 'Claude Opus (Extended Thinking)', icon: icons.thinking, category: 'reasoning', description: 'Deep reasoning mode', capabilities: ['reasoning', 'deep', 'chain-of-thought'], costPer1M: 20.0, contextWindow: 1000000 },
  { id: 'o1', name: 'o1 (OpenAI Reasoning)', icon: icons.o1, category: 'reasoning', description: 'Specialized reasoning model', capabilities: ['reasoning', 'math', 'logic'], costPer1M: 15.0, contextWindow: 128000 },
  
  // Search Models
  { id: 'perplexity-pro', name: 'Perplexity Pro', icon: icons.search, category: 'search', description: 'Deep research with citations', capabilities: ['search', 'research', 'citations'], costPer1M: 1.0, contextWindow: 32000 },
  
  // Image Models
  { id: 'dall-e-3', name: 'DALL-E 3', icon: icons.image, category: 'image', description: 'High-quality image generation', capabilities: ['image-gen'], costPer1M: 40.0, contextWindow: 0 },
  { id: 'midjourney-v6', name: 'Midjourney v6', icon: icons.midjourney, category: 'image', description: 'Artistic image generation', capabilities: ['image-gen'], costPer1M: 30.0, contextWindow: 0 },
  { id: 'flux-pro', name: 'Flux Pro', icon: icons.flux, category: 'image', description: 'Fast, high-quality images', capabilities: ['image-gen'], costPer1M: 25.0, contextWindow: 0 },
  
  // Video Models
  { id: 'sora', name: 'Sora', icon: icons.video, category: 'video', description: 'Text-to-video generation', capabilities: ['video-gen'], costPer1M: 100.0, contextWindow: 0 },
  { id: 'runway-gen3', name: 'Runway Gen-3', icon: icons.runway, category: 'video', description: 'Professional video generation', capabilities: ['video-gen', 'video-edit'], costPer1M: 80.0, contextWindow: 0 },
  
  // Audio Models
  { id: 'elevenlabs', name: 'ElevenLabs', icon: icons.voice, category: 'audio', description: 'Voice cloning and TTS', capabilities: ['tts', 'voice-clone'], costPer1M: 10.0, contextWindow: 0 },
  { id: 'suno', name: 'Suno', icon: icons.music, category: 'audio', description: 'Music generation', capabilities: ['music-gen'], costPer1M: 5.0, contextWindow: 0 },
];

const EnhancedAIChatPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedModel, setSelectedModel] = useState<AIModel>(aiModels[0]);
  const [selectedCapability, setSelectedCapability] = useState('chat');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [input, setInput] = useState('');
  const [showModelMenu, setShowModelMenu] = useState(false);
  const [showToolsMenu, setShowToolsMenu] = useState(false);
  const [showCapabilitiesMenu, setShowCapabilitiesMenu] = useState(false);
  
  const handleSend = () => {
    if (!input.trim()) return;
    
    setMessages([...messages, { role: 'user', content: input }]);
    setInput('');
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Response from ${selectedModel.name} using ${selectedCapability} capability...` 
      }]);
    }, 1000);
  };
  
  const modelsByCategory = {
    chat: aiModels.filter(m => m.category === 'chat'),
    reasoning: aiModels.filter(m => m.category === 'reasoning'),
    search: aiModels.filter(m => m.category === 'search'),
    code: aiModels.filter(m => m.capabilities.includes('code')),
    image: aiModels.filter(m => m.category === 'image'),
    video: aiModels.filter(m => m.category === 'video'),
    audio: aiModels.filter(m => m.category === 'audio'),
  };
  
  const capabilities = [
    { id: 'chat', name: 'Standard Chat', icon: icons.chat },
    { id: 'deep-thinking', name: 'Deep Thinking', icon: icons.thinking },
    { id: 'web-search', name: 'Web Search', icon: icons.search },
    { id: 'code-gen', name: 'Code Generation', icon: icons.code },
    { id: 'image-analysis', name: 'Image Analysis', icon: icons.analyze },
    { id: 'image-gen', name: 'Image Generation', icon: icons.image },
    { id: 'video-analysis', name: 'Video Analysis', icon: icons.video },
    { id: 'video-gen', name: 'Video Generation', icon: icons.video },
    { id: 'audio-transcription', name: 'Audio Transcription', icon: icons.audio },
    { id: 'tts', name: 'Text-to-Speech', icon: icons.voice },
    { id: 'document-analysis', name: 'Document Analysis', icon: icons.document },
    { id: 'function-calling', name: 'Function Calling', icon: icons.function },
    { id: 'agent-creation', name: 'Agent Creation', icon: icons.agent },
    { id: 'memory', name: 'Memory/Context', icon: icons.memory },
  ];
  
  const tools = [
    { id: 'slides', name: 'Create Slides', icon: icons.slides },
    { id: 'spreadsheet', name: 'Create Spreadsheet', icon: icons.spreadsheet },
    { id: 'image', name: 'Generate Image', icon: icons.image },
    { id: 'video', name: 'Create Video', icon: icons.video },
    { id: 'audio', name: 'Generate Audio', icon: icons.audio },
    { id: 'website', name: 'Build Website', icon: icons.website },
    { id: 'playbook', name: 'Create Playbook', icon: icons.playbook },
    { id: 'phone', name: 'Make Phone Call', icon: icons.phone },
    { id: 'email', name: 'Write Email', icon: icons.email },
    { id: 'github', name: 'GitHub Actions', icon: icons.github },
    { id: 'file', name: 'Upload File', icon: icons.file },
    { id: 'upload', name: 'Upload Image', icon: icons.upload },
  ];
  
  return (
    <div className={`enhanced-ai-chat-panel ${isOpen ? 'open' : 'closed'}`}>
      {/* Header */}
      <div className="ai-panel-header">
        <div className="ai-panel-title">
          <span className="ai-icon">{selectedModel.icon}</span>
          <span className="ai-model-name">{selectedModel.name}</span>
        </div>
        <div className="ai-panel-actions">
          <button className="ai-action-btn" onClick={() => setShowModelMenu(!showModelMenu)}>
            {icons.settings}
          </button>
          <button className="ai-action-btn" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? '▼' : '▲'}
          </button>
        </div>
      </div>
      
      {isOpen && (
        <>
          {/* Toolbar */}
          <div className="ai-panel-toolbar">
            <div className="ai-toolbar-section">
              <button 
                className="ai-toolbar-btn"
                onClick={() => setShowModelMenu(!showModelMenu)}
              >
                {selectedModel.icon} Select Model
              </button>
              
              {/* Model Selection Cascading Menu */}
              {showModelMenu && (
                <div className="ai-cascading-menu model-menu">
                  <div className="ai-menu-section">
                    <div className="ai-menu-title">Chat Models</div>
                    {modelsByCategory.chat.map(model => (
                      <div 
                        key={model.id}
                        className={`ai-menu-item ${selectedModel.id === model.id ? 'active' : ''}`}
                        onClick={() => { setSelectedModel(model); setShowModelMenu(false); }}
                      >
                        <span className="ai-menu-icon">{model.icon}</span>
                        <div className="ai-menu-content">
                          <div className="ai-menu-name">{model.name}</div>
                          <div className="ai-menu-desc">{model.description}</div>
                          <div className="ai-menu-meta">
                            ${model.costPer1M}/1M tokens · {model.contextWindow.toLocaleString()} context
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="ai-menu-section">
                    <div className="ai-menu-title">Reasoning Models</div>
                    {modelsByCategory.reasoning.map(model => (
                      <div 
                        key={model.id}
                        className={`ai-menu-item ${selectedModel.id === model.id ? 'active' : ''}`}
                        onClick={() => { setSelectedModel(model); setShowModelMenu(false); }}
                      >
                        <span className="ai-menu-icon">{model.icon}</span>
                        <div className="ai-menu-content">
                          <div className="ai-menu-name">{model.name}</div>
                          <div className="ai-menu-desc">{model.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="ai-menu-section">
                    <div className="ai-menu-title">Search Models</div>
                    {modelsByCategory.search.map(model => (
                      <div 
                        key={model.id}
                        className={`ai-menu-item ${selectedModel.id === model.id ? 'active' : ''}`}
                        onClick={() => { setSelectedModel(model); setShowModelMenu(false); }}
                      >
                        <span className="ai-menu-icon">{model.icon}</span>
                        <div className="ai-menu-content">
                          <div className="ai-menu-name">{model.name}</div>
                          <div className="ai-menu-desc">{model.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="ai-menu-section">
                    <div className="ai-menu-title">Image Models</div>
                    {modelsByCategory.image.map(model => (
                      <div 
                        key={model.id}
                        className={`ai-menu-item ${selectedModel.id === model.id ? 'active' : ''}`}
                        onClick={() => { setSelectedModel(model); setShowModelMenu(false); }}
                      >
                        <span className="ai-menu-icon">{model.icon}</span>
                        <div className="ai-menu-content">
                          <div className="ai-menu-name">{model.name}</div>
                          <div className="ai-menu-desc">{model.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="ai-menu-section">
                    <div className="ai-menu-title">Video Models</div>
                    {modelsByCategory.video.map(model => (
                      <div 
                        key={model.id}
                        className={`ai-menu-item ${selectedModel.id === model.id ? 'active' : ''}`}
                        onClick={() => { setSelectedModel(model); setShowModelMenu(false); }}
                      >
                        <span className="ai-menu-icon">{model.icon}</span>
                        <div className="ai-menu-content">
                          <div className="ai-menu-name">{model.name}</div>
                          <div className="ai-menu-desc">{model.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="ai-menu-section">
                    <div className="ai-menu-title">Audio Models</div>
                    {modelsByCategory.audio.map(model => (
                      <div 
                        key={model.id}
                        className={`ai-menu-item ${selectedModel.id === model.id ? 'active' : ''}`}
                        onClick={() => { setSelectedModel(model); setShowModelMenu(false); }}
                      >
                        <span className="ai-menu-icon">{model.icon}</span>
                        <div className="ai-menu-content">
                          <div className="ai-menu-name">{model.name}</div>
                          <div className="ai-menu-desc">{model.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="ai-toolbar-section">
              <button 
                className="ai-toolbar-btn"
                onClick={() => setShowCapabilitiesMenu(!showCapabilitiesMenu)}
              >
                {icons.settings} Capabilities
              </button>
              
              {/* Capabilities Menu */}
              {showCapabilitiesMenu && (
                <div className="ai-cascading-menu capabilities-menu">
                  {capabilities.map(cap => (
                    <div 
                      key={cap.id}
                      className={`ai-menu-item ${selectedCapability === cap.id ? 'active' : ''}`}
                      onClick={() => { setSelectedCapability(cap.id); setShowCapabilitiesMenu(false); }}
                    >
                      <span className="ai-menu-icon">{cap.icon}</span>
                      <span className="ai-menu-name">{cap.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="ai-toolbar-section">
              <button 
                className="ai-toolbar-btn"
                onClick={() => setShowToolsMenu(!showToolsMenu)}
              >
                {icons.generate} Tools
              </button>
              
              {/* Tools Menu */}
              {showToolsMenu && (
                <div className="ai-cascading-menu tools-menu">
                  {tools.map(tool => (
                    <div 
                      key={tool.id}
                      className="ai-menu-item"
                      onClick={() => { alert(`Opening ${tool.name}...`); setShowToolsMenu(false); }}
                    >
                      <span className="ai-menu-icon">{tool.icon}</span>
                      <span className="ai-menu-name">{tool.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Messages */}
          <div className="ai-panel-messages">
            {messages.length === 0 ? (
              <div className="ai-welcome">
                <h2>Welcome to AETHERIAL AI</h2>
                <p>Select a model and capability to get started</p>
                <div className="ai-quick-actions">
                  <button className="ai-quick-btn">{icons.slides} Create Slides</button>
                  <button className="ai-quick-btn">{icons.spreadsheet} New Spreadsheet</button>
                  <button className="ai-quick-btn">{icons.image} Generate Image</button>
                  <button className="ai-quick-btn">{icons.code} Write Code</button>
                </div>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} className={`ai-message ${msg.role}`}>
                  <div className="ai-message-icon">
                    {msg.role === 'user' ? '👤' : selectedModel.icon}
                  </div>
                  <div className="ai-message-content">{msg.content}</div>
                </div>
              ))
            )}
          </div>
          
          {/* Input */}
          <div className="ai-panel-input">
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <button className="ai-send-btn" onClick={handleSend}>
              Send
            </button>
          </div>
          
          {/* Footer Info */}
          <div className="ai-panel-footer">
            <span>Model: {selectedModel.name}</span>
            <span>·</span>
            <span>Capability: {selectedCapability}</span>
            <span>·</span>
            <span>${selectedModel.costPer1M}/1M tokens</span>
          </div>
        </>
      )}
    </div>
  );
};

export default EnhancedAIChatPanel;

