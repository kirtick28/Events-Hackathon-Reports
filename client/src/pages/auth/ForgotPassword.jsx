// src/pages/auth/ForgotPassword.jsx
import { useState } from 'react';
import { MailIcon, ArrowLeftIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import AuthPageLayout from '../../components/auth/AuthPageLayout';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post('/auth/reset-password', { email });
      toast.success(res.data.message, { autoClose: 2000 });
      setTimeout(() => navigate('/login'), 2000);
      setEmail('');
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Something went wrong';
      toast.error(errorMessage, { autoClose: 2000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPageLayout
      title="Forgot Password"
      subtitle="Enter your email to receive a reset link"
      icon={MailIcon}
    >
      <div className="space-y-6">
        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span>Back to Login</span>
        </button>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="block w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-200 bg-gray-50 hover:bg-white"
              placeholder="Enter your email"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 transition-all duration-200"
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>
      </div>
    </AuthPageLayout>
  );
};

export default ForgotPassword;
