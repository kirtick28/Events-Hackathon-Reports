import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tab } from '@headlessui/react';
import { format, parseISO } from 'date-fns';
import { motion } from 'framer-motion';
import api from '../../utils/api';
import placeholderImage from '../../assets/images/event-image.jpg';
import { useAuth } from '../../contexts/AuthContext';

const EventDetails = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.get(`/events/${eventId}?_expand=department`);
        setEvent(response.data);
      } catch (err) {
        console.error('Failed to fetch event:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);

  const formatDate = (date) => format(parseISO(date), 'dd MMM yyyy, h:mm a');

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-2xl overflow-hidden bg-white shadow-lg"
        >
          <img
            src={event.images?.[0] || placeholderImage}
            alt={event.title}
            className="w-full h-96 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">{event.title}</h1>
                <div className="flex items-center gap-4 text-lg mb-4">
                  <span>{formatDate(event.startDate)}</span>
                  <span>•</span>
                  <span>{event.isOnline ? 'Online' : event.location}</span>
                </div>

                {/* Action buttons moved to bottom-left */}
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/staff/events')}
                    className="px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-shadow"
                  >
                    Back to Events
                  </motion.button>
                </div>
              </div>
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  event.status === 'approved'
                    ? 'bg-green-100 text-green-800'
                    : event.status === 'rejected'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {event.status.toUpperCase()}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-6 rounded-2xl shadow-lg"
            >
              <h3 className="font-semibold mb-4">Key Details</h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm text-gray-600">Event Type</dt>
                  <dd className="font-medium">
                    {event.customType ||
                      event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-600">Scope</dt>
                  <dd className="font-medium capitalize">{event.scope}</dd>
                </div>
                {event.department && (
                  <div>
                    <dt className="text-sm text-gray-600">Department</dt>
                    <dd className="font-medium">{event.department.name}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-sm text-gray-600">Team Size</dt>
                  <dd className="font-medium">
                    {event.eligibility.teamSize.min ===
                    event.eligibility.teamSize.max
                      ? event.eligibility.teamSize.min === 1
                        ? 'Solo'
                        : `${event.eligibility.teamSize.min} members`
                      : `${event.eligibility.teamSize.min} - ${event.eligibility.teamSize.max} members`}
                  </dd>
                </div>
                {event.registrationDeadline && (
                  <div>
                    <dt className="text-sm text-gray-600">
                      Registration Deadline
                    </dt>
                    <dd className="font-medium">
                      {formatDate(event.registrationDeadline)}
                    </dd>
                  </div>
                )}
                {event.maxParticipants && (
                  <div>
                    <dt className="text-sm text-gray-600">Max Participants</dt>
                    <dd className="font-medium">{event.maxParticipants}</dd>
                  </div>
                )}
              </dl>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tab.Group>
              <Tab.List className="flex space-x-1 bg-white p-1 rounded-2xl shadow-lg mb-6">
                {[
                  'Overview',
                  'Guidelines',
                  'Schedule',
                  'Prizes',
                  'Contacts'
                ].map((tab) => (
                  <Tab
                    key={tab}
                    className={({ selected }) =>
                      `w-full py-2.5 text-sm font-medium rounded-xl transition ${
                        selected
                          ? 'bg-gradient-to-r from-yellow-500 to-blue-500 text-white shadow-md'
                          : 'text-gray-500 hover:bg-gray-50'
                      }`
                    }
                  >
                    {tab}
                  </Tab>
                ))}
              </Tab.List>

              <Tab.Panels className="mt-2">
                <Tab.Panel className="bg-white p-6 rounded-2xl shadow-lg">
                  <h3 className="text-2xl font-semibold mb-4">
                    Event Overview
                  </h3>
                  <div className="prose max-w-none">
                    <p className="text-gray-700">
                      {event.detailedDescription || event.description}
                    </p>
                  </div>

                  {event.externalLink && (
                    <div className="mt-6">
                      <a
                        href={event.externalLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Official Event Website →
                      </a>
                    </div>
                  )}
                </Tab.Panel>

                <Tab.Panel className="bg-white p-6 rounded-2xl shadow-lg">
                  <div className="space-y-6">
                    {event.rules?.length > 0 ? (
                      <div>
                        <h3 className="text-xl font-semibold mb-3">
                          Rules & Guidelines
                        </h3>
                        <ul className="list-disc pl-6 space-y-2">
                          {event.rules.map((rule, i) => (
                            <li key={i} className="text-gray-700">
                              {rule}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p className="text-gray-500">No guidelines available</p>
                    )}

                    {event.eligibility?.description ? (
                      <div>
                        <h3 className="text-xl font-semibold mb-3">
                          Eligibility Criteria
                        </h3>
                        <p className="text-gray-700">
                          {event.eligibility.description}
                        </p>
                      </div>
                    ) : (
                      <p className="text-gray-500">
                        No eligibility criteria specified
                      </p>
                    )}
                  </div>
                </Tab.Panel>

                <Tab.Panel className="bg-white p-6 rounded-2xl shadow-lg">
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <h4 className="font-medium mb-2">Start Date</h4>
                        <p className="text-gray-600">
                          {formatDate(event.startDate)}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <h4 className="font-medium mb-2">End Date</h4>
                        <p className="text-gray-600">
                          {formatDate(event.endDate)}
                        </p>
                      </div>
                    </div>

                    {event.rounds?.length > 0 && (
                      <div>
                        <h3 className="text-xl font-semibold mb-4">
                          Event Rounds
                        </h3>
                        <div className="space-y-4">
                          {event.rounds.map((round, i) => (
                            <div key={i} className="bg-gray-50 p-4 rounded-xl">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium">{round.title}</h4>
                                <span className="text-sm text-gray-500">
                                  {formatDate(round.startDate)} -{' '}
                                  {formatDate(round.endDate)}
                                </span>
                              </div>
                              <p className="text-gray-600">
                                {round.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Tab.Panel>

                <Tab.Panel className="bg-white p-6 rounded-2xl shadow-lg">
                  {event.prizes?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {event.prizes.map((prize, i) => (
                        <div key={i} className="bg-gray-50 p-4 rounded-xl">
                          <h4 className="font-medium mb-2">{prize.position}</h4>
                          <p className="text-lg text-blue-600 font-semibold mb-2">
                            {prize.reward}
                          </p>
                          {prize.description && (
                            <p className="text-gray-600">{prize.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">
                      No prize information available
                    </p>
                  )}
                </Tab.Panel>

                <Tab.Panel className="bg-white p-6 rounded-2xl shadow-lg">
                  {event.contacts?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {event.contacts.map((contact, i) => (
                        <div key={i} className="bg-gray-50 p-4 rounded-xl">
                          <h4 className="font-medium mb-2">{contact.name}</h4>
                          {contact.role && (
                            <p className="text-gray-600 mb-2">{contact.role}</p>
                          )}
                          <div className="space-y-1">
                            <p className="text-blue-600 hover:underline">
                              <a href={`mailto:${contact.email}`}>
                                {contact.email}
                              </a>
                            </p>
                            {contact.phone && (
                              <p className="text-gray-600">{contact.phone}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">
                      No contact information available
                    </p>
                  )}
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
