/**
 * AETHERIAL Groups & Communities System
 * Complete implementation inspired by BuddyBoss
 * INCREMENT 192: Groups, Forums, Events, Media
 */

import { EventEmitter } from 'events';

// ============================================================================
// 1. GROUPS & COMMUNITIES
// ============================================================================

interface Group {
  id: string;
  name: string;
  slug: string;
  description: string;
  type: 'public' | 'private' | 'hidden';
  category: string;
  avatar: string;
  coverImage: string;
  creatorId: string;
  admins: string[];
  moderators: string[];
  members: string[];
  memberCount: number;
  settings: GroupSettings;
  stats: GroupStats;
  createdAt: Date;
  updatedAt: Date;
}

interface GroupSettings {
  allowMemberInvites: boolean;
  requireApproval: boolean;
  allowMemberPosts: boolean;
  allowForums: boolean;
  allowEvents: boolean;
  allowMedia: boolean;
  allowCourses: boolean;
}

interface GroupStats {
  totalPosts: number;
  totalMembers: number;
  totalEvents: number;
  totalMedia: number;
  activityScore: number;
}

interface GroupMembership {
  groupId: string;
  userId: string;
  role: 'admin' | 'moderator' | 'member';
  status: 'active' | 'pending' | 'banned';
  joinedAt: Date;
}

class GroupManager extends EventEmitter {
  private groups: Map<string, Group> = new Map();
  private memberships: Map<string, GroupMembership[]> = new Map();
  private invitations: Map<string, GroupInvitation[]> = new Map();

  async createGroup(group: Omit<Group, 'id' | 'createdAt' | 'updatedAt' | 'memberCount' | 'stats'>): Promise<Group> {
    const newGroup: Group = {
      ...group,
      id: this.generateId(),
      memberCount: 1,
      stats: {
        totalPosts: 0,
        totalMembers: 1,
        totalEvents: 0,
        totalMedia: 0,
        activityScore: 0
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.groups.set(newGroup.id, newGroup);
    
    // Add creator as admin member
    await this.addMember(newGroup.id, group.creatorId, 'admin');
    
    this.emit('group:created', newGroup);
    return newGroup;
  }

  async updateGroup(groupId: string, updates: Partial<Group>): Promise<Group> {
    const group = this.groups.get(groupId);
    if (!group) throw new Error('Group not found');

    Object.assign(group, updates, { updatedAt: new Date() });
    this.emit('group:updated', group);
    return group;
  }

  async deleteGroup(groupId: string): Promise<void> {
    const group = this.groups.get(groupId);
    if (!group) throw new Error('Group not found');

    this.groups.delete(groupId);
    this.memberships.delete(groupId);
    this.emit('group:deleted', groupId);
  }

  async addMember(groupId: string, userId: string, role: 'admin' | 'moderator' | 'member' = 'member'): Promise<void> {
    const group = this.groups.get(groupId);
    if (!group) throw new Error('Group not found');

    const membership: GroupMembership = {
      groupId,
      userId,
      role,
      status: group.settings.requireApproval && role === 'member' ? 'pending' : 'active',
      joinedAt: new Date()
    };

    if (!this.memberships.has(groupId)) {
      this.memberships.set(groupId, []);
    }

    this.memberships.get(groupId)!.push(membership);

    if (membership.status === 'active') {
      group.members.push(userId);
      group.memberCount++;
      group.stats.totalMembers++;

      if (role === 'admin') group.admins.push(userId);
      if (role === 'moderator') group.moderators.push(userId);
    }

    this.emit('group:member:added', { groupId, userId, role });
  }

  async removeMember(groupId: string, userId: string): Promise<void> {
    const group = this.groups.get(groupId);
    if (!group) throw new Error('Group not found');

    const memberships = this.memberships.get(groupId) || [];
    const index = memberships.findIndex(m => m.userId === userId);
    
    if (index !== -1) {
      memberships.splice(index, 1);
      group.members = group.members.filter(id => id !== userId);
      group.admins = group.admins.filter(id => id !== userId);
      group.moderators = group.moderators.filter(id => id !== userId);
      group.memberCount--;
      group.stats.totalMembers--;

      this.emit('group:member:removed', { groupId, userId });
    }
  }

  async inviteMember(groupId: string, inviterId: string, inviteeId: string): Promise<void> {
    const group = this.groups.get(groupId);
    if (!group) throw new Error('Group not found');

    if (!group.settings.allowMemberInvites) {
      throw new Error('Member invitations are disabled for this group');
    }

    const invitation: GroupInvitation = {
      id: this.generateId(),
      groupId,
      inviterId,
      inviteeId,
      status: 'pending',
      createdAt: new Date()
    };

    if (!this.invitations.has(inviteeId)) {
      this.invitations.set(inviteeId, []);
    }

    this.invitations.get(inviteeId)!.push(invitation);
    this.emit('group:invitation:sent', invitation);
  }

  async acceptInvitation(invitationId: string): Promise<void> {
    // Find invitation
    for (const [userId, invites] of this.invitations.entries()) {
      const invitation = invites.find(i => i.id === invitationId);
      if (invitation) {
        invitation.status = 'accepted';
        await this.addMember(invitation.groupId, invitation.inviteeId);
        this.emit('group:invitation:accepted', invitation);
        return;
      }
    }
    throw new Error('Invitation not found');
  }

  async getGroup(groupId: string): Promise<Group | undefined> {
    return this.groups.get(groupId);
  }

  async getUserGroups(userId: string): Promise<Group[]> {
    const userGroups: Group[] = [];
    
    for (const [groupId, memberships] of this.memberships.entries()) {
      const isMember = memberships.some(m => m.userId === userId && m.status === 'active');
      if (isMember) {
        const group = this.groups.get(groupId);
        if (group) userGroups.push(group);
      }
    }

    return userGroups;
  }

  async searchGroups(query: string, filters?: any): Promise<Group[]> {
    const results: Group[] = [];
    
    for (const group of this.groups.values()) {
      if (
        group.name.toLowerCase().includes(query.toLowerCase()) ||
        group.description.toLowerCase().includes(query.toLowerCase())
      ) {
        // Only show public groups in search, or groups user is member of
        if (group.type === 'public') {
          results.push(group);
        }
      }
    }

    return results;
  }

  private generateId(): string {
    return `group-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

interface GroupInvitation {
  id: string;
  groupId: string;
  inviterId: string;
  inviteeId: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: Date;
}

// ============================================================================
// 2. FORUMS & DISCUSSIONS
// ============================================================================

interface Forum {
  id: string;
  groupId?: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  order: number;
  isLocked: boolean;
  permissions: ForumPermissions;
  stats: ForumStats;
  createdAt: Date;
}

interface ForumPermissions {
  canView: string[];
  canPost: string[];
  canReply: string[];
  canModerate: string[];
}

interface ForumStats {
  totalTopics: number;
  totalReplies: number;
  lastActivity: Date;
}

interface ForumTopic {
  id: string;
  forumId: string;
  authorId: string;
  title: string;
  content: string;
  tags: string[];
  isSticky: boolean;
  isLocked: boolean;
  views: number;
  replies: ForumReply[];
  subscribers: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface ForumReply {
  id: string;
  topicId: string;
  authorId: string;
  content: string;
  quotedReplyId?: string;
  reactions: Map<string, string[]>;
  createdAt: Date;
  updatedAt: Date;
}

class ForumManager extends EventEmitter {
  private forums: Map<string, Forum> = new Map();
  private topics: Map<string, ForumTopic> = new Map();

  async createForum(forum: Omit<Forum, 'id' | 'createdAt' | 'stats'>): Promise<Forum> {
    const newForum: Forum = {
      ...forum,
      id: this.generateId(),
      stats: {
        totalTopics: 0,
        totalReplies: 0,
        lastActivity: new Date()
      },
      createdAt: new Date()
    };

    this.forums.set(newForum.id, newForum);
    this.emit('forum:created', newForum);
    return newForum;
  }

  async createTopic(topic: Omit<ForumTopic, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'replies' | 'subscribers'>): Promise<ForumTopic> {
    const forum = this.forums.get(topic.forumId);
    if (!forum) throw new Error('Forum not found');

    if (forum.isLocked) throw new Error('Forum is locked');

    const newTopic: ForumTopic = {
      ...topic,
      id: this.generateId(),
      views: 0,
      replies: [],
      subscribers: [topic.authorId],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.topics.set(newTopic.id, newTopic);
    forum.stats.totalTopics++;
    forum.stats.lastActivity = new Date();

    this.emit('forum:topic:created', newTopic);
    return newTopic;
  }

  async addReply(topicId: string, reply: Omit<ForumReply, 'id' | 'createdAt' | 'updatedAt' | 'reactions'>): Promise<ForumReply> {
    const topic = this.topics.get(topicId);
    if (!topic) throw new Error('Topic not found');

    if (topic.isLocked) throw new Error('Topic is locked');

    const newReply: ForumReply = {
      ...reply,
      id: this.generateId(),
      reactions: new Map(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    topic.replies.push(newReply);
    topic.updatedAt = new Date();

    const forum = this.forums.get(topic.forumId);
    if (forum) {
      forum.stats.totalReplies++;
      forum.stats.lastActivity = new Date();
    }

    // Notify subscribers
    topic.subscribers.forEach(subscriberId => {
      if (subscriberId !== reply.authorId) {
        this.emit('forum:reply:notification', { subscriberId, reply: newReply });
      }
    });

    this.emit('forum:reply:added', newReply);
    return newReply;
  }

  async getForumTopics(forumId: string, page: number = 1, limit: number = 20): Promise<ForumTopic[]> {
    const topics: ForumTopic[] = [];
    
    for (const topic of this.topics.values()) {
      if (topic.forumId === forumId) {
        topics.push(topic);
      }
    }

    // Sort: sticky first, then by last update
    topics.sort((a, b) => {
      if (a.isSticky && !b.isSticky) return -1;
      if (!a.isSticky && b.isSticky) return 1;
      return b.updatedAt.getTime() - a.updatedAt.getTime();
    });

    const start = (page - 1) * limit;
    return topics.slice(start, start + limit);
  }

  private generateId(): string {
    return `forum-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// ============================================================================
// 3. EVENTS SYSTEM
// ============================================================================

interface Event {
  id: string;
  groupId?: string;
  organizerId: string;
  title: string;
  description: string;
  type: 'online' | 'in-person' | 'hybrid';
  category: string;
  startDate: Date;
  endDate: Date;
  timezone: string;
  location?: EventLocation;
  coverImage: string;
  capacity?: number;
  ticketPrice?: number;
  isRecurring: boolean;
  recurrence?: EventRecurrence;
  attendees: string[];
  waitlist: string[];
  settings: EventSettings;
  createdAt: Date;
  updatedAt: Date;
}

interface EventLocation {
  venue: string;
  address: string;
  city: string;
  country: string;
  coordinates?: { lat: number; lng: number };
}

interface EventRecurrence {
  frequency: 'daily' | 'weekly' | 'monthly';
  interval: number;
  endDate?: Date;
}

interface EventSettings {
  requireApproval: boolean;
  allowWaitlist: boolean;
  sendReminders: boolean;
  allowComments: boolean;
}

interface EventRSVP {
  eventId: string;
  userId: string;
  status: 'going' | 'maybe' | 'not_going';
  ticketsPurchased: number;
  checkedIn: boolean;
  createdAt: Date;
}

class EventManager extends EventEmitter {
  private events: Map<string, Event> = new Map();
  private rsvps: Map<string, EventRSVP[]> = new Map();

  async createEvent(event: Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'attendees' | 'waitlist'>): Promise<Event> {
    const newEvent: Event = {
      ...event,
      id: this.generateId(),
      attendees: [],
      waitlist: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.events.set(newEvent.id, newEvent);
    this.emit('event:created', newEvent);

    // Schedule reminders
    if (newEvent.settings.sendReminders) {
      this.scheduleReminders(newEvent);
    }

    return newEvent;
  }

  async rsvpToEvent(eventId: string, userId: string, status: 'going' | 'maybe' | 'not_going', tickets: number = 1): Promise<void> {
    const event = this.events.get(eventId);
    if (!event) throw new Error('Event not found');

    const rsvp: EventRSVP = {
      eventId,
      userId,
      status,
      ticketsPurchased: tickets,
      checkedIn: false,
      createdAt: new Date()
    };

    if (!this.rsvps.has(eventId)) {
      this.rsvps.set(eventId, []);
    }

    const rsvps = this.rsvps.get(eventId)!;
    const existingIndex = rsvps.findIndex(r => r.userId === userId);
    
    if (existingIndex !== -1) {
      rsvps[existingIndex] = rsvp;
    } else {
      rsvps.push(rsvp);
    }

    // Update attendees list
    if (status === 'going') {
      if (event.capacity && event.attendees.length >= event.capacity) {
        if (event.settings.allowWaitlist) {
          event.waitlist.push(userId);
          this.emit('event:waitlist:added', { eventId, userId });
        } else {
          throw new Error('Event is at capacity');
        }
      } else {
        event.attendees.push(userId);
        this.emit('event:rsvp', { eventId, userId, status });
      }
    } else {
      event.attendees = event.attendees.filter(id => id !== userId);
      event.waitlist = event.waitlist.filter(id => id !== userId);
    }
  }

  async checkInAttendee(eventId: string, userId: string): Promise<void> {
    const rsvps = this.rsvps.get(eventId);
    if (!rsvps) throw new Error('Event not found');

    const rsvp = rsvps.find(r => r.userId === userId);
    if (!rsvp) throw new Error('RSVP not found');

    rsvp.checkedIn = true;
    this.emit('event:checkin', { eventId, userId });
  }

  async getUpcomingEvents(userId?: string, limit: number = 10): Promise<Event[]> {
    const now = new Date();
    const upcoming: Event[] = [];

    for (const event of this.events.values()) {
      if (event.startDate > now) {
        if (!userId || event.attendees.includes(userId)) {
          upcoming.push(event);
        }
      }
    }

    return upcoming
      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
      .slice(0, limit);
  }

  async searchEvents(query: string, filters?: any): Promise<Event[]> {
    const results: Event[] = [];
    
    for (const event of this.events.values()) {
      if (
        event.title.toLowerCase().includes(query.toLowerCase()) ||
        event.description.toLowerCase().includes(query.toLowerCase())
      ) {
        results.push(event);
      }
    }

    return results;
  }

  private scheduleReminders(event: Event): void {
    // Schedule reminder 24 hours before event
    const reminderTime = new Date(event.startDate.getTime() - 24 * 60 * 60 * 1000);
    const delay = reminderTime.getTime() - Date.now();

    if (delay > 0) {
      setTimeout(() => {
        event.attendees.forEach(userId => {
          this.emit('event:reminder', { eventId: event.id, userId });
        });
      }, delay);
    }
  }

  private generateId(): string {
    return `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// ============================================================================
// 4. MEDIA LIBRARY
// ============================================================================

interface MediaItem {
  id: string;
  userId: string;
  groupId?: string;
  type: 'photo' | 'video' | 'document' | 'audio';
  filename: string;
  url: string;
  thumbnail?: string;
  size: number;
  mimeType: string;
  title?: string;
  description?: string;
  tags: string[];
  albumId?: string;
  privacy: 'public' | 'friends' | 'private';
  views: number;
  likes: string[];
  comments: MediaComment[];
  uploadedAt: Date;
}

interface MediaAlbum {
  id: string;
  userId: string;
  groupId?: string;
  name: string;
  description: string;
  coverImage: string;
  mediaItems: string[];
  privacy: 'public' | 'friends' | 'private';
  createdAt: Date;
}

interface MediaComment {
  id: string;
  userId: string;
  content: string;
  createdAt: Date;
}

class MediaManager extends EventEmitter {
  private media: Map<string, MediaItem> = new Map();
  private albums: Map<string, MediaAlbum> = new Map();

  async uploadMedia(media: Omit<MediaItem, 'id' | 'uploadedAt' | 'views' | 'likes' | 'comments'>): Promise<MediaItem> {
    const newMedia: MediaItem = {
      ...media,
      id: this.generateId(),
      views: 0,
      likes: [],
      comments: [],
      uploadedAt: new Date()
    };

    this.media.set(newMedia.id, newMedia);
    this.emit('media:uploaded', newMedia);
    return newMedia;
  }

  async createAlbum(album: Omit<MediaAlbum, 'id' | 'createdAt' | 'mediaItems'>): Promise<MediaAlbum> {
    const newAlbum: MediaAlbum = {
      ...album,
      id: this.generateId(),
      mediaItems: [],
      createdAt: new Date()
    };

    this.albums.set(newAlbum.id, newAlbum);
    this.emit('album:created', newAlbum);
    return newAlbum;
  }

  async addToAlbum(albumId: string, mediaId: string): Promise<void> {
    const album = this.albums.get(albumId);
    const media = this.media.get(mediaId);

    if (!album || !media) throw new Error('Album or media not found');

    album.mediaItems.push(mediaId);
    media.albumId = albumId;
    this.emit('album:media:added', { albumId, mediaId });
  }

  async getUserMedia(userId: string, type?: string): Promise<MediaItem[]> {
    const userMedia: MediaItem[] = [];
    
    for (const media of this.media.values()) {
      if (media.userId === userId) {
        if (!type || media.type === type) {
          userMedia.push(media);
        }
      }
    }

    return userMedia.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());
  }

  private generateId(): string {
    return `media-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// ============================================================================
// EXPORT ALL MANAGERS
// ============================================================================

export {
  GroupManager,
  ForumManager,
  EventManager,
  MediaManager,
  Group,
  Forum,
  ForumTopic,
  Event,
  MediaItem,
  MediaAlbum
};

export const groups = new GroupManager();
export const forums = new ForumManager();
export const events = new EventManager();
export const media = new MediaManager();

console.log('✅ Groups, Forums, Events, and Media Systems Initialized');

