import React, { useState } from 'react';
import './MessagingSystem.css';

interface Contact {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'away' | 'busy';
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
}

interface Message {
  id: string;
  sender: 'me' | 'other';
  content: string;
  type: 'text' | 'image' | 'video' | 'file' | 'voice';
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
}

const MessagingSystem: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chats' | 'calls' | 'groups' | 'status'>('chats');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [isCallActive, setIsCallActive] = useState(false);
  const [callType, setCallType] = useState<'voice' | 'video' | null>(null);

  const contacts: Contact[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      avatar: '👩‍💼',
      status: 'online',
      lastMessage: 'Hey! How are you doing?',
      lastMessageTime: '2 min ago',
      unread: 3
    },
    {
      id: '2',
      name: 'Michael Chen',
      avatar: '👨‍💻',
      status: 'online',
      lastMessage: 'Check out this new NFT collection!',
      lastMessageTime: '15 min ago',
      unread: 1
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      avatar: '👩‍🎨',
      status: 'away',
      lastMessage: 'Thanks for the feedback!',
      lastMessageTime: '1 hour ago',
      unread: 0
    },
    {
      id: '4',
      name: 'David Kim',
      avatar: '👨‍🎨',
      status: 'offline',
      lastMessage: 'See you tomorrow!',
      lastMessageTime: '2 hours ago',
      unread: 0
    },
    {
      id: '5',
      name: 'Lisa Wang',
      avatar: '👩‍🔬',
      status: 'busy',
      lastMessage: 'In a meeting, will call later',
      lastMessageTime: '3 hours ago',
      unread: 0
    }
  ];

  const messages: Message[] = [
    {
      id: '1',
      sender: 'other',
      content: 'Hey! How are you doing?',
      type: 'text',
      timestamp: '10:30 AM',
      status: 'read'
    },
    {
      id: '2',
      sender: 'me',
      content: 'I\'m doing great! Just finished a new course on quantum computing.',
      type: 'text',
      timestamp: '10:32 AM',
      status: 'read'
    },
    {
      id: '3',
      sender: 'other',
      content: 'That\'s awesome! I\'ve been working on some AI projects.',
      type: 'text',
      timestamp: '10:35 AM',
      status: 'read'
    },
    {
      id: '4',
      sender: 'me',
      content: 'Would love to hear more about it!',
      type: 'text',
      timestamp: '10:36 AM',
      status: 'delivered'
    },
    {
      id: '5',
      sender: 'other',
      content: 'Sure! Let me send you some details.',
      type: 'text',
      timestamp: '10:38 AM',
      status: 'sent'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return '#28a745';
      case 'away': return '#ffc107';
      case 'busy': return '#dc3545';
      case 'offline': return '#6c757d';
      default: return '#6c757d';
    }
  };

  const handleSendMessage = () => {
    if (messageInput.trim() && selectedContact) {
      console.log('Sending message:', messageInput);
      setMessageInput('');
    }
  };

  const handleVoiceCall = () => {
    setCallType('voice');
    setIsCallActive(true);
  };

  const handleVideoCall = () => {
    setCallType('video');
    setIsCallActive(true);
  };

  const handleEndCall = () => {
    setIsCallActive(false);
    setCallType(null);
  };

  return (
    <div className="messaging-system">
      <div className="messaging-container">
        {/* Header */}
        <div className="messaging-header">
          <h1>Messages</h1>
          <div className="header-actions">
            <button className="header-btn">🔍 Search</button>
            <button className="header-btn">➕ New Chat</button>
          </div>
        </div>

        {/* Tabs */}
        <div className="messaging-tabs">
          <button
            className={activeTab === 'chats' ? 'active' : ''}
            onClick={() => setActiveTab('chats')}
          >
            💬 Chats
          </button>
          <button
            className={activeTab === 'calls' ? 'active' : ''}
            onClick={() => setActiveTab('calls')}
          >
            📞 Calls
          </button>
          <button
            className={activeTab === 'groups' ? 'active' : ''}
            onClick={() => setActiveTab('groups')}
          >
            👥 Groups
          </button>
          <button
            className={activeTab === 'status' ? 'active' : ''}
            onClick={() => setActiveTab('status')}
          >
            📸 Status
          </button>
        </div>

        <div className="messaging-content">
          {/* Contacts Sidebar */}
          <div className="contacts-sidebar">
            <div className="contacts-search">
              <input type="text" placeholder="Search contacts..." />
            </div>

            <div className="contacts-list">
              {contacts.map(contact => (
                <div
                  key={contact.id}
                  className={`contact-item ${selectedContact?.id === contact.id ? 'active' : ''}`}
                  onClick={() => setSelectedContact(contact)}
                >
                  <div className="contact-avatar-wrapper">
                    <span className="contact-avatar">{contact.avatar}</span>
                    <span
                      className="contact-status-dot"
                      style={{ background: getStatusColor(contact.status) }}
                    />
                  </div>
                  <div className="contact-info">
                    <div className="contact-header">
                      <h4>{contact.name}</h4>
                      <span className="contact-time">{contact.lastMessageTime}</span>
                    </div>
                    <div className="contact-message">
                      <p>{contact.lastMessage}</p>
                      {contact.unread > 0 && (
                        <span className="unread-badge">{contact.unread}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="chat-area">
            {selectedContact ? (
              <>
                {/* Chat Header */}
                <div className="chat-header">
                  <div className="chat-contact-info">
                    <div className="chat-avatar-wrapper">
                      <span className="chat-avatar">{selectedContact.avatar}</span>
                      <span
                        className="chat-status-dot"
                        style={{ background: getStatusColor(selectedContact.status) }}
                      />
                    </div>
                    <div>
                      <h3>{selectedContact.name}</h3>
                      <p className="chat-status">{selectedContact.status}</p>
                    </div>
                  </div>
                  <div className="chat-actions">
                    <button className="chat-action-btn" onClick={handleVoiceCall}>
                      📞 Voice Call
                    </button>
                    <button className="chat-action-btn" onClick={handleVideoCall}>
                      📹 Video Call
                    </button>
                    <button className="chat-action-btn">ℹ️ Info</button>
                  </div>
                </div>

                {/* Messages */}
                <div className="messages-area">
                  <div className="messages-list">
                    {messages.map(message => (
                      <div
                        key={message.id}
                        className={`message-item ${message.sender === 'me' ? 'sent' : 'received'}`}
                      >
                        {message.sender === 'other' && (
                          <span className="message-avatar">{selectedContact.avatar}</span>
                        )}
                        <div className="message-bubble">
                          {message.type === 'text' && (
                            <p>{message.content}</p>
                          )}
                          {message.type === 'image' && (
                            <div className="message-media">🖼️ Image</div>
                          )}
                          {message.type === 'video' && (
                            <div className="message-media">🎥 Video</div>
                          )}
                          {message.type === 'file' && (
                            <div className="message-file">📄 File</div>
                          )}
                          {message.type === 'voice' && (
                            <div className="message-voice">🎤 Voice Message</div>
                          )}
                          <div className="message-meta">
                            <span className="message-time">{message.timestamp}</span>
                            {message.sender === 'me' && (
                              <span className="message-status">
                                {message.status === 'sent' && '✓'}
                                {message.status === 'delivered' && '✓✓'}
                                {message.status === 'read' && '✓✓'}
                              </span>
                            )}
                          </div>
                        </div>
                        {message.sender === 'me' && (
                          <span className="message-avatar">👤</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Message Input */}
                <div className="message-input-area">
                  <button className="input-action-btn">😊</button>
                  <button className="input-action-btn">📎</button>
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <button className="input-action-btn">🎤</button>
                  <button className="send-btn" onClick={handleSendMessage}>
                    Send
                  </button>
                </div>

                {/* Call Overlay */}
                {isCallActive && (
                  <div className="call-overlay">
                    <div className="call-content">
                      <div className="call-avatar">{selectedContact.avatar}</div>
                      <h2>{selectedContact.name}</h2>
                      <p className="call-status">
                        {callType === 'voice' ? '📞 Voice Call' : '📹 Video Call'}
                      </p>
                      <p className="call-duration">00:00</p>

                      {callType === 'video' && (
                        <div className="video-preview">
                          <div className="video-placeholder">📹 Video Feed</div>
                          <div className="video-self">👤 You</div>
                        </div>
                      )}

                      <div className="call-controls">
                        <button className="call-control-btn">🔇 Mute</button>
                        {callType === 'video' && (
                          <button className="call-control-btn">📹 Camera</button>
                        )}
                        <button className="call-control-btn">🔊 Speaker</button>
                        <button className="call-control-btn end-call" onClick={handleEndCall}>
                          📵 End Call
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="no-chat-selected">
                <div className="no-chat-icon">💬</div>
                <h2>Select a chat to start messaging</h2>
                <p>Choose a contact from the list to begin a conversation</p>
              </div>
            )}
          </div>

          {/* Info Sidebar */}
          {selectedContact && (
            <div className="info-sidebar">
              <div className="info-profile">
                <div className="info-avatar">{selectedContact.avatar}</div>
                <h3>{selectedContact.name}</h3>
                <p className="info-status">{selectedContact.status}</p>
              </div>

              <div className="info-section">
                <h4>About</h4>
                <p>AI Researcher passionate about quantum computing and machine learning.</p>
              </div>

              <div className="info-section">
                <h4>Media, Links & Docs</h4>
                <div className="media-grid">
                  <div className="media-item">🖼️</div>
                  <div className="media-item">🖼️</div>
                  <div className="media-item">🖼️</div>
                  <div className="media-item">🖼️</div>
                  <div className="media-item">🖼️</div>
                  <div className="media-item">🖼️</div>
                </div>
              </div>

              <div className="info-section">
                <h4>Shared Groups</h4>
                <div className="shared-groups">
                  <div className="shared-group-item">
                    <span className="group-icon">🤖</span>
                    <span>AI Enthusiasts</span>
                  </div>
                  <div className="shared-group-item">
                    <span className="group-icon">🎨</span>
                    <span>Digital Artists</span>
                  </div>
                </div>
              </div>

              <div className="info-actions">
                <button className="info-action-btn">🔇 Mute</button>
                <button className="info-action-btn">🔔 Custom Notifications</button>
                <button className="info-action-btn">🚫 Block</button>
                <button className="info-action-btn danger">❌ Delete Chat</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagingSystem;

