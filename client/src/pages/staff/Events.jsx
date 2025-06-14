import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  ClockIcon,
  CalendarIcon,
  DocumentTextIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import api from '../../utils/api';

const Events = () => {
  const navigate = useNavigate();
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [ongoingEvents, setOngoingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [filter, setFilter] = useState('upcoming');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchUpcomingEvents = async () => {
    try {
      const response = await api.get('/events?category=upcoming');
      setUpcomingEvents(response.data);
    } catch (err) {
      console.error('Failed to fetch upcoming events:', err);
    }
  };

  const fetchOngoingEvents = async () => {
    try {
      const response = await api.get('/events?category=ongoing');
      setOngoingEvents(response.data);
    } catch (err) {
      console.error('Failed to fetch ongoing events:', err);
    }
  };

  const fetchPastEvents = async () => {
    try {
      const response = await api.get('/events?category=past');
      setPastEvents(response.data);
    } catch (err) {
      console.error('Failed to fetch past events:', err);
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchUpcomingEvents(),
        fetchOngoingEvents(),
        fetchPastEvents()
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const getFilteredEvents = () => {
    let filteredEvents = [];

    switch (filter) {
      case 'upcoming':
        filteredEvents = upcomingEvents.filter((event) =>
          event.title?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        break;
      case 'ongoing':
        filteredEvents = ongoingEvents.filter((event) =>
          event.title?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        break;
      case 'past':
        filteredEvents = pastEvents.filter((event) =>
          event.title?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        break;
      default:
        filteredEvents = upcomingEvents;
    }

    return filteredEvents;
  };

  const handleEventClick = (eventId) => {
    navigate(`/staff/events/${eventId}`);
  };

  const getTabIcon = (tab) => {
    switch (tab) {
      case 'upcoming':
        return <CalendarIcon className="w-4 h-4" />;
      case 'ongoing':
        return <ClockIcon className="w-4 h-4" />;
      case 'past':
        return <CalendarIcon className="w-4 h-4" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white rounded-2xl p-6 shadow-lg"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Events</h1>
            <p className="text-gray-600">Browse and manage events</p>
          </div>
          <div className="flex-1 max-w-xl relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search events by title, tags, or department..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 bg-gray-50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-2 bg-white rounded-2xl p-2 shadow-lg"
        >
          {['upcoming', 'ongoing', 'past'].map((tab) => (
            <motion.button
              key={tab}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setFilter(tab)}
              className={`px-6 py-3 rounded-xl flex items-center gap-2 transition-all ${
                filter === tab
                  ? 'bg-gradient-to-r from-yellow-500 to-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {getTabIcon(tab)}
              {tab.charAt(0).toUpperCase() + tab.slice(1)} Events
            </motion.button>
          ))}
        </motion.div>

        {/* Events Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {getFilteredEvents().map((event) => (
              <StaffEventCard
                key={event._id}
                event={event}
                onView={() => handleEventClick(event._id)}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty State */}
        {getFilteredEvents().length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-white rounded-2xl shadow-lg"
          >
            <div className="max-w-md mx-auto">
              <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No Events Found
              </h3>
              <p className="text-gray-600">
                {filter === 'upcoming'
                  ? 'No upcoming events at the moment. Check back later!'
                  : filter === 'ongoing'
                  ? 'No ongoing events at the moment. Check back later!'
                  : 'No past events found matching your search criteria.'}
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

const StaffEventCard = ({ event, onView }) => {
  const eventTypeColors = {
    hackathon: 'bg-purple-100 text-purple-800',
    workshop: 'bg-orange-100 text-orange-800',
    seminar: 'bg-blue-100 text-blue-800',
    competition: 'bg-green-100 text-green-800'
  };

  const shortDescription =
    event.description?.length > 100
      ? event.description.slice(0, 100) + '...'
      : event.description;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="relative rounded-2xl overflow-hidden bg-white shadow-lg border border-gray-100 cursor-pointer"
      onClick={onView}
    >
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 to-blue-50 opacity-50" />

      {/* Content */}
      <div className="relative p-6 flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">
              {event.title}
            </h3>
            <span
              className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                eventTypeColors[event.type] || 'bg-gray-100 text-gray-700'
              }`}
            >
              {event.type?.charAt(0).toUpperCase() + event.type?.slice(1) ||
                'Event'}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-6 line-clamp-2">{shortDescription}</p>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-3 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <CalendarIcon className="h-4 w-4 text-yellow-600" />
              <p className="text-sm text-gray-500">Date</p>
            </div>
            <p className="text-sm font-medium text-gray-700">
              {new Date(event.startDate).toLocaleDateString()}
            </p>
          </div>
          <div className="bg-white p-3 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <ClockIcon className="h-4 w-4 text-blue-600" />
              <p className="text-sm text-gray-500">Time</p>
            </div>
            <p className="text-sm font-medium text-gray-700">
              {new Date(event.startDate).toLocaleTimeString()}
            </p>
          </div>
        </div>

        {/* Registration Status */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                event.isRegistrationOpen || event.registrationStatus === 'open'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {event.isRegistrationOpen || event.registrationStatus === 'open'
                ? 'Registration Open'
                : 'Registration Closed'}
            </span>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <DocumentTextIcon className="h-4 w-4" />
              <span>
                Deadline:{' '}
                {event.registrationDeadline
                  ? new Date(event.registrationDeadline).toLocaleDateString()
                  : new Date(event.startDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto">
          <div className="text-sm text-gray-500 mb-2">
            <span>Event Status: {event.eventStatus || 'Upcoming'}</span>
          </div>
          <div className="text-center">
            <span className="text-yellow-600 font-medium">
              Click to view details
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Events;
