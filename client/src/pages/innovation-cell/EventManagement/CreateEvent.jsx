import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext'; // 假设您有一个 AuthContext
import {
  ArrowLeftIcon,
  CalendarIcon,
  ClockIcon,
  UserGroupIcon,
  LinkIcon,
  DocumentTextIcon,
  TrophyIcon,
  TrashIcon,
  PlusIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import api from '../../../utils/api';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-toastify';
import Select from 'react-select';

const CreateEvent = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth(); 
  const [isLoading, setIsLoading] = useState(!!eventId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [departments, setDepartments] = useState([]);
  const basePath = {
    superadmin: '/super-admin',
    principal: '/principal',
    innovation: '/innovation-cell',
    hod: '/hod',
    staff: '/staff',
    student: '/student'
  }[user.role];

  const [event, setEvent] = useState({
    title: '',
    type: 'hackathon',
    customType: '',
    scope: 'college',
    department: '',
    requiresMentor: false,
    eligibility: {
      teamSize: { min: 1, max: 1 },
      departments: [],
      years: [],
      description: ''
    },
    description: '',
    detailedDescription: '',
    startDate: new Date(),
    endDate: new Date(Date.now() + 86400000),
    registrationDeadline: new Date(),
    location: '',
    isOnline: false,
    onlineLink: '',
    externalLink: '',
    rounds: [],
    rules: [''],
    prizes: [{ position: '1st', reward: '', description: '' }],
    contacts: [{ name: '', email: '', phone: '', role: 'Coordinator' }],
    tags: [],
    maxParticipants: 100,
    status: 'draft',
    images: []
  });

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await api.get('/departments/dropdown');
        setDepartments(
          response.data.map((d) => ({
            value: d.id,
            label: d.name,
            title: d.name
          }))
        );
      } catch (err) {
        toast.error('Failed to load departments');
      }
    };

    const fetchEvent = async () => {
      if (!eventId) return;
      try {
        const response = await api.get(`/events/${eventId}`);
        const eventData = response.data;

        // Convert date strings to Date objects
        const dateFields = ['startDate', 'endDate', 'registrationDeadline'];
        dateFields.forEach((field) => {
          eventData[field] = new Date(eventData[field]);
        });

        // Convert rounds dates
        eventData.rounds = eventData.rounds.map((round) => ({
          ...round,
          startDate: new Date(round.startDate),
          endDate: new Date(round.endDate)
        }));

        // Ensure eligibility.departments are valid
        const validDepartments = eventData.eligibility.departments.filter(
          (d) => d && typeof d === 'object' && d.value
        );

        setEvent({
          ...eventData,
          eligibility: {
            ...eventData.eligibility,
            departments: validDepartments
          }
        });
      } catch (err) {
        toast.error('Failed to load event');
        navigate(`${basePath}/events`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDepartments();
    if (eventId) fetchEvent();
  }, [eventId, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEvent((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNestedChange = (parent, field, value) => {
    setEvent((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const handleArrayChange = (arrayName, index, field, value) => {
    setEvent((prev) => ({
      ...prev,
      [arrayName]: prev[arrayName].map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleAddItem = (arrayName, newItem) => {
    setEvent((prev) => ({
      ...prev,
      [arrayName]: [...prev[arrayName], newItem]
    }));
  };

  const handleRemoveItem = (arrayName, index) => {
    setEvent((prev) => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length + event.images.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        setEvent((prev) => ({
          ...prev,
          images: [...prev.images, response.data.url]
        }));
      }
    } catch (err) {
      toast.error('Image upload failed');
      console.error(err);
    }
  };

  const handleSubmit = async (e, status) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if(status !== 'draft'){
        status = user.role === 'innovation' ? 'approved' : 'pending';
      }
      const payload = {
        ...event,
        status,
        department: event.scope === 'department' ? event.department : null,
        eligibility: {
          ...event.eligibility,
          departments: event.eligibility.departments.map((d) => d.value)
        }
      };
      console.log("This is payload: ",payload);
      if (eventId) {
        await api.put(`/events/${eventId}`, payload);
        toast.success('Event updated successfully');
      } else {
        await api.post('/events', payload);
        if(status === 'draft'){
          toast.success('Event saved as draft successfully');
        }
        else{
          toast.success('Event created successfully');
        }
      }

      navigate(`${basePath}/events`);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to save event');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!eventId) return;
    
    if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      try {
        await api.delete(`/events/${eventId}`);
        toast.success('Event deleted successfully');
        navigate(`${basePath}/events`);
      } catch (err) {
        console.error(err);
        toast.error('Failed to delete event');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-yellow-600 hover:text-yellow-700 mr-4"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-1" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {eventId ? 'Edit Event' : 'Create New Event'}
          </h1>
        </div>

        <form onSubmit={(e) => handleSubmit(e, 'pending')} className="space-y-8">
          {/* Basic Information Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={event.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                  required
                  placeholder="Enter event title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Type *
                </label>
                <select
                  name="type"
                  value={event.type}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                  required
                >
                  {[ 
                    'hackathon',
                    'workshop',
                    'internship',
                    'seminar',
                    'webinar',
                    'competition',
                    'conference',
                    'other'
                  ].map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {event.type === 'other' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Custom Type *
                  </label>
                  <input
                    type="text"
                    name="customType"
                    value={event.customType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                    required={event.type === 'other'}
                    placeholder="Specify event type"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Scope *
                </label>
                <select
                  name="scope"
                  value={event.scope}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                  required
                >
                  {[ 
                    'department',
                    'college',
                    'inter-college',
                    'national',
                    'international'
                  ].map((scope) => (
                    <option key={scope} value={scope}>
                      {scope.charAt(0).toUpperCase() +
                        scope.replace('-', ' ').slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {event.scope === 'department' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department *
                  </label>
                  <Select
                    options={departments}
                    value={departments.find(
                      (d) => d.value === event.department
                    )}
                    onChange={(selected) =>
                      setEvent((prev) => ({
                        ...prev,
                        department: selected.value
                      }))
                    }
                    className="basic-single"
                    classNamePrefix="select"
                    isSearchable
                    required
                  />
                </div>
              )}

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="requiresMentor"
                  checked={event.requiresMentor}
                  onChange={handleChange}
                  className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Requires Mentor Assistance
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isOnline"
                  checked={event.isOnline}
                  onChange={handleChange}
                  className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Online Event
                </label>
              </div>

              {!event.isOnline && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={event.location}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                    required={!event.isOnline}
                    placeholder="Enter venue details"
                  />
                </div>
              )}

              {event.isOnline && (
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Online Link *
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      <LinkIcon className="h-4 w-4" />
                    </span>
                    <input
                      type="url"
                      name="onlineLink"
                      value={event.onlineLink}
                      onChange={handleChange}
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-yellow-500 focus:border-yellow-500"
                      required={event.isOnline}
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
              )}

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  External Link
                </label>
                <input
                  type="url"
                  name="externalLink"
                  value={event.externalLink}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="Optional external registration link"
                />
              </div>
            </div>
          </div>

          {/* Date & Time Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">
              Date & Time
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date & Time *
                </label>
                <div className="relative">
                  <DatePicker
                    selected={event.startDate}
                    onChange={(date) => setEvent({ ...event, startDate: date })}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="MMMM d, yyyy h:mm aa"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                  <CalendarIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date & Time *
                </label>
                <div className="relative">
                  <DatePicker
                    selected={event.endDate}
                    onChange={(date) => setEvent({ ...event, endDate: date })}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="MMMM d, yyyy h:mm aa"
                    minDate={event.startDate}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                  <CalendarIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Registration Deadline
                </label>
                <div className="relative">
                  <DatePicker
                    selected={event.registrationDeadline}
                    onChange={(date) =>
                      setEvent({ ...event, registrationDeadline: date })
                    }
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="MMMM d, yyyy h:mm aa"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <ClockIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Participants
                </label>
                <input
                  type="number"
                  name="maxParticipants"
                  value={event.maxParticipants}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="100"
                />
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">
              Description
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Short Description *
                </label>
                <textarea
                  name="description"
                  value={event.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                  required
                  placeholder="Brief description that will appear in event cards"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Detailed Description
                </label>
                <textarea
                  name="detailedDescription"
                  value={event.detailedDescription}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="Full description with all details (supports markdown)"
                />
              </div>
            </div>
          </div>

          {/* Rules Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">
              Event Rules
            </h2>

            <div className="space-y-6">
              {event.rules.map((rule, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-4 rounded-lg space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rule *
                    </label>
                    <input
                      type="text"
                      value={rule}
                      onChange={(e) => {
                        const newRules = [...event.rules];
                        newRules[index] = e.target.value;
                        setEvent({ ...event, rules: newRules });
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      required
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveItem('rules', index)}
                    className="text-red-500 hover:text-red-700 flex items-center text-sm"
                  >
                    <TrashIcon className="h-4 w-4 mr-1" />
                    Remove Rule
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => handleAddItem('rules', '')}
                className="flex items-center text-yellow-600 hover:text-yellow-700 text-sm"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Add Rule
              </button>
            </div>
          </div>

          {/* Prizes Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">
              Event Prizes
            </h2>

            <div className="space-y-6">
              {event.prizes.map((prize, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-4 rounded-lg space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Position *
                      </label>
                      <input
                        type="text"
                        value={prize.position}
                        onChange={(e) =>
                          handleArrayChange(
                            'prizes',
                            index,
                            'position',
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Reward *
                      </label>
                      <input
                        type="text"
                        value={prize.reward}
                        onChange={(e) =>
                          handleArrayChange(
                            'prizes',
                            index,
                            'reward',
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={prize.description}
                      onChange={(e) =>
                        handleArrayChange(
                          'prizes',
                          index,
                          'description',
                          e.target.value
                        )
                      }
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="Additional details about the prize"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveItem('prizes', index)}
                    className="text-red-500 hover:text-red-700 flex items-center text-sm"
                  >
                    <TrashIcon className="h-4 w-4 mr-1" />
                    Remove Prize
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() =>
                  handleAddItem('prizes', {
                    position: '',
                    reward: '',
                    description: ''
                  })
                }
                className="flex items-center text-yellow-600 hover:text-yellow-700 text-sm"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Add Prize
              </button>
            </div>
          </div>

          {/* Contacts Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">
              Contact Information
            </h2>

            <div className="space-y-6">
              {event.contacts.map((contact, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-4 rounded-lg space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name *
                      </label>
                      <input
                        type="text"
                        value={contact.name}
                        onChange={(e) =>
                          handleArrayChange(
                            'contacts',
                            index,
                            'name',
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={contact.email}
                        onChange={(e) =>
                          handleArrayChange(
                            'contacts',
                            index,
                            'email',
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={contact.phone}
                        onChange={(e) =>
                          handleArrayChange(
                            'contacts',
                            index,
                            'phone',
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Role
                      </label>
                      <input
                        type="text"
                        value={contact.role}
                        onChange={(e) =>
                          handleArrayChange(
                            'contacts',
                            index,
                            'role',
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveItem('contacts', index)}
                    className="text-red-500 hover:text-red-700 flex items-center text-sm"
                  >
                    <TrashIcon className="h-4 w-4 mr-1" />
                    Remove Contact
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() =>
                  handleAddItem('contacts', {
                    name: '',
                    email: '',
                    phone: '',
                    role: 'Coordinator'
                  })
                }
                className="flex items-center text-yellow-600 hover:text-yellow-700 text-sm"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Add Contact
              </button>
            </div>
          </div>

          {/* Eligibility Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">
              Eligibility Criteria
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Team Size (Min-Max)
                </label>
                <div className="flex space-x-4">
                  <input
                    type="number"
                    value={event.eligibility.teamSize.min}
                    onChange={(e) =>
                      handleNestedChange('eligibility', 'teamSize', {
                        ...event.eligibility.teamSize,
                        min: parseInt(e.target.value) || 1
                      })
                    }
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="number"
                    value={event.eligibility.teamSize.max}
                    onChange={(e) =>
                      handleNestedChange('eligibility', 'teamSize', {
                        ...event.eligibility.teamSize,
                        max: parseInt(e.target.value) || 1
                      })
                    }
                    min={event.eligibility.teamSize.min}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Allowed Academic Years
                </label>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5].map((year) => (
                    <button
                      key={year}
                      type="button"
                      onClick={() => {
                        const newYears = event.eligibility.years.includes(year)
                          ? event.eligibility.years.filter((y) => y !== year)
                          : [...event.eligibility.years, year];
                        handleNestedChange('eligibility', 'years', newYears);
                      }}
                      className={`px-3 py-1 rounded-full text-sm ${
                        event.eligibility.years.includes(year)
                          ? 'bg-yellow-500 text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      Year {year}
                    </button>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Allowed Departments
                </label>
                <Select
                  isMulti
                  options={departments}
                  value={event.eligibility.departments}
                  onChange={(selected) =>
                    handleNestedChange('eligibility', 'departments', selected)
                  }
                  className="basic-multi-select"
                  classNamePrefix="select"
                  isSearchable
                  placeholder="Select departments..."
                  formatOptionLabel={({ label }) => (
                    <span className="truncate" title={label}>
                      {label}
                    </span>
                  )}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Eligibility Criteria
                </label>
                <textarea
                  value={event.eligibility.description}
                  onChange={(e) =>
                    handleNestedChange(
                      'eligibility',
                      'description',
                      e.target.value
                    )
                  }
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Any other eligibility requirements"
                />
              </div>
            </div>
          </div>

          {/* Rounds Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">
              Event Rounds
            </h2>

            <div className="space-y-6">
              {event.rounds.map((round, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-4 rounded-lg space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Round Title *
                      </label>
                      <input
                        type="text"
                        value={round.title}
                        onChange={(e) =>
                          handleArrayChange(
                            'rounds',
                            index,
                            'title',
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description *
                      </label>
                      <input
                        type="text"
                        value={round.description}
                        onChange={(e) =>
                          handleArrayChange(
                            'rounds',
                            index,
                            'description',
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date *
                      </label>
                      <DatePicker
                        selected={round.startDate}
                        onChange={(date) =>
                          handleArrayChange('rounds', index, 'startDate', date)
                        }
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        dateFormat="MMMM d, yyyy h:mm aa"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Date *
                      </label>
                      <DatePicker
                        selected={round.endDate}
                        onChange={(date) =>
                          handleArrayChange('rounds', index, 'endDate', date)
                        }
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        dateFormat="MMMM d, yyyy h:mm aa"
                        minDate={round.startDate}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveItem('rounds', index)}
                    className="text-red-500 hover:text-red-700 flex items-center text-sm"
                  >
                    <TrashIcon className="h-4 w-4 mr-1" />
                    Remove Round
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() =>
                  handleAddItem('rounds', {
                    title: '',
                    description: '',
                    startDate: new Date(),
                    endDate: new Date(Date.now() + 86400000)
                  })
                }
                className="flex items-center text-yellow-600 hover:text-yellow-700 text-sm"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Add Round
              </button>
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">
              Event Images
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Event Images (Max 5)
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100"
                  disabled={event.images.length >= 5}
                />
                <p className="mt-1 text-sm text-gray-500">
                  Recommended size: 1200x630 pixels (16:9 aspect ratio)
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {event.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Event preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveItem('images', index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-between gap-4">
            <div>
              <button
                type="button"
                onClick={() => navigate(`${basePath}/events`)}
                className="flex items-center px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                <XMarkIcon className="h-5 w-5 mr-2" />
                Cancel
              </button>
            </div>
            <div className="flex flex-wrap gap-4">
              {eventId && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex items-center px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  <TrashIcon className="h-5 w-5 mr-2" />
                  Delete Event
                </button>
              )}
              <button
                type="submit"
                onClick={(e) => handleSubmit(e, 'draft')}
                className="flex items-center px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save as Draft'}
              </button>
              <button
                type="submit"
                onClick={(e) => handleSubmit(e, 'pending')}
                className="flex items-center px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                disabled={isSubmitting}
              >
                {eventId ? (
                  <>
                    <CheckIcon className="h-5 w-5 mr-2" />
                    {isSubmitting
                      ? 'Updating...'
                      : user.role === 'innovation'
                        ? 'Update & Publish'
                        : 'Update & Submit for Approval'}
                  </>
                ) : (
                  <>
                    <CheckIcon className="h-5 w-5 mr-2" />
                    {isSubmitting
                      ? 'Creating...'
                      : user.role === 'innovation'
                        ? 'Create & Publish'
                        : 'Create & Submit for Approval'}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;