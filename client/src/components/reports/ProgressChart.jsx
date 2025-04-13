import { motion } from 'framer-motion';

const colorVariants = {
  indigo: {
    bg: 'bg-indigo-100',
    progress: 'bg-indigo-600',
    text: 'text-indigo-700'
  },
  green: {
    bg: 'bg-green-100',
    progress: 'bg-green-600',
    text: 'text-green-700'
  },
  blue: {
    bg: 'bg-blue-100',
    progress: 'bg-blue-600',
    text: 'text-blue-700'
  },
  red: {
    bg: 'bg-red-100',
    progress: 'bg-red-600',
    text: 'text-red-700'
  },
  yellow: {
    bg: 'bg-yellow-100',
    progress: 'bg-yellow-600',
    text: 'text-yellow-700'
  }
};

export const ProgressChart = ({
  title,
  value,
  description,
  color = 'indigo',
  className = ''
}) => {
  const colors = colorVariants[color] || colorVariants.indigo;

  return (
    <motion.div whileHover={{ scale: 1.02 }} className={`${className}`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-gray-700">{title}</h3>
        <span className={`text-xs font-semibold ${colors.text}`}>{value}%</span>
      </div>
      <div className={`h-2 w-full rounded-full ${colors.bg} overflow-hidden`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, delay: 0.2 }}
          className={`h-full rounded-full ${colors.progress}`}
        />
      </div>
      <p className="text-xs text-gray-500 mt-2">{description}</p>
    </motion.div>
  );
};

export default ProgressChart;
