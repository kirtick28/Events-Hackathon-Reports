import {
  ArrowUpIcon,
  ArrowDownIcon,
  MinusIcon
} from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';

const trendIcons = {
  up: <ArrowUpIcon className="h-4 w-4 text-green-500" />,
  down: <ArrowDownIcon className="h-4 w-4 text-red-500" />,
  neutral: <MinusIcon className="h-4 w-4 text-yellow-500" />
};

const trendColors = {
  up: 'text-green-600 bg-green-100',
  down: 'text-red-600 bg-red-100',
  neutral: 'text-yellow-600 bg-yellow-100'
};

export const StatsCard = ({ title, value, change, trend, icon }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow"
  >
    <div className="flex justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold mt-1 text-gray-900">{value}</p>
      </div>
      <div className="h-12 w-12 rounded-lg bg-indigo-50 flex items-center justify-center">
        {icon}
      </div>
    </div>
    <div className="mt-4 flex items-center">
      <span
        className={`text-xs font-medium px-2 py-1 rounded-full ${trendColors[trend]}`}
      >
        <div className="flex items-center">
          {trendIcons[trend]}
          <span className="ml-1">{change}</span>
        </div>
      </span>
      <span className="text-xs text-gray-500 ml-2">vs last period</span>
    </div>
  </motion.div>
);

export default StatsCard;
