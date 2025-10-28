import React, { useState, useRef, useEffect } from 'react';
import { Avatar3DInterface } from '../avatar/Avatar3DInterface';
import './AIChatPanel.css';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  avatar?: string;
}

export const AIChatPanel: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m your personal AI assistant. How can I help you today?',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [avatarVisible, setAvatarVisible] = useState(true);
  const [avatarEmotion, setAvatarEmotion] = useState<'neutral' | 'happy' | 'thinking' | 'excited' | 'sad' | 'surprised' | 'angry' | 'confused'>('neutral');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    setAvatarEmotion('thinking');

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `I understand you said: "${inputValue}". Let me help you with that!`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
      setAvatarEmotion('happy');
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickActions = [
    { icon: '📚', label: 'Learn', action: () => setInputValue('Help me learn something new') },
    { icon: '💼', label: 'Work', action: () => setInputValue('Help me with work tasks') },
    { icon: '🛒', label: 'Shop', action: () => setInputValue('Help me find products') },
    { icon: '📈', label: 'Trade', action: () => setInputValue('Show me trading opportunities') },
    { icon: '🎨', label: 'Create', action: () => setInputValue('Help me create something') },
    { icon: '🔍', label: 'Research', action: () => setInputValue('Help me research a topic') },
  ];

  return (
    <div className="ai-chat-panel">
      {/* 3D Avatar Section */}
      {avatarVisible && (
        <div className="avatar-section">
          <Avatar3DInterface
            emotion={avatarEmotion}
            speaking={isTyping}
            size="medium"
          />
          <button 
            className="toggle-avatar"
            onClick={() => setAvatarVisible(!avatarVisible)}
          >
            {avatarVisible ? '👁️' : '👁️‍🗨️'}
          </button>
        </div>
      )}

      {/* Chat Header */}
      <div className="chat-header">
        <div className="ai-info">
          <span className="ai-icon">🤖</span>
          <div className="ai-details">
            <h3>Personal AI Assistant</h3>
            <span className="ai-status">● Online</span>
          </div>
        </div>
        <div className="chat-actions">
          <button className="action-btn" title="Voice Chat">🎤</button>
          <button className="action-btn" title="Video Chat">📹</button>
          <button className="action-btn" title="Settings">⚙️</button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-bar">
        {quickActions.map(action => (
          <button
            key={action.label}
            className="quick-action-btn"
            onClick={action.action}
            title={action.label}
          >
            <span>{action.icon}</span>
            <span className="action-label">{action.label}</span>
          </button>
        ))}
      </div>

      {/* Messages Area */}
      <div className="messages-area">
        {messages.map(message => (
          <div
            key={message.id}
            className={`message ${message.type}`}
          >
            <div className="message-avatar">
              {message.type === 'ai' ? '🤖' : '👤'}
            </div>
            <div className="message-content">
              <div className="message-text">{message.content}</div>
              <div className="message-time">
                {message.timestamp.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="message ai typing">
            <div className="message-avatar">🤖</div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="input-area">
        <button className="attachment-btn" title="Attach File">📎</button>
        <button className="emoji-btn" title="Add Emoji">😊</button>
        
        <textarea
          className="message-input"
          placeholder="Type your message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          rows={1}
        />
        
        <button className="voice-btn" title="Voice Input">🎤</button>
        <button 
          className="send-btn" 
          onClick={sendMessage}
          disabled={!inputValue.trim()}
        >
          ➤
        </button>
      </div>

      {/* AI Capabilities Info */}
      <div className="ai-capabilities">
        <div className="capability">
          <span className="cap-icon">💡</span>
          <span className="cap-text">Smart Suggestions</span>
        </div>
        <div className="capability">
          <span className="cap-icon">🌐</span>
          <span className="cap-text">Multi-Language</span>
        </div>
        <div className="capability">
          <span className="cap-icon">🔒</span>
          <span className="cap-text">Private & Secure</span>
        </div>
      </div>
    </div>
  );
};

