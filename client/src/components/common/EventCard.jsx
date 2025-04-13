import { motion } from 'framer-motion';
import {
  ClockIcon,
  UserIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

const EventCard = ({ event }) => {
  const eventTypeStyles = {
    hackathon: 'from-purple-500 to-blue-500',
    workshop: 'from-orange-500 to-amber-500',
    internship: 'from-green-500 to-emerald-500'
  };

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl shadow-lg border border-primary/10 overflow-hidden"
    >
      <div className={`h-32 bg-gradient-to-r ${eventTypeStyles[event.type]}`}>
        <div className="p-4 flex items-center justify-between">
          <span className="text-white font-medium capitalize">
            {event.type}
          </span>
          <div className="flex space-x-2">
            {event.tags?.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-white/20 text-xs text-white rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {event.title}
        </h3>

        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <ClockIcon className="h-5 w-5 text-primary" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center space-x-2">
            <UserIcon className="h-5 w-5 text-primary" />
            <span>{event.participants} Participants</span>
          </div>
          <div className="flex items-center space-x-2">
            <AcademicCapIcon className="h-5 w-5 text-primary" />
            <span>{event.department}</span>
          </div>
        </div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="mt-4 w-full bg-gradient-to-r from-primary to-accent text-white py-2 rounded-xl text-center cursor-pointer"
        >
          Register Now
        </motion.div>

        <div className="mt-4 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <div className="h-2 w-20 bg-primary/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-accent"
                style={{
                  width: `${(event.registered / event.capacity) * 100}%`
                }}
              />
            </div>
            <span className="text-gray-500">
              {event.registered}/{event.capacity}
            </span>
          </div>
          <span className="text-primary font-medium">{event.status}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;
