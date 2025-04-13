// src/components/auth/LoginForm.jsx
import { useState } from 'react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/auth/login', formData);

      // Only proceed if response is successful
      if (response.status === 200) {
        const userRole = response.data.user.role;

        // Set auth data
        login({
          token: response.data.token,
          user: response.data.user
        });

        // Show toast first
        toast.success(`Welcome back, ${response.data.user.name}!`, {
          autoClose: 1500
        });
        //(
          // 3️⃣ navigate *after* the toast has had time to show
        //   setTimeout(() => {
        //     const redirectPaths = {
        //       superadmin: '/super-admin',
        //       principal: '/principal',
        //       innovation: '/innovation-cell',
        //       hod: '/hod',
        //       staff: '/staff',
        //       student: '/student'
        //     };
        //     navigate(redirectPaths[userRole] || '/login');
        //   }, 1500)
        // );
      }
    } catch (err) {
      // Show error toast and do NOT redirect
      const errorMessage = err.response?.data?.error || 'Login failed';
      toast.error(errorMessage, { autoClose: 1500 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="mt-12 space-y-8" onSubmit={handleSubmit}>
      <div className="space-y-6">
        {/* Email Field */}
        <div className="group">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email address
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="block w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-200 bg-gray-50 hover:bg-white"
            placeholder="Enter your email"
          />
        </div>

        {/* Password Field */}
        <div className="group">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="block w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-200 bg-gray-50 hover:bg-white"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            type="checkbox"
            checked={formData.remember}
            onChange={(e) =>
              setFormData({ ...formData, remember: e.target.checked })
            }
            className="h-4 w-4 rounded border-gray-300 text-yellow-500 focus:ring-yellow-400 transition-colors duration-200"
          />
          <label
            htmlFor="remember-me"
            className="ml-2 block text-sm text-gray-700"
          >
            Remember me
          </label>
        </div>
        <p
          className="text-sm font-medium text-yellow-500 hover:text-yellow-600 transition-colors duration-200 cursor-pointer"
          onClick={() => navigate('/forgot-password')}
        >
          Forgot password?
        </p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-75"
      >
        {loading ? (
          <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          'Sign in'
        )}
      </button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">
            Don't have an account?
          </span>
        </div>
      </div>

      <p className="text-center text-sm text-gray-600">
        Please{' '}
        <a
          href="#"
          className="font-medium text-yellow-500 hover:text-yellow-600 transition-colors duration-200"
        >
          contact admin
        </a>{' '}
        for access
      </p>
    </form>
  );
};

export default LoginForm;
