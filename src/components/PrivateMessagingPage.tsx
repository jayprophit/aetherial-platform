import React, { useState, useEffect, useRef } from 'react';
import './PrivateMessagingPage.css'; // Assume a corresponding CSS file for styling

// --- 1. TypeScript Interfaces and Types ---

/**
 * Represents a single user in the chat system.
 */
interface User {
  id: string;
  name: string;
  avatarUrl: string;
  isOnline: boolean;
  // AETHERIAL Enhancement: Wallet address for secure transactions/tips
  walletAddress?: string;
}

/**
 * Represents a file attachment in a message.
 */
interface Attachment {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  url: string;
  // AETHERIAL Enhancement: Blockchain-based file hash for integrity check
  blockchainHash?: string;
}

/**
 * Represents a single message in a conversation.
 */
interface Message {
  id: string;
  sender: User;
  content: string;
  timestamp: string; // ISO 8601 string
  attachments: Attachment[];
  isRead: boolean;
  // AETHERIAL Enhancement: AI-generated sentiment analysis for quick review
  sentiment?: 'positive' | 'negative' | 'neutral';
}

/**
 * Represents a one-on-one or group conversation.
 */
interface Conversation {
  id: string;
  type: 'one-on-one' | 'group';
  participants: User[];
  messages: Message[];
  lastMessage: Message | null;
  unreadCount: number;
  isTyping: boolean;
}

// --- 2. Sample Data (BuddyBoss-style features + AETHERIAL enhancements) ---

const currentUser: User = {
  id: 'u1',
  name: 'Aetherial User',
  avatarUrl: 'https://i.pravatar.cc/150?img=1',
  isOnline: true,
  walletAddress: '0xAeTh3r1aLWaLl3tAddr3ss1',
};

const sampleUsers: User[] = [
  { id: 'u2', name: 'Crypto Analyst', avatarUrl: 'https://i.pravatar.cc/150?img=2', isOnline: true, walletAddress: '0xAeTh3r1aLWaLl3tAddr3ss2' },
  { id: 'u3', name: 'DeFi Dev', avatarUrl: 'https://i.pravatar.cc/150?img=3', isOnline: false, walletAddress: '0xAeTh3r1aLWaLl3tAddr3ss3' },
  { id: 'u4', name: 'AI Researcher', avatarUrl: 'https://i.pravatar.cc/150?img=4', isOnline: true, walletAddress: '0xAeTh3r1aLWaLl3tAddr3ss4' },
];

const sampleConversations: Conversation[] = [
  {
    id: 'c1',
    type: 'one-on-one',
    participants: [currentUser, sampleUsers[0]],
    isTyping: false,
    unreadCount: 1,
    messages: [
      {
        id: 'm1',
        sender: sampleUsers[0],
        content: 'Hey, did you see the latest DeFi proposal?',
        timestamp: new Date(Date.now() - 120000).toISOString(),
        attachments: [],
        isRead: false,
        sentiment: 'neutral',
      },
      {
        id: 'm2',
        sender: currentUser,
        content: 'Not yet! Send the link. I can tip you for the info using the integrated DeFi feature.',
        timestamp: new Date(Date.now() - 60000).toISOString(),
        attachments: [],
        isRead: true,
        sentiment: 'positive',
      },
    ],
    lastMessage: {
      id: 'm2',
      sender: currentUser,
      content: 'Not yet! Send the link. I can tip you for the info using the integrated DeFi feature.',
      timestamp: new Date(Date.now() - 60000).toISOString(),
      attachments: [],
      isRead: true,
      sentiment: 'positive',
    },
  },
  {
    id: 'c2',
    type: 'group',
    participants: [currentUser, sampleUsers[1], sampleUsers[2]],
    isTyping: true,
    unreadCount: 0,
    messages: [
      {
        id: 'm3',
        sender: sampleUsers[1],
        content: 'Group chat: We need to finalize the smart contract audit report.',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        attachments: [
          {
            id: 'a1',
            fileName: 'AuditReport.pdf',
            fileSize: 1548000,
            fileType: 'application/pdf',
            url: '/files/AuditReport.pdf',
            blockchainHash: '0xHashForIntegrityCheck123',
          },
        ],
        isRead: true,
        sentiment: 'neutral',
      },
    ],
    lastMessage: {
      id: 'm3',
      sender: sampleUsers[1],
      content: 'Group chat: We need to finalize the smart contract audit report.',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      attachments: [
        {
          id: 'a1',
          fileName: 'AuditReport.pdf',
          fileSize: 1548000,
          fileType: 'application/pdf',
          url: '/files/AuditReport.pdf',
          blockchainHash: '0xHashForIntegrityCheck123',
        },
      ],
      isRead: true,
      sentiment: 'neutral',
    },
  },
];

// --- 3. Utility Components and Functions ---

/**
 * Formats a timestamp into a human-readable string.
 * @param isoString The ISO 8601 timestamp string.
 */
const formatTimestamp = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

/**
 * Renders an avatar with an online status indicator.
 */
const Avatar: React.FC<{ user: User }> = ({ user }) => (
  <div className="aetherial-avatar-container">
    <img src={user.avatarUrl} alt={user.name} className="aetherial-avatar" />
    <span className={`aetherial-status-indicator ${user.isOnline ? 'online' : 'offline'}`}></span>
  </div>
);

/**
 * Renders a single message bubble.
 */
const MessageBubble: React.FC<{ message: Message; isCurrentUser: boolean }> = ({ message, isCurrentUser }) => {
  const bubbleClass = isCurrentUser ? 'aetherial-message-bubble-current' : 'aetherial-message-bubble-other';
  const senderName = isCurrentUser ? 'You' : message.sender.name;

  // AETHERIAL Enhancement: Sentiment badge
  const sentimentBadge = message.sentiment ? (
    <span className={`aetherial-sentiment-badge aetherial-sentiment-${message.sentiment}`}>
      {message.sentiment.charAt(0).toUpperCase()}
    </span>
  ) : null;

  return (
    <div className={`aetherial-message-row ${isCurrentUser ? 'right' : 'left'}`}>
      {!isCurrentUser && <Avatar user={message.sender} />}
      <div className={bubbleClass}>
        <div className="aetherial-message-header">
          <span className="aetherial-sender-name">{senderName}</span>
          {sentimentBadge}
        </div>
        <p className="aetherial-message-content">{message.content}</p>
        {message.attachments.map(attachment => (
          <div key={attachment.id} className="aetherial-attachment">
            <a href={attachment.url} target="_blank" rel="noopener noreferrer">
              📄 {attachment.fileName} ({Math.round(attachment.fileSize / 1024)} KB)
            </a>
            {/* AETHERIAL Enhancement: Blockchain hash check button */}
            {attachment.blockchainHash && (
              <button className="aetherial-file-check-btn" title={`Blockchain Hash: ${attachment.blockchainHash}`}>
                ✅ Integrity Check
              </button>
            )}
          </div>
        ))}
        <div className="aetherial-message-footer">
          <span className="aetherial-timestamp">{formatTimestamp(message.timestamp)}</span>
          {isCurrentUser && message.isRead && <span className="aetherial-read-receipt">✓✓</span>}
        </div>
      </div>
    </div>
  );
};

/**
 * Renders the list of conversations (sidebar).
 */
const ConversationList: React.FC<{
  conversations: Conversation[];
  selectedConversationId: string | null;
  onSelect: (id: string) => void;
}> = ({ conversations, selectedConversationId, onSelect }) => (
  <div className="aetherial-conversation-list">
    <div className="aetherial-list-header">
      <h2>Chats</h2>
      {/* BuddyBoss-style feature: New Message/Filter button */}
      <button className="aetherial-new-chat-btn">+</button>
    </div>
    {conversations.map(conv => {
      const otherParticipant = conv.participants.find(p => p.id !== currentUser.id);
      const isSelected = conv.id === selectedConversationId;
      const lastMessage = conv.lastMessage;

      return (
        <div
          key={conv.id}
          className={`aetherial-conversation-item ${isSelected ? 'selected' : ''}`}
          onClick={() => onSelect(conv.id)}
        >
          <Avatar user={otherParticipant || conv.participants[0]} />
          <div className="aetherial-conv-details">
            <div className="aetherial-conv-header">
              <span className="aetherial-conv-name">
                {conv.type === 'one-on-one' ? otherParticipant?.name : 'Group Chat'}
              </span>
              <span className="aetherial-conv-time">
                {lastMessage ? formatTimestamp(lastMessage.timestamp) : ''}
              </span>
            </div>
            <p className="aetherial-conv-snippet">
              {lastMessage?.content.substring(0, 30)}...
            </p>
          </div>
          {conv.unreadCount > 0 && (
            <span className="aetherial-unread-count">{conv.unreadCount}</span>
          )}
        </div>
      );
    })}
  </div>
);

/**
 * Renders the main chat window for a selected conversation.
 */
const ChatWindow: React.FC<{
  conversation: Conversation;
  onSendMessage: (convId: string, content: string, attachments?: Attachment[]) => void;
}> = ({ conversation, onSendMessage }) => {
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatPartner = conversation.participants.find(p => p.id !== currentUser.id);

  // Scroll to the latest message whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation.messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim()) {
      onSendMessage(conversation.id, messageInput.trim());
      setMessageInput('');
    }
  };

  // AETHERIAL Enhancement: DeFi Tip button logic (placeholder)
  const handleTip = () => {
    if (chatPartner?.walletAddress) {
      alert(`Initiating DeFi tip to ${chatPartner.name} at address: ${chatPartner.walletAddress}`);
      // In a real app, this would trigger a wallet transaction modal
    } else {
      alert('Cannot tip: Partner wallet address not available.');
    }
  };

  // AETHERIAL Enhancement: AI-Powered Reply Suggestion (placeholder)
  const handleAISuggestion = () => {
    alert('Fetching AI-powered reply suggestion...');
    // In a real app, this would call an AI service to suggest a reply based on conversation context
  };

  return (
    <div className="aetherial-chat-window">
      <div className="aetherial-chat-header">
        <Avatar user={chatPartner || conversation.participants[0]} />
        <div className="aetherial-header-info">
          <h3>{conversation.type === 'one-on-one' ? chatPartner?.name : 'Group Chat'}</h3>
          <p className="aetherial-status">
            {conversation.type === 'one-on-one'
              ? chatPartner?.isOnline ? 'Online' : 'Offline'
              : `${conversation.participants.length} members`}
          </p>
        </div>
        {/* BuddyBoss-style feature: Conversation settings/details button */}
        <button className="aetherial-settings-btn">⚙️</button>
      </div>

      <div className="aetherial-message-area">
        {conversation.messages.map(message => (
          <MessageBubble
            key={message.id}
            message={message}
            isCurrentUser={message.sender.id === currentUser.id}
          />
        ))}
        {conversation.isTyping && (
          <div className="aetherial-typing-indicator">
            {chatPartner?.name || 'Someone'} is typing...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="aetherial-message-input-form" onSubmit={handleSend}>
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="Type a message..."
          aria-label="Message input"
        />
        {/* BuddyBoss-style feature: File Attachment button */}
        <button type="button" className="aetherial-attachment-btn" title="Attach File">📎</button>
        
        {/* AETHERIAL Enhancement: AI Suggestion Button */}
        <button type="button" className="aetherial-ai-btn" onClick={handleAISuggestion} title="AI Reply Suggestion">🧠</button>
        
        {/* AETHERIAL Enhancement: DeFi Tip Button (for one-on-one chats) */}
        {conversation.type === 'one-on-one' && (
          <button type="button" className="aetherial-tip-btn" onClick={handleTip} title="Send DeFi Tip">💰</button>
        )}
        
        <button type="submit" className="aetherial-send-btn" disabled={!messageInput.trim()}>
          Send
        </button>
      </form>
    </div>
  );
};

// --- 4. Main Component: PrivateMessagingPage ---

/**
 * The main component for the Private Messaging Page.
 * It manages the list of conversations and the currently selected chat window.
 */
const PrivateMessagingPage: React.FC = () => {
  // State for all conversations
  const [conversations, setConversations] = useState<Conversation[]>(sampleConversations);
  // State for the currently selected conversation ID
  const [selectedConvId, setSelectedConvId] = useState<string | null>(sampleConversations[0]?.id || null);

  // Find the currently selected conversation object
  const selectedConversation = conversations.find(c => c.id === selectedConvId);

  /**
   * Handles selecting a new conversation from the list.
   * @param id The ID of the conversation to select.
   */
  const handleSelectConversation = (id: string) => {
    setSelectedConvId(id);
    // In a real app, this would also trigger an API call to mark all messages as read
    setConversations(prev =>
      prev.map(conv =>
        conv.id === id ? { ...conv, unreadCount: 0 } : conv
      )
    );
  };

  /**
   * Handles sending a new message.
   * @param convId The ID of the conversation.
   * @param content The message content.
   * @param attachments Optional array of attachments.
   */
  const handleSendMessage = (convId: string, content: string, attachments: Attachment[] = []) => {
    const newMessage: Message = {
      id: `m${Date.now()}`,
      sender: currentUser,
      content: content,
      timestamp: new Date().toISOString(),
      attachments: attachments,
      isRead: false, // Will be marked as read by the recipient
      sentiment: 'neutral', // Placeholder, would be generated on the backend
    };

    setConversations(prev =>
      prev.map(conv => {
        if (conv.id === convId) {
          return {
            ...conv,
            messages: [...conv.messages, newMessage],
            lastMessage: newMessage,
          };
        }
        return conv;
      })
    );
  };

  // Responsive Design Consideration:
  // In a full application, the sidebar would hide on small screens.
  // We'll use CSS for the actual responsive layout, but keep the structure simple here.

  return (
    <div className="aetherial-messaging-page">
      <div className="aetherial-sidebar">
        <ConversationList
          conversations={conversations}
          selectedConversationId={selectedConvId}
          onSelect={handleSelectConversation}
        />
      </div>
      <div className="aetherial-main-content">
        {selectedConversation ? (
          <ChatWindow
            conversation={selectedConversation}
            onSendMessage={handleSendMessage}
          />
        ) : (
          <div className="aetherial-no-chat-selected">
            Select a conversation to start chatting.
          </div>
        )}
      </div>
    </div>
  );
};

// --- 5. Export ---

export default PrivateMessagingPage;