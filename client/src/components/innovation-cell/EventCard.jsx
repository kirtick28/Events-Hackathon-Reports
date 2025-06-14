import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import {
  ClockIcon,
  UserGroupIcon,
  CalendarIcon,
  MapPinIcon,
  GlobeAltIcon,
  DocumentTextIcon,
  ArrowRightIcon,
  PencilSquareIcon
} from '@heroicons/react/24/outline';

const EventCard = ({ event, onView, onEdit }) => {
  const { user } = useAuth();
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

  // Check if user can edit the event
  const canEdit =
    user.role === 'innovation' ||
    (user.role !== 'innovation' && user._id === event.createdBy?._id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="relative rounded-2xl overflow-hidden bg-white shadow-lg border border-gray-100"
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
          {canEdit && event.status === 'approved' && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onEdit}
              className="p-2 rounded-full bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <PencilSquareIcon className="h-5 w-5 text-blue-600" />
            </motion.button>
          )}
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
          <div className="bg-white p-3 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              {event.isOnline ? (
                <GlobeAltIcon className="h-4 w-4 text-green-600" />
              ) : (
                <MapPinIcon className="h-4 w-4 text-red-600" />
              )}
              <p className="text-sm text-gray-500">Location</p>
            </div>
            <p className="text-sm font-medium text-gray-700">
              {event.isOnline ? 'Online' : event.location}
            </p>
          </div>
          <div className="bg-white p-3 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <UserGroupIcon className="h-4 w-4 text-purple-600" />
              <p className="text-sm text-gray-500">Registrations</p>
            </div>
            <p className="text-sm font-medium text-gray-700">
              {event.registrationCount || 0}
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
        <div className="mt-auto flex items-center justify-between">
          <div className="text-sm text-gray-500">
            <span>Event Status: {event.eventStatus || 'Upcoming'}</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onView}
            className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-blue-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-shadow"
          >
            View Details
            <ArrowRightIcon className="h-5 w-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;
