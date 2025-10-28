/**
 * AETHERIAL Social Platform - Complete Implementation
 * Inspired by BuddyBoss, built from scratch with AETHERIAL's unique features
 * INCREMENT 191: Social Networking Core
 */

import { EventEmitter } from 'events';

// ============================================================================
// 1. ACTIVITY FEED SYSTEM
// ============================================================================

interface ActivityPost {
  id: string;
  userId: string;
  content: string;
  type: 'text' | 'image' | 'video' | 'link' | 'poll' | 'shared';
  media?: string[];
  privacy: 'public' | 'friends' | 'private' | 'custom';
  mentions: string[];
  hashtags: string[];
  location?: string;
  scheduledFor?: Date;
  reactions: Map<string, string[]>; // emoji -> userIds
  comments: Comment[];
  shares: number;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

interface Comment {
  id: string;
  userId: string;
  content: string;
  mentions: string[];
  reactions: Map<string, string[]>;
  replies: Comment[];
  createdAt: Date;
}

class ActivityFeedManager extends EventEmitter {
  private posts: Map<string, ActivityPost> = new Map();
  private userFeeds: Map<string, string[]> = new Map();
  private scheduledPosts: Map<string, NodeJS.Timeout> = new Map();

  // Create new post
  async createPost(post: Omit<ActivityPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<ActivityPost> {
    const newPost: ActivityPost = {
      ...post,
      id: this.generateId(),
      reactions: new Map(),
      comments: [],
      shares: 0,
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (post.scheduledFor && post.scheduledFor > new Date()) {
      // Schedule post for future
      const delay = post.scheduledFor.getTime() - Date.now();
      const timeout = setTimeout(() => {
        this.publishPost(newPost);
      }, delay);
      this.scheduledPosts.set(newPost.id, timeout);
    } else {
      this.publishPost(newPost);
    }

    return newPost;
  }

  private publishPost(post: ActivityPost): void {
    this.posts.set(post.id, post);
    this.distributeToFeeds(post);
    this.emit('post:created', post);
  }

  // Distribute post to relevant feeds
  private distributeToFeeds(post: ActivityPost): void {
    // Add to author's feed
    this.addToUserFeed(post.userId, post.id);

    // Add to followers' feeds based on privacy
    if (post.privacy === 'public') {
      // Public posts go to all followers
      const followers = this.getFollowers(post.userId);
      followers.forEach(followerId => {
        this.addToUserFeed(followerId, post.id);
      });
    } else if (post.privacy === 'friends') {
      // Friends-only posts
      const friends = this.getFriends(post.userId);
      friends.forEach(friendId => {
        this.addToUserFeed(friendId, post.id);
      });
    }

    // Notify mentioned users
    post.mentions.forEach(mentionedUserId => {
      this.emit('user:mentioned', { postId: post.id, userId: mentionedUserId });
    });
  }

  private addToUserFeed(userId: string, postId: string): void {
    if (!this.userFeeds.has(userId)) {
      this.userFeeds.set(userId, []);
    }
    this.userFeeds.get(userId)!.unshift(postId);
  }

  // Get user's feed
  async getUserFeed(userId: string, page: number = 1, limit: number = 20): Promise<ActivityPost[]> {
    const postIds = this.userFeeds.get(userId) || [];
    const start = (page - 1) * limit;
    const end = start + limit;
    const pagePostIds = postIds.slice(start, end);
    
    return pagePostIds
      .map(id => this.posts.get(id))
      .filter(post => post !== undefined) as ActivityPost[];
  }

  // React to post
  async reactToPost(postId: string, userId: string, emoji: string): Promise<void> {
    const post = this.posts.get(postId);
    if (!post) throw new Error('Post not found');

    if (!post.reactions.has(emoji)) {
      post.reactions.set(emoji, []);
    }
    
    const reactions = post.reactions.get(emoji)!;
    if (!reactions.includes(userId)) {
      reactions.push(userId);
      this.emit('post:reacted', { postId, userId, emoji });
    }
  }

  // Comment on post
  async addComment(postId: string, comment: Omit<Comment, 'id' | 'createdAt'>): Promise<Comment> {
    const post = this.posts.get(postId);
    if (!post) throw new Error('Post not found');

    const newComment: Comment = {
      ...comment,
      id: this.generateId(),
      reactions: new Map(),
      replies: [],
      createdAt: new Date()
    };

    post.comments.push(newComment);
    this.emit('post:commented', { postId, comment: newComment });

    // Notify mentioned users
    comment.mentions.forEach(mentionedUserId => {
      this.emit('user:mentioned', { postId, commentId: newComment.id, userId: mentionedUserId });
    });

    return newComment;
  }

  // Share post
  async sharePost(postId: string, userId: string, message?: string): Promise<ActivityPost> {
    const originalPost = this.posts.get(postId);
    if (!originalPost) throw new Error('Post not found');

    originalPost.shares++;

    const sharedPost = await this.createPost({
      userId,
      content: message || '',
      type: 'shared',
      privacy: 'public',
      mentions: [],
      hashtags: [],
      media: originalPost.media
    });

    return sharedPost;
  }

  // Helper methods
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private getFollowers(userId: string): string[] {
    // TODO: Implement followers retrieval
    return [];
  }

  private getFriends(userId: string): string[] {
    // TODO: Implement friends retrieval
    return [];
  }
}

// ============================================================================
// 2. USER PROFILES SYSTEM
// ============================================================================

interface UserProfile {
  id: string;
  username: string;
  email: string;
  displayName: string;
  bio: string;
  avatar: string;
  coverImage: string;
  profileType: string;
  customFields: Map<string, any>;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    website?: string;
  };
  location: string;
  birthday: Date;
  gender: string;
  onlineStatus: 'online' | 'away' | 'offline';
  lastSeen: Date;
  profileCompletion: number;
  badges: string[];
  achievements: string[];
  createdAt: Date;
  updatedAt: Date;
}

class ProfileManager extends EventEmitter {
  private profiles: Map<string, UserProfile> = new Map();

  async createProfile(profile: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt' | 'profileCompletion'>): Promise<UserProfile> {
    const newProfile: UserProfile = {
      ...profile,
      id: this.generateId(),
      profileCompletion: this.calculateCompletion(profile),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.profiles.set(newProfile.id, newProfile);
    this.emit('profile:created', newProfile);
    return newProfile;
  }

  async updateProfile(id: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    const profile = this.profiles.get(id);
    if (!profile) throw new Error('Profile not found');

    Object.assign(profile, updates, { 
      updatedAt: new Date(),
      profileCompletion: this.calculateCompletion({ ...profile, ...updates })
    });

    this.emit('profile:updated', profile);
    return profile;
  }

  async getProfile(id: string): Promise<UserProfile | undefined> {
    return this.profiles.get(id);
  }

  async searchProfiles(query: string, filters?: any): Promise<UserProfile[]> {
    const results: UserProfile[] = [];
    
    for (const profile of this.profiles.values()) {
      if (
        profile.username.toLowerCase().includes(query.toLowerCase()) ||
        profile.displayName.toLowerCase().includes(query.toLowerCase()) ||
        profile.bio.toLowerCase().includes(query.toLowerCase())
      ) {
        results.push(profile);
      }
    }

    return results;
  }

  private calculateCompletion(profile: Partial<UserProfile>): number {
    const fields = ['avatar', 'coverImage', 'bio', 'location', 'birthday'];
    const completed = fields.filter(field => profile[field as keyof UserProfile]).length;
    return Math.round((completed / fields.length) * 100);
  }

  private generateId(): string {
    return `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// ============================================================================
// 3. FRIENDS & CONNECTIONS SYSTEM
// ============================================================================

interface FriendRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: Date;
}

interface Connection {
  userId1: string;
  userId2: string;
  type: 'friend' | 'follow';
  createdAt: Date;
}

class ConnectionManager extends EventEmitter {
  private friendRequests: Map<string, FriendRequest> = new Map();
  private connections: Map<string, Connection[]> = new Map();

  async sendFriendRequest(fromUserId: string, toUserId: string): Promise<FriendRequest> {
    const request: FriendRequest = {
      id: this.generateId(),
      fromUserId,
      toUserId,
      status: 'pending',
      createdAt: new Date()
    };

    this.friendRequests.set(request.id, request);
    this.emit('friend:request:sent', request);
    return request;
  }

  async acceptFriendRequest(requestId: string): Promise<void> {
    const request = this.friendRequests.get(requestId);
    if (!request) throw new Error('Friend request not found');

    request.status = 'accepted';
    
    const connection: Connection = {
      userId1: request.fromUserId,
      userId2: request.toUserId,
      type: 'friend',
      createdAt: new Date()
    };

    this.addConnection(connection);
    this.emit('friend:request:accepted', request);
  }

  async declineFriendRequest(requestId: string): Promise<void> {
    const request = this.friendRequests.get(requestId);
    if (!request) throw new Error('Friend request not found');

    request.status = 'declined';
    this.emit('friend:request:declined', request);
  }

  async followUser(followerId: string, followedId: string): Promise<void> {
    const connection: Connection = {
      userId1: followerId,
      userId2: followedId,
      type: 'follow',
      createdAt: new Date()
    };

    this.addConnection(connection);
    this.emit('user:followed', connection);
  }

  async unfollowUser(followerId: string, followedId: string): Promise<void> {
    const connections = this.connections.get(followerId) || [];
    const index = connections.findIndex(
      c => c.userId2 === followedId && c.type === 'follow'
    );

    if (index !== -1) {
      connections.splice(index, 1);
      this.emit('user:unfollowed', { followerId, followedId });
    }
  }

  async getFriends(userId: string): Promise<string[]> {
    const connections = this.connections.get(userId) || [];
    return connections
      .filter(c => c.type === 'friend')
      .map(c => c.userId2);
  }

  async getFollowers(userId: string): Promise<string[]> {
    const followers: string[] = [];
    
    for (const [uid, connections] of this.connections.entries()) {
      const isFollowing = connections.some(
        c => c.userId2 === userId && c.type === 'follow'
      );
      if (isFollowing) {
        followers.push(uid);
      }
    }

    return followers;
  }

  async getFollowing(userId: string): Promise<string[]> {
    const connections = this.connections.get(userId) || [];
    return connections
      .filter(c => c.type === 'follow')
      .map(c => c.userId2);
  }

  async getSuggestedFriends(userId: string): Promise<string[]> {
    // AI-powered friend suggestions based on mutual friends, interests, etc.
    const friends = await this.getFriends(userId);
    const suggestions = new Set<string>();

    // Find friends of friends
    for (const friendId of friends) {
      const friendsOfFriend = await this.getFriends(friendId);
      friendsOfFriend.forEach(id => {
        if (id !== userId && !friends.includes(id)) {
          suggestions.add(id);
        }
      });
    }

    return Array.from(suggestions);
  }

  private addConnection(connection: Connection): void {
    if (!this.connections.has(connection.userId1)) {
      this.connections.set(connection.userId1, []);
    }
    this.connections.get(connection.userId1)!.push(connection);
  }

  private generateId(): string {
    return `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// ============================================================================
// 4. MESSAGING SYSTEM
// ============================================================================

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'video' | 'file' | 'voice';
  attachments: string[];
  readBy: string[];
  createdAt: Date;
}

interface Conversation {
  id: string;
  participants: string[];
  type: 'direct' | 'group';
  name?: string;
  avatar?: string;
  lastMessage?: Message;
  createdAt: Date;
  updatedAt: Date;
}

class MessagingManager extends EventEmitter {
  private conversations: Map<string, Conversation> = new Map();
  private messages: Map<string, Message[]> = new Map();
  private typingUsers: Map<string, Set<string>> = new Map();

  async createConversation(participants: string[], type: 'direct' | 'group', name?: string): Promise<Conversation> {
    const conversation: Conversation = {
      id: this.generateId(),
      participants,
      type,
      name,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.conversations.set(conversation.id, conversation);
    this.messages.set(conversation.id, []);
    this.emit('conversation:created', conversation);
    return conversation;
  }

  async sendMessage(conversationId: string, message: Omit<Message, 'id' | 'createdAt' | 'readBy'>): Promise<Message> {
    const conversation = this.conversations.get(conversationId);
    if (!conversation) throw new Error('Conversation not found');

    const newMessage: Message = {
      ...message,
      id: this.generateId(),
      readBy: [message.senderId],
      createdAt: new Date()
    };

    const messages = this.messages.get(conversationId)!;
    messages.push(newMessage);

    conversation.lastMessage = newMessage;
    conversation.updatedAt = new Date();

    this.emit('message:sent', newMessage);
    
    // Notify participants
    conversation.participants.forEach(participantId => {
      if (participantId !== message.senderId) {
        this.emit('message:received', { participantId, message: newMessage });
      }
    });

    return newMessage;
  }

  async markAsRead(conversationId: string, messageId: string, userId: string): Promise<void> {
    const messages = this.messages.get(conversationId);
    if (!messages) throw new Error('Conversation not found');

    const message = messages.find(m => m.id === messageId);
    if (message && !message.readBy.includes(userId)) {
      message.readBy.push(userId);
      this.emit('message:read', { messageId, userId });
    }
  }

  async setTyping(conversationId: string, userId: string, isTyping: boolean): Promise<void> {
    if (!this.typingUsers.has(conversationId)) {
      this.typingUsers.set(conversationId, new Set());
    }

    const typingSet = this.typingUsers.get(conversationId)!;
    
    if (isTyping) {
      typingSet.add(userId);
    } else {
      typingSet.delete(userId);
    }

    this.emit('typing:changed', { conversationId, userId, isTyping });
  }

  async getConversations(userId: string): Promise<Conversation[]> {
    const userConversations: Conversation[] = [];
    
    for (const conversation of this.conversations.values()) {
      if (conversation.participants.includes(userId)) {
        userConversations.push(conversation);
      }
    }

    return userConversations.sort((a, b) => 
      b.updatedAt.getTime() - a.updatedAt.getTime()
    );
  }

  async getMessages(conversationId: string, page: number = 1, limit: number = 50): Promise<Message[]> {
    const messages = this.messages.get(conversationId) || [];
    const start = (page - 1) * limit;
    const end = start + limit;
    return messages.slice(-end, -start || undefined).reverse();
  }

  async searchMessages(conversationId: string, query: string): Promise<Message[]> {
    const messages = this.messages.get(conversationId) || [];
    return messages.filter(m => 
      m.content.toLowerCase().includes(query.toLowerCase())
    );
  }

  private generateId(): string {
    return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// ============================================================================
// 5. NOTIFICATIONS SYSTEM
// ============================================================================

interface Notification {
  id: string;
  userId: string;
  type: 'mention' | 'comment' | 'like' | 'friend_request' | 'message' | 'follow' | 'post_shared';
  actorId: string;
  targetId: string;
  content: string;
  read: boolean;
  createdAt: Date;
}

class NotificationManager extends EventEmitter {
  private notifications: Map<string, Notification[]> = new Map();

  async createNotification(notification: Omit<Notification, 'id' | 'createdAt' | 'read'>): Promise<Notification> {
    const newNotification: Notification = {
      ...notification,
      id: this.generateId(),
      read: false,
      createdAt: new Date()
    };

    if (!this.notifications.has(notification.userId)) {
      this.notifications.set(notification.userId, []);
    }

    this.notifications.get(notification.userId)!.unshift(newNotification);
    this.emit('notification:created', newNotification);
    return newNotification;
  }

  async getNotifications(userId: string, unreadOnly: boolean = false): Promise<Notification[]> {
    const userNotifications = this.notifications.get(userId) || [];
    
    if (unreadOnly) {
      return userNotifications.filter(n => !n.read);
    }
    
    return userNotifications;
  }

  async markAsRead(userId: string, notificationId: string): Promise<void> {
    const userNotifications = this.notifications.get(userId) || [];
    const notification = userNotifications.find(n => n.id === notificationId);
    
    if (notification) {
      notification.read = true;
      this.emit('notification:read', notification);
    }
  }

  async markAllAsRead(userId: string): Promise<void> {
    const userNotifications = this.notifications.get(userId) || [];
    userNotifications.forEach(n => n.read = true);
    this.emit('notifications:all_read', userId);
  }

  async getUnreadCount(userId: string): Promise<number> {
    const userNotifications = this.notifications.get(userId) || [];
    return userNotifications.filter(n => !n.read).length;
  }

  private generateId(): string {
    return `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// ============================================================================
// EXPORT ALL MANAGERS
// ============================================================================

export {
  ActivityFeedManager,
  ProfileManager,
  ConnectionManager,
  MessagingManager,
  NotificationManager,
  ActivityPost,
  UserProfile,
  FriendRequest,
  Connection,
  Message,
  Conversation,
  Notification
};

// Initialize managers
export const activityFeed = new ActivityFeedManager();
export const profiles = new ProfileManager();
export const connections = new ConnectionManager();
export const messaging = new MessagingManager();
export const notifications = new NotificationManager();

console.log('✅ Social Platform Core Systems Initialized');

