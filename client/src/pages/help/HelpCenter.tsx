/**
 * AETHERIAL Platform - Help Center
 * Complete help system with FAQs, support tickets, knowledge base, documentation
 */

import React, { useState, useEffect } from 'react';
import { unifiedSystemHub } from '../../lib/integration/unified-system-hub';
import './HelpCenter.css';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful: number;
}

interface Ticket {
  id: string;
  subject: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  created: string;
  lastUpdate: string;
}

interface Article {
  id: string;
  title: string;
  category: string;
  views: number;
  rating: number;
}

const FAQ_CATEGORIES = [
  { id: 'getting-started', name: 'Getting Started', icon: '🚀' },
  { id: 'account', name: 'Account & Billing', icon: '👤' },
  { id: 'features', name: 'Features & Tools', icon: '🛠️' },
  { id: 'technical', name: 'Technical Support', icon: '💻' },
  { id: 'security', name: 'Security & Privacy', icon: '🔒' },
  { id: 'api', name: 'API & Integration', icon: '🔌' }
];

export const HelpCenter: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [activeTab, setActiveTab] = useState<'faq' | 'tickets' | 'knowledge' | 'contact'>('faq');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    unifiedSystemHub.publishEvent({
      id: `help-center-init-${Date.now()}`,
      timestamp: new Date(),
      source: 'help-center',
      type: 'help.system.initialized',
      data: {},
      priority: 'high',
      propagate: true,
    });

    // Simulate loading data
    setTimeout(() => {
      setFaqs([
        {
          id: 'faq_1',
          question: 'How do I get started with AETHERIAL Platform?',
          answer: 'To get started, create an account, explore the dashboard, and check out our quick start guide. You can access AI tools, blockchain features, and quantum computing resources from the main menu.',
          category: 'getting-started',
          helpful: 245
        },
        {
          id: 'faq_2',
          question: 'What payment methods do you accept?',
          answer: 'We accept credit cards, PayPal, bank transfers, and cryptocurrency payments including Bitcoin, Ethereum, and other major cryptocurrencies.',
          category: 'account',
          helpful: 189
        },
        {
          id: 'faq_3',
          question: 'How do I integrate the API into my application?',
          answer: 'Visit the Developer Hub to generate API keys, view documentation, and access code examples in multiple programming languages. Our REST and GraphQL APIs are fully documented.',
          category: 'api',
          helpful: 312
        },
        {
          id: 'faq_4',
          question: 'Is my data secure on AETHERIAL Platform?',
          answer: 'Yes, we use end-to-end encryption, blockchain verification, and comply with GDPR, CCPA, and other privacy regulations. Your data is stored securely and never shared without consent.',
          category: 'security',
          helpful: 456
        }
      ]);

      setTickets([
        {
          id: 'ticket_001',
          subject: 'Unable to access quantum computing features',
          status: 'in-progress',
          priority: 'high',
          created: '2025-10-28',
          lastUpdate: '2025-10-28 14:30'
        },
        {
          id: 'ticket_002',
          subject: 'Billing question about subscription',
          status: 'resolved',
          priority: 'medium',
          created: '2025-10-27',
          lastUpdate: '2025-10-28 10:15'
        }
      ]);

      setArticles([
        {
          id: 'article_1',
          title: 'Complete Guide to AI Model Training',
          category: 'Features & Tools',
          views: 5678,
          rating: 4.8
        },
        {
          id: 'article_2',
          title: 'Blockchain Integration Tutorial',
          category: 'API & Integration',
          views: 3456,
          rating: 4.9
        },
        {
          id: 'article_3',
          title: 'Security Best Practices',
          category: 'Security & Privacy',
          views: 4321,
          rating: 4.7
        }
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const handleCreateTicket = () => {
    alert('Create Support Ticket - Opens ticket creation form');
  };

  const filteredFaqs = selectedCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  const searchedFaqs = searchQuery
    ? filteredFaqs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredFaqs;

  if (loading) {
    return (
      <div className="help-center">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading help center...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="help-center">
      <header className="help-header">
        <h1>❓ Help Center</h1>
        <p>Find answers, get support, and learn how to use AETHERIAL Platform</p>
      </header>

      <div className="help-search">
        <input
          type="text"
          placeholder="🔍 Search for help articles, FAQs, or guides..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="help-tabs">
        <button className={`tab ${activeTab === 'faq' ? 'active' : ''}`} onClick={() => setActiveTab('faq')}>FAQs</button>
        <button className={`tab ${activeTab === 'tickets' ? 'active' : ''}`} onClick={() => setActiveTab('tickets')}>Support Tickets</button>
        <button className={`tab ${activeTab === 'knowledge' ? 'active' : ''}`} onClick={() => setActiveTab('knowledge')}>Knowledge Base</button>
        <button className={`tab ${activeTab === 'contact' ? 'active' : ''}`} onClick={() => setActiveTab('contact')}>Contact Us</button>
      </div>

      <div className="help-content">
        {activeTab === 'faq' && (
          <div className="faq-section">
            <div className="faq-categories">
              <button
                className={`category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('all')}
              >
                All Categories
              </button>
              {FAQ_CATEGORIES.map(category => (
                <button
                  key={category.id}
                  className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.icon} {category.name}
                </button>
              ))}
            </div>

            <div className="faq-list">
              <h2>Frequently Asked Questions</h2>
              {searchedFaqs.length > 0 ? (
                searchedFaqs.map(faq => (
                  <div key={faq.id} className="faq-item">
                    <h3 className="faq-question">{faq.question}</h3>
                    <p className="faq-answer">{faq.answer}</p>
                    <div className="faq-footer">
                      <span className="faq-helpful">👍 {faq.helpful} people found this helpful</span>
                      <button className="btn btn-small">Was this helpful?</button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-results">
                  <p>No FAQs found matching your search.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'tickets' && (
          <div className="tickets-section">
            <div className="section-header">
              <h2>My Support Tickets</h2>
              <button className="btn btn-primary" onClick={handleCreateTicket}>+ New Ticket</button>
            </div>
            <div className="tickets-list">
              {tickets.map(ticket => (
                <div key={ticket.id} className="ticket-card">
                  <div className="ticket-header">
                    <h3>{ticket.subject}</h3>
                    <div className="ticket-badges">
                      <span className={`status-badge ${ticket.status}`}>{ticket.status}</span>
                      <span className={`priority-badge ${ticket.priority}`}>{ticket.priority}</span>
                    </div>
                  </div>
                  <div className="ticket-meta">
                    <span>Created: {ticket.created}</span>
                    <span>Last Update: {ticket.lastUpdate}</span>
                    <span>ID: {ticket.id}</span>
                  </div>
                  <button className="btn btn-small">View Details</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'knowledge' && (
          <div className="knowledge-section">
            <h2>Knowledge Base</h2>
            <div className="articles-grid">
              {articles.map(article => (
                <div key={article.id} className="article-card">
                  <h3>{article.title}</h3>
                  <div className="article-category">{article.category}</div>
                  <div className="article-stats">
                    <span>👁️ {article.views.toLocaleString()} views</span>
                    <span>⭐ {article.rating.toFixed(1)} rating</span>
                  </div>
                  <button className="btn btn-small">Read Article</button>
                </div>
              ))}
            </div>

            <div className="popular-topics">
              <h3>Popular Topics</h3>
              <div className="topics-list">
                <div className="topic-item">📚 Getting Started Guide</div>
                <div className="topic-item">🤖 AI Model Training</div>
                <div className="topic-item">⛓️ Blockchain Integration</div>
                <div className="topic-item">⚛️ Quantum Computing Basics</div>
                <div className="topic-item">🔐 Security & Privacy</div>
                <div className="topic-item">💳 Billing & Subscriptions</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="contact-section">
            <h2>Contact Support</h2>
            <div className="contact-methods">
              <div className="contact-card">
                <div className="contact-icon">📧</div>
                <h3>Email Support</h3>
                <p>Get help via email within 24 hours</p>
                <a href="mailto:support@aetherial.com" className="btn">Send Email</a>
              </div>
              <div className="contact-card">
                <div className="contact-icon">💬</div>
                <h3>Live Chat</h3>
                <p>Chat with our support team in real-time</p>
                <button className="btn btn-primary">Start Chat</button>
              </div>
              <div className="contact-card">
                <div className="contact-icon">📞</div>
                <h3>Phone Support</h3>
                <p>Call us for urgent issues</p>
                <a href="tel:+1234567890" className="btn">Call Now</a>
              </div>
            </div>

            <div className="contact-hours">
              <h3>Support Hours</h3>
              <p>Monday - Friday: 9:00 AM - 6:00 PM (EST)</p>
              <p>Saturday - Sunday: 10:00 AM - 4:00 PM (EST)</p>
              <p>24/7 support available for Enterprise customers</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HelpCenter;

