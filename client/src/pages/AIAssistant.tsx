import React, { useState, useEffect, useRef } from 'react';
import {
  Bot, Send, Sparkles, Lightbulb, TrendingUp, MessageSquare,
  ShoppingBag, GraduationCap, Search, FileText, Shield
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIFeature {
  id: string;
  title: string;
  description: string;
  icon: any;
  action: string;
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const features: AIFeature[] = [
    {
      id: 'chat',
      title: 'AI Chat',
      description: 'Have a conversation with AI',
      icon: MessageSquare,
      action: 'chat',
    },
    {
      id: 'recommendations',
      title: 'Get Recommendations',
      description: 'Personalized content suggestions',
      icon: TrendingUp,
      action: 'recommend',
    },
    {
      id: 'products',
      title: 'Product Suggestions',
      description: 'Find products you might like',
      icon: ShoppingBag,
      action: 'products',
    },
    {
      id: 'courses',
      title: 'Course Recommendations',
      description: 'Discover courses to learn',
      icon: GraduationCap,
      action: 'courses',
    },
    {
      id: 'search',
      title: 'Smart Search',
      description: 'Enhanced search with AI',
      icon: Search,
      action: 'search',
    },
    {
      id: 'summarize',
      title: 'Summarize Text',
      description: 'Get quick summaries',
      icon: FileText,
      action: 'summarize',
    },
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          question: input,
          context: 'You are a helpful AI assistant for the AETHERIAL platform.',
        }),
      });

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.answer,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleFeatureClick = async (feature: AIFeature) => {
    setActiveFeature(feature.id);

    // Add feature-specific message
    const featureMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `I can help you with ${feature.title.toLowerCase()}. What would you like to know?`,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, featureMessage]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-900 to-blue-900 border-b border-cyan-700">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center space-x-4">
            <div className="bg-cyan-500 p-3 rounded-lg">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">AI Assistant</h1>
              <p className="text-cyan-200">Powered by Advanced AI</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Features Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-lg font-bold mb-4 flex items-center">
                <Sparkles className="w-5 h-5 text-cyan-500 mr-2" />
                AI Features
              </h2>
              <div className="space-y-2">
                {features.map((feature) => (
                  <button
                    key={feature.id}
                    onClick={() => handleFeatureClick(feature)}
                    className={`w-full text-left p-3 rounded-lg transition ${
                      activeFeature === feature.id
                        ? 'bg-cyan-500/20 border border-cyan-500'
                        : 'bg-gray-900 hover:bg-gray-700 border border-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <feature.icon className={`w-5 h-5 ${
                        activeFeature === feature.id ? 'text-cyan-400' : 'text-gray-400'
                      }`} />
                      <div>
                        <p className="font-medium text-sm">{feature.title}</p>
                        <p className="text-xs text-gray-400">{feature.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Quick Tips */}
              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Lightbulb className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-400 mb-1">Quick Tips</p>
                    <ul className="text-xs text-gray-400 space-y-1">
                      <li>• Ask me anything about the platform</li>
                      <li>• Get personalized recommendations</li>
                      <li>• Summarize long content</li>
                      <li>• Find products and courses</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800 rounded-lg border border-gray-700 flex flex-col" style={{ height: 'calc(100vh - 250px)' }}>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Bot className="w-16 h-16 text-cyan-500 mx-auto mb-4" />
                      <h3 className="text-xl font-bold mb-2">Welcome to AI Assistant</h3>
                      <p className="text-gray-400 mb-6">
                        I'm here to help you with anything on the AETHERIAL platform.
                      </p>
                      <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                        <button
                          onClick={() => setInput('What can you help me with?')}
                          className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-left transition"
                        >
                          What can you help me with?
                        </button>
                        <button
                          onClick={() => setInput('Recommend some products')}
                          className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-left transition"
                        >
                          Recommend some products
                        </button>
                        <button
                          onClick={() => setInput('Find courses for me')}
                          className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-left transition"
                        >
                          Find courses for me
                        </button>
                        <button
                          onClick={() => setInput('Help me search')}
                          className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-left transition"
                        >
                          Help me search
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-4 ${
                            message.role === 'user'
                              ? 'bg-cyan-500 text-white'
                              : 'bg-gray-700 text-gray-100'
                          }`}
                        >
                          <div className="flex items-start space-x-2">
                            {message.role === 'assistant' && (
                              <Bot className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                            )}
                            <div className="flex-1">
                              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                              <p className="text-xs opacity-70 mt-2">
                                {message.timestamp.toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {loading && (
                      <div className="flex justify-start">
                        <div className="bg-gray-700 rounded-lg p-4">
                          <div className="flex items-center space-x-2">
                            <Bot className="w-5 h-5 text-cyan-400" />
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Input Area */}
              <div className="border-t border-gray-700 p-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything..."
                    className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                    disabled={loading}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={loading || !input.trim()}
                    className="bg-cyan-500 text-white px-6 py-3 rounded-lg hover:bg-cyan-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <Send className="w-5 h-5" />
                    <span>Send</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

