import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import {
  PlusIcon,
  ClockIcon,
  UserGroupIcon,
  CalendarIcon,
  DocumentTextIcon,
  TrophyIcon,
  TrashIcon,
  PencilSquareIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import api from '../../../utils/api';
import EventCard from '../../../components/innovation-cell/EventCard';
import PendingEventCard from '../../../components/innovation-cell/PendingEventCard';
import PastEventCard from '../../../components/innovation-cell/PastEventCard';
import DraftEventCard from '../../../components/innovation-cell/DraftCard';


const AllEvents = () => {
  const [events, setEvents] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [pendingEvents, setPendingEvents] = useState([]);
  const [rejectedEvents, setRejectedEvents] = useState([]);
  const [filter, setFilter] = useState('ongoing');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events');
      
      setEvents(response.data);
    } catch (err) {
      console.error('Failed to fetch events:', err);
    }
  };
  const basePath = {
    superadmin: '/super-admin',
    principal: '/principal',
    innovation: '/innovation-cell',
    hod: '/hod',
    staff: '/staff',
    student: '/student'
  }[user.role];
  
  const fetchDrafts = async () => {
    
    try {
      const response = await api.get(`/events/drafts/${user._id}`);
      setDrafts(response.data);
    } catch (err) {
      console.error('Failed to fetch drafts:', err);
    }
  };

  const fetchPendingEvents = async () => {
    try {
      const url = user.role === 'innovation' 
        ? '/events?status=pending'
        : `/events?status=pending&createdBy=${user._id}`;
      const response = await api.get(url);
      setPendingEvents(response.data);
    } catch (err) {
      console.error('Failed to fetch pending events:', err);
    }
  };

  const fetchRejectedEvents = async () => {
    try {
      const url = user.role === 'innovation'
        ? '/events?status=rejected'
        : `/events?status=rejected&createdBy=${user._id}`;
      const response = await api.get(url);
      setRejectedEvents(response.data);
    } catch (err) {
      console.error('Failed to fetch rejected events:', err);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchDrafts();
    fetchPendingEvents();
    fetchRejectedEvents();
  }, []);

  useEffect(() => {
    if (filter === 'draft') {
      fetchDrafts();
    } else if (filter === 'pending') {
      fetchPendingEvents();
    } else if (filter === 'rejected') {
      fetchRejectedEvents();
    }
  }, [filter]);

  const handleDeleteDraft = async (eventId) => {
    if (isDeleting) return;
    setIsDeleting(true);

    try {
      await api.delete(`/events/${eventId}`);
      setDrafts(drafts.filter((draft) => draft._id !== eventId));
    } catch (err) {
      console.error('Failed to delete draft:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const getFilteredEvents = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    let filteredEvents = [];

    switch (filter) {
      case 'draft':
        filteredEvents = drafts.filter((draft) => 
          draft.title?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        break;
      case 'pending':
        filteredEvents = pendingEvents.filter((event) =>
          event.title?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        break;
      case 'rejected':
        filteredEvents = rejectedEvents.filter((event) =>
          event.title?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        break;
      case 'ongoing':
        filteredEvents = events.filter((event) => {
          const matchesSearch = event.title
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase());
          const eventStart = new Date(event.startDate);
          return matchesSearch && event.status === 'approved' && eventStart >= today;
        });
        break;
      case 'past':
        filteredEvents = events.filter((event) => {
          const matchesSearch = event.title
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase());
          const eventEnd = new Date(event.endDate);
          return matchesSearch && event.status === 'approved' && eventEnd < today;
        });
        break;
      default:
        filteredEvents = events;
    }

    
    return filteredEvents;
  };

  const getTabIcon = (tab) => {
    switch (tab) {
      case 'ongoing':
        return <ClockIcon className="w-4 h-4" />;
      case 'draft':
        return <DocumentTextIcon className="w-4 h-4" />;
      case 'pending':
        return <ClockIcon className="w-4 h-4" />;
      case 'past':
        return <CalendarIcon className="w-4 h-4" />;
      case 'rejected':
        return <TrophyIcon className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white rounded-2xl p-6 shadow-lg"
        >
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
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(`${basePath}/events/create`)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-blue-500 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-shadow"
          >
            <PlusIcon className="w-5 h-5" />
            Create New Event
          </motion.button>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-2 bg-white rounded-2xl p-2 shadow-lg"
        >
          {['ongoing', 'draft', 'pending', 'past', 'rejected'].map((tab) => (
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
            {getFilteredEvents().map((event) => {
              switch (filter) {
                case 'draft':
                  return (
                    <DraftEventCard
                      key={event._id}
                      event={event}
                      onDelete={() => handleDeleteDraft(event._id)}
                      onEdit={() => navigate(`${basePath}/events/${event._id}/edit`)}
                    />
                  );
                case 'pending':
                  return (
                    <PendingEventCard
                      key={event._id}
                      event={event}
                      onView={() => navigate(`${basePath}/events/${event._id}`)}
                    />
                  );
                case 'past':
                  return (
                    <PastEventCard
                      key={event._id}
                      event={event}
                      onView={() => navigate(`${basePath}/events/${event._id}`)}
                    />
                  );
                default:
                  return (
                    <EventCard
                      key={event._id}
                      event={event}
                      onView={() => navigate(`${basePath}/events/${event._id}`)}
                      onEdit={() => navigate(`${basePath}/events/${event._id}/edit`)}
                    />
                  );
              }
            })}
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
                {filter === 'draft'
                  ? 'No Draft Events'
                  : 'No Events Found'}
              </h3>
              <p className="text-gray-600">
                {filter === 'draft'
                  ? 'Create a new event draft to get started!'
                  : 'Try adjusting your search or filter criteria'}
              </p>
              {filter === 'draft' && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(`${basePath}/events/create`)}
                  className="mt-4 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-blue-500 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-shadow mx-auto"
                >
                  <PlusIcon className="w-5 h-5" />
                  Create New Event
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AllEvents;
