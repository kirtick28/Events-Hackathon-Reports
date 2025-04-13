import { motion } from 'framer-motion';
import {
  ClockIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

const PendingEventCard = ({ event, onView }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="relative rounded-2xl overflow-hidden bg-white shadow-lg border border-gray-100"
    >
      {/* Status Banner */}
      <div className="bg-yellow-100 p-4 flex items-center gap-2">
        <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600" />
        <span className="font-medium text-yellow-700">Pending Approval</span>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col h-full">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-2xl font-bold text-gray-800 mb-1">
            {event.title}
          </h3>
          <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-yellow-100 to-blue-100 text-gray-700">
            Under Review
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-6 line-clamp-3">
          {event.description}
        </p>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-3 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <CalendarIcon className="h-4 w-4 text-yellow-600" />
              <p className="text-sm text-gray-500">Submitted On</p>
            </div>
            <p className="text-sm font-medium text-gray-700">
              {new Date(event.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="bg-white p-3 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <ClockIcon className="h-4 w-4 text-blue-600" />
              <p className="text-sm text-gray-500">Status</p>
            </div>
            <p className="text-sm font-medium text-gray-700">
              Awaiting Review
            </p>
          </div>
        </div>

        {/* Action Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onView}
          className="w-full py-3 px-4 bg-gradient-to-r from-yellow-500 to-blue-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-shadow"
        >
          Review Request
          <ArrowRightIcon className="h-5 w-5" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default PendingEventCard;
