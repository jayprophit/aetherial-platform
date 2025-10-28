import React, { useState } from 'react';
import './EventsExperiences.css';

interface Event {
  id: string;
  title: string;
  image: string;
  category: string;
  type: 'event' | 'hotel' | 'restaurant' | 'experience' | 'venue';
  date: string;
  time: string;
  location: string;
  venue: string;
  price: number;
  currency: string;
  rating: number;
  reviews: number;
  featured: boolean;
  tags: string[];
}

const EventsExperiences: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'discover' | 'my-bookings' | 'create'>('discover');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchLocation, setSearchLocation] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', name: 'All', icon: '🌟' },
    { id: 'music', name: 'Music', icon: '🎵' },
    { id: 'nightlife', name: 'Nightlife', icon: '🌃' },
    { id: 'arts', name: 'Arts & Culture', icon: '🎭' },
    { id: 'sports', name: 'Sports', icon: '⚽' },
    { id: 'food', name: 'Food & Drink', icon: '🍽️' },
    { id: 'business', name: 'Business', icon: '💼' },
    { id: 'wellness', name: 'Wellness', icon: '🧘' },
    { id: 'travel', name: 'Travel', icon: '✈️' }
  ];

  const types = [
    { id: 'all', name: 'All Types', icon: '🌐' },
    { id: 'event', name: 'Events', icon: '🎉' },
    { id: 'hotel', name: 'Hotels', icon: '🏨' },
    { id: 'restaurant', name: 'Restaurants', icon: '🍴' },
    { id: 'experience', name: 'Experiences', icon: '🎭' },
    { id: 'venue', name: 'Venues', icon: '🏟️' }
  ];

  const events: Event[] = [
    {
      id: '1',
      title: 'Summer Music Festival 2025',
      image: '🎸',
      category: 'music',
      type: 'event',
      date: '2025-07-15',
      time: '6:00 PM',
      location: 'Los Angeles, CA',
      venue: 'Hollywood Bowl',
      price: 89.99,
      currency: 'USD',
      rating: 4.8,
      reviews: 1234,
      featured: true,
      tags: ['Festival', 'Outdoor', 'Live Music']
    },
    {
      id: '2',
      title: 'Luxury Beach Resort & Spa',
      image: '🏖️',
      category: 'travel',
      type: 'hotel',
      date: '2025-08-01',
      time: 'Check-in 3:00 PM',
      location: 'Miami, FL',
      venue: 'Ocean Drive Resort',
      price: 299.00,
      currency: 'USD',
      rating: 4.9,
      reviews: 856,
      featured: true,
      tags: ['Luxury', 'Beach', 'Spa', '5-Star']
    },
    {
      id: '3',
      title: 'Michelin Star Dining Experience',
      image: '👨‍🍳',
      category: 'food',
      type: 'restaurant',
      date: '2025-06-20',
      time: '7:30 PM',
      location: 'New York, NY',
      venue: 'Le Bernardin',
      price: 195.00,
      currency: 'USD',
      rating: 5.0,
      reviews: 2341,
      featured: true,
      tags: ['Fine Dining', 'Michelin Star', 'French']
    },
    {
      id: '4',
      title: 'NBA Finals Game 7',
      image: '🏀',
      category: 'sports',
      type: 'event',
      date: '2025-06-18',
      time: '8:00 PM',
      location: 'San Francisco, CA',
      venue: 'Chase Center',
      price: 450.00,
      currency: 'USD',
      rating: 4.9,
      reviews: 567,
      featured: true,
      tags: ['Basketball', 'Championship', 'Sports']
    },
    {
      id: '5',
      title: 'Broadway Musical: Hamilton',
      image: '🎭',
      category: 'arts',
      type: 'event',
      date: '2025-07-10',
      time: '8:00 PM',
      location: 'New York, NY',
      venue: 'Richard Rodgers Theatre',
      price: 175.00,
      currency: 'USD',
      rating: 4.9,
      reviews: 3456,
      featured: false,
      tags: ['Broadway', 'Musical', 'Theatre']
    },
    {
      id: '6',
      title: 'Rooftop Cocktail Bar Experience',
      image: '🍸',
      category: 'nightlife',
      type: 'venue',
      date: '2025-06-25',
      time: '9:00 PM',
      location: 'Miami, FL',
      venue: 'Sky Bar Miami',
      price: 45.00,
      currency: 'USD',
      rating: 4.7,
      reviews: 892,
      featured: false,
      tags: ['Rooftop', 'Cocktails', 'Nightlife']
    },
    {
      id: '7',
      title: 'Tech Conference 2025',
      image: '💻',
      category: 'business',
      type: 'event',
      date: '2025-09-15',
      time: '9:00 AM',
      location: 'San Francisco, CA',
      venue: 'Moscone Center',
      price: 599.00,
      currency: 'USD',
      rating: 4.6,
      reviews: 234,
      featured: false,
      tags: ['Technology', 'Conference', 'Networking']
    },
    {
      id: '8',
      title: 'Yoga & Meditation Retreat',
      image: '🧘‍♀️',
      category: 'wellness',
      type: 'experience',
      date: '2025-08-20',
      time: '7:00 AM',
      location: 'Sedona, AZ',
      venue: 'Red Rock Wellness Center',
      price: 350.00,
      currency: 'USD',
      rating: 4.8,
      reviews: 445,
      featured: false,
      tags: ['Wellness', 'Yoga', 'Meditation', 'Retreat']
    }
  ];

  const filteredEvents = events.filter(event => {
    const categoryMatch = selectedCategory === 'all' || event.category === selectedCategory;
    const typeMatch = selectedType === 'all' || event.type === selectedType;
    return categoryMatch && typeMatch;
  });

  return (
    <div className="events-experiences">
      <div className="events-container">
        {/* Header */}
        <div className="events-header">
          <div>
            <h1>Events & Experiences</h1>
            <p>Discover amazing events, hotels, restaurants, and unique experiences</p>
          </div>
          <button className="create-event-btn">➕ Create Event</button>
        </div>

        {/* Search Bar */}
        <div className="events-search-bar">
          <div className="search-input-group">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search events, hotels, restaurants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="location-input-group">
            <span className="location-icon">📍</span>
            <input
              type="text"
              placeholder="Location"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
            />
          </div>
          <button className="search-submit-btn">Search</button>
        </div>

        {/* Category Pills */}
        <div className="category-pills">
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`category-pill ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              <span className="pill-icon">{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>

        {/* Type Filter */}
        <div className="type-filter">
          {types.map(type => (
            <button
              key={type.id}
              className={`type-btn ${selectedType === type.id ? 'active' : ''}`}
              onClick={() => setSelectedType(type.id)}
            >
              <span className="type-icon">{type.icon}</span>
              {type.name}
            </button>
          ))}
        </div>

        {/* Featured Section */}
        <div className="featured-section">
          <h2>✨ Featured Events & Experiences</h2>
          <div className="featured-grid">
            {filteredEvents.filter(e => e.featured).map(event => (
              <div key={event.id} className="featured-card">
                <div className="featured-image">
                  <div className="featured-image-placeholder">{event.image}</div>
                  <div className="featured-badge">⭐ Featured</div>
                </div>
                <div className="featured-content">
                  <div className="event-type-badge">{event.type}</div>
                  <h3>{event.title}</h3>
                  <div className="event-meta">
                    <span>📅 {new Date(event.date).toLocaleDateString()}</span>
                    <span>🕐 {event.time}</span>
                  </div>
                  <div className="event-location">
                    <span>📍 {event.venue}, {event.location}</span>
                  </div>
                  <div className="event-rating">
                    <span className="rating-stars">⭐ {event.rating}</span>
                    <span className="rating-reviews">({event.reviews} reviews)</span>
                  </div>
                  <div className="event-tags">
                    {event.tags.map((tag, idx) => (
                      <span key={idx} className="event-tag">{tag}</span>
                    ))}
                  </div>
                  <div className="event-footer">
                    <div className="event-price">
                      <span className="price-label">From</span>
                      <span className="price-value">${event.price}</span>
                    </div>
                    <button className="book-btn">Book Now</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* All Events Grid */}
        <div className="all-events-section">
          <div className="section-header">
            <h2>All Events & Experiences</h2>
            <div className="view-controls">
              <button className="view-btn active">⊞ Grid</button>
              <button className="view-btn">☰ List</button>
            </div>
          </div>

          <div className="events-grid">
            {filteredEvents.map(event => (
              <div key={event.id} className="event-card">
                <div className="event-image">
                  <div className="event-image-placeholder">{event.image}</div>
                  {event.featured && <div className="featured-tag">⭐</div>}
                </div>
                <div className="event-content">
                  <div className="event-header-info">
                    <span className="event-category">{event.category}</span>
                    <span className="event-type-tag">{event.type}</span>
                  </div>
                  <h4>{event.title}</h4>
                  <div className="event-details">
                    <div className="detail-item">
                      <span>📅</span>
                      <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </div>
                    <div className="detail-item">
                      <span>🕐</span>
                      <span>{event.time}</span>
                    </div>
                  </div>
                  <div className="event-venue-info">
                    <span>📍</span>
                    <span>{event.venue}</span>
                  </div>
                  <div className="event-rating-small">
                    <span>⭐ {event.rating}</span>
                    <span>({event.reviews})</span>
                  </div>
                  <div className="event-card-footer">
                    <div className="event-price-small">
                      <span className="from-text">From</span>
                      <span className="price-amount">${event.price}</span>
                    </div>
                    <button className="quick-book-btn">Book</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions-section">
          <h2>Quick Actions</h2>
          <div className="quick-actions-grid">
            <div className="quick-action-card">
              <div className="action-icon">🎟️</div>
              <h3>My Tickets</h3>
              <p>View and manage your event tickets</p>
              <button className="action-btn">View Tickets</button>
            </div>
            <div className="quick-action-card">
              <div className="action-icon">🏨</div>
              <h3>My Bookings</h3>
              <p>Check your hotel and restaurant reservations</p>
              <button className="action-btn">View Bookings</button>
            </div>
            <div className="quick-action-card">
              <div className="action-icon">❤️</div>
              <h3>Saved</h3>
              <p>Access your saved events and experiences</p>
              <button className="action-btn">View Saved</button>
            </div>
            <div className="quick-action-card">
              <div className="action-icon">🎉</div>
              <h3>Create Event</h3>
              <p>Host your own event or experience</p>
              <button className="action-btn">Get Started</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsExperiences;

