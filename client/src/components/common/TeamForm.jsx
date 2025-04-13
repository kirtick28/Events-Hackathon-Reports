import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const TeamForm = ({ events, onSubmit }) => {
  const [formData, setFormData] = useState({
    teamName: '',
    selectedEvent: '',
    members: []
  });

  const [searchQuery, setSearchQuery] = useState('');

  const handleAddMember = (member) => {
    if (formData.members.length < 5) {
      setFormData({ ...formData, members: [...formData.members, member] });
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
      className="bg-white rounded-2xl shadow-xl p-8 border border-primary/10"
    >
      <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-6">
        <UserGroupIcon className="h-8 w-8 inline-block mr-2" />
        Create New Team
      </h2>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Team Name
          </label>
          <input
            type="text"
            className="w-full rounded-xl border-primary/30 focus:ring-2 focus:ring-primary/50 px-4 py-3 transition-all"
            value={formData.teamName}
            onChange={(e) =>
              setFormData({ ...formData, teamName: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Event
          </label>
          <select
            className="w-full rounded-xl border-primary/30 focus:ring-2 focus:ring-primary/50 px-4 py-3 transition-all"
            value={formData.selectedEvent}
            onChange={(e) =>
              setFormData({ ...formData, selectedEvent: e.target.value })
            }
          >
            <option value="">Choose an event</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add Members
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search students..."
              className="w-full rounded-xl border-primary/30 focus:ring-2 focus:ring-primary/50 px-4 py-3 pr-10 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <UserIcon className="h-5 w-5 text-gray-400 absolute right-3 top-3.5" />
          </div>

          <motion.div layout className="mt-4 space-y-2">
            {/* Search results would go here */}
            {[].map((member) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-between p-3 bg-primary/5 rounded-xl"
              >
                <span>{member.name}</span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  className="px-3 py-1 bg-primary text-white rounded-lg text-sm"
                  onClick={() => handleAddMember(member)}
                >
                  Add
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-primary to-accent text-white py-3 rounded-xl font-medium"
          onClick={() => onSubmit(formData)}
        >
          Create Team
        </motion.button>
      </div>
    </motion.div>
  );
};

export default TeamForm;
