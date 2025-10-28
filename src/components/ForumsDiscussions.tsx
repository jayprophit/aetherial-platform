import React, { useState, useEffect, useMemo, useCallback } from 'react';

// --- CSS for Responsive Design (Inline for self-contained component) ---
const FORUM_CSS = `
/*
 * Minimal CSS for ForumsDiscussions component
 * Demonstrates responsive design for desktop and mobile views
 */

.forums-discussions-page {
    font-family: sans-serif;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.page-header {
    border-bottom: 2px solid #eee;
    padding-bottom: 10px;
    margin-bottom: 20px;
}

.forum-main-content {
    display: flex;
    gap: 20px;
}

.forum-sidebar {
    width: 250px;
    flex-shrink: 0;
    /* Basic styling for categories */
    border: 1px solid #ddd;
    padding: 15px;
    border-radius: 8px;
}

.category-list {
    list-style: none;
    padding: 0;
}

.category-item {
    padding: 8px 0;
    cursor: pointer;
    border-bottom: 1px dashed #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: background-color 0.2s;
}

.category-item:hover {
    background-color: #f9f9f9;
}

.category-item.active {
    font-weight: bold;
    color: #007bff;
}

.topic-count {
    font-size: 0.8em;
    color: #666;
}

.forum-content-area {
    flex-grow: 1;
}

/* Topic List Styling */
.forum-topics h2 {
    margin-top: 0;
}

.forum-controls {
    display: flex;
    gap: 10px;
    margin-bottom: 15px;
    align-items: center;
}

.search-input, .sort-select {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.new-topic-btn {
    padding: 8px 15px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.topic-list-container {
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
}

.topic-header, .topic-row {
    display: grid;
    grid-template-columns: 3fr 0.5fr 0.5fr 1fr;
    padding: 10px 15px;
    align-items: center;
    border-bottom: 1px solid #eee;
}

.topic-header {
    font-weight: bold;
    background-color: #f8f9fa;
}

.topic-row:hover {
    background-color: #f4f4f4;
}

.topic-row a {
    text-decoration: none;
    color: #007bff;
}

.topic-row .author-name, .topic-row .time-ago {
    font-size: 0.8em;
    color: #6c757d;
    margin-left: 5px;
}

/* BuddyBoss-inspired Sticky Tags */
.tag {
    display: inline-block;
    padding: 2px 6px;
    margin-right: 5px;
    border-radius: 3px;
    font-size: 0.75em;
    font-weight: bold;
    color: white;
}

.super-sticky-tag {
    background-color: #dc3545; /* Red */
}

.sticky-tag {
    background-color: #ffc107; /* Yellow */
    color: #333;
}

/* Aetherial AI Enhancement Tag */
.ai-summary-tag {
    background-color: #007bff;
    color: white;
    cursor: help;
    margin-left: 10px;
}

/* Moderation Footer */
.moderation-footer {
    margin-top: 20px;
    padding: 10px;
    border-top: 1px solid #eee;
    font-size: 0.9em;
    color: #6c757d;
}

.mod-status {
    font-weight: bold;
    color: #28a745; /* Green for clear */
}

/* Responsive Breakpoint */
@media (max-width: 768px) {
    .forum-main-content {
        flex-direction: column;
    }

    .forum-sidebar {
        width: 100%;
        margin-bottom: 20px;
    }

    .topic-header, .topic-row {
        grid-template-columns: 2fr 0.5fr 1fr; /* Remove view count column */
    }

    .topic-stats-col:nth-child(3) { /* Target the view count column */
        display: none;
    }

    .forum-controls {
        flex-direction: column;
        align-items: stretch;
    }

    .search-input, .sort-select, .new-topic-btn {
        width: 100%;
    }
}
`;

// --- Aetherial Enhancements Types ---

/**
 * Represents a tokenized reward for a helpful reply, using a simple
 * token standard (e.g., ERC-20 or platform-specific token).
 * This is a DeFi integration.
 */
interface TokenReward {
  tokenId: string;
  amount: number;
  tokenSymbol: 'AETH' | 'GOV' | 'REP'; // Aetherial Token, Governance Token, Reputation Token
  transactionHash: string; // Blockchain transaction hash for verification
}

/**
 * Represents an AI-powered moderation flag or summary.
 * This is an AI integration.
 */
interface AIAnalysis {
  isFlagged: boolean;
  flagReason?: 'Inappropriate Content' | 'Spam' | 'Off-Topic';
  aiSummary?: string; // AI-generated summary of a long topic
  confidenceScore?: number; // AI confidence in the analysis
}

// --- Core Forum Types ---

/**
 * Represents a user profile.
 */
interface User {
  id: string;
  username: string;
  avatarUrl: string;
  reputationScore: number; // Aetherial Reputation Score (Blockchain/Reputation integration)
}

/**
 * Represents a reaction to a reply.
 */
interface Reaction {
  id: string;
  userId: string;
  type: 'like' | 'heart' | 'upvote' | 'fire' | 'AETH-tip'; // AETH-tip is a DeFi reaction
}

/**
 * Represents a reply/post within a topic.
 */
interface ForumReply {
  id: string;
  topicId: string;
  author: User;
  content: string;
  postedAt: string; // ISO date string
  reactions: Reaction[];
  tokenReward?: TokenReward; // Optional Aetherial Token Reward (DeFi)
  aiAnalysis?: AIAnalysis; // Optional AI Moderation Analysis (AI)
}

/**
 * Represents a discussion topic.
 */
interface ForumTopic {
  id: string;
  categoryId: string;
  title: string;
  slug: string;
  author: User;
  content: string;
  postedAt: string;
  lastReplyAt: string;
  replyCount: number;
  viewCount: number;
  isSticky: boolean; // BuddyBoss inspired feature
  isSuperSticky: boolean; // BuddyBoss inspired feature
  isLocked: boolean;
  aiSummary?: string; // AI-generated summary for quick overview (AI)
}

/**
 * Represents a forum category.
 */
interface ForumCategory {
  id: string;
  name: string;
  description: string;
  slug: string;
  topicCount: number;
  lastTopic?: ForumTopic;
}

// --- Component Props and State ---

interface ForumsDiscussionsProps {
  initialCategories?: ForumCategory[];
}

interface ForumState {
  categories: ForumCategory[];
  topics: ForumTopic[];
  replies: ForumReply[];
}

// --- Sample Data (Mock API Response) ---

const MOCK_USERS: Record<string, User> = {
  'u-1': { id: 'u-1', username: 'CryptoDev', avatarUrl: 'avatar-1.png', reputationScore: 950 },
  'u-2': { id: 'u-2', username: 'AetherialAI', avatarUrl: 'avatar-2.png', reputationScore: 1200 },
  'u-3': { id: 'u-3', username: 'DeFi_Guru', avatarUrl: 'avatar-3.png', reputationScore: 880 },
};

const MOCK_REPLIES: ForumReply[] = [
  {
    id: 'r-1',
    topicId: 't-1',
    author: MOCK_USERS['u-2'],
    content: "This is a great question! The current governance proposal (AIP-005) suggests a 5% staking requirement for all new category creation. This helps prevent spam and encourages community ownership.",
    postedAt: '2025-10-28T10:00:00Z',
    reactions: [
      { id: 're-1', userId: 'u-1', type: 'heart' },
      { id: 're-2', userId: 'u-3', type: 'upvote' },
      { id: 're-3', userId: 'u-1', type: 'AETH-tip' }, // DeFi tip
    ],
    tokenReward: {
      tokenId: 'tx-12345',
      amount: 50,
      tokenSymbol: 'AETH',
      transactionHash: '0xabc123def456...',
    },
    aiAnalysis: {
      isFlagged: false,
      confidenceScore: 0.99,
    }
  },
  {
    id: 'r-2',
    topicId: 't-1',
    author: MOCK_USERS['u-3'],
    content: "I agree. The staking mechanism is a solid DeFi integration. However, we should also consider a reputation-based delegation system for less active members.",
    postedAt: '2025-10-28T10:15:00Z',
    reactions: [
      { id: 're-4', userId: 'u-2', type: 'like' },
    ],
  },
  {
    id: 'r-3',
    topicId: 't-2',
    author: MOCK_USERS['u-1'],
    content: "Has anyone tried the new AI summarization feature on long threads? It's a game-changer for quickly catching up.",
    postedAt: '2025-10-28T11:00:00Z',
    reactions: [],
  },
];

const MOCK_TOPICS: ForumTopic[] = [
  {
    id: 't-1',
    categoryId: 'c-1',
    title: 'Governance Proposal: Staking Requirements for New Forum Categories',
    slug: 'governance-proposal-staking-requirements',
    author: MOCK_USERS['u-1'],
    content: 'We need a mechanism to ensure new categories are well-thought-out. I propose a minimum stake of 100 AETH tokens for 30 days.',
    postedAt: '2025-10-28T09:30:00Z',
    lastReplyAt: '2025-10-28T10:15:00Z',
    replyCount: 2,
    viewCount: 150,
    isSticky: true,
    isSuperSticky: false,
    isLocked: false,
    aiSummary: "Discussion on a proposal (AIP-005) to require a 100 AETH token stake for 30 days to create a new forum category, integrating DeFi principles for spam prevention and community ownership."
  },
  {
    id: 't-2',
    categoryId: 'c-2',
    title: 'Best Practices for AI-Powered Content Creation in Aetherial',
    slug: 'ai-content-creation-best-practices',
    author: MOCK_USERS['u-2'],
    content: 'Let\'s discuss the ethical and practical guidelines for using the platform\'s integrated AI tools for generating forum content.',
    postedAt: '2025-10-27T15:00:00Z',
    lastReplyAt: '2025-10-28T11:00:00Z',
    replyCount: 1,
    viewCount: 88,
    isSticky: false,
    isSuperSticky: false,
    isLocked: false,
  },
];

const MOCK_CATEGORIES: ForumCategory[] = [
  {
    id: 'c-1',
    name: 'Aetherial Governance & DeFi',
    description: 'Discussions on platform governance, tokenomics, and decentralized finance integrations.',
    slug: 'governance-defi',
    topicCount: 1,
    lastTopic: MOCK_TOPICS[0],
  },
  {
    id: 'c-2',
    name: 'AI & Quantum Computing',
    description: 'Threads related to the Quantum Virtual Assistant and AI-powered features.',
    slug: 'ai-quantum',
    topicCount: 1,
    lastTopic: MOCK_TOPICS[1],
  },
  {
    id: 'c-3',
    name: 'General Community Discussion',
    description: 'Off-topic and general announcements.',
    slug: 'general',
    topicCount: 0,
  },
];

// --- Component Implementation ---

const ForumsDiscussions: React.FC<ForumsDiscussionsProps> = ({ initialCategories = MOCK_CATEGORIES }) => {
  // Inject CSS style block into the document head on mount
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = FORUM_CSS;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // State management for the entire forum view
  const [forumState, setForumState] = useState<ForumState>({
    categories: initialCategories,
    topics: MOCK_TOPICS,
    replies: MOCK_REPLIES,
  });

  // State for filtering/sorting
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'latest' | 'popular'>('latest');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data fetching (in production, this would be an API call)
  useEffect(() => {
    // Simulate fetching all data on mount
    console.log("Forum component mounted. Data loaded.");
  }, []);

  // Filtered and sorted list of topics based on state
  const filteredTopics = useMemo(() => {
    let topics = forumState.topics;

    // 1. Filter by Category
    if (activeCategory) {
      topics = topics.filter(topic => topic.categoryId === activeCategory);
    }

    // 2. Filter by Search Term
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      topics = topics.filter(topic =>
        topic.title.toLowerCase().includes(lowerCaseSearch) ||
        topic.content.toLowerCase().includes(lowerCaseSearch) ||
        topic.author.username.toLowerCase().includes(lowerCaseSearch)
      );
    }

    // 3. Sort
    topics.sort((a, b) => {
      if (sortOrder === 'latest') {
        return new Date(b.lastReplyAt).getTime() - new Date(a.lastReplyAt).getTime();
      }
      // 'popular' sort logic (e.g., by viewCount or replyCount)
      return b.viewCount - a.viewCount;
    });

    // BuddyBoss-inspired: Sticky topics always appear first
    const stickyTopics = topics.filter(t => t.isSuperSticky || t.isSticky);
    const nonStickyTopics = topics.filter(t => !t.isSuperSticky && !t.isSticky);

    // Super Sticky first, then Sticky, then non-sticky
    stickyTopics.sort((a, b) => {
      if (a.isSuperSticky && !b.isSuperSticky) return -1;
      if (!a.isSuperSticky && b.isSuperSticky) return 1;
      return 0; // Maintain original sort order within sticky/super sticky groups
    });

    return [...stickyTopics, ...nonStickyTopics];
  }, [forumState.topics, activeCategory, sortOrder, searchTerm]);

  // --- Interactive Feature Handlers (Mocked) ---

  const handleCategorySelect = useCallback((categoryId: string) => {
    // Toggle active category
    setActiveCategory(prev => (prev === categoryId ? null : categoryId));
  }, []);

  const handleNewTopic = useCallback((title: string, content: string, categoryId: string) => {
    // Mock API call to create new topic
    console.log(`Creating new topic: ${title} in category ${categoryId}`);
    const newTopic: ForumTopic = {
      id: `t-${Date.now()}`,
      categoryId,
      title,
      slug: title.toLowerCase().replace(/\s/g, '-'),
      author: MOCK_USERS['u-1'], // Assume current user is u-1
      content,
      postedAt: new Date().toISOString(),
      lastReplyAt: new Date().toISOString(),
      replyCount: 0,
      viewCount: 1,
      isSticky: false,
      isSuperSticky: false,
      isLocked: false,
      // AI summary would be generated server-side upon creation
    };

    setForumState(prev => ({
      ...prev,
      topics: [newTopic, ...prev.topics],
    }));
  }, []);

  const handleReply = useCallback((topicId: string, content: string) => {
    // Mock API call to post a reply
    console.log(`Posting reply to topic ${topicId}: ${content}`);
    const newReply: ForumReply = {
      id: `r-${Date.now()}`,
      topicId,
      author: MOCK_USERS['u-1'],
      content,
      postedAt: new Date().toISOString(),
      reactions: [],
      // AI analysis would be performed server-side upon creation
    };

    setForumState(prev => {
      const updatedTopics = prev.topics.map(topic =>
        topic.id === topicId
          ? { ...topic, replyCount: topic.replyCount + 1, lastReplyAt: newReply.postedAt }
          : topic
      );
      return {
        ...prev,
        topics: updatedTopics,
        replies: [...prev.replies, newReply],
      };
    });
  }, []);

  const handleReaction = useCallback((replyId: string, reactionType: Reaction['type']) => {
    // Mock API call for reaction/AETH-tip
    console.log(`User reacted with ${reactionType} to reply ${replyId}`);

    setForumState(prev => {
      const updatedReplies = prev.replies.map(reply => {
        if (reply.id === replyId) {
          const existingReactionIndex = reply.reactions.findIndex(r => r.userId === MOCK_USERS['u-1'].id);
          let newReactions = [...reply.reactions];

          if (existingReactionIndex > -1) {
            // User already reacted, remove it or change it
            newReactions.splice(existingReactionIndex, 1);
          } else {
            // Add new reaction
            newReactions.push({
              id: `re-${Date.now()}`,
              userId: MOCK_USERS['u-1'].id,
              type: reactionType,
            });

            // Aetherial DeFi Enhancement: Simulate AETH-tip transaction
            if (reactionType === 'AETH-tip') {
              // In a real app, this would trigger a blockchain transaction and update the tokenReward field
              console.log(`DEFI: Initiating AETH-tip for reply ${replyId}`);
              // This is a simplified, non-persistent update for demonstration
              reply.tokenReward = {
                tokenId: `tx-${Date.now()}`,
                amount: 5, // Small tip amount
                tokenSymbol: 'AETH',
                transactionHash: '0x' + Math.random().toString(16).substring(2, 10),
              };
            }
          }
          return { ...reply, reactions: newReactions };
        }
        return reply;
      });

      return { ...prev, replies: updatedReplies };
    });
  }, []);

  // --- Render Helpers ---

  const renderCategoryList = () => (
    <div className="forum-categories">
      <h3>Categories</h3>
      <ul className="category-list">
        {forumState.categories.map(cat => (
          <li
            key={cat.id}
            className={`category-item ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => handleCategorySelect(cat.id)}
          >
            <span className="category-name">{cat.name}</span>
            <span className="topic-count">{cat.topicCount} Topics</span>
          </li>
        ))}
      </ul>
    </div>
  );

  const renderTopicHeader = () => (
    <div className="topic-header">
      <div className="topic-title-col">Topic</div>
      <div className="topic-stats-col">Replies</div>
      <div className="topic-stats-col">Views</div>
      <div className="topic-last-post-col">Last Post</div>
    </div>
  );

  const renderTopicRow = (topic: ForumTopic) => {
    // Find the last poster (either the topic author or the author of the latest reply)
    const topicReplies = forumState.replies.filter(r => r.topicId === topic.id);
    const lastReply = topicReplies.reduce((latest, current) => {
        return new Date(current.postedAt) > new Date(latest.postedAt) ? current : latest;
    }, { postedAt: topic.postedAt, author: topic.author } as any); // Fallback to topic author

    const lastPoster = lastReply.author.username;

    return (
      <div key={topic.id} className={`topic-row ${topic.isSuperSticky ? 'super-sticky' : topic.isSticky ? 'sticky' : ''}`}>
        <div className="topic-title-col">
          {/* BuddyBoss-inspired Sticky/Super Sticky indicators */}
          {topic.isSuperSticky && <span className="tag super-sticky-tag">SUPER STICKY</span>}
          {topic.isSticky && !topic.isSuperSticky && <span className="tag sticky-tag">STICKY</span>}
          <a href={`/forums/topic/${topic.slug}`}>{topic.title}</a>
          <div className="topic-meta">
            Started by: <span className="author-name">{topic.author.username}</span>
            {topic.aiSummary && (
              // AI Enhancement: Quick summary on hover/click
              <span className="ai-summary-tag" title={topic.aiSummary}>AI Summary</span>
            )}
          </div>
        </div>
        <div className="topic-stats-col">{topic.replyCount}</div>
        <div className="topic-stats-col">{topic.viewCount}</div>
        <div className="topic-last-post-col">
          {lastPoster}
          <span className="time-ago">{new Date(topic.lastReplyAt).toLocaleDateString()}</span>
        </div>
      </div>
    );
  };

  const renderTopicList = () => (
    <div className="forum-topics">
      <h2>{activeCategory ? forumState.categories.find(c => c.id === activeCategory)?.name : 'All Discussions'}</h2>

      {/* Interactive Features: Search, Filter, New Topic Button */}
      <div className="forum-controls">
        <input
          type="text"
          placeholder="Search topics..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value as 'latest' | 'popular')} className="sort-select">
          <option value="latest">Sort by Latest Reply</option>
          <option value="popular">Sort by Popularity</option>
        </select>
        <button onClick={() => handleNewTopic('Mock New Topic', 'Content for a mock new topic.', activeCategory || MOCK_CATEGORIES[0].id)} className="new-topic-btn">
          + New Topic
        </button>
      </div>

      <div className="topic-list-container">
        {renderTopicHeader()}
        {filteredTopics.length > 0 ? (
          filteredTopics.map(renderTopicRow)
        ) : (
          <div className="no-topics">No topics found in this category or matching your search.</div>
        )}
      </div>

      {/* Mock Interaction Section for demonstration of handlers */}
      <div className="mock-reply-section" style={{ marginTop: '20px', padding: '10px', border: '1px dashed #ccc' }}>
        <h4>Mock Interaction Demo (Console Output)</h4>
        <p>Click buttons to see state changes and console logs for mock API calls.</p>
        <button style={{ marginRight: '10px' }} onClick={() => handleReply('t-1', 'This is a test reply to topic 1.')}>
          Post Mock Reply to Topic 1
        </button>
        <button style={{ marginRight: '10px' }} onClick={() => handleReaction('r-1', 'AETH-tip')}>
          Give AETH-tip to Reply 1 (DeFi)
        </button>
        <button onClick={() => handleReaction('r-1', 'heart')}>
          Toggle Heart Reaction on Reply 1
        </button>
      </div>
    </div>
  );

  return (
    <div className="forums-discussions-page">
      {/* Responsive Design: Categories on the side for desktop, collapsible/top for mobile (handled by CSS) */}
      <header className="page-header">
        <h1>Aetherial Forums & Discussions</h1>
      </header>

      <main className="forum-main-content">
        <aside className="forum-sidebar">
          {renderCategoryList()}
        </aside>

        <section className="forum-content-area">
          {renderTopicList()}
        </section>
      </main>

      {/* Moderation Panel Mock (AI Enhancement) */}
      <footer className="moderation-footer">
        <p>
          <span className="mod-status">Moderation Status:</span>
          {/* Check if any reply has been flagged by AI */}
          {forumState.replies.some(r => r.aiAnalysis?.isFlagged)
            ? ' 1+ post flagged by AI for review.'
            : ' All content clear by AI moderation.'}
        </p>
      </footer>
    </div>
  );
};

export default ForumsDiscussions;