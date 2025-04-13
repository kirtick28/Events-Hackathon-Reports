import { motion } from 'framer-motion';

export const RecentActivity = ({ activities }) => {
  const getActivityColor = (action) => {
    if (action.includes('added')) return 'bg-blue-100 text-blue-800';
    if (action.includes('updated')) return 'bg-purple-100 text-purple-800';
    if (action.includes('completed')) return 'bg-green-100 text-green-800';
    if (action.includes('registered')) return 'bg-amber-100 text-amber-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <motion.div
          key={activity.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-start pb-4 last:pb-0 border-b border-gray-100 last:border-0"
        >
          <div
            className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${getActivityColor(
              activity.action
            )}`}
          >
            {activity.icon && <activity.icon className="h-4 w-4" />}
          </div>
          <div className="flex-1">
            <div className="flex justify-between">
              <p className="text-sm font-medium text-gray-900">
                {activity.user}
              </p>
              <span className="text-xs text-gray-500">{activity.time}</span>
            </div>
            <p className="text-sm text-gray-600">{activity.action}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default RecentActivity;
