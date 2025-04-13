import { motion } from 'framer-motion';
import { TrashIcon, PencilSquareIcon } from '@heroicons/react/24/outline';

const DraftEventCard = ({ event, onDelete, onEdit }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -5 }}
    className="relative rounded-2xl overflow-hidden bg-white shadow-lg border border-gray-100"
  >
    {/* Gradient Background */}
    <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-blue-50 opacity-50" />
    
    {/* Content */}
    <div className="relative p-6 flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-1">
            {event.title}
          </h3>
          <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-gray-100 to-blue-100 text-gray-700">
            Draft
          </span>
        </div>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onDelete}
            className="p-2 rounded-full bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <TrashIcon className="h-5 w-5 text-red-600" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onEdit}
            className="p-2 rounded-full bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <PencilSquareIcon className="h-5 w-5 text-blue-600" />
          </motion.button>
        </div>
      </div>

      {/* Last Updated */}
      <div className="mb-6">
        <div className="bg-white p-3 rounded-xl shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Last Updated</p>
          <p className="text-lg font-semibold text-gray-700">
            {new Date(event.updatedAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Action Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onEdit}
        className="w-full py-3 px-4 bg-gradient-to-r from-gray-500 to-blue-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-shadow"
      >
        Continue Editing
        <PencilSquareIcon className="h-5 w-5" />
      </motion.button>
    </div>
  </motion.div>
);

export default DraftEventCard;
