// src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import axios from '../utils/api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        if (token) {
          const res = await axios.get('/auth/profile', {
            headers: { Authorization: `Bearer ${token}` }
          });

          let userData = res.data;

          // Check advisor status for staff users
          if (userData.role === 'staff') {
            try {
              const advisorRes = await axios.get('/staff/is-advisor', {
                headers: { Authorization: `Bearer ${token}` }
              });
              userData.isAdvisor = advisorRes.data.isAdvisor;
            } catch (advisorError) {
              console.error('Failed to check advisor status:', advisorError);
              userData.isAdvisor = false;
            }
          }

          setUser(userData);
        }
      } catch (error) {
        console.error('Auth verification failed:', error);
        logout(); // Clean logout if token invalid
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, [token]);

  const login = ({ token, user }) => {
    localStorage.setItem('token', token);
    setToken(token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  const refreshUser = async () => {
    try {
      if (token) {
        const res = await axios.get('/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });

        let userData = res.data;

        // Check advisor status for staff users
        if (userData.role === 'staff') {
          try {
            const advisorRes = await axios.get('/staff/is-advisor', {
              headers: { Authorization: `Bearer ${token}` }
            });
            userData.isAdvisor = advisorRes.data.isAdvisor;
          } catch (advisorError) {
            console.error('Failed to check advisor status:', advisorError);
            userData.isAdvisor = false;
          }
        }

        setUser(userData);
      }
    } catch (err) {
      console.error('Failed to refresh user:', err);
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, logout, refreshUser, updateUser }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
