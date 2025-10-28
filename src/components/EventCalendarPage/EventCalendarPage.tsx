// EventCalendarPage.tsx

// --- 1. TypeScript Interfaces and Types ---

/**
 * Represents a single event in the calendar.
 */
export interface Event {
  id: string;
  title: string;
  description: string;
  start: Date;
  end: Date;
  category: 'Community' | 'DeFi' | 'AI' | 'Gaming' | 'Webinar';
  location: string;
  isVirtual: boolean;
  ticketPrice: number; // For standard tickets
  nftTicketId?: string; // AETHERIAL Enhancement: NFT Ticket ID for unique access/ownership
  rsvpCount: number;
  maxCapacity: number;
  organizer: string;
  aiSummary?: string; // AETHERIAL Enhancement: AI-generated summary
  blockchainTxHash?: string; // AETHERIAL Enhancement: Blockchain transaction hash for event creation/verification
}

/**
 * Represents the state structure for the Event Calendar Page.
 */
interface CalendarState {
  events: Event[];
  currentView: 'month' | 'week' | 'day' | 'list';
  selectedDate: Date;
  filters: {
    category: string | null;
    isVirtual: boolean | null;
    hasNftTicket: boolean | null;
  };
}

// --- 2. Sample Data (Simulating API Fetch) ---

const TODAY = new Date();
const NEXT_WEEK = new Date(TODAY);
NEXT_WEEK.setDate(TODAY.getDate() + 7);

export const SAMPLE_EVENTS: Event[] = [
  {
    id: 'evt-001',
    title: 'AETHERIAL DeFi Summit 2025',
    description: 'A deep dive into decentralized finance, yield farming, and governance.',
    start: new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate() + 2, 10, 0),
    end: new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate() + 2, 16, 0),
    category: 'DeFi',
    location: 'Virtual Event Hall A',
    isVirtual: true,
    ticketPrice: 0,
    nftTicketId: 'AETH-NFT-1001',
    rsvpCount: 450,
    maxCapacity: 1000,
    organizer: 'AETHERIAL Finance Guild',
    aiSummary: 'Keynote speakers on Layer 2 scaling and cross-chain liquidity. Focus on AETHERIAL\'s new stablecoin protocol.',
    blockchainTxHash: '0xabc123def456...',
  },
  {
    id: 'evt-002',
    title: 'Community Town Hall & Q&A',
    description: 'Open discussion with the core development team about the platform roadmap.',
    start: new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate() + 5, 18, 0),
    end: new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate() + 5, 19, 30),
    category: 'Community',
    location: 'AETHERIAL Discord Stage',
    isVirtual: true,
    ticketPrice: 0,
    rsvpCount: 1200,
    maxCapacity: 5000,
    organizer: 'AETHERIAL Foundation',
  },
  {
    id: 'evt-003',
    title: 'AI-Powered Content Creation Workshop',
    description: 'Learn how to leverage AETHERIAL\'s AI tools for rapid content generation.',
    start: new Date(NEXT_WEEK.getFullYear(), NEXT_WEEK.getMonth(), NEXT_WEEK.getDate() - 1, 14, 0),
    end: new Date(NEXT_WEEK.getFullYear(), NEXT_WEEK.getMonth(), NEXT_WEEK.getDate() - 1, 16, 0),
    category: 'AI',
    location: 'San Francisco Tech Hub',
    isVirtual: false,
    ticketPrice: 99.99,
    rsvpCount: 55,
    maxCapacity: 100,
    organizer: 'AETHERIAL AI Labs',
    aiSummary: 'Hands-on session covering prompt engineering and fine-tuning of generative models within the AETHERIAL ecosystem.',
  },
  {
    id: 'evt-004',
    title: 'Web3 Gaming Alpha Launch Party',
    description: 'Exclusive event for early access to a new blockchain-based game.',
    start: new Date(NEXT_WEEK.getFullYear(), NEXT_WEEK.getMonth(), NEXT_WEEK.getDate() + 3, 20, 0),
    end: new Date(NEXT_WEEK.getFullYear(), NEXT_WEEK.getMonth(), NEXT_WEEK.getDate() + 3, 23, 0),
    category: 'Gaming',
    location: 'Metaverse World: Aetheria',
    isVirtual: true,
    ticketPrice: 0,
    nftTicketId: 'AETH-NFT-2049',
    rsvpCount: 800,
    maxCapacity: 1500,
    organizer: 'AETHERIAL Gaming Guild',
  },
];

// --- 3. Component Implementation (Starts here) ---

import React, { useState, useEffect, useMemo, useCallback } from 'react';
// import './EventCalendarPage.css'; // Assuming a separate CSS file for production

// Helper function to format date
const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Component for a single event card
const EventCard: React.FC<{ event: Event }> = ({ event }) => {
  // Function to handle RSVP/Ticket purchase (placeholder for actual API call)
  const handleAction = (action: 'RSVP' | 'BuyTicket' | 'ViewNFT') => {
    // In a real application, this would trigger a modal or an API call.
    if (action === 'BuyTicket' && event.nftTicketId) {
        alert(`Initiating NFT Ticket purchase for ${event.title}. NFT ID: ${event.nftTicketId}`);
    } else if (action === 'RSVP') {
        alert(`RSVP successful for ${event.title}!`);
    } else {
        alert(`Action: ${action} for ${event.title}`);
    }
  };

  return (
    <div className={`event-card ${event.category.toLowerCase()}`}>
      <div className="event-header">
        <h3>{event.title}</h3>
        <span className="event-category">{event.category}</span>
      </div>
      <p className="event-time">{formatDate(event.start)} - {event.isVirtual ? 'Virtual' : event.location}</p>
      <p className="event-description">{event.description}</p>
      
      {/* AETHERIAL Enhancements Display */}
      <div className="aetherial-features">
        {event.nftTicketId && (
          <span className="feature-tag nft" title="NFT Ticket Required/Available">
            🎫 NFT Ticket
          </span>
        )}
        {event.aiSummary && (
          <span className="feature-tag ai" title={event.aiSummary}>
            🧠 AI Summary
          </span>
        )}
        {event.blockchainTxHash && (
          <span className="feature-tag blockchain" title={`Verified on Blockchain: ${event.blockchainTxHash}`}>
            🔗 Verified
          </span>
        )}
      </div>

      <div className="event-footer">
        <span className="rsvp-count">👥 {event.rsvpCount}/{event.maxCapacity} RSVP'd</span>
        <div className="event-actions">
          {event.nftTicketId ? (
            <button onClick={() => handleAction('BuyTicket')} className="btn-buy-nft">
              Buy NFT Ticket
            </button>
          ) : event.ticketPrice > 0 ? (
            <button onClick={() => handleAction('BuyTicket')} className="btn-buy-ticket">
              Buy Ticket (${event.ticketPrice.toFixed(2)})
            </button>
          ) : (
            <button onClick={() => handleAction('RSVP')} className="btn-rsvp">
              RSVP
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Main component for the Event Calendar Page.
 * Features: Calendar View, Upcoming Events List, Filters, RSVP/Ticket Actions.
 */
const EventCalendarPage: React.FC = () => {
  // State management using useState
  const [state, setState] = useState<CalendarState>({
    events: SAMPLE_EVENTS, // Initialize with sample data
    currentView: 'list', // Default to list view for simplicity
    selectedDate: TODAY,
    filters: {
      category: null,
      isVirtual: null,
      hasNftTicket: null,
    },
  });

  // Effect to simulate fetching data from an API (runs once on mount)
  useEffect(() => {
    // In a production app, this is where you'd fetch data:
    // fetch('/api/events').then(res => res.json()).then(data => setState(prev => ({...prev, events: data})));
    // console.log('Component mounted. Events loaded from SAMPLE_EVENTS.');
  }, []);

  // Memoized list of filtered events
  const filteredEvents = useMemo(() => {
    return state.events.filter(event => {
      const { category, isVirtual, hasNftTicket } = state.filters;
      let matches = true;

      if (category && event.category !== category) {
        matches = false;
      }
      if (isVirtual !== null) {
        matches = matches && event.isVirtual === isVirtual;
      }
      if (hasNftTicket !== null) {
        // Filter for events that either have an NFT ticket or don't
        matches = matches && (hasNftTicket ? !!event.nftTicketId : !event.nftTicketId);
      }

      // Filter by date (e.g., only show events from today onwards)
      matches = matches && event.end.getTime() >= new Date().getTime();

      return matches;
    }).sort((a, b) => a.start.getTime() - b.start.getTime()); // Sort by start time
  }, [state.events, state.filters]);

  // Handler for updating filters
  const handleFilterChange = useCallback((key: keyof CalendarState['filters'], value: any) => {
    setState(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        [key]: value,
      },
    }));
  }, []);
  
  // Handler for changing the calendar view
  const handleViewChange = useCallback((view: CalendarState['currentView']) => {
    setState(prev => ({
      ...prev,
      currentView: view,
    }));
  }, []);

  // Get all unique categories for the filter dropdown
  const allCategories = useMemo(() => {
    const categories = state.events.map(e => e.category);
    return Array.from(new Set(categories)).sort();
  }, [state.events]);


  // Placeholder for a full calendar grid component (e.g., using react-big-calendar)
  const CalendarView: React.FC = () => (
    <div className="calendar-grid-placeholder">
      {/* 
        In a production environment, this would be a full-fledged calendar component
        like 'react-big-calendar' or a custom implementation.
        It would display events based on state.selectedDate and state.currentView.
      */}
      <p>Calendar Grid View ({state.currentView}) Placeholder</p>
      <p>Showing events around: {state.selectedDate.toDateString()}</p>
      <div className="events-on-selected-date">
        {/* Filter events that start or end on the selected date */}
        {filteredEvents.filter(e => 
            e.start.toDateString() === state.selectedDate.toDateString() || e.end.toDateString() === state.selectedDate.toDateString()
        ).map(event => (
            <div key={event.id} className="mini-event-item">
                {event.title} at {event.start.toLocaleTimeString()}
            </div>
        ))}
        {filteredEvents.filter(e => 
            e.start.toDateString() === state.selectedDate.toDateString() || e.end.toDateString() === state.selectedDate.toDateString()
        ).length === 0 && (
            <p>No events on this day matching current filters.</p>
        )}
      </div>
    </div>
  );

  // Upcoming Events List Component
  const UpcomingEventsList: React.FC = () => (
    <div className="upcoming-events-list">
      {filteredEvents.length > 0 ? (
        filteredEvents.map(event => (
          <EventCard key={event.id} event={event} />
        ))
      ) : (
        <p className="no-events-message">No upcoming events match your current filters.</p>
      )}
    </div>
  );

  // The main render function
  return (
    <div className="event-calendar-page">
      <header className="page-header">
        <h1>AETHERIAL Event Calendar</h1>
        <p>Your hub for all community, DeFi, AI, and Gaming events across the platform.</p>
      </header>

      {/* Filters and View Controls */}
      <section className="controls-section">
        <div className="filters-group">
          {/* Category Filter */}
          <label htmlFor="category-filter">Category:</label>
          <select
            id="category-filter"
            value={state.filters.category || ''}
            onChange={(e) => handleFilterChange('category', e.target.value || null)}
          >
            <option value="">All Categories</option>
            {allCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Virtual/Physical Filter */}
          <label htmlFor="virtual-filter">Location:</label>
          <select
            id="virtual-filter"
            value={state.filters.isVirtual === null ? '' : state.filters.isVirtual ? 'virtual' : 'physical'}
            onChange={(e) => handleFilterChange('isVirtual', e.target.value === '' ? null : e.target.value === 'virtual')}
          >
            <option value="">All Locations</option>
            <option value="virtual">Virtual Only</option>
            <option value="physical">Physical Only</option>
          </select>

          {/* NFT Ticket Filter (AETHERIAL Enhancement) */}
          <label htmlFor="nft-filter">Ticket Type:</label>
          <select
            id="nft-filter"
            value={state.filters.hasNftTicket === null ? '' : state.filters.hasNftTicket ? 'nft' : 'standard'}
            onChange={(e) => handleFilterChange('hasNftTicket', e.target.value === '' ? null : e.target.value === 'nft')}
          >
            <option value="">All Tickets</option>
            <option value="nft">NFT Tickets Only</option>
            <option value="standard">Standard/Free Tickets</option>
          </select>
        </div>

        <div className="view-controls">
          <button 
            className={state.currentView === 'list' ? 'active' : ''}
            onClick={() => handleViewChange('list')}
          >
            List View
          </button>
          <button 
            className={state.currentView !== 'list' ? 'active' : ''}
            onClick={() => handleViewChange('month')}
          >
            Calendar View
          </button>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="calendar-main-content">
        {state.currentView === 'list' ? (
          <UpcomingEventsList />
        ) : (
          <CalendarView />
        )}
      </main>

      {/* Responsive Design Note: In a real implementation, CSS media queries 
          would handle layout changes for different screen sizes. For example, 
          the CalendarView might be hidden on mobile, forcing List View. 
          The included <style> block provides basic, responsive styling for demonstration. */}
      <style>{`
        /* Basic CSS for demonstration - Responsive considerations */
        .event-calendar-page {
          padding: 20px;
          font-family: sans-serif;
          max-width: 1200px;
          margin: 0 auto;
        }
        .page-header {
          border-bottom: 2px solid #eee;
          padding-bottom: 15px;
          margin-bottom: 20px;
        }
        .controls-section {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          gap: 15px;
        }
        .filters-group {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          align-items: center;
        }
        .filters-group label {
            font-weight: bold;
        }
        .view-controls button {
          padding: 8px 15px;
          margin-left: 5px;
          cursor: pointer;
          border: 1px solid #ccc;
          background: #f9f9f9;
          border-radius: 4px;
        }
        .view-controls button.active {
          background: #007bff;
          color: white;
          border-color: #007bff;
        }
        
        /* Event Card Styling */
        .upcoming-events-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }
        .event-card {
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          border-left: 5px solid;
          transition: transform 0.2s;
        }
        .event-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }
        .event-card.community { border-left-color: #4CAF50; }
        .event-card.defi { border-left-color: #2196F3; }
        .event-card.ai { border-left-color: #FF9800; }
        .event-card.gaming { border-left-color: #9C27B0; }
        .event-card.webinar { border-left-color: #F44336; }

        .event-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }
        .event-category {
            background: #eee;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.8em;
            font-weight: bold;
        }
        .event-time {
            color: #555;
            font-size: 0.9em;
            margin-bottom: 10px;
        }
        .event-description {
            margin-bottom: 15px;
        }
        .event-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 10px;
            border-top: 1px dashed #eee;
        }
        .rsvp-count {
            font-size: 0.9em;
            color: #777;
        }
        .event-actions button {
            padding: 8px 12px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            transition: background-color 0.2s;
            margin-left: 5px;
        }
        .btn-rsvp {
            background-color: #4CAF50;
            color: white;
        }
        .btn-buy-ticket {
            background-color: #FFC107;
            color: #333;
        }
        .btn-buy-nft {
            background-color: #9C27B0;
            color: white;
        }

        /* AETHERIAL Features Tags */
        .aetherial-features {
            margin-bottom: 15px;
        }
        .feature-tag {
            display: inline-block;
            padding: 3px 8px;
            margin-right: 5px;
            border-radius: 12px;
            font-size: 0.75em;
            font-weight: bold;
            white-space: nowrap;
        }
        .feature-tag.nft { background-color: #9C27B0; color: white; }
        .feature-tag.ai { background-color: #FF9800; color: white; }
        .feature-tag.blockchain { background-color: #2196F3; color: white; }

        /* Calendar View Placeholder */
        .calendar-grid-placeholder {
            border: 1px dashed #ccc;
            padding: 20px;
            text-align: center;
            min-height: 300px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            border-radius: 8px;
        }
        .events-on-selected-date {
            margin-top: 15px;
            text-align: left;
            width: 100%;
            max-width: 400px;
        }
        .mini-event-item {
            background: #eee;
            padding: 5px 10px;
            margin-bottom: 5px;
            border-radius: 4px;
        }
        .no-events-message {
            padding: 20px;
            background: #f0f0f0;
            border-radius: 4px;
            text-align: center;
        }

        /* Media Queries for Responsiveness */
        @media (max-width: 768px) {
            .controls-section {
                flex-direction: column;
                align-items: flex-start;
            }
            .filters-group {
                width: 100%;
                flex-direction: column;
                gap: 10px;
            }
            .filters-group label, .filters-group select {
                width: 100%;
            }
            .upcoming-events-list {
                grid-template-columns: 1fr; /* Single column on small screens */
            }
        }
      `}</style>
    </div>
  );
};

export default EventCalendarPage;
