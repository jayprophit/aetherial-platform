import { useState, useRef, useEffect } from 'react';
import {
  Bot, X, Send, Copy, Check, ChevronDown, Sparkles,
  Code, MessageSquare, Zap, Brain, Cpu, Star, Settings, Maximize2, ChevronUp
} from 'lucide-react';
import AIAvatar3D from './AIAvatar3D';
import FloatingEnergyBall from './FloatingEnergyBall';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  model?: string;
  timestamp: Date;
  reasoning?: string[];
}

interface AIModel {
  id: string;
  name: string;
  provider: string;
  icon: string;
  color: string;
  description: string;
  favorite?: boolean;
}

const aiModels: AIModel[] = [
  { id: 'gpt4', name: 'GPT-4', provider: 'OpenAI', icon: '🤖', color: 'text-green-600', description: 'Most capable model' },
  { id: 'claude', name: 'Claude 3', provider: 'Anthropic', icon: '🧠', color: 'text-orange-600', description: 'Long context, thoughtful' },
  { id: 'gemini', name: 'Gemini Pro', provider: 'Google', icon: '✨', color: 'text-blue-600', description: 'Multimodal capabilities' },
  { id: 'grok', name: 'Grok', provider: 'xAI', icon: '⚡', color: 'text-purple-600', description: 'Real-time knowledge' },
  { id: 'deepseek', name: 'DeepSeek', provider: 'DeepSeek', icon: '🔍', color: 'text-indigo-600', description: 'Code specialist' },
];

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AIAssistant({ isOpen, onClose }: AIAssistantProps) {
  const [selectedModel, setSelectedModel] = useState<AIModel>(aiModels[0]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedReasoning, setExpandedReasoning] = useState<string[]>([]);
  const [avatarEmotion, setAvatarEmotion] = useState<'neutral' | 'happy' | 'thinking' | 'surprised' | 'sad'>('neutral');
  const [displayMode, setDisplayMode] = useState<'full' | 'avatar-only' | 'text-only' | 'energy-ball'>('full');
  const [micEnabled, setMicEnabled] = useState(false);
  const [speakerEnabled, setSpeakerEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInput('');
    setIsLoading(true);
    setAvatarEmotion('thinking');

    // Simulate AI response with reasoning
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Response from ${selectedModel.name}. This demonstrates the new layout with 3D avatar at top, chat messages in middle, and input at bottom.`,
        model: selectedModel.name,
        timestamp: new Date(),
        reasoning: [
          '1. Analyzing user query...',
          '2. Searching knowledge base...',
          '3. Generating response...',
          '4. Verifying accuracy...',
        ],
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
      setAvatarEmotion('happy');
    }, 2000);
  };

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleReasoning = (messageId: string) => {
    setExpandedReasoning(prev =>
      prev.includes(messageId)
        ? prev.filter(id => id !== messageId)
        : [...prev, messageId]
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Energy Ball Mode
  if (isOpen && displayMode === 'energy-ball') {
    return (
      <FloatingEnergyBall
        isSpeaking={isLoading}
        isListening={isListening}
        emotion={avatarEmotion}
        onExpand={() => setDisplayMode('full')}
        onMicToggle={() => setMicEnabled(!micEnabled)}
        onSpeakerToggle={() => setSpeakerEnabled(!speakerEnabled)}
        micEnabled={micEnabled}
        speakerEnabled={speakerEnabled}
      />
    );
  }

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 bottom-0 w-96 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col z-40 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Bot className="w-6 h-6 text-purple-600" />
          <div>
            <h3 className="font-semibold">AI Assistant</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">Powered by {selectedModel.name}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Display Mode Selector */}
      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex gap-2 flex-shrink-0">
        <button
          onClick={() => setDisplayMode('full')}
          className={`px-3 py-1 rounded text-xs ${displayMode === 'full' ? 'bg-purple-600 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
        >
          Full
        </button>
        <button
          onClick={() => setDisplayMode('avatar-only')}
          className={`px-3 py-1 rounded text-xs ${displayMode === 'avatar-only' ? 'bg-purple-600 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
        >
          Avatar Only
        </button>
        <button
          onClick={() => setDisplayMode('text-only')}
          className={`px-3 py-1 rounded text-xs ${displayMode === 'text-only' ? 'bg-purple-600 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
        >
          Text Only
        </button>
        <button
          onClick={() => setDisplayMode('energy-ball')}
          className={`px-3 py-1 rounded text-xs ${displayMode === 'energy-ball' ? 'bg-purple-600 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
        >
          Energy Ball
        </button>
      </div>

      {/* TOP SECTION: 3D Avatar (40% height - bigger) */}
      {displayMode !== 'text-only' && (
        <div className={`${displayMode === 'avatar-only' ? 'flex-1' : 'h-[40%]'} border-b border-gray-200 dark:border-gray-700 flex-shrink-0`}>
          <AIAvatar3D 
            emotion={avatarEmotion} 
            isSpeaking={isLoading}
            environment="minimal"
          />
        </div>
      )}

      {/* MIDDLE SECTION: Chat Messages (50% height) */}
      {displayMode !== 'avatar-only' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <Sparkles className="w-16 h-16 mx-auto mb-4 text-purple-600 opacity-50" />
            <p className="text-gray-600 dark:text-gray-400 mb-2">Start a conversation</p>
            <p className="text-sm text-gray-500">Ask me anything!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              )}
              <div className={`flex-1 max-w-[80%] ${message.role === 'user' ? 'order-first' : ''}`}>
                <div
                  className={`p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white ml-auto'
                      : 'bg-gray-100 dark:bg-gray-700'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>

                {/* AI Reasoning Section */}
                {message.role === 'assistant' && message.reasoning && (
                  <div className="mt-2">
                    <button
                      onClick={() => toggleReasoning(message.id)}
                      className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 hover:text-purple-600 transition-colors"
                    >
                      {expandedReasoning.includes(message.id) ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      )}
                      <span>Show reasoning ({message.reasoning.length} steps)</span>
                    </button>

                    {expandedReasoning.includes(message.id) && (
                      <div className="mt-2 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                        <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-2">
                          🧠 AI Reasoning Process
                        </p>
                        <div className="space-y-1">
                          {message.reasoning.map((step, idx) => (
                            <p key={idx} className="text-xs text-gray-700 dark:text-gray-300">
                              {step}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-2 mt-1 px-1">
                  <p className="text-xs text-gray-500">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                  {message.model && (
                    <p className="text-xs text-gray-500">• {message.model}</p>
                  )}
                  {message.role === 'assistant' && (
                    <button
                      onClick={() => handleCopy(message.content, message.id)}
                      className="ml-auto p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                    >
                      {copiedId === message.id ? (
                        <Check className="w-3 h-3 text-green-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  )}
                </div>
              </div>
              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold">You</span>
                </div>
              )}
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
        </div>
      )}

      {/* BOTTOM SECTION: Input + Options (20% height) */}
      {displayMode !== 'avatar-only' && (
      <div className="border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
        {/* Model Selector */}
        <div className="px-4 pt-3 relative">
          <button
            onClick={() => setShowModelSelector(!showModelSelector)}
            className="w-full flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-sm"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{selectedModel.icon}</span>
              <span className="font-medium">{selectedModel.name}</span>
            </div>
            <ChevronDown className="w-4 h-4" />
          </button>

          {/* Model Dropdown */}
          {showModelSelector && (
            <div className="absolute bottom-full left-4 right-4 mb-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl max-h-64 overflow-y-auto z-50">
              {aiModels.map((model) => (
                <button
                  key={model.id}
                  onClick={() => {
                    setSelectedModel(model);
                    setShowModelSelector(false);
                  }}
                  className={`w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left ${
                    selectedModel.id === model.id ? 'bg-purple-50 dark:bg-purple-900/20' : ''
                  }`}
                >
                  <span className="text-xl">{model.icon}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{model.name}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{model.provider} • {model.description}</p>
                  </div>
                  {selectedModel.id === model.id && (
                    <Check className="w-4 h-4 text-purple-600" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4">
          <div className="flex gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything..."
              className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 text-sm"
              rows={2}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all self-end"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
      )}
    </div>
  );
}

