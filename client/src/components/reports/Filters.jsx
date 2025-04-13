import { motion } from 'framer-motion';

const ReportFilters = ({ onFilterChange }) => {
  const filters = [
    {
      id: 'time',
      label: 'Time Range',
      options: ['Last Week', 'Last Month', 'Last Year']
    },
    {
      id: 'type',
      label: 'Event Type',
      options: ['All', 'Hackathon', 'Workshop', 'Internship']
    },
    { id: 'dept', label: 'Department', options: ['All', 'CSE', 'ECE', 'ME'] }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
    >
      {filters.map((filter) => (
        <div
          key={filter.id}
          className="bg-white/90 backdrop-blur-lg p-4 rounded-xl shadow-lg border border-primary/10"
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {filter.label}
          </label>
          <select
            onChange={(e) => onFilterChange(filter.id, e.target.value)}
            className="w-full rounded-xl border-primary/30 focus:ring-2 focus:ring-primary/50 px-4 py-2 transition-all"
          >
            {filter.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      ))}
    </motion.div>
  );
};

export default ReportFilters;
