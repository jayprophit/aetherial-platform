import { useState, useEffect } from 'react';
import { MessageCircle, Send, Search, MoreVertical, Loader2, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/api';

interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  read: boolean;
  createdAt: string;
  sender?: {
    id: number;
    fullName: string;
    email: string;
  };
}

interface Conversation {
  userId: number;
  userName: string;
  userEmail: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export default function Messages() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      fetchMessages();
    }
  }, [user]);

  useEffect(() => {
    if (selectedUserId) {
      fetchConversation(selectedUserId);
    }
  }, [selectedUserId]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const data = await api.messages.getAll();
      setMessages(data);
      
      const convMap = new Map<number, Conversation>();
      data.forEach((msg: Message) => {
        const otherId = msg.senderId === user?.id ? msg.receiverId : msg.senderId;
        const otherName = msg.sender?.fullName || 'Unknown User';
        const otherEmail = msg.sender?.email || '';
        
        if (!convMap.has(otherId)) {
          convMap.set(otherId, {
            userId: otherId,
            userName: otherName,
            userEmail: otherEmail,
            lastMessage: msg.content,
            lastMessageTime: msg.createdAt,
            unreadCount: !msg.read && msg.receiverId === user?.id ? 1 : 0
          });
        }
      });
      
      setConversations(Array.from(convMap.values()));
    } catch (err) {
      setError('Failed to load messages');
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchConversation = async (userId: number) => {
    try {
      const data = await api.messages.getAll();
      const filtered = data.filter((msg: Message) =>
        (msg.senderId === user?.id && msg.receiverId === userId) ||
        (msg.senderId === userId && msg.receiverId === user?.id)
      );
      setMessages(filtered);
    } catch (err) {
      console.error('Error fetching conversation:', err);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedUserId || !user) return;

    try {
      setSending(true);
      const message = await api.messages.send({
        receiverId: selectedUserId,
        content: newMessage
      });
      setMessages([...messages, message]);
      setNewMessage('');
      fetchMessages();
    } catch (err) {
      setError('Failed to send message');
      console.error('Error sending message:', err);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
          <MessageCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-800 mb-2">Please login to view messages</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 h-[calc(100vh-200px)]">
          <div className="border-r border-slate-200 flex flex-col">
            <div className="p-4 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <MessageCircle className="w-6 h-6 text-blue-600" />
                Messages
              </h2>
              <div className="relative mt-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loading && (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                </div>
              )}

              {!loading && conversations.length === 0 && (
                <div className="p-6 text-center text-slate-500">
                  <p>No conversations yet</p>
                </div>
              )}

              {!loading && conversations.map((conv) => (
                <button
                  key={conv.userId}
                  onClick={() => setSelectedUserId(conv.userId)}
                  className={`w-full p-4 border-b border-slate-200 hover:bg-slate-50 transition-colors text-left ${
                    selectedUserId === conv.userId ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-slate-800 truncate">
                          {conv.userName}
                        </h3>
                        <span className="text-xs text-slate-500">
                          {formatTime(conv.lastMessageTime)}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 truncate">
                        {conv.lastMessage}
                      </p>
                    </div>
                    {conv.unreadCount > 0 && (
                      <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white font-bold">
                          {conv.unreadCount}
                        </span>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 flex flex-col">
            {selectedUserId ? (
              <>
                <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">
                        {conversations.find(c => c.userId === selectedUserId)?.userName || 'User'}
                      </h3>
                      <p className="text-xs text-green-600">Online</p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                    <MoreVertical className="w-5 h-5 text-slate-600" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg) => {
                    const isOwn = msg.senderId === user?.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg px-4 py-2 ${
                            isOwn
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-100 text-slate-800'
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                          <p
                            className={`text-xs mt-1 ${
                              isOwn ? 'text-blue-100' : 'text-slate-500'
                            }`}
                          >
                            {formatTime(msg.createdAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-4 border-t border-slate-200">
                  {error && (
                    <p className="text-red-500 text-sm mb-2">{error}</p>
                  )}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Type a message..."
                      disabled={sending}
                      className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={handleSend}
                      disabled={!newMessage.trim() || sending}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {sending ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-500">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p>Select a conversation to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

