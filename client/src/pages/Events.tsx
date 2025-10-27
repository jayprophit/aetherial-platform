import { useState } from 'react';
import { Link } from 'react-router-dom';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  endTime: string;
  location: string;
  type: 'virtual' | 'physical' | 'hybrid';
  category: string;
  attendees: number;
  maxAttendees: number;
  image: string;
  organizer: string;
  price: number;
  rsvpStatus?: 'going' | 'interested' | 'not-going';
}

export default function Events() {
  const [view, setView] = useState<'grid' | 'list' | 'calendar'>('grid');
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const events: Event[] = [
    {
      id: '1',
      title: 'AI Workshop: Building the Future',
      description: 'Learn how to build AI applications from scratch with industry experts.',
      date: '2025-10-28',
      time: '14:00',
      endTime: '17:00',
      location: 'Virtual',
      type: 'virtual',
      category: 'Technology',
      attendees: 45,
      maxAttendees: 100,
      image: '',
      organizer: 'Tech Community',
      price: 0,
      rsvpStatus: 'going',
    },
    {
      id: '2',
      title: 'Community Meetup',
      description: 'Connect with fellow platform members and share experiences.',
      date: '2025-10-30',
      time: '18:00',
      endTime: '21:00',
      location: 'San Francisco, CA',
      type: 'physical',
      category: 'Networking',
      attendees: 120,
      maxAttendees: 150,
      image: '',
      organizer: 'Community Team',
      price: 0,
      rsvpStatus: 'interested',
    },
    {
      id: '3',
      title: 'Quantum Computing Webinar',
      description: 'Deep dive into quantum computing principles and applications.',
      date: '2025-11-02',
      time: '10:00',
      endTime: '12:00',
      location: 'Virtual',
      type: 'virtual',
      category: 'Education',
      attendees: 89,
      maxAttendees: 200,
      image: '',
      organizer: 'Quantum Labs',
      price: 29,
    },
    {
      id: '4',
      title: 'Blockchain Summit 2025',
      description: 'Annual blockchain conference with top industry leaders.',
      date: '2025-11-15',
      time: '09:00',
      endTime: '18:00',
      location: 'New York, NY',
      type: 'hybrid',
      category: 'Conference',
      attendees: 450,
      maxAttendees: 500,
      image: '',
      organizer: 'Blockchain Association',
      price: 199,
    },
  ];

  const categories = ['All', 'Technology', 'Networking', 'Education', 'Conference', 'Workshop', 'Social'];
  const eventTypes = ['All', 'Virtual', 'Physical', 'Hybrid'];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || event.category.toLowerCase() === filter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const handleRSVP = (eventId: string, status: 'going' | 'interested' | 'not-going') => {
    console.log(`RSVP for event ${eventId}: ${status}`);
    // TODO: Implement API call
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Events</h1>
            <p className="text-gray-600">Discover and join amazing events</p>
          </div>
          <Link
            to="/events/create"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition font-semibold"
          >
            + Create Event
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Search */}
            <div className="flex-1 min-w-[300px]">
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(cat => (
                <option key={cat} value={cat.toLowerCase()}>{cat}</option>
              ))}
            </select>

            {/* View Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setView('grid')}
                className={`px-4 py-2 rounded-lg transition ${
                  view === 'grid' ? 'bg-white shadow-sm' : 'text-gray-600'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setView('list')}
                className={`px-4 py-2 rounded-lg transition ${
                  view === 'list' ? 'bg-white shadow-sm' : 'text-gray-600'
                }`}
              >
                List
              </button>
              <button
                onClick={() => setView('calendar')}
                className={`px-4 py-2 rounded-lg transition ${
                  view === 'calendar' ? 'bg-white shadow-sm' : 'text-gray-600'
                }`}
              >
                Calendar
              </button>
            </div>
          </div>
        </div>

        {/* Events Grid View */}
        {view === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition">
                {/* Event Image */}
                <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-6xl">
                  📅
                </div>

                {/* Event Content */}
                <div className="p-6">
                  {/* Type Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      event.type === 'virtual' ? 'bg-blue-100 text-blue-700' :
                      event.type === 'physical' ? 'bg-green-100 text-green-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                    </span>
                    <span className="text-sm text-gray-600">{event.category}</span>
                  </div>

                  <h3 className="text-xl font-bold mb-2 text-gray-900">{event.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>

                  {/* Event Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">📅</span>
                      {new Date(event.date).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">🕐</span>
                      {event.time} - {event.endTime}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">📍</span>
                      {event.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">👥</span>
                      {event.attendees} / {event.maxAttendees} attending
                    </div>
                  </div>

                  {/* Price */}
                  {event.price > 0 ? (
                    <div className="text-2xl font-bold text-blue-600 mb-4">
                      ${event.price}
                    </div>
                  ) : (
                    <div className="text-lg font-semibold text-green-600 mb-4">
                      Free
                    </div>
                  )}

                  {/* RSVP Buttons */}
                  {event.rsvpStatus ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRSVP(event.id, 'going')}
                        className={`flex-1 py-2 rounded-lg font-semibold transition ${
                          event.rsvpStatus === 'going'
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Going
                      </button>
                      <button
                        onClick={() => handleRSVP(event.id, 'interested')}
                        className={`flex-1 py-2 rounded-lg font-semibold transition ${
                          event.rsvpStatus === 'interested'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Interested
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleRSVP(event.id, 'going')}
                      className="w-full py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition"
                    >
                      RSVP Now
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Events List View */}
        {view === 'list' && (
          <div className="space-y-4">
            {filteredEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
                <div className="flex gap-6">
                  {/* Event Image */}
                  <div className="w-48 h-32 flex-shrink-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-4xl">
                    📅
                  </div>

                  {/* Event Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-2xl font-bold text-gray-900">{event.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            event.type === 'virtual' ? 'bg-blue-100 text-blue-700' :
                            event.type === 'physical' ? 'bg-green-100 text-green-700' :
                            'bg-purple-100 text-purple-700'
                          }`}>
                            {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3">{event.description}</p>
                      </div>
                      {event.price > 0 ? (
                        <div className="text-2xl font-bold text-blue-600">${event.price}</div>
                      ) : (
                        <div className="text-lg font-semibold text-green-600">Free</div>
                      )}
                    </div>

                    <div className="grid grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="mr-2">📅</span>
                        {new Date(event.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="mr-2">🕐</span>
                        {event.time}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="mr-2">📍</span>
                        {event.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="mr-2">👥</span>
                        {event.attendees} attending
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleRSVP(event.id, 'going')}
                        className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition"
                      >
                        RSVP
                      </button>
                      <button className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Calendar View */}
        {view === 'calendar' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">October 2025</h2>
                <div className="flex gap-2">
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    Previous
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    Today
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    Next
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center font-semibold text-gray-600 py-2">
                    {day}
                  </div>
                ))}
                {Array.from({ length: 35 }, (_, i) => {
                  const day = i - 2; // Start from day -2 to show previous month
                  const hasEvent = day === 28 || day === 30;
                  return (
                    <div
                      key={i}
                      className={`aspect-square border border-gray-200 rounded-lg p-2 hover:bg-gray-50 cursor-pointer ${
                        day < 1 || day > 31 ? 'bg-gray-50 text-gray-400' : ''
                      } ${hasEvent ? 'bg-blue-50 border-blue-300' : ''}`}
                    >
                      <div className="text-sm font-medium">{day > 0 && day <= 31 ? day : ''}</div>
                      {hasEvent && (
                        <div className="mt-1">
                          <div className="text-xs bg-blue-600 text-white rounded px-1 py-0.5 truncate">
                            Event
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Upcoming Events List */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-bold mb-4">Upcoming Events</h3>
              <div className="space-y-3">
                {filteredEvents.slice(0, 3).map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <div>
                      <div className="font-semibold">{event.title}</div>
                      <div className="text-sm text-gray-600">
                        {new Date(event.date).toLocaleDateString()} at {event.time}
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition">
                      RSVP
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* No Results */}
        {filteredEvents.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilter('all');
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

