import { useState, useEffect } from 'react';
import axios from '../utils/api';
import { useAuth } from './useAuth';

export const useEvents = () => {
  const { token } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = async () => {
    try {
      const res = await axios.get('/events', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvents(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchEvents();
  }, [token]);

  return { events, loading, error, refetch: fetchEvents };
};
